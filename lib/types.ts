export type UserRole = 'FREE' | 'PREMIUM' | 'VIP' | 'ULTRA' | 'ADMIN' | 'YONETICI';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  activeKeyId?: string;
  expiresAt?: string;
  queriesRunCount: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface AccessKey {
  id: string;
  keyCode: string;
  roleGranted: UserRole;
  durationLabel: '1 Gün' | '7 Gün' | '30 Gün' | 'Sınırsız';
  durationDays: number | null; // null for unlimited
  quota: number; // max queries
  usedCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  assignedToUser?: string;
  createdAt: string;
  expiresAt: string | null;
}

export type QueryCategoryCode =
  | 'KIMLIK'
  | 'AILE'
  | 'ADRES'
  | 'ILETISIM'
  | 'SAGLIK'
  | 'SEYAHAT'
  | 'FINANS'
  | 'ARAC'
  | 'TICARI'
  | 'EGITIM'
  | 'YASAL'
  | 'SISTEM';

export interface QueryCategory {
  id: QueryCategoryCode;
  index: string; // e.g. "01"
  name: string;
  description: string;
  icon: string;
}

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'daterange';

export interface QueryField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  helpText?: string;
}

export type ResultLayoutType =
  | 'identity-dossier'
  | 'family-tree'
  | 'timeline'
  | 'tabular'
  | 'telecom-card'
  | 'medical-record'
  | 'travel-itinerary'
  | 'financial-statement'
  | 'vehicle-registry'
  | 'commercial-ledger'
  | 'education-diploma'
  | 'legal-case'
  | 'system-logs';

export interface QueryDefinition {
  id: string;
  name: string;
  category: QueryCategoryCode;
  minRole: UserRole;
  description: string;
  fields: QueryField[];
  samplePayload: Record<string, string>;
  layoutType: ResultLayoutType;
}

export interface SyntheticMetadata {
  mode: 'DEMO';
  synthetic: true;
  source: 'SYNTHETIC_DATA_ENGINE';
  generatedAt: string;
  queryType: string;
  queryName: string;
  requestReference: string;
  executionTimeMs: number;
  engineVersion: string;
}

export interface SyntheticResultSummaryItem {
  label: string;
  value: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface SyntheticCardItem {
  title: string;
  subtitle?: string;
  badge?: string;
  status?: 'NORMAL' | 'SUCCESS' | 'WARNING' | 'ALERT';
  attributes: { label: string; value: string }[];
}

export interface SyntheticTimelineEvent {
  date: string;
  title: string;
  description: string;
  category: string;
  tag?: string;
}

export interface SyntheticTreeNode {
  id: string;
  relation: string;
  name: string;
  birthYear: string;
  status: string;
  children?: SyntheticTreeNode[];
}

export interface SyntheticQueryResult {
  meta: SyntheticMetadata;
  inputs: Record<string, string>;
  status: 'SUCCESS' | 'NO_DATA' | 'SIMULATED_ERROR';
  errorMessage?: string;
  summary: SyntheticResultSummaryItem[];
  cards: SyntheticCardItem[];
  tableHeaders: string[];
  tableRows: string[][];
  timeline?: SyntheticTimelineEvent[];
  treeData?: SyntheticTreeNode[];
  legalDossier?: {
    dossierNo: string;
    courtName: string;
    filingDate: string;
    caseStatus: string;
    parties: string[];
    summaryText: string;
  };
  rawJson: Record<string, unknown>;
}

export interface HistoryRecord {
  id: string;
  referenceNo: string;
  queryId: string;
  queryName: string;
  category: QueryCategoryCode;
  username: string;
  timestamp: string;
  status: 'SUCCESS' | 'EMPTY' | 'ERROR';
  executionTimeMs: number;
  inputsMasked: Record<string, string>;
  resultSnapshot: SyntheticQueryResult;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  userRole: UserRole;
  action: string;
  targetModule: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  ipAddress: string;
  details: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  priority: 'DÜŞÜK' | 'NORMAL' | 'YÜKSEK' | 'KRİTİK';
  status: 'AÇIK' | 'YANITLANDI' | 'ÇÖZÜLDÜ';
  createdAt: string;
  updatedAt: string;
  messages: {
    sender: 'USER' | 'SUPPORT_AI';
    senderName: string;
    timestamp: string;
    message: string;
  }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  timestamp: string;
  read: boolean;
}

export interface MockEngineSettings {
  delayMs: number;
  simulateFailureRate: number; // 0 to 100 percentage
  deterministicSeed: boolean;
  maintenanceMode: boolean;
  rateLimitPerMinute: number;
}

export interface TableColumnPreference {
  visibleColumns: string[];
  columnOrder: string[];
}

