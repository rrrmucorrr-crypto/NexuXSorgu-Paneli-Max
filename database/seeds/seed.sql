-- =====================================================================
-- NEXUXTANRI 𖤟 SORGU PANELİ — SEED DATA (INITIAL SETUP)
-- =====================================================================

-- ROLES
INSERT INTO roles (id, name, description, hierarchy_level) VALUES
('r-free', 'FREE', 'Giriş seviyesi demo erişimi', 1),
('r-prem', 'PREMIUM', 'Genişletilmiş demo sorgulama erişimi', 2),
('r-vip', 'VIP', 'İleri seviye kütük ve soy ağacı erişimi', 3),
('r-ultra', 'ULTRA', '101 sorgunun tamamına sınırsız erişim', 4),
('r-yonetici', 'YONETICI', 'Lisans, anahtar ve yetki yönetimi', 5),
('r-admin', 'ADMIN', 'Tam sistem kontrolü ve denetim log erişimi', 6);

-- PLANS
INSERT INTO plans (id, plan_code, name, price_try, duration_days, query_quota) VALUES
('p-free', 'PLAN_FREE', 'Free Başlangıç', 0.00, NULL, 50),
('p-prem', 'PLAN_PREMIUM', 'Premium Genişletilmiş', 499.00, 30, 500),
('p-vip', 'PLAN_VIP', 'VIP İleri Düzey', 999.00, 30, 2500),
('p-ultra', 'PLAN_ULTRA', 'Ultra Sınırsız', 1999.00, NULL, 50000);

-- USERS (Admin user default password hash: bcrypt cost 12 simulation)
INSERT INTO users (id, username, email, password_hash, role_id, status, queries_run_count) VALUES
('usr-admin-01', 'TanrıAdmin', 'admin@nexuxtanri.cyber', '$2a$12$e8Y4JgKqG1tQ4B4kYv6Mee6J6v0M.vV3LqW4vH7c6J3l0r.7k9sOm', 'r-admin', 'ACTIVE', 42),
('usr-vip-04', 'VipSorguUzmanı', 'vip@nexuxtanri.cyber', '$2a$12$K8a4JgKqG1tQ4B4kYv6Mee6J6v0M.vV3LqW4vH7c6J3l0r.7k9sOm', 'r-vip', 'ACTIVE', 19),
('usr-free-06', 'FreeDeneme', 'free@nexuxtanri.cyber', '$2a$12$R9b4JgKqG1tQ4B4kYv6Mee6J6v0M.vV3LqW4vH7c6J3l0r.7k9sOm', 'r-free', 'ACTIVE', 4);

-- ACCESS KEYS
INSERT INTO access_keys (id, key_code, role_granted, duration_days, query_quota, used_count, status) VALUES
('key-01', 'NEXUX-ULTRA-9981-VIPX', 'ULTRA', NULL, 10000, 142, 'ACTIVE'),
('key-02', 'NEXUX-VIP-30D-8821', 'VIP', 30, 500, 88, 'ACTIVE'),
('key-03', 'NEXUX-PREM-7D-5501', 'PREMIUM', 7, 150, 24, 'ACTIVE');

-- SYSTEM SETTINGS
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Platform bakım modu bayrağı'),
('mock_delay_ms', '350', 'Sentetik motor simülasyon gecikmesi (ms)'),
('simulate_failure_rate', '0', 'Test amaçlı simüle hata yüzdesi (0-100)'),
('deterministic_seed', 'true', 'Deterministik girdi tohumu kuralı');

-- SCHEMA MIGRATIONS
INSERT INTO schema_migrations (version, description) VALUES
('20260308_001', 'Initial 18 tables schema setup and seed catalog');
