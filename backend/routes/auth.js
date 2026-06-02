const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { generateToken, authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Nombre y email obligatorios' });
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'El email ya está registrado' });

    let hash = null;
    if (password) hash = await bcrypt.hash(password, 10);

    let roleId = 3;
    if (role === 'organizer') roleId = 2;
    if (role === 'admin') roleId = 1;

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hash, roleId]
    );
    await pool.query('INSERT INTO user_profiles (user_id) VALUES (?)', [result.insertId]);

    const user = { id: result.insertId, name, email, role_name: role || 'user' };
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, name, email, role: role || 'user' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const [rows] = await pool.query(
      `SELECT u.*, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`,
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    if (!user.password) return res.status(401).json({ error: 'Usa Google para iniciar sesión' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { googleId, name, email } = req.body;
    if (!googleId || !email) return res.status(400).json({ error: 'Datos de Google incompletos' });

    let [users] = await pool.query('SELECT u.*, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?', [email]);
    let user;

    if (users.length > 0) {
      user = users[0];
      await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id]);
    } else {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, google_id, password, role_id) VALUES (?, ?, ?, NULL, 3)',
        [name, email, googleId]
      );
      await pool.query('INSERT INTO user_profiles (user_id) VALUES (?)', [result.insertId]);
      user = { id: result.insertId, name, email, role_name: 'user' };
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile (public)
router.get('/profile/:id', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.created_at,
              p.company_name, p.company_description, p.phone, p.website, p.bio, p.avatar_url
       FROM users u JOIN roles r ON u.role_id = r.id
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role,
              p.company_name, p.avatar_url
       FROM users u JOIN roles r ON u.role_id = r.id
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.name LIKE ? OR u.email LIKE ? OR p.company_name LIKE ?
       LIMIT 20`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile (company info + bio)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { company_name, company_description, phone, website, bio, avatar_url } = req.body;
    await pool.query(
      `UPDATE user_profiles SET company_name=?, company_description=?, phone=?, website=?, bio=?, avatar_url=?
       WHERE user_id=?`,
      [company_name || null, company_description || null, phone || null, website || null, bio || null, avatar_url || null, req.user.id]
    );
    res.json({ message: 'Perfil actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Ambas contraseñas requeridas' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Mínimo 6 caracteres' });

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!rows[0].password) return res.status(400).json({ error: 'Cuenta con Google, no puedes cambiar contraseña' });
    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change email
router.put('/email', authenticate, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email ya en uso' });

    await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, req.user.id]);
    res.json({ message: 'Email actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete account
router.delete('/account', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Cuenta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.json({ message: 'Si el email existe, recibirás instrucciones' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);
    await pool.query('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?', [token, expires, rows[0].id]);
    res.json({ message: 'Token generado (modo desarrollo)', resetToken: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token y contraseña requeridos' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Mínimo 6 caracteres' });

    const [rows] = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?', [hash, rows[0].id]);
    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change role (admin only)
router.put('/role/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const roles = { admin: 1, organizer: 2, user: 3 };
    if (!roles[role]) return res.status(400).json({ error: 'Rol inválido' });
    await pool.query('UPDATE users SET role_id = ? WHERE id = ?', [roles[role], req.params.userId]);
    res.json({ message: 'Rol actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Self-assign role (user can request organizer)
router.put('/role', authenticate, async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== 'organizer') return res.status(400).json({ error: 'Solicita rol organizer' });
    await pool.query('UPDATE users SET role_id = 2 WHERE id = ?', [req.user.id]);
    const user = { ...req.user, role: 'organizer' };
    const token = generateToken(user);
    res.json({ message: 'Ahora eres organizador', token, user: { id: req.user.id, name: req.user.name, email: req.user.email, role: 'organizer' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List users (admin)
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
