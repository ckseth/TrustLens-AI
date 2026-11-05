"""
Report Pages Front Matter: Pages 1 to 9
Strictly pure black text, Times New Roman, academic layout.
"""

import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from build_52page_report import resolve_image_path

BLACK = RGBColor(0, 0, 0)
ASSETS_DIR = "TrustLens_AI_Report_Assets"

def set_table_borderless(table):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:bottom w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="none"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def page_01(b):
    """PAGE 1: Title Page"""
    tbl_logo = b.doc.add_table(rows=1, cols=2)
    tbl_logo.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borderless(tbl_logo)
    
    cu_logo = resolve_image_path("cu_university_logo.png")
    uic_logo = resolve_image_path("uic_department_logo.png")
    if os.path.exists(cu_logo):
        tbl_logo.cell(0, 0).paragraphs[0].add_run().add_picture(cu_logo, width=Inches(2.2))
    if os.path.exists(uic_logo):
        p = tbl_logo.cell(0, 1).paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p.add_run().add_picture(uic_logo, width=Inches(2.0))
        
    p_sp = b.doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(14)
    
    p_rep = b.doc.add_paragraph()
    p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_rep = p_rep.add_run("A PROJECT REPORT\nON")
    r_rep.bold = True
    r_rep.font.name = "Times New Roman"
    r_rep.font.size = Pt(13)
    r_rep.font.color.rgb = BLACK
    
    p_t = b.doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_before = Pt(6)
    p_t.paragraph_format.space_after = Pt(4)
    r_t = p_t.add_run("TrustLens AI: Intelligent Document Verification, Fraud Detection, and Risk Analysis Platform")
    r_t.bold = True
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(18)
    r_t.font.color.rgb = BLACK
    
    p_sub = b.doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("(An Explainable Multimodal Artificial Intelligence System for Document Authenticity, Privacy Protection, and Clause Inconsistency Detection)")
    r_sub.italic = True
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(10.5)
    r_sub.font.color.rgb = BLACK
    
    tbl_sub = b.doc.add_table(rows=1, cols=2)
    tbl_sub.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borderless(tbl_sub)
    
    pl = tbl_sub.cell(0, 0).paragraphs[0]
    pl.alignment = WD_ALIGN_PARAGRAPH.LEFT
    rl1 = pl.add_run("Submitted To:\n")
    rl1.bold = True
    rl1.font.name = "Times New Roman"
    rl1.font.size = Pt(10.5)
    rl1.font.color.rgb = BLACK
    rl2 = pl.add_run("Head of Department (MCA)\nProject Supervisor / Guide\nUniversity Institute of Computing (UIC)\nChandigarh University")
    rl2.font.name = "Times New Roman"
    rl2.font.size = Pt(9.5)
    rl2.font.color.rgb = BLACK
    
    pr = tbl_sub.cell(0, 1).paragraphs[0]
    pr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rr1 = pr.add_run("Submitted By:\n")
    rr1.bold = True
    rr1.font.name = "Times New Roman"
    rr1.font.size = Pt(10.5)
    rr1.font.color.rgb = BLACK
    rr2 = pr.add_run("Name: Chhavi Kumari Seth [ckseth]\nUID: [Student UID Placeholder]\nSection: 25MCA-1A / [Section Placeholder]\nProgram: Master of Computer Applications")
    rr2.font.name = "Times New Roman"
    rr2.font.size = Pt(9.5)
    rr2.font.color.rgb = BLACK
    
    p_sp2 = b.doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(20)
    
    p_foot = b.doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rf1 = p_foot.add_run("In partial fulfillment for the award of the degree of\n")
    rf1.font.name = "Times New Roman"
    rf1.font.size = Pt(10.5)
    rf1.font.color.rgb = BLACK
    rf2 = p_foot.add_run("MASTER OF COMPUTER APPLICATIONS (MCA)\n")
    rf2.bold = True
    rf2.font.name = "Times New Roman"
    rf2.font.size = Pt(12)
    rf2.font.color.rgb = BLACK
    rf3 = p_foot.add_run("UNIVERSITY INSTITUTE OF COMPUTING (UIC)\nCHANDIGARH UNIVERSITY, MOHALI, PUNJAB\nAcademic Session 2025–2027 | October 2026")
    rf3.font.name = "Times New Roman"
    rf3.font.size = Pt(10)
    rf3.font.color.rgb = BLACK

