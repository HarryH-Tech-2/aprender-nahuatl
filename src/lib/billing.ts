import type { Plan } from './plan';

export type BillingState = {
  plan: Plan;
  subscriptionId: string | null;
  lifetimePaymentIntent: string | null;
};

export type BillingEvent =
  | { kind: 'checkout_completed'; mode: 'subscription'; subscriptionId: string }
  | { kind: 'checkout_completed'; mode: 'payment'; paymentIntentId: string }
  | { kind: 'subscription_changed'; subscriptionId: string; status: string }
  | { kind: 'payment_revoked'; paymentIntentId: string };

export const ACTIVE_SUB_STATUSES = ['active', 'trialing', 'past_due'];

/** Pure, idempotent billing transitions. `cancelSubscription` is a Stripe subscription the caller should cancel. */
export function nextBilling(
  current: BillingState,
  e: BillingEvent,
): { next: BillingState; cancelSubscription: string | null } {
  const same = { next: current, cancelSubscription: null };

  switch (e.kind) {
    case 'checkout_completed':
      if (e.mode === 'payment') {
        return {
          next: { plan: 'lifetime', subscriptionId: null, lifetimePaymentIntent: e.paymentIntentId },
          cancelSubscription: current.subscriptionId,
        };
      }
      if (current.plan === 'lifetime') return { next: current, cancelSubscription: e.subscriptionId };
      return { next: { ...current, plan: 'monthly', subscriptionId: e.subscriptionId }, cancelSubscription: null };

    case 'subscription_changed':
      if (current.plan === 'lifetime' || current.subscriptionId !== e.subscriptionId) return same;
      if (ACTIVE_SUB_STATUSES.includes(e.status)) {
        return { next: { ...current, plan: 'monthly' }, cancelSubscription: null };
      }
      return { next: { ...current, plan: 'free', subscriptionId: null }, cancelSubscription: null };

    case 'payment_revoked':
      if (current.lifetimePaymentIntent !== null && current.lifetimePaymentIntent === e.paymentIntentId) {
        return {
          next: { plan: 'free', subscriptionId: null, lifetimePaymentIntent: null },
          cancelSubscription: null,
        };
      }
      return same;
  }
}
