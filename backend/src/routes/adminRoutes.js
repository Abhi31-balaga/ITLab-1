const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', requireAuth, adminController.getSummary);
router.get('/exams', requireAuth, adminController.getExams);

module.exports = router;
