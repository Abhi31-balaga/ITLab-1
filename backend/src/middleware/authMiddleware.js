const ApiError = require('../utils/apiError');
const env = require('../config/env');

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token !== env.authToken) {
    return next(new ApiError(401, 'Missing or invalid authorization token'));
  }

  req.user = { id: 'admin', role: 'admin' };
  return next();
}

module.exports = {
  requireAuth
};
