@echo off
cd /d "%~dp0"

echo ========================================
echo LocalTunnel Startup Script
echo ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

where lt >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo [WARNING] LocalTunnel not found
    echo ========================================
    echo.
    echo Please install LocalTunnel first (one time only):
    echo.
    echo   npm install -g localtunnel
    echo.
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking dependencies...
echo.

if not exist "node_modules\express" (
    echo Installing main server dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

if not exist "Register2\node_modules\express" (
    echo Installing API proxy dependencies...
    cd Register2
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install API proxy dependencies
        pause
        exit /b 1
    )
)

echo [2/3] Starting main server (port 8080)...
echo.
start "Main-Server-8080" cmd /k "cd /d %~dp0 && echo ======================================== && echo Main Server - Port 8080 && echo ======================================== && echo. && node server.js"

timeout /t 2 >nul

echo [3/3] Starting API proxy server (port 3000)...
echo.
start "API-Proxy-3000" cmd /k "cd /d %~dp0Register2 && echo ======================================== && echo API Proxy Server - Port 3000 && echo ======================================== && echo. && node server.js"

timeout /t 2 >nul

echo ========================================
echo Starting LocalTunnel (generating public URL)...
echo ========================================
echo.
echo Instructions:
echo   - A new window will open running LocalTunnel
echo   - LocalTunnel will display a URL (e.g., https://xxxxx.loca.lt)
echo   - Copy this URL and access it from your phone browser
echo.
echo ========================================
echo.
pause

start "LocalTunnel-URL" cmd /k "title LocalTunnel - Check URL Here && color 0A && echo. && echo ======================================== && echo   LocalTunnel Starting... && echo ======================================== && echo. && echo [IMPORTANT] Wait a few seconds, URL will appear below && echo. && echo Look for this line: && echo   your url is: https://xxxxx.loca.lt && echo. && echo Copy this URL and access from phone browser && echo. && echo ======================================== && echo. && lt --port 8080 && pause"

echo.
echo ========================================
echo Startup Complete!
echo ========================================
echo.
echo Three windows opened:
echo   1. Main Server (port 8080)
echo   2. API Proxy (port 3000)
echo   3. LocalTunnel (public URL) - CHECK THIS WINDOW FOR URL!
echo.
echo ========================================
echo [IMPORTANT] How to find LocalTunnel URL:
echo ========================================
echo.
echo Method 1: Check LocalTunnel window
echo   1. Find window titled "LocalTunnel-URL"
echo   2. Look for line "your url is:"
echo   3. Copy the URL (e.g., https://xxxxx.loca.lt)
echo.
echo Method 2: If too many windows
echo   1. Press Alt+Tab to switch windows
echo   2. Find window showing "your url is:"
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo   1. Copy the LocalTunnel URL
echo   2. Make sure computer is connected to VPN (for AI features)
echo   3. Access URL from phone browser
echo   4. Test PWA and AI features
echo.
echo To stop services: Press Ctrl+C in each window
echo.
pause
