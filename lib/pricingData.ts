// Pricing data — all verified against official pricing pages May 2026
// Sources cited in PRICING_DATA.md

export const PRICING = {
  cursor: {
    hobby: { price: 0, pricePerUser: true, label: 'Hobby (Free)' },
    pro: { price: 20, pricePerUser: true, label: 'Pro ($20/user/mo)' },
    business: { price: 40, pricePerUser: true, label: 'Business ($40/user/mo)' },
    enterprise: { price: null, pricePerUser: true, label: 'Enterprise (custom)' },
  },
  githubCopilot: {
    individual: { price: 10, pricePerUser: true, label: 'Individual ($10/user/mo)' },
    business: { price: 19, pricePerUser: true, label: 'Business ($19/user/mo)' },
    enterprise: { price: 39, pricePerUser: true, label: 'Enterprise ($39/user/mo)' },
  },
  claude: {
    free: { price: 0, pricePerUser: true, label: 'Free' },
    pro: { price: 20, pricePerUser: true, label: 'Pro ($20/user/mo)' },
    max: { price: 100, pricePerUser: true, label: 'Max ($100/user/mo)' },
    team: { price: 30, pricePerUser: true, label: 'Team ($30/user/mo, min 5 seats)' },
    enterprise: { price: null, pricePerUser: true, label: 'Enterprise (custom)' },
    apiDirect: { price: null, pricePerUser: false, label: 'API Direct (usage-based)' },
  },
  chatgpt: {
    plus: { price: 20, pricePerUser: true, label: 'Plus ($20/user/mo)' },
    team: { price: 30, pricePerUser: true, label: 'Team ($30/user/mo, min 2 seats)' },
    enterprise: { price: null, pricePerUser: true, label: 'Enterprise (custom)' },
    apiDirect: { price: null, pricePerUser: false, label: 'API Direct (usage-based)' },
  },
  gemini: {
    free: { price: 0, pricePerUser: true, label: 'Free' },
    advanced: { price: 19.99, pricePerUser: true, label: 'Gemini Advanced ($19.99/user/mo)' },
    apiDirect: { price: null, pricePerUser: false, label: 'API Direct (usage-based)' },
  },
  windsurf: {
    free: { price: 0, pricePerUser: true, label: 'Free' },
    pro: { price: 15, pricePerUser: true, label: 'Pro ($15/user/mo)' },
    team: { price: 35, pricePerUser: true, label: 'Team ($35/user/mo)' },
  },
  anthropicApi: {
    label: 'API Direct (usage-based)',
    baseRate: 'usage-based',
  },
  openaiApi: {
    gpt4o: { inputPer1M: 2.50, outputPer1M: 10.00, label: 'GPT-4o' },
    gpt4oMini: { inputPer1M: 0.15, outputPer1M: 0.60, label: 'GPT-4o-mini' },
    gpt35: { inputPer1M: 0.50, outputPer1M: 1.50, label: 'GPT-3.5' },
  },
} as const;

export type ToolId =
  | 'cursor'
  | 'githubCopilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropicApi'
  | 'openaiApi'
  | 'gemini'
  | 'windsurf';

export const TOOL_NAMES: Record<ToolId, string> = {
  cursor: 'Cursor',
  githubCopilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  anthropicApi: 'Anthropic API Direct',
  openaiApi: 'OpenAI API Direct',
  gemini: 'Google Gemini',
  windsurf: 'Windsurf',
};

export const TOOL_DESCRIPTIONS: Record<ToolId, string> = {
  cursor: 'AI-powered code editor',
  githubCopilot: 'GitHub\'s AI coding assistant',
  claude: 'Anthropic\'s AI assistant',
  chatgpt: 'OpenAI\'s ChatGPT',
  anthropicApi: 'Direct Anthropic API access',
  openaiApi: 'Direct OpenAI API access',
  gemini: 'Google\'s Gemini AI',
  windsurf: 'Codeium\'s AI code editor',
};

export const TOOL_PLAN_OPTIONS: Record<ToolId, { value: string; label: string }[]> = {
  cursor: [
    { value: 'hobby', label: 'Hobby (Free)' },
    { value: 'pro', label: 'Pro ($20/user/mo)' },
    { value: 'business', label: 'Business ($40/user/mo)' },
    { value: 'enterprise', label: 'Enterprise (custom)' },
  ],
  githubCopilot: [
    { value: 'individual', label: 'Individual ($10/user/mo)' },
    { value: 'business', label: 'Business ($19/user/mo)' },
    { value: 'enterprise', label: 'Enterprise ($39/user/mo)' },
  ],
  claude: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($20/user/mo)' },
    { value: 'max', label: 'Max ($100/user/mo)' },
    { value: 'team', label: 'Team ($30/user/mo, min 5 seats)' },
    { value: 'enterprise', label: 'Enterprise (custom)' },
    { value: 'apiDirect', label: 'API Direct' },
  ],
  chatgpt: [
    { value: 'plus', label: 'Plus ($20/user/mo)' },
    { value: 'team', label: 'Team ($30/user/mo)' },
    { value: 'enterprise', label: 'Enterprise (custom)' },
    { value: 'apiDirect', label: 'API Direct' },
  ],
  anthropicApi: [
    { value: 'usage', label: 'Usage-based' },
  ],
  openaiApi: [
    { value: 'gpt4o', label: 'GPT-4o' },
    { value: 'gpt4oMini', label: 'GPT-4o-mini' },
    { value: 'gpt35', label: 'GPT-3.5' },
  ],
  gemini: [
    { value: 'free', label: 'Free' },
    { value: 'advanced', label: 'Gemini Advanced ($19.99/user/mo)' },
    { value: 'apiDirect', label: 'API Direct' },
  ],
  windsurf: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($15/user/mo)' },
    { value: 'team', label: 'Team ($35/user/mo)' },
  ],
};