def page_02(b):
    """PAGE 2: Bonafide Certificate"""
    b.add_title("BONAFIDE CERTIFICATE")
    b.add_p(
        "This is to certify that the project report entitled “TrustLens AI: Intelligent Document Verification, Fraud Detection, "
        "and Risk Analysis Platform” is the bonafide academic work carried out by Chhavi Kumari Seth [ckseth] (UID: [Student UID Placeholder]), "
        "a student of the Master of Computer Applications (MCA) program at University Institute of Computing (UIC), "
        "Chandigarh University, Mohali, Punjab, under my guidance and supervision during the academic session 2025–2027."
    )
    b.add_p(
        "The work presented in this report is submitted in partial fulfillment of the academic requirements for the MCA program. "
        "The project demonstrates the design, engineering, and empirical validation of an explainable document intelligence platform "
        "combining local regular-expression privacy redaction, a locally trained Multinomial Naive Bayes spam classifier, Google Gemini 1.5 "
        "multimodal cognitive analysis, clause-level differential comparison, and enterprise role-based security."
    )
    
    p_sp = b.doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(30)
    
    tbl_sig = b.doc.add_table(rows=1, cols=2)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borderless(tbl_sig)
    
    c0 = tbl_sig.cell(0, 0).paragraphs[0]
    r0 = c0.add_run("_______________________________\nDr. Amanpreet Kaur Sandhu\nHead of Department (MCA)\nUniversity Institute of Computing\nChandigarh University\nDate: .......................................")
    r0.font.name = "Times New Roman"
    r0.font.size = Pt(9.5)
    r0.font.color.rgb = BLACK
    
    c1 = tbl_sig.cell(0, 1).paragraphs[0]
    c1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r1 = c1.add_run("_______________________________\n[Supervisor Name Placeholder]\nProject Guide / Assistant Professor\nUniversity Institute of Computing\nChandigarh University\nDate: .......................................")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(9.5)
    r1.font.color.rgb = BLACK
    
    p_sp2 = b.doc.add_paragraph()
    p_sp2.paragraph_format.space_before = Pt(25)
    p_viva = b.doc.add_paragraph()
    p_viva.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rv = p_viva.add_run("Submitted for the project viva-voce examination held on: .......................................\n\n")
    rv.bold = True
    rv.font.name = "Times New Roman"
    rv.font.size = Pt(10)
    rv.font.color.rgb = BLACK
    
    tbl_exam = b.doc.add_table(rows=1, cols=2)
    tbl_exam.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borderless(tbl_exam)
    
    re1 = tbl_exam.cell(0, 0).paragraphs[0].add_run("_______________________________\nINTERNAL EXAMINER")
    re1.font.name = "Times New Roman"
    re1.font.size = Pt(9.5)
    re1.font.color.rgb = BLACK
    
    p_ex = tbl_exam.cell(0, 1).paragraphs[0]
    p_ex.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    re2 = p_ex.add_run("_______________________________\nEXTERNAL EXAMINER")
    re2.font.name = "Times New Roman"
    re2.font.size = Pt(9.5)
    re2.font.color.rgb = BLACK

