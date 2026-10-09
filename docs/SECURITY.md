# NexuXTanrı 𖤟 SorguPaneli — Güvenlik Politikası (SECURITY.md)

## 1. Sentetik Veri İzolasyon Güvencesi
- **Sıfır PII (Zero Personally Identifiable Information):** Sistem hiçbir gerçek bireyin T.C. Kimlik Numarasını, gerçek GSM hattını, gerçek banka hesabını veya gerçek adli sicil kaydını sorgulamaz ve barındırmaz.
- **Yapay Tohum Üretimi:** Bütün veriler `SeededRandom` motoru aracılığıyla kurgusal havuzlardan birleştirilir ve her çıktı açıkça `[SENTETİK DEMO VERİSİ]` damgası ile işaretlenir.

## 2. Kimlik Doğrulama ve RBAC
- **Parolalar:** bcrypt (cost 12) karma algoritması ile saklanır. Düz metin parola veritabanında tutulmaz.
- **JWT İmzaları:** Oturum tokenları gizli anahtar ile SHA-256 olarak imzalanır.
- **Yetki Kontrolü:** İstemci tarafındaki arayüz kısıtlamalarına ek olarak sunucu tarafında her sorguda ve yönetim eyleminde rol rütbesi kontrol edilir.

## 3. Web Güvenliği
- **XSS & Enjeksiyon Koruması:** React JSX otomatik escaping ve parametreli SQL şeması uygulanır.
- **CSV Formül Enjeksiyonu Koruması:** Dışa aktarılan dosyalarda hücre başındaki `=`, `+`, `-`, `@` işaretleri nötralize edilir.
- **Rate Limiting:** IP ve kullanıcı başına dakikalık sorgu limiti uygulanır.
