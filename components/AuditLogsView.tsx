'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileSpreadsheet,
} from 'lucide-react';
import { AuditLogItem } from '@/lib/types';
import { useAuditLogs } from '@/lib/storage';
import { FormattedDate } from '@/components/FormattedDate';

export const AuditLogsView: React.FC = () => {
  const logs = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ['LogId', 'Zaman', 'Kullanici', 'Rol', 'Eylem', 'Modul', 'Durum', 'IP', 'Detay'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.username}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.targetModule}"`,
      `"${l.status}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csv = '\uFEFF' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUX_AUDIT_LOGS_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#C8103D]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">DEĞİŞTİRİLEMEZ DENETİM İZİ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            İşlem ve Denetim Kayıtları (Audit Logs)
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Platformdaki yetki değişimleri, sorgulama eylemleri ve yönetim müdahalelerinin kriptografik kayıtları.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-xl border border-[#252A35] bg-[#10131A] px-3.5 py-2 text-xs text-[#C8CDD5] hover:border-[#252A35]/80 hover:text-white transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>Denetim CSV Dışa Aktar</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0A8B7]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Eylem adı, kullanıcı veya detay ara..."
            className="w-full rounded-xl border border-[#252A35] bg-[#10131A] py-2 pl-9 pr-3 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#252A35] bg-[#10131A] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]/70 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">Tüm Durumlar</option>
          <option value="SUCCESS">Başarılı (SUCCESS)</option>
          <option value="FAILED">Başarısız (FAILED)</option>
          <option value="BLOCKED">Engellendi (BLOCKED)</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#252A35] bg-[#10131A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#252A35] bg-[#151923] text-[#A0A8B7] font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">Zaman</th>
                <th className="px-4 py-3">Eylem</th>
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">Modül</th>
                <th className="px-4 py-3">IP Adresi</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Ayrıntı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A35]/40 text-[#F0F2F6]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151923]/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#A0A8B7] whitespace-nowrap">
                    <FormattedDate date={log.timestamp} format="datetime" />
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{log.username}</span>{' '}
                    <span className="font-mono text-[10px] text-[#84D9FF]">[{log.userRole}]</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#A0A8B7]">
                    {log.targetModule}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#A0A8B7]">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3">
                    {log.status === 'SUCCESS' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>SUCCESS</span>
                      </span>
                    )}
                    {log.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[10px]">
                        <AlertCircle className="h-3 w-3" />
                        <span>FAILED</span>
                      </span>
                    )}
                    {log.status === 'BLOCKED' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-[10px]">
                        <AlertCircle className="h-3 w-3" />
                        <span>BLOCKED</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#C8CDD5]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
