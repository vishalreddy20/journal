# SpendLens — Prompts Documentation

## Prompt 1: AI Audit Summary

**Location**: `lib/anthropic.ts`  
**Model**: `claude-haiku-3-20240307`  
**max_tokens**: 200

### Full Prompt Text

```
You are a financial analyst specializing in SaaS cost optimization for technology teams.

Given the following AI tool audit data, write a concise 90-100 word personalized summary for the team. Be specific about their situation. Be direct and actionable. Do not use filler phrases like "it's clear that" or "this analysis shows". Start with the biggest opportunity. End with a forward-looking sentence about trajectory.

Team context:
- Team size: {{teamSize}}
- Primary use case: {{useCase}}
- Total monthly AI spend: ${{totalSpend}}

Top findings:
{{findings}}

Total potential savings: ${{monthlySavings}}/month (${{annualSavings}}/year)

Write the summary now. 100 words max.
```

### Why It's Written This Way

**"Financial analyst specializing in SaaS cost optimization"**: Sets the register before any content. This single phrase changes the model's output more than almost any other instruction. "Helpful assistant" produces encouraging, vague summaries. "Financial analyst" produces specific, dollar-denominated, actionable outputs. The word "specializing" narrows the persona further — generalist financial analysts still hedge. SaaS cost optimization specialists do not.

**"Do not use filler phrases like 'it's clear that'"**: Negative constraints are more reliable than positive constraints in prompt engineering. "Be direct" is interpreted differently by different model weights. "Do not use 'it's clear that'" is unambiguous. The list of banned phrases is based on the most common AI-sounding openers observed in early testing.

**"Start with the biggest opportunity. End with a forward-looking sentence."**: Structural constraints produce consistent formatting. Without this, the model sometimes leads with context ("Your team uses 4 tools...") rather than the savings opportunity. The forward-looking ending creates a subtle call-to-action feel without being salesy.

**"100 words max"**: max_tokens: 200 is the hard limit, but the prompt-level constraint trains the model to be concise rather than filling the token budget. Without it, claude-haiku-3 tends to pad to the token limit.

### What Didn't Work

**Version 1**: "Be helpful and friendly, and give the team a positive, encouraging summary of their AI spend."

Output: "Great news! Your team is doing a wonderful job managing your AI tools. We found some opportunities that could help you optimize even further..."

Problem: Completely non-actionable. Finance-literate readers (the target audience) distrust encouragement without substance. The word "great" in the first sentence signals that no bad news is coming, which means the reader stops taking the summary seriously.

**Version 2**: Included a `format_instructions` JSON schema asking for structured output.

Output: Returned valid JSON but the prose quality dropped significantly. The model optimized for schema compliance, not for quality writing. The fallback template handles structure; the AI should handle prose.

**Version 3**: Used `temperature: 0.3` for more creativity.

Output: More varied, but also less reliable. At temperature: 0, the summary is deterministic given the same input. For a tool that produces a shareable URL, determinism matters — if you run the same audit twice, you get the same summary (from cache). At temperature: 0.3, different runs of the same audit produce different summaries, which is confusing for users who share the link.

---

## Fallback Template

Used when the Anthropic API fails (429, 500, network error):

```
Your team of {{teamSize}} is spending ${{totalBudget}}/month across {{toolCount}} AI tools.
Our audit identified ${{monthlySavings}}/month in savings through plan right-sizing and
eliminating redundant subscriptions. The highest-impact change is {{topRecommendation}}.
Implementing these optimizations would save ${{annualSavings}}/year.
```

**Design rationale**: The fallback is intentionally shorter and more generic than the AI-generated version. It provides the core factual content (savings amount, top recommendation) without attempting to match the AI's prose quality. Users who see the fallback still get a useful summary — they just don't get the personalized narrative.

The fallback uses the first finding with `monthlySavings > 0` as the `topRecommendation`. If no savings exist (isAlreadyOptimal), the fallback gracefully mentions "reviewing your current plan tiers."
