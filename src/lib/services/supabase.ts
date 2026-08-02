/**
 * Supabase client — opt-in. Only initialized if env vars are set.
 *
 * To enable:
 * 1. npm install @supabase/supabase-js
 * 2. Create project on https://supabase.com
 * 3. Run `supabase/schema.sql` in SQL Editor
 * 4. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 *    Cloudflare Pages → Settings → Environment variables
 * 5. Update `src/lib/store/userStore.ts` to call getSupabase() on
 *    signup/signin/lesson completion
 */

type SupabaseClient = any;
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (typeof window === "undefined") return null;
  try {
    // Dynamic require to avoid bundling if not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require("@supabase/supabase-js");
    _client = createClient(url, key);
  } catch {
    return null;
  }
  return _client;
}

export function isSupabaseEnabled(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
