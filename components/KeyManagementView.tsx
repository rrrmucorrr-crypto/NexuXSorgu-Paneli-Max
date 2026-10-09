'use client';

import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Clock,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AccessKey, UserRole } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';
import { FormattedDate } from '@/components/FormattedDate';

interface KeyManagementViewProps {
  keys: AccessKey[];
  onKeysUpdate: (keys: AccessKey[]) => void;
}

export const KeyManagementView: React.FC<KeyManagementViewProps> = ({
  keys,
  onKeysUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [newRole, setNewRole] = useState<UserRole>('VIP');
  const [newDuration, setNewDuration] = useState<'1 Gün' | '7 Gün' | '30 Gün' | 'Sınırsız'>('30 Gün');
  const [newQuota, setNewQuota] = useState(500);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const created = StorageAPI.createKey(newRole, newDuration, newQuota);
    onKeysUpdate(StorageAPI.getAccessKeys());
    setShowCreateModal(false);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Bu lisans anahtarını iptal etmek istediğinize emin misiniz?')) {
      StorageAPI.revokeKey(id);
      onKeysUpdate(StorageAPI.getAccessKeys());
    }
  };

  const handleExtend = (id: string, days: number) => {
    StorageAPI.extendKey(id, days);
    onKeysUpdate(StorageAPI.getAccessKeys());
  };

  const filteredKeys = keys.filter(
    (k) =>
      k.keyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.roleGranted.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.assignedToUser && k.assignedToUser.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A35] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#C8103D]" />
            <span className="font-mono text-xs font-bold text-[#F0204F]">LİSANS SİSTEMİ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
            Erişim Anahtarı (Key) Yönetimi
          </h1>
          <p className="text-xs text-[#A0A8B7] mt-1">
            Kullanıcılara atanacak süre ve kota sınırlı kriptografik lisans anahtarlarını üretin ve denetleyin.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Anahtar Üret</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0A8B7]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Anahtar kodu, rol veya kullanıcı ara..."
          className="w-full rounded-xl border border-[#252A35] bg-[#10131A] py-2 pl-9 pr-3 text-xs text-[#F0F2F6] placeholder-[#A0A8B7]/60 focus:border-[#C8103D]/70 focus:outline-none"
        />
      </div>

      {/* Keys Table */}
      <div className="rounded-xl border border-[#252A35] bg-[#10131A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#252A35] bg-[#151923] text-[#A0A8B7] font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">Anahtar Kodu</th>
                <th className="px-4 py-3">Yetki Rolü</th>
                <th className="px-4 py-3">Süre / Bitiş</th>
                <th className="px-4 py-3">Kullanım / Kota</th>
                <th className="px-4 py-3">Atanan Kullanıcı</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A35]/40 text-[#F0F2F6]">
              {filteredKeys.map((k) => (
                <tr key={k.id} className="hover:bg-[#151923]/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                    <span>{k.keyCode}</span>
                    <button
                      onClick={() => handleCopy(k.keyCode, k.id)}
                      className="text-[#A0A8B7] hover:text-white"
                      title="Kopyala"
                    >
                      {copiedId === k.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] font-bold text-[#84D9FF] bg-[#84D9FF]/10 px-2 py-0.5 rounded border border-[#84D9FF]/20">
                      {k.roleGranted}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#A0A8B7]">
                    <div>{k.durationLabel}</div>
                    {k.expiresAt && (
                      <div className="text-[10px] text-[#A0A8B7] flex items-center gap-1">
                        <span>Bitiş:</span>
                        <FormattedDate date={k.expiresAt} format="date" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span className="text-white font-bold">{k.usedCount}</span> /{' '}
                    <span className="text-[#A0A8B7]">{k.quota}</span>
                  </td>
                  <td className="px-4 py-3 text-[#C8CDD5]">
                    {k.assignedToUser || <span className="text-[#A0A8B7] italic">Boşta</span>}
                  </td>
                  <td className="px-4 py-3">
                    {k.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>AKTİF</span>
                      </span>
                    )}
                    {k.status === 'EXPIRED' && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[10px]">
                        <Clock className="h-3 w-3" />
                        <span>DOLDU</span>
                      </span>
                    )}
                    {k.status === 'REVOKED' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        <span>İPTAL</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {k.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleExtend(k.id, 7)}
                            className="rounded px-2 py-1 text-[10px] bg-[#151923] border border-[#252A35] text-[#84D9FF] hover:border-[#84D9FF]/40"
                            title="+7 Gün Ekle"
                          >
                            +7 Gün
                          </button>
                          <button
                            onClick={() => handleRevoke(k.id)}
                            className="rounded px-2 py-1 text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                            title="İptal Et"
                          >
                            İptal
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE KEY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#252A35] bg-[#10131A] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-[#F0204F]" />
                <span>Yeni Lisans Anahtarı Oluştur</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[#A0A8B7] hover:text-white"
              >
                Kapat
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#C8CDD5]">Atanacak Yetki Rolü</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
                >
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="VIP">VIP</option>
                  <option value="ULTRA">ULTRA</option>
                  <option value="YONETICI">YÖNETİCİ</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#C8CDD5]">Geçerlilik Süresi</label>
                <select
                  value={newDuration}
                  onChange={(e) =>
                    setNewDuration(e.target.value as '1 Gün' | '7 Gün' | '30 Gün' | 'Sınırsız')
                  }
                  className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
                >
                  <option value="1 Gün">1 Gün (Demo/Trial)</option>
                  <option value="7 Gün">7 Gün (Haftalık)</option>
                  <option value="30 Gün">30 Gün (Aylık Standart)</option>
                  <option value="Sınırsız">Sınırsız (Unlimited Lifetime)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#C8CDD5]">Sorgu Kullanım Kotası</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(Number(e.target.value))}
                  min={10}
                  max={50000}
                  className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#252A35] px-4 py-2 text-xs text-[#A0A8B7] hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110"
                >
                  Anahtarı Üret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
