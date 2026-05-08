# SpendLens — Reflection

## 1. Hardest Bug

**The `generateMetadata` OG tags not updating on dynamic routes.**

On Day 4, I set up the `/audit/[id]` shareable page with `generateMetadata` to produce dynamic `og:title` tags with the actual savings figure. When I tested it, the OG title was showing the default fallback title ("SpendLens — AI Spend Audit for Startups") instead of the dynamic one ("AI Spend Audit — $840/mo in savings found").

**Hypothesis 1**: The fetch inside `generateMetadata` was failing silently and returning `null`.  
I added a `console.log` in the function — the fetch was succeeding and returning the audit data. The issue was elsewhere.

**Hypothesis 2**: Next.js was caching the metadata at build time and not regenerating it per-request.  
I checked the Next.js App Router docs: `generateMetadata` is called at request time by default for dynamic segments (params) — it doesn't get statically cached. This wasn't the issue.

**Hypothesis 3**: The function wasn't marked `async`, so the `await fetchAudit()` was returning a Promise object, not the resolved data.  
This was it. My `generateMetadata` function was:

```typescript
// BROKEN: not async
export function generateMetadata({ params }) {
  const audit = await fetchAudit(params.id); // TypeScript strict mode should have caught this...
```

Wait — TypeScript strict mode *should* have caught `await` in a non-async function. It did — but I had a separate `generateMetadata` in a test file that I was looking at when I thought I'd verified it. The actual `app/audit/[id]/page.tsx` had the correct `async function` signature, but I forgot to also `await` the `params` object itself.

**The real fix**: In Next.js 15 / React 19, dynamic route params become a Promise:

```typescript
// CORRECT
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Must await params first
  const audit = await fetchAudit(id);
```

The `params` being a Promise is a breaking change in the latest Next.js versions. TypeScript caught the type mismatch, but I was running `--noEmit` only in CI, not locally. Lesson: run `npx tsc --noEmit` locally before pushing.

**Time lost**: 2.5 hours. **Fix**: 3 lines.

---

## 2. Decision Reversed

**Initially built the audit engine as a series of LLM calls with structured output. Reversed on Day 2.**

My first instinct was elegant: send the user's tool data to Claude, ask it to return structured JSON with findings and savings amounts. It worked in testing — the output was well-formatted and the savings numbers looked plausible.

Three reasons I reversed this decision:

**Reason 1: Unit economics.** At claude-haiku-3 pricing (~$0.0015/call), and with 3-5 tool analysis calls per audit, each audit would cost ~$0.01. At 1,000 audits/month, that's $10/month — trivial. But the savings calculations would be unverifiable. A finance person reviewing the output would rightly ask: "Where does the $840 figure come from?" With deterministic rules, I can cite the exact rule and the exact pricing page. With LLM output, I can't.

**Reason 2: Consistency.** I ran the same audit input 10 times on the LLM version. The savings figure varied by ±$50 across runs, even with temperature: 0. Not because of rounding — because the model was making different assumptions about seat counts and plan interpretation on different runs. Deterministic code produces the same answer every time.

**Reason 3: Auditability.** The assignment brief mentioned the results should be "defensible." A hardcoded rule with a cited source URL is defensible. "The AI said $840" is not. Claude actually hallucinated a $25 Cursor Business price (actual: $40) in one test run. Caught it when cross-referencing with cursor.sh/pricing.

The reversal cost 4 hours of throwing away LLM integration code. Worth it — the deterministic engine is testable, predictable, and citable.

---

## 3. Week 2 Build

If I had another week, I'd build three things:

**1. Benchmark Mode**  
Show the user their AI spend per developer vs. industry averages. "Your team spends $47/developer/month on AI tools. The median for Series A engineering teams is $31." This requires collecting benchmark data (either from opt-in audit submissions or from public sources like GitLab's DevSecOps survey). The shareable URL becomes a comparison tool, not just a report — dramatically increases sharing incentives.

**2. Embeddable Widget**  
A `<script>` tag that Credex's content partners (newsletters, blogs) can embed to show a mini spend estimator. Users enter team size and get an instant rough savings estimate — drives them to the full audit form. Low cost to build, high distribution leverage.

**3. Credex Direct Integration**  
When the audit shows a "consider-credits" finding, instead of linking to credex.rocks generically, show a table of available credits in the Credex marketplace that match the user's specific tool stack. "There are 3 available Claude API credit packages: $2,400 at 22% below retail." This requires a Credex inventory API but transforms the tool from a lead-gen asset into a direct conversion funnel.

---

## 4. AI Tool Usage

**Tools used and how:**

- **Cursor**: Primary editor throughout. Used autocomplete for boilerplate (import statements, TypeScript interfaces). Most valuable for `lib/auditEngine.ts` — accepted suggestions for repetitive switch case structures, but reviewed every savings calculation manually.

- **Claude (claude-3-5-sonnet)**: Used for drafting the audit rule rationales — the one-sentence "reasoning" strings in each `AuditFinding`. The task is: "Write a finance-literate one-sentence justification for downgrading from Cursor Business to Pro when team < 5 seats." Claude's outputs were strong starting points, but I edited every one for precision. Claude initially wrote "saves money" type reasons — edited to cite the specific plan feature (SSO, admin controls) and the specific threshold (5 seats) that makes those features valuable.

- **Claude**: Also used for drafting the HTML email template. Quick win — Claude produced a solid dark-mode email template in one shot that needed only minor style tweaks.

**What I verified manually:**
- Every pricing figure in `pricingData.ts` was cross-referenced with the official pricing page on May 7. Claude suggested $25 for Cursor Business (incorrect — the actual price is $40). Caught it during cross-reference.
- All savings calculations in the test cases were hand-computed before writing the `expect()` assertions.

**AI used for**: boilerplate, one-off writing tasks, HTML template generation.  
**AI not used for**: pricing research, savings math, architectural decisions, test case design.

---

## 5. Self-Ratings

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Discipline | 7/10 | Stayed focused on the 6 MVP features. Resisted scope creep (wanted to add PDF export on Day 3). One slip: spent 90 minutes over-engineering the animated counter when a simpler version would have been fine. |
| Code Quality | 8/10 | TypeScript strict, documented trade-offs, unit tests, separation of concerns (engine vs. API vs. UI). Weakness: `app/page.tsx` handles too many concerns — the form submission logic should move to a custom hook. |
| Design Sense | 8/10 | Dark luxury fintech aesthetic with Syne + DM Sans looks genuinely premium. The glow-card and cyan accents create visual hierarchy. Weakness: mobile layout for the 3-column tool cards is cramped on small screens. |
| Problem-solving | 8/10 | The `generateMetadata` params bug took 2.5 hours — too long. Should have reached for the docs sooner rather than forming hypotheses based on assumptions about Next.js internals. |
| Entrepreneurial Thinking | 7/10 | GTM plan is specific and grounded (exact HN post strategy, exact Slack communities). Economics math is real. Weakness: the Week 2 features I'd build are incremental rather than a step-change in the business model. A more entrepreneurial move would have been identifying that the benchmark data *itself* is the moat, not the audit tool. |
