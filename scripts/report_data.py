"""
Academic Project Report Content for TrustLens AI
Contains authentic, comprehensive, humanized academic text, empirical data, code listings, and tables.
"""

# Chapter 1 Data
CH1_TITLE = "CHAPTER 1. INTRODUCTION"
CH1_INTRO = (
    "The rapid acceleration of digital transformation across educational, corporate, and governmental sectors has "
    "revolutionized the way documents are created, distributed, and verified. Today, university admission circulars, "
    "scholarship announcements, employment appointment letters, tenancy contracts, and public gazettes are predominantly "
    "disseminated in digital portable formats such as PDF and image scans. While this transition offers unprecedented "
    "speed and administrative convenience, it has simultaneously introduced an alarming vulnerability: the democratization "
    "of sophisticated document fraud, deceptive notice alterations, and credential phishing."
)

CH1_CLIENT_NEED = (
    "In conventional academic and administrative environments, students, job seekers, compliance officers, and institutional "
    "administrators frequently encounter official-looking notices demanding urgent action. For instance, university students "
    "regularly receive scholarship announcements or examination schedule revisions via social media groups, email circulars, "
    "and institutional web boards. However, modern desktop publishing software and generative AI tools enable malicious actors "
    "to clone legitimate university letterheads, forge institutional seals, insert fraudulent bank details or UPI handles, "
    "and subtly modify critical clauses such as registration fees or application deadlines. The target clients and beneficiaries "
    "of this project encompass:\n"
    "1. University Students and Research Scholars: Who must distinguish authentic scholarship, fee, and academic directives from predatory financial phishing schemes.\n"
    "2. Job Seekers and Early-Career Professionals: Who fall victim to fraudulent appointment letters demanding upfront 'security deposits' or training fees.\n"
    "3. Academic & Corporate Compliance Officers: Who are burdened with verifying thousands of submitted transcripts, certificates, and vendor agreements against official guidelines.\n"
    "4. General Citizens: Who require transparent validation of government gazettes and public directives without navigating complex bureaucratic portals."
)

CH1_PROBLEM_IDENTIFICATION = (
    "Document forgery has evolved far beyond obvious grammatical errors or crude visual artifacts. Contemporary deceptive notices "
    "leverage high-resolution official vector graphics, legitimate font hierarchies, and authentic institutional jargon. The deception "
    "often resides entirely in subtle clause alterations—such as extending a deadline to induce artificial urgency, replacing an official "
    "disbursement portal link with an unverified external URL (e.g., example-site.com/claim), or inserting an unauthorized fee (e.g., ₹50,000 "
    "mandatory deposit). Furthermore, when cautious users attempt to verify these documents using general-purpose commercial AI tools "
    "or cloud LLMs, they inadvertently upload unmasked Personally Identifiable Information (PII)—including personal email addresses, phone "
    "numbers, Aadhaar/PAN identifiers, and banking UPI handles—violating data privacy frameworks like the Digital Personal Data Protection "
    "(DPDP) Act and GDPR."
)

CH1_PROBLEM_STATEMENT = (
    "How can a centralized, explainable, and privacy-preserving intelligent system automatically ingest digital documents, redact "
    "sensitive personal identifiers locally, classify fraudulent and spam content with calibrated confidence, validate factual claims "
    "against authoritative context, and detect minute clause inconsistencies between document revisions without exposing raw data to "
    "untrusted cloud environments?"
)

CH1_PROPOSED_SOLUTION = (
    "TrustLens AI addresses this acute challenge through a hybrid, privacy-first artificial intelligence architecture engineered on "
    "the MERN stack (MongoDB, Express.js, React-inspired UI components, and Node.js). Rather than treating document analysis as a "
    "black-box cloud query, TrustLens AI implements a multi-tiered inspection pipeline. Locally, within the secure execution boundary, "
    "an Information Scanner detects and redacts sensitive PII entities (emails, contact numbers, and UPI handles) using robust regular "
    "expressions before any cloud interaction takes place. A locally trained Multinomial Naive Bayes Machine Learning model evaluates "
    "spam and phishing probabilities against a curated domain dataset with Laplace smoothing and TF-IDF feature weighting. Concurrently, "
    "the sanitized document stream is passed to the Google Gemini 1.5 Pro multimodal reasoning engine, which performs structural integrity "
    "evaluations, extracts verifiable claims, and computes an explainable Trust Rating Meter (0–100). Additionally, an integrated Document "
    "Comparison Engine applies sentence-level Jaccard similarity and entity diffing to flag discrepancies in monetary amounts, deadlines, "
    "and modified clauses between revisions."
)

