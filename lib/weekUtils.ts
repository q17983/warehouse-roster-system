/**
 * Utility functions for week-based filtering
 * Next week = The Monday-Sunday period that starts next Monday
 */

import { startOfWeek, addWeeks, addDays, format, parseISO, isAfter, isBefore, eachDayOfInterval } from 'date-fns';

/**
 * Get the start date (Monday) of next week
 * Matches Google Sheets formula: =TODAY() - WEEKDAY(TODAY(), 2) + 8
 * This gives the Monday that is at least 1 week away from today
 */
export function getNextWeekStart(): Date {
  const today = new Date();
  const thisWeekMonday = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  // Add 2 weeks to get the Monday after next week starts
  const nextWeekMonday = addWeeks(thisWeekMonday, 2);
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

