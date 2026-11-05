import os

try:
    os.replace("TrustLens_AI_Project_Report_v2.docx", "TrustLens_AI_Project_Report.docx")
    print("Replace succeeded! The main file was updated!")
except Exception as e:
    print("Replace failed:", e)

