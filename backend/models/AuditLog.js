const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userEmail: {
    type: String,
    default: '',
    trim: true
  },
  action: {
    type: String,
    required: [true, 'Audit action is required'],
    trim: true
  },
  targetType: {
    type: String,
    default: '',
    trim: true
  },
  targetId: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  ipAddress: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Helper static method for clean, non-blocking audit logging
auditLogSchema.statics.logEvent = async function ({
  userId = null,
  userEmail = '',
  action,
  targetType = '',
  targetId = '',
  description = '',
  ipAddress = ''
}) {
  try {
    return await this.create({
      userId,
      userEmail,
      action,
      targetType,
      targetId,
      description,
      ipAddress
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err.message);
    return null;
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
