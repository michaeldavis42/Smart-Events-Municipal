const express = require('express');
const PDFDocument = require('pdfkit');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT COUNT(*) AS total FROM events');
    const [participants] = await pool.query('SELECT COALESCE(SUM(participants), 0) AS total FROM events');

    const [popularEvent] = await pool.query(
      'SELECT name, participants FROM events ORDER BY participants DESC LIMIT 1'
    );

    const [categories] = await pool.query(
      'SELECT category, SUM(participants) AS total FROM events GROUP BY category ORDER BY total DESC LIMIT 1'
    );

    const [allEvents] = await pool.query('SELECT * FROM events ORDER BY date ASC');

    res.json({
      totalEvents: events[0].total,
      totalParticipants: participants[0].total,
      popularEvent: popularEvent[0] || null,
      popularCategory: categories[0] || null,
      events: allEvents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/export/pdf', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM events ORDER BY date ASC');
    const [registrations] = await pool.query(
      'SELECT COUNT(*) AS total FROM registrations'
    );

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=estadisticas-smartevents.pdf');
    doc.pipe(res);

    doc.fontSize(22).font('Helvetica-Bold').text('SmartEvents Municipal', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('Reporte de Estadísticas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, { align: 'right' });
    doc.moveDown(1.5);

    const totalPart = events.reduce((s, e) => s + e.participants, 0);
    doc.fontSize(12).font('Helvetica-Bold').text('Resumen General');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total de eventos: ${events.length}`);
    doc.text(`Total de inscripciones: ${registrations[0].total}`);
    doc.text(`Total de participantes (cupos ocupados): ${totalPart}`);
    doc.moveDown(1.5);

    doc.fontSize(12).font('Helvetica-Bold').text('Eventos');
    doc.moveDown(0.5);

    events.forEach((ev, i) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${i + 1}. ${ev.name}`);
      doc.fontSize(9).font('Helvetica');
      doc.text(`   Fecha: ${new Date(ev.date).toLocaleDateString('es-CL')}`);
      doc.text(`   Ubicación: ${ev.location}`);
      doc.text(`   Categoría: ${ev.category}`);
      doc.text(`   Cupos: ${ev.slots} | Inscritos: ${ev.participants}`);
      doc.text(`   Estado: ${ev.status}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
