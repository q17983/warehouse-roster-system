import { NextResponse } from 'next/server';
import { AkeModel } from '@/lib/models';
import '@/lib/init';

// Get all AKE requirements
export async function GET() {
  try {
    const akeList = await AkeModel.getAll();
    
    return NextResponse.json({
      success: true,
      akeList,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch AKE list',
    }, { status: 500 });
  }
}

