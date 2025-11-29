Write-Host "`n🔄 Restarting Bank 1 with fixed shopstore account...`n" -ForegroundColor Cyan

# Find and stop process on port 8001
$port = 8001
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($connections) {
    $pid = $connections[0].OwningProcess
    Write-Host "Stopping existing Bank 1 (PID: $pid)..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Stopped old process" -ForegroundColor Green
}

# Start new Bank 1 process
Write-Host "Starting Bank 1..." -ForegroundColor Cyan
cd C:\Workspace\PaymentAI2\bank1
Start-Process python -ArgumentList "main.py" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Verify
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8001/users" -Method Get
    $shopstore = $response.users | Where-Object { $_.username -eq "shopstore" }
    
    Write-Host "`n✅ Bank 1 is running!" -ForegroundColor Green
    Write-Host "`n🏪 ShopStore Account:" -ForegroundColor Yellow
    Write-Host "   Account Number: " -NoNewline
    Write-Host "$($shopstore.account_number)" -ForegroundColor Cyan
    Write-Host "   Balance: `$$($shopstore.balance)" -ForegroundColor Green
    
    if ($shopstore.account_number -eq "BANK1SHOPSTORE") {
        Write-Host "`n✅ Account is now FIXED! Will never change on restart." -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Account is still random. Needs code update." -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n❌ Bank 1 failed to start properly" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
