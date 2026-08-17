const express = require('express');
const attemptController = require('../controllers/attemptController');

const router = express.Router();

router.get('/:attemptId', attemptController.getAttempt);
router.post('/:attemptId/submit', attemptController.submitAttempt);
router.get('/:attemptId/result', attemptController.getAttemptResult);

module.exports = router;
