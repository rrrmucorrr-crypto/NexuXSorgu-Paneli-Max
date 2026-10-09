'use client';

import React from 'react';
import { Bookmark, Trash2, ArrowRight, FileText, Calendar, Clock } from 'lucide-react';
import { HistoryRecord } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';
import { FormattedDate } from '@/components/FormattedDate';

interface SavedResultsViewProps {
  savedResults: HistoryRecord[];
  onOpenResult: (item: HistoryRecord) => void;
  onRemoveResult: (id: string) => void;
}

export const SavedResultsView: React.FC<SavedResultsViewProps> = ({
  savedResults,
  onOpenResult,
  onRemoveResult,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#252A35] pb-5">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[#C8103D]" />
          <span className="font-mono text-xs font-bold text-[#F0204F]">DOSYALARIM</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
          Kaydedilmiş Sentetik Raporlar
        </h1>
        <p className="text-xs text-[#A0A8B7] mt-1">
          Daha sonra incelemek üzere kaydettiğiniz simülasyon raporları ve detaylı istihbarat dökümleri.
        </p>
      </div>

      {savedResults.length === 0 ? (
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] py-16 text-center text-xs text-[#A0A8B7]">
          <FileText className="h-10 w-10 text-[#252A35] mx-auto mb-3" />
          <p className="text-sm font-medium text-white">Henüz kaydedilmiş bir dosya yok.</p>
          <p className="mt-1">
            Herhangi bir sorgu sonucunu inceledikten sonra &ldquo;Dosyaya Kaydet&rdquo; butonuna tıklayarak buraya ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedResults.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-[#252A35] bg-[#10131A] p-4 hover:border-[#C8103D]/60 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className="text-[#84D9FF]">{item.referenceNo}</span>
                  <span className="text-[#A0A8B7]">{item.category}</span>
                </div>
                <h3 className="text-sm font-bold text-[#F0F2F6] group-hover:text-white">
                  {item.queryName}
                </h3>
                <div className="mt-2 text-xs text-[#A0A8B7] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <FormattedDate date={item.timestamp} format="datetime" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Yürütme: {item.executionTimeMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#252A35]/50 flex items-center justify-between">
                <button
                  onClick={() => onRemoveResult(item.id)}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Kaldır</span>
                </button>
                <button
                  onClick={() => onOpenResult(item)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#F0204F] hover:underline"
                >
                  <span>Raporu Aç</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
