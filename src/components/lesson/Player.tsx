'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppState } from '../AppState';
import { Nah, RichText } from '../Nah';
import { SignBadge } from '../SignWheel';
import { ChoiceExercise, MatchExercise, TilesExercise, TypeExercise } from './Exercises';
import { LESSONS } from '@/content/lessons';
import { SIGNS } from '@/content/signs';
import type { Lesson } from '@/content/types';
import { lessonGate } from '@/lib/access';
import { todayISO } from '@/lib/daily';
import { completeLesson } from '@/lib/progress';
import { useSessionSeed } from '@/lib/store';
import { pick } from '@/lib/variant';
import { track } from '@/lib/analytics';
import { Offer } from '../Offer';
import { Burst, CacaoIcon, CountUp } from './Fx';

type Feedback = { correct: boolean; answer: string; explain?: string; again: boolean; gain: number; combo: number };

const PRAISE = ['¡Cualli!', '¡Órale, muy bien!', '¡Eso!', '¡Cualli, así se hace!'];

/**
 * The lesson starts over on every fresh visit (Next keeps recently visited pages mounted, which would
 * otherwise bring back a finished lesson) and whenever the variant changes.
 */
export function Player({ lesson }: { lesson: Lesson }) {
  const { variant } = useAppState();
  const { bfcacheId } = useRouter();
  return <LessonRun key={`${bfcacheId}-${variant}`} lesson={lesson} />;
}

