import { describe, expect, it } from 'vitest';
import { completeLesson, emptyProgress, markKnown } from './progress';
import { equalProgress, reconcile } from './sync';

const local = completeLesson(emptyProgress(), 'central', 'l1', 0.8, '2026-11-24');
const remote = completeLesson(completeLesson(emptyProgress(), 'central', 'l1', 0.5, '2026-11-20'), 'huasteca', 'l2', 1, '2026-11-21');

describe('equalProgress', () => {
  it('ignores the order of lists and keys', () => {
    const a = completeLesson(completeLesson(emptyProgress(), 'central', 'a', 1, '2026-11-24'), 'central', 'b', 0.5, '2026-11-24');
    const b = completeLesson(completeLesson(emptyProgress(), 'central', 'b', 0.5, '2026-11-24'), 'central', 'a', 1, '2026-11-24');
    expect(equalProgress(a, b)).toBe(true);
  });
  it('sees a different score, variant or known item', () => {
    expect(equalProgress(local, completeLesson(emptyProgress(), 'central', 'l1', 0.9, '2026-11-24'))).toBe(false);
    expect(equalProgress(local, { ...local, variant: 'huasteca' })).toBe(false);
    expect(equalProgress(local, markKnown(local, 'central', 'tl', true))).toBe(false);
  });
});

describe('reconcile', () => {
  it('never writes when the account could not be read', () => {
    const r = reconcile(local, { ok: false });
    expect(r.writeRemote).toBeNull();
    expect(r.writeLocal).toBeNull();
  });
  it('keeps what the account has when this device is empty', () => {
    const r = reconcile(emptyProgress(), { ok: true, progress: remote });
    expect(r.writeLocal?.huasteca.completed).toEqual(['l2']);
    expect(r.writeLocal?.central.best.l1).toBe(0.5);
    expect(r.writeRemote).toBeNull();
  });
  it('sends this device progress to a brand-new account', () => {
    const r = reconcile(local, { ok: true, progress: null });
    expect(r.writeRemote?.central.completed).toEqual(['l1']);
    expect(r.writeLocal).toBeNull();
  });
  it('merges both sides and writes both when each has something new', () => {
    const r = reconcile(local, { ok: true, progress: remote });
    expect(r.writeLocal?.huasteca.completed).toEqual(['l2']);
    expect(r.writeRemote?.central.best.l1).toBe(0.8);
    expect(equalProgress(r.writeLocal!, r.writeRemote!)).toBe(true);
  });
  it('writes nothing when both sides already agree', () => {
    const r = reconcile(local, { ok: true, progress: JSON.parse(JSON.stringify(local)) });
    expect(r.writeLocal).toBeNull();
    expect(r.writeRemote).toBeNull();
  });
  it('treats a garbage account value as empty instead of crashing', () => {
    const r = reconcile(local, { ok: true, progress: 'garbage' });
    expect(r.writeRemote?.central.completed).toEqual(['l1']);
  });
});
