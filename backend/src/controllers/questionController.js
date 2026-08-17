const store = require('../models/store');

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function validateQuestionPayload(body, partial = false) {
  const errors = [];

  if (!partial || hasOwn(body, 'text')) {
    if (typeof body.text !== 'string' || body.text.trim() === '') {
      errors.push('question text is required');
    }
  }

  if (!partial || hasOwn(body, 'options')) {
    if (!Array.isArray(body.options) || body.options.length !== 4) {
      errors.push('options must contain exactly 4 choices');
    }
  }

  const options = Array.isArray(body.options) ? body.options : undefined;
  const hasCorrectAnswer = hasOwn(body, 'correctAnswer');
  if (!partial || hasCorrectAnswer) {
    const maxIndex = options ? options.length - 1 : 3;
    if (!Number.isInteger(body.correctAnswer) || body.correctAnswer < 0 || body.correctAnswer > maxIndex) {
      errors.push('correctAnswer must be a valid option index');
    }
  }

  if (hasOwn(body, 'marks') && (typeof body.marks !== 'number' || !Number.isFinite(body.marks) || body.marks <= 0)) {
    errors.push('marks must be a positive number');
  }

  return errors;
}

function createQuestion(req, res) {
  const errors = validateQuestionPayload(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const question = store.createQuestion(req.params.examId, {
    text: req.body.text.trim(),
    options: req.body.options,
    correctAnswer: req.body.correctAnswer,
    marks: req.body.marks ?? 1,
  });
  if (!question) return res.status(404).json({ message: 'Exam not found' });

  return res.status(201).json(question);
}

function updateQuestion(req, res) {
  const errors = validateQuestionPayload(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const updates = {};
  if (hasOwn(req.body, 'text')) updates.text = req.body.text.trim();
  if (hasOwn(req.body, 'options')) updates.options = req.body.options;
  if (hasOwn(req.body, 'correctAnswer')) updates.correctAnswer = req.body.correctAnswer;
  if (hasOwn(req.body, 'marks')) updates.marks = req.body.marks;

  const question = store.updateQuestion(req.params.questionId, updates);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  return res.json(question);
}

function deleteQuestion(req, res) {
  const question = store.deleteQuestion(req.params.questionId);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  return res.status(204).send();
}

module.exports = { createQuestion, updateQuestion, deleteQuestion, validateQuestionPayload };
