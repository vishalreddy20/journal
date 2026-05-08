'use client';

import { useState } from 'react';
import type { AuditResult, AuditInput } from '@/types/audit';
import SavingsHero from './SavingsHero';
import ToolRow from './ToolRow';
import ShareButton from './ShareButton';
import LeadCapture from './LeadCapture';

interface AuditResultsProps {
  auditResult: AuditResult;
  auditInput?: AuditInput;
  auditId: string | null;
  aiSummary?: string;
  readOnly?: boolean;
}

export default function AuditResults({
  auditResult,
  auditInput,
  auditId,
  aiSummary,
  readOnly = false,
}: AuditResultsProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const { findings, totalMonthlySavings, totalAnnualSavings, isAlreadyOptimal, credexRelevant } = auditResult;

  // Separate regular findings from the credits tip
  const actionFindings = findings.filter((f) => f.recommendedAction !== 'consider-credits');
  const creditsFinding = findings.find((f) => f.recommendedAction === 'consider-credits');

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-16">
      {/* Savings hero */}
      <SavingsHero
        totalMonthlySavings={totalMonthlySavings}
        totalAnnualSavings={totalAnnualSavings}
        isAlreadyOptimal={isAlreadyOptimal}
      />

      {/* AI Summary */}
      {(aiSummary || auditResult.aiSummary) && (
        <div className="glow-card p-6 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cyan-400 text-sm">🤖</span>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">AI Analysis</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {aiSummary || auditResult.aiSummary}
          </p>
        </div>
      )}

      {/* Credex CTA (for high-savings audits) */}
      {credexRelevant && !isAlreadyOptimal && (
        <div
          className="fade-in pulse-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,153,255,0.04))',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚀</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="font-syne text-lg font-bold text-white">
                  Ready to capture even more savings?
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full badge-credits">
                  Recommended for teams saving $500+/mo
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Credex sources discounted AI credits from companies that overforecast. Get the same
                tools at 20–40% below retail — no usage limits, no contracts.
              </p>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyan inline-block px-6 py-2.5 text-sm font-semibold no-underline"
                aria-label="Book a free Credex consultation"
                id="credex-cta-btn"
              >
                Book a Free Credex Consultation →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Per-tool breakdown */}
      {actionFindings.length > 0 && (
        <div className="fade-in">
          <h2 className="font-syne text-xl font-bold text-white mb-4">
            Per-Tool Breakdown
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({actionFindings.length} tool{actionFindings.length !== 1 ? 's' : ''} analyzed)
            </span>
          </h2>

          <div className="space-y-3">
            {/* High priority first */}
            {[...actionFindings]
              .sort((a, b) => {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map((finding, idx) => (
                <ToolRow key={`${finding.toolId}-${idx}`} finding={finding} />
              ))}
          </div>
        </div>
      )}

      {/* Credits finding */}
      {creditsFinding && !isAlreadyOptimal && (
        <div className="fade-in">
          <ToolRow finding={creditsFinding} />
        </div>
      )}

      {/* Context stats */}
      {auditInput && (
        <div className="grid grid-cols-3 gap-3 fade-in">
          {[
            { label: 'Tools audited', value: auditInput.tools.length },
            {
              label: 'Current spend',
              value: `$${auditResult.totalCurrentSpend.toFixed(0)}/mo`,
            },
            {
              label: 'Annual savings',
              value: `$${totalAnnualSavings.toFixed(0)}/yr`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center p-4 bg-slate-800/40 border border-slate-700 rounded-lg"
            >
              <p className="text-cyan-400 font-bold font-syne text-lg">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Share + Lead capture section */}
      {!readOnly && auditId && (
        <div className="space-y-4 fade-in">
          <ShareButton auditId={auditId} monthlySavings={totalMonthlySavings} />

          {!leadCaptured && (
            <button
              type="button"
              onClick={() => setShowLeadCapture(true)}
              className="btn-ghost w-full py-3.5 text-sm font-medium"
              aria-label="Save audit report via email"
              id="save-report-btn"
            >
              📧 Email Me This Report
            </button>
          )}

          {leadCaptured && (
            <p className="text-center text-green-400 text-sm">
              ✓ Report sent to your inbox!
            </p>
          )}
        </div>
      )}

      {/* Read-only share prompt */}
      {readOnly && (
        <div className="glow-card p-6 text-center fade-in">
          <p className="text-slate-300 text-sm mb-4">
            Want to audit your own AI spend?
          </p>
          <a
            href="/"
            className="btn-cyan inline-block px-8 py-3 text-sm font-semibold no-underline"
            aria-label="Run your own AI spend audit"
          >
            Run My Free Audit →
          </a>
          <p className="text-slate-600 text-xs mt-3">Free. No signup. 2 minutes.</p>
        </div>
      )}

      {/* Lead capture modal */}
      {showLeadCapture && (
        <LeadCapture
          auditId={auditId}
          isHighSavings={credexRelevant}
          monthlySavings={totalMonthlySavings}
          onClose={() => setShowLeadCapture(false)}
          onSuccess={() => setLeadCaptured(true)}
        />
      )}
    </div>
  );
}
