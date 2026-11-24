/** Lower-case, strip accents and punctuation, collapse spaces. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrect(given: string, accepted: string[]): boolean {
  const g = normalize(given);
  return g !== '' && accepted.some((a) => normalize(a) === g);
}
