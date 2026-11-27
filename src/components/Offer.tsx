'use client';
import { useEffect, useState } from 'react';
import { useAppState } from './AppState';
import { SignBadge } from './SignWheel';
import { LESSONS } from '@/content/lessons';
import { SIGNS } from '@/content/signs';
import { track } from '@/lib/analytics';
import { checkoutEnabled, startCheckout } from '@/lib/checkout-client';
import { canBuy, encodePendingPlan, isMember, PENDING_PLAN_KEY, PRICES, type PaidPlan } from '@/lib/plan';

export type OfferContext = 'lesson-end' | 'locked' | 'curso';

const UPCOMING = LESSONS.filter((l) => l.access === 'member');

function PlanCard({
  plan, tag, price, note, cta, busy, onChoose, primary,
}: {
  plan: PaidPlan; tag?: string; price: string; note: string; cta: string; busy: boolean; onChoose: (p: PaidPlan) => void; primary?: boolean;
}) {
  return (
    <div className={`plate flex flex-col p-5 ${primary ? 'bg-maize-soft' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="display text-2xl">{PRICES[plan].label}</h3>
        {tag && <span className="rounded-full border-[3px] border-ink bg-cochineal px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">{tag}</span>}
      </div>
      <p className="mt-2 text-lg font-bold">{price}</p>
      <p className="mt-1 flex-1 text-sm">{note}</p>
      {checkoutEnabled ? (
        <button type="button" className={`btn mt-4 w-full ${primary ? 'btn-red' : 'btn-plain'}`} disabled={busy} onClick={() => onChoose(plan)}>
          {cta}
        </button>
      ) : (
        <span className="btn btn-plain mt-4 w-full" aria-disabled="true">Muy pronto</span>
      )}
    </div>
  );
}

/** The offer to buy the rest of the course. Renders nothing for members. */
export function Offer({ context }: { context: OfferContext }) {
  const { account, openSignIn } = useAppState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const member = isMember(account);

  useEffect(() => {
    track('view_offer', { context });
  }, [context]);

  if (member) return null;

  async function choose(plan: PaidPlan) {
    setError('');
    track('begin_checkout', { plan, value: PRICES[plan].mxn, currency: 'MXN' });
    if (!account) {
      try {
        localStorage.setItem(PENDING_PLAN_KEY, encodePendingPlan(plan, Date.now()));
      } catch {
        // Private mode: the visitor picks the plan again after signing in.
      }
      openSignIn(true);
      return;
    }
    if (!canBuy(account.plan, plan)) return;
    setBusy(true);
    const result = await startCheckout(plan);
    if (result === 'error') setError('No pudimos abrir el pago. Inténtalo de nuevo.');
    if (result === 'already') setError('Ya tienes este plan.');
    setBusy(false);
  }

  return (
    <section id={context === 'curso' ? 'curso-completo' : undefined} className="mx-auto w-full max-w-3xl scroll-mt-24 text-left" aria-labelledby={`offer-${context}`}>
      <h2 id={`offer-${context}`} className="display text-2xl sm:text-3xl">Lecciones 2 a 8 y todas las que vienen (signos 9 al 20)</h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {UPCOMING.map((l) => (
          <li key={l.slug} className="flex items-center gap-3">
            <span className="shrink-0"><SignBadge sign={SIGNS[l.n - 1]} state="locked" size={44} /></span>
            <span className="leading-snug"><strong>{l.n}. {l.title}</strong> · {l.subtitle}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <PlanCard
          plan="lifetime" primary tag="mejor valor" busy={busy} onChoose={choose}
          price={`MXN $${PRICES.lifetime.mxn} · pago único · IVA incluido`}
          note="Una sola vez y es tuyo para siempre, con todas las lecciones nuevas."
          cta="Desbloquear el curso"
        />
        <PlanCard
          plan="monthly" busy={busy} onChoose={choose}
          price={`MXN $${PRICES.monthly.mxn} al mes · IVA incluido`}
          note="Cancela cuando quieras."
          cta="Elegir mensual"
        />
      </div>
      <p role="alert" className="mt-3 min-h-6 font-bold text-cochineal">{error}</p>
      <p className="mt-1 text-sm">Pago seguro con Stripe · tarjeta, Apple Pay, Google Pay</p>
    </section>
  );
}
