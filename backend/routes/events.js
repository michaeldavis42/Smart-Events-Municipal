const express = require('express');
const { pool } = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM events';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('name LIKE ?');
      params.push(`%${search}%`);
    }
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY date ASC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { name, date, location, lat, lng, category, description, slots, image } = req.body;
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'Nombre, fecha y ubicación son obligatorios' });
    }
    const [result] = await pool.query(
      `INSERT INTO events (name, date, location, lat, lng, category, description, slots, image, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Disponible', ?)`,
      [name, date, location, lat || null, lng || null, category || 'General', description || '', slots || 0, image || '', req.user.id]
    );
    const [event] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(event[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin', 'organizer'), async (req, res) => {
  try {
    const { name, date, location, lat, lng, category, description, slots, image, status } = req.body;
    const [existing] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    await pool.query(
      `UPDATE events SET name=?, date=?, location=?, lat=?, lng=?, category=?, description=?, slots=?, image=?, status=? WHERE id=?`,
      [
        name || existing[0].name,
        date || existing[0].date,
        location || existing[0].location,
        lat !== undefined ? lat : existing[0].lat,
        lng !== undefined ? lng : existing[0].lng,
        category || existing[0].category,
        description !== undefined ? description : existing[0].description,
        slots !== undefined ? slots : existing[0].slots,
        image !== undefined ? image : existing[0].image,
        status || existing[0].status,
        req.params.id
      ]
    );
    const [updated] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    await pool.query('DELETE FROM registrations WHERE event_id = ?', [req.params.id]);
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
