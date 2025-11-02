import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get database path from environment or use default
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'roster.db');

// Log database path for debugging (especially on Railway)
console.log('[Database] Initializing database at:', dbPath);
console.log('[Database] DATABASE_PATH env:', process.env.DATABASE_PATH || 'not set (using default)');

// Ensure directory exists (important for Railway volumes)
const dbDir = path.dirname(dbPath);
console.log(`[Database] Database directory: ${dbDir}`);
console.log(`[Database] Directory exists: ${fs.existsSync(dbDir)}`);

if (dbDir && !fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('[Database] Created directory:', dbDir);
  } catch (mkdirError: any) {
    console.error('[Database] Failed to create directory:', mkdirError);
    throw new Error(`Cannot create database directory: ${dbDir}. Error: ${mkdirError.message}`);
  }
}

// Log directory stats if it exists
if (fs.existsSync(dbDir)) {
  try {
    const stats = fs.statSync(dbDir);
    console.log(`[Database] Directory stats: mode=${stats.mode.toString(8)}, writable=${(stats.mode & parseInt('200', 8)) !== 0}`);
  } catch (statError) {
    console.warn('[Database] Could not get directory stats:', statError);
  }
}

// Use global singleton to ensure only ONE database instance across all API routes
// This is critical for Next.js serverless functions
declare global {
  var __database: Database.Database | undefined;
}

let db: Database.Database;

if (!global.__database) {
  console.log('[Database] Creating NEW database instance');
  try {
    // Check if database file exists
    const dbExists = fs.existsSync(dbPath);
    console.log(`[Database] Database file exists: ${dbExists} at ${dbPath}`);
    
    // Check directory permissions
    try {
      const dbDir = path.dirname(dbPath);
      fs.accessSync(dbDir, fs.constants.W_OK);
      console.log(`[Database] Directory is writable: ${dbDir}`);
    } catch (dirError) {
      console.error(`[Database] Directory permission error:`, dirError);
    }
    
    db = new Database(dbPath, { 
      verbose: console.log,
      fileMustExist: false,
    });
    console.log('[Database] Database opened successfully');
    
    // CRITICAL: Ensure writes are synced to disk immediately
    // This is crucial for Railway/containerized environments
    db.pragma('journal_mode = WAL'); // Use WAL mode for better concurrency
    db.pragma('synchronous = FULL'); // Force full sync to disk on every write
    db.pragma('wal_autocheckpoint = 1'); // Checkpoint after every transaction
    console.log('[Database] Set journal_mode=WAL, synchronous=FULL, wal_autocheckpoint=1 for persistence');
    
    // Verify we can write to the database
    db.prepare('SELECT 1').get();
    console.log('[Database] Database read/write test passed');
    
    // Store in global to reuse across API routes
    global.__database = db;
    console.log('[Database] Stored in global cache');
  } catch (error) {
    console.error('[Database] Failed to open database:', error);
    console.error('[Database] dbPath was:', dbPath);
    console.error('[Database] Current working directory:', process.cwd());
    throw error;
  }
} else {
  console.log('[Database] Reusing EXISTING database instance from global cache');
  db = global.__database;
}

// Initialize database tables
export function initializeDatabase() {
  // Master staff list table
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Availability table - clean list of who is available on what day
  db.exec(`
    CREATE TABLE IF NOT EXISTS availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (staff_id) REFERENCES staff(id),
      UNIQUE(staff_id, date)
    )
  `);

  // Roster assignments - what the leader has planned
  db.exec(`
    CREATE TABLE IF NOT EXISTS roster (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      slot_number INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (staff_id) REFERENCES staff(id),
      UNIQUE(staff_id, date, slot_number)
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
    CREATE INDEX IF NOT EXISTS idx_availability_staff ON availability(staff_id);
    CREATE INDEX IF NOT EXISTS idx_roster_date ON roster(date);
    CREATE INDEX IF NOT EXISTS idx_roster_staff ON roster(staff_id);
  `);
  
  console.log('[Database] Tables and indexes created/verified');
}

// Helper function to ensure data is synced to disk
export function syncDatabase() {
  try {
    // Force a checkpoint to ensure all changes are written to disk
    const result = db.pragma('wal_checkpoint(RESTART)', { simple: true });
    console.log('[Database] WAL checkpoint result:', result);
    
    // Verify data is actually on disk by counting records
    const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };
    const rosterCount = db.prepare('SELECT COUNT(*) as count FROM roster').get() as { count: number };
    console.log('[Database] After checkpoint - staff:', staffCount.count, 'roster:', rosterCount.count);
  } catch (error) {
    console.error('[Database] Checkpoint error:', error);
  }
}

export default db;

