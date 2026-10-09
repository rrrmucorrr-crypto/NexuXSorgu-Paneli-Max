import { QueryCategory, QueryDefinition } from './types';

export const CATEGORIES: QueryCategory[] = [
  {
    id: 'KIMLIK',
    index: '01',
    name: 'KİMLİK & TEMEL BİLGİLER',
    description: 'Sentetik nüfus, kimlik kütüğü, doğum ve arşiv tescil simülasyonları',
    icon: 'Fingerprint',
  },
  {
    id: 'AILE',
    index: '02',
    name: 'AİLE & YAKINLIK',
    description: 'Kurgusal soy ağacı, hane yapısı, akrabalık bağları ve aile kütük haritası',
    icon: 'Users',
  },
  {
    id: 'ADRES',
    index: '03',
    name: 'ADRES & KONUM',
    description: 'Kurgusal MERNİS ikametgahı, bina-mahalle tescili ve adres zaman çizelgeleri',
    icon: 'MapPin',
  },
  {
    id: 'ILETISIM',
    index: '04',
    name: 'İLETİŞİM & GSM',
    description: 'Simüle edilmiş GSM hat tahsisleri, IMSI/IMEI cihaz ve test oturum kayıtları',
    icon: 'PhoneCall',
  },
  {
    id: 'SAGLIK',
    index: '05',
    name: 'SAĞLIK & YAŞAM',
    description: 'Kurgusal hastane protokolleri, e-reçete kayıtları, aşı ve tıbbi raporlar',
    icon: 'Activity',
  },
  {
    id: 'SEYAHAT',
    index: '06',
    name: 'SEYAHAT & HAREKET',
    description: 'Sentetik konaklama giriş-çıkışları, PNR bilet, uçuş ve seyahat rotaları',
    icon: 'Plane',
  },
  {
    id: 'FINANS',
    index: '07',
    name: 'FİNANS & VARLIK',
    description: 'Kurgusal IBAN doğrulamaları, simüle banka hesapları ve tapu kadastro kayıtları',
    icon: 'CreditCard',
  },
  {
    id: 'ARAC',
    index: '08',
    name: 'ARAÇ & LOJİSTİK',
    description: 'Sentetik araç plakaları, şasi numaraları, muayene ve Tramer kaza simülasyonu',
    icon: 'Car',
  },
  {
    id: 'TICARI',
    index: '09',
    name: 'TİCARİ & İŞ',
    description: 'Kurgusal vergi levhaları, ticaret sicil gazetesi ve ortaklık pay dağılımları',
    icon: 'Briefcase',
  },
  {
    id: 'EGITIM',
    index: '10',
    name: 'EĞİTİM & MESLEK',
    description: 'Sentetik üniversite diplomaları, YÖK denklik ve mesleki sertifika tescilleri',
    icon: 'GraduationCap',
  },
  {
    id: 'YASAL',
    index: '11',
    name: 'YASAL & ADLİ',
    description: 'Kurgusal adli sicil kayıtları, mahkeme esas kararları ve GBT simülasyonu',
    icon: 'Scale',
  },
  {
    id: 'SISTEM',
    index: '12',
    name: 'SİSTEM & YÖNETİM',
    description: 'Platform denetim logları, yetki matrisi, lisans anahtarları ve oturum izleri',
    icon: 'ShieldAlert',
  },
];

