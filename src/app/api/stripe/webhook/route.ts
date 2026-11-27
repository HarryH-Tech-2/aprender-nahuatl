import type Stripe from 'stripe';
import { nextBilling, type BillingState } from '@/lib/billing';
import { eventsToApply, type LiveFacts } from '@/lib/checkout-guard';
import { parsePlan } from '@/lib/plan';
import { getStripe } from '@/lib/stripe';
import { toBillingEvent, type MappedEvent } from '@/lib/stripe-events';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Row = {
  id: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  lifetime_payment_intent: string | null;
};
const COLUMNS = 'id, plan, stripe_customer_id, stripe_subscription_id, lifetime_payment_intent';

/** Live Stripe facts for a checkout event, so a retried or late event cannot re-grant lost access. */
async function liveFacts(stripe: Stripe, mapped: MappedEvent): Promise<LiveFacts> {
  const e = mapped.event;
  if (e.kind !== 'checkout_completed') return {};
  if (e.mode === 'subscription') {
    try {
      const sub = await stripe.subscriptions.retrieve(e.subscriptionId);
      return { subscriptionStatus: sub.status };
    } catch (err) {
      if ((err as { statusCode?: number }).statusCode === 404) return { subscriptionStatus: null };
      throw err;
    }
  }
  const pi = await stripe.paymentIntents.retrieve(e.paymentIntentId, { expand: ['latest_charge'] });
  const charge = typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
  let disputeLost = false;
  if (charge?.disputed) {
    const disputes = await stripe.disputes.list({ payment_intent: e.paymentIntentId, limit: 10 });
    disputeLost = disputes.data.some((d) => d.status === 'lost');
  }
  return { chargeRefunded: !!charge && charge.refunded === true, disputeLost };
}

/** By user id (checkout), else customer id, else the lifetime payment intent (disputes). */
async function findProfile(admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>, mapped: MappedEvent) {
  let q = admin.from('profiles').select(COLUMNS);
  if (mapped.userId) q = q.eq('id', mapped.userId);
  else if (mapped.customerId) q = q.eq('stripe_customer_id', mapped.customerId);
  else if (mapped.event.kind === 'payment_revoked') q = q.eq('lifetime_payment_intent', mapped.event.paymentIntentId);
  else return { row: null, failed: false };
  const { data, error } = await q.maybeSingle();
  return { row: (data as Row | null) ?? null, failed: !!error };
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const admin = getSupabaseAdmin();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !admin || !secret) return Response.json({ error: 'Billing is not configured' }, { status: 503 });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return Response.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return Response.json({ error: 'Bad signature' }, { status: 400 });
  }

  const mapped = toBillingEvent(event);
  if (!mapped) return Response.json({ received: true });

  try {
    const { row, failed } = await findProfile(admin, mapped);
    if (failed) return Response.json({ error: 'Lookup failed' }, { status: 500 });
    if (!row) {
      console.warn('stripe webhook: no profile for event', event.id, event.type);
      return Response.json({ received: true });
    }

    const events = eventsToApply(mapped, await liveFacts(stripe, mapped));

    let state: BillingState = {
      plan: parsePlan(row.plan),
      subscriptionId: row.stripe_subscription_id,
      lifetimePaymentIntent: row.lifetime_payment_intent,
    };
    const toCancel = new Set<string>();
    for (const e of events) {
      const result = nextBilling(state, e);
      state = result.next;
      if (result.cancelSubscription) toCancel.add(result.cancelSubscription);
    }
    // A subscription that is still the current one must not be cancelled by an earlier step.
    if (state.subscriptionId) toCancel.delete(state.subscriptionId);

    const update: Record<string, unknown> = {
      plan: state.plan,
      stripe_subscription_id: state.subscriptionId,
      lifetime_payment_intent: state.lifetimePaymentIntent,
    };
    if (mapped.event.kind === 'checkout_completed' && mapped.customerId && !row.stripe_customer_id) {
      update.stripe_customer_id = mapped.customerId;
    }
    const { error } = await admin.from('profiles').update(update).eq('id', row.id);
    if (error) return Response.json({ error: 'Could not save billing state' }, { status: 500 });

    for (const id of toCancel) {
      try {
        await stripe.subscriptions.cancel(id);
      } catch (err) {
        // Already cancelled (or gone) is fine; the billing state is saved either way.
        console.warn('stripe webhook: could not cancel subscription', id, (err as Error).message);
      }
    }
    return Response.json({ received: true });
  } catch (err) {
    console.error('stripe webhook failed', err);
    return Response.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
