import { NextRequest, NextResponse } from 'next/server';
import { StaffModel } from '@/lib/models';
import '@/lib/init'; // Initialize database

/**
 * Get all staff
 */
export async function GET() {
  try {
    console.log('[Staff API] Fetching all staff...');
    const staff = StaffModel.getAll();
    console.log(`[Staff API] Found ${staff.length} staff members`);
    if (staff.length > 0) {
      console.log(`[Staff API] Staff list:`, staff.map(s => `${s.id}:${s.name}`).join(', '));
    }
    return NextResponse.json({
      success: true,
      staff,
    });
  } catch (error: any) {
    console.error('[Staff API] Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch staff',
    }, { status: 500 });
  }
}

