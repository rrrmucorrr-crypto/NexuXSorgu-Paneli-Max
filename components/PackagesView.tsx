'use client';

import React from 'react';
import { Sparkles, Check, Key, Shield, ArrowRight } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';

interface PackagesViewProps {
  currentRole: UserRole;
  onOpenKeyModal: () => void;
  onSelectRoleDemo: (role: UserRole) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  currentRole,
  onOpenKeyModal,
  onSelectRoleDemo,
}) => {
  const packages = [
    {
      role: 'FREE' as UserRole,
      title: 'Free Başlangıç',
      tagline: 'Temel sentetik kimlik ve adres önizleme',
      price: 'Ücretsiz',
      period: 'Ömür Boyu',
      features: [
        'Dashboard & Temel Sorgular (25+ Modül)',
        'Temel sentetik sonuç kartları',
        'Son 10 sorgu geçmişi',
        'Giriş seviyesi simülasyon',
      ],
      color: 'border-slate-700 bg-[#10131A]',
      btnStyle: 'border border-[#252A35] bg-[#151923] text-white hover:border-[#C8103D]/60',
    },
    {
      role: 'PREMIUM' as UserRole,
      title: 'Premium Genişletilmiş',
      tagline: 'Detaylı sorgular ve dışa aktarım araçları',
      price: '₺499',
      period: '/ Aylık',
      features: [
        'FREE özellikleri dahil (55+ Modül)',
        'Genişletilmiş aile ve iletişim sorguları',
        'JSON ve CSV dışa aktarımı',
        'Detaylı sonuç tabloları ve zaman çizelgeleri',
        'Genişletilmiş geçmiş (100 kayıt)',
      ],
      color: 'border-emerald-500/40 bg-[#10131A]',
      btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-500',
    },
    {
      role: 'VIP' as UserRole,
      title: 'VIP İleri Seviye',
      tagline: 'Soy ağacı grafiği, UYAP & TRAMER istihbaratı',
      price: '₺999',
      period: '/ Aylık',
      popular: true,
      features: [
        'PREMIUM özellikleri dahil (85+ Modül)',
        'İnteraktif 4 nesil Soy Ağacı grafiği',
        'GBT & Adli sicil sentetik dosya simülasyonu',
        'Finansal durum ve TAKBİS tapu sorgusu',
        'Öncelikli arayüz ve hızlı motor yanıtı',
      ],
      color: 'border-[#B99A5E]/60 bg-gradient-to-b from-[#151923] to-[#10131A]',
      btnStyle: 'bg-[#B99A5E] text-black font-bold hover:brightness-110 shadow-lg',
    },
    {
      role: 'ULTRA' as UserRole,
      title: 'Ultra Full Kapsam',
      tagline: '101 sorgunun tamamı ve sınırlandırılmamış erişim',
      price: '₺1.999',
      period: '/ Aylık',
      features: [
        '101 Modülün Tamamına Eksiksiz Erişim',
        'Baz istasyonu & Cihaz IMEI analiz simülatörü',
        'Tüm yasal, adli ve şirket ortaklık kütüğü',
        'Sınırsız sorgu kotası & özel rapor şablonu',
        'Öncelikli destek & VIP discord rolü',
      ],
      color: 'border-[#84D9FF]/60 bg-gradient-to-b from-[#10131A] to-[#090C12]',
      btnStyle: 'bg-gradient-to-r from-[#84D9FF] to-[#0099FF] text-black font-bold hover:brightness-110 shadow-[0_0_20px_rgba(132,217,255,0.3)]',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin & Yönetici',
      tagline: 'Tam yönetim, kullanıcı ve anahtar kontrolü',
      price: 'Lisanslı',
      period: 'Özel',
      features: [
        'Kullanıcı ve Rol Yönetimi',
        'Lisans Anahtarı (Key) Oluşturma / İptal',
        'Değiştirilemez Denetim Logları (Audit)',
        'Sentetik Mock Motor Parametre Ayarları',
        'API Simülasyon Konsolu ve Sistem Sağlığı',
      ],
      color: 'border-[#C8103D]/60 bg-[#151923]',
      btnStyle: 'bg-gradient-to-r from-[#C8103D] to-[#F0204F] text-white font-bold hover:brightness-110 shadow-[0_0_20px_rgba(200,16,61,0.4)]',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#B99A5E]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">PAKETLER & LİSANS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            Rol ve Erişim Katmanları
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Sisteme tanımlı rol yetki matrisi. Elinizdeki anahtarı doğrulayarak dilediğiniz seviyeye yükselebilirsiniz.
          </p>
        </div>

        <button
          onClick={onOpenKeyModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all self-start sm:self-auto"
        >
          <Key className="h-4 w-4" />
          <span>Lisans Anahtarı Etkinleştir</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {packages.map((pkg) => {
          const isCurrent = currentRole === pkg.role;
          return (
            <div
              key={pkg.role}
              className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-md ${pkg.color} ${
                isCurrent ? 'ring-2 ring-[#C8103D]' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2.5 right-4 rounded-full bg-[#B99A5E] px-2.5 py-0.5 font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                  En Popüler
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-2.5 left-4 rounded-full bg-[#C8103D] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  Aktif Rolünüz
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white mt-1">{pkg.title}</h3>
                <p className="text-[11px] text-[#A0A8B7] mt-1 leading-snug">{pkg.tagline}</p>

                <div className="my-4 border-y border-[#252A35]/60 py-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-white">{pkg.price}</span>
                    <span className="text-xs text-[#A0A8B7]">{pkg.period}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#C8CDD5]">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#252A35]/50">
                {isCurrent ? (
                  <div className="w-full rounded-xl border border-emerald-500/50 bg-emerald-500/10 py-2 text-center text-xs font-bold text-emerald-400">
                    Aktif Olarak Kullanılıyor
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectRoleDemo(pkg.role)}
                    className={`w-full rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${pkg.btnStyle}`}
                  >
                    Bu Role Geç (Test)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
