const express = require('express');
const { google } = require('googleapis');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();
const router = express.Router();

router.post('/sync', authenticate, async (req, res) => {
  try {
    const { summary, description, location, startDate, endDate } = req.body;

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return res.json({
        success: true,
        googleCalendarLink: buildGoogleCalendarLink(summary, description, location, startDate, endDate),
        message: 'Link de Google Calendar generado (sin API key configurada)'
      });
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary,
      description,
      location,
      start: { dateTime: new Date(startDate).toISOString(), timeZone: 'America/Santiago' },
      end: { dateTime: new Date(endDate || startDate).toISOString(), timeZone: 'America/Santiago' }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    res.json({ success: true, eventUrl: response.data.htmlLink });
  } catch (err) {
    const { summary, description, location, startDate, endDate } = req.body;
    const link = buildGoogleCalendarLink(summary, description, location, startDate, endDate);
    res.json({ success: true, googleCalendarLink: link, message: 'Link generado (fallback)' });
  }
});

function buildGoogleCalendarLink(summary, description, location, startDate, endDate) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: summary || 'Evento SmartEvents',
    details: description || '',
    location: location || '',
    dates: `${formatDate(startDate)}/${formatDate(endDate || startDate)}`
  });
  return `${base}&${params.toString()}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

module.exports = router;
