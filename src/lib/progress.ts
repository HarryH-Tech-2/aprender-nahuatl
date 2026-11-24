import { isVariant, type Variant } from './variant';

export type VariantProgress = {
  completed: string[];
  best: Record<string, number>;
  known: string[];
  games: Record<string, number>;
};
export type Streak = { current: number; longest: number; last: string | null };
export type Progress = {
  v: 1;
  variant: Variant | null;
  central: VariantProgress;
  huasteca: VariantProgress;
  streak: Streak;
};

const emptyVariant = (): VariantProgress => ({ completed: [], best: {}, known: [], games: {} });

export function emptyProgress(): Progress {
  return {
    v: 1,
    variant: null,
    central: emptyVariant(),
    huasteca: emptyVariant(),
    streak: { current: 0, longest: 0, last: null },
  };
}

const isObj = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
const strings = (x: unknown): string[] =>
  Array.isArray(x) ? [...new Set(x.filter((s): s is string => typeof s === 'string'))] : [];
const numbers = (x: unknown): Record<string, number> =>
  isObj(x)
    ? Object.fromEntries(
        Object.entries(x).filter((e): e is [string, number] => typeof e[1] === 'number' && Number.isFinite(e[1])),
      )
    : {};
const count = (x: unknown): number => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0);

function parseVariant(x: unknown): VariantProgress {
  if (!isObj(x)) return emptyVariant();
  return { completed: strings(x.completed), best: numbers(x.best), known: strings(x.known), games: numbers(x.games) };
}

/** Turn anything (stored JSON, a database value, garbage) into valid progress. Never throws. */
export function parseProgress(raw: unknown): Progress {
  if (!isObj(raw) || raw.v !== 1) return emptyProgress();
  const s = isObj(raw.streak) ? raw.streak : {};
  const last = typeof s.last === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.last) ? s.last : null;
  return {
    v: 1,
    variant: isVariant(raw.variant) ? raw.variant : null,
    central: parseVariant(raw.central),
    huasteca: parseVariant(raw.huasteca),
    streak: last
      ? { current: count(s.current), longest: Math.max(count(s.longest), count(s.current)), last }
      : { current: 0, longest: count(s.longest), last: null },
  };
}

function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

function touchStreak(s: Streak, today: string): Streak {
  if (s.last === today) return s;
  const current = s.last && dayDiff(s.last, today) === 1 ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), last: today };
}

/** The streak as it stands today: it is broken once a full day has been missed. */
export function liveStreak(s: Streak, today: string): number {
  return s.last && dayDiff(s.last, today) <= 1 ? s.current : 0;
}

function withVariant(p: Progress, variant: Variant, fn: (vp: VariantProgress) => VariantProgress): Progress {
  return { ...p, [variant]: fn(p[variant]) };
}

export function completeLesson(p: Progress, variant: Variant, slug: string, score: number, todayISO: string): Progress {
  const next = withVariant(p, variant, (vp) => ({
    ...vp,
    completed: vp.completed.includes(slug) ? vp.completed : [...vp.completed, slug],
    best: { ...vp.best, [slug]: Math.max(vp.best[slug] ?? 0, score) },
  }));
  return { ...next, streak: touchStreak(p.streak, todayISO) };
}

export function markKnown(p: Progress, variant: Variant, id: string, known: boolean): Progress {
  return withVariant(p, variant, (vp) => ({
    ...vp,
    known: known ? (vp.known.includes(id) ? vp.known : [...vp.known, id]) : vp.known.filter((k) => k !== id),
  }));
}

export function recordGame(p: Progress, variant: Variant, game: string, score: number): Progress {
  return withVariant(p, variant, (vp) => ({
    ...vp,
    games: { ...vp.games, [game]: Math.max(vp.games[game] ?? 0, score) },
  }));
}

const maxMap = (a: Record<string, number>, b: Record<string, number>) => {
  const out = { ...a };
  for (const [k, n] of Object.entries(b)) out[k] = Math.max(out[k] ?? -Infinity, n);
  return out;
};
const mergeVariant = (a: VariantProgress, b: VariantProgress): VariantProgress => ({
  completed: [...new Set([...a.completed, ...b.completed])],
  best: maxMap(a.best, b.best),
  known: [...new Set([...a.known, ...b.known])],
  games: maxMap(a.games, b.games),
});

/** Combine two copies of progress (this device + the account) without losing anything. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const newer = (a.streak.last ?? '') >= (b.streak.last ?? '') ? a.streak : b.streak;
  return {
    v: 1,
    variant: a.variant ?? b.variant,
    central: mergeVariant(a.central, b.central),
    huasteca: mergeVariant(a.huasteca, b.huasteca),
    streak: { current: newer.current, longest: Math.max(a.streak.longest, b.streak.longest), last: newer.last },
  };
}

/** Lessons open in order: the first is always open, each later one after the previous is completed. */
export function isUnlocked(
  p: Progress,
  variant: Variant,
  lessonN: number,
  lessons: { n: number; slug: string }[],
): boolean {
  if (lessonN <= 1) return true;
  const prev = lessons.find((l) => l.n === lessonN - 1);
  return !!prev && p[variant].completed.includes(prev.slug);
}
