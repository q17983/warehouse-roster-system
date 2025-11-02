import { NextResponse } from 'next/server';
import { getNextWeekDates, getNextWeekStart, getNextWeekEnd, getNextWeekRange, isInNextWeek } from '@/lib/weekUtils';
import { format } from 'date-fns';

export async function GET() {
  const today = new Date();
  const nextWeekStart = getNextWeekStart();
  const nextWeekEnd = getNextWeekEnd();
  const nextWeekDates = getNextWeekDates();
  const nextWeekRange = getNextWeekRange();
  
  // Test some specific dates
  const testDates = [
    '2025-11-03',
    '2025-11-04', 
    '2025-11-05',
    '2025-11-10',
    '2025-11-11',
    '2025-11-16',
  ];
  
  const dateTests = testDates.map(date => ({
    date,
    isInNextWeek: isInNextWeek(date),
  }));
  
  return NextResponse.json({
    today: format(today, 'yyyy-MM-dd (EEEE)'),
    nextWeek: {
      range: nextWeekRange,
      start: format(nextWeekStart, 'yyyy-MM-dd (EEEE)'),
      end: format(nextWeekEnd, 'yyyy-MM-dd (EEEE)'),
      dates: nextWeekDates,
    },
    testDates: dateTests,
  });
}

