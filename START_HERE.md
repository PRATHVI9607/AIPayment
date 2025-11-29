# 🚀 QUICK START GUIDE - PaymentAI2

## Option 1: Use PowerShell Script (Easiest)

Run this in PowerShell from the project root:
```powershell
.\start-all.ps1
```

---

## Option 2: Manual Start (Step by Step)

### Step 1: Start Backend Services (4 terminals)

**Terminal 1 - Bank 1:**
```powershell
python -m uvicorn bank1.main:app --reload --port 8001
```

**Terminal 2 - Bank 2:**
```powershell
python -m uvicorn bank2.main:app --reload --port 8002
```

**Terminal 3 - Payment Gateway:**
```powershell
python -m uvicorn payment-gateway.main:app --reload --port 8000
```

**Terminal 4 - Shopping API:**
```powershell
python -m uvicorn shopping-app.backend.main:app --reload --port 8003
```

### Step 2: Start Frontend Services (4 more terminals)

**Terminal 5 - Payment AI Chatbot:**
```powershell
cd payment-ai-frontend
npm run dev
```

**Terminal 6 - Bank 1 Dashboard:**
```powershell
cd bank1/frontend
npm run dev
```

**Terminal 7 - Bank 2 Dashboard:**
```powershell
cd bank2/frontend
npm run dev
```

**Terminal 8 - Shopping Store:**
```powershell
cd shopping-app/frontend
npm run dev
```

---

## Step 3: Open Payment AI Chatbot

Open in your browser: **http://localhost:3000**

---

## 🔧 Fixed Issues

✅ **Chat Error Fixed** - Rewrote API to use direct Groq API calls (no SDK issues)
✅ **Environment Variables** - All API keys properly configured
✅ **CORS** - All backends allow frontend communication

---

## 🎯 Test the Chatbot

1. Go to http://localhost:3000
2. Click **"Login to Bank"**
3. Select **Bank 1**, use **alice** / **password123**
4. Type or use voice 🎤:
   - "What's my balance?"
   - "Find headphones"
   - "Send money" (requires account number)

---

## 🔑 Test Accounts

| Bank | Username | Password | Balance |
|------|----------|----------|---------|
| Bank 1 | alice | password123 | $5,000 |
| Bank 1 | bob | password123 | $3,000 |
| Bank 2 | charlie | password123 | $7,000 |
| Bank 2 | diana | password123 | $4,000 |

---

## 📊 Service URLs

### Main App
- **Payment AI Chatbot:** http://localhost:3000 ⭐

### Backend APIs (with docs)
- Bank 1: http://localhost:8001/docs
- Bank 2: http://localhost:8002/docs
- Payment Gateway: http://localhost:8000/docs
- Shopping: http://localhost:8003/docs

### Other Frontends
- Bank 1 Dashboard: http://localhost:3001
- Bank 2 Dashboard: http://localhost:3002
- Shopping Store: http://localhost:3003

---

## ❗ Troubleshooting

### "Sorry, encountered an error" in chat
**FIXED!** - API route now uses direct fetch instead of Groq SDK

### Backend not connecting
Check that all 4 Python services are running (ports 8000, 8001, 8002, 8003)

### Port already in use
Kill the process:
```powershell
# Find process on port (example: 3000)
netstat -ano | findstr :3000

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Voice not working
- Use Chrome or Edge browser
- Allow microphone permissions when prompted

---

## 💡 Quick Commands

**Check if all services are running:**
```powershell
curl http://localhost:8001, http://localhost:8002, http://localhost:8000, http://localhost:8003, http://localhost:3000
```

**Stop all Node processes:**
```powershell
taskkill /F /IM node.exe
```

**Stop all Python processes:**
```powershell
Get-Process python | Stop-Process -Force
```

---

## 🎬 Ready to Go!

The chatbot error is now fixed. Start all services and try it out! 🚀
