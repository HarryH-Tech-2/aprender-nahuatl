import { describe, expect, it } from 'vitest';
import type Stripe from 'stripe';
import { toBillingEvent } from './stripe-events';

const ev = (type: string, object: unknown) => ({ type, data: { object } }) as unknown as Stripe.Event;

describe('toBillingEvent', () => {
  it('paid payment-mode checkout', () => {
    expect(
      toBillingEvent(
        ev('checkout.session.completed', {
          mode: 'payment',
          payment_status: 'paid',
          client_reference_id: 'u1',
          customer: 'cus_1',
          payment_intent: 'pi_1',
        }),
      ),
    ).toEqual({
      userId: 'u1',
      customerId: 'cus_1',
      event: { kind: 'checkout_completed', mode: 'payment', paymentIntentId: 'pi_1' },
    });
  });

  it('subscription-mode checkout with expanded objects', () => {
    expect(
      toBillingEvent(
        ev('checkout.session.completed', {
          mode: 'subscription',
          payment_status: 'paid',
          client_reference_id: 'u1',
          customer: { id: 'cus_1' },
          subscription: { id: 'sub_1' },
        }),
      ),
    ).toEqual({
      userId: 'u1',
      customerId: 'cus_1',
      event: { kind: 'checkout_completed', mode: 'subscription', subscriptionId: 'sub_1' },
    });
  });

  it('unpaid checkout -> null', () => {
    expect(
      toBillingEvent(
        ev('checkout.session.completed', { mode: 'payment', payment_status: 'unpaid', payment_intent: 'pi_1' }),
      ),
    ).toBeNull();
  });

  it('subscription updated and deleted', () => {
    expect(
      toBillingEvent(ev('customer.subscription.updated', { id: 'sub_1', status: 'past_due', customer: 'cus_1' })),
    ).toEqual({
      userId: null,
      customerId: 'cus_1',
      event: { kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'past_due' },
    });
    expect(
      toBillingEvent(ev('customer.subscription.deleted', { id: 'sub_1', status: 'canceled', customer: 'cus_1' }))?.event,
    ).toEqual({ kind: 'subscription_changed', subscriptionId: 'sub_1', status: 'canceled' });
  });

  it('partial refund -> null, full refund -> payment_revoked', () => {
    const charge = { amount: 29900, payment_intent: 'pi_1', customer: 'cus_1' };
    expect(toBillingEvent(ev('charge.refunded', { ...charge, amount_refunded: 100 }))).toBeNull();
    expect(toBillingEvent(ev('charge.refunded', { ...charge, amount_refunded: 29900 }))).toEqual({
      userId: null,
      customerId: 'cus_1',
      event: { kind: 'payment_revoked', paymentIntentId: 'pi_1' },
    });
  });

  it('dispute won -> null, lost -> payment_revoked', () => {
    expect(toBillingEvent(ev('charge.dispute.closed', { status: 'won', payment_intent: 'pi_1' }))).toBeNull();
    expect(toBillingEvent(ev('charge.dispute.closed', { status: 'lost', payment_intent: 'pi_1' }))).toEqual({
      userId: null,
      customerId: null,
      event: { kind: 'payment_revoked', paymentIntentId: 'pi_1' },
    });
  });

  it('other events -> null', () => {
    expect(toBillingEvent(ev('invoice.paid', {}))).toBeNull();
  });
});
