"""
Report Pages Chapter 3: Pages 23 to 36
System Design, Architecture, ER Model, DFD Levels 0-2, UML Diagrams, Agile Methodology.
Strictly pure black text, Times New Roman, academic layout.
"""

from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

import report_data_ch2_to_ch5 as d2

BLACK = RGBColor(0, 0, 0)

def page_23(b):
    """PAGE 23: Chapter 3: 3.1 System Specifications and Operational Architecture"""
    b.add_h1("CHAPTER 3. SYSTEM DESIGN AND ARCHITECTURE")
    b.add_h2("3.1 System Specifications and Operational Architecture")
    b.add_p(
        "The architectural specification of TrustLens AI is formulated to establish an enterprise-grade, high-availability, "
        "and privacy-first document intelligence platform. The system operates on a four-tier decoupled architecture comprising "
        "a reactive Presentation Tier, an API Gateway and Middleware Controller Tier, a Dual-Engine AI Inference Tier, and an "
        "Audited Persistence Tier."
    )
    b.add_bullet("1. Client Ingestion Layer", "Cross-browser compatible single-page web interface engineered using HTML5, CSS3, and modern reactive vanilla JavaScript. Operates asynchronously, supporting real-time drag-and-drop document streaming, in-browser image rendering, and instant client-side file size and MIME-type validation.")
    b.add_bullet("2. API Gateway & Middleware Layer", "Asynchronous Node.js / Express.js REST application server responsible for request dispatching, JWT authorization headers, multipart file streaming via Multer, deterministic rate limiting, and mathematical CAPTCHA generation.")
    b.add_bullet("3. Privacy Shield & Preprocessing Layer", "Deterministic edge filter executing regular expression pattern scanning to intercept and redact telephone numbers, personal emails, and UPI handles before payloads enter cloud pipelines.")
    b.add_bullet("4. Dual-Engine Verification Layer", "Decoupled analytical core uniting an on-premise Multinomial Naive Bayes model (for ultra-fast offline spam/fraud detection) and Google Gemini 1.5 Pro (for deep multimodal semantic reasoning and fraud explainability).")
    b.add_bullet("5. Audited Persistence Layer", "Document-oriented MongoDB database maintaining structured records for user identities, active device fingerprints, document metadata, clause-level comparison diffs, and append-only forensic audit logs.")

def page_24(b):
    """PAGE 24: 3.2 Hardware, Software and Environmental Requirements"""
    b.add_h2("3.2 Hardware, Software and Environmental Requirements")
    b.add_p(
        "To guarantee deterministic performance across heterogeneous operating environments, minimum and recommended system "
        "specifications were established, as documented in Tables 3.1, 3.2, and 3.3."
    )
    
    # Table 3.1: Hardware Requirements
    t_hw_headers = ["Hardware Parameter", "Client Machine Minimum", "Development & Server Host", "Cloud Production Target"]
    t_hw_rows = [
        ["Processor (CPU)", "Dual-Core 1.8 GHz x86/ARM", "Quad-Core 2.5 GHz Intel i5 / AMD Ryzen", "4 vCPUs / 8 vCPUs (Scalable)"],
        ["System Memory (RAM)", "4 GB DDR4", "8 GB – 16 GB DDR4", "16 GB – 32 GB ECC RAM"],
        ["Persistent Storage", "500 MB free space", "256 GB NVMe SSD", "100 GB SSD + Object Store"],
        ["Network Interface", "1 Mbps Broadband", "100 Mbps Dedicated Ethernet", "1 Gbps Fiber Backbone"]
    ]
    b.add_table_data(t_hw_headers, t_hw_rows, [Inches(1.8), Inches(1.6), Inches(1.8), Inches(1.8)])
    
    # Table 3.2: Software Requirements
    t_sw_headers = ["Software Component", "Specification / Runtime", "Purpose in TrustLens Architecture"]
    t_sw_rows = [
        ["Operating System", "Windows 10/11, Ubuntu 22.04 LTS, macOS", "Host operating system for runtime services"],
        ["Runtime Environment", "Node.js v18.x – v20.x LTS", "Asynchronous non-blocking event-driven server runtime"],
        ["Web Application Framework", "Express.js v4.18.x", "REST API routing, middleware, and request pipeline"],
        ["Database Management System", "MongoDB v6.0+ Community / Atlas", "NoSQL document storage for users, docs, and audit logs"],
        ["AI / Cognitive Services", "Google Gemini 1.5 Pro REST API", "Multimodal deep semantic reasoning and fraud detection"]
    ]
    b.add_table_data(t_sw_headers, t_sw_rows, [Inches(1.8), Inches(2.2), Inches(3.0)])
    
    # Table 3.3: RBAC Matrix
    t_rbac_headers = ["System Role", "Document Ingestion", "Diff Comparison", "Audit Log Inspection", "User & Device Admin"]
    t_rbac_rows = [
        ["Anonymous Visitor", "Limited (Demo mode)", "View sample diffs", "No Access", "No Access"],
        ["Registered User", "Full (PDF, Image, Text)", "Full Comparison Studio", "Own Verification History", "Manage Own Profile"],
        ["Compliance Auditor / Admin", "Full Ingestion Access", "Full Comparison Studio", "Complete System Audit Logs", "Revoke Device Sessions"]
    ]
    b.add_table_data(t_rbac_headers, t_rbac_rows, [Inches(1.8), Inches(1.3), Inches(1.3), Inches(1.3), Inches(1.3)])

