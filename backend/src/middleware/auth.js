function getRole(req) {
  return req.user?.role || req.headers['x-user-role'];
}

function requireExaminer(req, res, next) {
  const role = getRole(req);

  if (role !== 'EXAMINER' && role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only examiners or admins can manage exams and questions.' });
  }

  return next();
}

module.exports = { requireExaminer };
