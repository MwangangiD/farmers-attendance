const Attendance = require('../models/Attendance');

// @desc    Get monthly report
// @route   GET /api/reports/monthly?month=3&year=2026
const getMonthlyReport = async (req, res) => {
  try {
    // Get month and year from query, default to current month
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();

    // Build date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 1);

    // Fetch all attendance records for that month
    const records = await Attendance.find({
      date: { $gte: startDate, $lt: endDate }
    }).populate('worker');

    // Group records by worker and sum up hours
    const reportMap = {};

    records.forEach(record => {
      const worker = record.worker;

      // Skip if worker was deleted
      if (!worker) return;

      const id = worker._id.toString();

      if (!reportMap[id]) {
        reportMap[id] = {
          workerName:   worker.fullName,
          idNumber:     worker.idNumber,
          workerType:   worker.workerType,
          companyName:  worker.companyName,
          department:   worker.department,
          daysWorked:   0,
          totalHours:   0,
          overtimeHours: 0
        };
      }

      reportMap[id].daysWorked += 1;
      reportMap[id].totalHours += record.hoursWorked;

      // Anything over 8 hours in a day is overtime
      if (record.hoursWorked > 8) {
        reportMap[id].overtimeHours += record.hoursWorked - 8;
      }
    });

    // Convert map to array and round numbers
    const reportData = Object.values(reportMap).map(worker => ({
      ...worker,
      totalHours:    Math.round(worker.totalHours * 100) / 100,
      overtimeHours: Math.round(worker.overtimeHours * 100) / 100
    }));

    res.json({
      month,
      year,
      totalWorkers: reportData.length,
      totalHours:   Math.round(reportData.reduce((sum, w) => sum + w.totalHours, 0) * 100) / 100,
      data: reportData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMonthlyReport };