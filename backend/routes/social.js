const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.name AS user_name, u.email,
              (SELECT COUNT(*) FROM social_likes WHERE post_id = p.id) AS like_count,
              (SELECT COUNT(*) FROM social_comments WHERE post_id = p.id) AS comment_count
       FROM social_posts p JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { event_id, content, image } = req.body;
    if (!content) return res.status(400).json({ error: 'El contenido es obligatorio' });
    const [result] = await pool.query(
      'INSERT INTO social_posts (user_id, event_id, content, image) VALUES (?, ?, ?, ?)',
      [req.user.id, event_id || null, content, image || null]
    );
    const [post] = await pool.query(
      `SELECT p.*, u.name AS user_name, u.email FROM social_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ ...post[0], like_count: 0, comment_count: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM social_posts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Publicación eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Likes
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM social_likes WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM social_likes WHERE user_id = ? AND post_id = ?', [req.user.id, req.params.id]);
      return res.json({ liked: false });
    }
    await pool.query('INSERT INTO social_likes (user_id, post_id) VALUES (?, ?)', [req.user.id, req.params.id]);
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/likes', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name FROM social_likes l JOIN users u ON l.user_id = u.id WHERE l.post_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comments
router.get('/:id/comments', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS user_name FROM social_comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'El comentario es obligatorio' });
    await pool.query('INSERT INTO social_comments (user_id, post_id, content) VALUES (?, ?, ?)', [req.user.id, req.params.id, content]);
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS user_name FROM social_comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.status(201).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
