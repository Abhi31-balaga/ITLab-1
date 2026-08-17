'use strict';

/**
 * Centralized boundary for database-dependent operations.
 *
 * Replace each placeholder with the real database implementation once the
 * database teammate provides the connection method, model/table/collection
 * names, and schemas. Keep credentials in environment variables only.
 */

function notImplemented(operation) {
  throw new Error(`TODO(DB): ${operation} has not been implemented yet.`);
}

async function findUserForLogin(identifier) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name (for example, an app-specific DATABASE_URL), the User model/table/collection name, required fields (username, email, password hash, role/status, and primary key), and replace this placeholder with the real query that finds one user by username or email for login.
  void identifier;
  return notImplemented('find user by username/email for login');
}

async function listUsersForAdmin(options = {}) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the User model/table/collection name, required fields to return for admin views (primary key, username, email, role/status, created/updated timestamps), supported filters/pagination fields, and replace this placeholder with the real query that lists users for admin.
  void options;
  return notImplemented('list users for admin');
}

async function createExam(examInput) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Exam model/table/collection name, required fields (title/name, description, duration, status, owner/creator ID, timestamps), and replace this placeholder with the real query that creates an exam.
  void examInput;
  return notImplemented('create exam');
}

async function listExams(filters = {}) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Exam model/table/collection name, required fields to return, supported filters/pagination/sort fields, and replace this placeholder with the real query that lists exams.
  void filters;
  return notImplemented('list exams');
}

async function updateExam(examId, examUpdates) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Exam model/table/collection name, required editable fields, primary key field, and replace this placeholder with the real query that updates an exam by ID.
  void examId;
  void examUpdates;
  return notImplemented('update exam');
}

async function deleteExam(examId) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Exam model/table/collection name, deletion strategy (hard delete or soft-delete status field), primary key field, and replace this placeholder with the real query that deletes an exam by ID.
  void examId;
  return notImplemented('delete exam');
}

async function createQuestion(examId, questionInput) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Question model/table/collection name, required fields (exam ID, prompt/text, choices/options, correct answer or scoring key, order/difficulty, timestamps), and replace this placeholder with the real query that creates a question for an exam.
  void examId;
  void questionInput;
  return notImplemented('create question');
}

async function updateQuestion(questionId, questionUpdates) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Question model/table/collection name, required editable fields, primary key field, and replace this placeholder with the real query that updates a question by ID.
  void questionId;
  void questionUpdates;
  return notImplemented('update question');
}

async function deleteQuestion(questionId) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Question model/table/collection name, deletion strategy, primary key field, and replace this placeholder with the real query that deletes a question by ID.
  void questionId;
  return notImplemented('delete question');
}

async function fetchTenQuestionsForExam(examId) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Question model/table/collection name, required fields safe for exam delivery (question ID, exam ID, prompt/text, choices/options, order/difficulty but not the correct answer unless required server-side only), selection/randomization rules, and replace this placeholder with the real query that fetches exactly 10 questions for an exam.
  void examId;
  return notImplemented('fetch exactly 10 questions for an exam');
}

async function createExamAttempt(attemptInput) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the ExamAttempt model/table/collection name, required fields (attempt ID, exam ID, user ID, start time, status, timestamps), and replace this placeholder with the real query that creates an exam attempt.
  void attemptInput;
  return notImplemented('create exam attempt');
}

async function fetchAttemptById(attemptId) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the ExamAttempt model/table/collection name, required fields to return (attempt ID, exam ID, user ID, status, start/end times, timestamps), primary key field, and replace this placeholder with the real query that fetches an attempt by ID.
  void attemptId;
  return notImplemented('fetch attempt by ID');
}

async function saveSubmittedAnswers(attemptId, answers) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the SubmittedAnswer model/table/collection name, required fields (attempt ID, question ID, selected answer/value, submitted timestamp), transaction/bulk-write expectations, and replace this placeholder with the real query that saves submitted answers.
  void attemptId;
  void answers;
  return notImplemented('save submitted answers');
}

async function saveCalculatedResult(attemptId, resultInput) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Result model/table/collection name, required fields (result ID, attempt ID, score, total questions, passed/status, calculated timestamp, optional breakdown), uniqueness constraints, and replace this placeholder with the real query that saves a calculated result.
  void attemptId;
  void resultInput;
  return notImplemented('save calculated result');
}

async function fetchResultByAttemptId(attemptId) {
  // TODO(DB): Database teammate must provide the connection method and environment variable name, the Result model/table/collection name, required fields to return, attempt ID lookup/index field, and replace this placeholder with the real query that fetches a result by attempt ID.
  void attemptId;
  return notImplemented('fetch result by attempt ID');
}

module.exports = {
  findUserForLogin,
  listUsersForAdmin,
  createExam,
  listExams,
  updateExam,
  deleteExam,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchTenQuestionsForExam,
  createExamAttempt,
  fetchAttemptById,
  saveSubmittedAnswers,
  saveCalculatedResult,
  fetchResultByAttemptId,
};
