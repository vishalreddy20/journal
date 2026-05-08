import { createClient } from '@supabase/supabase-js';

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

// Client-side Supabase client (anon key — safe to expose if RLS is configured)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side admin client (service role — NEVER import in client components)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
