import { NextRequest, NextResponse } from 'next/server';
import { fetchCleanData } from '@/lib/appsScriptData';
import { processCleanData } from '@/lib/brain';
import '@/lib/init'; // Initialize database

/**
 * API endpoint to trigger the "brain" to process data from Apps Script
 */
export async function POST(request: NextRequest) {
  try {
    const { webAppUrl, csvUrl } = await request.json().catch(() => ({}));
    
    // Use environment variables if not provided in request
    const webAppUrlToUse = webAppUrl || process.env.APPS_SCRIPT_WEB_APP_URL;
    const csvUrlToUse = csvUrl || process.env.GOOGLE_SHEETS_CSV_URL;
    
    if (!webAppUrlToUse && !csvUrlToUse) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data source configured. Provide APPS_SCRIPT_WEB_APP_URL or GOOGLE_SHEETS_CSV_URL in environment variables or request body.' 
      }, { status: 400 });
    }
    
    // Fetch cleaned data from Apps Script
    const cleanData = await fetchCleanData(webAppUrlToUse, csvUrlToUse);
    
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
      message: 'Data processed successfully',
      stats: result,
      timestamp: cleanData.timestamp,
    });
  } catch (error: any) {
    console.error('Error processing data:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to process data',
    }, { status: 500 });
  }
}
