/**
 * Tonalpohualli (260-day count) using Alfonso Caso's correlation:
 * the fall of Tenochtitlan, 13 Aug 1521 Julian = 23 Aug 1521 Gregorian, was the day 1 Coatl.
 * Dates are proleptic Gregorian. signIndex 0 = Cipactli … 19 = Xochitl.
 */
function dayNumber(year: number, month: number, day: number): number {
  const d = new Date(Date.UTC(2000, month - 1, day));
  d.setUTCFullYear(year);
  return Math.round(d.getTime() / 86400000);
}
const ANCHOR = dayNumber(1521, 8, 23);
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function tonalli(year: number, month: number, day: number): { number: number; signIndex: number } {
  const days = dayNumber(year, month, day) - ANCHOR;
  return { number: mod(days, 13) + 1, signIndex: mod(4 + days, 20) };
}

/** True when year-month-day is a real calendar date. */
export function isValidDate(year: number, month: number, day: number): boolean {
  if (![year, month, day].every(Number.isInteger)) return false;
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const d = new Date(Date.UTC(2000, month - 1, 1));
  d.setUTCFullYear(year);
  d.setUTCDate(day);
  return d.getUTCMonth() === month - 1;
}
