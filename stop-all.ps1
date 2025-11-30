# PaymentAI2 - Stop All Services
# Run this script to stop all running services

Write-Host "Stopping PaymentAI2 System..." -ForegroundColor Yellow
Write-Host ""

# Ports to check and kill
$ports = @(8000, 8001, 8002, 8003, 3000, 3001, 3002, 3003)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  Killing process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "  Port $port is free" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host "You can now run .\start-all.ps1 to start fresh."
