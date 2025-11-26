# Start Servers Script for Church Venue Hiring App
Write-Host "Starting Church Venue Hiring Application..." -ForegroundColor Cyan
Write-Host ""

# Start backend server
Write-Host "Starting backend server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start frontend server  
Write-Host "Starting frontend server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Servers are starting in separate windows." -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Frontend may take 30-60 seconds to compile." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

