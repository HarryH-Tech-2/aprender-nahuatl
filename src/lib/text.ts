/**
 * Shorten text for a meta description or snippet without cutting a word in half.
 * Keeps as many whole sentences as fit when that uses at least half the room; otherwise cuts at the last space
 * and adds an ellipsis. The result is never longer than `max`.
 */
export function clipText(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;

  // Whole sentences: the last ". ", "! " or "? " (or closing quote/guillemet after it) that fits.
  let sentenceEnd = -1;
  const re = /[.!?][»”"')]?(?=\s)/g;
  for (let m = re.exec(t); m && m.index + m[0].length <= max; m = re.exec(t)) sentenceEnd = m.index + m[0].length;
  if (sentenceEnd >= max / 2) return t.slice(0, sentenceEnd);

  const cut = t.lastIndexOf(' ', max - 1);
  const head = (cut > 0 ? t.slice(0, cut) : t.slice(0, max - 1)).replace(/[\s,;:—–-]+$/, '');
  return `${head}…`;
}
