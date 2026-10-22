import { createClient } from '@supabase/supabase-js';

/** サーバー専用: service role キーを使う管理クライアント（ブラウザには絶対に出さない） */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin env is not configured');
  return createClient(url, key, { auth: { persistSession: false } });
}
