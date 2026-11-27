'use client';
import Link from 'next/link';
import { SignBadge, useSignStates } from './SignWheel';
import { LESSONS } from '@/content/lessons';
import { SIGNS } from '@/content/signs';

/** The eight lessons as a list, with each one's state for the current variant. */
export function LessonList() {
  const states = useSignStates();
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {LESSONS.map((l) => {
        const state = states[l.n - 1];
        const sign = SIGNS[l.n - 1];
        const locked = state === 'locked';
        const memberOnly = l.access === 'member';
        const inner = (
          <>
            <SignBadge sign={sign} state={state} size={76} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-cochineal">
                Signo {l.n}: {sign.nah}, {sign.es.toLowerCase()}
              </span>
              <span className="display block text-xl leading-tight">{l.title}</span>
              <span className="mt-1 block text-[0.95rem] leading-snug">{l.subtitle}</span>
              <span className="mt-1.5 block text-sm font-bold">
                {state === 'done' && <span className="text-jade">Completada ✓</span>}
                {state === 'next' && <span>Unos {l.minutes} minutos</span>}
                {state === 'open' && <span>Disponible · unos {l.minutes} minutos</span>}
                {locked && <span className="opacity-70">{memberOnly ? 'Parte del curso completo' : `Se abre al terminar la lección ${l.n - 1}`}</span>}
              </span>
            </span>
          </>
        );
        return (
          <li key={l.slug}>
            {locked && !memberOnly ? (
              <div className="plate-flat flex h-full items-center gap-4 p-4 opacity-80">{inner}</div>
            ) : (
              <Link href={`/curso/${l.slug}`} className="plate flex h-full items-center gap-4 p-4 hover:bg-maize-soft">
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
