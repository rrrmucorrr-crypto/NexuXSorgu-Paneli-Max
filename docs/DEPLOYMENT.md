# NexuXTanrı 𖤟 SorguPaneli — Dağıtım ve Kurulum Rehberi (DEPLOYMENT.md)

## 1. Gereksinimler
- Node.js 20+ LTS
- npm 10+
- MySQL 8.0+ (Opsiyonel / Standalone veya Docker üzerinden)

---

## 2. Yerel Geliştirme (Local Dev)

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Ortam değişkenlerini hazırlayın
cp .env.example .env.local

# 3. Geliştirme sunucusunu başlatın (Port 3000)
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 3. Docker ile Başlatma

```bash
# MySQL ve Next.js konteynerlerini tek komutla ayağa kaldırın:
docker-compose up -d --build
```

---

## 4. Veritabanı Kurulumu (MySQL 8)

```bash
# Şemayı ve tabloları oluşturun
mysql -u root -p nexuxtanri < database/schema.sql

# İlk seed verilerini yükleyin
mysql -u root -p nexuxtanri < database/seeds/seed.sql
```

---

## 5. Üretim Build (Production Build)

```bash
npm run build
npm run start
```
