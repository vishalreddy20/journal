import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { runAudit } from '@/lib/auditEngine';
import { generateAuditSummary } from '@/lib/anthropic';
import { checkRateLimit, getIp } from '@/lib/rateLimit';
import type { AuditInput } from '@/types/audit';

export async function POST(req: NextRequest) {
  // Rate limit: 20 audits per IP per hour
  const ip = getIp(req);
  const { allowed } = checkRateLimit(`audit:${ip}`, 20, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: { auditInput: AuditInput };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { auditInput } = body;
  if (!auditInput || !auditInput.tools || !Array.isArray(auditInput.tools)) {
    return NextResponse.json({ error: 'Invalid audit input' }, { status: 400 });
  }

  // Run audit engine server-side (always recompute — never trust client)
  const auditResult = runAudit(auditInput);

  // Generate AI summary with built-in fallback
  const aiSummary = await generateAuditSummary(auditResult, auditInput);

  // Save to Supabase (no PII in audits table)
  const { data, error } = await supabaseAdmin
    .from('audits')
    .insert({
      tool_inputs: auditInput,
      audit_result: auditResult,
      ai_summary: aiSummary,
      total_monthly_savings: auditResult.totalMonthlySavings,
      total_annual_savings: auditResult.totalAnnualSavings,
      total_current_spend: auditResult.totalCurrentSpend,
      is_credex_relevant: auditResult.credexRelevant,
      is_already_optimal: auditResult.isAlreadyOptimal,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    // Still return audit result even if save fails — don't block user
    return NextResponse.json({
      auditId: null,
      auditResult,
      aiSummary,
      warning: 'Audit computed but could not be saved for sharing.',
    });
  }

  return NextResponse.json({
    auditId: data.id,
    auditResult,
    aiSummary,
  });
}
