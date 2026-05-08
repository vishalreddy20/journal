import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/*
 * Supabase SQL Schema — run this in the Supabase SQL Editor:
 *
 * -- Table: audits (NO PII)
 * CREATE TABLE audits (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   tool_inputs JSONB NOT NULL,
 *   audit_result JSONB NOT NULL,
 *   ai_summary TEXT,
 *   total_monthly_savings DECIMAL(10,2),
 *   total_annual_savings DECIMAL(10,2),
 *   total_current_spend DECIMAL(10,2),
 *   is_credex_relevant BOOLEAN DEFAULT FALSE,
 *   is_already_optimal BOOLEAN DEFAULT FALSE
 * );
 *
 * -- Table: leads (PII — email, company, role)
 * CREATE TABLE leads (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
 *   email TEXT NOT NULL,
 *   company_name TEXT,
 *   role TEXT,
 *   team_size TEXT,
 *   high_savings_case BOOLEAN DEFAULT FALSE,
 *   email_sent BOOLEAN DEFAULT FALSE
 * );
 *
 * -- RLS policies
 * ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Allow insert for all" ON audits FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow select by id" ON audits FOR SELECT USING (true);
 * CREATE POLICY "Allow insert for all" ON leads FOR INSERT WITH CHECK (true);
 */

// Lazy singletons — only created when first accessed, never at module load time.
// This prevents Vercel build failures when env vars are not yet configured.

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/** Client-side Supabase client (anon key — safe to expose if RLS is configured) */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    _supabase = createClient(url, key);
  }
  return _supabase;
}

/** Server-side admin client (service role — NEVER import in client components) */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// Legacy named exports for backward compatibility — lazy wrappers
/** @deprecated Use getSupabaseAdmin() instead */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  },
});

/** @deprecated Use getSupabase() instead */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});
