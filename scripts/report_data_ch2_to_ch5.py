"""
Report Data for Chapters 2 through 5, References, Abbreviations, Design Checklist, and User Manual.
"""

import json

def load_qa_tests():
    with open('test_data/qa_test_results.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

# Chapter 2 Data
CH2_TIMELINE_STAGES = [
    ("Stage 1: The Physical Document Era (Pre-2000s)", "Verification relied exclusively on physical security elements—watermarked parchment, embossed seals, wet ink signatures, and registered postal dispatches. Forgery required specialized physical printing equipment, making mass replication difficult but individual visual audits subjective and slow."),
    ("Stage 2: Early Digital Records & Electronic Mail (2000–2010)", "PDFs and image scans emerged as dominant standards. Digital signatures (PKI, X.509 certificates) and cryptographic checksums (MD5, SHA-1) were introduced. However, adoption was uneven, and everyday users lacked the technical capability to verify cryptographic certificates, leaving them vulnerable to simple raster edits."),
    ("Stage 3: Desktop Publishing & Template Cloning (2010–2020)", "Tools like Adobe Acrobat, Photoshop, and online PDF editors democratized document manipulation. Scammers easily cloned government gazettes, university circulars, and corporate offer letters. Traditional security focused on malware attachments (anti-virus) while ignoring deceptive textual content."),
    ("Stage 4: Generative AI, Multimodal Phishing & Scale (2020–Present)", "Generative Large Language Models and visual synthesis tools enable automated generation of convincing, grammatically perfect notices tailored to current events. Subtle clause tampering—such as adding a ₹50,000 fee or modifying a bank UPI handle—is impossible for standard security tools to detect."),
    ("Stage 5: The TrustLens AI Paradigm (Present)", "An urgent need has emerged for explainable, multimodal, and privacy-preserving document forensics. TrustLens AI bridges this historical gap by pairing local PII redaction and local machine learning with cloud multimodal reasoning and fine-grained clause diffing.")
]

CH2_EXISTING_SYSTEMS_TABLE = [
    ["Manual Visual Inspection", "Human review of typography, signatures, and seals", "Labor-intensive, prone to fatigue, incapable of detecting subtle clause changes, high turnaround latency."],
    ["Cryptographic Checksums (MD5/SHA-256)", "Verifies byte-level integrity against an original reference file", "Binary all-or-nothing check; fails completely if a document is re-scanned or compressed; cannot verify unhashed documents."],
    ["Anti-Plagiarism Tools (Turnitin, CopyScape)", "Detects verbatim text duplication against web corpora", "Designed for academic essays, not fraud; ignores financial demands, unverified domains, and altered contact credentials."],
    ["Commercial Cloud OCR (AWS Textract, Google DocAI)", "Extracts raw text, key-value pairs, and tables from images", "Pure transcription tool; performs no risk scoring, fraud detection, or PII masking prior to ingestion."],
    ["General-Purpose LLMs (ChatGPT, Claude)", "Performs text summarization and general Q&A via web interfaces", "Leaks unmasked personal data (PII) to cloud servers; produces opaque, non-deterministic risk scores; vulnerable to hallucinations."]
]

CH2_BIBLIOMETRIC_TABLE = [
    ["Natural Language Processing in Fraud Detection", "Feature extraction, n-gram analysis, and semantic anomaly detection in deceptive communications.", "Hearst (1999), Manning et al. (2008)"],
    ["Naive Bayes Text Classification", "Probabilistic document categorization with Laplace smoothing and bag-of-words modeling.", "Pedregosa et al. (2011), Joachims (1998)"],
    ["Multimodal Large Language Models", "Cross-modal reasoning over structured documents, visual layouts, and contextual claims.", "Google Gemini Technical Report (2024), OpenAI (2023)"],
    ["Privacy-Preserving AI & Entity Masking", "Local regular expression parsing and tokenization to prevent PII exfiltration in cloud inference.", "OWASP LLM Security Top 10 (2025), GDPR Article 25"],
    ["Differential Clause & Contract Analysis", "Sentence alignment, Jaccard token similarity, and financial discrepancy detection in legal text.", "Sommerville (2016), Pressman & Maxim (2020)"]
]

# Chapter 3 Data
CH3_SPEC_FEATURES = [
    ("Dynamic Verification Studio", "Multi-format file upload (PDF, PNG, JPG) and raw text paste with live OCR extraction stream and task-selector pills."),
    ("Local Privacy Shield (PII Redaction)", "Deterministic regex-based scanner that detects and masks emails, phone numbers, URLs, and UPI IDs into [REDACTED_*] tokens locally."),
    ("Multinomial Naive Bayes ML Classifier", "Local machine learning model with TF-IDF feature weighting, Laplace smoothing, and telemarketing prefix detection trained on spamDataset.json."),
    ("Multimodal Gemini AI Engine", "Cloud-assisted deep structural evaluation, objective summarization, verifiable claim extraction, and explainable risk breakdown."),
    ("Certified Trust Rating Meter", "Calibrated 0–100 risk score with dynamic visual radial gauge, categorized into Low, Medium, and High caution tiers."),
    ("Document Compare Engine", "Side-by-side revision analyzer calculating sentence-level Jaccard similarity to identify added, removed, and altered clauses, dates, and fees."),
    ("Interactive Document AI Assistant", "Context-aware conversational assistant that answers specific questions grounded exclusively in the uploaded document's text."),
    ("Enterprise Authentication & Security", "JWT access and refresh tokens, bcrypt password encryption, 6-digit email OTP verification, and device fingerprinting for untrusted logins."),
    ("Audit Logging & Admin Dashboard", "Centralized security forensics repository tracking all user logins, document uploads, risk scores, and device approvals.")
]

CH3_HARDWARE_TABLE = [
    ["Processor (CPU)", "Intel Core i5 / AMD Ryzen 5 (4 cores, 2.4 GHz+)", "Intel Xeon / AMD EPYC (8+ vCPUs, 2.8 GHz+)"],
    ["System Memory (RAM)", "8 GB DDR4 minimum (16 GB recommended)", "16 GB – 32 GB ECC DDR4"],
    ["Storage Capacity", "256 GB SSD (50 GB available space)", "500 GB NVMe SSD with automated snapshot backups"],
    ["Display & Video", "1920 x 1080 Full HD resolution display", "Headless cloud server / standard web terminal"],
    ["Network Interface", "Standard Wi-Fi / Gigabit Ethernet (10+ Mbps)", "Gigabit Ethernet with SSL/TLS reverse proxy (1 Gbps)"]
]

CH3_SOFTWARE_TABLE = [
    ["Operating System", "Microsoft Windows 11 / Linux (Ubuntu 22.04 LTS) / macOS"],
    ["Server Runtime", "Node.js v18.x – v22.x LTS (JavaScript Runtime)"],
    ["Backend Framework", "Express.js v4.19.2 (Routing, Middleware & REST APIs)"],
    ["Database Server", "MongoDB Community Server v6.0+ / MongoDB Atlas"],
    ["Object Data Modeling", "Mongoose v8.4.1 (Schema validation, indexing, and queries)"],
    ["Frontend Architecture", "HTML5, CSS3 Variables, Modern JavaScript (Vanilla ES6 modules)"],
    ["AI Intelligence Services", "Google Gemini 1.5 Pro API & Local Multinomial Naive Bayes ML"],
    ["Text & PDF Parsing", "pdf-parse v1.1.1 & Multer v1.4.5-lts.1 (Multipart uploads)"],
    ["Security & Cryptography", "jsonwebtoken v9.0.2, bcryptjs v2.4.3, nodemailer v10.0.14"],
    ["Development Tooling", "Visual Studio Code, Git, GitHub, Postman, PowerShell"]
]

CH3_RBAC_TABLE = [
    ["Public / Guest", "Access public landing page, feature directory, and educational documentation; initiate account creation.", "Cannot upload files, invoke AI analysis, compare documents, or access security logs."],
    ["Registered User", "Upload documents, run Verify Studio, enable Privacy Shield, compare document revisions, interact with Document AI chat, manage personal profile and trusted devices.", "Cannot access other users' documents, view system-wide analytics, modify user roles, or inspect central audit logs."],
    ["System Administrator", "Full access to Admin Command Center: view system-wide analytics, inspect aggregated risk distributions, manage user accounts, activate/deactivate users, promote roles, review audit logs, and monitor registered devices.", "Must authenticate via multi-factor credentials and operate under immutable security audit logging."]
]

CH3_MOSCOW_TABLE = [
    ["Must-Have (M)", "Document text extraction (PDF/Image/Text), local PII redaction (Privacy Shield), Naive Bayes spam classification, Gemini AI document summarization and risk scoring, explainable Trust Rating Meter, JWT authentication, and secure password hashing."],
    ["Should-Have (S)", "Document Compare Engine with sentence diffing and fee/date tracking, 6-digit email OTP verification, browser device fingerprinting for untrusted logins, exportable PDF/PNG audit reports, and interactive Document AI Chat."],
    ["Could-Have (C)", "Admin Command Center with real-time MongoDB aggregations, system-wide risk statistics, audit log filtering by user/action, and dark/light UI theme switcher."],
    ["Won't-Have (W - Current)", "Direct on-chain blockchain anchoring of audit hashes, native iOS/Android binary builds, and on-premises local LLM execution (deferred to future roadmap)."]
]

print("Chapter 2 and 3 data loaded.")

