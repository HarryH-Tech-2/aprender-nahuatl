import { describe, expect, it } from 'vitest';
import { LESSONS } from '@/content/lessons';
import { lessonGate } from './access';
import { canBuy, encodePendingPlan, isMember, parsePlan, readPendingPlan } from './plan';
import { emptyProgress } from './progress';

describe('plan', () => {
  it('isMember', () => {
    expect(isMember(null)).toBe(false);
    expect(isMember({ plan: 'free' })).toBe(false);
    expect(isMember({ plan: 'monthly' })).toBe(true);
    expect(isMember({ plan: 'lifetime' })).toBe(true);
    expect(isMember({ plan: 'member' })).toBe(false); // old placeholder value is not a plan
  });
  it('canBuy', () => {
    expect(canBuy('free', 'monthly')).toBe(true);
    expect(canBuy('free', 'lifetime')).toBe(true);
    expect(canBuy('monthly', 'lifetime')).toBe(true);
    expect(canBuy('monthly', 'monthly')).toBe(false);
    expect(canBuy('lifetime', 'monthly')).toBe(false);
    expect(canBuy('lifetime', 'lifetime')).toBe(false);
  });
  it('pending plan survives 30 minutes, not longer, and rejects garbage', () => {
    const raw = encodePendingPlan('lifetime', 1_000);
    expect(readPendingPlan(raw, 1_000 + 29 * 60_000)).toBe('lifetime');
    expect(readPendingPlan(raw, 1_000 + 31 * 60_000)).toBe(null);
    expect(readPendingPlan('garbage', 0)).toBe(null);
    expect(readPendingPlan(JSON.stringify({ plan: 'free', at: 0 }), 0)).toBe(null);
    expect(readPendingPlan(null, 0)).toBe(null);
  });
  it('parsePlan', () => {
    expect(parsePlan('lifetime')).toBe('lifetime');
    expect(parsePlan('member')).toBe('free');
    expect(parsePlan(undefined)).toBe('free');
  });
});

describe('lessonGate', () => {
  const p0 = emptyProgress();
  const lessons = LESSONS;
  const l1 = { n: 1, access: 'free' as const };
  const l2 = { n: 2, access: 'member' as const };
  const l3 = { n: 3, access: 'member' as const };
  const base = { progress: p0, variant: 'central' as const, lessons };
  it('plays free lesson 1 for anyone', () => {
    expect(lessonGate({ lesson: l1, account: null, ...base })).toBe('play');
  });
  it('offers member lessons to visitors and free accounts', () => {
    expect(lessonGate({ lesson: l2, account: null, ...base })).toBe('offer');
    expect(lessonGate({ lesson: l2, account: { plan: 'free', planLoaded: true }, ...base })).toBe('offer');
  });
  it('waits for the plan to load on member lessons only', () => {
    expect(lessonGate({ lesson: l2, account: { plan: 'lifetime', planLoaded: false }, ...base })).toBe('loading');
    expect(lessonGate({ lesson: l1, account: { plan: 'free', planLoaded: false }, ...base })).toBe('play');
  });
  it('members skip the chain', () => {
    expect(lessonGate({ lesson: l3, account: { plan: 'monthly', planLoaded: true }, ...base })).toBe('play');
  });
  it('a free lesson past 1 that is not unlocked asks to finish the previous one', () => {
    expect(lessonGate({ lesson: { n: 2, access: 'free' }, account: null, ...base })).toBe('finish-previous');
  });
});
