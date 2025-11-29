# PaymentAI2 Deployment Guide

## Architecture Overview

**Frontend Apps (Deploy to Vercel):**
- Payment AI Chatbot (Next.js)
- Bank 1 Dashboard (Next.js)
- Bank 2 Dashboard (Next.js)
- Shopping Store (Next.js)

**Backend APIs (Deploy to Railway/Render):**
- Payment Gateway (FastAPI)
- Bank 1 API (FastAPI)
- Bank 2 API (FastAPI)
- Shopping API (FastAPI)

**Database (Neon DB - PostgreSQL):**
- Users & Accounts
- Transactions History
- Products Catalog

---

## Step 1: Setup Neon Database

1. Go to https://neon.tech and create account
2. Create a new project: "PaymentAI2"
3. Get connection string: `postgresql://user:pass@ep-xxx.neon.tech/neondb`
4. Create 3 databases or schemas:
   - `bank1_db`
   - `bank2_db`
   - `shopping_db`

---

## Step 2: Deploy Backend APIs

### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Create 4 separate services:
   - `payment-gateway` (from `/payment-gateway`)
   - `bank1-api` (from `/bank1`)
   - `bank2-api` (from `/bank2`)
   - `shopping-api` (from `/shopping-app/backend`)
3. Add environment variables to each service:
   ```
   DATABASE_URL=postgresql://...your-neon-url...
   SECRET_KEY=your-secret-key-here
   BANK1_URL=https://bank1-api.railway.app
   BANK2_URL=https://bank2-api.railway.app
   ```

### Option B: Render
Similar process, deploy each Python backend separately

**Note URLs after deployment:**
- Payment Gateway: `https://payment-gateway-xxx.railway.app`
- Bank 1 API: `https://bank1-api-xxx.railway.app`
- Bank 2 API: `https://bank2-api-xxx.railway.app`
- Shopping API: `https://shopping-api-xxx.railway.app`

---

## Step 3: Deploy Frontend Apps to Vercel

Deploy each Next.js app separately:

### Payment AI Chatbot
```bash
cd payment-ai-frontend
vercel --prod
```
Environment Variables:
```
GROQ_API_KEY=your-groq-key
NEXT_PUBLIC_BANK1_API=https://bank1-api-xxx.railway.app
NEXT_PUBLIC_BANK2_API=https://bank2-api-xxx.railway.app
NEXT_PUBLIC_PAYMENT_GATEWAY_API=https://payment-gateway-xxx.railway.app
NEXT_PUBLIC_SHOPPING_API=https://shopping-api-xxx.railway.app
```

### Bank 1 Dashboard
```bash
cd bank1/frontend
vercel --prod
```
Environment Variables:
```
NEXT_PUBLIC_BANK1_API=https://bank1-api-xxx.railway.app
```

### Bank 2 Dashboard
```bash
cd bank2/frontend
vercel --prod
```
Environment Variables:
```
NEXT_PUBLIC_BANK2_API=https://bank2-api-xxx.railway.app
```

### Shopping Store
```bash
cd shopping-app/frontend
vercel --prod
```
Environment Variables:
```
NEXT_PUBLIC_SHOPPING_API=https://shopping-api-xxx.railway.app
```

---

## Step 4: Update CORS Settings

Update each backend's CORS to allow your Vercel domains:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-payment-ai.vercel.app",
        "https://your-bank1.vercel.app",
        "https://your-bank2.vercel.app",
        "https://your-shopping.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Final URLs

After deployment, you'll have:
- **Payment AI**: https://payment-ai-chatbot.vercel.app
- **Bank 1**: https://bank1-dashboard.vercel.app
- **Bank 2**: https://bank2-dashboard.vercel.app
- **Shopping**: https://shopstore.vercel.app

All connected through Railway backend APIs with Neon PostgreSQL database!
