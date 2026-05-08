// Core TypeScript interfaces for SpendLens audit system

export interface ToolInput {
  toolId: string;
  plan: string;
  monthlySpend: number; // actual spend user entered
  seats: number;
  useCase?: string;
}

export interface AuditFinding {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: 'downgrade' | 'switch' | 'optimize' | 'already-optimal' | 'consider-credits';
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string; // 1 sentence, finance-literate
  priority: 'high' | 'medium' | 'low';
}

export interface AuditResult {
  findings: AuditFinding[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  credexRelevant: boolean; // true if savings > $500/mo
  isAlreadyOptimal: boolean;
  aiSummary?: string;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: string;
  totalBudget: number;
}

export interface FormState {
  step: number;
  teamSize: string;
  useCase: string;
  monthlyBudget: string;
  tools: Record<string, ToolFormState>;
}

export interface ToolFormState {
  active: boolean;
  plan: string;
  monthlySpend: string;
  seats: string;
  tokensPerMonth?: string;
  primaryModel?: string;
}

export interface StoredAudit {
  id: string;
  audit_result: AuditResult;
  ai_summary: string | null;
  total_monthly_savings: number;
  total_annual_savings: number;
  tool_inputs: AuditInput;
}
