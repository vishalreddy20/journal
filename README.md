# SpendLens — AI Spend Audit for Startups

Find where your AI budget is leaking. Free 2-minute audit for engineering managers and startup founders.

**Live demo**: https://journal-five-lake.vercel.app  
**Built for**: Credex Web Development Intern Round 1 Assignment  
**Stack**: Next.js 14 · TypeScript (strict) · Tailwind CSS · Supabase · Resend · Anthropic Claude

---

## Screenshots & Demo

Landing page · Audit form · Results with savings breakdown  
<div align="center">
  <img src="https://raw.githubusercontent.com/vishalreddy20/journal/master/public/demo.webp" alt="SpendLens Demo Walkthrough" width="800"/>
</div>

---

## Quick Start

```bash
git clone https://github.com/vishalreddy20/journal.git
cd journal
npm install
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000

## Run Tests

```bash
npm run test        # vitest run (28 tests)
npm run test:watch  # vitest watch mode
```

## Deploy to Vercel

```bash
npx vercel --prod
# Add all .env.local keys in Vercel Dashboard → Settings → Environment Variables
# Update NEXT_PUBLIC_APP_URL to your live URL
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI summary (claude-haiku-3) |
| `NEXT_PUBLIC_APP_URL` | App base URL (localhost:3000 dev, production URL in prod) |

---

## Supabase Setup

Run this SQL in your Supabase dashboard → SQL Editor:

```sql
CREATE TABLE audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tool_inputs JSONB NOT NULL,
  audit_result JSONB NOT NULL,
  ai_summary TEXT,
  total_monthly_savings DECIMAL(10,2),
  total_annual_savings DECIMAL(10,2),
  total_current_spend DECIMAL(10,2),
  is_credex_relevant BOOLEAN DEFAULT FALSE,
  is_already_optimal BOOLEAN DEFAULT FALSE
);

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size TEXT,
  high_savings_case BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert for all" ON audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select by id" ON audits FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON leads FOR INSERT WITH CHECK (true);
```

---

## Key Design Decisions

### 1. Next.js App Router over Pages Router
Server Components let me fetch audit data for OG tags at build/request time without client-side waterfalls. Critical for the shareable `/audit/[id]` URLs — the `generateMetadata` function can `await` the Supabase fetch and produce accurate `og:title` with real savings numbers before the HTML is sent to the browser.

### 2. Hardcoded audit rules over LLM-generated audit logic
The audit math needs to be defensible and auditable by a finance person. LLMs hallucinate numbers and can't be unit-tested. Each rule in `lib/auditEngine.ts` has a one-sentence rationale that cites the specific plan-tier value proposition. This makes the output trustworthy to engineering managers showing results to their CFOs.

### 3. Supabase over Firebase
Postgres gives proper relational joins between `audits` and `leads` tables — clean foreign key from lead to audit. Firebase's document model would make "show me all leads for audits that found >$500 savings" awkward without a denormalized field. The Supabase admin dashboard is also immediately useful as a CRM for the Credex sales team.

### 4. In-memory rate limiting over Redis
For MVP scale, an in-memory Map is zero-infrastructure and deploys instantly. Documented trade-off: resets on cold start, doesn't work across serverless instances at high traffic. Upstash Redis is the obvious production upgrade — one env var swap.

### 5. Email gate after value, not before
The audit result is shown immediately on form submission. The email modal appears below the results, not as a gate blocking them. This aligns with the product brief and increases conversion: users have already seen real savings numbers before being asked for their email.

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system diagram and data flow.

---

## File Structure

```
spendlens/
├── app/
│   ├── layout.tsx              # Root layout: Syne + DM Sans fonts, metadata
│   ├── page.tsx                # Landing page + audit form + results
│   ├── globals.css             # Design system: dark luxury fintech
│   └── api/
│       ├── audit/route.ts      # POST: run audit, save to Supabase, AI summary
│       ├── audit/[id]/route.ts # GET: fetch public audit by UUID
│       └── lead/route.ts       # POST: capture email, honeypot, Resend email
├── components/
│   ├── AuditForm.tsx           # 3-step form with localStorage persistence
│   ├── AuditResults.tsx        # Results orchestration component
│   ├── SavingsHero.tsx         # Animated counter for savings number
│   ├── ToolRow.tsx             # Per-tool audit finding card
│   ├── LeadCapture.tsx         # Email capture modal (shown after results)
│   ├── ShareButton.tsx         # Copy link + Twitter share
│   └── LoadingSkeleton.tsx     # Shimmer loading state
├── lib/
│   ├── auditEngine.ts          # Deterministic audit rules (50+ rules)
│   ├── pricingData.ts          # Typed pricing constants (8 tools)
│   ├── anthropic.ts            # AI summary with graceful fallback
│   ├── supabase.ts             # Supabase clients (anon + admin)
│   └── rateLimit.ts            # In-memory rate limiter
├── types/
│   └── audit.ts                # TypeScript interfaces
└── tests/
    ├── auditEngine.test.ts     # 14 unit tests
    └── pricingData.test.ts     # 14 validation tests
```