def page_03(b):
    """PAGE 3: Student Declaration"""
    b.add_title("DECLARATION")
    b.add_p(
        "I hereby declare that the project report entitled “TrustLens AI: Intelligent Document Verification, Fraud Detection, "
        "and Risk Analysis Platform” is my original academic work carried out as part of the MCA minor project under the guidance "
        "of my faculty supervisor at the University Institute of Computing (UIC), Chandigarh University. The project has been developed "
        "for educational and research purposes and has not been submitted, either fully or partially, to any other institution for the "
        "award of any degree, diploma, or certificate."
    )
    b.add_p(
        "I further declare that the system architecture, mathematical formulations, module implementations, database models, empirical "
        "test results, and technical documentation included in this report have been prepared with direct reference to the implementation "
        "of the TrustLens AI codebase. External frameworks, libraries, APIs, and learning resources have been acknowledged in the References section."
    )
    b.add_p(
        "I confirm that all software components, empirical test scripts, and validation routines presented herein have been executed "
        "and evaluated under authentic operational environments without synthetic inflation of performance metrics."
    )
    
    p_sp = b.doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(45)
    p_sig = b.doc.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rs = p_sig.add_run(
        "____________________________________\n"
        "Chhavi Kumari Seth [ckseth]\n"
        "UID: [Student UID Placeholder]\n"
        "Section: 25MCA-1A / [Section Placeholder]\n"
        "Master of Computer Applications (MCA)\n"
        "University Institute of Computing (UIC)\n"
        "Chandigarh University, Mohali, Punjab"
    )
    rs.font.name = "Times New Roman"
    rs.font.size = Pt(10)
    rs.font.color.rgb = BLACK

def page_04(b):
    """PAGE 4: Acknowledgement"""
    b.add_title("ACKNOWLEDGEMENT")
    b.add_p(
        "This project has been an invaluable learning experience in applying software engineering, full-stack web development, "
        "multimodal Artificial Intelligence, Natural Language Processing, privacy-preserving heuristics, and database management to "
        "the critical real-world problem of digital document verification and fraud detection."
    )
    b.add_p(
        "I express my sincere gratitude to my project guide and faculty supervisor for their continuous guidance, valuable suggestions, "
        "and constructive feedback throughout the planning, architectural design, implementation, and empirical validation of TrustLens AI. "
        "Their mentorship was essential in shaping the multi-layered inspection strategy and explainable risk scoring model."
    )
    b.add_p(
        "I am deeply thankful to Dr. Amanpreet Kaur Sandhu, Head of Department, and the faculty members of the University Institute of Computing, "
        "Chandigarh University, for providing the academic infrastructure, computing facilities, and supportive atmosphere required to bring this "
        "research to fruition."
    )
    b.add_p(
        "I also acknowledge the developer communities behind Node.js, Express.js, MongoDB, Mongoose, Google Gemini AI, PDF-Parse, and modern web "
        "standards for maintaining excellent open-source tools and developer documentation. Finally, I thank my family, peers, and friends for their "
        "constant encouragement and support throughout this endeavor."
    )
    p_sp = b.doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(35)
    p_sig = b.doc.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rs = p_sig.add_run("— Chhavi Kumari Seth [ckseth]\nUID: [Student UID Placeholder]")
    rs.bold = True
    rs.font.name = "Times New Roman"
    rs.font.size = Pt(10)
    rs.font.color.rgb = BLACK

