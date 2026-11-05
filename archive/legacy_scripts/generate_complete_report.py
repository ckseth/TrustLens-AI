"""
Full Master Academic Report Generator for TrustLens AI
Outputs: TrustLens_AI_Project_Report.docx
"""

import os
import json
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

OUTPUT_FILE = "TrustLens_AI_Project_Report.docx"
ASSETS_DIR = "TrustLens_AI_Report_Assets"

# Styling Constants
NAVY_PRIMARY = "1A365D"       # Deep Navy Header
SLATE_ACCENT = "2B6CB0"       # Subheading Blue
TEXT_CHARCOAL = "2D3748"      # Body text
TEXT_MUTED = "718096"         # Secondary labels
ROW_BG_LIGHT = "F7FAFC"       # Alternating row fill
CODE_BG = "EDF2F7"            # Code block fill
BORDER_COLOR = "CBD5E0"       # Table border

def set_cell_shading(cell, color_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color=BORDER_COLOR, sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
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

class FullReportGenerator:
    def __init__(self):
        self.doc = docx.Document()
        self.setup_page_properties()
        self.setup_styles()

    def setup_page_properties(self):
        for sec in self.doc.sections:
            sec.top_margin = Inches(0.85)
            sec.bottom_margin = Inches(0.85)
            sec.left_margin = Inches(0.95)
            sec.right_margin = Inches(0.95)
            sec.page_width = Inches(8.5)
            sec.page_height = Inches(11.0)
            
            # Header
            header = sec.header
            hp = header.paragraphs[0]
            hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            hrun = hp.add_run("TrustLens AI — Academic Project Report | UIC Chandigarh University")
            hrun.font.name = "Times New Roman"
            hrun.font.size = Pt(8.5)
            hrun.font.color.rgb = RGBColor(113, 128, 150)
            
            # Footer
            footer = sec.footer
            fp = footer.paragraphs[0]
            fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            frun_left = fp.add_run("University Institute of Computing (UIC), Chandigarh University               Page ")
            frun_left.font.name = "Times New Roman"
            frun_left.font.size = Pt(9)
            frun_left.font.color.rgb = RGBColor(113, 128, 150)
            add_page_number(fp.add_run())

    def setup_styles(self):
        styles = self.doc.styles
        normal = styles['Normal']
        normal.font.name = 'Times New Roman'
        normal.font.size = Pt(11.5)
        normal.font.color.rgb = RGBColor(45, 55, 72)
        normal.paragraph_format.line_spacing = 1.15
        normal.paragraph_format.space_after = Pt(5)

    def add_title(self, text, subtitle=None):
        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(22)
        run.font.color.rgb = RGBColor(26, 54, 93)

        if subtitle:
            p2 = self.doc.add_paragraph()
            p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p2.paragraph_format.space_after = Pt(18)
            run2 = p2.add_run(subtitle)
            run2.font.name = "Times New Roman"
            run2.font.size = Pt(12)
            run2.font.color.rgb = RGBColor(74, 85, 104)

    def add_heading_1(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(14)
        run.font.color.rgb = RGBColor(26, 54, 93)
        return p

    def add_heading_2(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(12.5)
        run.font.color.rgb = RGBColor(43, 108, 176)
        return p

    def add_heading_3(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Times New Roman"
        run.font.size = Pt(11.5)
        run.font.color.rgb = RGBColor(45, 55, 72)
        return p

    def add_p(self, text):
        p = self.doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(6)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(45, 55, 72)
        return p

    def add_bullet(self, bold_prefix, text):
        p = self.doc.add_paragraph(style='List Bullet')
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(3)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run_b = p.add_run(bold_prefix + ": ")
        run_b.bold = True
        run_b.font.name = "Times New Roman"
        run_b.font.size = Pt(11)
        run_b.font.color.rgb = RGBColor(26, 54, 93)
        run_t = p.add_run(text)
        run_t.font.name = "Times New Roman"
        run_t.font.size = Pt(11)
        run_t.font.color.rgb = RGBColor(45, 55, 72)
        return p

    def add_figure(self, img_filename, fig_num_title, caption_text, width=Inches(5.8)):
        img_path = os.path.join(ASSETS_DIR, img_filename)
        if os.path.exists(img_path):
            p = self.doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            run = p.add_run()
            run.add_picture(img_path, width=width)
            
            p_cap = self.doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(8)
            run_lbl = p_cap.add_run(fig_num_title + ": ")
            run_lbl.bold = True
            run_lbl.font.name = "Times New Roman"
            run_lbl.font.size = Pt(10)
            run_lbl.font.color.rgb = RGBColor(26, 54, 93)
            
            run_desc = p_cap.add_run(caption_text)
            run_desc.italic = True
            run_desc.font.name = "Times New Roman"
            run_desc.font.size = Pt(9.5)
            run_desc.font.color.rgb = RGBColor(74, 85, 104)
        else:
            p = self.doc.add_paragraph()
            p.add_run(f"[Placeholder: Image '{img_filename}' not found in assets]")

    def add_table_data(self, headers, rows_data, col_widths=None):
        table = self.doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table)

        # Header Row
        hdr_cells = table.rows[0].cells
        for idx, text in enumerate(headers):
            cell = hdr_cells[idx]
            cell.text = text
            set_cell_shading(cell, NAVY_PRIMARY)
            set_cell_margins(cell, top=130, bottom=130, left=150, right=150)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(10)
                r.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255)

        # Body Rows
        for r_idx, row in enumerate(rows_data):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = ROW_BG_LIGHT if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row):
                cell = row_cells[c_idx]
                cell.text = str(val)
                set_cell_shading(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for r in p.runs:
                    r.font.name = "Times New Roman"
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = RGBColor(45, 55, 72)

        # Col widths
        if col_widths:
            for i, col in enumerate(table.columns):
                w = col_widths[i] if i < len(col_widths) else Inches(1.5)
                for cell in col.cells:
                    cell.width = w

        p_after = self.doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(6)

    def add_code_block(self, code_text, caption=None):
        if caption:
            p_cap = self.doc.add_paragraph()
            p_cap.paragraph_format.space_before = Pt(8)
            p_cap.paragraph_format.space_after = Pt(2)
            p_cap.paragraph_format.keep_with_next = True
            rc = p_cap.add_run(caption)
            rc.bold = True
            rc.font.name = "Times New Roman"
            rc.font.size = Pt(10)
            rc.font.color.rgb = RGBColor(43, 108, 176)

        table = self.doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        set_cell_shading(cell, CODE_BG)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>
                <w:left w:val="single" w:sz="18" w:space="0" w:color="2B6CB0"/>
                <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>
                <w:insideH w:val="none"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr.append(borders)
        
        cell.paragraphs[0].text = code_text.strip()
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT
        for r in cell.paragraphs[0].runs:
            r.font.name = "Consolas"
            r.font.size = Pt(9.0)
            r.font.color.rgb = RGBColor(26, 32, 44)
        
        p_after = self.doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(6)

    def add_page_break(self):
        self.doc.add_page_break()

print("Base setup completed in generate_complete_report.py")

