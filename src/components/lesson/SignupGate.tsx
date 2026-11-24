'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAppState } from '../AppState';
import { firstInterest, saveSignup, useSignup } from '@/lib/signup-store';
import { track } from '@/lib/analytics';
import type { Sign } from '@/content/signs';
import type { Lesson } from '@/content/types';

type Mode = 'start' | 'locked';

async function post(url: string, body: object): Promise<{ status: number; error?: string }> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { status: res.status, error: data.error };
  } catch {
    return { status: 0 };
  }
}

/**
 * Email sign-up shown before a lesson starts. For lesson 1 it opens the lesson; for a lesson that is not open
 * yet it puts the learner on the list for it. Copy is honest: nobody is told a closed lesson will start.
 */
export function SignupForm({ lesson, sign, mode, onDone }: { lesson: Lesson; sign: Sign; mode: Mode; onDone: () => void }) {
  const { variant } = useAppState();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const source = mode === 'start' ? `leccion-${lesson.n}` : `interes-leccion-${lesson.n}`;
    const res = await post('/api/waitlist', { email, name, variant, source, website });
    // 503 means the database is not connected yet: let the learner in rather than block the course.
    if (res.status === 200 || res.status === 503) {
      const clean = email.trim().toLowerCase();
      saveSignup(clean);
      track('sign_up', { method: 'waitlist', source, variant });
      onDone();
      return;
    }
    setState('error');
    setMessage(res.error ?? 'No pudimos apuntarte. Revisa tu conexión e inténtalo de nuevo.');
  }

  return (
    <div className="wrap max-w-xl py-12">
      <div className="plate overflow-hidden">
        <div aria-hidden className="codex-stripe h-1.5" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="sign h-16 w-16 shrink-0">
              <Image src={sign.img} alt="" width={128} height={128} sizes="64px" priority />
            </span>
            <div>
              <p className="text-sm font-bold text-cochineal">Lección {lesson.n}: {lesson.title}</p>
              <h1 className="text-3xl leading-tight">
                {mode === 'start' ? 'Apúntate y empieza gratis' : 'Apúntate para esta lección'}
              </h1>
            </div>
          </div>
          <p className="mt-4">
            {mode === 'start'
              ? 'Déjanos tu correo para empezar. Es gratis: te escribiremos solo para contarte cuando haya lecciones nuevas.'
              : 'Esta lección todavía no está abierta. Déjanos tu correo y te escribimos en cuanto se abra.'}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="label" htmlFor="su-email">Tu correo</label>
              <input
                id="su-email" type="email" required autoComplete="email" inputMode="email" className="field"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="su-name">Tu nombre <span className="font-normal opacity-70">(opcional)</span></label>
              <input id="su-name" autoComplete="given-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* Hidden from people; bots fill it in. */}
            <div aria-hidden className="absolute -left-[9999px]">
              <label htmlFor="su-web">No llenar</label>
              <input id="su-web" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-red w-full" disabled={state === 'sending' || !email.trim()}>
              {state === 'sending' ? 'Apuntando…' : mode === 'start' ? 'Apuntarme y empezar la lección' : 'Avísenme cuando se abra'}
            </button>
            <p role="alert" className="min-h-6 font-bold text-cochineal">{state === 'error' ? message : ''}</p>
            <p className="text-sm opacity-80">
              Al apuntarte aceptas recibir correos sobre el curso; puedes darte de baja cuando quieras. Lee el{' '}
              <Link href="/privacidad" className="font-bold underline underline-offset-4">aviso de privacidad</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Shown when a signed-up learner starts a lesson that is not open yet. Records their interest once. */
export function LockedLesson({ lesson, sign }: { lesson: Lesson; sign: Sign }) {
  const { variant } = useAppState();
  const signup = useSignup();
  const sent = useRef(false);

  useEffect(() => {
    if (!signup || sent.current) return;
    sent.current = true;
    if (!firstInterest(lesson.n)) return;
    track('lesson_interest', { lesson: lesson.slug, lesson_number: lesson.n, variant });
    void post('/api/waitlist/interest', { email: signup.email, lesson: lesson.n, variant });
  }, [signup, lesson, variant]);

  if (!signup) return <SignupForm lesson={lesson} sign={sign} mode="locked" onDone={() => {}} />;

  return (
    <div className="wrap max-w-xl py-14 text-center">
      <span className="sign pop mx-auto block h-36 w-36">
        <Image src={sign.img} alt="" width={288} height={288} sizes="144px" priority />
      </span>
      <h1 className="mt-6 text-4xl">¡Qué bueno que quieres seguir!</h1>
      <p className="mt-4 text-lg">
        La lección {lesson.n}, «{lesson.title}», todavía no está abierta. Ya estás en la lista: te escribiremos a <strong>{signup.email}</strong> en cuanto se abra.
      </p>
      <p className="mt-3">Mientras tanto, repasa lo que ya aprendiste.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/juegos" className="btn btn-red">Repasar con juegos</Link>
        <Link href="/frases" className="btn btn-plain">Ver frases en náhuatl</Link>
      </div>
    </div>
  );
}
