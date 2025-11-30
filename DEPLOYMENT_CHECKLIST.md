# 🚀 Railway Deployment Checklist

Use this checklist to track your deployment progress. Check off each item as you complete it.

---

## 📋 Pre-Deployment

- [ ] GitHub repository is up to date (latest code pushed)
- [ ] Railway account created at https://railway.app
- [ ] Groq API key obtained from https://console.groq.com/keys
- [ ] Read RAILWAY_SETUP.md for detailed instructions
- [ ] Have notepad ready to save all URLs

---

## 🔧 Backend Deployment (Deploy First!)

### Service 1: Bank 1 API
- [ ] Created new service from GitHub repo
- [ ] Renamed to `bank1-api`
- [ ] Set Root Directory: `bank1`
- [ ] Generated domain
- [ ] Added environment variable: `SECRET_KEY=paymentai2-bank1-secret-key-xyz123`
- [ ] Deployment completed successfully
- [ ] Tested URL - shows "Bank 1 API running"
- [ ] **Saved URL:** _______________________________________________

### Service 2: Bank 2 API
- [ ] Created new service from GitHub repo
- [ ] Renamed to `bank2-api`
- [ ] Set Root Directory: `bank2`
- [ ] Generated domain
- [ ] Added environment variable: `SECRET_KEY=paymentai2-bank2-secret-key-abc456`
- [ ] Deployment completed successfully
- [ ] Tested URL - shows "Bank 2 API running"
- [ ] **Saved URL:** _______________________________________________

### Service 3: Payment Gateway
- [ ] Created new service from GitHub repo
- [ ] Renamed to `payment-gateway`
- [ ] Set Root Directory: `payment-gateway`
- [ ] Generated domain
- [ ] Added `BANK1_URL` (using Bank 1 URL from above)
- [ ] Added `BANK2_URL` (using Bank 2 URL from above)
- [ ] Deployment completed successfully
- [ ] Tested URL - shows gateway info
- [ ] **Saved URL:** _______________________________________________

### Service 4: Shopping API
- [ ] Created new service from GitHub repo
- [ ] Renamed to `shopping-api`
- [ ] Set Root Directory: `shopping-app/backend`
- [ ] Generated domain
- [ ] Added `BANK1_URL` (using Bank 1 URL)
- [ ] Deployment completed successfully
- [ ] Tested URL/products - shows product list
- [ ] **Saved URL:** _______________________________________________

---

## 🎨 Frontend Deployment (Deploy After Backends!)

### Service 5: Payment AI Frontend (Main App)
- [ ] Created new service from GitHub repo
- [ ] Renamed to `payment-ai-frontend`
- [ ] Set Root Directory: `payment-ai-frontend`
- [ ] Generated domain
- [ ] Added `GROQ_API_KEY` (your actual key)
- [ ] Added `NEXT_PUBLIC_BANK1_API` (Bank 1 URL)
- [ ] Added `NEXT_PUBLIC_BANK2_API` (Bank 2 URL)
- [ ] Added `PAYMENT_GATEWAY_URL` (Gateway URL)
- [ ] Added `SHOPPING_API_URL` (Shopping URL)
- [ ] Deployment completed successfully
- [ ] Tested URL - chatbot interface loads
- [ ] **Saved URL:** _______________________________________________

### Service 6: Bank 1 Frontend
- [ ] Created new service from GitHub repo
- [ ] Renamed to `bank1-frontend`
- [ ] Set Root Directory: `bank1/frontend`
- [ ] Generated domain
- [ ] Added `NEXT_PUBLIC_BANK_API` (Bank 1 API URL)
- [ ] Deployment completed successfully
- [ ] Tested URL - dashboard loads
- [ ] **Saved URL:** _______________________________________________

### Service 7: Bank 2 Frontend
- [ ] Created new service from GitHub repo
- [ ] Renamed to `bank2-frontend`
- [ ] Set Root Directory: `bank2/frontend`
- [ ] Generated domain
- [ ] Added `NEXT_PUBLIC_BANK_API` (Bank 2 API URL)
- [ ] Deployment completed successfully
- [ ] Tested URL - dashboard loads
- [ ] **Saved URL:** _______________________________________________

