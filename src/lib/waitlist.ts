import { isVariant, type Variant } from './variant';

export type Signup = { email: string; name: string | null; variant: Variant | null; source: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Check and tidy a sign-up sent from the form. `website` is a hidden field only bots fill in. */
export function validateSignup(body: unknown): { ok: true; value: Signup } | { ok: false; error: string } {
  if (!isObj(body)) return { ok: false, error: 'Escribe tu correo para apuntarte.' };
  if (typeof body.website === 'string' && body.website.trim() !== '') return { ok: false, error: 'Revisa tu correo e inténtalo de nuevo.' };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL.test(email)) return { ok: false, error: 'Ese correo no parece válido. Revísalo, por favor.' };
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 80) : null;
  const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim().slice(0, 40) : 'web';
  return { ok: true, value: { email, name, variant: isVariant(body.variant) ? body.variant : null, source } };
}

/** What this device remembers after signing up: enough to skip the form and to record lesson interest. */
export type StoredSignup = { email: string; at: string };

export function parseSignup(raw: string | null): StoredSignup | null {
  if (!raw) return null;
  try {
    const x: unknown = JSON.parse(raw);
    return isObj(x) && typeof x.email === 'string' && typeof x.at === 'string' ? { email: x.email, at: x.at } : null;
  } catch {
    return null;
  }
}
