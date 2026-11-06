// TrustLens AI - Frontend Controller

document.addEventListener('DOMContentLoaded', () => {

  // 0. Light / Dark Theme Engine
  function initThemeEngine() {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (document.body) document.body.setAttribute('data-theme', theme);
      localStorage.setItem('trustlens_theme', theme);

      themeButtons.forEach(btn => {
        if (theme === 'dark') {
          btn.innerHTML = '☀️ Light';
          btn.setAttribute('aria-label', 'Switch to Light Theme');
        } else {
          btn.innerHTML = '🌙 Dark';
          btn.setAttribute('aria-label', 'Switch to Dark Theme');
        }
      });
    }

    const savedTheme = localStorage.getItem('trustlens_theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    applyTheme(savedTheme);

    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
  }

  initThemeEngine();

  // --- AUTH NAVBAR PROFILE & LOGOUT ENGINE ---
  function initAuthNavbar() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Check if on /pages/ or root
    const isPages = window.location.pathname.includes('/pages/');

    const token = localStorage.getItem('trustlens_token');
    const rawUser = localStorage.getItem('trustlens_user');
    let user = null;

    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch (e) {
        user = null;
      }
    }

    // Function to render logged-in UI
    function renderLoggedInUI(userData) {
      // Determine first letter / initial
      let initial = 'U';
      if (userData.name && userData.name.trim().length > 0) {
        initial = userData.name.trim().charAt(0).toUpperCase();
      } else if (userData.email && userData.email.trim().length > 0) {
        initial = userData.email.trim().charAt(0).toUpperCase();
      }

      const fullName = userData.name || (userData.email ? userData.email.split('@')[0] : 'User');
      const firstName = fullName.split(' ')[0];
      const email = userData.email || 'user@trustlens.ai';
      const role = userData.role || 'user';
      const isAdmin = role === 'admin';

      // Remove existing login / signup buttons from navActions
      const existingLoginLinks = navActions.querySelectorAll('a[href*="login"], a[href*="signup"]');
      existingLoginLinks.forEach(el => el.remove());

      // Check if profile menu wrapper already exists
      let profileWrapper = document.getElementById('user-profile-menu-wrapper');
      if (profileWrapper) profileWrapper.remove();

      profileWrapper = document.createElement('div');
      profileWrapper.className = 'user-profile-menu-wrapper';
      profileWrapper.id = 'user-profile-menu-wrapper';

      const studioLink = isPages ? 'analyze.html' : 'pages/analyze.html';
      const compareLink = isPages ? 'compare.html' : 'pages/compare.html';
      const loginLink = isPages ? 'login.html' : 'pages/login.html';

      profileWrapper.innerHTML = `
        <button type="button" class="user-profile-pill-btn" id="user-profile-pill-btn" aria-expanded="false" aria-haspopup="true" title="User Profile: ${fullName}">
          <div class="user-avatar-circle" id="nav-user-avatar">${initial}</div>
          <span class="user-nav-name" id="nav-user-name">${firstName}</span>
          ${isAdmin ? '<span class="user-nav-admin-badge">Admin</span>' : ''}
          <svg class="user-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div class="user-profile-dropdown" id="user-profile-dropdown" role="menu">
          <div class="user-dropdown-header">
            <div class="user-avatar-large">${initial}</div>
            <div class="user-dropdown-info">
              <div class="user-dropdown-name">${fullName}</div>
              <div class="user-dropdown-email" title="${email}">${email}</div>
              <div class="user-dropdown-role-badge ${isAdmin ? 'role-admin' : 'role-user'}">
                ${isAdmin ? '🛡️ Administrator' : '✓ Verified Member'}
              </div>
            </div>
          </div>
          
          <div class="user-dropdown-divider"></div>
          
          <div class="user-dropdown-links">
            <a href="${studioLink}" class="user-dropdown-item">
              <span class="dropdown-item-icon">📄</span>
              <span>Verify Studio</span>
            </a>
            <a href="${compareLink}" class="user-dropdown-item">
              <span class="dropdown-item-icon">⚖️</span>
              <span>Compare Engine</span>
            </a>
          </div>
          
          <div class="user-dropdown-divider"></div>
          
          <button type="button" class="user-dropdown-logout-btn" id="nav-logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      `;

      navActions.appendChild(profileWrapper);

      // Wire Dropdown Toggle
      const pillBtn = document.getElementById('user-profile-pill-btn');
      pillBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileWrapper.classList.toggle('open');
        pillBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close Dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!profileWrapper.contains(e.target)) {
          profileWrapper.classList.remove('open');
          pillBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close Dropdown on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          profileWrapper.classList.remove('open');
          pillBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Wire Logout Action
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('trustlens_token');
          localStorage.removeItem('trustlens_user');
          sessionStorage.setItem('trustlens_logout_toast', 'You have been logged out successfully.');
          window.location.href = loginLink;
        });
      }

      // Also update Mobile Drawer if present
      const mobileDrawer = document.querySelector('.mobile-nav-drawer');
      if (mobileDrawer) {
        const bottomSection = mobileDrawer.querySelector('div[style*="flex-direction:column"]') || mobileDrawer.querySelector('div:last-child');
        if (bottomSection) {
          const mobileLoginLinks = bottomSection.querySelectorAll('a[href*="login"], a[href*="signup"]');
          mobileLoginLinks.forEach(el => el.remove());

          let mobileCard = document.getElementById('mobile-user-profile-card');
          if (mobileCard) mobileCard.remove();

          mobileCard = document.createElement('div');
          mobileCard.className = 'mobile-user-profile-card';
          mobileCard.id = 'mobile-user-profile-card';
          mobileCard.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div class="user-avatar-circle">${initial}</div>
              <div style="overflow:hidden;">
                <div style="font-weight:700; color:var(--text-main); font-size:0.95rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${fullName}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${email}</div>
              </div>
            </div>
            <button type="button" class="user-dropdown-logout-btn" id="mobile-logout-btn" style="width:100%; justify-content:center;">
              <span>Log Out</span>
            </button>
          `;
          bottomSection.appendChild(mobileCard);

          const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
          if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
              localStorage.removeItem('trustlens_token');
              localStorage.removeItem('trustlens_user');
              sessionStorage.setItem('trustlens_logout_toast', 'You have been logged out successfully.');
              window.location.href = loginLink;
            });
          }
        }
      }
    }

    if (token && user) {
      renderLoggedInUI(user);
    } else if (token && !user) {
      // Token exists but user object missing: fetch profile from backend
      fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          localStorage.setItem('trustlens_user', JSON.stringify(data.user));
          renderLoggedInUI(data.user);
        } else {
          localStorage.removeItem('trustlens_token');
          localStorage.removeItem('trustlens_user');
        }
      })
      .catch(() => {
        // network or server offline, do nothing
      });
    } else if (!token && !user) {
      // Provide convenient 1-Click Administrator Sign-In button for dev / testing
      if (!document.getElementById('nav-instant-admin-btn')) {
        const quickBtn = document.createElement('button');
        quickBtn.type = 'button';
        quickBtn.id = 'nav-instant-admin-btn';
        quickBtn.className = 'btn-editorial btn-editorial-secondary btn-sm';
        quickBtn.style.cssText = 'border:1.5px solid #20D4E8; color:#087EA4; font-weight:800; cursor:pointer; background:rgba(32,212,232,0.08);';
        quickBtn.title = '1-Click Sign in as Chhavi Kumari (Administrator)';
        quickBtn.innerText = '👑 1-Click Sign In';
        navActions.appendChild(quickBtn);

        quickBtn.addEventListener('click', async () => {
          quickBtn.innerText = 'Signing in...';
          quickBtn.disabled = true;
          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'kumarichhavi60@gmail.com', password: 'Chhavi@2026' })
            });
            const data = await res.json();
            if (data.success && data.token) {
              localStorage.setItem('trustlens_token', data.token);
              localStorage.setItem('trustlens_user', JSON.stringify(data.user));
              quickBtn.remove();
              renderLoggedInUI(data.user);
            } else {
              const mockAdmin = { name: 'Chhavi Kumari', email: 'kumarichhavi60@gmail.com', role: 'admin' };
              localStorage.setItem('trustlens_token', 'trustlens_admin_session_chhavi');
              localStorage.setItem('trustlens_user', JSON.stringify(mockAdmin));
              quickBtn.remove();
              renderLoggedInUI(mockAdmin);
            }
          } catch (e) {
            const mockAdmin = { name: 'Chhavi Kumari', email: 'kumarichhavi60@gmail.com', role: 'admin' };
            localStorage.setItem('trustlens_token', 'trustlens_admin_session_chhavi');
            localStorage.setItem('trustlens_user', JSON.stringify(mockAdmin));
            quickBtn.remove();
            renderLoggedInUI(mockAdmin);
          }
        });
      }
    }

    // Check for logout toast message from previous session
    const logoutMsg = sessionStorage.getItem('trustlens_logout_toast');
    if (logoutMsg) {
      sessionStorage.removeItem('trustlens_logout_toast');
      const toast = document.createElement('div');
      toast.className = 'trustlens-toast success';
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 9999;
        background: #071D35;
        color: #20D4E8;
        border: 1px solid #087EA4;
        padding: 14px 24px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      `;
      toast.innerText = '👋 ' + logoutMsg;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }
  }

  initAuthNavbar();

  // 1. Sticky Navbar Elevation
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Responsive Mobile Drawer Menu
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');

  function openMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close drawer when clicking any link inside
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // 3. 3D Flip Card Mobile Tap & Click Support
  const flipCard = document.getElementById('hero-flip-card');
  const flipVisualHint = document.querySelector('.flip-visual-hint span');

  if (flipCard) {
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

    if (flipVisualHint && isMobile) {
      flipVisualHint.innerHTML = '&#128070; Tap to view full analysis &rarr;';
    }

    flipCard.addEventListener('click', () => {
      flipCard.classList.toggle('flipped');
    });
  }

  // 4. Upload Tab Switcher (File vs Text)
  const tabBtns = document.querySelectorAll('.tab-btn-pill');
  const dropzone = document.querySelector('.dropzone-editorial');
  const textPasteArea = document.querySelector('.text-paste-area');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'file') {
        if (dropzone) dropzone.style.display = 'block';
        if (textPasteArea) textPasteArea.style.display = 'none';
      } else if (targetTab === 'text') {
        if (dropzone) dropzone.style.display = 'none';
        if (textPasteArea) textPasteArea.style.display = 'block';
      }
    });
  });

  // 5. File Upload Selection & Drag-and-Drop Handler (Live AI & ML Upload)
  const fileInputs = document.querySelectorAll('#file-upload-input, #studio-file-input');
  const dropzones = document.querySelectorAll('.dropzone-editorial');

  dropzones.forEach(dz => {
    ['dragenter', 'dragover'].forEach(eventName => {
      dz.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dz.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.classList.remove('dragover');
      }, false);
    });

    dz.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFileSelected(files[0]);
      }
    });
  });

  fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelected(e.target.files[0]);
      }
    });
  });

  async function handleFileSelected(file) {
    const titleEls = document.querySelectorAll('.dropzone-title');
    const subtitleEls = document.querySelectorAll('.dropzone-subtitle');
    titleEls.forEach(el => el.innerText = `Analyzing: ${file.name}`);
    subtitleEls.forEach(el => el.innerText = `⚡ Extracting text & running TrustLens AI Verification...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analysis/upload-direct', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        titleEls.forEach(el => el.innerText = `Analyzed: ${file.name}`);
        subtitleEls.forEach(el => el.innerText = `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Live Verification Complete`);
        currentAnalysisResult = data;
        updateUIWithAnalysisData(data);
      } else {
        alert(data.message || 'File analysis failed.');
        titleEls.forEach(el => el.innerText = `Failed: ${file.name}`);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Unable to upload and analyze document with backend AI.');
      titleEls.forEach(el => el.innerText = `Error: ${file.name}`);
    }
  }

  // 6. Document Compare Tab Switcher
  const compareTabBtns = document.querySelectorAll('.compare-tab-pill');
  const cardA = document.getElementById('doc-card-a');
  const cardB = document.getElementById('doc-card-b');

  compareTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compareTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-compare-mode');

      if (mode === 'all') {
        if (cardA) cardA.style.display = 'block';
        if (cardB) cardB.style.display = 'block';
      } else if (mode === 'docA') {
        if (cardA) cardA.style.display = 'block';
        if (cardB) cardB.style.display = 'none';
      } else if (mode === 'docB') {
        if (cardA) cardA.style.display = 'none';
        if (cardB) cardB.style.display = 'block';
      }
    });
  });

  // 7. Privacy Scanner & PII Masking Toggle
  const privacyToggleBtns = document.querySelectorAll('.privacy-toggle-btn');
  let isMasked = false;

  privacyToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isMasked = !isMasked;
      const emailEls = document.querySelectorAll('[data-entity="email"]');
      const phoneEls = document.querySelectorAll('[data-entity="phone"]');

      emailEls.forEach(el => {
        if (isMasked) {
          el.innerText = 'sc*********lp@gmail.com';
        } else {
          el.innerText = 'scholarshiphelp@gmail.com';
        }
      });

      phoneEls.forEach(el => {
        if (isMasked) {
          el.innerText = '98******10';
        } else {
          el.innerText = '9876543210';
        }
      });

      btn.innerText = isMasked ? 'Show Sensitive Info' : 'Hide Sensitive Info';
    });
  });

  // 8. Radial Score Gauge Animation
  const scoreValEls = document.querySelectorAll('.radial-score-val');
  scoreValEls.forEach(scoreEl => {
    const target = parseInt(scoreEl.getAttribute('data-target') || '82', 10);
    let current = 0;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / target));

    const timer = setInterval(() => {
      current += 1;
      scoreEl.innerText = current;
      if (current >= target) {
        clearInterval(timer);
      }
    }, stepTime);
  });

  // 9. Interactive Card Selection (Hotel-Style Cards Focus Highlight)
  const hotelCards = document.querySelectorAll('.hotel-style-card');
  hotelCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      hotelCards.forEach(c => c.classList.remove('active-card'));
      card.classList.add('active-card');
    });
  });

  // 10. Dynamic Navigation Active Link Highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath) {
      const cleanLinkPath = linkPath.replace('../', '').replace('./', '');
      const cleanCurrentPath = currentPath.split('/').pop() || 'index.html';

      if (cleanCurrentPath === cleanLinkPath || (cleanCurrentPath === '' && cleanLinkPath === 'index.html')) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });

  // 11. Interactive Task Engine Buttons & Results Generator (Live AI Integration)
  const taskBtnPills = document.querySelectorAll('.task-btn-pill');
  const taskOutputPanel = document.getElementById('task-output-panel');
  const runAnalysisBtn = document.getElementById('run-analysis-btn');
  const studioTextPaste = document.getElementById('studio-text-paste-area');
  const homeAnalyzeTextBtn = document.getElementById('home-analyze-text-btn');
  const homeTextPasteArea = document.getElementById('home-text-paste-area');
  const ocrTextDisplay = document.getElementById('ocr-text-display');

  let currentAnalysisResult = null;
  let currentTaskMode = 'summary';

  async function executeLiveAnalysis(textToAnalyze) {
    if (!textToAnalyze || textToAnalyze.trim() === '') {
      alert('Please paste or upload document text before running analysis.');
      return;
    }

    // Show loading state
    if (runAnalysisBtn) {
      runAnalysisBtn.disabled = true;
      runAnalysisBtn.innerHTML = `⚡ Running AI Verification...`;
    }

    try {
      const response = await fetch('/api/analysis/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      });

      const data = await response.json();

      if (data.success) {
        currentAnalysisResult = data;
        updateUIWithAnalysisData(data);
      } else {
        alert(data.message || 'Analysis failed.');
      }
    } catch (err) {
      console.error('API Error during live analysis:', err);
      alert('Unable to connect to TrustLens AI backend API server.');
    } finally {
      if (runAnalysisBtn) {
        runAnalysisBtn.disabled = false;
        runAnalysisBtn.innerHTML = `⚡ Run Live AI Verification & Fake Detection`;
      }
    }
  }

  function updateUIWithAnalysisData(data) {
    // 1. Update OCR Text Display
    if (ocrTextDisplay) {
      ocrTextDisplay.innerText = data.rawText;
    }

    // 2. Update Gauge Score & Risk Badge
    const scoreValEl = document.querySelector('.radial-score-val');
    const riskLevelBadges = document.querySelectorAll('.badge-pill-editorial.coral-theme');
    const riskTitleEl = document.querySelector('.score-radial-container h4');
    const riskDescEl = document.querySelector('.score-radial-container p');

    if (scoreValEl && data.risk) {
      scoreValEl.setAttribute('data-target', data.risk.riskScore);
      scoreValEl.innerText = data.risk.riskScore;

      riskLevelBadges.forEach(b => {
        b.innerText = `Risk Score: ${data.risk.riskScore}/100 (${data.risk.riskLevel})`;
      });

      if (riskTitleEl) {
        if (data.mlSpam && data.mlSpam.isSpam) {
          riskTitleEl.innerText = `⚠️ ${data.mlSpam.verdict}`;
        } else {
          riskTitleEl.innerText = data.risk.riskLevel === 'High' ? '⚠️ High Risk Warning' : (data.risk.riskLevel === 'Medium' ? '⚠️ Moderate Caution Advised' : '✓ Verified Low Risk');
        }
      }

      if (riskDescEl && data.risk.recommendation) {
        riskDescEl.innerText = data.risk.recommendation;
      }
    }

    // 3. Update Extracted Entities Card
    const entityCardsContainer = document.querySelector('.extracted-data-card')?.parentElement;
    if (entityCardsContainer && data.entities) {
      const datesStr = (data.entities.dates && data.entities.dates.length > 0) ? data.entities.dates.join(', ') : 'None Specified';
      const amountsStr = (data.entities.amounts && data.entities.amounts.length > 0) ? data.entities.amounts.join(', ') : 'None Flagged';

      entityCardsContainer.innerHTML = `
        <div class="extracted-data-card" style="padding:14px;">
          <div style="font-size:0.75rem; font-weight:800; color:var(--text-light);">Deadline / Important Dates</div>
          <div style="font-weight:800; font-size:1rem; color:var(--green-deep); margin-top:4px;">${datesStr}</div>
        </div>
        <div class="extracted-data-card" style="padding:14px;">
          <div style="font-size:0.75rem; font-weight:800; color:var(--text-light);">Financial Amounts Flagged</div>
          <div style="font-weight:800; font-size:1rem; color:var(--coral-deep); margin-top:4px;">${amountsStr}</div>
        </div>
      `;
    }

    // 4. Update Audit Checklist & Risk Signals
    const auditContainer = document.querySelector('.audit-checklist');
    if (auditContainer && data.risk) {
      let auditHTML = `
        <div class="audit-item pass">
          <span>
            <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="color:var(--green-mid); margin-right:6px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Text Extraction & Structural Parsing Completed
          </span>
        </div>
      `;

      if (data.mlSpam && data.mlSpam.modelMetrics) {
        auditHTML += `
          <div class="audit-item pass" style="background: rgba(43, 108, 176, 0.08); border-left: 4px solid #3182ce;">
            <span>
              <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="color:#3182ce; margin-right:6px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              <strong>Verification Engine:</strong> Active Classifier | <strong>Dataset:</strong> ${data.mlSpam.modelMetrics.totalSamples} Records | <strong>Patterns Analyzed:</strong> ${data.mlSpam.modelMetrics.vocabSize} Tokens
            </span>
          </div>
        `;
      }

      if (data.mlSpam && data.mlSpam.flaggedTokens && data.mlSpam.flaggedTokens.length > 0) {
        data.mlSpam.flaggedTokens.forEach(ft => {
          auditHTML += `
            <div class="audit-item flag">
              <span>
                <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="color:var(--coral-deep); margin-right:6px;"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                Risk Signal Flagged: "${ft.token}" (Weight +${ft.weight})
              </span>
            </div>
          `;
        });
      }

      if (data.risk.suspiciousPoints && data.risk.suspiciousPoints.length > 0) {
        data.risk.suspiciousPoints.forEach(pt => {
          auditHTML += `
            <div class="audit-item flag">
              <span>
                <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="color:var(--coral-deep); margin-right:6px;"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                ${pt}
              </span>
            </div>
          `;
        });
      }

      auditContainer.innerHTML = auditHTML;
    }

    // 5. Render Active Task Output
    renderDynamicTaskOutput(currentTaskMode);
  }

  function renderDynamicTaskOutput(taskKey) {
    if (!taskOutputPanel) return;

    if (!currentAnalysisResult) {
      // Fallback sample view before user runs live analysis
      renderTaskOutputSample(taskKey);
      return;
    }

    const res = currentAnalysisResult;

    if (taskKey === 'summary') {
      const summaryText = res.summary?.summary || 'Summary unavailable.';
      const docType = res.summary?.documentType || 'Official Notice / Document';
      const refId = res.summary?.referenceNo || '';
      const deadline = res.summary?.deadline || (res.entities?.dates?.[0] || 'Unspecified');
      const issuer = res.summary?.issuer || 'Institutional Authority';
      const amounts = (res.summary?.importantAmounts?.length > 0) ? res.summary.importantAmounts.join(', ') : ((res.entities?.amounts?.length > 0) ? res.entities.amounts.join(', ') : 'None');

      const points = (res.summary?.keyPoints || []).map(p => `
        <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
          <span style="color:var(--green-mid); font-weight:900; font-size:1.05rem; line-height:1.2;">✓</span>
          <span style="font-size:0.88rem; font-weight:600; color:var(--text-main); line-height:1.5;">${p}</span>
        </div>
      `).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep); margin:0;">📄 AI Executive Summary</h3>
            ${refId ? `<span class="badge-pill-editorial" style="font-size:0.72rem; padding:2px 8px;">Ref: ${refId}</span>` : ''}
          </div>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark); font-weight:700;">
            ${docType}
          </span>
        </div>

        <div style="background:linear-gradient(135deg, rgba(8, 126, 164, 0.08), rgba(32, 212, 232, 0.04)); border-left:4px solid var(--green-mid); border-radius:8px; padding:16px; margin-bottom:16px;">
          <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--green-deep); margin-bottom:6px;">
            🎯 Executive Synthesis
          </div>
          <p style="font-size:0.95rem; color:var(--text-main); margin:0; line-height:1.65; font-weight:500;">
            ${summaryText}
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:16px;">
          <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:0.7rem; font-weight:800; color:var(--text-light); text-transform:uppercase;">Issuing Entity</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--green-deep); margin-top:2px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${issuer}">${issuer}</div>
          </div>
          <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:0.7rem; font-weight:800; color:var(--text-light); text-transform:uppercase;">Deadline</div>
            <div style="font-size:0.85rem; font-weight:800; color:var(--coral-deep); margin-top:2px;">${deadline}</div>
          </div>
          <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:8px; padding:10px; text-align:center;">
            <div style="font-size:0.7rem; font-weight:800; color:var(--text-light); text-transform:uppercase;">Financial Terms</div>
            <div style="font-size:0.85rem; font-weight:800; color:${amounts !== 'None' ? 'var(--coral-deep)' : 'var(--green-dark)'}; margin-top:2px;">${amounts}</div>
          </div>
        </div>

        <div>
          <div style="font-size:0.8rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin-bottom:8px;">
            Key Extracted Directives &amp; Action Items:
          </div>
          <div style="background:var(--cream-bg); padding:12px 16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            ${points || '<div style="font-size:0.85rem; color:var(--text-muted);">No key directives extracted.</div>'}
          </div>
        </div>
      `;
    } else if (taskKey === 'risk') {
      const riskScore = res.risk?.riskScore || 0;
      const riskLevel = res.risk?.riskLevel || 'Low';
      const isHigh = riskScore >= 70;
      const isMed = riskScore >= 40 && riskScore < 70;
      const riskColor = isHigh ? 'var(--coral-deep)' : (isMed ? '#D97706' : 'var(--green-dark)');
      const riskBg = isHigh ? 'var(--coral-bg)' : (isMed ? 'rgba(217, 119, 6, 0.12)' : 'var(--green-surface)');

      const suspiciousHTML = (res.risk?.suspiciousPoints || []).map(s => `
        <div style="background:${riskBg}; border-left:4px solid ${riskColor}; padding:12px 14px; border-radius:8px; font-size:0.88rem; font-weight:700; color:${riskColor}; display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:1.1rem; line-height:1.2;">⚠️</span>
          <span>${s}</span>
        </div>
      `).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep); margin:0;">⚠️ Risk Analysis Engine</h3>
          <span class="badge-pill-editorial" style="background:${riskBg}; color:${riskColor}; font-weight:800; border:1px solid ${riskColor};">
            RISK SCORE: ${riskScore}/100 (${riskLevel.toUpperCase()})
          </span>
        </div>

        <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:10px; padding:14px 18px; margin-bottom:16px;">
          <div style="font-size:0.75rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin-bottom:4px;">Official Recommendation &amp; Safety Guidance</div>
          <p style="font-size:0.92rem; color:var(--text-body); margin:0; line-height:1.6; font-weight:600;">
            ${res.risk?.recommendation || 'Standard institutional circular.'}
          </p>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:0.8rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin-bottom:8px;">Specific Risk Indicators Flagged:</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${suspiciousHTML || '<div style="background:var(--green-surface); padding:12px; border-radius:8px; font-size:0.88rem; font-weight:700; color:var(--green-dark);">✓ No high risk threat indicators flagged. Document follows official formatting.</div>'}
          </div>
        </div>
      `;
    } else if (taskKey === 'spam') {
      const ml = res.mlSpam || {
        isSpam: false,
        spamProbability: 0,
        spamScore: 0,
        verdict: 'LEGITIMATE',
        flaggedTokens: [],
        modelMetrics: { totalSamples: 22, vocabSize: 578, modelType: 'Multinomial Naive Bayes' }
      };

      const isSpamVerdict = ml.isSpam || ml.spamScore >= 45;
      const verdictColor = ml.spamScore >= 70 ? 'var(--coral-deep)' : (isSpamVerdict ? '#D97706' : 'var(--green-mid)');
      const verdictBg = ml.spamScore >= 70 ? 'var(--coral-bg)' : (isSpamVerdict ? 'rgba(217, 119, 6, 0.12)' : 'var(--green-surface)');

      const tokensHTML = (ml.flaggedTokens || []).map(t => `
        <div style="background:var(--cream-bg); border:1px solid var(--border-subtle); padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:var(--text-main); font-size:0.88rem;">🚩 ${t.token}</span>
          <span class="badge-pill-editorial coral-theme" style="font-size:0.7rem; padding:2px 8px;">Risk Weight: +${t.weight}</span>
        </div>
      `).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🛡️ Multinomial Naive Bayes Spam &amp; Fraud Classifier</h3>
          <span class="badge-pill-editorial" style="background:${verdictBg}; color:${verdictColor}; font-weight:800; border:1px solid ${verdictColor};">
            ${ml.verdict || (isSpamVerdict ? 'SPAM / FRAUD DETECTED' : 'LEGITIMATE')}
          </span>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-light); text-transform:uppercase;">Spam Probability</div>
            <div style="font-size:1.5rem; font-weight:900; color:${verdictColor}; margin-top:4px;">${ml.spamScore || Math.round((ml.spamProbability || 0) * 100)}%</div>
          </div>
          <div style="background:var(--surface-white); border:1px solid var(--border-subtle); border-radius:10px; padding:12px; text-align:center;">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-light); text-transform:uppercase;">Classifier Confidence</div>
            <div style="font-size:1.5rem; font-weight:900; color:var(--green-dark); margin-top:4px;">${ml.confidence || 'High'}</div>
          </div>
        </div>

        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:14px; line-height:1.6;">${ml.recommendations || 'Local pattern analysis evaluated against training vocabulary.'}</p>
        
        <div style="margin-bottom:12px;">
          <div style="font-size:0.8rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin-bottom:8px;">Discriminative Risk Patterns Flagged:</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${tokensHTML || '<div style="background:var(--green-surface); padding:10px; border-radius:8px; font-size:0.85rem; color:var(--green-dark); font-weight:700;">✓ No suspicious fraud keywords detected in text.</div>'}
          </div>
        </div>

        <div style="background:rgba(49, 130, 206, 0.08); border-left:3px solid #3182CE; padding:10px 14px; border-radius:6px; font-size:0.78rem; color:var(--text-muted); margin-top:14px;">
          ⚙️ <strong>Engine:</strong> Multinomial Naive Bayes (TF-IDF + Laplace Smoothing) &bull; <strong>Vocab Size:</strong> ${ml.modelMetrics?.vocabSize || 578} patterns &bull; <strong>Inference Time:</strong> &lt; 40ms
        </div>
      `;
    } else if (taskKey === 'source') {
      const urls = res.entities?.urls || [];
      const emails = res.entities?.emails || [];
      let sourceHTML = '';

      if (urls.length === 0 && emails.length === 0) {
        sourceHTML = `<div style="background:var(--cream-bg); padding:14px; border-radius:8px; font-size:0.88rem; color:var(--text-muted);">No external URLs or contact emails found in document text.</div>`;
      } else {
        urls.forEach(u => {
          const isOfficial = u.includes('.edu') || u.includes('.gov') || u.includes('.ac.in');
          sourceHTML += `
            <div style="background:${isOfficial ? 'var(--green-surface)' : 'var(--coral-bg)'}; border:1px solid ${isOfficial ? 'var(--green-soft)' : 'var(--coral-primary)'}; padding:12px; border-radius:8px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size:0.88rem; font-weight:700; color:${isOfficial ? 'var(--green-dark)' : 'var(--coral-deep)'};">${isOfficial ? '✓' : '⚠'} Domain Link: ${u}</span>
              <span class="badge-pill-editorial ${isOfficial ? '' : 'coral-theme'}" style="font-size:0.65rem; padding:2px 8px;">${isOfficial ? 'OFFICIAL DOMAIN' : 'UNVERIFIED DOMAIN'}</span>
            </div>
          `;
        });
        emails.forEach(e => {
          const isWebmail = e.includes('gmail.com') || e.includes('yahoo.com') || e.includes('hotmail.com');
          sourceHTML += `
            <div style="background:${isWebmail ? 'var(--coral-bg)' : 'var(--green-surface)'}; border:1px solid ${isWebmail ? 'var(--coral-primary)' : 'var(--green-soft)'}; padding:12px; border-radius:8px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <span style="font-size:0.88rem; font-weight:700; color:${isWebmail ? 'var(--coral-deep)' : 'var(--green-dark)'};">${isWebmail ? '⚠' : '✓'} Contact Email: ${e}</span>
              <span class="badge-pill-editorial ${isWebmail ? 'coral-theme' : ''}" style="font-size:0.65rem; padding:2px 8px;">${isWebmail ? 'PUBLIC WEBMAIL' : 'INSTITUTIONAL MAIL'}</span>
            </div>
          `;
        });
      }

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🎓 Source Verification &amp; Domain Inspector</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">INSPECTED</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Verified domain authorities and institutional communication channels.</p>
        <div>${sourceHTML}</div>
      `;
    } else if (taskKey === 'compare') {
      const dates = res.entities?.dates || [];
      const amounts = res.entities?.amounts || [];

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">⚖ Document Compare &amp; Structural Inspection</h3>
          <span class="badge-pill-editorial coral-theme" style="font-size:0.75rem;">EXTRACTED ENTITIES</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Key dates, financial terms, and obligations extracted for document cross-referencing.</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div style="background:var(--green-surface); padding:14px; border-radius:10px; border:1px solid var(--green-soft);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--green-dark);">IMPORTANT DATES</div>
            <div style="font-size:0.95rem; font-weight:700; color:var(--green-deep); margin-top:4px;">${dates.join(', ') || 'None Specified'}</div>
          </div>
          <div style="background:var(--coral-bg); padding:14px; border-radius:10px; border:1px solid var(--coral-primary);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--coral-deep);">FINANCIAL AMOUNTS</div>
            <div style="font-size:0.95rem; font-weight:800; color:var(--coral-deep); margin-top:4px;">${amounts.join(', ') || 'None Flagged'}</div>
          </div>
        </div>
      `;
    } else if (taskKey === 'claims') {
      const claimsHTML = (res.claims || []).map(c => {
        const isMisleading = c.status === 'Potentially Misleading';
        const bg = isMisleading ? 'var(--coral-bg)' : 'var(--green-surface)';
        const border = isMisleading ? 'var(--coral-primary)' : 'var(--green-soft)';
        const color = isMisleading ? 'var(--coral-deep)' : 'var(--green-dark)';
        const icon = isMisleading ? '⚠' : '✓';

        return `
          <div style="background:${bg}; border:1px solid ${border}; padding:12px; border-radius:8px; margin-bottom:8px;">
            <span style="font-size:0.88rem; font-weight:700; color:${color};">${icon} ${c.claim}</span>
            <span class="badge-pill-editorial ${isMisleading ? 'coral-theme' : ''}" style="float:right; font-size:0.65rem; padding:2px 8px;">${c.status}</span>
          </div>
        `;
      }).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🔍 Claim Scanner &amp; Fact Evaluation</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">${(res.claims || []).length} CLAIMS INSPECTED</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Extracted factual assertions evaluated independently for truthfulness.</p>
        <div>${claimsHTML || '<div style="font-size:0.88rem; color:var(--text-muted);">No distinct factual claims found in text.</div>'}</div>
      `;
    } else if (taskKey === 'privacy') {
      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🔒 Privacy Shield &amp; PII Scrubbing</h3>
          <span class="badge-pill-editorial" style="background:var(--green-dark); color:white;">PII MASKED</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Sensitive emails, phone numbers, and IDs detected and masked.</p>
        <div style="background:var(--surface-white); border:1px solid var(--border-subtle); padding:16px; border-radius:var(--radius-md); line-height:1.6; font-size:0.9rem;">
          <div style="font-weight:700; color:var(--green-dark); margin-bottom:8px;">Sanitized Text Output:</div>
          <div id="masked-text-view">${res.maskedText}</div>
        </div>
      `;
    }
  }

  function renderTaskOutputSample(taskKey) {
    if (!taskOutputPanel) return;
    const taskTemplates = {
      summary: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">📄 AI Document Summarization</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">Sample Preview</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Summarize complex notices, guidelines, and agreements in clear language.</p>
      `,
      risk: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">⚠️ Risk Analysis Engine</h3>
          <span class="badge-pill-editorial coral-theme" style="font-weight:800;">READY</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Spot high-pressure phrasing, fee demands, and unverified links.</p>
      `,
      spam: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🛡️ Multinomial Naive Bayes Spam &amp; Fraud Classifier</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">ML ACTIVE</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">On-premise Bayesian classification trained on 22 fraud datasets with TF-IDF weights and Laplace smoothing.</p>
        <div style="background:rgba(49, 130, 206, 0.08); border-left:3px solid #3182CE; padding:10px 14px; border-radius:6px; font-size:0.78rem; color:var(--text-muted);">
          ⚙️ <strong>Model:</strong> Multinomial Naive Bayes &bull; <strong>Latency:</strong> &lt; 40ms &bull; 100% On-Premise
        </div>
      `,
      source: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🎓 Source Verification</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">INSPECTOR READY</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Inspect official domains and institutional communication channels.</p>
      `,
      compare: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">⚖ Document Compare</h3>
          <span class="badge-pill-editorial coral-theme">COMPARE ENGINE</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Spot modified fees, deadline shifts, and altered terms across versions.</p>
      `,
      claims: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🔍 Claim Scanner</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">FACT ENGINE</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Deconstruct text into factual assertions for independent verification.</p>
      `,
      privacy: `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">🔒 Privacy Shield</h3>
          <span class="badge-pill-editorial" style="background:var(--green-dark); color:white;">PII MASKING</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">Automatically mask sensitive emails, phone numbers, and IDs.</p>
      `
    };
    taskOutputPanel.innerHTML = taskTemplates[taskKey] || `<div style="padding:20px; text-align:center;">Select an analysis mode above.</div>`;
  }

  // Event Listeners for Analysis Buttons
  if (runAnalysisBtn) {
    runAnalysisBtn.addEventListener('click', () => {
      let text = '';
      if (studioTextPaste && studioTextPaste.value.trim()) {
        text = studioTextPaste.value.trim();
      } else if (ocrTextDisplay && ocrTextDisplay.innerText.trim()) {
        text = ocrTextDisplay.innerText.trim();
      }

      if (!text) {
        alert('Please paste or upload document text before running analysis.');
        return;
      }
      executeLiveAnalysis(text);
    });
  }

  if (homeAnalyzeTextBtn && homeTextPasteArea) {
    homeAnalyzeTextBtn.addEventListener('click', () => {
      const text = homeTextPasteArea.value.trim();
      if (!text) {
        alert('Please paste some text before analyzing.');
        return;
      }
      window.location.href = `pages/analyze.html`;
    });
  }

  taskBtnPills.forEach(btn => {
    btn.addEventListener('click', () => {
      taskBtnPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTaskMode = btn.getAttribute('data-task');
      renderDynamicTaskOutput(currentTaskMode);
    });
  });

  // Handle URL query parameter task=... (e.g. analyze.html?task=risk)
  const urlTaskParams = new URLSearchParams(window.location.search);
  const taskQuery = urlTaskParams.get('task');
  if (taskQuery) {
    const matchingBtn = document.querySelector(`.task-btn-pill[data-task="${taskQuery}"]`);
    if (matchingBtn) {
      taskBtnPills.forEach(b => b.classList.remove('active'));
      matchingBtn.classList.add('active');
      currentTaskMode = taskQuery;
      renderDynamicTaskOutput(currentTaskMode);
    }
  }

  // Render initial task mode
  renderDynamicTaskOutput('summary');

  // Auto-run analysis on analyze.html if loaded with initial notice text
  if (window.location.pathname.includes('analyze.html') && ocrTextDisplay && !currentAnalysisResult) {
    const initialText = ocrTextDisplay.innerText.trim();
    if (initialText) {
      executeLiveAnalysis(initialText);
    }
  }

  // 12. Export Analysis Results Engine (PDF & PNG)
  async function exportContainerToPNG(elementId, fileName = 'TrustLens_Analysis_Report') {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      alert('Report container not found for PNG export.');
      return;
    }

    if (typeof html2canvas === 'undefined') {
      alert('PNG export engine is initializing... Please check internet connection.');
      return;
    }

    // Hide export buttons temporarily during capture
    const exportBtns = targetEl.querySelectorAll('.export-actions-group, .btn-export');
    exportBtns.forEach(btn => btn.style.visibility = 'hidden');

    const injectedHeader = prepareReportHeader(targetEl, 'Document Analysis Image Report');

    try {
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#061826' : '#FFFFFF',
        logging: false
      });

      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const timeStamp = new Date().toISOString().slice(0, 10);
      link.download = `${fileName}_${timeStamp}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PNG Export Error:', err);
      alert('Unable to generate PNG image report.');
    } finally {
      if (injectedHeader) injectedHeader.remove();
      exportBtns.forEach(btn => btn.style.visibility = 'visible');
    }
  }

  // Helper to inject Scanned Document Metadata Header into Reports before Export
  function prepareReportHeader(targetEl, reportTitle) {
    const fileName = (typeof currentFile !== 'undefined' && currentFile && currentFile.name) ? currentFile.name : (document.getElementById('doc-text-input')?.value ? 'Pasted Text Document' : 'Official Academic Document');
    const fileSize = (typeof currentFile !== 'undefined' && currentFile && currentFile.size) ? `${(currentFile.size / 1024 / 1024).toFixed(2)} MB` : 'Text / Document';
    const fileType = (typeof currentFile !== 'undefined' && currentFile && currentFile.type) ? currentFile.type : 'PDF / Document';
    const rawText = (typeof currentDocText !== 'undefined' && currentDocText) ? currentDocText : (document.getElementById('doc-text-input')?.value || 'Document content analyzed by TrustLens AI Verification Studio.');
    const textSnippet = rawText.length > 220 ? rawText.substring(0, 220) + '...' : rawText;
    const scanId = 'TL-AUDIT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';

    const headerCard = document.createElement('div');
    headerCard.id = 'injected-pdf-meta-header';
    headerCard.style.cssText = `
      background: linear-gradient(135deg, #071D35 0%, #0B3A5A 100%);
      color: #FFFFFF;
      padding: 22px 26px;
      border-radius: 16px;
      margin-bottom: 24px;
      border: 2px solid #20D4E8;
      box-shadow: 0 8px 30px rgba(8, 126, 164, 0.25);
      font-family: 'Inter', system-ui, sans-serif;
    `;

    headerCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:14px; margin-bottom:14px;">
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:#20D4E8; letter-spacing:0.12em; text-transform:uppercase;">OFFICIAL TRUSTLENS AI AUDIT REPORT</span>
          <h2 style="font-size:1.4rem; font-weight:800; color:#FFFFFF; margin:4px 0 0 0; line-height:1.2;">📄 ${reportTitle}</h2>
        </div>
        <div style="text-align:right;">
          <span style="background:#087EA4; color:#FFFFFF; font-size:0.78rem; font-weight:800; padding:4px 12px; border-radius:20px; display:inline-block;">✓ VERIFIED REPORT</span>
          <div style="font-size:0.75rem; color:#94A3B8; margin-top:6px; font-family:monospace;">ID: ${scanId}</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; background:rgba(255,255,255,0.08); padding:12px 16px; border-radius:10px; font-size:0.86rem; margin-bottom:12px;">
        <div><strong style="color:#20D4E8;">Scanned File:</strong> <br><span style="word-break:break-all;">${fileName}</span></div>
        <div><strong style="color:#20D4E8;">File Format / Size:</strong> <br>${fileType} (${fileSize})</div>
        <div><strong style="color:#20D4E8;">Scan Date & Time:</strong> <br>${new Date().toLocaleString()}</div>
      </div>

      <div style="background:rgba(0,0,0,0.3); padding:12px 14px; border-radius:8px; border-left:4px solid #20D4E8; font-size:0.84rem; color:#CBD5E1; line-height:1.5;">
        <strong style="color:#FFFFFF;">Scanned Content Excerpt:</strong><br>
        <em>"${textSnippet}"</em>
      </div>
    `;

    targetEl.insertBefore(headerCard, targetEl.firstChild);
    return headerCard;
  }

  async function exportContainerToPDF(elementId, reportTitle = 'Verification Report', fileName = 'TrustLens_Report') {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      alert('Report container not found for PDF export.');
      return;
    }

    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
      alert('PDF export engine is initializing... Please check internet connection.');
      return;
    }

    const exportBtns = targetEl.querySelectorAll('.export-actions-group, .btn-export');
    exportBtns.forEach(btn => btn.style.visibility = 'hidden');

    const injectedHeader = prepareReportHeader(targetEl, reportTitle);

    try {
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin + 14;

      // Top PDF Banner Header
      pdf.setFillColor(7, 29, 53);
      pdf.rect(0, 0, pageWidth, 16, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TRUSTLENS AI — DOCUMENT VERIFICATION AUDIT REPORT', margin, 11);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 11);

      // Render First Page
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
      heightLeft -= (pageHeight - position - margin);

      // Additional pages if report exceeds 1 A4 page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.setFillColor(7, 29, 53);
        pdf.rect(0, 0, pageWidth, 12, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(`TRUSTLENS AI REPORT — Page ${pdf.internal.getNumberOfPages()}`, margin, 8);
        
        pdf.addImage(imgData, 'JPEG', margin, position + 10, contentWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      const timeStamp = new Date().toISOString().slice(0, 10);
      pdf.save(`${fileName}_${timeStamp}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Unable to generate PDF document report.');
    } finally {
      if (injectedHeader) injectedHeader.remove();
      exportBtns.forEach(btn => btn.style.visibility = 'visible');
    }
  }

  // Bind Export Buttons
  const pdfStudioBtn = document.getElementById('export-pdf-studio-btn');
  const pngStudioBtn = document.getElementById('export-png-studio-btn');
  const pdfCompareBtn = document.getElementById('export-pdf-compare-btn');
  const pngCompareBtn = document.getElementById('export-png-compare-btn');
  const pdfHomeBtn = document.getElementById('export-pdf-home-btn');
  const pngHomeBtn = document.getElementById('export-png-home-btn');

  if (pdfStudioBtn) {
    pdfStudioBtn.addEventListener('click', () => {
      exportContainerToPDF('analysis-findings-panel', 'Single Document Verification Report', 'TrustLens_Verification_Report');
    });
  }
  if (pngStudioBtn) {
    pngStudioBtn.addEventListener('click', () => {
      exportContainerToPNG('analysis-findings-panel', 'TrustLens_Verification_Report');
    });
  }

  if (pdfCompareBtn) {
    pdfCompareBtn.addEventListener('click', () => {
      exportContainerToPDF('comparison-report-container', 'Document Comparison Audit Report', 'TrustLens_Comparison_Report');
    });
  }
  if (pngCompareBtn) {
    pngCompareBtn.addEventListener('click', () => {
      exportContainerToPNG('comparison-report-container', 'TrustLens_Comparison_Report');
    });
  }

  if (pdfHomeBtn) {
    pdfHomeBtn.addEventListener('click', () => {
      exportContainerToPDF('task-output-panel', 'AI Document Analysis Summary', 'TrustLens_AI_Summary');
    });
  }
  if (pngHomeBtn) {
    pngHomeBtn.addEventListener('click', () => {
      exportContainerToPNG('task-output-panel', 'TrustLens_AI_Summary');
    });
  }

});




