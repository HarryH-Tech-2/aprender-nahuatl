import { describe, expect, it } from 'vitest';
import { billingChanged, eventsToApply } from './checkout-guard';
import type { MappedEvent } from './stripe-events';

const sub: MappedEvent = {
  userId: 'u1',
  customerId: 'c1',
  event: { kind: 'checkout_completed', mode: 'subscription', subscriptionId: 'sub_1' },
};
const pay: MappedEvent = {
  userId: 'u1',
  customerId: 'c1',
  event: { kind: 'checkout_completed', mode: 'payment', paymentIntentId: 'pi_1' },
};
const changed: MappedEvent = {
  userId: null,
  customerId: 'c1',
  event: { kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'canceled' },
};

describe('eventsToApply', () => {
  it('passes non-checkout events through untouched', () => {
    expect(eventsToApply(changed, {})).toEqual([changed.event]);
  });

  it('follows a subscription checkout with its live status', () => {
    expect(eventsToApply(sub, { subscriptionStatus: 'active' })).toEqual([
      sub.event,
      { kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'active' },
    ]);
  });

  it('ends a since-cancelled subscription as free', () => {
    const out = eventsToApply(sub, { subscriptionStatus: 'canceled' });
    expect(out[1]).toEqual({ kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'canceled' });
  });

  it('treats a missing subscription as cancelled', () => {
    const out = eventsToApply(sub, { subscriptionStatus: null });
    expect(out[1]).toEqual({ kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'canceled' });
  });

  it('grants a lifetime payment that is intact', () => {
    expect(eventsToApply(pay, { chargeRefunded: false, disputeLost: false })).toEqual([pay.event]);
  });

  it('skips a refunded lifetime payment', () => {
    expect(eventsToApply(pay, { chargeRefunded: true })).toEqual([]);
  });

  it('skips a lifetime payment whose dispute was lost', () => {
    expect(eventsToApply(pay, { disputeLost: true })).toEqual([]);
  });
});

describe('billingChanged', () => {
  const a = { plan: 'monthly' as const, subscriptionId: 'sub_1', lifetimePaymentIntent: null };
  it('is false for equal states', () => {
    expect(billingChanged(a, { ...a })).toBe(false);
  });
  it.each([
    { plan: 'free' as const },
    { subscriptionId: null },
    { lifetimePaymentIntent: 'pi_1' },
  ])('is true when %o differs', (diff) => {
    expect(billingChanged(a, { ...a, ...diff })).toBe(true);
  });
});
