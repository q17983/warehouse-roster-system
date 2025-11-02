import { NextRequest, NextResponse } from 'next/server';
import { getStaffWithSchedule } from '@/lib/models';
import '@/lib/init'; // Initialize database

/**
 * Get schedule for a specific staff member
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    console.log(`[Schedule API] Fetching schedule for staff ID: ${staffId}`);
    
    const staffSchedule = getStaffWithSchedule(staffId);
    
    if (!staffSchedule) {
      console.log(`[Schedule API] Staff ID ${staffId} not found`);
      return NextResponse.json({
        success: false,
        message: 'Staff member not found',
      }, { status: 404 });
    }

    console.log(`[Schedule API] Found staff: ${staffSchedule.name}`);
    console.log(`[Schedule API] Scheduled dates: ${staffSchedule.scheduledDates.length}`);
    console.log(`[Schedule API] Available dates: ${staffSchedule.availableDates.length}`);
    
    return NextResponse.json({
      success: true,
      staff: staffSchedule,
    });
  } catch (error: any) {
    console.error(`[Schedule API] Error:`, error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch staff schedule',
    }, { status: 500 });
  }
}

