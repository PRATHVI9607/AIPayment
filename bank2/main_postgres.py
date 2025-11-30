from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid

app = FastAPI(title="Bank 2 API with PostgreSQL", version="2.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/bank2_db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    print("="*60)
    print("🚀 BANK 2 API STARTING...")
    print(f"📊 DATABASE_URL configured: {bool(DATABASE_URL and DATABASE_URL != 'postgresql://user:password@localhost:5432/bank2_db')}")
    print(f"🔑 SECRET_KEY configured: {bool(SECRET_KEY != 'your-secret-key-change-in-production')}")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM users")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        print(f"✅ Database connected! Found {count} users in database")
    except Exception as e:
        print(f"❌ Database connection failed: {type(e).__name__}: {e}")
        print(f"⚠️ Service will run but database operations will fail")
        import traceback
        traceback.print_exc()
    print("="*60)

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# Models
class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    phone: str
    password: str

class AccountVerification(BaseModel):
    account_number: str

class TransferAuthorization(BaseModel):
    from_account: str
    amount: float
    token: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Routes
@app.get("/")
def read_root():
    return {"message": "Bank 2 API with PostgreSQL", "status": "running"}

@app.get("/users")
def get_all_users():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT username, email, phone, account_number, balance FROM users ORDER BY username")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return {"users": users}

@app.post("/register")
def register_user(user: UserRegister):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Check if username exists
    cur.execute("SELECT username FROM users WHERE username = %s", (user.username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Generate account number and hash password
    user_id = str(uuid.uuid4())
    account_number = f"bank2{uuid.uuid4().hex[:8].upper()}"
    password_hash = get_password_hash(user.password)
    
    # Insert user
    cur.execute("""
        INSERT INTO users (user_id, username, email, phone, password_hash, account_number, balance)
        VALUES (%s, %s, %s, %s, %s, %s, 0.00)
    """, (user_id, user.username, user.email, user.phone, password_hash, account_number))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        "message": "User registered successfully",
        "account_number": account_number,
        "user_id": user_id
    }

@app.post("/login")
def login(credentials: UserLogin):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT * FROM users WHERE username = %s", (credentials.username,))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "account_number": user["account_number"],
            "balance": float(user["balance"])
        }
    }

@app.post("/verify-account")
def verify_account(request: AccountVerification):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT account_number FROM users WHERE account_number = %s", (request.account_number,))
    account = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return {"exists": account is not None}

@app.post("/authorize-transfer")
def authorize_transfer(request: TransferAuthorization):
    try:
        username = verify_token(request.token)
    except:
        return {"authorized": False, "reason": "Invalid token"}
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT account_number, balance FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not user:
        return {"authorized": False, "reason": "User not found"}
    
    if user["account_number"] != request.from_account:
        return {"authorized": False, "reason": "Account mismatch"}
    
    if user["balance"] < request.amount:
        return {"authorized": False, "reason": "Insufficient funds"}
    
    return {"authorized": True}

@app.post("/debit")
def debit_account(account_number: str, amount: float, transaction_id: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Get current balance
    cur.execute("SELECT balance FROM users WHERE account_number = %s", (account_number,))
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {"success": False, "reason": "Account not found"}
    
    new_balance = float(user["balance"]) - amount
    
    # Update balance
    cur.execute("UPDATE users SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE account_number = %s", 
                (new_balance, account_number))
    
    # Record transaction
    cur.execute("""
        INSERT INTO transactions (transaction_id, from_account, amount, transaction_type, description, gateway_transaction_id)
        VALUES (gen_random_uuid(), %s, %s, 'debit', 'Outgoing transfer', %s)
    """, (account_number, amount, transaction_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {"success": True, "new_balance": new_balance}

@app.post("/credit")
def credit_account(account_number: str, amount: float, transaction_id: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Get current balance
    cur.execute("SELECT balance FROM users WHERE account_number = %s", (account_number,))
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {"success": False, "reason": "Account not found"}
    
    new_balance = float(user["balance"]) + amount
    
    # Update balance
    cur.execute("UPDATE users SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE account_number = %s", 
                (new_balance, account_number))
    
    # Record transaction
    cur.execute("""
        INSERT INTO transactions (transaction_id, to_account, amount, transaction_type, description, gateway_transaction_id)
        VALUES (gen_random_uuid(), %s, %s, 'credit', 'Incoming transfer', %s)
    """, (account_number, amount, transaction_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {"success": True, "new_balance": new_balance}

@app.get("/transactions/{account_number}")
def get_transactions(account_number: str, limit: int = 50):
    """Get transaction history for an account"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT transaction_id, from_account, to_account, amount, transaction_type, 
               description, status, created_at
        FROM transactions
        WHERE from_account = %s OR to_account = %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (account_number, account_number, limit))
    
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    
    return {"transactions": transactions, "count": len(transactions)}

@app.get("/account/{username}")
def get_account_by_username(username: str):
    """Get account details by username"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT username, account_number, balance, email, phone FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
