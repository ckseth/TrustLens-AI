const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['changed', 'added', 'removed', 'inconsistency'],
    default: 'changed'
  },
  field: {
    type: String,
    required: true
  },
  oldValue: {
    type: String,
    default: ''
  },
  newValue: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  }
}, { _id: false });

const comparisonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  documentB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  changes: [changeSchema],
  summary: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comparison', comparisonSchema);
