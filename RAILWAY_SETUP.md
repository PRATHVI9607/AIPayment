# 🚀 Railway Deployment Guide - PaymentAI2

Complete step-by-step guide to deploy all 8 services on Railway.

## 📋 Prerequisites

1. **GitHub Repository**: Code pushed to GitHub (https://github.com/PRATHVI9607/AIPayment)
2. **Railway Account**: Sign up at https://railway.app
3. **Groq API Key**: Get free API key from https://console.groq.com

---

## 🎯 Deployment Strategy

We'll deploy **8 services** in this order:
1. Bank 1 API (Backend)
2. Bank 2 API (Backend)
3. Payment Gateway (Backend)
4. Shopping App API (Backend)
5. Payment AI Frontend
6. Bank 1 Frontend
7. Bank 2 Frontend
8. Shopping App Frontend

---

## 📦 Step-by-Step Deployment

### 🔧 STEP 1: Create New Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **"PRATHVI9607/AIPayment"** repository
5. Railway will create a project

### ⚙️ STEP 2: Deploy Bank 1 API

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select **"PRATHVI9607/AIPayment"**
3. **Configure the service:**
   - Click on the service name (top left)
   - Rename it to: `bank1-api`
4. Go to **"Settings"** tab:
   - Scroll to **"Service"** section
   - Set **Root Directory**: `bank1`
   - Click **"Generate Domain"** (under Networking)
5. Go to **"Variables"** tab:
   - Add: `SECRET_KEY` = `paymentai2-bank1-secret-key-xyz123`
6. Go to **"Deployments"** tab:
   - Wait for deployment to complete ✅
7. **Test**: Click the generated domain URL
   - You should see: `{"message":"Bank 1 API","status":"running"}`

### ⚙️ STEP 3: Deploy Bank 2 API

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `bank2-api`
3. **Settings**:
   - Root Directory: `bank2`
   - Generate Domain
4. **Variables**:
   - `SECRET_KEY` = `paymentai2-bank2-secret-key-abc456`
5. Wait for deployment ✅
6. **Test**: Visit domain → Should see: `{"message":"Bank 2 API","status":"running"}`

### ⚙️ STEP 4: Deploy Payment Gateway

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `payment-gateway`
3. **Settings**:
   - Root Directory: `payment-gateway`
   - Generate Domain
4. **Variables** (IMPORTANT - Use your actual Railway domains):
   - `BANK1_URL` = `https://bank1-api-production-XXXX.up.railway.app`
   - `BANK2_URL` = `https://bank2-api-production-XXXX.up.railway.app`
   - Replace `XXXX` with your actual Railway domain from Steps 2 & 3
5. Wait for deployment ✅
6. **Test**: Visit domain → Should see gateway API docs

### ⚙️ STEP 5: Deploy Shopping App API

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `shopping-api`
3. **Settings**:
   - Root Directory: `shopping-app/backend`
   - Generate Domain
4. **Variables**:
   - `BANK1_URL` = `https://bank1-api-production-XXXX.up.railway.app`
5. Wait for deployment ✅
6. **Test**: Visit `https://your-domain.railway.app/products` → Should see products list

---

### 🎨 STEP 6: Deploy Payment AI Frontend

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `payment-ai-frontend`
3. **Settings**:
   - Root Directory: `payment-ai-frontend`
   - Generate Domain
4. **Variables** (Use your actual Railway domains):
   - `GROQ_API_KEY` = `your_groq_api_key_here`
   - `NEXT_PUBLIC_BANK1_API` = `https://bank1-api-production-XXXX.up.railway.app`
   - `NEXT_PUBLIC_BANK2_API` = `https://bank2-api-production-XXXX.up.railway.app`
   - `PAYMENT_GATEWAY_URL` = `https://payment-gateway-production-XXXX.up.railway.app`
   - `SHOPPING_API_URL` = `https://shopping-api-production-XXXX.up.railway.app`
5. Wait for deployment ✅
6. **Test**: Visit domain → You should see the Payment AI chatbot interface

### 🎨 STEP 7: Deploy Bank 1 Frontend

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `bank1-frontend`
3. **Settings**:
   - Root Directory: `bank1/frontend`
   - Generate Domain
4. **Variables**:
   - `NEXT_PUBLIC_BANK_API` = `https://bank1-api-production-XXXX.up.railway.app`
5. Wait for deployment ✅

### 🎨 STEP 8: Deploy Bank 2 Frontend

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `bank2-frontend`
3. **Settings**:
   - Root Directory: `bank2/frontend`
   - Generate Domain
4. **Variables**:
   - `NEXT_PUBLIC_BANK_API` = `https://bank2-api-production-XXXX.up.railway.app`
5. Wait for deployment ✅

### 🎨 STEP 9: Deploy Shopping App Frontend

1. Click **"New"** → **"GitHub Repo"** → Select **"PRATHVI9607/AIPayment"**
2. Rename service to: `shopping-frontend`
3. **Settings**:
   - Root Directory: `shopping-app/frontend`
   - Generate Domain
4. **Variables**:
   - `NEXT_PUBLIC_SHOPPING_API` = `https://shopping-api-production-XXXX.up.railway.app`
   - `NEXT_PUBLIC_BANK1_API` = `https://bank1-api-production-XXXX.up.railway.app`
5. Wait for deployment ✅

---

## 🔍 Verification Checklist

After all services are deployed, test each one:

### Backend APIs:
- ✅ Bank 1 API: `https://bank1-api.railway.app/` → Shows "Bank 1 API running"
- ✅ Bank 2 API: `https://bank2-api.railway.app/` → Shows "Bank 2 API running"
- ✅ Payment Gateway: `https://payment-gateway.railway.app/` → Shows API info
- ✅ Shopping API: `https://shopping-api.railway.app/products` → Shows products

### Frontends:
- ✅ Payment AI: `https://payment-ai-frontend.railway.app/` → Chatbot loads
- ✅ Bank 1 Dashboard: `https://bank1-frontend.railway.app/` → Login page
- ✅ Bank 2 Dashboard: `https://bank2-frontend.railway.app/` → Login page
- ✅ Shopping App: `https://shopping-frontend.railway.app/` → Product catalog

---

## 🧪 Test the System

### 1. Test Login (Bank 1)
```bash
curl -X POST https://bank1-api-production-XXXX.up.railway.app/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```

Expected response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "username": "alice",
    "account_number": "BANK1ALICE001",
    "balance": 5000.0
  }
}
```

### 2. Test Product Search
```bash
curl -X POST https://shopping-api-production-XXXX.up.railway.app/products/search \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop"}'
```

### 3. Use the Payment AI Chatbot
1. Visit your Payment AI frontend URL
2. Click "CONNECT BANK"
3. Login with: `alice` / `password123`
4. Try commands:
   - "Find headphones"
   - "Send $50 to bob"
   - "Show my balance"

---

## 🔧 Common Issues & Solutions

### Issue 1: Service won't start
**Solution**: Check logs in Railway dashboard
- Go to service → Deployments tab → Click latest deployment → View logs
- Look for error messages

### Issue 2: Frontend can't connect to backend
**Solution**: Verify environment variables
- All URLs must be HTTPS (Railway provides this)
- No trailing slashes in URLs
- Variables must start with `NEXT_PUBLIC_` for client-side access

### Issue 3: CORS errors
**Solution**: Update backend CORS settings
- Backends already allow all origins for development
- For production, update CORS in each `main.py` file

### Issue 4: "Failed to fetch" errors
**Solution**: Check backend is running
- Visit backend URL directly
- Ensure it returns JSON (not 404 or error page)
- Check Railway service logs

---

## 📊 Service URLs Summary

After deployment, create a table with your actual URLs:

| Service | URL | Type |
|---------|-----|------|
| Bank 1 API | `https://bank1-api-production-XXXX.railway.app` | Backend |
| Bank 2 API | `https://bank2-api-production-XXXX.railway.app` | Backend |
| Payment Gateway | `https://payment-gateway-production-XXXX.railway.app` | Backend |
| Shopping API | `https://shopping-api-production-XXXX.railway.app` | Backend |
| Payment AI | `https://payment-ai-frontend-production-XXXX.railway.app` | Frontend |
| Bank 1 Dashboard | `https://bank1-frontend-production-XXXX.railway.app` | Frontend |
| Bank 2 Dashboard | `https://bank2-frontend-production-XXXX.railway.app` | Frontend |
| Shopping App | `https://shopping-frontend-production-XXXX.railway.app` | Frontend |

---

## 💰 Railway Pricing

- **Free Tier**: $5 worth of usage per month
- **Pro Plan**: $20/month (recommended for this project)
- Each service uses resources (CPU, Memory, Network)
- Monitor usage in Railway dashboard

---

## 🔄 Updating Your Deployment

When you make code changes:

1. Commit and push to GitHub:
   ```bash
   git add -A
   git commit -m "Your changes"
   git push origin main
   ```

2. Railway automatically redeploys when it detects changes
3. Watch deployment logs in Railway dashboard
4. Each service redeploys independently

---

## 🎯 Quick Tips

1. **Always deploy backends first** - Frontends need backend URLs
2. **Copy URLs carefully** - One typo breaks everything
3. **Check logs** - Railway logs are your best friend for debugging
4. **Use Pro plan** - Free tier may timeout with 8 services
5. **Monitor usage** - Keep an eye on Railway dashboard for resource usage

---

## 📞 Getting Help

If something doesn't work:
1. Check Railway service logs
2. Verify all environment variables are correct
3. Test backend APIs directly with curl/browser
4. Check GitHub repository is up to date
5. Ensure Groq API key is valid

---

**Ready to deploy? Start with STEP 1! 🚀**
