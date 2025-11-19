# Project Red - Quick Start Script
# This script helps verify your environment and setup

Write-Host "🚀 Project Red - Setup Verification" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check Node.js version
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "   ⚠ Warning: Node.js 18+ recommended. You have: $nodeVersion" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "`n📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found!" -ForegroundColor Red
    exit 1
}

# Check if package.json exists
Write-Host "`n📄 Checking project files..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   ✓ package.json found" -ForegroundColor Green
} else {
    Write-Host "   ✗ package.json not found! Are you in the project directory?" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
Write-Host "`n📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules found" -ForegroundColor Green
    
    # Check specific required packages
    $requiredPackages = @("next", "react", "next-auth", "mongodb", "react-hook-form", "zod")
    $missingPackages = @()
    
    foreach ($package in $requiredPackages) {
        if (!(Test-Path "node_modules\$package")) {
            $missingPackages += $package
        }
    }
    
    if ($missingPackages.Count -gt 0) {
        Write-Host "   ⚠ Missing packages: $($missingPackages -join ', ')" -ForegroundColor Yellow
        Write-Host "   Run: npm install --legacy-peer-deps" -ForegroundColor Cyan
    } else {
        Write-Host "   ✓ All required packages installed" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠ node_modules not found" -ForegroundColor Yellow
    Write-Host "   Run: npm install --legacy-peer-deps" -ForegroundColor Cyan
}

# Check .env.local
Write-Host "`n🔐 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✓ .env.local found" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    $requiredVars = @(
        "MONGODB_URI",
        "NEXTAUTH_SECRET",
        "NEXTAUTH_URL",
        "R2_ACCOUNT_ID",
        "R2_ACCESS_KEY_ID",
        "R2_SECRET_ACCESS_KEY",
        "R2_BUCKET_NAME",
        "NEXT_PUBLIC_R2_PUBLIC_URL"
    )
    
    $missingVars = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=.+") {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "   ⚠ Missing or empty variables:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "      - $var" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✓ All required variables configured" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ .env.local not found!" -ForegroundColor Red
    Write-Host "   Create .env.local and add required variables." -ForegroundColor Cyan
    Write-Host "   See setup.md for detailed instructions." -ForegroundColor Cyan
}

# Check if port 3000 is available
Write-Host "`n🌐 Checking port 3000..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "   ⚠ Port 3000 is in use" -ForegroundColor Yellow
    Write-Host "   Run: npm run dev -- -p 3001" -ForegroundColor Cyan
} else {
    Write-Host "   ✓ Port 3000 is available" -ForegroundColor Green
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path "node_modules")) {
    Write-Host "1. Install dependencies:" -ForegroundColor White
    Write-Host "   npm install --legacy-peer-deps`n" -ForegroundColor Gray
}

if (!(Test-Path ".env.local")) {
    Write-Host "2. Create .env.local file:" -ForegroundColor White
    Write-Host "   See setup.md for instructions`n" -ForegroundColor Gray
}

Write-Host "3. Start development server:" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor Gray

Write-Host "4. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:3000`n" -ForegroundColor Gray

Write-Host "📖 Full setup guide: setup.md" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Generate NextAuth secret helper
Write-Host "💡 Need a NEXTAUTH_SECRET?" -ForegroundColor Yellow
$response = Read-Host "Generate one now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    $secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "`nYour NEXTAUTH_SECRET:" -ForegroundColor Green
    Write-Host $secret -ForegroundColor White
    Write-Host "`nAdd this to your .env.local file:" -ForegroundColor Cyan
    Write-Host "NEXTAUTH_SECRET=$secret`n" -ForegroundColor Gray
}
