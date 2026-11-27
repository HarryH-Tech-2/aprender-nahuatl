'use client';
import Link from 'next/link';
import { useAppState } from '../AppState';
import { LESSONS } from '@/content/lessons';
import { lessonGate } from '@/lib/access';

/** Start button for a lesson, or a note about what has to be finished first. */
export function LessonStart({ slug, n, minutes }: { slug: string; n: number; minutes: number }) {
  const { progress, variant, hydrated, account } = useAppState();
  const lesson = LESSONS.find((l) => l.n === n);
  const gate = !hydrated || !lesson ? 'loading' : lessonGate({ lesson, account, progress, variant, lessons: LESSONS });
  const done = hydrated && progress[variant].completed.includes(slug);
  const prev = LESSONS.find((l) => l.n === n - 1);

  if (gate === 'finish-previous' && prev) {
    return (
      <div className="mt-6">
        <p className="font-bold">Esta lección se abre cuando termines la lección {prev.n}.</p>
        <Link href={`/curso/${prev.slug}`} className="btn mt-3">Ir a «{prev.title}»</Link>
      </div>
    );
  }
  const label = gate === 'offer' ? 'Desbloquear esta lección' : done ? 'Repetir la lección' : 'Empezar la lección';
  return (
    <div className="mt-6 flex min-h-12 flex-wrap items-center gap-4">
      {gate !== 'loading' && <Link href={`/curso/${slug}/jugar`} className="btn btn-red">{label}</Link>}
      <span className="font-bold">Unos {minutes} minutos.{n === 1 ? ' Gratis.' : ''}</span>
    </div>
  );
}
