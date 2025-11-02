import { NextResponse } from 'next/server';
import db from '@/lib/database';
import '@/lib/init'; // Initialize database

/**
 * Debug endpoint to check database state
 * Only use this for troubleshooting
 */
export async function GET() {
  try {
    // Get database path
    const dbPath = process.env.DATABASE_PATH || 'roster.db';
    
    // Count records in each table
    const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    const availabilityCount = db.prepare('SELECT COUNT(*) as count FROM availability').get() as { count: number };
    const rosterCount = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    
    // Get sample roster entries
    const sampleRoster = db.prepare('SELECT * FROM roster LIMIT 10').all();
    
    // Get all staff IDs
    const allStaff = db.prepare('SELECT id, name FROM staff LIMIT 20').all();
    
    return NextResponse.json({
      success: true,
      database: {
        path: dbPath,
        staffCount: staffCount.count,
        availabilityCount: availabilityCount.count,
        rosterCount: rosterCount.count,
      },
      sampleRoster,
      staffList: allStaff,
      environment: {
        DATABASE_PATH: process.env.DATABASE_PATH || 'not set',
        NODE_ENV: process.env.NODE_ENV,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