export const QUERIES: QueryDefinition[] = [
  // [01] KİMLİK & TEMEL BİLGİLER (8)
  {
    id: 'q-kimlik-ad-soyad',
    name: 'Ad Soyad Sorgu',
    category: 'KIMLIK',
    minRole: 'FREE',
    description: 'Ad ve soyad kombinasyonuna göre kurgusal kimlik kayıt eşleşmelerini listeler.',
    layoutType: 'identity-dossier',
    fields: [
      { name: 'ad', label: 'Ad', type: 'text', placeholder: 'Örn: Can', required: true },
      { name: 'soyad', label: 'Soyad', type: 'text', placeholder: 'Örn: Yılmaz', required: true },
      { name: 'il', label: 'İl Kütüğü (Opsiyonel)', type: 'text', placeholder: 'Örn: İstanbul' },
    ],
    samplePayload: { ad: 'Can', soyad: 'Yılmaz', il: 'İstanbul' },
  },
  {
    id: 'q-kimlik-ad-soyad-detay',
    name: 'Ad Soyad Detay Sorgu',
    category: 'KIMLIK',
    minRole: 'PREMIUM',
    description: 'Genişletilmiş nüfus kütük kaydı, cilt no ve aile sıra no simülasyonunu görüntüler.',
    layoutType: 'identity-dossier',
    fields: [
      { name: 'ad', label: 'Ad', type: 'text', placeholder: 'Örn: Selin', required: true },
      { name: 'soyad', label: 'Soyad', type: 'text', placeholder: 'Örn: Demir', required: true },
      { name: 'babaAdi', label: 'Baba Adı (Doğrulama)', type: 'text', placeholder: 'Örn: Mehmet' },
      { name: 'anneAdi', label: 'Anne Adı (Doğrulama)', type: 'text', placeholder: 'Örn: Ayşe' },
    ],
    samplePayload: { ad: 'Selin', soyad: 'Demir', babaAdi: 'Mehmet', anneAdi: 'Ayşe' },
  },
  {
    id: 'q-kimlik-ad-soyad-gecmis',
    name: 'Ad Soyad Geçmiş Sorgu',
    category: 'KIMLIK',
    minRole: 'PREMIUM',
    description: 'Mahkeme veya evlilik kararı ile tescil edilen kurgusal isim/soyisim değişiklik tarihçesi.',
    layoutType: 'timeline',
    fields: [
      { name: 'mevcutSoyad', label: 'Mevcut Soyad', type: 'text', placeholder: 'Örn: Kaya-Öztürk', required: true },
      { name: 'dogumYili', label: 'Doğum Yılı', type: 'number', placeholder: 'Örn: 1988', required: true },
      { name: 'tescilTarihi', label: 'Referans Yıl Aralığı', type: 'select', options: [
        { label: 'Son 5 Yıl (2021-2026)', value: '2021-2026' },
        { label: 'Son 15 Yıl (2011-2026)', value: '2011-2026' },
        { label: 'Tüm Zamanlar', value: 'ALL' }
      ]},
    ],
    samplePayload: { mevcutSoyad: 'Kaya-Öztürk', dogumYili: '1988', tescilTarihi: '2011-2026' },
  },
  {
    id: 'q-kimlik-kayit',
    name: 'Kimlik Kayıt Sorgu',
    category: 'KIMLIK',
    minRole: 'FREE',
    description: 'Kurgusal nüfus cüzdanı ve yeni tip kimlik kartı tescil durumunu sorgular.',
    layoutType: 'identity-dossier',
    fields: [
      { name: 'referansNo', label: 'Sentetik Kayıt Referansı', type: 'text', placeholder: 'Örn: REF-TR-9921', required: true },
      { name: 'nufusMudurluk', label: 'Tescil Nüfus Müdürlüğü', type: 'text', placeholder: 'Örn: Kadıköy İlçe Nüfus' },
    ],
    samplePayload: { referansNo: 'REF-TR-9921', nufusMudurluk: 'Kadıköy İlçe Nüfus' },
  },
  {
    id: 'q-kimlik-dogum-bilgisi',
    name: 'Kimlik Doğum Bilgisi Sorgu',
    category: 'KIMLIK',
    minRole: 'FREE',
    description: 'Doğum tutanağı, hastane bildirim tarihi ve doğum saati simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'kisiAdSoyad', label: 'Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Efe Bulut', required: true },
      { name: 'dogumTarihi', label: 'Doğum Tarihi', type: 'date', required: true },
    ],
    samplePayload: { kisiAdSoyad: 'Efe Bulut', dogumTarihi: '1995-04-18' },
  },
  {
    id: 'q-kimlik-dogum-yeri',
    name: 'Kimlik Doğum Yeri Sorgu',
    category: 'KIMLIK',
    minRole: 'FREE',
    description: 'Doğum yeri il, ilçe ve köy/mahalle istatistiki kayıt simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'il', label: 'Doğum İli', type: 'text', placeholder: 'Örn: İzmir', required: true },
      { name: 'ilce', label: 'Doğum İlçesi', type: 'text', placeholder: 'Örn: Bornova', required: true },
      { name: 'yilAraligi', label: 'Kayıt Dönemi', type: 'select', options: [
        { label: '1980 - 1990', value: '1980-1990' },
        { label: '1991 - 2000', value: '1991-2000' },
        { label: '2001 - 2015', value: '2001-2015' }
      ]},
    ],
    samplePayload: { il: 'İzmir', ilce: 'Bornova', yilAraligi: '1991-2000' },
  },
  {
    id: 'q-kimlik-seri-no',
    name: 'Kimlik Seri No Sorgu',
    category: 'KIMLIK',
    minRole: 'VIP',
    description: 'Sentetik seri/cüzdan no (A12B34567 formatı) çip ve geçerlilik simülasyonu.',
    layoutType: 'identity-dossier',
    fields: [
      { name: 'seriNo', label: 'Sentetik Seri No (Harf + 8 Rakam)', type: 'text', placeholder: 'Örn: E08B99142', required: true },
      { name: 'gecerlilikYili', label: 'Kart Son Geçerlilik Yılı', type: 'number', placeholder: 'Örn: 2030' },
    ],
    samplePayload: { seriNo: 'E08B99142', gecerlilikYili: '2030' },
  },
  {
    id: 'q-kimlik-arsiv',
    name: 'Kimlik Arşiv Sorgu',
    category: 'KIMLIK',
    minRole: 'VIP',
    description: 'Eski nüfus defterleri, Osmanlıca/Cumhuriyet dönemi arşiv kütük kayıt simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'vilayet', label: 'Vilayet / Sancak Kaydı', type: 'text', placeholder: 'Örn: Hüdavendigar', required: true },
      { name: 'defterNo', label: 'Arşiv Defter No', type: 'text', placeholder: 'Örn: DEF-1927-44', required: true },
    ],
    samplePayload: { vilayet: 'Hüdavendigar', defterNo: 'DEF-1927-44' },
  },

  // [02] AİLE & YAKINLIK (8)
  {
    id: 'q-aile-temel',
    name: 'Aile Sorgu',
    category: 'AILE',
    minRole: 'FREE',
    description: 'Sentetik aile sıra no ve hane halkı çekirdek bireylerini görüntüler.',
    layoutType: 'family-tree',
    fields: [
      { name: 'aileSiraNo', label: 'Sentetik Aile Sıra No', type: 'text', placeholder: 'Örn: AS-4412', required: true },
      { name: 'ilKutuk', label: 'Kütük İli', type: 'text', placeholder: 'Örn: Ankara' },
    ],
    samplePayload: { aileSiraNo: 'AS-4412', ilKutuk: 'Ankara' },
  },
  {
    id: 'q-aile-detay',
    name: 'Aile Detay Sorgu',
    category: 'AILE',
    minRole: 'PREMIUM',
    description: 'Çekirdek aile üyelerinin medeni durum, çocuk sayısı ve bağıntı dökümü.',
    layoutType: 'tabular',
    fields: [
      { name: 'haneReisi', label: 'Hane Reisi / Temsilci Ad Soyad', type: 'text', placeholder: 'Örn: Ahmet Korkmaz', required: true },
      { name: 'ciltNo', label: 'Cilt No', type: 'text', placeholder: 'Örn: CLT-082' },
    ],
    samplePayload: { haneReisi: 'Ahmet Korkmaz', ciltNo: 'CLT-082' },
  },
  {
    id: 'q-aile-gecmis',
    name: 'Aile Geçmiş Sorgu',
    category: 'AILE',
    minRole: 'VIP',
    description: 'Aile kütüğündeki nakil, boşanma, evlat edinme ve vefat olayları kronolojisi.',
    layoutType: 'timeline',
    fields: [
      { name: 'aileKod', label: 'Aile Kütük Kodu', type: 'text', placeholder: 'Örn: FAM-TR-309', required: true },
      { name: 'olayTuru', label: 'Filtrelenecek Olay', type: 'select', options: [
        { label: 'Tüm Olaylar', value: 'ALL' },
        { label: 'Evlenme / Boşanma', value: 'MARRIAGE' },
        { label: 'Kütük Nakil', value: 'TRANSFER' }
      ]},
    ],
    samplePayload: { aileKod: 'FAM-TR-309', olayTuru: 'ALL' },
  },
  {
    id: 'q-aile-soy-agaci',
    name: 'Soy Ağacı Sorgu',
    category: 'AILE',
    minRole: 'VIP',
    description: 'Alt-üst soy ilişkisini 4 nesil interaktif soy ağacı grafiği olarak simüle eder.',
    layoutType: 'family-tree',
    fields: [
      { name: 'merkezKisi', label: 'Merkez Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Tolga Arslan', required: true },
      { name: 'derinlik', label: 'Soy Derinliği (Kuşak)', type: 'select', options: [
        { label: '2 Kuşak (Anne/Baba & Çocuk)', value: '2' },
        { label: '3 Kuşak (Dede/Nine)', value: '3' },
        { label: '4 Kuşak (Büyük Dede/Büyük Nine)', value: '4' }
      ]},
    ],
    samplePayload: { merkezKisi: 'Tolga Arslan', derinlik: '3' },
  },
  {
    id: 'q-aile-sulale',
    name: 'Sülale Sorgu',
    category: 'AILE',
    minRole: 'ULTRA',
    description: 'Genişletilmiş sülale kolları, lakap kayıtları ve köy kütük dallanmaları.',
    layoutType: 'family-tree',
    fields: [
      { name: 'sulaleLakap', label: 'Sülale Adı / Lakap', type: 'text', placeholder: 'Örn: Çakıroğulları', required: true },
      { name: 'koyMevkii', label: 'Köy / Mevkii', type: 'text', placeholder: 'Örn: Dereköy' },
    ],
    samplePayload: { sulaleLakap: 'Çakıroğulları', koyMevkii: 'Dereköy' },
  },
  {
    id: 'q-aile-akrabalik',
    name: 'Akrabalık Sorgu',
    category: 'AILE',
    minRole: 'PREMIUM',
    description: 'İki kurgusal profil arasındaki kan bağı ve sıhri akrabalık derecesi hesaplayıcısı.',
    layoutType: 'tabular',
    fields: [
      { name: 'kisi1', label: '1. Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Murat Koç', required: true },
      { name: 'kisi2', label: '2. Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Emre Koç', required: true },
    ],
    samplePayload: { kisi1: 'Murat Koç', kisi2: 'Emre Koç' },
  },
  {
    id: 'q-aile-hane-yapi',
    name: 'Hane Yapı Sorgu',
    category: 'AILE',
    minRole: 'FREE',
    description: 'Aynı adreste ikamet eden bireylerin hane halkı yapay analizi.',
    layoutType: 'tabular',
    fields: [
      { name: 'haneKodu', label: 'Sentetik Hane Kodu', type: 'text', placeholder: 'Örn: HNE-88190', required: true },
      { name: 'binaNo', label: 'Bina No', type: 'text', placeholder: 'Örn: 24/A' },
    ],
    samplePayload: { haneKodu: 'HNE-88190', binaNo: '24/A' },
  },
  {
    id: 'q-aile-hane-gecmis',
    name: 'Hane Geçmiş Sorgu',
    category: 'AILE',
    minRole: 'VIP',
    description: 'Bir adresteki geçmiş 10 yıl hane sakini değişim kronolojisi.',
    layoutType: 'timeline',
    fields: [
      { name: 'adreseBagliUavt', label: 'Sentetik UAVT Kodu', type: 'text', placeholder: 'Örn: UAVT-10293847', required: true },
      { name: 'tarihAraligi', label: 'Zaman Dilimi', type: 'select', options: [
        { label: 'Son 5 Yıl', value: '5y' },
        { label: 'Son 10 Yıl', value: '10y' }
      ]},
    ],
    samplePayload: { adreseBagliUavt: 'UAVT-10293847', tarihAraligi: '10y' },
  },

  // [03] ADRES & KONUM (8)
  {
    id: 'q-adres-kayit',
    name: 'Adres Kayıt Sorgu',
    category: 'ADRES',
    minRole: 'FREE',
    description: 'Sentetik MERNİS güncel resmi ikametgah açık adres dökümü.',
    layoutType: 'tabular',
    fields: [
      { name: 'adSoyad', label: 'Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Deniz Aksoy', required: true },
      { name: 'ilFiltre', label: 'Hedef İl (Opsiyonel)', type: 'text', placeholder: 'Örn: İzmir' },
    ],
    samplePayload: { adSoyad: 'Deniz Aksoy', ilFiltre: 'İzmir' },
  },
  {
    id: 'q-adres-detay',
    name: 'Adres Detay Sorgu',
    category: 'ADRES',
    minRole: 'PREMIUM',
    description: 'Cadde, sokak, dış kapı no, iç kapı no ve posta kodu kırılımlı tam adres verisi.',
    layoutType: 'tabular',
    fields: [
      { name: 'adresReferans', label: 'Adres Referans No', type: 'text', placeholder: 'Örn: ADR-34-IST-991', required: true },
    ],
    samplePayload: { adresReferans: 'ADR-34-IST-991' },
  },
  {
    id: 'q-adres-gecmis',
    name: 'Adres Geçmiş Sorgu',
    category: 'ADRES',
    minRole: 'VIP',
    description: 'Kişinin geçmişte ikamet ettiği tüm kurgusal adresler ve taşınma tarihleri.',
    layoutType: 'timeline',
    fields: [
      { name: 'kisiAdSoyad', label: 'Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Serkan Yıldız', required: true },
      { name: 'yilSayisi', label: 'Geriye Dönük Yıl', type: 'number', placeholder: 'Örn: 8' },
    ],
    samplePayload: { kisiAdSoyad: 'Serkan Yıldız', yilSayisi: '8' },
  },
  {
    id: 'q-adres-zaman-cizelgesi',
    name: 'Adres Zaman Çizelgesi Sorgu',
    category: 'ADRES',
    minRole: 'VIP',
    description: 'Taşınma, tayin ve ikamet transferlerinin görsel zaman ekseni simülasyonu.',
    layoutType: 'timeline',
    fields: [
      { name: 'profilRef', label: 'Profil ID', type: 'text', placeholder: 'Örn: PRF-8812', required: true },
    ],
    samplePayload: { profilRef: 'PRF-8812' },
  },
  {
    id: 'q-adres-ikamet',
    name: 'İkamet Sorgu',
    category: 'ADRES',
    minRole: 'FREE',
    description: 'Yurtiçi veya yurtdışı aktif ikamet tezkere/tescil kütüğü sorgusu.',
    layoutType: 'tabular',
    fields: [
      { name: 'ikametTipi', label: 'İkamet Tipi', type: 'select', options: [
        { label: 'Birincil Daimi Adres', value: 'PRIMARY' },
        { label: 'İkincil Yazlık / Geçici Adres', value: 'SECONDARY' }
      ], required: true },
      { name: 'sehir', label: 'Şehir', type: 'text', placeholder: 'Örn: Antalya' },
    ],
    samplePayload: { ikametTipi: 'PRIMARY', sehir: 'Antalya' },
  },
  {
    id: 'q-adres-yerlesim',
    name: 'Yerleşim Sorgu',
    category: 'ADRES',
    minRole: 'PREMIUM',
    description: 'Nüfus yoğunluğu, kentsel dönüşüm ve yerleşim alanı risk profili simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'bolgeKodu', label: 'Sentetik Bölge Kodu', type: 'text', placeholder: 'Örn: GEO-TR-06-CANKAYA', required: true },
    ],
    samplePayload: { bolgeKodu: 'GEO-TR-06-CANKAYA' },
  },
  {
    id: 'q-adres-yerlesim-gecmis',
    name: 'Yerleşim Geçmiş Sorgu',
    category: 'ADRES',
    minRole: 'ULTRA',
    description: 'Köyden kente göç, mahalle birleşmeleri ve mülki idare sınır tarihçesi.',
    layoutType: 'timeline',
    fields: [
      { name: 'mahalleEskiAdi', label: 'Eski Mahalle/Köy Adı', type: 'text', placeholder: 'Örn: Yeniköy Köyü', required: true },
      { name: 'ilce', label: 'Bağlı İlçe', type: 'text', placeholder: 'Örn: Sarıyer' },
    ],
    samplePayload: { mahalleEskiAdi: 'Yeniköy Köyü', ilce: 'Sarıyer' },
  },
  {
    id: 'q-adres-bina-mahalle',
    name: 'Bina Mahalle Sorgu',
    category: 'ADRES',
    minRole: 'FREE',
    description: 'Mahalle bazlı sentetik bina envanteri, kat sayısı ve bağımsız bölüm listesi.',
    layoutType: 'tabular',
    fields: [
      { name: 'mahalle', label: 'Mahalle Adı', type: 'text', placeholder: 'Örn: Caferağa Mah.', required: true },
      { name: 'sokak', label: 'Sokak Adı', type: 'text', placeholder: 'Örn: Moda Cad.' },
    ],
    samplePayload: { mahalle: 'Caferağa Mah.', sokak: 'Moda Cad.' },
  },

  // [04] İLETİŞİM & GSM (6)
  {
    id: 'q-iletisim-genel',
    name: 'İletişim Sorgu',
    category: 'ILETISIM',
    minRole: 'FREE',
    description: 'Kayıtlı simüle edilmiş e-posta, sabit hat ve alternatif iletişim kanalları.',
    layoutType: 'telecom-card',
    fields: [
      { name: 'kullaniciAdi', label: 'Kullanıcı veya Kişi Adı', type: 'text', placeholder: 'Örn: Mert Kaya', required: true },
    ],
    samplePayload: { kullaniciAdi: 'Mert Kaya' },
  },
  {
    id: 'q-iletisim-telefon',
    name: 'Telefon Sorgu',
    category: 'ILETISIM',
    minRole: 'FREE',
    description: 'Sentetik sabit hat veya kurumsal santral numarası tahsis dökümü.',
    layoutType: 'telecom-card',
    fields: [
      { name: 'sabitNo', label: 'Sentetik Santral No (Örn: 0212 999 00 11)', type: 'text', placeholder: '0212 999 00 11', required: true },
    ],
    samplePayload: { sabitNo: '0212 999 00 11' },
  },
  {
    id: 'q-iletisim-gsm-hat',
    name: 'GSM Hat Sorgu',
    category: 'ILETISIM',
    minRole: 'PREMIUM',
    description: 'Sentetik GSM operatörü (Turkcell, Vodafone, TT simülasyonu) ve hat statüsü.',
    layoutType: 'telecom-card',
    fields: [
      { name: 'gsmNo', label: 'Sentetik GSM No', type: 'text', placeholder: 'Örn: 0555 000 12 34', required: true },
      { name: 'operatorSecim', label: 'Operatör Filtresi', type: 'select', options: [
        { label: 'Tüm Operatörler', value: 'ALL' },
        { label: 'Operatör Alpha (MOCK-TK)', value: 'MOCK-TK' },
        { label: 'Operatör Beta (MOCK-VF)', value: 'MOCK-VF' },
        { label: 'Operatör Gamma (MOCK-TT)', value: 'MOCK-TT' }
      ]},
    ],
    samplePayload: { gsmNo: '0555 000 12 34', operatorSecim: 'ALL' },
  },
  {
    id: 'q-iletisim-hat-gecmis',
    name: 'Hat Geçmiş Sorgu',
    category: 'ILETISIM',
    minRole: 'VIP',
    description: 'GSM numara taşıma (MNP) tarihçesi, faturalı/faturasız geçiş kronolojisi.',
    layoutType: 'timeline',
    fields: [
      { name: 'gsmNo', label: 'Sentetik GSM No', type: 'text', placeholder: 'Örn: 0532 999 88 77', required: true },
    ],
    samplePayload: { gsmNo: '0532 999 88 77' },
  },
  {
    id: 'q-iletisim-cihaz',
    name: 'Cihaz Sorgu',
    category: 'ILETISIM',
    minRole: 'VIP',
    description: 'Simüle edilmiş IMEI seri no, BTK ithalat kayıt durumu ve cihaz modeli.',
    layoutType: 'telecom-card',
    fields: [
      { name: 'imeiNo', label: 'Sentetik IMEI No (15 Hane)', type: 'text', placeholder: 'Örn: 359123456789012', required: true },
    ],
    samplePayload: { imeiNo: '359123456789012' },
  },
  {
    id: 'q-iletisim-oturum',
    name: 'Oturum Sorgu',
    category: 'ILETISIM',
    minRole: 'ULTRA',
    description: 'Simüle edilen test baz istasyonu bağlantıları ve sinyal yoğunluk raporu.',
    layoutType: 'tabular',
    fields: [
      { name: 'bazIstasyonKodu', label: 'Test Baz İstasyonu Kodu', type: 'text', placeholder: 'Örn: BTS-34-KDK-01', required: true },
      { name: 'saatAralik', label: 'Saat Dilimi', type: 'text', placeholder: 'Örn: 14:00 - 18:00' },
    ],
    samplePayload: { bazIstasyonKodu: 'BTS-34-KDK-01', saatAralik: '14:00 - 18:00' },
  },

  // [05] SAĞLIK & YAŞAM (10)
  {
    id: 'q-saglik-kayit',
    name: 'Sağlık Kayıt Sorgu',
    category: 'SAGLIK',
    minRole: 'FREE',
    description: 'Kurgusal e-Nabız sağlık profili, kan grubu ve kayıtlı aile hekimliği merkezi.',
    layoutType: 'medical-record',
    fields: [
      { name: 'hastaAdSoyad', label: 'Hasta Ad Soyad', type: 'text', placeholder: 'Örn: Ali Vural', required: true },
      { name: 'kanGrubu', label: 'Kan Grubu Filtresi', type: 'select', options: [
        { label: 'Tümü', value: 'ALL' },
        { label: 'A Rh(+)', value: 'A+' },
        { label: '0 Rh(+)', value: '0+' },
        { label: 'B Rh(+)', value: 'B+' },
        { label: 'AB Rh(+)', value: 'AB+' }
      ]},
    ],
    samplePayload: { hastaAdSoyad: 'Ali Vural', kanGrubu: '0+' },
  },
  {
    id: 'q-saglik-gecmis',
    name: 'Sağlık Geçmiş Sorgu',
    category: 'SAGLIK',
    minRole: 'PREMIUM',
    description: 'Geçmiş poliklinik başvuruları, tanı kodları (ICD-10 sentetik) ve muayene tarihleri.',
    layoutType: 'timeline',
    fields: [
      { name: 'protokolNo', label: 'Protokol No', type: 'text', placeholder: 'Örn: PRT-2024-8841', required: true },
      { name: 'yil', label: 'Yıl', type: 'number', placeholder: '2024' },
    ],
    samplePayload: { protokolNo: 'PRT-2024-8841', yil: '2024' },
  },
  {
    id: 'q-saglik-hastane-kayit',
    name: 'Hastane Kayıt Sorgu',
    category: 'SAGLIK',
    minRole: 'FREE',
    description: 'Simüle edilen kamu veya üniversite hastanesi poliklinik randevu kayıtları.',
    layoutType: 'tabular',
    fields: [
      { name: 'hastaneAdi', label: 'Kurgusal Hastane Adı', type: 'text', placeholder: 'Örn: Şehir Hastanesi', required: true },
      { name: 'klinik', label: 'Klinik / Branş', type: 'text', placeholder: 'Örn: Kardiyoloji' },
    ],
    samplePayload: { hastaneAdi: 'Şehir Hastanesi', klinik: 'Kardiyoloji' },
  },
  {
    id: 'q-saglik-hastane-ziyaret',
    name: 'Hastane Ziyaret Sorgu',
    category: 'SAGLIK',
    minRole: 'PREMIUM',
    description: 'Acil servis veya poliklinik giriş-çıkış saatleri ve hekim kaşe bilgileri simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'ziyaretTarihi', label: 'Ziyaret Tarihi', type: 'date', required: true },
      { name: 'hastaneKodu', label: 'Hastane Kodu', type: 'text', placeholder: 'Örn: HOS-06-NUMUNE' },
    ],
    samplePayload: { ziyaretTarihi: '2025-11-14', hastaneKodu: 'HOS-06-NUMUNE' },
  },
  {
    id: 'q-saglik-tedavi',
    name: 'Tedavi Sorgu',
    category: 'SAGLIK',
    minRole: 'VIP',
    description: 'Ayakta ve yatarak tedavi planları, cerrahi müdahale simüle kodları.',
    layoutType: 'medical-record',
    fields: [
      { name: 'tedaviKodu', label: 'Tedavi / İşlem Kodu', type: 'text', placeholder: 'Örn: SUT-602110', required: true },
    ],
    samplePayload: { tedaviKodu: 'SUT-602110' },
  },
  {
    id: 'q-saglik-tedavi-gecmis',
    name: 'Tedavi Geçmiş Sorgu',
    category: 'SAGLIK',
    minRole: 'VIP',
    description: 'Fizik tedavi, diyaliz veya kronik tedavi seanslarının kronolojik takibi.',
    layoutType: 'timeline',
    fields: [
      { name: 'hastaRef', label: 'Hasta Referans Kodu', type: 'text', placeholder: 'Örn: MED-PAT-901', required: true },
    ],
    samplePayload: { hastaRef: 'MED-PAT-901' },
  },
  {
    id: 'q-saglik-ilac-kayit',
    name: 'İlaç Kayıt Sorgu',
    category: 'SAGLIK',
    minRole: 'FREE',
    description: 'İlaç Takip Sistemi (İTS) simülasyonu, karekod ve etken madde envanteri.',
    layoutType: 'tabular',
    fields: [
      { name: 'ilacAdi', label: 'İlaç / Etken Madde Adı', type: 'text', placeholder: 'Örn: Parasetamol 500mg', required: true },
      { name: 'karekod', label: 'Sentetik Karekod / Barkod', type: 'text', placeholder: 'Örn: 8699500001234' },
    ],
    samplePayload: { ilacAdi: 'Parasetamol 500mg', karekod: '8699500001234' },
  },
  {
    id: 'q-saglik-recete',
    name: 'Reçete Sorgu',
    category: 'SAGLIK',
    minRole: 'PREMIUM',
    description: 'Sentetik e-reçete numarası (Örn: RCT-8841-A) ve eczane teslim durumu.',
    layoutType: 'medical-record',
    fields: [
      { name: 'receteNo', label: 'Sentetik Reçete No', type: 'text', placeholder: 'Örn: RCT-8841-A', required: true },
    ],
    samplePayload: { receteNo: 'RCT-8841-A' },
  },
  {
    id: 'q-saglik-asi-kayit',
    name: 'Aşı Kayıt Sorgu',
    category: 'SAGLIK',
    minRole: 'FREE',
    description: 'Çocukluk ve yetişkinlik aşı takvimi dozları ve aşı pasaportu simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'asiTuru', label: 'Aşı Türü', type: 'select', options: [
        { label: 'Tüm Aşılar', value: 'ALL' },
        { label: 'Tetanoz / Difteri', value: 'TD' },
        { label: 'Hepatit B', value: 'HEPB' },
        { label: 'Grip / İnfluenza', value: 'FLU' }
      ], required: true },
    ],
    samplePayload: { asiTuru: 'TD' },
  },
  {
    id: 'q-saglik-rapor',
    name: 'Sağlık Rapor Sorgu',
    category: 'SAGLIK',
    minRole: 'VIP',
    description: 'Sürücü belgesi, işe giriş veya istirahat heyet raporu tescil simülasyonu.',
    layoutType: 'medical-record',
    fields: [
      { name: 'raporNo', label: 'Rapor No', type: 'text', placeholder: 'Örn: RAP-2025-10492', required: true },
      { name: 'raporTuru', label: 'Rapor Türü', type: 'select', options: [
        { label: 'Sürücü Sağlık Raporu', value: 'DRIVER' },
        { label: 'İstirahat / İş Göremezlik', value: 'REST' },
        { label: 'Engelli Sağlık Kurulu', value: 'DISABILITY' }
      ]},
    ],
    samplePayload: { raporNo: 'RAP-2025-10492', raporTuru: 'DRIVER' },
  },

  // [06] SEYAHAT & HAREKET (9)
  {
    id: 'q-seyahat-konaklama',
    name: 'Konaklama Sorgu',
    category: 'SEYAHAT',
    minRole: 'FREE',
    description: 'Sentetik otel, pansiyon ve tatil köyü konaklama rezervasyon dökümü.',
    layoutType: 'travel-itinerary',
    fields: [
      { name: 'sehir', label: 'Şehir / Bölge', type: 'text', placeholder: 'Örn: Antalya', required: true },
      { name: 'misafirAdSoyad', label: 'Misafir Ad Soyad', type: 'text', placeholder: 'Örn: Burak Güneş' },
    ],
    samplePayload: { sehir: 'Antalya', misafirAdSoyad: 'Burak Güneş' },
  },
  {
    id: 'q-seyahat-konaklama-gecmis',
    name: 'Konaklama Geçmiş Sorgu',
    category: 'SEYAHAT',
    minRole: 'PREMIUM',
    description: 'Son yıllarda gerçekleşen tüm kurgusal otel giriş ve çıkış arşivi.',
    layoutType: 'timeline',
    fields: [
      { name: 'musteriKodu', label: 'Müşteri Referans No', type: 'text', placeholder: 'Örn: GUEST-9901', required: true },
    ],
    samplePayload: { musteriKodu: 'GUEST-9901' },
  },
  {
    id: 'q-seyahat-konaklama-giris-cikis',
    name: 'Konaklama Giriş Çıkış Sorgu',
    category: 'SEYAHAT',
    minRole: 'VIP',
    description: 'KBS (Kimlik Bildirim Sistemi) simülasyonu ile oda ve geceleme detayları.',
    layoutType: 'travel-itinerary',
    fields: [
      { name: 'tesisKodu', label: 'Tesis / Otel Kodu', type: 'text', placeholder: 'Örn: HTL-34-HILTON-MOCK', required: true },
      { name: 'odaNo', label: 'Oda No', type: 'text', placeholder: 'Örn: 402' },
    ],
    samplePayload: { tesisKodu: 'HTL-34-HILTON-MOCK', odaNo: '402' },
  },
  {
    id: 'q-seyahat-genel',
    name: 'Seyahat Sorgu',
    category: 'SEYAHAT',
    minRole: 'FREE',
    description: 'Yurtiçi ve uluslararası kurgusal seyahat izin ve rota bilgileri.',
    layoutType: 'travel-itinerary',
    fields: [
      { name: 'kalkis', label: 'Kalkış Noktası', type: 'text', placeholder: 'Örn: İstanbul (IST)', required: true },
      { name: 'varis', label: 'Varış Noktası', type: 'text', placeholder: 'Örn: Berlin (BER)', required: true },
    ],
    samplePayload: { kalkis: 'İstanbul (IST)', varis: 'Berlin (BER)' },
  },
  {
    id: 'q-seyahat-gecmis',
    name: 'Seyahat Geçmiş Sorgu',
    category: 'SEYAHAT',
    minRole: 'PREMIUM',
    description: 'Yıllık seyahat sıklığı, pasaport vize damgaları ve sınır kapısı simülasyonu.',
    layoutType: 'timeline',
    fields: [
      { name: 'pasaportNo', label: 'Sentetik Pasaport No', type: 'text', placeholder: 'Örn: U12345678', required: true },
    ],
    samplePayload: { pasaportNo: 'U12345678' },
  },
  {
    id: 'q-seyahat-zaman-cizelgesi',
    name: 'Seyahat Zaman Çizelgesi Sorgu',
    category: 'SEYAHAT',
    minRole: 'VIP',
    description: 'Bir seyahatin aktarmalar, transferler ve varış anı ile kronolojik haritası.',
    layoutType: 'timeline',
    fields: [
      { name: 'seyahatRef', label: 'Seyahat Dosya No', type: 'text', placeholder: 'Örn: TRIP-2025-998', required: true },
    ],
    samplePayload: { seyahatRef: 'TRIP-2025-998' },
  },
  {
    id: 'q-seyahat-ulasim',
    name: 'Ulaşım Sorgu',
    category: 'SEYAHAT',
    minRole: 'FREE',
    description: 'Yüksek hızlı tren (YHT), şehirlerarası otobüs ve feribot sefer simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'ulasimTuru', label: 'Ulaşım Türü', type: 'select', options: [
        { label: 'TCDD YHT (Hızlı Tren)', value: 'TRAIN' },
        { label: 'Şehirlerarası Otobüs', value: 'BUS' },
        { label: 'İDO / Deniz Otobüsü', value: 'FERRY' }
      ], required: true },
      { name: 'seferNo', label: 'Sefer No', type: 'text', placeholder: 'Örn: YHT-9102' },
    ],
    samplePayload: { ulasimTuru: 'TRAIN', seferNo: 'YHT-9102' },
  },
  {
    id: 'q-seyahat-ucus',
    name: 'Uçuş Sorgu',
    category: 'SEYAHAT',
    minRole: 'PREMIUM',
    description: 'Sentetik havayolu uçuş kodu (Örn: TK-1984), kapı no ve rötar analizi.',
    layoutType: 'travel-itinerary',
    fields: [
      { name: 'ucusKodu', label: 'Uçuş Kodu', type: 'text', placeholder: 'Örn: TK-1984', required: true },
      { name: 'ucusTarihi', label: 'Uçuş Tarihi', type: 'date', required: true },
    ],
    samplePayload: { ucusKodu: 'TK-1984', ucusTarihi: '2026-04-12' },
  },
  {
    id: 'q-seyahat-bilet',
    name: 'Bilet Sorgu',
    category: 'SEYAHAT',
    minRole: 'FREE',
    description: 'Sentetik PNR kodu (6 haneli alfanümerik) ve e-bilet barkod simülasyonu.',
    layoutType: 'travel-itinerary',
    fields: [
      { name: 'pnrKodu', label: 'Sentetik PNR Kodu', type: 'text', placeholder: 'Örn: X7Q9W2', required: true },
      { name: 'yolcuSoyad', label: 'Yolcu Soyad', type: 'text', placeholder: 'Örn: Doğan' },
    ],
    samplePayload: { pnrKodu: 'X7Q9W2', yolcuSoyad: 'Doğan' },
  },

  // [07] FİNANS & VARLIK (10)
  {
    id: 'q-finans-banka',
    name: 'Banka Sorgu',
    category: 'FINANS',
    minRole: 'FREE',
    description: 'Sentetik banka şubesi, EFT kodu ve finansal kurum rehberi sorgusu.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'bankaAdi', label: 'Banka Adı', type: 'select', options: [
        { label: 'T.C. Ziraat Simülasyon', value: 'ZIRAAT' },
        { label: 'İş Bankası Simülasyon', value: 'ISBANK' },
        { label: 'Garanti BBVA Simülasyon', value: 'GARANTI' },
        { label: 'Yapı Kredi Simülasyon', value: 'YAPIKREDI' },
        { label: 'Akbank Simülasyon', value: 'AKBANK' }
      ], required: true },
      { name: 'subeKodu', label: 'Şube Kodu', type: 'text', placeholder: 'Örn: 1042' },
    ],
    samplePayload: { bankaAdi: 'ISBANK', subeKodu: '1042' },
  },
  {
    id: 'q-finans-banka-hesap',
    name: 'Banka Hesap Sorgu',
    category: 'FINANS',
    minRole: 'PREMIUM',
    description: 'Kurgusal vadesiz TL/Döviz hesap numarası ve hesap açılış tarihi simülasyonu.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'hesapNo', label: 'Sentetik Hesap No', type: 'text', placeholder: 'Örn: 9918-00412891', required: true },
      { name: 'paraBirimi', label: 'Para Birimi', type: 'select', options: [
        { label: 'TRY (Türk Lirası)', value: 'TRY' },
        { label: 'USD (ABD Doları)', value: 'USD' },
        { label: 'EUR (Euro)', value: 'EUR' }
      ]},
    ],
    samplePayload: { hesapNo: '9918-00412891', paraBirimi: 'TRY' },
  },
  {
    id: 'q-finans-iban',
    name: 'IBAN Sorgu',
    category: 'FINANS',
    minRole: 'FREE',
    description: 'TR standardında sentetik 26 haneli IBAN çözümleyici ve şube doğrulayıcı.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'ibanNo', label: 'Sentetik IBAN (TR... 26 hane)', type: 'text', placeholder: 'TR00 9999 0000 1234 5678 9012 34', required: true },
    ],
    samplePayload: { ibanNo: 'TR00 9999 0000 1234 5678 9012 34' },
  },
  {
    id: 'q-finans-hesap-hareket',
    name: 'Hesap Hareket Sorgu',
    category: 'FINANS',
    minRole: 'VIP',
    description: 'FAST/EFT transferleri, pos harcamaları ve bakiye değişim simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'hesapReferans', label: 'Hesap Referans Kodu', type: 'text', placeholder: 'Örn: ACC-992-TRY', required: true },
      { name: 'hareketTipi', label: 'İşlem Tipi', type: 'select', options: [
        { label: 'Tüm İşlemler', value: 'ALL' },
        { label: 'Gelen Para (Havale/EFT)', value: 'IN' },
        { label: 'Giden Para (Ödeme)', value: 'OUT' }
      ]},
    ],
    samplePayload: { hesapReferans: 'ACC-992-TRY', hareketTipi: 'ALL' },
  },
  {
    id: 'q-finans-durum',
    name: 'Finansal Durum Sorgu',
    category: 'FINANS',
    minRole: 'ULTRA',
    description: 'Sentetik kredi notu (Findeks skoru simülasyonu) ve risk endeksi.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'musteriSegmenti', label: 'Müşteri Segmenti', type: 'select', options: [
        { label: 'Bireysel Standart', value: 'RETAIL' },
        { label: 'KOBİ / Ticari', value: 'SME' },
        { label: 'Özel Bankacılık / VIP', value: 'PRIVATE' }
      ], required: true },
    ],
    samplePayload: { musteriSegmenti: 'PRIVATE' },
  },
  {
    id: 'q-finans-mulkiyet',
    name: 'Mülkiyet Sorgu',
    category: 'FINANS',
    minRole: 'FREE',
    description: 'Taşınır ve taşınmaz mülklerin genel kurgusal mülkiyet dağılımı.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'malikAdSoyad', label: 'Malik Ad Soyad', type: 'text', placeholder: 'Örn: Orhan Çelik', required: true },
    ],
    samplePayload: { malikAdSoyad: 'Orhan Çelik' },
  },
  {
    id: 'q-finans-tapu',
    name: 'Tapu Sorgu',
    category: 'FINANS',
    minRole: 'PREMIUM',
    description: 'TAKBİS simülasyonu ile il, ilçe, ada ve parsel bazlı tapu senedi dökümü.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'il', label: 'Tapu İli', type: 'text', placeholder: 'Örn: Muğla', required: true },
      { name: 'ilce', label: 'Tapu İlçesi', type: 'text', placeholder: 'Örn: Bodrum', required: true },
      { name: 'ada', label: 'Ada No', type: 'text', placeholder: 'Örn: 104' },
      { name: 'parsel', label: 'Parsel No', type: 'text', placeholder: 'Örn: 12' },
    ],
    samplePayload: { il: 'Muğla', ilce: 'Bodrum', ada: '104', parsel: '12' },
  },
  {
    id: 'q-finans-tapu-gecmis',
    name: 'Tapu Geçmiş Sorgu',
    category: 'FINANS',
    minRole: 'VIP',
    description: 'Taşınmazın satış, miras ve ipotek terkin işlemleri kronolojisi.',
    layoutType: 'timeline',
    fields: [
      { name: 'zeminNo', label: 'Tapu Zemin No', type: 'text', placeholder: 'Örn: ZMN-88491-01', required: true },
    ],
    samplePayload: { zeminNo: 'ZMN-88491-01' },
  },
  {
    id: 'q-finans-arazi',
    name: 'Arazi Sorgu',
    category: 'FINANS',
    minRole: 'PREMIUM',
    description: 'Tarla, zeytinlik ve arsa nitelikli arazilerin kurgusal vasıf ve yüzölçüm dökümü.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'araziVasfi', label: 'Arazi Vasfı', type: 'select', options: [
        { label: 'Arsa (İmarlı)', value: 'ARSA' },
        { label: 'Tarla', value: 'TARLA' },
        { label: 'Zeytinlik', value: 'ZEYTINLIK' }
      ], required: true },
      { name: 'yuzolcumMin', label: 'Min Metrekare (m²)', type: 'number', placeholder: '1000' },
    ],
    samplePayload: { araziVasfi: 'ARSA', yuzolcumMin: '1000' },
  },
  {
    id: 'q-finans-parsel',
    name: 'Parsel Sorgu',
    category: 'FINANS',
    minRole: 'FREE',
    description: 'Kadastro koordinatları, imar durumu ve TAKS/KAKS katsayı simülasyonu.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'kadastroKodu', label: 'Kadastro Parsel Kodu', type: 'text', placeholder: 'Örn: KAD-34-BEY-442', required: true },
    ],
    samplePayload: { kadastroKodu: 'KAD-34-BEY-442' },
  },

  // [08] ARAÇ & LOJİSTİK (7)
  {
    id: 'q-arac-genel',
    name: 'Araç Sorgu',
    category: 'ARAC',
    minRole: 'FREE',
    description: 'Marka, model yılı, motor hacmi ve yakıt türü araç tescil kartı.',
    layoutType: 'vehicle-registry',
    fields: [
      { name: 'markaModel', label: 'Marka & Model', type: 'text', placeholder: 'Örn: BMW 320i', required: true },
      { name: 'modelYili', label: 'Model Yılı', type: 'number', placeholder: '2023' },
    ],
    samplePayload: { markaModel: 'BMW 320i', modelYili: '2023' },
  },
  {
    id: 'q-arac-gecmis',
    name: 'Araç Geçmiş Sorgu',
    category: 'ARAC',
    minRole: 'PREMIUM',
    description: 'Aracın el değiştirme sayısı, noter devir tarihleri ve tescil illeri.',
    layoutType: 'timeline',
    fields: [
      { name: 'sasiNo', label: 'Sentetik Şasi No (17 Hane)', type: 'text', placeholder: 'Örn: WBA3A5C55FP123456', required: true },
    ],
    samplePayload: { sasiNo: 'WBA3A5C55FP123456' },
  },
  {
    id: 'q-arac-plaka',
    name: 'Plaka Sorgu',
    category: 'ARAC',
    minRole: 'FREE',
    description: 'Türk plaka standardında (Örn: 34 MOCK 099) sentetik araç sorgusu.',
    layoutType: 'vehicle-registry',
    fields: [
      { name: 'plakaNo', label: 'Plaka No (Örn: 34 ABC 123)', type: 'text', placeholder: '34 MOCK 099', required: true },
    ],
    samplePayload: { plakaNo: '34 MOCK 099' },
  },
  {
    id: 'q-arac-sigorta',
    name: 'Sigorta Sorgu',
    category: 'ARAC',
    minRole: 'FREE',
    description: 'Zorunlu Trafik Sigortası poliçe no, acente ve basamak kademesi simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'policeNo', label: 'Poliçe No', type: 'text', placeholder: 'Örn: POL-ZTS-2025-8819', required: true },
    ],
    samplePayload: { policeNo: 'POL-ZTS-2025-8819' },
  },
  {
    id: 'q-arac-kasko',
    name: 'Kasko Sorgu',
    category: 'ARAC',
    minRole: 'PREMIUM',
    description: 'Genişletilmiş kasko teminatları, hasarsızlık indirimi oranı ve asistans paketi.',
    layoutType: 'vehicle-registry',
    fields: [
      { name: 'kaskoPoliceNo', label: 'Kasko Poliçe No', type: 'text', placeholder: 'Örn: KSK-998822', required: true },
    ],
    samplePayload: { kaskoPoliceNo: 'KSK-998822' },
  },
  {
    id: 'q-arac-muayene',
    name: 'Muayene Sorgu',
    category: 'ARAC',
    minRole: 'FREE',
    description: 'TÜVTÜRK simülasyonu muayene geçerlilik tarihi, hafif/ağır kusur dökümü.',
    layoutType: 'tabular',
    fields: [
      { name: 'istasyonKodu', label: 'Muayene İstasyonu', type: 'text', placeholder: 'Örn: TÜV-İST-ŞİLE-01', required: true },
      { name: 'kilometre', label: 'Son Muayene Kilometresi', type: 'number', placeholder: '142000' },
    ],
    samplePayload: { istasyonKodu: 'TÜV-İST-ŞİLE-01', kilometre: '142000' },
  },
  {
    id: 'q-arac-kaza-kaydi',
    name: 'Kaza Kaydı Sorgu',
    category: 'ARAC',
    minRole: 'VIP',
    description: 'TRAMER hasar kaydı sorgusu, kaza tarihi, tutanak no ve parça değişim bedeli.',
    layoutType: 'tabular',
    fields: [
      { name: 'tramerDosyaNo', label: 'TRAMER Dosya No', type: 'text', placeholder: 'Örn: TRM-2024-99120', required: true },
    ],
    samplePayload: { tramerDosyaNo: 'TRM-2024-99120' },
  },

  // [09] TİCARİ & İŞ (5)
  {
    id: 'q-ticari-isyeri',
    name: 'İşyeri Sorgu',
    category: 'TICARI',
    minRole: 'FREE',
    description: 'Ticari unvan, MERSİS no, NACE kodu ve faaliyet konusu simülasyonu.',
    layoutType: 'commercial-ledger',
    fields: [
      { name: 'unvan', label: 'Ticari Unvan', type: 'text', placeholder: 'Örn: Siber Sistemler Teknoloji A.Ş.', required: true },
      { name: 'sehir', label: 'Merkez İli', type: 'text', placeholder: 'Örn: Ankara' },
    ],
    samplePayload: { unvan: 'Siber Sistemler Teknoloji A.Ş.', sehir: 'Ankara' },
  },
  {
    id: 'q-ticari-isyeri-gecmis',
    name: 'İşyeri Geçmiş Sorgu',
    category: 'TICARI',
    minRole: 'PREMIUM',
    description: 'Adres taşınması, unvan değişikliği ve sermaye artırımı tescil ilanları.',
    layoutType: 'timeline',
    fields: [
      { name: 'mersisNo', label: 'Sentetik MERSİS No (16 Hane)', type: 'text', placeholder: 'Örn: 0123456789000014', required: true },
    ],
    samplePayload: { mersisNo: '0123456789000014' },
  },
  {
    id: 'q-ticari-vergi',
    name: 'Vergi Sorgu',
    category: 'TICARI',
    minRole: 'FREE',
    description: 'Vergi dairesi müdürlüğü, 10 haneli VKN doğrulama ve vergi levhası matrahı.',
    layoutType: 'commercial-ledger',
    fields: [
      { name: 'vkn', label: 'Sentetik VKN (10 Hane)', type: 'text', placeholder: 'Örn: 9988776655', required: true },
      { name: 'vergiDairesi', label: 'Vergi Dairesi', type: 'text', placeholder: 'Örn: Beşiktaş V.D.' },
    ],
    samplePayload: { vkn: '9988776655', vergiDairesi: 'Beşiktaş V.D.' },
  },
  {
    id: 'q-ticari-gelir',
    name: 'Gelir Sorgu',
    category: 'TICARI',
    minRole: 'VIP',
    description: 'Kurgusal yıllık beyanname bilançosu, kar/zarar tablosu ve e-Fatura hacmi.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'vergilendirmeYili', label: 'Mali Yıl', type: 'select', options: [
        { label: '2025 Yılı', value: '2025' },
        { label: '2024 Yılı', value: '2024' },
        { label: '2023 Yılı', value: '2023' }
      ], required: true },
    ],
    samplePayload: { vergilendirmeYili: '2024' },
  },
  {
    id: 'q-ticari-ortaklik',
    name: 'Ortaklık Sorgu',
    category: 'TICARI',
    minRole: 'ULTRA',
    description: 'Şirket ortakları, pay yüzdeleri, imza yetkilileri ve temsil ilzam yetkisi.',
    layoutType: 'commercial-ledger',
    fields: [
      { name: 'sirketKod', label: 'Şirket Ticaret Sicil No', type: 'text', placeholder: 'Örn: TS-İST-99412', required: true },
    ],
    samplePayload: { sirketKod: 'TS-İST-99412' },
  },

  // [10] EĞİTİM & MESLEK (5)
  {
    id: 'q-egitim-genel',
    name: 'Eğitim Sorgu',
    category: 'EGITIM',
    minRole: 'FREE',
    description: 'İlk, orta ve lise eğitim dönemi mezuniyet okulu ve şube tescili.',
    layoutType: 'education-diploma',
    fields: [
      { name: 'ogrenciAdSoyad', label: 'Öğrenci Ad Soyad', type: 'text', placeholder: 'Örn: Zeynep Kaya', required: true },
      { name: 'seviye', label: 'Eğitim Kademesi', type: 'select', options: [
        { label: 'Tüm Kademeler', value: 'ALL' },
        { label: 'Lise (Ortaöğretim)', value: 'HIGH_SCHOOL' },
        { label: 'Ön Lisans', value: 'ASSOCIATE' },
        { label: 'Lisans', value: 'BACHELOR' }
      ]},
    ],
    samplePayload: { ogrenciAdSoyad: 'Zeynep Kaya', seviye: 'BACHELOR' },
  },
  {
    id: 'q-egitim-gecmis',
    name: 'Eğitim Geçmiş Sorgu',
    category: 'EGITIM',
    minRole: 'PREMIUM',
    description: 'Tüm akademik kariyer, okul nakilleri, hazırlık sınıfı ve yatay geçiş tarihçesi.',
    layoutType: 'timeline',
    fields: [
      { name: 'ogrenciRefNo', label: 'Öğrenci Referans No', type: 'text', placeholder: 'Örn: STU-2022-9102', required: true },
    ],
    samplePayload: { ogrenciRefNo: 'STU-2022-9102' },
  },
  {
    id: 'q-egitim-okul',
    name: 'Okul Sorgu',
    category: 'EGITIM',
    minRole: 'FREE',
    description: 'MEB/YÖK kurum kodu, fakülte, bölüm ve akreditasyon durumu simülasyonu.',
    layoutType: 'tabular',
    fields: [
      { name: 'kurumAdi', label: 'Eğitim Kurumu Adı', type: 'text', placeholder: 'Örn: Boğaziçi Üniversitesi', required: true },
      { name: 'fakulte', label: 'Fakülte', type: 'text', placeholder: 'Örn: Mühendislik Fakültesi' },
    ],
    samplePayload: { kurumAdi: 'Boğaziçi Üniversitesi', fakulte: 'Mühendislik Fakültesi' },
  },
  {
    id: 'q-egitim-diploma',
    name: 'Diploma Sorgu',
    category: 'EGITIM',
    minRole: 'VIP',
    description: 'YÖKSİS diploma doğrulama kodu, mezuniyet not ortalaması (GPA) ve tescil no.',
    layoutType: 'education-diploma',
    fields: [
      { name: 'diplomaNo', label: 'Diploma / Barkod Doğrulama No', type: 'text', placeholder: 'Örn: DIP-2024-ENG-0081', required: true },
    ],
    samplePayload: { diplomaNo: 'DIP-2024-ENG-0081' },
  },
  {
    id: 'q-egitim-mesleki-gecmis',
    name: 'Mesleki Geçmiş Sorgu',
    category: 'EGITIM',
    minRole: 'VIP',
    description: 'SGK 4A/4B/4C hizmet dökümü prim günleri, meslek kodu ve kıdem kronolojisi.',
    layoutType: 'timeline',
    fields: [
      { name: 'calisanAdSoyad', label: 'Çalışan Ad Soyad', type: 'text', placeholder: 'Örn: Engin Doğan', required: true },
      { name: 'meslekKodu', label: 'İşkur / SGK Meslek Kodu', type: 'text', placeholder: 'Örn: 2512.01 (Yazılım Geliştirici)' },
    ],
    samplePayload: { calisanAdSoyad: 'Engin Doğan', meslekKodu: '2512.01 (Yazılım Geliştirici)' },
  },

  // [11] YASAL & ADLİ (15)
  {
    id: 'q-yasal-sabika',
    name: 'Sabıka Sorgu',
    category: 'YASAL',
    minRole: 'FREE',
    description: 'Adli sicil kaydı var/yok durumu ve resmi kurumlar için sorgulama simülasyonu.',
    layoutType: 'legal-case',
    fields: [
      { name: 'adSoyad', label: 'Kişi Ad Soyad', type: 'text', placeholder: 'Örn: Cenk Keskin', required: true },
      { name: 'talepNedeni', label: 'Veriliş Amacı', type: 'select', options: [
        { label: 'Resmi Kurum', value: 'OFFICIAL' },
        { label: 'Özel Sektör İşe Giriş', value: 'PRIVATE' },
        { label: 'Vize Başvurusu', value: 'VISA' }
      ], required: true },
    ],
    samplePayload: { adSoyad: 'Cenk Keskin', talepNedeni: 'OFFICIAL' },
  },
  {
    id: 'q-yasal-sabika-detay',
    name: 'Sabıka Detay Sorgu',
    category: 'YASAL',
    minRole: 'PREMIUM',
    description: 'Varsa kanun maddesi, ceza süresi, tecil veya erteleme şartları simülasyonu.',
    layoutType: 'legal-case',
    fields: [
      { name: 'sicilRefNo', label: 'Adli Sicil Belge Referansı', type: 'text', placeholder: 'Örn: ASC-2025-9921', required: true },
    ],
    samplePayload: { sicilRefNo: 'ASC-2025-9921' },
  },
  {
    id: 'q-yasal-adli-dosya',
    name: 'Adli Dosya Sorgu',
    category: 'YASAL',
    minRole: 'PREMIUM',
    description: 'UYAP simülasyonu adliye, dosya türü (Ceza/Hukuk/İcra) ve esas numarası.',
    layoutType: 'legal-case',
    fields: [
      { name: 'adliye', label: 'Adliye', type: 'text', placeholder: 'Örn: İstanbul Anadolu Adliyesi', required: true },
      { name: 'esasYil', label: 'Esas Yıl', type: 'number', placeholder: '2024', required: true },
      { name: 'esasNo', label: 'Esas No', type: 'number', placeholder: '1420', required: true },
    ],
    samplePayload: { adliye: 'İstanbul Anadolu Adliyesi', esasYil: '2024', esasNo: '1420' },
  },
  {
    id: 'q-yasal-adli-arsiv',
    name: 'Adli Arşiv Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'Zamanaşımına uğramış veya infazı tamamlanarak arşive kaldırılmış dosya kayıtları.',
    layoutType: 'legal-case',
    fields: [
      { name: 'arsivDosyaNo', label: 'Arşiv Dosya No', type: 'text', placeholder: 'Örn: ARS-2018-8812', required: true },
    ],
    samplePayload: { arsivDosyaNo: 'ARS-2018-8812' },
  },
  {
    id: 'q-yasal-sorusturma',
    name: 'Soruşturma Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'Cumhuriyet Başsavcılığı hazırlık soruşturma numarası (CBS Hz.) durum takibi.',
    layoutType: 'legal-case',
    fields: [
      { name: 'cbsHazirlikNo', label: 'CBS Soruşturma No (Örn: 2025/10492 Hz.)', type: 'text', placeholder: '2025/10492 Hz.', required: true },
    ],
    samplePayload: { cbsHazirlikNo: '2025/10492 Hz.' },
  },
  {
    id: 'q-yasal-sorusturma-gecmis',
    name: 'Soruşturma Geçmiş Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'KYOK (Kovuşturmaya Yer Olmadığına Dair Karar) veya iddianame tanzim süreci.',
    layoutType: 'timeline',
    fields: [
      { name: 'dosyaRef', label: 'Soruşturma Dosya Ref', type: 'text', placeholder: 'Örn: SOR-TR-2023-41', required: true },
    ],
    samplePayload: { dosyaRef: 'SOR-TR-2023-41' },
  },
  {
    id: 'q-yasal-dava',
    name: 'Dava Sorgu',
    category: 'YASAL',
    minRole: 'FREE',
    description: 'Taraf olunan aktif hukuk veya ceza davalarının mahkeme ve duruşma listesi.',
    layoutType: 'legal-case',
    fields: [
      { name: 'tarafAdSoyad', label: 'Taraf / Şahıs Adı', type: 'text', placeholder: 'Örn: Emre Şimşek', required: true },
      { name: 'davaTuru', label: 'Dava Türü', type: 'select', options: [
        { label: 'Tümü', value: 'ALL' },
        { label: 'Asliye Hukuk Mahkemesi', value: 'ASLIYE_HUKUK' },
        { label: 'Asliye Ceza Mahkemesi', value: 'ASLIYE_CEZA' },
        { label: 'İş Mahkemesi', value: 'IS' }
      ]},
    ],
    samplePayload: { tarafAdSoyad: 'Emre Şimşek', davaTuru: 'ASLIYE_HUKUK' },
  },
  {
    id: 'q-yasal-dava-dosyasi',
    name: 'Dava Dosyası Sorgu',
    category: 'YASAL',
    minRole: 'PREMIUM',
    description: 'Dava tensip zaptı, bilirkişi raporu gelişi ve son celse tutanağı simülasyonu.',
    layoutType: 'legal-case',
    fields: [
      { name: 'dosyaBarkod', label: 'Dosya UYAP Barkod No', type: 'text', placeholder: 'Örn: 991284918231', required: true },
    ],
    samplePayload: { dosyaBarkod: '991284918231' },
  },
  {
    id: 'q-yasal-mahkeme',
    name: 'Mahkeme Sorgu',
    category: 'YASAL',
    minRole: 'FREE',
    description: 'Mahkeme teşkilat birimleri, duruşma salonu ve nöbet çizelgesi sorgusu.',
    layoutType: 'tabular',
    fields: [
      { name: 'mahkemeAdi', label: 'Mahkeme Birimi', type: 'text', placeholder: 'Örn: Bakırköy 2. Ağır Ceza Mahkemesi', required: true },
    ],
    samplePayload: { mahkemeAdi: 'Bakırköy 2. Ağır Ceza Mahkemesi' },
  },
  {
    id: 'q-yasal-mahkeme-karar',
    name: 'Mahkeme Karar Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'Gerekçeli karar metni, istinaf/temyiz kesinleşme şerhi simülasyonu.',
    layoutType: 'legal-case',
    fields: [
      { name: 'kararYil', label: 'Karar Yılı', type: 'number', placeholder: '2024', required: true },
      { name: 'kararNo', label: 'Karar No', type: 'number', placeholder: '512', required: true },
    ],
    samplePayload: { kararYil: '2024', kararNo: '512' },
  },
  {
    id: 'q-yasal-ifade',
    name: 'İfade Sorgu',
    category: 'YASAL',
    minRole: 'ULTRA',
    description: 'Kolluk veya savcılık müşteki/şüpheli ifade tutanağı tescil özeti.',
    layoutType: 'legal-case',
    fields: [
      { name: 'ifadeTutanakNo', label: 'Tutanak Kayıt No', type: 'text', placeholder: 'Örn: IFD-2025-0981', required: true },
    ],
    samplePayload: { ifadeTutanakNo: 'IFD-2025-0981' },
  },
  {
    id: 'q-yasal-suc-kaydi',
    name: 'Suç Kaydı Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'TCK kurgusal madde tasnifi (Örn: TCK Md. 141, 157 simülasyonu) ve yaptırım türü.',
    layoutType: 'tabular',
    fields: [
      { name: 'tckMadde', label: 'TCK Kanun Maddesi Simülasyonu', type: 'text', placeholder: 'Örn: TCK 157 (Basit Dolandırıcılık Testi)', required: true },
    ],
    samplePayload: { tckMadde: 'TCK 157 (Basit Dolandırıcılık Testi)' },
  },
  {
    id: 'q-yasal-gbt',
    name: 'GBT Sorgu',
    category: 'YASAL',
    minRole: 'VIP',
    description: 'Genel Bilgi Toplama (GBT) güvenlik sorgusu simülatörü (Temiz / Aranıyor kontrolü).',
    layoutType: 'legal-case',
    fields: [
      { name: 'adSoyad', label: 'Şahıs Ad Soyad', type: 'text', placeholder: 'Örn: Serdar Koçak', required: true },
      { name: 'dogumYili', label: 'Doğum Yılı', type: 'number', placeholder: '1992', required: true },
    ],
    samplePayload: { adSoyad: 'Serdar Koçak', dogumYili: '1992' },
  },
  {
    id: 'q-yasal-yakalama-karari',
    name: 'Yakalama Kararı Sorgu',
    category: 'YASAL',
    minRole: 'ULTRA',
    description: 'Mahkemece verilen yakalama emri, infaz bürosu müzekkeresi simülasyonu.',
    layoutType: 'legal-case',
    fields: [
      { name: 'muzekkereNo', label: 'Yakalama Müzekkere No', type: 'text', placeholder: 'Örn: YKM-2025-4412', required: true },
    ],
    samplePayload: { muzekkereNo: 'YKM-2025-4412' },
  },
  {
    id: 'q-yasal-arama-kaydi',
    name: 'Arama Kaydı Sorgu',
    category: 'YASAL',
    minRole: 'ULTRA',
    description: 'CMK 116 kapsamında konut, işyeri veya üst arama kararı tescil simülatörü.',
    layoutType: 'legal-case',
    fields: [
      { name: 'aramaKararNo', label: 'Arama Karar Referansı', type: 'text', placeholder: 'Örn: ARM-SULH-2025-99', required: true },
    ],
    samplePayload: { aramaKararNo: 'ARM-SULH-2025-99' },
  },

  // [12] SİSTEM & YÖNETİM (10)
  {
    id: 'q-sistem-erisim-log',
    name: 'Sistem Erişim Log Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Platform IP adresi, user-agent ve oturum açma/kapatma erişim kayıtları.',
    layoutType: 'system-logs',
    fields: [
      { name: 'ipFiltre', label: 'Simüle IP Filtresi', type: 'text', placeholder: 'Örn: 192.168.1.1' },
      { name: 'durum', label: 'Giriş Durumu', type: 'select', options: [
        { label: 'Tüm Olaylar', value: 'ALL' },
        { label: 'Başarılı (200 OK)', value: 'SUCCESS' },
        { label: 'Başarısız (401 Unauthorized)', value: 'FAILED' }
      ]},
    ],
    samplePayload: { ipFiltre: '192.168.1.1', durum: 'ALL' },
  },
  {
    id: 'q-sistem-oturum-log',
    name: 'Kullanıcı Oturum Log Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Aktif ve sonlandırılmış JWT oturum tokenları, oturum süreleri ve cihaz türleri.',
    layoutType: 'system-logs',
    fields: [
      { name: 'hedefKullanici', label: 'Kullanıcı Adı', type: 'text', placeholder: 'Örn: admin' },
    ],
    samplePayload: { hedefKullanici: 'admin' },
  },
  {
    id: 'q-sistem-yetki-degisiklik-log',
    name: 'Yetki Değişiklik Log Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Kullanıcı rolünün FREE, VIP veya ADMIN olarak değiştirilme denetim izi.',
    layoutType: 'timeline',
    fields: [
      { name: 'degisiklikTuru', label: 'Rol Türü', type: 'select', options: [
        { label: 'Tümü', value: 'ALL' },
        { label: 'Yükseltme (Promotion)', value: 'UPGRADE' },
        { label: 'Düşürme (Downgrade)', value: 'DOWNGRADE' }
      ]},
    ],
    samplePayload: { degisiklikTuru: 'ALL' },
  },
  {
    id: 'q-sistem-rol-atama-gecmis',
    name: 'Rol Atama Geçmiş Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Hangi yönetici tarafından hangi kullanıcıya ne zaman yetki atandığı günlüğü.',
    layoutType: 'tabular',
    fields: [
      { name: 'atayanYonetici', label: 'Atayan Yönetici', type: 'text', placeholder: 'Örn: SuperAdmin' },
    ],
    samplePayload: { atayanYonetici: 'SuperAdmin' },
  },
  {
    id: 'q-sistem-denetim-kaydi',
    name: 'Denetim Kaydı Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Değiştirilemez SHA-256 hash imzalı sistem denetim (audit) log kaydı.',
    layoutType: 'system-logs',
    fields: [
      { name: 'modulAdi', label: 'Modül', type: 'text', placeholder: 'Örn: QUERY_ENGINE' },
      { name: 'olayTuru', label: 'Olay Seviyesi', type: 'select', options: [
        { label: 'Tüm Seviyeler', value: 'ALL' },
        { label: 'Kritik (CRITICAL)', value: 'CRITICAL' },
        { label: 'Uyarı (WARNING)', value: 'WARNING' },
        { label: 'Bilgi (INFO)', value: 'INFO' }
      ]},
    ],
    samplePayload: { modulAdi: 'QUERY_ENGINE', olayTuru: 'ALL' },
  },
  {
    id: 'q-sistem-islem-onay-gecmis',
    name: 'İşlem Onay Geçmiş Sorgu',
    category: 'SISTEM',
    minRole: 'YONETICI',
    description: 'Çift aşamalı yönetici onayı (4-eyes principle) gerektiren işlemler listesi.',
    layoutType: 'tabular',
    fields: [
      { name: 'onayReferans', label: 'Onay Talep No', type: 'text', placeholder: 'Örn: APP-2026-0041' },
    ],
    samplePayload: { onayReferans: 'APP-2026-0041' },
  },
  {
    id: 'q-sistem-abonelik-anahtar',
    name: 'Abonelik Anahtar Sorgu',
    category: 'SISTEM',
    minRole: 'YONETICI',
    description: 'Lisans anahtarlarının seri no, kalan gün sayısı ve geçerlilik kontrolü.',
    layoutType: 'tabular',
    fields: [
      { name: 'keyPattern', label: 'Anahtar Kodu / Maske', type: 'text', placeholder: 'Örn: NEXUX-VIP-****', required: true },
    ],
    samplePayload: { keyPattern: 'NEXUX-VIP-****' },
  },
  {
    id: 'q-sistem-abonelik-kullanim',
    name: 'Abonelik Kullanım Sorgu',
    category: 'SISTEM',
    minRole: 'YONETICI',
    description: 'Kullanıcının kota doluluk oranı, kalan günlük sorgu hakkı ve kullanım istatistiği.',
    layoutType: 'tabular',
    fields: [
      { name: 'kullaniciId', label: 'Kullanıcı Adı / ID', type: 'text', placeholder: 'Örn: user_vip_01', required: true },
    ],
    samplePayload: { kullaniciId: 'user_vip_01' },
  },
  {
    id: 'q-sistem-odeme-gecmis',
    name: 'Ödeme Geçmiş Sorgu',
    category: 'SISTEM',
    minRole: 'YONETICI',
    description: 'Sentetik sanal POS provizyon kodları, fatura dökümleri ve iade simülasyonu.',
    layoutType: 'financial-statement',
    fields: [
      { name: 'siparisNo', label: 'Sentetik Sipariş / İşlem No', type: 'text', placeholder: 'Örn: ORD-2026-9901', required: true },
    ],
    samplePayload: { siparisNo: 'ORD-2026-9901' },
  },
  {
    id: 'q-sistem-paket-yetki-eslestirme',
    name: 'Paket Yetki Eşleştirme Sorgu',
    category: 'SISTEM',
    minRole: 'ADMIN',
    description: 'Paket katmanları (FREE, VIP, ULTRA) ile 101 sorgu arasındaki erişim matrisi.',
    layoutType: 'tabular',
    fields: [
      { name: 'paketKodu', label: 'Paket Adı', type: 'select', options: [
        { label: 'Tüm Paketler', value: 'ALL' },
        { label: 'FREE (Temel)', value: 'FREE' },
        { label: 'PREMIUM (Genişletilmiş)', value: 'PREMIUM' },
        { label: 'VIP (İleri Seviye)', value: 'VIP' },
        { label: 'ULTRA (Tam Kapsam)', value: 'ULTRA' }
      ], required: true },
    ],
    samplePayload: { paketKodu: 'ALL' },
  },
];

// PROGRAMMATIC CATALOG VALIDATION
// Verifies exactly 12 categories, exactly 101 queries, no duplicates, no missing.
export function validateCatalog(): {
  isValid: boolean;
  categoryCount: number;
  queryCount: number;
  duplicateNames: string[];
  duplicateIds: string[];
} {
  const categoryCount = CATEGORIES.length;
  const queryCount = QUERIES.length;

  const nameMap = new Map<string, number>();
  const idMap = new Map<string, number>();
  const duplicateNames: string[] = [];
  const duplicateIds: string[] = [];

  for (const q of QUERIES) {
    const nCount = (nameMap.get(q.name) || 0) + 1;
    nameMap.set(q.name, nCount);
    if (nCount === 2) duplicateNames.push(q.name);

    const iCount = (idMap.get(q.id) || 0) + 1;
    idMap.set(q.id, iCount);
    if (iCount === 2) duplicateIds.push(q.id);
  }

  const isValid =
    categoryCount === 12 &&
    queryCount === 101 &&
    duplicateNames.length === 0 &&
    duplicateIds.length === 0;

  return {
    isValid,
    categoryCount,
    queryCount,
    duplicateNames,
    duplicateIds,
  };
}
