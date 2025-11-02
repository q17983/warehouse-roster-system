import { NextRequest, NextResponse } from 'next/server';
import { RosterModel } from '@/lib/models';
import '@/lib/init'; // Initialize database

/**
 * Get roster for a specific date
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    console.log(`[Roster API] GET /api/roster/${date}`);
    const roster = RosterModel.getByDate(date);
    console.log(`[Roster API] Found ${roster.length} staff for ${date}`);
    
    return NextResponse.json({
      success: true,
      date,
      roster,
    });
  } catch (error: any) {
    console.error(`[Roster API] Error fetching roster for ${params.date}:`, error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch roster',
    }, { status: 500 });
  }
}

/**
 * Update roster for a specific date
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const { staffIds } = await request.json();
    
    console.log(`[Roster API] POST /api/roster/${date}`, { staffIds });
    
    if (!Array.isArray(staffIds)) {
      console.error(`[Roster API] Invalid staffIds:`, staffIds);
      return NextResponse.json({
        success: false,
        message: 'staffIds must be an array',
      }, { status: 400 });
    }

    // Clear existing roster for this date
    console.log(`[Roster API] Clearing existing roster for ${date}`);
    RosterModel.clearForDate(date);

    // Add new assignments
    console.log(`[Roster API] Adding ${staffIds.length} assignments for ${date}`);
    staffIds.forEach((staffId: number, index: number) => {
      const result = RosterModel.add(staffId, date, index + 1);
      console.log(`[Roster API] Added assignment: staffId=${staffId}, date=${date}, slot=${index + 1}`, result);
    });

    // Verify the assignments were saved
    const roster = RosterModel.getByDate(date);
    console.log(`[Roster API] Verified roster for ${date}:`, roster.length, 'staff members');

    return NextResponse.json({
      success: true,
      date,
      roster,
    });
  } catch (error: any) {
    console.error(`[Roster API] Error updating roster for ${params.date}:`, error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update roster',
    }, { status: 500 });
  }
}

