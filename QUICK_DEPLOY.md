# Quick Deployment Steps

## 1. Install Database Dependencies
```bash
pip install psycopg2-binary sqlalchemy python-dotenv
```

## 2. Setup Neon Database

1. Go to https://neon.tech
2. Create project "PaymentAI2"
3. Copy connection string
4. Run the SQL schema:
```bash
psql "your-neon-connection-string" < database_schema.sql
```

## 3. Deploy Backends to Railway

Each backend needs these environment variables:
```
DATABASE_URL=postgresql://...neon-url...
SECRET_KEY=your-secret-key-here
```

**Commands:**
```bash
# Login to Railway
railway login

# Deploy Bank 1
cd bank1
railway init
railway up

# Deploy Bank 2
cd ../bank2
railway init  
railway up

# Deploy Payment Gateway
cd ../payment-gateway
railway init
railway up

# Deploy Shopping
cd ../shopping-app/backend
railway init
railway up
```

## 4. Deploy Frontends to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy Payment AI
cd payment-ai-frontend
vercel --prod

# Deploy Bank 1 Dashboard
cd ../bank1/frontend
vercel --prod

# Deploy Bank 2 Dashboard  
cd ../bank2/frontend
vercel --prod

# Deploy Shopping Store
cd ../shopping-app/frontend
vercel --prod
```

## 5. Update Environment Variables

After deployment, update all `.env` files with production URLs:

**Payment AI Frontend:**
```
NEXT_PUBLIC_BANK1_API=https://bank1-api.railway.app
NEXT_PUBLIC_BANK2_API=https://bank2-api.railway.app
NEXT_PUBLIC_PAYMENT_GATEWAY_API=https://payment-gateway.railway.app
NEXT_PUBLIC_SHOPPING_API=https://shopping-api.railway.app
GROQ_API_KEY=gsk_...
```

**Bank Frontends:**
```
NEXT_PUBLIC_BANK1_API=https://bank1-api.railway.app
NEXT_PUBLIC_BANK2_API=https://bank2-api.railway.app
```

## Benefits of This Setup

✅ **Persistent Data**: Neon PostgreSQL keeps all data even after restarts
✅ **Fixed Account Numbers**: alice, bob, charlie, diana always have same accounts
✅ **Transaction History**: Every payment is logged
✅ **Scalable**: Railway auto-scales backends
✅ **Fast**: Vercel edge network for frontends
✅ **Free Tier**: Neon, Railway, Vercel all have free tiers

## Current System State

Your local system uses in-memory data. To switch to PostgreSQL:

1. Update `requirements.txt` with database dependencies
2. Use `main_postgres.py` instead of `main.py`
3. Set `DATABASE_URL` environment variable
4. Run migrations

Want me to help you deploy right now?
