import { NextRequest, NextResponse } from 'next/server';
import { fetchCleanData } from '@/lib/appsScriptData';
import { processCleanData } from '@/lib/brain';
import '@/lib/init';

export async function POST(request: NextRequest) {
  try {
    const { webAppUrl, csvUrl } = await request.json().catch(() => ({}));
    
    const webAppUrlToUse = webAppUrl || process.env.APPS_SCRIPT_WEB_APP_URL;
    const csvUrlToUse = csvUrl || process.env.GOOGLE_SHEETS_CSV_URL;
    
    if (!webAppUrlToUse && !csvUrlToUse) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data source configured' 
      }, { status: 400 });
    }
    
    const cleanData = await fetchCleanData(webAppUrlToUse, csvUrlToUse);
    
    if (!cleanData.success) {
      return NextResponse.json({ 
        success: false, 
        message: cleanData.error || 'Failed to fetch data' 
      }, { status: 400 });
    }

    const result = await processCleanData(cleanData);

    return NextResponse.json({
      success: true,
      message: 'Data processed successfully',
      stats: result,
      timestamp: cleanData.timestamp,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to process data',
    }, { status: 500 });
  }
}
