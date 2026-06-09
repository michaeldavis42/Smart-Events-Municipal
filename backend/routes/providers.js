const express = require('express');
const { pool } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

const categoryServiceMap = {
  'Musical': ['Música/DJ', 'Sonido e iluminación', 'Catering'],
  'Social': ['Cócteles', 'Helados', 'Catering', 'Fotografía', 'Decoración', 'Animación infantil', 'Música/DJ'],
  'Cultural': ['Fotografía', 'Catering', 'Cócteles', 'Helados'],
  'Deportivo': ['Catering', 'Fotografía', 'Sonido e iluminación'],
  'Educativo': ['Catering', 'Fotografía', 'Animación infantil']
};

function computeProfileCompletion(p) {
  const fields = ['business_name','responsible_name','email','phone','category','description','location','price_range','capacity','availability','social_links','logo_url'];
  const filled = fields.filter(f => p[f] && p[f].toString().trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function computeMatchScore(provider, event) {
  let score = 0;
  const services = categoryServiceMap[event.category] || [];
  if (services.includes(provider.category)) score += 50;
  if (provider.location && event.location) {
    const pl = provider.location.toLowerCase();
    const el = event.location.toLowerCase();
    if (pl.includes(el) || el.includes(pl)) score += 20;
  }
  if (provider.capacity && event.slots) {
    const pc = parseInt(provider.capacity);
    if (!isNaN(pc) && pc >= event.slots) score += 15;
  }
  if (provider.price_range) {
    const pr = provider.price_range.toLowerCase();
    if (pr.includes('bajo') || pr.includes('económico')) score += 5;
    else if (pr.includes('medio')) score += 10;
    else if (pr.includes('alto') || pr.includes('premium')) score += 15;
  }
  return score;
}

router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!rows.length) return res.json({ profile: null, completion: 0 });
    const profile = rows[0];
    const completion = computeProfileCompletion(profile);
    res.json({ profile, completion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/profile', authenticate, async (req, res) => {
  try {
    const { business_name, responsible_name, email, phone, category, description, location, price_range, capacity, availability, social_links, logo_url } = req.body;
    const [existing] = await pool.query('SELECT id FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (existing.length) {
      await pool.query(
        `UPDATE service_providers SET business_name=?, responsible_name=?, email=?, phone=?, category=?, description=?, location=?, price_range=?, capacity=?, availability=?, social_links=?, logo_url=? WHERE user_id=?`,
        [business_name, responsible_name, email, phone, category, description, location, price_range, capacity, availability, social_links, logo_url, req.user.id]
      );
    } else {
      await pool.query(
        `INSERT INTO service_providers (user_id, business_name, responsible_name, email, phone, category, description, location, price_range, capacity, availability, social_links, logo_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [req.user.id, business_name, responsible_name, email, phone, category, description, location, price_range, capacity, availability, social_links, logo_url]
      );
    }
    const [rows] = await pool.query('SELECT * FROM service_providers WHERE user_id = ?', [req.user.id]);
    const profile = rows[0];
    const completion = computeProfileCompletion(profile);
    res.json({ profile, completion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/matches', authenticate, async (req, res) => {
  try {
    const [providers] = await pool.query('SELECT * FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!providers.length) return res.json({ matches: [], completion: 0 });
    const provider = providers[0];
    const completion = computeProfileCompletion(provider);
    if (completion < 100) return res.json({ matches: [], completion, message: 'Completa tu perfil al 100% para ver coincidencias.' });
    const services = categoryServiceMap[provider.category] || [];
    const eventCategories = Object.entries(categoryServiceMap).filter(([_, svc]) => svc.includes(provider.category)).map(([cat]) => cat);
    if (!eventCategories.length) return res.json({ matches: [], completion });
    const placeholders = eventCategories.map(() => '?').join(',');
    const [events] = await pool.query(`SELECT e.*, u.name as organizer_name, u.email as organizer_email FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.category IN (${placeholders}) ORDER BY e.date ASC`, eventCategories);
    const matches = events.map(e => ({ ...e, match_score: computeMatchScore(provider, e) })).sort((a, b) => b.match_score - a.match_score);
    res.json({ matches, completion, total: matches.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/contact', authenticate, async (req, res) => {
  try {
    const { event_id, message } = req.body;
    const [providers] = await pool.query('SELECT id FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!providers.length) return res.status(400).json({ error: 'Debes tener perfil de proveedor.' });
    const [existing] = await pool.query('SELECT id FROM provider_contact_requests WHERE provider_id = ? AND event_id = ?', [providers[0].id, event_id]);
    if (existing.length) return res.status(400).json({ error: 'Ya enviaste una solicitud para este evento.' });
    await pool.query('INSERT INTO provider_contact_requests (provider_id, event_id, message) VALUES (?,?,?)', [providers[0].id, event_id, message || null]);
    res.json({ success: true, message: 'Solicitud enviada. El organizador recibirá tus datos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/contact-requests', authenticate, async (req, res) => {
  try {
    const [providers] = await pool.query('SELECT id FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!providers.length) return res.json({ requests: [] });
    const [requests] = await pool.query(
      `SELECT cr.*, e.name as event_name, e.date as event_date, e.location as event_location FROM provider_contact_requests cr LEFT JOIN events e ON cr.event_id = e.id WHERE cr.provider_id = ? ORDER BY cr.created_at DESC`,
      [providers[0].id]
    );
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [providers] = await pool.query('SELECT * FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!providers.length) return res.json({ has_profile: false });
    const provider = providers[0];
    const completion = computeProfileCompletion(provider);
    const services = Object.entries(categoryServiceMap).filter(([_, svc]) => svc.includes(provider.category)).map(([cat]) => cat);
    let compatible = 0;
    if (completion === 100 && services.length) {
      const placeholders = services.map(() => '?').join(',');
      const [events] = await pool.query(`SELECT COUNT(*) as total FROM events WHERE category IN (${placeholders})`, services);
      compatible = events[0].total;
    }
    const [requests] = await pool.query('SELECT COUNT(*) as total FROM provider_contact_requests WHERE provider_id = ?', [providers[0].id]);
    const [pending] = await pool.query("SELECT COUNT(*) as total FROM provider_contact_requests WHERE provider_id = ? AND status = 'pending'", [providers[0].id]);
    res.json({ has_profile: true, completion, compatible, requests_sent: requests[0].total, pending: pending[0].total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/organizer-info/:eventId', authenticate, async (req, res) => {
  try {
    const [providers] = await pool.query('SELECT id FROM service_providers WHERE user_id = ?', [req.user.id]);
    if (!providers.length) return res.status(400).json({ error: 'No eres proveedor.' });
    const [events] = await pool.query(
      `SELECT e.id, e.name, e.date, u.id as organizer_id, u.name as organizer_name, u.email as organizer_email, up.phone as organizer_phone FROM events e LEFT JOIN users u ON e.created_by = u.id LEFT JOIN user_profiles up ON u.id = up.user_id WHERE e.id = ?`,
      [req.params.eventId]
    );
    if (!events.length) return res.status(404).json({ error: 'Evento no encontrado.' });
    res.json({ event: events[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
