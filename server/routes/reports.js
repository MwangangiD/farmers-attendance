const express = require('express');
const router = express.Router();
const { getMonthlyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/monthly', protect, getMonthlyReport);

module.exports = router;