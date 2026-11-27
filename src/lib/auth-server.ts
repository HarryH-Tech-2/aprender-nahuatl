import { getSupabaseAdmin } from './supabase-admin';

/** The signed-in user behind a `Authorization: Bearer <access token>` header, or null. */
export async function userFromRequest(request: Request): Promise<{ id: string; email: string | null } | null> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}
