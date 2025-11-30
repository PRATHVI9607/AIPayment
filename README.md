# PaymentAI2 - Multi-Bank Payment System with AI Chatbot

An AI-powered payment system with multiple banks, payment gateway, shopping app, and intelligent chatbot interface.

## 🚀 Deploy to Railway (Recommended!)

**Want to deploy this to the cloud? Follow our comprehensive guides:**

1. 📖 **[RAILWAY_SETUP.md](RAILWAY_SETUP.md)** - Complete step-by-step deployment guide
2. ⚡ **[RAILWAY_QUICK_REFERENCE.md](RAILWAY_QUICK_REFERENCE.md)** - Quick configuration reference
3. 📊 **[RAILWAY_VISUAL_GUIDE.txt](RAILWAY_VISUAL_GUIDE.txt)** - Visual architecture diagram
4. ✅ **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Track your deployment progress

**Quick Start:**
- Sign up at https://railway.app
- Get Groq API key from https://console.groq.com
- Deploy all 8 services following RAILWAY_SETUP.md
- Share your deployed Payment AI chatbot with the world!

---

## 🏗️ Architecture

### Backend Services (FastAPI)
- **Bank 1 API** - Port 8001 (In-memory storage)
- **Bank 2 API** - Port 8002 (In-memory storage)
- **Payment Gateway** - Port 8000 (Inter-bank routing)
- **Shopping App API** - Port 8003 (Product catalog)

### Frontend Services (Next.js)
- **Payment AI Chatbot** - Port 3000
- **Bank 1 Dashboard** - Port 3001
- **Bank 2 Dashboard** - Port 3002
- **Shopping App** - Port 3003

## ✅ All Services Running

All services are currently running and accessible at:

| Service | Type | URL |
|---------|------|-----|
| Bank 1 API | FastAPI | http://localhost:8001 |
| Bank 2 API | FastAPI | http://localhost:8002 |
| Payment Gateway | FastAPI | http://localhost:8000 |
| Shopping App API | FastAPI | http://localhost:8003 |
| Payment AI Chatbot | Next.js | http://localhost:3000 |
| Bank 1 Dashboard | Next.js | http://localhost:3001 |
| Bank 2 Dashboard | Next.js | http://localhost:3002 |
| Shopping App | Next.js | http://localhost:3003 |

## 🔑 Sample User Accounts

### Bank 1 Users
- **Username:** alice | **Password:** password123 | **Balance:** $5,000
- **Username:** bob | **Password:** password123 | **Balance:** $3,000

### Bank 2 Users
- **Username:** charlie | **Password:** password123 | **Balance:** $7,000
- **Username:** diana | **Password:** password123 | **Balance:** $4,000

## 🛍️ Shopping Catalog

The shopping app includes products from two brands:
- **TechPro** - Electronics (headphones, smartphones, laptops, smartwatches, speakers)
- **HomeStyle** - Home appliances and kitchen items (coffee makers, vacuum cleaners, air purifiers, blenders, etc.)

## 🔄 How the Payment System Works

### 1. Token-Based Authentication
- Users login to their bank and receive a JWT token
- Token expires in 30 minutes
- All payment transactions require a valid token

### 2. Payment Flow
```
User Request → Payment Gateway → Sender Bank (Authorize) → Receiver Bank (Verify)
    ↓                                      ↓                           ↓
Confirmation ← Gateway ← Debit Sender ← Credit Receiver ← Log Transaction
```

### 3. Payment Gateway Process
1. **Identify Banks** - Determines sender and receiver banks from account numbers
2. **Verify Accounts** - Confirms both accounts exist
3. **Authorize Transfer** - Validates sender's token and sufficient balance
4. **Debit Sender** - Removes money from sender's account
5. **Credit Receiver** - Adds money to receiver's account
6. **Log Transaction** - Records the complete transaction

## 📡 API Examples

### Login to Bank 1
```bash
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "username": "alice",
    "account_number": "BANK1XXXXXXXX",
    "balance": 5000.0
  }
}
```

### Make a Transfer via Payment Gateway
```bash
curl -X POST http://localhost:8000/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from_account": "BANK1XXXXXXXX",
    "to_account": "BANK2YYYYYYYY",
    "amount": 100.50,
    "token": "your_jwt_token_here",
    "description": "Payment for services"
  }'
```

### Search Products
```bash
curl -X POST http://localhost:8003/products/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "headphones",
    "brand": "TechPro",
    "min_price": 50,
    "max_price": 200
  }'
```

