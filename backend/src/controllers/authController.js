const env = require('../config/env');
const ApiError = require('../utils/apiError');

function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ApiError(400, 'Username and password are required');
    }

    res.json({
      token: env.authToken,
      user: {
        id: username,
        role: username === 'admin' ? 'admin' : 'student'
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
