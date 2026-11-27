'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAppState } from './AppState';
import { LESSONS } from '@/content/lessons';
import { SIGNS, type Sign } from '@/content/signs';
import { isMember } from '@/lib/plan';
import { isUnlocked } from '@/lib/progress';

export type SignState = 'done' | 'next' | 'open' | 'locked' | 'soon';

/** State of each of the 20 signs for the current variant. */
export function useSignStates(): SignState[] {
  const { progress, variant, account } = useAppState();
  const done = progress[variant].completed;
  const member = isMember(account);
  // Members can open any lesson, so the suggestion is simply the first one not yet done.
  const next = LESSONS.find((l) => !done.includes(l.slug) && (member || (l.access === 'free' && isUnlocked(progress, variant, l.n, LESSONS))));
  return SIGNS.map((s) => {
    const lesson = LESSONS.find((l) => l.n === s.n);
    if (!lesson) return 'soon';
    if (done.includes(lesson.slug)) return 'done';
    if (lesson === next) return 'next';
    if (lesson.access === 'member' && !member) return 'locked';
    return member ? 'open' : 'locked';
  });
}

const STATE_LABEL: Record<SignState, string> = {
  done: 'completada',
  next: 'siguiente lección',
  open: 'disponible',
  locked: 'curso completo',
  soon: 'próximamente',
};

export function SignBadge({ sign, state, size }: { sign: Sign; state?: SignState; size: number }) {
  return (
    <span className={`sign ${state ? `is-${state}` : ''}`} style={{ width: size, height: size }}>
      <Image src={sign.img} alt="" width={size * 2} height={size * 2} sizes={`${size}px`} />
    </span>
  );
}

/** The tonalpohualli as a ring of 20 day-signs; the first 8 are lessons. */
export function SignWheel() {
  const states = useSignStates();
  const { variant, progress, account } = useAppState();
  const member = isMember(account);
  const doneCount = progress[variant].completed.filter((s) => LESSONS.some((l) => l.slug === s)).length;
  const next = LESSONS.find((l) => states[l.n - 1] === 'next');

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <div className="absolute inset-[13%] rounded-full border-[3px] border-ink bg-amate-deep" aria-hidden />
      <div className="absolute inset-[27%] rounded-full border-[3px] border-ink bg-stucco" aria-hidden />
      <ol className="absolute inset-0">
        {SIGNS.map((s, i) => {
          const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
          const lesson = LESSONS.find((l) => l.n === s.n);
          const state = states[i];
          const badge = (
            <span className={`sign is-${state}`} style={{ width: '100%', height: '100%' }}>
              <Image src={s.img} alt="" width={160} height={160} sizes="(max-width: 600px) 12vw, 70px" />
            </span>
          );
          const label = `${s.n}. ${s.nah}, ${s.es}: ${lesson ? `${lesson.title}, ` : ''}${STATE_LABEL[state]}`;
          return (
            <li
              key={s.n}
              className="absolute w-[12.5%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(50 + 43.5 * Math.cos(angle)).toFixed(3)}%`, top: `${(50 + 43.5 * Math.sin(angle)).toFixed(3)}%`, aspectRatio: '1' }}
            >
              {lesson && state !== 'locked' ? (
                <Link href={`/curso/${lesson.slug}`} aria-label={label} title={`${s.nah} · ${lesson.title}`} className="block h-full w-full rounded-[22%]">
                  {badge}
                </Link>
              ) : (
                <span role="img" aria-label={label} title={`${s.nah} · ${STATE_LABEL[state]}`} className="block h-full w-full">
                  {badge}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="absolute inset-[27%] flex flex-col items-center justify-center rounded-full p-3 text-center">
        <p className="display text-[clamp(1.6rem,9vw,3.25rem)] leading-none">{doneCount}<span className="text-[0.55em]"> de 8</span></p>
        <p className="mt-1 text-[clamp(0.7rem,2.6vw,0.95rem)] font-bold leading-tight">signos completados</p>
        {!next && !member && doneCount > 0 && (
          <Link href="/curso#curso-completo" className="btn btn-sm mt-2 max-sm:!min-h-8 max-sm:!px-2 max-sm:!text-xs">
            Ver el curso completo
          </Link>
        )}
        {next && (
          <Link href={`/curso/${next.slug}`} className="btn btn-sm mt-2 max-sm:!min-h-8 max-sm:!px-2 max-sm:!text-xs">
            {doneCount === 0 ? 'Empezar' : 'Continuar'}
          </Link>
        )}
      </div>
    </div>
  );
}
