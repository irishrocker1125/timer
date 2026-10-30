#!/usr/bin/env pwsh
# GitHub Pages Auto-Enablement Script
# This script helps activate GitHub Pages for your repository

param(
    [string]$Owner = "irishrocker1125",
    [string]$Repo = "timer"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  GITHUB PAGES ACTIVATION HELPER                           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository: $Owner/$Repo" -ForegroundColor Yellow
Write-Host ""

# Check if gh CLI is available
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) not found. Please install it first." -ForegroundColor Red
    exit 1
}

Write-Host "Checking repository access..." -ForegroundColor Cyan

# Verify we can access the repo
$repoCheck = gh repo view "$Owner/$Repo" 2>&1

if ($repoCheck -match "ERROR|Not Found") {
    Write-Host "❌ Repository not found or not accessible" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Repository accessible" -ForegroundColor Green
Write-Host ""

# Try multiple approaches to enable Pages
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Attempting to enable GitHub Pages..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Approach 1: Direct REST API call
Write-Host "[1/3] Trying REST API endpoint..." -ForegroundColor Gray

$apiResponse = gh api repos/$Owner/$Repo/pages `
    -F 'source.branch=main' `
    -F 'source.path=/' `
    -X POST 2>&1

if ($apiResponse -match '"status"' -or $apiResponse -match '"build_type"') {
    Write-Host "✅ SUCCESS: GitHub Pages enabled via API!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:"
    Write-Host $apiResponse
    Write-Host ""
    
    Write-Host "Your site will be available at:" -ForegroundColor Green
    Write-Host "→ https://$Owner.github.io/$Repo" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Note: It may take 1-2 minutes for the site to be live." -ForegroundColor Yellow
    exit 0
}

# Approach 2: Check if Pages already enabled
Write-Host "[2/3] Checking if Pages already enabled..." -ForegroundColor Gray

$statusCheck = gh api repos/$Owner/$Repo/pages 2>&1

if ($statusCheck -notmatch "Not Found") {
    Write-Host "✅ GitHub Pages is already enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is live at:" -ForegroundColor Green
    Write-Host "→ https://$Owner.github.io/$Repo" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

# Approach 3: Manual instructions
Write-Host "[3/3] API method unavailable - Please enable manually" -ForegroundColor Yellow
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "MANUAL GITHUB PAGES SETUP (Takes 30 seconds)" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Open your repository" -ForegroundColor Cyan
Write-Host "   → https://github.com/$Owner/$Repo" -ForegroundColor Blue
Write-Host ""

Write-Host "Step 2: Click 'Settings' (top right of repository)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 3: Click 'Pages' in the left sidebar" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 4: Configure Pages" -ForegroundColor Cyan
Write-Host "   Build and deployment:" -ForegroundColor Gray
Write-Host "   • Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   • Branch: main" -ForegroundColor Gray
Write-Host "   • Folder: / (root)" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 5: Click 'Save'" -ForegroundColor Cyan
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Your site will be live at:" -ForegroundColor Green
Write-Host "→ https://$Owner.github.io/$Repo" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "⏱️  It usually takes 1-2 minutes for the site to appear." -ForegroundColor Yellow
Write-Host "🔄 Refresh the page after a few seconds." -ForegroundColor Yellow
Write-Host ""

exit 0
