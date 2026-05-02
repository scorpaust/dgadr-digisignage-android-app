import { Contact, AIResponse } from "../types/chat";
import { GeminiService } from "./GeminiService";
import { RAGService } from "./RAGService";
import { ExcelService } from "./ExcelService";
import { KnowledgeBaseService } from "./KnowledgeBaseService";
import { RealDataService } from "./RealDataService";
import { AI_CONFIG, validateAIConfig } from "../config/ai";
import {
  ContactLookupService,
  DgadrLookupResult,
  ExternalLookupResult,
} from "./ContactLookupService";

export class AIService {
  private geminiService: GeminiService | null = null;
  private ragService: RAGService;
  private excelService: ExcelService;
  private knowledgeService: KnowledgeBaseService;
  private realDataService: RealDataService;
  private contactLookupService: ContactLookupService;

  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }> = [];

  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.ragService = RAGService.getInstance();
    this.excelService = ExcelService.getInstance();
    this.knowledgeService = KnowledgeBaseService.getInstance();
    this.realDataService = RealDataService.getInstance();
    this.contactLookupService = ContactLookupService.getInstance();
  }

  private async initializeServices(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      // Em dev, convém ver erros. Em prod podes silenciar.
      // console.log("AIService: initializing...");

      // Faz init "à prova de falhas": uma coisa pode falhar sem rebentar tudo.
      const results = await Promise.allSettled([
        this.contactLookupService.load(),
        this.ragService.loadKnowledgeBase(),
        this.knowledgeService.loadKnowledgeBase(),
        this.excelService.loadContacts(),
        this.realDataService.loadRealData(),
      ]);

      // Gemini é opcional
      if (validateAIConfig()) {
        this.geminiService = new GeminiService(AI_CONFIG.GEMINI_API_KEY);
      }

      // Se quiseres, podes logar as falhas em dev:
      // results.forEach((r, i) => {
      //   if (r.status === "rejected") console.warn("Init step failed:", i, r.reason);
      // });

      this.isInitialized = true;
    })();

    try {
      await this.initPromise;
    } finally {
      // Liberta o lock (mas isInitialized já ficou true)
      this.initPromise = null;
    }
  }

  public async processQuery(query: string): Promise<AIResponse> {
    await this.initializeServices();

    try {
      // ── Passo 0: rejeitar temas completamente fora de âmbito ─────────────
      if (this.isCompletelyIrrelevantQuery(query)) {
        return {
          answer:
            "Esta questão não se enquadra nas competências da DGADR. A DGADR atua em matérias de agricultura e desenvolvimento rural.",
          contacts: [],
        };
      }

      // ── Passo 0b: perguntas sobre pessoas / organograma ───────────────────
      if (this.isPersonnelQuery(query)) {
        return {
          answer:
            "Para informação sobre a estrutura orgânica e dirigentes da DGADR, consulte o portal institucional em www.dgadr.gov.pt.",
          contacts: [],
        };
      }

      // ── Passo 1: lookup estruturado (central telefónica + entidades externas)
      const lookupResult = await this.contactLookupService.lookup(query);

      if (lookupResult?.type === "dgadr") {
        return this.buildDgadrResponse(lookupResult as DgadrLookupResult);
      }

      if (lookupResult?.type === "external") {
        return this.buildExternalResponse(lookupResult as ExternalLookupResult);
      }

      // ── Passo 2: RAG (knowledge base com embeddings / pesquisa local) ─────
      let answer = "";
      let ragContacts: Contact[] = [];

      try {
        const ragResponse = await this.ragService.query(query, 5);
        if (ragResponse && ragResponse.confidence >= 0.5) {
          answer = ragResponse.answer;
          if (ragResponse.contacts?.length) {
            ragContacts = ragResponse.contacts.map((c) => ({
              name: c.name,
              phone: c.phone,
              email: "",
              department: c.department,
            }));
          }
        }
      } catch {
        // RAG falhou, continua para fallbacks
      }

      // ── Passo 3: Gemini fallback ──────────────────────────────────────────
      if (!answer && this.geminiService && AI_CONFIG.USE_FALLBACK_WHEN_API_FAILS) {
        try {
          answer = await this.geminiService.processQuery(
            query,
            this.conversationHistory,
          );
          this.conversationHistory.push(
            { role: "user", content: query },
            { role: "assistant", content: answer },
          );
          if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
          }
        } catch {
          answer = this.generateFallbackResponse(query);
        }
      } else if (!answer) {
        answer = this.generateFallbackResponse(query);
      }

      // ── Passo 4: complementar com realDataService ─────────────────────────
      const keywords = this.extractKeywords(query);
      const realData = await this.realDataService.searchRealData(query);

      if (realData.procedures.length > 0) {
        answer += "\n\n" + realData.procedures.join("\n\n");
      }

      const rawContacts: Contact[] =
        ragContacts.length > 0
          ? ragContacts
          : realData.contacts.length > 0
            ? realData.contacts
            : this.findRelevantContacts(keywords);

      return { answer, contacts: this.sanitizeContacts(rawContacts) };
    } catch {
      return {
        answer:
          "Exmo.(a) Senhor(a), ocorreu um erro ao processar a sua questão. Por favor, utilize os nossos contactos institucionais para apoio.",
        contacts: this.getDefaultContacts(),
      };
    }
  }

  // ── Response builders ───────────────────────────────────────────────────────

  private buildDgadrResponse(result: DgadrLookupResult): AIResponse {
    const answer = this.contactLookupService.formatDgadrAnswer(result);
    return { answer, contacts: result.contacts };
  }

  private buildExternalResponse(result: ExternalLookupResult): AIResponse {
    const answer = this.contactLookupService.formatExternalAnswer(result);
    const contacts = this.contactLookupService.externalToContacts(result);
    return { answer, contacts };
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
        "porco",
        "suíno",
        "bovino",
        "ovino",
        "caprino",
        "avícola",
        "bem-estar animal",
        "cativeiro",
        "capar",
        "castrar",
        "vacinar",
      ],
      CCDR: [
        "cartão aplicador",
        "produtos fitofarmacêuticos",
        "apf",
        "aplicador fitofarmacêuticos",
        "renovação cartão",
        "cartão fitossanitário",
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
            s,
          );
        case "DDAAFA":
          return /diversifica[cç][aã]o|forma[cç][aã]o|associativismo|produtores/.test(
            s,
          );
        case "DIH":
          return /infraestruturas? hidr[aá]ulicas?|barragem|conduta|valas?/.test(
            s,
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
      keywords.some((kw) => matches(c, kw)),
    );

    if (relevant.length === 0) {
      const general = contacts.find(
        (c) =>
          c.department.toLowerCase().includes("geral") ||
          c.department.toLowerCase().includes("atendimento"),
      );
      return general ? [general] : this.getDefaultContacts();
    }

    return relevant.slice(0, 2);
  }

  /**
   * Otimiza contactos para segurança e performance
   */
  private optimizeContactsForSecurity(contacts: Contact[]): Contact[] {
    if (contacts.length === 0) {
      // Se não há contacto específico, usa o geral da DGADR
      return [
        {
          name: "DGADR",
          phone: "21 844 22 00",
          email: "",
          department: "Informações",
        },
      ];
    }

    // Verifica se são contactos CCDR (precisam de mostrar todos)
    const areCCDRContacts = contacts.some((c) =>
      c.name.toLowerCase().includes("ccdr"),
    );

    if (areCCDRContacts) {
      // Para CCDR, mostra todas as regiões (remove emails por segurança)
      return contacts.map((contact) => ({
        name: contact.name.replace(/CCDR\s*/i, "").trim(),
        phone: contact.phone || "",
        email: "", // Remove email por segurança
        department: "Cartão Aplicador Fitofarmacêuticos",
      }));
    }

    // Para outros contactos externos, apenas o primeiro
    const primaryContact = contacts[0];
    const isExternalContact = !primaryContact.phone?.startsWith("21 844");

    if (isExternalContact) {
      return [
        {
          name: primaryContact.name,
          phone: primaryContact.phone || "",
          email: "", // Remove email por segurança
          department: primaryContact.department,
        },
      ];
    } else {
      // Para contactos DGADR, simplifica o nome
      return [
        {
          name: "DGADR",
          phone: primaryContact.phone || "21 844 22 00",
          email: "", // Remove email por segurança
          department: "Informações",
        },
      ];
    }
  }

  /**
   * Extrai o nome da entidade dos contactos para incluir na resposta
   */
  private getEntityNameFromContacts(contacts: Contact[]): string | null {
    if (contacts.length === 0) return null;

    const contact = contacts[0];
    const name = contact.name.toLowerCase();

    if (name.includes("dgav"))
      return "DGAV (Direção-Geral de Alimentação e Veterinária)";
    if (name.includes("icnf"))
      return "ICNF (Instituto da Conservação da Natureza e das Florestas)";
    if (name.includes("ifap"))
      return "IFAP (Instituto de Financiamento da Agricultura e Pescas)";
    if (name.includes("ccdr"))
      return "CCDR da sua região (escolha conforme a localização da exploração)";
    if (name.includes("apa")) return "APA (Agência Portuguesa do Ambiente)";
    if (name.includes("arh"))
      return "ARH (Administração da Região Hidrográfica)";

    return contact.name;
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
   * Encaminhamentos externos baseados no conteúdo da pergunta
   */
  private getExternalRedirections(keywords: string[]): Contact[] {
    const query = keywords.join(" ").toLowerCase();
    const list: Contact[] = [];

    // Assuntos veterinários/animais → DGAV
    if (
      keywords.includes("DGAV") ||
      /animal|veterinár|sanidade|doença|certificado|matadouro|segurança alimentar|capar|castrar|vacinar|bem-estar animal|porco|vaca|ovelha|cabra|galinha|suíno|bovino|ovino|caprino|avícola|cativeiro|manter.*animal/.test(
        query,
      )
    ) {
      list.push({
        name: "DGAV",
        phone: "213 239 500",
        email: "",
        department: "Sanidade Animal e Segurança Alimentar",
      });
    }

    // Assuntos florestais → ICNF
    if (
      keywords.includes("ICNF") ||
      /floresta|árvore|corte|licenciamento florestal|caça|natura/.test(query)
    ) {
      list.push({
        name: "ICNF",
        phone: "213 507 900",
        email: "",
        department: "Assuntos Florestais",
      });
    }

    // Candidaturas e pagamentos → IFAP
    if (
      keywords.includes("IFAP") ||
      /candidatura|pagamento|pepac|parcelário|apoio financeiro/.test(query)
    ) {
      list.push({
        name: "IFAP",
        phone: "212 427 708",
        email: "",
        department: "Candidaturas e Pagamentos",
      });
    }

    // Para cartão aplicador, não cria contactos aqui - deixa o RealDataService tratar
    // (o RealDataService tem todas as CCDR definidas)

    // Se não encontrou nenhum específico, retorna contacto geral da DGADR
    return list.length > 0 ? list : this.getDefaultContacts();
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

  /**
   * Returns true if the query is asking about DGADR staff, directors, or org chart.
   * These questions must never be answered with personal names.
   */
  private isPersonnelQuery(query: string): boolean {
    const q = query.toLowerCase();
    return [
      "diretor-geral", "diretora-geral", "diretor geral", "diretora geral",
      "presidente da dgadr", "quem chefia", "quem dirige",
      "como se chama o diretor", "como se chama a diretora",
      "nome do diretor", "nome da diretora",
      "organograma",
    ].some((k) => q.includes(k));
  }

  /**
   * Removes personal names from contacts before they reach the UI.
   * Replaces any contact whose name looks like a person (contains salutation
   * or a "FirstName Surname" pattern) with just the department / "DGADR".
   */
  private sanitizeContacts(contacts: Contact[]): Contact[] {
    const salutationRe = /^(dr\.?[aº]?|eng\.?[aº]?|prof\.?|dra\.?)\s/i;
    const fullNameRe = /^[A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ][a-záàâãéèêíìîóòôõúùûç]+ [A-ZÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/;

    return contacts.map((c) => {
      const isPersonName = salutationRe.test(c.name) || fullNameRe.test(c.name);
      if (!isPersonName) return c;
      return {
        ...c,
        name: c.department || "DGADR",
        email: "",
      };
    });
  }

  public clearConversationHistory(): void {
    this.conversationHistory = [];
  }
}
