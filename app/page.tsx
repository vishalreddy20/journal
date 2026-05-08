'use client';

import { useState, useRef } from 'react';
import AuditForm from '@/components/AuditForm';
import AuditResults from '@/components/AuditResults';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type { AuditInput, AuditResult } from '@/types/audit';

interface AuditData {
  auditId: string | null;
  auditResult: AuditResult;
  auditInput: AuditInput;
  aiSummary?: string;
}

export default function HomePage() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAuditComplete = async (auditId: string | null, auditInput: AuditInput) => {
    // Fetch the full result from the API (which ran the engine server-side)
    if (auditId) {
      try {
        const res = await fetch(`/api/audit/${auditId}`);
        const data = await res.json();
        setAuditData({
          auditId,
          auditResult: data.audit_result,
          auditInput,
          aiSummary: data.ai_summary,
        });
      } catch {
        // Fallback: run audit locally for display
        const { runAudit } = await import('@/lib/auditEngine');
        const result = runAudit(auditInput);
        setAuditData({ auditId, auditResult: result, auditInput });
      }
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen grid-bg overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #00D4FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #0099ff 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 text-2xl">◆</span>
              <span className="font-syne font-bold text-xl">SpendLens</span>
              <span className="text-slate-500 text-xs border border-slate-700 px-2 py-0.5 rounded ml-1">
                by Credex
              </span>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 text-sm hover:text-cyan-400 transition-colors"
              aria-label="Visit Credex website"
            >
              credex.rocks →
            </a>
          </nav>

          {/* Hero content */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/8 text-cyan-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Free audit — no signup required
            </div>

            <h1 className="font-syne text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Find where your AI</span>
              <br />
              <span className="gradient-text">budget is leaking.</span>
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Free 2-minute audit for engineering teams. Input your tools, get a
              personalized breakdown, and see exactly where you&apos;re overpaying.
            </p>

            <button
              type="button"
              onClick={scrollToForm}
              className="btn-cyan px-10 py-4 text-lg font-bold"
              aria-label="Start the AI spend audit"
              id="hero-cta-btn"
            >
              Audit My AI Spend →
            </button>

            {/* Social proof — MOCKED, replace with real quotes before launch */}
            <p className="text-slate-600 text-sm mt-6">
              {/* MOCK: replace with real testimonial data */}
              Used by 200+ engineering teams to identify AI overspend
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            {[
              { number: '$840', label: 'Avg monthly savings found' },
              { number: '8', label: 'AI tools audited' },
              { number: '2 min', label: 'Time to complete' },
            ].map(({ number, label }) => (
              <div key={label} className="text-center">
                <p className="font-syne text-2xl font-bold text-cyan-400">{number}</p>
                <p className="text-slate-500 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-syne text-2xl font-bold text-center mb-12 text-slate-300">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                step: '01',
                title: 'Input your tools',
                desc: 'Tell us which AI tools your team uses, your current plan, and monthly spend.',
              },
              {
                icon: '🔍',
                step: '02',
                title: 'Get your audit',
                desc: 'Our engine analyzes your stack against 50+ pricing rules and flags overspend.',
              },
              {
                icon: '💰',
                step: '03',
                title: 'Save money',
                desc: 'See exact savings per tool with one-sentence rationales you can show your CFO.',
              },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="glow-card p-6 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-xs text-cyan-400 font-semibold tracking-widest mb-2">{step}</div>
                <h3 className="font-syne text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Form Section */}
      <section id="audit-form" className="py-16 px-6" ref={formRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-syne text-3xl font-bold text-white mb-3">
              Start Your Free Audit
            </h2>
            <p className="text-slate-400">
              Takes 2 minutes. No signup required. Form auto-saves.
            </p>
          </div>

          <AuditForm
            onAuditComplete={handleAuditComplete}
            onAuditLoading={setLoading}
          />
        </div>
      </section>

      {/* Results Section */}
      {(loading || auditData) && (
        <section
          id="audit-results"
          className="py-16 px-6 border-t border-slate-800"
          ref={resultsRef}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-syne text-3xl font-bold text-white mb-2">
                Your Audit Results
              </h2>
              <p className="text-slate-500 text-sm">
                Based on official vendor pricing — all figures cited and verifiable
              </p>
            </div>

            {loading ? (
              <div className="max-w-2xl mx-auto">
                <LoadingSkeleton />
              </div>
            ) : auditData ? (
              <AuditResults
                auditResult={auditData.auditResult}
                auditInput={auditData.auditInput}
                auditId={auditData.auditId}
                aiSummary={auditData.aiSummary}
              />
            ) : null}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          SpendLens by{' '}
          <a href="https://credex.rocks" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Credex
          </a>{' '}
          — AI infrastructure credits marketplace. Pricing data verified May 2026.
        </p>
      </footer>
    </main>
  );
}
