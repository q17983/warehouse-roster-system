import { NextRequest, NextResponse } from 'next/server';
import { getStaffWithSchedule } from '@/lib/models';
import '@/lib/init';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    const staffSchedule = getStaffWithSchedule(staffId);
    
    if (!staffSchedule) {
      return NextResponse.json({
        success: false,
        message: 'Staff member not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      staff: staffSchedule,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch staff schedule',
    }, { status: 500 });
  }
}
