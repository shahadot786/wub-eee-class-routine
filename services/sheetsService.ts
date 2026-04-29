/**
 * Google Sheets Data Service
 *
 * Fetches semester and schedule data from the public Google Sheets API.
 * Returns parsed typed arrays. On network failure returns null — caller should fall back to cache.
 */

import { getSheetUrl } from "@/config/sheets";
import type { Semester, ScheduleItem, DayCode } from "@/types";
import {
  validateSemesters,
  validateSchedule,
} from "@/services/validationService";

// ─── Row Parsers ─────────────────────────────────────────────────

function parseSemesterRow(row: string[]): Semester {
  return {
    Semester: row[0] ?? '',
    Start: row[1] ?? '',
    End: row[2] ?? '',
    Active: row[3] ?? '',
  };
}

function parseScheduleRow(row: string[]): ScheduleItem {
  return {
    Semester: row[0] ?? '',
    Day: (row[1] ?? 'MON') as DayCode,
    Start: row[2] ?? '',
    End: row[3] ?? '',
    Code: row[4] ?? '',
    Title: row[5] ?? '',
    Teacher: row[6] ?? '',
    Room: row[7] ?? '',
    Batches: row[8] ?? '',
    Type: (row[9] === 'Lab' ? 'Lab' : 'Class') as 'Class' | 'Lab',
    Credit: row[10] ?? '',
  };
}

// ─── Fetch Functions ─────────────────────────────────────────────

/**
 * Fetch the Semesters sheet. Returns null on any error.
 */
export async function fetchSemesters(): Promise<Semester[] | null> {
  try {
    const url = getSheetUrl('Semesters');
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    const rows: string[][] = data.values ?? [];

    // Parse and validate
    const parsed = rows.slice(1).map(parseSemesterRow);
    return validateSemesters(parsed);
  } catch {
    return null;
  }
}

/**
 * Fetch the Schedule sheet. Returns null on any error.
 */
export async function fetchSchedule(): Promise<ScheduleItem[] | null> {
  try {
    const url = getSheetUrl('Schedule');
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    const rows: string[][] = data.values ?? [];

    // Parse and validate
    const parsed = rows.slice(1).map(parseScheduleRow);
    return validateSchedule(parsed);
  } catch {
    return null;
  }
}

/**
 * Fetch both sheets at once.
 */
export async function fetchAllData(): Promise<{
  semesters: Semester[];
  schedule: ScheduleItem[];
} | null> {
  const [semesters, schedule] = await Promise.all([fetchSemesters(), fetchSchedule()]);

  if (!semesters || !schedule) return null;

  return { semesters, schedule };
}
