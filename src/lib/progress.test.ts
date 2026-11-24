import { describe, expect, it } from 'vitest';
import {
  completeLesson, emptyProgress, isUnlocked, markKnown, mergeProgress, parseProgress, recordGame,
} from './progress';
import { canAccess } from './access';

describe('parseProgress', () => {
  it.each([null, undefined, 'garbage', 42, [], { v: 0 }, { v: 1, central: 'x' }, { v: 1, central: { completed: 5 } }])(
    'returns valid empty-ish progress for %j',
    (raw) => {
      const p = parseProgress(raw);
      expect(p.v).toBe(1);
      expect(Array.isArray(p.central.completed)).toBe(true);
      expect(Array.isArray(p.huasteca.known)).toBe(true);
      expect(p.streak.current).toBe(0);
    },
  );
  it('keeps valid data and drops junk fields', () => {
    const p = parseProgress({
      v: 1, variant: 'huasteca', junk: 1,
      central: { completed: ['a', 3], best: { a: 0.8, b: 'x' }, known: [], games: {} },
      streak: { current: 2, longest: 4, last: '2026-11-23' },
    });
    expect(p.variant).toBe('huasteca');
    expect(p.central.completed).toEqual(['a']);
    expect(p.central.best).toEqual({ a: 0.8 });
    expect(p.streak).toEqual({ current: 2, longest: 4, last: '2026-11-23' });
  });
  it('rejects an unknown variant', () => expect(parseProgress({ v: 1, variant: 'klingon' }).variant).toBeNull());
  it('survives a JSON round trip', () => {
    const p = completeLesson(emptyProgress(), 'central', 'l1', 0.9, '2026-11-24');
    expect(parseProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });
});

describe('completeLesson', () => {
  it('records completion and best score for one variant only', () => {
    const p = completeLesson(emptyProgress(), 'central', 'l1', 0.7, '2026-11-24');
    expect(p.central.completed).toEqual(['l1']);
    expect(p.central.best.l1).toBe(0.7);
    expect(p.huasteca.completed).toEqual([]);
  });
  it('keeps the best score and does not duplicate', () => {
    let p = completeLesson(emptyProgress(), 'central', 'l1', 0.9, '2026-11-24');
    p = completeLesson(p, 'central', 'l1', 0.5, '2026-11-24');
    expect(p.central.completed).toEqual(['l1']);
    expect(p.central.best.l1).toBe(0.9);
  });
  it('does not mutate its input', () => {
    const a = emptyProgress();
    completeLesson(a, 'central', 'l1', 1, '2026-11-24');
    expect(a.central.completed).toEqual([]);
  });
  it('streak: first day 1, same day unchanged, next day +1, gap resets, longest kept', () => {
    let p = completeLesson(emptyProgress(), 'central', 'a', 1, '2026-11-24');
    expect(p.streak.current).toBe(1);
    p = completeLesson(p, 'central', 'b', 1, '2026-11-24');
    expect(p.streak.current).toBe(1);
    p = completeLesson(p, 'huasteca', 'a', 1, '2026-11-25');
    expect(p.streak.current).toBe(2);
    p = completeLesson(p, 'central', 'c', 1, '2026-12-01');
    expect(p.streak).toEqual({ current: 1, longest: 2, last: '2026-12-01' });
  });
  it('streak crosses a month boundary', () => {
    let p = completeLesson(emptyProgress(), 'central', 'a', 1, '2026-11-30');
    p = completeLesson(p, 'central', 'b', 1, '2026-12-01');
    expect(p.streak.current).toBe(2);
  });
});

describe('markKnown / recordGame', () => {
  it('toggles known ids', () => {
    let p = markKnown(emptyProgress(), 'central', 'tl', true);
    p = markKnown(p, 'central', 'tl', true);
    expect(p.central.known).toEqual(['tl']);
    expect(markKnown(p, 'central', 'tl', false).central.known).toEqual([]);
  });
  it('keeps the highest game score', () => {
    let p = recordGame(emptyProgress(), 'huasteca', 'lluvia', 10);
    p = recordGame(p, 'huasteca', 'lluvia', 4);
    expect(p.huasteca.games.lluvia).toBe(10);
  });
});

describe('mergeProgress', () => {
  it('unions completed/known, takes max of best, games and streak', () => {
    let a = completeLesson(emptyProgress(), 'central', 'l1', 0.6, '2026-11-20');
    a = recordGame(a, 'central', 'memorama', 5);
    let b = completeLesson(emptyProgress(), 'central', 'l1', 0.9, '2026-11-24');
    b = completeLesson(b, 'central', 'l2', 0.5, '2026-11-25');
    b = markKnown(b, 'huasteca', 'x', true);
    const m = mergeProgress(a, b);
    expect([...m.central.completed].sort()).toEqual(['l1', 'l2']);
    expect(m.central.best).toEqual({ l1: 0.9, l2: 0.5 });
    expect(m.central.games.memorama).toBe(5);
    expect(m.huasteca.known).toEqual(['x']);
    expect(m.streak.last).toBe('2026-11-25');
    expect(m.streak.current).toBe(2);
    expect(m.streak.longest).toBe(2);
  });
  it('prefers the first argument variant, falling back to the second', () => {
    const a = { ...emptyProgress(), variant: null };
    const b = { ...emptyProgress(), variant: 'huasteca' as const };
    expect(mergeProgress(a, b).variant).toBe('huasteca');
    expect(mergeProgress({ ...a, variant: 'central' }, b).variant).toBe('central');
  });
});

describe('isUnlocked', () => {
  const lessons = [{ n: 1, slug: 'l1' }, { n: 2, slug: 'l2' }, { n: 3, slug: 'l3' }];
  it('lesson 1 is always open', () => expect(isUnlocked(emptyProgress(), 'central', 1, lessons)).toBe(true));
  it('lesson 2 opens after lesson 1 in the same variant only', () => {
    const p = completeLesson(emptyProgress(), 'central', 'l1', 1, '2026-11-24');
    expect(isUnlocked(p, 'central', 2, lessons)).toBe(true);
    expect(isUnlocked(p, 'central', 3, lessons)).toBe(false);
    expect(isUnlocked(p, 'huasteca', 2, lessons)).toBe(false);
  });
});

describe('canAccess', () => {
  it('free lessons are open to everyone', () => {
    expect(canAccess(null, { access: 'free' })).toBe(true);
    expect(canAccess({ plan: 'free' }, { access: 'free' })).toBe(true);
  });
  it('member lessons need a member plan', () => {
    expect(canAccess(null, { access: 'member' })).toBe(false);
    expect(canAccess({ plan: 'free' }, { access: 'member' })).toBe(false);
    expect(canAccess({ plan: 'member' }, { access: 'member' })).toBe(true);
  });
});
