const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceFingerprint: {
    type: String,
    required: true,
    trim: true
  },
  deviceName: {
    type: String,
    default: 'Chrome · Windows'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  isTrusted: {
    type: Boolean,
    default: false
  },
  trustedAt: {
    type: Date,
    default: null
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  revokedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Device', deviceSchema);
