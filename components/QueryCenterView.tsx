'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  LayoutGrid,
  FileText,
  Clock,
  Compass,
  Calendar,
  X,
  Activity,
} from 'lucide-react';
import { UserRole, QueryCategoryCode, QueryDefinition, ResultLayoutType, HistoryRecord } from '@/lib/types';
import { CATEGORIES, QUERIES } from '@/lib/catalog';
import { useHistory } from '@/lib/storage';

interface QueryCenterViewProps {
  userRole: UserRole;
  selectedCategory: string | null;
  onSelectQuery: (queryId: string) => void;
  onLockedClick: (query: QueryDefinition) => void;
  history?: HistoryRecord[];
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  FREE: 1,
  PREMIUM: 2,
  VIP: 3,
  ULTRA: 4,
  YONETICI: 5,
  ADMIN: 6,
};

type SortMode = 'DEFAULT' | 'NAME_ASC' | 'NAME_DESC' | 'ROLE_ASC' | 'ROLE_DESC' | 'FIELDS_COUNT' | 'RECENT_RUN';
type ExecutionStatusFilter = 'ALL' | 'SUCCESS' | 'EMPTY' | 'ERROR' | 'NEVER_RUN' | 'ACCESSIBLE' | 'LOCKED';
type DatePresetType = 'ALL' | 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';

