import { NextRequest, NextResponse } from 'next/server';
import { RosterModel } from '@/lib/models';
import '@/lib/init';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const roster = RosterModel.getByDate(date);
    
    return NextResponse.json({
      success: true,
      date,
      roster,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch roster',
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const { staffIds } = await request.json();
    
    if (!Array.isArray(staffIds)) {
      return NextResponse.json({
        success: false,
        message: 'staffIds must be an array',
      }, { status: 400 });
    }

    RosterModel.clearForDate(date);

    staffIds.forEach((staffId: number, index: number) => {
      RosterModel.add(staffId, date, index + 1);
    });

    const roster = RosterModel.getByDate(date);

    return NextResponse.json({
      success: true,
      date,
      roster,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update roster',
    }, { status: 500 });
  }
}
