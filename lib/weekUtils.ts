/**
 * Utility functions for week-based filtering
 * Next week = The Monday-Sunday period that starts next Monday
 */

import { startOfWeek, addWeeks, addDays, format, parseISO, isAfter, isBefore, eachDayOfInterval } from 'date-fns';

/**
 * Get the start date (Monday) of next week
 * If today is Monday-Wednesday, next week starts next Monday
 * If today is Thursday-Sunday, next week still starts next Monday
 */
export function getNextWeekStart(): Date {
  const today = new Date();
  const thisWeekMonday = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  const nextWeekMonday = addWeeks(thisWeekMonday, 1);
  return nextWeekMonday;
}

/**
 * Get the end date (Sunday) of next week
 */
export function getNextWeekEnd(): Date {
  const nextWeekMonday = getNextWeekStart();
  const nextWeekSunday = addDays(nextWeekMonday, 6);
  return nextWeekSunday;
}

/**
 * Check if a date string (YYYY-MM-DD) is within next week
 */
export function isInNextWeek(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr);
    const weekStart = getNextWeekStart();
    const weekEnd = getNextWeekEnd();
    
    // Include both start and end dates
    return (isAfter(date, weekStart) || format(date, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd')) &&
           (isBefore(date, weekEnd) || format(date, 'yyyy-MM-dd') === format(weekEnd, 'yyyy-MM-dd'));
  } catch {
    return false;
  }
}

/**
 * Get all dates in next week as YYYY-MM-DD strings
 */
export function getNextWeekDates(): string[] {
  const weekStart = getNextWeekStart();
  const weekEnd = getNextWeekEnd();
  
  const dates = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });
  
  return dates.map(date => format(date, 'yyyy-MM-dd'));
}

/**
 * Get formatted next week range for display
 */
export function getNextWeekRange(): string {
  const weekStart = getNextWeekStart();
  const weekEnd = getNextWeekEnd();
  
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
}

