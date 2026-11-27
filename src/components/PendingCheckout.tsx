'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from './AppState';
import { checkoutEnabled, startCheckout } from '@/lib/checkout-client';
import { canBuy, PENDING_PLAN_KEY, readPendingPlan } from '@/lib/plan';

/** Resumes a purchase the visitor started before signing in: once the plan is known, go on to Checkout. */
export function PendingCheckout() {
  const { account } = useAppState();
  const handled = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
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
    if (wanted && checkoutEnabled && canBuy(plan, wanted)) void startCheckout(wanted).then((r) => { if (r === 'error') setFailed(true); });
  }, [id, loaded, plan]);

  if (!failed) return null;
  return (
    <div role="alert" className="plate fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center gap-3 p-4">
      <p className="flex-1 font-bold">No pudimos abrir el pago. Inténtalo de nuevo.</p>
      <button type="button" className="btn btn-sm btn-plain" onClick={() => setFailed(false)}>Cerrar</button>
    </div>
  );
}
