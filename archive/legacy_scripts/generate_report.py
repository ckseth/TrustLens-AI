"""
TrustLens AI - Academic Project Report Generator
Builds TrustLens_AI_Project_Report.docx according to Report_Format.docx and UIC Chandigarh University standards.
"""

import os
import json
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

ASSETS_DIR = "TrustLens_AI_Report_Assets"
OUTPUT_FILENAME = "TrustLens_AI_Project_Report.docx"

# Color Palette (Academic / Professional Editorial Theme)
COLOR_PRIMARY_HEX = "1A365D"      # Deep Navy
COLOR_SECONDARY_HEX = "2B6CB0"    # Slate Blue
COLOR_ACCENT_HEX = "2C7A7B"       # Teal
COLOR_DARK_TEXT_HEX = "2D3748"    # Charcoal Body Text
COLOR_MUTED_TEXT_HEX = "718096"   # Muted Gray
COLOR_BG_LIGHT_HEX = "F7FAFC"     # Light Table Fill
COLOR_BG_HEADER_HEX = "1A365D"    # Header Row Fill
COLOR_BORDER_HEX = "CBD5E0"       # Border Gray
COLOR_CODE_BG_HEX = "F7FAFC"      # Code Box Fill

def set_cell_shading(cell, color_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E0", sz="4", val="single"):
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

def add_header_footer(doc):
    for sec in doc.sections:
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
        fp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        
        frun_left = fp.add_run("Master of Computer Applications (MCA) — University Institute of Computing\t")
        frun_left.font.name = "Times New Roman"
        frun_left.font.size = Pt(9)
        frun_left.font.color.rgb = RGBColor(113, 128, 150)
        
        frun_right = fp.add_run("Page ")
        frun_right.font.name = "Times New Roman"
        frun_right.font.size = Pt(9)
        frun_right.font.color.rgb = RGBColor(113, 128, 150)
        add_page_number(frun_right)

print("Base setup script loaded.")