function LessonRun({ lesson }: { lesson: Lesson }) {
  const { progress, variant, hydrated, update, account, accountsEnabled, openSignIn } = useAppState();
  // Order of the answer options: different on every visit, stable while you play.
  const seed = useSessionSeed() + lesson.n * 1000;
  const [queue, setQueue] = useState(() => lesson.steps.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  // Session-only game layer: cacao beans as points and a streak of right answers.
  const [cacao, setCacao] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const sign = SIGNS[lesson.n - 1];
  const exitHref = `/curso/${lesson.slug}`;

  if (!hydrated) return <div className="wrap py-16 text-center font-bold">Cargando la lección…</div>;

  const gate = lessonGate({ lesson, account, progress, variant, lessons: LESSONS });

  if (score === null && gate === 'loading') return <div className="wrap py-16 text-center font-bold">Cargando la lección…</div>;

  if (score === null && gate === 'offer') {
    return (
      <div className="wrap max-w-3xl py-12 text-center">
        <h1 className="text-3xl sm:text-4xl">Sigue con el curso completo</h1>
        <p className="mb-8 mt-3">«{lesson.title}» es parte del curso completo. La lección 1 sigue siendo gratis.</p>
        <Offer context="locked" />
      </div>
    );
  }

  if (score === null && gate === 'finish-previous') {
    const prev = LESSONS.find((l) => l.n === lesson.n - 1);
    return (
      <div className="wrap max-w-xl py-16 text-center">
        <h1 className="text-3xl">Todavía no se abre esta lección</h1>
        <p className="mt-3">Termina primero la lección {lesson.n - 1} en esta variante.</p>
        <Link href={prev ? `/curso/${prev.slug}` : '/curso'} className="btn mt-6">Ir a la lección {lesson.n - 1}</Link>
      </div>
    );
  }

  // ---- finished ----
  if (score !== null) {
    const next = LESSONS.find((l) => l.n === lesson.n + 1);
    const pct = Math.round(score * 100);
    const nextNeedsOffer = next ? lessonGate({ lesson: next, account, progress, variant, lessons: LESSONS }) === 'offer' : false;
    return (
      <div className={`wrap py-12 text-center ${nextNeedsOffer ? 'max-w-3xl' : 'max-w-xl'}`}>
        <div className="relative mx-auto w-fit">
          <div className="pop"><SignBadge sign={sign} state="done" size={168} /></div>
          <div className="absolute left-1/2 top-1/2"><Burst pieces={36} spread={220} /></div>
        </div>
        <h1 className="rise mt-6 text-4xl" style={{ animationDelay: '250ms' }}>¡Cualli! Encendiste {sign.nah}</h1>
        <p className="rise mt-3 text-lg" style={{ animationDelay: '350ms' }}>
          Terminaste «{lesson.title}» con {pct}% de respuestas correctas al primer intento.
        </p>
        <div className="mt-7 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Cacao ganado', value: <span className="inline-flex items-center gap-1.5"><CacaoIcon size={24} /><CountUp value={cacao} /></span> },
            { label: 'Al primer intento', value: <><CountUp value={pct} />%</> },
            { label: 'Mejor racha', value: <>×<CountUp value={bestCombo} /></> },
          ].map((s, i) => (
            <div key={s.label} className="plate rise px-2 py-4" style={{ animationDelay: `${500 + i * 140}ms` }}>
              <p className="display text-3xl">{s.value}</p>
              <p className="mt-1 text-sm font-bold">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="rise mt-4 text-sm opacity-75" style={{ animationDelay: '950ms' }}>
          Los mexicas usaban granos de cacao como moneda.
        </p>
        {progress.streak.current > 1 && <p className="mt-1 font-bold">Llevas {progress.streak.current} días seguidos.</p>}
        {nextNeedsOffer && (
          <div className="mt-10">
            <Offer context="lesson-end" />
          </div>
        )}
        <div className="mt-7 flex flex-col items-center gap-3">
          {nextNeedsOffer ? null : next ? (
            <Link href={`/curso/${next.slug}`} className="btn btn-red">Siguiente: {next.title}</Link>
          ) : (
            <Link href="/juegos" className="btn btn-red">Practicar con juegos</Link>
          )}
          <Link href="/curso" className="font-bold underline underline-offset-4">Ver el curso</Link>
        </div>
        {accountsEnabled && !account && !nextNeedsOffer && (
          <div className="plate mt-10 p-5 text-left">
            <p className="display text-xl">No pierdas tu avance</p>
            <p className="mt-1">Ahora mismo solo está guardado en este navegador. Con una cuenta gratuita te sigue a donde vayas.</p>
            <button type="button" className="btn mt-4" onClick={() => openSignIn(true)}>Crear cuenta gratis</button>
          </div>
        )}
      </div>
    );
  }

  // ---- playing ----
  const idx = queue[pos];
  const step = lesson.steps[idx];
  const stepKey = `${pos}-${idx}`;

  function answer(correct: boolean, answerText: string) {
    const first = !(idx in firstTry);
    if (first) setFirstTry((f) => ({ ...f, [idx]: correct }));
    if (!correct && first) setQueue((q) => [...q, idx]); // one more try at the end
    const explain = 'explain' in step && step.explain ? pick(step.explain, variant) : undefined;
    // First-try answers earn 10 beans plus a streak bonus; a right retry still earns 5.
    const streak = correct ? combo + 1 : 0;
    const gain = !correct ? 0 : first ? 10 + Math.min(combo, 4) * 2 : 5;
    setCombo(streak);
    setBestCombo((b) => Math.max(b, streak));
    setCacao((c) => c + gain);
    setFeedback({ correct, answer: answerText, explain, again: !correct && first, gain, combo: streak });
  }

  function next() {
    setFeedback(null);
    if (pos + 1 < queue.length) {
      setPos(pos + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const graded = lesson.steps.map((s, i) => ({ s, i })).filter(({ s }) => s.type !== 'info');
    const right = graded.filter(({ i }) => firstTry[i]).length;
    const result = graded.length ? right / graded.length : 1;
    update((p) => completeLesson(p, variant, lesson.slug, result, todayISO()));
    track('lesson_complete', { lesson: lesson.slug, lesson_number: lesson.n, variant, score: Math.round(result * 100) });
    setScore(result);
    window.scrollTo({ top: 0 });
  }

  const common = { variant, seed: seed + pos * 31, locked: feedback !== null, onAnswer: answer };

  return (
    <div className="wrap min-h-[85dvh] max-w-3xl pb-40 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="shrink-0 -rotate-2 rounded-lg border-[3px] border-ink bg-maize px-2.5 py-0.5 text-sm font-bold shadow-[3px_3px_0_var(--color-ink)]">
          Lección {lesson.n}
        </span>
        <span className="display truncate text-xl sm:text-2xl">{lesson.title}</span>
        <Footprints done={pos} total={queue.length} />
        <span
          key={cacao} aria-label={`${cacao} granos de cacao`}
          className={`${cacao ? 'bump' : ''} ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border-[3px] border-ink bg-stucco px-2.5 py-0.5 font-bold shadow-[2px_2px_0_var(--color-ink)] sm:ml-0`}
        >
          <CacaoIcon /> {cacao}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href={exitHref} className="font-bold underline underline-offset-4">Salir</Link>
        <div
          role="progressbar" aria-label="Avance de la lección" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={pos}
          className="h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-stucco"
        >
          <div className="progress-fill h-full bg-jade transition-[width] duration-500 ease-out" style={{ width: `${(pos / queue.length) * 100}%` }} />
        </div>
        <SignBadge sign={sign} size={40} />
      </div>

      <div key={stepKey} className="mt-8">
        {step.type === 'info' && (
          <article className="stagger">
            <h1 className="text-3xl sm:text-4xl">{step.title}</h1>
            <RichText text={pick(step.body, variant)} className="mt-4 text-lg" />
            {step.examples && (
              <ul className="plate-flat stagger mt-6 divide-y-2 divide-ink/15">
                {step.examples.map((ex, i) => (
                  <li key={i} className="px-4 py-3 transition-colors hover:bg-maize-soft/60">
                    <Nah v={ex.nah} className="nah block text-xl" />
                    <span>{ex.es}</span>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn btn-red mt-8 w-full sm:w-auto" onClick={next}>Continuar</button>
          </article>
        )}
        {(step.type === 'choice' || step.type === 'blank') && <ChoiceExercise step={step} {...common} />}
        {step.type === 'match' && <MatchExercise step={step} {...common} />}
        {(step.type === 'build' || step.type === 'order') && <TilesExercise step={step} {...common} />}
        {step.type === 'type' && <TypeExercise step={step} {...common} />}
      </div>

      {feedback && (
        <div
          role="status"
          className={`sheet-up fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-ink ${feedback.correct ? 'bg-jade-soft' : 'bg-[#f6cfc9]'}`}
        >
          {feedback.correct && <div className="absolute left-1/2 top-0"><Burst /></div>}
          <div className="wrap flex max-w-3xl flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className={`display text-2xl ${feedback.correct ? 'pop' : 'wobble'}`}>
                  {feedback.correct ? PRAISE[(seed + pos) % PRAISE.length] : step.type === 'match' ? 'Lo lograste, con algún tropiezo' : 'Casi'}
                </p>
                {feedback.gain > 0 && (
                  <span className="float-gain inline-flex items-center gap-1 font-bold text-jade">
                    +{feedback.gain} <CacaoIcon size={16} />
                  </span>
                )}
                {feedback.combo >= 2 && (
                  <span className="pop rounded-full border-2 border-ink bg-maize px-2 py-0.5 text-sm font-bold" style={{ animationDelay: '150ms' }}>
                    Racha ×{feedback.combo}
                  </span>
                )}
              </div>
              {!feedback.correct && feedback.answer && (
                <p className="mt-0.5">Respuesta correcta: <strong lang="nah">{feedback.answer}</strong></p>
              )}
              {feedback.explain && <p className="mt-0.5">{feedback.explain}</p>}
              {feedback.again && <p className="mt-0.5 text-sm">La verás otra vez al final.</p>}
            </div>
            <button type="button" autoFocus className="btn btn-red" onClick={next}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * A codex footprint trail (the painted sign for a journey): one print per slice of the lesson,
 * inked in as you go. Decorative: the progress bar below carries the real value.
 */
function Footprints({ done, total }: { done: number; total: number }) {
  const prints = 9;
  // The first print is always inked: you have already set out.
  const filled = total ? Math.max(1, Math.round((done / total) * prints)) : 1;
  return (
    <div aria-hidden className="ml-auto hidden shrink-0 items-center gap-3 pr-1 sm:flex">
      {Array.from({ length: prints }, (_, i) => (
        <svg
          key={i === filled - 1 ? `${i}-${filled}` : i} viewBox="0 0 16 24" width="17" height="26"
          className={`transition-colors duration-300 ${i < filled ? 'text-ink' : 'text-ink/25'} ${i === filled - 1 && filled > 1 ? 'hop' : ''}`}
          style={{ transform: `translateY(${i % 2 ? 5 : -5}px) rotate(${i % 2 ? 100 : 80}deg)` }}
        >
          <g fill="currentColor">
            <path d="M8 7c4 0 5.5 4 5 9-.4 4-2.4 7-5 7s-4.6-3-5-7c-.5-5 1-9 5-9z" />
            <circle cx="3.2" cy="4.6" r="1.5" />
            <circle cx="6" cy="2.4" r="1.6" />
            <circle cx="9.4" cy="2.2" r="1.7" />
            <circle cx="12.6" cy="4" r="1.6" />
          </g>
        </svg>
      ))}
    </div>
  );
}