## 🚀 Quick Start

### One-Command Launch (Recommended)
```powershell
# From project root (C:\Workspace\PaymentAI2)
.\start-all.ps1
```

This script launches all 8 services (4 backends + 4 frontends) automatically.

### Manual Start - Backend Services
```powershell
# From project root (C:\Workspace\PaymentAI2)

# Bank 1
python -m uvicorn bank1.main:app --reload --port 8001

# Bank 2
python -m uvicorn bank2.main:app --reload --port 8002

# Payment Gateway
python -m uvicorn payment-gateway.main:app --reload --port 8000

# Shopping App
python -m uvicorn shopping-app.backend.main:app --reload --port 8003
```

### Frontend Services
```powershell
# Bank 1 Frontend
cd bank1/frontend
npm run dev

# Bank 2 Frontend
cd bank2/frontend
npm run dev

# Shopping App Frontend
cd shopping-app/frontend
npm run dev

# Payment AI Frontend
cd payment-ai-frontend
npm run dev
```

## 🔧 Development Notes

### Technologies Used
- **Backend:** FastAPI, Python 3.11+
- **Frontend:** Next.js 13, React 18
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **HTTP Client:** httpx (for inter-service communication)

### Data Storage
- **In-Memory Storage** - All user accounts and transactions are stored in memory
- Data resets when servers restart
- No external database required
- Perfect for testing and development

### Security Features
- JWT token authentication with 30-minute expiration
- Bcrypt password hashing
- Token verification at multiple levels
- Authorization checks before each transaction
- CORS enabled for development (restrict in production)

## 🤖 Payment AI Chatbot

The Payment AI chatbot is now complete with:

### ✅ Features Implemented
1. **🎤 Voice Input** - Browser-based speech recognition (Chrome/Edge)
   - Click the microphone button to speak your commands
   - Automatically converts speech to text

2. **🧠 Natural Language Processing** - Powered by Groq (Llama 3.1)
   - Understands commands like:
     - "Send $50 to BANK2XXXXXXXX"
     - "Find headphones under $100"
     - "Search for TechPro products"
     - "What's my balance?"

3. **💰 Money Transfers**
   - Secure login to your bank
   - Send money using natural language
   - Confirmation dialog before transfer
   - Real-time balance updates

4. **🛍️ Product Search & Purchase**
   - Search products by voice or text
   - View product cards with details
   - Click "ACQUIRE" button to purchase
   - Secure payment through gateway

5. **🔐 Secure Authentication**
   - Bank login with JWT tokens
   - Token-based transaction authorization
   - Auto-logout on session expiry

### 🎯 How to Use

1. **Open the Payment AI**: http://localhost:3000

2. **Login** (required for transfers):
   - Click "Login to Bank"
   - Choose Bank 1 or Bank 2
   - Use test credentials (see below)

3. **Try Voice Commands**:
   - Click 🎤 microphone button
   - Say: "Send $100 to charlie" or "Find cheap laptops"
   - Or type your message

4. **Complete Transfers**:
   - AI will extract recipient and amount
   - Review and confirm the transfer
   - Transaction processes through payment gateway

### 🔑 Test Commands

**Money Transfer:**
- "Send $50 to BANK2XXXXXXXX" (use actual account number)
- "Transfer 100 dollars to bob"
- "I want to send money"

**Product Search:**
- "Find headphones"
- "Show me TechPro products"
- "Search for home appliances under $200"

**Account Info:**
- "What's my balance?"
- "Check my account"
- "Show transaction history"

## 📊 API Documentation

Visit the following URLs for interactive API documentation:

- Bank 1: http://localhost:8001/docs
- Bank 2: http://localhost:8002/docs
- Payment Gateway: http://localhost:8000/docs
- Shopping App: http://localhost:8003/docs

## ⚠️ Important Notes

1. **Development Mode** - Uses development settings and in-memory storage
2. **No Database** - All data is in-memory and resets on restart
3. **Security Keys** - Change SECRET_KEY values for production
4. **CORS** - Currently allows all origins (restrict in production)

## 🎯 Future Enhancements

- Add persistent database storage (PostgreSQL/MySQL)
- Enhanced security with rate limiting
- Transaction history and reporting
- Admin dashboard for monitoring
- Docker containerization
- Production deployment guides

## 📝 License

This is a demo/educational project.

---

**Status:** ✅ Fully functional payment system with AI chatbot interface!
