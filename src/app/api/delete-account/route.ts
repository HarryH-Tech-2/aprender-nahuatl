import { userFromRequest } from '@/lib/auth-server';
import { getStripe } from '@/lib/stripe';
import { cancelSubscriptionTolerant } from '@/lib/stripe-cancel';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Deletes the caller's own account. The caller proves who they are with their session token. */
export async function POST(request: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: 'Accounts are not configured' }, { status: 503 });

  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  // A live subscription would keep billing a deleted account: cancel it first, and stop if that fails.
  const { data: profile, error: readError } = await admin
    .from('profiles')
    .select('stripe_subscription_id')
    .eq('id', user.id)
    .maybeSingle();
  if (readError) return Response.json({ error: 'Could not delete the account' }, { status: 500 });
  const subscriptionId = profile?.stripe_subscription_id as string | null | undefined;
  if (subscriptionId) {
    const stripe = getStripe();
    if (stripe && !(await cancelSubscriptionTolerant(stripe, subscriptionId))) {
      return Response.json({ error: 'Could not cancel the subscription' }, { status: 500 });
    }
  }

  // The profiles row goes with it (on delete cascade).
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) return Response.json({ error: 'Could not delete the account' }, { status: 500 });
  return Response.json({ ok: true });
}
