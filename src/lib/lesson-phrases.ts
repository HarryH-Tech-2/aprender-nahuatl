import type { Lesson } from '@/content/types';
import { pick, type V } from './variant';

export type LessonPhrase = { central: string; huasteca: string; es: string };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const both = (pieces: V[], sep: string) => ({
  central: cap(pieces.map((p) => pick(p, 'central')).join(sep)),
  huasteca: cap(pieces.map((p) => pick(p, 'huasteca')).join(sep)),
});

/**
 * Example sentences and words a lesson teaches, in both variants, for the lesson's public page: the examples on
 * its explanation cards, the sentences of its "put in order" exercises and the words of its "build" exercises.
 */
export function lessonPhrases(lesson: Lesson, limit = 10): LessonPhrase[] {
  const out: LessonPhrase[] = [];
  const seen = new Set<string>();
  const add = (p: LessonPhrase) => {
    const key = `${p.central}|${p.huasteca}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ central: cap(p.central), huasteca: cap(p.huasteca), es: cap(p.es) });
  };
  for (const s of lesson.steps) {
    if (s.type === 'info') {
      for (const e of s.examples ?? []) add({ central: pick(e.nah, 'central'), huasteca: pick(e.nah, 'huasteca'), es: e.es });
    } else if (s.type === 'order') {
      add({ ...both(s.pieces, ' '), es: cap(s.es) });
    } else if (s.type === 'build') {
      add({ ...both(s.pieces, ''), es: cap(s.es) });
    }
  }
  return out.slice(0, limit);
}
