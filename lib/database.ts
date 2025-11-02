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
if (dbDir && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('[Database] Created directory:', dbDir);
}

let db: Database.Database;
try {
  db = new Database(dbPath);
  console.log('[Database] Database opened successfully');
} catch (error) {
  console.error('[Database] Failed to open database:', error);
  throw error;
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
}

export default db;

