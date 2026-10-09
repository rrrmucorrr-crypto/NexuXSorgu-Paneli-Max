import { useSyncExternalStore } from 'react';
import {
  User,
  UserRole,
  AccessKey,
  HistoryRecord,
  AuditLogItem,
  SupportTicket,
  SystemNotification,
  MockEngineSettings,
  TableColumnPreference,
} from './types';

const STORAGE_KEYS = {
  CURRENT_USER: 'nexux_current_user',
  ALL_USERS: 'nexux_all_users',
  ACCESS_KEYS: 'nexux_access_keys',
  HISTORY: 'nexux_history',
  SAVED_RESULTS: 'nexux_saved_results',
  AUDIT_LOGS: 'nexux_audit_logs',
  NOTIFICATIONS: 'nexux_notifications',
  TICKETS: 'nexux_support_tickets',
  SETTINGS: 'nexux_engine_settings',
  COLUMN_PREFS: 'nexux_column_preferences',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    username: 'TanrıAdmin',
    email: 'admin@nexuxtanri.cyber',
    role: 'ADMIN',
    status: 'ACTIVE',
    queriesRunCount: 42,
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr-yonetici-02',
    username: 'SistemYöneticisi',
    email: 'yonetici@nexuxtanri.cyber',
    role: 'YONETICI',
    status: 'ACTIVE',
    queriesRunCount: 28,
    createdAt: '2026-01-05T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr-ultra-03',
    username: 'CyberUltra',
    email: 'ultra@nexuxtanri.cyber',
    role: 'ULTRA',
    status: 'ACTIVE',
    queriesRunCount: 65,
    createdAt: '2026-01-10T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr-vip-04',
    username: 'VipSorguUzmanı',
    email: 'vip@nexuxtanri.cyber',
    role: 'VIP',
    status: 'ACTIVE',
    queriesRunCount: 19,
    createdAt: '2026-01-15T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr-prem-05',
    username: 'PremiumUser',
    email: 'premium@nexuxtanri.cyber',
    role: 'PREMIUM',
    status: 'ACTIVE',
    queriesRunCount: 12,
    createdAt: '2026-02-01T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr-free-06',
    username: 'FreeDeneme',
    email: 'free@nexuxtanri.cyber',
    role: 'FREE',
    status: 'ACTIVE',
    queriesRunCount: 4,
    createdAt: '2026-02-10T00:00:00Z',
    lastLoginAt: '2026-03-08T09:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-03-08T08:00:00Z',
    userId: 'usr-admin-01',
    username: 'TanrıAdmin',
    userRole: 'ADMIN',
    action: 'SYSTEM_BOOT',
    targetModule: 'CORE',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Internal)',
    details: 'NexuXTanrı 𖤟 SorguPaneli başlatıldı ve 101 sorgu kütüğü doğrulandı.',
  },
];

export const INITIAL_KEYS: AccessKey[] = [
  {
    id: 'key-01',
    keyCode: 'NEXUX-ULTRA-9981-VIPX',
    roleGranted: 'ULTRA',
    durationLabel: 'Sınırsız',
    durationDays: null,
    quota: 10000,
    usedCount: 142,
    status: 'ACTIVE',
    assignedToUser: 'CyberUltra',
    createdAt: '2026-01-01T12:00:00Z',
    expiresAt: null,
  },
  {
    id: 'key-02',
    keyCode: 'NEXUX-VIP-30D-8821',
    roleGranted: 'VIP',
    durationLabel: '30 Gün',
    durationDays: 30,
    quota: 500,
    usedCount: 88,
    status: 'ACTIVE',
    assignedToUser: 'VipSorguUzmanı',
    createdAt: '2026-03-01T10:00:00Z',
    expiresAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'key-03',
    keyCode: 'NEXUX-PREM-7D-5501',
    roleGranted: 'PREMIUM',
    durationLabel: '7 Gün',
    durationDays: 7,
    quota: 150,
    usedCount: 24,
    status: 'ACTIVE',
    createdAt: '2026-03-05T08:00:00Z',
    expiresAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'key-04',
    keyCode: 'NEXUX-TRIAL-1D-1092',
    roleGranted: 'PREMIUM',
    durationLabel: '1 Gün',
    durationDays: 1,
    quota: 25,
    usedCount: 25,
    status: 'EXPIRED',
    createdAt: '2026-03-01T09:00:00Z',
    expiresAt: '2026-03-02T09:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Sistem Başlatıldı',
    message: 'NexuXTanrı 𖤟 SorguPaneli v2.6 sürümüyle 12 kategori ve 101 sentetik modül aktif.',
    type: 'INFO',
    timestamp: '2026-03-08T09:00:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Sentetik Veri Güvencesi',
    message: 'Tüm sorgular deterministik simülasyon motoru ile çalışmaktadır. Gerçek kişisel veri kullanılmaz.',
    type: 'SUCCESS',
    timestamp: '2026-03-08T09:30:00Z',
    read: false,
  },
];

