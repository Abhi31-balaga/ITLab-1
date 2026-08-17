function authenticate(req, res, next) {
  const userId = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!userId || !role) {
    return res.status(401).json({ error: 'Authentication is required' });
  }
  req.user = { id: userId, role };
  return next();
}

module.exports = { authenticate };
