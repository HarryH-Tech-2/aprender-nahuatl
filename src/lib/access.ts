import { isMember } from './plan';
import { isUnlocked, type Progress } from './progress';
import type { Variant } from './variant';

/** The single gate for lesson access: free lessons are open, member lessons need a paid plan. */
export function canAccess(profile: { plan: string } | null, lesson: { access: 'free' | 'member' }): boolean {
  if (lesson.access === 'free') return true;
  return isMember(profile);
}

export type Gate = 'loading' | 'play' | 'offer' | 'finish-previous';

/** What the lesson page should show. Members skip the lesson chain; free lessons never wait on the plan. */
export function lessonGate(args: {
  lesson: { n: number; access: 'free' | 'member' };
  account: { plan: string; planLoaded: boolean } | null;
  progress: Progress;
  variant: Variant;
  lessons: { n: number; slug: string }[];
}): Gate {
  const { lesson, account, progress, variant, lessons } = args;
  if (lesson.access === 'free') {
    return isUnlocked(progress, variant, lesson.n, lessons) ? 'play' : 'finish-previous';
  }
  if (!account) return 'offer';
  if (!account.planLoaded) return 'loading';
  return isMember(account) ? 'play' : 'offer';
}
