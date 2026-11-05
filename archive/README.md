# TrustLens AI — Archive & Historical Staging

This directory serves as the safe staging and preservation repository for superseded scripts, interim report revisions, and raw uncurated screenshot dumps generated during early development phases.

> [!NOTE]
> None of the files in this directory are required for running the application or compiling the final project report. They are preserved for auditability and version history.

---

## 1. Directory Structure

```text
archive/
│
├── legacy_assets/          # Raw image dumps and unorganized extraction folders
│   ├── extracted_assets/       # Extracted images from early Word document versions
│   ├── user_output_screenshots/# Original uncropped full-desktop captures
│   └── TrustLens_AI_Report_Assets/ # Intermediate rendering outputs from early matplotlib runs
├── legacy_scripts/         # Diagnostic and superseded development test scripts
│   ├── test_docx_builder.py    # Prototype docx generation test
│   ├── find_locker.py          # Process file-handle inspection utility
│   ├── inspect_current_report.py # Report inspection script
│   └── verify_report.py        # Early validation script
├── temp_docx/              # Interim report drafts and scratch builds
│   ├── TrustLens_AI_Project_Report_v2.docx # Secondary working draft
│   ├── test_out.docx           # Formatting test artifact
│   └── test_page_no.docx       # Page number test artifact
└── README.md               # Archive manifest
```

