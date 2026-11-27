'use client';
import { useEffect, useRef } from 'react';
import { useAppState } from './AppState';
import { checkoutEnabled, startCheckout } from '@/lib/checkout-client';
import { canBuy, PENDING_PLAN_KEY, readPendingPlan } from '@/lib/plan';

/** Resumes a purchase the visitor started before signing in: once the plan is known, go on to Checkout. */
export function PendingCheckout() {
  const { account } = useAppState();
  const handled = useRef<string | null>(null);
  const id = account?.id ?? null;
  const loaded = Boolean(account?.planLoaded);
  const plan = account?.plan ?? 'free';

  useEffect(() => {
    if (!id || !loaded || handled.current === id) return;
    handled.current = id;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(PENDING_PLAN_KEY);
      localStorage.removeItem(PENDING_PLAN_KEY);
    } catch {
      return;
    }
    const wanted = readPendingPlan(raw, Date.now());
    if (wanted && checkoutEnabled && canBuy(plan, wanted)) void startCheckout(wanted);
  }, [id, loaded, plan]);

  return null;
}
