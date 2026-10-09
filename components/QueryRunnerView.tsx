'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  RefreshCw,
  Download,
  Printer,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Code,
  Table as TableIcon,
  Layers,
  ArrowLeft,
  ChevronRight,
  Info,
  Calendar,
  Activity,
  FileSpreadsheet,
  SlidersHorizontal,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';
import {
  QueryDefinition,
  SyntheticQueryResult,
  User,
  HistoryRecord,
} from '@/lib/types';
import { CATEGORIES } from '@/lib/catalog';
import { generateSyntheticResult } from '@/lib/mock-engine';
import { StorageAPI } from '@/lib/storage';
import { ResultTable } from '@/src/components/ResultTable';

interface QueryRunnerViewProps {
  query: QueryDefinition;
  currentUser: User;
  onBack: () => void;
  onSaveResult: (item: HistoryRecord) => void;
}

export const QueryRunnerView: React.FC<QueryRunnerViewProps> = ({
  query,
  currentUser,
  onBack,
  onSaveResult,
}) => {
  const getInitialFormData = (q: QueryDefinition) => {
    const initial: Record<string, string> = {};
    q.fields.forEach((f) => {
      initial[f.name] = q.samplePayload[f.name] || f.defaultValue || '';
    });
    return initial;
  };

  const [prevQueryId, setPrevQueryId] = useState(query.id);
  const [formData, setFormData] = useState<Record<string, string>>(() => getInitialFormData(query));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyntheticQueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'table' | 'json'>('visual');
  const [isSaved, setIsSaved] = useState(false);
  const [reseedCounter, setReseedCounter] = useState(0);

  // Column customization states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  if (query.id !== prevQueryId) {
    setPrevQueryId(query.id);
    setFormData(getInitialFormData(query));
    setResult(null);
    setIsSaved(false);
    setColumnOrder([]);
    setVisibleColumns([]);
  }

  const categoryMeta = CATEGORIES.find((c) => c.id === query.category);

  // Synchronize column configuration when result is received
  const initColumnsFromResult = (res: SyntheticQueryResult) => {
    const defaultHeaders = res.tableHeaders || [];
    const savedPref = StorageAPI.getTableColumnPreference(currentUser.id, query.id);

    if (savedPref && savedPref.columnOrder && savedPref.columnOrder.length > 0) {
      // Filter out any columns that don't exist in current results, and append any new ones
      const validSaved = savedPref.columnOrder.filter((c) => defaultHeaders.includes(c));
      const missing = defaultHeaders.filter((c) => !validSaved.includes(c));
      const mergedOrder = [...validSaved, ...missing];

      const validVisible = savedPref.visibleColumns.filter((c) => defaultHeaders.includes(c));
      const finalVisible = validVisible.length > 0 ? validVisible : defaultHeaders;

      setColumnOrder(mergedOrder);
      setVisibleColumns(finalVisible);
    } else {
      setColumnOrder(defaultHeaders);
      setVisibleColumns(defaultHeaders);
    }
  };

  // Move column order up
  const handleMoveColumnUp = (index: number) => {
    if (index <= 0) return;
    const newOrder = [...columnOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setColumnOrder(newOrder);
    StorageAPI.setTableColumnPreference(currentUser.id, query.id, {
      columnOrder: newOrder,
      visibleColumns,
    });
  };

  // Move column order down
  const handleMoveColumnDown = (index: number) => {
    if (index >= columnOrder.length - 1) return;
    const newOrder = [...columnOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setColumnOrder(newOrder);
    StorageAPI.setTableColumnPreference(currentUser.id, query.id, {
      columnOrder: newOrder,
      visibleColumns,
    });
  };

  // Toggle column visibility
  const handleToggleColumn = (col: string) => {
    let newVisible: string[];
    if (visibleColumns.includes(col)) {
      if (visibleColumns.length <= 1) return; // Keep at least one column visible
      newVisible = visibleColumns.filter((c) => c !== col);
    } else {
      newVisible = [...visibleColumns, col];
    }
    setVisibleColumns(newVisible);
    StorageAPI.setTableColumnPreference(currentUser.id, query.id, {
      columnOrder,
      visibleColumns: newVisible,
    });
  };

  // Show all columns
  const handleShowAllColumns = () => {
    if (!result) return;
    const all = [...result.tableHeaders];
    setVisibleColumns(all);
    StorageAPI.setTableColumnPreference(currentUser.id, query.id, {
      columnOrder,
      visibleColumns: all,
    });
  };

  // Reset columns to default
  const handleResetColumns = () => {
    if (!result) return;
    const defaults = [...result.tableHeaders];
    setColumnOrder(defaults);
    setVisibleColumns(defaults);
    StorageAPI.resetTableColumnPreference(currentUser.id, query.id);
  };

  // Compute displayed columns and rows based on customization
  const displayedHeaders = (columnOrder.length > 0 ? columnOrder : result?.tableHeaders || []).filter(
    (col) => visibleColumns.includes(col) && result?.tableHeaders.includes(col)
  );

  const displayedRows = (result?.tableRows || []).map((row) =>
    displayedHeaders.map((col) => {
      const originalIdx = result?.tableHeaders.indexOf(col) ?? -1;
      return originalIdx !== -1 ? row[originalIdx] : '';
    })
  );

  // Handle field change
  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Fill sample preset
  const handleFillSample = () => {
    setFormData({ ...query.samplePayload });
  };

  // Submit and run synthetic query
  const handleExecute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setIsSaved(false);

    try {
      const settings = StorageAPI.getSettings();
      // Generate synthetic result deterministically or with reseed
      const syntheticResult = await generateSyntheticResult(query, formData, {
        ...settings,
        deterministicSeed: reseedCounter === 0,
      });

      setResult(syntheticResult);
      initColumnsFromResult(syntheticResult);

      // Create history record
      const historyItem: HistoryRecord = {
        id: `hist-${Date.now()}`,
        referenceNo: syntheticResult.meta.requestReference,
        queryId: query.id,
        queryName: query.name,
        category: query.category,
        username: currentUser.username,
        timestamp: new Date().toISOString(),
        status: syntheticResult.status === 'SUCCESS' ? 'SUCCESS' : 'ERROR',
        executionTimeMs: syntheticResult.meta.executionTimeMs,
        inputsMasked: { ...formData },
        resultSnapshot: syntheticResult,
      };

      StorageAPI.addHistory(historyItem);
      StorageAPI.addAuditLog(
        'QUERY_EXECUTE',
        query.category,
        'SUCCESS',
        `Sorgu çalıştırıldı: ${query.name} (${syntheticResult.meta.requestReference})`
      );
    } catch (err) {
      console.error('Error running synthetic query', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-seed / regenerate with new variation
  const handleReseed = () => {
    setReseedCounter((prev) => prev + 1);
    handleExecute();
  };

  // Save result to bookmarked dossiers
  const handleSaveDossier = () => {
    if (!result) return;
    const historyItem: HistoryRecord = {
      id: `save-${Date.now()}`,
      referenceNo: result.meta.requestReference,
      queryId: query.id,
      queryName: query.name,
      category: query.category,
      username: currentUser.username,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      executionTimeMs: result.meta.executionTimeMs,
      inputsMasked: { ...formData },
      resultSnapshot: result,
    };
    StorageAPI.saveResult(historyItem);
    setIsSaved(true);
  };

  // Download JSON
  const handleDownloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTETIK_${query.id}_${result.meta.requestReference}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download CSV (respecting customized columns & order)
  const handleDownloadCsv = () => {
    if (!result || displayedHeaders.length === 0) return;
    const headers = displayedHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
    const rows = displayedRows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const csvContent = '\uFEFF' + headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTETIK_${query.id}_${result.meta.requestReference}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print dossier
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252A35] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:border-[#C8103D]/60 hover:text-white transition-colors"
            title="Geri Dön"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#A0A8B7]">
            <span>Sorgu Merkezi</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-mono text-[#F0204F]">[{categoryMeta?.index}] {categoryMeta?.name}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-bold text-[#F0F2F6]">{query.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-[#252A35] bg-[#10131A] px-2.5 py-1 font-mono text-[11px] text-[#84D9FF]">
            Gerekli: {query.minRole}
          </span>
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#10131A] px-3 py-1 text-xs text-[#C8CDD5] hover:border-[#C8103D]/60 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#B99A5E]" />
            <span>Örnek Veri Doldur</span>
          </button>
        </div>
      </div>

      {/* Query Title & Description */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6]">
          {query.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A8B7] max-w-3xl">
          {query.description}
        </p>
      </div>

      {/* DEDICATED INPUT FORM (Tailored for this specific query) */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A0A8B7]">
            Sorgu Parametreleri
          </span>
          <span className="text-[11px] text-[#A0A8B7]">
            {query.fields.length} Adet Özelleştirilmiş Giriş Alanı
          </span>
        </div>

        <form onSubmit={handleExecute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {query.fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-[#C8CDD5]">
                  <span>{field.label}</span>
                  {field.required && (
                    <span className="text-[10px] text-[#F0204F] font-mono">*Zorunlu</span>
                  )}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none focus:ring-1 focus:ring-[#C8103D]/50"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/50 focus:border-[#C8103D]/70 focus:outline-none focus:ring-1 focus:ring-[#C8103D]/50"
                  />
                )}
                {field.helpText && (
                  <p className="text-[10px] text-[#A0A8B7]">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {/* Form Action Controls */}
          <div className="pt-3 border-t border-[#252A35]/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-[#A0A8B7]">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Girdiler dış servislere gönderilmez; sentetik motor tohumu olarak işlenir.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const empty: Record<string, string> = {};
                  query.fields.forEach((f) => (empty[f.name] = ''));
                  setFormData(empty);
                }}
                className="rounded-xl border border-[#252A35] px-3.5 py-2 text-xs text-[#A0A8B7] hover:border-[#252A35]/80 hover:text-white transition-colors"
              >
                Formu Sıfırla
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(200,16,61,0.4)] hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sentetik Veri Üretiliyor...</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4" />
                    <span>Sorgula (Sentetik Demo)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* MANDATORY SYNTHETIC WATERMARK BANNER */}
          <div className="flex items-center justify-between rounded-xl border border-[#C8103D]/40 bg-[#C8103D]/10 px-4 py-2.5 text-xs text-[#F0204F] shadow-inner">
            <div className="flex items-center gap-2 font-bold font-mono">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>SENTETİK DEMO VERİSİ · GERÇEK KİŞİSEL VERİ VE DIŞ BAĞLANTI İÇERMEZ</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-[#A0A8B7]">
              <span>Ref: {result.meta.requestReference}</span>
              <span>·</span>
              <span>Süre: {result.meta.executionTimeMs} ms</span>
            </div>
          </div>

          {/* RESULTS ACTION TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#252A35] bg-[#10131A] px-4 py-2.5">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-[#252A35] bg-[#090C12] p-1">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'visual'
                    ? 'bg-[#C8103D] text-white shadow-sm'
                    : 'text-[#A0A8B7] hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Görsel Rapor</span>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'table'
                    ? 'bg-[#C8103D] text-white shadow-sm'
                    : 'text-[#A0A8B7] hover:text-white'
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Kayıt Tablosu</span>
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'json'
                    ? 'bg-[#C8103D] text-white shadow-sm'
                    : 'text-[#A0A8B7] hover:text-white'
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>Ham JSON</span>
              </button>
            </div>

            {/* Export & Actions */}
            <div className="flex items-center gap-2">
              {result.tableHeaders && result.tableHeaders.length > 0 && (
                <button
                  onClick={() => setIsColumnModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1.5 text-xs text-[#84D9FF] hover:border-[#84D9FF]/50 transition-colors"
                  title="Tablo Sütunlarını Özelleştir"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Sütunları Düzenle</span>
                  <span className="rounded bg-[#151923] px-1.5 py-0.2 text-[10px] font-mono text-[#84D9FF]">
                    {displayedHeaders.length}/{result.tableHeaders.length}
                  </span>
                </button>
              )}

              <button
                onClick={handleReseed}
                className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1.5 text-xs text-[#A0A8B7] hover:text-white hover:border-[#252A35]/80 transition-colors"
                title="Yeni bir rastgele sentetik senaryo oluşturur"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tekrar Üret</span>
              </button>

              <button
                onClick={handleSaveDossier}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                  isSaved
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-[#252A35] bg-[#090C12] text-[#A0A8B7] hover:text-white'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>{isSaved ? 'Kaydedildi' : 'Dosyaya Kaydet'}</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1.5 text-xs text-[#A0A8B7] hover:text-white transition-colors"
                title="CSV İndir"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1.5 text-xs text-[#A0A8B7] hover:text-white transition-colors"
                title="JSON İndir"
              >
                <Download className="h-3.5 w-3.5 text-[#84D9FF]" />
                <span className="hidden sm:inline">JSON</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1.5 text-xs text-[#A0A8B7] hover:text-white transition-colors"
                title="Yazdır"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Yazdır</span>
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL REPORT */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.summary.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 ${
                      item.isHighlight
                        ? 'border-[#C8103D]/60 bg-[#151923]'
                        : 'border-[#252A35] bg-[#10131A]'
                    }`}
                  >
                    <div className="text-[11px] text-[#A0A8B7] flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-mono text-emerald-400">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm sm:text-base font-bold font-mono text-[#F0F2F6] truncate">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Cards Grid */}
              {result.cards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.cards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3"
                    >
                      <div className="border-b border-[#252A35]/60 pb-2">
                        <h4 className="text-sm font-bold text-[#F0F2F6]">{card.title}</h4>
                        {card.subtitle && (
                          <p className="text-[11px] text-[#A0A8B7]">{card.subtitle}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {card.attributes.map((attr, aIdx) => (
                          <div key={aIdx} className="space-y-0.5">
                            <span className="text-[10px] text-[#A0A8B7] uppercase font-mono block">
                              {attr.label}
                            </span>
                            <span className="font-medium text-[#F0F2F6] truncate block">
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SPECIAL LAYOUT: FAMILY TREE (if Soy Ağacı) */}
              {result.treeData && (
                <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3">
                  <div className="border-b border-[#252A35]/60 pb-2">
                    <h4 className="text-sm font-bold text-[#F0F2F6]">
                      Soy Ağacı İnteraktif Hiyerarşik Görünümü
                    </h4>
                    <p className="text-[11px] text-[#A0A8B7]">
                      4 Nesil Üst-Alt Soy Sentetik Düğümleri
                    </p>
                  </div>
                  <div className="p-3 bg-[#090C12] rounded-xl font-mono text-xs space-y-2">
                    {result.treeData.map((node) => (
                      <div key={node.id} className="space-y-2">
                        <div className="flex items-center gap-2 text-[#84D9FF]">
                          <span className="rounded bg-[#84D9FF]/10 px-2 py-0.5 border border-[#84D9FF]/30">
                            {node.relation}
                          </span>
                          <span className="font-bold text-white">{node.name}</span>
                          <span className="text-[#A0A8B7]">({node.birthYear})</span>
                          <span className="text-xs text-amber-400">[{node.status}]</span>
                        </div>
                        {node.children && (
                          <div className="pl-6 border-l-2 border-[#252A35] space-y-2">
                            {node.children.map((c) => (
                              <div key={c.id} className="space-y-2">
                                <div className="flex items-center gap-2 text-emerald-400">
                                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                                    {c.relation}
                                  </span>
                                  <span className="font-bold text-white">{c.name}</span>
                                  <span className="text-[#A0A8B7]">({c.birthYear})</span>
                                </div>
                                {c.children && (
                                  <div className="pl-6 border-l-2 border-[#252A35] space-y-1">
                                    {c.children.map((g) => (
                                      <div key={g.id} className="flex items-center gap-2 text-[#F0204F]">
                                        <span className="rounded bg-[#C8103D]/10 px-2 py-0.5 border border-[#C8103D]/30">
                                          {g.relation}
                                        </span>
                                        <span className="font-bold text-white">{g.name}</span>
                                        <span className="text-[#A0A8B7]">({g.birthYear})</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECIAL LAYOUT: TIMELINE (if History / Time-series) */}
              {result.timeline && (
                <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3">
                  <div className="border-b border-[#252A35]/60 pb-2">
                    <h4 className="text-sm font-bold text-[#F0F2F6]">
                      Zaman Çizelgesi & Olay Kronolojisi
                    </h4>
                  </div>
                  <div className="relative pl-6 border-l-2 border-[#C8103D]/40 space-y-4">
                    {result.timeline.map((evt, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#090C12] bg-[#F0204F]" />
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-[11px] text-[#F0204F] font-bold">
                            {evt.date}
                          </span>
                          <span className="rounded bg-[#151923] px-1.5 py-0.2 text-[10px] text-[#84D9FF] font-mono">
                            {evt.category}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-[#F0F2F6] mt-0.5">{evt.title}</h5>
                        <p className="text-xs text-[#A0A8B7] mt-0.5">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECIAL LAYOUT: LEGAL DOSSIER (if Adli / Yasal) */}
              {result.legalDossier && (
                <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-2">
                    <h4 className="text-sm font-bold text-[#F0F2F6]">
                      UYAP Sentetik Adli Dava Dosyası Özeti
                    </h4>
                    <span className="font-mono text-xs text-[#84D9FF]">
                      {result.legalDossier.dossierNo}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#A0A8B7] block font-mono">YARGI MERCİİ</span>
                      <span className="font-bold text-white">{result.legalDossier.courtName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A0A8B7] block font-mono">DOSYA STATÜSÜ</span>
                      <span className="font-bold text-emerald-400">{result.legalDossier.caseStatus}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#090C12] rounded-lg text-xs text-[#A0A8B7] leading-relaxed border border-[#252A35]/40">
                    <p className="font-medium text-white mb-1">Hüküm / İcra Özeti:</p>
                    {result.legalDossier.summaryText}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED TABLE */}
          {activeTab === 'table' && (
            <ResultTable
              headers={result.tableHeaders || []}
              rows={result.tableRows || []}
              queryId={query.id}
              userId={currentUser.id}
              title={`${query.name} - Detaylı Sonuç Veri Tablosu`}
            />
          )}

          {/* TAB 3: RAW JSON */}
          {activeTab === 'json' && (
            <div className="rounded-xl border border-[#252A35] bg-[#090C12] p-4">
              <pre className="font-mono text-xs text-[#84D9FF] overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
