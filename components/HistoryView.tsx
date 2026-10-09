'use client';

import React, { useState, useMemo } from 'react';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HistoryRecord } from '@/lib/types';
import { CATEGORIES } from '@/lib/catalog';
import { FormattedDate } from '@/components/FormattedDate';

interface HistoryViewProps {
  history: HistoryRecord[];
  onSelectHistoryItem: (item: HistoryRecord) => void;
  onClearHistory: () => void;
}

type DateRangePreset = 'ALL' | 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM';
type SortOption = 'NEWEST' | 'OLDEST' | 'FASTEST' | 'SLOWEST';

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'EMPTY' | 'ERROR'>('ALL');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Normalize Turkish search
  const normalizeTR = (str: string) => {
    return str
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .toLowerCase();
  };

  // Filter and sort history items
  const filteredHistory = useMemo(() => {
    let list = [...history];

    // 1. Keyword search (Name, Ref, User, Masked inputs)
    if (searchTerm.trim()) {
      const term = normalizeTR(searchTerm.trim());
      list = list.filter((item) => {
        const inName = normalizeTR(item.queryName).includes(term);
        const inRef = normalizeTR(item.referenceNo).includes(term);
        const inUser = normalizeTR(item.username).includes(term);
        const inCategory = normalizeTR(item.category).includes(term);
        const inInputs = item.inputsMasked
          ? Object.values(item.inputsMasked).some((val) =>
              normalizeTR(String(val)).includes(term)
            )
          : false;
        return inName || inRef || inUser || inCategory || inInputs;
      });
    }

    // 2. Category filter
    if (categoryFilter !== 'ALL') {
      list = list.filter((item) => item.category === categoryFilter);
    }

    // 3. Status filter
    if (statusFilter !== 'ALL') {
      list = list.filter((item) => item.status === statusFilter);
    }

    // 4. Date range filter
    const now = new Date();
    if (datePreset === 'TODAY') {
      const todayStr = now.toISOString().slice(0, 10);
      list = list.filter((item) => item.timestamp.slice(0, 10) === todayStr);
    } else if (datePreset === 'LAST_7_DAYS') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter((item) => new Date(item.timestamp) >= sevenDaysAgo);
    } else if (datePreset === 'LAST_30_DAYS') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter((item) => new Date(item.timestamp) >= thirtyDaysAgo);
    } else if (datePreset === 'CUSTOM') {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        list = list.filter((item) => new Date(item.timestamp) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter((item) => new Date(item.timestamp) <= end);
      }
    }

    // 5. Sorting
    list.sort((a, b) => {
      if (sortOption === 'NEWEST') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortOption === 'OLDEST') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortOption === 'FASTEST') {
        return a.executionTimeMs - b.executionTimeMs;
      }
      if (sortOption === 'SLOWEST') {
        return b.executionTimeMs - a.executionTimeMs;
      }
      return 0;
    });

    return list;
  }, [
    history,
    searchTerm,
    categoryFilter,
    statusFilter,
    datePreset,
    startDate,
    endDate,
    sortOption,
  ]);

  // Check if any filter is active
  const isAnyFilterActive =
    searchTerm.trim() !== '' ||
    categoryFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    datePreset !== 'ALL' ||
    startDate !== '' ||
    endDate !== '' ||
    sortOption !== 'NEWEST';

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setDatePreset('ALL');
    setStartDate('');
    setEndDate('');
    setSortOption('NEWEST');
  };

  // Metrics for filtered result
  const totalCount = filteredHistory.length;
  const successCount = filteredHistory.filter((i) => i.status === 'SUCCESS').length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 100;
  const avgExecutionTime =
    totalCount > 0
      ? Math.round(
          filteredHistory.reduce((acc, curr) => acc + curr.executionTimeMs, 0) / totalCount
        )
      : 0;

  // Export JSON (filtered results)
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(filteredHistory, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUX_SORGU_GECMIS_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV (filtered results)
  const handleExportCsv = () => {
    if (filteredHistory.length === 0) return;
    const headers = [
      'ReferansNo',
      'SorguAdi',
      'Kategori',
      'Kullanici',
      'Tarih',
      'Durum',
      'SureMs',
      'Girdiler',
    ];
    const rows = filteredHistory.map((item) => [
      `"${item.referenceNo}"`,
      `"${item.queryName}"`,
      `"${item.category}"`,
      `"${item.username}"`,
      `"${item.timestamp}"`,
      `"${item.status}"`,
      item.executionTimeMs,
      `"${JSON.stringify(item.inputsMasked).replace(/"/g, '""')}"`,
    ]);
    const csv = '\uFEFF' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUX_SORGU_GECMIS_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4 text-[#C8103D]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">GELİŞMİŞ GEÇMİŞ GÜNLÜĞÜ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            Sentetik Sorgu Geçmişi & Filtreleme
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Anahtar kelime, tarih aralığı, durum ve kategori kriterlerine göre hızlı ve duyarlı geçmiş arama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#252A35] bg-[#10131A] px-3 py-2 text-xs text-[#C8CDD5] hover:border-[#252A35]/80 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            <span>CSV İndir</span>
          </button>
          <button
            onClick={handleExportJson}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#252A35] bg-[#10131A] px-3 py-2 text-xs text-[#C8CDD5] hover:border-[#252A35]/80 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#84D9FF]" />
            <span>JSON İndir</span>
          </button>
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-[#C8103D]/40 bg-[#C8103D]/10 px-3 py-2 text-xs text-[#F0204F] hover:bg-[#C8103D]/20 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Geçmişi Temizle</span>
          </button>
        </div>
      </div>

      {/* METRIC STRIP (RESPONSIVE TELEMETRY) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-3">
          <span className="text-[10px] text-[#A0A8B7] uppercase font-mono block">Bulunan Kayıt</span>
          <span className="text-lg font-black font-mono text-[#F0F2F6]">
            {totalCount} <span className="text-xs text-[#A0A8B7]">/ {history.length}</span>
          </span>
        </div>
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-3">
          <span className="text-[10px] text-[#A0A8B7] uppercase font-mono block">Başarı Oranı</span>
          <span className="text-lg font-black font-mono text-emerald-400">%{successRate}</span>
        </div>
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-3">
          <span className="text-[10px] text-[#A0A8B7] uppercase font-mono block">Ortalama Süre</span>
          <span className="text-lg font-black font-mono text-[#84D9FF]">{avgExecutionTime} ms</span>
        </div>
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-[#A0A8B7] uppercase font-mono block">Aktif Filtre</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#F0204F]">
              {isAnyFilterActive ? 'Özel Filtreler Açık' : 'Varsayılan'}
            </span>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-[#84D9FF] hover:underline"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-4 space-y-3.5 shadow-xl">
        {/* Row 1: Keyword search + Category + Status + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0A8B7]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Anahtar kelime ara (Sorgu adı, Ref No, Kullanıcı adı, parametreler)..."
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] py-2 pl-9 pr-8 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#A0A8B7] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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

          {/* Execution Status Select */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'ALL' | 'SUCCESS' | 'EMPTY' | 'ERROR')
              }
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="SUCCESS">Başarılı (SUCCESS)</option>
              <option value="EMPTY">Kayıt Yok (EMPTY)</option>
              <option value="ERROR">Hatalı (ERROR)</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none"
            >
              <option value="NEWEST">En Yeni İlk</option>
              <option value="OLDEST">En Eski İlk</option>
              <option value="FASTEST">En Hızlı (ms)</option>
              <option value="SLOWEST">En Yavaş (ms)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Comprehensive Date Range Filter with Browser Date Inputs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2.5 border-t border-[#252A35]/60">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#A0A8B7] mr-1">
              <Calendar className="h-3.5 w-3.5 text-[#84D9FF]" />
              <span className="font-semibold text-[#C8CDD5]">Tarih Filtresi:</span>
            </div>

            {/* Date Presets */}
            {(
              [
                { id: 'ALL', label: 'Tüm Zamanlar' },
                { id: 'TODAY', label: 'Bugün' },
                { id: 'LAST_7_DAYS', label: 'Son 7 Gün' },
                { id: 'LAST_30_DAYS', label: 'Son 30 Gün' },
                { id: 'CUSTOM', label: 'Özel' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setDatePreset(preset.id);
                  const now = new Date();
                  if (preset.id === 'ALL') {
                    setStartDate('');
                    setEndDate('');
                  } else if (preset.id === 'TODAY') {
                    const todayStr = now.toISOString().slice(0, 10);
                    setStartDate(todayStr);
                    setEndDate(todayStr);
                  } else if (preset.id === 'LAST_7_DAYS') {
                    const past = new Date(now.getTime() - 7 * 86400000);
                    setStartDate(past.toISOString().slice(0, 10));
                    setEndDate(now.toISOString().slice(0, 10));
                  } else if (preset.id === 'LAST_30_DAYS') {
                    const past = new Date(now.getTime() - 30 * 86400000);
                    setStartDate(past.toISOString().slice(0, 10));
                    setEndDate(now.toISOString().slice(0, 10));
                  }
                }}
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

        {/* Row 3: Active Filters & Badges */}
        <div className="pt-2 border-t border-[#252A35]/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-[#A0A8B7]">
            <span>
              Filtrelenen Kayıt: <strong className="text-white font-mono">{filteredHistory.length}</strong> / {history.length}
            </span>

            {categoryFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#84D9FF]/10 border border-[#84D9FF]/20 px-2 py-0.5 text-[10px] text-[#84D9FF]">
                Kategori: {categoryFilter}
                <button onClick={() => setCategoryFilter('ALL')} className="hover:text-white">×</button>
              </span>
            )}

            {statusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                Durum: {statusFilter}
                <button onClick={() => setStatusFilter('ALL')} className="hover:text-white">×</button>
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

            {searchTerm && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#C8103D]/10 border border-[#C8103D]/20 px-2 py-0.5 text-[10px] text-[#F0204F]">
                &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm('')} className="hover:text-white">×</button>
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
              <span>Tüm Filtreleri Temizle</span>
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-[#252A35] bg-[#10131A] overflow-hidden shadow-lg">
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A0A8B7] space-y-2">
            <Clock className="h-10 w-10 text-[#252A35] mx-auto" />
            <p className="text-sm font-semibold text-white">Filtrelere uygun sorgu kaydı bulunamadı.</p>
            <p className="text-xs text-[#A0A8B7]">
              {isAnyFilterActive
                ? 'Filtreleri sıfırlayarak tüm geçmiş kayıtlarını görüntüleyebilirsiniz.'
                : 'Henüz bu sistemde bir sorgulama işlemi gerçekleştirilmedi.'}
            </p>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="mt-2 text-xs font-semibold text-[#F0204F] hover:underline"
              >
                Filtreleri Sıfırla
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252A35] bg-[#151923] text-[#A0A8B7] font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3">Referans No</th>
                  <th className="px-4 py-3">Sorgu Modülü</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Girdi Özeti</th>
                  <th className="px-4 py-3">Zaman</th>
                  <th className="px-4 py-3">Süre</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A35]/40 text-[#F0F2F6]">
                {filteredHistory.map((item) => {
                  const inputEntries = Object.entries(item.inputsMasked || {}).slice(0, 2);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#151923]/60 transition-colors cursor-pointer group"
                      onClick={() => onSelectHistoryItem(item)}
                    >
                      <td className="px-4 py-3 font-mono text-[#84D9FF] font-semibold whitespace-nowrap">
                        {item.referenceNo}
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {item.queryName}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#A0A8B7]">
                        <span className="rounded bg-[#090C12] px-2 py-0.5 border border-[#252A35]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-[#A0A8B7]">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {inputEntries.map(([k, v]) => (
                            <span
                              key={k}
                              className="rounded bg-[#151923] px-1.5 py-0.2 font-mono text-[10px] text-[#C8CDD5] truncate max-w-[120px]"
                              title={`${k}: ${v}`}
                            >
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#A0A8B7] whitespace-nowrap font-mono text-[11px]">
                        <FormattedDate date={item.timestamp} format="datetime" />
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                        {item.executionTimeMs} ms
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>BAŞARILI</span>
                          </span>
                        )}
                        {item.status === 'EMPTY' && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                            <AlertCircle className="h-3 w-3" />
                            <span>BOŞ</span>
                          </span>
                        )}
                        {item.status === 'ERROR' && (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" />
                            <span>HATA</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs text-[#F0204F] group-hover:translate-x-1 transition-all flex items-center gap-1 ml-auto font-medium">
                          <span>Aç</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
