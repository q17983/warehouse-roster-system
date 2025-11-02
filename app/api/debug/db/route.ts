import { NextResponse } from 'next/server';
import { StaffModel, AvailabilityModel, RosterModel } from '@/lib/models';
import '@/lib/init'; // Initialize database
import db from '@/lib/database';

/**
 * Debug endpoint to check database state
 * Only use this for troubleshooting
 */
export async function GET() {
  try {
    console.log('[Debug API] Fetching database stats...');
    
    // Get database path
    const dbPath = process.env.DATABASE_PATH || 'roster.db';
    
    // Use models to ensure we're using the same database connection
    const allStaff = StaffModel.getAll();
    console.log(`[Debug API] Found ${allStaff.length} staff via StaffModel`);
    
    // Count records directly
    const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    const availabilityCount = db.prepare('SELECT COUNT(*) as count FROM availability').get() as { count: number };
    const rosterCount = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    
    console.log(`[Debug API] Direct counts: staff=${staffCount.count}, availability=${availabilityCount.count}, roster=${rosterCount.count}`);
    
    // Get sample roster entries
    const sampleRoster = db.prepare('SELECT r.*, s.name FROM roster r LEFT JOIN staff s ON r.staff_id = s.id ORDER BY r.date DESC LIMIT 10').all();
    console.log(`[Debug API] Sample roster: ${sampleRoster.length} entries`);
    
    // Get all roster entries with details
    const allRosterEntries = db.prepare('SELECT * FROM roster ORDER BY date, slot_number').all();
    
    return NextResponse.json({
      success: true,
      database: {
        path: dbPath,
        staffCount: staffCount.count,
        availabilityCount: availabilityCount.count,
        rosterCount: rosterCount.count,
      },
      sampleRoster,
      allRosterEntries,
      staffList: allStaff,
      environment: {
        DATABASE_PATH: process.env.DATABASE_PATH || 'not set',
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error: any) {
    console.error('[Debug API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

