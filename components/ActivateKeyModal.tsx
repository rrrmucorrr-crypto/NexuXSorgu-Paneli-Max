'use client';

import React, { useState } from 'react';
import { Key, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { StorageAPI } from '@/lib/storage';
import { User, UserRole } from '@/lib/types';

interface ActivateKeyModalProps {
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const ActivateKeyModal: React.FC<ActivateKeyModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [keyCode, setKeyCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const sampleKeys = [
    { label: 'ULTRA Sınırsız', code: 'NEXUX-ULTRA-9981-VIPX' },
    { label: 'VIP 30 Gün', code: 'NEXUX-VIP-30D-8821' },
    { label: 'PREMIUM 7 Gün', code: 'NEXUX-PREM-7D-5501' },
  ];

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyCode.trim()) return;

    const result = StorageAPI.activateKey(keyCode.trim());
    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      const updatedUser = StorageAPI.getCurrentUser();
      setTimeout(() => {
        onSuccess(updatedUser);
        onClose();
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[#252A35] bg-[#10131A] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-3">
          <div className="flex items-center gap-2 text-[#C8103D]">
            <Key className="h-4 w-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              LİSANS ANAHTARI ETKİNLEŞTİR
            </span>
          </div>
          <button onClick={onClose} className="text-[#A0A8B7] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[#A0A8B7]">
          Yönetici tarafından tahsis edilen veya satın aldığınız lisans anahtarını girerek yetki seviyenizi anında yükseltin.
        </p>

        {feedback && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
              feedback.type === 'success'
                ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#C8CDD5]">Lisans Anahtarı (Key Code)</label>
            <input
              type="text"
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value)}
              placeholder="Örn: NEXUX-VIP-30D-8821"
              required
              className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs font-mono text-white tracking-wider focus:border-[#C8103D] uppercase"
            />
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[11px] text-[#A0A8B7] block font-medium">Hızlı Test Anahtarları:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleKeys.map((k) => (
                <button
                  key={k.code}
                  type="button"
                  onClick={() => setKeyCode(k.code)}
                  className="rounded-lg border border-[#252A35] bg-[#151923] px-2 py-1 text-[10px] font-mono text-[#84D9FF] hover:border-[#84D9FF]/40"
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#252A35] px-4 py-2 text-xs text-[#A0A8B7] hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-5 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110"
            >
              Etkinleştir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
