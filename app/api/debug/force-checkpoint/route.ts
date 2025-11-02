import { NextResponse } from 'next/server';
import '@/lib/init';
import db from '@/lib/database';
import fs from 'fs';

/**
 * Force a full WAL checkpoint to merge data to main database
 */
export async function POST() {
  try {
    console.log('[Force Checkpoint] Starting TRUNCATE checkpoint...');
    
    // Get file sizes before
    const dbPathBefore = '/data/roster.db';
    const walPathBefore = '/data/roster.db-wal';
    
    const dbSizeBefore = fs.existsSync(dbPathBefore) ? fs.statSync(dbPathBefore).size : 0;
    const walSizeBefore = fs.existsSync(walPathBefore) ? fs.statSync(walPathBefore).size : 0;
    
    console.log(`[Force Checkpoint] Before - DB: ${dbSizeBefore} bytes, WAL: ${walSizeBefore} bytes`);
    
    // Force TRUNCATE checkpoint - this merges WAL to main DB and truncates WAL
    const checkpointResult = db.pragma('wal_checkpoint(TRUNCATE)', { simple: true });
    console.log('[Force Checkpoint] Checkpoint result:', checkpointResult);
    
    // Get file sizes after
    const dbSizeAfter = fs.existsSync(dbPathBefore) ? fs.statSync(dbPathBefore).size : 0;
    const walSizeAfter = fs.existsSync(walPathBefore) ? fs.statSync(walPathBefore).size : 0;
    
    console.log(`[Force Checkpoint] After - DB: ${dbSizeAfter} bytes, WAL: ${walSizeAfter} bytes`);
    
    // Now try to query
    const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    const rosterCount = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    const staffRecords = db.prepare('SELECT * FROM staff').all();
    
    console.log(`[Force Checkpoint] After checkpoint - Staff: ${staffCount.count}, Roster: ${rosterCount.count}`);
    
    return NextResponse.json({
      success: true,
      message: 'Checkpoint completed',
      before: {
        dbSize: dbSizeBefore,
        walSize: walSizeBefore,
      },
      after: {
        dbSize: dbSizeAfter,
        walSize: walSizeAfter,
      },
      checkpointResult,
      counts: {
        staff: staffCount.count,
        roster: rosterCount.count,
      },
      staffRecords,
    });
  } catch (error: any) {
    console.error('[Force Checkpoint] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