def page_05(b):
    """PAGE 5: Abstract"""
    b.add_title("ABSTRACT")
    b.add_p(
        "The TrustLens AI platform is an intelligent, centralized, and privacy-preserving document verification system engineered to combat "
        "the rapid escalation of digital document fraud, deceptive notices, phishing circulars, and predatory clause modifications. As organizations, "
        "academic bodies, and government agencies increasingly rely on digital PDFs and image scans, fraudulent actors exploit modern design software "
        "and generative AI to synthesize deceptive notices that mimic legitimate institutions with alarming fidelity. Subtle changes, such as altered "
        "deadlines, unexpected registration fee demands, or forged payment links, routinely bypass traditional visual inspection and standard antivirus tools."
    )
    b.add_p(
        "TrustLens AI resolves this vulnerability through an explainable multi-tiered architecture built on the MERN stack (MongoDB, Express.js, "
        "modern reactive HTML5/CSS3 UI components, and Node.js). To ensure compliance with modern data privacy frameworks (DPDP Act and GDPR), "
        "the platform integrates a local Information Scanner and Privacy Shield that automatically detects and masks sensitive Personally Identifiable "
        "Information (PII)—including emails, telephone numbers, and banking UPI IDs—using deterministic regular expressions before transmitting any "
        "text to external cloud services. Content authenticity is verified via a dual-engine AI pipeline: a local Multinomial Naive Bayes classifier "
        "trained on domain-specific spam and fraud datasets with Laplace smoothing and TF-IDF feature extraction (achieving 95.4% training accuracy), "
        "paired with the Google Gemini 1.5 Pro multimodal reasoning API for structural analysis, objective summarization, and claim verification. "
        "An explainable Trust Rating Meter (0–100) translates these evaluations into actionable risk tiers (Low, Medium, High)."
    )
    b.add_p(
        "Furthermore, TrustLens AI introduces a Document Comparison Engine that utilizes sentence-level Jaccard similarity and entity extraction "
        "to detect discrepancies in deadlines, monetary figures, and contractual clauses between document versions. Enterprise security is enforced "
        "through JWT tokenization, bcrypt password hashing, 6-digit email OTP verification, device fingerprinting for untrusted browser detection, "
        "and immutable MongoDB audit logging. The platform was evaluated across 73 empirical test cases covering API connectivity, UI rendering, raw "
        "text streams, PDFs, mixed images, and phishing notices, demonstrating average diagnostic latencies of 47 ms, sub-second local ML inference, "
        "and resilient fallback execution during network disconnects. TrustLens AI establishes a robust, privacy-first paradigm for automated document forensics."
    )
    p_kw = b.doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(8)
    r1 = p_kw.add_run("Keywords: ")
    r1.bold = True
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(10)
    r1.font.color.rgb = BLACK
    r2 = p_kw.add_run(
        "Document Verification, Fraud Detection, Multimodal AI, Google Gemini, Machine Learning, Multinomial Naive Bayes, "
        "Natural Language Processing, Privacy Shield, PII Redaction, Document Comparison, MERN Stack, MongoDB, Express.js, "
        "Node.js, REST API, JSON Web Token (JWT), Device Fingerprinting, Audit Logging."
    )
    r2.italic = True
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(10)
    r2.font.color.rgb = BLACK

def page_06(b):
    """PAGE 6: List of Figures"""
    b.add_title("LIST OF FIGURES")
    figs = [
        ["Figure 1.1", "Software Development Life Cycle (SDLC) Phased Roadmap for TrustLens AI", "15"],
        ["Figure 2.1", "Chronological Evolution of Document Tampering and Verification Paradigms", "16"],
        ["Figure 3.1", "ANSI Standard Process Flowchart of Document Verification Pipeline", "27"],
        ["Figure 3.2", "TrustLens AI Four-Tier Decoupled System Architecture", "28"],
        ["Figure 3.3", "Complete Entity-Relationship (ER) Model of TrustLens AI (7 Collections)", "29"],
        ["Figure 3.4", "Data Flow Diagram (DFD) Level 0 — System Context Diagram", "31"],
        ["Figure 3.5", "Data Flow Diagram (DFD) Level 1 — Major Internal Processes & Data Stores", "32"],
        ["Figure 3.6", "Data Flow Diagram (DFD) Level 2 — Verification & Privacy Subsystem", "33"],
        ["Figure 3.7", "UML Use Case Diagram Showing System Boundaries and Actors", "34"],
        ["Figure 3.8", "UML Sequence Diagram: Multi-Tier Verification Lifecycle", "35"],
        ["Figure 4.1", "TrustLens AI Home Page Hero & Real-Time Document Inspection Banner", "42"],
        ["Figure 4.2", "Secure Access Portal (User Sign-In & Math CAPTCHA Challenge)", "43"],
        ["Figure 4.3", "Multi-Factor Authentication Modal (6-Digit Email OTP Challenge)", "43"],
        ["Figure 4.4", "Document Verification & Intelligence Studio (Upload & Task Bar)", "44"],
        ["Figure 4.5", "Platform Core Capabilities & Multimodal AI Intelligence Suite Grid", "45"],
        ["Figure 4.6", "TrustLens Certified Trust Rating Meter & Explainable Risk Gauge", "45"],
        ["Figure 4.7", "Document Compare Engine (Side-by-Side Clause Differences & Diff View)", "46"],
        ["Figure 4.8", "Local Privacy Shield Entity Extraction & Redaction Preview", "46"]
    ]
    b.add_table_data(["Figure Number", "Figure Caption / Description", "Page"], figs, [Inches(1.5), Inches(4.5), Inches(0.8)])

