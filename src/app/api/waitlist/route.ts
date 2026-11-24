import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { validateSignup } from '@/lib/waitlist';

/** Add someone to the course waitlist (or update their details if they are already on it). */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const check = validateSignup(body);
  if (!check.ok) return Response.json({ error: check.error }, { status: 400 });

  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: 'not-configured' }, { status: 503 });

  const { email, name, variant, source } = check.value;
  // Only send fields we have, so a later sign-up without a name does not erase an earlier one.
  const row: Record<string, string> = { email, source, updated_at: new Date().toISOString() };
  if (name) row.name = name;
  if (variant) row.variant = variant;

  const { error } = await admin.from('waitlist').upsert(row, { onConflict: 'email' });
  if (error) return Response.json({ error: 'No pudimos guardar tu correo. Inténtalo de nuevo en un momento.' }, { status: 500 });
  return Response.json({ ok: true });
}