def page_25(b):
    """PAGE 25: 3.3 Design Constraints and Engineering Trade-Offs"""
    b.add_h2("3.3 Design Constraints and Engineering Trade-Offs")
    b.add_p(
        "Engineering an enterprise-grade document intelligence platform required balancing stringent architectural constraints "
        "against user experience, regulatory compliance, and system availability. Four primary trade-offs were resolved:"
    )
    b.add_bullet(
        "1. Memory Footprint vs. Document Processing Throughput",
        "Large PDF documents (up to 25 MB) and high-resolution scanned images can rapidly exhaust Node.js heap memory if fully buffered in RAM. "
        "TrustLens AI implements Multer disk streaming with immediate buffer recycling. Uploaded artifacts are processed in transient chunks, "
        "enforcing a maximum active heap threshold of 512 MB and preventing Out-Of-Memory (OOM) fatal crashes."
    )
    b.add_bullet(
        "2. Absolute Privacy Protection vs. Contextual Semantic Depth",
        "Overly aggressive PII masking can obscure essential contractual context (e.g., masking the name of a corporate entity alongside a personal name). "
        "TrustLens AI employs targeted, deterministic regular expressions that isolate personal phone numbers, personal email addresses, and financial "
        "UPI handles while preserving legal clauses, organizational headers, dates, and currency values."
    )
    b.add_bullet(
        "3. Verification Latency vs. AI Reasoning Rigor",
        "Cloud LLM inference introduces network latency (2.5–5.0 seconds). To maintain high operational responsiveness, the system executes local "
        "heuristics and Naive Bayes inference in parallel (47 ms), providing instantaneous preliminary feedback while the Gemini 1.5 Pro multimodal "
        "pipeline completes in the background."
    )
    b.add_bullet(
        "4. High Security vs. Low User Friction",
        "Strict multi-factor authentication can cause user abandonment. TrustLens AI implements risk-based adaptive challenge authentication: "
        "standard logins require only password and a visual math CAPTCHA, while unrecognized device fingerprints automatically trigger an email OTP challenge."
    )

def page_26(b):
    """PAGE 26: 3.4 Requirements Analysis: MoSCoW Prioritization"""
    b.add_h2("3.4 Requirements Analysis: MoSCoW Prioritization")
    b.add_p(
        "To manage development scope effectively and ensure that core functional imperatives were delivered with high academic "
        "rigor, system features were evaluated and prioritized using the formal MoSCoW framework, as summarized in Table 3.4."
    )
    
    t_moscow_headers = ["Priority Tier", "Feature Code", "System Functional Requirement", "Engineering Justification & Scope"]
    t_moscow_rows = [
        ["Must Have (P0)", "REQ-M01", "Multi-Format Parsing (PDF, Images, TXT)", "Fundamental requirement for ingesting diverse academic and corporate notices."],
        ["Must Have (P0)", "REQ-M02", "Deterministic PII Privacy Redaction", "Regulatory mandate (DPDP / GDPR) to prevent raw personal data leakage."],
        ["Must Have (P0)", "REQ-M03", "Multimodal AI Semantic Verification", "Core cognitive capability required to detect sophisticated forgeries and phishing."],
        ["Must Have (P0)", "REQ-M04", "JWT Auth, Device Tracking & Audit Trails", "Essential security baseline to prevent unauthorized access and maintain forensic logs."],
        ["Should Have (P1)", "REQ-S01", "Sentence-Level Document Diff Engine", "Allows users to inspect unauthorized clause modifications across revisions."],
        ["Should Have (P1)", "REQ-S02", "Local Naive Bayes Fallback Classifier", "Guarantees offline verification capability during cloud API disconnects."],
        ["Could Have (P2)", "REQ-C01", "Dark/Light Theme UI Customization", "Enhances usability and reduces eye strain during prolonged forensic sessions."],
        ["Won't Have (P3)", "REQ-W01", "Public Blockchain Ledger Anchoring", "Excluded due to gas transaction fees, high latency, and privacy compliance limits."]
    ]
    b.add_table_data(t_moscow_headers, t_moscow_rows, [Inches(1.2), Inches(0.9), Inches(2.2), Inches(2.7)])
    
    b.add_p(
        "The MoSCoW analysis established a bounded engineering roadmap that ensured zero scope creep, dedicating developmental "
        "effort to the core verification, privacy, security, and comparison engines."
    )

