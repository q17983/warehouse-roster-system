import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityModel, RosterModel } from '@/lib/models';
import '@/lib/init';

/**
 * Get all availability and roster data for a week in one call
 * Much faster than 14 separate API calls
 */
export async function POST(request: NextRequest) {
  try {
    const { dates } = await request.json();
    
    if (!Array.isArray(dates)) {
      return NextResponse.json({
        success: false,
        message: 'dates must be an array',
      }, { status: 400 });
    }

    const weekData: {
      availability: { [date: string]: number[] },
      roster: { [date: string]: number[] },
    } = {
      availability: {},
      roster: {},
    };

    // Get all data for all dates in parallel
    const availabilityPromises = dates.map(date => AvailabilityModel.getByDate(date));
    const rosterPromises = dates.map(date => RosterModel.getByDate(date));

    const [availabilityResults, rosterResults] = await Promise.all([
      Promise.all(availabilityPromises),
      Promise.all(rosterPromises),
    ]);

    // Map results to dates
    dates.forEach((date, index) => {
      weekData.availability[date] = availabilityResults[index].map(s => s.id);
      weekData.roster[date] = rosterResults[index].map(s => s.id);
    });

    return NextResponse.json({
      success: true,
      weekData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch week data',
    }, { status: 500 });
  }
}

