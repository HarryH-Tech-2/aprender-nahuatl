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
    expect(nextBilling(monthly1, changed('unpaid')).next).toEqual(free0);
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
    const states = [free0, monthly1, lifetime1];
    const events: BillingEvent[] = [
      subCheckout,
      payCheckout,
      changed('active'),
      changed('canceled'),
      changed('past_due'),
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