### Service 8: Shopping Frontend
- [ ] Created new service from GitHub repo
- [ ] Renamed to `shopping-frontend`
- [ ] Set Root Directory: `shopping-app/frontend`
- [ ] Generated domain
- [ ] Added `NEXT_PUBLIC_SHOPPING_API` (Shopping API URL)
- [ ] Added `NEXT_PUBLIC_BANK1_API` (Bank 1 API URL)
- [ ] Deployment completed successfully
- [ ] Tested URL - product catalog loads
- [ ] **Saved URL:** _______________________________________________

---

## ✅ System Testing

### Backend API Tests
- [ ] Bank 1 API health check: `curl https://your-bank1-url.railway.app/`
- [ ] Bank 2 API health check: `curl https://your-bank2-url.railway.app/`
- [ ] Payment Gateway health check
- [ ] Shopping API products list: `curl https://your-shopping-url.railway.app/products`

### Login Test
- [ ] Login to Bank 1 with alice/password123
- [ ] Received JWT token successfully
- [ ] Token includes user info and balance

### Payment AI Chatbot Tests
- [ ] Opened Payment AI URL
- [ ] "CONNECT BANK" button works
- [ ] Can login with alice/password123
- [ ] Balance displays correctly ($5,000)
- [ ] Voice input button appears (🎤)

### Product Search Test
- [ ] Typed "find headphones" in chat
- [ ] Product cards displayed
- [ ] Products show name, price, description
- [ ] "ACQUIRE" button appears on cards

### Purchase Test
- [ ] Clicked "ACQUIRE" on a product
- [ ] Confirmation dialog appeared
- [ ] Shows correct amount and product details
- [ ] Clicked "CONFIRM"
- [ ] Payment processed successfully
- [ ] Balance updated in interface

### Transfer Test
- [ ] Typed "send $50 to bob" in chat
- [ ] Transfer confirmation appeared
- [ ] Shows correct recipient and amount
- [ ] Confirmed transfer
- [ ] Transfer successful message
- [ ] Balance decreased by $50

### Cross-Bank Transfer Test
- [ ] Login as alice (Bank 1)
- [ ] Send money to charlie (Bank 2)
- [ ] Transfer successful
- [ ] Check both balances updated

---

## 🐛 Troubleshooting

If something doesn't work, check:

- [ ] All backend services deployed before frontends
- [ ] All URLs copied correctly (no typos)
- [ ] All URLs use HTTPS
- [ ] No trailing slashes in URLs
- [ ] Environment variable names spelled correctly
- [ ] `NEXT_PUBLIC_` prefix on frontend client variables
- [ ] Groq API key is valid
- [ ] Checked Railway logs for errors
- [ ] Services show "Active" status in Railway
- [ ] Browser console for frontend errors

---

## 📊 Final Verification

- [ ] All 8 services showing "Active" in Railway
- [ ] All services have generated domains
- [ ] Payment AI chatbot fully functional
- [ ] Can login to both banks
- [ ] Can search and buy products
- [ ] Can transfer money between users
- [ ] Can transfer money between banks
- [ ] Voice input working (Chrome/Edge)
- [ ] Mobile responsive (test on phone)

---

## 💰 Railway Plan Check

- [ ] Reviewed Railway pricing
- [ ] Monitoring resource usage
- [ ] Considered upgrading to Pro if needed ($20/month)
- [ ] Set up usage alerts

---

## 🎉 Deployment Complete!

Once all items are checked:

✅ Your PaymentAI2 system is fully deployed on Railway!
✅ Share your Payment AI Frontend URL with others
✅ Monitor logs and usage in Railway dashboard
✅ Keep your GitHub repo updated for auto-deploys

---

**Main App URL:** ________________________________________________

**Share this URL to let others use your Payment AI chatbot!**

---

## 📝 Notes Section

Use this space for your specific URLs, notes, or issues:

Bank 1 API: _________________________________________________________

Bank 2 API: _________________________________________________________

Payment Gateway: ____________________________________________________

Shopping API: _______________________________________________________

Payment AI (Main): __________________________________________________

Bank 1 Dashboard: ___________________________________________________

Bank 2 Dashboard: ___________________________________________________

Shopping Frontend: __________________________________________________

Groq API Key: _______________________________________________________

---

Issues Encountered:




Solutions Applied:




---

Deployment Date: _______________
Completed By: _______________
