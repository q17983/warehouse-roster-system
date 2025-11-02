import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Check filesystem state - verify volume is actually working
 */
export async function GET() {
  try {
    const results: any = {
      dataDirectory: {},
      databaseFile: {},
      testWrite: {},
    };
    
    // Check /data directory
    try {
      const dataDir = '/data';
      results.dataDirectory.exists = fs.existsSync(dataDir);
      
      if (results.dataDirectory.exists) {
        const files = fs.readdirSync(dataDir);
        results.dataDirectory.files = files;
        results.dataDirectory.fileCount = files.length;
        
        // Get details of each file
        results.dataDirectory.fileDetails = files.map(file => {
          const filePath = path.join(dataDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime,
            isFile: stats.isFile(),
          };
        });
      }
    } catch (error: any) {
      results.dataDirectory.error = error.message;
    }
    
    // Check database file specifically
    try {
      const dbPath = '/data/roster.db';
      results.databaseFile.path = dbPath;
      results.databaseFile.exists = fs.existsSync(dbPath);
      
      if (results.databaseFile.exists) {
        const stats = fs.statSync(dbPath);
        results.databaseFile.size = stats.size;
        results.databaseFile.modified = stats.mtime;
        results.databaseFile.created = stats.birthtime;
        results.databaseFile.ageMinutes = (Date.now() - stats.mtime.getTime()) / 1000 / 60;
      }
      
      // Check WAL and SHM files
      results.databaseFile.walExists = fs.existsSync('/data/roster.db-wal');
      results.databaseFile.shmExists = fs.existsSync('/data/roster.db-shm');
      
      if (results.databaseFile.walExists) {
        const walStats = fs.statSync('/data/roster.db-wal');
        results.databaseFile.walSize = walStats.size;
      }
      
      // Check for any old database files
      const dataFiles = fs.readdirSync('/data');
      results.databaseFile.allFilesInData = dataFiles.map(f => {
        const fullPath = `/data/${f}`;
        const stats = fs.statSync(fullPath);
        return {
          name: f,
          size: stats.size,
          modified: stats.mtime,
          ageMinutes: (Date.now() - stats.mtime.getTime()) / 1000 / 60,
        };
      });
    } catch (error: any) {
      results.databaseFile.error = error.message;
    }
    
    // Try to write a test file
    try {
      const testPath = '/data/test-write.txt';
      const testContent = `Test write at ${new Date().toISOString()}`;
      fs.writeFileSync(testPath, testContent);
      
      // Read it back
      const readBack = fs.readFileSync(testPath, 'utf-8');
      results.testWrite.success = (readBack === testContent);
      results.testWrite.content = readBack;
      
      // Clean up
      fs.unlinkSync(testPath);
    } catch (error: any) {
      results.testWrite.error = error.message;
    }
    
    return NextResponse.json({
      success: true,
      volumePath: '/data',
      databasePath: process.env.DATABASE_PATH,
      ...results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

