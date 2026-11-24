/**
 * How many lessons are open to play. The rest are listed and look like the others, but starting one shows
 * an honest "not open yet, we'll email you" message and records the interest (demand test, from 2026-11-24).
 * The finished lessons 2–8 are still in src/content/lessons: raise this number to open them.
 */
export const RELEASED_LESSONS = 1;

export function isReleased(lessonN: number): boolean {
  return lessonN <= RELEASED_LESSONS;
}
