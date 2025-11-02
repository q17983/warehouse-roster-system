import { NextResponse } from 'next/server';
import '@/lib/init';
import db from '@/lib/database';

/**
 * Debug endpoint to check database connection state
 */
export async function GET() {
  try {
    console.log('[Debug Connection] Checking database state...');
    
    // Force WAL checkpoint to see latest data
    try {
      const checkpointResult = db.pragma('wal_checkpoint(RESTART)', { simple: true });
      console.log('[Debug Connection] Forced WAL checkpoint, result:', checkpointResult);
    } catch (e) {
      console.warn('[Debug Connection] Checkpoint warning:', e);
    }
    
    // Check if global database exists
    const hasGlobal = !!(global as any).__database;
    console.log('[Debug Connection] Global database exists:', hasGlobal);
    
    // Try to query staff directly
    const staffResult = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    console.log('[Debug Connection] Direct staff count:', staffResult.count);
    
    // Get actual staff records
    const staffRecords = db.prepare('SELECT * FROM staff').all();
    console.log('[Debug Connection] Staff records:', staffRecords);
    
    // Try a JOIN query like roster does (to prove staff exist)
    const joinTest = db.prepare('SELECT s.* FROM staff s LIMIT 5').all();
    console.log('[Debug Connection] JOIN-style query returned:', joinTest.length, 'staff');
    
    // Check roster
    const rosterResult = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    console.log('[Debug Connection] Roster count:', rosterResult.count);
    
    // Check roster with JOIN (like the working query)
    const rosterWithStaff = db.prepare(`
      SELECT s.name, r.date 
      FROM roster r 
      INNER JOIN staff s ON r.staff_id = s.id 
      LIMIT 5
    `).all();
    console.log('[Debug Connection] Roster JOIN returned:', rosterWithStaff.length, 'rows');
    console.log('[Debug Connection] Roster JOIN data:', rosterWithStaff);
    
    // Check database path
    const dbPath = process.env.DATABASE_PATH || 'not set';
    
    return NextResponse.json({
      success: true,
      hasGlobalDatabase: hasGlobal,
      directStaffCount: staffResult.count,
      staffRecords: staffRecords,
      joinTestCount: joinTest.length,
      joinTestRecords: joinTest,
      rosterCount: rosterResult.count,
      rosterJoinCount: rosterWithStaff.length,
      rosterJoinSample: rosterWithStaff,
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