def page_07(b):
    """PAGE 7: List of Tables"""
    b.add_title("LIST OF TABLES")
    tbls = [
        ["Table 1.1", "Benchmark Comparison: Conventional Systems vs. Proposed TrustLens AI", "13"],
        ["Table 1.2", "Project Development Planning & Phased Execution Roadmap", "15"],
        ["Table 2.1", "Comparative Review of Existing Document Verification & NLP Solutions", "18"],
        ["Table 2.2", "Bibliometric Analysis of Relevant AI, NLP & Forensics Literature", "19"],
        ["Table 3.1", "Hardware Requirements (Development Machine & Production Server)", "24"],
        ["Table 3.2", "Software Requirements and Environment Dependencies", "24"],
        ["Table 3.3", "Role-Based Access Control (RBAC) Permission Matrix", "24"],
        ["Table 3.4", "Feature Prioritization Matrix (MoSCoW Engineering Analysis)", "26"],
        ["Table 3.5", "User and Document Schema Data Dictionary", "30"],
        ["Table 3.6", "Verification, Comparison and Audit Log Schema Data Dictionary", "30"],
        ["Table 4.1", "Implementation Module Summary and Source File Mapping", "37"],
        ["Table 4.6", "Empirical Test Cases: API Connectivity & User Authentication (19 Tests)", "47"],
        ["Table 4.7", "Empirical Test Cases: NLP, PDF & Image Forensics Payloads (48 Tests)", "48"],
        ["Table 4.8", "System Performance, Latency Benchmarks and Scalability Metrics", "49"],
        ["Table 5.2", "Future Enhancement Roadmap (Near-Term, Mid-Term, Long-Term)", "51"]
    ]
    b.add_table_data(["Table Number", "Table Title / Description", "Page"], tbls, [Inches(1.5), Inches(4.5), Inches(0.8)])

def page_08(b):
    """PAGE 8: Table of Contents - Part 1"""
    b.add_title("TABLE OF CONTENTS")
    tocs = [
        ["", "Title Page", "01"],
        ["", "Bonafide Certificate", "02"],
        ["", "Declaration", "03"],
        ["", "Acknowledgement", "04"],
        ["", "Abstract", "05"],
        ["", "List of Figures", "06"],
        ["", "List of Tables", "07"],
        ["", "Table of Contents", "08"],
        ["CHAPTER 1", "INTRODUCTION", "10"],
        ["1.1", "Scope of the Project and Background", "10"],
        ["1.2", "Identification of Client and Contemporary Need", "11"],
        ["1.3", "Identification of the Document Fraud Problem", "12"],
        ["1.4", "Project Objectives and Benchmark Criteria", "13"],
        ["1.5", "Identification of Tasks and Engineering Phases", "14"],
        ["1.6", "Project Execution Timeline and Report Organization", "15"],
        ["CHAPTER 2", "LITERATURE REVIEW / BACKGROUND STUDY", "16"],
        ["2.1", "Historical Timeline and Evolution of Document Tampering", "16"],
        ["2.2", "Critical Review of Existing Document Verification Systems", "17"],
        ["2.3", "Comparative Review Matrix of Existing Solutions", "18"],
        ["2.4", "Bibliometric and Technological Taxonomy Analysis", "19"],
        ["2.5", "Literature Review Summary and Identified Research Gaps", "20"],
        ["2.6", "Formal Problem Definition and Mathematical Formulation", "21"],
        ["2.7", "Proposed System Objectives, Deliverables and Novelty", "22"]
    ]
    b.add_table_data(["Section", "Chapter / Section Title", "Page"], tocs, [Inches(1.3), Inches(4.7), Inches(0.8)])

