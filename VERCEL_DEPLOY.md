# 🚀 Deploy to Vercel - Complete Guide

## ⚠️ Important: Vercel Limitations

Vercel is designed for **serverless functions**, not long-running servers. Here's what works:

✅ **Can Deploy:**
- All 4 Next.js frontends (perfect for Vercel)
- Python backends as **serverless functions** (with limitations)

❌ **Limitations:**
- 10-second timeout per function
- No WebSocket support
- Cold starts (~1-2 seconds)
- No persistent connections

---

## 📋 Architecture for Vercel

**Best Approach: Hybrid Deployment**

1. **Frontends on Vercel** (4 apps) ✅
2. **Backends on Render/Railway** (4 APIs) ✅

**Why?**
- Frontends: Vercel is perfect (fast, free, CDN)
- Backends: Need persistent connections for database → Better on Render/Railway

---

## Option 1: Frontends Only on Vercel (RECOMMENDED)

### Step 1: Deploy Payment AI Chatbot

```bash
cd payment-ai-frontend
vercel
```

**Configure:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
```
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_BANK1_API=https://bank1-api.onrender.com
NEXT_PUBLIC_BANK2_API=https://bank2-api.onrender.com
NEXT_PUBLIC_PAYMENT_GATEWAY_API=https://payment-gateway.onrender.com
NEXT_PUBLIC_SHOPPING_API=https://shopping-api.onrender.com
```

### Step 2: Deploy Bank 1 Dashboard

```bash
cd bank1/frontend
vercel
```

**Environment Variables:**
```
NEXT_PUBLIC_BANK1_API=https://bank1-api.onrender.com
```

### Step 3: Deploy Bank 2 Dashboard

```bash
cd bank2/frontend
vercel
```

**Environment Variables:**
```
NEXT_PUBLIC_BANK2_API=https://bank2-api.onrender.com
```

### Step 4: Deploy Shopping Store

```bash
cd shopping-app/frontend
vercel
```

**Environment Variables:**
```
NEXT_PUBLIC_SHOPPING_API=https://shopping-api.onrender.com
```

### Step 5: Deploy Backends to Render

Use the `RENDER_DEPLOY.md` guide for deploying backends.

---

## Option 2: Everything on Vercel (NOT RECOMMENDED)

If you insist on deploying backends to Vercel, here's how:

### Create vercel.json for each backend:

**bank1/vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main_postgres.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main_postgres.py"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "SECRET_KEY": "@secret_key"
  }
}
```

**Modify main_postgres.py for Vercel:**
```python
# Add at the end of file
from mangum import Mangum
handler = Mangum(app)
```

**Install dependencies:**
```bash
pip install mangum
```

**Repeat for all backends.**

⚠️ **Problems with this approach:**
- 10-second timeout (may fail for slow transactions)
- Cold starts (first request slow)
- No persistent database connections
- Expensive if you exceed free tier

---

## ✅ RECOMMENDED SETUP

**For best performance and reliability:**

| Service | Platform | Why |
|---------|----------|-----|
| Payment AI Frontend | Vercel | Fast CDN, perfect for Next.js |
| Bank 1 Frontend | Vercel | Same |
| Bank 2 Frontend | Vercel | Same |
| Shopping Frontend | Vercel | Same |
| Bank 1 API | Render | Database connections, no timeout |
| Bank 2 API | Render | Same |
| Payment Gateway | Render | Same |
| Shopping API | Render | Same |
| Database | Neon | Already set up ✅ |

**Cost:** $0 (all free tiers)
**Performance:** Excellent
**Reliability:** High

---

## 🚀 Quick Deploy (Recommended Setup)

### 1. Deploy Frontends to Vercel (5 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy each frontend
cd payment-ai-frontend && vercel --prod
cd ../bank1/frontend && vercel --prod
cd ../bank2/frontend && vercel --prod
cd ../shopping-app/frontend && vercel --prod
```

### 2. Deploy Backends to Render (15 min)

Follow the `RENDER_DEPLOY.md` guide.

### 3. Update Frontend Environment Variables

In Vercel dashboard, update each frontend with the Render backend URLs.

---

## 💡 Why Not All-in-One on Vercel?

**Vercel is optimized for:**
- Static sites
- Serverless functions (short-lived)
- Edge computing

**Not optimized for:**
- Long-running servers
- WebSocket connections
- Persistent database connections
- Background jobs

**FastAPI/Python backends need:**
- Persistent connections to PostgreSQL
- Longer execution times
- Always-on availability

**That's why Render/Railway is better for backends!**

---

## 📊 Cost Comparison

| Setup | Cost | Performance | Reliability |
|-------|------|-------------|-------------|
| All Vercel | $0-$20/mo | ⭐⭐ | ⭐⭐ |
| Frontends Vercel + Backends Render | $0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| All Render | $0 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Docker on DigitalOcean | $5/mo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 My Recommendation

**Use the Hybrid Approach:**
1. Deploy frontends to Vercel (instant, free, CDN)
2. Deploy backends to Render (free, persistent, reliable)
3. Use Neon for PostgreSQL (free, managed)

**Why?**
- ✅ Best performance
- ✅ $0 cost
- ✅ No timeout issues
- ✅ Easy to maintain
- ✅ Professional setup

---

## Next Steps

1. Read `RENDER_DEPLOY.md` for backend deployment
2. Deploy frontends to Vercel using commands above
3. Update CORS in backends with Vercel URLs
4. Test everything!

**Need help?** Follow the recommended hybrid approach for best results.
