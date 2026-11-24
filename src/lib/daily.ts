/** Index into a list of `length` items for a calendar date (YYYY-MM-DD); advances by one each day. */
export function dailyIndex(dateISO: string, length: number): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const days = Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86400000);
  return ((days % length) + length) % length;
}

/** Today's date in Mexico City as YYYY-MM-DD. */
export function todayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(now);
}
