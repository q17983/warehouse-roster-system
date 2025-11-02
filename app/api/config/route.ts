import { NextResponse } from 'next/server';

/**
 * Get configuration values (safe to expose - no secrets)
 * Used to pre-fill admin panel inputs
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    webAppUrl: process.env.APPS_SCRIPT_WEB_APP_URL || '',
    csvUrl: process.env.GOOGLE_SHEETS_CSV_URL || '',
    hasWebAppUrl: !!process.env.APPS_SCRIPT_WEB_APP_URL,
    hasCsvUrl: !!process.env.GOOGLE_SHEETS_CSV_URL,
  });
}

