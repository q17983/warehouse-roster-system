import { NextRequest, NextResponse } from 'next/server';
import { StaffModel } from '@/lib/models';
import '@/lib/init'; // Initialize database

/**
 * Get all staff
 */
export async function GET() {
  try {
    const staff = StaffModel.getAll();
    return NextResponse.json({
      success: true,
      staff,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch staff',
    }, { status: 500 });
  }
}

