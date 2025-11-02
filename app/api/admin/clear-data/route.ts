import { NextResponse } from 'next/server';
import pool from '@/lib/database';
import '@/lib/init';

/**
 * Clear all data from database (staff, availability, roster)
 * Use this to remove old test data
 */
export async function POST() {
  try {
    const client = await pool.connect();
    
    try {
      // Delete in correct order (respect foreign keys)
      await client.query('DELETE FROM roster');
      await client.query('DELETE FROM availability');
      await client.query('DELETE FROM staff');
      
      // Reset sequences
      await client.query('ALTER SEQUENCE staff_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE availability_id_seq RESTART WITH 1');
      await client.query('ALTER SEQUENCE roster_id_seq RESTART WITH 1');
      
      return NextResponse.json({
        success: true,
        message: 'All data cleared successfully. Process data to reload from Google Sheet.',
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Clear data error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to clear data',
    }, { status: 500 });
  }
}

