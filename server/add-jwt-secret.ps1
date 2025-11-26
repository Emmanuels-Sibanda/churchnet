# PowerShell script to add JWT_SECRET to .env file
$envFile = ".env"
$nodeCommand = "node -e `"const crypto = require('crypto'); console.log(crypto.randomBytes(64).toString('hex'))`""
$jwtSecret = Invoke-Expression $nodeCommand

# Read existing content
$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Check if JWT_SECRET already exists
$hasJwtSecret = $content | Where-Object { $_ -match '^JWT_SECRET=' }

if ($hasJwtSecret) {
    Write-Host "JWT_SECRET already exists in .env file"
    Write-Host "Current value: $hasJwtSecret"
    Write-Host ""
    Write-Host "If you want to generate a new one, remove the old line first."
} else {
    # Add JWT_SECRET to the file
    $content += ""
    $content += "# JWT Secret for authentication tokens"
    $content += "JWT_SECRET=$jwtSecret"
    
    $content | Set-Content $envFile
    
    Write-Host "✅ JWT_SECRET added to .env file!"
    Write-Host ""
    Write-Host "Generated JWT_SECRET: $jwtSecret"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Keep this secret secure! Don't share it publicly."
    Write-Host ""
    Write-Host "Now restart your server for the changes to take effect."
}


