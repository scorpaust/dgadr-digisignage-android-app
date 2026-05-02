// Configuração da IA
export const AI_CONFIG = {
  GEMINI_API_KEY:
    process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",

  // Configurações de fallback
  USE_FALLBACK_WHEN_API_FAILS: true,
  FALLBACK_TO_BASIC_AI: true,
};

// Validação da configuração
export const validateAIConfig = (): boolean => {
  return !!AI_CONFIG.GEMINI_API_KEY && AI_CONFIG.GEMINI_API_KEY.length > 0;
};
