'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FormState, ToolFormState, AuditInput } from '@/types/audit';
import { TOOL_NAMES, TOOL_DESCRIPTIONS, TOOL_PLAN_OPTIONS, type ToolId } from '@/lib/pricingData';

const TOOL_IDS: ToolId[] = [
  'cursor',
  'githubCopilot',
  'claude',
  'chatgpt',
  'anthropicApi',
  'openaiApi',
  'gemini',
  'windsurf',
];

const TOOL_ICONS: Record<ToolId, string> = {
  cursor: '⚡',
  githubCopilot: '🐙',
  claude: '🧠',
  chatgpt: '💬',
  anthropicApi: '🔌',
  openaiApi: '🔑',
  gemini: '♊',
  windsurf: '🌊',
};

const DEFAULT_FORM: FormState = {
  step: 1,
  teamSize: '',
  useCase: '',
  monthlyBudget: '',
  tools: {},
};

const STORAGE_KEY = 'spendlens_form_state';

interface AuditFormProps {
  onAuditComplete: (auditId: string | null, result: AuditInput) => void;
  onAuditLoading: (loading: boolean) => void;
}

export default function AuditForm({ onAuditComplete, onAuditLoading }: AuditFormProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FormState;
        setForm(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist state on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Ignore storage errors
    }
  }, [form]);

  const updateTool = useCallback((toolId: ToolId, updates: Partial<ToolFormState>) => {
    setForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolId]: {
          active: false,
          plan: TOOL_PLAN_OPTIONS[toolId][0]?.value ?? '',
          monthlySpend: '',
          seats: '1',
          ...prev.tools[toolId],
          ...updates,
        },
      },
    }));
  }, []);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.teamSize) newErrors.teamSize = 'Please select your team size';
    if (!form.useCase) newErrors.useCase = 'Please select a use case';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const activeTools = TOOL_IDS.filter((id) => form.tools[id]?.active);
    if (activeTools.length === 0) {
      setErrors({ tools: 'Please add at least one tool to audit' });
      return false;
    }
    setErrors({});
    return true;
  };

  const goNext = () => {
    if (form.step === 1 && !validateStep1()) return;
    if (form.step === 2 && !validateStep2()) return;
    setForm((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const goBack = () => setForm((prev) => ({ ...prev, step: prev.step - 1 }));

  const getActiveTools = () => TOOL_IDS.filter((id) => form.tools[id]?.active);

  const getTotalSpend = () => {
    return TOOL_IDS.filter((id) => form.tools[id]?.active).reduce((sum, id) => {
      return sum + (parseFloat(form.tools[id]?.monthlySpend || '0') || 0);
    }, 0);
  };

  const buildAuditInput = (): AuditInput => {
    const teamSizeMap: Record<string, number> = {
      '1': 1, '2-5': 3, '6-15': 10, '16-50': 30, '51-100': 75, '100+': 150,
    };

    return {
      tools: TOOL_IDS.filter((id) => form.tools[id]?.active).map((id) => {
        const tool = form.tools[id];
        return {
          toolId: id,
          plan: tool?.plan || 'unknown',
          monthlySpend: parseFloat(tool?.monthlySpend || '0') || 0,
          seats: parseInt(tool?.seats || '1', 10) || 1,
        };
      }),
      teamSize: teamSizeMap[form.teamSize] || 1,
      useCase: form.useCase,
      totalBudget: getTotalSpend(),
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    onAuditLoading(true);

    const auditInput = buildAuditInput();

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditInput }),
      });

      if (!res.ok) throw new Error('Audit failed');

      const data = await res.json();
      onAuditComplete(data.auditId, auditInput);

      // Clear localStorage after successful audit
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    } catch (err) {
      console.error('Audit error:', err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
      onAuditLoading(false);
    }
  };

  const teamSizeOptions = ['1', '2-5', '6-15', '16-50', '51-100', '100+'];
  const useCaseOptions = [
    { value: 'coding', label: 'Coding & Development' },
    { value: 'writing', label: 'Writing & Content' },
    { value: 'data', label: 'Data Analysis' },
    { value: 'research', label: 'Research' },
    { value: 'mixed', label: 'Mixed / Multiple' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`step-dot ${
                step === form.step ? 'active' : step < form.step ? 'completed' : 'pending'
              }`}
            >
              {step < form.step ? '✓' : step}
            </div>
            {step < 3 && (
              <div
                className="h-px w-12 mx-1 transition-all duration-300"
                style={{
                  background:
                    step < form.step
                      ? 'rgba(0,212,255,0.5)'
                      : 'rgba(100,116,139,0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-8">
        <div
          className="progress-fill"
          style={{ width: `${((form.step - 1) / 2) * 100}%` }}
        />
      </div>

      {/* Step 1: Team Context */}
      {form.step === 1 && (
        <div className="glow-card p-8 fade-in">
          <h2 className="font-syne text-2xl font-bold mb-2">Team Context</h2>
          <p className="text-slate-400 text-sm mb-8">Tell us about your team so we can tailor the audit.</p>

          {/* Team size */}
          <div className="mb-6">
            <label htmlFor="teamSize" className="block text-sm font-medium text-slate-300 mb-3">
              Team size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {teamSizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, teamSize: size }))}
                  className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    form.teamSize === size
                      ? 'bg-cyan-400/20 border border-cyan-400 text-cyan-400'
                      : 'bg-slate-800/60 border border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                  id={`teamSize-${size}`}
                  aria-pressed={form.teamSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.teamSize && <p className="text-red-400 text-xs mt-2">{errors.teamSize}</p>}
          </div>

          {/* Use case */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Primary use case
            </label>
            <div className="space-y-2">
              {useCaseOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    form.useCase === value
                      ? 'bg-cyan-400/10 border border-cyan-400/40'
                      : 'bg-slate-800/40 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="useCase"
                    value={value}
                    checked={form.useCase === value}
                    onChange={(e) => setForm((p) => ({ ...p, useCase: e.target.value }))}
                    className="accent-cyan-400"
                    id={`useCase-${value}`}
                  />
                  <span className="text-sm text-slate-200">{label}</span>
                </label>
              ))}
            </div>
            {errors.useCase && <p className="text-red-400 text-xs mt-2">{errors.useCase}</p>}
          </div>

          {/* Monthly budget */}
          <div className="mb-8">
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-slate-300 mb-3">
              Estimated total monthly AI budget (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                id="monthlyBudget"
                type="number"
                min="0"
                placeholder="0"
                value={form.monthlyBudget}
                onChange={(e) => setForm((p) => ({ ...p, monthlyBudget: e.target.value }))}
                className="input-dark w-full pl-8 pr-4 py-3 text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className="btn-cyan w-full py-4 text-base font-semibold"
            aria-label="Continue to tool inventory"
          >
            Continue → Add Your Tools
          </button>
        </div>
      )}

      {/* Step 2: Tool Inventory */}
      {form.step === 2 && (
        <div className="fade-in">
          <div className="glow-card p-8 mb-4">
            <h2 className="font-syne text-2xl font-bold mb-2">Tool Inventory</h2>
            <p className="text-slate-400 text-sm">
              Toggle each tool your team uses and fill in your actual spend.
            </p>
          </div>

          {errors.tools && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.tools}</p>
            </div>
          )}

          <div className="space-y-3">
            {TOOL_IDS.map((toolId) => {
              const toolState = form.tools[toolId];
              const isActive = toolState?.active ?? false;
              const plans = TOOL_PLAN_OPTIONS[toolId];

              return (
                <div key={toolId} className={`tool-card ${isActive ? 'active' : ''}`}>
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between"
                    onClick={() => updateTool(toolId, { active: !isActive })}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={TOOL_NAMES[toolId]}>
                        {TOOL_ICONS[toolId]}
                      </span>
                      <div>
                        <p className="font-medium text-white text-sm">{TOOL_NAMES[toolId]}</p>
                        <p className="text-xs text-slate-500">{TOOL_DESCRIPTIONS[toolId]}</p>
                      </div>
                    </div>

                    <label className="toggle" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => updateTool(toolId, { active: e.target.checked })}
                        aria-label={`Toggle ${TOOL_NAMES[toolId]}`}
                        id={`toggle-${toolId}`}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  {/* Expanded fields when active */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Plan */}
                      <div>
                        <label
                          htmlFor={`plan-${toolId}`}
                          className="block text-xs text-slate-400 mb-1.5"
                        >
                          Plan
                        </label>
                        <select
                          id={`plan-${toolId}`}
                          value={toolState?.plan || plans[0]?.value}
                          onChange={(e) => updateTool(toolId, { plan: e.target.value })}
                          className="select-dark w-full py-2 px-3 text-sm"
                          aria-label={`Plan for ${TOOL_NAMES[toolId]}`}
                        >
                          {plans.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Monthly spend */}
                      <div>
                        <label
                          htmlFor={`spend-${toolId}`}
                          className="block text-xs text-slate-400 mb-1.5"
                        >
                          Monthly spend
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                          <input
                            id={`spend-${toolId}`}
                            type="number"
                            min="0"
                            placeholder="0"
                            value={toolState?.monthlySpend || ''}
                            onChange={(e) => updateTool(toolId, { monthlySpend: e.target.value })}
                            className="input-dark w-full pl-7 pr-3 py-2 text-sm"
                            aria-label={`Monthly spend for ${TOOL_NAMES[toolId]}`}
                          />
                        </div>
                      </div>

                      {/* Seats */}
                      {toolId !== 'anthropicApi' && toolId !== 'openaiApi' && (
                        <div>
                          <label
                            htmlFor={`seats-${toolId}`}
                            className="block text-xs text-slate-400 mb-1.5"
                          >
                            Seats / users
                          </label>
                          <input
                            id={`seats-${toolId}`}
                            type="number"
                            min="1"
                            placeholder="1"
                            value={toolState?.seats || '1'}
                            onChange={(e) => updateTool(toolId, { seats: e.target.value })}
                            className="input-dark w-full px-3 py-2 text-sm"
                            aria-label={`Number of seats for ${TOOL_NAMES[toolId]}`}
                          />
                        </div>
                      )}

                      {/* API-specific fields */}
                      {toolId === 'openaiApi' && (
                        <div className="sm:col-span-3 text-xs text-slate-500">
                          Select your primary model above — the audit will evaluate model-level cost efficiency.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={goBack}
              className="btn-ghost flex-1 py-3 text-sm font-medium"
              aria-label="Go back to team context"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="btn-cyan flex-[2] py-3 text-sm font-semibold"
              aria-label="Continue to review"
            >
              Review & Audit →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {form.step === 3 && (
        <div className="glow-card p-8 fade-in">
          <h2 className="font-syne text-2xl font-bold mb-2">Review & Audit</h2>
          <p className="text-slate-400 text-sm mb-8">Confirm your tools and run the audit.</p>

          {/* Summary */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
              <span className="text-slate-400">Team size</span>
              <span className="text-white font-medium">{form.teamSize} people</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
              <span className="text-slate-400">Use case</span>
              <span className="text-white font-medium capitalize">{form.useCase}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
              <span className="text-slate-400">Active tools</span>
              <span className="text-white font-medium">{getActiveTools().length} tools</span>
            </div>
          </div>

          {/* Active tools list */}
          <div className="space-y-2 mb-8">
            {getActiveTools().map((toolId) => {
              const tool = form.tools[toolId];
              const plans = TOOL_PLAN_OPTIONS[toolId];
              const planLabel = plans.find((p) => p.value === tool?.plan)?.label ?? tool?.plan ?? '—';
              return (
                <div
                  key={toolId}
                  className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span>{TOOL_ICONS[toolId]}</span>
                    <div>
                      <p className="text-sm text-white">{TOOL_NAMES[toolId]}</p>
                      <p className="text-xs text-slate-500">{planLabel}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-cyan-400">
                    ${parseFloat(tool?.monthlySpend || '0').toFixed(0)}/mo
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-slate-800/60 rounded-lg mb-8 border border-slate-700">
            <span className="text-slate-300 font-medium">Total monthly spend</span>
            <span className="text-xl font-bold text-white font-syne">${getTotalSpend().toFixed(0)}/mo</span>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="btn-ghost flex-1 py-4 text-sm font-medium"
              aria-label="Go back to tool inventory"
              disabled={submitting}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-cyan flex-[2] py-4 text-base font-bold"
              aria-label="Run the AI spend audit"
              id="run-audit-btn"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Run My Audit →'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