export const INITIAL_SETTINGS: MockEngineSettings = {
  delayMs: 350,
  simulateFailureRate: 0,
  deterministicSeed: true,
  maintenanceMode: false,
  rateLimitPerMinute: 60,
};

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-2026-001',
    userId: 'usr-admin-01',
    username: 'TanrıAdmin',
    subject: 'Sentetik Veri Motoru Doğrulama ve Entegrasyon',
    category: 'Teknik Destek',
    priority: 'YÜKSEK',
    status: 'ÇÖZÜLDÜ',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T11:30:00Z',
    messages: [
      {
        sender: 'USER',
        senderName: 'TanrıAdmin',
        timestamp: '2026-03-01T10:00:00Z',
        message: '101 sorgu modülünün tamamı için sentetik şema kontrolleri başarıyla devreye alındı mı?',
      },
      {
        sender: 'SUPPORT_AI',
        senderName: 'NexuX Siber Destek AI',
        timestamp: '2026-03-01T11:30:00Z',
        message: 'Tüm 12 kategori ve 101 sorgu deterministik motor ile doğrulanmıştır. Gerçek kişisel veri bağlantısı sıfırdır.',
      },
    ],
  },
];

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const EMPTY_HISTORY: HistoryRecord[] = [];
export const EMPTY_SAVED: HistoryRecord[] = [];

// Memory caches for stable references during useSyncExternalStore
let cachedCurrentUser: User | null = null;
let cachedAllUsers: User[] | null = null;
let cachedAccessKeys: AccessKey[] | null = null;
let cachedHistory: HistoryRecord[] | null = null;
let cachedSavedResults: HistoryRecord[] | null = null;
let cachedAuditLogs: AuditLogItem[] | null = null;
let cachedNotifications: SystemNotification[] | null = null;
let cachedSettings: MockEngineSettings | null = null;
let cachedTickets: SupportTicket[] | null = null;

const listeners = new Set<() => void>();

export function notifyStorageChange(): void {
  listeners.forEach((l) => l());
}