def page_27(b):
    """PAGE 27: 3.5 System Workflow and Operational Flowchart"""
    b.add_h2("3.5 System Workflow and Operational Flowchart")
    b.add_p(
        "The operational lifecycle of a document verification request across TrustLens AI follows a strictly governed ANSI standard "
        "process flow, mapping transitions from user ingestion to explainable risk tier assignment."
    )
    b.add_figure("diag_3_6_system_flowchart.png", "Figure 3.1", "ANSI Standard Process Flowchart of Document Verification Pipeline", width=Inches(5.4))
    b.add_p(
        "As modeled in Figure 3.1, the document enters via the client interface (Parallelogram), passes MIME/size validation (Diamond), "
        "undergoes deterministic PII masking (Rectangle), evaluates cloud API connectivity (Diamond), executes dual or fallback AI scoring "
        "(Rectangle), aggregates trust metrics into Low, Medium, or High risk tiers (Rectangle), and persists the audit record in MongoDB (Oval)."
    )

def page_28(b):
    """PAGE 28: 3.6 Multi-Tiered System Architecture"""
    b.add_h2("3.6 Multi-Tiered System Architecture")
    b.add_p(
        "TrustLens AI is structured into a four-tier decoupled architecture designed to maintain high cohesion, loose coupling, "
        "and horizontal scalability across all analytical and persistence modules."
    )
    b.add_figure("diag_3_1_system_architecture.png", "Figure 3.2", "TrustLens AI Four-Tier Decoupled System Architecture", width=Inches(5.4))
    b.add_p(
        "Figure 3.2 illustrates the complete end-to-end component topology: Tier 1 (Client Presentation Studio), Tier 2 (Node.js/Express "
        "API Gateway with Security Middleware), Tier 3 (Local Privacy Shield, Naive Bayes Classifier, and Google Gemini 1.5 Pro AI Inference Engine), "
        "and Tier 4 (MongoDB Document Persistence with 7 structured collections and immutable audit logs)."
    )

def page_29(b):
    """PAGE 29: 3.7 Entity Relationship (ER) Model Design"""
    b.add_h2("3.7 Entity Relationship (ER) Model Design")
    b.add_p(
        "The data architecture of TrustLens AI is formally defined using the standard Chen Entity-Relationship notation, "
        "specifying entities (rectangles), attributes (ovals with underlined primary keys), and relationships (diamonds with cardinalities)."
    )
    b.add_figure("diag_3_2_er_model.png", "Figure 3.3", "Complete Entity-Relationship (ER) Model of TrustLens AI (7 Collections)", width=Inches(5.5))
    b.add_p(
        "Figure 3.3 details the 7 relational schemas: Users, Documents, Verifications, Comparisons, AuditLogs, DeviceSessions, and OTPCodes. "
        "Key relationships include: User Uploads Document (1:N), Document Undergoes Verification (1:N), User Executes Comparison (1:N), "
        "User Authorizes DeviceSession (1:N), and User Generates AuditLog (1:N)."
    )

