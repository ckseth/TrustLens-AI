# TrustLens AI — Backend Architecture & REST Services

The **TrustLens AI** backend is a modular, high-throughput Node.js & Express REST application implementing a multi-tier document verification lifecycle, automated fraud detection, heuristic risk scoring, Privacy Shield PII redaction, and an empirical Multinomial Naive Bayes machine learning classifier.

---

## 1. Directory Structure

```text
backend/
│
├── config/
│   └── db.js               # MongoDB connection manager (Mongoose ODM with offline resilience)
├── controllers/
│   ├── authController.js       # User registration, login, JWT issuance, 6-digit OTP, device trust
│   ├── analysisController.js   # Live document verification, fraud scoring, entity scanning
│   ├── documentController.js   # Document persistence, retrieval, metadata indexing
│   ├── comparisonController.js # Dual-file diff engine & similarity calculation
│   └── privacyController.js    # Dedicated PII extraction and redaction endpoints
├── middleware/
│   ├── authMiddleware.js       # Bearer JWT verification & authenticated user context (`protect`)
│   ├── errorMiddleware.js      # Centralized 404 & JSON error serialization
│   └── uploadMiddleware.js     # Multer file ingestion (PDF, DOCX, TXT, PNG, JPG; 25MB limit)
├── models/
│   ├── User.js                 # User schema (bcrypt salt, MFA OTP, trusted devices, roles)
│   ├── Document.js             # Document metadata schema (checksum, extracted text, owner)
│   └── Analysis.js             # Comprehensive audit record (trust score, risks, entities, ML verdict)
├── routes/
│   ├── authRoutes.js           # `/api/auth/*` authentication endpoints
│   ├── documentRoutes.js       # `/api/documents/*` document management endpoints
│   ├── analysisRoutes.js       # `/api/analysis/*` live verification & AI endpoints
│   ├── comparisonRoutes.js     # `/api/comparison/*` dual-document diff endpoints
│   └── privacyRoutes.js        # `/api/privacy/*` Privacy Shield PII endpoints
├── services/
│   ├── mlService.js            # Multinomial Naive Bayes classifier (TF-IDF + Laplace smoothing)
│   ├── extractionService.js    # Multi-format parser (pdf-parse, mammoth, tesseract.js OCR)
│   ├── privacyService.js       # Privacy Shield PII detection (Regex + contextual redaction)
│   ├── emailService.js         # Nodemailer OTP delivery with Ethereal dev account fallback
│   └── aiService.js            # External LLM integration for semantic summarization & Q&A
├── uploads/                    # Temporary staged ingestion directory
├── server.js                   # Application entry point, Express pipeline, dynamic port fallback
├── package.json                # Backend dependency manifest
├── .env.example                # Environment variables specification
└── README.md                   # Backend documentation
```

---

## 2. Core REST API Endpoints

### 2.1 Health Check
- `GET /api/health` — Confirms server responsiveness and operational status.

### 2.2 Authentication & MFA (`/api/auth`)
- `POST /api/auth/register` — Register a new account; dispatches 6-digit OTP to user email.
- `POST /api/auth/verify-otp` — Validate 6-digit OTP and activate account.
- `POST /api/auth/login` — Authenticate credentials, verify CAPTCHA, issue signed JWT.
- `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` — Request a time-limited password reset and set a new password.
- `POST /api/auth/resend-otp` — Re-issue fresh 6-digit OTP code.
- `GET /api/auth/security-activity` — Retrieve active sessions, login history, and trusted devices.
- `POST /api/auth/revoke-device` — Revoke authorization for an untrusted device.

### 2.3 Document Verification & Analysis (`/api/analysis`)
- `POST /api/analysis/direct` — Live instant verification of raw text payload (no file upload required).
- `POST /api/analysis/upload-direct` — Multi-format file upload and synchronous full verification pipeline.
- `POST /api/analysis/summarize/:documentId` — Generate executive bullet points and key dates/amounts.
- `POST /api/analysis/risk/:documentId` — Compute multi-factor risk score (0–100) and identify red flags.
- `POST /api/analysis/claims/:documentId` — Extract factual claims and evaluate verifiability.
- `POST /api/analysis/ask/:documentId` — Natural-language document interrogation (RAG QA).

### 2.4 Document Comparison (`/api/comparison`)
- `POST /api/comparison/diff` — Compare two uploaded documents or text snippets, returning character/line-level diffs and Jaccard similarity index.

### 2.5 Privacy Shield (`/api/privacy`)
- `POST /api/privacy/redact` — Extract sensitive PII (SSNs, emails, phone numbers, tax IDs) and return masked safe text.

---

## 3. Verification Engine & Machine Learning

The local verification engine operates without requiring external paid APIs:
- **Multinomial Naive Bayes Classifier**: Trained on empirical samples of legitimate versus phishing/spam documents. Employs Laplace smoothing ($\alpha = 1.0$) and TF-IDF feature weighting to assign spam probabilities.
- **Rule-Based Heuristic Engine**: Penalizes aggressive urgency ("immediate compliance", "account suspended"), financial coercion, unverified bank routing tokens, and non-authoritative URL redirects.
- **Privacy Shield Engine**: Recognizes international phone formats, tax identifiers, email addresses, and replaces sensitive sequences with cryptographically masked representations (`NOTI***E`).
- **Resilient Static Serving**: Automatically hosts the client web application from `../frontend` while maintaining unified relative routing.

## Local Demo Login

With MongoDB running and `backend/.env` configured, seed a verified, non-admin demo user:

```bash
npm run seed:demo --prefix backend
```

The Quick Demo Login button uses `demo.user@trustlens.ai` / `Password@123` and submits the form automatically. This public credential is for local demo/testing only; do not seed it in production.
