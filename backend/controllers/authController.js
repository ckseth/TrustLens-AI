const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Device = require('../models/Device');
const emailService = require('../services/emailService');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'trustlens_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user & send Email Verification Link
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Generate secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create User (unverified)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role && ['user', 'admin'].includes(role) ? role : 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email via NodeMailer
    emailService.sendSignupVerificationEmail(user.email, user.name, verificationToken);

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: `Verification link sent to ${user.email}. Please check your inbox to activate your account.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Email Token from verification link
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
const verifyEmailToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.'
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired email verification link. Please request a new one.'
      });
    }

    // Update verification status
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Send Welcome email asynchronously
    emailService.sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: 'Your email address has been verified successfully!',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend Email Verification Link
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerificationLink = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account is already verified. You can sign in directly.'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    emailService.sendSignupVerificationEmail(user.email, user.name, verificationToken);

    return res.status(200).json({
      success: true,
      message: `A new verification link has been sent to ${user.email}.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & Check Trust Pass / Trusted Device Status
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password, deviceFingerprint, deviceName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email address and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // Check if account is email-verified
    if (!user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      emailService.sendSignupVerificationEmail(user.email, user.name, verificationToken);

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: 'Your account is not verified yet. A verification link has been sent to your inbox.'
      });
    }

    // TRUST PASS DEVICE CHECK
    const fingerprint = deviceFingerprint || 'default-browser-fingerprint';
    const displayDeviceName = deviceName || 'Chrome · Windows';

    let device = await Device.findOne({
      user: user._id,
      deviceFingerprint: fingerprint
    });

    // Check if device is trusted and active
    if (device && device.isTrusted && !device.revokedAt) {
      device.lastUsedAt = new Date();
      await device.save();

      return res.status(200).json({
        success: true,
        isTrustedDevice: true,
        message: 'Authentication successful. Welcome back!',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
    }

    // NEW / UNTRUSTED DEVICE DETECTED
    const deviceToken = crypto.randomBytes(32).toString('hex');
    const deviceTokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    if (!device) {
      device = await Device.create({
        user: user._id,
        deviceFingerprint: fingerprint,
        deviceName: displayDeviceName,
        isTrusted: false,
        verificationToken: deviceToken,
        verificationTokenExpires: deviceTokenExpires
      });
    } else {
      device.verificationToken = deviceToken;
      device.verificationTokenExpires = deviceTokenExpires;
      device.deviceName = displayDeviceName;
      await device.save();
    }

    // Send New Device Login Verification Email
    emailService.sendNewDeviceLoginEmail(user.email, user.name, device.deviceName, deviceToken);

    return res.status(200).json({
      success: true,
      requiresDeviceVerification: true,
      email: user.email,
      deviceName: device.deviceName,
      message: 'New device detected. We sent a verification link to your email to authorize access.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify New Device Login via Email Token
 * @route   POST /api/auth/verify-device
 * @access  Public
 */
const verifyDeviceToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Device verification token is required.'
      });
    }

    const device = await Device.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!device) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired device verification link.'
      });
    }

    // Mark device as trusted
    device.isTrusted = true;
    device.trustedAt = new Date();
    device.verificationToken = null;
    device.verificationTokenExpires = null;
    device.revokedAt = null;
    device.lastUsedAt = new Date();
    await device.save();

    const user = await User.findById(device.user);

    return res.status(200).json({
      success: true,
      message: 'Device verified & marked trusted successfully!',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request Password Reset Link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: `If an account exists for ${email}, a password reset link has been sent.`
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    return res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}. Check your inbox to proceed.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with Secure Token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get User Security Activity & Devices
 * @route   GET /api/auth/security-activity
 * @access  Private
 */
const getSecurityActivity = async (req, res, next) => {
  try {
    const currentFingerprint = req.query.deviceFingerprint;
    const devices = await Device.find({ user: req.user._id }).sort({ lastUsedAt: -1 });

    const formattedDevices = devices.map((d) => {
      let status = 'TRUSTED';
      let statusBadge = 'Trusted Device';
      let badgeColor = 'green';

      if (d.revokedAt) {
        status = 'REVOKED';
        statusBadge = 'Session Revoked';
        badgeColor = 'red';
      } else if (!d.isTrusted) {
        status = 'VERIFICATION_REQUIRED';
        statusBadge = 'Verification Required';
        badgeColor = 'yellow';
      }

      const isCurrentSession = currentFingerprint ? d.deviceFingerprint === currentFingerprint : false;

      return {
        _id: d._id,
        deviceName: d.deviceName,
        ipAddress: d.ipAddress,
        isTrusted: d.isTrusted,
        status,
        statusBadge,
        badgeColor,
        isCurrentSession,
        lastUsedAt: d.lastUsedAt,
        createdAt: d.createdAt,
        revokedAt: d.revokedAt
      };
    });

    return res.status(200).json({
      success: true,
      devices: formattedDevices
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Revoke Device / Session
 * @route   POST /api/auth/revoke-device
 * @access  Private
 */
const revokeDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device ID is required.'
      });
    }

    const device = await Device.findOne({ _id: deviceId, user: req.user._id });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device session not found.'
      });
    }

    device.isTrusted = false;
    device.revokedAt = new Date();
    await device.save();

    return res.status(200).json({
      success: true,
      message: 'Device session revoked successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Social / Third-party Login Handler
 * @route   POST /api/auth/social-login
 * @access  Public
 */
const socialLogin = async (req, res, next) => {
  try {
    const { provider, name, email } = req.body;
    const providerName = provider || 'Google';
    const userEmail = email || `user.${providerName.toLowerCase()}@trustlens.ai`;
    const userName = name || `${providerName} Verified User`;

    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await User.create({
        name: userName,
        email: userEmail,
        password: crypto.randomBytes(16).toString('hex'),
        isVerified: true,
        role: 'user'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Authenticated via ${providerName} Single Sign-On`,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send 6-Digit OTP Code to User Email
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    const cleanEmail = email.toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (!user) {
      user = await User.create({
        name: 'TrustLens User',
        email: cleanEmail,
        password: crypto.randomBytes(16).toString('hex'),
        isVerified: false,
        otp: otpCode,
        otpExpires
      });
    } else {
      user.otp = otpCode;
      user.otpExpires = otpExpires;
      await user.save();
    }

    emailService.sendOTPEmail(user.email, otpCode, user.name);

    return res.status(200).json({
      success: true,
      message: `6-digit OTP code sent to ${user.email}`,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify 6-Digit OTP Code
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      otp: otp.trim(),
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully! Account active.',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
