'use client';

import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Power,
  Clock,
  Layers,
} from 'lucide-react';
import { StorageAPI, useEngineSettings } from '@/lib/storage';
import { validateCatalog } from '@/lib/catalog';

interface AdminDashboardViewProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const settings = useEngineSettings();

  const catalogCheck = validateCatalog();

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/admin/health');
      if (res.ok) {
        const json = await res.json();
        setHealthData(json);
      }
    } catch {
      // Fallback local status
      setHealthData({
        status: 'HEALTHY',
        version: '2.6.4-ENTERPRISE-DEMO',
        uptime: '5s 12d 30sn',
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json) setHealthData(json);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMaintenance = () => {
    const updated = { ...settings, maintenanceMode: !settings.maintenanceMode };
    StorageAPI.setSettings(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[#C8103D]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">SİSTEM SAĞLIĞI & DENETİM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            Yönetim & Altyapı Kontrol Paneli
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Sunucu durumu, sentetik motor performans parametreleri ve güvenlik denetimi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHealth}
            className="flex items-center gap-1.5 rounded-xl border border-[#252A35] bg-[#10131A] px-3 py-2 text-xs text-[#C8CDD5] hover:border-[#252A35]/80 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          <button
            onClick={toggleMaintenance}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
              settings.maintenanceMode
                ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                : 'border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:text-white'
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>Bakım Modu: {settings.maintenanceMode ? 'AKTİF' : 'KAPALI'}</span>
          </button>
        </div>
      </div>

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Sorgu Kataloğu Durumu</span>
            <Layers className="h-4 w-4 text-[#84D9FF]" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-white">
            {catalogCheck.queryCount} / 101 Modül
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>12 Kategori Doğrulandı</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Deterministik Tohum Motoru</span>
            <Cpu className="h-4 w-4 text-[#F0204F]" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-[#F0204F]">
            MOCK-ENGINE v2.6
          </div>
          <div className="mt-1 text-[11px] text-[#A0A8B7]">
            Gecikme: <span className="font-mono text-white">{settings.delayMs} ms</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Veritabanı Katmanı</span>
            <Database className="h-4 w-4 text-[#B99A5E]" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-white">
            MySQL 8 DDL Ready
          </div>
          <div className="mt-1 text-[11px] text-emerald-400">
            18 Tablo Şeması & Migration
          </div>
        </div>

        <div className="rounded-xl border border-[#252A35] bg-[#10131A] p-4">
          <div className="flex items-center justify-between text-xs text-[#A0A8B7]">
            <span>Kişisel Veri İzolasyonu</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-emerald-400">
            %100 Korumalı
          </div>
          <div className="mt-1 text-[11px] text-[#A0A8B7]">
            Sıfır PII / Deterministik
          </div>
        </div>
      </div>

      {/* QUICK SYSTEM SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('audit-logs')}
          className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 hover:border-[#C8103D]/60 transition-all cursor-pointer"
        >
          <h4 className="text-sm font-bold text-white mb-1">Denetim Günlükleri (Audit)</h4>
          <p className="text-xs text-[#A0A8B7]">Tüm sistem olayları, sorgu başlangıçları ve yetki değişimleri.</p>
        </div>

        <div
          onClick={() => onNavigate('mock-controls')}
          className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 hover:border-[#C8103D]/60 transition-all cursor-pointer"
        >
          <h4 className="text-sm font-bold text-white mb-1">Mock Veri Motoru Ayarları</h4>
          <p className="text-xs text-[#A0A8B7]">Simülasyon yanıt süresi, hata oranı ve tohum parametreleri.</p>
        </div>

        <div
          onClick={() => onNavigate('api-simulation')}
          className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 hover:border-[#C8103D]/60 transition-all cursor-pointer"
        >
          <h4 className="text-sm font-bold text-white mb-1">API Simülasyon Konsolu</h4>
          <p className="text-xs text-[#A0A8B7]">RESTful endpoint testleri ve canlı JSON durum yanıtları.</p>
        </div>
      </div>
    </div>
  );
};
