import { NextResponse } from 'next/server';
import fs from 'fs';

/**
 * Delete database files to start fresh
 * WARNING: This deletes ALL data!
 */
export async function POST() {
  try {
    const files = [
      '/data/roster.db',
      '/data/roster.db-wal',
      '/data/roster.db-shm',
    ];
    
    const deleted = [];
    const notFound = [];
    
    for (const file of files) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        deleted.push(file);
      } else {
        notFound.push(file);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database files deleted. Restart the service to recreate.',
      deleted,
      notFound,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to reset database',
    warning: 'This will delete ALL data!',
  });
}