export const QueryCenterView: React.FC<QueryCenterViewProps> = ({
  userRole,
  selectedCategory,
  onSelectQuery,
  onLockedClick,
  history: propHistory,
}) => {
  // Store history fallback
  const storeHistory = useHistory();
  const history = propHistory || storeHistory;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'ALL');
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatusFilter>('ALL');
  const [datePreset, setDatePreset] = useState<DatePresetType>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Secondary filter state
  const [roleTierFilter, setRoleTierFilter] = useState<'ALL' | UserRole>('ALL');
  const [layoutFilter, setLayoutFilter] = useState<'ALL' | ResultLayoutType>('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('DEFAULT');
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  const userLevel = ROLE_HIERARCHY[userRole] || 1;

  // Map each query to its run statistics from history
  const queryRunStats = useMemo(() => {
    const stats = new Map<
      string,
      {
        runCount: number;
        lastRunTimestamp?: string;
        lastRunStatus?: 'SUCCESS' | 'EMPTY' | 'ERROR';
        historyList: HistoryRecord[];
      }
    >();

    history.forEach((record) => {
      const existing = stats.get(record.queryId);
      if (!existing) {
        stats.set(record.queryId, {
          runCount: 1,
          lastRunTimestamp: record.timestamp,
          lastRunStatus: record.status,
          historyList: [record],
        });
      } else {
        existing.runCount += 1;
        existing.historyList.push(record);
        if (
          !existing.lastRunTimestamp ||
          new Date(record.timestamp) > new Date(existing.lastRunTimestamp)
        ) {
          existing.lastRunTimestamp = record.timestamp;
          existing.lastRunStatus = record.status;
        }
      }
    });

    return stats;
  }, [history]);

  // Turkish character normalization
  const normalizeTR = (str: string) => {
    return str
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .toLowerCase();
  };

  // Date preset helper
  const handleSelectDatePreset = (preset: DatePresetType) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'TODAY') {
      const todayStr = now.toISOString().slice(0, 10);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'LAST_7_DAYS') {
      const past = new Date(now.getTime() - 7 * 86400000);
      setStartDate(past.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === 'LAST_30_DAYS') {
      const past = new Date(now.getTime() - 30 * 86400000);
      setStartDate(past.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    }
  };

  // Advanced Filtering and Sorting Logic
  const filteredQueries = useMemo(() => {
    let list = [...QUERIES];

    // 1. Category Filter
    if (activeCategory !== 'ALL') {
      list = list.filter((q) => q.category === activeCategory);
    }

    // 2. Execution Status Filter
    if (executionStatus !== 'ALL') {
      list = list.filter((q) => {
        const queryStat = queryRunStats.get(q.id);

        if (executionStatus === 'SUCCESS') {
          return queryStat?.historyList.some((h) => h.status === 'SUCCESS');
        }
        if (executionStatus === 'EMPTY') {
          return queryStat?.historyList.some((h) => h.status === 'EMPTY');
        }
        if (executionStatus === 'ERROR') {
          return queryStat?.historyList.some((h) => h.status === 'ERROR');
        }
        if (executionStatus === 'NEVER_RUN') {
          return !queryStat || queryStat.runCount === 0;
        }
        if (executionStatus === 'ACCESSIBLE') {
          return (ROLE_HIERARCHY[q.minRole] || 1) <= userLevel;
        }
        if (executionStatus === 'LOCKED') {
          return (ROLE_HIERARCHY[q.minRole] || 1) > userLevel;
        }
        return true;
      });
    }

    // 3. Date Range Filter (based on history execution dates)
    const hasDateFilter = startDate !== '' || endDate !== '';
    if (hasDateFilter) {
      list = list.filter((q) => {
        const queryStat = queryRunStats.get(q.id);
        if (!queryStat || queryStat.historyList.length === 0) {
          return false;
        }

        return queryStat.historyList.some((h) => {
          const recDate = new Date(h.timestamp);
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (recDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (recDate > end) return false;
          }
          return true;
        });
      });
    }

    // 4. Role Tier Filter
    if (roleTierFilter !== 'ALL') {
      list = list.filter((q) => q.minRole === roleTierFilter);
    }

    // 5. Layout Type Filter
    if (layoutFilter !== 'ALL') {
      list = list.filter((q) => q.layoutType === layoutFilter);
    }

    // 6. Keyword search (Multi-token match across name, description, category, field labels)
    if (searchQuery.trim()) {
      const term = normalizeTR(searchQuery.trim());
      list = list.filter((q) => {
        const inName = normalizeTR(q.name).includes(term);
        const inDesc = normalizeTR(q.description).includes(term);
        const inCat = normalizeTR(q.category).includes(term);
        const inFields = q.fields.some(
          (f) => normalizeTR(f.label).includes(term) || normalizeTR(f.name).includes(term)
        );
        return inName || inDesc || inCat || inFields;
      });
    }

    // 7. Sorting
    list.sort((a, b) => {
      if (sortMode === 'NAME_ASC') {
        return a.name.localeCompare(b.name, 'tr');
      }
      if (sortMode === 'NAME_DESC') {
        return b.name.localeCompare(a.name, 'tr');
      }
      if (sortMode === 'ROLE_ASC') {
        return (ROLE_HIERARCHY[a.minRole] || 1) - (ROLE_HIERARCHY[b.minRole] || 1);
      }
      if (sortMode === 'ROLE_DESC') {
        return (ROLE_HIERARCHY[b.minRole] || 1) - (ROLE_HIERARCHY[a.minRole] || 1);
      }
      if (sortMode === 'FIELDS_COUNT') {
        return b.fields.length - a.fields.length;
      }
      if (sortMode === 'RECENT_RUN') {
        const timeA = queryRunStats.get(a.id)?.lastRunTimestamp || '';
        const timeB = queryRunStats.get(b.id)?.lastRunTimestamp || '';
        return timeB.localeCompare(timeA);
      }
      return 0; // DEFAULT keeps catalog structure
    });

    return list;
  }, [
    activeCategory,
    executionStatus,
    startDate,
    endDate,
    roleTierFilter,
    layoutFilter,
    searchQuery,
    sortMode,
    userLevel,
    queryRunStats,
  ]);

  const totalCatalogCount = QUERIES.length;
  const accessibleCount = QUERIES.filter(
    (q) => (ROLE_HIERARCHY[q.minRole] || 1) <= userLevel
  ).length;

  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    activeCategory !== 'ALL' ||
    executionStatus !== 'ALL' ||
    startDate !== '' ||
    endDate !== '' ||
    datePreset !== 'ALL' ||
    roleTierFilter !== 'ALL' ||
    layoutFilter !== 'ALL' ||
    sortMode !== 'DEFAULT';

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('ALL');
    setExecutionStatus('ALL');
    setDatePreset('ALL');
    setStartDate('');
    setEndDate('');
    setRoleTierFilter('ALL');
    setLayoutFilter('ALL');
    setSortMode('DEFAULT');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#F0204F]">SORGU KATALOĞU</span>
            <span className="text-[#A0A8B7]">·</span>
            <span className="text-xs text-[#A0A8B7] font-mono">12 Kategori · 101 Sentetik Modül</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            İstihbarat ve Sorgulama Merkezi
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Gelişmiş arama çubuğu ile kategori, tarih aralığı, çalıştırma durumu ve anahtar kelimelere göre anında filtreleyin.
          </p>
        </div>

        {/* Global unlock metric badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto rounded-xl border border-[#252A35] bg-[#10131A] px-3.5 py-2 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#A0A8B7]">Mevcut Yetkiniz ({userRole})</span>
            <span className="font-mono text-sm font-bold text-[#F0F2F6]">
              {accessibleCount} / {totalCatalogCount} <span className="text-xs text-emerald-400">Açık</span>
            </span>
          </div>
          <div className="h-8 w-[1px] bg-[#252A35]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8103D]/20 text-[#F0204F]">
            <Shield className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE SEARCH AND FILTERING BAR */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-4 space-y-3.5 shadow-xl">
        {/* Row 1: Keyword search + Category Dropdown + Execution Status Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search Input (Cols 12 -> 5) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0A8B7]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="101 sorgu içinde ara (örn: Soy Ağacı, IBAN, Plaka, Adli)..."
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] py-2 pl-9 pr-8 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#A0A8B7] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Dropdown (Cols 12 -> 3) */}
          <div className="md:col-span-3">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none"
            >
              <option value="ALL">Tüm Kategoriler (12 Kategori)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  [{cat.index}] {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Execution Status Dropdown (Cols 12 -> 3) */}
          <div className="md:col-span-3">
            <select
              value={executionStatus}
              onChange={(e) => setExecutionStatus(e.target.value as ExecutionStatusFilter)}
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none"
            >
              <option value="ALL">Tüm Çalıştırma Durumları</option>
              <option value="SUCCESS">Çalıştırıldı: Başarılı (SUCCESS)</option>
              <option value="EMPTY">Çalıştırıldı: Kayıt Yok (EMPTY)</option>
              <option value="ERROR">Çalıştırıldı: Hatalı (ERROR)</option>
              <option value="NEVER_RUN">Henüz Çalıştırılmamış</option>
              <option value="ACCESSIBLE">Erişilebilir (Yetki Dahilinde)</option>
              <option value="LOCKED">Kilitli (Yetki Yetersiz)</option>
            </select>
          </div>

          {/* Toggle More Filters (Cols 12 -> 1) */}
          <div className="md:col-span-1">
            <button
              type="button"
              onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                showAdvancedPanel || roleTierFilter !== 'ALL' || layoutFilter !== 'ALL' || sortMode !== 'DEFAULT'
                  ? 'border-[#C8103D] bg-[#C8103D]/15 text-[#F0204F]'
                  : 'border-[#252A35] bg-[#090C12] text-[#A0A8B7] hover:text-white'
              }`}
              title="Ek Filtreler & Sıralama"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showAdvancedPanel ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Row 2: Date Range Filter Bar with Browser Date Inputs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#252A35]/60">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#A0A8B7] mr-1">
              <Calendar className="h-3.5 w-3.5 text-[#84D9FF]" />
              <span className="font-semibold text-[#C8CDD5]">Tarih Aralığı:</span>
            </div>

            {/* Date Preset Buttons */}
            {(
              [
                { id: 'ALL', label: 'Tümü' },
                { id: 'TODAY', label: 'Bugün' },
                { id: 'LAST_7_DAYS', label: 'Son 7 Gün' },
                { id: 'LAST_30_DAYS', label: 'Son 30 Gün' },
                { id: 'CUSTOM', label: 'Özel' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectDatePreset(preset.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                  datePreset === preset.id
                    ? 'bg-[#C8103D] text-white font-bold shadow-sm'
                    : 'bg-[#090C12] text-[#A0A8B7] border border-[#252A35] hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Standard Browser Date Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#A0A8B7] font-mono">Başlangıç:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('CUSTOM');
              }}
              className="rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1 text-xs text-white focus:border-[#C8103D] focus:outline-none"
            />
            <span className="text-xs text-[#A0A8B7]">-</span>
            <span className="text-[11px] text-[#A0A8B7] font-mono">Bitiş:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('CUSTOM');
              }}
              className="rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1 text-xs text-white focus:border-[#C8103D] focus:outline-none"
            />
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setDatePreset('ALL');
                }}
                className="text-[10px] text-[#A0A8B7] hover:text-[#F0204F] underline ml-1"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Collapsible Drawer (Role tier, layout type, sorting) */}
        {showAdvancedPanel && (
          <div className="pt-3 border-t border-[#252A35]/60 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1 text-xs">
            {/* Role Tier Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#C8CDD5]">Yetki Seviyesi</label>
              <select
                value={roleTierFilter}
                onChange={(e) => setRoleTierFilter(e.target.value as 'ALL' | UserRole)}
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-1.5 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              >
                <option value="ALL">Tüm Yetkiler</option>
                <option value="FREE">FREE</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="VIP">VIP</option>
                <option value="ULTRA">ULTRA</option>
                <option value="YONETICI">YÖNETİCİ</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Layout Type Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#C8CDD5]">Görsel Sonuç Düzeni</label>
              <select
                value={layoutFilter}
                onChange={(e) => setLayoutFilter(e.target.value as 'ALL' | ResultLayoutType)}
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-1.5 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              >
                <option value="ALL">Tüm Düzenler</option>
                <option value="identity-dossier">Kimlik Kütük Kartı</option>
                <option value="family-tree">Soy Ağacı & Aile Grafiği</option>
                <option value="timeline">Zaman Çizelgesi & Tarihçe</option>
                <option value="tabular">Detaylı Tablo</option>
                <option value="financial-statement">Finansal Varlık & Findeks</option>
                <option value="vehicle-registry">Araç & Tramer Sicili</option>
                <option value="legal-case">UYAP & Adli Dava Dosyası</option>
                <option value="medical-record">Sağlık & e-Reçete Protokolü</option>
                <option value="travel-itinerary">Seyahat & Bilet PNR</option>
                <option value="commercial-ledger">Ticari Defter & MERSİS</option>
                <option value="system-logs">Sistem & Audit Logları</option>
              </select>
            </div>

            {/* Sorting Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#C8CDD5]">Sıralama Ölçütü</label>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-1.5 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              >
                <option value="DEFAULT">Varsayılan (Katalog Sırası)</option>
                <option value="NAME_ASC">İsim (A ➔ Z)</option>
                <option value="NAME_DESC">İsim (Z ➔ A)</option>
                <option value="RECENT_RUN">Son Çalıştırılma Tarihi</option>
                <option value="ROLE_ASC">Yetki Seviyesi (Düşükten Yükseğe)</option>
                <option value="ROLE_DESC">Yetki Seviyesi (Yüksekten Düşüğe)</option>
                <option value="FIELDS_COUNT">Giriş Alanı Sayısı (En Çok)</option>
              </select>
            </div>
          </div>
        )}

        {/* Row 4: Active Filter Badges & Summary Strip */}
        <div className="pt-2 border-t border-[#252A35]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-[#A0A8B7]">
            <Compass className="h-3.5 w-3.5 text-[#84D9FF]" />
            <span>
              Listelenen: <strong className="text-white font-mono">{filteredQueries.length}</strong> / {QUERIES.length} modül
            </span>

            {/* Active filter chips */}
            {activeCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#84D9FF]/10 border border-[#84D9FF]/20 px-2 py-0.5 text-[10px] text-[#84D9FF]">
                Kategori: {activeCategory}
                <button onClick={() => setActiveCategory('ALL')} className="hover:text-white">×</button>
              </span>
            )}
            {executionStatus !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                Durum: {executionStatus}
                <button onClick={() => setExecutionStatus('ALL')} className="hover:text-white">×</button>
              </span>
            )}
            {(startDate || endDate) && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400 font-mono">
                Tarih: {startDate || '*'} ➔ {endDate || '*'}
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setDatePreset('ALL');
                  }}
                  className="hover:text-white"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#C8103D]/10 border border-[#C8103D]/20 px-2 py-0.5 text-[10px] text-[#F0204F]">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} className="hover:text-white">×</button>
              </span>
            )}
          </div>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-medium text-[#F0204F] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Tüm Filtreleri Sıfırla</span>
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY TABS HORIZONTAL SCROLL */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('ALL')}
          className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
            activeCategory === 'ALL'
              ? 'border-[#C8103D] bg-[#C8103D]/15 text-[#F0204F]'
              : 'border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:border-[#252A35]/80 hover:text-white'
          }`}
        >
          [HEPSİ] Tümü (101)
        </button>
        {CATEGORIES.map((cat) => {
          const catQueries = QUERIES.filter((q) => q.category === cat.id);
          const unlocked = catQueries.filter(
            (q) => (ROLE_HIERARCHY[q.minRole] || 1) <= userLevel
          ).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'border-[#C8103D] bg-[#C8103D]/15 text-[#F0204F]'
                  : 'border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:border-[#252A35]/80 hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] text-[#A0A8B7]">[{cat.index}]</span>
              <span>{cat.name}</span>
              <span className="rounded bg-[#151923] px-1 py-0.2 font-mono text-[10px] text-[#84D9FF]">
                {unlocked}/{catQueries.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* QUERIES GRID (Responsive 101 Modules Display) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredQueries.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#A0A8B7] space-y-2">
            <Search className="h-10 w-10 text-[#252A35] mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">Kriterlere uygun sorgu modülü bulunamadı.</p>
            <p className="text-xs text-[#A0A8B7]">
              Seçtiğiniz kategori, çalıştırma durumu veya tarih aralığında sorgu kaydı eşleşmedi.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 text-xs font-semibold text-[#F0204F] hover:underline"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          filteredQueries.map((query) => {
            const isLocked = (ROLE_HIERARCHY[query.minRole] || 1) > userLevel;
            const categoryMeta = CATEGORIES.find((c) => c.id === query.category);
            const stats = queryRunStats.get(query.id);

            return (
              <div
                key={query.id}
                onClick={() => {
                  if (isLocked) {
                    onLockedClick(query);
                  } else {
                    onSelectQuery(query.id);
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isLocked
                    ? 'border-[#252A35]/60 bg-[#0c0e14] opacity-80 hover:opacity-100 hover:border-amber-500/40'
                    : 'border-[#252A35] bg-[#10131A] hover:border-[#C8103D]/70 hover:bg-[#151923] shadow-md'
                }`}
              >
                <div>
                  {/* Card Header: Category & Role Badge + Run Status Badge */}
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-mono text-[10px] text-[#A0A8B7]">
                      [{categoryMeta?.index}] {categoryMeta?.name}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {stats && stats.lastRunStatus && (
                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                            stats.lastRunStatus === 'SUCCESS'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : stats.lastRunStatus === 'EMPTY'
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}
                          title={`Son çalıştırma durumu: ${stats.lastRunStatus}`}
                        >
                          {stats.lastRunStatus}
                        </span>
                      )}

                      {isLocked ? (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Lock className="h-3 w-3" />
                          {query.minRole}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Unlock className="h-3 w-3" />
                          {query.minRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-[#F0F2F6] group-hover:text-white transition-colors">
                    {query.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#A0A8B7] line-clamp-2 leading-relaxed">
                    {query.description}
                  </p>
                </div>

                {/* Footer Bar: Fields count, Layout badge & Action */}
                <div className="mt-4 pt-3 border-t border-[#252A35]/50 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#A0A8B7] font-mono">
                      {query.fields.length} alan
                    </span>
                    <span className="rounded bg-[#090C12] px-1.5 py-0.2 text-[9px] font-mono text-[#84D9FF] border border-[#252A35]">
                      {query.layoutType}
                    </span>
                    {stats && stats.runCount > 0 && (
                      <span className="text-[9px] font-mono text-[#A0A8B7]">
                        · {stats.runCount} kez çalıştırıldı
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 font-semibold transition-all ${
                      isLocked
                        ? 'text-amber-400 group-hover:translate-x-0.5'
                        : 'text-[#F0204F] group-hover:translate-x-1'
                    }`}
                  >
                    <span>{isLocked ? 'Kilidi Aç' : 'Sorgula'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
