/**
 * The "Brain" - Processes cleaned data from Apps Script and syncs to database
 * Filters to only next week's availability for roster planning
 */

import { StaffModel, AvailabilityModel } from './models';
import { CleanDataResponse } from './appsScriptData';
import { getNextWeekDates, isInNextWeek } from './weekUtils';

/**
 * Process cleaned data from Apps Script and sync to database
 * Only processes availability for next week (Monday-Sunday)
 */
export async function processCleanData(cleanData: CleanDataResponse): Promise<{ staffCount: number; availabilityCount: number; nextWeekRange?: string }> {
  if (!cleanData.success) {
    throw new Error(cleanData.error || 'Failed to process data');
  }

  console.log(`[Brain] Processing ${cleanData.staff.length} staff members`);
  console.log(`[Brain] Processing ${cleanData.availability.length} availability records`);

  // Step 1: Sync staff to database
  let staffCreated = 0;
  let staffUpdated = 0;
  for (const staff of cleanData.staff) {
    console.log(`[Brain] Processing staff: ${staff.name}`);
    const existing = StaffModel.getByName(staff.name);
    if (!existing) {
      const created = StaffModel.create(staff.name, staff.phone);
      console.log(`[Brain] Created staff: ${created.name} (ID: ${created.id})`);
      staffCreated++;
    } else if (staff.phone && existing.phone !== staff.phone) {
      StaffModel.update(existing.id, staff.name, staff.phone);
      console.log(`[Brain] Updated staff: ${staff.name} (ID: ${existing.id})`);
      staffUpdated++;
    } else {
      console.log(`[Brain] Staff already exists: ${staff.name} (ID: ${existing.id})`);
    }
  }
  
  console.log(`[Brain] Staff sync complete: ${staffCreated} created, ${staffUpdated} updated`);
  
  // Verify staff were actually saved
  const allStaff = StaffModel.getAll();
  console.log(`[Brain] Total staff in database after sync: ${allStaff.length}`);
  console.log(`[Brain] Staff list:`, allStaff.map(s => `${s.id}:${s.name}`).join(', '));

  // Step 2: Clear all old availability for next week dates
  // This ensures we only have the latest responses (replace, not merge)
  const nextWeekDates = getNextWeekDates();
  for (const date of nextWeekDates) {
    AvailabilityModel.clearForDate(date);
  }

  // Step 3: Sync availability to database (ONLY for next week)
  // Process by staff member to ensure we only keep their latest submission
  const staffAvailabilityMap = new Map<string, Set<string>>();
  
  for (const availability of cleanData.availability) {
    // Only process availability for next week
    if (isInNextWeek(availability.date)) {
      const staff = StaffModel.getByName(availability.staffName);
      if (staff) {
        if (!staffAvailabilityMap.has(availability.staffName)) {
          staffAvailabilityMap.set(availability.staffName, new Set());
        }
        staffAvailabilityMap.get(availability.staffName)!.add(availability.date);
      }
    }
  }
  
  // Step 4: Clear each staff's old availability, then add their latest
  let availabilityCount = 0;
  for (const [staffName, dates] of staffAvailabilityMap.entries()) {
    const staff = StaffModel.getByName(staffName);
    if (staff) {
      // Clear this staff's availability for next week (remove old submissions)
      for (const date of nextWeekDates) {
        AvailabilityModel.remove(staff.id, date);
      }
      
      // Add their latest availability
      for (const date of dates) {
        AvailabilityModel.add(staff.id, date);
        availabilityCount++;
      }
    }
  }

  return {
    staffCount: cleanData.staff.length,
    availabilityCount,
  };
}
