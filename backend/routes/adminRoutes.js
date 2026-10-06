const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Enforce authentication & admin authorization on all routes in this router
router.use(protect);
router.use(admin);

// Admin Overview & Statistics
router.get('/stats', getAdminStats);
router.get('/analytics', getAdminAnalytics);

// User Management Routes
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Document Monitoring Routes
router.get('/documents', getAdminDocuments);
router.get('/documents/:id', getAdminDocumentById);

// Audit Logging
router.get('/audit-logs', getAdminAuditLogs);

module.exports = router;
