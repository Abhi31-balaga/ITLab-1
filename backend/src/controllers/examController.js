const store = require('../models/store');

function validateExamPayload(body, partial = false) {
  const errors = [];

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required');
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'durationMinutes')) {
    if (typeof body.durationMinutes !== 'number' || !Number.isFinite(body.durationMinutes) || body.durationMinutes <= 0) {
      errors.push('durationMinutes must be a positive number');
    }
  }

  return errors;
}

function createExam(req, res) {
  const errors = validateExamPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const exam = store.createExam({
    title: req.body.title.trim(),
    durationMinutes: req.body.durationMinutes,
  });

  return res.status(201).json(exam);
}

function updateExam(req, res) {
  const errors = validateExamPayload(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const updates = {};
  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) updates.title = req.body.title.trim();
  if (Object.prototype.hasOwnProperty.call(req.body, 'durationMinutes')) updates.durationMinutes = req.body.durationMinutes;

  const exam = store.updateExam(req.params.examId, updates);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  return res.json(exam);
}

function deleteExam(req, res) {
  const exam = store.deleteExam(req.params.examId);
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  return res.status(204).send();
}

module.exports = { createExam, updateExam, deleteExam, validateExamPayload };