def page_30(b):
    """PAGE 30: 3.8 Database Schema Design and Data Dictionary"""
    b.add_h2("3.8 Database Schema Design and Data Dictionary")
    b.add_p(
        "The persistence layer is implemented via Mongoose ODM schemas on MongoDB. Tables 3.5 and 3.6 present the comprehensive "
        "data dictionary specifying field names, data types, constraints, and descriptions for the core collections."
    )
    
    # Table 3.5: User & Document Schemas
    t_sch1_headers = ["Collection", "Field Name", "Data Type", "Constraints / Index", "Functional Description"]
    t_sch1_rows = [
        ["Users", "_id", "ObjectId", "Primary Key, Auto-gen", "Unique internal user identifier"],
        ["Users", "email", "String", "Unique, Required, Lowercase", "User email address used for login and OTP"],
        ["Users", "passwordHash", "String", "Required, bcrypt 10 salt", "Securely hashed user password string"],
        ["Users", "role", "String", "Enum: user, admin, auditor", "Role-based access authorization level"],
        ["Documents", "_id", "ObjectId", "Primary Key, Auto-gen", "Unique document artifact identifier"],
        ["Documents", "userId", "ObjectId", "Foreign Key -> Users._id", "Reference to the uploading user account"],
        ["Documents", "originalFilename", "String", "Required, Max 255 chars", "Name of the ingested physical file"],
        ["Documents", "sha256Hash", "String", "Indexed, 64-char Hex", "Cryptographic integrity hash of raw payload"]
    ]
    b.add_table_data(t_sch1_headers, t_sch1_rows, [Inches(1.1), Inches(1.2), Inches(1.0), Inches(1.6), Inches(2.1)])
    
    # Table 3.6: Verification & Audit Schemas
    t_sch2_headers = ["Collection", "Field Name", "Data Type", "Constraints / Index", "Functional Description"]
    t_sch2_rows = [
        ["Verifications", "_id", "ObjectId", "Primary Key, Auto-gen", "Unique verification execution run ID"],
        ["Verifications", "documentId", "ObjectId", "Foreign Key -> Documents", "Reference to verified document"],
        ["Verifications", "trustScore", "Number", "Min: 0, Max: 100", "Final aggregated composite trust rating"],
        ["Verifications", "riskLevel", "String", "Enum: low, medium, high", "Categorical risk assessment classification"],
        ["AuditLogs", "_id", "ObjectId", "Primary Key, Auto-gen", "Unique audit log entry identifier"],
        ["AuditLogs", "action", "String", "Indexed, Enum list", "Recorded security or analytical action event"],
        ["AuditLogs", "clientIp", "String", "IPv4/IPv6, Required", "Originating client IP address string"],
        ["AuditLogs", "timestamp", "Date", "Default: Date.now, TTL", "UTC timestamp of event occurrence"]
    ]
    b.add_table_data(t_sch2_headers, t_sch2_rows, [Inches(1.1), Inches(1.2), Inches(1.0), Inches(1.6), Inches(2.1)])

def page_31(b):
    """PAGE 31: 3.9 Context-Level Data Flow Diagram (Level 0)"""
    b.add_h2("3.9 Data Flow Diagram (DFD) Level 0 — Context Diagram")
    b.add_p(
        "The Context-Level Data Flow Diagram establishes the highest-level operational boundary of TrustLens AI, modeling the single "
        "central system process (Process 0.0) and all external entities interacting across network boundaries."
    )
    b.add_figure("diag_3_3_dfd_level0.png", "Figure 3.4", "Data Flow Diagram (DFD) Level 0 — System Context Diagram", width=Inches(5.4))
    b.add_p(
        "Figure 3.4 identifies four primary external entities: End User / Client (submits documents and receives trust ratings), "
        "External Multimodal AI API (Google Gemini 1.5 Pro receiving sanitized text), External SMTP Server (transmitting 6-digit OTP codes), "
        "and Persistent Database Store (MongoDB storing documents, verifications, and audit trails)."
    )

def page_32(b):
    """PAGE 32: 3.10 Subsystem Data Flow Diagram (Level 1)"""
    b.add_h2("3.10 Data Flow Diagram (DFD) Level 1 — Subsystems")
    b.add_p(
        "The Level 1 Data Flow Diagram decomposes the monolithic system context into seven distinct functional processes, "
        "mapping internal data flows between processes and persistent data stores (D1 to D5)."
    )
    b.add_figure("diag_3_4_dfd_level1.png", "Figure 3.5", "Data Flow Diagram (DFD) Level 1 — Major Internal Processes & Data Stores", width=Inches(5.4))
    b.add_p(
        "Figure 3.5 delineates the primary processes: 1.0 User Authentication & OTP Verification, 2.0 Document Ingestion & Parsing, "
        "3.0 Privacy Masking & Redaction, 4.0 Dual-Engine AI Scoring, 5.0 Trust Score Aggregation, 6.0 Document Comparison Engine, "
        "and 7.0 Audit Logging & Device Tracking, interacting with stores D1 (Users), D2 (Documents), D3 (Verifications), D4 (AuditLogs), and D5 (Devices)."
    )

