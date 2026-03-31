@echo off
title Keycloak Authentication Tool
cd /d D:\DevProjects\besmart\keycloak

:MENU
cls
echo ========================================
echo    KEYCLOAK AUTHENTICATION TOOL
echo ========================================
echo.
echo [L] Login - Dapatkan token baru
echo [R] Refresh - Perbarui token yang ada
echo [V] View - Buka Token Viewer (jendela baru)
echo [Q] Quit - Keluar
echo.
echo ----------------------------------------
choice /c LRVQ /n /m "Choose [L/R/V/Q]: "

if errorlevel 4 goto END
if errorlevel 3 goto VIEW
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

:VIEW
:: Buka viewer di jendela CMD baru (tidak blocking)
start "Keycloak Token Viewer" cmd /c start-viewer.bat
goto MENU

:END
exit