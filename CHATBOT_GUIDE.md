# Payment AI Chatbot - User Guide

## 🎯 Quick Start

Visit: **http://localhost:3000**

## 📋 Step-by-Step Tutorial

### 1. Login to Your Bank Account

Click **"Login to Bank"** in the sidebar and use these test accounts:

**Bank 1:**
- Username: `alice` | Password: `password123` | Balance: $5,000
- Username: `bob` | Password: `password123` | Balance: $3,000

**Bank 2:**
- Username: `charlie` | Password: `password123` | Balance: $7,000
- Username: `diana` | Password: `password123` | Balance: $4,000

### 2. Use Voice or Text Commands

**Option A - Voice Input:**
1. Click the 🎤 microphone button
2. Speak your command clearly
3. The AI will process and respond

**Option B - Text Input:**
1. Type your message in the input box
2. Press Enter or click "Send"

### 3. Example Commands

#### 💸 Send Money
```
"Send $50 to BANK2XXXXXXXX"
"Transfer 100 dollars to account BANK1YYYYYYYY"
"I want to send money to bob"
```

**Note:** You need the full account number (shown after login). Example:
- Get charlie's account: Login as charlie to see his account number
- Then login as alice and say: "Send $50 to [charlie's account number]"

#### 🛍️ Search Products
```
"Find headphones"
"Show me TechPro products"
"Search for laptops under $1000"
"What home appliances do you have?"
"Find the cheapest smartphone"
```

#### 💰 Check Balance
```
"What's my balance?"
"How much money do I have?"
"Show my account details"
```

### 4. Complete a Transfer

When you request a transfer, the AI will:

1. **Extract Information**
   - Recipient account number
   - Transfer amount

2. **Show Confirmation Dialog**
   - Review the details
   - Click ✓ **Confirm** or ✗ **Cancel**

3. **Process Transaction**
   - Payment Gateway authorizes with your bank
   - Money is transferred
   - Your balance updates automatically

## 🎤 Voice Recognition Tips

- **Supported Browsers:** Chrome, Edge (built-in Web Speech API)
- **Speak clearly** and at normal pace
- **Background noise:** Use in quiet environment for best results
- **Permissions:** Allow microphone access when prompted

## 💡 Pro Tips

### Getting Account Numbers

To send money to someone, you need their account number:

1. **View All Users:**
   - Bank 1: http://localhost:8001/users
   - Bank 2: http://localhost:8002/users

2. **Or Login as That User:**
   - Login to see the account number in the sidebar

### Smart Product Search

The AI understands:
- **Brand names:** "TechPro" or "HomeStyle"
- **Categories:** "electronics", "home appliances", "kitchen"
- **Price ranges:** "under $100", "cheap", "expensive"
- **General terms:** "headphones", "laptop", "coffee maker"

### Conversation Context

The AI remembers recent messages:
```
You: "Find headphones"
AI: [Shows TechPro Wireless Headphones - $79.99]
You: "How about cheaper options?"
AI: [Shows products under $60]
```

## 🔒 Security Features

- **JWT Token Authentication:** Login generates a secure token
- **Token Verification:** Every transfer validates your token
- **Confirmation Required:** All transfers need explicit confirmation
- **Balance Checks:** Prevents overdrafts automatically
- **Session Timeout:** Tokens expire after 30 minutes

## 🚨 Common Issues

### "Please login first"
→ Click "Login to Bank" and enter credentials

### "Transfer failed: Invalid token"
→ Your session expired. Logout and login again

### "Sender account not found"
→ Your token doesn't match the account (re-login to correct bank)

### "Receiver account not found"
→ Double-check the recipient account number format (BANK1XXXXXXXX or BANK2XXXXXXXX)

### Voice not working
→ Use Chrome or Edge browser
→ Grant microphone permissions
→ Check microphone is working (test in system settings)

## 📊 Transaction Flow

```
1. User Command
   ↓
2. Voice → Text (if using microphone)
   ↓
3. Groq AI (Llama 3.1) - Intent Analysis
   ↓
4. Action Routing:
   - Transfer → Show confirmation → Payment Gateway → Banks
   - Search → Shopping API → Display results
   - Balance → Show user context
   ↓
5. Response to User
```

## 🎨 UI Features

- **Sidebar:** Login status, balance, logout
- **Chat Area:** Conversation history with AI
- **Product Cards:** Inline display of search results
- **Confirmation Dialog:** Yellow box for transfer approval
- **Color Coding:**
  - Blue bubbles: Your messages
  - White bubbles: AI responses
  - Gray bubbles: System messages

## 🧪 Testing Scenarios

### Scenario 1: Send Money Within Same Bank
1. Login as `alice` (Bank 1)
2. Get bob's account number from http://localhost:8001/users
3. Say: "Send $100 to [bob's account]"
4. Confirm transfer
5. Check both balances updated

### Scenario 2: Cross-Bank Transfer
1. Login as `alice` (Bank 1)
2. Get charlie's account from http://localhost:8002/users
3. Say: "Transfer $50 to [charlie's account]"
4. Confirm and verify

### Scenario 3: Shopping Search
1. Say: "Find cheap headphones"
2. AI shows TechPro products
3. Say: "What about home appliances?"
4. AI switches to HomeStyle products

### Scenario 4: Multi-step Conversation
1. "What's my balance?"
2. "Search for products under $100"
3. "Send $50 to bob"
4. "What's my new balance?"

## 📞 Support

For API documentation:
- Bank 1: http://localhost:8001/docs
- Bank 2: http://localhost:8002/docs
- Payment Gateway: http://localhost:8000/docs
- Shopping: http://localhost:8003/docs

---

**Enjoy your AI-powered payment assistant! 🚀**
