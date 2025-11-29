-- Bank Database Schema for Neon PostgreSQL

-- Users/Accounts Table
CREATE TABLE users (
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
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account VARCHAR(50),
    to_account VARCHAR(50),
    amount DECIMAL(12, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'debit', 'credit', 'transfer'
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    gateway_transaction_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_account ON users(account_number);
CREATE INDEX idx_transactions_from ON transactions(from_account);
CREATE INDEX idx_transactions_to ON transactions(to_account);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);

-- Insert sample users for Bank 1
INSERT INTO users (username, email, phone, password_hash, account_number, balance) VALUES
('alice', 'alice@bank1.com', '+1-555-0101', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1ALICE001', 5000.00),
('bob', 'bob@bank1.com', '+1-555-0102', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1BOB00001', 3000.00),
('shopstore', 'store@bank1.com', '+1-555-0199', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK1SHOPSTORE', 0.00);

-- Insert sample users for Bank 2
INSERT INTO users (username, email, phone, password_hash, account_number, balance) VALUES
('charlie', 'charlie@bank2.com', '+1-555-0201', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK2CHARLIE01', 7000.00),
('diana', 'diana@bank2.com', '+1-555-0202', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5agyWRqIK8hZy', 'BANK2DIANA001', 4000.00);
