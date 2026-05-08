# SpendLens — Pricing Data

All pricing verified against official vendor pages. Prices shown are monthly, per user unless noted.

---

## Cursor
**Source**: https://cursor.com/pricing  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Hobby | $0/user/month | Free tier with limited AI requests |
| Pro | $20/user/month | Unlimited completions, priority models |
| Business | $40/user/month | SSO, usage analytics, admin controls |
| Enterprise | Custom | Private deployment, security reviews |

---

## GitHub Copilot
**Source**: https://github.com/features/copilot#pricing  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Individual | $10/user/month | Basic code completion |
| Business | $19/user/month | Policy management, audit logs |
| Enterprise | $39/user/month | Fine-tuning, IP indemnity SLAs |

---

## Claude (Anthropic)
**Source**: https://claude.ai/upgrade  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Limited daily messages |
| Pro | $20/user/month | Higher limits, priority access |
| Max | $100/user/month | 5× Pro usage limits |
| Team | $30/user/month | Minimum 5 seats required |
| Enterprise | Custom | SAML SSO, data retention controls |
| API Direct | Usage-based | See Anthropic API pricing |

---

## ChatGPT (OpenAI)
**Source**: https://openai.com/chatgpt/pricing  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Plus | $20/user/month | GPT-4o, DALL-E, advanced data analysis |
| Team | $30/user/month | Shared workspace, admin console, min 2 seats |
| Enterprise | Custom | SOC2, SSO, expanded context |
| API Direct | Usage-based | See OpenAI API pricing |

---

## Google Gemini
**Source**: https://one.google.com/about/plans  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Gemini 1.5 Flash access |
| Gemini Advanced | $19.99/user/month | Gemini Ultra 1.0, 1TB Google One storage |
| API Direct | Usage-based | Google AI Studio / Vertex AI |

---

## Windsurf (Codeium)
**Source**: https://windsurf.com/pricing  
**Verified**: 2026-05-07

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0 | Basic AI code completion |
| Pro | $15/user/month | Advanced models, unlimited completions |
| Team | $35/user/month | Team admin, shared context |

---

## OpenAI API
**Source**: https://openai.com/api/pricing  
**Verified**: 2026-05-07

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o-mini | $0.15 | $0.60 |
| GPT-3.5 Turbo | $0.50 | $1.50 |

---

## Anthropic API
**Source**: https://www.anthropic.com/pricing  
**Verified**: 2026-05-07

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| claude-3-5-sonnet-20241022 | $3.00 | $15.00 |
| claude-3-5-haiku-20241022 | $0.80 | $4.00 |
| claude-haiku-3-20240307 | $0.25 | $1.25 |
| claude-opus-4 | $15.00 | $75.00 |

---

## Update Policy

Pricing is re-verified weekly. All figures hardcoded in `lib/pricingData.ts` will be audited against the sources above. The `PRICING_DATA.md` will be updated with new dates when prices change.

**Last full verification**: 2026-05-07  
**Maintainer**: SpendLens / Credex engineering team
