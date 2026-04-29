/**
 * Google Sheets API Configuration
 *
 * Setup:
 * 1. Create a Google Sheet with tabs "Semesters" and "Schedule"
 * 2. Share it as "Anyone with the link → Viewer"
 * 3. Get the Sheet ID from the URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
 * 4. Get an API Key from Google Cloud Console (Sheets API → Credentials)
 * 5. Replace the placeholder values below
 */

// ──────────────────────────────────────────────────────────────────
export const SHEET_ID = process.env.EXPO_PUBLIC_SHEET_ID;
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

if (!SHEET_ID || !API_KEY) {
  throw new Error("Missing required environment variables: EXPO_PUBLIC_SHEET_ID and EXPO_PUBLIC_API_KEY");
}

// ─── URL Builders ────────────────────────────────────────────────

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Build the Sheets API URL for a specific tab.
 * Returns all rows as a flat array via `valueRenderOption=FORMATTED_VALUE`.
 */
export function getSheetUrl(sheetName: string): string {
  return `${BASE_URL}/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}&valueRenderOption=FORMATTED_VALUE`;
}
