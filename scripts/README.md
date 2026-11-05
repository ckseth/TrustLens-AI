# TrustLens AI — Build Automation & Maintenance Scripts

This directory houses the build automation scripts, diagram generation tools, document compilation pipelines, and database seed utilities for **TrustLens AI**.

---

## 1. Script Catalog

| Script | Runtime | Purpose |
| :--- | :--- | :--- |
| `generate_modern_styled_diagrams.py` | Python 3 | Generates high-DPI (300 DPI) publication-quality modern card-based diagrams (Figures 3.1 through 3.8) in `report-assets/diagrams/`. |
| `generate_engineering_diagrams.py` | Python 3 | Generates alternative ANSI engineering architectural and flow diagrams in `report-assets/diagrams/`. |
| `build_full_document.py` | Python 3 (`python-docx`) | Master compiler that builds `TrustLens_AI_Project_Report.docx` according to Chandigarh University formatting guidelines. |
| `build_52page_report.py` | Python 3 | Calibrated document generation pipeline ensuring target 52-page academic length with exact font hierarchy. |
| `process_user_images.py` | Python 3 (`PIL`) | Crops and optimizes raw interface screenshots to extract UI component figures (Figures 4.1 to 4.8). |
| `reorganize_project.py` | Python 3 | Performs automated project re-structuring into `frontend/`, `backend/`, `report-assets/`, etc. |
| `final_cleanup.py` | Python 3 | Cleanly stages obsolete files into `archive/` and removes redundant duplicate root directories. |
| `seedAdmin.js` | Node.js | Inserts a default administrative account into local MongoDB for administrative testing. |
| `seedDemo.js` | Node.js | Creates or refreshes the non-admin local demo login account. |
| `sync_final_report.bat` / `.ps1` | Batch / PowerShell | One-click automation scripts to rebuild and synchronize the academic report document. |

---

## 2. Re-Generating Architectural Diagrams

To regenerate all modern card diagrams:

```bash
python scripts/generate_modern_styled_diagrams.py
```

Outputs will be rendered to `report-assets/diagrams/`.
