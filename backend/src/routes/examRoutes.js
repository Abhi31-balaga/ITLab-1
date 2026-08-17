const express = require('express');
const examController = require('../controllers/examController');
const questionController = require('../controllers/questionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', examController.listExams);
router.get('/:examId', examController.getExam);
router.post('/', requireAuth, examController.createExam);
router.put('/:examId', requireAuth, examController.updateExam);
router.delete('/:examId', requireAuth, examController.deleteExam);
router.post('/:examId/questions', requireAuth, questionController.addQuestion);
router.post('/:examId/start', examController.startAttempt);

module.exports = router;
