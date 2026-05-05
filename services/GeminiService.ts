import Constants from "expo-constants";
import { WebSearchService } from "./WebSearchService";
import { FileSearchService } from "./FileSearchService";

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: GeminiPart[];
    };
  }>;
}

const MODEL = "gemini-3.1-flash-lite-preview";
const GROUNDING_MODEL = "gemini-3.1-flash-lite-preview";

const SYSTEM_PROMPT = `És um assistente especializado da DGADR (Direção-Geral de Agricultura e Desenvolvimento Rural de Portugal).

REGRAS CRÍTICAS:
- NUNCA inventes informação legislativa ou números de contacto
- APENAS usa informação dos ficheiros internos da DGADR fornecidos
- Se não encontrares informação específica, diz que não tens essa informação
- NUNCA menciones legislação que não esteja nos ficheiros da DGADR
- O número geral da DGADR é SEMPRE: 21 844 22 00
- NUNCA uses números como 21 844 00 00, 21 844 11 11, 21 844 50 00 ou similares
- Se recomendares contactar a DGADR, usa SEMPRE: 21 844 22 00 | geral@dgadr.pt

DETEÇÃO DE ÂMBITO:
- Se a pergunta for sobre desporto, entretenimento, política, saúde, tecnologia, turismo urbano, educação escolar, ou outros temas não relacionados com agricultura/desenvolvimento rural, responde: "Esta questão não se enquadra nas competências da DGADR. A DGADR atua em matérias de agricultura e desenvolvimento rural."
- Se a pergunta for sobre assuntos agrícolas/rurais mas que são competência de outras entidades (ex: florestas→ICNF, veterinária/animais→DGAV, pagamentos/apoios→IFAP), responde: "Não tenho informação específica sobre este assunto."
- NÃO forneças contactos para perguntas completamente fora de âmbito

INSTRUÇÕES:
- SEMPRE pesquisa informação específica antes de responder
- Usa APENAS dados reais dos ficheiros da DGADR
- Respostas CONCISAS e diretas (máximo 2-3 frases)
- Tom formal mas acessível
- Foca apenas na informação essencial
- NUNCA menciones números de telefone ou emails na resposta
- O contacto será fornecido automaticamente pelo sistema
- Se não encontrares informação, diz "Não tenho essa informação específica"

CONTACTO GERAL OFICIAL DA DGADR:
Telefone: 21 844 22 00
Email: geral@dgadr.pt
NUNCA uses outros números que não estejam nos ficheiros fornecidos.`;

export class GeminiService {
  private apiKey: string;
  private webSearchService: WebSearchService;
  private fileSearchService: FileSearchService;

  constructor(apiKey: string) {
    // Aceita chave passada, ou lê directamente do Constants (igual ao RAGService)
    this.apiKey =
      apiKey ||
      (Constants.expoConfig?.extra?.GOOGLE_API_KEY as string | undefined) ||
      "";
    console.log(this.apiKey
      ? `✅ GeminiService: chave configurada (${this.apiKey.slice(0, 8)}...)`
      : "⚠️ GeminiService: sem chave API — web search desativado");
    this.webSearchService = WebSearchService.getInstance();
    this.fileSearchService = FileSearchService.getInstance();
  }

