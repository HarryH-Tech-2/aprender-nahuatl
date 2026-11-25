import { describe, expect, it } from 'vitest';
import { LESSONS } from '@/content/lessons';
import { lessonPhrases } from './lesson-phrases';
import { build, info, order, v, type Lesson } from '@/content/types';

const fake = (steps: Lesson['steps']): Lesson => ({
  n: 1, slug: 'x', sign: 'Cipactli', title: 't', subtitle: 's', intro: 'i', minutes: 5, access: 'free', vocab: [], steps,
});

describe('lessonPhrases', () => {
  it('joins sentence exercises with spaces and word exercises without, in both variants', () => {
    const out = lessonPhrases(
      fake([
        order('Me llamo Citlali', [v('Notoca', 'Notocah'), 'Citlali'], [v('Motoca', 'Motocah')]),
        build('soy mexicano', ['ni', 'mexihcatl'], ['ti']),
      ]),
    );
    expect(out).toEqual([
      { central: 'Notoca Citlali', huasteca: 'Notocah Citlali', es: 'Me llamo Citlali' },
      { central: 'Nimexihcatl', huasteca: 'Nimexihcatl', es: 'Soy mexicano' },
    ]);
  });

  it('includes examples from explanation cards and drops duplicates', () => {
    const ex = { nah: v('—Niltze.', '—Piyali.'), es: '—Hola.' };
    const out = lessonPhrases(fake([info('A', 'b', [ex]), info('C', 'd', [ex])]));
    expect(out).toEqual([{ central: '—Niltze.', huasteca: '—Piyali.', es: '—Hola.' }]);
  });

  it('capitalises consistently and treats different capitalisation as the same phrase', () => {
    const out = lessonPhrases(
      fake([info('A', 'b', [{ nah: 'ticihuatl', es: 'eres mujer' }]), build('eres mujer', ['ti', 'cihuatl'])]),
    );
    expect(out).toEqual([{ central: 'Ticihuatl', huasteca: 'Ticihuatl', es: 'Eres mujer' }]);
  });

  it('gives every real lesson several phrases, all filled in', () => {
    for (const l of LESSONS) {
      const out = lessonPhrases(l);
      expect(out.length, `lección ${l.n}`).toBeGreaterThanOrEqual(3);
      for (const p of out) {
        expect(p.central.trim(), `lección ${l.n}`).not.toBe('');
        expect(p.huasteca.trim(), `lección ${l.n}`).not.toBe('');
        expect(p.es.trim(), `lección ${l.n}`).not.toBe('');
      }
    }
  });

  it('respects the limit', () => {
    expect(lessonPhrases(LESSONS[0], 2)).toHaveLength(2);
  });
});
