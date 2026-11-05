# TrustLens AI — Empirical Test Suite & Verification Data

This directory houses the empirical quality assurance test assets, baseline documents, mock files, and automated evaluation metrics for **TrustLens AI**.

---

## 1. Directory Structure

```text
tests/
│
├── test_data/                      # Corpus of 28 evaluation test documents & benchmark logs
│   ├── 01_normal_academic.pdf          # Clean academic document baseline
│   ├── 02_normal_business_report.pdf   # Standard enterprise corporate report
│   ├── 03_genuine_email.pdf            # Clean professional correspondence
│   ├── 04_phishing_content.pdf         # Malicious credential harvesting sample
│   ├── 05_promotional_spam.pdf         # High-volume marketing spam text
│   ├── 06_suspicious_links.pdf         # External URL redirection payload
│   ├── 07_multipage_document.pdf       # Multi-page stress testing document
│   ├── 08_table_content.pdf            # Tabular data extraction sample
│   ├── 09_scanned_image_pdf.pdf        # Scanned bitmap embedded in PDF
│   ├── 10_mixed_text_and_image.pdf     # Composite layout test document
│   ├── 11_empty_document.pdf           # Zero-byte text boundary condition
│   ├── 12_corrupted_file.pdf           # Invalid header malformed document
│   ├── 13_password_protected.pdf       # Encrypted PDF boundary condition
│   ├── 14_large_multipage.pdf          # High-volume stress benchmark
│   ├── 15_unsupported_binary.bin       # Non-document binary file rejection
│   ├── img_01_normal_screenshot.png    # High-contrast UI screen capture
│   ├── img_02_genuine_conversation.jpg # Conversational chat log screenshot
│   ├── img_03_phishing_sms.png         # SMS urgency smishing alert
│   ├── img_04_fake_bank_alert.png      # Fraudulent banking notification
│   ├── img_05_promotional_ad.jpg       # Marketing advertising banner
│   ├── img_06_email_screenshot.png     # Desktop email client capture
│   ├── img_07_suspicious_urls.png      # Screenshot containing malicious URLs
│   ├── img_08_qr_code.png              # Embedded QR verification code
│   ├── img_09_small_text.png           # Fine-print resolution stress test
│   ├── img_10_blurry_image.png         # Low optical contrast benchmark
│   ├── img_11_no_text.png              # Graphical canvas without alphanumeric tokens
│   ├── img_12_large_image.jpg          # High-resolution 4K image stress test
│   ├── img_13_unsupported.bmp          # Legacy bitmap fallback benchmark
│   └── qa_test_results.json            # 73 Structured empirical test case records
├── run_tests.py                    # Empirical test results summary and inspection runner
└── README.md                       # Test harness documentation
```

---

## 2. Test Execution & Coverage Summary

The test harness evaluates system performance across 13 distinct functional modules:

| Test Module | Test Cases | Objective / Coverage Scope | Status |
| :--- | :---: | :--- | :---: |
| **Connectivity** | 1 | API Health check (`/api/health`) and server ping | PASS (100%) |
| **Frontend Pages** | 11 | Static page routing, HTTP 200 delivery, theme switching | PASS (100%) |
| **Text Testing** | 14 | Raw text parsing, phishing detection, spam classification | PASS (64%) |
| **PDF Testing** | 15 | Multi-page text extraction, corrupted file handling | Evaluated |
| **Image Testing** | 13 | OCR text extraction, low contrast, no-text handling | Evaluated |
| **Message Testing** | 3 | Short conversational text classification | Evaluated |
| **Email Testing** | 3 | Phishing email inspection and URL detection | Evaluated |
| **Privacy Shield** | 1 | Context-aware PII entity detection and masking | PASS (100%) |
| **Compare Engine** | 2 | Text difference detection and Jaccard similarity index | PASS (100%) |
| **Authentication** | 5 | Password hashing, JWT issuance, CAPTCHA validation | PASS (80%) |
| **Authorization** | 2 | Bearer token validation and protected route blocking | PASS (100%) |
| **OTP Engine** | 2 | 6-digit cryptographic OTP generation & verification | PASS (100%) |
| **Performance** | 1 | End-to-end response latency under nominal load | PASS (100%) |

---

## 3. Running Test Evaluations

To execute the test report summary runner:

```bash
python tests/run_tests.py
```

