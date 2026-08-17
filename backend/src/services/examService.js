const crypto = require('crypto');
const ApiError = require('../utils/apiError');

const exams = new Map();
const questions = new Map();
const attempts = new Map();

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function seedExam() {
  const examId = createId('exam');
  const questionId = createId('question');
  const question = {
    id: questionId,
    examId,
    text: 'What does HTTP status 200 mean?',
    options: ['OK', 'Created', 'Bad Request', 'Unauthorized'],
    answer: 0
  };

  exams.set(examId, {
    id: examId,
    title: 'Sample Web Basics Exam',
    description: 'A small seed exam for local development.',
    questionIds: [questionId]
  });
  questions.set(questionId, question);
}

seedExam();

function publicQuestion(question) {
  const { answer, ...safeQuestion } = question;
  return safeQuestion;
}

function examWithQuestions(exam, includeAnswers = false) {
  const examQuestions = exam.questionIds.map((id) => questions.get(id)).filter(Boolean);
  return {
    ...exam,
    questions: includeAnswers ? examQuestions : examQuestions.map(publicQuestion)
  };
}

function listExams() {
  return Array.from(exams.values()).map((exam) => examWithQuestions(exam));
}

function getExam(examId, includeAnswers = false) {
  const exam = exams.get(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  return examWithQuestions(exam, includeAnswers);
}

function createExam(payload) {
  if (!payload.title) {
    throw new ApiError(400, 'Exam title is required');
  }

  const id = createId('exam');
  const exam = {
    id,
    title: payload.title,
    description: payload.description || '',
    questionIds: []
  };

  exams.set(id, exam);
  return examWithQuestions(exam, true);
}

function updateExam(examId, payload) {
  const exam = exams.get(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  const updated = {
    ...exam,
    title: payload.title || exam.title,
    description: payload.description !== undefined ? payload.description : exam.description
  };

  exams.set(examId, updated);
  return examWithQuestions(updated, true);
}

function deleteExam(examId) {
  const exam = exams.get(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  exam.questionIds.forEach((id) => questions.delete(id));
  exams.delete(examId);
}

function addQuestion(examId, payload) {
  const exam = exams.get(examId);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  if (!payload.text || !Array.isArray(payload.options) || payload.options.length < 2) {
    throw new ApiError(400, 'Question text and at least two options are required');
  }
  if (!Number.isInteger(payload.answer) || payload.answer < 0 || payload.answer >= payload.options.length) {
    throw new ApiError(400, 'A valid answer index is required');
  }

  const id = createId('question');
  const question = {
    id,
    examId,
    text: payload.text,
    options: payload.options,
    answer: payload.answer
  };

  questions.set(id, question);
  exam.questionIds.push(id);
  exams.set(examId, exam);
  return question;
}

function updateQuestion(questionId, payload) {
  const question = questions.get(questionId);
  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  const updated = {
    ...question,
    text: payload.text || question.text,
    options: Array.isArray(payload.options) ? payload.options : question.options,
    answer: Number.isInteger(payload.answer) ? payload.answer : question.answer
  };

  if (updated.answer < 0 || updated.answer >= updated.options.length) {
    throw new ApiError(400, 'Answer index must match one of the options');
  }

  questions.set(questionId, updated);
  return updated;
}

function deleteQuestion(questionId) {
  const question = questions.get(questionId);
  if (!question) {
    throw new ApiError(404, 'Question not found');
  }

  const exam = exams.get(question.examId);
  if (exam) {
    exam.questionIds = exam.questionIds.filter((id) => id !== questionId);
    exams.set(exam.id, exam);
  }
  questions.delete(questionId);
}

function startAttempt(examId) {
  const exam = getExam(examId);
  const id = createId('attempt');
  const attempt = {
    id,
    examId,
    status: 'in_progress',
    answers: {},
    score: null,
    startedAt: new Date().toISOString(),
    submittedAt: null
  };

  attempts.set(id, attempt);
  return { attempt, exam };
}

function getAttempt(attemptId) {
  const attempt = attempts.get(attemptId);
  if (!attempt) {
    throw new ApiError(404, 'Attempt not found');
  }
  return attempt;
}

function submitAttempt(attemptId, answers = {}) {
  const attempt = getAttempt(attemptId);
  if (attempt.status === 'submitted') {
    throw new ApiError(400, 'Attempt has already been submitted');
  }

  const exam = getExam(attempt.examId, true);
  const correct = exam.questions.reduce((total, question) => {
    return total + (answers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const submitted = {
    ...attempt,
    status: 'submitted',
    answers,
    score: {
      correct,
      total: exam.questions.length,
      percentage: exam.questions.length ? Math.round((correct / exam.questions.length) * 100) : 0
    },
    submittedAt: new Date().toISOString()
  };

  attempts.set(attemptId, submitted);
  return submitted;
}

function getAttemptResult(attemptId) {
  const attempt = getAttempt(attemptId);
  if (attempt.status !== 'submitted') {
    throw new ApiError(400, 'Attempt has not been submitted yet');
  }
  return attempt.score;
}

function getAdminSummary() {
  return {
    exams: exams.size,
    questions: questions.size,
    attempts: attempts.size,
    submittedAttempts: Array.from(attempts.values()).filter((attempt) => attempt.status === 'submitted').length
  };
}

module.exports = {
  listExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  startAttempt,
  getAttempt,
  submitAttempt,
  getAttemptResult,
  getAdminSummary
};
