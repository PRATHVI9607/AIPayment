# PaymentAI2 - Multi-Bank Payment Ecosystem with AI Chatbot

A comprehensive payment ecosystem simulation with multiple banks, a payment gateway, shopping app, and an AI-powered payment chatbot.

## 🏗️ Architecture

### Backend Services (FastAPI)
- **Bank Server 1** - Port 8001
- **Bank Server 2** - Port 8002
- **Payment Gateway** - Port 8000
- **Shopping App Backend** - Port 8003

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

## 🚀 Starting the Services (If Stopped)

### Backend Services
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

### Security Features
- JWT token authentication with 30-minute expiration
- Bcrypt password hashing
- Token verification at multiple levels
- Authorization checks before each transaction
- CORS enabled for development (restrict in production)

### Data Persistence
- Currently using **in-memory storage** (data resets on server restart)
- For production: Replace with PostgreSQL/MySQL using SQLAlchemy

## 🤖 Payment AI Chatbot - NOW FULLY FUNCTIONAL!

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
   - Login to your bank account
   - Send money using natural language
   - Confirmation dialog before transfer
   - Real-time balance updates

4. **🛍️ Product Search**
   - Search shopping catalog by voice or text
   - Filter by brand, price, category
   - View product details inline

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

1. **Development Mode Only** - These services use development settings
2. **No Data Persistence** - All data is in-memory and will be lost on restart
3. **Security Keys** - Change the SECRET_KEY values in production
4. **CORS** - Currently allows all origins (restrict in production)
5. **Error Handling** - Basic error handling; enhance for production
6. **No Rollback** - Failed credit operations don't auto-rollback debits

## 🎯 Next Steps

1. **Add Database:** Implement SQLAlchemy with PostgreSQL
2. **Complete AI Chatbot:** Integrate Gemini/Groq for NLP
3. **Add Voice Input:** Implement speech-to-text
4. **Enhanced Frontend:** Build full login/dashboard UIs
5. **Transaction History:** Add detailed transaction views
6. **Notifications:** Real-time transaction alerts
7. **Admin Panel:** Manage users, view all transactions
8. **Testing:** Add unit and integration tests
9. **Docker:** Containerize all services
10. **Production Deploy:** Add SSL, proper security, monitoring

## 📝 License

This is a demo/educational project.

---

**Status:** ✅ All services running and ready for development!
