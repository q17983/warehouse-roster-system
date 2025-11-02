/**
 * Google Sheets API integration for reading form responses
 */

import { google } from 'googleapis';
import { parseGoogleSheetsRow, RawFormData } from './brain';

let sheets: any = null;

/**
 * Initialize Google Sheets API client
 */
export async function initializeGoogleSheets() {
  if (sheets) return sheets;

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const authClient = await auth.getClient();
  sheets = google.sheets({ version: 'v4', auth: authClient });

  return sheets;
}

/**
 * Fetch form responses from Google Sheets
 */
export async function fetchFormResponses(sheetName: string = 'Form_Responses3'): Promise<RawFormData[]> {
  const sheetsClient = await initializeGoogleSheets();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID environment variable is not set');
  }

  try {
    // Get the sheet data
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`, // Adjust range as needed
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Parse each row
    const rawData: RawFormData[] = [];
    for (const row of dataRows) {
      const parsed = parseGoogleSheetsRow(row, headers);
      if (parsed) {
        rawData.push(parsed);
      }
    }

    return rawData;
  } catch (error: any) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error(`Failed to fetch Google Sheets data: ${error.message}`);
  }
}

/**
 * Test connection to Google Sheets
 */
export async function testConnection(): Promise<boolean> {
  try {
    await initializeGoogleSheets();
    return true;
  } catch (error) {
    console.error('Google Sheets connection test failed:', error);
    return false;
  }
}

