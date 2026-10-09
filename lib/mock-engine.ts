import {
  QueryDefinition,
  SyntheticQueryResult,
  SyntheticMetadata,
  SyntheticResultSummaryItem,
  SyntheticCardItem,
  SyntheticTimelineEvent,
  SyntheticTreeNode,
  MockEngineSettings,
} from './types';

// Deterministic seed generator
export class SeededRandom {
  private seed: number;

  constructor(seedString: string) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    this.seed = Math.abs(hash) || 123456789;
  }

  // Next float [0, 1)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Integer in [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  // Pick one from array
  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }

  // Pick multiple unique
  pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
  }
}

// Fictional dataset constants (completely synthetic)
const MOCK_NAMES_MALE = ['Kerem', 'Deniz', 'Barış', 'Alp', 'Cem', 'Mert', 'Kaan', 'Tolga', 'Arda', 'Sarp'];
const MOCK_NAMES_FEMALE = ['Elif', 'Derin', 'Ece', 'Selin', 'Defne', 'Aylin', 'Nazlı', 'Duru', 'Cansu', 'Aslı'];
const MOCK_SURNAMES = ['Demir', 'Yılmaz', 'Kaya', 'Şahin', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan'];
const MOCK_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Eskişehir', 'Trabzon', 'Gaziantep', 'Muğla'];
const MOCK_DISTRICTS: Record<string, string[]> = {
  İstanbul: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy', 'Şişli', 'Beyoğlu', 'Sarıyer'],
  Ankara: ['Çankaya', 'Yenimahalle', 'Keçiören', 'Etimesgut'],
  İzmir: ['Konak', 'Bornova', 'Karşıyaka', 'Urla', 'Çeşme'],
  Antalya: ['Muratpaşa', 'Konyaaltı', 'Alanya', 'Kemer'],
};

export function generateSyntheticResult(
  query: QueryDefinition,
  inputs: Record<string, string>,
  settings: MockEngineSettings = {
    delayMs: 400,
    simulateFailureRate: 0,
    deterministicSeed: true,
    maintenanceMode: false,
    rateLimitPerMinute: 60,
  }
): Promise<SyntheticQueryResult> {
  return new Promise((resolve) => {
    // Generate deterministic seed key
    const rawInputKey = Object.entries(inputs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    const seedStr = settings.deterministicSeed
      ? `${query.id}::${rawInputKey}`
      : `${query.id}::${rawInputKey}::${Date.now()}`;

    const rng = new SeededRandom(seedStr);

    // Random execution time simulation
    const execTime = rng.nextInt(60, 240);

    setTimeout(() => {
      // Simulate failure if configured
      if (settings.simulateFailureRate > 0 && rng.nextInt(1, 100) <= settings.simulateFailureRate) {
        resolve({
          meta: createSyntheticMeta(query, execTime, rng),
          inputs,
          status: 'SIMULATED_ERROR',
          errorMessage: 'Sentetik Veri Motoru Test Simülasyon Hatası: Girdi doğrulama parametresi veya geçici sunucu simülasyonu başarısız.',
          summary: [{ label: 'Hata Kodu', value: 'ERR_SIM_TIMEOUT', isHighlight: true }],
          cards: [],
          tableHeaders: [],
          tableRows: [],
          rawJson: { error: true, code: 'ERR_SIM_TIMEOUT', inputs },
        });
        return;
      }

      // Check empty input simulation (if all inputs are empty or "yok")
      const allEmpty = Object.values(inputs).every((v) => !v || v.trim() === '');
      if (allEmpty) {
        resolve({
          meta: createSyntheticMeta(query, execTime, rng),
          inputs,
          status: 'NO_DATA',
          summary: [{ label: 'Durum', value: 'Kayıt Bulunamadı', badge: 'BOŞ SONUÇ' }],
          cards: [],
          tableHeaders: ['Açıklama'],
          tableRows: [['Girilen kriterlere uygun sentetik kayıt üretilemedi. Lütfen parametreleri kontrol ediniz.']],
          rawJson: { found: false, message: 'No records generated for empty input' },
        });
        return;
      }

      // Generate tailored results based on category & layoutType
      const result = buildCategorySpecificResult(query, inputs, rng, execTime);
      resolve(result);
    }, settings.delayMs);
  });
}

function createSyntheticMeta(query: QueryDefinition, execTime: number, rng: SeededRandom): SyntheticMetadata {
  const refCode = `DEMO-REF-${rng.nextInt(100000, 999999)}-${query.category.slice(0, 3)}`;
  return {
    mode: 'DEMO',
    synthetic: true,
    source: 'SYNTHETIC_DATA_ENGINE',
    generatedAt: new Date().toISOString(),
    queryType: query.id,
    queryName: query.name,
    requestReference: refCode,
    executionTimeMs: execTime,
    engineVersion: 'NexuXTanrı-MockCore-v2.6.4-SECURE',
  };
}

function buildCategorySpecificResult(
  query: QueryDefinition,
  inputs: Record<string, string>,
  rng: SeededRandom,
  execTime: number
): SyntheticQueryResult {
  const meta = createSyntheticMeta(query, execTime, rng);
  const city = inputs.il || inputs.sehir || rng.pick(MOCK_CITIES);
  const districtList = MOCK_DISTRICTS[city] || ['Merkez', 'Gazi', 'Cumhuriyet'];
  const district = inputs.ilce || rng.pick(districtList);
  const inputName = inputs.ad || inputs.kisiAdSoyad || inputs.adSoyad || inputs.merkezKisi || inputs.haneReisi || `${rng.pick(MOCK_NAMES_MALE)} ${rng.pick(MOCK_SURNAMES)}`;
  const inputSurname = inputs.soyad || (inputName.includes(' ') ? inputName.split(' ').slice(1).join(' ') : rng.pick(MOCK_SURNAMES));

  let summary: SyntheticResultSummaryItem[] = [];
  let cards: SyntheticCardItem[] = [];
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let timeline: SyntheticTimelineEvent[] | undefined = undefined;
  let treeData: SyntheticTreeNode[] | undefined = undefined;
  let legalDossier: SyntheticQueryResult['legalDossier'] | undefined = undefined;

  // ROUTE ACCORDING TO CATEGORY & LAYOUT
  switch (query.category) {
    case 'KIMLIK': {
      summary = [
        { label: 'Sentetik Kimlik No', value: `DEMO-TC-${rng.nextInt(100000000, 999999999)}`, isHighlight: true },
        { label: 'Ad & Soyad', value: `${inputName} ${inputSurname}` },
        { label: 'Tescil İli/İlçesi', value: `${city} / ${district}` },
        { label: 'Kayıt Durumu', value: 'AKTİF (Sentetik Demo)', badge: 'DOĞRULANDI' },
      ];
      cards = [
        {
          title: 'Kurgusal Nüfus Kütük Detayı',
          subtitle: 'MERNİS Simülasyon Kütüğü',
          status: 'NORMAL',
          attributes: [
            { label: 'Cilt No', value: `CLT-${rng.nextInt(10, 99)}` },
            { label: 'Aile Sıra No', value: `AS-${rng.nextInt(100, 999)}` },
            { label: 'Birey Sıra No', value: `${rng.nextInt(1, 15)}` },
            { label: 'Doğum Tarihi', value: `${rng.nextInt(1, 28)}.${rng.nextInt(1, 12)}.${rng.nextInt(1975, 2004)}` },
            { label: 'Doğum Yeri', value: `${city}` },
            { label: 'Medeni Hal', value: rng.pick(['Evli', 'Bekar', 'Boşanmış']) },
          ],
        },
        {
          title: 'Sentetik Çipli Kimlik Kartı Bilgileri',
          subtitle: 'EGM / NVİ Simülasyonu',
          status: 'SUCCESS',
          attributes: [
            { label: 'Seri No', value: `DEMO-${rng.pick(['A', 'B', 'C'])}${rng.nextInt(10, 99)}B${rng.nextInt(10000, 99999)}` },
            { label: 'Son Geçerlilik', value: `203${rng.nextInt(0, 5)}-12-31` },
            { label: 'Veren Makam', value: `${city} Valiliği İl Nüfus Md.` },
            { label: 'Biyometrik Veri', value: 'SENTETİK TESCİLLİ' },
          ],
        },
      ];
      tableHeaders = ['Kayıt Türü', 'Açıklama', 'Tescil Tarihi', 'Müdürlük', 'Durum'];
      tableRows = [
        ['Doğum Tescili', 'İlk kütük tescil kaydı tamamlandı', `199${rng.nextInt(0, 9)}-06-12`, `${district} İlçe Nüfus`, 'Onaylı'],
        ['Kimlik Yenileme', 'Yeni tip çipli kimlik kartı teslim edildi', `202${rng.nextInt(0, 4)}-02-19`, `${district} İlçe Nüfus`, 'Teslim Edildi'],
        ['Adres Beyanı', 'Birincil ikametgah kaydı güncellendi', `2024-09-01`, `${district} İlçe Nüfus`, 'İşlendi'],
      ];
      if (query.layoutType === 'timeline') {
        timeline = [
          { date: '2024-03-12', title: 'Soyadı Tescil Düzeltmesi', description: 'Mahkeme/nüfus kararı ile ek soyadı birleşimi tescil edildi.', category: 'KÜTÜK' },
          { date: '2021-11-04', title: 'Yeni Tip Çipli Kimlik Kartı Tanzimi', description: 'Biyometrik fotoğraf güncellemesi ve kart teslimi.', category: 'KİMLİK' },
          { date: '2016-08-20', title: 'Nüfus Nakil İşlemi', description: 'Farklı kütük ilçesine aile kütüğü nakli tamamlandı.', category: 'NAKİL' },
        ];
      }
      break;
    }

    case 'AILE': {
      summary = [
        { label: 'Hane Kodu', value: `FAM-TR-${rng.nextInt(10000, 99999)}`, isHighlight: true },
        { label: 'Aile Reisi', value: inputName },
        { label: 'Hane Birey Sayısı', value: `${rng.nextInt(3, 7)} Kişi` },
        { label: 'Kütük İli', value: city },
      ];
      cards = [
        {
          title: 'Hane Bireyleri Sentetik Dağılımı',
          subtitle: 'Çekirdek & Genişletilmiş Aile',
          status: 'NORMAL',
          attributes: [
            { label: 'Eş', value: `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname}` },
            { label: '1. Çocuk', value: `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname} (Sentetik)` },
            { label: '2. Çocuk', value: `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname} (Sentetik)` },
            { label: 'Anne Adı', value: rng.pick(MOCK_NAMES_FEMALE) },
            { label: 'Baba Adı', value: rng.pick(MOCK_NAMES_MALE) },
          ],
        },
      ];
      tableHeaders = ['Yakınlık', 'Ad Soyad', 'Doğum Yılı', 'Medeni Hal', 'Yaşadığı İl'];
      tableRows = [
        ['Kendisi', inputName, '1985', 'Evli', city],
        ['Eşi', `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname}`, '1988', 'Evli', city],
        ['Çocuğu', `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname}`, '2015', 'Bekar', city],
        ['Çocuğu', `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname}`, '2019', 'Bekar', city],
        ['Babası', `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname}`, '1958', 'Evli', city],
        ['Annesi', `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname}`, '1961', 'Evli', city],
      ];
      treeData = [
        {
          id: '1',
          relation: 'Dede (Baba Tarafı)',
          name: `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname}`,
          birthYear: '1932',
          status: 'Vefat',
          children: [
            {
              id: '2',
              relation: 'Baba',
              name: `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname}`,
              birthYear: '1958',
              status: 'Sağ',
              children: [
                {
                  id: '3',
                  relation: 'Merkez Kişi',
                  name: inputName,
                  birthYear: '1985',
                  status: 'Sağ',
                  children: [
                    { id: '4', relation: 'Çocuk 1', name: `${rng.pick(MOCK_NAMES_MALE)} ${inputSurname}`, birthYear: '2015', status: 'Sağ' },
                    { id: '5', relation: 'Çocuk 2', name: `${rng.pick(MOCK_NAMES_FEMALE)} ${inputSurname}`, birthYear: '2019', status: 'Sağ' },
                  ],
                },
              ],
            },
          ],
        },
      ];
      break;
    }

    case 'ADRES': {
      summary = [
        { label: 'UAVT Adres Kodu', value: `UAVT-${rng.nextInt(10000000, 99999999)}`, isHighlight: true },
        { label: 'İkametgah Durumu', value: 'MERNİS Tescilli Aktif', badge: 'DAİMİ' },
        { label: 'Şehir & İlçe', value: `${city} / ${district}` },
        { label: 'Taşınma Tarihi', value: `202${rng.nextInt(1, 4)}-0${rng.nextInt(1, 9)}-15` },
      ];
      cards = [
        {
          title: 'Resmi Açık Adres Formasyonu',
          subtitle: 'MERNİS Mekansal Adres Kayıt Sistemi (MAKS)',
          status: 'NORMAL',
          attributes: [
            { label: 'Mahalle', value: `${district} Atatürk Mah.` },
            { label: 'Cadde / Sokak', value: `Barış Manço Cad. No: ${rng.nextInt(12, 88)}` },
            { label: 'İç Kapı No', value: `Daire: ${rng.nextInt(1, 24)}` },
            { label: 'Posta Kodu', value: `34${rng.nextInt(100, 999)}` },
            { label: 'Bina Yaşı', value: `${rng.nextInt(2, 18)} Yıl` },
            { label: 'Deprem Riski', value: 'Sentetik Analiz: Düşük' },
          ],
        },
      ];
      tableHeaders = ['Dönem', 'Adres Detayı', 'İl / İlçe', 'İkamet Türü', 'Kayıt Durumu'];
      tableRows = [
        ['2023 - Günümüz', `Atatürk Mah. Barış Manço Cad. No:${rng.nextInt(10, 50)}`, `${city} / ${district}`, 'Birincil Daimi', 'Aktif'],
        ['2019 - 2023', `Caferağa Mah. Moda Cad. No:${rng.nextInt(5, 30)}`, `${city} / Kadıköy`, 'Birincil Daimi', 'Eski Kayıt'],
        ['2015 - 2019', `Gazi Mustafa Kemal Bulvarı No:${rng.nextInt(20, 90)}`, `Ankara / Çankaya`, 'Öğrenci / Geçici', 'Eski Kayıt'],
      ];
      timeline = [
        { date: '2023-08-15', title: 'İkametgah Nakli Tescili', description: `${city} ${district} yeni ikamet adresine taşınma beyanı.`, category: 'MERNİS' },
        { date: '2019-06-01', title: 'Kira Sözleşmesi & Adres Tescili', description: `Kadıköy adresine tescil işlemi tamamlandı.`, category: 'MERNİS' },
        { date: '2015-09-10', title: 'İlk İkametgah Ayrımı', description: `Üniversite dönemi Ankara adresi tescili.`, category: 'MERNİS' },
      ];
      break;
    }

    case 'ILETISIM': {
      const gsmMock = inputs.gsmNo || `0555 ${rng.nextInt(100, 999)} ${rng.nextInt(10, 99)} ${rng.nextInt(10, 99)}`;
      summary = [
        { label: 'GSM Numarası', value: gsmMock, isHighlight: true },
        { label: 'Operatör Şebekesi', value: rng.pick(['Turkcell (MOCK)', 'Vodafone (MOCK)', 'Türk Telekom (MOCK)']) },
        { label: 'Hat Statüsü', value: 'Aktif - Faturalı Bireysel', badge: 'AKTİF' },
        { label: 'Tescil Tarihi', value: `201${rng.nextInt(5, 9)}-04-12` },
      ];
      cards = [
        {
          title: 'Hat ve Cihaz Eşleşme Simülasyonu',
          subtitle: 'BTK & Operatör Sentetik Protokolü',
          status: 'SUCCESS',
          attributes: [
            { label: 'Sentetik IMSI', value: `2860100${rng.nextInt(10000000, 99999999)}` },
            { label: 'Sentetik IMEI', value: `35${rng.nextInt(1000000000000, 9999999999999)}` },
            { label: 'Cihaz Modeli', value: rng.pick(['Apple iPhone 15 Pro (Simüle)', 'Samsung Galaxy S24 (Simüle)', 'Xiaomi 13T (Simüle)']) },
            { label: 'Numara Taşıma (MNP)', value: '1 Kez Taşıma Kaydı' },
            { label: 'Roaming Durumu', value: 'Yurtdışı Açık' },
          ],
        },
      ];
      tableHeaders = ['İşlem Tarihi', 'Operatör', 'Hat Tipi', 'Kayıt Türü', 'Durum'];
      tableRows = [
        [`2024-01-10`, 'Operatör Alpha', 'Faturalı 25GB', 'Tarife Değişikliği', 'Tamamlandı'],
        [`2021-06-20`, 'Operatör Beta', 'Faturalı 15GB', 'Numara Taşıma (MNP)', 'Aktarıldı'],
        [`2017-04-12`, 'Operatör Gamma', 'Faturasız', 'İlk Hat Aktivasyonu', 'Arşiv'],
      ];
      break;
    }

    case 'SAGLIK': {
      summary = [
        { label: 'e-Nabız Dosya Kodu', value: `NABIZ-TR-${rng.nextInt(100000, 999999)}`, isHighlight: true },
        { label: 'Kan Grubu', value: rng.pick(['A Rh(+)', '0 Rh(+)', 'B Rh(+)', 'AB Rh(+)']) },
        { label: 'Aile Hekimi', value: `Dr. ${rng.pick(MOCK_NAMES_MALE)} ${rng.pick(MOCK_SURNAMES)} (ASM-${district})` },
        { label: 'Kronik Hastalık Kaydı', value: 'Kayıt Bulunmamaktadır', badge: 'TEMİZ' },
      ];
      cards = [
        {
          title: 'Son Muayene ve Reçete Tescili',
          subtitle: 'Sağlık Bakanlığı Sentetik Veri Portalı',
          status: 'NORMAL',
          attributes: [
            { label: 'Hastane', value: `${city} Şehir Hastanesi Simülatörü` },
            { label: 'Poliklinik', value: rng.pick(['Dahiliye', 'Göz Hastalıkları', 'Ortopedi', 'Kardiyoloji']) },
            { label: 'Sentetik Tanı Kodu', value: `ICD-10: J06.${rng.nextInt(0, 9)} (Akut ÜSYE)` },
            { label: 'Reçete Numarası', value: `RCT-${rng.nextInt(1000, 9999)}-${rng.pick(['A', 'B', 'C'])}` },
            { label: 'Rapor Durumu', value: 'İstirahat Raporu: Yok' },
          ],
        },
      ];
      tableHeaders = ['Tarih', 'Kurum', 'Branş', 'İşlem', 'Hekim'];
      tableRows = [
        ['2025-10-02', `${city} Şehir Hastanesi`, 'Dahiliye', 'Genel Kontrol & Kan Tahlili', 'Uzm. Dr. M. Korkmaz'],
        ['2025-04-14', `${district} 1 Nolu ASM`, 'Aile Hekimliği', 'Mevsimsel Alerji Reçetesi', 'Dr. S. Yılmaz'],
        ['2024-11-20', 'Özel Sentetik Tıp Merkezi', 'Göz Sağlığı', 'Rutin Göz Muayenesi', 'Op. Dr. E. Çetin'],
      ];
      timeline = [
        { date: '2025-10-02', title: 'Laboratuvar Tahlil Onayı', description: 'Biyokimya ve Hemogram parametreleri referans aralığında.', category: 'LAB' },
        { date: '2025-04-14', title: 'E-Reçete Düzenlendi', description: 'Antihistaminik ve burun spreyi eczaneden temin edildi.', category: 'REÇETE' },
        { date: '2024-03-01', title: 'Tetanoz Aşısı Takviye Dozu', description: 'ASM bünyesinde 10 yıllık periyodik aşı yapıldı.', category: 'AŞI' },
      ];
      break;
    }

    case 'SEYAHAT': {
      summary = [
        { label: 'Seyahat Dosya Kodu', value: `TRIP-2026-${rng.nextInt(1000, 9999)}`, isHighlight: true },
        { label: 'Son Hareket Tarihi', value: `2026-0${rng.nextInt(1, 4)}-${rng.nextInt(10, 28)}` },
        { label: 'Seyahat Tipi', value: 'Yurtiçi / Havayolu', badge: 'ONAYLI' },
        { label: 'Bilet PNR Kodu', value: `MOCK-${rng.pick(['X', 'Y', 'Z'])}${rng.nextInt(100, 999)}` },
      ];
      cards = [
        {
          title: 'Ulaşım ve Konaklama Karnesi',
          subtitle: 'KBS & Havayolu Bilet Simülasyonu',
          status: 'SUCCESS',
          attributes: [
            { label: 'Kalkış / Varış', value: `${inputs.kalkis || 'İstanbul (IST)'} ➔ ${inputs.varis || 'Antalya (AYT)'}` },
            { label: 'Uçuş No', value: `TK-${rng.nextInt(2000, 2999)}` },
            { label: 'Koltuk No', value: `${rng.nextInt(4, 28)}${rng.pick(['A', 'B', 'C', 'D', 'F'])}` },
            { label: 'Konaklanan Tesis', value: `${city} Grand Sentetik Resort` },
            { label: 'Giriş / Çıkış', value: '3 Gece / 4 Gün Tam Pansiyon' },
          ],
        },
      ];
      tableHeaders = ['Tarih', 'Nitelik', 'Güzergah / Tesis', 'PNR / Rezervasyon', 'Durum'];
      tableRows = [
        ['2026-02-14', 'Uçuş (THY Simüle)', 'İstanbul (IST) - Antalya (AYT)', `TK-${rng.nextInt(2000, 2500)}`, 'Gerçekleşti'],
        ['2026-02-14', 'Otel Konaklama', 'Lara Palace Sentetik Hotel', 'HTL-88192', 'Check-out Yapıldı'],
        ['2025-09-08', 'TCDD YHT', 'Ankara Gar - İstanbul Söğütlüçeşme', 'YHT-9102', 'Tamamlandı'],
      ];
      break;
    }

    case 'FINANS': {
      const ibanMock = inputs.ibanNo || `TR${rng.nextInt(10, 99)} 0006 2000 ${rng.nextInt(1000, 9999)} ${rng.nextInt(1000, 9999)} ${rng.nextInt(10, 99)}`;
      summary = [
        { label: 'Sentetik IBAN', value: ibanMock, isHighlight: true },
        { label: 'Banka Adı', value: 'Garanti BBVA (MOCK SİMÜLASYONU)' },
        { label: 'Şube', value: `${district} Ticari Şubesi (Kod: ${rng.nextInt(100, 999)})` },
        { label: 'Hesap Statüsü', value: 'Açık / Bireysel Vadesiz TL', badge: 'AKTİF' },
      ];
      cards = [
        {
          title: 'Finansal Varlık ve Kredi Skoru Karnesi',
          subtitle: 'Bankalararası Kart Merkezi & KKB Simülasyonu',
          status: 'SUCCESS',
          attributes: [
            { label: 'Findeks Puanı (Sentetik)', value: `${rng.nextInt(1450, 1850)} / 1900 (Çok İyi)` },
            { label: 'Kredi Kartı Limiti', value: `₺${rng.nextInt(80, 250)}.000 (Simüle)` },
            { label: 'Kredili Mevduat Hesabı', value: '₺25.000 (Açık)' },
            { label: 'Protestolu Senet / Çek', value: 'Yok (Temiz Sicil)' },
            { label: 'Haciz / İcra Blokesi', value: 'Bulunmamaktadır' },
          ],
        },
        {
          title: 'Tapu ve Taşınmaz Mülkiyeti',
          subtitle: 'TAKBİS Kadastro Simülatörü',
          status: 'NORMAL',
          attributes: [
            { label: 'Kayıtlı Taşınmaz', value: '1 Adet Bağımsız Bölüm (Konut)' },
            { label: 'Ada / Parsel', value: `Ada: ${rng.nextInt(100, 500)} / Parsel: ${rng.nextInt(5, 40)}` },
            { label: 'Hisse Oranı', value: '1/1 Tam Mülkiyet' },
            { label: 'Şerh / İpotek', value: 'Konut Kredisi İpoteği (MOCK)' },
          ],
        },
      ];
      tableHeaders = ['Tarih', 'İşlem Tipi', 'Açıklama', 'Tutar (TRY)', 'Bakiye'];
      tableRows = [
        ['2026-03-28', 'FAST Gelen Transfer', 'Sentetik Danışmanlık Hizmet Bedeli', '+₺18.500,00', '₺44.200,00'],
        ['2026-03-24', 'EFT Giden Transfer', 'Kira Ödemesi Sentetik Ev Sahibi', '-₺12.000,00', '₺25.700,00'],
        ['2026-03-15', 'POS Harcama', 'Market & Şarküteri Alışverişi', '-₺1.450,00', '₺37.700,00'],
      ];
      break;
    }

    case 'ARAC': {
      const plakaMock = inputs.plakaNo || `34 ${rng.pick(['MOCK', 'TC', 'CYB', 'NX'])} ${rng.nextInt(100, 999)}`;
      summary = [
        { label: 'Sentetik Plaka', value: plakaMock, isHighlight: true },
        { label: 'Marka & Model', value: inputs.markaModel || 'BMW 320i M Sport' },
        { label: 'Model Yılı', value: inputs.modelYili || '2023' },
        { label: 'Tescil İli', value: 'İstanbul' },
      ];
      cards = [
        {
          title: 'EGM Araç Tescil ve Sicil Kartı',
          subtitle: 'Trafik Tescil Şube Müdürlüğü Simülatörü',
          status: 'NORMAL',
          attributes: [
            { label: 'Şasi No', value: `WBA3A5C55FP${rng.nextInt(100000, 999999)}` },
            { label: 'Motor No', value: `B48B20A-${rng.nextInt(10000, 99999)}` },
            { label: 'Renk', value: rng.pick(['Metalik Gri', 'Safir Siyah', 'Alpin Beyaz', 'Portimao Mavi']) },
            { label: 'Yakıt Türü', value: 'Benzin / Hibrit' },
            { label: 'Araç Cinsi', value: 'Otomobil (Sedan)' },
            { label: 'Hak Mahrumiyeti', value: 'Rehin / Haciz Kaydı Yok' },
          ],
        },
        {
          title: 'TÜVTÜRK & Sigorta Bilgi Merkezi (SBM)',
          subtitle: 'Kasko, Trafik & Muayene Simülasyonu',
          status: 'SUCCESS',
          attributes: [
            { label: 'Zorunlu Trafik Sigortası', value: 'Aktif (Allianz Sigorta Simüle)' },
            { label: 'Poliçe No', value: `POL-ZTS-2025-${rng.nextInt(10000, 99999)}` },
            { label: 'Kasko Hasarsızlık Kademesi', value: '7. Basamak (%65 İndirim)' },
            { label: 'Son Muayene Tarihi', value: `2025-05-18 (Geçerli: 2027)` },
            { label: 'Tramer Hasar Kaydı', value: '0 TL / Hasarsız (Sentetik)' },
          ],
        },
      ];
      tableHeaders = ['Tarih', 'İşlem Türü', 'Kilometre', 'Kurum / İstasyon', 'Sonuç'];
      tableRows = [
        ['2025-05-18', 'Periyodik Araç Muayenesi', '34.200 km', 'TÜVTÜRK Şile İstasyonu', 'Kusursuz Geçti'],
        ['2024-06-11', 'Trafik Sigortası Yenileme', '21.500 km', 'Sigorta Bilgi Merkezi', 'Yenilendi'],
        ['2023-04-10', 'İlk Tescil & Noter Satışı', '0 km', 'Kadıköy 12. Noterliği', 'Ruhsat Verildi'],
      ];
      break;
    }

    case 'TICARI': {
      summary = [
        { label: 'Vergi Kimlik No (VKN)', value: inputs.vkn || `99${rng.nextInt(10000000, 99999999)}`, isHighlight: true },
        { label: 'Ticari Unvan', value: inputs.unvan || 'NexuX Teknoloji ve Siber Sistemler Anonim Şirketi' },
        { label: 'Vergi Dairesi', value: `${city} Boğaziçi Kurumlar V.D.` },
        { label: 'Mükellefiyet', value: 'Faal - Bilanço Esası (e-Fatura)', badge: 'FAAL' },
      ];
      cards = [
        {
          title: 'Ticaret Sicil ve Ortaklık Yapısı',
          subtitle: 'İstanbul Ticaret Odası (İTO) Simülatörü',
          status: 'SUCCESS',
          attributes: [
            { label: 'Sicil No', value: `İTO-${rng.nextInt(100000, 999999)}` },
            { label: 'MERSİS No', value: `099887766550001${rng.nextInt(1, 9)}` },
            { label: 'Sermaye Tutarı', value: '₺5.000.000,00 (Tamamı Ödenmiş)' },
            { label: 'NACE Faaliyet Kodu', value: '62.01.01 - Bilgisayar Programlama Faaliyetleri' },
            { label: 'İmza Yetkilisi', value: `${inputName} (Münferiden Temsile Yetkili)` },
            { label: 'Kuruluş Tarihi', value: '2021-02-15' },
          ],
        },
      ];
      tableHeaders = ['Dönem', 'Beyan Edilen Matrah', 'Tahakkuk Eden Vergi', 'Ödeme Durumu'];
      tableRows = [
        ['2025 / 4. Dönem', '₺1.840.000,00', '₺460.000,00', 'Ödendi'],
        ['2025 / 3. Dönem', '₺1.420.000,00', '₺355.000,00', 'Ödendi'],
        ['2025 / 2. Dönem', '₺980.000,00', '₺245.000,00', 'Ödendi'],
      ];
      break;
    }

    case 'EGITIM': {
      summary = [
        { label: 'YÖKSİS Tescil Kodu', value: `DIP-YOK-${rng.nextInt(1000000, 9999999)}`, isHighlight: true },
        { label: 'Mezun Kişi', value: inputName },
        { label: 'Üniversite', value: inputs.kurumAdi || 'İstanbul Teknik Üniversitesi (Simüle)' },
        { label: 'Diploma Derecesi', value: 'Lisans - Bilgisayar Mühendisliği', badge: 'MEZUN' },
      ];
      cards = [
        {
          title: 'Akademik Başarı ve Diploma Sicili',
          subtitle: 'Yükseköğretim Kurulu (YÖK) Bilgi Sistemi',
          status: 'SUCCESS',
          attributes: [
            { label: 'Fakülte', value: 'Bilgisayar ve Bilişim Fakültesi' },
            { label: 'Bölüm', value: 'Bilgisayar Mühendisliği (İngilizce)' },
            { label: 'Mezuniyet Not Ortalaması (GPA)', value: `3.${rng.nextInt(65, 95)} / 4.00 (Onur Derecesi)` },
            { label: 'Mezuniyet Tarihi', value: '2022-06-25' },
            { label: 'Diploma No', value: `ENG-2022-${rng.nextInt(100, 999)}` },
            { label: 'Denklik Durumu', value: 'Tam Akredite (ABET Onaylı Simüle)' },
          ],
        },
      ];
      tableHeaders = ['Eğitim Kademesi', 'Kurum Adı', 'Başlangıç / Bitiş', 'Diploma Notu', 'Durum'];
      tableRows = [
        ['Lisans', 'İstanbul Teknik Üniversitesi', '2018 - 2022', '3.82 / 4.00', 'Mezun'],
        ['Ortaöğretim (Lise)', 'Kadıköy Anadolu Lisesi', '2014 - 2018', '94.60 / 100', 'Mezun'],
        ['İlköğretim', 'Özel Çevre Koleji', '2006 - 2014', '98.20 / 100', 'Mezun'],
      ];
      break;
    }

    case 'YASAL': {
      const isClean = rng.nextInt(1, 10) > 2; // 80% clean record
      const caseYear = rng.nextInt(2022, 2025);
      const caseNo = rng.nextInt(100, 999);
      const courtName = inputs.adliye || `${city} Anadolu 4. Ağır Ceza Mahkemesi`;

      summary = [
        { label: 'Adli Sicil Durumu', value: isClean ? 'ADLİ SİCİL KAYDI YOKTUR' : 'ARŞİV KAYDI BULUNMAKTADIR', isHighlight: true, badge: isClean ? 'TEMİZ' : 'ARŞİV' },
        { label: 'Sorgulanan Şahıs', value: inputName },
        { label: 'GBT Güvenlik Durumu', value: 'Herhangi bir arama veya yakalama kaydı yoktur', badge: 'GÜVENLİ' },
        { label: 'Sorgu Referansı', value: `UYAP-SEC-${rng.nextInt(100000, 999999)}` },
      ];

      cards = [
        {
          title: 'Adli Sicil ve İstatistik Genel Müdürlüğü',
          subtitle: 'UYAP Bilişim Sistemi Adli Kayıt Özeti',
          status: isClean ? 'SUCCESS' : 'WARNING',
          attributes: [
            { label: 'Adli Sicil Kaydı', value: isClean ? 'YOKTUR' : 'Sentetik Arşiv İnceleme' },
            { label: 'Adli Sicil Arşiv Kaydı', value: 'YOKTUR' },
            { label: 'Aktif Yakalama Kararı', value: 'YOKTUR (GBT Temiz)' },
            { label: 'Yurtdışı Çıkış Tahdidi', value: 'Yasak / Engel Bulunmamaktadır' },
            { label: 'Silah Ruhsatı Engeli', value: 'Yok' },
          ],
        },
      ];

      legalDossier = {
        dossierNo: `${caseYear}/${caseNo} Esas`,
        courtName,
        filingDate: `${caseYear}-04-18`,
        caseStatus: 'Karara Bağlanmış / Kesinleşmiş (Sentetik)',
        parties: ['Müşteki: Kamu Hukuku Simülatörü', `Sanık/Muhatap: ${inputName}`],
        summaryText: `Söz konusu dosya UYAP sisteminde arşivlenmiş olup infazı tamamlanmış veya düşme kararı verilmiştir. Herhangi bir infaz veya adli tebligat aranması mevcut değildir.`,
      };

      tableHeaders = ['Dosya Numarası', 'Yargı Birimi', 'Dava / Suç Türü', 'Duruşma / Karar', 'Durum'];
      tableRows = [
        [`${caseYear}/${caseNo} Esas`, courtName, 'Mala Zarar Verme (Test İhtilafı)', 'Gerekçeli Karar Yazıldı', 'Kesinleşti'],
        [`${caseYear - 1}/412 Esas`, `${city} 2. Asliye Hukuk`, 'Tazminat Davası', 'Sulh ile Sonuçlandı', 'Kapalı'],
      ];
      break;
    }

    case 'SISTEM': {
      summary = [
        { label: 'Sistem Durumu', value: 'OPERASYONEL / LOG AKTİF', isHighlight: true, badge: 'SAĞLIKLI' },
        { label: 'Denetim İzi (Audit)', value: 'SHA-256 İmzalı & Değiştirilemez' },
        { label: 'Aktif Oturumlar', value: '1 Web / 0 API Client' },
        { label: 'Güvenlik Seviyesi', value: 'Kriptografik İzolasyon Seviye 4' },
      ];
      cards = [
        {
          title: 'Yönetim ve Lisans Sağlık Metrikleri',
          subtitle: 'NexuXTanrı Master Kontrol Kulesi',
          status: 'SUCCESS',
          attributes: [
            { label: 'Engine Core', value: 'MockQueryEngine-v2.6.4' },
            { label: 'Gecikme Süresi (Latency)', value: `${execTime} ms` },
            { label: 'Aktif Lisans Anahtarları', value: '8 Adet Aktif' },
            { label: 'Son Başarılı Sorgu', value: 'Şimdi (200 OK)' },
            { label: 'Sentetik Veri İzolasyonu', value: '%100 İstemci & Sunucu Güvencesi' },
          ],
        },
      ];
      tableHeaders = ['Zaman Damgası', 'Olay Türü', 'Kullanıcı', 'IP Adresi (Simüle)', 'İşlem Durumu'];
      tableRows = [
        ['12:04:15', 'QUERY_RUN', 'admin@nexuxtanri.cyber', '192.168.1.100', '200 OK (Sentetik)'],
        ['12:03:45', 'AUTH_TOKEN_VERIFIED', 'admin@nexuxtanri.cyber', '192.168.1.100', 'SUCCESS'],
        ['12:02:15', 'KEY_ACTIVATION_CHECK', 'system', '127.0.0.1', 'VALID'],
        ['11:59:15', 'MOCK_ENGINE_SEED_INIT', 'daemon', 'localhost', 'READY'],
      ];
      break;
    }
  }

  return {
    meta,
    inputs,
    status: 'SUCCESS',
    summary,
    cards,
    tableHeaders,
    tableRows,
    timeline,
    treeData,
    legalDossier,
    rawJson: {
      meta,
      inputs,
      summary,
      cards,
      tableHeaders,
      tableRows,
      timeline,
      treeData,
      legalDossier,
    },
  };
}
