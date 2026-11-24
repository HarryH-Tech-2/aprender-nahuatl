import { mergeProgress, parseProgress, type Progress, type VariantProgress } from './progress';

const sortedList = (xs: string[]) => [...xs].sort();
const sortedMap = (m: Record<string, number>) => Object.keys(m).sort().map((k) => [k, m[k]]);
const canonVariant = (v: VariantProgress) => [sortedList(v.completed), sortedMap(v.best), sortedList(v.known), sortedMap(v.games)];
const canon = (p: Progress) => JSON.stringify([p.variant, canonVariant(p.central), canonVariant(p.huasteca), p.streak.current, p.streak.longest, p.streak.last]);

/** Same progress, whatever the order of lists and keys. */
export function equalProgress(a: Progress, b: Progress): boolean {
  return canon(a) === canon(b);
}

/** What came back when reading the account's row. `progress` is null for a brand-new account. */
export type RemoteRead = { ok: true; progress: unknown } | { ok: false };

/**
 * Decide what to write after comparing this device with the account.
 * Nothing is ever written when the account could not be read: writing then would
 * replace the account's progress with whatever this device happens to hold.
 */
export function reconcile(local: Progress, remote: RemoteRead): { writeLocal: Progress | null; writeRemote: Progress | null } {
  if (!remote.ok) return { writeLocal: null, writeRemote: null };
  const stored = parseProgress(remote.progress);
  const merged = mergeProgress(local, stored);
  return {
    writeLocal: equalProgress(merged, local) ? null : merged,
    writeRemote: equalProgress(merged, stored) ? null : merged,
  };
}
