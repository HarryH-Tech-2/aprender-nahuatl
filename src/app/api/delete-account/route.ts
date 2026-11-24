import { createClient } from '@supabase/supabase-js';

/** Deletes the caller's own account. The caller proves who they are with their session token. */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return Response.json({ error: 'Accounts are not configured' }, { status: 503 });

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return Response.json({ error: 'Missing session' }, { status: 401 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return Response.json({ error: 'Invalid session' }, { status: 401 });

  // The profiles row goes with it (on delete cascade).
  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) return Response.json({ error: 'Could not delete the account' }, { status: 500 });
  return Response.json({ ok: true });
}
