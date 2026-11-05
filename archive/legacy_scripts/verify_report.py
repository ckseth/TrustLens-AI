"""
Verification script for TrustLens_AI_Project_Report.docx
"""

import docx
import os
import zipfile

doc_path = "TrustLens_AI_Project_Report.docx"

if not os.path.exists(doc_path):
    print("Error: Document does not exist!")
    exit(1)

size_mb = os.path.getsize(doc_path) / (1024 * 1024)
print(f"File Size: {size_mb:.2f} MB ({os.path.getsize(doc_path)} bytes)")

doc = docx.Document(doc_path)
print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")
print(f"Total Sections: {len(doc.sections)}")

# Check media inside docx zip
with zipfile.ZipFile(doc_path, 'r') as z:
    media = [n for n in z.namelist() if n.startswith('word/media/')]
    print(f"Total Embedded Media: {len(media)}")
    for m in media[:8]:
        print(f"  {m} ({z.getinfo(m).file_size} bytes)")
    if len(media) > 8:
        print(f"  ... and {len(media) - 8} more media files")

# Check for accidental Smart City mentions
smart_city_mentions = []
for i, p in enumerate(doc.paragraphs):
    if "smart city" in p.text.lower() or "mohali smart" in p.text.lower() or "aashutosh" in p.text.lower():
        smart_city_mentions.append((i, p.text[:80]))

for t_idx, table in enumerate(doc.tables):
    for r_idx, row in enumerate(table.rows):
        for c_idx, cell in enumerate(row.cells):
            if "smart city" in cell.text.lower() or "aashutosh" in cell.text.lower():
                smart_city_mentions.append((f"Table {t_idx} R{r_idx}C{c_idx}", cell.text[:80]))

if smart_city_mentions:
    print(f"WARNING: Found {len(smart_city_mentions)} mentions of secondary reference project:")
    for m in smart_city_mentions:
        print(" ", m)
else:
    print("SUCCESS: Zero mentions of Smart City or secondary reference names found in the document!")

# Check Headings
print("\nDocument Major Headings:")
for p in doc.paragraphs:
    if p.runs and p.runs[0].bold and len(p.text) < 60 and any(h in p.text.upper() for h in ['CHAPTER', 'CERTIFICATE', 'DECLARATION', 'ACKNOWLEDGEMENT', 'ABSTRACT', 'LIST OF', 'TABLE OF CONTENTS', 'REFERENCES', 'ABBREVIATIONS', 'CHECKLIST', 'MANUAL']):
        print(f"  • {p.text.strip()}")

