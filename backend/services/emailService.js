const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  async initTransporter() {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log('[EmailService] Configured with environment SMTP credentials.');
    } else {
      // Create Ethereal test account fallback for instant dev testing
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log(`[EmailService] Dev Ethereal Account initialized: ${testAccount.user}`);
      } catch (err) {
        console.warn('[EmailService] Ethereal initialization warning:', err.message);
      }
    }
  }

  /**
   * Send 6-Digit OTP Email
   */
  async sendOTPEmail(toEmail, otpCode, userName = 'User') {
    if (!this.transporter) await this.initTransporter();

    const mailOptions = {
      from: `"TrustLens AI Security" <${process.env.SMTP_USER || 'no-reply@trustlens.ai'}>`,
      to: toEmail,
      subject: `🛡️ TrustLens AI Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #061E0E; padding: 40px 20px; color: #FFFFFF;">
          <div style="max-width: 540px; margin: 0 auto; background: #0F2C17; border-radius: 16px; padding: 36px; border: 1px solid rgba(92, 184, 96, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #5CB860; font-size: 24px; margin: 0; font-weight: 800;">TrustLens AI</h1>
              <p style="color: #9FD4A2; font-size: 13px; margin-top: 4px;">Secure Identity &amp; Document Verification</p>
            </div>
            
            <h2 style="font-size: 20px; color: #FFFFFF; margin-bottom: 12px;">Hello ${userName},</h2>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">Use the 6-digit verification code below to verify your identity and complete registration.</p>

            <div style="text-align: center; margin: 28px 0;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #5CB860; background: #061E0E; padding: 14px 28px; border-radius: 12px; border: 1.5px dashed #5CB860; display: inline-block;">${otpCode}</span>
            </div>

            <p style="color: #A3C4AC; font-size: 13px;">This OTP verification code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
            <p style="color: #839E8C; font-size: 12px; text-align: center; margin: 0;">&copy; 2026 TrustLens AI. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP sent to ${toEmail}. Message ID: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
          console.log(`[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('[EmailService] Error sending OTP email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Signup Account Verification Email
   */
  async sendSignupVerificationEmail(toEmail, userName, verificationToken) {
    if (!this.transporter) await this.initTransporter();

    const verifyLink = `http://localhost:5000/pages/login.html?verifyToken=${verificationToken}`;

    const mailOptions = {
      from: `"TrustLens AI Security" <${process.env.SMTP_USER || 'security@trustlens.ai'}>`,
      to: toEmail,
      subject: `Welcome to TrustLens AI — Account Created`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #071D35; padding: 40px 20px; color: #FFFFFF;">
          <div style="max-width: 540px; margin: 0 auto; background: #0B2A4A; border-radius: 18px; padding: 40px; border: 1px solid rgba(32, 212, 232, 0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
            <div style="text-align: center; margin-bottom: 28px;">
              <h1 style="color: #20D4E8; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">TrustLens AI</h1>
              <p style="color: #9FD4A2; font-size: 13px; margin-top: 4px; font-weight: 600;">Secure Identity &amp; Document Intelligence</p>
            </div>
            
            <h2 style="font-size: 20px; color: #FFFFFF; margin-bottom: 14px;">Hello ${userName},</h2>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">Your TrustLens AI account has been created successfully. Please verify your email address to activate your account.</p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyLink}" style="background: #087EA4; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(8, 126, 164, 0.4);">Verify Email &rarr;</a>
            </div>

            <p style="color: #A3C4AC; font-size: 13px; line-height: 1.5;">For your security, if you did not create this account, you can ignore this email safely.</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.12); margin: 28px 0;" />
            <p style="color: #839E8C; font-size: 12px; text-align: center; margin: 0;">Regards,<br /><strong>TrustLens AI Security Team</strong></p>
          </div>
        </div>
      `
    };

    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] Signup verification link sent to ${toEmail}. Message ID: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
          console.log(`[EmailService] Verification Link Preview: ${nodemailer.getTestMessageUrl(info)}`);
        }
      }
      return { success: true, verifyLink };
    } catch (error) {
      console.error('[EmailService] Error sending verification email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send New Device Login Verification Link Email (Trust Pass)
   */
  async sendNewDeviceLoginEmail(toEmail, userName, deviceName, deviceToken) {
    if (!this.transporter) await this.initTransporter();

    const verifyDeviceLink = `http://localhost:5000/pages/login.html?verifyDeviceToken=${deviceToken}`;

    const mailOptions = {
      from: `"TrustLens AI Trust Pass" <${process.env.SMTP_USER || 'security@trustlens.ai'}>`,
      to: toEmail,
      subject: `New TrustLens login detected — Action Required`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #071D35; padding: 40px 20px; color: #FFFFFF;">
          <div style="max-width: 540px; margin: 0 auto; background: #0B2A4A; border-radius: 18px; padding: 40px; border: 1px solid rgba(242, 139, 146, 0.4); box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background: rgba(242, 139, 146, 0.2); color: #F28B92; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em;">NEW DEVICE DETECTED</span>
              <h1 style="color: #FFFFFF; font-size: 24px; margin-top: 10px; font-weight: 800;">TrustLens Login Verification</h1>
            </div>
            
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">We noticed a sign-in to your TrustLens account from a new or unrecognized device:</p>

            <div style="background: #071D35; border: 1px solid rgba(255,255,255,0.15); padding: 16px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <div style="font-size: 13px; color: #A3C4AC; font-weight: 600;">UNRECOGNIZED DEVICE</div>
              <div style="font-size: 18px; color: #20D4E8; font-weight: 800; margin-top: 4px;">${deviceName || 'Chrome · Windows'}</div>
            </div>

            <p style="color: #D1E3D6; font-size: 14px; line-height: 1.6;">Click below to verify this login request and mark this device as trusted for future access.</p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${verifyDeviceLink}" style="background: #087EA4; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block;">Verify This Login &amp; Trust Device &rarr;</a>
            </div>

            <p style="color: #F28B92; font-size: 12px; line-height: 1.5;">If this wasn't you, someone may be attempting to access your account. Please change your password immediately.</p>
          </div>
        </div>
      `
    };

    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] New device login link sent to ${toEmail}. Message ID: ${info.messageId}`);
      }
      return { success: true, verifyDeviceLink };
    } catch (error) {
      console.error('[EmailService] Error sending device verification email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Password Reset Email Link
   */
  async sendPasswordResetEmail(toEmail, userName, resetToken) {
    if (!this.transporter) await this.initTransporter();

    const resetLink = `http://localhost:5000/pages/login.html?resetToken=${resetToken}`;

    const mailOptions = {
      from: `"TrustLens AI Security" <${process.env.SMTP_USER || 'security@trustlens.ai'}>`,
      to: toEmail,
      subject: `Reset your TrustLens password`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #071D35; padding: 40px 20px; color: #FFFFFF;">
          <div style="max-width: 540px; margin: 0 auto; background: #0B2A4A; border-radius: 18px; padding: 40px; border: 1px solid rgba(8, 126, 164, 0.4);">
            <h2 style="color: #20D4E8; font-size: 22px; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">Hello ${userName},</p>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">We received a request to reset your password for your TrustLens AI account.</p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetLink}" style="background: #087EA4; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; display: inline-block;">Reset Password &rarr;</a>
            </div>

            <p style="color: #A3C4AC; font-size: 13px;">This link expires in <strong>1 hour</strong>. If you did not request a password reset, please ignore this message.</p>
          </div>
        </div>
      `
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
      }
      return { success: true, resetLink };
    } catch (err) {
      console.error('[EmailService] Error sending password reset email:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Send Welcome Email upon Successful Registration
   */
  async sendWelcomeEmail(toEmail, userName) {
    if (!this.transporter) await this.initTransporter();

    const mailOptions = {
      from: `"TrustLens AI Team" <${process.env.SMTP_USER || 'welcome@trustlens.ai'}>`,
      to: toEmail,
      subject: `🎉 Welcome to TrustLens AI – Account Verified`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #071D35; padding: 40px 20px; color: #FFFFFF;">
          <div style="max-width: 540px; margin: 0 auto; background: #0B2A4A; border-radius: 18px; padding: 40px; border: 1px solid rgba(32, 212, 232, 0.3);">
            <h2 style="color: #20D4E8; font-size: 22px; margin-top: 0;">Welcome aboard, ${userName}!</h2>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">Your TrustLens AI account has been successfully created and verified.</p>
            <p style="color: #D1E3D6; font-size: 15px; line-height: 1.6;">You now have full access to document verification, risk indicators, and comparison studio tools.</p>
            <div style="text-align: center; margin-top: 28px;">
              <a href="http://localhost:5000/pages/analyze.html" style="background: #087EA4; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; display: inline-block;">Open Verification Studio &rarr;</a>
            </div>
          </div>
        </div>
      `
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
      }
    } catch (err) {
      console.error('[EmailService] Error sending welcome email:', err.message);
    }
  }
}

module.exports = new EmailService();

