"""
Report Pages Chapter 1 & Chapter 2: Pages 10 to 22
Strictly pure black text, Times New Roman, academic layout.
"""

import sys
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

import report_data as d1
import report_data_ch2_to_ch5 as d2

BLACK = RGBColor(0, 0, 0)

def page_10(b):
    """PAGE 10: Chapter 1: 1.1 Scope of the Project and Background"""
    b.add_h1("CHAPTER 1. INTRODUCTION")
    b.add_h2("1.1 Scope of the Project and Background")
    b.add_p(
        "In the contemporary digital information ecosystem, the proliferation of digital documentation—ranging from "
        "university academic circulars, admission notifications, and fee schedules to corporate employment contracts "
        "and procurement agreements—has fundamentally transformed organizational administration. However, this transition "
        "has been accompanied by a perilous surge in sophisticated digital document fraud. Deceptive actors exploit modern "
        "desktop publishing software and generative AI models to fabricate forged circulars and modified legal contracts "
        "that accurately mirror legitimate organizational templates."
    )
    b.add_p(
        "TrustLens AI is conceptualized and engineered as a comprehensive, privacy-preserving, and explainable multimodal "
        "artificial intelligence platform designed to restore institutional trust in digital communication. The primary scope "
        "of TrustLens AI encompasses the automated ingestion, structural parsing, optical character extraction, privacy "
        "redaction, and multi-tier cognitive verification of digital documents presented in PDF, raw image, and plain text formats."
    )
    b.add_p(
        "The project boundaries explicitly encompass client-side document preprocessing, local deterministic regex-based "
        "Personally Identifiable Information (PII) masking, a lightweight locally hosted Multinomial Naive Bayes spam classifier, "
        "and cloud-assisted multimodal deep semantic verification using the Google Gemini 1.5 Pro architecture. By producing a unified "
        "Trust Score (0–100) alongside granular clause-level inconsistency reports, the platform bridges the critical gap "
        "between unassisted human visual inspection and completely opaque black-box machine learning verifiers."
    )

def page_11(b):
    """PAGE 11: 1.2 Identification of Client and Contemporary Need"""
    b.add_h2("1.2 Identification of Client and Contemporary Need")
    b.add_p(
        "The target clientele and operational beneficiaries of TrustLens AI span four primary institutional domains: "
        "educational universities, enterprise human resources departments, public administrative bodies, and individual citizens. "
        "University administrative boards frequently experience coordinated disinformation campaigns involving forged circulars "
        "declaring unscheduled examination postponements or directing vulnerable students to malicious third-party payment gateways."
    )
    b.add_bullet(
        "Academic & Educational Institutions",
        "Registrars, examination controllers, and department heads who must rapidly authenticate circulating student notices, "
        "verify official circular authenticity, and debunk phishing notifications targeting tuition fee payments."
    )
    b.add_bullet(
        "Enterprise Human Resources & Recruitment",
        "Talent acquisition teams tasked with verifying candidate credentials, educational marksheets, previous employment experience "
        "letters, and detecting tampered salary slips."
    )
    b.add_bullet(
        "Legal & Corporate Compliance Officers",
        "In-house legal teams requiring automated comparison between standard master contracts and counterparty revisions to detect "
        "unauthorized alterations in liability, indemnity clauses, and payment schedules."
    )
    b.add_bullet(
        "General Public & Students",
        "End users who receive unsolicited official-looking notifications via messaging platforms and require immediate verification "
        "before acting on urgent financial or administrative directives."
    )
    b.add_p(
        "The acute contemporary need stems from the fact that modern digital forgeries no longer display obvious typographical "
        "errors or crude layout flaws. Modern threat actors leverage digital layout engines to clone institutional headers, logos, and "
        "official layouts with pixel-perfect accuracy, necessitating deep cognitive verification."
    )

