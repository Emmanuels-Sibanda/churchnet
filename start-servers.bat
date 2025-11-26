@echo off
echo Starting Church Venue Hiring Application...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

