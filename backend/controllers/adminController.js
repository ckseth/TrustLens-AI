const User = require('../models/User');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const Comparison = require('../models/Comparison');
const AuditLog = require('../models/AuditLog');

/**
 * @desc    Get Admin Overview Statistics (MongoDB Live Aggregation)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      verifiedUsers,
      activeUsers,
      totalDocuments,
      totalAnalyses,
      totalComparisons,
      lowRiskCount,
      mediumRiskCount,
      highRiskCount
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ $or: [{ emailVerified: true }, { isVerified: true }] }),
      User.countDocuments({ isActive: { $ne: false } }),
      Document.countDocuments(),
      Analysis.countDocuments(),
      Comparison.countDocuments(),
      Analysis.countDocuments({ riskLevel: 'Low' }),
      Analysis.countDocuments({ riskLevel: 'Medium' }),
      Analysis.countDocuments({ riskLevel: 'High' })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        activeUsers,
        totalDocuments,
        totalAnalyses,
        totalComparisons,
        riskDistribution: {
          low: lowRiskCount,
          medium: mediumRiskCount,
          high: highRiskCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get List of Users with Document Counts & Status
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const { q, role, status } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } }
      ];
    }

    if (role && ['user', 'admin'].includes(role)) {
      filter.role = role;
    }

    if (status === 'active') {
      filter.isActive = { $ne: false };
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const users = await User.find(filter)
      .select('-password -otpHash -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate document counts per user
    const docCounts = await Document.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    docCounts.forEach(d => {
      if (d._id) countMap[d._id.toString()] = d.count;
    });

    const enrichedUsers = users.map(u => ({
      ...u,
      documentCount: countMap[u._id.toString()] || 0,
      emailVerified: Boolean(u.emailVerified || u.isVerified),
      isActive: u.isActive !== false
    }));

    return res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single User Profile with Recent Activity Summary
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otpHash -verificationToken -resetPasswordToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const documents = await Document.find({ userId: user._id })
      .select('_id fileName originalName fileType fileSize status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const auditLogs = await AuditLog.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        emailVerified: Boolean(user.emailVerified || user.isVerified),
        isActive: user.isActive !== false
      },
      recentDocuments: documents,
      recentAuditLogs: auditLogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User Role (user <-> admin)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role ("user" or "admin") is required'
      });
    }

    // Protection rule: Admin cannot remove their own admin role
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Security protection: You cannot modify your own administrative role.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await AuditLog.logEvent({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'Admin changed user role',
      targetType: 'User',
      targetId: user._id.toString(),
      description: `Updated role for "${user.email}" from "${oldRole}" to "${role}"`,
      ipAddress: req.ip || ''
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle User Active/Deactivated Status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private/Admin
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive boolean value is required (true or false)'
      });
    }

    // Protection rule: Admin cannot deactivate their own account
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Security protection: You cannot deactivate your own account.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    await AuditLog.logEvent({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'Admin activated/deactivated user',
      targetType: 'User',
      targetId: user._id.toString(),
      description: `${isActive ? 'Activated' : 'Deactivated'} account for "${user.email}"`,
      ipAddress: req.ip || ''
    });

    return res.status(200).json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete User Account
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    // Protection rule: Admin cannot delete their own account
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Security protection: You cannot delete your own administrative account.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const deletedEmail = user.email;
    const deletedId = user._id.toString();

    await User.findByIdAndDelete(req.params.id);

    await AuditLog.logEvent({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'Admin deleted user',
      targetType: 'User',
      targetId: deletedId,
      description: `Permanently deleted user account "${deletedEmail}"`,
      ipAddress: req.ip || ''
    });

    return res.status(200).json({
      success: true,
      message: `User account "${deletedEmail}" deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get List of Documents for Admin Monitoring (Privacy Respected)
 * @route   GET /api/admin/documents
 * @access  Private/Admin
 */
const getAdminDocuments = async (req, res, next) => {
  try {
    const { status, type, q } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.fileType = type.toLowerCase();
    if (q) filter.originalName = { $regex: q.trim(), $options: 'i' };

    // Select document metadata only — DO NOT expose raw private extracted text
    const documents = await Document.find(filter)
      .select('_id fileName originalName fileType fileSize status createdAt userId')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .lean();

    // Map each document to its analysis risk level if available
    const docIds = documents.map(d => d._id);
    const analyses = await Analysis.find({ documentId: { $in: docIds } })
      .select('documentId riskScore riskLevel createdAt')
      .lean();

    const analysisMap = {};
    analyses.forEach(a => {
      analysisMap[a.documentId.toString()] = a;
    });

    const enrichedDocs = documents.map(doc => {
      const a = analysisMap[doc._id.toString()];
      return {
        ...doc,
        riskScore: a ? a.riskScore : null,
        riskLevel: a ? a.riskLevel : 'Unanalyzed'
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedDocs.length,
      documents: enrichedDocs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Document Metadata & Analysis Summary
 * @route   GET /api/admin/documents/:id
 * @access  Private/Admin
 */
const getAdminDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .select('_id fileName originalName fileType fileSize status createdAt userId')
      .populate('userId', 'name email role');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const analysis = await Analysis.findOne({ documentId: document._id })
      .select('riskScore riskLevel summary suspiciousPoints recommendation createdAt');

    return res.status(200).json({
      success: true,
      document,
      analysis: analysis || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Aggregated AI Analytics (Actual DB Metrics)
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalDocuments,
      totalAnalyses,
      totalComparisons,
      riskCounts,
      docTypeCounts,
      statusCounts
    ] = await Promise.all([
      Document.countDocuments(),
      Analysis.countDocuments(),
      Comparison.countDocuments(),
      Analysis.aggregate([
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ]),
      Document.aggregate([
        { $group: { _id: '$fileType', count: { $sum: 1 } } }
      ]),
      Document.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Build risk mapping
    const riskDistribution = { Low: 0, Medium: 0, High: 0 };
    riskCounts.forEach(r => {
      if (r._id && riskDistribution.hasOwnProperty(r._id)) {
        riskDistribution[r._id] = r.count;
      }
    });

    // Build file type mapping
    const typeDistribution = {};
    docTypeCounts.forEach(t => {
      const key = (t._id || 'unknown').toUpperCase();
      typeDistribution[key] = t.count;
    });

    // Build status mapping
    const statusDistribution = {};
    statusCounts.forEach(s => {
      statusDistribution[s._id || 'other'] = s.count;
    });

    // Count privacy and claim analyses based on Analysis subfields
    const [claimAnalysesCount, privacyAnalysesCount] = await Promise.all([
      Analysis.countDocuments({ 'claims.0': { $exists: true } }),
      Analysis.countDocuments({
        $or: [
          { 'detectedInformation.emails.0': { $exists: true } },
          { 'detectedInformation.phones.0': { $exists: true } },
          { 'detectedInformation.amounts.0': { $exists: true } }
        ]
      })
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalDocuments,
        totalAnalyses,
        totalComparisons,
        riskDistribution,
        typeDistribution,
        statusDistribution,
        aiOperations: {
          summarization: totalAnalyses,
          riskAnalysis: totalAnalyses,
          comparison: totalComparisons,
          claimAnalysis: claimAnalysesCount,
          privacyAnalysis: privacyAnalysesCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Platform Audit Logs (Chronological Security Events)
 * @route   GET /api/admin/audit-logs
 * @access  Private/Admin
 */
const getAdminAuditLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '100', 10);
    const actionFilter = req.query.action ? { action: req.query.action } : {};

    const logs = await AuditLog.find(actionFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: logs.length,
      auditLogs: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAdminDocuments,
  getAdminDocumentById,
  getAdminAnalytics,
  getAdminAuditLogs
};
