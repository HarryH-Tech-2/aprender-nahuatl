// Server only.
import type Stripe from 'stripe';

/** True when a Stripe error means the object does not exist (so there is nothing left to cancel). */
export function isGoneError(err: unknown): boolean {
  const e = err as { code?: string; statusCode?: number } | null;
  return !!e && (e.code === 'resource_missing' || e.statusCode === 404);
}

/** Cancels a subscription, treating "already gone" or "already canceled" as success. Returns false on a real failure. */
export async function cancelSubscriptionTolerant(stripe: Stripe, id: string): Promise<boolean> {
  try {
    await stripe.subscriptions.cancel(id);
    return true;
  } catch (err) {
    if (isGoneError(err)) return true;
    try {
      if ((await stripe.subscriptions.retrieve(id)).status === 'canceled') return true;
    } catch (e2) {
      if (isGoneError(e2)) return true;
    }
    console.error('could not cancel subscription', id, err);
    return false;
  }
}
