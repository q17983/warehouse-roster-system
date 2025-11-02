import { NextResponse } from 'next/server';
import '@/lib/init';
import db from '@/lib/database';

/**
 * Debug endpoint to check database connection state
 */
export async function GET() {
  try {
    console.log('[Debug Connection] Checking database state...');
    
    // Check if global database exists
    const hasGlobal = !!(global as any).__database;
    console.log('[Debug Connection] Global database exists:', hasGlobal);
    
    // Try to query staff directly
    const staffResult = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    console.log('[Debug Connection] Direct staff count:', staffResult.count);
    
    // Get actual staff records
    const staffRecords = db.prepare('SELECT * FROM staff').all();
    console.log('[Debug Connection] Staff records:', staffRecords);
    
    // Check roster
    const rosterResult = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    console.log('[Debug Connection] Roster count:', rosterResult.count);
    
    // Check database path
    const dbPath = process.env.DATABASE_PATH || 'not set';
    
    return NextResponse.json({
      success: true,
      hasGlobalDatabase: hasGlobal,
      directStaffCount: staffResult.count,
      staffRecords: staffRecords,
      rosterCount: rosterResult.count,
      databasePath: dbPath,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error: any) {
    console.error('[Debug Connection] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

