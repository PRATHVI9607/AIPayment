# 🚂 Railway Deployment - One Click Deploy

## Easiest Way to Deploy All 8 Services - 10 minutes

---

## Step 1: Sign Up (1 min)

1. Go to https://railway.app
2. Click "Login" → **Sign in with GitHub**
3. Authorize Railway

---

## Step 2: Deploy Everything with One Click (5 min)

### Option A: Deploy from GitHub (Recommended)

1. In Railway Dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `PRATHVI9607/AIPayment`
4. Railway **auto-detects docker-compose.yml**
5. Click **"Deploy"**

✅ **That's it!** Railway automatically:
- Reads your `docker-compose.yml`
- Creates all 8 services
- Builds Docker containers
- Assigns URLs to each service
- Manages networking between services

### Option B: Railway CLI (Alternative)

```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy from current directory
cd C:\Workspace\PaymentAI2
railway up
```

---

## Step 3: Add Environment Variables (3 min)

After deployment, click each service and add variables:

### Bank 1 API
```
DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=bank1-secret-key
```

### Bank 2 API
```
DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=bank2-secret-key
```

### Payment Gateway
```
BANK1_URL=${{bank1-api.RAILWAY_PUBLIC_DOMAIN}}
BANK2_URL=${{bank2-api.RAILWAY_PUBLIC_DOMAIN}}
```
*Railway auto-fills these references!*

### Shopping API
```
DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Payment AI Frontend
```
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_BANK1_API=${{bank1-api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_BANK2_API=${{bank2-api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_PAYMENT_GATEWAY_API=${{payment-gateway.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_SHOPPING_API=${{shopping-api.RAILWAY_PUBLIC_DOMAIN}}
```

### Bank 1 Frontend
```
NEXT_PUBLIC_BANK1_API=${{bank1-api.RAILWAY_PUBLIC_DOMAIN}}
```

### Bank 2 Frontend
```
NEXT_PUBLIC_BANK2_API=${{bank2-api.RAILWAY_PUBLIC_DOMAIN}}
```

### Shopping Frontend
```
NEXT_PUBLIC_SHOPPING_API=${{shopping-api.RAILWAY_PUBLIC_DOMAIN}}
```

---

## Step 4: Get Your URLs (1 min)

Click each service → **"Settings"** → **"Generate Domain"**

Your live URLs:
- 🤖 Payment AI: `https://payment-ai-frontend-production.up.railway.app`
- 🏦 Bank 1: `https://bank1-frontend-production.up.railway.app`
- 🏦 Bank 2: `https://bank2-frontend-production.up.railway.app`
- 🛍️ Shopping: `https://shopping-frontend-production.up.railway.app`

---

## Why Railway is Better

✅ **Auto-detects docker-compose.yml** - No manual setup
✅ **Service references** - Uses `${{service.VARIABLE}}` syntax
✅ **Private networking** - Services talk internally (no external URLs needed)
✅ **Zero config** - Works out of the box
✅ **Free $5/month** - Enough for all 8 services
✅ **Auto-deploy** - Push to GitHub → Auto redeploy
✅ **Built-in monitoring** - Logs, metrics, resource usage
✅ **One dashboard** - All 8 services in one project

---

## Pricing

**Free Tier:**
- $5 credit/month (resets monthly)
- ~500 hours/month of execution time
- Plenty for all 8 services (low traffic)

**If you exceed:**
- $0.000231/GB-hour (RAM)
- $0.000463/vCPU-hour (CPU)
- ~$10-20/month for production use

---

## Update CORS After Deployment

Once you have your Railway URLs, update CORS:

**In bank1/main_postgres.py and bank2/main_postgres.py:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://payment-ai-frontend-production.up.railway.app",
        "https://bank1-frontend-production.up.railway.app",
        "https://bank2-frontend-production.up.railway.app",
        "https://shopping-frontend-production.up.railway.app",
        "*"  # Remove after testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push to GitHub → Railway auto-redeploys!

---

## Troubleshooting

**Build failing?**
- Check logs in Railway dashboard
- Verify Dockerfile paths in docker-compose.yml

**Services can't connect?**
- Use Railway's service references: `${{service-name.RAILWAY_PRIVATE_DOMAIN}}`
- Or use public domains

**Out of credit?**
- Add payment method in Railway settings
- Or optimize resource usage

---

## 🎉 You're Live!

**Test your deployment:**
1. Open Payment AI: `https://payment-ai-frontend-production.up.railway.app`
2. Login: `alice` / `password123`
3. Try: "Send $100 to bob"

**All 8 services running on Railway!** 🚂

---

## Commands Reference

```powershell
# Deploy
railway up

# View logs
railway logs

# Link to project
railway link

# Open in browser
railway open

# Restart service
railway restart

# Check status
railway status
```

---

**Need help?** Railway has excellent docs: https://docs.railway.app
