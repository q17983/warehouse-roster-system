import { Pool } from 'pg';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize tables
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Master staff list table
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Availability table
    await client.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff(id),
        UNIQUE(staff_id, date)
      )
    `);

    // Roster assignments
    await client.query(`
      CREATE TABLE IF NOT EXISTS roster (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        slot_number INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff(id),
        UNIQUE(staff_id, date, slot_number)
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
      CREATE INDEX IF NOT EXISTS idx_availability_staff ON availability(staff_id);
      CREATE INDEX IF NOT EXISTS idx_roster_date ON roster(date);
      CREATE INDEX IF NOT EXISTS idx_roster_staff ON roster(staff_id);
    `);
  } finally {
    client.release();
  }
}

export default pool;
