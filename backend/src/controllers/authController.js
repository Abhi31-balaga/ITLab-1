const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EMAIL_FIELD = 'email';
const USERNAME_FIELD = 'username';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return process.env.JWT_SECRET;
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return typeof user.toObject === 'function' ? user.toObject() : user;
}

async function findUser(req, identifier) {
  const finder =
    req.app?.locals?.findUserByEmail ||
    req.app?.locals?.getUserByEmail ||
    req.app?.locals?.userRepository?.findByEmail ||
    req.app?.locals?.userRepository?.getByEmail;

  if (typeof finder !== 'function') {
    throw Object.assign(new Error('No user lookup function is configured'), {
      statusCode: 501,
    });
  }

  return normalizeUser(await finder(identifier));
}

async function verifyPassword(password, user) {
  const storedPassword = user.passwordHash || user.password_hash || user.password;

  if (!storedPassword) {
    return false;
  }

  return bcrypt.compare(password, storedPassword);
}

function publicUser(user) {
  return {
    id: user.id || user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}

async function login(req, res, next) {
  try {
    const { email, username, password } = req.body || {};
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email or username and password are required' });
    }

    const user = await findUser(req, identifier);
    const passwordIsValid = user ? await verifyPassword(password, user) : false;

    if (!user || !passwordIsValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.role) {
      return res.status(403).json({ message: 'Authenticated user does not have an assigned role' });
    }

    const payload = {
      sub: String(user.id || user._id),
      role: user.role,
    };

    if (user[EMAIL_FIELD]) {
      payload.email = user[EMAIL_FIELD];
    }

    if (user[USERNAME_FIELD]) {
      payload.username = user[USERNAME_FIELD];
    }

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
