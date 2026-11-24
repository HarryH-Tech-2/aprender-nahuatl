'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from './AppState';
import { getSupabase } from '@/lib/supabase';

export function SignInDialog() {
  const { signInOpen, openSignIn, accountsEnabled, account } = useAppState();
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const show = accountsEnabled && signInOpen && !account;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (show && !d.open) d.showModal();
    if (!show && d.open) d.close();
  }, [show]);

  if (!accountsEnabled) return null;
  const redirectTo = typeof window === 'undefined' ? undefined : `${window.location.origin}/cuenta`;

  async function withGoogle() {
    await getSupabase()?.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  }
  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const res = await getSupabase()?.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo } });
    setStatus(res && !res.error ? 'sent' : 'error');
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="iniciar-sesion"
      onClose={() => openSignIn(false)}
      className="plate m-auto w-[min(28rem,calc(100vw-2rem))] p-6 backdrop:bg-ink/60"
    >
      <h2 id="iniciar-sesion" className="text-3xl">Guarda tu avance</h2>
      <p className="mt-2">Con una cuenta, tus lecciones y tu racha te siguen en cualquier dispositivo. Es gratis.</p>

      <button type="button" className="btn btn-plain mt-5 w-full" onClick={withGoogle}>Continuar con Google</button>

      <form onSubmit={withEmail} className="mt-5 border-t-[3px] border-ink pt-5">
        <label className="label" htmlFor="correo">O recibe un enlace en tu correo</label>
        <input
          id="correo" type="email" required autoComplete="email" className="field" placeholder="tu@correo.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn mt-3 w-full" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar enlace'}
        </button>
        <p role="status" className="mt-3 min-h-6 text-sm font-bold">
          {status === 'sent' && 'Enlace enviado. Revisa tu correo y ábrelo en este dispositivo.'}
          {status === 'error' && 'No se pudo enviar el enlace. Revisa el correo e inténtalo otra vez.'}
        </p>
      </form>

      <button type="button" className="mt-2 font-bold underline underline-offset-4" onClick={() => openSignIn(false)}>
        Ahora no
      </button>
    </dialog>
  );
}