def page_12(b):
    """PAGE 12: 1.3 Identification of the Document Fraud Problem"""
    b.add_h2("1.3 Identification of the Document Fraud Problem")
    b.add_p(
        "The identification of the document fraud problem reveals three critical structural weaknesses across conventional "
        "document handling workflows: human perceptual vulnerability, the inadequacy of cryptographic hashes, and severe privacy "
        "leakage risks associated with naive cloud AI adoption."
    )
    b.add_p(
        "First, human cognitive fatigue renders visual auditing highly unreliable. When human administrators review hundreds of "
        "documents daily, subtle semantic shifts—such as a single modified digit in a bank account number, an altered fee payment "
        "deadline, or a swapped domain URL—are routinely missed. Second, cryptographic integrity mechanisms such as MD5, SHA-256, "
        "or digital signatures only function when the recipient already possesses the authentic reference document and the sender "
        "has maintained a secure public-key infrastructure. In everyday academic and consumer scenarios, users receive standalone "
        "documents without cryptographic provenance."
    )
    b.add_p(
        "Third, existing enterprise attempts to leverage commercial cloud-based Large Language Models (LLMs) suffer from severe "
        "data privacy violations. Uploading unredacted documents containing student names, phone numbers, Aadhaar/SSN identifiers, "
        "and banking coordinates directly to commercial cloud APIs violates stringent data protection mandates, including the Digital "
        "Personal Data Protection (DPDP) Act and the General Data Protection Regulation (GDPR)."
    )
    b.add_p(
        "Problem Statement: Design and engineer an explainable, privacy-preserving, and decoupled document intelligence platform "
        "capable of ingesting multi-format documents, performing local PII redaction, executing hybrid statistical and multimodal "
        "AI verification, and producing deterministic trust ratings with verifiable audit trails."
    )

def page_13(b):
    """PAGE 13: 1.4 Project Objectives and Benchmark Criteria"""
    b.add_h2("1.4 Project Objectives and Benchmark Criteria")
    b.add_p(
        "To address the identified problems comprehensively, TrustLens AI was constructed around five concrete, verifiable "
        "academic objectives evaluated against industry benchmarks, as summarized in Table 1.1."
    )
    
    t1_headers = ["Evaluation Metric", "Manual Inspection", "Cloud LLM Verifier", "TrustLens AI Platform"]
    t1_rows = [
        ["Processing Latency", "5–30 minutes / doc", "3–8 seconds / doc", "0.047s (local) / 2.8s (AI)"],
        ["Privacy Protection", "Exposes data to auditor", "Transmits raw PII to cloud", "Deterministic local PII masking"],
        ["Explainability", "Subjective notes", "Opaque generative text", "Granular score + clause diffs"],
        ["Offline Resilience", "Fully offline (slow)", "Complete failure if offline", "Local ML fallback (95.4% acc)"],
        ["Cost per Document", "High human labor", "Recurring API token cost", "Minimal local compute + caching"]
    ]
    b.add_table_data(t1_headers, t1_rows, [Inches(1.8), Inches(1.6), Inches(1.7), Inches(1.8)])
    
    b.add_bullet("Objective 1 (Multi-Format Ingestion)", "Engineer resilient parsers supporting raw PDF text/layout extraction, multi-format image OCR (PNG, JPEG, WebP), and unformatted text streams.")
    b.add_bullet("Objective 2 (Local Privacy Shield)", "Implement a client/edge deterministic regex masking engine guaranteeing zero plaintext PII transmission to external networks.")
    b.add_bullet("Objective 3 (Dual-Engine AI Verification)", "Develop a hybrid scoring architecture coupling a local Multinomial Naive Bayes classifier with Google Gemini 1.5 Pro multimodal reasoning.")
    b.add_bullet("Objective 4 (Semantic Comparison Engine)", "Create a sentence-level Jaccard similarity and entity diffing engine to identify clause discrepancies between document versions.")
    b.add_bullet("Objective 5 (Enterprise Security & Auditing)", "Implement JWT session security, 6-digit email OTP challenges, device fingerprinting, and immutable MongoDB audit logging.")

def page_14(b):
    """PAGE 14: 1.5 Tasks Performed and Engineering Phases"""
    b.add_h2("1.5 Identification of Tasks and Engineering Phases")
    b.add_p(
        "The development of TrustLens AI was systematically structured into ten rigorous engineering tasks executed across "
        "the software development lifecycle to ensure high academic standards and software quality:"
    )
    for task_name, task_desc in d1.CH1_TASKS:
        b.add_bullet(task_name, task_desc)

