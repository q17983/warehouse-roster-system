import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityModel } from '@/lib/models';
import '@/lib/init';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const staff = await AvailabilityModel.getByDate(date);
    
    return NextResponse.json({
      success: true,
      date,
      staff,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch availability',
    }, { status: 500 });
  }
}
