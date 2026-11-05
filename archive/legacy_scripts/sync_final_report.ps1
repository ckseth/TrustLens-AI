Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " TrustLens AI Project Report Synchronizer" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$source = "TrustLens_AI_Project_Report_v2.docx"
$target = "TrustLens_AI_Project_Report.docx"

if (Test-Path $source) {
    try {
        Copy-Item -Path $source -Destination $target -Force -ErrorAction Stop
        Write-Host "[SUCCESS] $target has been successfully updated to the 52-page master version!" -ForegroundColor Green
    }
    catch {
        Write-Host "[NOTICE] Could not overwrite $target because it is open in Microsoft Word." -ForegroundColor Yellow
        Write-Host "Please close Microsoft Word and run this script again." -ForegroundColor Yellow
    }
} else {
    Write-Host "[ERROR] $source not found." -ForegroundColor Red
}