def page_15(b):
    """PAGE 15: 1.6 Project Execution Timeline and Report Organization"""
    b.add_h2("1.6 Project Execution Timeline and Report Organization")
    b.add_p(
        "The project was executed across four months (Academic Session 2025–2027), divided into five distinct development "
        "milestones as detailed in Table 1.2."
    )
    
    t2_headers = ["Phase", "Milestone / Scope", "Timeline", "Key Deliverables"]
    t2_rows = [
        ["Phase 1", "Requirement Analysis & Scope Definition", "Weeks 1–2", "SRS Document, Use Case Matrix"],
        ["Phase 2", "Architecture Design & Schema Modeling", "Weeks 3–5", "Chen ER Diagram, DFDs L0–L2"],
        ["Phase 3", "Core Engine & Privacy Implementation", "Weeks 6–9", "REST APIs, Regex PII Engine, Bayes ML"],
        ["Phase 4", "Multimodal Integration & UI Studio", "Weeks 10–13", "Gemini 1.5 API, Comparison Studio"],
        ["Phase 5", "Empirical Testing & Performance Benchmarking", "Weeks 14–16", "73 QA Test Records, Project Report"]
    ]
    b.add_table_data(t2_headers, t2_rows, [Inches(1.0), Inches(2.7), Inches(1.2), Inches(2.0)])
    
    b.add_h3("1.6.1 Organization of the Report")
    b.add_p(
        "The remainder of this report is organized as follows: Chapter 2 presents a thorough literature review, historical "
        "evolution, existing system comparisons, bibliometric analysis, and mathematical formulations. Chapter 3 elaborates on "
        "system specifications, MoSCoW prioritization, architectural models, Chen ER diagrams, multi-level DFDs, UML diagrams, "
        "and Scrum methodology. Chapter 4 provides in-depth implementation listings, UI walkthroughs with real user screenshots, "
        "empirical test suites (73 tests), and latency benchmarks. Chapter 5 concludes with project achievements and future roadmap."
    )

def page_16(b):
    """PAGE 16: Chapter 2: 2.1 Historical Timeline and Evolution of Document Tampering"""
    b.add_h1("CHAPTER 2. LITERATURE REVIEW / BACKGROUND STUDY")
    b.add_h2("2.1 Historical Timeline and Evolution of Document Tampering")
    b.add_p(
        "Document authentication has evolved through five distinct historical paradigms, shifting from physical forensic "
        "verification to algorithmic digital forensics, as outlined below:"
    )
    for stage_title, stage_desc in d2.CH2_TIMELINE_STAGES:
        b.add_bullet(stage_title, stage_desc)

def page_17(b):
    """PAGE 17: 2.2 Critical Review of Existing Document Verification Systems"""
    b.add_h2("2.2 Critical Review of Existing Document Verification Systems")
    b.add_p(
        "A critical examination of current industrial and academic solutions reveals four dominant architectural approaches, "
        "each exhibiting distinct technical trade-offs:"
    )
    b.add_bullet(
        "1. Optical Character Recognition (OCR) & Static Heuristics",
        "Systems utilizing Tesseract or ABBYY FineReader extract textual characters and apply keyword dictionaries (e.g., searching "
        "for 'urgent', 'wire transfer', 'penalty'). While computationally lightweight and operable entirely on-premise, these systems "
        "are oblivious to semantic context, generate prohibitive false positive rates, and fail when malicious actors replace keyword strings."
    )
    b.add_bullet(
        "2. Cloud-Centric Large Language Model (LLM) Verifiers",
        "Commercial solutions sending documents directly to GPT-4 or Claude demonstrate superior semantic comprehension and linguistic "
        "reasoning. However, they introduce catastrophic data privacy vulnerabilities by exposing unredacted personal identifiers to external "
        "servers. Furthermore, they incur high per-call API token latencies (3–8 seconds) and fail completely during network disconnects."
    )
    b.add_bullet(
        "3. Cryptographic Hashing & Blockchain Notarization",
        "Approaches such as OpenTimestamps and Ethereum document notarization register document SHA-256 hashes on immutable ledgers. "
        "While mathematically tamper-proof, they require pre-existing registration by the issuer. If a student receives an un-notarized "
        "university notification, blockchain systems provide zero analytical intelligence regarding content legitimacy."
    )
    b.add_bullet(
        "4. Antivirus & Static File Header Analyzers",
        "Security suites inspect PDF headers, embedded JavaScript, and macro payloads. While vital for detecting executable malware, "
        "they cannot evaluate the factual truthfulness or institutional plausibility of cleanly generated text."
    )

