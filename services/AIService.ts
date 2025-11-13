import { Contact, AIResponse } from "../types/chat";
import { OpenAIService } from "./OpenAIService";
import { ExcelService } from "./ExcelService";
import { KnowledgeBaseService } from "./KnowledgeBaseService";
import { RealDataService } from "./RealDataService";
import { AI_CONFIG, validateAIConfig } from "../config/ai";

export class AIService {
  private openAIService: OpenAIService | null = null;
  private excelService: ExcelService;
  private knowledgeService: KnowledgeBaseService;
  private realDataService: RealDataService;
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];
  private isInitialized = false;

  constructor() {
    this.excelService = ExcelService.getInstance();
    this.knowledgeService = KnowledgeBaseService.getInstance();
    this.realDataService = RealDataService.getInstance();
    // Nota: initializeServices é async; processQuery volta a chamar para garantir que ficou concluído.
    void this.initializeServices();
  }

  private async initializeServices() {
    if (this.isInitialized) return;

    try {
      if (validateAIConfig()) {
        this.openAIService = new OpenAIService(AI_CONFIG.OPENAI_API_KEY);
        console.log("✅ OpenAI inicializada com sucesso");
      }

      await this.knowledgeService.loadKnowledgeBase();
      await this.excelService.loadContacts();
      await this.realDataService.loadRealData();

      this.isInitialized = true;
      console.log("✅ AIService inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar AIService:", error);
    }
  }

  public async processQuery(query: string): Promise<AIResponse> {
    await this.initializeServices();

    try {
      let answer: string;
      let relevantContacts: Contact[] = [];

      if (this.openAIService && AI_CONFIG.USE_FALLBACK_WHEN_API_FAILS) {
        try {
          answer = await this.openAIService.processQuery(
            query,
            this.conversationHistory
          );

          this.conversationHistory.push(
            { role: "user", content: query },
            { role: "assistant", content: answer }
          );

          if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
          }

          console.log("✅ Resposta gerada pela OpenAI");
        } catch (openAIError) {
          console.warn("⚠️ Erro na OpenAI, usando fallback:", openAIError);
          answer = this.generateFallbackResponse(query);
        }
      } else {
        answer = this.generateFallbackResponse(query);
      }

      const keywords = this.extractKeywords(query);
      const realData = await this.realDataService.searchRealData(query);

      // Ajuste de âmbito institucional: DGADR é de âmbito nacional (não apenas Alentejo)
      if (realData.isOutOfScope) {
        // Verifica se é uma pergunta completamente irrelevante ou se tem encaminhamento
        const isCompletelyIrrelevant = this.isCompletelyIrrelevantQuery(query);

        if (isCompletelyIrrelevant) {
          answer =
            "Esta questão não se enquadra nas competências da DGADR. A DGADR atua em matérias de agricultura e desenvolvimento rural.";
          relevantContacts = []; // Não fornece contactos para perguntas irrelevantes
        } else {
          answer =
            "Exmo.(a) Senhor(a), a questão apresentada não se enquadra nas competências da DGADR. A DGADR tem âmbito nacional e atua em matérias de engenharia e ordenamento rural, regadio, infraestruturas hidráulicas, gestão de recursos naturais, qualidade e recursos genéticos, apoio às explorações e diversificação/associativismo. Para a sua questão, sugerimos o contacto com a entidade competente.";
          relevantContacts =
            realData.externalContacts && realData.externalContacts.length > 0
              ? realData.externalContacts
              : this.getExternalRedirections(keywords);
        }
      } else {
        relevantContacts =
          realData.contacts.length > 0
            ? realData.contacts
            : this.findRelevantContacts(keywords);

        if (realData.procedures.length > 0) {
          answer += "\n\n" + realData.procedures.join("\n\n");
        }
      }

      return {
        answer,
        contacts: relevantContacts,
      };
    } catch (error) {
      console.error("❌ Erro ao processar pergunta:", error);

      return {
        answer:
          "Exmo.(a) Senhor(a), ocorreu um erro ao processar a sua questão. Por favor, utilize os nossos contactos institucionais para apoio.",
        contacts: this.getDefaultContacts(),
      };
    }
  }

  /**
   * Respostas “fallback” alinhadas com as divisões da DGADR e encaminhamentos corretos.
   */
  private generateFallbackResponse(query: string): string {
    const q = query.toLowerCase();

    // PEPAC / apoios (DGADR apoia tecnicamente; pagamentos e candidaturas via IFAP)
    if (
      this.containsKeywords(q, [
        "apoio",
        "subsídio",
        "financiamento",
        "candidatura",
        "pepac",
        "ifap",
      ])
    ) {
      return (
        "A DGADR presta enquadramento técnico em matérias do PEPAC, nomeadamente no apoio às explorações e na rede de aconselhamento. " +
        "As candidaturas e pagamentos são geridos pelo IFAP. Para instruções, consulte o IFAP e, quando aplicável, as orientações publicadas pela DGADR."
      );
    }

    // Regadio e infraestruturas hidráulicas (DIR/DIH)
    if (
      this.containsKeywords(q, [
        "regadio",
        "rega",
        "bloco",
        "aproveitamento hidroagrícola",
        "infraestrutura hidráulica",
        "barragem",
        "valas",
        "conduta",
      ])
    ) {
      return (
        "Questões sobre regadio público, exploração de aproveitamentos hidroagrícolas e infraestruturas hidráulicas são da competência da DGADR, " +
        "em particular da Divisão do Regadio (DIR) e da Divisão de Infraestruturas Hidráulicas (DIH)."
      );
    }

    // Ordenamento do espaço rural / emparcelamento / perímetros rurais (DOER/DER)
    if (
      this.containsKeywords(q, [
        "ordenamento",
        "espaço rural",
        "emparcelamento",
        "estruturacao fundiaria",
        "reparcelamento",
        "caminhos rurais",
        "drenagem",
      ])
    ) {
      return (
        "Em matérias de ordenamento do espaço rural, estruturação fundiária, caminhos e drenagem agrícola, a competência recai na DGADR, " +
        "através da Divisão do Ordenamento do Espaço Rural (DOER) e da Divisão de Engenharia Rural (DER)."
      );
    }

    // Gestão de recursos naturais: solo/água/erosão/eficiência (DGRN)
    if (
      this.containsKeywords(q, [
        "solo",
        "erosão",
        "conservação",
        "água",
        "recursos naturais",
        "eficiência hídrica",
        "drenagem agrícola",
      ])
    ) {
      return (
        "A gestão sustentável de recursos naturais (solo e água), incluindo conservação e eficiência hídrica em contexto agrícola, " +
        "é acompanhada pela DGADR através da Divisão de Gestão dos Recursos Naturais (DGRN)."
      );
    }

    // Qualidade e recursos genéticos (DQRG)
    if (
      this.containsKeywords(q, [
        "recursos genéticos",
        "variedades tradicionais",
        "qualidade",
        "sementes",
        "material de propagação",
        "conservação on-farm",
      ])
    ) {
      return (
        "Assuntos de qualidade e recursos genéticos, incluindo conservação e valorização de variedades e material de reprodução vegetal, " +
        "são acompanhados pela DGADR via Divisão da Qualidade e Recursos Genéticos (DQRG)."
      );
    }

    // Diversificação, formação e associativismo (DDAAFA)
    if (
      this.containsKeywords(q, [
        "diversificação",
        "turismo em espaço rural",
        "formação",
        "associativismo",
        "organizações de produtores",
        "cadeia curta",
      ])
    ) {
      return (
        "Temas de diversificação da atividade agrícola, formação e associativismo (incluindo organizações de produtores) " +
        "são tratados pela DGADR na Divisão da Diversificação da Atividade Agrícola, Formação e Associativismo (DDAAFA)."
      );
    }

    // Aconselhamento/Apoio técnico às explorações (DAEA)
    if (
      this.containsKeywords(q, [
        "aconselhamento",
        "apoio técnico",
        "exploração agrícola",
        "rede de aconselhamento",
        "serviços de aconselhamento",
      ])
    ) {
      return "Para apoio técnico e rede de aconselhamento agrícola, a DGADR atua através da Divisão de Apoio às Explorações Agrícolas (DAEA).";
    }

    // Encaminhamentos fora de âmbito (ICNF, DGAV, IFAP)
    if (
      this.containsKeywords(q, [
        "floresta",
        "árvore",
        "madeira",
        "licenciamento florestal",
        "corte",
      ])
    ) {
      return (
        "Assuntos florestais (licenciamentos, gestão florestal e recursos silvícolas) são da competência do ICNF. " +
        "A DGADR pode prestar enquadramento quando interfira com ordenamento/engenharia rural."
      );
    }
    if (
      this.containsKeywords(q, [
        "animal",
        "veterinár",
        "sanidade",
        "zoossanit",
        "certificado veterinário",
        "bem-estar animal",
      ])
    ) {
      return (
        "Matérias de sanidade e certificação veterinária são da competência da DGAV. " +
        "A DGADR não emite pareceres sanitários."
      );
    }
    if (
      this.containsKeywords(q, [
        "segurança alimentar",
        "controlo oficial",
        "higiene",
        "estabelecimento alimentar",
      ])
    ) {
      return (
        "Segurança alimentar e controlos oficiais são da competência da DGAV. " +
        "A DGADR não executa inspeções higiossanitárias."
      );
    }

    // Informação institucional e contactos
    if (
      this.containsKeywords(q, [
        "horário",
        "funcionamento",
        "atendimento",
        "contacto",
        "morada",
      ])
    ) {
      return (
        "Informação e atendimento DGADR: utilize o contacto institucional (telefone e email gerais) ou dirija-se ao atendimento mediante marcação. " +
        "Para questões técnicas, indique sempre o tema para encaminhamento à divisão competente."
      );
    }

    // Genérica (alinhada ao mandato DGADR)
    return (
      "A DGADR atua nas áreas de engenharia e ordenamento rural, regadio e infraestruturas hidráulicas, gestão de recursos naturais, " +
      "qualidade e recursos genéticos, apoio às explorações, e diversificação/associativismo. Indique o tema para encaminhamento à divisão competente."
    );
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some((k) => text.includes(k));
  }

  /**
   * Extrai palavras-chave e mapeia para as divisões DGADR.
   */
  private extractKeywords(query: string): string[] {
    const q = query.toLowerCase();
    const keywords: string[] = [];

    const keywordMap: Record<string, string[]> = {
      // Divisões DGADR
      DAEA: [
        "aconselhamento",
        "apoio técnico",
        "exploração",
        "serviços de aconselhamento",
      ],
      DQRG: [
        "recursos genéticos",
        "variedade",
        "sementes",
        "qualidade",
        "material de propagação",
      ],
      DGRN: [
        "solo",
        "erosão",
        "conservação",
        "água",
        "recursos naturais",
        "eficiência hídrica",
      ],
      DOER: [
        "ordenamento",
        "espaço rural",
        "emparcelamento",
        "estruturação",
        "reparcelamento",
      ],
      DDAAFA: [
        "diversificação",
        "turismo",
        "formação",
        "associativismo",
        "organizações de produtores",
      ],
      DIH: [
        "infraestrutura hidráulica",
        "barragem",
        "conduta",
        "valas",
        "obras hidráulicas",
      ],
      DER: [
        "engenharia rural",
        "caminhos rurais",
        "drenagem",
        "reabilitação de vias",
      ],
      DIR: ["regadio", "rega", "aproveitamento hidroagrícola", "bloco de rega"],

      // Encaminhamentos externos
      ICNF: [
        "floresta",
        "árvore",
        "madeira",
        "corte",
        "licenciamento florestal",
      ],
      DGAV: [
        "animal",
        "veterinár",
        "sanidade",
        "segurança alimentar",
        "higiene",
        "estabelecimento",
      ],
      IFAP: ["apoio", "subsídio", "financiamento", "candidatura", "pepac"],
    };

    for (const [tag, list] of Object.entries(keywordMap)) {
      if (list.some((k) => q.includes(k))) keywords.push(tag);
    }

    return keywords.length > 0 ? keywords : ["GERAL"];
  }

  /**
   * Procura contactos relevantes (preferindo Excel; caso vazio, usa defaults).
   * Filtra no máx. 2 contactos para concisão.
   */
  private findRelevantContacts(keywords: string[]): Contact[] {
    const contacts = this.excelService.getContacts();

    const matches = (c: Contact, kw: string) => {
      const s = `${c.name} ${c.department}`.toLowerCase();
      switch (kw) {
        case "DAEA":
          return /apoio|aconselhamento|explora[cç][aã]o/.test(s);
        case "DQRG":
          return /qualidade|gen[eé]ticos|sementes|propaga[cç][aã]o/.test(s);
        case "DGRN":
          return /recursos|solo|[ée]ros[aã]o|[aá]gua/.test(s);
        case "DOER":
          return /ordenamento|espa[cç]o rural|emparcelamento|estrutura[cç][aã]o/.test(
            s
          );
        case "DDAAFA":
          return /diversifica[cç][aã]o|forma[cç][aã]o|associativismo|produtores/.test(
            s
          );
        case "DIH":
          return /infraestruturas? hidr[aá]ulicas?|barragem|conduta|valas?/.test(
            s
          );
        case "DER":
          return /engenharia rural|caminhos|drenagem/.test(s);
        case "DIR":
          return /regadio|rega|aproveitamento|bloco/.test(s);
        default:
          return /geral|atendimento|rece[cç][aã]o/.test(s);
      }
    };

    if (contacts.length === 0) {
      return this.getDefaultContacts();
    }

    const relevant = contacts.filter((c) =>
      keywords.some((kw) => matches(c, kw))
    );

    if (relevant.length === 0) {
      const general = contacts.find(
        (c) =>
          c.department.toLowerCase().includes("geral") ||
          c.department.toLowerCase().includes("atendimento")
      );
      return general ? [general] : this.getDefaultContacts();
    }

    return relevant.slice(0, 2);
  }

  /**
   * Verifica se a pergunta é completamente irrelevante para agricultura/desenvolvimento rural
   */
  private isCompletelyIrrelevantQuery(query: string): boolean {
    const q = query.toLowerCase();

    const irrelevantTopics = [
      "futebol",
      "jogos",
      "bola",
      "desporto",
      "cinema",
      "música",
      "entretenimento",
      "televisão",
      "política",
      "eleições",
      "moda",
      "tecnologia informática",
      "telemóveis",
      "carros",
      "automóveis",
      "seguros",
      "bancos",
      "crédito",
      "habitação urbana",
      "educação escolar",
      "universidades",
      "saúde humana",
      "medicamentos",
      "covid",
      "pandemia",
      "restaurantes",
      "hotéis",
      "turismo urbano",
    ];

    return irrelevantTopics.some((topic) => q.includes(topic));
  }

  /**
   * Encaminhamentos externos padrão, quando fora de âmbito.
   */
  private getExternalRedirections(keywords: string[]): Contact[] {
    const list: Contact[] = [];
    if (keywords.includes("DGAV")) {
      list.push({
        name: "Direção-Geral de Alimentação e Veterinária (DGAV)",
        phone: "213 239 500",
        email: "geral@dgav.pt",
        department: "Sanidade Animal e Segurança Alimentar",
      });
    }
    if (keywords.includes("ICNF")) {
      list.push({
        name: "Instituto da Conservação da Natureza e das Florestas (ICNF)",
        phone: "213 507 900",
        email: "geral@icnf.pt",
        department: "Assuntos Florestais",
      });
    }
    if (keywords.includes("IFAP")) {
      list.push({
        name: "IFAP, I.P.",
        phone: "212 427 708",
        email: "ifap@ifap.pt",
        department: "Candidaturas e Pagamentos (PEPAC)",
      });
    }
    return list.length > 0 ? list : [];
  }

  private getDefaultContacts(): Contact[] {
    // Ajuste conforme a lista institucional real/Excel.
    return [
      {
        name: "Atendimento Geral DGADR",
        phone: "21 844 22 00",
        email: "geral@dgadr.pt",
        department: "Informação e Encaminhamento",
      },
    ];
  }

  public clearConversationHistory(): void {
    this.conversationHistory = [];
  }
}
