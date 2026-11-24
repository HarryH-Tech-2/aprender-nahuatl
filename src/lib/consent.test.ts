import { describe, expect, it } from 'vitest';
import { parseConsent } from './consent';

describe('parseConsent', () => {
  it('reads the two valid answers', () => {
    expect(parseConsent('granted')).toBe('granted');
    expect(parseConsent('denied')).toBe('denied');
  });
  it('treats anything else as "not asked yet"', () => {
    for (const x of [null, '', 'yes', 'GRANTED', '{"a":1}']) expect(parseConsent(x)).toBeNull();
  });
});
