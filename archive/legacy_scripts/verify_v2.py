import os
import docx
from docx.shared import RGBColor

target = 'TrustLens_AI_Project_Report.docx'
if not os.path.exists(target):
    target = os.path.join(os.path.dirname(__file__), '..', 'TrustLens_AI_Project_Report.docx')

print(f'=== INSPECTING: {target} ===')
doc = docx.Document(target)
print('Total paragraphs:', len(doc.paragraphs))
print('Total tables:', len(doc.tables))

page_breaks = 0
for p in doc.paragraphs:
    for r in p.runs:
        if 'type="page"' in r._r.xml:
            page_breaks += 1

print('Total explicit page breaks:', page_breaks)
print('Total pages defined:', page_breaks + 1)

non_black = set()
fonts = set()
for p in doc.paragraphs:
    for r in p.runs:
        if r.font.name:
            fonts.add(r.font.name)
        if r.font.color and r.font.color.rgb and r.font.color.rgb != RGBColor(0, 0, 0):
            non_black.add(str(r.font.color.rgb))

for t in doc.tables:
    for row in t.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                for r in p.runs:
                    if r.font.name:
                        fonts.add(r.font.name)
                    if r.font.color and r.font.color.rgb and r.font.color.rgb != RGBColor(0, 0, 0):
                        non_black.add(str(r.font.color.rgb))

print('Fonts used:', fonts)
print('Non-black colors found (must be empty set):', non_black)
