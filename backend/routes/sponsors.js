const express = require('express');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/event/:eventId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sponsors WHERE event_id = ?', [req.params.eventId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { event_id, name, logo_url, description, website } = req.body;
    if (!event_id || !name) return res.status(400).json({ error: 'Evento y nombre requeridos' });
    const [result] = await pool.query(
      'INSERT INTO sponsors (event_id, name, logo_url, description, website) VALUES (?, ?, ?, ?, ?)',
      [event_id, name, logo_url || null, description || null, website || null]
    );
    const [sponsor] = await pool.query('SELECT * FROM sponsors WHERE id = ?', [result.insertId]);
    res.status(201).json(sponsor[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    await pool.query('DELETE FROM sponsors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Patrocinador eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
