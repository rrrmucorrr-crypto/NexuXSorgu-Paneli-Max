'use client';

import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
  Search,
  Download,
  FileSpreadsheet,
  Check,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { useColumnPreferencesStore } from '@/src/stores/columnPreferencesStore';

export interface ResultTableProps {
  headers: string[];
  rows: (string | number)[][];
  queryId: string;
  userId: string;
  title?: string;
  className?: string;
}

export const ResultTable: React.FC<ResultTableProps> = ({
  headers,
  rows,
  queryId,
  userId,
  title,
  className = '',
}) => {
  // Zustand store
  const {
    getPreferences,
    toggleColumn,
    reorderColumns,
    showAllColumns,
    resetPreferences,
  } = useColumnPreferencesStore();

  const userPref = getPreferences(userId, queryId, headers);
  const columnOrder = userPref.columnOrder;
  const visibleColumns = userPref.visibleColumns;

  // Local UI state
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);

  // Drag in modal list
  const [modalDraggedIndex, setModalDraggedIndex] = useState<number | null>(null);
  const [modalDragOverIndex, setModalDragOverIndex] = useState<number | null>(null);

  // Copied cell feedback
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  // Computed displayed headers based on column order & visibility
  const displayedHeaders = useMemo(() => {
    return (columnOrder.length > 0 ? columnOrder : headers).filter(
      (col) => visibleColumns.includes(col) && headers.includes(col)
    );
  }, [columnOrder, visibleColumns, headers]);

  // Computed displayed rows (mapped to reordered/filtered columns)
  const mappedRows = useMemo(() => {
    return rows.map((row) =>
      displayedHeaders.map((col) => {
        const origIdx = headers.indexOf(col);
        return origIdx !== -1 && origIdx < row.length ? row[origIdx] : '';
      })
    );
  }, [rows, headers, displayedHeaders]);

  // Filter rows by search term if provided
  const filteredRows = useMemo(() => {
    if (!filterText.trim()) return mappedRows;
    const term = filterText.toLowerCase().trim();
    return mappedRows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(term))
    );
  }, [mappedRows, filterText]);

  // Drag and drop handlers on table header
  const handleHeaderDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColumnIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHeaderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnIndex !== index) {
      setDragOverColumnIndex(index);
    }
  };

  const handleHeaderDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedColumnIndex === null || draggedColumnIndex === dropIndex) {
      setDraggedColumnIndex(null);
      setDragOverColumnIndex(null);
      return;
    }

    // Map displayed header indices back to columnOrder indices
    const draggedColName = displayedHeaders[draggedColumnIndex];
    const targetColName = displayedHeaders[dropIndex];

    const fromOrderIdx = columnOrder.indexOf(draggedColName);
    const toOrderIdx = columnOrder.indexOf(targetColName);

    if (fromOrderIdx !== -1 && toOrderIdx !== -1) {
      reorderColumns(userId, queryId, fromOrderIdx, toOrderIdx, columnOrder);
    }

    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  const handleHeaderDragEnd = () => {
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  // Drag and drop handlers within customization modal
  const handleModalDragStart = (e: React.DragEvent, index: number) => {
    setModalDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleModalDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (modalDragOverIndex !== index) {
      setModalDragOverIndex(index);
    }
  };

  const handleModalDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (modalDraggedIndex === null || modalDraggedIndex === dropIndex) {
      setModalDraggedIndex(null);
      setModalDragOverIndex(null);
      return;
    }

    reorderColumns(userId, queryId, modalDraggedIndex, dropIndex, columnOrder);
    setModalDraggedIndex(null);
    setModalDragOverIndex(null);
  };

  const handleModalDragEnd = () => {
    setModalDraggedIndex(null);
    setModalDragOverIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderColumns(userId, queryId, index, index - 1, columnOrder);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < columnOrder.length - 1) {
      reorderColumns(userId, queryId, index, index + 1, columnOrder);
    }
  };

  // Copy cell value helper
  const handleCopyCell = (val: string | number, coordKey: string) => {
    navigator.clipboard?.writeText(String(val));
    setCopiedCell(coordKey);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  // Export CSV
  const handleExportCsv = () => {
    if (displayedHeaders.length === 0 || filteredRows.length === 0) return;
    const headerLine = displayedHeaders.map((h) => `"${h}"`).join(',');
    const rowLines = filteredRows.map((r) =>
      r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUX_${queryId}_TABLO_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const handleExportJson = () => {
    if (displayedHeaders.length === 0 || filteredRows.length === 0) return;
    const jsonObjects = filteredRows.map((r) => {
      const obj: Record<string, string | number> = {};
      displayedHeaders.forEach((h, idx) => {
        obj[h] = r[idx];
      });
      return obj;
    });
    const blob = new Blob([JSON.stringify(jsonObjects, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUX_${queryId}_TABLO_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hiddenCount = headers.length - displayedHeaders.length;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1 text-xs">
        <div className="flex items-center flex-wrap gap-2 text-[#A0A8B7]">
          {title && (
            <span className="font-semibold text-white mr-1">{title}</span>
          )}
          <span className="font-mono text-[11px] text-[#84D9FF] bg-[#84D9FF]/10 px-2 py-0.5 rounded border border-[#84D9FF]/20">
            {displayedHeaders.length} / {headers.length} Sütun Görünür
          </span>
          {hiddenCount > 0 && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {hiddenCount} Sütun Gizlendi
            </span>
          )}
          <span className="text-[11px] font-mono text-[#A0A8B7]">
            {filteredRows.length} Kayıt
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Row Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#A0A8B7]" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Tabloda filtrele..."
              className="rounded-lg border border-[#252A35] bg-[#090C12] py-1 pl-8 pr-2.5 text-xs text-white placeholder-[#A0A8B7]/60 focus:border-[#84D9FF] focus:outline-none w-36 sm:w-44"
            />
            {filterText && (
              <button
                onClick={() => setFilterText('')}
                className="absolute right-2 top-1.5 text-[10px] text-[#A0A8B7] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Export Buttons */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredRows.length === 0}
            className="flex items-center gap-1 rounded-lg border border-[#252A35] bg-[#10131A] px-2.5 py-1 text-xs text-[#C8CDD5] hover:text-white hover:border-[#252A35]/80 disabled:opacity-40 transition-colors cursor-pointer"
            title="Görünen sütunları CSV olarak indir"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            disabled={filteredRows.length === 0}
            className="flex items-center gap-1 rounded-lg border border-[#252A35] bg-[#10131A] px-2.5 py-1 text-xs text-[#C8CDD5] hover:text-white hover:border-[#252A35]/80 disabled:opacity-40 transition-colors cursor-pointer"
            title="Görünen sütunları JSON olarak indir"
          >
            <Download className="h-3.5 w-3.5 text-[#84D9FF]" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {/* Column Customization Button */}
          <button
            type="button"
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#10131A] px-2.5 py-1 text-xs text-[#84D9FF] hover:border-[#84D9FF]/60 hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Sütunları Düzenle (D&D)</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-[#252A35] bg-[#10131A] overflow-hidden shadow-lg">
        {displayedHeaders.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs text-[#A0A8B7]">
              Tüm sütunlar gizlenmiş durumda. Tabloyu görüntülemek için sütunları etkinleştirin.
            </p>
            <button
              onClick={() => showAllColumns(userId, queryId, headers)}
              className="rounded-lg bg-[#84D9FF]/20 border border-[#84D9FF]/50 px-3 py-1.5 text-xs text-[#84D9FF] hover:bg-[#84D9FF]/30"
            >
              Tüm Sütunları Göster
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#252A35] bg-[#151923] text-[#A0A8B7] font-mono text-[11px] select-none">
                <tr>
                  {displayedHeaders.map((head, i) => {
                    const isDragging = draggedColumnIndex === i;
                    const isOver = dragOverColumnIndex === i;

                    return (
                      <th
                        key={head}
                        draggable
                        onDragStart={(e) => handleHeaderDragStart(e, i)}
                        onDragOver={(e) => handleHeaderDragOver(e, i)}
                        onDrop={(e) => handleHeaderDrop(e, i)}
                        onDragEnd={handleHeaderDragEnd}
                        className={`px-4 py-3 font-semibold whitespace-nowrap cursor-grab active:cursor-grabbing transition-colors group relative ${
                          isDragging
                            ? 'opacity-40 bg-[#84D9FF]/10'
                            : isOver
                            ? 'bg-[#84D9FF]/20 border-l-2 border-[#84D9FF] text-white'
                            : 'hover:bg-[#1a202c] hover:text-white'
                        }`}
                        title="Sütun sırasını değiştirmek için sürükleyip bırakın (Drag & Drop)"
                      >
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="h-3 w-3 text-[#A0A8B7]/50 group-hover:text-[#84D9FF] transition-colors" />
                          <span>{head}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A35]/40 text-[#F0F2F6]">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={displayedHeaders.length}
                      className="px-4 py-8 text-center text-xs text-[#A0A8B7]"
                    >
                      {filterText ? 'Filtreye uygun kayıt bulunamadı.' : 'Tablo kaydı yok.'}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-[#151923]/60 transition-colors"
                    >
                      {row.map((cell, cIdx) => {
                        const cellKey = `${rIdx}-${cIdx}`;
                        const isCopied = copiedCell === cellKey;

                        return (
                          <td
                            key={cIdx}
                            onClick={() => handleCopyCell(cell, cellKey)}
                            className="px-4 py-3 font-mono text-xs whitespace-nowrap cursor-pointer hover:text-[#84D9FF] transition-colors relative group"
                            title="Kopyalamak için tıklayın"
                          >
                            <span>{cell}</span>
                            {isCopied && (
                              <span className="absolute right-2 top-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1 py-0.5 animate-in fade-in">
                                Kopyalandı
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drag Hint Footer */}
      <div className="flex items-center justify-between text-[10px] text-[#A0A8B7] px-1 font-mono">
        <span>💡 İpucu: Sütun başlıklarını sürükleyip bırakarak (Drag & Drop) sırasını anında değiştirebilirsiniz.</span>
        <span>Zustand State ile Kullanıcıya Özel Saklanır</span>
      </div>

      {/* COLUMN CUSTOMIZATION & DRAG-AND-DROP MODAL */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-[#252A35] bg-[#10131A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-3">
              <div className="flex items-center gap-2 text-[#84D9FF]">
                <SlidersHorizontal className="h-4 w-4" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sütunları Özelleştir & Sırala (D&D)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsColumnModalOpen(false)}
                className="text-[#A0A8B7] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#A0A8B7] leading-relaxed">
              Görmek istediğiniz sütunları göz ikonuyla açıp kapatın. Sıralamak için sütunları sürükleyip bırakabilir (D&D) veya yukarı/aşağı butonlarını kullanabilirsiniz. Tercihler Zustand store aracılığıyla oturumlar arası saklanır.
            </p>

            {/* Quick action buttons */}
            <div className="flex items-center justify-between gap-2 pt-1 border-b border-[#252A35]/40 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showAllColumns(userId, queryId, headers)}
                  className="rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1 text-[11px] text-[#84D9FF] hover:border-[#84D9FF]/50 transition-colors"
                >
                  Tümünü Göster
                </button>
                <button
                  type="button"
                  onClick={() => resetPreferences(userId, queryId, headers)}
                  className="flex items-center gap-1 rounded-lg border border-[#252A35] bg-[#090C12] px-2.5 py-1 text-[11px] text-amber-400 hover:border-amber-400/50 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Varsayılana Sıfırla</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-[#A0A8B7]">
                {visibleColumns.length} / {headers.length} Seçili
              </span>
            </div>

            {/* Reorderable Column List with Drag-and-Drop */}
            <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
              {columnOrder.map((col, idx) => {
                const isVisible = visibleColumns.includes(col);
                const isModalDragging = modalDraggedIndex === idx;
                const isModalOver = modalDragOverIndex === idx;

                return (
                  <div
                    key={col}
                    draggable
                    onDragStart={(e) => handleModalDragStart(e, idx)}
                    onDragOver={(e) => handleModalDragOver(e, idx)}
                    onDrop={(e) => handleModalDrop(e, idx)}
                    onDragEnd={handleModalDragEnd}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-all select-none ${
                      isModalDragging
                        ? 'opacity-30 border-dashed border-[#84D9FF] bg-[#84D9FF]/10'
                        : isModalOver
                        ? 'border-t-2 border-t-[#84D9FF] bg-[#84D9FF]/15'
                        : isVisible
                        ? 'border-[#252A35] bg-[#090C12] text-white hover:border-[#252A35]/80'
                        : 'border-[#252A35]/40 bg-[#090C12]/40 text-[#A0A8B7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Drag Handle */}
                      <div
                        className="cursor-grab active:cursor-grabbing p-1 text-[#A0A8B7] hover:text-[#84D9FF] transition-colors"
                        title="Sıralamak için sürükleyin"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>

                      {/* Visibility Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleColumn(userId, queryId, col, headers)}
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors ${
                          isVisible
                            ? 'border-[#84D9FF]/60 bg-[#84D9FF]/20 text-[#84D9FF]'
                            : 'border-[#252A35] bg-[#151923] text-[#A0A8B7]'
                        }`}
                        title={isVisible ? 'Gizle' : 'Göster'}
                      >
                        {isVisible ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#A0A8B7] w-4">
                          {idx + 1}.
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isVisible ? 'text-white' : 'line-through text-[#A0A8B7]'
                          }`}
                        >
                          {col}
                        </span>
                      </div>
                    </div>

                    {/* Up / Down Reorder buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[#252A35] bg-[#151923] text-[#A0A8B7] hover:border-[#84D9FF]/60 hover:text-white disabled:opacity-20 transition-colors"
                        title="Yukarı taşı"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === columnOrder.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-[#252A35] bg-[#151923] text-[#A0A8B7] hover:border-[#84D9FF]/60 hover:text-white disabled:opacity-20 transition-colors"
                        title="Aşağı taşı"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#252A35]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#A0A8B7]">
                Kullanıcı: <strong className="text-white font-mono">{userId}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsColumnModalOpen(false)}
                className="rounded-xl bg-[#84D9FF] px-4 py-2 text-xs font-bold text-black hover:bg-[#84D9FF]/90 transition-colors cursor-pointer"
              >
                Kaydet & Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
