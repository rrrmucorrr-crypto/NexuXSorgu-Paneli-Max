'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Search,
  ChevronDown,
  ChevronRight,
  Fingerprint,
  Users,
  MapPin,
  PhoneCall,
  Activity,
  Plane,
  CreditCard,
  Car,
  Briefcase,
  GraduationCap,
  Scale,
  ShieldAlert,
  History,
  Bookmark,
  Sparkles,
  Key,
  ShieldCheck,
  Server,
  FileText,
  LifeBuoy,
  Lock,
  Layers,
  Settings,
  X,
} from 'lucide-react';
import { QueryCategory, QueryDefinition, UserRole } from '@/lib/types';
import { CATEGORIES, QUERIES } from '@/lib/catalog';

interface SidebarProps {
  currentView: string;
  selectedQueryId: string | null;
  selectedCategory: string | null;
  onNavigate: (view: string, queryId?: string, categoryId?: string) => void;
  userRole: UserRole;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedQueryId,
  selectedCategory,
  onNavigate,
  userRole,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    KIMLIK: true,
  });

  const roleHierarchy: Record<UserRole, number> = {
    FREE: 1,
    PREMIUM: 2,
    VIP: 3,
    ULTRA: 4,
    YONETICI: 5,
    ADMIN: 6,
  };

  const userLevel = roleHierarchy[userRole] || 1;

  // Category Icon resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint':
        return <Fingerprint className="h-4 w-4" />;
      case 'Users':
        return <Users className="h-4 w-4" />;
      case 'MapPin':
        return <MapPin className="h-4 w-4" />;
      case 'PhoneCall':
        return <PhoneCall className="h-4 w-4" />;
      case 'Activity':
        return <Activity className="h-4 w-4" />;
      case 'Plane':
        return <Plane className="h-4 w-4" />;
      case 'CreditCard':
        return <CreditCard className="h-4 w-4" />;
      case 'Car':
        return <Car className="h-4 w-4" />;
      case 'Briefcase':
        return <Briefcase className="h-4 w-4" />;
      case 'GraduationCap':
        return <GraduationCap className="h-4 w-4" />;
      case 'Scale':
        return <Scale className="h-4 w-4" />;
      case 'ShieldAlert':
      default:
        return <ShieldAlert className="h-4 w-4" />;
    }
  };

  // Toggle accordion
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Turkish-aware normalized search
  const normalizeTR = (str: string) => {
    return str
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .toLowerCase();
  };

  const filteredQueries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = normalizeTR(searchQuery.trim());
    return QUERIES.filter(
      (q) =>
        normalizeTR(q.name).includes(term) ||
        normalizeTR(q.description).includes(term) ||
        normalizeTR(q.category).includes(term)
    );
  }, [searchQuery]);

  const handleSelectQuery = (q: QueryDefinition) => {
    onNavigate('query-runner', q.id, q.category);
    onCloseMobile();
  };

  const handleSelectCategory = (catId: string) => {
    onNavigate('query-center', undefined, catId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#252A35] bg-[#090C12] transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top sidebar branding / search */}
        <div className="flex flex-col border-b border-[#252A35] p-3 gap-2.5">
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-xs font-bold text-[#F0F2F6]">Menü & Modüller</span>
            <button
              onClick={onCloseMobile}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#252A35] text-[#A0A8B7] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Live Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#A0A8B7]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="101 sorgu içinde ara..."
              className="w-full rounded-lg border border-[#252A35] bg-[#10131A] py-1.5 pl-8 pr-3 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none focus:ring-1 focus:ring-[#C8103D]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[10px] text-[#A0A8B7] hover:text-white"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* SEARCH RESULTS VIEW (When search is active) */}
          {searchQuery.trim() !== '' ? (
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[11px] font-semibold text-[#A0A8B7] flex justify-between">
                <span>Arama Sonuçları</span>
                <span className="text-[#84D9FF] font-mono">{filteredQueries.length} sorgu</span>
              </div>
              {filteredQueries.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-[#A0A8B7]">
                  Eşleşen sorgu bulunamadı.
                </div>
              ) : (
                filteredQueries.map((q) => {
                  const isLocked = (roleHierarchy[q.minRole] || 1) > userLevel;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuery(q)}
                      className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        selectedQueryId === q.id
                          ? 'bg-[#C8103D]/20 text-[#F0204F] border border-[#C8103D]/40'
                          : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{q.name}</span>
                        <span className="text-[10px] text-[#A0A8B7]">{q.category}</span>
                      </div>
                      {isLocked ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                          <Lock className="h-3 w-3" />
                          {q.minRole}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400">Açık</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              {/* PRIMARY NAVIGATION */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                      : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Ana Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('query-center');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentView === 'query-center'
                      ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                      : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4" />
                    <span>Sorgu Merkezi</span>
                  </div>
                  <span className="rounded bg-[#151923] px-1.5 py-0.5 font-mono text-[10px] text-[#84D9FF]">
                    101 Modül
                  </span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('history');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentView === 'history'
                      ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                      : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Geçmiş İşlemler</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('saved-results');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentView === 'saved-results'
                      ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                      : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Kaydedilmiş Sonuçlar</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('packages');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentView === 'packages'
                      ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                      : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#B99A5E]" />
                  <span>Paketler & Lisans</span>
                </button>
              </div>

              {/* 12 CATEGORIES ACCORDION LIST */}
              <div className="pt-2">
                <div className="px-3 pb-1.5 flex items-center justify-between text-[11px] font-bold tracking-wider text-[#A0A8B7]">
                  <span>SORGU KATEGORİLERİ</span>
                  <span className="font-mono text-[10px] text-[#A0A8B7]">12 / 101</span>
                </div>

                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const catQueries = QUERIES.filter((q) => q.category === cat.id);
                    const isExpanded = !!expandedCategories[cat.id];
                    const unlockedCount = catQueries.filter(
                      (q) => (roleHierarchy[q.minRole] || 1) <= userLevel
                    ).length;

                    return (
                      <div key={cat.id} className="rounded-lg border border-[#252A35]/50 bg-[#10131A]/40 overflow-hidden">
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className="flex w-full items-center justify-between px-2.5 py-2 text-left text-xs text-[#F0F2F6] hover:bg-[#151923] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#C8103D]">{getCategoryIcon(cat.icon)}</span>
                            <span className="font-medium text-[11px] leading-tight">
                              [{cat.index}] {cat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-[#A0A8B7]">
                              {unlockedCount}/{catQueries.length}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5 text-[#A0A8B7]" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-[#A0A8B7]" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-[#252A35]/40 bg-[#090C12]/80 px-1 py-1 space-y-0.5">
                            {catQueries.map((q) => {
                              const isLocked = (roleHierarchy[q.minRole] || 1) > userLevel;
                              const isActive = selectedQueryId === q.id && currentView === 'query-runner';
                              return (
                                <button
                                  key={q.id}
                                  onClick={() => handleSelectQuery(q)}
                                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                                    isActive
                                      ? 'bg-[#C8103D]/20 text-[#F0204F] font-semibold border-l-2 border-[#C8103D]'
                                      : 'text-[#A0A8B7] hover:bg-[#10131A] hover:text-white'
                                  }`}
                                >
                                  <span className="truncate pr-1">{q.name}</span>
                                  {isLocked ? (
                                    <Lock className="h-3 w-3 shrink-0 text-amber-500/70" />
                                  ) : (
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/80" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ADMIN & MANAGEMENT SECTION */}
              <div className="pt-2 border-t border-[#252A35]/70">
                <div className="px-3 pb-1.5 text-[11px] font-bold tracking-wider text-[#A0A8B7]">
                  YÖNETİM & SİSTEM
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      onNavigate('key-management');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'key-management'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <Key className="h-4 w-4" />
                    <span>Anahtar Yönetimi</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('user-management');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'user-management'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Kullanıcı Yönetimi</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('admin-dashboard');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'admin-dashboard'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <Server className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('audit-logs');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'audit-logs'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Denetim Logları (Audit)</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('mock-controls');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'mock-controls'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Mock Motor Ayarları</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('api-simulation');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'api-simulation'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <Server className="h-4 w-4 text-[#84D9FF]" />
                    <span>API Simülasyon Durumu</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('support');
                      onCloseMobile();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      currentView === 'support'
                        ? 'bg-[#C8103D]/15 text-[#F0204F] border-l-2 border-[#C8103D]'
                        : 'text-[#C8CDD5] hover:bg-[#10131A] hover:text-white'
                    }`}
                  >
                    <LifeBuoy className="h-4 w-4" />
                    <span>Destek Merkezi</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom status badge */}
        <div className="border-t border-[#252A35] p-3 bg-[#050609]">
          <div className="flex items-center justify-between text-[11px] text-[#A0A8B7]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Simülatör Aktif</span>
            </span>
            <span className="font-mono text-[#84D9FF]">MySQL / Seeded</span>
          </div>
        </div>
      </aside>
    </>
  );
};
