'use client';

import React from 'react';
import {
  Shield,
  Layers,
  Lock,
  Unlock,
  Activity,
  History,
  Key,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Clock,
  Compass,
} from 'lucide-react';
import { User, UserRole, HistoryRecord } from '@/lib/types';
import { CATEGORIES, QUERIES } from '@/lib/catalog';
import { FormattedDate } from '@/components/FormattedDate';

interface DashboardViewProps {
  currentUser: User;
  history: HistoryRecord[];
  onNavigate: (view: string, queryId?: string, categoryId?: string) => void;
  onOpenKeyModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  history,
  onNavigate,
  onOpenKeyModal,
}) => {
  const roleHierarchy: Record<UserRole, number> = {
    FREE: 1,
    PREMIUM: 2,
    VIP: 3,
    ULTRA: 4,
    YONETICI: 5,
    ADMIN: 6,
  };

  const userLevel = roleHierarchy[currentUser.role] || 1;
  const totalQueries = QUERIES.length;
  const accessibleQueries = QUERIES.filter(
    (q) => (roleHierarchy[q.minRole] || 1) <= userLevel
  ).length;
  const lockedQueries = totalQueries - accessibleQueries;

  // Filter recent history
  const recentHistory = history.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* TOP WELCOME HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-[#252A35] bg-gradient-to-r from-[#10131A] via-[#151923] to-[#090C12] p-5 sm:p-7 shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#C8103D]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#F0204F]">
                KONTROL KULESİ 𖤟 SİBER SİSTEM
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F0F2F6]">
              Hoş Geldiniz, <span className="text-[#F0204F]">{currentUser.username}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A8B7] max-w-xl">
              NexuXTanrı 𖤟 SorguPaneli sentetik demo istihbarat ve simülasyon ortamındasınız. 12 kategori ve 101 deterministik sorgu kütüğü tam izolasyonla emrinizde.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('query-center')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(200,16,61,0.4)] hover:brightness-110 transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>Sorgu Merkezine Git</span>
            </button>
            <button
              onClick={onOpenKeyModal}
              className="flex items-center gap-1.5 rounded-xl border border-[#252A35] bg-[#10131A] px-3.5 py-2.5 text-xs font-medium text-[#C8CDD5] hover:border-[#C8103D]/60 hover:text-white transition-colors"
            >
              <Key className="h-4 w-4 text-[#B99A5E]" />
              <span>Lisans Yükselt</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Runs */}
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 transition-all hover:border-[#252A35]/80">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Toplam İşlem</span>
            <Activity className="h-4 w-4 text-[#84D9FF]" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-[#F0F2F6]">
            {currentUser.queriesRunCount || 0}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Deterministik Demo Motoru</span>
          </div>
        </div>

        {/* Accessible Modules */}
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 transition-all hover:border-[#252A35]/80">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Kullanılabilir Modül</span>
            <Unlock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-[#F0F2F6]">
            {accessibleQueries} <span className="text-sm font-normal text-[#A0A8B7]">/ 101</span>
          </div>
          <div className="mt-1 text-[11px] text-[#A0A8B7]">
            Rol seviyesi: <span className="font-mono text-[#F0204F]">{currentUser.role}</span>
          </div>
        </div>

        {/* Locked Modules */}
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 transition-all hover:border-[#252A35]/80">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Kilitli Modül</span>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            {lockedQueries}
          </div>
          <div className="mt-1 text-[11px] text-[#A0A8B7]">
            {lockedQueries > 0 ? 'Paket yükselterek açılabilir' : 'Tüm sorgular açık!'}
          </div>
        </div>

        {/* Engine Latency */}
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 transition-all hover:border-[#252A35]/80">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Motor Gecikmesi</span>
            <Cpu className="h-4 w-4 text-[#F0204F]" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-[#84D9FF]">
            ~120 <span className="text-sm font-normal">ms</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Zero-Leakage Güvenli</span>
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY SHORTCUTS (12 Categories Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#C8103D]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F0F2F6]">
              12 Ana İstihbarat Kategorisi
            </h2>
          </div>
          <button
            onClick={() => onNavigate('query-center')}
            className="flex items-center gap-1 text-xs text-[#84D9FF] hover:underline"
          >
            <span>Tüm 101 Modülü Görüntüle</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {CATEGORIES.map((cat) => {
            const catQueries = QUERIES.filter((q) => q.category === cat.id);
            const unlocked = catQueries.filter(
              (q) => (roleHierarchy[q.minRole] || 1) <= userLevel
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('query-center', undefined, cat.id)}
                className="group flex flex-col items-start justify-between rounded-xl border border-[#252A35] bg-[#10131A] p-3 text-left transition-all hover:border-[#C8103D]/60 hover:bg-[#151923]"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[10px] text-[#F0204F] font-bold">[{cat.index}]</span>
                  <span className="font-mono text-[10px] text-[#A0A8B7]">
                    {unlocked}/{catQueries.length}
                  </span>
                </div>
                <div className="mt-2 font-bold text-xs text-[#F0F2F6] line-clamp-1 group-hover:text-white">
                  {cat.name}
                </div>
                <span className="mt-1 text-[10px] text-[#A0A8B7] line-clamp-1">
                  {cat.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECENT INQUIRIES & FAST ACTION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#84D9FF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F0F2F6]">
                Son Sentetik İşlemler
              </h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-[#A0A8B7] hover:text-white transition-colors"
            >
              Geçmişi Aç
            </button>
          </div>

          {recentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-[#A0A8B7]">
              <Clock className="h-8 w-8 text-[#252A35] mb-2" />
              <span>Henüz bu oturumda sorgu çalıştırılmadı.</span>
              <button
                onClick={() => onNavigate('query-center')}
                className="mt-2 text-xs text-[#F0204F] hover:underline"
              >
                Hemen bir sorgu başlatın →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#252A35]/40">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('query-runner', item.queryId)}
                  className="flex items-center justify-between py-2.5 hover:bg-[#151923] px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#F0F2F6]">{item.queryName}</span>
                    <span className="font-mono text-[10px] text-[#A0A8B7] flex items-center gap-1">
                      <span>{item.referenceNo}</span>
                      <span>·</span>
                      <FormattedDate date={item.timestamp} format="time" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                      {item.executionTimeMs} ms
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#A0A8B7]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel: Security & Compliance Card */}
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#C8103D]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F0F2F6]">
                Yasal Uyum & Sentetik Beyan
              </h3>
            </div>
            <p className="text-xs text-[#A0A8B7] leading-relaxed">
              Bu uygulama yalnızca güvenlik testi, arayüz mimarisi ve eğitim amaçlı tasarlanmış <strong className="text-white">deterministik sentetik veri motoru</strong> ile çalışır.
            </p>
            <div className="rounded-lg border border-[#252A35] bg-[#090C12] p-2.5 space-y-1 text-[11px] text-[#A0A8B7]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Harici Veri Sızıntısı: SIFIR</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Gerçek Kişisel Veri: YOK</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>UYAP / MERNİS İhlali: YOK</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#252A35]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#A0A8B7]">Aktif Lisans:</span>
            <span className="font-mono text-[#84D9FF]">{currentUser.role} Unlimited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
