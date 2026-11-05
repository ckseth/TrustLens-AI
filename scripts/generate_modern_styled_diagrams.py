"""
Generate Modern Styled Publication Diagrams matching reference aesthetic
Includes:
1. Entity-Relationship Diagram (ERD)
2. Four-Tier System Architecture Diagram
3. Data Flow Diagram Level 0 (Context Diagram)
4. Data Flow Diagram Level 1 (Subsystems)
5. UML Use Case Modeling Diagram
6. UML Sequence Diagram: Verification Lifecycle
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon

OUTPUT_DIR = "TrustLens_AI_Report_Assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONT_FAMILY = 'DejaVu Sans'

def draw_pill_banner(ax, text, cx=0.5, cy=0.95, w=0.52, h=0.052, bg='#0A2540'):
    """Draws top dark navy pill header with centered white bold title."""
    box = FancyBboxPatch(
        (cx - w/2, cy - h/2), w, h,
        boxstyle="round,pad=0.015,rounding_size=0.025",
        facecolor=bg, edgecolor='#1E3A5F', linewidth=1.5, zorder=10
    )
    ax.add_patch(box)
    ax.text(cx, cy, text, color='white', fontsize=13.5, fontweight='bold',
            ha='center', va='center', family=FONT_FAMILY, zorder=11)

def draw_entity_card(ax, title, attrs, x, y, w, h, header_color='#8B5CF6', body_color='#F5F3FF', border_color=None):
    """Draws a card-based entity table with colorful header and list of attributes."""
    if border_color is None:
        border_color = header_color
        
    # Main outer card with rounded corners
    main_box = FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0.005,rounding_size=0.018",
        facecolor=body_color, edgecolor=border_color, linewidth=1.8, zorder=2
    )
    ax.add_patch(main_box)
    
    # Header strip height
    header_h = h * 0.22 if len(attrs) > 4 else h * 0.26
    header_box = FancyBboxPatch(
        (x, y + h - header_h), w, header_h,
        boxstyle="round,pad=0.005,rounding_size=0.018",
        facecolor=header_color, edgecolor=border_color, linewidth=1.8, zorder=3
    )
    ax.add_patch(header_box)
    
    # Cover bottom corners of header to make flat separator
    flat_rect = Rectangle(
        (x, y + h - header_h), w, header_h * 0.5,
        facecolor=header_color, edgecolor=header_color, linewidth=0, zorder=3.5
    )
    ax.add_patch(flat_rect)
    
    # Separator line
    ax.plot([x, x + w], [y + h - header_h, y + h - header_h], color=border_color, linewidth=1.5, zorder=4)
    
    # Header Text
    ax.text(x + w/2, y + h - header_h/2, title, color='#0F172A', fontsize=10.5, fontweight='bold',
            ha='center', va='center', family=FONT_FAMILY, zorder=5)
    
    # Body Attributes
    n_attrs = len(attrs)
    content_y_start = y + h - header_h - 0.018
    avail_h = content_y_start - (y + 0.012)
    step = avail_h / max(n_attrs, 1)
    
    for i, attr in enumerate(attrs):
        curr_y = content_y_start - (i + 0.5) * step
        # Bold PK / FK tags
        if '(PK)' in attr or '(FK)' in attr:
            parts = attr.split('(')
            name_part = parts[0].strip()
            key_part = '(' + parts[1]
            ax.text(x + 0.012, curr_y, name_part, color='#1E293B', fontsize=8.8, fontweight='normal',
                    ha='left', va='center', family=FONT_FAMILY, zorder=5)
            # Tag slightly darker
            ax.text(x + w - 0.012, curr_y, key_part, color='#334155', fontsize=8.2, fontweight='bold',
                    ha='right', va='center', family=FONT_FAMILY, zorder=5)
        else:
            ax.text(x + 0.012, curr_y, attr, color='#334155', fontsize=8.8, fontweight='normal',
                    ha='left', va='center', family=FONT_FAMILY, zorder=5)

def draw_orthogonal_line(ax, x1, y1, x2, y2, verb=None, c1=None, c2=None, route='h-v', color='#1E293B'):
    """Draws right-angle connecting line with cardinalities and relationship label."""
    if route == 'h-v':
        # horizontal then vertical
        mid_x = (x1 + x2) / 2
        ax.plot([x1, mid_x, mid_x, x2], [y1, y1, y2, y2], color=color, linewidth=1.4, zorder=1)
        if verb:
            ax.text(mid_x, (y1 + y2)/2, f" {verb} ", color='#0F172A', fontsize=8.5, fontweight='bold',
                    ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    elif route == 'v-h':
        # vertical then horizontal
        mid_y = (y1 + y2) / 2
        ax.plot([x1, x1, x2, x2], [y1, mid_y, mid_y, y2], color=color, linewidth=1.4, zorder=1)
        if verb:
            ax.text((x1 + x2)/2, mid_y, f" {verb} ", color='#0F172A', fontsize=8.5, fontweight='bold',
                    ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    elif route == 'direct':
        ax.plot([x1, x2], [y1, y2], color=color, linewidth=1.4, zorder=1)
        if verb:
            ax.text((x1 + x2)/2, (y1 + y2)/2, f" {verb} ", color='#0F172A', fontsize=8.5, fontweight='bold',
                    ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
            
    # Cardinality labels
    if c1:
        # Near start point
        dx = 0.015 if x1 < x2 else -0.015
        dy = 0.015 if y1 <= y2 else -0.015
        ax.text(x1 + dx, y1 + dy, c1, color='#0F172A', fontsize=9, fontweight='bold',
                ha='center', va='center', family=FONT_FAMILY, zorder=6)
    if c2:
        # Near end point
        dx = -0.015 if x1 < x2 else 0.015
        dy = -0.015 if y1 <= y2 else 0.015
        ax.text(x2 + dx, y2 + dy, c2, color='#0F172A', fontsize=9, fontweight='bold',
                ha='center', va='center', family=FONT_FAMILY, zorder=6)

print("Base helper routines configured.")

def build_erd_diagram():
    """Generates the Entity Relationship Diagram matching reference visual style."""
    fig, ax = plt.subplots(figsize=(15, 10), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # 1. Top Pill Banner
    draw_pill_banner(ax, "TrustLens AI – Entity Relationship Diagram", cx=0.5, cy=0.96, w=0.58, h=0.055, bg='#0A2540')
    
    # 2. Central Entity: User (Purple)
    user_attrs = [
        "user_id (PK)",
        "name",
        "email",
        "password_hash",
        "role",
        "created_at"
    ]
    draw_entity_card(ax, "User", user_attrs, 0.41, 0.48, 0.18, 0.28,
                     header_color='#C4B5FD', body_color='#F5F3FF', border_color='#8B5CF6')
    
    # 3. Left-Top: Document (Blue)
    doc_attrs = [
        "document_id (PK)",
        "user_id (FK)",
        "original_filename",
        "sha256_hash",
        "mime_type",
        "file_size",
        "extracted_text"
    ]
    draw_entity_card(ax, "Document", doc_attrs, 0.05, 0.65, 0.22, 0.26,
                     header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')
    
    # 4. Left-Middle: Comparison (Green)
    comp_attrs = [
        "comparison_id (PK)",
        "user_id (FK)",
        "doc_a_id (FK)",
        "doc_b_id (FK)",
        "similarity_score",
        "diff_clauses"
    ]
    draw_entity_card(ax, "Comparison", comp_attrs, 0.05, 0.38, 0.22, 0.22,
                     header_color='#86EFAC', body_color='#F0FDF4', border_color='#22C55E')
                     
    # 5. Left-Bottom: AuditLog (Orange)
    audit_attrs = [
        "log_id (PK)",
        "user_id (FK)",
        "action",
        "client_ip",
        "user_agent",
        "timestamp"
    ]
    draw_entity_card(ax, "AuditLog", audit_attrs, 0.05, 0.09, 0.22, 0.23,
                     header_color='#FED7AA', body_color='#FFF7ED', border_color='#F97316')
                     
    # 6. Right-Top: DeviceSession (Lime)
    dev_attrs = [
        "device_id (PK)",
        "user_id (FK)",
        "fingerprint_hash",
        "user_agent",
        "ip_address",
        "is_trusted"
    ]
    draw_entity_card(ax, "DeviceSession", dev_attrs, 0.73, 0.68, 0.22, 0.23,
                     header_color='#BEF264', body_color='#F7FEE7', border_color='#84CC16')
                     
    # 7. Right-Middle: OTPVerification (Cyan)
    otp_attrs = [
        "otp_id (PK)",
        "user_id (FK)",
        "hashed_code",
        "expires_at",
        "is_used"
    ]
    draw_entity_card(ax, "OTPVerification", otp_attrs, 0.73, 0.40, 0.22, 0.21,
                     header_color='#67E8F9', body_color='#ECFEFF', border_color='#06B6D4')

    # 8. Bottom-Center: Analysis (Violet)
    analysis_attrs = [
        "analysis_id (PK)",
        "document_id (FK)",
        "user_id (FK)",
        "trust_score",
        "risk_tier",
        "ml_spam_score",
        "gemini_ai_score"
    ]
    draw_entity_card(ax, "Analysis", analysis_attrs, 0.41, 0.09, 0.20, 0.26,
                     header_color='#DDD6FE', body_color='#FAF5FF', border_color='#7C3AED')
                     
    # 9. Bottom-Right: AIService (Pink)
    ai_attrs = [
        "service_id (PK)",
        "service_type",
        "provider",
        "model_name",
        "confidence"
    ]
    draw_entity_card(ax, "AIService", ai_attrs, 0.73, 0.10, 0.22, 0.21,
                     header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')

    # Connectors with Elbow Routing, Verbs, and Cardinalities (1 and N)
    
    # User -> Document (uploads)
    # User left edge at (0.41, 0.70) to Document right edge at (0.27, 0.78)
    mid_x_doc = 0.34
    ax.plot([0.41, mid_x_doc, mid_x_doc, 0.27], [0.70, 0.70, 0.78, 0.78], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.34, 0.75, " uploads ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.395, 0.715, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.285, 0.795, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # User -> Comparison (compares)
    # User left edge at (0.41, 0.58) to Comparison right edge at (0.27, 0.49)
    mid_x_comp = 0.34
    ax.plot([0.41, mid_x_comp, mid_x_comp, 0.27], [0.58, 0.58, 0.49, 0.49], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.34, 0.535, " compares ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.395, 0.595, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.285, 0.505, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # User -> AuditLog (generates)
    # User bottom-left at (0.42, 0.48) to AuditLog right edge at (0.27, 0.20)
    ax.plot([0.42, 0.34, 0.34, 0.27], [0.48, 0.48, 0.20, 0.20], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.34, 0.34, " generates ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.395, 0.465, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.285, 0.215, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # User -> DeviceSession (authorizes)
    # User right edge at (0.59, 0.70) to DeviceSession left edge at (0.73, 0.79)
    mid_x_dev = 0.66
    ax.plot([0.59, mid_x_dev, mid_x_dev, 0.73], [0.70, 0.70, 0.79, 0.79], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.66, 0.75, " authorizes ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.605, 0.715, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.715, 0.805, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # User -> OTPVerification (receives)
    # User right edge at (0.59, 0.58) to OTPVerification left edge at (0.73, 0.50)
    mid_x_otp = 0.66
    ax.plot([0.59, mid_x_otp, mid_x_otp, 0.73], [0.58, 0.58, 0.50, 0.50], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.66, 0.54, " receives ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.605, 0.595, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.715, 0.515, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # User -> Analysis (requests)
    # Direct vertical line from User bottom to Analysis top
    ax.plot([0.50, 0.50], [0.48, 0.35], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.50, 0.415, " requests ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.52, 0.46, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.52, 0.37, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    # Analysis -> AIService (uses)
    # Analysis right edge at (0.61, 0.20) to AIService left edge at (0.73, 0.20)
    ax.plot([0.61, 0.73], [0.20, 0.20], color='#1E293B', linewidth=1.5, zorder=1)
    ax.text(0.67, 0.22, " uses ", color='#0F172A', fontsize=9, fontweight='bold', ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)
    ax.text(0.625, 0.18, "N", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)
    ax.text(0.715, 0.18, "1", color='#0F172A', fontsize=9.5, fontweight='bold', zorder=6)

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_2_er_diagram.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

build_erd_diagram()

def build_system_architecture():
    """Generates the Four-Tier System Architecture Diagram."""
    fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # Title Banner
    draw_pill_banner(ax, "TrustLens AI – Multi-Tier System Architecture", cx=0.5, cy=0.96, w=0.60, h=0.052, bg='#0A2540')
    
    # Tier 1: Client Presentation Layer
    tier1_bg = FancyBboxPatch((0.03, 0.73), 0.94, 0.175, boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor='#F8FAFC', edgecolor='#CBD5E1', linewidth=1.5, zorder=1)
    ax.add_patch(tier1_bg)
    ax.text(0.05, 0.885, "TIER 1: CLIENT PRESENTATION LAYER (SPA - HTML5 / CSS3 / REACTIVE JS)",
            color='#1E293B', fontsize=10, fontweight='bold', family=FONT_FAMILY, zorder=2)
            
    draw_entity_card(ax, "Home Studio", ["Hero Inspection Banner", "Dark/Light Theme Toggle", "Overview Telemetry"],
                     0.05, 0.745, 0.20, 0.13, header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')
    draw_entity_card(ax, "Verification Studio", ["Drag & Drop Ingestion", "PDF / Image / TXT Stream", "Dynamic Trust Gauge"],
                     0.28, 0.745, 0.20, 0.13, header_color='#C4B5FD', body_color='#F5F3FF', border_color='#8B5CF6')
    draw_entity_card(ax, "Compare Engine", ["Side-by-Side Diff Panels", "Clause Highlight Matrix", "Similarity Score Display"],
                     0.51, 0.745, 0.20, 0.13, header_color='#86EFAC', body_color='#F0FDF4', border_color='#22C55E')
    draw_entity_card(ax, "Security Portal", ["Math CAPTCHA Solver", "6-Digit OTP Modal", "Device Authorization"],
                     0.74, 0.745, 0.20, 0.13, header_color='#FED7AA', body_color='#FFF7ED', border_color='#F97316')
                     
    # Tier 2: API Gateway & Security Layer
    tier2_bg = FancyBboxPatch((0.03, 0.51), 0.94, 0.175, boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor='#F8FAFC', edgecolor='#CBD5E1', linewidth=1.5, zorder=1)
    ax.add_patch(tier2_bg)
    ax.text(0.05, 0.665, "TIER 2: APPLICATION GATEWAY & SECURITY MIDDLEWARE (NODE.JS / EXPRESS)",
            color='#1E293B', fontsize=10, fontweight='bold', family=FONT_FAMILY, zorder=2)

    draw_entity_card(ax, "REST API Router", ["/api/auth (JWT & OTP)", "/api/analysis (Verify)", "/api/comparison (Diff)", "/api/privacy (Scan)"],
                     0.05, 0.525, 0.20, 0.13, header_color='#DDD6FE', body_color='#FAF5FF', border_color='#7C3AED')
    draw_entity_card(ax, "Security Guards", ["JWT HS256 Tokenization", "Role-Based Access (RBAC)", "Rate Limiting Middleware"],
                     0.28, 0.525, 0.20, 0.13, header_color='#BEF264', body_color='#F7FEE7', border_color='#84CC16')
    draw_entity_card(ax, "Multer Streamer", ["25MB Bound Enforcer", "Disk/Memory Buffering", "MIME Type Sanitizer"],
                     0.51, 0.525, 0.20, 0.13, header_color='#67E8F9', body_color='#ECFEFF', border_color='#06B6D4')
    draw_entity_card(ax, "Diagnostics & Logger", ["Health Check Ping (47ms)", "Central Error Handler", "Winston Telemetry"],
                     0.74, 0.525, 0.20, 0.13, header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')

    # Tier 3: Intelligence & Verification Core
    tier3_bg = FancyBboxPatch((0.03, 0.26), 0.94, 0.205, boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor='#F8FAFC', edgecolor='#CBD5E1', linewidth=1.5, zorder=1)
    ax.add_patch(tier3_bg)
    ax.text(0.05, 0.445, "TIER 3: DUAL-ENGINE INTELLIGENCE & PRIVACY SHIELD",
            color='#1E293B', fontsize=10, fontweight='bold', family=FONT_FAMILY, zorder=2)

    draw_entity_card(ax, "Edge Privacy Shield", ["Deterministic Regex", "Email / Phone Masking", "UPI Handle Redaction", "Latency: 8.4 ms"],
                     0.05, 0.28, 0.17, 0.155, header_color='#86EFAC', body_color='#F0FDF4', border_color='#22C55E')
    draw_entity_card(ax, "Local ML Classifier", ["Multinomial Naive Bayes", "Laplace Add-One Smooth", "TF-IDF Feature Space", "Latency: 14.6 ms"],
                     0.24, 0.28, 0.17, 0.155, header_color='#6EE7B7', body_color='#ECFDF5', border_color='#10B981')
    draw_entity_card(ax, "Multimodal AI (Gemini)", ["Gemini 1.5 Pro REST API", "Cognitive Reasoning", "Structural Splice Audit", "Latency: 2.85 s"],
                     0.43, 0.28, 0.17, 0.155, header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')
    draw_entity_card(ax, "Document Diff Engine", ["Sentence Jaccard Index", "Entity Discrepancy Map", "Fee & Date Detector", "Latency: 45.0 ms"],
                     0.62, 0.28, 0.17, 0.155, header_color='#67E8F9', body_color='#ECFEFF', border_color='#06B6D4')
    draw_entity_card(ax, "Trust Score Fusion", ["Weighted Formula Engine", "Low Risk (>= 75)", "Med Risk (45 - 74)", "High Risk (< 45)"],
                     0.81, 0.28, 0.16, 0.155, header_color='#FDE68A', body_color='#FFFBEB', border_color='#F59E0B')

    # Tier 4: Audited Persistence Layer
    tier4_bg = FancyBboxPatch((0.03, 0.04), 0.94, 0.175, boxstyle="round,pad=0.01,rounding_size=0.02",
                              facecolor='#F8FAFC', edgecolor='#CBD5E1', linewidth=1.5, zorder=1)
    ax.add_patch(tier4_bg)
    ax.text(0.05, 0.195, "TIER 4: AUDITED PERSISTENCE LAYER (MONGODB NOSQL CLUSTER)",
            color='#1E293B', fontsize=10, fontweight='bold', family=FONT_FAMILY, zorder=2)

    draw_entity_card(ax, "Users & Roles", ["Indexed Email (UK)", "Bcrypt 10-Salt Hash", "Role: user | admin"],
                     0.05, 0.055, 0.14, 0.13, header_color='#C4B5FD', body_color='#F5F3FF', border_color='#8B5CF6')
    draw_entity_card(ax, "Documents", ["SHA-256 Hash Index", "Storage Disk Path", "Extracted Raw Text"],
                     0.205, 0.055, 0.14, 0.13, header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')
    draw_entity_card(ax, "Analyses", ["Trust Score (0-100)", "Risk Classification", "Sub-Score Breakdown"],
                     0.36, 0.055, 0.14, 0.13, header_color='#DDD6FE', body_color='#FAF5FF', border_color='#7C3AED')
    draw_entity_card(ax, "Comparisons", ["Jaccard Similarity", "Diff Clause JSON", "Doc A / Doc B Refs"],
                     0.515, 0.055, 0.14, 0.13, header_color='#67E8F9', body_color='#ECFEFF', border_color='#06B6D4')
    draw_entity_card(ax, "Devices & OTP", ["Browser Fingerprint", "6-Digit Hashed OTP", "TTL Auto-Expire Index"],
                     0.67, 0.055, 0.14, 0.13, header_color='#BEF264', body_color='#F7FEE7', border_color='#84CC16')
    draw_entity_card(ax, "AuditLogs", ["Append-Only Forensics", "Action, Client IP", "UTC ISO Timestamp"],
                     0.825, 0.055, 0.14, 0.13, header_color='#FECDD3', body_color='#FFF1F2', border_color='#F43F5E')

    # Flow arrows between tiers
    # Tier 1 to Tier 2
    ax.annotate("", xy=(0.5, 0.69), xytext=(0.5, 0.73),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.8))
    ax.text(0.51, 0.708, "HTTPS / REST API Requests", color="#0F172A", fontsize=8.5, fontweight="bold", zorder=5)

    # Tier 2 to Tier 3
    ax.annotate("", xy=(0.5, 0.47), xytext=(0.5, 0.51),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.8))
    ax.text(0.51, 0.488, "Sanitized Payload & Model Dispatch", color="#0F172A", fontsize=8.5, fontweight="bold", zorder=5)

    # Tier 3 to Tier 4
    ax.annotate("", xy=(0.5, 0.22), xytext=(0.5, 0.26),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.8))
    ax.text(0.51, 0.238, "Mongoose ODM Persistent Storage", color="#0F172A", fontsize=8.5, fontweight="bold", zorder=5)

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_1_system_architecture.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

def build_dfd_level0():
    """Generates the DFD Level 0 Context Diagram."""
    fig, ax = plt.subplots(figsize=(15, 10), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # Title Banner
    draw_pill_banner(ax, "TrustLens AI – Context-Level Data Flow Diagram (Level 0)", cx=0.5, cy=0.96, w=0.62, h=0.052, bg='#0A2540')
    
    # Central System Process (0.0)
    circ = FancyBboxPatch((0.36, 0.38), 0.28, 0.24, boxstyle="round,pad=0.015,rounding_size=0.03",
                          facecolor='#EDE9FE', edgecolor='#7C3AED', linewidth=2.5, zorder=3)
    ax.add_patch(circ)
    ax.text(0.50, 0.53, "0.0", color='#5B21B6', fontsize=14, fontweight='bold', ha='center', va='center', family=FONT_FAMILY, zorder=4)
    ax.text(0.50, 0.48, "TrustLens AI Platform", color='#0F172A', fontsize=11.5, fontweight='bold', ha='center', va='center', family=FONT_FAMILY, zorder=4)
    ax.text(0.50, 0.43, "Document Verification & Fraud Forensics Core", color='#475569', fontsize=8.8, ha='center', va='center', family=FONT_FAMILY, zorder=4)

    # External Entities
    # 1. End User (Top-Left)
    draw_entity_card(ax, "End User / Auditor", ["• Submits Document Payload", "• Submits Auth & CAPTCHA", "• Enters 6-Digit Email OTP"],
                     0.04, 0.65, 0.23, 0.19, header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')
                     
    # 2. Cloud AI API (Top-Right)
    draw_entity_card(ax, "Google Gemini 1.5 Pro", ["• Receives Sanitized Text/Images", "• Cognitive Forgery Detection", "• Returns Verified Claims"],
                     0.73, 0.65, 0.23, 0.19, header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')

    # 3. SMTP Gateway (Bottom-Left)
    draw_entity_card(ax, "SMTP Mail Gateway", ["• Receives OTP Delivery Event", "• Issues HTML Email Challenge", "• Delivers Security Alerts"],
                     0.04, 0.14, 0.23, 0.19, header_color='#FED7AA', body_color='#FFF7ED', border_color='#F97316')

    # 4. MongoDB Database (Bottom-Right)
    draw_entity_card(ax, "MongoDB Cluster", ["• Users & Salted Hashes", "• Verification Trust Records", "• Immutable Audit Logs"],
                     0.73, 0.14, 0.23, 0.19, header_color='#86EFAC', body_color='#F0FDF4', border_color='#22C55E')

    # Labeled Data Flows (Right-Angle Connectors with White Pill Backgrounds)
    
    # User -> System: Upload Doc
    ax.annotate("", xy=(0.36, 0.56), xytext=(0.27, 0.73),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.28, 0.63, " Uploads Doc & Creds ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    # System -> User: Results & Trust Meter
    ax.annotate("", xy=(0.27, 0.68), xytext=(0.36, 0.50),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.27, 0.56, " Trust Score & Risk Tier ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    # System -> Gemini: Sanitized Payload
    ax.annotate("", xy=(0.73, 0.74), xytext=(0.64, 0.56),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.66, 0.65, " Sanitized PII Payload ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    # Gemini -> System: Cognitive Audit
    ax.annotate("", xy=(0.64, 0.50), xytext=(0.73, 0.67),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.65, 0.57, " AI Findings & Verification ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    # System -> SMTP: OTP Request
    ax.annotate("", xy=(0.27, 0.25), xytext=(0.38, 0.40),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.28, 0.35, " Issue 6-Digit OTP ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    # SMTP -> User: Inbox Email
    ax.annotate("", xy=(0.14, 0.65), xytext=(0.14, 0.33),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5, ls="--"))
    ax.text(0.14, 0.49, " Deliver OTP Email ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", ha="center", zorder=5)

    # System <-> MongoDB: Reads & Writes
    ax.annotate("", xy=(0.73, 0.25), xytext=(0.62, 0.40),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.64, 0.35, " Insert Analyses & Logs ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)
    
    ax.annotate("", xy=(0.60, 0.43), xytext=(0.73, 0.29),
                arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.69, 0.40, " Query Historical Records ", color="#0F172A", fontsize=8.5, fontweight="bold", backgroundcolor="#FFFFFF", zorder=5)

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_3_dfd_level0.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

def build_dfd_level1():
    """Generates the DFD Level 1 Subsystem Decomposition Diagram."""
    fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # Title Banner
    draw_pill_banner(ax, "TrustLens AI – Subsystem Data Flow Diagram (Level 1)", cx=0.5, cy=0.96, w=0.62, h=0.052, bg='#0A2540')

    # Subsystem Process Cards (Circular / Rounded Card Style)
    draw_entity_card(ax, "1.0 Auth & Device MFA", ["• Math CAPTCHA Check", "• SHA-256 Fingerprint", "• 6-Digit Email OTP"],
                     0.04, 0.67, 0.20, 0.19, header_color='#C4B5FD', body_color='#F5F3FF', border_color='#8B5CF6')
                     
    draw_entity_card(ax, "2.0 Ingestion & Extraction", ["• Multer Buffer Stream", "• PDF-Parse / OCR Buffer", "• Raw Character Stream"],
                     0.28, 0.67, 0.20, 0.19, header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')

    draw_entity_card(ax, "3.0 Privacy Shield Redaction", ["• Deterministic Regex", "• Email/Phone Masking", "• UPI Handle Sanitizer"],
                     0.52, 0.67, 0.20, 0.19, header_color='#86EFAC', body_color='#F0FDF4', border_color='#22C55E')

    draw_entity_card(ax, "4.0 Dual-Engine AI Scoring", ["• Multinomial Naive Bayes", "• Google Gemini 1.5 Pro", "• Laplace & Claim Check"],
                     0.76, 0.67, 0.20, 0.19, header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')

    draw_entity_card(ax, "5.0 Score Aggregator", ["• Weighted Risk Formula", "• Trust Rating (0-100)", "• Audit Checklist Builder"],
                     0.76, 0.35, 0.20, 0.19, header_color='#FDE68A', body_color='#FFFBEB', border_color='#F59E0B')

    draw_entity_card(ax, "6.0 Document Compare", ["• Sentence Jaccard Index", "• Discrepancy Extractor", "• Clause Modification Map"],
                     0.04, 0.35, 0.20, 0.19, header_color='#67E8F9', body_color='#ECFEFF', border_color='#06B6D4')

    draw_entity_card(ax, "7.0 Security Audit Logging", ["• Tamper-Evident Records", "• User Action & IP Track", "• System Telemetry"],
                     0.40, 0.35, 0.20, 0.19, header_color='#FECDD3', body_color='#FFF1F2', border_color='#F43F5E')

    # Data Stores (Open-ended cylinder / card style)
    draw_entity_card(ax, "D1: Users Store", ["Indexed Emails, Roles", "Bcrypt Password Hashes"],
                     0.04, 0.08, 0.16, 0.15, header_color='#E2E8F0', body_color='#F8FAFC', border_color='#64748B')
    draw_entity_card(ax, "D2: Documents Store", ["SHA256 Hashes, Paths", "Extracted Raw Text"],
                     0.23, 0.08, 0.16, 0.15, header_color='#E2E8F0', body_color='#F8FAFC', border_color='#64748B')
    draw_entity_card(ax, "D3: Analyses Store", ["Trust Scores (0-100)", "Risk Tiers, Checklists"],
                     0.42, 0.08, 0.16, 0.15, header_color='#E2E8F0', body_color='#F8FAFC', border_color='#64748B')
    draw_entity_card(ax, "D4: Comparisons Store", ["Jaccard Similarity Matrix", "Clause Shift Records"],
                     0.61, 0.08, 0.16, 0.15, header_color='#E2E8F0', body_color='#F8FAFC', border_color='#64748B')
    draw_entity_card(ax, "D5: AuditLogs Store", ["Append-Only Event Trail", "Client IPs & Timestamps"],
                     0.80, 0.08, 0.16, 0.15, header_color='#E2E8F0', body_color='#F8FAFC', border_color='#64748B')

    # Connecting Process Data Flows
    # 2.0 -> 3.0
    ax.annotate("", xy=(0.52, 0.76), xytext=(0.48, 0.76), arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.50, 0.78, "Raw Text", color="#0F172A", fontsize=8, fontweight="bold", ha="center")
    
    # 3.0 -> 4.0
    ax.annotate("", xy=(0.76, 0.76), xytext=(0.72, 0.76), arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.74, 0.78, "Sanitized Text", color="#0F172A", fontsize=8, fontweight="bold", ha="center")

    # 4.0 -> 5.0
    ax.annotate("", xy=(0.86, 0.54), xytext=(0.86, 0.67), arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.5))
    ax.text(0.87, 0.60, "Model Scores", color="#0F172A", fontsize=8, fontweight="bold")

    # Connectors to Stores
    # 1.0 <-> D1
    ax.annotate("", xy=(0.10, 0.23), xytext=(0.10, 0.67), arrowprops=dict(arrowstyle="<->", color="#64748B", lw=1.2, ls="--"))
    # 2.0 -> D2
    ax.annotate("", xy=(0.31, 0.23), xytext=(0.36, 0.67), arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, ls="--"))
    # 5.0 -> D3
    ax.annotate("", xy=(0.50, 0.23), xytext=(0.78, 0.35), arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, ls="--"))
    # 6.0 -> D4
    ax.annotate("", xy=(0.65, 0.23), xytext=(0.20, 0.35), arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, ls="--"))
    # 7.0 -> D5
    ax.annotate("", xy=(0.85, 0.23), xytext=(0.55, 0.35), arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, ls="--"))

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_4_dfd_level1.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

def build_use_case_diagram():
    """Generates the UML Use Case Diagram."""
    fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # Title Banner
    draw_pill_banner(ax, "TrustLens AI – UML Use Case Diagram", cx=0.5, cy=0.96, w=0.52, h=0.052, bg='#0A2540')

    # System Boundary Box
    boundary = FancyBboxPatch((0.24, 0.05), 0.52, 0.86, boxstyle="round,pad=0.015,rounding_size=0.025",
                              facecolor='#F8FAFC', edgecolor='#64748B', linewidth=2.0, zorder=1)
    ax.add_patch(boundary)
    ax.text(0.50, 0.885, "TrustLens AI Verification & Security Platform Boundary", color='#1E293B',
            fontsize=11, fontweight='bold', ha='center', family=FONT_FAMILY, zorder=2)

    # Left Actors
    # Actor 1: Registered User
    draw_entity_card(ax, "Registered User", ["• Uploads Document", "• Inspects Trust Gauge", "• Compares Versions", "• Submits 6-Digit OTP"],
                     0.02, 0.55, 0.18, 0.22, header_color='#93C5FD', body_color='#EFF6FF', border_color='#3B82F6')
                     
    # Actor 2: Compliance Auditor / Admin
    draw_entity_card(ax, "Compliance Admin", ["• Reviews Audit Logs", "• Revokes Untrusted Devices", "• System Configuration"],
                     0.02, 0.18, 0.18, 0.20, header_color='#C4B5FD', body_color='#F5F3FF', border_color='#8B5CF6')

    # Right Actors
    # Actor 3: Google Gemini API
    draw_entity_card(ax, "Google Gemini 1.5", ["• Multimodal AI API", "• Cognitive Reasoning", "• Claim Verification"],
                     0.80, 0.58, 0.18, 0.19, header_color='#FBCFE8', body_color='#FDF2F8', border_color='#EC4899')

    # Actor 4: SMTP Service
    draw_entity_card(ax, "SMTP Mail Service", ["• Email Code Dispatch", "• Security Event Alerts", "• Delivery Confirmation"],
                     0.80, 0.22, 0.18, 0.19, header_color='#FED7AA', body_color='#FFF7ED', border_color='#F97316')

    # Use Case Ovals / Pills inside boundary
    def draw_uc_pill(uc_text, cx, cy, w=0.42, h=0.052, bg='#EDE9FE', border='#7C3AED'):
        box = FancyBboxPatch((cx - w/2, cy - h/2), w, h, boxstyle="round,pad=0.01,rounding_size=0.025",
                             facecolor=bg, edgecolor=border, linewidth=1.5, zorder=3)
        ax.add_patch(box)
        ax.text(cx, cy, uc_text, color='#0F172A', fontsize=9.2, fontweight='bold', ha='center', va='center', family=FONT_FAMILY, zorder=4)

    draw_uc_pill("UC-01: Sign In with Math CAPTCHA", 0.50, 0.83, bg='#EFF6FF', border='#3B82F6')
    draw_uc_pill("UC-02: Challenge Unrecognized Device (<<extend>>)", 0.50, 0.75, bg='#FFF7ED', border='#F97316')
    draw_uc_pill("UC-03: Verify 6-Digit Email OTP", 0.50, 0.67, bg='#FEF3C7', border='#F59E0B')
    draw_uc_pill("UC-04: Ingest Document Payload (PDF, Image, TXT)", 0.50, 0.59, bg='#F0FDF4', border='#22C55E')
    draw_uc_pill("UC-05: Redact Sensitive PII (<<include>> Privacy Shield)", 0.50, 0.51, bg='#ECFDF5', border='#10B981')
    draw_uc_pill("UC-06: Compute Local Naive Bayes Posterior Probability", 0.50, 0.43, bg='#F5F3FF', border='#8B5CF6')
    draw_uc_pill("UC-07: Execute Multimodal AI Verification (Gemini 1.5)", 0.50, 0.35, bg='#FDF2F8', border='#EC4899')
    draw_uc_pill("UC-08: Generate Explainable Trust Rating & Risk Tier", 0.50, 0.27, bg='#EFF6FF', border='#2563EB')
    draw_uc_pill("UC-09: Compare Document Revisions & Extract Diff", 0.50, 0.19, bg='#ECFEFF', border='#06B6D4')
    draw_uc_pill("UC-10: Inspect Security Audit Logs & System Telemetry", 0.50, 0.11, bg='#FFF1F2', border='#F43F5E')

    # Association Lines
    # User -> UC-01
    ax.plot([0.20, 0.29], [0.68, 0.83], color='#1E293B', lw=1.3, zorder=2)
    # User -> UC-04
    ax.plot([0.20, 0.29], [0.66, 0.59], color='#1E293B', lw=1.3, zorder=2)
    # User -> UC-09
    ax.plot([0.20, 0.29], [0.62, 0.19], color='#1E293B', lw=1.3, zorder=2)

    # Admin -> UC-10
    ax.plot([0.20, 0.29], [0.28, 0.11], color='#1E293B', lw=1.3, zorder=2)

    # UC-02 -> SMTP
    ax.plot([0.71, 0.80], [0.75, 0.32], color='#1E293B', lw=1.3, ls='--', zorder=2)

    # UC-07 -> Gemini
    ax.plot([0.71, 0.80], [0.35, 0.65], color='#1E293B', lw=1.3, zorder=2)

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_7_use_case.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

def build_sequence_diagram():
    """Generates the UML Sequence Diagram: Multi-Tier Verification Lifecycle."""
    fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    
    # Title Banner
    draw_pill_banner(ax, "TrustLens AI – Multi-Tier Verification Lifecycle Sequence Diagram", cx=0.5, cy=0.96, w=0.68, h=0.052, bg='#0A2540')

    # Lifeline Column Coordinates
    lifelines = [
        ("Client Browser", 0.08, '#93C5FD', '#EFF6FF', '#3B82F6'),
        ("Express Gateway", 0.25, '#C4B5FD', '#F5F3FF', '#8B5CF6'),
        ("Privacy Shield", 0.42, '#86EFAC', '#F0FDF4', '#22C55E'),
        ("Naive Bayes ML", 0.58, '#6EE7B7', '#ECFDF5', '#10B981'),
        ("Google Gemini AI", 0.75, '#FBCFE8', '#FDF2F8', '#EC4899'),
        ("MongoDB Cluster", 0.92, '#FED7AA', '#FFF7ED', '#F97316')
    ]
    
    top_y = 0.88
    bot_y = 0.06

    for name, cx, h_col, b_col, stroke in lifelines:
        # Card header at top of lifeline
        w = 0.13
        h = 0.055
        card = FancyBboxPatch((cx - w/2, top_y - h), w, h, boxstyle="round,pad=0.008,rounding_size=0.015",
                              facecolor=b_col, edgecolor=stroke, linewidth=1.8, zorder=4)
        ax.add_patch(card)
        ax.text(cx, top_y - h/2, name, color='#0F172A', fontsize=9.5, fontweight='bold', ha='center', va='center', family=FONT_FAMILY, zorder=5)
        
        # Vertical dashed lifeline
        ax.plot([cx, cx], [top_y - h, bot_y], color='#94A3B8', lw=1.2, ls='--', zorder=1)

    # Parallel Execution Frame (par)
    par_frame = FancyBboxPatch((0.21, 0.35), 0.58, 0.22, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#F1F5F9', edgecolor='#94A3B8', linewidth=1.2, ls='--', zorder=2)
    ax.add_patch(par_frame)
    ax.text(0.22, 0.55, "par [Parallel Verification Execution]", color='#475569', fontsize=8.5, fontweight='bold', family=FONT_FAMILY, zorder=3)

    # Messages (Solid arrows for calls, dashed for returns)
    def send_msg(y, x1, x2, label, is_return=False, num=None):
        ls = '--' if is_return else '-'
        col = '#0284C7' if is_return else '#0F172A'
        ax.annotate("", xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.3, ls=ls))
        prefix = f"{num}. " if num else ""
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.015, f" {prefix}{label} ", color=col, fontsize=8.2, fontweight='bold',
                ha='center', va='center', backgroundcolor='#FFFFFF', family=FONT_FAMILY, zorder=6)

    # Message 1: Browser -> Gateway (Upload)
    send_msg(0.79, 0.08, 0.25, "POST /api/analysis/upload (Multipart Doc)", num=1)

    # Message 2: Gateway -> Shield (Text stream)
    send_msg(0.72, 0.25, 0.42, "Stream Extracted Text Buffer", num=2)

    # Message 3: Shield self-execution note
    ax.text(0.42, 0.665, " [Regex PII Redaction: 8.4 ms] ", color='#15803D', fontsize=8, fontweight='bold', backgroundcolor='#DCFCE7', ha='center', zorder=6)
    
    # Message 4: Shield -> Gateway (Sanitized text)
    send_msg(0.61, 0.42, 0.25, "Return Masked Stream (No PII)", is_return=True, num=3)

    # Parallel Branch 1: Gateway -> LocalML (Predict)
    send_msg(0.50, 0.25, 0.58, "predict(text) [TF-IDF + Laplace: 14.6 ms]", num=4)
    send_msg(0.43, 0.58, 0.25, "Spam Probability & Confidence Score", is_return=True, num=5)

    # Parallel Branch 2: Gateway -> Gemini AI (Cognitive reasoning)
    send_msg(0.50, 0.25, 0.75, "POST generateContent (Sanitized Payload)", num=6)
    send_msg(0.38, 0.75, 0.25, "Cognitive Forgery Verdict & Claim Audit (2.85s)", is_return=True, num=7)

    # Fusion Calculation Note
    ax.text(0.25, 0.305, " [Compute Trust Score: T(D) = 100 - (0.35S_ml + 0.45S_ai + 0.20S_rule)] ",
            color='#92400E', fontsize=8, fontweight='bold', backgroundcolor='#FEF3C7', ha='center', zorder=6)

    # Message 8: Gateway -> MongoDB (Insert analyses & write audit)
    send_msg(0.24, 0.25, 0.92, "Insert `Analyses` Record & Write `AuditLogs`", num=8)
    send_msg(0.18, 0.92, 0.25, "Write Acknowledged (ACK)", is_return=True, num=9)

    # Message 10: Gateway -> Browser (HTTP 200 JSON Response)
    send_msg(0.11, 0.25, 0.08, "HTTP 200 OK (TrustScore, RiskTier, Checklist, MaskedPreview)", is_return=True, num=10)

    out_path = os.path.join(OUTPUT_DIR, "modern_fig_3_8_sequence_diagram.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print(f"Successfully generated: {out_path}")

build_system_architecture()
build_dfd_level0()
build_dfd_level1()
build_use_case_diagram()
build_sequence_diagram()
print("All 5 modern publication diagrams successfully built!")
