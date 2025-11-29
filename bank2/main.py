from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
import uuid

app = FastAPI(title="Bank Server 2", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "bank2_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# In-memory database
users_db = {}
transactions_db = []

# Models
class User(BaseModel):
    user_id: str
    username: str
    email: str
    phone: str
    balance: float
    account_number: str

class UserCreate(BaseModel):
    username: str
    email: str
    phone: str
    password: str
    initial_balance: float = 1000.0

class UserLogin(BaseModel):
    username: str
    password: str

class Transaction(BaseModel):
    transaction_id: str
    from_account: str
    to_account: str
    amount: float
    timestamp: str
    status: str
    type: str

class VerifyAccountRequest(BaseModel):
    account_number: str

class AuthorizeTransferRequest(BaseModel):
    from_account: str
    amount: float
    token: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize sample users
def init_sample_data():
    sample_users = [
        {"username": "charlie", "email": "charlie@bank2.com", "phone": "2234567890", "password": "password123", "initial_balance": 7000.0},
        {"username": "diana", "email": "diana@bank2.com", "phone": "2234567891", "password": "password123", "initial_balance": 4000.0},
    ]
    for user_data in sample_users:
        user_id = str(uuid.uuid4())
        account_number = f"BANK2{str(uuid.uuid4())[:8].upper()}"
        users_db[user_data["username"]] = {
            "user_id": user_id,
            "username": user_data["username"],
            "email": user_data["email"],
            "phone": user_data["phone"],
            "password": get_password_hash(user_data["password"]),
            "balance": user_data["initial_balance"],
            "account_number": account_number
        }

init_sample_data()

# Routes
@app.get("/")
def read_root():
    return {"message": "Bank Server 2 API", "status": "running"}

@app.post("/register")
def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = str(uuid.uuid4())
    account_number = f"BANK2{str(uuid.uuid4())[:8].upper()}"
    
    users_db[user.username] = {
        "user_id": user_id,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "password": get_password_hash(user.password),
        "balance": user.initial_balance,
        "account_number": account_number
    }
    
    return {
        "message": "User registered successfully",
        "account_number": account_number,
        "user_id": user_id
    }

@app.post("/login")
def login(credentials: UserLogin):
    user = users_db.get(credentials.username)
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "account_number": user["account_number"],
            "balance": user["balance"]
        }
    }

@app.get("/account")
def get_account(username: str = Depends(verify_token)):
    user = users_db.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "email": user["email"],
        "phone": user["phone"],
        "balance": user["balance"],
        "account_number": user["account_number"]
    }

@app.post("/verify-account")
def verify_account(request: VerifyAccountRequest):
    """Verify if account exists - used by payment gateway"""
    for user in users_db.values():
        if user["account_number"] == request.account_number:
            return {
                "exists": True,
                "username": user["username"],
                "account_number": user["account_number"]
            }
    return {"exists": False}

@app.post("/authorize-transfer")
def authorize_transfer(request: AuthorizeTransferRequest):
    """Authorize transfer from sender account - used by payment gateway"""
    try:
        # Verify token
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        
        # Find user by account number
        user = None
        for u in users_db.values():
            if u["account_number"] == request.from_account:
                user = u
                break
        
        if not user:
            return {"authorized": False, "reason": "Account not found"}
        
        if user["username"] != username:
            return {"authorized": False, "reason": "Token does not match account"}
        
        if user["balance"] < request.amount:
            return {"authorized": False, "reason": "Insufficient funds"}
        
        return {"authorized": True, "current_balance": user["balance"]}
    
    except JWTError:
        return {"authorized": False, "reason": "Invalid token"}

@app.post("/debit")
def debit_account(account_number: str, amount: float, transaction_id: str):
    """Debit amount from account - called by payment gateway"""
    for user in users_db.values():
        if user["account_number"] == account_number:
            if user["balance"] >= amount:
                user["balance"] -= amount
                
                transaction = {
                    "transaction_id": transaction_id,
                    "from_account": account_number,
                    "to_account": "external",
                    "amount": amount,
                    "timestamp": datetime.utcnow().isoformat(),
                    "status": "completed",
                    "type": "debit"
                }
                transactions_db.append(transaction)
                
                return {"success": True, "new_balance": user["balance"]}
            else:
                return {"success": False, "reason": "Insufficient funds"}
    
    return {"success": False, "reason": "Account not found"}

@app.post("/credit")
def credit_account(account_number: str, amount: float, transaction_id: str):
    """Credit amount to account - called by payment gateway"""
    for user in users_db.values():
        if user["account_number"] == account_number:
            user["balance"] += amount
            
            transaction = {
                "transaction_id": transaction_id,
                "from_account": "external",
                "to_account": account_number,
                "amount": amount,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "completed",
                "type": "credit"
            }
            transactions_db.append(transaction)
            
            return {"success": True, "new_balance": user["balance"]}
    
    return {"success": False, "reason": "Account not found"}

@app.get("/transactions")
def get_transactions(username: str = Depends(verify_token)):
    """Get transaction history for user"""
    user = users_db.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    account_number = user["account_number"]
    user_transactions = [
        t for t in transactions_db 
        if t["from_account"] == account_number or t["to_account"] == account_number
    ]
    
    return {"transactions": user_transactions}

@app.get("/users")
def list_users():
    """List all users (for demo purposes)"""
    return {
        "users": [
            {
                "username": u["username"],
                "account_number": u["account_number"],
                "balance": u["balance"]
            }
            for u in users_db.values()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
