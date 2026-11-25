import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RESPUESTAS } from './respuestas';
import { TEMAS } from './frases-temas';
import { SIGNS } from './signs';
import { LESSONS } from './lessons';

/** Lower-case, drop accents, punctuation and the hyphens lessons use to show pieces (ni-mitz-itta = nimitzitta). */
const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/-/g, '').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();

// Everything the course already teaches: lesson sources, the phrase list and the day signs.
const lessonDir = join(__dirname, 'lessons');
const taught = norm(
  [
    ...readdirSync(lessonDir).filter((f) => f.endsWith('.ts')).map((f) => readFileSync(join(lessonDir, f), 'utf-8')),
    ...TEMAS.flatMap((t) => t.items.flatMap((i) => [i.central, i.huasteca])),
    ...SIGNS.map((s) => s.nah),
  ].join(' '),
);

describe('respuestas (answer pages)', () => {
  it('has unique slugs that end in -en-nahuatl', () => {
    expect(new Set(RESPUESTAS.map((r) => r.slug)).size).toBe(RESPUESTAS.length);
    for (const r of RESPUESTAS) expect(r.slug).toMatch(/^[a-z-]+-en-nahuatl$/);
  });

  it('keeps titles and descriptions short enough to show in full in search results', () => {
    for (const r of RESPUESTAS) {
      expect(r.title.length, r.slug).toBeLessThanOrEqual(60);
      expect(r.description.length, r.slug).toBeLessThanOrEqual(155);
    }
  });

  it('only uses Nahuatl forms the course already teaches', () => {
    for (const r of RESPUESTAS) {
      const forms = [
        ...(r.answer ? [r.answer.central, r.answer.huasteca] : []),
        ...r.rows.flatMap((f) => [f.central, f.huasteca ?? '']),
        ...(r.dialogue ?? []).flatMap((d) => [d.central, d.huasteca]),
        ...r.body.flatMap((p) => [...p.matchAll(/\*([^*]+)\*/g)].map((m) => m[1])),
      ].filter(Boolean);
      for (const f of forms) {
        // Each word of a phrase must appear in what the course teaches (prefix fragments like "ni-" are fine).
        for (const word of norm(f).split(' ').filter((x) => x.length > 2)) {
          expect(taught, `${r.slug}: «${f}»`).toContain(word);
        }
      }
    }
  });

  it('the /frases list only uses forms the lessons teach', () => {
    const lessonsOnly = norm(readdirSync(lessonDir).filter((f) => f.endsWith('.ts')).map((f) => readFileSync(join(lessonDir, f), 'utf-8')).join(' '));
    for (const t of TEMAS) {
      for (const item of t.items) {
        for (const form of [item.central, item.huasteca]) {
          for (const word of norm(form).split(' ').filter((x) => x.length > 2)) {
            expect(lessonsOnly, `${t.id}: «${form}»`).toContain(word);
          }
        }
      }
    }
  });

  it('links to a real lesson', () => {
    for (const r of RESPUESTAS) expect(LESSONS.some((l) => l.n === r.lesson)).toBe(true);
  });
});
