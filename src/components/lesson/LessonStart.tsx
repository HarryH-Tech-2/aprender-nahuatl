'use client';
import Link from 'next/link';
import { useAppState } from '../AppState';
import { LESSONS } from '@/content/lessons';
import { isUnlocked } from '@/lib/progress';

/** Start button for a lesson, or a note about what has to be finished first. */
export function LessonStart({ slug, n, minutes }: { slug: string; n: number; minutes: number }) {
  const { progress, variant, hydrated } = useAppState();
  const open = !hydrated || isUnlocked(progress, variant, n, LESSONS);
  const done = hydrated && progress[variant].completed.includes(slug);
  const prev = LESSONS.find((l) => l.n === n - 1);

  if (!open && prev) {
    return (
      <div className="mt-6">
        <p className="font-bold">Esta lección se abre cuando termines la lección {prev.n}.</p>
        <Link href={`/curso/${prev.slug}`} className="btn mt-3">Ir a «{prev.title}»</Link>
      </div>
    );
  }
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <Link href={`/curso/${slug}/jugar`} className="btn btn-red">{done ? 'Repetir la lección' : 'Empezar la lección'}</Link>
      <span className="font-bold">Unos {minutes} minutos.{n === 1 ? ' Gratis.' : ''}</span>
    </div>
  );
}
