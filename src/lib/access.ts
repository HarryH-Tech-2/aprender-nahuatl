/** The single gate for lesson access. Everything is free in v1; paid plans later change only this. */
export function canAccess(profile: { plan: string } | null, lesson: { access: 'free' | 'member' }): boolean {
  if (lesson.access === 'free') return true;
  return profile?.plan === 'member';
}
