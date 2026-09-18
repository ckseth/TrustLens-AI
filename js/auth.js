// TrustLens AI - Auth Controller & Client Session Management

document.addEventListener('DOMContentLoaded', () => {

  // 1. Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.auth-input-toggle-pass');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? `
          <svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.17c0-1.66-1.34-3-3-3l-.17.02z"/></svg>
        ` : `
          <svg class="icon-svg icon-sm" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        `;
      }
    });
  });

  // 2. Password Strength Meter (Signup Page)
  const passwordInput = document.getElementById('signup-password');
  const strengthFill = document.getElementById('strength-bar-fill');
  const strengthText = document.getElementById('strength-text-label');

  if (passwordInput && strengthFill && strengthText) {
    passwordInput.addEventListener('input', (e) => {
      const val = e.target.value;
      let score = 0;

      if (val.length >= 6) score += 1;
      if (val.length >= 10) score += 1;
      if (/[A-Z]/.test(val)) score += 1;
      if (/[0-9]/.test(val)) score += 1;
      if (/[^A-Za-z0-9]/.test(val)) score += 1;

      if (val.length === 0) {
        strengthFill.className = 'strength-bar-fill';
        strengthFill.style.width = '0%';
        strengthText.innerText = 'Password Strength';
      } else if (score <= 2) {
        strengthFill.className = 'strength-bar-fill weak';
        strengthText.innerText = 'Weak Password';
        strengthText.style.color = '#CC2929';
      } else if (score <= 4) {
        strengthFill.className = 'strength-bar-fill medium';
        strengthText.innerText = 'Medium Strength';
        strengthText.style.color = '#F59E0B';
      } else {
        strengthFill.className = 'strength-bar-fill strong';
        strengthText.innerText = 'Strong & Secure';
        strengthText.style.color = '#5CB860';
      }
    });
  }

  // 3. Login Form Submit Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const remember = document.getElementById('remember-me')?.checked;

      if (!email || !password) {
        showToast('Please fill in both email and password.', 'error');
        return;
      }

      const submitBtn = loginForm.querySelector('.btn-auth-submit');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
        Authenticating...
      `;

      setTimeout(() => {
        // Save user session
        const userObj = {
          name: email.split('@')[0],
          email: email,
          token: 'trustlens_jwt_sim_' + Math.random().toString(36).substring(2),
          loggedInAt: new Date().toISOString()
        };

        if (remember) {
          localStorage.setItem('trustlens_user', JSON.stringify(userObj));
        } else {
          sessionStorage.setItem('trustlens_user', JSON.stringify(userObj));
        }

        showToast(`Welcome back, ${userObj.name}! Redirecting...`, 'success');

        setTimeout(() => {
          window.location.href = 'analyze.html';
        }, 1200);
      }, 1000);
    });
  }

  // 4. Signup Form Submit Handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const agreeTerms = document.getElementById('agree-terms')?.checked;

      if (!fullName || !email || !password) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      if (!agreeTerms) {
        showToast('You must agree to the Terms of Service & Privacy Policy.', 'error');
        return;
      }

      const submitBtn = signupForm.querySelector('.btn-auth-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
        Creating Account...
      `;

      setTimeout(() => {
        const newUser = {
          name: fullName,
          email: email,
          token: 'trustlens_jwt_sim_' + Math.random().toString(36).substring(2),
          loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('trustlens_user', JSON.stringify(newUser));
        showToast(`Account created successfully! Welcome to TrustLens AI.`, 'success');

        setTimeout(() => {
          window.location.href = 'analyze.html';
        }, 1200);
      }, 1200);
    });
  }

  // 5. Social Auth Buttons Simulation
  const socialBtns = document.querySelectorAll('.btn-social');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const provider = btn.innerText.trim();
      showToast(`Connecting with ${provider}...`, 'success');

      setTimeout(() => {
        const userObj = {
          name: 'Verified User',
          email: 'user@trusted-domain.org',
          provider: provider,
          token: 'trustlens_sso_' + Math.random().toString(36).substring(2),
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('trustlens_user', JSON.stringify(userObj));
        window.location.href = 'analyze.html';
      }, 1000);
    });
  });

  // 6. Forgot Password Modal Logic
  const forgotBtn = document.getElementById('forgot-password-link');
  const modal = document.getElementById('forgot-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const forgotForm = document.getElementById('forgot-form');

  if (forgotBtn && modal) {
    forgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-email').value;
      if (email) {
        showToast(`Password reset link sent to ${email}`, 'success');
        if (modal) modal.classList.remove('open');
      }
    });
  }

  // 7. Toast Notification Utility
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : '⚠';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
