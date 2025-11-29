# PaymentAI2 - Start All Services
# Run this script to start all backend and frontend services

Write-Host "Starting PaymentAI2 System..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Services
Write-Host "Starting Backend Services..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python -m uvicorn bank1.main:app --reload --port 8001"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python -m uvicorn bank2.main:app --reload --port 8002"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python -m uvicorn payment-gateway.main:app --reload --port 8000"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python -m uvicorn shopping-app.backend.main:app --reload --port 8003"

Write-Host ""
Write-Host "Waiting for backends to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Services
Write-Host ""
Write-Host "Starting Frontend Services..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\payment-ai-frontend'; npm run dev -- -p 3000"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\bank1\frontend'; npm run dev -- -p 3001"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\bank2\frontend'; npm run dev -- -p 3002"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\shopping-app\frontend'; npm run dev -- -p 3003"

Write-Host ""
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "=== Service URLs ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend APIs:" -ForegroundColor Yellow
Write-Host "  Bank 1: http://localhost:8001/docs"
Write-Host "  Bank 2: http://localhost:8002/docs"
Write-Host "  Payment Gateway: http://localhost:8000/docs"
Write-Host "  Shopping: http://localhost:8003/docs"
Write-Host ""
Write-Host "Frontend Apps:" -ForegroundColor Yellow
Write-Host "  Payment AI Chatbot: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Bank 1 Dashboard: http://localhost:3001"
Write-Host "  Bank 2 Dashboard: http://localhost:3002"
Write-Host "  Shopping Store: http://localhost:3003"
Write-Host ""
Write-Host "Main App: Open http://localhost:3000 to use Payment AI!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to open Payment AI in browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:3000"
