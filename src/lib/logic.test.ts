import { describe, expect, it } from 'vitest';
import { pick } from './variant';
import { toNahuatl } from './numbers';
import { tonalli } from './tonalpohualli';
import { isCorrect, normalize } from './answers';
import { dailyIndex } from './daily';

const words = (n: number | string, v: 'central' | 'huasteca' = 'central') => {
  const r = toNahuatl(n, v);
  if (!r.ok) throw new Error(`not ok: ${n}`);
  return r.words;
};

describe('pick', () => {
  it('returns a plain string unchanged', () => expect(pick('calli', 'huasteca')).toBe('calli'));
  it('returns the form for the variant', () =>
    expect(pick({ central: 'cualli', huasteca: 'cualli2' }, 'huasteca')).toBe('cualli2'));
});

describe('toNahuatl central', () => {
  it.each([
    [1, 'ce'], [2, 'ome'], [3, 'yei'], [4, 'nahui'], [5, 'macuilli'], [6, 'chicuace'],
    [7, 'chicome'], [8, 'chicuei'], [9, 'chiucnahui'], [10, 'mahtlactli'],
    [11, 'mahtlactli once'], [12, 'mahtlactli omome'], [13, 'mahtlactli omei'],
    [14, 'mahtlactli onnahui'], [15, 'caxtolli'], [16, 'caxtolli once'], [19, 'caxtolli onnahui'],
    [20, 'cempohualli'], [21, 'cempohualli once'], [30, 'cempohualli ommahtlactli'],
    [35, 'cempohualli oncaxtolli'], [37, 'cempohualli oncaxtolli omome'],
    [40, 'ompohualli'], [60, 'yepohualli'], [80, 'nauhpohualli'], [100, 'macuilpohualli'],
    [120, 'chicuacempohualli'], [200, 'mahtlacpohualli'], [220, 'mahtlactli oncempohualli'],
    [300, 'caxtolpohualli'], [380, 'caxtolli onnauhpohualli'],
    [400, 'centzontli'], [421, 'centzontli ipan cempohualli once'], [800, 'ontzontli'],
    [405, 'centzontli ipan macuilli'],
  ])('%i → %s', (n, w) => expect(words(n)).toBe(w));

  it('handles the top of the range', () => expect(toNahuatl(7999, 'central').ok).toBe(true));
  it('accepts numeric strings with spaces', () => expect(words(' 20 ')).toBe('cempohualli'));

  it('counts glyphs for 421', () => {
    const r = toNahuatl(421, 'central');
    expect(r.ok && r.glyphs).toEqual({ feathers: 1, flags: 1, dots: 1 });
  });
  it('breaks 421 into parts', () => {
    const r = toNahuatl(421, 'central');
    expect(r.ok && r.parts.map((p) => p.value)).toEqual([400, 20, 1]);
  });
});

describe('toNahuatl huasteca', () => {
  it.each([
    [3, 'eyi'], [8, 'chicueyi'], [11, 'mahtlactli huan ce'], [16, 'caxtolli huan ce'],
    [21, 'cempohualli huan ce'], [35, 'cempohualli huan caxtolli'], [60, 'expohualli'],
    [421, 'centzontli huan cempohualli huan ce'],
  ])('%i → %s', (n, w) => expect(words(n, 'huasteca')).toBe(w));
});

describe('toNahuatl huasteca above 200', () => {
  it('220 cannot be misread as 10 + 20', () => {
    expect(words(220, 'huasteca')).toBe('mahtlactli oncempohualli');
    expect(words(30, 'huasteca')).toBe('cempohualli huan mahtlactli');
  });
});

describe('toNahuatl bad input', () => {
  it.each([0, -3, 2.5, 'abc', 8000, '', '12abc', NaN])('%s is rejected with a message', (x) => {
    const r = toNahuatl(x as number | string, 'central');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.length).toBeGreaterThan(5);
  });
});

describe('tonalli', () => {
  it('anchor day is 1 Coatl', () => expect(tonalli(1521, 8, 23)).toEqual({ number: 1, signIndex: 4 }));
  it('next day is 2 Miquiztli', () => expect(tonalli(1521, 8, 24)).toEqual({ number: 2, signIndex: 5 }));
  it('previous day is 13 Cuetzpalin', () => expect(tonalli(1521, 8, 22)).toEqual({ number: 13, signIndex: 3 }));
  it('repeats after 260 days', () => expect(tonalli(1522, 5, 10)).toEqual({ number: 1, signIndex: 4 }));
  it('works for a modern leap day', () => {
    const a = tonalli(2024, 2, 28);
    const b = tonalli(2024, 2, 29);
    expect(b.signIndex).toBe((a.signIndex + 1) % 20);
    expect(b.number).toBe((a.number % 13) + 1);
  });
  it('works long before the anchor', () => {
    const r = tonalli(1325, 3, 13);
    expect(r.number).toBeGreaterThanOrEqual(1);
    expect(r.number).toBeLessThanOrEqual(13);
    expect(r.signIndex).toBeGreaterThanOrEqual(0);
    expect(r.signIndex).toBeLessThanOrEqual(19);
  });
});

describe('answers', () => {
  it('normalizes case, accents, punctuation and spaces', () =>
    expect(normalize('  ¡Tlazohcamati,   Huel! ')).toBe('tlazohcamati huel'));
  it.each([
    [' Tlazohcamati! ', 'tlazohcamati'], ['PIALLI', 'pialli'], ['cuálli', 'cualli'], ['¿quen tica?', 'quen tica'],
  ])('accepts %s', (g, a) => expect(isCorrect(g, [a])).toBe(true));
  it('accepts any listed alternative', () => expect(isCorrect('yei', ['eyi', 'yei'])).toBe(true));
  it('rejects empty', () => expect(isCorrect('', ['x'])).toBe(false));
  it('rejects wrong', () => expect(isCorrect('atl', ['tletl'])).toBe(false));
});

describe('dailyIndex', () => {
  it('is stable for a date', () => expect(dailyIndex('2026-11-24', 90)).toBe(dailyIndex('2026-11-24', 90)));
  it('changes the next day', () => expect(dailyIndex('2026-11-25', 90)).not.toBe(dailyIndex('2026-11-24', 90)));
  it('stays in range', () => {
    for (const d of ['2026-01-01', '2030-12-31', '1999-06-15']) {
      const i = dailyIndex(d, 7);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(7);
    }
  });
});
