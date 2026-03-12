import type { AuthChoice, OnboardOptions } from "./onboard-types.js";

type OnboardProviderAuthOptionKey = keyof Pick<
  OnboardOptions,
  | "anthropicApiKey"
  | "openaiApiKey"
  | "openrouterApiKey"
  | "aiGatewayApiKey"
  | "cloudflareAiGatewayApiKey"
  | "moonshotApiKey"
  | "kimiCodeApiKey"
  | "geminiApiKey"
  | "zaiApiKey"
  | "xiaomiApiKey"
  | "minimaxApiKey"
  | "syntheticApiKey"
  | "veniceApiKey"
  | "togetherApiKey"
  | "huggingfaceApiKey"
  | "opencodeZenApiKey"
  | "xaiApiKey"
  | "litellmApiKey"
  | "qianfanApiKey"
  | "siliconflowGlobalApiKey"
  | "siliconflowCnApiKey"
  | "manusApiKey"
  | "claudeWebCookie"
  | "deepseekWebCookie"
  | "doubaoWebCookie"
  | "chatgptWebCookie"
  | "qwenWebCookie"
  | "kimiWebCookie"
  | "geminiWebCookie"
  | "grokWebCookie"
  | "zWebCookie"
  | "glmIntlWebCookie"
  | "manusWebCookie"
>;

export type OnboardProviderAuthFlag = {
  optionKey: OnboardProviderAuthOptionKey;
  authChoice: AuthChoice;
  cliFlag: `--${string}`;
  cliOption: `--${string} <key>`;
  description: string;
};

