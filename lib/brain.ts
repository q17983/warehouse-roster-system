/**
 * The "Brain" - Processes cleaned data from Apps Script and syncs to database
 */

import { StaffModel, AvailabilityModel } from './models';
import { CleanDataResponse } from './appsScriptData';
import { getNextWeekDates, isInNextWeek } from './weekUtils';

export async function processCleanData(cleanData: CleanDataResponse): Promise<{ staffCount: number; availabilityCount: number }> {
  if (!cleanData.success) {
    throw new Error(cleanData.error || 'Failed to process data');
  }

  // Sync staff to database
  for (const staff of cleanData.staff) {
    const existing = await StaffModel.getByName(staff.name);
    if (!existing) {
      await StaffModel.create(staff.name, staff.phone);
    } else if (staff.phone && existing.phone !== staff.phone) {
      await StaffModel.update(existing.id, staff.name, staff.phone);
    }
  }

  // Process availability - keep WHATEVER dates staff submitted (no filtering)
  // Group by staff to ensure latest submission only
  const staffAvailabilityMap = new Map<string, Set<string>>();
  
  for (const availability of cleanData.availability) {
    const staff = await StaffModel.getByName(availability.staffName);
    if (staff) {
      if (!staffAvailabilityMap.has(availability.staffName)) {
        staffAvailabilityMap.set(availability.staffName, new Set());
      }
      staffAvailabilityMap.get(availability.staffName)!.add(availability.date);
    }
  }
  
  // Clear each staff's old availability, then add their latest
  let availabilityCount = 0;
  for (const [staffName, dates] of staffAvailabilityMap.entries()) {
    const staff = await StaffModel.getByName(staffName);
    if (staff) {
      // Get all existing availability for this staff
      const existingDates = await AvailabilityModel.getByStaffId(staff.id);
      
      // Remove old availability
      for (const oldDate of existingDates) {
        await AvailabilityModel.remove(staff.id, oldDate);
      }
      
      // Add their latest availability (whatever dates they submitted)
      for (const date of dates) {
        await AvailabilityModel.add(staff.id, date);
        availabilityCount++;
      }
    }
  }

  return {
    staffCount: cleanData.staff.length,
    availabilityCount,
  };
}
