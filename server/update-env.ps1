# PowerShell script to update .env file with Gmail SMTP settings
$envFile = ".env"

# Check if .env exists, if not create it
if (-not (Test-Path $envFile)) {
    New-Item -ItemType File -Path $envFile | Out-Null
    Write-Host "Created new .env file"
}

# Read existing content
$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Gmail SMTP settings to add/update
$smtpSettings = @"
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emmanuel.sibanda@gmail.com
SMTP_PASS=qnezqazmznkwspsg
FROM_EMAIL=emmanuel.sibanda@gmail.com
FROM_NAME=Church Venue
FRONTEND_URL=http://localhost:3000
"@

# Remove old SMTP settings if they exist
$newContent = $content | Where-Object {
    $_ -notmatch '^SMTP_HOST=' -and
    $_ -notmatch '^SMTP_PORT=' -and
    $_ -notmatch '^SMTP_USER=' -and
    $_ -notmatch '^SMTP_PASS=' -and
    $_ -notmatch '^FROM_EMAIL=' -and
    $_ -notmatch '^FROM_NAME=' -and
    $_ -notmatch '^FRONTEND_URL=' -and
    $_ -notmatch '^# Gmail SMTP'
}

# Add new SMTP settings
$newContent += ""
$newContent += $smtpSettings

# Write to file
$newContent | Set-Content $envFile

Write-Host "✅ .env file updated with Gmail SMTP settings!"
Write-Host ""
Write-Host "Settings added:"
Write-Host "  SMTP_USER=emmanuel.sibanda@gmail.com"
Write-Host "  SMTP_PASS=*** (hidden)"
Write-Host "  FROM_EMAIL=emmanuel.sibanda@gmail.com"
Write-Host ""
Write-Host "You can now test with: node test-email.js"


