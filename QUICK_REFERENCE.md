# 🚀 PaymentAI2 - Quick Reference Card

## 📱 URLs

| Service | URL |
|---------|-----|
| 🤖 **Payment AI Chatbot** | http://localhost:3000 |
| 🏦 **Bank 1 Dashboard** | http://localhost:3001 |
| 🏦 **Bank 2 Dashboard** | http://localhost:3002 |
| 🛍️ **Shopping Store** | http://localhost:3003 |

## 👤 Test Accounts

| Username | Password | Bank | Balance |
|----------|----------|------|---------|
| alice | password123 | Bank 1 | $5,000 |
| bob | password123 | Bank 1 | $3,000 |
| shopstore | shopstore123 | Bank 1 | $0 (Store) |
| charlie | password123 | Bank 2 | $7,000 |
| diana | password123 | Bank 2 | $4,000 |

## 🛒 Quick Shopping Test

1. Go to http://localhost:3000
2. Login: `alice` / `password123`
3. Type: **"Find headphones under 100 dollars"**
4. Click: **"Buy Now"** on any product
5. Click: **"Confirm Payment"**
6. Check Bank 1 dashboard - balances updated!

## 🎤 Voice Commands

```
"What's my balance?"
"Find cheap headphones"
"Show me TechPro products"
"Buy wireless headphones"
"Send $50 to bob"
"Search for electronics under $200"
```

## 💰 Featured Products

### TechPro (Electronics)
- Wireless Headphones → $79.99
- Smartphone X1 → $599.99
- Laptop Pro → $1,299.99
- Smart Watch → $249.99
- Bluetooth Speaker → $49.99

### HomeStyle (Home & Kitchen)
- Coffee Maker → $89.99
- Vacuum Cleaner → $199.99
- Air Purifier → $149.99
- Blender Pro → $69.99
- Toaster Oven → $79.99
- Electric Kettle → $34.99
- Food Processor → $119.99

## 🔄 Start All Services

```powershell
.\start-all.ps1
```

## 🎨 New UI Features

✨ **Sky Morning Theme** - Beautiful purple/pink/blue gradients
🎴 **Product Cards** - Modern design with hover effects
💳 **Bank Dashboards** - Real-time balance updates
🛒 **Buy Buttons** - One-click purchasing
📱 **Responsive Design** - Works on all screen sizes
🌈 **Glassmorphism** - Frosted glass effects everywhere

## 🏪 Store Account

**ShopStore receives all product purchase payments**
- Account: `BANK194931B80`
- Bank: Bank 1
- View balance at: http://localhost:3001

## 💡 Pro Tips

- 🎤 Use voice for hands-free shopping
- 💰 Check your balance before buying
- 🔍 Use natural language: "cheap", "under $100"
- 👁️ Watch bank dashboards update in real-time
- 🛍️ Try different brands for different gradients

## 🎯 Complete Flow Example

```
1. Login as alice ($5,000)
2. Search: "Find wireless headphones"
3. Buy: TechPro Wireless Headphones ($79.99)
4. Result:
   ✓ alice balance: $4,920.01
   ✓ shopstore balance: $79.99
   ✓ Transaction logged in both accounts
```

---

**Need help?** Check `UPDATED_FEATURES.md` for detailed guide!
