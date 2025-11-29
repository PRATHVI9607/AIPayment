# 🚀 Deploy PaymentAI2 to Render

## Complete Deployment Guide - 30 minutes

---

## Step 1: Sign Up for Render (2 min)

1. Go to https://render.com
2. Click "Get Started" → Sign up with GitHub
3. Authorize Render to access your repositories

---

## Step 2: Deploy Backend APIs (15 min)

### 2.1 Deploy Bank 1 API

1. Click "New +" → "Web Service"
2. Connect repository: `PRATHVI9607/AIPayment`
3. Configure:
   - **Name**: `bank1-api`
   - **Root Directory**: `bank1`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main_postgres.py`
4. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   SECRET_KEY=bank1-secret-key-xyz
   ```
5. Select **Free** instance type
6. Click "Create Web Service"
7. **Copy the URL**: `https://bank1-api-xxxx.onrender.com`

### 2.2 Deploy Bank 2 API

1. New Web Service → `PRATHVI9607/AIPayment`
2. Configure:
   - **Name**: `bank2-api`
   - **Root Directory**: `bank2`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main_postgres.py`
3. Environment Variables: (same as Bank 1)
4. Create → **Copy URL**

### 2.3 Deploy Payment Gateway

1. New Web Service
2. Configure:
   - **Name**: `payment-gateway`
   - **Root Directory**: `payment-gateway`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
3. Environment Variables:
   ```
   BANK1_URL=https://bank1-api-xxxx.onrender.com
   BANK2_URL=https://bank2-api-yyyy.onrender.com
   ```
4. Create → **Copy URL**

### 2.4 Deploy Shopping API

1. New Web Service
2. Configure:
   - **Name**: `shopping-api`
   - **Root Directory**: `shopping-app/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
3. Environment Variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Create → **Copy URL**

---

## Step 3: Create requirements.txt Files (5 min)

Each backend needs its own `requirements.txt`:

**For bank1/requirements.txt and bank2/requirements.txt:**
```
fastapi==0.104.1
uvicorn==0.24.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

**For payment-gateway/requirements.txt:**
```
fastapi==0.104.1
uvicorn==0.24.0
httpx==0.25.1
```

**For shopping-app/backend/requirements.txt:**
```
fastapi==0.104.1
uvicorn==0.24.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

Push these files to GitHub:
```powershell
git add .
git commit -m "Add requirements.txt for Render deployment"
git push origin main
```

---

## Step 4: Deploy Frontend Apps (10 min)

### 4.1 Deploy Payment AI Chatbot

1. Click "New +" → "Static Site"
2. Connect: `PRATHVI9607/AIPayment`
3. Configure:
   - **Name**: `payment-ai-chatbot`
   - **Root Directory**: `payment-ai-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`
4. Environment Variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_BANK1_API=https://bank1-api-xxxx.onrender.com
   NEXT_PUBLIC_BANK2_API=https://bank2-api-yyyy.onrender.com
   NEXT_PUBLIC_PAYMENT_GATEWAY_API=https://payment-gateway-xxxx.onrender.com
   NEXT_PUBLIC_SHOPPING_API=https://shopping-api-xxxx.onrender.com
   ```
5. Create → **Copy URL**

### 4.2 Deploy Bank 1 Dashboard

1. New Static Site
2. Configure:
   - **Name**: `bank1-dashboard`
   - **Root Directory**: `bank1/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`
3. Environment Variables:
   ```
   NEXT_PUBLIC_BANK1_API=https://bank1-api-xxxx.onrender.com
   ```
4. Create → **Copy URL**

### 4.3 Deploy Bank 2 Dashboard

1. New Static Site
2. Configure:
   - **Name**: `bank2-dashboard`
   - **Root Directory**: `bank2/frontend`
3. Environment Variables:
   ```
   NEXT_PUBLIC_BANK2_API=https://bank2-api-yyyy.onrender.com
   ```
4. Create → **Copy URL**

### 4.4 Deploy Shopping Store

1. New Static Site
2. Configure:
   - **Name**: `shopping-store`
   - **Root Directory**: `shopping-app/frontend`
3. Environment Variables:
   ```
   NEXT_PUBLIC_SHOPPING_API=https://shopping-api-xxxx.onrender.com
   ```
4. Create → **Copy URL**

---

## Step 5: Update CORS (IMPORTANT!)

Update backend CORS to allow your Render domains:

**In bank1/main_postgres.py, bank2/main_postgres.py:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://payment-ai-chatbot.onrender.com",
        "https://bank1-dashboard.onrender.com",
        "https://bank2-dashboard.onrender.com",
        "https://shopping-store.onrender.com",
        "*"  # Remove after testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push changes:
```powershell
git add .
git commit -m "Update CORS for Render domains"
git push origin main
```

Render will auto-deploy the updates!

---

## 🎉 Done! Your Live URLs

**Main App**: https://payment-ai-chatbot.onrender.com
- Login: alice/password123
- Account: BANK1ALICE001
- Try: "Send $100 to bob"

**Dashboards**:
- Bank 1: https://bank1-dashboard.onrender.com
- Bank 2: https://bank2-dashboard.onrender.com
- Shopping: https://shopping-store.onrender.com

**API Docs**:
- Bank 1: https://bank1-api-xxxx.onrender.com/docs
- Bank 2: https://bank2-api-yyyy.onrender.com/docs
- Gateway: https://payment-gateway-xxxx.onrender.com/docs
- Shopping: https://shopping-api-xxxx.onrender.com/docs

---

## 💡 Important Notes

1. **Free Tier Limits**:
   - Services spin down after 15 min inactivity
   - First request takes ~30 seconds (cold start)
   - 750 hours/month free (enough for all services)

2. **Database**: Already using Neon (separate service), so no database setup needed!

3. **Automatic Deploys**: Push to GitHub → Render auto-deploys

4. **Logs**: Check each service's "Logs" tab for errors

5. **Custom Domains**: Can add later in service settings

---

Ready to deploy? Start with Step 1! 🚀
