import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Test if /data volume is writable
 */
export async function GET() {
  const results: any = {
    tests: [],
    success: true,
  };

  try {
    // Test 1: Check if /data directory exists
    const dataDir = '/data';
    const dataDirExists = fs.existsSync(dataDir);
    results.tests.push({
      name: 'Data directory exists',
      passed: dataDirExists,
      value: dataDir,
    });

    if (!dataDirExists) {
      results.success = false;
      return NextResponse.json(results);
    }

    // Test 2: Check if /data is writable
    try {
      fs.accessSync(dataDir, fs.constants.W_OK);
      results.tests.push({
        name: 'Data directory is writable',
        passed: true,
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Data directory is writable',
        passed: false,
        error: error.message,
      });
      results.success = false;
    }

    // Test 3: Try to write a test file
    const testFile = path.join(dataDir, 'test-write.txt');
    try {
      fs.writeFileSync(testFile, `Test write at ${new Date().toISOString()}`);
      results.tests.push({
        name: 'Can write test file',
        passed: true,
        file: testFile,
      });

      // Test 4: Try to read it back
      const content = fs.readFileSync(testFile, 'utf-8');
      results.tests.push({
        name: 'Can read test file',
        passed: true,
        content: content.substring(0, 50),
      });

      // Clean up test file
      fs.unlinkSync(testFile);
    } catch (error: any) {
      results.tests.push({
        name: 'Can write/read test file',
        passed: false,
        error: error.message,
      });
      results.success = false;
    }

    // Test 5: Check database file
    const dbPath = '/data/roster.db';
    const dbExists = fs.existsSync(dbPath);
    results.tests.push({
      name: 'Database file exists',
      passed: dbExists,
      path: dbPath,
    });

    if (dbExists) {
      const stats = fs.statSync(dbPath);
      results.tests.push({
        name: 'Database file info',
        passed: true,
        size: stats.size,
        modified: stats.mtime,
      });
    }

    // Test 6: List files in /data
    const files = fs.readdirSync(dataDir);
    results.tests.push({
      name: 'Files in /data',
      passed: true,
      files: files,
    });

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

