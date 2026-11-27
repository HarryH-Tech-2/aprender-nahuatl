// Server only: never import this from a client component (it reads secret keys).
import Stripe from 'stripe';
import type { PaidPlan } from './plan';

let client: Stripe | null = null;

/** The Stripe client, or null when STRIPE_SECRET_KEY is not set. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

/** The Stripe price id for a plan, or null when it is not configured. */
export function priceId(plan: PaidPlan): string | null {
  const id = plan === 'monthly' ? process.env.STRIPE_PRICE_MONTHLY : process.env.STRIPE_PRICE_LIFETIME;
  return id || null;
}
