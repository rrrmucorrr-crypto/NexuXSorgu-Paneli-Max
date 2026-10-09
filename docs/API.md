# NexuXTanrı 𖤟 SorguPaneli — REST API Dokümantasyonu (API.md)

Tüm sorgu çağrıları ve sistem uç noktaları JSON standardında çalışır. Gerçek kişisel veri taşımaz; sentetik demo motoru ile yanıt üretir.

---

### 1. Katalog Listeleme
- **Uç Nokta:** `GET /api/queries/catalog`
- **Erişim:** Herkese Açık / FREE
- **Açıklama:** 12 kategori ve 101 sorgu kütüğünün tamamını döndürür.
- **Yanıt:**
```json
{
  "success": true,
  "brand": "NexuXTanrı 𖤟 SorguPaneli",
  "summary": {
    "totalCategories": 12,
    "totalQueries": 101,
    "isCatalogValid": true,
    "duplicateNames": []
  }
}
```

---

### 2. Sentetik Sorgu Yürütme
- **Uç Nokta:** `POST /api/queries/run`
- **Erişim:** Rol Korumalı (FREE, PREMIUM, VIP, ULTRA, ADMIN)
- **Gövde:**
```json
{
  "queryId": "q-kimlik-ad-soyad",
  "userRole": "VIP",
  "inputs": {
    "ad": "Can",
    "soyad": "Yılmaz",
    "il": "İstanbul"
  }
}
```
- **Yanıt:**
```json
{
  "success": true,
  "query": { "id": "q-kimlik-ad-soyad", "name": "Ad Soyad Sorgu", "category": "KIMLIK" },
  "data": {
    "meta": {
      "mode": "DEMO",
      "synthetic": true,
      "source": "SYNTHETIC_DATA_ENGINE",
      "requestReference": "DEMO-REF-991823-KIM",
      "executionTimeMs": 120
    },
    "summary": [ ... ],
    "cards": [ ... ],
    "tableHeaders": [ ... ],
    "tableRows": [ ... ]
  }
}
```

---

### 3. Sistem Sağlık ve Altyapı Kontrolü
- **Uç Nokta:** `GET /api/admin/health`
- **Erişim:** ADMIN / YÖNETİCİ
- **Yanıt:**
```json
{
  "status": "HEALTHY",
  "service": "NexuXTanrı 𖤟 SorguPaneli Backend Core",
  "components": {
    "catalog": { "status": "UP", "totalQueries": 101 },
    "mockEngine": { "status": "UP" },
    "databaseConnectionPool": { "status": "UP", "latencyMs": 1.4 }
  }
}
```
