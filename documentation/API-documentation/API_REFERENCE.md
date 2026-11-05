# TrustLens AI — Comprehensive REST API Reference

All requests accept and return JSON unless otherwise noted (`multipart/form-data` for file uploads).

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Route**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify the 6-digit OTP sent to your email.",
    "email": "jane@example.com"
  }
  ```

### 1.2 OTP Verification
- **Route**: `POST /api/auth/verify-otp`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "otp": "891266"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Email verified successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### 1.3 User Login
- **Route**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "captchaAnswer": "14"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "6724fa10b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

---

## 2. Verification & Analysis Endpoints (`/api/analysis`)

### 2.1 Direct Live Text Analysis
- **Route**: `POST /api/analysis/direct`
- **Request Body**:
  ```json
  {
    "text": "URGENT NOTICE: Your account has been suspended! Click http://phish-bank.com to verify."
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "rawText": "URGENT NOTICE: Your account has been suspended!...",
    "maskedText": "URGENT NOTI***E: Your account has been suspended!...",
    "privacy": { "detected": true, "count": 1, "items": [...] },
    "entities": { "urls": ["http://phish-bank.com"], "emails": [], "phones": [] },
    "mlSpam": {
      "isSpam": true,
      "spamProbability": 1.0,
      "spamScore": 100,
      "verdict": "HIGH PROBABILITY SPAM / FRAUD",
      "modelMetrics": {
        "modelType": "Multinomial Naive Bayes (TF-IDF + Laplace Smoothing)",
        "trainingAccuracy": "95.4%"
      }
    },
    "risk": {
      "riskScore": 60,
      "riskLevel": "Medium",
      "suspiciousPoints": ["High-pressure or urgent language detected."]
    }
  }
  ```

### 2.2 Direct File Upload & Verification
- **Route**: `POST /api/analysis/upload-direct`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (Supports `.pdf`, `.docx`, `.txt`, `.png`, `.jpg`)
- **Response** (`200 OK`): Full verification object identical to 2.1 with OCR text extraction.

---

## 3. Document Comparison Endpoints (`/api/comparison`)

### 3.1 Dual-Document Diff
- **Route**: `POST /api/comparison/diff`
- **Request Body**:
  ```json
  {
    "originalText": "Standard agreement clause 4.1.",
    "modifiedText": "Modified agreement clause 4.1 with added penalty."
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "similarity": 82.5,
    "differences": [
      { "type": "equal", "value": "Standard agreement clause 4.1" },
      { "type": "add", "value": " with added penalty." }
    ]
  }
  ```

---

## 4. Privacy Shield Endpoints (`/api/privacy`)

### 4.1 Standalone PII Redaction
- **Route**: `POST /api/privacy/redact`
- **Request Body**:
  ```json
  {
    "text": "Contact user at john.doe@securecorp.com or +1 (555) 019-2834."
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "original": "Contact user at john.doe@securecorp.com or +1 (555) 019-2834.",
    "redacted": "Contact user at j***@securecorp.com or +1 (555) ***-2834.",
    "detectedEntities": 2
  }
  ```

