const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { scanPrivacyShield } = require('../controllers/privacyController');

// POST /api/privacy/scan/:documentId
router.post('/scan/:documentId', protect, scanPrivacyShield);

module.exports = router;
