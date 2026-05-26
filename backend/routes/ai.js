const express = require('express');
const OpenAI = require('openai');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();
const router = express.Router();

router.get('/analyze', authenticate, async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM events ORDER BY date ASC');
    const [totalReg] = await pool.query('SELECT COUNT(*) AS total FROM registrations');

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        analysis: generateLocalAnalysis(events, totalReg[0].total)
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Eres un analista de eventos municipales. Analiza estos datos y entrega 4 recomendaciones breves:
Eventos: ${JSON.stringify(events)}
Total inscripciones: ${totalReg[0].total}

Formato: 4 líneas con bullet points.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });

    const analysis = completion.choices[0].message.content
      .split('\n')
      .filter(l => l.trim())
      .map(l => l.replace(/^[-*]\s*/, ''));

    res.json({ success: true, analysis });
  } catch (err) {
    res.json({ success: true, analysis: generateLocalAnalysis([], 0) });
  }
});

function generateLocalAnalysis(events, totalReg) {
  const lines = [];
  if (events.length === 0) {
    return ['No hay eventos registrados aún.', 'Crea tu primer evento para ver análisis.', 'Los datos de asistencia aparecerán automáticamente.', 'Usa el panel administrador para gestionar.'];
  }
  const totalPart = events.reduce((s, e) => s + e.participants, 0);
  const cats = {};
  events.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.participants; });
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  const topEvent = events.reduce((a, b) => a.participants > b.participants ? a : b);
  lines.push(`Los eventos de categoría "${topCat?.[0] || 'N/A'}" tienen mayor asistencia con ${topCat?.[1] || 0} participantes.`);
  lines.push(`El evento más exitoso es "${topEvent.name}" con ${topEvent.participants} inscritos.`);
  lines.push(`Total de inscripciones registradas: ${totalReg}. Participantes totales: ${totalPart}.`);
  lines.push(`Mantén una variedad de categorías para atraer diferentes públicos.`);
  return lines;
}

module.exports = router;
