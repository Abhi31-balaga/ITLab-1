const examService = require('../services/examService');

function listExams(req, res, next) {
  try { res.json({ data: examService.listExams() }); } catch (err) { next(err); }
}
function getExam(req, res, next) {
  try { res.json({ data: examService.getExam(req.params.examId) }); } catch (err) { next(err); }
}
function createExam(req, res, next) {
  try { res.status(201).json({ data: examService.createExam(req.body) }); } catch (err) { next(err); }
}
function updateExam(req, res, next) {
  try { res.json({ data: examService.updateExam(req.params.examId, req.body) }); } catch (err) { next(err); }
}
function deleteExam(req, res, next) {
  try { examService.deleteExam(req.params.examId); res.status(204).send(); } catch (err) { next(err); }
}
function startAttempt(req, res, next) {
  try { res.status(201).json({ data: examService.startAttempt(req.params.examId) }); } catch (err) { next(err); }
}

module.exports = { listExams, getExam, createExam, updateExam, deleteExam, startAttempt };
