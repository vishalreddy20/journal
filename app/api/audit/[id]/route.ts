import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid audit ID' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('audits')
    .select(
      'id, audit_result, ai_summary, total_monthly_savings, total_annual_savings, total_current_spend, tool_inputs, created_at'
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  // Return ONLY non-PII fields
  return NextResponse.json({
    id: data.id,
    audit_result: data.audit_result,
    ai_summary: data.ai_summary,
    total_monthly_savings: data.total_monthly_savings,
    total_annual_savings: data.total_annual_savings,
    total_current_spend: data.total_current_spend,
    tool_inputs: data.tool_inputs,
    created_at: data.created_at,
  });
}
