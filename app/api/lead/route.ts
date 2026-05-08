import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { checkRateLimit, getIp } from '@/lib/rateLimit';

// Lazy Resend — only created when actually used, not at module load
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? '');
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: {
    auditId: string;
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: string;
    website?: string; // honeypot field
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Honeypot check — bots fill this field, humans don't see it
  if (body.website) {
    // Silent success — don't tell bots they've been caught
    return NextResponse.json({ success: true });
  }

  // Rate limit: max 5 lead submissions per IP per hour
  const ip = getIp(req);
  const { allowed } = checkRateLimit(`lead:${ip}`, 5, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Email validation
  if (!body.email || !emailRegex.test(body.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (!body.auditId) {
    return NextResponse.json({ error: 'Audit ID required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch audit context (for personalized email)
  const { data: audit } = await supabase
    .from('audits')
    .select('total_monthly_savings, is_credex_relevant, id')
    .eq('id', body.auditId)
    .single();

  // Save lead to database
  const { error: leadError } = await supabase.from('leads').insert({
    audit_id: body.auditId,
    email: body.email,
    company_name: body.companyName ?? null,
    role: body.role ?? null,
    team_size: body.teamSize ?? null,
    high_savings_case: audit?.is_credex_relevant ?? false,
    email_sent: false,
  });

  if (leadError) {
    console.error('Lead insert error:', leadError);
  }

  // Send confirmation email via Resend
  const monthlySavings = audit?.total_monthly_savings ?? 0;
  const isHighSavings = audit?.is_credex_relevant ?? false;
  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${body.auditId}`;

  try {
    await getResend().emails.send({
      from: 'SpendLens <onboarding@resend.dev>',
      to: body.email,
      subject: 'Your AI Spend Audit — SpendLens',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: 'DM Sans', -apple-system, sans-serif; background: #0A0F1E; color: #fff; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1a2035, #0d1526); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 40px;">
      <h1 style="color: #00D4FF; font-size: 28px; margin: 0 0 8px;">SpendLens</h1>
      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 32px;">AI Spend Audit by Credex</p>
      
      <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px;">Your audit report is ready</h2>
      
      <div style="background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; padding: 24px; margin: 0 0 24px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px;">POTENTIAL MONTHLY SAVINGS</p>
        <p style="color: #00D4FF; font-size: 36px; font-weight: 700; margin: 0;">$${Number(monthlySavings).toFixed(0)}<span style="font-size: 18px; color: #64748b;">/mo</span></p>
        <p style="color: #64748b; font-size: 13px; margin: 8px 0 0;">That's $${(Number(monthlySavings) * 12).toFixed(0)}/year</p>
      </div>
      
      <a href="${auditUrl}" style="display: block; background: #00D4FF; color: #0A0F1E; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; margin: 0 0 24px;">View Full Audit Report →</a>
      
      ${isHighSavings
        ? `<div style="background: rgba(0,212,255,0.05); border-left: 3px solid #00D4FF; padding: 16px; border-radius: 4px; margin: 0 0 24px;">
            <p style="color: #00D4FF; font-weight: 600; margin: 0 0 4px;">High-savings audit detected</p>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">A Credex advisor will reach out within 48 hours to help you capture these savings through our discounted credit marketplace.</p>
           </div>`
        : `<p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px;">We'll notify you when new optimizations apply to your stack as pricing and plans evolve.</p>`
      }
      
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;">
      <p style="color: #475569; font-size: 12px; margin: 0;">SpendLens by <a href="https://credex.rocks" style="color: #00D4FF;">Credex</a> · AI infrastructure credits marketplace</p>
    </div>
  </div>
</body>
</html>`,
    });

    // Mark email as sent
    if (!leadError) {
      await supabase
        .from('leads')
        .update({ email_sent: true })
        .eq('audit_id', body.auditId)
        .eq('email', body.email);
    }
  } catch (emailError) {
    console.error('Resend email error:', emailError);
    // Don't fail the request if email fails — lead is already saved
  }

  return NextResponse.json({ success: true });
}
