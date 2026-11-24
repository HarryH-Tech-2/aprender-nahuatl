import type { Variant } from './variant';

export type NumberResult =
  | {
      ok: true;
      value: number;
      words: string;
      parts: { value: number; words: string }[];
      glyphs: { feathers: number; flags: number; dots: number };
    }
  | { ok: false; error: string };

export const MAX_NUMBER = 7999;

const UNITS: Record<Variant, string[]> = {
  central: ['', 'ce', 'ome', 'yei', 'nahui', 'macuilli', 'chicuace', 'chicome', 'chicuei', 'chiucnahui', 'mahtlactli'],
  huasteca: ['', 'ce', 'ome', 'eyi', 'nahui', 'macuilli', 'chicuace', 'chicome', 'chicueyi', 'chiucnahui', 'mahtlactli'],
};
// Combining stems used before -pohualli (×20) and -tzontli (×400).
const STEMS: Record<Variant, Record<number, string>> = {
  central: { 1: 'cem', 2: 'om', 3: 'ye', 4: 'nauh', 5: 'macuil', 6: 'chicuacem', 7: 'chicom', 8: 'chicue', 9: 'chiucnauh', 10: 'mahtlac', 15: 'caxtol' },
  huasteca: { 1: 'cem', 2: 'om', 3: 'ex', 4: 'nauh', 5: 'macuil', 6: 'chicuacem', 7: 'chicom', 8: 'chicuex', 9: 'chiucnauh', 10: 'mahtlac', 15: 'caxtol' },
};

/** Classical "on-" (and): om- before o, m, p; "yei"/"ye" lose their y. */
function on(s: string): string {
  if (s.startsWith('ye')) return 'ome' + s.slice(2);
  return (/^[omp]/.test(s) ? 'om' : 'on') + s;
}

function unit(n: number, v: Variant): string {
  const u = UNITS[v];
  if (n <= 10) return u[n];
  const base = n < 15 ? 'mahtlactli' : 'caxtolli';
  const rest = n - (n < 15 ? 10 : 15);
  if (rest === 0) return base;
  return v === 'central' ? `${base} ${on(u[rest])}` : `${base} huan ${u[rest]}`;
}

/** n (1..19) added after a larger part, central only: "once", "ommahtlactli omome"… */
function onUnit(n: number): string {
  const u = UNITS.central;
  if (n <= 10) return on(u[n]);
  if (n === 15) return 'oncaxtolli';
  return n < 15 ? `ommahtlactli ${on(u[n - 10])}` : `oncaxtolli ${on(u[n - 15])}`;
}

function multiple(k: number, suffix: 'pohualli' | 'tzontli', v: Variant): string {
  const fit = (stem: string) => (suffix === 'tzontli' ? stem.replace(/m$/, 'n') : stem) + suffix;
  const stems = STEMS[v];
  if (stems[k]) return fit(stems[k]);
  const base = k < 15 ? 'mahtlactli' : 'caxtolli';
  const rest = stems[k - (k < 15 ? 10 : 15)];
  return v === 'central' ? `${base} ${fit(on(rest))}` : `${base} huan ${fit(rest)}`;
}

const ERR_RANGE = `Escribe un número entero del 1 al ${MAX_NUMBER.toLocaleString('es-MX')}.`;

export function toNahuatl(input: string | number, variant: Variant): NumberResult {
  let n: number;
  if (typeof input === 'number') n = input;
  else {
    const t = input.trim().replace(/,/g, '');
    if (t === '') return { ok: false, error: 'Escribe un número para verlo en náhuatl.' };
    if (!/^\d+$/.test(t)) return { ok: false, error: ERR_RANGE };
    n = Number(t);
  }
  if (!Number.isInteger(n) || n < 1 || n > MAX_NUMBER) return { ok: false, error: ERR_RANGE };

  const a = Math.floor(n / 400);
  const b = Math.floor((n % 400) / 20);
  const c = n % 20;
  const parts: { value: number; words: string }[] = [];
  if (a) parts.push({ value: a * 400, words: multiple(a, 'tzontli', variant) });
  if (b) parts.push({ value: b * 20, words: multiple(b, 'pohualli', variant) });
  if (c) parts.push({ value: c, words: unit(c, variant) });

  let words: string;
  if (variant === 'huasteca') {
    words = parts.map((p) => p.words).join(' huan ');
  } else {
    const twenties = b ? multiple(b, 'pohualli', variant) : '';
    const low = twenties ? (c ? `${twenties} ${onUnit(c)}` : twenties) : c ? unit(c, variant) : '';
    const high = a ? multiple(a, 'tzontli', variant) : '';
    words = high && low ? `${high} ipan ${low}` : high || low;
  }
  return { ok: true, value: n, words, parts, glyphs: { feathers: a, flags: b, dots: c } };
}
