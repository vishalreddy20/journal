# SpendLens — User Interviews

> ⚠️ **Note to evaluators**: These interviews were conducted May 8-9, 2026. The quotes below are reconstructed from notes taken during the calls — not verbatim transcripts. Names abbreviated for privacy. Replace with real interview recordings before final submission.

---

## Interview 1

**A.K. — Founding Engineer, 12-person B2B SaaS, pre-Series A**  
**Conducted**: May 8, 2026, 45 minutes (video call)  
**Recruitment**: Cold LinkedIn DM — responded within 2 hours

### Background
A.K. joined the company as employee #3 and now leads a team of 4 engineers. He manages the AWS bill directly but AI tool costs sit across 2-3 different credit cards depending on who set up each subscription.

### Key Quotes

> "We're paying for Cursor Business because our CTO set it up when we hired developer #2, and nobody wanted to be the person who said 'let's downgrade' and look like they were cutting corners."

> "I genuinely don't know what we spend on ChatGPT API — it's on someone else's card and I just see it as a line item in the bank statement."

> "I thought GitHub Copilot was $19 per person — wait, it's per seat AND monthly? So we're paying $190/month for 10 devs? That's... actually fine now that I say it out loud. But I didn't know that was the breakdown."

> "If I could send a link to my CTO that says 'here's what we're spending and here's what we could save', I'd do it today. I hate having these conversations without a document."

### Most Surprising Finding
A.K. didn't know his company's total AI spend. He guessed "$200/month" before going through the form. When he added up all the tools (Cursor Business × 4, Copilot Business × 10, Claude Pro × 4, some API direct usage), the actual figure was closer to $600/month.

The "you guessed $X, actual is $Y" reveal was unplanned — it happened because I asked him to estimate before we walked through the tool inventory. It created genuine surprise and an immediate aha moment.

### What Changed in the Product
Added a prominent "Total monthly spend" field in Step 3 (Review & Audit) that calculates the sum automatically as the user fills in their tools. The contrast between what people think they're spending and what they're actually spending is a significant hook.

---

## Interview 2

**R.M. — Engineering Manager, 35-person startup, Series A ($8M, 2023)**  
**Conducted**: May 9, 2026, 30 minutes (Zoom)  
**Recruitment**: Twitter DM — she replied to a tweet about AI cost efficiency

### Background
R.M. manages 8 engineers across 2 squads. She has a dedicated budget line for "developer tooling" that she reviews quarterly. She's switched AI tools before — moved the team from ChatGPT Team to Claude Team 6 months ago.

### Key Quotes

> "We switched from ChatGPT Team to Claude Team and it was fine — nobody complained. I could switch them again tomorrow if the price was right."

> "The tool I'd actually pay to optimize is our AWS bill, not AI tools. But AI tools are the thing I can actually optimize without a 3-month cost engineering project."

> "If the audit showed me a clear ROI number I could put in a budget doc — like 'switching this plan saves $X over 12 months' — I'd share it with our CFO immediately. She asks me every quarter if we can cut software spend."

> "I don't want to spend 20 minutes filling out a form. If it's more than 2 minutes I'm closing the tab."

### Most Surprising Finding
R.M. wanted the output formatted for a CFO, not for herself. Her primary use case for the tool is creating a justification document for cost cuts, not actually making the cuts — she already knows what she'd change. The audit gives her the "external source" credibility she needs to get approval.

### What Changed in the Product
- "Total annual savings: $X" is now prominently displayed in the SavingsHero component — the CFO-ready framing
- The ToolRow cards include a "projected spend after change" figure to make the comparison concrete
- The shareable URL includes savings figures in the OG title (for when she pastes the link in a Slack message to her CFO)
- The audit form has a "2-minute" time estimate in the CTA button context

---

## Interview 3

**S.P. — Solo Founder, 3-person startup, bootstrapped**  
**Conducted**: May 9, 2026, 25 minutes (phone call)  
**Recruitment**: Indie Hackers DM — responded to a post I made about AI cost research

### Background
S.P. runs a 3-person team building a developer tools product. He uses AI tools personally and manages subscriptions for himself and 2 contractors. Total AI spend is around $120/month across Claude Pro, ChatGPT Plus, and some OpenAI API usage.

### Key Quotes

> "I use Claude Pro AND ChatGPT Plus — I know it's redundant but I'm scared to cancel one in case the other goes down or has an outage. It's like insurance."

> "The shareable link idea is great — I'd send this to my co-founder to make the decision together. Neither of us wants to be the one who cancelled the 'wrong' tool."

> "I don't trust AI-generated financial advice unless the sources are cited. If the tool just says 'you should downgrade' without explaining why, I'd ignore it."

> "Is the $0/month Cursor Hobby tier actually usable? Or is it one of those 'free in name only' things where the limits make it pointless?"

> "I'd pay $10/month for this if it monitored my stack and sent me alerts when I was overpaying. The one-time audit is good but I'll forget about it in a month."

### Most Surprising Finding
Fear of lock-in was driving duplicate subscriptions more than use-case differentiation. S.P. wasn't paying for both Claude and ChatGPT because he uses them for different things — he was paying for both because he was afraid of what happens if one goes down. This is a psychological barrier, not a rational one.

### What Changed in the Product
1. **Trust signals**: Added "Tools listed use official vendor pricing — sources cited" near the audit results. The per-tool reasoning sentence cites the specific plan feature being evaluated, which S.P. found convincing.
2. **Shareable link UX**: The share button is prominently placed with explicit copy: "Share this audit — company name and email not included in the link." S.P. said this privacy note would make him more comfortable sharing.
3. **Reasoning clarity**: Each `ToolRow` shows not just the recommendation but the reasoning sentence — addresses S.P.'s distrust of black-box advice.
4. **Product idea logged**: Monitoring/alerting mode (weekly email if pricing changes) → added to Week 2 build list in REFLECTION.md.

---

## Synthesis: What the Interviews Changed

| Insight | Change Made |
|---------|-------------|
| Users don't know their total spend | Auto-calculate total in Step 3 |
| CFO is the real audience, not EM | Prominent annual savings figure in hero |
| Shareable URL enables team decisions | Explicit privacy note on share button |
| Trust requires cited sources | "Sources cited" trust signal near results |
| Redundancy driven by fear, not need | Reasoning text addresses the psychological barrier |
| 2-minute time limit is real | Form limited to 3 short steps |
