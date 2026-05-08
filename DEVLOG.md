# SpendLens — Development Log

Format: Day N (Date) | Hours | Work | Learned | Blockers | Next

---

## Day 1 — May 7, 2026 | 5 hours

**What I did:**
- Read the full assignment brief three times. Identified the 6 mandatory features and the 13 required markdown files — started a checklist.
- Researched current pricing for all 8 tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf. Opened each official pricing page and copy-pasted the numbers into a notes doc. Caught that Claude Team requires a 5-seat minimum (not obvious from the headline pricing).
- Initialized Next.js 14 with App Router, TypeScript strict mode, Tailwind CSS.
- Scaffolded the design system in `globals.css`: dark luxury fintech palette (#0A0F1E, #00D4FF), Syne + DM Sans fonts via next/font, glow-card component class, animated counter keyframes.
- Built the landing page hero section — gradient text headline, animated grid background, how-it-works 3-step section.
- Started `AuditForm.tsx` — got through Step 1 (team size, use case, budget) with localStorage persistence wired up.

**What I learned:**
- `next/font` with the `variable` option requires passing the CSS variable to the `html` element className — not just to `body`. Spent 20 minutes debugging why DM Sans wasn't loading before finding this in the docs.
- CSS `background-clip: text` requires `-webkit-text-fill-color: transparent` to actually show the gradient — the standard `color: transparent` doesn't work in all browsers.

**Blockers:**
- None significant. Pricing research took longer than expected — 90 minutes total. OpenAI API pricing is confusing because they show input/output rates separately with different prices per model.

**Plan for tomorrow:**
- Complete AuditForm Steps 2 and 3 (tool inventory + review)
- Implement `lib/pricingData.ts` and `lib/auditEngine.ts` with all rules

---

## Day 2 — May 8, 2026 | 7 hours

**What I did:**
- Built AuditForm Step 2: 8 tool cards with toggle switches, plan dropdowns, spend inputs, and seat counts. Tool cards expand when toggled active with a smooth CSS transition.
- Implemented `lib/pricingData.ts` with full typed pricing constants and tool plan options arrays.
- Implemented `lib/auditEngine.ts` with all hardcoded rules:
  - Cursor: Pro → Hobby (non-coding), Business → Pro (<5 seats)
  - GitHub Copilot: Business → Individual (≤2 users), Enterprise → Business (<20 users)
  - Claude: Max → Pro (writing/research), Team → Pro (<5 seats), API overspend alert
  - ChatGPT: Plus + Claude Pro redundancy flag, Team → Plus (<5 seats), API model optimization
  - Gemini: Advanced + Claude Pro overlap
  - Windsurf: Team → Pro (<5 seats), Pro + Cursor Pro redundancy
  - Credits finding: always added when spend > $100/mo
- Wrote 28 unit tests across `auditEngine.test.ts` and `pricingData.test.ts` — all passing.
- One test fix: the credexRelevant test used seats that didn't trigger any rules, so savings were $0. Fixed by using data that actually triggers the defined rules.

**What I learned:**
- The `Map` type in TypeScript loses its generic typing when you do `new Map()` without explicit generics. Fixed by typing `new Map<string, { count: number; resetAt: number }>()` in `rateLimit.ts`.
- Vitest needs a `vitest.config.ts` with the `@` path alias explicitly configured — it doesn't inherit from `tsconfig.json` paths automatically. Spent 30 minutes on `Cannot find module '@/lib/auditEngine'` errors before adding the alias to the vitest config.

**Blockers:**
- Vitest + `@` path alias issue (resolved — see above)
- Cursor Pro with non-coding use case, 1 seat: the rule needed to check `seats === 1` specifically (not just plan) to avoid triggering on multi-seat Pro setups where the alternative isn't Hobby.

**Plan for tomorrow:**
- Build AuditResults, SavingsHero, ToolRow, ShareButton components
- Wire up the landing page to show results after form submission

---

## Day 3 — May 9, 2026 | 6 hours

**What I did:**
- Built `SavingsHero.tsx` with animated counter using `requestAnimationFrame` and ease-out cubic easing. The counter starts at 0 and counts up to the savings figure over 1.2 seconds.
- Built `ToolRow.tsx` with color-coded action indicators: orange for downgrade, red for switch, yellow for optimize, green for already-optimal, cyan for consider-credits.
- Built `AuditResults.tsx` — orchestrates SavingsHero, AI summary card, Credex CTA (shown only if credexRelevant), per-tool breakdown (sorted high priority first), credits finding, context stats, share section.
- Built `ShareButton.tsx` with clipboard copy and Twitter share intent URL.
- Wired up `app/page.tsx`: form submission calls `/api/audit`, result stored in state, results section appears below form with smooth scroll.
- Conducted 3 user interviews (see USER_INTERVIEWS.md). Key insight: users want CFO-ready framing, not developer framing. Changed the hero stat from "savings per developer" to "total annual savings" based on feedback from R.M.

**What I learned:**
- `requestAnimationFrame` in React requires cleanup in the `useEffect` return — without it, the animation callback fires after component unmount and updates state on an unmounted component. Added `if (rafRef.current) cancelAnimationFrame(rafRef.current)` in the cleanup.
- CSS `backdrop-filter: blur()` doesn't work in Firefox without the `-webkit-` prefix AND it's expensive on low-end mobile. Used it only for the modal overlay, not for cards.

**Blockers:**
- The results section was appearing before the API response came back because I was setting state optimistically. Fixed by waiting for the fetch to complete before showing results.

**Plan for tomorrow:**
- Set up Supabase, create tables, implement API routes
- Integrate Anthropic with fallback logic

---

## Day 4 — May 10, 2026 | 8 hours

**What I did:**
- Set up Supabase project, created `audits` and `leads` tables via SQL Editor. Configured RLS policies — took longer than expected (see Blockers).
- Implemented `lib/supabase.ts` with dual clients (anon for client-side, service role for server-side API routes).
- Implemented `app/api/audit/route.ts`: rate limiting, server-side audit engine recompute, Anthropic summary, Supabase insert.
- Implemented `app/api/audit/[id]/route.ts`: UUID validation, Supabase select, PII-free response.
- Implemented `lib/anthropic.ts` with claude-haiku-3-20240307, graceful fallback on any error (429, 500, network), logged to console but never thrown.
- Tested fallback: unplugged `ANTHROPIC_API_KEY` from `.env.local` → fallback template rendered correctly.
- Built `app/audit/[id]/page.tsx` with `generateMetadata` for OG tags.

**What I learned:**
- Supabase RLS policies — `anon` key can only perform operations explicitly allowed by a policy. I initially forgot to add a `SELECT` policy on `audits`, which meant the GET `/api/audit/[id]` endpoint returned 406 Not Acceptable. Adding `CREATE POLICY "Allow select by id" ON audits FOR SELECT USING (true);` fixed it.
- The `service_role` key bypasses RLS entirely — I should use it for server-side admin operations and keep the `anon` key for anything client-facing. Took me 45 minutes to debug why inserts from the API route worked but selects didn't — I was accidentally using the anon key in the server route.
- `generateMetadata` in Next.js App Router needs to be an `async` function AND the `fetch` inside it needs `{ next: { revalidate: N } }` to avoid re-fetching on every request.

**Blockers:**
- Supabase RLS anon key issue (resolved — see above, took 45 minutes)
- Anthropic SDK type: `message.content[0]` returns `ContentBlock` which has a discriminated union type — needed to check `content.type === 'text'` before accessing `.text`. TypeScript strict mode caught this.

**Plan for tomorrow:**
- Lead capture modal, Resend email, honeypot, lead rate limiting
- Polish + accessibility pass

---

## Day 5 — May 11, 2026 | 6 hours

**What I did:**
- Built `LeadCapture.tsx` modal with honeypot field (hidden from humans, visible to bots via `style={{display:'none'}}`), email validation, company/role optional fields.
- Implemented `app/api/lead/route.ts`: honeypot check (silent 200 for bots), rate limit (5/hr per IP), email regex validation, Supabase insert to leads table, Resend email send, `email_sent` flag update.
- Built the Resend email template in HTML — dark luxury design matching the app, with conditional copy for high-savings vs low-savings audits.
- Added `lib/rateLimit.ts` with documented in-memory trade-offs.
- Fixed email "from" field — Resend's free tier only allows sending from `onboarding@resend.dev` or a verified domain. Used the Resend default for MVP with a note to update for production.
- Accessibility pass: added `aria-label` to all icon-only buttons, `aria-modal` to the modal, `aria-live` regions for loading states, `for` attributes on all labels.

**What I learned:**
- Resend's free tier has a subtle restriction: you can only send FROM `onboarding@resend.dev` unless you verify a domain. This means for the MVP, the "from" address looks like Resend's address rather than SpendLens. Easy fix: verify `spendlens.com` domain in the Resend dashboard and update the `from` field.
- The honeypot field must be `tabIndex={-1}` AND `autoComplete="off"` — some password managers would otherwise "helpfully" fill it in, causing false positives.

**Blockers:**
- Resend domain verification — using fallback address for now, documented the production fix.
- Modal focus trap: keyboard-only users could tab outside the modal. Added a focus trap effect (tracking first/last focusable elements) in a later iteration.

**Plan for tomorrow:**
- Shareable URL OG testing, CI workflow, final polish, start markdown docs

---

## Day 6 — May 12, 2026 | 7 hours

**What I did:**
- Set up GitHub Actions CI workflow: lint → TypeScript check → vitest run. Used mock env vars so CI doesn't need real API keys.
- Tested OG tags by running the production build locally and using a tool to preview the Twitter card — confirmed `generateMetadata` produces correct titles with real savings figures.
- Fixed a CSS bug: the `glow-card` hover effect was causing layout shift on Safari due to `transform` on hover. Added `will-change: transform` to prevent compositing issues.
- Ran Lighthouse on the local dev build: Performance 82, Accessibility 91, Best Practices 92. Fixed 3 color contrast failures (increased opacity on `text-slate-600` labels from 0.6 to 0.7 to hit AA ratio).
- Added `LoadingSkeleton` shimmer animation while the `/api/audit` request is in flight.
- Started writing markdown files: README, ARCHITECTURE, PRICING_DATA, PROMPTS.

**What I learned:**
- Lighthouse accessibility: `select` elements need a visible label — the `<label htmlFor>` pattern works but the label must be visible (not just `sr-only`) to pass WCAG AA in the audit tool's heuristics.
- GitHub Actions `npm ci` is preferred over `npm install` in CI — uses the exact locked versions from `package-lock.json`. Speeds up the CI run by using the cache layer.

**Blockers:**
- Lighthouse Performance score was initially 78 due to Google Fonts loading. Fixed by switching to `next/font` which uses `font-display: swap` and preloads the font in `<head>`.
- Twitter OG card preview showed the default meta image instead of the dynamic title — turned out `og:image` dimensions must be exactly 1200×630 to render the card correctly.

**Plan for tomorrow:**
- Final deployment to Vercel
- Complete all 13 markdown files
- Final test run, screenshot submission assets

---

## Day 7 — May 13, 2026 | 5 hours

**What I did:**
- Deployed to Vercel: `npx vercel --prod`, added all 5 env vars in dashboard, verified live URL loads correctly.
- Updated `NEXT_PUBLIC_APP_URL` in Vercel environment to the production URL. Confirmed shareable URLs produce correct OG tags by pasting a live URL into Twitter card validator.
- Final Lighthouse run on deployed URL: Performance 86, Accessibility 92, Best Practices 93. ✅ All targets met.
- Completed all 13 markdown files: README, ARCHITECTURE, DEVLOG, REFLECTION, TESTS, PRICING_DATA, PROMPTS, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS + CI.
- Git log shows commits spread across May 7–13 as required.
- Did a final end-to-end test: filled the 3-step form, submitted, saw results, clicked share, copied link, opened in incognito — shareable URL loaded with correct savings figure in the page title.

**What I learned:**
- Vercel's production URLs differ from preview URLs — if you hardcode the preview URL in `NEXT_PUBLIC_APP_URL` during development, the shareable links point to the wrong environment. Always use the production URL for production builds.
- The `not-found` page in Next.js App Router requires a `not-found.tsx` file in the app directory OR the parent layout to handle `notFound()` correctly. Without it, the 404 from the `notFound()` call in the audit page shows a generic error.

**Blockers:**
- None on Day 7 — the planning across Days 1-6 paid off.

**Final state:**
- 28 tests passing
- Lighthouse: Performance 86 / Accessibility 92 / Best Practices 93
- All 6 MVP features functional
- All 13 markdown files complete
- Deployed and live
