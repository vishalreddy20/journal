'use client';

import { useState } from 'react';

interface LeadCaptureProps {
  auditId: string | null;
  isHighSavings: boolean;
  monthlySavings: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadCapture({
  auditId,
  isHighSavings,
  monthlySavings,
  onClose,
  onSuccess,
}: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return; }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          website, // honeypot — bots fill this
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className="glow-card p-8 w-full max-w-md pulse-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-syne text-xl font-bold text-white mb-2">Report sent!</h3>
            <p className="text-slate-400 text-sm">Check your inbox for your full audit report.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="modal-title" className="font-syne text-xl font-bold text-white mb-1">
                  Save your audit report
                </h2>
                <p className="text-slate-400 text-sm">
                  Get a copy emailed to you. Free. No spam. Unsubscribe anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors text-xl ml-4 flex-shrink-0"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Savings preview */}
            <div className="bg-cyan-400/8 border border-cyan-400/20 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-1">Your potential savings</p>
              <p className="text-cyan-400 text-2xl font-bold font-syne">
                ${Math.round(monthlySavings)}/month
              </p>
              {isHighSavings && (
                <p className="text-cyan-300 text-xs mt-2">
                  🔥 A Credex advisor will follow up within 48 hours to help you capture these savings.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from humans, visible to bots */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="input-dark w-full px-4 py-3 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="lead-company" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Company name <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    id="lead-company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="input-dark w-full px-4 py-3 text-sm"
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <label htmlFor="lead-role" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Your role <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    id="lead-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Engineering Manager"
                    className="input-dark w-full px-4 py-3 text-sm"
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-cyan w-full py-3.5 text-sm font-semibold"
                aria-label="Submit email to save audit report"
                id="lead-submit-btn"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Email Me My Report →'
                )}
              </button>
            </form>

            <p className="text-center text-slate-600 text-xs mt-4">
              We never sell your data. Your email is only stored if you submit it.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
