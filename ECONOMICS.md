# SpendLens — Unit Economics

## How Credex Makes Money

Credex is a marketplace for discounted AI infrastructure credits. Companies that overforecast their AI usage (e.g., bought $50k of Anthropic credits but used only $30k) sell the remainder through Credex at a discount. Credex earns a margin on each transaction.

**Credex margin**: 15-25% per transaction  
**Average startup purchase**: $2,000–$10,000 of credits/year  
**Conservative LTV per customer**: $1,500 (assumes $5,000 avg purchase × 3-year retention × 10% net margin)  
**Aggressive LTV per customer**: $3,750 (assumes $5,000 avg purchase × 3 years × 25% margin)

SpendLens is a lead-generation asset. Its job is to identify high-intent prospects (teams that are overspending on AI tools) and route them to the Credex sales team.

---

## Funnel Math (Monthly)

| Stage | Volume | Rate | Notes |
|-------|--------|------|-------|
| Page visits | 2,000 | — | Driven by HN, Twitter thread, organic |
| Audit form started | 600 | 30% | Industry average for interactive tools |
| Audit completed | 400 | 67% | 3-step form — low abandonment |
| Showing >$100 savings | 280 | 70% | Most teams are overspending |
| Email captured | 84 | 30% | Email after value shown |
| Consultation booked | 8 | 10% | High-savings leads (>$200/mo savings) |
| Closed as customer | 2 | 25% | Conservative close rate |
| Monthly new customers | **2** | | |

**Revenue contribution per month**: 2 customers × $1,500 LTV = **$3,000 LTV added**  
(Note: LTV is recognized over 3 years, not immediately. Monthly cash contribution is ~$83/customer at $5k purchase × 25% margin × 1 customer = $1,250 in month 1 purchases.)

---

## Tool Cost (Monthly)

| Service | Cost |
|---------|------|
| Vercel (free tier) | $0 |
| Supabase (free tier, up to 500MB) | $0 |
| Resend (free tier, 100 emails/day) | $0 |
| Anthropic API (claude-haiku-3, ~$0.001/audit × 1,000 audits) | ~$1 |
| Domain (amortized) | ~$1 |
| **Total** | **~$2/month** |

**Effective CAC**: Near $0 for organic channels. The time cost of the HN post is the primary investment.

---

## Path to $1M ARR

**Target**: $1,000,000 ARR for Credex from SpendLens-sourced customers

At $1,500 LTV (recognized over 3 years), we need:
- $1M ARR = ~667 customers total
- At $1,500 LTV/customer, $1M revenue = ~667 customers (simplified, treating LTV as annual for ARR purposes)
- More precisely: 667 customers × $333/yr average annual revenue = $222k ARR... 

Let me reframe: $1M ARR means $1M in annual revenue from credit sales sourced through SpendLens. At 20% margin on $5k average purchase, each customer generates $1,000/year. So $1M ARR requires 1,000 active customers.

**Monthly new customer requirement**: 1,000 customers over 18 months = ~56 new customers/month

**Working back from 56 new customers/month**:
- At 25% close rate → 224 consultations/month
- At 10% booking rate → 2,240 qualified leads/month
- At 30% email capture → 7,467 audits/month with >$100 savings
- At 70% of audits finding savings → 10,667 audits/month total

**Is 10,667 audits/month achievable in 18 months?**  
Starting at 400 audits/month (Week 4), growing at 20% MoM (conservative for a well-distributed free tool with shareable URLs):
- Month 1: 400
- Month 6: ~1,000
- Month 12: ~2,500
- Month 18: ~6,200

**Gap**: We'd reach ~6,200 audits/month by month 18, not 10,667. The gap closes with:
1. Paid distribution (LinkedIn ads targeting Engineering Managers, ~$150 CAC → adds ~200 audits/month at $30k spend)
2. Credex partner embeds (tool embedded on partner blogs/newsletters → passive traffic)
3. SEO (ranking for "cursor vs copilot pricing" — 3-6 month lag)

**Realistic path**: $1M ARR in 20-24 months with a mix of organic growth + $15k/month in paid distribution starting at month 12.

---

## Break-Even Analysis

SpendLens costs ~$2/month to operate. It breaks even the moment it generates a single consultation that converts to a customer (~$1,250 in gross margin on first purchase). At current funnel math, that happens in **Week 2**.

The tool is not just break-even positive — it's an asymmetric bet: near-zero downside (2 weeks of engineering time + $2/month running costs) with meaningful upside (materially contributes to $1M ARR goal).

---

## Sensitivity Analysis

| Variable | Base Case | Optimistic | Pessimistic |
|----------|-----------|------------|-------------|
| Email capture rate | 30% | 45% | 15% |
| Consultation booking rate | 10% | 20% | 5% |
| Close rate | 25% | 35% | 15% |
| LTV/customer | $1,500 | $3,000 | $750 |
| Monthly customers (mo. 6) | 2 | 8 | 0.5 |
| Monthly LTV added (mo. 6) | $3,000 | $24,000 | $375 |

Even in the pessimistic scenario, the tool generates positive ROI by month 3. The variance is almost entirely in the close rate and LTV, both of which are in Credex's control (sales team quality, product pricing), not SpendLens's.
