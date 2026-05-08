# SpendLens — Metrics Framework

## North Star Metric

**Qualified leads captured per week**

A lead is "qualified" if:
1. The audit showed >$200/month in potential savings (credexRelevant threshold for email follow-up), AND
2. The user submitted their email via the LeadCapture modal

**Why this metric**:  
This is the only metric that connects user value (real savings found) to business value (Credex sales pipeline). It prevents optimizing for vanity metrics:

- **DAU** ignores quality — a bot running 1,000 audits would inflate DAU without any business value
- **Audits completed** ignores conversion — 10,000 audits with 0 emails is worthless for lead-gen
- **Revenue** is too lagging — a qualified lead takes 2-6 weeks to close, making revenue a poor leading indicator for a weekly ops review
- **Qualified leads** are the leading indicator Credex's sales team can act on immediately — they can book consultations the same day a lead is captured

**Target Week 4**: 5 qualified leads/week  
**Target Month 3**: 25 qualified leads/week  
**Target Month 6**: 60 qualified leads/week

---

## Input Metrics (Leading Indicators)

### 1. Audit Completion Rate
**Definition**: Audits completed / Forms started (Step 1 begun)  
**Target**: >60%  
**Measurement**: PostHog `audit_form_step_1_started` → `audit_completed` funnel  

**What a low rate signals**: Form is too long, confusing, or asking for information users don't have readily available (e.g., "monthly spend" when they don't track it). Fix: reduce form length, add "I don't know" options, prefill common defaults.

### 2. Email Capture Rate (Qualified)
**Definition**: Emails submitted / Audits showing >$100 savings  
**Target**: >35%  
**Measurement**: PostHog `lead_modal_shown` → `lead_captured` conversion  

**What a low rate signals**: Either (a) results aren't credible — users don't believe the savings figure, or (b) the ask comes at the wrong moment or is too high-friction. Fix options: move the modal earlier (after results are visible but before they scroll to the bottom), simplify to email-only (no company/role fields), or add social proof near the email modal.

### 3. Shareable Link CTR
**Definition**: Unique views on `/audit/[id]` URLs from non-submitters / Audits where a link was shared  
**Target**: >15% of audits generate a shared view  
**Measurement**: Distinct sessions on `/audit/[id]` that don't have a prior session on the main page (i.e., arrived via a shared link)  

**What a low rate signals**: Results aren't worth sharing (savings too low, presentation not impressive enough) OR the share UX is friction-heavy. Fix: improve OG image, make the Twitter share pre-filled text more compelling, add a "text your co-founder" one-tap option on mobile.

---

## Instrumentation Priority (PostHog)

### Must-have events (Week 1):

```javascript
// Funnel tracking
posthog.capture('audit_form_started')                    // Step 1 begun
posthog.capture('audit_form_step2_reached')              // Step 2 (tools)
posthog.capture('audit_form_step3_reached')              // Step 3 (review)
posthog.capture('audit_submitted')                       // Run My Audit clicked

// Result events  
posthog.capture('audit_completed', {
  totalMonthlySavings,
  credexRelevant,
  toolCount,
  isAlreadyOptimal,
  useCase,
})

// Lead capture
posthog.capture('lead_modal_shown')
posthog.capture('lead_captured', {
  auditId,
  highSavingsCase: credexRelevant,
})

// Sharing
posthog.capture('share_link_copied')
posthog.capture('share_twitter_clicked')
```

### Nice-to-have events (Week 4):
- `tool_toggled` (which tool, active/inactive) — reveals which tools are most common
- `credex_cta_clicked` — direct conversion signal
- `audit_result_scrolled_to_bottom` — engagement depth signal

---

## Cohort Analysis (Monthly)

After 500+ audits, analyze:
1. **Savings distribution**: What % find >$0, >$100, >$500? If <30% find >$100, the rules are too conservative or the tool is attracting already-optimized teams.
2. **Tool frequency**: Which tools appear most often? Helps prioritize new rules and pricing updates.
3. **Email capture by savings tier**: Does capture rate increase with savings amount? Should be a strong positive correlation. If it's flat, the value prop isn't landing.
4. **Shared URL views by cohort**: Are shared audits from Week 1 still getting views in Week 4? If yes, the shareable format has legs.

---

## Pivot Triggers

**Trigger 1**: Email capture rate <10% after 500 audits, average savings >$200/mo  
→ Value prop is landing but the ask is broken. Pivot: frictionless capture (magic link to email, single field, no company/role), or move email gate earlier.

**Trigger 2**: Audit completion rate <30% after 200 form starts  
→ Form is too long or confusing. Pivot: reduce to 1-step form (just list tools and spend, no context step), or add "quick estimate" mode with fewer fields.

**Trigger 3**: 0 Credex consultations booked after 200 qualified leads  
→ Hand-off from tool to Credex sales is broken. Pivot: add in-tool consultation booking (Calendly embed), or change CTA to a direct email instead of "book a consultation."

---

## Dashboard Design

**Daily ops review** (5 minutes):
- Audits completed yesterday
- Qualified leads captured yesterday
- Any error spikes in Supabase logs or Vercel functions

**Weekly review** (30 minutes):
- Qualified leads/week vs. target
- Audit completion rate trend
- Email capture rate trend
- Source breakdown (HN / LinkedIn / shared links / direct)
- Top findings from the week's audits (which tools are being flagged most)

**Monthly review** (2 hours):
- Full funnel cohort analysis
- Pricing data audit (are any vendor prices stale?)
- User interview review (conduct 2 new interviews)
- Pivot decision review against triggers above
