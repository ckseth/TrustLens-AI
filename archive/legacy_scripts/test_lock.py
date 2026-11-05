import os

file_path = "TrustLens_AI_Project_Report.docx"
try:
    with open(file_path, "r+b") as f:
        print("File can be opened for r+b!")
except Exception as e:
    print("Cannot open r+b:", e)

