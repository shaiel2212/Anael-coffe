const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'ERR_VALIDATION',
      message: err.message,
      details: err.errors?.map(e => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'ERR_CONFLICT',
      message: 'A record with this data already exists',
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'ERR001', message: 'Unauthorized' });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'ERR_VALIDATION', message: 'File too large (max 5MB)' });
  }
  if (err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ error: 'ERR_VALIDATION', message: 'Only images (JPEG, PNG, WebP, GIF) are allowed' });
  }

  res.status(err.status || 500).json({
    error: err.code || 'ERR_SERVER',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

const notFound = (req, res) => {
  res.status(404).json({ error: 'ERR_NOT_FOUND', message: `Route ${req.path} not found` });
};

module.exports = { errorHandler, notFound };
