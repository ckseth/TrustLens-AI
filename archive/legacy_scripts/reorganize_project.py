"""
Project Cleanup and Reorganization Script
Organizes TrustLens AI into a professional, modular architecture:
- frontend/
- backend/
- report-assets/
- documentation/
- tests/
- archive/
"""

import os
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_reorganization():
    print("=" * 60)
    print(" TrustLens AI - Project Reorganization & Asset Management")
    print("=" * 60)
    
    # 1. Create Target Directories
    dirs_to_create = [
        os.path.join(ROOT_DIR, "frontend"),
        os.path.join(ROOT_DIR, "frontend", "pages"),
        os.path.join(ROOT_DIR, "frontend", "css"),
        os.path.join(ROOT_DIR, "frontend", "js"),
        os.path.join(ROOT_DIR, "frontend", "assets"),
        os.path.join(ROOT_DIR, "report-assets"),
        os.path.join(ROOT_DIR, "report-assets", "diagrams"),
        os.path.join(ROOT_DIR, "report-assets", "screenshots"),
        os.path.join(ROOT_DIR, "report-assets", "interface-images"),
        os.path.join(ROOT_DIR, "report-assets", "other-figures"),
        os.path.join(ROOT_DIR, "documentation"),
        os.path.join(ROOT_DIR, "documentation", "project-documentation"),
        os.path.join(ROOT_DIR, "documentation", "API-documentation"),
        os.path.join(ROOT_DIR, "documentation", "technical-notes"),
        os.path.join(ROOT_DIR, "tests"),
        os.path.join(ROOT_DIR, "archive"),
        os.path.join(ROOT_DIR, "archive", "legacy_scripts"),
        os.path.join(ROOT_DIR, "archive", "temp_docx"),
        os.path.join(ROOT_DIR, "archive", "legacy_assets")
    ]
    for d in dirs_to_create:
        os.makedirs(d, exist_ok=True)
    print("[1/6] Created target directory hierarchy.")

    # 2. Populate frontend/
    # Move index.html, logo.png, robots.txt, sitemap.xml
    frontend_files = ["index.html", "logo.png", "robots.txt", "sitemap.xml"]
    for f in frontend_files:
        src = os.path.join(ROOT_DIR, f)
        dst = os.path.join(ROOT_DIR, "frontend", f)
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.copy2(src, dst)
            
    # Copy pages/, css/, js/, assets/ into frontend/
    folder_mappings = [
        ("pages", os.path.join(ROOT_DIR, "frontend", "pages")),
        ("css", os.path.join(ROOT_DIR, "frontend", "css")),
        ("js", os.path.join(ROOT_DIR, "frontend", "js")),
        ("assets", os.path.join(ROOT_DIR, "frontend", "assets")),
    ]
    for src_folder, dst_folder in folder_mappings:
        src_path = os.path.join(ROOT_DIR, src_folder)
        if os.path.exists(src_path):
            shutil.copytree(src_path, dst_folder, dirs_exist_ok=True)
    print("[2/6] Populated frontend/ directory with pages, css, js, assets, and index.html.")

    # 3. Populate report-assets/
    src_assets = os.path.join(ROOT_DIR, "TrustLens_AI_Report_Assets")
    
    # Diagrams
    diagram_copies = [
        ("modern_fig_3_1_system_architecture.png", "diagrams/figure-3-2-system-architecture.png"),
        ("diag_3_1_system_architecture.png", "diagrams/figure-3-2-system-architecture-engineering.png"),
        ("modern_fig_3_2_er_diagram.png", "diagrams/figure-3-3-entity-relationship.png"),
        ("diag_3_2_er_model.png", "diagrams/figure-3-3-entity-relationship-engineering.png"),
        ("modern_fig_3_3_dfd_level0.png", "diagrams/figure-3-4-dfd-level-0.png"),
        ("diag_3_3_dfd_level0.png", "diagrams/figure-3-4-dfd-level-0-engineering.png"),
        ("modern_fig_3_4_dfd_level1.png", "diagrams/figure-3-5-dfd-level-1.png"),
        ("diag_3_4_dfd_level1.png", "diagrams/figure-3-5-dfd-level-1-engineering.png"),
        ("diag_3_5_dfd_level2.png", "diagrams/figure-3-6-dfd-level-2.png"),
        ("diag_3_6_system_flowchart.png", "diagrams/figure-3-1-flowchart.png"),
        ("modern_fig_3_7_use_case.png", "diagrams/figure-3-7-use-case-diagram.png"),
        ("diag_3_7_use_case_diagram.png", "diagrams/figure-3-7-use-case-engineering.png"),
        ("modern_fig_3_8_sequence_diagram.png", "diagrams/figure-3-8-sequence-diagram.png"),
        ("diag_3_8_sequence_diagram.png", "diagrams/figure-3-8-sequence-engineering.png"),
    ]
    for src_name, dst_rel in diagram_copies:
        s = os.path.join(src_assets, src_name)
        d = os.path.join(ROOT_DIR, "report-assets", dst_rel)
        if os.path.exists(s):
            shutil.copy2(s, d)
            
    # Screenshots
    screenshot_copies = [
        ("user_shot_home_hero.png", "screenshots/figure-4-1-home-hero.png"),
        ("user_shot_login_captcha.png", "screenshots/figure-4-2-login-captcha.png"),
        ("user_fig_otp_modal.png", "screenshots/figure-4-3-otp-modal.png"),
        ("user_shot_upload_studio.png", "screenshots/figure-4-4-upload-studio.png"),
        ("user_shot_features_grid.png", "screenshots/figure-4-5-features-grid.png"),
        ("user_shot_compare_engine.png", "screenshots/figure-4-7-compare-engine.png"),
        ("user_shot_entity_privacy.png", "screenshots/figure-4-8-privacy-shield-extraction.png"),
    ]
    for src_name, dst_rel in screenshot_copies:
        s = os.path.join(src_assets, src_name)
        d = os.path.join(ROOT_DIR, "report-assets", dst_rel)
        if os.path.exists(s):
            shutil.copy2(s, d)

    # Interface images
    interface_copies = [
        ("fig_4_1_home_hero.png", "interface-images/appendix-home-page.png"),
        ("fig_4_6_features_grid.png", "interface-images/appendix-features.png"),
        ("user_shot_pipeline_works.png", "interface-images/appendix-how-it-works.png"),
        ("fig_4_3_verification_studio.png", "interface-images/appendix-verify-studio.png"),
        ("fig_4_5_compare_engine.png", "interface-images/appendix-compare.png"),
        ("user_fig_compare_footer.png", "interface-images/appendix-compare-footer.png"),
    ]
    for src_name, dst_rel in interface_copies:
        s = os.path.join(src_assets, src_name)
        d = os.path.join(ROOT_DIR, "report-assets", dst_rel)
        if os.path.exists(s):
            shutil.copy2(s, d)

    # Other figures & logos
    other_copies = [
        ("cu_university_logo.png", "other-figures/university-logo-cu.png"),
        ("uic_department_logo.png", "other-figures/department-logo-uic.png"),
        ("user_fig_brand_logo.png", "other-figures/brand-logo-trustlens.png"),
    ]
    for src_name, dst_rel in other_copies:
        s = os.path.join(src_assets, src_name)
        d = os.path.join(ROOT_DIR, "report-assets", dst_rel)
        if os.path.exists(s):
            shutil.copy2(s, d)
            
    print("[3/6] Populated report-assets/ with organized diagrams, screenshots, interface-images, and other figures.")

    # 4. Copy test_data into tests/
    test_src = os.path.join(ROOT_DIR, "test_data")
    test_dst = os.path.join(ROOT_DIR, "tests", "test_data")
    if os.path.exists(test_src):
        shutil.copytree(test_src, test_dst, dirs_exist_ok=True)
    print("[4/6] Configured tests/ directory.")

    # 5. Populate documentation/
    doc_src = os.path.join(ROOT_DIR, "TrustLens_AI_Worksheet_5.docx")
    if os.path.exists(doc_src):
        shutil.copy2(doc_src, os.path.join(ROOT_DIR, "documentation", "project-documentation", "TrustLens_AI_Worksheet_5.docx"))
    
    notes_src = os.path.join(ROOT_DIR, "project_notes.txt")
    if os.path.exists(notes_src):
        shutil.copy2(notes_src, os.path.join(ROOT_DIR, "documentation", "technical-notes", "project_notes.txt"))
    print("[5/6] Populated documentation/ directory.")

    # 6. Archive temporary / obsolete artifacts safely
    # Temp docx
    temp_docx = ["test_out.docx", "test_page_no.docx"]
    for t in temp_docx:
        tp = os.path.join(ROOT_DIR, t)
        if os.path.exists(tp):
            shutil.move(tp, os.path.join(ROOT_DIR, "archive", "temp_docx", t))

    # Obsolete test scripts
    legacy_scripts = [
        "test_lock.py", "test_replace.py", "test_v2.py", "test_page_no.py",
        "find_locker.py", "check_word.ps1", "inspect_current_report.py",
        "inspect_tests.py", "test_docx_builder.py", "verify_report.py"
    ]
    for s in legacy_scripts:
        sp = os.path.join(ROOT_DIR, "scripts", s)
        if os.path.exists(sp):
            shutil.move(sp, os.path.join(ROOT_DIR, "archive", "legacy_scripts", s))

    # Legacy raw asset folders
    for f in ["extracted_assets", "user_output_screenshots"]:
        fp = os.path.join(ROOT_DIR, f)
        if os.path.exists(fp):
            dst = os.path.join(ROOT_DIR, "archive", "legacy_assets", f)
            if not os.path.exists(dst):
                shutil.move(fp, dst)
                
    print("[6/6] Safely archived temporary test files and legacy scripts into archive/.")

    print("\nReorganization script executed successfully!")

if __name__ == "__main__":
    run_reorganization()

