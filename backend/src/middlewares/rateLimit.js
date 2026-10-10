const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many requests. Please try again shortly.' }
  }
});

module.exports = { apiLimiter };
