import { userFromRequest } from '@/lib/auth-server';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Opens the Stripe billing portal for the signed-in learner. */
export async function POST(request: Request) {
  const stripe = getStripe();
  const admin = getSupabaseAdmin();
  if (!stripe || !admin) return Response.json({ error: 'Billing is not configured' }, { status: 503 });

  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  const { data: profile } = await admin.from('profiles').select('stripe_customer_id').eq('id', user.id).maybeSingle();
  const customer = profile?.stripe_customer_id;
  if (!customer) return Response.json({ error: 'No billing account' }, { status: 404 });

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${new URL(request.url).origin}/cuenta`,
      locale: 'es-419',
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error('billing portal failed', e);
    return Response.json({ error: 'Could not open the billing portal' }, { status: 500 });
  }
}
