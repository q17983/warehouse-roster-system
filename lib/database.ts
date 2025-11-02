import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'roster.db');
const dbDir = path.dirname(dbPath);

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create or open database
const db = new Database(dbPath);

// Simple configuration for reliability
db.pragma('journal_mode = DELETE');
db.pragma('synchronous = FULL');

// Initialize tables
export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
    CREATE INDEX IF NOT EXISTS idx_availability_staff ON availability(staff_id);
    CREATE INDEX IF NOT EXISTS idx_roster_date ON roster(date);
    CREATE INDEX IF NOT EXISTS idx_roster_staff ON roster(staff_id);
  `);
}

export default db;
