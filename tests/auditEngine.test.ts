import { describe, it, expect } from 'vitest';
import { runAudit } from '../lib/auditEngine';
import type { AuditInput } from '../types/audit';

describe('Audit Engine — Core Rules', () => {
  it('recommends downgrading Cursor Business to Pro for <5 seats', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: 'coding',
      totalBudget: 80,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'cursor');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.recommendedPlan).toBe('Pro');
    expect(finding?.monthlySavings).toBe(40); // 2 seats × ($40 - $20)
  });

  it('recommends Cursor Hobby for non-coding use case on Pro (1 seat)', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'writing',
      totalBudget: 20,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'cursor');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.projectedSpend).toBe(0);
    expect(finding?.monthlySavings).toBe(20);
  });

  it('recommends GitHub Copilot Individual for 1-2 users on Business plan', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'githubCopilot', plan: 'business', monthlySpend: 38, seats: 2 }],
      teamSize: 2,
      useCase: 'coding',
      totalBudget: 38,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'githubCopilot');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.recommendedPlan).toBe('Individual');
    expect(finding?.monthlySavings).toBe(18); // 2 × ($19 - $10)
  });

  it('flags redundancy when both Claude Pro and ChatGPT Plus are active', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 },
        { toolId: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 },
      ],
      teamSize: 1,
      useCase: 'writing',
      totalBudget: 40,
    };
    const result = runAudit(input);
    const chatgptFinding = result.findings.find((f) => f.toolId === 'chatgpt');
    expect(chatgptFinding?.recommendedAction).toBe('switch');
    expect(chatgptFinding?.reasoning).toContain('redundant');
  });

  it('recommends Pro plan when Claude Team has <5 users', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'claude', plan: 'team', monthlySpend: 90, seats: 3 }],
      teamSize: 3,
      useCase: 'mixed',
      totalBudget: 90,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'claude');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.recommendedPlan).toBe('Pro');
    expect(finding?.monthlySavings).toBe(30); // 3 × ($30 - $20)
  });

  it('sets credexRelevant = true when monthly savings exceed $500', () => {
    // cursor business 4 seats: 4×$20=$80 savings
    // copilot enterprise 19 seats (<20 rule): 19×$20=$380 savings
    // claude max 4 seats, writing use: 4×$80=$320 savings → total $780
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', plan: 'business', monthlySpend: 160, seats: 4 },
        { toolId: 'githubCopilot', plan: 'enterprise', monthlySpend: 741, seats: 19 },
        { toolId: 'claude', plan: 'max', monthlySpend: 400, seats: 4 },
      ],
      teamSize: 19,
      useCase: 'writing',
      totalBudget: 1301,
    };
    const result = runAudit(input);
    expect(result.credexRelevant).toBe(true);
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  it('sets isAlreadyOptimal = true when no savings found', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
      totalBudget: 0,
    };
    const result = runAudit(input);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('calculates total monthly and annual savings correctly', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }, // saves $40
        { toolId: 'githubCopilot', plan: 'business', monthlySpend: 38, seats: 2 }, // saves $18
      ],
      teamSize: 2,
      useCase: 'coding',
      totalBudget: 118,
    };
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(58); // $40 + $18
    expect(result.totalAnnualSavings).toBe(696); // $58 × 12
  });
});

describe('Audit Engine — Additional Scenarios', () => {
  it('recommends GitHub Copilot Enterprise downgrade for <20 users', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'githubCopilot', plan: 'enterprise', monthlySpend: 390, seats: 10 }],
      teamSize: 10,
      useCase: 'coding',
      totalBudget: 390,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'githubCopilot');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.recommendedPlan).toBe('Business');
    expect(finding?.monthlySavings).toBe(200); // 10 × ($39 - $19)
  });

  it('flags Windsurf Team for <5 seats', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'windsurf', plan: 'team', monthlySpend: 105, seats: 3 }],
      teamSize: 3,
      useCase: 'coding',
      totalBudget: 105,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'windsurf');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.monthlySavings).toBe(60); // 3 × ($35 - $15)
  });

  it('detects Gemini Advanced + Claude Pro overlap', () => {
    const input: AuditInput = {
      tools: [
        { toolId: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 },
        { toolId: 'gemini', plan: 'advanced', monthlySpend: 19.99, seats: 1 },
      ],
      teamSize: 1,
      useCase: 'writing',
      totalBudget: 39.99,
    };
    const result = runAudit(input);
    const geminiFinding = result.findings.find((f) => f.toolId === 'gemini');
    expect(geminiFinding?.recommendedAction).toBe('switch');
  });

  it('adds credits finding for spend > $100/month', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'cursor', plan: 'pro', monthlySpend: 200, seats: 10 }],
      teamSize: 10,
      useCase: 'coding',
      totalBudget: 200,
    };
    const result = runAudit(input);
    const creditsFinding = result.findings.find((f) => f.recommendedAction === 'consider-credits');
    expect(creditsFinding).toBeDefined();
    expect(creditsFinding?.reasoning).toContain('Credex');
  });

  it('does NOT add credits finding for spend <= $100/month', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'cursor', plan: 'hobby', monthlySpend: 0, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
      totalBudget: 0,
    };
    const result = runAudit(input);
    const creditsFinding = result.findings.find((f) => f.recommendedAction === 'consider-credits');
    expect(creditsFinding).toBeUndefined();
  });

  it('recommends Claude Max downgrade for writing teams with >1 person', () => {
    const input: AuditInput = {
      tools: [{ toolId: 'claude', plan: 'max', monthlySpend: 300, seats: 3 }],
      teamSize: 3,
      useCase: 'writing',
      totalBudget: 300,
    };
    const result = runAudit(input);
    const finding = result.findings.find((f) => f.toolId === 'claude');
    expect(finding?.recommendedAction).toBe('downgrade');
    expect(finding?.monthlySavings).toBe(240); // 3 × ($100 - $20)
  });
});
