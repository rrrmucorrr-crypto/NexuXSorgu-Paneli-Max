'use client';

import React, { useState } from 'react';
import { LifeBuoy, Send, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { SupportTicket, User } from '@/lib/types';
import { StorageAPI, useTickets } from '@/lib/storage';
import { FormattedDate } from '@/components/FormattedDate';

interface SupportViewProps {
  currentUser: User;
}

export const SupportView: React.FC<SupportViewProps> = ({ currentUser }) => {
  const tickets = useTickets();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Teknik Destek');
  const [priority, setPriority] = useState<SupportTicket['priority']>('NORMAL');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    StorageAPI.createTicket(subject, category, priority, message);
    setSubject('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#252A35] pb-5">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-[#C8103D]" />
          <span className="font-mono text-xs font-bold text-[#F0204F]">MÜŞTERİ HİZMETLERİ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F0F2F6] mt-1">
          Destek ve Talep Merkezi
        </h1>
        <p className="text-xs text-[#A0A8B7] mt-1">
          Platform kullanımı, sentetik modül entegrasyonu veya lisans yükseltme taleplerinizi iletin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Creation Form */}
        <div className="rounded-2xl border border-[#252A35] bg-[#10131A] p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-[#252A35]/60 pb-2">
            Yeni Destek Talebi Aç
          </h3>

          {submitted && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Talebiniz başarıyla oluşturuldu ve yapay zeka sırasına alındı.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">Konu</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Örn: VIP Lisansı Sorgu Kotası Hakkında"
                required
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#C8CDD5]">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
                >
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="Lisans ve Key">Lisans ve Key</option>
                  <option value="Sorgu Şeması">Sorgu Şeması</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#C8CDD5]">Öncelik</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                  className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
                >
                  <option value="DÜŞÜK">Düşük</option>
                  <option value="NORMAL">Normal</option>
                  <option value="YÜKSEK">Yüksek</option>
                  <option value="KRİTİK">Kritik</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#C8CDD5]">Mesajınız</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Talebinizi detaylandırın..."
                required
                className="w-full rounded-xl border border-[#252A35] bg-[#090C12] px-3 py-2 text-xs text-white focus:border-[#C8103D]"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8103D] to-[#F0204F] px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Talebi Gönder</span>
            </button>
          </form>
        </div>

        {/* Tickets Thread List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#A0A8B7] uppercase tracking-wider">
            Talepleriniz ({tickets.length})
          </h3>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border border-[#252A35] bg-[#10131A] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#252A35]/60 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#84D9FF]">{t.id}</span>
                    <span className="font-semibold text-white">{t.subject}</span>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    {t.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {t.messages.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className={`p-2.5 rounded-lg text-xs ${
                        m.sender === 'USER'
                          ? 'bg-[#151923] text-[#F0F2F6] ml-4'
                          : 'bg-[#090C12] text-[#A0A8B7] border border-[#252A35]/50 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#A0A8B7] mb-1">
                        <span className="font-bold text-white">{m.senderName}</span>
                        <FormattedDate date={m.timestamp} format="time" />
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
