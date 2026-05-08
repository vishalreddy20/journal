import type { AuditInput, AuditResult, AuditFinding } from '@/types/audit';
import { TOOL_NAMES } from '@/lib/pricingData';

export function runAudit(input: AuditInput): AuditResult {
  const findings: AuditFinding[] = [];
  const { tools, teamSize, useCase } = input;

  // Track which tools are active for cross-tool redundancy checks
  const activeToolIds = new Set(tools.map((t) => t.toolId));
  const toolMap = new Map(tools.map((t) => [t.toolId, t]));

  for (const tool of tools) {
    const { toolId, plan, monthlySpend, seats } = tool;

    switch (toolId) {
      case 'cursor': {
        if (plan === 'pro' && seats === 1 && useCase !== 'coding') {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.cursor,
            currentPlan: 'Pro',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Hobby',
            projectedSpend: 0,
            monthlySavings: monthlySpend,
            annualSavings: monthlySpend * 12,
            reasoning:
              'Cursor Pro is designed for coding workflows; for non-coding use, the free Hobby tier provides adequate access.',
            priority: 'high',
          });
        } else if (plan === 'business' && seats < 5) {
          const savings = seats * (40 - 20);
          const projected = seats * 20;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.cursor,
            currentPlan: 'Business',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Pro',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              'Cursor Business unlocks admin controls and SSO, features that provide value only at 5+ seats; below that threshold, Pro delivers equivalent per-developer capability at half the cost.',
            priority: 'high',
          });
        } else if (plan === 'pro' || plan === 'business') {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.cursor,
            currentPlan: plan === 'pro' ? 'Pro' : 'Business',
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan is well-matched to your team size and use case.',
            priority: 'low',
          });
        }
        break;
      }

      case 'githubCopilot': {
        if (plan === 'business' && seats <= 2) {
          const savings = seats * (19 - 10);
          const projected = seats * 10;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.githubCopilot,
            currentPlan: 'Business',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Individual',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              'GitHub Copilot Business adds policy management and audit logs, features that matter at team scale (5+); at 1-2 users, Individual plan delivers identical code completion at $9/user/month less.',
            priority: 'high',
          });
        } else if (plan === 'enterprise' && seats < 20) {
          const savings = seats * (39 - 19);
          const projected = seats * 19;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.githubCopilot,
            currentPlan: 'Enterprise',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Business',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              "Enterprise tier's value (fine-tuning, IP indemnity SLAs) materialises at 20+ developers; below that, Business provides full team functionality at $20/user/month savings.",
            priority: 'high',
          });
        } else if (useCase !== 'coding' && monthlySpend > 50) {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.githubCopilot,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'optimize',
            recommendedTool: 'Claude Pro',
            projectedSpend: monthlySpend * 0.6,
            monthlySavings: monthlySpend * 0.4,
            annualSavings: monthlySpend * 0.4 * 12,
            reasoning:
              "Copilot's ROI is highest for software development; for non-coding teams, Claude Pro at $20/user delivers stronger writing and analysis ROI.",
            priority: 'medium',
          });
        } else {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.githubCopilot,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan is appropriate for your team size.',
            priority: 'low',
          });
        }
        break;
      }

      case 'claude': {
        if (plan === 'max' && (useCase === 'writing' || useCase === 'research') && teamSize > 1) {
          const savings = seats * (100 - 20);
          const projected = seats * 20;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.claude,
            currentPlan: 'Max',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Pro',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              "Claude Max's 5x usage limit is designed for power users running extended research sessions; for standard writing workflows, Pro's monthly message allocation is sufficient, saving $80/user/month.",
            priority: 'high',
          });
        } else if (plan === 'team' && seats < 5) {
          const savings = seats * (30 - 20);
          const projected = seats * 20;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.claude,
            currentPlan: 'Team',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Pro',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              'Claude Team requires a 5-seat minimum; below that threshold, individual Pro subscriptions at $20/user deliver the same model access at $10/user/month less with no seat floor.',
            priority: 'high',
          });
        } else if (plan === 'apiDirect' && monthlySpend > 200) {
          const potentialSavings = monthlySpend * 0.65;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.claude,
            currentPlan: 'API Direct',
            currentSpend: monthlySpend,
            recommendedAction: 'optimize',
            recommendedPlan: 'Pro',
            projectedSpend: monthlySpend - potentialSavings,
            monthlySavings: potentialSavings,
            annualSavings: potentialSavings * 12,
            reasoning:
              'At >$200/month in API spend, evaluate whether Claude Pro\'s flat-rate model covers your volume; many teams over-estimate API necessity and can reduce spend 60-80% by switching interactive workflows to Pro.',
            priority: 'medium',
          });
        } else {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.claude,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan is well-matched to your team needs.',
            priority: 'low',
          });
        }
        break;
      }

      case 'chatgpt': {
        // Check redundancy with Claude Pro
        const claudeTool = toolMap.get('claude');
        if (plan === 'plus' && claudeTool && claudeTool.plan === 'pro') {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.chatgpt,
            currentPlan: 'Plus',
            currentSpend: monthlySpend,
            recommendedAction: 'switch',
            recommendedTool: 'Claude Pro (already subscribed)',
            projectedSpend: 0,
            monthlySavings: monthlySpend,
            annualSavings: monthlySpend * 12,
            reasoning:
              'Running both ChatGPT Plus and Claude Pro for the same use case ($40/user/month combined) is rarely justified; Claude Pro covers most ChatGPT Plus use cases, making this a redundant $20/user/month subscription.',
            priority: 'high',
          });
        } else if (plan === 'team' && seats < 5) {
          const savings = seats * (30 - 20);
          const projected = seats * 20;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.chatgpt,
            currentPlan: 'Team',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Plus',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              'ChatGPT Team adds collaboration features that scale meaningfully only at 5+ users; below that, Plus subscriptions at $20/user deliver the same model access at $10/user/month less.',
            priority: 'high',
          });
        } else if (plan === 'apiDirect' && monthlySpend > 100) {
          const potentialSavings = monthlySpend * 0.5;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.chatgpt,
            currentPlan: 'API Direct (GPT-4o)',
            currentSpend: monthlySpend,
            recommendedAction: 'optimize',
            projectedSpend: monthlySpend - potentialSavings,
            monthlySavings: potentialSavings,
            annualSavings: potentialSavings * 12,
            reasoning:
              'GPT-4o-mini handles classification, extraction, and summarisation tasks at 94% cost reduction vs GPT-4o with comparable quality for non-reasoning workloads.',
            priority: 'medium',
          });
        } else {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.chatgpt,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan aligns with your usage profile.',
            priority: 'low',
          });
        }
        break;
      }

      case 'gemini': {
        const claudeTool = toolMap.get('claude');
        if (plan === 'advanced' && claudeTool && claudeTool.plan === 'pro') {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.gemini,
            currentPlan: 'Gemini Advanced',
            currentSpend: monthlySpend,
            recommendedAction: 'switch',
            recommendedTool: 'Claude Pro (already subscribed)',
            projectedSpend: 0,
            monthlySavings: monthlySpend,
            annualSavings: monthlySpend * 12,
            reasoning:
              'Gemini Advanced and Claude Pro serve nearly identical use cases; retaining both costs $40/user/month vs the $20 needed for either one.',
            priority: 'high',
          });
        } else {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.gemini,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan is well-matched to your needs.',
            priority: 'low',
          });
        }
        break;
      }

      case 'windsurf': {
        if (plan === 'team' && seats < 5) {
          const savings = seats * (35 - 15);
          const projected = seats * 15;
          findings.push({
            toolId,
            toolName: TOOL_NAMES.windsurf,
            currentPlan: 'Team',
            currentSpend: monthlySpend,
            recommendedAction: 'downgrade',
            recommendedPlan: 'Pro',
            projectedSpend: projected,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning:
              "Windsurf Team's collaboration features and admin controls scale meaningfully only at 5+ developers; smaller teams get equivalent code generation on Pro at $20/user/month savings.",
            priority: 'high',
          });
        } else if (plan === 'pro' && activeToolIds.has('cursor')) {
          const cursorTool = toolMap.get('cursor');
          if (cursorTool && (cursorTool.plan === 'pro' || cursorTool.plan === 'business')) {
            findings.push({
              toolId,
              toolName: TOOL_NAMES.windsurf,
              currentPlan: 'Pro',
              currentSpend: monthlySpend,
              recommendedAction: 'switch',
              recommendedTool: 'Cursor (already subscribed)',
              projectedSpend: 0,
              monthlySavings: monthlySpend,
              annualSavings: monthlySpend * 12,
              reasoning:
                'Running both Windsurf Pro and Cursor Pro for a single developer ($35/month) duplicates AI coding functionality; pick the one matching your IDE preference and drop the other.',
              priority: 'high',
            });
          } else {
            findings.push({
              toolId,
              toolName: TOOL_NAMES.windsurf,
              currentPlan: plan,
              currentSpend: monthlySpend,
              recommendedAction: 'already-optimal',
              projectedSpend: monthlySpend,
              monthlySavings: 0,
              annualSavings: 0,
              reasoning: 'Current plan is appropriate for your usage.',
              priority: 'low',
            });
          }
        } else {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.windsurf,
            currentPlan: plan,
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: 'Current plan is appropriate for your usage.',
            priority: 'low',
          });
        }
        break;
      }

      case 'anthropicApi': {
        if (monthlySpend > 0) {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.anthropicApi,
            currentPlan: 'API Direct',
            currentSpend: monthlySpend,
            recommendedAction: 'already-optimal',
            projectedSpend: monthlySpend,
            monthlySavings: 0,
            annualSavings: 0,
            reasoning:
              'API Direct usage-based billing is the most cost-efficient model for programmatic, high-volume workloads.',
            priority: 'low',
          });
        }
        break;
      }

      case 'openaiApi': {
        if (monthlySpend > 0) {
          findings.push({
            toolId,
            toolName: TOOL_NAMES.openaiApi,
            currentPlan: plan === 'gpt4o' ? 'GPT-4o' : plan === 'gpt4oMini' ? 'GPT-4o-mini' : 'GPT-3.5',
            currentSpend: monthlySpend,
            recommendedAction: plan === 'gpt4o' && monthlySpend > 100 ? 'optimize' : 'already-optimal',
            projectedSpend: plan === 'gpt4o' && monthlySpend > 100 ? monthlySpend * 0.5 : monthlySpend,
            monthlySavings: plan === 'gpt4o' && monthlySpend > 100 ? monthlySpend * 0.5 : 0,
            annualSavings: plan === 'gpt4o' && monthlySpend > 100 ? monthlySpend * 0.5 * 12 : 0,
            reasoning:
              plan === 'gpt4o' && monthlySpend > 100
                ? 'GPT-4o-mini handles classification, extraction, and summarisation tasks at 94% cost reduction vs GPT-4o with comparable quality for non-reasoning workloads.'
                : 'Current API model selection is appropriate for your workload.',
            priority: plan === 'gpt4o' && monthlySpend > 100 ? 'medium' : 'low',
          });
        }
        break;
      }
    }
  }

  // Calculate totals
  const totalCurrentSpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const realFindings = findings.filter((f) => f.recommendedAction !== 'already-optimal');
  const totalMonthlySavings = realFindings.reduce((sum, f) => sum + f.monthlySavings, 0);

  // Add credits finding if total spend > $100/mo
  if (totalCurrentSpend > 100) {
    findings.push({
      toolId: 'credex',
      toolName: 'Credex Credit Marketplace',
      currentPlan: 'N/A',
      currentSpend: 0,
      recommendedAction: 'consider-credits',
      projectedSpend: 0,
      monthlySavings: 0,
      annualSavings: 0,
      reasoning:
        "Teams spending >$100/month on AI tools can typically save 20-40% by sourcing credits through Credex's discounted credit marketplace, which offers unused enterprise allocations at below-retail rates.",
      priority: 'medium',
    });
  }

  const totalAnnualSavings = totalMonthlySavings * 12;
  const credexRelevant = totalMonthlySavings > 500;
  const isAlreadyOptimal = totalMonthlySavings === 0;

  return {
    findings,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    credexRelevant,
    isAlreadyOptimal,
  };
}
