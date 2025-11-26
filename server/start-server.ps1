# Backend Server Startup Script
Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "Working directory: $PWD" -ForegroundColor Cyan

# Change to server directory
Set-Location $PSScriptRoot

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with required variables." -ForegroundColor Yellow
    pause
    exit 1
}

# Start the server
Write-Host "`nStarting Node.js server on port 5000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

node index.js