def page_33(b):
    """PAGE 33: 3.11 Detailed Verification DFD (Level 2)"""
    b.add_h2("3.11 Data Flow Diagram (DFD) Level 2 — Verification Subsystem")
    b.add_p(
        "The Level 2 Data Flow Diagram provides an engineering deep dive into the core Verification and Privacy Subsystems "
        "(decomposing Processes 2.0, 3.0, and 4.0 into granular sub-processes)."
    )
    b.add_figure("diag_3_5_dfd_level2.png", "Figure 3.6", "Data Flow Diagram (DFD) Level 2 — Verification & Privacy Subsystem", width=Inches(5.4))
    b.add_p(
        "As detailed in Figure 3.6, sub-processes include: 2.1 File Parser (extracts raw text from PDF/Image), 3.1 Regex PII Scanner (identifies "
        "emails, phones, UPI handles), 3.2 Redaction Engine (generates masked text stream), 4.1 Multinomial Naive Bayes Classifier (computes local "
        "spam probability), 4.2 Gemini Vision API Client (generates cognitive fraud score), and 5.1 Score Aggregator (calculates final Trust Score)."
    )

def page_34(b):
    """PAGE 34: 3.12 UML Use Case Modeling & Actor Interaction"""
    b.add_h2("3.12 UML Use Case Modeling and Actor Interaction")
    b.add_p(
        "The functional behavior of TrustLens AI is modeled using the UML Use Case notation, depicting interactions between "
        "human actors, external AI services, and internal system boundaries."
    )
    b.add_figure("diag_3_7_use_case_diagram.png", "Figure 3.7", "UML Use Case Diagram Showing System Boundaries and Actors", width=Inches(5.4))
    b.add_p(
        "Figure 3.7 illustrates four primary actors: Regular User, System Auditor / Admin, External AI Service (Gemini API), and Mail Gateway (SMTP). "
        "Core use cases include: Upload Document, Apply Privacy Shield (<<include>>), Verify Content Authenticity (<<include>>), Compare Revisions, "
        "Challenge New Device (<<extend>>), and Inspect Forensic Audit Logs."
    )

def page_35(b):
    """PAGE 35: 3.13 UML Sequence Diagram: Multi-Tier Verification Lifecycle"""
    b.add_h2("3.13 UML Sequence Diagram: Multi-Tier Verification Lifecycle")
    b.add_p(
        "The temporal execution sequence of a document verification request across system tiers is formally modeled in the UML Sequence Diagram."
    )
    b.add_figure("diag_3_8_sequence_diagram.png", "Figure 3.8", "UML Sequence Diagram: Multi-Tier Verification Lifecycle", width=Inches(5.4))
    b.add_p(
        "Figure 3.8 traces synchronous and asynchronous message exchanges between the Client Browser, Express API Gateway, Privacy Shield, "
        "Naive Bayes Classifier, Google Gemini API, and MongoDB. Highlights include deterministic regex redaction prior to outbound HTTPS "
        "dispatch, asynchronous parallel score computation, and guaranteed fallback response within 3.5 seconds."
    )

def page_36(b):
    """PAGE 36: 3.14 System Development Methodology: Agile-Scrum"""
    b.add_h2("3.14 System Development Methodology: Agile-Scrum")
    b.add_p(
        "The engineering of TrustLens AI adopted the Agile-Scrum methodology, organizing development into four two-week iterations (Sprints). "
        "This iterative approach enabled continuous integration, early risk mitigation, and empirical test-driven validation."
    )
    b.add_bullet(
        "Sprint 1: System Ingestion & Security Architecture",
        "Configured Node.js/Express scaffolding, designed MongoDB Mongoose schemas (Users, Documents, Devices, Audits), implemented JWT session security, "
        "and established client-side drag-and-drop document upload pipelines."
    )
    b.add_bullet(
        "Sprint 2: Deterministic Privacy Shield & Parsers",
        "Engineered the regular-expression PII redaction engine, integrated PDF-Parse and Tesseract OCR modules, validated memory leak bounds during large "
        "file processing, and authored automated unit tests for email, telephone, and UPI masking."
    )
    b.add_bullet(
        "Sprint 3: Dual-Engine AI Integration & Trust Scoring",
        "Trained the local Multinomial Naive Bayes classifier on domain fraud datasets, integrated the Google Gemini 1.5 Pro multimodal API, formulated "
        "the weighted Trust Score equation, and implemented the explainable risk checklist."
    )
    b.add_bullet(
        "Sprint 4: Document Compare Engine & Hardening",
        "Constructed the sentence-level Jaccard diffing engine, finalized the responsive UI Studio, performed comprehensive security penetration testing, "
        "and executed the complete 73-case empirical test harness."
    )

def register_ch3_pages(mapping):
    mapping[23] = page_23
    mapping[24] = page_24
    mapping[25] = page_25
    mapping[26] = page_26
    mapping[27] = page_27
    mapping[28] = page_28
    mapping[29] = page_29
    mapping[30] = page_30
    mapping[31] = page_31
    mapping[32] = page_32
    mapping[33] = page_33
    mapping[34] = page_34
    mapping[35] = page_35
    mapping[36] = page_36

