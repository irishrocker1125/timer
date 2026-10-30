@echo off
REM Ultimate Stage Timer - Local Server Start Script
REM This script starts a simple HTTP server for local testing

echo.
echo ========================================
echo  Ultimate Stage Timer - Local Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Starting local web server...
echo.
echo Access the timer at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8000

pause
