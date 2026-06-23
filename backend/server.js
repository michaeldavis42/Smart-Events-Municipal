const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');

const { initDB } = require('./config/db');
const swaggerSpec = require('./config/swagger');
const { success } = require('./utils/response');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const reviewRoutes = require('./routes/reviews');
const registrationRoutes = require('./routes/registrations');
const statsRoutes = require('./routes/stats');
const aiRoutes = require('./routes/ai');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notifications');
const socialRoutes = require('./routes/social');
const sponsorRoutes = require('./routes/sponsors');
const surveyRoutes = require('./routes/surveys');
const providerRoutes = require('./routes/providers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// API routes
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
app.use('/api/providers', providerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  success(res, { status: 'ok', version: '1.0.0', uptime: process.uptime() });
});

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Global error handler (must be last)
app.use(errorHandler);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`SmartEvents API running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
});