def page_18(b):
    """PAGE 18: 2.3 Comparative Review Matrix of Existing Solutions"""
    b.add_h2("2.3 Comparative Review Matrix of Existing Solutions")
    b.add_p(
        "To objectively benchmark TrustLens AI against existing technological paradigms, Table 2.1 presents a comprehensive "
        "comparative evaluation across five critical operational dimensions."
    )
    
    t3_headers = ["System Category", "Inspection Scope", "Privacy Protection", "Mean Latency", "Offline Resilience", "Primary Bottleneck"]
    t3_rows = [
        ["Manual Human Audit", "Holistic cognitive", "Zero (Human exposed)", "5–30 min", "100% Offline", "Human fatigue & throughput"],
        ["Static OCR / Regex", "Keyword patterns", "High (On-premise)", "< 100 ms", "100% Offline", "Zero contextual understanding"],
        ["Cryptographic Hash", "Bit-exact integrity", "High (Hash only)", "< 10 ms", "Requires ledger", "Useless for unnotarized docs"],
        ["Pure Cloud LLM", "Deep contextual", "Catastrophic (Data leak)", "3.5–8.0 s", "0% (Cloud down)", "Severe privacy & token costs"],
        ["TrustLens AI Platform", "Multimodal + Regex", "Deterministic PII shield", "0.047s / 2.8s", "Hybrid (95.4% ML)", "Balanced dual-tier architecture"]
    ]
    b.add_table_data(t3_headers, t3_rows, [Inches(1.4), Inches(1.3), Inches(1.4), Inches(1.0), Inches(1.1), Inches(1.5)])
    
    b.add_p(
        "The comparative analysis demonstrates that TrustLens AI uniquely achieves the high semantic accuracy of modern multimodal "
        "AI while completely neutralizing privacy and availability vulnerabilities through local PII redaction and offline-capable "
        "statistical machine learning models."
    )

def page_19(b):
    """PAGE 19: 2.4 Bibliometric and Technological Taxonomy Analysis"""
    b.add_h2("2.4 Bibliometric and Technological Taxonomy Analysis")
    b.add_p(
        "A rigorous bibliometric survey of 22 foundational research papers across the IEEE, ACM, and Springer digital libraries "
        "was conducted to categorize relevant methodologies and identify technical constraints, summarized in Table 2.2."
    )
    
    t4_headers = ["Research Domain", "Seminal Authors & Citations", "Core Methodology", "Identified Limitation", "TrustLens Implementation"]
    t4_rows = [
        ["Statistical NLP", "Manning et al. (2008),\nHearst (1999)", "Multinomial Bayes with\nLaplace smoothing", "Lacks structural image\ncomprehension", "Embedded local ML model\nwith TF-IDF scoring"],
        ["Deep Multimodal AI", "Vaswani et al. (2017),\nGemini Team (2024)", "Transformer cross-attention\nvision-language models", "High cloud latency &\nprivacy exposure risk", "Asynchronous API with local\nregex PII sanitization"],
        ["Privacy Engineering", "Agrawal & Srikant (2000),\nGDPR & DPDP (2023)", "Deterministic pattern\nmasking & differential privacy", "Often degrades downstream\nNLP context", "Targeted regex masking of\nemails, phones, and UPIs"],
        ["Document Diffing", "Myers (1986),\nJaccard (1912)", "Longest common subsequence\n& token n-gram overlap", "Fails on restructured\nparagraphs", "Sentence-level Jaccard index\nwith entity extraction"],
        ["Web Security & Auth", "Rescorla (2018),\nOWASP Top 10 (2021)", "JWT tokenization, salted\nbcrypt, OTP challenges", "Vulnerable to session\nhijacking if tokens leak", "Device fingerprinting and\nimmutable audit logs"]
    ]
    b.add_table_data(t4_headers, t4_rows, [Inches(1.2), Inches(1.4), Inches(1.6), Inches(1.6), Inches(1.7)])

def page_20(b):
    """PAGE 20: 2.5 Literature Review Summary and Identified Research Gaps"""
    b.add_h2("2.5 Literature Review Summary and Identified Research Gaps")
    b.add_p(
        "The synthesis of existing literature underscores a profound technological divide between legacy rule-based heuristic systems "
        "and modern generative deep learning architectures. While the former are privacy-preserving and fast but functionally brittle, the "
        "latter provide deep reasoning at the cost of data privacy, latency, and single-point cloud dependence. This survey exposes five research gaps:"
    )
    b.add_bullet("Research Gap 1 (Privacy Leakage in Cloud NLP)", "Existing cloud-based document analyzers require unredacted payloads, exposing sensitive institutional records and personal identifiers to remote multi-tenant infrastructure.")
    b.add_bullet("Research Gap 2 (Opaque Black-Box Verifications)", "Current commercial AI tools output binary classifications or unstructured text without exposing verifiable sub-scores, mathematical formulas, or confidence intervals.")
    b.add_bullet("Research Gap 3 (Vulnerability to Network Disconnects)", "Cloud-dependent verification architectures suffer 100% operational paralysis during Internet disruptions or API quota exhaustion.")
    b.add_bullet("Research Gap 4 (Absence of Semantic Clause Diffing)", "Traditional diff tools compute raw character or line diffs, generating overwhelming visual noise when whitespace or margins shift, failing to isolate substantive contractual modifications.")
    b.add_bullet("Research Gap 5 (Inadequate Session Security & Audit Trails)", "Document verification portals frequently lack multi-factor authentication, device authorization, and immutable tamper logs required for forensic accountability.")

