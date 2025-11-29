import psycopg2
import sys

DATABASE_URL = "postgresql://neondb_owner:npg_6t0DZPWdvbwe@ep-quiet-haze-ahyn166k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# SQL Schema
SCHEMA_SQL = """
-- Users/Accounts Table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account VARCHAR(50),
    to_account VARCHAR(50),
    amount DECIMAL(12, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    gateway_transaction_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_account ON users(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_account);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_account);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at DESC);

-- Insert sample users (password is 'password123' hashed with bcrypt)
-- Password hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy
INSERT INTO users (username, email, phone, password_hash, account_number, balance) VALUES
('alice', 'alice@bank1.com', '+1-555-0101', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1ALICE001', 5000.00),
('bob', 'bob@bank1.com', '+1-555-0102', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1BOB00001', 3000.00),
('shopstore', 'store@bank1.com', '+1-555-0199', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1SHOPSTORE', 0.00),
('charlie', 'charlie@bank2.com', '+1-555-0201', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK2CHARLIE01', 7000.00),
('diana', 'diana@bank2.com', '+1-555-0202', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK2DIANA001', 4000.00)
ON CONFLICT (username) DO NOTHING;
"""

try:
    print("🔌 Connecting to Neon database...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("📋 Creating tables and indexes...")
    cur.execute(SCHEMA_SQL)
    
    conn.commit()
    print("✅ Database setup complete!")
    
    # Verify users
    cur.execute("SELECT username, account_number, balance FROM users ORDER BY username")
    users = cur.fetchall()
    
    print("\n👥 Sample Users Created:")
    print("-" * 60)
    for username, account, balance in users:
        print(f"  {username:12} | {account:20} | ${balance:,.2f}")
    print("-" * 60)
    print(f"\n🎉 All {len(users)} users ready!")
    print("\n🔑 Login credentials (all users): password123")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
