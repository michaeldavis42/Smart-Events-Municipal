const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const reviewRoutes = require('./routes/reviews');
const registrationRoutes = require('./routes/registrations');
const statsRoutes = require('./routes/stats');
const aiRoutes = require('./routes/ai');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const socialRoutes = require('./routes/social');
const sponsorRoutes = require('./routes/sponsors');
const surveyRoutes = require('./routes/surveys');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/surveys', surveyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SmartEvents API running on http://localhost:${PORT}`);
  });
});
