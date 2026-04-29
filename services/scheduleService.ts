/**
 * Schedule Filtering & Class State Service
 *
 * Filters schedule data by semester, batch code, and day.
 * Determines real-time class state (live, upcoming, past).
 */

import type { ScheduleItem, DayCode, ClassState } from '@/types';
import { DAY_ORDER } from '@/types';

// ─── Day Mapping ─────────────────────────────────────────────────

/** Map JavaScript Date.getDay() (0=Sun) to our DayCode */
const JS_DAY_TO_CODE: Record<number, DayCode> = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  // Saturday = 6 → no classes
};

/**
 * Get the DayCode for today. Returns null on Saturday (no classes).
 */
export function getTodayCode(): DayCode | null {
  const jsDay = new Date().getDay();
  return JS_DAY_TO_CODE[jsDay] ?? null;
}

// ─── Filtering ───────────────────────────────────────────────────

/**
 * Filter schedule rows by semester + batch + optional day.
 */
export function getScheduleForBatch(
  allRows: ScheduleItem[],
  semesterName: string,
  batchCode: string,
  day?: DayCode,
): ScheduleItem[] {
  // First try: match exact semester
  const primaryFilter = allRows.filter((row) => {
    if (row.Semester !== semesterName) return false;
    if (day && row.Day !== day) return false;

    const batches = row.Batches.split(',').map((b) => b.trim());
    return batches.includes(batchCode);
  });

  if (primaryFilter.length > 0) {
    return primaryFilter.sort((a, b) => a.Start.localeCompare(b.Start));
  }

  // Fallback: if current semester has no classes for this batch, 
  // show classes from ANY semester (useful during transitions)
  return allRows
    .filter((row) => {
      if (day && row.Day !== day) return false;

      const batches = row.Batches.split(',').map((b) => b.trim());
      return batches.includes(batchCode);
    })
    .sort((a, b) => a.Start.localeCompare(b.Start));
}

/**
 * Get today's classes for a given batch.
 */
export function getClassesForToday(
  allRows: ScheduleItem[],
  semesterName: string,
  batchCode: string,
): ScheduleItem[] {
  const today = getTodayCode();
  if (!today) return []; // Saturday — no classes
  return getScheduleForBatch(allRows, semesterName, batchCode, today);
}

/**
 * Get all days (as DayCodes) that have at least one class for this batch.
 * Returns in standard order: MON → TUE → WED → THU → FRI → SUN
 */
export function getDaysWithClasses(
  allRows: ScheduleItem[],
  semesterName: string,
  batchCode: string,
): DayCode[] {
  const allBatchClasses = getScheduleForBatch(allRows, semesterName, batchCode);
  const daysSet = new Set(allBatchClasses.map((c) => c.Day));

  return DAY_ORDER.filter((d) => daysSet.has(d));
}

/**
 * Check if a batch code exists in any semester's schedule.
 */
export function batchExistsInSchedule(
  allRows: ScheduleItem[],
  batchCode: string,
): boolean {
  return allRows.some((row) => {
    const batches = row.Batches.split(',').map((b) => b.trim());
    return batches.includes(batchCode);
  });
}

// ─── Class State ─────────────────────────────────────────────────

/**
 * Parse a time string like "08:40" into a Date object for today.
 */
export function parseTimeToday(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Determine the visual state of a class card based on the current time.
 */
export function getClassState(classItem: ScheduleItem, now = new Date()): ClassState {
  const start = parseTimeToday(classItem.Start);
  const end = parseTimeToday(classItem.End);

  if (now >= end) {
    return 'past';
  }

  if (now >= start && now < end) {
    return 'live';
  }

  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes <= 60) {
    return 'upcoming-imminent';
  }

  return 'upcoming';
}

/**
 * Get minutes until class starts (for the "In X min" badge).
 */
export function getMinutesUntilStart(classItem: ScheduleItem, now = new Date()): number {
  const start = parseTimeToday(classItem.Start);
  const diffMs = start.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60)));
}
/**
 * Format a 24h time string (e.g. "14:20") to 12h format (e.g. "02:20 PM").
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hours12 = h % 12 || 12;
  const minutes = m.toString().padStart(2, "0");
  return `${hours12}:${minutes} ${ampm}`;
}
