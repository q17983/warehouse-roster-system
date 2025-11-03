import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      // Generate simple token (timestamp-based)
      const token = Buffer.from(`${Date.now()}-admin`).toString('base64');
      
      return NextResponse.json({
        success: true,
        token,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Incorrect password',
      }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Authentication failed',
    }, { status: 500 });
  }
}

