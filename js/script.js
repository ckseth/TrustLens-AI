// TrustLens AI - Frontend Controller

document.addEventListener('DOMContentLoaded', () => {

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

  // 5. File Upload Selection & Drag-and-Drop Handler
  const fileInput = document.getElementById('file-upload-input') || document.getElementById('studio-file-input');

  if (dropzone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFileSelected(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelected(e.target.files[0]);
      }
    });
  }

  function handleFileSelected(file) {
    const titleEl = document.querySelector('.dropzone-title');
    const subtitleEl = document.querySelector('.dropzone-subtitle');
    if (titleEl) titleEl.innerText = `Selected: ${file.name}`;
    if (subtitleEl) subtitleEl.innerText = `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis`;
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

});
