from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import uuid
from datetime import datetime
import os

app = FastAPI(title="Payment Gateway", version="1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bank endpoints - use environment variables for production
BANK_SERVERS = {
    "BANK1": os.getenv("BANK1_URL", "http://localhost:8001"),
    "BANK2": os.getenv("BANK2_URL", "http://localhost:8002")
}

# Transaction log
transaction_log = []

# Health check endpoint
@app.get("/")
def health_check():
    return {"status": "ok", "service": "Payment Gateway"}

# Models
class TransferRequest(BaseModel):
    from_account: str
    to_account: str
    amount: float
    token: str
    description: Optional[str] = ""

class TransferResponse(BaseModel):
    success: bool
    transaction_id: Optional[str] = None
    message: str
    details: Optional[dict] = None

# Helper functions
def identify_bank(account_number: str) -> Optional[str]:
    """Identify which bank the account belongs to"""
    if account_number.startswith("BANK1"):
        return "BANK1"
    elif account_number.startswith("BANK2"):
        return "BANK2"
    return None

async def verify_account_with_bank(bank_url: str, account_number: str) -> dict:
    """Verify account exists with the bank"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{bank_url}/verify-account",
                json={"account_number": account_number},
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            return {"exists": False, "error": str(e)}

async def authorize_with_sender_bank(bank_url: str, from_account: str, amount: float, token: str) -> dict:
    """Authorize transaction with sender's bank"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{bank_url}/authorize-transfer",
                json={
                    "from_account": from_account,
                    "amount": amount,
                    "token": token
                },
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            return {"authorized": False, "reason": str(e)}

async def debit_account(bank_url: str, account_number: str, amount: float, transaction_id: str) -> dict:
    """Debit amount from sender's account"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{bank_url}/debit",
                params={
                    "account_number": account_number,
                    "amount": amount,
                    "transaction_id": transaction_id
                },
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            return {"success": False, "reason": str(e)}

async def credit_account(bank_url: str, account_number: str, amount: float, transaction_id: str) -> dict:
    """Credit amount to receiver's account"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{bank_url}/credit",
                params={
                    "account_number": account_number,
                    "amount": amount,
                    "transaction_id": transaction_id
                },
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            return {"success": False, "reason": str(e)}

# Routes
@app.get("/")
def read_root():
    return {
        "message": "Payment Gateway API",
        "status": "running",
        "banks_connected": list(BANK_SERVERS.keys())
    }

@app.post("/transfer", response_model=TransferResponse)
async def process_transfer(request: TransferRequest):
    """
    Process a transfer between accounts (can be same or different banks)
    
    Flow:
    1. Identify sender and receiver banks
    2. Verify sender's account and token with sender's bank
    3. Verify receiver's account with receiver's bank
    4. Authorize transaction with sender's bank
    5. Debit sender's account
    6. Credit receiver's account
    7. Log transaction
    """
    
    transaction_id = str(uuid.uuid4())
    
    # Step 1: Identify banks
    sender_bank = identify_bank(request.from_account)
    receiver_bank = identify_bank(request.to_account)
    
    if not sender_bank:
        return TransferResponse(
            success=False,
            message="Sender bank not identified"
        )
    
    if not receiver_bank:
        return TransferResponse(
            success=False,
            message="Receiver bank not identified"
        )
    
    sender_bank_url = BANK_SERVERS[sender_bank]
    receiver_bank_url = BANK_SERVERS[receiver_bank]
    
    # Step 2: Verify sender account
    sender_verification = await verify_account_with_bank(sender_bank_url, request.from_account)
    if not sender_verification.get("exists"):
        return TransferResponse(
            success=False,
            message="Sender account not found"
        )
    
    # Step 3: Verify receiver account
    receiver_verification = await verify_account_with_bank(receiver_bank_url, request.to_account)
    if not receiver_verification.get("exists"):
        return TransferResponse(
            success=False,
            message="Receiver account not found"
        )
    
    # Step 4: Authorize with sender's bank
    authorization = await authorize_with_sender_bank(
        sender_bank_url,
        request.from_account,
        request.amount,
        request.token
    )
    
    if not authorization.get("authorized"):
        return TransferResponse(
            success=False,
            message=f"Transaction not authorized: {authorization.get('reason', 'Unknown error')}"
        )
    
    # Step 5: Debit sender's account
    debit_result = await debit_account(
        sender_bank_url,
        request.from_account,
        request.amount,
        transaction_id
    )
    
    if not debit_result.get("success"):
        return TransferResponse(
            success=False,
            message=f"Failed to debit sender account: {debit_result.get('reason', 'Unknown error')}"
        )
    
    # Step 6: Credit receiver's account
    credit_result = await credit_account(
        receiver_bank_url,
        request.to_account,
        request.amount,
        transaction_id
    )
    
    if not credit_result.get("success"):
        # TODO: Implement rollback mechanism in production
        return TransferResponse(
            success=False,
            message=f"Failed to credit receiver account: {credit_result.get('reason', 'Unknown error')}",
            transaction_id=transaction_id
        )
    
    # Step 7: Log transaction
    transaction_record = {
        "transaction_id": transaction_id,
        "from_account": request.from_account,
        "to_account": request.to_account,
        "amount": request.amount,
        "sender_bank": sender_bank,
        "receiver_bank": receiver_bank,
        "description": request.description,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "completed"
    }
    transaction_log.append(transaction_record)
    
    return TransferResponse(
        success=True,
        transaction_id=transaction_id,
        message="Transfer completed successfully",
        details={
            "sender_new_balance": debit_result.get("new_balance"),
            "receiver_new_balance": credit_result.get("new_balance")
        }
    )

@app.get("/transaction/{transaction_id}")
def get_transaction(transaction_id: str):
    """Get transaction details by ID"""
    for transaction in transaction_log:
        if transaction["transaction_id"] == transaction_id:
            return transaction
    
    raise HTTPException(status_code=404, detail="Transaction not found")

@app.get("/transactions")
def get_all_transactions():
    """Get all transactions (for demo purposes)"""
    return {"transactions": transaction_log}

@app.get("/health")
async def health_check():
    """Check health of payment gateway and connected banks"""
    bank_status = {}
    
    for bank_name, bank_url in BANK_SERVERS.items():
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{bank_url}/", timeout=5.0)
                bank_status[bank_name] = "connected" if response.status_code == 200 else "error"
            except:
                bank_status[bank_name] = "disconnected"
    
    return {
        "gateway": "healthy",
        "banks": bank_status
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
