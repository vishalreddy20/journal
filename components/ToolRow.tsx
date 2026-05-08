'use client';

import type { AuditFinding } from '@/types/audit';

const ACTION_LABELS: Record<AuditFinding['recommendedAction'], string> = {
  downgrade: 'Downgrade Plan',
  switch: 'Switch Tool',
  optimize: 'Optimize Usage',
  'already-optimal': 'Already Optimal',
  'consider-credits': 'Consider Credits',
};

const ACTION_COLORS: Record<AuditFinding['recommendedAction'], string> = {
  downgrade: 'action-downgrade',
  switch: 'action-switch',
  optimize: 'action-optimize',
  'already-optimal': 'action-optimal',
  'consider-credits': 'action-credits',
};

const ACTION_ICONS: Record<AuditFinding['recommendedAction'], string> = {
  downgrade: '⬇',
  switch: '↔',
  optimize: '⚡',
  'already-optimal': '✓',
  'consider-credits': '💡',
};

interface ToolRowProps {
  finding: AuditFinding;
}

export default function ToolRow({ finding }: ToolRowProps) {
  const isOptimal = finding.recommendedAction === 'already-optimal';
  const isCredits = finding.recommendedAction === 'consider-credits';

  return (
    <div
      className={`glow-card p-5 fade-in ${isCredits ? 'border-cyan-400/40' : ''}`}
      role="article"
      aria-label={`Audit finding for ${finding.toolName}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white text-base">{finding.toolName}</h3>
            {!isCredits && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                {finding.currentPlan}
              </span>
            )}
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                finding.priority === 'high'
                  ? 'badge-high'
                  : finding.priority === 'medium'
                  ? 'badge-medium'
                  : isCredits
                  ? 'badge-credits'
                  : 'badge-optimal'
              }`}
            >
              {finding.priority === 'high' ? 'High priority' : finding.priority === 'medium' ? 'Medium' : isCredits ? 'Opportunity' : 'Optimal'}
            </span>
          </div>

          {/* Recommendation */}
          <div className={`flex items-center gap-2 mt-2 text-sm ${ACTION_COLORS[finding.recommendedAction]}`}>
            <span>{ACTION_ICONS[finding.recommendedAction]}</span>
            <span className="font-medium">{ACTION_LABELS[finding.recommendedAction]}</span>
            {finding.recommendedPlan && (
              <>
                <span className="text-slate-600">→</span>
                <span>{finding.recommendedPlan}</span>
              </>
            )}
            {finding.recommendedTool && (
              <>
                <span className="text-slate-600">→</span>
                <span>{finding.recommendedTool}</span>
              </>
            )}
          </div>
        </div>

        {/* Savings badge (right side) */}
        {finding.monthlySavings > 0 && !isCredits && (
          <div className="text-right flex-shrink-0">
            <p className="text-green-400 font-bold text-lg font-syne">
              +${finding.monthlySavings.toFixed(0)}/mo
            </p>
            <p className="text-slate-500 text-xs">${(finding.monthlySavings * 12).toFixed(0)}/yr</p>
          </div>
        )}
      </div>

      {/* Spend comparison (not for credits finding) */}
      {!isCredits && !isOptimal && finding.monthlySavings > 0 && (
        <div className="flex items-center gap-3 mb-4 text-sm">
          <div className="flex-1 text-center p-2 bg-slate-800/60 rounded-lg">
            <p className="text-slate-500 text-xs mb-0.5">Current</p>
            <p className="text-white font-semibold">${finding.currentSpend.toFixed(0)}/mo</p>
          </div>
          <div className="text-slate-500 text-lg">→</div>
          <div className="flex-1 text-center p-2 bg-green-400/8 border border-green-400/20 rounded-lg">
            <p className="text-slate-500 text-xs mb-0.5">After change</p>
            <p className="text-green-400 font-semibold">${finding.projectedSpend.toFixed(0)}/mo</p>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <p className="text-slate-400 text-sm italic leading-relaxed">
        &ldquo;{finding.reasoning}&rdquo;
      </p>

      {/* Credits special CTA */}
      {isCredits && (
        <div className="mt-3">
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            aria-label="Learn about Credex discounted AI credits"
          >
            Learn about Credex credits →
          </a>
        </div>
      )}
    </div>
  );
}
