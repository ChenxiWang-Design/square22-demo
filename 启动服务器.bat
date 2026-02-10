@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo PWA Server Startup
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo Getting local IP address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "IP=%%a"
    set "IP=!IP: =!"
    
    echo !IP! | findstr /r "^192\.168\." >nul
    if !errorlevel! equ 0 (
        set "CORRECT_IP=!IP!"
        goto :found
    )
    echo !IP! | findstr /r "^172\.\(1[6-9]\|2[0-9]\|3[01]\)\." >nul
    if !errorlevel! equ 0 (
        set "CORRECT_IP=!IP!"
        goto :found
    )
    echo !IP! | findstr /r "^10\." >nul
    if !errorlevel! equ 0 (
        set "CORRECT_IP=!IP!"
        goto :found
    )
)

:found
echo ========================================
echo Server Information
echo ========================================
if defined CORRECT_IP (
    echo Recommended IP: %CORRECT_IP%
    echo.
    echo Mobile access: http://%CORRECT_IP%:8080
    echo Local access: http://localhost:8080
) else (
    echo [WARNING] No recommended LAN IP found
    echo Please check ipconfig manually
    echo Look for "Wireless LAN adapter" IPv4 address
)
echo.
echo ========================================
echo Starting server...
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

node server.js

pause
