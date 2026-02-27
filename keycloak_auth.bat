@echo off
title Keycloak Authentication Tool
cd /d D:\DevProjects\besmart\keycloak

:MENU
echo ----------------------------------------
echo [L] Login - Dapatkan token baru
echo [R] Refresh - Perbarui token yang ada
echo [Q] Quit - Keluar
echo ----------------------------------------
choice /c LRQ /n /m "Choose [L/R/Q]: "

if errorlevel 3 goto END
if errorlevel 2 goto REFRESH
if errorlevel 1 goto LOGIN

:LOGIN
cls
echo.
node auth.js
echo.
goto MENU

:REFRESH
cls
echo.
node auth-refresh-token.js
echo.
goto MENU

:END
exit