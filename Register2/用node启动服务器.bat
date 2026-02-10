@echo off
cd /d %~dp0
if exist node_modules (
    echo Starting server: node server.js
    node server.js
    pause
) else (
    echo Error: node_modules not found. Run npm install first.
    pause
)
