import { NextRequest, NextResponse } from 'next/server';
import { StaffModel } from '@/lib/models';
import '@/lib/init';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    const { name, phone } = await request.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Name is required',
      }, { status: 400 });
    }

    const updatedStaff = await StaffModel.update(staffId, name.trim(), phone);

    return NextResponse.json({
      success: true,
      staff: updatedStaff,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update staff',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);
    await StaffModel.delete(staffId);

    return NextResponse.json({
      success: true,
      message: 'Staff deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to delete staff',
    }, { status: 500 });
  }
}
