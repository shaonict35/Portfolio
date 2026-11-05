Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Pushing Full Project to https://github.com/shaonict35/Portfolio.git" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

git add .
git commit -m "Add hero card sway animation and enlarge orbital dotted ring"
git branch -M main
git push origin main

Write-Host "========================================================" -ForegroundColor Green
Write-Host "Push completed successfully!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Read-Host "Press Enter to exit..."

