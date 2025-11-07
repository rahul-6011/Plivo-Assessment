@echo off
echo Starting Status Page Application...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause