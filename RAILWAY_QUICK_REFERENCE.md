# Railway Deployment - Quick Reference Card

## 🎯 Service Configuration

| Service | Root Directory | Environment Variables |
|---------|----------------|----------------------|
| **bank1-api** | `bank1` | `SECRET_KEY` |
| **bank2-api** | `bank2` | `SECRET_KEY` |
| **payment-gateway** | `payment-gateway` | `BANK1_URL`, `BANK2_URL` |
| **shopping-api** | `shopping-app/backend` | `BANK1_URL` |
| **payment-ai-frontend** | `payment-ai-frontend` | `GROQ_API_KEY`, `NEXT_PUBLIC_BANK1_API`, `NEXT_PUBLIC_BANK2_API`, `PAYMENT_GATEWAY_URL`, `SHOPPING_API_URL` |
| **bank1-frontend** | `bank1/frontend` | `NEXT_PUBLIC_BANK_API` |
| **bank2-frontend** | `bank2/frontend` | `NEXT_PUBLIC_BANK_API` |
| **shopping-frontend** | `shopping-app/frontend` | `NEXT_PUBLIC_SHOPPING_API`, `NEXT_PUBLIC_BANK1_API` |

---

## 🔑 Environment Variables Template

### Bank 1 API
```
SECRET_KEY=paymentai2-bank1-secret-key-xyz123
```

### Bank 2 API
```
SECRET_KEY=paymentai2-bank2-secret-key-abc456
```

### Payment Gateway
```
BANK1_URL=https://bank1-api-production-XXXX.up.railway.app
BANK2_URL=https://bank2-api-production-XXXX.up.railway.app
```

### Shopping API
```
BANK1_URL=https://bank1-api-production-XXXX.up.railway.app
```

### Payment AI Frontend
```
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
NEXT_PUBLIC_BANK1_API=https://bank1-api-production-XXXX.up.railway.app
NEXT_PUBLIC_BANK2_API=https://bank2-api-production-XXXX.up.railway.app
PAYMENT_GATEWAY_URL=https://payment-gateway-production-XXXX.up.railway.app
SHOPPING_API_URL=https://shopping-api-production-XXXX.up.railway.app
```

### Bank 1 Frontend
```
NEXT_PUBLIC_BANK_API=https://bank1-api-production-XXXX.up.railway.app
```

### Bank 2 Frontend
```
NEXT_PUBLIC_BANK_API=https://bank2-api-production-XXXX.up.railway.app
```

### Shopping Frontend
```
NEXT_PUBLIC_SHOPPING_API=https://shopping-api-production-XXXX.up.railway.app
NEXT_PUBLIC_BANK1_API=https://bank1-api-production-XXXX.up.railway.app
```

---

## 🧪 Test Accounts

### Bank 1
- **alice** / password123 ($5,000)
- **bob** / password123 ($3,000)
- **shopstore** / password123 ($0)

### Bank 2
- **charlie** / password123 ($7,000)
- **diana** / password123 ($4,000)

---

## 🔍 Quick Tests

### Test Bank 1 API
```bash
curl https://bank1-api-production-XXXX.up.railway.app/
```

### Test Login
```bash
curl -X POST https://bank1-api-production-XXXX.up.railway.app/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

### Test Products
```bash
curl https://shopping-api-production-XXXX.up.railway.app/products
```

---

## 📋 Deployment Checklist

- [ ] Deploy Bank 1 API → Copy URL
- [ ] Deploy Bank 2 API → Copy URL
- [ ] Deploy Payment Gateway (needs Bank URLs)
- [ ] Deploy Shopping API (needs Bank 1 URL)
- [ ] Get Groq API key from https://console.groq.com
- [ ] Deploy Payment AI Frontend (needs all backend URLs + Groq key)
- [ ] Deploy Bank 1 Frontend (needs Bank 1 API URL)
- [ ] Deploy Bank 2 Frontend (needs Bank 2 API URL)
- [ ] Deploy Shopping Frontend (needs Shopping API + Bank 1 URLs)
- [ ] Test all services
- [ ] Test login and transfers
- [ ] Test product search and purchase

---

## 🚨 Common Mistakes

1. ❌ Forgetting to set Root Directory
2. ❌ Typos in environment variable names
3. ❌ Using HTTP instead of HTTPS for URLs
4. ❌ Adding trailing slashes to URLs
5. ❌ Not waiting for backend to deploy before deploying frontend
6. ❌ Missing `NEXT_PUBLIC_` prefix for client-side variables

---

## 💡 Pro Tips

- Deploy in order: All backends first, then frontends
- Copy each URL immediately after deployment
- Use Railway's "Generate Domain" feature
- Check logs if service fails to start
- All services restart automatically on git push
- Monitor resource usage in Railway dashboard
