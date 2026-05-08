import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AuditResults from '@/components/AuditResults';
import type { StoredAudit } from '@/types/audit';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchAudit(id: string): Promise<StoredAudit | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/audit/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await fetchAudit(id);

  if (!audit) {
    return {
      title: 'Audit Not Found — SpendLens',
    };
  }

  const savings = Math.round(Number(audit.total_monthly_savings ?? 0));
  const annualSavings = Math.round(Number(audit.total_annual_savings ?? 0));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlens.vercel.app';

  return {
    title: `AI Spend Audit — $${savings}/mo in savings found — SpendLens`,
    description: `This team could save $${annualSavings}/year on AI tools. Run your free audit at SpendLens.`,
    openGraph: {
      title: `AI Spend Audit — $${savings}/mo in savings found`,
      description: `This team could save $${annualSavings}/year on AI tools.`,
      type: 'website',
      url: `${appUrl}/audit/${id}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SpendLens Audit Results' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit — $${savings}/mo in savings found`,
      description: `This team could save $${annualSavings}/year on AI tools.`,
      images: ['/og-image.png'],
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await fetchAudit(id);

  if (!audit) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <span className="text-cyan-400 text-xl">◆</span>
            <span className="font-syne font-bold text-lg text-white">SpendLens</span>
            <span className="text-slate-500 text-xs border border-slate-700 px-2 py-0.5 rounded ml-1">
              by Credex
            </span>
          </a>
          <a
            href="/"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            aria-label="Run your own audit"
          >
            Run My Audit →
          </a>
        </div>
      </nav>

      {/* Results */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-slate-500 text-sm mb-2">Shared AI Spend Audit</p>
            <h1 className="font-syne text-3xl font-bold text-white">
              AI Spend Audit Results
            </h1>
            <p className="text-slate-500 text-xs mt-2">
              Company name and email not included · Based on official vendor pricing
            </p>
          </div>

          <AuditResults
            auditResult={audit.audit_result}
            auditInput={audit.tool_inputs}
            auditId={id}
            aiSummary={audit.ai_summary ?? undefined}
            readOnly={true}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          SpendLens by{' '}
          <a href="https://credex.rocks" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Credex
          </a>{' '}
          — AI infrastructure credits marketplace
        </p>
      </footer>
    </main>
  );
}
