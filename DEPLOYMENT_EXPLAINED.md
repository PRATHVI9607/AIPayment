# How PaymentAI2 Works When Deployed

## Current Local Setup (localhost)
```
Payment AI (3000) → localhost:8000 → Payment Gateway
                  → localhost:8001 → Bank 1 API
                  → localhost:8002 → Bank 2 API  
                  → localhost:8003 → Shopping API

Bank 1 API (8001) → In-memory data (lost on restart)
Bank 2 API (8002) → In-memory data (lost on restart)
```

## After Cloud Deployment

### 1. Backend APIs (Railway/Render)
Each API runs on its own server with a public URL:

```
Bank 1 API       → https://bank1-api-xyz.railway.app
Bank 2 API       → https://bank2-api-abc.railway.app
Payment Gateway  → https://payment-gateway-def.railway.app
Shopping API     → https://shopping-api-ghi.railway.app
```

All connected to **Neon PostgreSQL** (shared cloud database):
```
postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb
```

### 2. Frontend Apps (Vercel)
Each frontend gets its own URL:

```
Payment AI Chatbot → https://payment-ai.vercel.app
Bank 1 Dashboard   → https://bank1-dashboard.vercel.app
Bank 2 Dashboard   → https://bank2-dashboard.vercel.app
Shopping Store     → https://shopstore.vercel.app
```

### 3. How They Connect
Environment variables tell each service where others are:

**Payment AI Frontend (.env):**
```env
NEXT_PUBLIC_BANK1_API=https://bank1-api-xyz.railway.app
NEXT_PUBLIC_BANK2_API=https://bank2-api-abc.railway.app
NEXT_PUBLIC_PAYMENT_GATEWAY_API=https://payment-gateway-def.railway.app
NEXT_PUBLIC_SHOPPING_API=https://shopping-api-ghi.railway.app
```

**Payment Gateway Backend (.env):**
```env
BANK1_URL=https://bank1-api-xyz.railway.app
BANK2_URL=https://bank2-api-abc.railway.app
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb
```

## Communication Flow (Deployed)

```
User visits: https://payment-ai.vercel.app
      ↓
User: "Send $100 to bob"
      ↓
Frontend calls: https://payment-gateway-def.railway.app/transfer
      ↓
Gateway calls: https://bank1-api-xyz.railway.app/debit (alice)
      ↓
Bank API updates: Neon PostgreSQL database
      ↓
Gateway calls: https://bank1-api-xyz.railway.app/credit (bob)
      ↓
Response back to Frontend → User sees success!
```

## Key Benefits

✅ **No Localhost**: Everything uses public URLs
✅ **Persistent Data**: Neon PostgreSQL keeps data forever
✅ **Always Online**: Railway/Vercel servers run 24/7
✅ **Fast**: CDN edge servers worldwide
✅ **Scalable**: Auto-scales with traffic
✅ **Fixed Accounts**: alice=BANK1ALICE001 (never changes!)

## Example: User Flow After Deployment

1. **User opens**: `https://payment-ai.vercel.app`
2. **Clicks Login** → Frontend sends request to `https://bank1-api-xyz.railway.app/login`
3. **Bank API** → Queries Neon DB → Returns JWT token
4. **User types**: "Send $50 to bob"
5. **Frontend** → Sends to `https://payment-gateway-def.railway.app/transfer`
6. **Gateway** → Calls `https://bank1-api-xyz.railway.app/debit` (Alice)
7. **Gateway** → Calls `https://bank1-api-xyz.railway.app/credit` (Bob)
8. **Both calls** → Update Neon PostgreSQL
9. **Transaction saved** → Returns success to user

## CORS Configuration

When deployed, you need to update CORS to allow your domains:

```python
# bank1/main_postgres.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://payment-ai.vercel.app",
        "https://bank1-dashboard.vercel.app",
        "https://bank2-dashboard.vercel.app",
        "https://shopstore.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Summary

**Local**: All services talk to `localhost:PORT`
**Deployed**: All services talk to `https://service-name.platform.app`

The code logic stays the same - only the URLs in environment variables change!
