import { NextResponse } from 'next/server';
import '@/lib/init';
import db from '@/lib/database';

/**
 * Just read database state - no writing
 */
export async function GET() {
  try {
    const now = Date.now();
    console.log(`[DB State] Request at ${now}`);
    
    const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    const rosterCount = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    const allStaff = db.prepare('SELECT * FROM staff ORDER BY id').all();
    
    console.log(`[DB State] Staff: ${staffCount.count}, Roster: ${rosterCount.count}`);
    
    return NextResponse.json({
      timestamp: now,
      staffCount: staffCount.count,
      rosterCount: rosterCount.count,
      allStaff,
      databasePath: process.env.DATABASE_PATH,
    });
  } catch (error: any) {
    console.error('[DB State] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

