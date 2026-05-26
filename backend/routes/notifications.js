const express = require('express');
const webpush = require('web-push');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();
const router = express.Router();

const publicKey = process.env.VAPID_PUBLIC_KEY || 'BHW_8R7KkRh_nKq8LFZPxTKl_8fIdcq0JfGZd_8XgJk9QQ5H3Rn3sLVp0K0N7sTzGq0V0W0Y0Q0I0M0c0f0g0h0';
const privateKey = process.env.VAPID_PRIVATE_KEY || 'smartevents_vapid_private_key';

webpush.setVapidDetails(
  'mailto:contacto@smartevents.cl',
  publicKey,
  privateKey
);

router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey });
});

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    await pool.query('UPDATE users SET push_subscription = ? WHERE id = ?', [
      JSON.stringify(req.body),
      req.user.id
    ]);
    res.json({ message: 'Suscripción guardada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/send', authenticate, async (req, res) => {
  try {
    const { title, body, userId } = req.body;
    let users;

    if (userId) {
      const [rows] = await pool.query('SELECT push_subscription FROM users WHERE id = ? AND push_subscription IS NOT NULL', [userId]);
      users = rows;
    } else {
      const [rows] = await pool.query('SELECT push_subscription FROM users WHERE push_subscription IS NOT NULL');
      users = rows;
    }

    const payload = JSON.stringify({ title, body, icon: '/icon.png' });
    let sent = 0;

    for (const user of users) {
      try {
        const sub = JSON.parse(user.push_subscription);
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch { /* skip invalid subs */ }
    }

    res.json({ message: `Notificación enviada a ${sent} usuarios` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
