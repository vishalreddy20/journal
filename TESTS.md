# SpendLens — Test Documentation

## Test Runner

**Vitest** — configured in `vitest.config.ts` with:
- Environment: `jsdom`
- Path alias: `@` → project root
- No real API keys required (audit engine is pure TypeScript)

```bash
npm run test         # Run all tests once
npm run test:watch   # Watch mode
```

## Test Files

### `tests/auditEngine.test.ts` — 14 tests

Tests the core `runAudit()` function with deterministic inputs and verified expected outputs.

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | Cursor Business downgrade (<5 seats) | Business, 2 seats, coding | `downgrade` → Pro, saves $40/mo |
| 2 | Cursor Hobby for non-coding on Pro | Pro, 1 seat, writing | `downgrade` → Hobby, saves $20/mo |
| 3 | Copilot Individual for ≤2 users on Business | Business, 2 users, coding | `downgrade` → Individual, saves $18/mo |
| 4 | Claude Pro + ChatGPT Plus redundancy | Both active, 1 user, writing | ChatGPT → `switch`, reasoning contains 'redundant' |
| 5 | Claude Team → Pro for <5 users | Team, 3 seats, mixed | `downgrade` → Pro, saves $30/mo |
| 6 | credexRelevant = true when savings >$500 | Multi-tool, >$500 savings | `credexRelevant === true` |
| 7 | isAlreadyOptimal = true when savings = $0 | Cursor Hobby, $0 spend | `isAlreadyOptimal === true` |
| 8 | Correct savings calculation | Cursor Business + Copilot Business | Total saves $58/mo = $696/yr |
| 9 | Copilot Enterprise downgrade (<20 seats) | Enterprise, 10 seats | `downgrade` → Business, saves $200/mo |
| 10 | Windsurf Team → Pro (<5 seats) | Team, 3 seats | `downgrade`, saves $60/mo |
| 11 | Gemini Advanced + Claude Pro overlap | Both active, 1 user | Gemini → `switch` |
| 12 | Credits finding added (spend >$100/mo) | Cursor Pro, $200 spend | `consider-credits` finding exists |
| 13 | No credits finding (spend ≤$100/mo) | Cursor Hobby, $0 spend | No `consider-credits` finding |
| 14 | Claude Max → Pro (writing, >1 person) | Max, 3 seats, writing | `downgrade`, saves $240/mo |

### `tests/pricingData.test.ts` — 14 tests

Validates the pricing constants match the real vendor pricing.

| # | Test |
|---|------|
| 1 | Cursor Pro = $20/user/month |
| 2 | Cursor Business = $40/user/month |
| 3 | GitHub Copilot Individual = $10/user/month |
| 4 | GitHub Copilot Business = $19/user/month |
| 5 | Claude Pro = $20/user/month |
| 6 | Claude Max = $100/user/month |
| 7 | Claude Team = $30/user/month |
| 8 | ChatGPT Plus = $20/user/month |
| 9 | Windsurf Pro = $15/user/month |
| 10 | Windsurf Team = $35/user/month |
| 11 | Gemini Advanced = $19.99/user/month |
| 12 | All tool IDs have names defined (≥8 tools) |
| 13 | All tools have ≥1 plan option |
| 14 | Business tiers are more expensive than individual/pro |

## Test Results

```
 ✓ tests/pricingData.test.ts (14 tests)
 ✓ tests/auditEngine.test.ts (14 tests)

 Test Files  2 passed (2)
      Tests  28 passed (28)
   Duration  ~4s
```

## What's NOT tested (and why)

- **API routes** — Would require mocking Supabase and Resend. For MVP, integration-level confidence comes from manual testing the deployed app. A v2 test suite would add supertest-based API route tests with MSW mocks for external services.
- **React components** — UI rendering tests with `@testing-library/react` are planned but de-prioritized. The audit engine (where bugs are most costly) is fully tested; UI issues are caught in visual QA.
- **AI summary** — Non-deterministic by nature. The fallback function `buildFallback()` is testable (deterministic string template), but was omitted for brevity. A real production suite would test that the fallback returns a string of reasonable length.
