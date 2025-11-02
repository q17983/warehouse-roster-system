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
    const existing = StaffModel.getByName(staff.name);
    if (!existing) {
      StaffModel.create(staff.name, staff.phone);
    } else if (staff.phone && existing.phone !== staff.phone) {
      StaffModel.update(existing.id, staff.name, staff.phone);
    }
  }

  // Clear old availability for next week
  const nextWeekDates = getNextWeekDates();
  for (const date of nextWeekDates) {
    AvailabilityModel.clearForDate(date);
  }

  // Sync availability (only for next week, latest submission only)
  const staffAvailabilityMap = new Map<string, Set<string>>();
  
  for (const availability of cleanData.availability) {
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
  
  // Add latest availability
  let availabilityCount = 0;
  for (const [staffName, dates] of staffAvailabilityMap.entries()) {
    const staff = StaffModel.getByName(staffName);
    if (staff) {
      for (const date of nextWeekDates) {
        AvailabilityModel.remove(staff.id, date);
      }
      
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
