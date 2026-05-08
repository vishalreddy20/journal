# SpendLens — Go-To-Market Plan

## Target User (Exact Profile)

**Engineering Manager at a 10-50 person startup that raised a Seed or Series A in the last 18 months and has 5-20 developers using AI coding tools.**

They sign off on AWS bills and Notion/Linear subscriptions but have never seen a line-item breakdown of AI tool cost per developer. They probably have a Slack message from their CFO asking "can we cut software spend by 10%?" sitting unread. They are not opposed to spending on AI tools — they believe in the ROI — but they have no visibility into whether they're paying for the right tier.

**What they Google before wanting this tool:**
- "cursor vs github copilot cost"
- "claude team vs pro pricing difference"
- "ai tools budget startup"
- "reduce saas spend engineering team"
- "github copilot enterprise worth it small team"

**Where they hang out:**
- r/ExperiencedDevs (ask questions, not promote)
- Hacker News (Show HN, Ask HN)
- Indie Hackers (builder community)
- Ramen Club Slack (YC-adjacent founders)
- Lenny's Newsletter Slack community
- YC Alumni network (W21-W24 cohorts — active Slack)
- Linear and Notion's community Discords
- SaaStr community (for the finance-adjacent angle)

---

## First 100 Users in 30 Days — $0 Budget

### Channel 1: Hacker News Show HN (Primary)

**Headline**: "Show HN: Free AI spend audit tool for engineering teams — found $840/mo in 2 minutes"

This is the primary channel. The tool IS a Hacker News story: it's free, immediately useful, targets HN's exact audience (engineers and founders), and has a shareable result URL that can demonstrate value in a comment. The Show HN format lets you post the tool without it feeling like marketing.

**Execution**:
- Post at 8am ET on a Tuesday or Wednesday (peak HN traffic window)
- First comment should be: "I built this because I realized I was paying for Cursor Business for 3 people — it only makes sense at 5+ seats. Turns out there's a whole class of these per-seat plan traps. The audit engine has [N] hardcoded rules based on real pricing pages."
- Respond to every comment in the first 3 hours
- Expected result: 50-200 audits in first 24 hours if it hits the front page

### Channel 2: LinkedIn Cold DM (50 outbound)

**Target**: Engineering Managers who have "developer tools" or "AI" in their bio. Filter for companies with 10-50 employees on LinkedIn.

**Message template** (not copy-paste — personalize the first line):
> "Hi [Name] — I saw you're using [Cursor/Copilot/etc] at [Company]. I just built a free tool that audits AI tool spend for engineering teams — found $840/month in savings for the first team I tried it with. No email required to use. Would you try it? [link]"

**Volume**: 50 DMs over 5 days. Expected reply rate: 5-10%. Expected audits from this channel: 10-20.

### Channel 3: Slack Communities (5 specific communities)

Post once in each — not in #self-promotion (ignored), but in the most relevant channel (#ai-tools, #devtools, #saas-costs):

1. **Ramen Club**: "#ai-costs channel if there is one, else #tools — 'Built a free AI spend audit for teams, curious what people are finding.' Link the shareable result from my own team's audit."
2. **Indie Hackers**: "#tools — show the actual savings number from a real audit"
3. **Lenny's Newsletter Slack**: "#product-feedback — position as a product built on the principle of 'show value before asking for email'"
4. **SaaStr Community**: "#saas-tools-and-stack"
5. **YC Alumni (W22-W24)**: "#tools or #cost-cutting if the channel exists"

### Channel 4: Twitter/X Thread (1 thread, drive to tool)

**Thread premise**: "We audited $50k/month in AI tool spend across 20 startups. Here's what we found."

Include:
- The most surprising finding (e.g., "82% of teams on GitHub Copilot Enterprise had fewer than 20 devs — the exact threshold where Enterprise value kicks in")
- The most common redundancy (Claude Pro + ChatGPT Plus overlap)
- The average savings found
- Link to run the free audit at the end

This thread can be posted without the tool being well-known — the data is interesting on its own.

### Channel 5: Credex's Existing Relationships (Unfair Channel)

Credex already has relationships with companies that sold them overallocated AI credits. Those companies' finance teams are exactly the right audience for a spend audit tool — they've already proven they care about AI cost efficiency by selling credits rather than writing them off.

Credex can email these contacts directly: "We built a free audit tool for engineering teams — we thought you'd find it useful given your work on AI infrastructure costs."

**Expected**: 10-15 audits from a single email to a warm list of 50-100 contacts. Highest-quality leads.

---

## Week-1 Traction Target

| Metric | Target |
|--------|--------|
| Audits completed | 200 |
| Email captures | 40 (20% of audits) |
| Credex consultations booked | 5 |
| Shareable URLs created | 100 |
| Unique views on shared URLs | 300 |

---

## Why the Viral Loop Works

Every shared audit URL is a distribution event. When an Engineering Manager sends their audit to their CFO ("here's the doc showing our AI overspend"), the CFO sees the SpendLens brand and a "Run My Audit →" CTA. If the CFO forwards it to their CEO or board member, that's another exposure. The shareable URL is not just a convenience feature — it's the growth loop.
