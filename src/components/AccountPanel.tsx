'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAppState } from './AppState';
import { VariantSwitch } from './Header';
import { LESSONS } from '@/content/lessons';
import { todayISO } from '@/lib/daily';
import { liveStreak } from '@/lib/progress';
import { openBillingPortal, startCheckout, checkoutEnabled } from '@/lib/checkout-client';
import { PRICES } from '@/lib/plan';
import { getSupabase } from '@/lib/supabase';
import { VARIANT_NAMES, VARIANTS } from '@/lib/variant';

export function AccountPanel() {
  const { hydrated, accountsEnabled, account, progress, signOut, openSignIn, syncFailed, retrySync } = useAppState();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState('');

  if (!hydrated) return <p className="font-bold">Cargando…</p>;

  async function deleteAccount() {
    setStatus('Borrando tu cuenta…');
    const session = (await getSupabase()?.auth.getSession())?.data.session;
    const res = session
      ? await fetch('/api/delete-account', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } })
      : null;
    if (!res?.ok) {
      setStatus('No se pudo borrar la cuenta. Inténtalo de nuevo o escríbenos.');
      return;
    }
    await signOut(false);
    setConfirming(false);
    setStatus('Tu cuenta y tu avance se borraron.');
  }

  async function portal() {
    setStatus('');
    if ((await openBillingPortal()) === 'error') setStatus('No pudimos abrir la gestión de tu suscripción. Inténtalo de nuevo.');
  }

  async function upgrade() {
    setStatus('');
    const r = await startCheckout('lifetime');
    if (r === 'error') setStatus('No pudimos abrir el pago. Inténtalo de nuevo.');
    if (r === 'already') setStatus('Ya tienes este plan.');
  }

  const streak = liveStreak(progress.streak, todayISO());

  return (
    <div className="space-y-8">
      <section className="plate p-5">
        {account ? (
          <>
            <p className="text-lg">Sesión iniciada como <strong>{account.name ?? account.email}</strong></p>
            {account.name && account.email && <p className="text-sm">{account.email}</p>}
            {syncFailed ? (
              <p className="mt-2 font-bold text-cochineal">
                No se pudo guardar tu avance en tu cuenta. Sigue guardado en este navegador.{' '}
                <button type="button" className="underline" onClick={retrySync}>Reintentar</button>
              </p>
            ) : (
              <p className="mt-2">Tu avance se guarda en tu cuenta y te sigue en cualquier dispositivo.</p>
            )}
            <p className="mt-3 font-bold">
              Plan: {!account.planLoaded ? '…' : account.plan === 'free' ? 'Gratis' : PRICES[account.plan].label}
            </p>
            {account.planLoaded && account.plan === 'free' && (
              <p className="mt-1"><Link href="/curso#curso-completo" className="font-bold underline underline-offset-4">Desbloquea el curso completo</Link></p>
            )}
            {account.plan === 'lifetime' && <p className="mt-1">Tienes el curso completo para siempre.</p>}
            {account.plan === 'monthly' && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-sm" onClick={() => void portal()}>Gestionar suscripción</button>
                  {checkoutEnabled && (
                    <button type="button" className="btn btn-sm btn-red" onClick={() => void upgrade()}>
                      Pásate a de por vida — MXN ${PRICES.lifetime.mxn}
                    </button>
                  )}
                </div>
                {checkoutEnabled && <p className="mt-2 text-sm">Tu plan mensual se cancela al instante; los meses ya pagados no se reembolsan.</p>}
              </div>
            )}
            <button
              type="button" className="btn btn-plain mt-4"
              onClick={async () => { if (!(await signOut())) setStatus('No se pudo cerrar la sesión. Inténtalo de nuevo.'); }}
            >
              Cerrar sesión
            </button>
          </>
        ) : accountsEnabled ? (
          <>
            <p className="text-lg font-bold">No has iniciado sesión</p>
            <p className="mt-1">Tu avance está guardado solo en este navegador. Con una cuenta gratuita no lo pierdes si cambias de dispositivo.</p>
            <button type="button" className="btn mt-4" onClick={() => openSignIn(true)}>Crear cuenta o iniciar sesión</button>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">Las cuentas todavía no están activas</p>
            <p className="mt-1">Por ahora tu avance se guarda en este navegador. Si borras los datos del navegador, se pierde.</p>
          </>
        )}
        <p role="status" className="mt-3 min-h-6 font-bold">{status}</p>
      </section>

      <section>
        <h2 className="text-2xl">Tu avance</h2>
        <p className="mt-2 font-bold">
          {streak > 0 ? `Racha: ${streak} ${streak === 1 ? 'día' : 'días'} seguidos.` : 'Todavía no tienes racha: termina una lección hoy.'}
          {progress.streak.longest > 1 && ` Tu mejor racha: ${progress.streak.longest} días.`}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {VARIANTS.map((v) => {
            const done = LESSONS.filter((l) => progress[v].completed.includes(l.slug));
            return (
              <div key={v} className="plate-flat p-4">
                <p className="display text-xl">{VARIANT_NAMES[v]}</p>
                <p className="mt-1">{done.length} de {LESSONS.length} lecciones</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {done.map((l) => (
                    <li key={l.slug}>
                      {l.n}. {l.title}: {Math.round((progress[v].best[l.slug] ?? 0) * 100)}%
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="font-bold">Variante que estás aprendiendo:</span>
          <VariantSwitch />
          <Link href="/curso" className="btn btn-sm">Ir al curso</Link>
        </div>
      </section>

      {account && (
        <section className="border-t-[3px] border-ink pt-6">
          <h2 className="text-2xl">Borrar mi cuenta</h2>
          <p className="mt-2">Se borran tu cuenta y todo tu avance, aquí y en nuestros servidores. No se puede deshacer.</p>
          {account.plan === 'monthly' && <p className="mt-2 font-bold">Tu suscripción mensual se cancela y no se reembolsa el periodo en curso.</p>}
          {account.plan === 'lifetime' && <p className="mt-2 font-bold">Perderás el acceso de por vida al curso completo; no se reembolsa.</p>}
          {confirming ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="btn btn-red" onClick={() => void deleteAccount()}>Sí, borrar mi cuenta</button>
              <button type="button" className="btn btn-plain" onClick={() => setConfirming(false)}>Cancelar</button>
            </div>
          ) : (
            <button type="button" className="btn btn-plain mt-4" onClick={() => setConfirming(true)}>Borrar mi cuenta</button>
          )}
        </section>
      )}
    </div>
  );
}
