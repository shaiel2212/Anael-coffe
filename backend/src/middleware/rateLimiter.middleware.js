const rateLimit = require('express-rate-limit');

const menuLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'ERR_RATE_LIMIT', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'ERR_RATE_LIMIT', message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'ERR_RATE_LIMIT', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { menuLimiter, authLimiter, apiLimiter };
