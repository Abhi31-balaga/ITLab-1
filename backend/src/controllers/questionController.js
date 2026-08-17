const examService = require('../services/examService');

function addQuestion(req, res, next) {
  try { res.status(201).json({ data: examService.addQuestion(req.params.examId, req.body) }); } catch (err) { next(err); }
}
function updateQuestion(req, res, next) {
  try { res.json({ data: examService.updateQuestion(req.params.questionId, req.body) }); } catch (err) { next(err); }
}
function deleteQuestion(req, res, next) {
  try { examService.deleteQuestion(req.params.questionId); res.status(204).send(); } catch (err) { next(err); }
}

module.exports = { addQuestion, updateQuestion, deleteQuestion };
