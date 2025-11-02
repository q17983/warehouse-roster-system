import { NextRequest, NextResponse } from 'next/server';
import { StaffModel } from '@/lib/models';
import '@/lib/init'; // Initialize database

/**
 * Update staff member
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    const { name, phone } = await request.json();
    
    if (!name) {
      return NextResponse.json({
        success: false,
        message: 'Name is required',
      }, { status: 400 });
    }

    const updated = StaffModel.update(staffId, name, phone);
    
    return NextResponse.json({
      success: true,
      staff: updated,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update staff',
    }, { status: 500 });
  }
}

/**
 * Delete staff member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    StaffModel.delete(staffId);
    
    return NextResponse.json({
      success: true,
      message: 'Staff member deleted',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete staff',
    }, { status: 500 });
  }
}

