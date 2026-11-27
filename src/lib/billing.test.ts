import { describe, expect, it } from 'vitest';
import { nextBilling, type BillingEvent, type BillingState } from './billing';

const free0: BillingState = { plan: 'free', subscriptionId: null, lifetimePaymentIntent: null };
const monthly1: BillingState = { plan: 'monthly', subscriptionId: 'sub_1', lifetimePaymentIntent: null };
const lifetime1: BillingState = { plan: 'lifetime', subscriptionId: null, lifetimePaymentIntent: 'pi_1' };

const subCheckout: BillingEvent = { kind: 'checkout_completed', mode: 'subscription', subscriptionId: 'sub_1' };
const payCheckout: BillingEvent = { kind: 'checkout_completed', mode: 'payment', paymentIntentId: 'pi_1' };
const changed = (status: string): BillingEvent => ({ kind: 'subscription_changed', subscriptionId: 'sub_1', status });

describe('nextBilling', () => {
  it('free + subscription checkout -> monthly', () => {
    expect(nextBilling(free0, subCheckout)).toEqual({ next: monthly1, cancelSubscription: null });
  });

  it('monthly + payment checkout -> lifetime and cancels the subscription', () => {
    expect(nextBilling(monthly1, payCheckout)).toEqual({ next: lifetime1, cancelSubscription: 'sub_1' });
  });

  it('lifetime ignores a later subscription_changed', () => {
    const { next } = nextBilling(monthly1, payCheckout);
    expect(nextBilling(next, changed('canceled')).next).toEqual(lifetime1);
  });

  it('lifetime + subscription checkout is unchanged and cancels the new sub', () => {
    expect(nextBilling(lifetime1, subCheckout)).toEqual({ next: lifetime1, cancelSubscription: 'sub_1' });
  });

  it('monthly past_due stays monthly, unpaid goes free', () => {
    expect(nextBilling(monthly1, changed('past_due')).next.plan).toBe('monthly');
  });

  it('unpaid keeps the subscription id (free), then active restores monthly', () => {
    const unpaid = nextBilling(monthly1, changed('unpaid')).next;
    expect(unpaid).toEqual({ plan: 'free', subscriptionId: 'sub_1', lifetimePaymentIntent: null });
    expect(nextBilling(unpaid, changed('active')).next).toEqual(monthly1);
  });

  it('canceled and incomplete_expired clear the subscription id', () => {
    expect(nextBilling(monthly1, changed('canceled')).next).toEqual(free0);
    expect(nextBilling(monthly1, changed('incomplete_expired')).next).toEqual(free0);
  });

  it('a different new subscription checkout cancels the old one', () => {
    const r = nextBilling(monthly1, { kind: 'checkout_completed', mode: 'subscription', subscriptionId: 'sub_2' });
    expect(r).toEqual({ next: { ...monthly1, subscriptionId: 'sub_2' }, cancelSubscription: 'sub_1' });
  });

  it('out-of-order subscription_changed is ignored, then checkout applies', () => {
    expect(nextBilling(free0, changed('active')).next).toEqual(free0);
    expect(nextBilling(nextBilling(free0, changed('active')).next, subCheckout).next).toEqual(monthly1);
  });

  it('subscription_changed for a different subscription is ignored', () => {
    expect(
      nextBilling(monthly1, { kind: 'subscription_changed', subscriptionId: 'sub_2', status: 'canceled' }).next,
    ).toEqual(monthly1);
  });

  it('payment_revoked matching the lifetime payment -> free; others unchanged', () => {
    expect(nextBilling(lifetime1, { kind: 'payment_revoked', paymentIntentId: 'pi_1' }).next).toEqual(free0);
    expect(nextBilling(lifetime1, { kind: 'payment_revoked', paymentIntentId: 'pi_other' }).next).toEqual(lifetime1);
    expect(nextBilling(monthly1, { kind: 'payment_revoked', paymentIntentId: 'pi_x' }).next).toEqual(monthly1);
  });

  it('is idempotent for every (state, event) pair', () => {
    const states: BillingState[] = [
      free0,
      monthly1,
      lifetime1,
      { plan: 'free', subscriptionId: 'sub_1', lifetimePaymentIntent: null },
    ];
    const events: BillingEvent[] = [
      subCheckout,
      payCheckout,
      changed('active'),
      changed('canceled'),
      changed('past_due'),
      changed('unpaid'),
      { kind: 'checkout_completed', mode: 'subscription', subscriptionId: 'sub_2' },
      { kind: 'payment_revoked', paymentIntentId: 'pi_1' },
      { kind: 'payment_revoked', paymentIntentId: 'pi_other' },
    ];
    for (const s of states) {
      for (const e of events) {
        const once = nextBilling(s, e).next;
        expect(nextBilling(once, e).next).toEqual(once);
      }
    }
  });
});
