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
    subtitleEls.forEach(el => el.innerText = `⚡ Extracting text & running Gemini AI + ML Spam Detector...`);

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
        subtitleEls.forEach(el => el.innerText = `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Live AI Analysis Complete`);
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
      runAnalysisBtn.innerHTML = `⚡ Analyzing with Gemini AI...`;
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

    // 4. Update Audit Checklist & ML Spam Flags
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

      if (data.mlSpam && data.mlSpam.flaggedTokens && data.mlSpam.flaggedTokens.length > 0) {
        data.mlSpam.flaggedTokens.forEach(ft => {
          auditHTML += `
            <div class="audit-item flag">
              <span>
                <svg class="icon-svg icon-sm" viewBox="0 0 24 24" style="color:var(--coral-deep); margin-right:6px;"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                ML Model Spam Trigger: "${ft.token}" (Weight +${ft.weight})
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
      const points = (res.summary?.keyPoints || []).map(p => `<div style="font-size:0.85rem; font-weight:700; color:var(--green-dark);">✓ ${p}</div>`).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">📄 AI Document Summarization</h3>
          <span class="badge-pill-editorial" style="background:var(--green-surface); color:var(--green-dark);">✓ Live Summary</span>
        </div>
        <p style="font-size:0.95rem; color:var(--text-body); margin-bottom:16px; line-height:1.6;">${summaryText}</p>
        <div style="display:flex; flex-direction:column; gap:10px; background:var(--cream-bg); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          ${points || '<div style="font-size:0.85rem; color:var(--text-muted);">No key points extracted.</div>'}
        </div>
      `;
    } else if (taskKey === 'risk') {
      const suspiciousHTML = (res.risk?.suspiciousPoints || []).map(s => `
        <div style="background:var(--coral-bg); border-left:4px solid var(--coral-deep); padding:12px; border-radius:6px; font-size:0.88rem; font-weight:700; color:var(--coral-deep);">
          ⚠ ${s}
        </div>
      `).join('');

      taskOutputPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:var(--font-display); font-weight:800; font-size:1.3rem; color:var(--green-deep);">⚠️ Risk Analysis Engine</h3>
          <span class="badge-pill-editorial coral-theme" style="font-weight:800;">RISK SCORE: ${res.risk?.riskScore}/100 (${res.risk?.riskLevel})</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-body); margin-bottom:16px;">${res.risk?.recommendation || ''}</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${suspiciousHTML || '<div style="background:var(--green-surface); padding:12px; border-radius:6px; font-size:0.88rem; font-weight:700; color:var(--green-dark);">✓ No high risk threat indicators flagged.</div>'}
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
      const text = studioTextPaste ? studioTextPaste.value.trim() : (ocrTextDisplay ? ocrTextDisplay.innerText.trim() : '');
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

  // Render initial task mode
  renderDynamicTaskOutput('summary');

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

    try {
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111F15' : '#FFFFFF',
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
      exportBtns.forEach(btn => btn.style.visibility = 'visible');
    }
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

    // Hide export buttons temporarily
    const exportBtns = targetEl.querySelectorAll('.export-actions-group, .btn-export');
    exportBtns.forEach(btn => btn.style.visibility = 'hidden');

    try {
      const canvas = await html2canvas(targetEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF', // High contrast white background for clean PDF
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
      let position = margin + 15; // Offset for header banner

      // Header Banner
      pdf.setFillColor(6, 30, 14); // #061E0E
      pdf.rect(0, 0, pageWidth, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TRUSTLENS AI — DOCUMENT VERIFICATION REPORT', margin, 12);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 55, 12);

      // Render First Page
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, imgHeight);
      heightLeft -= (pageHeight - position - margin);

      // Additional pages if report exceeds 1 A4 page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.setFillColor(6, 30, 14);
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
      exportContainerToPDF('analysis-findings-panel', 'Single Verification Report', 'TrustLens_Verification_Report');
    });
  }
  if (pngStudioBtn) {
    pngStudioBtn.addEventListener('click', () => {
      exportContainerToPNG('analysis-findings-panel', 'TrustLens_Verification_Report');
    });
  }

  if (pdfCompareBtn) {
    pdfCompareBtn.addEventListener('click', () => {
      exportContainerToPDF('comparison-report-container', 'Document Comparison Report', 'TrustLens_Comparison_Report');
    });
  }
  if (pngCompareBtn) {
    pngCompareBtn.addEventListener('click', () => {
      exportContainerToPNG('comparison-report-container', 'TrustLens_Comparison_Report');
    });
  }

  if (pdfHomeBtn) {
    pdfHomeBtn.addEventListener('click', () => {
      exportContainerToPDF('task-output-panel', 'AI Analysis Summary', 'TrustLens_AI_Summary');
    });
  }
  if (pngHomeBtn) {
    pngHomeBtn.addEventListener('click', () => {
      exportContainerToPNG('task-output-panel', 'TrustLens_AI_Summary');
    });
  }

});




