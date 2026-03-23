const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',     protect, getWorkers);
router.post('/',    protect, createWorker);
router.get('/:id',  protect, getWorker);
router.put('/:id',  protect, updateWorker);
router.delete('/:id', protect, deleteWorker);

module.exports = router;