# PaymentAI - Multi-Bank Payment System

AI-powered payment system with chatbot interface supporting transactions between multiple banks.

## Architecture

- **8 Services**: 4 backends (FastAPI) + 4 frontends (Next.js)
- **Database**: PostgreSQL (Neon)
- **Deployment**: Railway
- **AI**: GROQ API

## Services Structure

### Backend APIs (Python/FastAPI)
1. **bank1**  Root: `bank1`  Port 8001
2. **bank2**  Root: `bank2`  Port 8002  
3. **payment-gateway**  Root: `payment-gateway`  Port 8000
4. **shopping-app/backend**  Root: `shopping-app/backend`  Port 8003

### Frontend Apps (Next.js)
5. **bank1/frontend**  Root: `bank1/frontend`  Port 3000
6. **bank2/frontend**  Root: `bank2/frontend`  Port 3001
7. **payment-ai-frontend**  Root: `payment-ai-frontend`  Port 3002
8. **shopping-app/frontend**  Root: `shopping-app/frontend`  Port 3003

## Railway Deployment

### Service Configuration (Set in Railway Dashboard)

For each service, configure **Settings > Root Directory**:

| Service Name | Root Directory | Dockerfile Path |
|-------------|----------------|-----------------|
| bank1-api | `bank1` | `Dockerfile` |
| bank2-api | `bank2` | `Dockerfile` |
| payment-gateway | `payment-gateway` | `Dockerfile` |
| shopping-api | `shopping-app/backend` | `Dockerfile` |
| bank1-frontend | `bank1/frontend` | `Dockerfile` |
| bank2-frontend | `bank2/frontend` | `Dockerfile` |
| payment-ai-frontend | `payment-ai-frontend` | `Dockerfile` |
| shopping-frontend | `shopping-app/frontend` | `Dockerfile` |

### Environment Variables

**bank1-api & bank2-api:**
```
DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-a-hyn166k-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=your-secret-key-here
```

**payment-gateway:**
```
BANK1_URL=https://bank1-api-production-2e7a.up.railway.app
BANK2_URL=https://bank2-api-production-a3a6.up.railway.app
```

**shopping-api:**
```
DATABASE_URL=postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-a-hyn166k-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**All Frontends:**
```
NEXT_PUBLIC_API_URL=<respective-backend-url>
```

## Local Development

```powershell
# Start all services
.\start-all.ps1

# Or individually with Docker
docker-compose up
```

## Database Setup

```powershell
python setup_database.py
```

## Repository
- GitHub: PRATHVI9607/AIPayment
- Branch: main
