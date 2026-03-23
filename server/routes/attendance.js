const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkin',       protect, checkIn);
router.put('/checkout/:id',   protect, checkOut);
router.get('/',               protect, getAttendance);

module.exports = router;