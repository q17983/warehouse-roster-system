import pool from './database';

export interface Staff {
  id: number;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: number;
  staff_id: number;
  date: string;
  created_at: string;
}

export interface RosterAssignment {
  id: number;
  staff_id: number;
  date: string;
  slot_number: number;
  created_at: string;
}

export interface StaffWithAvailability extends Staff {
  availableDates: string[];
  scheduledDates: string[];
}

export interface AkeRequirement {
  id: number;
  date: string;
  ms_ake: number;
  et_ake: number;
  per_ake: number;
  total_ake: number;
  created_at: string;
  updated_at: string;
}

// Staff operations
export const StaffModel = {
  getAll: async (): Promise<Staff[]> => {
    const result = await pool.query('SELECT * FROM staff ORDER BY name');
    return result.rows;
  },

  getById: async (id: number): Promise<Staff | null> => {
    const result = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  getByName: async (name: string): Promise<Staff | null> => {
    const result = await pool.query('SELECT * FROM staff WHERE name = $1', [name]);
    return result.rows[0] || null;
  },

  create: async (name: string, phone?: string): Promise<Staff> => {
    const result = await pool.query(
      'INSERT INTO staff (name, phone) VALUES ($1, $2) RETURNING *',
      [name, phone || null]
    );
    return result.rows[0];
  },

  update: async (id: number, name: string, phone?: string): Promise<Staff> => {
    const result = await pool.query(
      'UPDATE staff SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, phone || null, id]
    );
    return result.rows[0];
  },

  delete: async (id: number): Promise<void> => {
    await pool.query('DELETE FROM staff WHERE id = $1', [id]);
  },
};

// Availability operations
export const AvailabilityModel = {
  getByDate: async (date: string): Promise<Staff[]> => {
    const result = await pool.query(`
      SELECT s.* FROM staff s
      INNER JOIN availability a ON s.id = a.staff_id
      WHERE a.date = $1
      ORDER BY s.name
    `, [date]);
    return result.rows;
  },

  getByStaffId: async (staffId: number): Promise<string[]> => {
    const result = await pool.query(
      'SELECT date FROM availability WHERE staff_id = $1 ORDER BY date',
      [staffId]
    );
    return result.rows.map((r: any) => r.date);
  },

  add: async (staffId: number, date: string): Promise<Availability> => {
    const result = await pool.query(
      'INSERT INTO availability (staff_id, date) VALUES ($1, $2) ON CONFLICT (staff_id, date) DO NOTHING RETURNING *',
      [staffId, date]
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
    const existing = await pool.query(
      'SELECT * FROM availability WHERE staff_id = $1 AND date = $2',
      [staffId, date]
    );
    return existing.rows[0];
  },

  remove: async (staffId: number, date: string): Promise<void> => {
    await pool.query('DELETE FROM availability WHERE staff_id = $1 AND date = $2', [staffId, date]);
  },

  clearForDate: async (date: string): Promise<void> => {
    await pool.query('DELETE FROM availability WHERE date = $1', [date]);
  },
};

// Roster operations
export const RosterModel = {
  getByDate: async (date: string): Promise<Staff[]> => {
    const result = await pool.query(`
      SELECT s.*, r.slot_number FROM staff s
      INNER JOIN roster r ON s.id = r.staff_id
      WHERE r.date = $1
      ORDER BY r.slot_number, s.name
    `, [date]);
    return result.rows;
  },

  getByStaffId: async (staffId: number): Promise<string[]> => {
    const result = await pool.query(
      'SELECT date FROM roster WHERE staff_id = $1 ORDER BY date',
      [staffId]
    );
    return result.rows.map((r: any) => r.date);
  },

  add: async (staffId: number, date: string, slotNumber: number = 1): Promise<RosterAssignment> => {
    const result = await pool.query(
      `INSERT INTO roster (staff_id, date, slot_number) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (staff_id, date, slot_number) 
       DO UPDATE SET staff_id = $1 
       RETURNING *`,
      [staffId, date, slotNumber]
    );
    return result.rows[0];
  },

  remove: async (staffId: number, date: string, slotNumber?: number): Promise<void> => {
    if (slotNumber !== undefined) {
      await pool.query('DELETE FROM roster WHERE staff_id = $1 AND date = $2 AND slot_number = $3', [staffId, date, slotNumber]);
    } else {
      await pool.query('DELETE FROM roster WHERE staff_id = $1 AND date = $2', [staffId, date]);
    }
  },

  clearForDate: async (date: string): Promise<void> => {
    await pool.query('DELETE FROM roster WHERE date = $1', [date]);
  },
};

// Combined operations
export const getStaffWithSchedule = async (staffId: number): Promise<StaffWithAvailability | null> => {
  const staff = await StaffModel.getById(staffId);
  if (!staff) return null;

  const availableDates = await AvailabilityModel.getByStaffId(staffId);
  const scheduledDates = await RosterModel.getByStaffId(staffId);

  return {
    ...staff,
    availableDates,
    scheduledDates,
  };
};

// AKE Requirements operations
export const AkeModel = {
  getByDate: async (date: string): Promise<AkeRequirement | null> => {
    const result = await pool.query(
      'SELECT * FROM ake_requirements WHERE date = $1',
      [date]
    );
    return result.rows[0] || null;
  },

  getAll: async (): Promise<AkeRequirement[]> => {
    const result = await pool.query(
      'SELECT * FROM ake_requirements ORDER BY date DESC'
    );
    return result.rows;
  },

  save: async (date: string, msAke: number, etAke: number, perAke: number): Promise<AkeRequirement> => {
    const total = msAke + etAke + perAke;
    
    const result = await pool.query(
      `INSERT INTO ake_requirements (date, ms_ake, et_ake, per_ake, total_ake, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (date) 
       DO UPDATE SET 
         ms_ake = $2,
         et_ake = $3,
         per_ake = $4,
         total_ake = $5,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [date, msAke, etAke, perAke, total]
    );
    return result.rows[0];
  },
};