  public async processQuery(
    query: string,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  ): Promise<string> {
    try {
      // 1. Fetch context from internal files
      const fileResults = await this.fileSearchService.searchFiles(query);
      let contextInfo = "";

      if (fileResults.length > 0) {
        contextInfo = "\n\nINFORMAÇÃO ENCONTRADA NOS FICHEIROS DGADR:\n";
        fileResults.forEach((result) => {
          contextInfo += `\n${result.filename}:\n${result.content}\n`;
        });
      }

      // 2. Optional web context
      const webResults = await this.webSearchService.searchDGADRSites(query);
      if (webResults.length > 0) {
        contextInfo += "\n\nINFORMAÇÃO ADICIONAL WEB:\n";
        webResults.forEach((result) => {
          contextInfo += `\n${result.title}: ${result.snippet}\n`;
        });
      }

      // 3. Build contents array (history + current query)
      const contents: GeminiContent[] = [
        ...conversationHistory.map((msg) => ({
          role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user" as const,
          parts: [
            {
              text:
                contextInfo.length > 0
                  ? `${contextInfo}\n\nCom base na informação acima, responde de forma direta e concisa. NUNCA menciones números de telefone ou emails.\n\nPergunta: ${query}`
                  : query,
            },
          ],
        },
      ];

      const body = {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 400,
        },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("❌ Gemini API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new Error(`Gemini API Error: ${response.status} - ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      let aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Peço desculpa, mas não consegui processar a sua pergunta. Por favor, contacte-nos diretamente.";

      aiResponse = this.sanitizeResponse(aiResponse);
      return aiResponse;
    } catch (error: any) {
      console.error("❌ Gemini Service Error:", error.message || error);
      throw new Error(`Erro ao processar pergunta com IA: ${error.message || "Unknown error"}`);
    }
  }

  /**
   * Queries Gemini with Google Search grounding restricted to DGADR/agriculture sites.
   * Returns null if no useful answer is found or the model signals no information.
   */
  /**
   * Searches dgadr.gov.pt and agricultura.gov.pt via DuckDuckGo, then asks
   * Gemini to answer based on those results. No grounding API required.
   */
  /**
   * Uses gemini-3.1-flash-lite-preview with Google Search grounding
   * to search dgadr.gov.pt and agricultura.gov.pt for an answer.
   */
  public async queryWithSiteGrounding(query: string): Promise<string | null> {
    if (!this.apiKey) return null;

    try {
      const body = {
        systemInstruction: {
          parts: [{
            text:
              "És um assistente da DGADR. Pesquisa nos sites dgadr.gov.pt e agricultura.gov.pt para responder. " +
              "Se não encontrares informação útil, responde apenas com: SEM_INFORMACAO. " +
              "Podes incluir nomes de dirigentes e responsáveis públicos constantes nos sites oficiais. " +
              "Nunca incluas números de telefone ou emails. " +
              "Resposta concisa, máximo 3 frases, em português formal.",
          }],
        },
        contents: [{
          role: "user" as const,
          parts: [{ text: `site:dgadr.gov.pt OR site:agricultura.gov.pt — ${query}` }],
        }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 350 },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GROUNDING_MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errBody = await response.text();
        console.warn("⚠️ Gemini grounding error:", response.status, errBody.slice(0, 200));
        return null;
      }

      const data: GeminiResponse = await response.json();
      const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      console.log("🔍 Gemini grounding:", text.slice(0, 120));

      if (!text || text.includes("SEM_INFORMACAO") || text.trim().length < 20) return null;

      return this.sanitizeResponse(text.replace(/\[\d+\]/g, "").trim());
    } catch (err: any) {
      console.warn("⚠️ Gemini grounding exception:", err?.message ?? err);
      return null;
    }
  }

  // Strip any phone numbers or emails the model may hallucinate
  private sanitizeResponse(response: string): string {
    return response
      // Remove phone numbers
      .replace(/\b21\s*844\s*\d{2}\s*\d{2}\b/g, "")
      // Remove any email address
      .replace(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi, "")
      // Remove orphaned contact labels left after value removal
      .replace(/\b[Tt]elef(?:one)?\.?\s*:?\s*/g, "")
      .replace(/\b[Ee]-?mail\.?\s*:?\s*/g, "")
      // Remove pipe separators (used as contact separators by the model)
      .replace(/\s*\|\s*/g, " ")
      // Remove citation markers like [1]
      .replace(/\[\d+\]/g, "")
      // Clean up whitespace and stray punctuation
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([.,;:])/g, "$1")
      .trim();
  }
}
