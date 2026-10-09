'use client';

import React, { useState } from 'react';
import { User, Shield, Lock, Smartphone, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';

interface ProfileViewProps {
  currentUser: UserType;
  onUserUpdate: (u: UserType) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUserUpdate }) => {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [is2FaEnabled, setIs2FaEnabled] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserType = {
      ...currentUser,
      username,
      email,
    };
    StorageAPI.setCurrentUser(updated);
    onUserUpdate(updated);
    setStatusMsg({ type: 'success', text: 'Profil bilgileri başarıyla güncellendi.' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'Yeni parola en az 6 karakter olmalıdır.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    StorageAPI.addAuditLog('PASSWORD_CHANGE', 'AUTH', 'SUCCESS', 'Kullanıcı parolası güncellendi (bcrypt simülasyonu)');
    setStatusMsg({ type: 'success', text: 'Parolanız başarıyla güncellendi (Kriptografik hash ile saklandı).' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#252A35] pb-5">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[#C8103D]" />
          <span className="font-mono text-xs font-bold text-[#F0204F]">HESAP AYARLARI</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
          Kullanıcı Profili & Güvenlik
        </h1>
        <p className="text-xs text-[#A0A8B7] mt-1">
          Oturum güvenliği, rol yetkileri ve sentetik hesap kimlik parametreleri.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
            statusMsg.type === 'success'
              ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border border-rose-500/40 bg-rose-500/10 text-rose-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-[#252A35]/60 pb-2">
          Genel Bilgiler
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">E-posta Adresi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-[#A0A8B7]">
              <span>Mevcut Rol:</span>
              <span className="font-mono text-[#F0204F] font-bold">[{currentUser.role}]</span>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#C8103D] px-4 py-2 text-xs font-bold text-white hover:bg-[#F0204F] transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Password & Security */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-[#252A35]/60 pb-2">
          Güvenlik & Parola Yenileme
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">Mevcut Parola</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">Yeni Parola</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-[#F0F2F6] focus:border-[#C8103D]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl border border-[#252A35] bg-[#151923] px-4 py-2 text-xs font-medium text-white hover:border-[#C8103D]/60 transition-colors"
          >
            Parolayı Güncelle
          </button>
        </form>
      </div>

      {/* Active Sessions & 2FA */}
      <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-[#252A35]/60 pb-2">
          Aktif Oturumlar & İki Aşamalı Doğrulama
        </h2>
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-xs font-bold text-white">İki Aşamalı Doğrulama (2FA)</h4>
            <p className="text-[11px] text-[#A0A8B7]">TOTP tabanlı sentetik güvenlik katmanı</p>
          </div>
          <button
            onClick={() => setIs2FaEnabled(!is2FaEnabled)}
            className={`rounded-full px-3 py-1 font-mono text-xs font-bold transition-colors ${
              is2FaEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {is2FaEnabled ? 'AKTİF' : 'DEVRE DIŞI'}
          </button>
        </div>

        <div className="pt-2 border-t border-[#252A35]/40 text-xs space-y-2">
          <div className="flex items-center justify-between text-[#A0A8B7]">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#84D9FF]" />
              <span>Chrome on Linux / Web Client (Bu Cihaz)</span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px]">Şu Anda Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};
