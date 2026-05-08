# SpendLens — Architecture

## System Diagram

```mermaid
graph TB
    subgraph Browser["User Browser"]
        Landing[Landing Page]
        Form[AuditForm Component]
        Results[AuditResults Component]
        Modal[LeadCapture Modal]
    end

    subgraph NextJS["Next.js App (Vercel Serverless)"]
        AuditRoute[POST /api/audit]
        AuditGetRoute[GET /api/audit/:id]
        LeadRoute[POST /api/lead]
        AuditPage[/audit/:id page]
    end

    subgraph External["External Services"]
        Supabase[(Supabase Postgres)]
        Anthropic[Anthropic Claude API]
        Resend[Resend Email]
    end

    Landing -->|"CTA click"| Form
    Form -->|"POST auditInput"| AuditRoute
    AuditRoute -->|"runAudit()"| AuditRoute
    AuditRoute -->|"generateAuditSummary()"| Anthropic
    AuditRoute -->|"INSERT audit"| Supabase
    AuditRoute -->|"{ auditId, result, summary }"| Results
    Results -->|"show modal"| Modal
    Modal -->|"POST email"| LeadRoute
    LeadRoute -->|"INSERT lead"| Supabase
    LeadRoute -->|"send email"| Resend
    AuditPage -->|"GET /api/audit/:id"| AuditGetRoute
    AuditGetRoute -->|"SELECT audit"| Supabase
```

## Data Flow

```
1. User fills 3-step AuditForm
   └── form state auto-saved to localStorage (key: spendlens_form_state)
   
2. User clicks "Run My Audit"
   └── form state sent via POST /api/audit
   
3. Server-side in /api/audit:
   a. Rate limit check (20 per IP per hour, in-memory Map)
   b. runAudit(auditInput) — deterministic, no API calls
   c. generateAuditSummary() — Anthropic claude-haiku-3 (with fallback)
   d. INSERT into audits table (Supabase, no PII)
   e. Return { auditId, auditResult, aiSummary }
   
4. Client receives result, renders AuditResults
   └── SavingsHero animates counter from 0 to savings figure
   └── ToolRow cards rendered in priority order (high → medium → low)
   └── Credex CTA shown if credexRelevant = true (savings > $500/mo)
   
5. User optionally clicks "Email Me This Report"
   └── LeadCapture modal appears (after results, not before)
   └── POST /api/lead with email, company, role
   └── Honeypot check → rate limit → email validation
   └── INSERT into leads table (Supabase)
   └── Send confirmation email via Resend
   
6. Shareable URL: /audit/{uuid}
   └── /audit/[id]/page.tsx fetches GET /api/audit/:id
   └── generateMetadata() builds OG tags with actual savings figures
   └── AuditResults rendered in readOnly mode (no email capture)
```

## Stack Justification

**Next.js 14 App Router**: Server Components handle data fetching for OG tags at request time. API routes are serverless functions on Vercel — zero infrastructure to manage. The App Router's `generateMetadata` API is the cleanest way to produce dynamic OG tags on shareable URLs without client-side hydration waterfalls.

**TypeScript strict mode**: The audit engine's type safety is non-negotiable — a type error in `AuditFinding` means savings calculations could silently produce wrong numbers. Strict mode catches `null`/`undefined` bugs at compile time.

**Supabase (Postgres)**: Two tables with a foreign key relationship. The `audits` table is append-only, PII-free — designed to be safe to expose as a read-only API. The `leads` table stores PII (email) separately, never returned from the public GET endpoint.

**Anthropic claude-haiku-3**: Cheapest Anthropic model (~$0.001/audit at MVP volume). Non-streaming, max_tokens: 200. Every failure falls back to a deterministic template — user always gets a summary.

**Resend**: 100 emails/day free tier covers MVP. Single API call, excellent deliverability, developer-friendly SDK. SMTP alternatives would require infrastructure SpendLens doesn't need at this stage.

**Tailwind CSS**: Utility-first matches the rapid iteration pace of an MVP. Custom CSS variables used for the design system tokens (colors, borders) with Tailwind for spacing/layout.

## Security Model

- `SUPABASE_SERVICE_ROLE_KEY` is **never** returned to the browser — only used in API routes
- `NEXT_PUBLIC_*` keys are safe to expose: Supabase anon key + RLS policies restrict to insert-only
- Rate limiting prevents bulk audit abuse (20/hr per IP for audits, 5/hr for leads)
- Honeypot field catches naive form spam bots without CAPTCHA friction
- PII (email) is stored separately from audit results — shareable URL returns zero PII

## Scaling Notes

**At current MVP scale** (Vercel free tier, Supabase free tier):
- Can handle ~100 audits/day before hitting Supabase free limits
- Rate limiting uses in-memory Map — resets on cold start, doesn't scale across instances

**At 10,000 audits/day**:
1. **Upstash Redis** for rate limiting — persists across cold starts and serverless instances
2. **Supabase PgBouncer** connection pooling — Postgres connection limits become a bottleneck at high concurrency
3. **Vercel Edge Config** for caching `/audit/[id]` pages — audit results are immutable after creation, ideal for edge caching
4. **Inngest** job queue for email sending — removes Resend API latency from the critical path of `/api/lead`
5. **PostHog** for funnel analytics — audit completion rate, email capture rate, sharing rate

**At 1M audits/day**:
- Supabase → dedicated Postgres on Railway or RDS
- Read replicas for `audits` table (heavy read traffic from shareable URLs)
- CDN for OG image serving
