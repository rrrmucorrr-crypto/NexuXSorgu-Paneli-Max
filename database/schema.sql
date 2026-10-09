-- =====================================================================
-- NEXUXTANRI 𖤟 SORGU PANELİ — PRODUCTION MYSQL 8 DATABASE SCHEMA
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS schema_migrations;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS mock_results;
DROP TABLE IF EXISTS query_history;
DROP TABLE IF EXISTS query_catalog;
DROP TABLE IF EXISTS query_categories;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS key_assignments;
DROP TABLE IF EXISTS access_keys;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. ROLES
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    hierarchy_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USERS
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    queries_run_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PERMISSIONS
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    permission_key VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ROLE_PERMISSIONS
CREATE TABLE role_permissions (
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SESSIONS
CREATE TABLE sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    jwt_token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_sessions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PLANS
CREATE TABLE plans (
    id VARCHAR(36) PRIMARY KEY,
    plan_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    price_try DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_days INT NULL, -- NULL = Unlimited
    query_quota INT NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ACCESS_KEYS
CREATE TABLE access_keys (
    id VARCHAR(36) PRIMARY KEY,
    key_code VARCHAR(64) NOT NULL UNIQUE,
    role_granted VARCHAR(32) NOT NULL,
    duration_days INT NULL, -- NULL = Unlimited
    query_quota INT NOT NULL DEFAULT 500,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('ACTIVE', 'EXPIRED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    INDEX idx_keys_code (key_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. KEY_ASSIGNMENTS
CREATE TABLE key_assignments (
    id VARCHAR(36) PRIMARY KEY,
    key_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ka_key FOREIGN KEY (key_id) REFERENCES access_keys (id) ON DELETE CASCADE,
    CONSTRAINT fk_ka_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP NULL,
    CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. QUERY_CATEGORIES
CREATE TABLE query_categories (
    id VARCHAR(32) PRIMARY KEY,
    category_index VARCHAR(4) NOT NULL,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT NULL,
    icon VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. QUERY_CATALOG (101 Queries)
CREATE TABLE query_catalog (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    category_id VARCHAR(32) NOT NULL,
    min_role VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    layout_type VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qc_category FOREIGN KEY (category_id) REFERENCES query_categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. QUERY_HISTORY
CREATE TABLE query_history (
    id VARCHAR(36) PRIMARY KEY,
    reference_no VARCHAR(64) NOT NULL UNIQUE,
    query_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('SUCCESS', 'EMPTY', 'ERROR') NOT NULL DEFAULT 'SUCCESS',
    execution_time_ms INT UNSIGNED NOT NULL,
    masked_inputs JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qh_query FOREIGN KEY (query_id) REFERENCES query_catalog (id) ON DELETE RESTRICT,
    CONSTRAINT fk_qh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_qh_user (user_id),
    INDEX idx_qh_ref (reference_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. MOCK_RESULTS (Snapshots)
CREATE TABLE mock_results (
    id VARCHAR(36) PRIMARY KEY,
    history_id VARCHAR(36) NOT NULL UNIQUE,
    result_json LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mr_history FOREIGN KEY (history_id) REFERENCES query_history (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. AUDIT_LOGS
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36) NULL,
    username VARCHAR(64) NOT NULL,
    user_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target_module VARCHAR(64) NOT NULL,
    status ENUM('SUCCESS', 'FAILED', 'BLOCKED') NOT NULL DEFAULT 'SUCCESS',
    ip_address VARCHAR(45) NOT NULL,
    details TEXT NOT NULL,
    INDEX idx_audit_action (action),
    INDEX idx_audit_time (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. SYSTEM_SETTINGS
CREATE TABLE system_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. NOTIFICATIONS
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL, -- NULL = Global
    title VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ALERT') NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. SUPPORT_TICKETS
CREATE TABLE support_tickets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    priority ENUM('DÜŞÜK', 'NORMAL', 'YÜKSEK', 'KRİTİK') NOT NULL DEFAULT 'NORMAL',
    status ENUM('AÇIK', 'YANITLANDI', 'ÇÖZÜLDÜ') NOT NULL DEFAULT 'AÇIK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    messages JSON NOT NULL,
    CONSTRAINT fk_st_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. SCHEMA_MIGRATIONS
CREATE TABLE schema_migrations (
    version VARCHAR(32) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
