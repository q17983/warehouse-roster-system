import db from './database';

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

// Staff operations
export const StaffModel = {
  getAll: (): Staff[] => {
    return db.prepare('SELECT * FROM staff ORDER BY name').all() as Staff[];
  },

  getById: (id: number): Staff | undefined => {
    return db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as Staff | undefined;
  },

  getByName: (name: string): Staff | undefined => {
    return db.prepare('SELECT * FROM staff WHERE name = ?').get(name) as Staff | undefined;
  },

  create: (name: string, phone?: string): Staff => {
    const result = db.prepare('INSERT INTO staff (name, phone) VALUES (?, ?)').run(name, phone || null);
    return StaffModel.getById(result.lastInsertRowid as number)!;
  },

  update: (id: number, name: string, phone?: string): Staff => {
    db.prepare('UPDATE staff SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, phone || null, id);
    return StaffModel.getById(id)!;
  },

  delete: (id: number): void => {
    db.prepare('DELETE FROM staff WHERE id = ?').run(id);
  },
};

// Availability operations
export const AvailabilityModel = {
  getByDate: (date: string): Staff[] => {
    const result = db.prepare(`
      SELECT s.* FROM staff s
      INNER JOIN availability a ON s.id = a.staff_id
      WHERE a.date = ?
      ORDER BY s.name
    `).all(date) as Staff[];
    return result;
  },

  getByStaffId: (staffId: number): string[] => {
    const result = db.prepare('SELECT date FROM availability WHERE staff_id = ? ORDER BY date').all(staffId) as Availability[];
    return result.map(a => a.date);
  },

  add: (staffId: number, date: string): Availability => {
    const result = db.prepare('INSERT OR IGNORE INTO availability (staff_id, date) VALUES (?, ?)').run(staffId, date);
    return db.prepare('SELECT * FROM availability WHERE staff_id = ? AND date = ?').get(staffId, date) as Availability;
  },

  remove: (staffId: number, date: string): void => {
    db.prepare('DELETE FROM availability WHERE staff_id = ? AND date = ?').run(staffId, date);
  },

  clearForDate: (date: string): void => {
    db.prepare('DELETE FROM availability WHERE date = ?').run(date);
  },
};

// Roster operations
export const RosterModel = {
  getByDate: (date: string): Staff[] => {
    const result = db.prepare(`
      SELECT s.*, r.slot_number FROM staff s
      INNER JOIN roster r ON s.id = r.staff_id
      WHERE r.date = ?
      ORDER BY r.slot_number, s.name
    `).all(date) as (Staff & { slot_number: number })[];
    return result;
  },

  getByStaffId: (staffId: number): string[] => {
    const result = db.prepare('SELECT date FROM roster WHERE staff_id = ? ORDER BY date').all(staffId) as RosterAssignment[];
    const dates = result.map(r => r.date);
    console.log(`[RosterModel] getByStaffId(${staffId}): Found ${dates.length} dates:`, dates);
    return dates;
  },

  add: (staffId: number, date: string, slotNumber: number = 1): RosterAssignment => {
    const result = db.prepare('INSERT OR REPLACE INTO roster (staff_id, date, slot_number) VALUES (?, ?, ?)').run(staffId, date, slotNumber);
    return db.prepare('SELECT * FROM roster WHERE staff_id = ? AND date = ? AND slot_number = ?').get(staffId, date, slotNumber) as RosterAssignment;
  },

  remove: (staffId: number, date: string, slotNumber?: number): void => {
    if (slotNumber !== undefined) {
      db.prepare('DELETE FROM roster WHERE staff_id = ? AND date = ? AND slot_number = ?').run(staffId, date, slotNumber);
    } else {
      db.prepare('DELETE FROM roster WHERE staff_id = ? AND date = ?').run(staffId, date);
    }
  },

  clearForDate: (date: string): void => {
    db.prepare('DELETE FROM roster WHERE date = ?').run(date);
  },
};

// Combined operations
export const getStaffWithSchedule = (staffId: number): StaffWithAvailability | null => {
  const staff = StaffModel.getById(staffId);
  if (!staff) return null;

  const availableDates = AvailabilityModel.getByStaffId(staffId);
  const scheduledDates = RosterModel.getByStaffId(staffId);

  return {
    ...staff,
    availableDates,
    scheduledDates,
  };
};

