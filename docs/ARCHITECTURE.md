# NexuXTanrı 𖤟 SorguPaneli — Mimari Dokümantasyonu (ARCHITECTURE)

## 1. Genel Mimari Bakış

**NexuXTanrı 𖤟 SorguPaneli**, siber-istihbarat estetiğinde (cyber-dark, obsidian `#050609`, cherry crimson `#C8103D`, metallic silver `#C8CDD5`), 12 ana kategori ve 101 sentetik sorgulama modülünden oluşan ultra-premium demo platformudur.

Platformun temel mimari prensipleri:
1. **%100 Sentetik Veri İzolasyonu:** Hiçbir dış PII (Kişisel Veri), sızdırılmış veri tabanı veya üçüncü taraf sorgu servisine bağlanmaz. Bütün kayıtlar yerel `SeededRandom` deterministik motoruyla üretilir.
2. **Kategori & Sorgu Bütünlüğü:** 12 kategori ve 101 sorgu öğesi kod tabanında sabitlenmiş ve programatik `validateCatalog()` fonksiyonu ile tekil olarak doğrulanır.
3. **Rol Tabanlı Erişim Denetimi (RBAC):** `FREE`, `PREMIUM`, `VIP`, `ULTRA`, `YONETICI` ve `ADMIN` katmanları hem arayüzde (Client-side Gate) hem de API uç noktalarında (Server-side Middleware) doğrulanır.
4. **Değiştirilemez Denetim İzi (Audit Log):** Her sorgulama, anahtar oluşturma, yetki yükseltme ve oturum eylemi audit tablosuna işlenir.

---

## 2. Sistem Bileşenleri

```
[ İstemci Katmanı (Next.js 15 Client / React 19) ]
        │
        ├── Header & Rol Seçici
        ├── Sidebar (101 Sorgu Arama & Kategori Akordeonları)
        ├── QueryRunner (Her sorguya özel form + özel sonuç düzeni)
        ├── KeyManagement (Süre & Kota Yönetimi)
        └── Admin Dashboard & Denetim Günlüğü
        │
[ API & Sunucu Katmanı (Next.js App Router / Edge / Node.js) ]
        │
        ├── /api/queries/catalog  ──> Katalog Şeması Doğrulama
        ├── /api/queries/run      ──> Sentetik Motor Yürütücü
        └── /api/admin/health     ──> MySQL Bağlantı & Uptime Raporu
        │
[ Sentetik Motor (MockQueryEngine) ]
        │
        ├── SeededRandom (Deterministik Hash Tohumu)
        ├── Kategori Özel Çıktı Üreticileri (Soy Ağacı, Dossier, Zaman Çizelgesi)
        └── Suistimal Önleme & Su Belirteçleri (DEMO / SYNTHETIC_DATA_ENGINE)
        │
[ Veri Katmanı ]
        ├── MySQL 8 (18 Tablo, İlişkisel İndeksler, DDL & Seed)
        └── In-Memory / LocalStorage Senkronizasyonu
```

---

## 3. 12 Kategori ve 101 Sorgu Tasarımı

Her sorgu için:
- **Özel Alan Şeması (QueryField[]):** Her sorgu kendine uygun etiket, tip (text, number, date, select) ve doğrulama kuralı taşır.
- **Sonuç Yerleşim Şablonu (ResultLayoutType):**
  - `identity-dossier` (Kimlik)
  - `family-tree` (Soy Ağacı & Hane)
  - `timeline` (Zaman Çizelgesi & Tarihçe)
  - `tabular` (Tablo)
  - `telecom-card` (GSM & IMEI Cihaz)
  - `medical-record` (Sağlık & e-Reçete)
  - `travel-itinerary` (Seyahat & Bilet PNR)
  - `financial-statement` (Finans, Findeks & Tapu)
  - `vehicle-registry` (Araç, Plaka & Muayene)
  - `commercial-ledger` (Ticari Sicil & Vergi)
  - `education-diploma` (YÖKSİS Diploma)
  - `legal-case` (UYAP Adli Sicil & GBT)
  - `system-logs` (Erişim Logları)
