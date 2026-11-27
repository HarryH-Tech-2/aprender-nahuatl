import type { PaidPlan } from './plan';
import { getSupabase, supabaseConfigured } from './supabase';

/** Buy buttons show only when the Stripe side is switched on and accounts exist; otherwise "Muy pronto". */
export const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === '1' && supabaseConfigured;

async function postForUrl(path: string, body?: object): Promise<{ status: number; url?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { status: 0 };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return { status: 401 };
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await res.json().catch(() => ({}))) as { url?: unknown };
    return { status: res.status, url: typeof json.url === 'string' ? json.url : undefined };
  } catch {
    return { status: 0 };
  }
}

export async function startCheckout(plan: PaidPlan): Promise<'redirected' | 'error' | 'already'> {
  const res = await postForUrl('/api/checkout', { plan });
  if (res.status === 409) return 'already';
  if (res.status === 200 && res.url) {
    window.location.assign(res.url);
    return 'redirected';
  }
  return 'error';
}

export async function openBillingPortal(): Promise<'redirected' | 'error'> {
  const res = await postForUrl('/api/billing-portal');
  if (res.status === 200 && res.url) {
    window.location.assign(res.url);
    return 'redirected';
  }
  return 'error';
}
