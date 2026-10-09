'use client';

import React from 'react';
import { Lock, Sparkles, Key, X, ArrowRight, Shield } from 'lucide-react';
import { QueryDefinition, UserRole } from '@/lib/types';

interface LockedModalProps {
  query: QueryDefinition;
  currentUserRole: UserRole;
  onClose: () => void;
  onOpenKeyModal: () => void;
  onSwitchRoleDemo: (role: UserRole) => void;
}

export const LockedModal: React.FC<LockedModalProps> = ({
  query,
  currentUserRole,
  onClose,
  onOpenKeyModal,
  onSwitchRoleDemo,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[#252A35] bg-[#10131A] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Lock className="h-4 w-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              KİLİTLİ MODÜL ERİŞİMİ
            </span>
          </div>
          <button onClick={onClose} className="text-[#A0A8B7] hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 text-center py-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mt-2">{query.name}</h3>
          <p className="text-xs text-[#A0A8B7]">
            Bu sorgu modülü üst seviye istihbarat ve ayrıntılı sentetik simülasyon içerir.
          </p>
        </div>

        <div className="rounded-xl border border-[#252A35] bg-[#090C12] p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#A0A8B7]">Gereken Paket Seviyesi:</span>
            <span className="font-mono font-bold text-amber-400">[{query.minRole}]</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#A0A8B7]">Mevcut Rolünüz:</span>
            <span className="font-mono text-[#F0204F]">[{currentUserRole}]</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenKeyModal();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110"
          >
            <Key className="h-4 w-4" />
            <span>Lisans Anahtarı ile Kilidi Aç</span>
          </button>

          <button
            onClick={() => {
              onSwitchRoleDemo(query.minRole);
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#252A35] bg-[#151923] py-2 text-xs font-semibold text-[#84D9FF] hover:border-[#84D9FF]/40 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Demo Test: Rolümü [{query.minRole}] Olarak Değiştir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
