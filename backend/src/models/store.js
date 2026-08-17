const exams = new Map();
const questions = new Map();

let nextExamId = 1;
let nextQuestionId = 1;

function createExam(data) {
  const id = String(nextExamId++);
  const exam = {
    id,
    title: data.title,
    durationMinutes: data.durationMinutes,
    questions: [],
  };
  exams.set(id, exam);
  return exam;
}

function updateExam(id, data) {
  const exam = exams.get(id);
  if (!exam) return null;

  const updated = { ...exam, ...data, id };
  exams.set(id, updated);
  return updated;
}

function deleteExam(id) {
  const exam = exams.get(id);
  if (!exam) return null;

  for (const questionId of exam.questions) {
    questions.delete(questionId);
  }
  exams.delete(id);
  return exam;
}

function createQuestion(examId, data) {
  const exam = exams.get(examId);
  if (!exam) return null;

  const id = String(nextQuestionId++);
  const question = {
    id,
    examId,
    text: data.text,
    options: data.options,
    correctAnswer: data.correctAnswer,
    marks: data.marks ?? 1,
  };
  questions.set(id, question);
  exam.questions.push(id);
  exams.set(examId, exam);
  return question;
}

function updateQuestion(id, data) {
  const question = questions.get(id);
  if (!question) return null;

  const updated = { ...question, ...data, id, examId: question.examId };
  questions.set(id, updated);
  return updated;
}

function deleteQuestion(id) {
  const question = questions.get(id);
  if (!question) return null;

  const exam = exams.get(question.examId);
  if (exam) {
    exam.questions = exam.questions.filter((questionId) => questionId !== id);
    exams.set(exam.id, exam);
  }
  questions.delete(id);
  return question;
}

module.exports = {
  exams,
  questions,
  createExam,
  updateExam,
  deleteExam,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
