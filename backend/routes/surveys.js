const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { event_id, satisfaction, opinion, suggestion } = req.body;
    if (!event_id || !satisfaction || satisfaction < 1 || satisfaction > 5) {
      return res.status(400).json({ error: 'Satisfacción (1-5) requerida' });
    }
    const [existing] = await pool.query('SELECT id FROM surveys WHERE user_id = ? AND event_id = ?', [req.user.id, event_id]);
    if (existing.length > 0) {
      await pool.query('UPDATE surveys SET satisfaction=?, opinion=?, suggestion=? WHERE user_id=? AND event_id=?',
        [satisfaction, opinion || null, suggestion || null, req.user.id, event_id]);
      return res.json({ message: 'Encuesta actualizada' });
    }
    await pool.query('INSERT INTO surveys (event_id, user_id, satisfaction, opinion, suggestion) VALUES (?, ?, ?, ?, ?)',
      [event_id, req.user.id, satisfaction, opinion || null, suggestion || null]);
    res.status(201).json({ message: 'Encuesta enviada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT AVG(satisfaction) AS avg_satisfaction, COUNT(*) AS total FROM surveys WHERE event_id = ?',
      [req.params.eventId]
    );
    const [opinions] = await pool.query(
      `SELECT s.*, u.name AS user_name FROM surveys s JOIN users u ON s.user_id = u.id WHERE s.event_id = ? ORDER BY s.created_at DESC`,
      [req.params.eventId]
    );
    res.json({ stats: rows[0], opinions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
