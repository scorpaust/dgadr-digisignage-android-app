// Removido FileSystem para evitar erros nativos

export class KnowledgeBaseService {
  private static instance: KnowledgeBaseService;
  private knowledgeBase: string = "";
  private links: string[] = [];
  private isLoaded = false;

  public static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService();
    }
    return KnowledgeBaseService.instance;
  }

  public async loadKnowledgeBase(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Carrega links
      await this.loadLinks();

      // Carrega base de conhecimento expandida
      this.loadExpandedKnowledge();

      this.isLoaded = true;
    } catch (error) {
      this.loadBasicKnowledge();
    }
  }

  private async loadLinks(): Promise<void> {
    try {
      // Por agora usa links padrão - em produção carregaria de fonte externa
      this.links = this.getDefaultLinks();
    } catch (error) {
      this.links = this.getDefaultLinks();
    }
  }

  private getDefaultLinks(): string[] {
    // Ligações institucionais e plataformas DGADR (e encaminhamentos úteis)
    return [
      "https://www.dgadr.gov.pt", // Portal DGADR
      "https://tradicional.dgadr.gov.pt/", // Produtos Tradicionais Portugueses
      "https://parceriaptsolo.dgadr.gov.pt", // Parceria Portuguesa para o Solo
      "https://sir.dgadr.gov.pt/pt", // Sistema de Informação do Regadio
      "https://www.rederural.gov.pt/pt", // Rede Rural Nacional
      "https://saaf.dgadr.gov.pt", // Agricultura Familiar (SAAF)
      "https://app.dgadr.gov.pt/rectec/menu_publico", // Registo de Técnicos (RecTec)
      "https://agrifam.dgadr.gov.pt/app_Login", // Plataforma AgriFam
      "https://biblioteca.dgadr.pt", // Biblioteca DGADR
      "https://snisolos.dgadr.gov.pt", // Sistema Nacional de Informação de Solos
      // Encaminhamentos externos (não DGADR) úteis ao utilizador
      "https://www.ifap.pt", // Candidaturas/Pagamentos PEPAC
      "https://www.dgav.pt", // Sanidade Animal e Segurança Alimentar
      "https://www.icnf.pt", // Assuntos florestais
    ];
  }

  private loadExpandedKnowledge(): void {
    this.knowledgeBase = `
DIREÇÃO-GERAL DE AGRICULTURA E DESENVOLVIMENTO RURAL (DGADR)

MISSÃO E COMPETÊNCIAS (Âmbito nacional):
A DGADR é um serviço da administração direta do Estado que assegura o apoio técnico e a execução de políticas públicas nas áreas de:
- Engenharia e Ordenamento do Espaço Rural
- Regadio e Infraestruturas Hidráulicas de fins agrícolas
- Gestão dos Recursos Naturais (solo e água) em contexto agrícola
- Qualidade e Recursos Genéticos
- Apoio às Explorações Agrícolas e Rede de Aconselhamento
- Diversificação da Atividade Agrícola, Formação e Associativismo

Divisões (principais):
- DAEA — Divisão de Apoio às Explorações Agrícolas
- DQRG — Divisão da Qualidade e Recursos Genéticos
- DGRN — Divisão de Gestão dos Recursos Naturais
- DOER — Divisão do Ordenamento do Espaço Rural
- DDAAFA — Divisão da Diversificação da Atividade Agrícola, Formação e Associativismo
- DIH — Divisão de Infraestruturas Hidráulicas
- DER — Divisão de Engenharia Rural
- DIR — Divisão do Regadio

ENCAMINHAMENTOS FORA DE ÂMBITO DGADR:
- Assuntos florestais: ICNF
- Sanidade animal e segurança alimentar: DGAV
- Candidaturas e pagamentos (PEPAC): IFAP

AGRICULTURA E APOIOS (enquadramento técnico):
- PEPAC/Portugal: enquadramento técnico DGADR; candidaturas e pagamentos via IFAP
- Jovens agricultores/Jovem Empresário Rural, investimentos, modernização, bio, agroambientais: consultar avisos/IFAP e orientações técnicas DGADR

ORDENAMENTO, ENGENHARIA E REGA:
- Ordenamento do espaço rural, estruturação fundiária, caminhos e drenagem (DOER/DER)
- Regadio público, exploração de aproveitamentos hidroagrícolas e reabilitação de infraestruturas (DIR/DIH)
- Gestão sustentável do solo e da água; conservação e eficiência hídrica (DGRN)

QUALIDADE E RECURSOS GENÉTICOS:
- Conservação e valorização de recursos genéticos e material de reprodução vegetal (DQRG)
- Produtos Tradicionais Portugueses (portal Tradicional)

DIVERSIFICAÇÃO, FORMAÇÃO E ASSOCIATIVISMO:
- Diversificação da atividade agrícola, cadeias curtas, organizações de produtores e formação (DDAAFA)
- Rede Rural Nacional (articulação)

SERVIÇOS E PLATAFORMAS DIGITAIS:
- Portal institucional: www.dgadr.gov.pt
- SIR — Sistema de Informação do Regadio
- SAAF — Sistema de Apoio à Atividade Agrícola Familiar
- RecTec — Registo de Técnicos
- AgriFam — plataforma de apoio à agricultura familiar
- Biblioteca Digital DGADR
- SNISolos — Sistema Nacional de Informação de Solos
- Tradicional — Produtos Tradicionais Portugueses

HORÁRIOS E ATENDIMENTO:
- Funcionamento: Segunda a Sexta, 09:00–17:00
- Atendimento ao público: Preferencialmente com marcação prévia
- Telefone geral: 21 844 22 00
- Email geral: geral@dgadr.pt

NOTAS LEGAIS (referências de enquadramento):
- Diplomas orgânicos e regulamentação setorial aplicável às áreas de atuação DGADR
- Regulamentação PEPAC e avisos IFAP (apoios)
- Normas técnicas e orientações publicadas pela DGADR

CONTACTOS:
O encaminhamento para a divisão competente deve atender ao tema e localização da exploração/projeto.
`;
  }

  private loadBasicKnowledge(): void {
    // Versão básica caso haja problemas – sem referências erradas de âmbito/região
    this.knowledgeBase = `
A DGADR tem âmbito nacional e atua em engenharia e ordenamento do espaço rural, regadio e infraestruturas hidráulicas, gestão de recursos naturais (solo e água), qualidade e recursos genéticos, apoio às explorações e diversificação/associativismo.

Encaminhamentos fora de âmbito:
- ICNF: matérias florestais
- DGAV: sanidade animal e segurança alimentar
- IFAP: candidaturas e pagamentos de apoios (PEPAC)

Contacto: 21 844 22 00 | geral@dgadr.pt | www.dgadr.gov.pt
`;
  }

  public getKnowledgeBase(): string {
    return this.knowledgeBase;
  }

  public getLinks(): string[] {
    return this.links;
  }

  /**
   * Devolve ligações relevantes consoante palavras-chave.
   * Aceita termos genéricos (ex.: "regadio", "apoios") ou tags internas (ex.: "DAEA", "DIR").
   */
  public findRelevantLinks(keywords: string[]): string[] {
    const relevant: string[] = [];

    const add = (url: string) => relevant.push(url);

    keywords.forEach((kwRaw) => {
      const kw = kwRaw.toLowerCase();

      // Divisões DGADR
      if (/(daea|aconselhamento|apoio t[eé]cnico|explora[cç][aã]o)/.test(kw)) {
        add("https://www.dgadr.gov.pt"); // Página institucional e notícias/avisos
      }
      if (
        /(dqrg|recursos gen[eé]ticos|qualidade|sementes|material de propaga[cç][aã]o)/.test(
          kw
        )
      ) {
        add("https://tradicional.dgadr.gov.pt/");
        add("https://www.dgadr.gov.pt");
      }
      if (
        /(dgrn|solo|[ée]ros[aã]o|efici[eê]ncia h[ií]drica|recursos naturais)/.test(
          kw
        )
      ) {
        add("https://parceriaptsolo.dgadr.gov.pt");
        add("https://snisolos.dgadr.gov.pt");
      }
      if (
        /(doer|ordenamento|espa[cç]o rural|emparcelamento|estrutura[cç][aã]o)/.test(
          kw
        )
      ) {
        add("https://www.dgadr.gov.pt");
      }
      if (
        /(ddAAfa|diversifica[cç][aã]o|associativismo|forma[cç][aã]o|organiza[cç][oõ]es de produtores|cadeia curta)/i.test(
          kw
        )
      ) {
        add("https://www.rederural.gov.pt/pt");
        add("https://www.dgadr.gov.pt");
      }
      if (
        /(dih|infraestruturas? hidr[aá]ulicas?|barragem|conduta|valas?)/.test(
          kw
        )
      ) {
        add("https://www.dgadr.gov.pt");
      }
      if (/(der|engenharia rural|caminhos|drenagem)/.test(kw)) {
        add("https://www.dgadr.gov.pt");
      }
      if (
        /(dir|regadio|rega|aproveitamento hidroagr[ií]cola|bloco de rega|sir)/.test(
          kw
        )
      ) {
        add("https://sir.dgadr.gov.pt/pt");
        add("https://www.dgadr.gov.pt");
      }

      // Temas transversais
      if (
        /(apoios|subs[ií]dio|financiamento|candidatura|pepac|ifap)/.test(kw)
      ) {
        add("https://www.ifap.pt"); // Candidaturas/Pagamentos
        add("https://www.rederural.gov.pt/pt"); // Informação e rede
      }
      if (/(agricultura familiar|saaf|agrifam)/.test(kw)) {
        add("https://saaf.dgadr.gov.pt");
        add("https://agrifam.dgadr.gov.pt/app_Login");
      }
      if (/(biblioteca|publica[cç][oõ]es)/.test(kw)) {
        add("https://biblioteca.dgadr.pt");
      }

      // Encaminhamentos fora de âmbito
      if (
        /(floresta|licenciamento florestal|corte de [aá]rvores|icnf)/.test(kw)
      ) {
        add("https://www.icnf.pt");
      }
      if (
        /(sanidade|animal|veterin[aá]ria|seguran[çc]a alimentar|dgav)/.test(kw)
      ) {
        add("https://www.dgav.pt");
      }
    });

    // Inclui sempre o portal principal da DGADR
    add("https://www.dgadr.gov.pt");

    // Remove duplicados preservando ordem
    return Array.from(new Set(relevant));
  }
}
