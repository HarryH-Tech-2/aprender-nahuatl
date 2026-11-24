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
import { canAccess } from '@/lib/access';
import { todayISO } from '@/lib/daily';
import { completeLesson, isUnlocked } from '@/lib/progress';
import { useSessionSeed } from '@/lib/store';
import { pick } from '@/lib/variant';
import { track } from '@/lib/analytics';
import { isReleased } from '@/lib/release';
import { useSignup } from '@/lib/signup-store';
import { LockedLesson, SignupForm } from './SignupGate';

type Feedback = { correct: boolean; answer: string; explain?: string; again: boolean };

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
  const signup = useSignup();
  const [queue, setQueue] = useState(() => lesson.steps.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);

  const sign = SIGNS[lesson.n - 1];
  const exitHref = `/curso/${lesson.slug}`;

  if (!hydrated) return <div className="wrap py-16 text-center font-bold">Cargando la lección…</div>;

  if (score === null && (!isUnlocked(progress, variant, lesson.n, LESSONS) || !canAccess(account, lesson))) {
    const prev = LESSONS.find((l) => l.n === lesson.n - 1);
    return (
      <div className="wrap max-w-xl py-16 text-center">
        <h1 className="text-3xl">Todavía no se abre esta lección</h1>
        <p className="mt-3">Termina primero la lección {lesson.n - 1} en esta variante.</p>
        <Link href={prev ? `/curso/${prev.slug}` : '/curso'} className="btn mt-6">Ir a la lección {lesson.n - 1}</Link>
      </div>
    );
  }

  // Demand test: lessons past the release line take sign-ups instead of playing.
  if (score === null && !isReleased(lesson.n)) return <LockedLesson lesson={lesson} sign={sign} />;
  // Open lessons need a waitlist sign-up first (asked once per device).
  if (score === null && !signup) return <SignupForm lesson={lesson} sign={sign} mode="start" onDone={() => {}} />;

  // ---- finished ----
  if (score !== null) {
    const next = LESSONS.find((l) => l.n === lesson.n + 1);
    const pct = Math.round(score * 100);
    return (
      <div className="wrap max-w-xl py-12 text-center">
        <div className="pop mx-auto w-fit"><SignBadge sign={sign} state="done" size={168} /></div>
        <h1 className="mt-6 text-4xl">¡Cualli! Encendiste {sign.nah}</h1>
        <p className="mt-3 text-lg">
          Terminaste «{lesson.title}» con {pct}% de respuestas correctas al primer intento.
        </p>
        {progress.streak.current > 1 && <p className="mt-1 font-bold">Llevas {progress.streak.current} días seguidos.</p>}
        <div className="mt-7 flex flex-col items-center gap-3">
          {next ? (
            <Link href={`/curso/${next.slug}`} className="btn btn-red">Siguiente: {next.title}</Link>
          ) : (
            <Link href="/juegos" className="btn btn-red">Practicar con juegos</Link>
          )}
          <Link href="/curso" className="font-bold underline underline-offset-4">Ver el curso</Link>
        </div>
        {accountsEnabled && !account && (
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
    setFeedback({ correct, answer: answerText, explain, again: !correct && first });
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
    <div className="wrap min-h-[85dvh] max-w-2xl pb-40 pt-5">
      <div className="flex items-center gap-3">
        <Link href={exitHref} className="font-bold underline underline-offset-4">Salir</Link>
        <div
          role="progressbar" aria-label="Avance de la lección" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={pos}
          className="h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-stucco"
        >
          <div className="h-full bg-jade transition-[width] duration-300" style={{ width: `${(pos / queue.length) * 100}%` }} />
        </div>
        <SignBadge sign={sign} size={40} />
      </div>

      <div key={stepKey} className="mt-8">
        {step.type === 'info' && (
          <article>
            <h1 className="text-3xl sm:text-4xl">{step.title}</h1>
            <RichText text={pick(step.body, variant)} className="mt-4 text-lg" />
            {step.examples && (
              <ul className="plate-flat mt-6 divide-y-2 divide-ink/15">
                {step.examples.map((ex, i) => (
                  <li key={i} className="px-4 py-3">
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
          className={`fixed inset-x-0 bottom-0 z-20 border-t-[3px] border-ink ${feedback.correct ? 'bg-jade-soft' : 'bg-[#f6cfc9]'}`}
        >
          <div className="wrap flex max-w-2xl flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="display text-2xl">
                {feedback.correct ? PRAISE[(seed + pos) % PRAISE.length] : step.type === 'match' ? 'Lo lograste, con algún tropiezo' : 'Casi'}
              </p>
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
