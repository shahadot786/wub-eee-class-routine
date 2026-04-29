// ─── Core Data Types ─────────────────────────────────────────────

export interface Semester {
  Semester: string;
  Start: string;
  End: string;
  Active: string;
}

export interface ScheduleItem {
  Semester: string;
  Day: DayCode;
  Start: string;
  End: string;
  Code: string;
  Title: string;
  Teacher: string;
  Room: string;
  Batches: string;
  Type: 'Class' | 'Lab';
  Credit?: string;
}

export type DayCode = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SUN';

export const DAY_ORDER: DayCode[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SUN'];

// ─── UI State Types ──────────────────────────────────────────────

export type ClassState = 'live' | 'upcoming-imminent' | 'upcoming' | 'past';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type Language = 'bn' | 'en';

export interface NotificationPreferences {
  enabled: boolean;
  before15: boolean;
  before5: boolean;
  atStart: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  enabled: true,
  before15: true,
  before5: true,
  atStart: true,
};

// ─── Theme Token Types ───────────────────────────────────────────

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  live: string;
  badgeClassBg: string;
  badgeClassText: string;
  badgeLabBg: string;
  badgeLabText: string;
}

// ─── Schedule Data Bundle ────────────────────────────────────────

export interface ScheduleData {
  semesters: Semester[];
  schedule: ScheduleItem[];
  lastUpdated: string;
}
