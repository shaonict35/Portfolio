@echo off
title Push Portfolio to GitHub
echo ========================================================
echo Pushing Full Project to https://github.com/shaonict35/Portfolio.git
echo ========================================================
git add .
git commit -m "Add hero card sway animation and enlarge orbital dotted ring"
git branch -M main
git push origin main
echo.
echo ========================================================
echo PUSH PROCESS FINISHED!
echo ========================================================
pause

