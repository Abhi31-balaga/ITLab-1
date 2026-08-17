const exams = new Map();
const questions = new Map();
const attempts = new Map();

let attemptSequence = 1;

function nextAttemptId() {
  return String(attemptSequence++);
}

function resetStore() {
  exams.clear();
  questions.clear();
  attempts.clear();
  attemptSequence = 1;
}

module.exports = {
  exams,
  questions,
  attempts,
  nextAttemptId,
  resetStore,
};
