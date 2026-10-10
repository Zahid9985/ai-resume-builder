const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { env } = require('./config/env');
const { apiLimiter } = require('./middlewares/rateLimit');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const resumeRoutes = require('./routes/resumeRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(apiLimiter);

app.use('/api/health', healthRoutes);
app.use('/api/resumes', resumeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
