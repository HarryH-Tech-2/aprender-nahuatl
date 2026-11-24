import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Accounts are switched on only when both public Supabase variables are set. */
export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Browser client, or null when accounts are not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) client = createClient(url!, anonKey!, { auth: { flowType: 'pkce', detectSessionInUrl: true } });
  return client;
}
