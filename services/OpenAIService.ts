import { WebSearchService } from "./WebSearchService";
import { FileSearchService } from "./FileSearchService";

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private systemPrompt: string;
  private webSearchService: WebSearchService;
  private fileSearchService: FileSearchService;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.webSearchService = WebSearchService.getInstance();
    this.fileSearchService = FileSearchService.getInstance();

    this.systemPrompt = `És um assistente especializado da DGADR (Direção-Geral de Agricultura e Desenvolvimento Rural de Portugal).

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
- Se a pergunta for sobre assuntos agrícolas/rurais mas que são competência de outras entidades (ex: florestas→ICNF, veterinária/animais/capar/castrar→DGAV, pagamentos→IFAP), responde: "Não tenho informação específica sobre este assunto."
- NÃO forneças contactos para perguntas completamente fora de âmbito

FERRAMENTAS DISPONÍVEIS:
Tens acesso a ferramentas de pesquisa em ficheiros internos da DGADR.

INSTRUÇÕES:
- SEMPRE pesquisa informação específica antes de responder
- Usa APENAS dados reais dos ficheiros da DGADR
- Respostas CONCISAS e diretas (máximo 2-3 frases)
- Tom formal mas acessível
- Foca apenas na informação essencial
- NUNCA menciones números de telefone ou emails na resposta
- O contacto será fornecido automaticamente pelo sistema
- Se não encontrares informação, diz "Não tenho essa informação específica"

PROCESSO:
1. Identifica o tópico da pergunta
2. Pesquisa informação específica nos ficheiros da DGADR
3. Responde APENAS com dados encontrados nos ficheiros
4. Indica contacto específico da DGADR para o assunto
5. Se não encontrares informação, recomenda contacto geral da DGADR

CONTACTO GERAL OFICIAL DA DGADR:
Telefone: 21 844 22 00
Email: geral@dgadr.pt
NUNCA uses outros números que não estejam nos ficheiros fornecidos.`;
  }

  public async processQuery(
    query: string,
    conversationHistory: Array<{
      role: "user" | "assistant";
      content: string;
    }> = []
  ): Promise<string> {
    try {
      // 1. Pesquisa informação específica nos ficheiros
      const fileResults = await this.fileSearchService.searchFiles(query);
      let contextInfo = "";

      if (fileResults.length > 0) {
        contextInfo = "\n\nINFORMAÇÃO ENCONTRADA NOS FICHEIROS DGADR:\n";
        fileResults.forEach((result) => {
          contextInfo += `\n${result.filename}:\n${result.content}\n`;
        });
      }

      // 2. Se necessário, pesquisa informação adicional na web
      const keywords = this.extractKeywordsInternal(query);
      const webResults = await this.webSearchService.searchDGADRSites(query);

      if (webResults.length > 0) {
        contextInfo += "\n\nINFORMAÇÃO ADICIONAL WEB:\n";
        webResults.forEach((result) => {
          contextInfo += `\n${result.title}: ${result.snippet}\n`;
        });
      }

      // 3. Constrói prompt com informação específica
      const enhancedPrompt =
        this.systemPrompt +
        contextInfo +
        "\n\nCom base na informação específica acima, responde à pergunta do utilizador de forma direta e precisa." +
        "\n\nLEMBRETE CRÍTICO: NÃO menciones números de telefone ou emails na resposta." +
        "\nO contacto será fornecido automaticamente pelo sistema.";

      const messages: OpenAIMessage[] = [
        { role: "system", content: enhancedPrompt },
        ...conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: query },
      ];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 400, // Reduzido para respostas mais concisas e rápidas
            temperature: 0.5, // Reduzido para respostas mais focadas
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('❌ OpenAI API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });
        throw new Error(`OpenAI API Error: ${response.status} - ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();

      let aiResponse =
        data.choices[0]?.message?.content ||
        "Peço desculpa, mas não consegui processar a sua pergunta. Por favor, contacte-nos diretamente.";

      // Validação crítica: corrige números incorretos da DGADR
      aiResponse = this.validateAndFixDGADRNumbers(aiResponse);

      return aiResponse;
    } catch (error: any) {
      console.error('❌ OpenAI Service Error:', error.message || error);
      throw new Error(`Erro ao processar pergunta com IA: ${error.message || 'Unknown error'}`);
    }
  }

  public extractKeywords(query: string): string[] {
    return this.extractKeywordsInternal(query);
  }

  private validateAndFixDGADRNumbers(response: string): string {
    // Lista de números incorretos que a IA pode inventar
    const incorrectNumbers = [
      "21 844 00 00",
      "21 844 11 11",
      "21 844 22 22",
      "21 844 33 33",
      "21 844 44 44",
      "21 844 50 00",
      "21 844 10 00",
      "21 844 20 00",
      "21 844 30 00",
      "21 844 40 00",
      "21 844 11 00",
      "21 844 12 00",
      "21 844 13 00",
      "21 844 14 00",
      "21 844 15 00",
      "218 44",
      "218 442",
    ];

    let correctedResponse = response;

    // Remove qualquer menção a números de telefone ou emails da resposta
    correctedResponse = correctedResponse.replace(
      /21\s*844\s*\d{2}\s*\d{2}/g,
      ""
    );
    correctedResponse = correctedResponse.replace(/geral@dgadr\.pt/gi, "");
    correctedResponse = correctedResponse.replace(/\(\s*\|\s*\)/g, ""); // Remove () vazios
    correctedResponse = correctedResponse.replace(/\s+\|\s*$/g, ""); // Remove | no final
    correctedResponse = correctedResponse.replace(/\s{2,}/g, " "); // Remove espaços duplos
    correctedResponse = correctedResponse.trim();

    return correctedResponse;
  }

  private extractKeywordsInternal(query: string): string[] {
    const normalizedQuery = query.toLowerCase();
    const keywords: string[] = [];

    const keywordMap = {
      apoios: [
        "apoio",
        "subsídio",
        "financiamento",
        "candidatura",
        "proderam",
        "familiar",
      ],
      jovens: ["jovem", "agricultor", "instalação", "primeiro"],
      florestal: [
        "floresta",
        "incêndio",
        "árvore",
        "madeira",
        "licenciamento",
        "corte",
      ],
      animal: [
        "animal",
        "veterinário",
        "doença",
        "sanidade",
        "laboratório",
        "certificado",
      ],
      vegetal: [
        "planta",
        "praga",
        "doença",
        "fitossanitário",
        "cultura",
        "vegetal",
      ],
      alimentar: ["segurança", "alimentar", "controlo", "inspeção", "alimento"],
      biblioteca: ["biblioteca", "documentação", "publicação", "livro"],
    };

    for (const [category, categoryKeywords] of Object.entries(keywordMap)) {
      if (
        categoryKeywords.some((keyword) => normalizedQuery.includes(keyword))
      ) {
        keywords.push(category);
      }
    }

    return keywords.length > 0 ? keywords : ["geral"];
  }
}
