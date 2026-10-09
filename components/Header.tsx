'use client';

import React, { useState } from 'react';
import {
  Shield,
  Key,
  Bell,
  User as UserIcon,
  Menu,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Lock,
} from 'lucide-react';
import { User, UserRole, SystemNotification } from '@/lib/types';
import { StorageAPI } from '@/lib/storage';
import { FormattedDate } from '@/components/FormattedDate';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onOpenKeyModal: () => void;
  onToggleSidebar: () => void;
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  onOpenKeyModal,
  onToggleSidebar,
  notifications,
  onMarkNotificationRead,
  onNavigate,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roles: UserRole[] = ['FREE', 'PREMIUM', 'VIP', 'ULTRA', 'YONETICI', 'ADMIN'];

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'border-[#C8103D] bg-[#C8103D]/15 text-[#F0204F] shadow-[0_0_12px_rgba(200,16,61,0.3)]';
      case 'YONETICI':
        return 'border-[#F0204F]/60 bg-[#F0204F]/10 text-[#F0204F]';
      case 'ULTRA':
        return 'border-[#84D9FF]/70 bg-[#84D9FF]/10 text-[#84D9FF] shadow-[0_0_12px_rgba(132,217,255,0.2)]';
      case 'VIP':
        return 'border-[#B99A5E]/70 bg-[#B99A5E]/10 text-[#B99A5E] shadow-[0_0_10px_rgba(185,154,94,0.2)]';
      case 'PREMIUM':
        return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400';
      case 'FREE':
      default:
        return 'border-slate-700 bg-slate-800/40 text-slate-400';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    const updated = StorageAPI.switchRole(role);
    onUserChange(updated);
    setShowRoleMenu(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252A35] bg-[#090C12]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:border-[#C8103D]/60 hover:text-white transition-colors lg:hidden"
            aria-label="Menüyü Aç/Kapat"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#C8103D]/60 bg-[#10131A] shadow-[0_0_15px_rgba(200,16,61,0.25)] transition-transform group-hover:scale-105">
              <span className="font-mono text-lg font-black text-[#F0204F]">𖤟</span>
              <div className="absolute inset-0 rounded-xl bg-radial from-[#C8103D]/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#F0F2F6]">
                <span className="text-base sm:text-lg">NexuXTanrı</span>
                <span className="text-xs text-[#C8103D] font-mono">𖤟</span>
                <span className="text-xs sm:text-sm font-semibold text-[#A0A8B7] tracking-normal">
                  SorguPaneli
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#A0A8B7]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SENTETİK DEMO SİSTEMİ</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline font-mono text-[#84D9FF]/90">v2.6.4</span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Controls: Role Badge / Key Activate / Notifications / Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Role Selector / Badge */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-mono font-medium transition-all ${getRoleBadgeStyle(
                currentUser.role
              )}`}
              title="Test için hızlı rol değiştirin"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{currentUser.role}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#252A35] bg-[#10131A] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-[#A0A8B7] border-b border-[#252A35]/60 mb-1">
                  Rol Simülasyonu Değiştir:
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-mono transition-colors ${
                      currentUser.role === r
                        ? 'bg-[#C8103D]/20 text-[#F0204F] font-bold'
                        : 'text-[#A0A8B7] hover:bg-[#151923] hover:text-white'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-[#F0204F]" />}
                  </button>
                ))}
                <div className="mt-1.5 pt-1.5 border-t border-[#252A35]/60 px-2 text-[10px] text-[#A0A8B7]">
                  *Herhangi bir rolü anında test edebilirsiniz.
                </div>
              </div>
            )}
          </div>

          {/* Key Activation Button */}
          <button
            onClick={onOpenKeyModal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#252A35] bg-[#10131A] px-3 py-1.5 text-xs font-medium text-[#C8CDD5] hover:border-[#C8103D]/60 hover:text-white transition-all shadow-sm"
          >
            <Key className="h-3.5 w-3.5 text-[#C8103D]" />
            <span>Anahtar Gir</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#252A35] bg-[#10131A] text-[#A0A8B7] hover:border-[#252A35] hover:text-white transition-colors"
              aria-label="Bildirimler"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C8103D] text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#252A35] bg-[#10131A] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#252A35]/60 mb-1">
                  <span className="text-xs font-bold text-[#F0F2F6]">Sistem Bildirimleri</span>
                  <span className="text-[11px] text-[#A0A8B7]">{notifications.length} kayıt</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`cursor-pointer rounded-lg p-2 transition-colors ${
                        n.read ? 'bg-transparent text-[#A0A8B7]' : 'bg-[#151923] text-white border-l-2 border-[#C8103D]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold">{n.title}</span>
                        <span className="text-[10px] text-[#A0A8B7] whitespace-nowrap">
                          <FormattedDate date={n.timestamp} format="time" />
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#A0A8B7] line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Quick Button */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 rounded-lg border border-[#252A35] bg-[#10131A] p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-[#F0F2F6] hover:border-[#C8103D]/60 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#151923] text-[#F0204F] font-bold text-[11px]">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium text-xs">{currentUser.username}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