def page_21(b):
    """PAGE 21: 2.6 Formal Problem Definition and Mathematical Formulation"""
    b.add_h2("2.6 Formal Problem Definition and Mathematical Formulation")
    b.add_p(
        "Mathematically, let a candidate document D be represented as an ordered sequence of extracted textual tokens W = {w1, w2, ..., wn} "
        "and an optional visual raster image matrix I. The verification objective is to compute a composite Risk Score R(D) in [0, 100] and "
        "classify the document into risk tiers C in {Low, Medium, High}."
    )
    b.add_p(
        "1. Multinomial Naive Bayes Posterior Probability:\n"
        "The local statistical classifier evaluates the class probability of document W belonging to class C_k (where C_k in {Spam/Fraud, Ham/Legitimate}):\n"
        "P(C_k | W) ∝ P(C_k) ∏_{i=1}^n P(w_i | C_k)\n"
        "To eliminate zero-frequency probabilities for unseen vocabulary tokens, Laplace add-one smoothing is applied:\n"
        "P(w_i | C_k) = (count(w_i, C_k) + 1) / (∑_{w} count(w, C_k) + |V|)\n"
        "where |V| represents the total vocabulary size across the training corpus."
    )
    b.add_p(
        "2. Composite Trust Score Formulation:\n"
        "The holistic Trust Rating T(D) is derived through a weighted fusion of local machine learning risk, multimodal cognitive risk, "
        "and deterministic rule-based heuristic penalties:\n"
        "T(D) = 100 - [ α · S_ML(W) + β · S_Gemini(W, I) + γ · S_Rules(W) ]\n"
        "where α = 0.35 (Local Bayes Weight), β = 0.45 (Multimodal AI Weight), and γ = 0.20 (Heuristic Rule Weight), subject to α + β + γ = 1.0. "
        "Threshold boundaries are defined as: Low Risk (T ≥ 75), Medium Risk (45 ≤ T < 75), and High Risk (T < 45)."
    )

def page_22(b):
    """PAGE 22: 2.7 Proposed System Objectives, Deliverables and Novelty"""
    b.add_h2("2.7 Proposed System Objectives, Deliverables and Novelty")
    b.add_p(
        "In response to the identified research gaps and mathematical formulations, TrustLens AI delivers five tangible software deliverables "
        "that embody substantial architectural novelty:"
    )
    b.add_bullet("Deliverable 1: Edge-Executed Privacy Shield", "A high-performance deterministic regular-expression engine that sanitizes email addresses, phone numbers, and UPI banking handles in under 2 milliseconds prior to external API dispatch.")
    b.add_bullet("Deliverable 2: Decoupled Dual-Engine Verifier", "A fault-tolerant hybrid pipeline combining a local 95.4% accurate Multinomial Naive Bayes model with Google Gemini 1.5 Pro, featuring automatic fallback during API timeout or network failure.")
    b.add_bullet("Deliverable 3: Semantic Clause Comparison Engine", "A sentence-level Jaccard similarity and named entity diff engine that detects altered dates, modified monetary fees, and subtle clause shifts between document versions.")
    b.add_bullet("Deliverable 4: Zero-Trust Security & Forensics", "A hardened authentication framework featuring bcrypt password hashing, 6-digit email OTP challenges, device fingerprint authorization, and immutable MongoDB audit logging.")
    b.add_bullet("Deliverable 5: Responsive Explainable Studio UI", "A unified dashboard offering real-time trust gauges, categorized risk audit checklists, side-by-side diff comparisons, and instantaneous verification reports.")
    b.add_p(
        "The fundamental architectural novelty lies in proving that high-accuracy artificial intelligence and absolute data privacy "
        "are not mutually exclusive in enterprise document verification workflows."
    )

def register_ch1_ch2_pages(mapping):
    mapping[10] = page_10
    mapping[11] = page_11
    mapping[12] = page_12
    mapping[13] = page_13
    mapping[14] = page_14
    mapping[15] = page_15
    mapping[16] = page_16
    mapping[17] = page_17
    mapping[18] = page_18
    mapping[19] = page_19
    mapping[20] = page_20
    mapping[21] = page_21
    mapping[22] = page_22

