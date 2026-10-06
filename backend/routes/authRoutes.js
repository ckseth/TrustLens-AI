const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyEmailToken,
  resendVerificationLink,
  loginUser,
  verifyDeviceToken,
  forgotPassword,
  resetPassword,
  getSecurityActivity,
  revokeDevice,
  socialLogin,
  getUserProfile,
  sendOTP,
  verifyOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-email', verifyEmailToken);
router.post('/resend-verification', resendVerificationLink);
router.post('/login', loginUser);
router.post('/verify-device', verifyDeviceToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/social-login', socialLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/security-activity', protect, getSecurityActivity);
router.post('/revoke-device', protect, revokeDevice);

// Legacy fallback routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