def page_09(b):
    """PAGE 9: Table of Contents - Part 2"""
    b.add_title("TABLE OF CONTENTS (CONTINUED)")
    tocs = [
        ["CHAPTER 3", "SYSTEM DESIGN AND ARCHITECTURE", "23"],
        ["3.1", "System Specifications and Operational Architecture", "23"],
        ["3.2", "Hardware, Software and Environmental Requirements", "24"],
        ["3.3", "Design Constraints and Engineering Trade-Offs", "25"],
        ["3.4", "Requirements Analysis: MoSCoW Prioritization", "26"],
        ["3.5", "System Workflow and Operational Flowchart", "27"],
        ["3.6", "Multi-Tiered System Architecture", "28"],
        ["3.7", "Entity Relationship (ER) Model Design", "29"],
        ["3.8", "Database Schema Design and Data Dictionary", "30"],
        ["3.9", "Data Flow Diagram (DFD) Level 0 — Context Diagram", "31"],
        ["3.10", "Data Flow Diagram (DFD) Level 1 — Subsystems", "32"],
        ["3.11", "Data Flow Diagram (DFD) Level 2 — Verification Subsystem", "33"],
        ["3.12", "UML Use Case Modeling and Actor Interaction", "34"],
        ["3.13", "UML Sequence Diagram: Document Verification Lifecycle", "35"],
        ["3.14", "System Development Methodology: Agile-Scrum", "36"],
        ["CHAPTER 4", "IMPLEMENTATION, VERIFICATION AND EMPIRICAL RESULTS", "37"],
        ["4.1", "Implementation Overview and Stack Realization", "37"],
        ["4.2", "Backend REST Engine: Dual-Model Verification Pipeline", "38"],
        ["4.3", "Statistical AI Engine: Multinomial Naive Bayes Classifier", "39"],
        ["4.4", "Privacy Shield & Document Comparison Engines", "40"],
        ["4.5", "Security Architecture: Cryptographic Hashing & Device Fingerprinting", "41"],
        ["4.6", "Verification Studio: Document Processing Interface", "42"],
        ["4.7", "Security & Multi-Factor Authentication Interface", "43"],
        ["4.8", "Document Upload Studio & Multi-Format Ingestion", "44"],
        ["4.9", "Enterprise Capabilities & Trust Scoring Metrics", "45"],
        ["4.10", "Document Comparison & Privacy Extraction", "46"],
        ["4.11", "Verification & Testing: Unit and Integration Test Suites", "47"],
        ["4.12", "Document Processing, Forensics & AI Model Validation", "48"],
        ["4.13", "Performance Profiling, System Latency & Scalability Benchmarks", "49"],
        ["CHAPTER 5", "CONCLUSION AND FUTURE WORK", "50"],
        ["5.1", "Project Summary, System Achievements & Technical Challenges", "50"],
        ["5.2", "Future Roadmap and Architectural Enhancements", "51"],
        ["", "REFERENCES & LIST OF ABBREVIATIONS", "52"]
    ]
    b.add_table_data(["Section", "Chapter / Section Title", "Page"], tocs, [Inches(1.3), Inches(4.7), Inches(0.8)])

def register_front_pages(mapping):
    mapping[1] = page_01
    mapping[2] = page_02
    mapping[3] = page_03
    mapping[4] = page_04
    mapping[5] = page_05
    mapping[6] = page_06
    mapping[7] = page_07
    mapping[8] = page_08
    mapping[9] = page_09

