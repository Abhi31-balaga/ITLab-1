const express = require('express');
const questionController = require('../controllers/questionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/:questionId', requireAuth, questionController.updateQuestion);
router.delete('/:questionId', requireAuth, questionController.deleteQuestion);

module.exports = router;
