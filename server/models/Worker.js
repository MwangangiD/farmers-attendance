const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true
  },
  workerType: {
    type: String,
    enum: ['individual', 'company'],
    required: true,
    default: 'individual'
  },
  companyName: {
    type: String,
    default: null
  },
  contractType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  department: {
    type: String,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);


