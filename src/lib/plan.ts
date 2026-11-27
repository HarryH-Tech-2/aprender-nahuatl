export type Plan = 'free' | 'monthly' | 'lifetime';
export type PaidPlan = 'monthly' | 'lifetime';

export const PRICES: Record<PaidPlan, { mxn: number; label: string }> = {
  monthly: { mxn: 89, label: 'Mensual' },
  lifetime: { mxn: 299, label: 'De por vida' },
};

export function parsePlan(x: unknown): Plan {
  return x === 'monthly' || x === 'lifetime' ? x : 'free';
}

export function isMember(profile: { plan: string } | null): boolean {
  return !!profile && parsePlan(profile.plan) !== 'free';
}

/** A free account can buy either plan; monthly can upgrade to lifetime; nothing else. */
export function canBuy(current: Plan, wanted: PaidPlan): boolean {
  if (current === 'free') return true;
  return current === 'monthly' && wanted === 'lifetime';
}

/** The plan a visitor picked before signing in, remembered briefly so checkout can resume. */
export const PENDING_PLAN_KEY = 'an.pendingPlan.v1';
const PENDING_TTL_MS = 30 * 60_000;

export function encodePendingPlan(plan: PaidPlan, now: number): string {
  return JSON.stringify({ plan, at: now });
}

export function readPendingPlan(raw: string | null, now: number): PaidPlan | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (typeof v !== 'object' || v === null) return null;
    const { plan, at } = v as { plan?: unknown; at?: unknown };
    if (plan !== 'monthly' && plan !== 'lifetime') return null;
    if (typeof at !== 'number' || !Number.isFinite(at) || now - at > PENDING_TTL_MS) return null;
    return plan;
  } catch {
    return null;
  }
}
