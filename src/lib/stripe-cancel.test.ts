import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { cancelSubscriptionTolerant, isGoneError } from './stripe-cancel';

function fake(cancel: () => Promise<unknown>, retrieve: () => Promise<unknown>) {
  return { subscriptions: { cancel: vi.fn(cancel), retrieve: vi.fn(retrieve) } } as unknown as Stripe;
}

describe('isGoneError', () => {
  it('recognises missing resources', () => {
    expect(isGoneError({ code: 'resource_missing' })).toBe(true);
    expect(isGoneError({ statusCode: 404 })).toBe(true);
    expect(isGoneError({ statusCode: 500 })).toBe(false);
    expect(isGoneError(null)).toBe(false);
  });
});

describe('cancelSubscriptionTolerant', () => {
  it('succeeds when cancel works', async () => {
    expect(await cancelSubscriptionTolerant(fake(async () => ({}), async () => ({})), 'sub_1')).toBe(true);
  });
  it('treats a missing subscription as success', async () => {
    const s = fake(async () => { throw { code: 'resource_missing' }; }, async () => ({}));
    expect(await cancelSubscriptionTolerant(s, 'sub_1')).toBe(true);
  });
  it('treats an already canceled subscription as success', async () => {
    const s = fake(async () => { throw { statusCode: 400 }; }, async () => ({ status: 'canceled' }));
    expect(await cancelSubscriptionTolerant(s, 'sub_1')).toBe(true);
  });
  it('fails on other errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const s = fake(async () => { throw { statusCode: 500 }; }, async () => ({ status: 'active' }));
    expect(await cancelSubscriptionTolerant(s, 'sub_1')).toBe(false);
  });
});
