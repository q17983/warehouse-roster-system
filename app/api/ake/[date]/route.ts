import { NextRequest, NextResponse } from 'next/server';
import { AkeModel } from '@/lib/models';
import '@/lib/init';

// Get AKE requirements for a specific date
export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const akeData = await AkeModel.getByDate(date);
    
    return NextResponse.json({
      success: true,
      date,
      ake: akeData || { ms_ake: 0, et_ake: 0, per_ake: 0, total_ake: 0 },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch AKE data',
    }, { status: 500 });
  }
}

// Save AKE requirements for a specific date
export async function POST(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const date = decodeURIComponent(params.date);
    const { msAke, etAke, perAke } = await request.json();
    
    // Convert empty strings or undefined to 0
    const ms = parseInt(msAke) || 0;
    const et = parseInt(etAke) || 0;
    const per = parseInt(perAke) || 0;

    const saved = await AkeModel.save(date, ms, et, per);

    return NextResponse.json({
      success: true,
      date,
      ake: saved,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to save AKE data',
    }, { status: 500 });
  }
}

