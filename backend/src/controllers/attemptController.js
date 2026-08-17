const attemptService = require('../services/attemptService');

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Internal server error' });
}

async function startAttempt(req, res) {
  try {
    const payload = attemptService.startAttempt({ examId: req.params.examId, user: req.user });
    res.status(201).json(payload);
  } catch (error) {
    sendError(res, error);
  }
}

async function getAttempt(req, res) {
  try {
    res.json(attemptService.getAttempt({ attemptId: req.params.attemptId, user: req.user }));
  } catch (error) {
    sendError(res, error);
  }
}

async function submitAttempt(req, res) {
  try {
    const result = attemptService.submitAttempt({
      attemptId: req.params.attemptId,
      user: req.user,
      answers: req.body.answers,
    });
    res.json({ result });
  } catch (error) {
    sendError(res, error);
  }
}

async function getResult(req, res) {
  try {
    res.json({ result: attemptService.getResult({ attemptId: req.params.attemptId, user: req.user }) });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  startAttempt,
  getAttempt,
  submitAttempt,
  getResult,
};
