import { describe, expect, it } from 'vitest';
import { parseSignup, validateSignup } from './waitlist';

describe('validateSignup', () => {
  it('accepts a normal sign-up and tidies it', () => {
    const r = validateSignup({ email: '  Ana@Example.COM ', name: ' Ana ', variant: 'huasteca', source: 'lesson-1' });
    expect(r).toEqual({ ok: true, value: { email: 'ana@example.com', name: 'Ana', variant: 'huasteca', source: 'lesson-1' } });
  });
  it('allows a missing name and an unknown variant', () => {
    const r = validateSignup({ email: 'a@b.mx' });
    expect(r.ok && r.value).toEqual({ email: 'a@b.mx', name: null, variant: null, source: 'web' });
  });
  it.each(['', 'nope', 'a@b', '@b.mx', 'a b@c.mx', 'x'.repeat(250) + '@b.mx', 42, null])('rejects the email %j', (email) => {
    const r = validateSignup({ email });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/correo/i);
  });
  it('rejects bots that fill the hidden field', () => {
    expect(validateSignup({ email: 'a@b.mx', website: 'http://spam' }).ok).toBe(false);
  });
  it('caps long names and sources', () => {
    const r = validateSignup({ email: 'a@b.mx', name: 'n'.repeat(300), source: 's'.repeat(300) });
    expect(r.ok && r.value.name?.length).toBe(80);
    expect(r.ok && r.value.source.length).toBe(40);
  });
  it('rejects a body that is not an object', () => {
    expect(validateSignup('a@b.mx').ok).toBe(false);
    expect(validateSignup(null).ok).toBe(false);
  });
});

describe('parseSignup', () => {
  it('reads a stored sign-up', () => {
    expect(parseSignup('{"email":"a@b.mx","at":"2026-11-24"}')).toEqual({ email: 'a@b.mx', at: '2026-11-24' });
  });
  it.each([null, '', 'garbage', '{}', '{"email":5}'])('returns null for %j', (raw) => expect(parseSignup(raw)).toBeNull());
});
