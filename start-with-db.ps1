Write-Host "Starting PaymentAI2 System with PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$env:DATABASE_URL = "postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "Starting Backend Services with Database..." -ForegroundColor Yellow

# Start backends
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bank1'; & '$PWD\.venv\Scripts\Activate.ps1'; python main_postgres.py"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bank2'; & '$PWD\.venv\Scripts\Activate.ps1'; python main_postgres.py"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\payment-gateway'; & '$PWD\.venv\Scripts\Activate.ps1'; python main.py"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\shopping-app\backend'; & '$PWD\.venv\Scripts\Activate.ps1'; python main.py"

Write-Host ""
Write-Host "Waiting for backends to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting Frontend Services..." -ForegroundColor Yellow

# Start frontends
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\payment-ai-frontend'; npm run dev"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bank1\frontend'; npm run dev"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bank2\frontend'; npm run dev"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\shopping-app\frontend'; npm run dev"

Write-Host ""
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "=== Service URLs ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend APIs:" -ForegroundColor Yellow
Write-Host "  Bank 1: http://localhost:8001/docs" -ForegroundColor White
Write-Host "  Bank 2: http://localhost:8002/docs" -ForegroundColor White
Write-Host "  Payment Gateway: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  Shopping: http://localhost:8003/docs" -ForegroundColor White
Write-Host ""
Write-Host "Frontend Apps:" -ForegroundColor Yellow
Write-Host "  Payment AI Chatbot: http://localhost:3000" -ForegroundColor White
Write-Host "  Bank 1 Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host "  Bank 2 Dashboard: http://localhost:3002" -ForegroundColor White
Write-Host "  Shopping Store: http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "Database: Neon PostgreSQL (Connected!)" -ForegroundColor Green
Write-Host "  Fixed Account Numbers - No More Random Changes!" -ForegroundColor Green
Write-Host "  Transaction History Enabled" -ForegroundColor Green
Write-Host ""
Write-Host "Main App: Open http://localhost:3000 to use Payment AI!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to open Payment AI in browser..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:3000"
