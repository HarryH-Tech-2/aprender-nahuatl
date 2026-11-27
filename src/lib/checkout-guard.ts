import type { BillingEvent } from './billing';
import type { MappedEvent } from './stripe-events';

/** What Stripe says right now about the thing a checkout event refers to. */
export type LiveFacts = {
  /** Subscription mode: the live subscription status; null when it no longer exists. */
  subscriptionStatus?: string | null;
  /** Payment mode: the charge is fully refunded. */
  chargeRefunded?: boolean;
  /** Payment mode: the charge has a dispute that was lost. */
  disputeLost?: boolean;
};

/**
 * Checkout events can be retried or arrive late, after access was already revoked.
 * Reconcile them with live Stripe state and return the billing events to apply, in order.
 */
export function eventsToApply(mapped: MappedEvent, live: LiveFacts): BillingEvent[] {
  const e = mapped.event;
  if (e.kind !== 'checkout_completed') return [e];

  if (e.mode === 'subscription') {
    return [e, { kind: 'subscription_changed', subscriptionId: e.subscriptionId, status: live.subscriptionStatus ?? 'canceled' }];
  }
  if (live.chargeRefunded || live.disputeLost) return [];
  return [e];
}
