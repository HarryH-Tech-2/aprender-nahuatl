import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { isVariant } from '@/lib/variant';
import { validateSignup } from '@/lib/waitlist';

/** Record that a signed-up learner tried to start a lesson that is not open yet. */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const check = validateSignup(body);
  const raw = (body ?? {}) as { lesson?: unknown; variant?: unknown };
  const lesson = Number(raw.lesson);
  if (!check.ok || !Number.isInteger(lesson) || lesson < 1 || lesson > 20) {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: 'not-configured' }, { status: 503 });

  const { error } = await admin.from('lesson_interest').insert({
    email: check.value.email,
    lesson,
    variant: isVariant(raw.variant) ? raw.variant : null,
  });
  if (error) return Response.json({ error: 'store-failed' }, { status: 500 });
  return Response.json({ ok: true });
}
