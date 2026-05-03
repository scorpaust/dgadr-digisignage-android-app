import Constants from "expo-constants";

// Lê a chave por ordem de preferência:
// 1. EXPO_PUBLIC_GEMINI_API_KEY (variável pública Expo)
// 2. EXPO_PUBLIC_GOOGLE_API_KEY (alternativa pública)
// 3. Constants.expoConfig.extra.GOOGLE_API_KEY (via app.config.ts — funciona com GOOGLE_API_KEY no .env)
const resolvedKey: string =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
  (Constants.expoConfig?.extra?.GOOGLE_API_KEY as string | undefined) ||
  "";

export const AI_CONFIG = {
  GEMINI_API_KEY: resolvedKey,
  USE_FALLBACK_WHEN_API_FAILS: true,
  FALLBACK_TO_BASIC_AI: true,
};

export const validateAIConfig = (): boolean =>
  AI_CONFIG.GEMINI_API_KEY.length > 0;
