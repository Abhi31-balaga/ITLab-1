const ApiError = require('../utils/apiError');
const env = require('../config/env');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      details: err.details || undefined,
      stack: env.nodeEnv === 'development' ? err.stack : undefined
    }
  });
}

module.exports = {
  notFound,
  errorHandler
};
