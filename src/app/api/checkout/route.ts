import { userFromRequest } from '@/lib/auth-server';
import { canBuy, parsePlan, type PaidPlan } from '@/lib/plan';
import { getStripe, priceId } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Starts a Stripe Checkout session for the signed-in learner. */
export async function POST(request: Request) {
  const stripe = getStripe();
  const admin = getSupabaseAdmin();
  if (!stripe || !admin) return Response.json({ error: 'Checkout is not configured' }, { status: 503 });

  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  const wanted = (body as { plan?: unknown } | null)?.plan;
  if (wanted !== 'monthly' && wanted !== 'lifetime') return Response.json({ error: 'Bad plan' }, { status: 400 });
  const plan: PaidPlan = wanted;

  const price = priceId(plan);
  if (!price) return Response.json({ error: 'Checkout is not configured' }, { status: 503 });

  const { data: profile, error } = await admin
    .from('profiles')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !profile) return Response.json({ error: 'Profile not found' }, { status: 500 });

  if (!canBuy(parsePlan(profile.plan), plan)) return Response.json({ error: 'already' }, { status: 409 });

  try {
    let customerId: string | null = profile.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      const { error: saveError } = await admin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      if (saveError) return Response.json({ error: 'Could not start checkout' }, { status: 500 });
    }

    const origin = new URL(request.url).origin;
    const metadata = { user_id: user.id, plan };
    const session = await stripe.checkout.sessions.create({
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: [{ price, quantity: 1 }],
      customer: customerId,
      client_reference_id: user.id,
      metadata,
      ...(plan === 'monthly' ? { subscription_data: { metadata } } : { payment_intent_data: { metadata } }),
      automatic_tax: { enabled: true },
      customer_update: { address: 'auto' },
      billing_address_collection: 'auto',
      locale: 'es-419',
      allow_promotion_codes: false,
      success_url: `${origin}/curso/bienvenida?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/curso?compra=cancelada`,
    });
    if (!session.url) return Response.json({ error: 'Could not start checkout' }, { status: 500 });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error('checkout failed', e);
    return Response.json({ error: 'Could not start checkout' }, { status: 500 });
  }
}
