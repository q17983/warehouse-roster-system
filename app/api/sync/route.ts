import { NextRequest, NextResponse } from 'next/server';
import { fetchCleanData } from '@/lib/appsScriptData';
import { processCleanData } from '@/lib/brain';
import '@/lib/init'; // Initialize database

/**
 * Public API endpoint for automatic syncing
 * Can be called by cron jobs, webhooks, or scheduled tasks
 * 
 * Usage:
 * - GET or POST to /api/sync
 * - Can be called automatically every hour
 * - Uses environment variables for configuration
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    // Use environment variables for data source
    const webAppUrl = process.env.APPS_SCRIPT_WEB_APP_URL;
    const csvUrl = process.env.GOOGLE_SHEETS_CSV_URL;
    
    if (!webAppUrl && !csvUrl) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data source configured. Set APPS_SCRIPT_WEB_APP_URL or GOOGLE_SHEETS_CSV_URL in environment variables.' 
      }, { status: 400 });
    }
    
    // Fetch cleaned data from Apps Script
    const cleanData = await fetchCleanData(webAppUrl, csvUrl);
    
    if (!cleanData.success) {
      return NextResponse.json({ 
        success: false, 
        message: cleanData.error || 'Failed to fetch data from Apps Script' 
      }, { status: 400 });
    }

    // Process the cleaned data through the "brain"
    const result = await processCleanData(cleanData);

    return NextResponse.json({
      success: true,
      message: 'Data synced successfully',
      stats: result,
      timestamp: cleanData.timestamp,
    });
  } catch (error: any) {
    console.error('Error syncing data:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to sync data',
    }, { status: 500 });
  }
}

