'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAppState } from '../AppState';
import { dailyIndex, todayISO } from '@/lib/daily';
import { dictionary } from '@/lib/dictionary';
import { LESSONS } from '@/content/lessons';
import { pick } from '@/lib/variant';

/** One word from the course each day (changes at midnight, Mexico City time). */
export function WordOfDay({ big = false }: { big?: boolean }) {
  const { variant, hydrated } = useAppState();
  // Single words only: phrases and questions make poor "word of the day" cards.
  const words = useMemo(() => dictionary().filter((w) => !pick(w.nah, 'central').includes(' ')), []);
  const word = hydrated ? words[dailyIndex(todayISO(), words.length)] : null;
  const lesson = word ? LESSONS[word.lesson - 1] : null;

  return (
    <div className={`plate ${big ? 'p-7 sm:p-10' : 'p-5 sm:p-6'}`}>
      <p className="font-bold">Palabra del día</p>
      {word && lesson ? (
        <>
          <p lang="nah" className={`display mt-1 text-cochineal ${big ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`} style={{ overflowWrap: 'anywhere' }}>
            {pick(word.nah, variant)}
          </p>
          <p className={`mt-2 font-bold ${big ? 'text-2xl' : 'text-xl'}`}>{word.es}</p>
          {word.note && <p className="mt-1">{word.note}</p>}
          <p className="mt-4">
            Sale en la lección {lesson.n}:{' '}
            <Link href={`/curso/${lesson.slug}`} className="font-bold underline underline-offset-4">{lesson.title}</Link>
          </p>
        </>
      ) : (
        <p className={`display mt-1 opacity-30 ${big ? 'text-6xl' : 'text-4xl'}`} aria-hidden>…</p>
      )}
    </div>
  );
}
