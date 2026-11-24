import { LESSONS } from '@/content/lessons';
import type { Word } from '@/content/types';

export type DictionaryEntry = Word & { lesson: number };

/** Every word taught in the course, once each (first lesson wins), in lesson order. */
export function dictionary(): DictionaryEntry[] {
  const seen = new Set<string>();
  const out: DictionaryEntry[] = [];
  for (const l of LESSONS) {
    for (const word of l.vocab) {
      if (seen.has(word.id)) continue;
      seen.add(word.id);
      out.push({ ...word, lesson: l.n });
    }
  }
  return out;
}

/** Words from the given lessons (by slug), falling back to lesson 1 when none are completed. */
export function vocabFor(completedSlugs: string[]): Word[] {
  const lessons = LESSONS.filter((l) => completedSlugs.includes(l.slug));
  const pool = (lessons.length ? lessons : [LESSONS[0]]).flatMap((l) => l.vocab);
  const seen = new Set<string>();
  return pool.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
}
