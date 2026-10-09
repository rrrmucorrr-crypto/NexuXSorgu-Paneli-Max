'use client';

import React, { useState } from 'react';
import { Settings, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MockEngineSettings } from '@/lib/types';
import { StorageAPI, useEngineSettings } from '@/lib/storage';

export const MockEngineControlView: React.FC = () => {
  const storedSettings = useEngineSettings();
  const [formState, setFormState] = useState<MockEngineSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const settings = formState || storedSettings;

  const updateSetting = (patch: Partial<MockEngineSettings>) => {
    setFormState({ ...settings, ...patch });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageAPI.setSettings(settings);
    setFormState(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults: MockEngineSettings = {
      delayMs: 350,
      simulateFailureRate: 0,
      deterministicSeed: true,
      maintenanceMode: false,
      rateLimitPerMinute: 60,
    };
    StorageAPI.setSettings(defaults);
    setFormState(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#252A35] pb-5">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#C8103D]" />
          <span className="font-mono text-xs font-bold text-[#F0204F]">MOCK VERİ MOTORU</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
          Sentetik Motor Parametre Kontrolü
        </h1>
        <p className="text-xs text-[#A0A8B7] mt-1">
          Sorgulama gecikmesi, test amaçlı hata simülasyonu ve deterministik tohum davranışını yapılandırın.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Motor ayarları başarıyla güncellendi ve çalışma zamanına uygulandı.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-2xl border border-[#252A35] bg-[#10131A] p-6 space-y-6">
        {/* Delay Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Yürütme Gecikmesi (Simulated Latency)</span>
            <span className="font-mono font-bold text-[#84D9FF]">{settings.delayMs} ms</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={settings.delayMs}
            onChange={(e) => updateSetting({ delayMs: Number(e.target.value) })}
            className="w-full accent-[#C8103D] cursor-pointer"
          />
          <p className="text-[11px] text-[#A0A8B7]">
            Her sorgunun yapay zeka ve sunucu tarafından üretilirken simüle edeceği ağ gecikmesi süresi.
          </p>
        </div>

        {/* Failure Rate Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Hata Simülasyon Oranı</span>
            <span className="font-mono font-bold text-[#F0204F]">%{settings.simulateFailureRate}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.simulateFailureRate}
            onChange={(e) => updateSetting({ simulateFailureRate: Number(e.target.value) })}
            className="w-full accent-[#C8103D] cursor-pointer"
          />
          <p className="text-[11px] text-[#A0A8B7]">
            Test amaçlı rastgele hata (timeout, network error) üretme sıklığı. Normal kullanım için %0 önerilir.
          </p>
        </div>

        {/* Deterministic Seed Toggle */}
        <div className="flex items-center justify-between py-2 border-y border-[#252A35]/60">
          <div>
            <div className="text-xs font-bold text-white">Deterministik Tohum Mantığı</div>
            <p className="text-[11px] text-[#A0A8B7]">
              Aynı girdiler verildiğinde her zaman birebir aynı sentetik sonucu türetir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateSetting({ deterministicSeed: !settings.deterministicSeed })}
            className={`rounded-full px-3 py-1 font-mono text-xs font-bold transition-colors ${
              settings.deterministicSeed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {settings.deterministicSeed ? 'AÇIK (DETERMINISTIC)' : 'KAPALI (RANDOM)'}
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-[#252A35] px-3.5 py-2 text-xs text-[#A0A8B7] hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Varsayılanlara Dön</span>
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-5 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110"
          >
            Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};
