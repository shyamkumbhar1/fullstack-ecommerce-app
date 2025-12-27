@echo off
REM Switch backend stack script for Windows
REM Usage: scripts\switch-stack.bat express-mongodb

set STACK=%1

if "%STACK%"=="" (
  echo Error: Stack name required
  echo Usage: scripts\switch-stack.bat ^<stack-name^>
  exit /b 1
)

REM Get port from config
for /f "tokens=2 delims==" %%a in ('findstr /b "%STACK%=" scripts\ports.config') do set PORT=%%a

if "%PORT%"=="" (
  echo Error: Stack '%STACK%' not found in ports.config
  exit /b 1
)

REM Stop current backend processes
echo Stopping current backend processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM php.exe 2>nul

REM Update frontend .env
set ENV_FILE=client\.env
echo REACT_APP_API_URL=http://localhost:%PORT%/api > %ENV_FILE%
echo REACT_APP_BACKEND=%STACK% >> %ENV_FILE%

echo ✅ Switched to %STACK% on port %PORT%
echo Frontend .env updated: %ENV_FILE%
echo Start backend with: npm run dev:%STACK%

