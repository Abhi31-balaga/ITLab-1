const examService = require('../services/examService');

function getAttempt(req, res, next) {
  try { res.json({ data: examService.getAttempt(req.params.attemptId) }); } catch (err) { next(err); }
}
function submitAttempt(req, res, next) {
  try { res.json({ data: examService.submitAttempt(req.params.attemptId, req.body.answers) }); } catch (err) { next(err); }
}
function getAttemptResult(req, res, next) {
  try { res.json({ data: examService.getAttemptResult(req.params.attemptId) }); } catch (err) { next(err); }
}

module.exports = { getAttempt, submitAttempt, getAttemptResult };
