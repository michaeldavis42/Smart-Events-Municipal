const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/event/:eventId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.eventId]
    );
    const [avg] = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) AS average, COUNT(*) AS total FROM reviews WHERE event_id = ?',
      [req.params.eventId]
    );
    res.json({ reviews: rows, average: avg[0].average, total: avg[0].total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { event_id, rating, comment } = req.body;
    if (!event_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating obligatorio (1-5)' });
    }
    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE user_id = ? AND event_id = ?',
      [req.user.id, event_id]
    );
    if (existing.length > 0) {
      await pool.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND event_id = ?',
        [rating, comment || null, req.user.id, event_id]
      );
      return res.json({ message: 'Reseña actualizada' });
    }
    await pool.query(
      'INSERT INTO reviews (user_id, event_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, event_id, rating, comment || null]
    );
    res.status(201).json({ message: 'Reseña creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
