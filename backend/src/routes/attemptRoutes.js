const express = require('express');
const attemptController = require('../controllers/attemptController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/api/exams/:examId/start', authenticate, attemptController.startAttempt);
router.get('/api/attempts/:attemptId', authenticate, attemptController.getAttempt);
router.post('/api/attempts/:attemptId/submit', authenticate, attemptController.submitAttempt);
router.get('/api/attempts/:attemptId/result', authenticate, attemptController.getResult);

module.exports = router;
