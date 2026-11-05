# TrustLens AI — Frontend Architecture

The **TrustLens AI** frontend is a high-performance, responsive single-page/multi-page web application engineered with vanilla HTML5, modern CSS3 (Custom Properties & Glassmorphism), and modular ES6+ JavaScript. It delivers zero-latency client-side interaction, adaptive dark/light themes, and seamless RESTful integration with the TrustLens AI backend.

---

## 1. Directory Structure

```text
frontend/
│
├── assets/                 # Static graphical assets & brand media
│   ├── images/             # Background textures (auth_bg.jpg) & iconography
│   └── logo/               # Vector & raster platform logomarks
├── css/
│   └── style.css           # Master stylesheet (theme tokens, components, responsive breakpoints)
├── js/
│   ├── main.js             # Global controller, theme switching, mobile drawer navigation
│   ├── auth.js             # MFA workflow, math CAPTCHA, 6-digit OTP modal, JWT management
│   ├── script.js           # Verification Studio, file upload dropzone, trust meter visualization
│   └── compare.js          # Document Comparison Studio, side-by-side diff highlighting engine
├── pages/
│   ├── login.html          # Adaptive Authentication Portal (Login, Register, OTP Verification)
│   ├── analyze.html        # Interactive Verification Studio (Document inspection, risk breakdown)
│   └── compare.html        # Document Comparison Engine (Dual-file upload, difference analysis)
├── index.html              # Main Landing Page (Hero showcase, quick scanner, platform features)
├── logo.png                # Official TrustLens AI high-resolution brandmark
├── robots.txt              # Search engine crawler indexing policies
├── sitemap.xml             # Academic project SEO sitemap definition
└── README.md               # Frontend documentation
```

---

## 2. Core Modules & User Interfaces

### 2.1 Landing Page (`index.html`)
- **Hero & Live Ingestion Bar**: Quick-paste text inspection bar enabling instant preliminary verification without account creation.
- **Platform Capability Pillars**: Card-based showcases for Document Summarization, Fraud Risk Detection, Source Verification, and Privacy Shield.
- **Workflow Pipeline ("How It Works")**: Step-by-step visual demonstration of the 4-tier verification lifecycle.

### 2.2 Adaptive Authentication Portal (`pages/login.html`)
- **Dual-Pane Interface**: Aesthetic brand showcase on the left; reactive auth form on the right.
- **Security Protections**: Dynamic client-side Math CAPTCHA preventing automated credential-stuffing attacks.
- **6-Digit Email OTP Modal**: Modal dialog triggered upon registration or suspicious device login to confirm email ownership via time-based OTP.
- **Device Fingerprinting**: Captures device identity for session risk profiling.

### 2.3 Verification Studio (`pages/analyze.html`)
- **Multi-Format Dropzone**: Supports `.pdf`, `.docx`, `.txt`, `.png`, and `.jpg` file ingestion.
- **Dynamic Trust Meter**: Interactive SVG radial gauge displaying real-time Trust Score (0–100%).
- **Multi-Pillar Inspection Tabs**:
  - *Executive Summary*: Key points, deadlines, and numerical figures.
  - *Fraud & Risk Analysis*: Phishing indicators, suspicious links, and urgent language penalties.
  - *Privacy Shield*: Detected PII entities (SSN, emails, phone numbers, tax IDs) masked with asterisks.
  - *Interactive Q&A*: Natural-language query interface querying document contents.

### 2.4 Document Compare Engine (`pages/compare.html`)
- **Dual-Document Dropzones**: Ingest original reference document alongside suspect/revised file.
- **Side-by-Side Visual Diff**: Text synchronization highlighting deletions (red), additions (green), and modifications.
- **Similarity Percentage Index**: Levenshtein / Jaccard similarity index computation.

---

## 3. Client-Side Engineering Specifications

- **Design System**: Midnight Navy (`#0A192F`), Card Navy (`#112240`), Electric Cyan (`#06B6D4`), Deep Teal (`#0D9488`), and Coral Alert (`#F43F5E`).
- **Typography**: Inter / system UI font stack with high-contrast legibility.
- **Theme Support**: Seamless dark/light theme toggling with preference persistence in `localStorage`.
- **API Communication**: Relative `fetch()` requests routing transparently through the backend server (e.g., `/api/auth/*`, `/api/analysis/*`).