export function subscribeStorage(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = () => {
    // Reset caches on external window event
    cachedCurrentUser = null;
    cachedAllUsers = null;
    cachedAccessKeys = null;
    cachedHistory = null;
    cachedSavedResults = null;
    cachedAuditLogs = null;
    cachedNotifications = null;
    cachedSettings = null;
    cachedTickets = null;
    callback();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

// STORAGE API
export const StorageAPI = {
  getCurrentUser(): User {
    if (typeof window === 'undefined') return INITIAL_USERS[0];
    if (!cachedCurrentUser) {
      cachedCurrentUser = safeGet<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
    return cachedCurrentUser;
  },
  setCurrentUser(user: User): void {
    cachedCurrentUser = user;
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
    // Also update in all users
    const all = this.getAllUsers();
    const idx = all.findIndex((u) => u.id === user.id);
    const updatedAll = [...all];
    if (idx !== -1) {
      updatedAll[idx] = user;
    } else {
      updatedAll.push(user);
    }
    cachedAllUsers = updatedAll;
    safeSet(STORAGE_KEYS.ALL_USERS, updatedAll);
    notifyStorageChange();
  },
  getAllUsers(): User[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    if (!cachedAllUsers) {
      cachedAllUsers = safeGet<User[]>(STORAGE_KEYS.ALL_USERS, INITIAL_USERS);
    }
    return cachedAllUsers;
  },
  setAllUsers(users: User[]): void {
    cachedAllUsers = users;
    safeSet(STORAGE_KEYS.ALL_USERS, users);
    notifyStorageChange();
  },
  switchRole(role: UserRole): User {
    const curr = this.getCurrentUser();
    const updated = { ...curr, role };
    this.setCurrentUser(updated);
    this.addAuditLog('ROLE_SWITCH', 'AUTH', 'SUCCESS', `Rol ${role} olarak değiştirildi`);
    return updated;
  },
  getAccessKeys(): AccessKey[] {
    if (typeof window === 'undefined') return INITIAL_KEYS;
    if (!cachedAccessKeys) {
      cachedAccessKeys = safeGet<AccessKey[]>(STORAGE_KEYS.ACCESS_KEYS, INITIAL_KEYS);
    }
    return cachedAccessKeys;
  },
  setAccessKeys(keys: AccessKey[]): void {
    cachedAccessKeys = keys;
    safeSet(STORAGE_KEYS.ACCESS_KEYS, keys);
    notifyStorageChange();
  },
  createKey(
    role: UserRole,
    durationLabel: '1 Gün' | '7 Gün' | '30 Gün' | 'Sınırsız',
    quota: number
  ): AccessKey {
    const daysMap: Record<string, number | null> = {
      '1 Gün': 1,
      '7 Gün': 7,
      '30 Gün': 30,
      Sınırsız: null,
    };
    const days = daysMap[durationLabel];
    const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newKey: AccessKey = {
      id: `key-${Date.now()}`,
      keyCode: `NEXUX-${role}-${randomHex}-${randomNum}`,
      roleGranted: role,
      durationLabel,
      durationDays: days,
      quota,
      usedCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    const keys = [newKey, ...this.getAccessKeys()];
    this.setAccessKeys(keys);
    this.addAuditLog('KEY_CREATE', 'KEY_SYSTEM', 'SUCCESS', `Yeni ${role} anahtarı oluşturuldu: ${newKey.keyCode}`);
    return newKey;
  },
  activateKey(keyCode: string): { success: boolean; message: string; role?: UserRole } {
    const keys = [...this.getAccessKeys()];
    const key = keys.find((k) => k.keyCode.trim().toUpperCase() === keyCode.trim().toUpperCase());
    if (!key) {
      return { success: false, message: 'Geçersiz lisans anahtarı. Lütfen kontrol edip tekrar deneyin.' };
    }
    if (key.status === 'REVOKED') {
      return { success: false, message: 'Bu lisans anahtarı sistem yöneticisi tarafından iptal edilmiştir.' };
    }
    if (key.status === 'EXPIRED' || (key.expiresAt && new Date(key.expiresAt) < new Date())) {
      key.status = 'EXPIRED';
      this.setAccessKeys(keys);
      return { success: false, message: 'Bu anahtarın kullanım süresi dolmuştur.' };
    }
    if (key.quota > 0 && key.usedCount >= key.quota) {
      return { success: false, message: 'Bu anahtarın sorgu kullanım kotası dolmuştur.' };
    }

    key.usedCount += 1;
    const currUser = this.getCurrentUser();
    key.assignedToUser = currUser.username;
    this.setAccessKeys(keys);

    // Upgrade user role
    const updatedUser: User = {
      ...currUser,
      role: key.roleGranted,
      activeKeyId: key.id,
      expiresAt: key.expiresAt || undefined,
    };
    this.setCurrentUser(updatedUser);
    this.addAuditLog('KEY_ACTIVATE', 'KEY_SYSTEM', 'SUCCESS', `Anahtar etkinleştirildi: ${key.keyCode} -> ${key.roleGranted}`);
    return { success: true, message: `Başarıyla ${key.roleGranted} seviyesine yükseltildi!`, role: key.roleGranted };
  },
  revokeKey(keyId: string): void {
    const keys = [...this.getAccessKeys()];
    const target = keys.find((k) => k.id === keyId);
    if (target) {
      target.status = 'REVOKED';
      this.setAccessKeys(keys);
      this.addAuditLog('KEY_REVOKE', 'KEY_SYSTEM', 'SUCCESS', `Anahtar iptal edildi: ${target.keyCode}`);
    }
  },
  extendKey(keyId: string, additionalDays: number): void {
    const keys = [...this.getAccessKeys()];
    const target = keys.find((k) => k.id === keyId);
    if (target) {
      const base = target.expiresAt ? new Date(target.expiresAt) : new Date();
      target.expiresAt = new Date(base.getTime() + additionalDays * 86400000).toISOString();
      target.status = 'ACTIVE';
      this.setAccessKeys(keys);
      this.addAuditLog('KEY_EXTEND', 'KEY_SYSTEM', 'SUCCESS', `Anahtar süresi +${additionalDays} gün uzatıldı: ${target.keyCode}`);
    }
  },
  getHistory(): HistoryRecord[] {
    if (typeof window === 'undefined') return EMPTY_HISTORY;
    if (!cachedHistory) {
      cachedHistory = safeGet<HistoryRecord[]>(STORAGE_KEYS.HISTORY, EMPTY_HISTORY);
    }
    return cachedHistory;
  },
  addHistory(item: HistoryRecord): void {
    const list = [item, ...this.getHistory()];
    if (list.length > 100) list.pop();
    cachedHistory = list;
    safeSet(STORAGE_KEYS.HISTORY, list);

    // Update user queries count
    const curr = this.getCurrentUser();
    curr.queriesRunCount = (curr.queriesRunCount || 0) + 1;
    this.setCurrentUser(curr);
    notifyStorageChange();
  },
  clearHistory(): void {
    cachedHistory = EMPTY_HISTORY;
    safeSet(STORAGE_KEYS.HISTORY, EMPTY_HISTORY);
    this.addAuditLog('HISTORY_CLEAR', 'HISTORY', 'SUCCESS', 'Tüm sorgu geçmişi temizlendi');
    notifyStorageChange();
  },
  getSavedResults(): HistoryRecord[] {
    if (typeof window === 'undefined') return EMPTY_SAVED;
    if (!cachedSavedResults) {
      cachedSavedResults = safeGet<HistoryRecord[]>(STORAGE_KEYS.SAVED_RESULTS, EMPTY_SAVED);
    }
    return cachedSavedResults;
  },
  saveResult(item: HistoryRecord): void {
    const list = this.getSavedResults();
    if (!list.some((x) => x.id === item.id)) {
      const updated = [item, ...list];
      cachedSavedResults = updated;
      safeSet(STORAGE_KEYS.SAVED_RESULTS, updated);
      this.addAuditLog('RESULT_SAVE', 'DOSSIER', 'SUCCESS', `Sonuç kaydedildi: ${item.referenceNo}`);
      notifyStorageChange();
    }
  },
  removeSavedResult(id: string): void {
    const list = this.getSavedResults().filter((x) => x.id !== id);
    cachedSavedResults = list;
    safeSet(STORAGE_KEYS.SAVED_RESULTS, list);
    notifyStorageChange();
  },
  getAuditLogs(): AuditLogItem[] {
    if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
    if (!cachedAuditLogs) {
      cachedAuditLogs = safeGet<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    return cachedAuditLogs;
  },
  addAuditLog(
    action: string,
    targetModule: string,
    status: 'SUCCESS' | 'FAILED' | 'BLOCKED',
    details: string
  ): void {
    const logs = [...this.getAuditLogs()];
    const curr = this.getCurrentUser();
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: curr.id,
      username: curr.username,
      userRole: curr.role,
      action,
      targetModule,
      status,
      ipAddress: '192.168.1.100 (Simüle)',
      details,
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    cachedAuditLogs = logs;
    safeSet(STORAGE_KEYS.AUDIT_LOGS, logs);
    notifyStorageChange();
  },
  getNotifications(): SystemNotification[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    if (!cachedNotifications) {
      cachedNotifications = safeGet<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    return cachedNotifications;
  },
  markNotificationRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    cachedNotifications = list;
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
    notifyStorageChange();
  },
  getSettings(): MockEngineSettings {
    if (typeof window === 'undefined') return INITIAL_SETTINGS;
    if (!cachedSettings) {
      cachedSettings = safeGet<MockEngineSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    return cachedSettings;
  },
  setSettings(settings: MockEngineSettings): void {
    cachedSettings = settings;
    safeSet(STORAGE_KEYS.SETTINGS, settings);
    this.addAuditLog('SETTINGS_UPDATE', 'MOCK_ENGINE', 'SUCCESS', `Motor ayarları güncellendi: ${JSON.stringify(settings)}`);
    notifyStorageChange();
  },
  getTickets(): SupportTicket[] {
    if (typeof window === 'undefined') return INITIAL_TICKETS;
    if (!cachedTickets) {
      cachedTickets = safeGet<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
    }
    return cachedTickets;
  },
  createTicket(subject: string, category: string, priority: SupportTicket['priority'], message: string): SupportTicket {
    const curr = this.getCurrentUser();
    const newTicket: SupportTicket = {
      id: `TCK-2026-${Math.floor(100 + Math.random() * 900)}`,
      userId: curr.id,
      username: curr.username,
      subject,
      category,
      priority,
      status: 'AÇIK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          sender: 'USER',
          senderName: curr.username,
          timestamp: new Date().toISOString(),
          message,
        },
      ],
    };
    const list = [newTicket, ...this.getTickets()];
    cachedTickets = list;
    safeSet(STORAGE_KEYS.TICKETS, list);
    this.addAuditLog('TICKET_CREATE', 'SUPPORT', 'SUCCESS', `Yeni destek talebi açıldı: ${newTicket.id}`);
    notifyStorageChange();
    return newTicket;
  },
  getTableColumnPreference(userId: string, queryId: string): TableColumnPreference | null {
    const allPrefs = safeGet<Record<string, TableColumnPreference>>(STORAGE_KEYS.COLUMN_PREFS, {});
    const key = `${userId}::${queryId}`;
    return allPrefs[key] || null;
  },
  setTableColumnPreference(
    userId: string,
    queryId: string,
    preference: TableColumnPreference
  ): void {
    const allPrefs = safeGet<Record<string, TableColumnPreference>>(STORAGE_KEYS.COLUMN_PREFS, {});
    const key = `${userId}::${queryId}`;
    allPrefs[key] = preference;
    safeSet(STORAGE_KEYS.COLUMN_PREFS, allPrefs);
    notifyStorageChange();
  },
  resetTableColumnPreference(userId: string, queryId: string): void {
    const allPrefs = safeGet<Record<string, TableColumnPreference>>(STORAGE_KEYS.COLUMN_PREFS, {});
    const key = `${userId}::${queryId}`;
    if (allPrefs[key]) {
      delete allPrefs[key];
      safeSet(STORAGE_KEYS.COLUMN_PREFS, allPrefs);
      notifyStorageChange();
    }
  },
};

// Stable snapshot getters for useSyncExternalStore
const getServerCurrentUser = () => INITIAL_USERS[0];
const getServerHistory = () => EMPTY_HISTORY;
const getServerSavedResults = () => EMPTY_SAVED;
const getServerAccessKeys = () => INITIAL_KEYS;
const getServerAllUsers = () => INITIAL_USERS;
const getServerNotifications = () => INITIAL_NOTIFICATIONS;
const getServerSettings = () => INITIAL_SETTINGS;
const getServerAuditLogs = () => INITIAL_AUDIT_LOGS;
const getServerTickets = () => INITIAL_TICKETS;

const getClientCurrentUser = () => StorageAPI.getCurrentUser();
const getClientHistory = () => StorageAPI.getHistory();
const getClientSavedResults = () => StorageAPI.getSavedResults();
const getClientAccessKeys = () => StorageAPI.getAccessKeys();
const getClientAllUsers = () => StorageAPI.getAllUsers();
const getClientNotifications = () => StorageAPI.getNotifications();
const getClientSettings = () => StorageAPI.getSettings();
const getClientAuditLogs = () => StorageAPI.getAuditLogs();
const getClientTickets = () => StorageAPI.getTickets();

// React safe subscription hooks
export function useCurrentUser(): User {
  return useSyncExternalStore(subscribeStorage, getClientCurrentUser, getServerCurrentUser);
}

export function useHistory(): HistoryRecord[] {
  return useSyncExternalStore(subscribeStorage, getClientHistory, getServerHistory);
}

export function useSavedResults(): HistoryRecord[] {
  return useSyncExternalStore(subscribeStorage, getClientSavedResults, getServerSavedResults);
}

export function useAccessKeys(): AccessKey[] {
  return useSyncExternalStore(subscribeStorage, getClientAccessKeys, getServerAccessKeys);
}

export function useAllUsers(): User[] {
  return useSyncExternalStore(subscribeStorage, getClientAllUsers, getServerAllUsers);
}

export function useNotifications(): SystemNotification[] {
  return useSyncExternalStore(subscribeStorage, getClientNotifications, getServerNotifications);
}

export function useEngineSettings(): MockEngineSettings {
  return useSyncExternalStore(subscribeStorage, getClientSettings, getServerSettings);
}

export function useAuditLogs(): AuditLogItem[] {
  return useSyncExternalStore(subscribeStorage, getClientAuditLogs, getServerAuditLogs);
}

export function useTickets(): SupportTicket[] {
  return useSyncExternalStore(subscribeStorage, getClientTickets, getServerTickets);
}
