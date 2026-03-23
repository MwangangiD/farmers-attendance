const Attendance = require('../models/Attendance');
const Worker = require('../models/Worker');

// @desc    Clock in a worker
// @route   POST /api/attendance/checkin
const checkIn = async (req, res) => {
  try {
    const { workerId } = req.body;

    // Check worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Check if worker already clocked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyClockedIn = await Attendance.findOne({
      worker: workerId,
      date: { $gte: today }
    });

    if (alreadyClockedIn) {
      return res.status(400).json({ message: 'Worker already clocked in today' });
    }

    const attendance = await Attendance.create({
      worker: workerId,
      date: new Date(),
      timeIn: new Date(),
      recordedBy: req.user.id
    });

    // Populate worker details in the response
    await attendance.populate('worker');

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clock out a worker
// @route   PUT /api/attendance/checkout/:id
const checkOut = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (attendance.timeOut) {
      return res.status(400).json({ message: 'Worker already clocked out' });
    }

    // Calculate hours worked
    const timeOut = new Date();
    const hoursWorked = (timeOut - attendance.timeIn) / (1000 * 60 * 60);

    attendance.timeOut = timeOut;
    attendance.hoursWorked = Math.round(hoursWorked * 100) / 100;
    await attendance.save();

    await attendance.populate('worker');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
  try {
    const { date, workerId } = req.query;
    let filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    if (workerId) {
      filter.worker = workerId;
    }

    const attendance = await Attendance.find(filter)
      .populate('worker')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, getAttendance };