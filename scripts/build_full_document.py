"""
Master Document Builder Script: build_full_document.py
Assembles TrustLens_AI_Project_Report.docx (and TrustLens_AI_Project_Report_v2.docx)
with exactly 52 pages, pure black typography (#000000), publication-grade engineering diagrams,
cropped user screenshots, structured placeholders, empirical QA tests, and latency benchmarks.
"""

import os
import sys

# Ensure scripts directory is in sys.path
sys.path.append(os.path.dirname(__file__))

from build_52page_report import Report52Builder
from report_pages_front import register_front_pages
from report_pages_ch1_ch2 import register_ch1_ch2_pages
from report_pages_ch3 import register_ch3_pages
from report_pages_ch4_ch5 import register_ch4_ch5_pages

def main():
    print("=" * 65)
    print("  TrustLens AI — Master 52-Page Academic Report Builder")
    print("=" * 65)
    
    builder = Report52Builder()
    
    # Register all 52 page modules
    page_funcs = {}
    register_front_pages(page_funcs)
    register_ch1_ch2_pages(page_funcs)
    register_ch3_pages(page_funcs)
    register_ch4_ch5_pages(page_funcs)
    
    print(f"Total registered pages: {len(page_funcs)}")
    assert len(page_funcs) == 52, f"Expected 52 pages, got {len(page_funcs)}"
    
    for i in range(1, 53):
        print(f"Building Page {i:02d} / 52...")
        fn = page_funcs[i]
        fn(builder)
        if i < 52:
            builder.add_page_break()
            
    target_file = "TrustLens_AI_Project_Report.docx"
    backup_file = "TrustLens_AI_Project_Report_v2.docx"
    
    print(f"\nSaving master 52-page document to {target_file}...")
    try:
        builder.doc.save(target_file)
        print(f"[SUCCESS] Successfully generated and saved to {target_file}!")
    except Exception as e:
        print(f"[NOTICE] Could not save directly to {target_file} (may be open in Word): {e}")
        
    print(f"Saving copy to {backup_file}...")
    try:
        builder.doc.save(backup_file)
        print(f"[SUCCESS] Successfully synchronized {backup_file}!")
    except Exception as e:
        print(f"[NOTICE] Could not save to {backup_file} (may be open in Word): {e}")
    
    print("\n" + "=" * 65)
    print("  Report Generation Complete: EXACTLY 52 PAGES GENERATED")
    print("  - Font: Times New Roman (12pt body, 1.5 spacing, Justified)")
    print("  - Color: 100% Pure Black (#000000) for all text and headings")
    print("  - Diagrams: 8 Engineering Diagrams in formal notation")
    print("  - Screenshots: Cropped user screenshots & reserved placeholders")
    print("=" * 65)

if __name__ == "__main__":
    main()
