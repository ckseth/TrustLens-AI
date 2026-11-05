"""
Generate Publication-Grade, Professional Academic Technical Diagrams for TrustLens AI
Uses standard engineering conventions: Chen ER notation, Yourdon/DeMarco DFD notation,
ANSI standard flowchart symbols, and standard UML notation.
All diagrams styled with pure black lines, white/light backgrounds, and crisp Times New Roman labels.
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse, Rectangle, Polygon, FancyArrowPatch

ASSETS_DIR = "TrustLens_AI_Report_Assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# Set global academic typography
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman', 'DejaVu Serif']
plt.rcParams['mathtext.fontset'] = 'stix'

def generate_system_architecture():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 97, "TRUSTLENS AI — SYSTEM ARCHITECTURE DIAGRAM", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='black')
    ax.text(50, 94, "Multi-Tiered Client-Server Architecture with Decoupled AI & Persistence Layers", 
            ha='center', va='center', fontsize=10, style='italic', color='#333333')

    # Layers
    layers = [
        ("1. CLIENT & PRESENTATION TIER", 82, 10, "#FAFAFA"),
        ("2. BACKEND API & CONTROLLER TIER (Node.js & Express.js)", 59, 17, "#F5F5F5"),
        ("3. AI, NLP & FORENSIC INTELLIGENCE ENGINES", 34, 18, "#EEEEEE"),
        ("4. PERSISTENCE & STORAGE TIER (MongoDB & File System)", 10, 17, "#E0E0E0")
    ]

    for title, y_top, height, bg in layers:
        rect = patches.Rectangle((4, y_top - height), 92, height, linewidth=1.2, edgecolor='black', facecolor=bg)
        ax.add_patch(rect)
        ax.text(6, y_top - 2.5, title, fontsize=9.5, fontweight='bold', color='black')

    # Tier 1 Components
    t1_boxes = [
        ("Web Browser Client\n(Responsive UI Viewport)", 14, 78, 22, 6.5),
        ("Document Upload Dropzone\n(PDF / PNG / JPG / Text)", 40, 78, 24, 6.5),
        ("Interactive Studio & Diff View\n(Task Pills / Dynamic Meter)", 68, 78, 26, 6.5)
    ]
    for text, x, y, w, h in t1_boxes:
        r = patches.Rectangle((x, y - h), w, h, linewidth=1.0, edgecolor='black', facecolor='white')
        ax.add_patch(r)
        ax.text(x + w/2, y - h/2, text, ha='center', va='center', fontsize=8.5, color='black')

    # Tier 2 Components
    t2_boxes = [
        ("Auth & Security Router\n(JWT / OTP / Device Verification)", 6, 54, 26, 7),
        ("Analysis & Verification Router\n(Task Controller / Gemini Pipeline)", 36, 54, 28, 7),
        ("Comparison Router\n(Diff Engine & Entity Scanner)", 68, 54, 26, 7),
        ("Multer File Middleware\n(25MB File Filter)", 20, 45, 26, 4.5),
        ("Error & Auth Middleware\n(Bearer Token & RBAC)", 54, 45, 26, 4.5)
    ]
    for text, x, y, w, h in t2_boxes:
        r = patches.Rectangle((x, y - h), w, h, linewidth=1.0, edgecolor='black', facecolor='white')
        ax.add_patch(r)
        ax.text(x + w/2, y - h/2, text, ha='center', va='center', fontsize=8, color='black')

    # Tier 3 Components
    t3_boxes = [
        ("Information Scanner &\nPrivacy Shield (RegEx PII)", 6, 29, 21, 9),
        ("Multinomial Naive Bayes\nML Spam Classifier (TF-IDF)", 29, 29, 21, 9),
        ("Google Gemini 1.5 Pro API\n(Multimodal Cloud Reasoning)", 52, 29, 21, 9),
        ("Comparison Engine\n(Sentence Jaccard Diff)", 75, 29, 21, 9)
    ]
    for text, x, y, w, h in t3_boxes:
        r = patches.Rectangle((x, y - h), w, h, linewidth=1.0, edgecolor='black', facecolor='white')
        ax.add_patch(r)
        ax.text(x + w/2, y - h/2, text, ha='center', va='center', fontsize=8, color='black')

    # Tier 4 Components
    t4_boxes = [
        ("MongoDB Database (Mongoose ODM)\nSchemas: User, Document, Analysis, Comparison, Device, AIChatHistory, AuditLog", 6, 7, 62, 7),
        ("File Storage\n(backend/uploads)", 72, 7, 22, 7)
    ]
    for text, x, y, w, h in t4_boxes:
        r = patches.Rectangle((x, y - h), w, h, linewidth=1.0, edgecolor='black', facecolor='white')
        ax.add_patch(r)
        ax.text(x + w/2, y - h/2, text, ha='center', va='center', fontsize=8, color='black')

    # Connecting Arrows
    arrows = [
        ((25, 71.5), (25, 54)),
        ((52, 71.5), (52, 54)),
        ((81, 71.5), (81, 54)),
        ((19, 45), (16.5, 29)),
        ((50, 45), (39.5, 29)),
        ((50, 45), (62.5, 29)),
        ((81, 47), (85.5, 29)),
        ((37, 20), (37, 7)),
        ((85.5, 20), (83, 7))
    ]
    for p1, p2 in arrows:
        arr = patches.FancyArrowPatch(p1, p2, arrowstyle='->', mutation_scale=10, linewidth=1.0, color='black')
        ax.add_patch(arr)

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_1_system_architecture.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_er_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 110)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(55, 98, "TRUSTLENS AI — ENTITY RELATIONSHIP (ER) DIAGRAM", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='black')
    ax.text(55, 95, "Chen Notation with Underlined Primary Keys (PK) and Cardinality Constraints", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#333333')

    # Entities (Rectangles)
    entities = [
        ("USER", 45, 78, 18, 7),
        ("DOCUMENT", 10, 48, 20, 7),
        ("ANALYSIS", 45, 48, 18, 7),
        ("COMPARISON", 80, 48, 20, 7),
        ("DEVICE", 10, 80, 16, 7),
        ("AUDIT_LOG", 82, 80, 18, 7),
        ("AI_CHAT_HISTORY", 45, 18, 22, 7)
    ]
    for name, x, y, w, h in entities:
        rect = patches.Rectangle((x, y), w, h, linewidth=1.5, edgecolor='black', facecolor='white')
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, name, ha='center', va='center', fontsize=9.5, fontweight='bold', color='black')

    # Relationships (Diamonds)
    def draw_diamond(cx, cy, w, h, text):
        poly = patches.Polygon([
            (cx, cy + h/2), (cx + w/2, cy), (cx, cy - h/2), (cx - w/2, cy)
        ], closed=True, linewidth=1.2, edgecolor='black', facecolor='#F9F9F9')
        ax.add_patch(poly)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=7.5, fontweight='bold', color='black')

    relationships = [
        (28, 51.5, 10, 5, "Uploads"),
        (54, 65, 12, 5, "Requests"),
        (71, 51.5, 12, 5, "Compares"),
        (28, 83.5, 10, 5, "Registers"),
        (72, 83.5, 10, 5, "Generates"),
        (56, 35, 12, 5, "Queries"),
        (35, 48, 10, 5, "Analyzes")
    ]
    for cx, cy, w, h, text in relationships:
        draw_diamond(cx, cy, w, h, text)

    # Connections between Entities & Relationships
    lines = [
        # USER -> Uploads -> DOCUMENT
        ((45, 81.5), (28, 51.5)), ((28, 51.5), (30, 51.5)),
        # USER -> Requests -> ANALYSIS
        ((54, 78), (54, 67.5)), ((54, 62.5), (54, 55)),
        # USER -> Compares -> COMPARISON
        ((63, 81.5), (80, 51.5)),
        # USER -> Registers -> DEVICE
        ((45, 83.5), (33, 83.5)), ((23, 83.5), (26, 83.5)),
        # USER -> Generates -> AUDIT_LOG
        ((63, 83.5), (67, 83.5)), ((77, 83.5), (82, 83.5)),
        # USER -> Queries -> AI_CHAT_HISTORY
        ((54, 48), (54, 37.5)), ((54, 32.5), (54, 25)),
        # DOCUMENT -> Analyzes -> ANALYSIS
        ((30, 51.5), (45, 51.5)),
        # DOCUMENT -> COMPARISON
        ((30, 48), (80, 48))
    ]
    for p1, p2 in lines:
        ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color='black', linewidth=1.0)

    # Cardinality labels
    cardinalities = [
        ("1", 43, 76), ("N", 22, 56),     # User - Document
        ("1", 56, 75), ("N", 56, 56),     # User - Analysis
        ("1", 64, 76), ("N", 78, 56),     # User - Comparison
        ("1", 43, 85), ("N", 27, 85),     # User - Device
        ("1", 64, 85), ("N", 80, 85),     # User - AuditLog
        ("1", 56, 46), ("N", 56, 26),     # Analysis - Chat
        ("1", 31, 53), ("1", 43, 53)      # Document - Analysis
    ]
    for text, x, y in cardinalities:
        ax.text(x, y, text, fontsize=9, fontweight='bold', color='black')

    # Attributes (Ovals with Underlined PK)
    def draw_attr(cx, cy, text, is_pk=False, is_fk=False):
        ellipse = patches.Ellipse((cx, cy), width=10, height=3.5, linewidth=1.0, edgecolor='black', facecolor='white')
        ax.add_patch(ellipse)
        t = ax.text(cx, cy, text, ha='center', va='center', fontsize=7, color='black')
        if is_pk:
            t.set_fontweight('bold')
            # Add underline for PK
            ax.plot([cx - 3.2, cx + 3.2], [cy - 0.9, cy - 0.9], color='black', linewidth=0.8)
        elif is_fk:
            # Dashed underline for FK
            ax.plot([cx - 3.2, cx + 3.2], [cy - 0.9, cy - 0.9], color='black', linewidth=0.8, linestyle='--')

    # User Attributes
    user_attrs = [
        (42, 92, "userId", True, False),
        (54, 92, "name", False, False),
        (66, 92, "email", False, False),
        (35, 87, "password", False, False),
        (72, 87, "role", False, False)
    ]
    for cx, cy, name, pk, fk in user_attrs:
        draw_attr(cx, cy, name, pk, fk)
        ax.plot([cx, 54], [cy - 1.75, 85], color='black', linewidth=0.7)

    # Document Attributes
    doc_attrs = [
        (6, 61, "documentId", True, False),
        (18, 61, "fileName", False, False),
        (6, 40, "filePath", False, False),
        (18, 40, "extractedText", False, False)
    ]
    for cx, cy, name, pk, fk in doc_attrs:
        draw_attr(cx, cy, name, pk, fk)
        ax.plot([cx, 20], [cy + 1.75 if cy < 45 else cy - 1.75, 48 if cy < 45 else 55], color='black', linewidth=0.7)

    # Analysis Attributes
    analysis_attrs = [
        (45, 61, "analysisId", True, False),
        (60, 61, "riskScore", False, False),
        (38, 42, "riskLevel", False, False),
        (58, 42, "claims", False, False)
    ]
    for cx, cy, name, pk, fk in analysis_attrs:
        draw_attr(cx, cy, name, pk, fk)
        ax.plot([cx, 54], [cy - 1.75 if cy > 50 else cy + 1.75, 55 if cy > 50 else 48], color='black', linewidth=0.7)

    # Comparison Attributes
    comp_attrs = [
        (96, 61, "compId", True, False),
        (104, 53, "changes", False, False),
        (96, 40, "summary", False, False)
    ]
    for cx, cy, name, pk, fk in comp_attrs:
        draw_attr(cx, cy, name, pk, fk)
        ax.plot([cx, 90], [cy - 1.75 if cy > 50 else cy + 1.75, 55 if cy > 50 else 48], color='black', linewidth=0.7)

    # Notation Key
    key_rect = patches.Rectangle((4, 2), 102, 8, linewidth=1.0, edgecolor='black', facecolor='#F5F5F5')
    ax.add_patch(key_rect)
    ax.text(6, 6, "Chen ER Notation Key:", fontsize=8.5, fontweight='bold', color='black')
    
    # Legend items
    ax.add_patch(patches.Rectangle((28, 4), 8, 4, linewidth=1.0, edgecolor='black', facecolor='white'))
    ax.text(32, 6, "Entity", ha='center', va='center', fontsize=7.5)
    
    draw_diamond(46, 6, 8, 4, "Relation")
    
    ax.add_patch(patches.Ellipse((58, 6), width=8, height=3.5, linewidth=1.0, edgecolor='black', facecolor='white'))
    ax.text(58, 6, "Attribute", ha='center', va='center', fontsize=7.5)
    
    ax.add_patch(patches.Ellipse((71, 6), width=8, height=3.5, linewidth=1.0, edgecolor='black', facecolor='white'))
    t_pk = ax.text(71, 6, "PK (Underlined)", ha='center', va='center', fontsize=7, fontweight='bold')
    ax.plot([68, 74], [5.1, 5.1], color='black', linewidth=0.8)
    
    ax.text(88, 6, "1:N, 1:1 = Cardinality", fontsize=7.5, color='black')

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_2_er_model.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_dfd_level0():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 96, "DATA FLOW DIAGRAM (DFD) LEVEL 0 — CONTEXT DIAGRAM", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='black')
    ax.text(50, 92, "High-Level Context Diagram Representing External Entities & Boundary Data Flows", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#333333')

    # External Entities (Rectangles)
    # 1. User
    ax.add_patch(patches.Rectangle((5, 45), 18, 16, linewidth=1.5, edgecolor='black', facecolor='white'))
    ax.text(14, 53, "USER\n(Client / Verifier)", ha='center', va='center', fontsize=9.5, fontweight='bold', color='black')

    # 2. Administrator
    ax.add_patch(patches.Rectangle((5, 10), 18, 16, linewidth=1.5, edgecolor='black', facecolor='white'))
    ax.text(14, 18, "ADMINISTRATOR\n(System Auditor)", ha='center', va='center', fontsize=9.5, fontweight='bold', color='black')

    # 3. Google Gemini 1.5 API
    ax.add_patch(patches.Rectangle((77, 45), 18, 16, linewidth=1.5, edgecolor='black', facecolor='white'))
    ax.text(86, 53, "GOOGLE GEMINI\n1.5 PRO API\n(Cloud Intelligence)", ha='center', va='center', fontsize=9, fontweight='bold', color='black')

    # 4. Email / SMTP Service
    ax.add_patch(patches.Rectangle((77, 10), 18, 16, linewidth=1.5, edgecolor='black', facecolor='white'))
    ax.text(86, 18, "NODEMAILER\nSMTP SERVICE\n(OTP & Security)", ha='center', va='center', fontsize=9, fontweight='bold', color='black')

    # Central Process 0.0 (Circle)
    circ = patches.Circle((50, 45), radius=16, linewidth=1.8, edgecolor='black', facecolor='#FBFBFB')
    ax.add_patch(circ)
    ax.plot([34, 66], [54, 54], color='black', linewidth=1.0)
    ax.text(50, 57, "0.0", ha='center', va='center', fontsize=9, fontweight='bold')
    ax.text(50, 44, "TRUSTLENS AI\nCORE VERIFICATION\nSYSTEM", ha='center', va='center', fontsize=9.5, fontweight='bold')

    # Directed Data Flows (Arrows with Labels)
    # User -> Process
    ax.annotate('', xy=(34, 52), xytext=(23, 55), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(28, 56.5, "Upload Document / Raw Text", fontsize=7.5, ha='center', va='bottom', rotation=12)

    ax.annotate('', xy=(34, 46), xytext=(23, 49), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(28, 49.5, "Task Config & Privacy Toggle", fontsize=7.5, ha='center', va='bottom', rotation=12)

    # Process -> User
    ax.annotate('', xy=(23, 42), xytext=(34, 40), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(28, 38.5, "Trust Score, Claims & Diff Report", fontsize=7.5, ha='center', va='top', rotation=10)

    # Admin -> Process
    ax.annotate('', xy=(38, 35), xytext=(23, 22), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(30, 26, "User Mgmt & Role Config", fontsize=7.5, ha='center', va='bottom', rotation=35)

    # Process -> Admin
    ax.annotate('', xy=(23, 16), xytext=(40, 31), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(33, 19, "Audit Logs & System Telemetry", fontsize=7.5, ha='center', va='top', rotation=35)

    # Process -> Gemini API
    ax.annotate('', xy=(77, 54), xytext=(66, 51), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(71, 55.5, "Sanitized (Masked) Text Stream", fontsize=7.5, ha='center', va='bottom', rotation=12)

    # Gemini API -> Process
    ax.annotate('', xy=(66, 44), xytext=(77, 47), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(71, 42.5, "JSON Evaluation (Summary & Claims)", fontsize=7.5, ha='center', va='top', rotation=12)

    # Process -> SMTP
    ax.annotate('', xy=(77, 22), xytext=(62, 35), arrowprops=dict(arrowstyle="->", color="black", lw=1.2))
    ax.text(70, 26, "OTP Code & Security Alert", fontsize=7.5, ha='center', va='bottom', rotation=-35)

    # Data Store D1: MongoDB (Standard parallel line notation)
    ax.plot([40, 60], [15, 15], color='black', linewidth=1.5)
    ax.plot([40, 60], [8, 8], color='black', linewidth=1.5)
    ax.text(42, 11.5, "D1", fontsize=8.5, fontweight='bold')
    ax.text(51, 11.5, "MongoDB Database", fontsize=8.5, ha='center', va='center')
    
    # Process <-> Data store D1
    ax.annotate('', xy=(47, 15), xytext=(47, 29), arrowprops=dict(arrowstyle="<->", color="black", lw=1.2))
    ax.text(45, 22, "Schemas CRUD", fontsize=7, rotation=90, va='center')

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_3_dfd_level0.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_dfd_level1():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 110)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(55, 98, "DATA FLOW DIAGRAM (DFD) LEVEL 1 — MAJOR INTERNAL PROCESSES", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='black')
    ax.text(55, 95, "Functional Decomposition Showing Seven Core Subsystems & Five Data Stores", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#333333')

    # External Entities
    ax.add_patch(patches.Rectangle((4, 75), 16, 12, linewidth=1.2, edgecolor='black', facecolor='white'))
    ax.text(12, 81, "USER\n(Client)", ha='center', va='center', fontsize=9, fontweight='bold')

    ax.add_patch(patches.Rectangle((4, 20), 16, 12, linewidth=1.2, edgecolor='black', facecolor='white'))
    ax.text(12, 26, "ADMIN\n(Auditor)", ha='center', va='center', fontsize=9, fontweight='bold')

    ax.add_patch(patches.Rectangle((90, 50), 16, 12, linewidth=1.2, edgecolor='black', facecolor='white'))
    ax.text(98, 56, "GEMINI\n1.5 PRO", ha='center', va='center', fontsize=9, fontweight='bold')

    # Processes (Circles with ID bar)
    def draw_proc(cx, cy, pid, name):
        circ = patches.Circle((cx, cy), radius=7.5, linewidth=1.2, edgecolor='black', facecolor='#FAFAFA')
        ax.add_patch(circ)
        ax.plot([cx - 7.5, cx + 7.5], [cy + 2.5, cy + 2.5], color='black', linewidth=0.8)
        ax.text(cx, cy + 4.8, pid, ha='center', va='center', fontsize=7.5, fontweight='bold')
        ax.text(cx, cy - 2, name, ha='center', va='center', fontsize=7.2, fontweight='bold')

    processes = [
        (35, 82, "1.0", "Auth &\nDevice Sec"),
        (35, 60, "2.0", "Ingestion &\nPDF Parse"),
        (62, 60, "3.0", "Privacy &\nPII Masking"),
        (62, 80, "4.0", "ML Spam\nClassifier"),
        (62, 40, "5.0", "Gemini AI\nReasoning"),
        (35, 38, "6.0", "Document\nCompare"),
        (35, 18, "7.0", "Audit Log &\nTelemetry")
    ]
    for cx, cy, pid, name in processes:
        draw_proc(cx, cy, pid, name)

    # Data Stores (Parallel lines)
    def draw_store(x, y, sid, name):
        ax.plot([x, x + 24], [y + 4, y + 4], color='black', linewidth=1.2)
        ax.plot([x, x + 24], [y - 4, y - 4], color='black', linewidth=1.2)
        ax.text(x + 3, y, sid, fontsize=8, fontweight='bold')
        ax.text(x + 14, y, name, fontsize=7.5, ha='center', va='center')

    stores = [
        (82, 80, "D1", "User Accounts"),
        (82, 66, "D2", "Documents"),
        (82, 28, "D3", "Analyses"),
        (82, 14, "D4", "Comparisons"),
        (35, 4, "D5", "Audit Logs")
    ]
    for x, y, sid, name in stores:
        draw_store(x, y, sid, name)

    # Arrows between entities and processes
    flow_arrows = [
        # User -> 1.0 (Login/OTP)
        ((20, 83), (27.5, 83), "Credentials & OTP"),
        # User -> 2.0 (Upload)
        ((16, 75), (28, 64), "PDF / Text File"),
        # 2.0 -> 3.0 (Raw Text)
        ((42.5, 60), (54.5, 60), "Extracted Text"),
        # 3.0 -> 4.0 (Text)
        ((62, 67.5), (62, 72.5), "Text Stream"),
        # 3.0 -> 5.0 (Sanitized Text)
        ((62, 52.5), (62, 47.5), "Masked Text"),
        # 5.0 -> Gemini
        ((69.5, 42), (90, 52), "API Prompt"),
        # Gemini -> 5.0
        ((90, 55), (69.5, 45), "AI Verdict"),
        # 2.0 -> 6.0 (Compare)
        ((35, 52.5), (35, 45.5), "Doc A & B Text"),
        # Admin -> 7.0
        ((20, 23), (27.5, 20), "Audit Query"),
        # 7.0 -> Admin
        ((27.5, 16), (20, 19), "Audit Stream")
    ]
    for p1, p2, lbl in flow_arrows:
        ax.annotate('', xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", color="black", lw=1.0))
        mid = ((p1[0] + p2[0])/2, (p1[1] + p2[1])/2 + 1.2)
        ax.text(mid[0], mid[1], lbl, fontsize=6.8, ha='center', va='bottom', color='#222222')

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_4_dfd_level1.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_dfd_level2():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 96, "DATA FLOW DIAGRAM (DFD) LEVEL 2 — VERIFICATION & PRIVACY SUBSYSTEM", 
            ha='center', va='center', fontsize=12.5, fontweight='bold', color='black')
    ax.text(50, 92, "Decomposition of Process 2.0 & 3.0 (Ingestion, Regex Scan, PII Redaction & Scoring)", 
            ha='center', va='center', fontsize=9, style='italic', color='#333333')

    # Sub-processes (Circles)
    sub_procs = [
        (18, 70, "2.1", "Format Validation\n& File Filter"),
        (48, 70, "2.2", "Text & Layout\nExtraction"),
        (78, 70, "3.1", "RegEx Entity\nScanner"),
        (78, 30, "3.2", "PII Token\nMasking"),
        (48, 30, "3.3", "Dual ML & LLM\nRisk Scorer"),
        (18, 30, "3.4", "Trust Rating\nFormatter")
    ]
    for cx, cy, pid, name in sub_procs:
        circ = patches.Circle((cx, cy), radius=8.5, linewidth=1.2, edgecolor='black', facecolor='#FAFAFA')
        ax.add_patch(circ)
        ax.plot([cx - 8.5, cx + 8.5], [cy + 2.5, cy + 2.5], color='black', linewidth=0.8)
        ax.text(cx, cy + 5, pid, ha='center', va='center', fontsize=8, fontweight='bold')
        ax.text(cx, cy - 2, name, ha='center', va='center', fontsize=7.2, fontweight='bold')

    # Arrows
    p_arrows = [
        ((26.5, 70), (39.5, 70), "Valid File Stream"),
        ((56.5, 70), (69.5, 70), "Extracted Text"),
        ((78, 61.5), (78, 38.5), "Detected PII Set"),
        ((69.5, 30), (56.5, 30), "Sanitized Text"),
        ((39.5, 30), (26.5, 30), "Raw Risk Metrics"),
        ((18, 21.5), (18, 10), "Formatted JSON")
    ]
    for p1, p2, lbl in p_arrows:
        ax.annotate('', xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", color="black", lw=1.1))
        mid = ((p1[0] + p2[0])/2, (p1[1] + p2[1])/2 + (1.5 if p1[1]==p2[1] else 0))
        ax.text(mid[0], mid[1], lbl, fontsize=7.2, ha='center', va='bottom', color='#222222')

    # Data store D2
    ax.plot([40, 56], [53, 53], color='black', linewidth=1.2)
    ax.plot([40, 56], [47, 47], color='black', linewidth=1.2)
    ax.text(42, 50, "D2", fontsize=8, fontweight='bold')
    ax.text(49, 50, "Documents", fontsize=7.5, ha='center', va='center')
    ax.annotate('', xy=(48, 53), xytext=(48, 61.5), arrowprops=dict(arrowstyle="->", color="black", lw=1.0))

    # Output Box
    ax.add_patch(patches.Rectangle((8, 3), 20, 7, linewidth=1.0, edgecolor='black', facecolor='white'))
    ax.text(18, 6.5, "Client Verification Studio\n(UI Gauge & Checklist)", ha='center', va='center', fontsize=7.5)

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_5_dfd_level2.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_system_flowchart():
    fig, ax = plt.subplots(figsize=(9, 9), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 98, "TRUSTLENS AI — SYSTEM OPERATIONAL FLOWCHART", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='black')
    ax.text(50, 95, "ANSI Standard Flowchart Symbols Depicting End-to-End Execution Flow", 
            ha='center', va='center', fontsize=9, style='italic', color='#333333')

    # Flowchart Symbols
    def draw_oval(cx, cy, text):
        e = patches.Ellipse((cx, cy), width=18, height=6, linewidth=1.2, edgecolor='black', facecolor='#F5F5F5')
        ax.add_patch(e)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8.5, fontweight='bold')

    def draw_para(cx, cy, text):
        poly = patches.Polygon([
            (cx - 12, cy - 3), (cx + 8, cy - 3), (cx + 12, cy + 3), (cx - 8, cy + 3)
        ], closed=True, linewidth=1.2, edgecolor='black', facecolor='white')
        ax.add_patch(poly)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8)

    def draw_rect(cx, cy, text):
        r = patches.Rectangle((cx - 12, cy - 3.5), 24, 7, linewidth=1.2, edgecolor='black', facecolor='white')
        ax.add_patch(r)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8)

    def draw_diam(cx, cy, text):
        poly = patches.Polygon([
            (cx, cy + 4.5), (cx + 10, cy), (cx, cy - 4.5), (cx - 10, cy)
        ], closed=True, linewidth=1.2, edgecolor='black', facecolor='white')
        ax.add_patch(poly)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=7.5)

    # Nodes
    draw_oval(50, 90, "START")
    draw_para(50, 80, "User Ingests Document\n(PDF/PNG/JPG/Text)")
    draw_diam(50, 68, "File Type\nSupported?")
    draw_rect(20, 68, "Reject File &\nReturn 400 Bad Req")
    draw_rect(50, 56, "Extract Text via pdf-parse\nor OCR Stream")
    draw_diam(50, 44, "Privacy Shield\nEnabled?")
    draw_rect(76, 44, "Run Information Scanner &\nMask PII Entities ([REDACTED])")
    draw_rect(50, 32, "Evaluate Multinomial Naive Bayes\n& Google Gemini 1.5 Pro")
    draw_rect(50, 20, "Calculate Trust Rating Score (0-100)\n& Compile Explainable Audit Checklist")
    draw_para(50, 9, "Render Findings on UI Studio &\nProvide PDF/PNG Export")
    draw_oval(50, 1.5, "END")

    # Arrows
    f_arrows = [
        ((50, 87), (50, 83), ""),
        ((50, 77), (50, 72.5), ""),
        ((40, 68), (32, 68), "No"),
        ((50, 63.5), (50, 59.5), "Yes"),
        ((50, 52.5), (50, 48.5), ""),
        ((60, 44), (64, 44), "Yes"),
        ((76, 40.5), (62, 32), ""),
        ((50, 39.5), (50, 35.5), "No"),
        ((50, 28.5), (50, 23.5), ""),
        ((50, 16.5), (50, 12), ""),
        ((50, 6), (50, 4.5), "")
    ]
    for p1, p2, lbl in f_arrows:
        ax.annotate('', xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", color="black", lw=1.1))
        if lbl:
            mid = ((p1[0] + p2[0])/2, (p1[1] + p2[1])/2 + 1.2)
            ax.text(mid[0], mid[1], lbl, fontsize=7.5, fontweight='bold')

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_6_system_flowchart.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_use_case_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 97, "UML USE CASE DIAGRAM — TRUSTLENS AI PLATFORM", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='black')
    ax.text(50, 93, "System Boundary with Actors (Public User, Registered User, System Admin)", 
            ha='center', va='center', fontsize=9, style='italic', color='#333333')

    # System Boundary Box
    ax.add_patch(patches.Rectangle((28, 5), 52, 84, linewidth=1.5, edgecolor='black', facecolor='#FCFCFC'))
    ax.text(54, 86, "TrustLens AI System Boundary", fontsize=9.5, fontweight='bold', color='black')

    # Actors (Stick Figures)
    def draw_actor(x, y, label):
        # Head
        ax.add_patch(patches.Circle((x, y + 4), radius=2, linewidth=1.2, edgecolor='black', facecolor='white'))
        # Body
        ax.plot([x, x], [y + 2, y - 2], color='black', linewidth=1.2)
        # Arms
        ax.plot([x - 2.5, x + 2.5], [y + 0.5, y + 0.5], color='black', linewidth=1.2)
        # Legs
        ax.plot([x, x - 2], [y - 2, y - 5], color='black', linewidth=1.2)
        ax.plot([x, x + 2], [y - 2, y - 5], color='black', linewidth=1.2)
        # Label
        ax.text(x, y - 7.5, label, ha='center', va='top', fontsize=8, fontweight='bold')

    draw_actor(12, 70, "Public Guest\n(Unauthenticated)")
    draw_actor(12, 35, "Registered User\n(Student/Verifier)")
    draw_actor(90, 45, "System Admin\n(Security Auditor)")

    # Use Cases (Ovals)
    use_cases = [
        (54, 78, "Browse Public Information &\nView Documentation"),
        (54, 68, "Register Account &\nVerify Email OTP"),
        (54, 57, "Upload Document &\nExtract Text"),
        (54, 46, "Enable Privacy Shield &\nRedact PII Locally"),
        (54, 35, "Execute AI Verification &\nView Trust Meter"),
        (54, 24, "Compare Document Revisions &\nInspect Clause Diffs"),
        (54, 13, "Manage Users, Devices &\nReview Audit Logs")
    ]
    for cx, cy, text in use_cases:
        ellipse = patches.Ellipse((cx, cy), width=32, height=7, linewidth=1.2, edgecolor='black', facecolor='white')
        ax.add_patch(ellipse)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=7.5, color='black')

    # Actor to Use Case Connections
    # Guest
    ax.plot([15, 38], [70, 78], color='black', linewidth=1.0)
    ax.plot([15, 38], [68, 68], color='black', linewidth=1.0)

    # Registered User
    ax.plot([15, 38], [38, 57], color='black', linewidth=1.0)
    ax.plot([15, 38], [36, 46], color='black', linewidth=1.0)
    ax.plot([15, 38], [34, 35], color='black', linewidth=1.0)
    ax.plot([15, 38], [32, 24], color='black', linewidth=1.0)

    # System Admin
    ax.plot([87, 70], [45, 13], color='black', linewidth=1.0)
    ax.plot([87, 70], [46, 35], color='black', linewidth=1.0)

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_7_use_case_diagram.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

def generate_sequence_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Title
    ax.text(50, 97, "UML SEQUENCE DIAGRAM — DOCUMENT VERIFICATION PIPELINE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='black')
    ax.text(50, 93, "Synchronous Message Sequence between Client, API, Privacy Shield, AI & Database", 
            ha='center', va='center', fontsize=9, style='italic', color='#333333')

    # Lifelines
    lifelines = [
        ("User / Client\n(Browser)", 12),
        ("Express API\n(Controller)", 32),
        ("Privacy Shield\n(informationScanner)", 52),
        ("Gemini AI /\nNaive Bayes ML", 72),
        ("MongoDB\n(Analysis Schema)", 90)
    ]
    for name, x in lifelines:
        # Header Box
        r = patches.Rectangle((x - 8, 83), 16, 7, linewidth=1.2, edgecolor='black', facecolor='#F5F5F5')
        ax.add_patch(r)
        ax.text(x, 86.5, name, ha='center', va='center', fontsize=7.5, fontweight='bold')
        # Dashed Lifeline
        ax.plot([x, x], [83, 10], linestyle='--', color='black', linewidth=0.8)

    # Messages (Sequence numbered)
    messages = [
        (12, 32, 78, "1: POST /api/analysis/verify (docId, maskPrivacy)", True),
        (32, 32, 74, "2: Validate Token & Fetch Doc", False),
        (32, 52, 69, "3: scanAndMask(extractedText)", True),
        (52, 32, 64, "4: Return sanitizedText & entities", False),
        (32, 72, 58, "5: classify(text) + analyze(maskedText)", True),
        (72, 32, 51, "6: Return riskScore, claims, summary", False),
        (32, 90, 44, "7: Analysis.create({riskScore, claims})", True),
        (90, 32, 37, "8: Confirm DB record saved", False),
        (32, 12, 30, "9: 201 Created JSON {analysis, meter}", False),
        (12, 12, 23, "10: Render Gauge (78/100) & Checklist", False)
    ]

    for x1, x2, y, msg, is_call in messages:
        if x1 == x2:
            # Self call
            ax.plot([x1, x1 + 5, x1 + 5, x1], [y, y, y - 3, y - 3], color='black', linewidth=1.0)
            ax.annotate('', xy=(x1, y - 3), xytext=(x1 + 5, y - 3), arrowprops=dict(arrowstyle="->", color="black", lw=1.0))
            ax.text(x1 + 6, y - 1.5, msg, fontsize=7, va='center')
        else:
            style = "->" if is_call else "--"
            ax.annotate('', xy=(x2, y), xytext=(x1, y), 
                        arrowprops=dict(arrowstyle="->" if is_call else "->", linestyle='solid' if is_call else 'dashed', color="black", lw=1.1))
            mid_x = (x1 + x2) / 2
            ax.text(mid_x, y + 1.2, msg, fontsize=7.2, ha='center', va='bottom', color='black')

    plt.tight_layout()
    out = os.path.join(ASSETS_DIR, "diag_3_8_sequence_diagram.png")
    plt.savefig(out, dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated:", out)

if __name__ == "__main__":
    print("Generating all standard engineering diagrams...")
    generate_system_architecture()
    generate_er_diagram()
    generate_dfd_level0()
    generate_dfd_level1()
    generate_dfd_level2()
    generate_system_flowchart()
    generate_use_case_diagram()
    generate_sequence_diagram()
    print("All engineering diagrams successfully generated in high resolution!")

