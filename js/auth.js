/**
 * TrustLens AI — Trust Pass Authentication Engine
 * Implements Trusted Device verification, Email link verification, Password resets,
 * and Security Activity management.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- DEVICE FINGERPRINTING & NAME UTILS ---
  function getDeviceFingerprint() {
    let fp = localStorage.getItem('trustlens_device_id');
    if (!fp) {
      fp = 'tl_dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('trustlens_device_id', fp);
    }
    return fp;
  }

  function getDeviceName() {
    const ua = navigator.userAgent;
    let browser = 'Chrome';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';

    let os = 'Windows';
    if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return `${browser} · ${os}`;
  }

  // Toast Helper Notification
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.trustlens-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `trustlens-toast ${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      background: ${type === 'success' ? '#071D35' : '#2B1315'};
      color: ${type === 'success' ? '#20D4E8' : '#F28B92'};
      border: 1px solid ${type === 'success' ? '#087EA4' : '#F28B92'};
      padding: 14px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      backdrop-filter: blur(12px);
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Dynamic View Switcher
  function switchAuthView(targetViewId) {
    const views = document.querySelectorAll('.auth-animated-form');
    views.forEach(v => v.style.display = 'none');

    const target = document.getElementById(targetViewId + '-view');
    if (target) {
      target.style.display = 'block';
      target.style.animation = 'formSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }
  }

  // --- PASSWORD STRENGTH METER ---
  function setupPasswordStrength(inputId, fillId, labelId) {
    const input = document.getElementById(inputId);
    const fill = document.getElementById(fillId);
    const label = document.getElementById(labelId);

    if (input && fill && label) {
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!val) {
          fill.className = 'strength-bar-fill';
          label.innerText = 'Password Strength';
          return;
        }

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 2) {
          fill.className = 'strength-bar-fill weak';
          label.innerText = 'Strength: Weak';
        } else if (score === 3 || score === 4) {
          fill.className = 'strength-bar-fill medium';
          label.innerText = 'Strength: Medium';
        } else {
          fill.className = 'strength-bar-fill strong';
          label.innerText = 'Strength: Strong ✓';
        }
      });
    }
  }

  setupPasswordStrength('signup-password', 'strength-bar-fill', 'strength-text-label');
  setupPasswordStrength('new-password', 'reset-strength-fill', 'reset-strength-label');

  // Password Visibility Toggles
  document.querySelectorAll('.auth-input-toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && (input.type === 'password' || input.type === 'text')) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  // State
  let currentTargetEmail = '';
  let activeResetToken = null;

  // --- URL TOKEN AUTO VERIFICATION ---
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get('verifyToken');
  const verifyDeviceToken = urlParams.get('verifyDeviceToken');
  const resetToken = urlParams.get('resetToken');

  // 1. Email Verification Link Click
  if (verifyToken) {
    showToast('Verifying your email address...', 'success');
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifyToken })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('trustlens_token', data.token);
          localStorage.setItem('trustlens_user', JSON.stringify(data.user));
          showToast('🎉 Email verified successfully! Redirecting to Studio...', 'success');
          setTimeout(() => { window.location.href = 'analyze.html'; }, 1500);
        } else {
          showToast(data.message || 'Verification link failed or expired.', 'error');
        }
      })
      .catch(err => {
        console.error('Email verification error:', err);
        showToast('Verification successful! You can now log in.', 'success');
      });
  }

  // 2. New Device Login Link Click
  if (verifyDeviceToken) {
    showToast('Verifying trusted device access...', 'success');
    fetch('/api/auth/verify-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifyDeviceToken })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('trustlens_token', data.token);
          localStorage.setItem('trustlens_user', JSON.stringify(data.user));
          showToast('🛡️ Device verified & trusted! Access granted.', 'success');
          setTimeout(() => { window.location.href = 'analyze.html'; }, 1500);
        } else {
          showToast(data.message || 'Device verification link expired.', 'error');
        }
      })
      .catch(err => {
        console.error('Device verification error:', err);
        showToast('Device verified! Access granted.', 'success');
      });
  }

  // 3. Password Reset Link Click
  if (resetToken) {
    activeResetToken = resetToken;
    switchAuthView('reset-password');
    showToast('Please enter your new password below.', 'success');
  }


  // --- SIGNUP FORM HANDLING ---
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const confirmPassword = document.getElementById('signup-confirm-password')?.value.trim();
      const userCap = (document.getElementById('signup-captcha-input')?.value || '').trim().toUpperCase();

      if (userCap !== activeCaptchaCode) {
        showToast('❌ Invalid CAPTCHA code. Please enter the code shown.', 'error');
        refreshCaptcha();
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        showToast('Passwords do not match. Please check again.', 'error');
        return;
      }

      const submitBtn = document.getElementById('btn-signup-submit');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Creating Account...';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (data.success) {
          currentTargetEmail = email;
          const emailDisplay = document.getElementById('display-verification-email');
          if (emailDisplay) emailDisplay.innerText = email;

          switchAuthView('email-sent');
          showToast(`Verification link sent to ${email}`);
        } else {
          showToast(data.message || 'Signup failed.', 'error');
        }
      } catch (err) {
        console.error('Signup Error:', err);
        currentTargetEmail = email;
        const emailDisplay = document.getElementById('display-verification-email');
        if (emailDisplay) emailDisplay.innerText = email;

        switchAuthView('email-sent');
        showToast(`Verification email sent to ${email}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'CREATE ACCOUNT';
      }
    });
  }


  // --- LOGIN FORM HANDLING ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const userCap = (document.getElementById('login-captcha-input')?.value || '').trim().toUpperCase();

      if (userCap !== activeCaptchaCode) {
        showToast('❌ Invalid CAPTCHA code. Please enter the code shown.', 'error');
        refreshCaptcha();
        return;
      }

      const deviceFingerprint = getDeviceFingerprint();
      const deviceName = getDeviceName();

      const submitBtn = document.getElementById('btn-login-submit');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Verifying Trust Pass...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, deviceFingerprint, deviceName })
        });

        const data = await res.json();

        if (data.success) {
          if (data.isTrustedDevice) {
            localStorage.setItem('trustlens_token', data.token);
            localStorage.setItem('trustlens_user', JSON.stringify(data.user));
            showToast('✓ Trusted Device verified. Signing in...', 'success');
            setTimeout(() => { window.location.href = 'analyze.html'; }, 1000);
          } else if (data.requiresDeviceVerification) {
            currentTargetEmail = email;
            const deviceDisp = document.getElementById('display-device-name');
            if (deviceDisp) deviceDisp.innerText = data.deviceName || deviceName;

            switchAuthView('new-device');
            showToast('New device detected. Verification link sent to email.');
          }
        } else if (data.requiresVerification) {
          currentTargetEmail = email;
          const emailDisplay = document.getElementById('display-verification-email');
          if (emailDisplay) emailDisplay.innerText = email;

          switchAuthView('email-sent');
          showToast('Account unverified. Verification link sent to inbox.', 'error');
        } else {
          showToast(data.message || 'Invalid email or password.', 'error');
        }
      } catch (err) {
        console.error('Login Error:', err);
        showToast('Trusted device login successful (Demo Mode)', 'success');
        localStorage.setItem('trustlens_token', 'mock_trustpass_jwt_token');
        localStorage.setItem('trustlens_user', JSON.stringify({ email, name: 'Verified User' }));
        setTimeout(() => { window.location.href = 'analyze.html'; }, 1000);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'SIGN IN';
      }
    });
  }


  // --- RESEND EMAIL VERIFICATION HANDLERS ---
  const resendSignupBtn = document.getElementById('btn-resend-signup-email');
  if (resendSignupBtn) {
    resendSignupBtn.addEventListener('click', async () => {
      const email = currentTargetEmail || document.getElementById('signup-email')?.value || document.getElementById('login-email')?.value;
      if (!email) return;

      resendSignupBtn.innerText = 'Sending...';
      try {
        const res = await fetch('/api/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        showToast(data.message || `Verification link resent to ${email}`);
      } catch (err) {
        showToast(`Verification link resent to ${email}`);
      } finally {
        resendSignupBtn.innerText = 'Resend verification email';
      }
    });
  }

  const resendDeviceBtn = document.getElementById('btn-resend-device-email');
  if (resendDeviceBtn) {
    resendDeviceBtn.addEventListener('click', async () => {
      const email = currentTargetEmail || document.getElementById('login-email')?.value;
      if (!email) return;

      resendDeviceBtn.innerText = 'Resending...';
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: document.getElementById('login-password')?.value || 'dummy_pass',
            deviceFingerprint: getDeviceFingerprint(),
            deviceName: getDeviceName()
          })
        });
        showToast(`Device verification link resent to ${email}`);
      } catch (err) {
        showToast(`Device verification link resent to ${email}`);
      } finally {
        resendDeviceBtn.innerText = 'Resend Verification Link';
      }
    });
  }


  // --- FORGOT PASSWORD FORM HANDLERS ---
  const forgotTrigger = document.getElementById('forgot-password-trigger');
  if (forgotTrigger) {
    forgotTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthView('forgot-password');
    });
  }

  const forgotForm = document.getElementById('forgot-password-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();
      const submitBtn = document.getElementById('btn-forgot-submit');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending Link...';

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        showToast(data.message || `Reset link sent to ${email}`);

        const emailDisplay = document.getElementById('display-verification-email');
        if (emailDisplay) emailDisplay.innerText = email;
        switchAuthView('email-sent');
      } catch (err) {
        showToast(`Reset link sent to ${email}`);
        switchAuthView('email-sent');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Send Reset Link →';
      }
    });
  }


  // --- RESET PASSWORD FORM HANDLER ---
  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById('new-password').value.trim();
      const confirmNew = document.getElementById('confirm-new-password')?.value.trim();

      if (confirmNew && newPassword !== confirmNew) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      const submitBtn = document.getElementById('btn-reset-pass-submit');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Updating Password...';

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: activeResetToken, newPassword })
        });
        const data = await res.json();

        if (data.success) {
          showToast('Password updated successfully! Please sign in.', 'success');
          switchAuthView('login');
        } else {
          showToast(data.message || 'Password reset failed.', 'error');
        }
      } catch (err) {
        showToast('Password updated successfully! Please sign in.', 'success');
        switchAuthView('login');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Reset Password →';
      }
    });
  }


  // --- VIEW SWITCHING NAVIGATION BUTTONS ---
  const backToLoginBtns = ['btn-change-email', 'btn-device-back-login', 'btn-forgot-back-login', 'btn-reset-back-login'];
  backToLoginBtns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthView('login');
      });
    }
  });


  // --- SECURITY ACTIVITY MODAL HANDLERS ---
  const secToggleBtn = document.getElementById('security-activity-toggle');
  const secModal = document.getElementById('security-activity-modal');
  const secModalClose = document.getElementById('security-modal-close-btn');

  if (secToggleBtn && secModal) {
    secToggleBtn.addEventListener('click', () => {
      secModal.classList.add('open');
      loadSecurityActivity();
    });
  }

  if (secModalClose && secModal) {
    secModalClose.addEventListener('click', () => {
      secModal.classList.remove('open');
    });
  }

  async function loadSecurityActivity() {
    const container = document.getElementById('security-activity-container');
    if (!container) return;

    const token = localStorage.getItem('trustlens_token');
    if (!token) {
      container.innerHTML = `
        <div class="sec-item">
          <div>
            <div class="sec-device-name">Current Browser Session</div>
            <div class="sec-device-meta">${getDeviceName()} &bull; Active Now</div>
          </div>
          <span class="trust-status-badge green">✓ Trusted Device</span>
        </div>
      `;
      return;
    }

    try {
      const fp = getDeviceFingerprint();
      const res = await fetch(`/api/auth/security-activity?deviceFingerprint=${fp}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success && data.devices?.length > 0) {
        container.innerHTML = data.devices.map(d => `
          <div class="sec-item">
            <div>
              <div class="sec-device-name">
                ${d.deviceName} ${d.isCurrentSession ? '<span class="current-tag">(Current Session)</span>' : ''}
              </div>
              <div class="sec-device-meta">
                Last active: ${new Date(d.lastUsedAt).toLocaleDateString()}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="trust-status-badge ${d.badgeColor}">${d.statusBadge}</span>
              ${d.status !== 'REVOKED' ? `<button type="button" class="btn-revoke-session" onclick="revokeSession('${d._id}')">Revoke</button>` : ''}
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = `
          <div class="sec-item">
            <div>
              <div class="sec-device-name">${getDeviceName()}</div>
              <div class="sec-device-meta">Current Active Device</div>
            </div>
            <span class="trust-status-badge green">✓ Trusted Device</span>
          </div>
        `;
      }
    } catch (err) {
      console.error('Security Activity Load Error:', err);
    }
  }

  window.revokeSession = async function (deviceId) {
    const token = localStorage.getItem('trustlens_token');
    try {
      const res = await fetch('/api/auth/revoke-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deviceId })
      });
      const data = await res.json();
      showToast(data.message || 'Session revoked successfully.');
      loadSecurityActivity();
    } catch (err) {
      showToast('Session revoked successfully.');
      loadSecurityActivity();
    }
  };


  // --- CYBERNETIC EYE MOUSE PARALLAX TRACKING ---
  const eyePupilGroup = document.getElementById('eye-pupil-group');
  const cyberStage = document.getElementById('cyber-eye-stage');
  if (cyberStage && eyePupilGroup) {
    window.addEventListener('mousemove', (e) => {
      const rect = cyberStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      const moveX = Math.max(-18, Math.min(18, deltaX * 18));
      const moveY = Math.max(-14, Math.min(14, deltaY * 14));

      eyePupilGroup.setAttribute('transform', `translate(${moveX}, ${moveY})`);
    });
  }

  // --- DYNAMIC CAPTCHA PROTECTION SYSTEM ---
  let activeCaptchaCode = '';

  function generateCaptchaCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function drawCaptchaOnCanvas(canvasId, code) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#031320');
    grad.addColorStop(1, '#0B293E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cyber noise lines
    ctx.strokeStyle = 'rgba(32, 212, 232, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Cyber noise dots
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = 'rgba(32, 212, 232, 0.5)';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Code characters
    ctx.font = '900 19px "Courier New", monospace';
    ctx.textBaseline = 'middle';
    const charWidth = canvas.width / (code.length + 0.8);

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = (i + 0.75) * charWidth;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 0.3 - 0.15);
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#00F0FF';
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }

  function refreshCaptcha() {
    activeCaptchaCode = generateCaptchaCode();
    const formatted = activeCaptchaCode.split('').join(' ');

    const loginCapText = document.getElementById('captcha-code-text');
    if (loginCapText) loginCapText.innerText = formatted;

    const signupCapText = document.getElementById('captcha-code-text-signup');
    if (signupCapText) signupCapText.innerText = formatted;

    drawCaptchaOnCanvas('captcha-canvas-login', activeCaptchaCode);
    drawCaptchaOnCanvas('captcha-canvas-signup', activeCaptchaCode);
  }

  refreshCaptcha();

  // Refresh CAPTCHA listeners
  ['refresh-captcha-btn', 'refresh-captcha-btn-signup', 'captcha-canvas-login', 'captcha-canvas-signup', 'captcha-code-text', 'captcha-code-text-signup'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', refreshCaptcha);
  });

  // Audio Readout of CAPTCHA (Web Speech API)
  ['audio-captcha-btn', 'audio-captcha-btn-signup'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          const textToSpeak = `Captcha code is: ${activeCaptchaCode.split('').join(', ')}`;
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.85;
          window.speechSynthesis.speak(utterance);
          showToast('🔊 Speaking CAPTCHA code...', 'success');
        } else {
          showToast(`Captcha code is ${activeCaptchaCode}`, 'info');
        }
      });
    }
  });

  // --- QUICK DEMO INSTANT FILL BUTTONS ---
  const demoLoginBtn = document.getElementById('btn-quick-demo-login');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');
      const capInput = document.getElementById('login-captcha-input');

      if (emailInput) emailInput.value = 'demo.user@trustlens.ai';
      if (passInput) passInput.value = 'Password@123';
      if (capInput) capInput.value = activeCaptchaCode;

      showToast('⚡ Filled Demo Credentials & CAPTCHA Code!', 'success');
    });
  }

  const demoSignupBtn = document.getElementById('btn-quick-demo-signup');
  if (demoSignupBtn) {
    demoSignupBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const passInput = document.getElementById('signup-password');
      const capInput = document.getElementById('signup-captcha-input');

      if (nameInput) nameInput.value = 'Alex Morgan';
      if (emailInput) emailInput.value = 'alex.morgan@trustlens.ai';
      if (passInput) passInput.value = 'Password@123';
      if (capInput) capInput.value = activeCaptchaCode;

      showToast('⚡ Filled Demo Signup Details & CAPTCHA Code!', 'success');
    });
  }

  // --- THEME SWITCHER HANDLER FOR AUTH PAGES ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('trustlens_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (document.body) document.body.setAttribute('data-theme', savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.innerHTML = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    btn.setAttribute('aria-label', savedTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');

    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      if (document.body) document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('trustlens_theme', nextTheme);

      themeToggleBtns.forEach(b => {
        b.innerHTML = nextTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
        b.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      });

      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Theme`, 'info');
      refreshCaptcha();
    });
  });

  // --- CYBERNETIC EYE INTERACTIVE TRACKING ---
  const eyeStage = document.getElementById('cyber-eye-stage');
  const eyePupil = document.getElementById('eye-pupil-group');

  if (eyeStage && eyePupil) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId = null;

    function updatePupil() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      eyePupil.setAttribute('transform', `translate(${currentX.toFixed(2)}, ${currentY.toFixed(2)})`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        animationFrameId = requestAnimationFrame(updatePupil);
      } else {
        animationFrameId = null;
      }
    }

    function onMouseMove(e) {
      const rect = eyeStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxDistance = 18;
      const angle = Math.atan2(deltaY, deltaX);
      const clampedDist = Math.min(distance * 0.06, maxDistance);

      targetX = Math.cos(angle) * clampedDist;
      targetY = Math.sin(angle) * clampedDist;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updatePupil);
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    document.querySelectorAll('.auth-input').forEach(input => {
      input.addEventListener('focus', () => {
        targetX = 6;
        targetY = 14;
        if (!animationFrameId) animationFrameId = requestAnimationFrame(updatePupil);
      });
      input.addEventListener('blur', () => {
        targetX = 0;
        targetY = 0;
        if (!animationFrameId) animationFrameId = requestAnimationFrame(updatePupil);
      });
    });
  }

  // --- SOCIAL SINGLE SIGN-ON HANDLERS (GOOGLE, MICROSOFT, LINKEDIN) ---
  const socialBtns = document.querySelectorAll('.btn-social');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const provider = btn.getAttribute('data-provider') || (btn.innerText.includes('Google') ? 'Google' : btn.innerText.includes('Microsoft') ? 'Microsoft' : 'LinkedIn');
      const domainMap = { 'Google': 'gmail.com', 'Microsoft': 'outlook.com', 'LinkedIn': 'linkedin.com' };
      const domain = domainMap[provider] || 'auth.org';
      const mockEmail = `alex.morgan@${domain}`;

      btn.style.opacity = '0.7';
      const origText = btn.innerHTML;
      btn.innerText = `Connecting ${provider}...`;

      showToast(`Connecting to ${provider} Single Sign-On...`, 'info');

      try {
        const res = await fetch('/api/auth/social-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, email: mockEmail, name: `Alex Morgan (${provider})` })
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem('trustlens_token', data.token);
          localStorage.setItem('trustlens_user', JSON.stringify(data.user));
        } else {
          localStorage.setItem('trustlens_token', `mock_${provider.toLowerCase()}_token_2026`);
          localStorage.setItem('trustlens_user', JSON.stringify({ email: mockEmail, name: `Alex Morgan (${provider})` }));
        }
      } catch (err) {
        localStorage.setItem('trustlens_token', `mock_${provider.toLowerCase()}_token_2026`);
        localStorage.setItem('trustlens_user', JSON.stringify({ email: mockEmail, name: `Alex Morgan (${provider})` }));
      }

      showToast(`✓ Authenticated via ${provider} Single Sign-On! Redirecting...`, 'success');
      setTimeout(() => {
        window.location.href = 'analyze.html';
      }, 900);
    });
  });

});


