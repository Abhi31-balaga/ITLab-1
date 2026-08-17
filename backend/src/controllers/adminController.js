const examService = require('../services/examService');

function getSummary(req, res, next) {
  try { res.json({ data: examService.getAdminSummary() }); } catch (err) { next(err); }
}
function getExams(req, res, next) {
  try { res.json({ data: examService.listExams() }); } catch (err) { next(err); }
}

module.exports = { getSummary, getExams };