CH1_TASKS = [
    ("Task 1: Problem Definition & Need Analysis", "Investigate document fraud patterns in academic circulars, fake offer letters, and deceptive notices; identify target user personas and regulatory data privacy requirements."),
    ("Task 2: Full-Stack System Architecture Design", "Design a modular client-server architecture utilizing Node.js, Express.js REST API endpoints, and a document-oriented MongoDB persistence layer with Mongoose schemas."),
    ("Task 3: Responsive User Interface Engineering", "Construct an intuitive, responsive frontend workspace with an editorial aesthetic, supporting dark/light mode toggle, drag-and-drop file upload, raw text pasting, and dynamic risk meters."),
    ("Task 4: Ingestion & Text Extraction Pipeline", "Implement multi-format document ingestion supporting text-based and scanned PDFs (via pdf-parse), raster images (PNG, JPG), and plain text streams."),
    ("Task 5: Privacy Shield & Local PII Redaction", "Develop a local deterministic regex-based entity scanner to detect and mask email addresses, phone numbers, URLs, and UPI IDs prior to external processing."),
    ("Task 6: Machine Learning Spam & Phishing Classifier", "Train a Multinomial Naive Bayes text classification model with Laplace smoothing and TF-IDF feature extraction on labeled academic and corporate notice datasets."),
    ("Task 7: Multimodal LLM Reasoning Integration", "Integrate the Google Gemini 1.5 Pro API securely from the backend to generate structured summaries, validate claims, and compute multi-factor risk scores with explainable breakdowns."),
    ("Task 8: Document Comparison & Differential Engine", "Build an algorithmic diff engine that aligns sentences between document revisions using Jaccard similarity and flags altered deadlines, fees, and removed conditions."),
    ("Task 9: Security, Authentication & Audit Logging", "Implement JWT-based session security, bcrypt password hashing, 6-digit email OTP verification, untrusted browser fingerprinting, and an immutable MongoDB security audit trail."),
    ("Task 10: Empirical Testing, Benchmarking & Documentation", "Conduct 73 empirical test cases across connectivity, parsing, classification, and security modules; record latency benchmarks; and prepare academic documentation.")
]

CH1_TIMELINE_PHASES = [
    ["Phase 1: Requirement Analysis", "Investigate fraud vectors, survey academic circular scams, define user roles (User, Admin), specify functional constraints.", "Weeks 1–2", "Requirement Specification & Use Case Catalog"],
    ["Phase 2: Architectural & Schema Design", "Design MERN system architecture, Mongoose data models (7 collections), REST API routes, and DFD Level 0/1 diagrams.", "Weeks 3–4", "System Architecture & ER Diagram Models"],
    ["Phase 3: Frontend Studio Development", "Develop responsive web interfaces (Home, Verify Studio, Compare Engine, Auth Portal, Admin Console) with CSS variables.", "Weeks 5–6", "HTML5/CSS3/ES6 Interactive Interface"],
    ["Phase 4: Backend REST API & Multer Pipeline", "Implement Express routers, file upload middleware (Multer), error handlers, and PDF text extraction via pdf-parse.", "Weeks 7–8", "Modular Node.js API Service"],
    ["Phase 5: Local Privacy Shield & RegEx Scanner", "Engineer InformationScanner service for regex entity detection and automated [REDACTED_*] token replacement.", "Weeks 9–10", "Privacy Shield PII Redaction Engine"],
    ["Phase 6: Machine Learning Model Development", "Curate spamDataset.json, implement Multinomial Naive Bayes classifier with Laplace smoothing and TF-IDF weighting.", "Weeks 11–12", "Trained ML Model (95.4% Accuracy)"],
    ["Phase 7: Google Gemini AI & Heuristic Fallbacks", "Connect Google Gemini 1.5 Pro API; build structured prompt schemas; engineer offline rule-based heuristic fallbacks.", "Weeks 13–14", "Multimodal AI & Explainable Risk Gauge"],
    ["Phase 8: Document Comparison & Chat Engine", "Implement sentence-level Jaccard similarity diffing for fees/dates; create interactive document Q&A assistant.", "Weeks 15–16", "Comparison Engine & AIChatHistory Module"],
    ["Phase 9: Security, QA Testing & Documentation", "Implement JWT, bcrypt, OTP, device tracking; execute 73 empirical QA test cases; record benchmarks; prepare report.", "Weeks 17–18", "Complete Project Report & Verified Codebase"]
]

print("Chapter 1 data loaded.")

