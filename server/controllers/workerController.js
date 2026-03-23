const Worker = require('../models/Worker');

// @desc    Get all workers
// @route   GET /api/workers
const getWorkers = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.idNumber) {
      filter.idNumber = req.query.idNumber;
    }

    const workers = await Worker.find(filter);
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register new worker
// @route   POST /api/workers
const createWorker = async (req, res) => {
  try {
    const { fullName, idNumber, workerType, companyName, contractType, department } = req.body;

    // Check if worker with same ID number already exists
    const exists = await Worker.findOne({ idNumber });
    if (exists) {
      return res.status(400).json({ message: 'Worker with this ID number already exists' });
    }

    const worker = await Worker.create({
      fullName,
      idNumber,
      workerType,
      companyName,
      contractType,
      department
    });

    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update worker
// @route   PUT /api/workers/:id
const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deactivate worker (soft delete)
// @route   DELETE /api/workers/:id
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkers, getWorker, createWorker, updateWorker, deleteWorker };