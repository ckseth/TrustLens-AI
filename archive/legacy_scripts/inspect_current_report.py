import docx

doc = docx.Document('TrustLens_AI_Project_Report.docx')
br_count = 0
for p in doc.paragraphs:
    xml = p._p.xml
    if 'w:br w:type="page"' in xml:
        br_count += 1
print('Paragraphs with w:br w:type="page":', br_count)
print('Total paragraphs:', len(doc.paragraphs))
print('Total tables:', len(doc.tables))

