import { describe, expect, it } from 'vitest';
import { clipText } from './text';

describe('clipText', () => {
  it('leaves short text alone', () => {
    expect(clipText('Hola mundo.', 155)).toBe('Hola mundo.');
  });

  it('cuts at a word boundary and adds an ellipsis, within the limit', () => {
    const long = 'Aquí aprendes a leer el náhuatl en voz alta —la tl, la tz, la x— y a saludar en las dos variantes del curso gratis';
    const out = clipText(long, 60);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.endsWith('…')).toBe(true);
    expect(long.startsWith(out.slice(0, -1))).toBe(true);
    expect(out.slice(0, -1)).not.toMatch(/\s$/);
    expect(long[out.length - 1]).not.toMatch(/[\p{L}\p{N}]/u); // the cut did not fall mid-word
  });

  it('prefers ending on a whole sentence when one fits', () => {
    const text = 'Cómo suena el náhuatl y cómo decir hola. Cipactli, el caimán, es el primer signo del calendario mexica.';
    expect(clipText(text, 60)).toBe('Cómo suena el náhuatl y cómo decir hola.');
  });

  it('drops trailing punctuation before the ellipsis', () => {
    expect(clipText('uno, dos, tres, cuatro, cinco, seis', 17)).toBe('uno, dos, tres…');
  });
});
