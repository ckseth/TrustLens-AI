import os
import shutil
import stat

ROOT = os.path.abspath('.')

def remove_readonly(func, path, excinfo):
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception as e:
        print(f"Warning: could not delete {path}: {e}")

def safe_remove_dir(rel_path):
    p = os.path.join(ROOT, rel_path)
    if os.path.exists(p):
        print(f"Removing directory: {rel_path}")
        shutil.rmtree(p, onexc=lambda fn, pth, exc: remove_readonly(fn, pth, exc))

def safe_remove_file(rel_path):
    p = os.path.join(ROOT, rel_path)
    if os.path.exists(p):
        print(f"Removing file: {rel_path}")
        try:
            os.chmod(p, stat.S_IWRITE)
            os.remove(p)
        except Exception as e:
            print(f"Warning: could not delete file {rel_path}: {e}")

def safe_move(rel_src, rel_dest):
    src = os.path.join(ROOT, rel_src)
    dest = os.path.join(ROOT, rel_dest)
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if os.path.exists(dest):
            if os.path.isdir(dest):
                shutil.rmtree(dest, onexc=lambda fn, pth, exc: remove_readonly(fn, pth, exc))
            else:
                os.remove(dest)
        print(f"Moving {rel_src} -> {rel_dest}")
        shutil.move(src, dest)

print("--- Starting Final Root Cleanup ---")

# 1. Move raw/unorganized report assets to archive if still in root
safe_move("TrustLens_AI_Report_Assets", "archive/legacy_assets/TrustLens_AI_Report_Assets")

# 2. Move temporary docx to archive if still in root
safe_move("TrustLens_AI_Project_Report_v2.docx", "archive/temp_docx/TrustLens_AI_Project_Report_v2.docx")

# 3. Move sync scripts to scripts if still in root
safe_move("sync_final_report.bat", "scripts/sync_final_report.bat")
safe_move("sync_final_report.ps1", "scripts/sync_final_report.ps1")

# 4. Remove duplicate root items (already cleanly housed in frontend/, tests/, documentation/)
safe_remove_dir("assets")
safe_remove_dir("css")
safe_remove_dir("js")
safe_remove_dir("pages")
safe_remove_dir("test_data")

safe_remove_file("logo.png")
safe_remove_file("robots.txt")
safe_remove_file("sitemap.xml")
safe_remove_file("project_notes.txt")
safe_remove_file("TrustLens_AI_Worksheet_5.docx")
safe_remove_file("index.html")

print("--- Final Root Cleanup Completed Successfully ---")