// Shared source for provider API-key flags used by CLI registration + non-interactive inference.
export const ONBOARD_PROVIDER_AUTH_FLAGS: ReadonlyArray<OnboardProviderAuthFlag> = [
  {
    optionKey: "anthropicApiKey",
    authChoice: "apiKey",
    cliFlag: "--anthropic-api-key",
    cliOption: "--anthropic-api-key <key>",
    description: "Anthropic API key",
  },
  {
    optionKey: "openaiApiKey",
    authChoice: "openai-api-key",
    cliFlag: "--openai-api-key",
    cliOption: "--openai-api-key <key>",
    description: "OpenAI API key",
  },
  {
    optionKey: "openrouterApiKey",
    authChoice: "openrouter-api-key",
    cliFlag: "--openrouter-api-key",
    cliOption: "--openrouter-api-key <key>",
    description: "OpenRouter API key",
  },
  {
    optionKey: "aiGatewayApiKey",
    authChoice: "ai-gateway-api-key",
    cliFlag: "--ai-gateway-api-key",
    cliOption: "--ai-gateway-api-key <key>",
    description: "Vercel AI Gateway API key",
  },
  {
    optionKey: "cloudflareAiGatewayApiKey",
    authChoice: "cloudflare-ai-gateway-api-key",
    cliFlag: "--cloudflare-ai-gateway-api-key",
    cliOption: "--cloudflare-ai-gateway-api-key <key>",
    description: "Cloudflare AI Gateway API key",
  },
  {
    optionKey: "moonshotApiKey",
    authChoice: "moonshot-api-key",
    cliFlag: "--moonshot-api-key",
    cliOption: "--moonshot-api-key <key>",
    description: "Moonshot API key",
  },
  {
    optionKey: "kimiCodeApiKey",
    authChoice: "kimi-code-api-key",
    cliFlag: "--kimi-code-api-key",
    cliOption: "--kimi-code-api-key <key>",
    description: "Kimi Coding API key",
  },
  {
    optionKey: "geminiApiKey",
    authChoice: "gemini-api-key",
    cliFlag: "--gemini-api-key",
    cliOption: "--gemini-api-key <key>",
    description: "Gemini API key",
  },
  {
    optionKey: "zaiApiKey",
    authChoice: "zai-api-key",
    cliFlag: "--zai-api-key",
    cliOption: "--zai-api-key <key>",
    description: "Z.AI API key",
  },
  {
    optionKey: "xiaomiApiKey",
    authChoice: "xiaomi-api-key",
    cliFlag: "--xiaomi-api-key",
    cliOption: "--xiaomi-api-key <key>",
    description: "Xiaomi API key",
  },
  {
    optionKey: "minimaxApiKey",
    authChoice: "minimax-api",
    cliFlag: "--minimax-api-key",
    cliOption: "--minimax-api-key <key>",
    description: "MiniMax API key",
  },
  {
    optionKey: "syntheticApiKey",
    authChoice: "synthetic-api-key",
    cliFlag: "--synthetic-api-key",
    cliOption: "--synthetic-api-key <key>",
    description: "Synthetic API key",
  },
  {
    optionKey: "veniceApiKey",
    authChoice: "venice-api-key",
    cliFlag: "--venice-api-key",
    cliOption: "--venice-api-key <key>",
    description: "Venice API key",
  },
  {
    optionKey: "togetherApiKey",
    authChoice: "together-api-key",
    cliFlag: "--together-api-key",
    cliOption: "--together-api-key <key>",
    description: "Together AI API key",
  },
  {
    optionKey: "huggingfaceApiKey",
    authChoice: "huggingface-api-key",
    cliFlag: "--huggingface-api-key",
    cliOption: "--huggingface-api-key <key>",
    description: "Hugging Face API key (HF token)",
  },
  {
    optionKey: "opencodeZenApiKey",
    authChoice: "opencode-zen",
    cliFlag: "--opencode-zen-api-key",
    cliOption: "--opencode-zen-api-key <key>",
    description: "OpenCode Zen API key",
  },
  {
    optionKey: "xaiApiKey",
    authChoice: "xai-api-key",
    cliFlag: "--xai-api-key",
    cliOption: "--xai-api-key <key>",
    description: "xAI API key",
  },
  {
    optionKey: "litellmApiKey",
    authChoice: "litellm-api-key",
    cliFlag: "--litellm-api-key",
    cliOption: "--litellm-api-key <key>",
    description: "LiteLLM API key",
  },
  {
    optionKey: "qianfanApiKey",
    authChoice: "qianfan-api-key",
    cliFlag: "--qianfan-api-key",
    cliOption: "--qianfan-api-key <key>",
    description: "QIANFAN API key",
  },
  {
    optionKey: "siliconflowGlobalApiKey",
    authChoice: "siliconflow-global-api-key",
    cliFlag: "--siliconflow-api-key",
    cliOption: "--siliconflow-api-key <key>",
    description: "SiliconFlow Global API key (Intl)",
  },
  {
    optionKey: "siliconflowCnApiKey",
    authChoice: "siliconflow-cn-api-key",
    cliFlag: "--siliconflow-cn-api-key",
    cliOption: "--siliconflow-cn-api-key <key>",
    description: "SiliconFlow China API key (CN)",
  },
  {
    optionKey: "manusApiKey",
    authChoice: "manus-api-key",
    cliFlag: "--manus-api-key",
    cliOption: "--manus-api-key <key>",
    description: "Manus API key (Credit-based, free tier)",
  },
  {
    optionKey: "claudeWebCookie",
    authChoice: "claude-web",
    cliFlag: "--claude-web-cookie",
    cliOption: "--claude-web-cookie <key>",
    description: "Claude Web session cookie",
  },
  {
    optionKey: "doubaoWebCookie",
    authChoice: "doubao-web",
    cliFlag: "--doubao-web-cookie",
    cliOption: "--doubao-web-cookie <key>",
    description: "Doubao Web session cookie",
  },
  {
    optionKey: "deepseekWebCookie",
    authChoice: "deepseek-web",
    cliFlag: "--deepseek-web-cookie",
    cliOption: "--deepseek-web-cookie <key>",
    description: "DeepSeek Web session cookie",
  },
  {
    optionKey: "chatgptWebCookie",
    authChoice: "chatgpt-web",
    cliFlag: "--chatgpt-web-cookie",
    cliOption: "--chatgpt-web-cookie <key>",
    description: "ChatGPT Web session cookie",
  },
  {
    optionKey: "qwenWebCookie",
    authChoice: "qwen-web",
    cliFlag: "--qwen-web-cookie",
    cliOption: "--qwen-web-cookie <key>",
    description: "Qwen Web session cookie",
  },
  {
    optionKey: "kimiWebCookie",
    authChoice: "kimi-web",
    cliFlag: "--kimi-web-cookie",
    cliOption: "--kimi-web-cookie <key>",
    description: "Kimi Web session cookie",
  },
  {
    optionKey: "geminiWebCookie",
    authChoice: "gemini-web",
    cliFlag: "--gemini-web-cookie",
    cliOption: "--gemini-web-cookie <key>",
    description: "Gemini Web session cookie",
  },
  {
    optionKey: "grokWebCookie",
    authChoice: "grok-web",
    cliFlag: "--grok-web-cookie",
    cliOption: "--grok-web-cookie <key>",
    description: "Grok Web session cookie",
  },
  {
    optionKey: "zWebCookie",
    authChoice: "z-web",
    cliFlag: "--z-web-cookie",
    cliOption: "--z-web-cookie <key>",
    description: "Z.AI Web session cookie",
  },
  {
    optionKey: "glmIntlWebCookie",
    authChoice: "glm-intl-web",
    cliFlag: "--glm-intl-web-cookie",
    cliOption: "--glm-intl-web-cookie <key>",
    description: "GLM Intl Web session cookie",
  },
  {
    optionKey: "manusWebCookie",
    authChoice: "manus-web",
    cliFlag: "--manus-web-cookie",
    cliOption: "--manus-web-cookie <key>",
    description: "Manus Web session cookie",
  },
];
