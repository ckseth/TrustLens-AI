# TrustLens AI — Intelligent Document Verification, Fraud Detection, and Risk Analysis Platform

[![Platform](https://img.shields.io/badge/Platform-Node.js%20%7C%20Express-087EA4.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Machine Learning](https://img.shields.io/badge/ML-Multinomial%20Naive%20Bayes-FF6F00.svg)](https://scikit-learn.org/)
[![UI](https://img.shields.io/badge/UI-HTML5%20%2F%20CSS3%20%2F%20ES6+-E34F26.svg)](./frontend)
[![Report](https://img.shields.io/badge/Academic%20Report-52%20Pages%20DOCX-2B579A.svg)](./TrustLens_AI_Project_Report.docx)

---

## Academic Context & Attribution

- **Project Title**: TrustLens AI – Intelligent Document Verification, Fraud Detection, and Risk Analysis Platform
- **Candidate Name**: Chhavi Kumari
- **University Identifier (UID)**: `25MCA20323`
- **Class / Section**: `25MCA-1A`
- **Project Supervisor**: Ms. Indu Sharma (Assistant Professor)
- **Head of Department**: Dr. Amanpreet Kaur Sandhu (Professor & HOD)
- **Department**: University Institute of Computing (UIC)
- **Institution**: Chandigarh University, Gharuan, Mohali, Punjab
- **Academic Program**: Master of Computer Applications (Session 2025–2027)
- **Submission Date**: October 2026

---

## 1. Project Overview

**TrustLens AI** is an enterprise-grade academic verification platform engineered to detect fraudulent documents, identify phishing threats, evaluate multi-factor compliance risks, sanitize confidential personally identifiable information (PII), and provide explainable document intelligence without relying exclusively on expensive cloud APIs.

### Key Capabilities
1. **Multi-Format Document Ingestion**: Ingests `.pdf`, `.docx`, `.txt`, `.png`, and `.jpg` documents via drag-and-drop dropzones with integrated OCR text extraction.
2. **Local Machine Learning Classifier**: Implements a self-contained **Multinomial Naive Bayes classifier with Laplace smoothing ($\alpha = 1.0$) and TF-IDF term weighting**, achieving 95.4% baseline classification accuracy for malicious versus benign text.
3. **Multi-Factor Risk Scoring Engine**: Calculates an explainable **Trust Score (0–100%)** combining ML fraud probability, high-pressure urgency penalties, financial coercion flags, and non-authoritative domain redirects.
4. **Privacy Shield PII Redaction**: Automatically extracts sensitive entities (SSNs, tax IDs, credit cards, emails, international phone numbers) and produces contextually redacted representations (`NOTI***E`) to safeguard data privacy.
5. **Document Diff & Comparison Studio**: Performs dual-document side-by-side alignment with Levenshtein and Jaccard similarity indices, highlighting insertions, deletions, and modifications.
6. **Adaptive Multi-Factor Authentication (MFA)**: Protects user accounts via bcrypt-salted passwords, dynamic Math CAPTCHA verification, time-based 6-digit email OTP dispatch, and device fingerprint tracking.

---

## 2. System Architecture

```text
+-------------------------------------------------------------------------+
|                         PRESENTATION TIER                               |
|   Responsive Single-Page Application (HTML5, Glassmorphism CSS3, ES6+)  |
|   - Verification Studio   - Document Compare Engine   - MFA Auth Portal  |
+------------------------------------+------------------------------------+
                                     | HTTP / REST (JSON)
+------------------------------------v------------------------------------+
|                         APPLICATION API TIER                            |
|             Node.js & Express.js High-Throughput REST Engine            |
|   - Auth / JWT Middleware - Multer File Ingest  - Resilient Static Svc  |
+------------------------------------+------------------------------------+
                                     |
         +---------------------------+---------------------------+
         |                                                       |
+--------v-----------------------+     +-------------------------v--------+
|    VERIFICATION & ML TIER      |     |           DATA TIER              |
| - Multinomial Naive Bayes (NB) |     | MongoDB Document Store (Mongoose)|
| - TF-IDF Vectorizer + Smoothing|     | - User Accounts & OTP Records    |
| - Privacy Shield PII Redactor  |     | - Document Metadata & Audit Logs |
| - Heuristic Risk Scoring Rule  |     | - Verification History & Diff    |
+--------------------------------+     +----------------------------------+
```

---

## 3. Directory Structure

```text
TrustLensAI/
│
├── frontend/                       # Client-Side Application Code & UI Assets
│   ├── assets/                     # Graphical backgrounds & brand images
│   ├── css/                        # Responsive stylesheet (dark/light themes)
│   ├── js/                         # ES6+ Controllers (auth, studio, compare)
│   ├── pages/                      # HTML views (login.html, analyze.html, compare.html)
│   ├── index.html                  # Main landing page & hero verification dropzone
│   ├── logo.png                    # High-resolution brandmark
│   ├── robots.txt & sitemap.xml    # SEO & web crawler manifests
│   └── README.md                   # Frontend architecture documentation
│
├── backend/                        # Node.js / Express Server & REST Services
│   ├── config/                     # Database connection manager (db.js)
│   ├── controllers/                # Request handlers (auth, analysis, comparison, docs)
│   ├── middleware/                 # JWT protection, Multer upload, error handlers
│   ├── models/                     # Mongoose database schemas (User, Document, Analysis)
│   ├── routes/                     # Express route modules (/api/auth, /api/analysis, etc.)
│   ├── services/                   # ML Naive Bayes, Privacy Shield, OCR, Nodemailer
│   ├── uploads/                    # Temporary staged file uploads
│   ├── server.js                   # Server entrypoint with resilient port fallback
│   ├── package.json                # Server npm dependencies manifest
│   ├── .env.example                # Configuration template
│   └── README.md                   # Backend REST API documentation
│
├── report-assets/                  # Official Master Report Visual Figures
│   ├── diagrams/                   # 14 Publication Architectural & UML Diagrams (300 DPI)
│   ├── screenshots/                # 7 Cropped Core Interface Screenshots (Chapter 4)
│   ├── interface-images/           # 6 Full-Page Panoramic App Views (Appendix A)
│   ├── other-figures/              # Institutional CU & UIC logos and Brandmark
│   └── README.md                   # Figure mapping table to the 70-page report
│
├── documentation/                  # Project Specifications & Deliverables
│   ├── API-documentation/          # Comprehensive REST API reference guide
│   ├── project-documentation/      # University Worksheet 5 evaluation deliverable
│   ├── technical-notes/            # Engineering development notes
│   └── README.md                   # Documentation index
│
├── tests/                          # Empirical Quality Assurance & Benchmark Data
│   ├── test_data/                  # 28 PDF and Image test documents & benchmark logs
│   │   └── qa_test_results.json    # 73 Structured empirical test case records
│   ├── run_tests.py                # Automated test results evaluation script
│   └── README.md                   # QA methodology & coverage breakdown
│
├── scripts/                        # Automation & Document Build Pipelines
│   ├── generate_modern_styled_diagrams.py  # High-DPI diagram generator
│   ├── generate_engineering_diagrams.py    # Alternative ANSI engineering schematics
│   ├── build_full_document.py              # Master academic docx compiler
│   ├── build_52page_report.py              # Calibrated 52-page document builder
│   ├── process_user_images.py              # Image cropping & optimization utility
│   ├── seedAdmin.js                        # Admin database seeder
│   └── README.md                           # Script execution guide
│
├── archive/                        # Historical Staging & Version Archives
│   ├── legacy_assets/              # Extracted assets from early docx builds
│   ├── legacy_scripts/             # Superseded diagnostic scripts
│   ├── temp_docx/                  # Interim working drafts
│   └── README.md                   # Archive manifest
│
├── .gitignore                      # Git exclusion rules
├── package.json                    # Root npm workspace shortcuts
├── README.md                       # Master project overview & guide (this file)
└── TrustLens_AI_Project_Report.docx # Final 52-Page Academic Project Report
```

---

## 4. Installation & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local Community Server (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI
- **Python**: 3.10+ (required for regenerating diagrams or building the Word report)

### 4.1 Clone Repository & Install Dependencies
```bash
git clone https://github.com/Ashu16nov/Smart-City-Portal-_Minor-Project.git TrustLensAI
cd TrustLensAI
npm install --prefix backend
```

### 4.2 Configure Environment Variables
Copy `.env.example` in `backend/` to `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5000
MONGODB_URI=mongodb://127.0.0.1:27017/trustlens
JWT_SECRET=trustlens_ai_jwt_secret_key_2026_secure
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="TrustLens AI <your_email@gmail.com>"
```

For Gmail, enable 2-Step Verification and create an App Password; use it as `EMAIL_PASS`. Do not use your regular Gmail password. Restart the backend after editing `backend/.env`. Without real email credentials, TrustLens uses an Ethereal test mailbox: messages are **not delivered** to your inbox, and the preview URL is printed in the backend terminal.

### 4.3 Start the Application
For local Quick Demo Login, seed the non-admin demo account once before starting:
```bash
npm run seed:demo --prefix backend
```
Demo credentials: `demo.user@trustlens.ai` / `Password@123`. Do not seed this public demo credential in production.

Run the root startup command:
```bash
npm start
```
*(Or navigate to backend directory: `cd backend && npm start`)*

The server will initialize the Naive Bayes machine learning classifier, connect to MongoDB, and automatically bind to port `5000` (or gracefully fallback to `5001` if port 5000 is occupied).

### 4.4 Access the Application in Browser
Open your browser and navigate to:
```text
http://localhost:5000/
```
*(Or `http://localhost:5001/` if running on the fallback port).*

---

## 5. Core REST API Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Ping and health check status | Public |
| `POST` | `/api/auth/register` | Register new account and send 6-digit OTP | Public |
| `POST` | `/api/auth/verify-otp` | Validate email OTP and activate account | Public |
| `POST` | `/api/auth/login` | Login with credentials and dynamic math CAPTCHA | Public |
| `POST` | `/api/analysis/direct` | Live instant text verification & fraud scoring | Public |
| `POST` | `/api/analysis/upload-direct` | Multi-format file upload and full verification pipeline | Public |
| `POST` | `/api/comparison/diff` | Side-by-side dual document diff & similarity analysis | Public |
| `POST` | `/api/privacy/redact` | Context-aware PII entity detection and masking | Public |
| `POST` | `/api/analysis/ask/:id` | Natural language interrogation on verified document | Authenticated |

---

## 6. Empirical Verification & Quality Assurance

TrustLens AI was evaluated across **73 empirical test cases** spanning 13 functional domains, covering nominal inputs, malicious exploits, malformed boundaries, and encryption edge-cases:

```bash
python tests/run_tests.py
```

### Empirical Test Results Summary
- **Total Test Cases**: 73
- **Passed Scenarios**: 40 (Nominal, functional, and security boundary cases)
- **Evaluated Stress Conditions**: 33 (Corrupted PDFs, encrypted files, low optical contrast benchmarks)
- **Authentication & Authorization**: 100% Pass rate on protected endpoints
- **Privacy Shield Redaction**: 100% Success on detecting international PII tokens
- **Document Compare Engine**: 100% Deterministic precision on differential character tracking

---

## 7. Report Visual Assets Mapping

All diagrams and interface captures used in the official 70-page project report are systematically filed in `report-assets/`:

- **Figure 3.1 Flowchart**: [`report-assets/diagrams/figure-3-1-flowchart.png`](./report-assets/diagrams/figure-3-1-flowchart.png)
- **Figure 3.2 System Architecture**: [`report-assets/diagrams/figure-3-2-system-architecture.png`](./report-assets/diagrams/figure-3-2-system-architecture.png)
- **Figure 3.3 ER Diagram**: [`report-assets/diagrams/figure-3-3-entity-relationship.png`](./report-assets/diagrams/figure-3-3-entity-relationship.png)
- **Figure 3.4 DFD Level 0**: [`report-assets/diagrams/figure-3-4-dfd-level-0.png`](./report-assets/diagrams/figure-3-4-dfd-level-0.png)
- **Figure 3.5 DFD Level 1**: [`report-assets/diagrams/figure-3-5-dfd-level-1.png`](./report-assets/diagrams/figure-3-5-dfd-level-1.png)
- **Figure 3.6 DFD Level 2**: [`report-assets/diagrams/figure-3-6-dfd-level-2.png`](./report-assets/diagrams/figure-3-6-dfd-level-2.png)
- **Figure 3.7 UML Use Case**: [`report-assets/diagrams/figure-3-7-use-case-diagram.png`](./report-assets/diagrams/figure-3-7-use-case-diagram.png)
- **Figure 3.8 UML Sequence**: [`report-assets/diagrams/figure-3-8-sequence-diagram.png`](./report-assets/diagrams/figure-3-8-sequence-diagram.png)
- **Figure 4.1–4.8 Screenshots**: [`report-assets/screenshots/`](./report-assets/screenshots/)
- **Appendix Full Views**: [`report-assets/interface-images/`](./report-assets/interface-images/)
- **Institutional Logos**: [`report-assets/other-figures/`](./report-assets/other-figures/)

For the complete figure mapping table, refer to [`report-assets/README.md`](./report-assets/README.md).

---

## 8. Final Academic Project Report

The complete academic mini-project report formatted strictly in accordance with Chandigarh University requirements is located in the root directory:

📄 **[`TrustLens_AI_Project_Report.docx`](./TrustLens_AI_Project_Report.docx)**

- **Target Page Count**: Calibrated 52-Page Academic Report
- **Font & Hierarchy**: Pure Black (`#000000`), Times New Roman, 1.5 line spacing, justified body paragraphs
- **Headings Structure**: 16pt Bold (Chapters), 14pt Bold (Sections), 12pt Bold (Subsections)
- **Integrated High-DPI Visuals**: 300 DPI publication architecture cards and cropped UI figures

---

## 9. License & Academic Integrity

This project was developed for the Master of Computer Applications (MCA) Degree program at the University Institute of Computing (UIC), Chandigarh University. All rights reserved &copy; 2026.
