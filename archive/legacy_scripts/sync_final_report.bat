@echo off
echo ========================================================
echo  TrustLens AI Project Report Synchronizer
echo ========================================================
echo.
echo Attempting to copy TrustLens_AI_Project_Report_v2.docx to TrustLens_AI_Project_Report.docx...
echo Please ensure Microsoft Word has closed TrustLens_AI_Project_Report.docx first.
echo.
copy /Y "TrustLens_AI_Project_Report_v2.docx" "TrustLens_AI_Project_Report.docx"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] TrustLens_AI_Project_Report.docx successfully updated to the 52-page master version!
) else (
    echo.
    echo [NOTICE] Failed to overwrite. Please close Microsoft Word and run this script again.
)
echo.
pause

