import Anthropic from '@anthropic-ai/sdk';
import type { AuditResult, AuditInput } from '@/types/audit';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildFallback(audit: AuditResult, input: AuditInput): string {
  const topFinding = audit.findings.find(
    (f) => f.monthlySavings > 0 && f.recommendedAction !== 'consider-credits'
  );
  const toolCount = input.tools.length;
  return `Your team of ${input.teamSize} is spending $${input.totalBudget}/month across ${toolCount} AI tools. Our audit identified $${audit.totalMonthlySavings.toFixed(0)}/month in savings through plan right-sizing and eliminating redundant subscriptions. The highest-impact change is ${topFinding?.reasoning ?? 'reviewing your current plan tiers'}. Implementing these optimizations would save $${audit.totalAnnualSavings.toFixed(0)}/year — enough to fund meaningful additional developer tooling at optimized rates.`;
}

export async function generateAuditSummary(
  audit: AuditResult,
  input: AuditInput
): Promise<string> {
  const findingsSummary = audit.findings
    .filter((f) => f.monthlySavings > 0 && f.recommendedAction !== 'consider-credits')
    .slice(0, 3)
    .map((f) => `- ${f.toolName}: ${f.reasoning} (saves $${f.monthlySavings}/mo)`)
    .join('\n');

  if (!findingsSummary) {
    return buildFallback(audit, input);
  }

  const prompt = `You are a financial analyst specializing in SaaS cost optimization for technology teams.

Given the following AI tool audit data, write a concise 90-100 word personalized summary for the team. Be specific about their situation. Be direct and actionable. Do not use filler phrases like "it's clear that" or "this analysis shows". Start with the biggest opportunity. End with a forward-looking sentence about trajectory.

Team context:
- Team size: ${input.teamSize}
- Primary use case: ${input.useCase}
- Total monthly AI spend: $${input.totalBudget}

Top findings:
${findingsSummary}

Total potential savings: $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year)

Write the summary now. 100 words max.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-3-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type === 'text') return content.text;
    return buildFallback(audit, input);
  } catch (error) {
    // Log but never throw — always fall back gracefully
    console.error('Anthropic API error (using fallback):', error);
    return buildFallback(audit, input);
  }
}
