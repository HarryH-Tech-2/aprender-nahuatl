'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from '@/components/AppState';
import { LESSONS } from '@/content/lessons';
import { track } from '@/lib/analytics';
import { isMember, PRICES } from '@/lib/plan';

const POLL_MS = 2000;
const GIVE_UP_MS = 30_000;

/** Waits for the webhook to grant the plan (the return URL alone proves nothing), then opens the course. */
export function Welcome() {
  const { account, hydrated, refreshAccount, progress, variant, accountsEnabled, openSignIn } = useAppState();
  const [timedOut, setTimedOut] = useState(false);
  const member = isMember(account);
  const signedIn = Boolean(account);
  const plan = account?.plan ?? 'free';
  const tracked = useRef(false);

  useEffect(() => {
    if (!signedIn || member) return;
    const started = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - started >= GIVE_UP_MS) {
        clearInterval(timer);
        setTimedOut(true);
        return;
      }
      void refreshAccount();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [signedIn, member, refreshAccount]);

  useEffect(() => {
    if (!member || plan === 'free' || tracked.current) return;
    tracked.current = true;
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) return;
    const key = `an.purchase.${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Without sessionStorage a reload may count the purchase twice; still better than losing it.
    }
    track('purchase', { plan, value: PRICES[plan].mxn, currency: 'MXN', transaction_id: sessionId });
  }, [member, plan]);

  if (!hydrated) return <p className="font-bold">Cargando…</p>;

  if (!account) {
    return (
      <>
        <h1 className="text-3xl sm:text-4xl">Inicia sesión para ver tu curso</h1>
        <p className="mt-3">Entra con la misma cuenta con la que pagaste y se abrirá el curso completo.</p>
        {accountsEnabled && <button type="button" className="btn btn-red mt-6" onClick={() => openSignIn(true)}>Iniciar sesión</button>}
      </>
    );
  }

  if (member) {
    const done = progress[variant].completed;
    const target = LESSONS.find((l) => l.n >= 2 && !done.includes(l.slug));
    return (
      <>
        <h1 className="text-3xl sm:text-4xl">¡Bienvenida, bienvenido al curso completo!</h1>
        <p className="mt-3 text-lg">Tu pago quedó confirmado. Ya puedes abrir todas las lecciones.</p>
        <Link href={target ? `/curso/${target.slug}` : '/curso'} className="btn btn-red mt-6">
          {target ? `Empezar la lección ${target.n}: ${target.title}` : 'Ir al curso'}
        </Link>
      </>
    );
  }

  if (timedOut) {
    return (
      <>
        <h1 className="text-3xl sm:text-4xl">Tu pago se está confirmando</h1>
        <p className="mt-3 text-lg">
          Tu pago se está confirmando. Recarga esta página en un minuto; si no se abre el curso,{' '}
          <Link href="/contacto" className="font-bold underline underline-offset-4">escríbenos</Link>.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Confirmando tu pago…</h1>
      <p role="status" className="mt-3 text-lg">Esto tarda unos segundos.</p>
    </>
  );
}
