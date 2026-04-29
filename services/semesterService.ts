/**
 * Semester Detection Service
 *
 * Determines the current active semester based on today's date
 * and the semester date ranges from the Semesters sheet.
 */

import type { Semester } from '@/types';

/**
 * Robustly parse a date string.
 * Handles ISO (YYYY-MM-DD) and common US format (M/D/YYYY) from Google Sheets.
 */
function safeParseDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);

  // Try default parsing first (works for ISO and some others)
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Handle M/D/YYYY (e.g. 4/30/2026)
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Handle YYYY-MM-DD manually as fallback
  const partsDash = dateStr.split('-');
  if (partsDash.length === 3) {
    const year = parseInt(partsDash[0], 10);
    const month = parseInt(partsDash[1], 10) - 1;
    const day = parseInt(partsDash[2], 10);
    d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  return new Date(NaN);
}

/**
 * Find the current semester by checking date ranges against today.
 * Falls back to the semester marked Active = TRUE if no date range matches.
 * Returns null during semester breaks.
 */
export function getCurrentSemester(semesters: Semester[]): Semester | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight for date comparison

  // Primary: find semester whose date range contains today
  const byDate = semesters.find((s) => {
    const start = safeParseDate(s.Start);
    const end = safeParseDate(s.End);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });

  if (byDate) return byDate;

  // Fallback: use the semester manually marked Active = TRUE
  return semesters.find((s) => s.Active.toUpperCase() === 'TRUE') ?? null;
}

/**
 * Calculate the number of days remaining in a semester.
 * Returns 0 if the semester has ended.
 */
export function getDaysRemaining(semester: Semester): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = safeParseDate(semester.End);
  if (isNaN(end.getTime())) return 0;
  
  end.setHours(0, 0, 0, 0);

  const diffMs = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
