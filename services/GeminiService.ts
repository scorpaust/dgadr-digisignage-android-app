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
              "És um assistente especializado da DGADR (Direção-Geral de Agricultura e Desenvolvimento Rural). " +
              "A tua única fonte de informação são os sites dgadr.gov.pt e agricultura.gov.pt. " +
              "Pesquisa nesses sites de forma exaustiva: páginas principais, publicações, legislação, notícias, documentos e páginas antigas. " +
              "Se após pesquisar não encontrares informação útil, responde apenas: SEM_INFORMACAO. " +
              "Podes mencionar nomes de dirigentes e responsáveis públicos que constem nos sites oficiais. " +
              "Nunca incluas números de telefone ou endereços de email. " +
              "Responde em português formal, de forma completa e clara.",
          }],
        },
        contents: [{
          role: "user" as const,
          parts: [{ text: `site:dgadr.gov.pt OR site:agricultura.gov.pt ${query}` }],
        }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
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
      const groundingMeta = (data.candidates?.[0] as any)?.groundingMetadata;

      console.log("🔍 Gemini grounding resposta:", text.slice(0, 200));
      if (groundingMeta?.webSearchQueries) {
        console.log("🔎 Queries enviadas ao Google:", groundingMeta.webSearchQueries);
      }

      if (!text || text.includes("SEM_INFORMACAO") || text.trim().length < 20) return null;

      return this.sanitizeResponse(text.replace(/\[\d+\]/g, "").trim());
    } catch (err: any) {
      console.warn("⚠️ Gemini grounding exception:", err?.message ?? err);
      return null;
    }
  }

  // Strip any phone numbers or emails the model may hallucinate
  private sanitizeResponse(response: string): string {
    let text = response
      .replace(/\b21\s*844\s*\d{2}\s*\d{2}\b/g, "")
      .replace(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi, "")
      .replace(/\b[Tt]elef(?:one)?\.?\s*:?\s*/g, "")
      .replace(/\b[Ee]-?mail\.?\s*:?\s*/g, "")
      .replace(/\s*\|\s*/g, " ")
      .replace(/\[\d+\]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Remove cadeias de palavras órfãs antes de pontuação final (aplica em loop até estabilizar)
    // Ex: "através do ou ." → "através do ." → "através ." → remove frase incompleta
    const orphan = /\s+\b(o|a|os|as|um|uma|do|da|dos|das|de|em|no|na|nos|nas|por|para|ao|à|pelo|pela|via|através|número|numero|contacto|endereço|ou|e|nem|mais|mas|que|com)\b\s*([.!?])/gi;
    let prev = "";
    while (prev !== text) {
      prev = text;
      text = text.replace(orphan, "$2");
    }

    return text
      .replace(/[,:;]\s*([.!?])/g, "$1")
      .replace(/\s+([.,;:])/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
}
