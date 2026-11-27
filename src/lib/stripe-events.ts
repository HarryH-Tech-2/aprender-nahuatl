import type Stripe from 'stripe';
import type { BillingEvent } from './billing';

export type MappedEvent = { userId: string | null; customerId: string | null; event: BillingEvent };

function idOf(x: string | { id: string } | null | undefined): string | null {
  if (!x) return null;
  return typeof x === 'string' ? x : x.id;
}

/** Map a Stripe webhook event to a billing event, or null when it does not affect access. */
export function toBillingEvent(e: Stripe.Event): MappedEvent | null {
  switch (e.type) {
    case 'checkout.session.completed': {
      const s = e.data.object;
      if (s.payment_status !== 'paid') return null;
      const base = { userId: s.client_reference_id ?? null, customerId: idOf(s.customer) };
      if (s.mode === 'subscription') {
        const subscriptionId = idOf(s.subscription);
        if (!subscriptionId) return null;
        return { ...base, event: { kind: 'checkout_completed', mode: 'subscription', subscriptionId } };
      }
      if (s.mode === 'payment') {
        const paymentIntentId = idOf(s.payment_intent);
        if (!paymentIntentId) return null;
        return { ...base, event: { kind: 'checkout_completed', mode: 'payment', paymentIntentId } };
      }
      return null;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = e.data.object;
      return {
        userId: null,
        customerId: idOf(sub.customer),
        event: { kind: 'subscription_changed', subscriptionId: sub.id, status: sub.status },
      };
    }
    case 'charge.refunded': {
      const c = e.data.object;
      const paymentIntentId = idOf(c.payment_intent);
      if (!paymentIntentId || c.amount_refunded !== c.amount) return null;
      return {
        userId: null,
        customerId: idOf(c.customer),
        event: { kind: 'payment_revoked', paymentIntentId },
      };
    }
    case 'charge.dispute.closed': {
      const d = e.data.object;
      const paymentIntentId = idOf(d.payment_intent);
      if (d.status !== 'lost' || !paymentIntentId) return null;
      return { userId: null, customerId: null, event: { kind: 'payment_revoked', paymentIntentId } };
    }
    default:
      return null;
  }
}
