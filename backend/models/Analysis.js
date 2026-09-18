const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claim: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Verified', 'Unverified', 'Requires Verification', 'Potentially Misleading'],
    default: 'Requires Verification'
  }
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  suspiciousPoints: [{ type: String }],
  explanation: [{ type: String }],
  recommendation: {
    type: String,
    default: 'Potential risk indicators evaluated.'
  },
  claims: [claimSchema],
  detectedInformation: {
    emails: [{ type: String }],
    phones: [{ type: String }],
    urls: [{ type: String }],
    dates: [{ type: String }],
    amounts: [{ type: String }],
    upiIds: [{ type: String }]
  },
  importantPoints: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
