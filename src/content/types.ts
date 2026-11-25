import type { V } from '@/lib/variant';

export type Word = { id: string; nah: V; es: string; note?: string; audio?: string };
export type Example = { nah: V; es: string };

export type Step =
  /** Explanation card. `body` paragraphs are separated by blank lines; *word* marks Nahuatl. */
  | { type: 'info'; title: string; body: V; examples?: Example[] }
  /** Multiple choice. `nah` is an optional Nahuatl word or sentence shown large above the options. */
  | { type: 'choice'; prompt: string; nah?: V; options: V[]; answer: number; explain?: V }
  /** Match Nahuatl to Spanish. */
  | { type: 'match'; pairs: Example[] }
  /** Build one word from tiles. `pieces` are in the correct order; `extra` are decoys. */
  | { type: 'build'; prompt: string; es: string; pieces: V[]; extra?: V[]; explain?: V; accept?: V[] }
  /** Put words in order. `pieces` are in the correct order; `extra` are decoys. */
  | { type: 'order'; prompt: string; es: string; pieces: V[]; extra?: V[]; explain?: V; accept?: V[] }
  /** Type the answer in Nahuatl. */
  | { type: 'type'; prompt: string; accepted: { central: string[]; huasteca: string[] }; explain?: V }
  /** Choose the word that fills ___ in the sentence. */
  | { type: 'blank'; sentence: V; es: string; options: V[]; answer: number; explain?: V };

export type Lesson = {
  n: number;
  slug: string;
  /** Day-sign name, e.g. "Cipactli". */
  sign: string;
  title: string;
  subtitle: string;
  /** Search-result description, when the default (subtitle + intro without its first sentence) reads badly. */
  metaDescription?: string;
  intro: string;
  minutes: number;
  access: 'free' | 'member';
  vocab: Word[];
  steps: Step[];
};

// ---- authoring helpers -------------------------------------------------

/** A Nahuatl form that differs between variants. */
export const v = (central: string, huasteca: string): V => ({ central, huasteca });
export const w = (id: string, nah: V, es: string, note?: string): Word => ({ id, nah, es, ...(note ? { note } : {}) });

export const info = (title: string, body: V, examples?: Example[]): Step => ({
  type: 'info', title, body, ...(examples ? { examples } : {}),
});
export const choice = (prompt: string, options: V[], answer: number, extra: { nah?: V; explain?: V } = {}): Step => ({
  type: 'choice', prompt, options, answer, ...extra,
});
export const build = (es: string, pieces: V[], extra?: V[], explain?: V): Step => ({
  type: 'build', prompt: 'Arma la palabra', es, pieces, ...(extra ? { extra } : {}), ...(explain ? { explain } : {}),
});
/** `accept` lists other word orders that are also right. */
export const order = (es: string, pieces: V[], extra?: V[], explain?: V, accept?: V[]): Step => ({
  type: 'order', prompt: 'Ordena la frase', es, pieces, ...(extra ? { extra } : {}), ...(explain ? { explain } : {}), ...(accept ? { accept } : {}),
});
export const blank = (sentence: V, es: string, options: V[], answer: number, explain?: V): Step => ({
  type: 'blank', sentence, es, options, answer, ...(explain ? { explain } : {}),
});
/** "Escribe en náhuatl: …" accepting each variant's form (and any alternatives after "|"). */
export const write = (es: string, nah: V, explain?: V): Step => {
  const alts = (s: string) => s.split('|').map((x) => x.trim());
  return {
    type: 'type',
    prompt: `Escribe en náhuatl: «${es}»`,
    accepted: typeof nah === 'string' ? { central: alts(nah), huasteca: alts(nah) } : { central: alts(nah.central), huasteca: alts(nah.huasteca) },
    ...(explain ? { explain } : {}),
  };
};

/** Match exercise from vocabulary words. */
export const matchOf = (words: Word[]): Step => ({ type: 'match', pairs: words.map((x) => ({ nah: x.nah, es: x.es })) });

function others(word: Word, pool: Word[], count: number): Word[] {
  const i = pool.findIndex((x) => x.id === word.id);
  const rest = [...pool.slice(i + 1), ...pool.slice(0, Math.max(i, 0))].filter((x) => x.id !== word.id && x.es !== word.es);
  return rest.slice(0, count);
}
/** "¿Qué significa …?" with two other words from the pool as wrong answers. */
export const meaningOf = (word: Word, pool: Word[]): Step => ({
  type: 'choice', prompt: '¿Qué significa?', nah: word.nah,
  options: [word.es, ...others(word, pool, 2).map((x) => x.es)], answer: 0,
});
/** "¿Cómo se dice …?" with two other words from the pool as wrong answers. */
export const wordFor = (word: Word, pool: Word[]): Step => ({
  type: 'choice', prompt: `¿Cómo se dice «${word.es}»?`,
  options: [word.nah, ...others(word, pool, 2).map((x) => x.nah)], answer: 0,
});
