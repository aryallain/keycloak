@echo off
title Keycloak Token Viewer
cd /d D:\DevProjects\besmart\keycloak

:: Load PORT from .env file
set PORT=3000
if exist .env (
    for /f "tokens=2 delims==" %%a in ('findstr /i "^PORT=" .env') do set PORT=%%a
)

echo ========================================
echo    KEYCLOAK TOKEN VIEWER
echo ========================================
echo.
echo 🚀 Memulai server Token Viewer...
echo 📡 Server akan berjalan di http://localhost:%PORT%
echo.
echo 💡 Tips: 
echo    - Browser akan terbuka otomatis
echo    - Tutup jendela ini untuk menghentikan server
echo    - Token akan otomatis update setiap 30 detik
echo.
echo ========================================
echo.

:: Cek apakah port sudah digunakan
netstat -an | findstr ":%PORT%.*LISTENING" > nul
if %errorlevel% equ 0 (
    echo ⚠️  Server sudah berjalan di port %PORT%
    echo 📱 Buka http://localhost:%PORT% di browser
    echo.
    start http://localhost:%PORT%
) else (
    :: Jalankan server, browser akan dibuka oleh server.js
    node server.js
)

echo.
echo 🛑 Server telah berhenti.
echo.
pause