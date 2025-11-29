# 🐳 Docker Deployment - All Services in One Container

## Complete Guide - 10 minutes

---

## Prerequisites

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

---

## Quick Start

### 1. Build and Start All Services (5 min)

```powershell
# Navigate to project directory
cd C:\Workspace\PaymentAI2

# Start all 8 services with one command
docker-compose up --build
```

**What happens:**
- Builds 8 Docker images (4 Python backends + 4 Next.js frontends)
- Starts all services simultaneously
- All ports exposed: 3000-3003 (frontends), 8000-8003 (backends)

### 2. Access Your Apps

After ~2 minutes (first build takes time), open:

- **Payment AI**: http://localhost:3000 ⭐
- **Bank 1 Dashboard**: http://localhost:3001
- **Bank 2 Dashboard**: http://localhost:3002
- **Shopping Store**: http://localhost:3003

**API Docs:**
- http://localhost:8001/docs (Bank 1)
- http://localhost:8002/docs (Bank 2)
- http://localhost:8000/docs (Gateway)
- http://localhost:8003/docs (Shopping)

### 3. Stop Services

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Deploy to Any Cloud Platform

### Option A: Deploy to Render with Docker

1. Sign up at https://render.com
2. Create **Docker** web service (not Python)
3. Connect GitHub repo
4. Render auto-detects `docker-compose.yml`
5. Add environment variables from `.env.docker`
6. Deploy!

### Option B: Deploy to Railway

1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Railway detects Docker setup
4. Add environment variables
5. Deploy!

### Option C: Deploy to DigitalOcean App Platform

1. Sign up at https://www.digitalocean.com/products/app-platform
2. Create App → GitHub repo
3. Select `docker-compose.yml`
4. Add environment variables
5. Deploy!

---

## Environment Variables

Edit `.env.docker` before deploying:

```env
DATABASE_URL=your_neon_database_url
BANK1_SECRET_KEY=change-this-secret
BANK2_SECRET_KEY=change-this-secret
GROQ_API_KEY=your-groq-api-key
```

---

## Useful Docker Commands

```powershell
# View running containers
docker ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f bank1-api

# Rebuild specific service
docker-compose up --build bank1-api

# Run in background (detached mode)
docker-compose up -d

# Restart specific service
docker-compose restart payment-ai-frontend

# Remove all containers and images
docker-compose down --rmi all
```

---

## Production Deployment Steps

### 1. Update CORS for Production

In `bank1/main_postgres.py` and `bank2/main_postgres.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.render.com",  # Your production URL
        "http://localhost:3000",  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Update Environment Variables

For production, update `.env.docker` with:
- Production database URL
- Strong secret keys
- Production API keys

### 3. Push to GitHub

```powershell
git add .
git commit -m "Add Docker configuration"
git push origin main
```

### 4. Deploy to Platform

Choose Render/Railway/DigitalOcean and follow their Docker deployment guide.

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Network          │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Bank 1   │  │ Bank 2   │           │
│  │ API:8001 │  │ API:8002 │           │
│  └──────────┘  └──────────┘           │
│       ▲              ▲                 │
│       │              │                 │
│  ┌────┴──────────────┴────┐           │
│  │   Payment Gateway:8000  │           │
│  └─────────────────────────┘           │
│       ▲                                │
│       │                                │
│  ┌────┴──────────┐                    │
│  │ Shopping:8003 │                    │
│  └───────────────┘                    │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  Payment AI Frontend:3000       │  │
│  │  Bank 1 Frontend:3001           │  │
│  │  Bank 2 Frontend:3002           │  │
│  │  Shopping Frontend:3003         │  │
│  └─────────────────────────────────┘  │
│                                         │
│  External: Neon PostgreSQL Database    │
└─────────────────────────────────────────┘
```

---

## Benefits

✅ **Single Command**: Start all 8 services with one command
✅ **Consistent**: Works on any platform (Windows/Mac/Linux)
✅ **Isolated**: Each service runs in its own container
✅ **Scalable**: Easy to add more services
✅ **Production-Ready**: Deploy to any cloud platform
✅ **Easy Rollback**: Use Docker image tags for version control

---

## Troubleshooting

**Build fails?**
```powershell
# Clean and rebuild
docker-compose down --rmi all
docker-compose up --build
```

**Port already in use?**
```powershell
# Stop conflicting processes
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
```

**Frontend can't connect to backend?**
- Check backend logs: `docker-compose logs bank1-api`
- Verify environment variables in `docker-compose.yml`

---

## 🎉 You're Done!

**Local Development:**
```powershell
docker-compose up
```

**Production Deployment:**
1. Push to GitHub
2. Connect to Render/Railway/DigitalOcean
3. Platform auto-deploys from docker-compose.yml

---

**Need help?** Check Docker logs: `docker-compose logs -f`
