import { describe, it, expect } from 'vitest';
import { PRICING, TOOL_NAMES, TOOL_PLAN_OPTIONS } from '../lib/pricingData';

describe('Pricing Data Validation', () => {
  it('Cursor Pro is $20/user/month', () => {
    expect(PRICING.cursor.pro.price).toBe(20);
    expect(PRICING.cursor.pro.pricePerUser).toBe(true);
  });

  it('Cursor Business is $40/user/month', () => {
    expect(PRICING.cursor.business.price).toBe(40);
  });

  it('GitHub Copilot Individual is $10/user/month', () => {
    expect(PRICING.githubCopilot.individual.price).toBe(10);
  });

  it('GitHub Copilot Business is $19/user/month', () => {
    expect(PRICING.githubCopilot.business.price).toBe(19);
  });

  it('Claude Pro is $20/user/month', () => {
    expect(PRICING.claude.pro.price).toBe(20);
  });

  it('Claude Max is $100/user/month', () => {
    expect(PRICING.claude.max.price).toBe(100);
  });

  it('Claude Team is $30/user/month', () => {
    expect(PRICING.claude.team.price).toBe(30);
  });

  it('ChatGPT Plus is $20/user/month', () => {
    expect(PRICING.chatgpt.plus.price).toBe(20);
  });

  it('Windsurf Pro is $15/user/month', () => {
    expect(PRICING.windsurf.pro.price).toBe(15);
  });

  it('Windsurf Team is $35/user/month', () => {
    expect(PRICING.windsurf.team.price).toBe(35);
  });

  it('Gemini Advanced is $19.99/user/month', () => {
    expect(PRICING.gemini.advanced.price).toBe(19.99);
  });

  it('all tool IDs have names defined', () => {
    const toolIds = Object.keys(TOOL_NAMES);
    expect(toolIds.length).toBeGreaterThanOrEqual(8);
    toolIds.forEach((id) => {
      expect(TOOL_NAMES[id as keyof typeof TOOL_NAMES]).toBeTruthy();
    });
  });

  it('all tools have at least one plan option', () => {
    const toolIds = Object.keys(TOOL_PLAN_OPTIONS);
    toolIds.forEach((id) => {
      const options = TOOL_PLAN_OPTIONS[id as keyof typeof TOOL_PLAN_OPTIONS];
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('business tier is always more expensive than individual/pro tier', () => {
    expect(PRICING.cursor.business.price).toBeGreaterThan(PRICING.cursor.pro.price!);
    expect(PRICING.githubCopilot.business.price).toBeGreaterThan(
      PRICING.githubCopilot.individual.price!
    );
    expect(PRICING.claude.team.price).toBeGreaterThan(PRICING.claude.pro.price!);
  });
});
