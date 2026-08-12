-- Military Asset Management System
-- Database Schema

-- 1. BASES
CREATE TABLE IF NOT EXISTS bases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (
        role IN ('ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER')
    ),
    base_id INT REFERENCES bases(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. EQUIPMENT TYPES
CREATE TABLE IF NOT EXISTS equipment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('WEAPON', 'VEHICLE', 'AMMUNITION')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PURCHASES
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(id),
    equipment_type_id INT NOT NULL REFERENCES equipment_types(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRANSFERS
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    source_base_id INT NOT NULL REFERENCES bases(id),
    destination_base_id INT NOT NULL REFERENCES bases(id),
    equipment_type_id INT NOT NULL REFERENCES equipment_types(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (
        status IN ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED')
    ),
    initiated_by INT REFERENCES users(id),
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (source_base_id <> destination_base_id)
);

-- 6. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(id),
    equipment_type_id INT NOT NULL REFERENCES equipment_types(id),
    personnel_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    assigned_by INT REFERENCES users(id),
    assignment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. EXPENDITURES
CREATE TABLE IF NOT EXISTS expenditures (
    id SERIAL PRIMARY KEY,
    base_id INT NOT NULL REFERENCES bases(id),
    equipment_type_id INT NOT NULL REFERENCES equipment_types(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    reason VARCHAR(255),
    recorded_by INT REFERENCES users(id),
    expenditure_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES

CREATE INDEX IF NOT EXISTS idx_users_base_id
ON users(base_id);

CREATE INDEX IF NOT EXISTS idx_purchases_base_id
ON purchases(base_id);

CREATE INDEX IF NOT EXISTS idx_purchases_equipment_type_id
ON purchases(equipment_type_id);

CREATE INDEX IF NOT EXISTS idx_transfers_source_base_id
ON transfers(source_base_id);

CREATE INDEX IF NOT EXISTS idx_transfers_destination_base_id
ON transfers(destination_base_id);

CREATE INDEX IF NOT EXISTS idx_transfers_equipment_type_id
ON transfers(equipment_type_id);

CREATE INDEX IF NOT EXISTS idx_assignments_base_id
ON assignments(base_id);

CREATE INDEX IF NOT EXISTS idx_expenditures_base_id
ON expenditures(base_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
ON audit_logs(created_at);