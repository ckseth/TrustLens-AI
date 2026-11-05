"""
TrustLens AI - Master 52-Page Academic Project Report Builder
Strict Requirements:
1. Pure Black (#000000) typography for all body text, headings, tables, captions.
2. Times New Roman throughout: 12pt body, 1.5 line spacing, justified alignment.
3. Headings: 16pt bold (Chapter), 14pt bold (Section), 12pt bold (Subsection).
4. Captions: 10pt pure black.
5. Standard professional engineering diagrams (Chen ER, DFD L0/L1/L2, Flowchart, Architecture, UML).
6. Cropped user screenshots & reserved placeholders for missing outputs.
7. EXACTLY 52 PAGES via controlled per-page layout budgeting and 51 explicit page breaks.
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

sys.path.append(os.path.dirname(__file__))

OUTPUT_FILE = "TrustLens_AI_Project_Report_v2.docx"
FINAL_TARGET = "TrustLens_AI_Project_Report.docx"
ASSETS_DIR = "TrustLens_AI_Report_Assets"

def resolve_image_path(img_name):
    # 1. Check directly in report-assets subdirectories
    subdirs = ["screenshots", "diagrams", "interface-images", "other-figures"]
    for sub in subdirs:
        candidate = os.path.join("report-assets", sub, img_name)
        if os.path.exists(candidate):
            return candidate
            
    # 2. Check canonical mapping table
    mapping = {
        "user_shot_home_hero.png": os.path.join("report-assets", "screenshots", "figure-4-1-home-hero.png"),
        "user_shot_login_captcha.png": os.path.join("report-assets", "screenshots", "figure-4-2-login-captcha.png"),
        "user_fig_otp_modal.png": os.path.join("report-assets", "screenshots", "figure-4-3-otp-modal.png"),
        "user_shot_upload_studio.png": os.path.join("report-assets", "screenshots", "figure-4-4-upload-studio.png"),
        "user_shot_features_grid.png": os.path.join("report-assets", "screenshots", "figure-4-5-features-grid.png"),
        "user_shot_compare_engine.png": os.path.join("report-assets", "screenshots", "figure-4-7-compare-engine.png"),
        "user_shot_entity_privacy.png": os.path.join("report-assets", "screenshots", "figure-4-8-privacy-shield-extraction.png"),
        "user_fig_compare_footer.png": os.path.join("report-assets", "interface-images", "appendix-compare-footer.png"),
        "user_fig_brand_logo.png": os.path.join("report-assets", "other-figures", "brand-logo-trustlens.png"),
        "cu_university_logo.png": os.path.join("report-assets", "other-figures", "university-logo-cu.png"),
        "uic_department_logo.png": os.path.join("report-assets", "other-figures", "department-logo-uic.png"),
        "modern_fig_3_1_system_architecture.png": os.path.join("report-assets", "diagrams", "figure-3-2-system-architecture.png"),
        "modern_fig_3_2_er_diagram.png": os.path.join("report-assets", "diagrams", "figure-3-3-entity-relationship.png"),
        "modern_fig_3_3_dfd_level0.png": os.path.join("report-assets", "diagrams", "figure-3-4-dfd-level-0.png"),
        "modern_fig_3_4_dfd_level1.png": os.path.join("report-assets", "diagrams", "figure-3-5-dfd-level-1.png"),
        "modern_fig_3_7_use_case.png": os.path.join("report-assets", "diagrams", "figure-3-7-use-case-diagram.png"),
        "modern_fig_3_8_sequence_diagram.png": os.path.join("report-assets", "diagrams", "figure-3-8-sequence-diagram.png"),
        "diag_3_5_dfd_level2.png": os.path.join("report-assets", "diagrams", "figure-3-6-dfd-level-2.png"),
        "diag_3_6_system_flowchart.png": os.path.join("report-assets", "diagrams", "figure-3-1-flowchart.png"),
    }
    if img_name in mapping and os.path.exists(mapping[img_name]):
        return mapping[img_name]
        
    # 3. Check legacy archive directory
    legacy = os.path.join("archive", "legacy_assets", "TrustLens_AI_Report_Assets", img_name)
    if os.path.exists(legacy):
        return legacy
        
    # 4. Check direct ASSETS_DIR or relative path
    direct = os.path.join(ASSETS_DIR, img_name)
    if os.path.exists(direct):
        return direct
        
    if os.path.exists(img_name):
        return img_name
        
    return None

BLACK = RGBColor(0, 0, 0)

def set_cell_shading(cell, color_hex="F2F2F2"):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=130, right=130):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_page_number(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)

class Report52Builder:
    def __init__(self):
        self.doc = docx.Document()
        self.current_page = 1
        self.setup_page_properties()

    def setup_page_properties(self):
        for sec in self.doc.sections:
            sec.top_margin = Inches(0.85)
            sec.bottom_margin = Inches(0.85)
            sec.left_margin = Inches(0.95)
            sec.right_margin = Inches(0.95)
            sec.page_width = Inches(8.5)
            sec.page_height = Inches(11.0)
            
            # Header - Pure Black, Times New Roman, 8.5pt
            header = sec.header
            hp = header.paragraphs[0]
            hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            hrun = hp.add_run("TrustLens AI — Academic Project Report | UIC Chandigarh University")
            hrun.font.name = "Times New Roman"
            hrun.font.size = Pt(8.5)
            hrun.font.color.rgb = BLACK
            
            # Footer - Pure Black, Times New Roman, 9pt
            footer = sec.footer
            fp = footer.paragraphs[0]
            fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            frun_left = fp.add_run("University Institute of Computing (UIC), Chandigarh University               Page ")
            frun_left.font.name = "Times New Roman"
            frun_left.font.size = Pt(9)
            frun_left.font.color.rgb = BLACK
            add_page_number(fp.add_run())

    def add_page_break(self):
        self.doc.add_page_break()
        self.current_page += 1

    def add_title(self, text, subtitle=None):
        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(16)
        run.font.color.rgb = BLACK

        if subtitle:
            p2 = self.doc.add_paragraph()
            p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p2.paragraph_format.space_after = Pt(10)
            run2 = p2.add_run(subtitle)
            run2.font.name = "Times New Roman"
            run2.font.size = Pt(11)
            run2.italic = True
            run2.font.color.rgb = BLACK

    def add_h1(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(16)
        run.font.color.rgb = BLACK
        return p

    def add_h2(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(14)
        run.font.color.rgb = BLACK
        return p

    def add_h3(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(5)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.color.rgb = BLACK
        return p

    def add_p(self, text, space_after=3):
        p = self.doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(space_after)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.color.rgb = BLACK
        return p

    def add_bullet(self, bold_prefix, text):
        p = self.doc.add_paragraph(style='List Bullet')
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run_b = p.add_run(bold_prefix + ": ")
        run_b.bold = True
        run_b.font.name = "Times New Roman"
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = BLACK
        run_t = p.add_run(text)
        run_t.font.name = "Times New Roman"
        run_t.font.size = Pt(12)
        run_t.font.color.rgb = BLACK
        return p

    def add_figure(self, img_filename, fig_num_title, caption_text, width=Inches(5.4)):
        img_path = resolve_image_path(img_filename)
        if os.path.exists(img_path):
            p = self.doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            run = p.add_run()
            run.add_picture(img_path, width=width)
            
            p_cap = self.doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(4)
            run_lbl = p_cap.add_run(fig_num_title + ": ")
            run_lbl.bold = True
            run_lbl.font.name = "Times New Roman"
            run_lbl.font.size = Pt(10)
            run_lbl.font.color.rgb = BLACK
            
            run_desc = p_cap.add_run(caption_text)
            run_desc.italic = True
            run_desc.font.name = "Times New Roman"
            run_desc.font.size = Pt(10)
            run_desc.font.color.rgb = BLACK
        else:
            p = self.doc.add_paragraph()
            p.add_run(f"[Image '{img_filename}' not found]")

    def add_two_figures(self, img1, fig1_title, cap1, img2, fig2_title, cap2, width=Inches(2.7)):
        img1_path = resolve_image_path(img1)
        img2_path = resolve_image_path(img2)
        
        table = self.doc.add_table(rows=1, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
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
        
        # Cell 1
        c1 = table.cell(0, 0)
        c1.width = Inches(3.2)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if os.path.exists(img1_path):
            p1.add_run().add_picture(img1_path, width=width)
        p1_cap = c1.add_paragraph()
        p1_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1_lbl = p1_cap.add_run(fig1_title + ": ")
        r1_lbl.bold = True
        r1_lbl.font.name = "Times New Roman"
        r1_lbl.font.size = Pt(9.5)
        r1_lbl.font.color.rgb = BLACK
        r1_desc = p1_cap.add_run(cap1)
        r1_desc.italic = True
        r1_desc.font.name = "Times New Roman"
        r1_desc.font.size = Pt(9.5)
        r1_desc.font.color.rgb = BLACK
        
        # Cell 2
        c2 = table.cell(0, 1)
        c2.width = Inches(3.2)
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if os.path.exists(img2_path):
            p2.add_run().add_picture(img2_path, width=width)
        p2_cap = c2.add_paragraph()
        p2_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2_lbl = p2_cap.add_run(fig2_title + ": ")
        r2_lbl.bold = True
        r2_lbl.font.name = "Times New Roman"
        r2_lbl.font.size = Pt(9.5)
        r2_lbl.font.color.rgb = BLACK
        r2_desc = p2_cap.add_run(cap2)
        r2_desc.italic = True
        r2_desc.font.name = "Times New Roman"
        r2_desc.font.size = Pt(9.5)
        r2_desc.font.color.rgb = BLACK

    def add_placeholder_box(self, fig_num_title, caption_text, height_in=2.0):
        table = self.doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(5.8)
        set_cell_shading(cell, "F9F9F9")
        set_cell_margins(cell, top=280, bottom=280, left=180, right=180)
        
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="dashed" w:sz="6" w:space="0" w:color="000000"/>
                <w:bottom w:val="dashed" w:sz="6" w:space="0" w:color="000000"/>
                <w:left w:val="dashed" w:sz="6" w:space="0" w:color="000000"/>
                <w:right w:val="dashed" w:sz="6" w:space="0" w:color="000000"/>
                <w:insideH w:val="none"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr.append(borders)
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1 = p.add_run(f"[{fig_num_title.upper()} — ORIGINAL OUTPUT TO BE INSERTED HERE]\n")
        r1.bold = True
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = BLACK
        
        r2 = p.add_run("(Reserved Area: Sized for direct in-place screenshot insertion in Microsoft Word)")
        r2.italic = True
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(9)
        r2.font.color.rgb = BLACK
        
        p_cap = self.doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(4)
        run_lbl = p_cap.add_run(fig_num_title + ": ")
        run_lbl.bold = True
        run_lbl.font.name = "Times New Roman"
        run_lbl.font.size = Pt(10)
        run_lbl.font.color.rgb = BLACK
        
        run_desc = p_cap.add_run(caption_text)
        run_desc.italic = True
        run_desc.font.name = "Times New Roman"
        run_desc.font.size = Pt(10)
        run_desc.font.color.rgb = BLACK

    def add_table_data(self, headers, rows_data, col_widths=None):
        table = self.doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table, color="000000", sz="4", val="single")

        # Header Row: Light Gray Background, Pure Black Bold Text
        hdr_cells = table.rows[0].cells
        for idx, text in enumerate(headers):
            cell = hdr_cells[idx]
            cell.text = text
            set_cell_shading(cell, "EAEAEA")
            set_cell_margins(cell, top=80, bottom=80, left=110, right=110)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(10)
                r.bold = True
                r.font.color.rgb = BLACK

        # Body Rows: Pure Black Text
        for r_idx, row in enumerate(rows_data):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F9F9F9" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row):
                cell = row_cells[c_idx]
                cell.text = str(val)
                set_cell_shading(cell, bg_color)
                set_cell_margins(cell, top=65, bottom=65, left=100, right=100)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.name = "Times New Roman"
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = BLACK

        if col_widths:
            for i, col in enumerate(table.columns):
                w = col_widths[i] if i < len(col_widths) else Inches(1.5)
                for cell in col.cells:
                    cell.width = w

        p_after = self.doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(2)

    def add_code_block(self, code_text, caption=None):
        if caption:
            p_cap = self.doc.add_paragraph()
            p_cap.paragraph_format.space_before = Pt(4)
            p_cap.paragraph_format.space_after = Pt(2)
            p_cap.paragraph_format.keep_with_next = True
            rc = p_cap.add_run(caption)
            rc.bold = True
            rc.font.name = "Times New Roman"
            rc.font.size = Pt(10)
            rc.font.color.rgb = BLACK

        table = self.doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        set_cell_shading(cell, "F7F7F7")
        set_cell_margins(cell, top=90, bottom=90, left=130, right=130)
        
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
                <w:left w:val="single" w:sz="12" w:space="0" w:color="000000"/>
                <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
                <w:insideH w:val="none"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr.append(borders)
        
        cell.paragraphs[0].text = code_text.strip()
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT
        for r in cell.paragraphs[0].runs:
            r.font.name = "Consolas"
            r.font.size = Pt(8.5)
            r.font.color.rgb = BLACK
        
        p_after = self.doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(2)

    def save(self):
        print(f"Saving 52-page document to {OUTPUT_FILE}...")
        self.doc.save(OUTPUT_FILE)
        print(f"Successfully generated {OUTPUT_FILE}!")
        
        # Try copying to FINAL_TARGET if not locked
        try:
            import shutil
            shutil.copyfile(OUTPUT_FILE, FINAL_TARGET)
            print(f"Successfully synchronized {FINAL_TARGET}!")
        except Exception as e:
            print(f"Notice: {FINAL_TARGET} is currently locked by Word. User can close Word and copy from {OUTPUT_FILE}.")

if __name__ == "__main__":
    from report_pages_front import register_front_pages
    from report_pages_ch1_ch2 import register_ch1_ch2_pages
    from report_pages_ch3 import register_ch3_pages
    from report_pages_ch4_ch5 import register_ch4_ch5_pages
    
    builder = Report52Builder()
    
    # Register all 52 page functions
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
            
    builder.save()
