import { describe, expect, it } from 'vitest';
import { LESSONS } from './lessons';
import { SIGNS } from './signs';
import { PRONUNCIACION } from './pronunciacion';
import { TOPONIMOS } from './toponimos';
import { NAHUATLISMOS } from './nahuatlismos';
import { dictionary } from '@/lib/dictionary';
import { pick, VARIANTS, type V } from '@/lib/variant';

const filled = (x: V) => VARIANTS.every((vr) => pick(x, vr).trim().length > 0);

describe('signs', () => {
  it('has the 20 day-signs in order', () => {
    expect(SIGNS).toHaveLength(20);
    expect(SIGNS.map((s) => s.n)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(SIGNS[0].nah).toBe('Cipactli');
    expect(SIGNS[4].nah).toBe('Coatl');
    expect(SIGNS[19].nah).toBe('Xochitl');
  });
});

describe('lessons', () => {
  it('has 8 lessons numbered 1-8 with unique slugs, all free', () => {
    expect(LESSONS.map((l) => l.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(8);
    expect(LESSONS.every((l) => l.access === 'free')).toBe(true);
  });
  it('each lesson uses the day-sign with its number', () => {
    for (const l of LESSONS) expect(l.sign).toBe(SIGNS[l.n - 1].nah);
  });

  for (const l of LESSONS) {
    describe(`lesson ${l.n} ${l.slug}`, () => {
      it('has at least 20 steps and 10 words', () => {
        expect(l.steps.length).toBeGreaterThanOrEqual(20);
        expect(l.vocab.length).toBeGreaterThanOrEqual(10);
      });
      it('starts with an explanation card', () => expect(l.steps[0].type).toBe('info'));
      it('has unique word ids and both variants for every word', () => {
        expect(new Set(l.vocab.map((w) => w.id)).size).toBe(l.vocab.length);
        for (const w of l.vocab) {
          expect(filled(w.nah), w.id).toBe(true);
          expect(w.es.trim().length, w.id).toBeGreaterThan(0);
        }
      });
      it('every step is well formed', () => {
        l.steps.forEach((s, i) => {
          const at = `step ${i} (${s.type})`;
          switch (s.type) {
            case 'info':
              expect(s.title.length, at).toBeGreaterThan(0);
              expect(filled(s.body), at).toBe(true);
              break;
            case 'choice':
            case 'blank': {
              expect(s.options.length, at).toBeGreaterThanOrEqual(2);
              expect(s.answer, at).toBeGreaterThanOrEqual(0);
              expect(s.answer, at).toBeLessThan(s.options.length);
              for (const vr of VARIANTS) {
                const opts = s.options.map((o) => pick(o, vr));
                expect(new Set(opts).size, `${at} duplicate options in ${vr}`).toBe(opts.length);
              }
              if (s.type === 'blank') for (const vr of VARIANTS) expect(pick(s.sentence, vr), at).toContain('___');
              break;
            }
            case 'match': {
              expect(s.pairs.length, at).toBeGreaterThanOrEqual(3);
              expect(s.pairs.length, at).toBeLessThanOrEqual(6);
              for (const vr of VARIANTS) {
                expect(new Set(s.pairs.map((p) => pick(p.nah, vr))).size, `${at} nah dup ${vr}`).toBe(s.pairs.length);
              }
              expect(new Set(s.pairs.map((p) => p.es)).size, `${at} es dup`).toBe(s.pairs.length);
              break;
            }
            case 'build':
            case 'order':
              expect(s.pieces.length, at).toBeGreaterThanOrEqual(2);
              expect(s.pieces.every(filled), at).toBe(true);
              expect(s.es.length, at).toBeGreaterThan(0);
              break;
            case 'type':
              for (const vr of VARIANTS) expect(s.accepted[vr].length, `${at} ${vr}`).toBeGreaterThan(0);
              break;
          }
        });
      });
    });
  }

  it('uses all six exercise types across the course, and word-building in lessons 2-7', () => {
    const types = new Set(LESSONS.flatMap((l) => l.steps.map((s) => s.type)));
    for (const t of ['info', 'choice', 'match', 'build', 'order', 'type', 'blank']) expect(types.has(t as never), t).toBe(true);
    for (const l of LESSONS.filter((x) => x.n >= 2 && x.n <= 7)) {
      expect(l.steps.some((s) => s.type === 'build'), `lesson ${l.n}`).toBe(true);
    }
  });
});

describe('reference content', () => {
  it('pronunciation guide has 18 unique entries', () => {
    expect(PRONUNCIACION).toHaveLength(18);
    expect(new Set(PRONUNCIACION.map((p) => p.id)).size).toBe(18);
  });
  it('has at least 60 place names, unique', () => {
    expect(TOPONIMOS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(TOPONIMOS.map((t) => t.name)).size).toBe(TOPONIMOS.length);
    for (const t of TOPONIMOS) expect(t.parts.length, t.name).toBeGreaterThan(0);
  });
  it('has at least 80 nahuatlismos, unique', () => {
    expect(NAHUATLISMOS.length).toBeGreaterThanOrEqual(80);
    expect(new Set(NAHUATLISMOS.map((t) => t.es)).size).toBe(NAHUATLISMOS.length);
  });
  it('dictionary gathers course vocabulary without duplicate ids', () => {
    const d = dictionary();
    expect(d.length).toBeGreaterThanOrEqual(90);
    expect(new Set(d.map((w) => w.id)).size).toBe(d.length);
  });
});
