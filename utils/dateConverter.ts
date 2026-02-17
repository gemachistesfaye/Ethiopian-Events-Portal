
import { ETHIOPIAN_MONTHS, ETHIOPIAN_MONTHS_AMHARIC } from '../constants';
import { EthiopianEvent } from '../types';

/**
 * Ethiopian Calendar Utility
 * Ethiopia follows a 13-month calendar. 12 months of 30 days, 1 month of 5 or 6 days.
 * JDN for 1 Meskerem 1, 1 (Ethiopic) is 1724221.
 */
const ETHIOPIAN_EPOCH = 1724221;

/**
 * Converts a Gregorian Date to Julian Day Number (JDN).
 * This uses a robust integer-based algorithm.
 */
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Converts a Julian Day Number (JDN) to a Gregorian Date components.
 */
function jdnToGregorian(jdn: number): Date {
  let l = jdn + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  const day = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;

  // Return a local date at noon to avoid midnight/timezone issues
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Robust check for "Today" using local date components to avoid timezone offsets.
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Converts Gregorian Date to Ethiopian Date components.
 */
export function toEthiopianDate(date: Date) {
  // Use local date components to ensure conversion matches user's local day
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const n = jdn - ETHIOPIAN_EPOCH;
  
  const year = Math.floor((4 * n + 3) / 1461);
  const remainingDays = n - Math.floor(1461 * year / 4);
  
  const month = Math.floor(remainingDays / 30) + 1;
  const day = (remainingDays % 30) + 1;
  
  // Ethiopian year is the number of full years passed + 1
  const ethYear = year + 1;

  return {
    year: ethYear,
    month: month,
    day: day,
    monthName: ETHIOPIAN_MONTHS[month - 1] || 'Pagume',
    monthNameAmharic: ETHIOPIAN_MONTHS_AMHARIC[month - 1] || 'ጳጉሜ'
  };
}

/**
 * Converts Ethiopian Date components to a Gregorian Date.
 */
export function fromEthiopianDate(year: number, month: number, day: number): Date {
  const n = Math.floor(1461 * (year - 1) / 4) + (month - 1) * 30 + day - 1;
  const jdn = n + ETHIOPIAN_EPOCH;
  return jdnToGregorian(jdn);
}

/**
 * Generates calendar days for a Gregorian month.
 */
export function generateGregorianCalendar(month: number, year: number, events: EthiopianEvent[]) {
  const days = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= lastDay; d++) {
    const current = new Date(year, month, d, 12, 0, 0); // Noon prevents date flips
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    
    days.push({
      gregorian: current,
      ethiopian: toEthiopianDate(current),
      events: events.filter(e => e.gregDate === dateStr),
      isToday: isToday(current)
    });
  }
  return days;
}

/**
 * Generates calendar days for an Ethiopian month.
 */
export function generateEthiopianCalendar(month: number, year: number, events: EthiopianEvent[]) {
  const days = [];
  const lastDay = month === 13 ? (year % 4 === 3 ? 6 : 5) : 30;

  for (let d = 1; d <= lastDay; d++) {
    const gregDate = fromEthiopianDate(year, month, d);
    const dateStr = `${gregDate.getFullYear()}-${String(gregDate.getMonth() + 1).padStart(2, '0')}-${String(gregDate.getDate()).padStart(2, '0')}`;
    
    days.push({
      gregorian: gregDate,
      ethiopian: {
        year,
        month,
        day: d,
        monthName: ETHIOPIAN_MONTHS[month - 1],
        monthNameAmharic: ETHIOPIAN_MONTHS_AMHARIC[month - 1]
      },
      events: events.filter(e => e.gregDate === dateStr),
      isToday: isToday(gregDate)
    });
  }
  return days;
}
