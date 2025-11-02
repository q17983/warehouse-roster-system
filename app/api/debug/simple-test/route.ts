import { NextResponse } from 'next/server';
import '@/lib/init';
import db from '@/lib/database';

/**
 * Simplest possible test - write and read in same request
 */
export async function GET() {
  try {
    console.log('[Simple Test] Starting...');
    
    // Count staff before
    const beforeCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    console.log('[Simple Test] Staff count BEFORE:', beforeCount.count);
    
    // Insert a test record
    const testName = `Test_${Date.now()}`;
    console.log('[Simple Test] Inserting:', testName);
    
    const insertResult = db.prepare('INSERT INTO staff (name, phone) VALUES (?, ?)').run(testName, '12345');
    console.log('[Simple Test] Insert result:', insertResult);
    
    // Count staff after
    const afterCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    console.log('[Simple Test] Staff count AFTER:', afterCount.count);
    
    // Get all staff
    const allStaff = db.prepare('SELECT * FROM staff').all();
    console.log('[Simple Test] All staff:', allStaff);
    
    // Try to get the one we just inserted
    const justInserted = db.prepare('SELECT * FROM staff WHERE name = ?').get(testName);
    console.log('[Simple Test] Just inserted:', justInserted);
    
    return NextResponse.json({
      success: true,
      test: 'Write and read in same request',
      beforeCount: beforeCount.count,
      afterCount: afterCount.count,
      insertResult: {
        changes: insertResult.changes,
        lastInsertRowid: insertResult.lastInsertRowid,
      },
      justInserted,
      allStaff,
      databasePath: process.env.DATABASE_PATH,
    });
  } catch (error: any) {
    console.error('[Simple Test] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

