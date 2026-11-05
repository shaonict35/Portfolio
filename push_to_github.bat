@echo off
title Push Portfolio to GitHub
echo ========================================================
echo Pushing Full Project to https://github.com/shaonict35/Portfolio.git
echo ========================================================
git add .
git commit -m "Update portfolio: Hero card AL-AMIN watermark design, Experience section portrait, Admin panel live previews and full sync"
git branch -M main
git push -u origin main
echo.
echo ========================================================
echo PUSH PROCESS FINISHED!
echo ========================================================
pause

