const express = require('express');
const examController = require('../controllers/examController');
const questionController = require('../controllers/questionController');
const { requireExaminer } = require('../middleware/auth');

const router = express.Router();

router.post('/exams', requireExaminer, examController.createExam);
router.put('/exams/:examId', requireExaminer, examController.updateExam);
router.delete('/exams/:examId', requireExaminer, examController.deleteExam);
router.post('/exams/:examId/questions', requireExaminer, questionController.createQuestion);
router.put('/questions/:questionId', requireExaminer, questionController.updateQuestion);
router.delete('/questions/:questionId', requireExaminer, questionController.deleteQuestion);

module.exports = router;
