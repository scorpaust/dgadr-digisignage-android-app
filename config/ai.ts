// Configuração da IA
export const AI_CONFIG = {
  // IMPORTANTE: Substitua pela sua chave da OpenAI
  // Recomenda-se usar variáveis de ambiente em produção
  OPENAI_API_KEY:
    process.env.EXPO_PUBLIC_OPENAI_API_KEY || "sua-chave-openai-aqui",

  // Configurações do modelo
  MODEL: "gpt-4o-mini", // Modelo económico mas eficaz
  MAX_TOKENS: 800,
  TEMPERATURE: 0.7,

  // Configurações de fallback
  USE_FALLBACK_WHEN_API_FAILS: true,
  FALLBACK_TO_BASIC_AI: true,
};

// Validação da configuração
export const validateAIConfig = (): boolean => {
  if (
    !AI_CONFIG.OPENAI_API_KEY ||
    AI_CONFIG.OPENAI_API_KEY === "sua-chave-openai-aqui"
  ) {
    console.warn(
      "⚠️  Chave da OpenAI não configurada. Usando IA básica como fallback."
    );
    return false;
  }
  return true;
};
