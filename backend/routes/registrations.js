const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { event_id, participant_name, participant_email } = req.body;
    if (!event_id || !participant_name || !participant_email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    const event = events[0];
    if (event.participants >= event.slots) {
      return res.status(400).json({ error: 'Evento completo' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM registrations WHERE event_id = ? AND participant_email = ?',
      [event_id, participant_email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya te inscribiste a este evento' });
    }

    await pool.query(
      'INSERT INTO registrations (user_id, event_id, participant_name, participant_email) VALUES (?, ?, ?, ?)',
      [req.user ? req.user.id : null, event_id, participant_name, participant_email]
    );

    await pool.query('UPDATE events SET participants = participants + 1 WHERE id = ?', [event_id]);
    res.status(201).json({ message: 'Inscripción realizada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM registrations WHERE event_id = ? ORDER BY registered_at DESC',
      [req.params.eventId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, e.name AS event_name, e.date, e.location
       FROM registrations r JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ? ORDER BY r.registered_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
