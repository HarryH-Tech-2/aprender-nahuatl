import { userFromRequest } from '@/lib/auth-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Deletes the caller's own account. The caller proves who they are with their session token. */
export async function POST(request: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: 'Accounts are not configured' }, { status: 503 });

  const user = await userFromRequest(request);
  if (!user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  // The profiles row goes with it (on delete cascade).
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) return Response.json({ error: 'Could not delete the account' }, { status: 500 });
  return Response.json({ ok: true });
}
