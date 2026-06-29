@echo off
echo =========================================
echo NetPulse Agent Installer
echo =========================================

echo.
echo Building the standalone executable (this may take a minute)...
call npx pkg main.js --target node18-win-x64 --output NetPulse.exe

if not exist "NetPulse.exe" (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo Installing to Windows Startup Folder...
copy /Y "NetPulse.exe" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\"

echo.
echo Installation Complete!
echo The NetPulse Agent will now run silently in the background every time this PC is turned on.
echo.
pause
