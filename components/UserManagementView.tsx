'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Key,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { User, UserRole } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';

interface UserManagementViewProps {
  users: User[];
  onUsersUpdate: (users: User[]) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onUsersUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const list = [...users];
    const u = list.find((x) => x.id === userId);
    if (u) {
      u.role = newRole;
      StorageAPI.setAllUsers(list);
      onUsersUpdate(list);
      StorageAPI.addAuditLog('USER_ROLE_UPDATE', 'ADMIN', 'SUCCESS', `${u.username} rolü ${newRole} yapıldı`);
    }
  };

  const handleToggleStatus = (userId: string) => {
    const list = [...users];
    const u = list.find((x) => x.id === userId);
    if (u) {
      u.status = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      StorageAPI.setAllUsers(list);
      onUsersUpdate(list);
      StorageAPI.addAuditLog('USER_STATUS_TOGGLE', 'ADMIN', 'SUCCESS', `${u.username} durumu ${u.status} yapıldı`);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#C8103D]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">KULLANICI DİZİNİ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            Kullanıcı ve Rol Yönetimi
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Platformdaki tüm hesaplar, yetki rolleri ve hesap durumları.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0A8B7]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Kullanıcı adı, e-posta veya rol ara..."
          className="w-full rounded-xl border border-[#252A35] bg-[#10131A] py-2 pl-9 pr-3 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none"
        />
      </div>

      <div className="rounded-xl border border-[#252A35] bg-[#10131A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#252A35] bg-[#151923] text-[#A0A8B7] font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Yetki Rolü</th>
                <th className="px-4 py-3">Sorgu Sayısı</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">Rol Değiştir & Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A35]/40 text-[#F0F2F6]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#151923]/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#151923] text-[#F0204F] font-bold text-xs">
                      {u.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{u.username}</span>
                  </td>
                  <td className="px-4 py-3 text-[#A0A8B7] font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] font-bold text-[#84D9FF] bg-[#84D9FF]/10 px-2 py-0.5 rounded border border-[#84D9FF]/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{u.queriesRunCount || 0}</td>
                  <td className="px-4 py-3">
                    {u.status === 'ACTIVE' ? (
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>AKTİF</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-mono text-[11px] flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>ASKIDA</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="rounded-lg border border-[#252A35] bg-[#090C12] px-2 py-1 text-[11px] text-white focus:border-[#C8103D]"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="VIP">VIP</option>
                        <option value="ULTRA">ULTRA</option>
                        <option value="YONETICI">YÖNETİCİ</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`rounded px-2 py-1 text-[11px] border transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Askıya Al' : 'Aktifleştir'}
                      </button>
                    </div>
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
