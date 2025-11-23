import { Contact } from "../types/chat";

interface RealDataResult {
  contacts: Contact[];
  procedures: string[];
  legislation: string[];
  isOutOfScope?: boolean;
  externalContacts?: Contact[];
}

export class RealDataService {
  private static instance: RealDataService;
  private realContacts: Contact[] = [];
  private externalContacts: Contact[] = [];
  private procedures: Map<string, string> = new Map();
  private legislation: Map<string, string> = new Map();
  private isLoaded = false;

  public static getInstance(): RealDataService {
    if (!RealDataService.instance) {
      RealDataService.instance = new RealDataService();
    }
    return RealDataService.instance;
  }

  public async loadRealData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Carrega contactos reais da DGADR
      await this.loadRealContacts();

      // Carrega contactos externos
      await this.loadExternalContacts();

      // Carrega procedimentos específicos
      await this.loadProcedures();

      // Carrega legislação relevante
      await this.loadLegislation();

      this.isLoaded = true;
    } catch (error) {
      // Erro silencioso para produção
    }
  }

  private async loadRealContacts(): Promise<void> {
    // Contactos reais da DGADR baseados na lista oficial
    this.realContacts = [
      // Estatuto Agricultura Familiar
      {
        name: "Dr. Rodrigo Câmara",
        phone: "21 844 24 44",
        email: "rcamara@dgadr.pt",
        department: "Estatuto Agricultura Familiar",
      },
      {
        name: "Eng.ª Fernanda Castiço",
        phone: "21 844 24 43",
        email: "fcastico@dgadr.pt",
        department: "Estatuto Agricultura Familiar",
      },

      // Jovem Empresário Rural
      {
        name: "Eng.ª Manuela Joia",
        phone: "21 844 24 54",
        email: "mjoia@dgadr.pt",
        department: "Jovem Empresário Rural",
      },
      {
        name: "Dr. Rodrigo Câmara",
        phone: "21 844 24 44",
        email: "rcamara@dgadr.pt",
        department: "Jovem Empresário Rural",
      },

      // Produção Biológica
      {
        name: "Eng.º Carlos Carvalho",
        phone: "21 844 23 81",
        email: "ccarvalho@dgadr.pt",
        department: "Produção Biológica",
      },
      {
        name: "Eng.ª Ana Paula Rodrigues",
        phone: "21 844 24 21",
        email: "anarodrigues@dgadr.pt",
        department: "Produção Biológica",
      },
      {
        name: "Eng.º Afonso Mateus",
        phone: "21 844 24 26",
        email: "amateus@dgadr.pt",
        department: "Produção Biológica",
      },
      {
        name: "Dr. Lázaro Simbine",
        phone: "21 844 24 29",
        email: "lazaro@dgadr.pt",
        department: "Produção Biológica",
      },
      {
        name: "Dr.ª Diana Marques",
        phone: "21 844 24 52",
        email: "dmarques@dgadr.pt",
        department: "Produção Biológica",
      },

      // Produção Integrada (PRODI)
      {
        name: "Eng.ª Mafalda Rosa",
        phone: "21 844 24 32",
        email: "mrosa@dgadr.pt",
        department: "Produção Integrada",
      },
      {
        name: "Eng.ª Paula Rocha",
        phone: "21 844 23 93",
        email: "procha@dgadr.pt",
        department: "Produção Integrada",
      },

      // Indicações Geográficas (DOP/IGP/ETG)
      {
        name: "Eng.º Carlos Carvalho",
        phone: "21 844 23 81",
        email: "ccarvalho@dgadr.pt",
        department: "Indicações Geográficas",
      },
      {
        name: "Eng.ª Mafalda Rosa",
        phone: "21 844 24 32",
        email: "mrosa@dgadr.pt",
        department: "Indicações Geográficas",
      },
      {
        name: "Dr.ª Rosa Cardoso",
        phone: "21 844 23 94",
        email: "rcardoso@dgadr.pt",
        department: "Indicações Geográficas",
      },

      // Estruturação Fundiária / Emparcelamento
      {
        name: "Dr. Rodrigo Câmara",
        phone: "21 844 24 44",
        email: "rcamara@dgadr.pt",
        department: "Estruturação Fundiária",
      },
      {
        name: "Dr. João Mesquita",
        phone: "21 844 24 78",
        email: "jmesquita@dgadr.pt",
        department: "Estruturação Fundiária",
      },
      {
        name: "Eng.ª Fernanda Castiço",
        phone: "21 844 24 43",
        email: "fcastico@dgadr.pt",
        department: "Estruturação Fundiária",
      },

      // Aproveitamentos Hidroagrícolas
      {
        name: "Eng.ª Isabel Loureiro",
        phone: "21 844 24 51",
        email: "iloureiro@dgadr.pt",
        department: "Aproveitamentos Hidroagrícolas",
      },
      {
        name: "Dr.ª Anabela Marreiros",
        phone: "21 844 24 57",
        email: "amarreiros@dgadr.pt",
        department: "Aproveitamentos Hidroagrícolas",
      },

      // Uso Eficiente da Água
      {
        name: "Dr.ª Vanda Feliz",
        phone: "21 844 24 67",
        email: "vfeliz@dgadr.pt",
        department: "Uso Eficiente Água",
      },
      {
        name: "Eng.ª Raquel Carvalho",
        phone: "21 844 24 86",
        email: "rcarvalho@dgadr.pt",
        department: "Uso Eficiente Água",
      },
      {
        name: "Eng.ª Gabriela Salvado",
        phone: "21 844 24 42",
        email: "gsalvado@dgadr.pt",
        department: "Uso Eficiente Água",
      },

      // Benefício Fiscal Gasóleo Agrícola
      {
        name: "Mariana Sardinha",
        phone: "21 844 24 18",
        email: "msardinha@dgadr.pt",
        department: "Gasóleo Agrícola",
      },
      {
        name: "Cristiana Moura",
        phone: "21 844 24 69",
        email: "cmoura@dgadr.pt",
        department: "Gasóleo Agrícola",
      },
      {
        name: "Eng.º Manuel Pousinho",
        phone: "21 844 24 90",
        email: "masantos@dgadr.pt",
        department: "Gasóleo Agrícola",
      },

      // Mecanização Agrária / Tratores
      {
        name: "Eng.ª Ana Nunes",
        phone: "21 844 24 73",
        email: "anunes@dgadr.pt",
        department: "Mecanização Agrária",
      },

      // Agrupamentos de Produtores
      {
        name: "Eng.º Paulo Machado",
        phone: "21 844 23 96",
        email: "pmachado@dgadr.pt",
        department: "Agrupamentos Produtores",
      },
      {
        name: "Eng.ª Cristina Roxo",
        phone: "21 844 23 91",
        email: "croxo@dgadr.pt",
        department: "Agrupamentos Produtores",
      },

      // Formação Profissional
      {
        name: "Eng.ª Ana Massavanhane",
        phone: "21 844 23 83",
        email: "amassavanhane@dgadr.pt",
        department: "Formação Profissional",
      },

      // Associativismo Agrícola
      {
        name: "Eng.ª Joaquina Fonseca",
        phone: "21 844 23 92",
        email: "quina@dgadr.pt",
        department: "Associativismo Agrícola",
      },
      // LEADER
      {
        name: "Eng.ª Maísa Oliveira",
        phone: "21 844 23 76",
        email: "moliveira@dgadr.pt",
        department: "LEADER",
      },
      {
        name: "Eng.ª Ana Ribes",
        phone: "21 844 23 86",
        email: "aribes@dgadr.pt",
        department: "LEADER",
      },

      // Programa Apicultura (PNASA)
      {
        name: "Dr.ª Rita Correia",
        phone: "21 844 24 13",
        email: "rcorreia@dgadr.pt",
        department: "Programa Apicultura",
      },
      {
        name: "Dr.ª Tatiana Mota",
        phone: "21 844 23 87",
        email: "tmota@dgadr.pt",
        department: "Programa Apicultura",
      },

      // Programa Frutas & Hortícolas
      {
        name: "Dr.ª Rita Correia",
        phone: "21 844 24 13",
        email: "rcorreia@dgadr.pt",
        department: "Programa Frutas Hortícolas",
      },
      {
        name: "Dr.ª Mafalda Henriques",
        phone: "21 844 23 95",
        email: "mhenriques@dgadr.pt",
        department: "Programa Frutas Hortícolas",
      },

      // Bem-Estar Animal (PEPAC)
      {
        name: "Eng.º João Salgueiro",
        phone: "21 844 23 85",
        email: "jsalgueiro@dgadr.pt",
        department: "Bem-Estar Animal",
      },
      {
        name: "Dr. Fábio Pequeneza",
        phone: "21 844 24 25",
        email: "fpequeneza@dgadr.pt",
        department: "Bem-Estar Animal",
      },

      // Águas Residuais / Ambiente
      {
        name: "Dr.ª Teresa Tavares",
        phone: "21 844 24 14",
        email: "ttavares@dgadr.pt",
        department: "Águas Residuais",
      },
      {
        name: "Eng.ª Sónia Sousa",
        phone: "21 844 24 22",
        email: "ssousa@dgadr.pt",
        department: "Águas Residuais",
      },

      // Fertilizantes
      {
        name: "Eng.º Afonso Mateus",
        phone: "21 844 24 26",
        email: "amateus@dgadr.pt",
        department: "Fertilizantes",
      },

      // Arquivo/Biblioteca
      {
        name: "Dr. Miguel Coelho",
        phone: "21 844 22 42",
        email: "mcoelho@dgadr.pt",
        department: "Arquivo Biblioteca",
      },
      {
        name: "Liliana Figueiredo",
        phone: "21 844 22 25",
        email: "lfigueiredo@dgadr.pt",
        department: "Arquivo Biblioteca",
      },

      // Contacto Geral
      {
        name: "Receção Geral",
        phone: "21 844 22 00",
        email: "geral@dgadr.pt",
        department: "Atendimento Geral",
      },
    ];
  }

  private async loadExternalContacts(): Promise<void> {
    // Contactos externos para assuntos fora da competência da DGADR
    this.externalContacts = [
      // Domínio Público Hídrico
      {
        name: "APA - Agência Portuguesa do Ambiente",
        phone: "214 728 200",
        email: "geral@apambiente.pt",
        department: "Domínio Público Hídrico",
      },

      // Recursos Hídricos
      {
        name: "ARH Tejo e Oeste",
        phone: "218 430 400",
        email: "arhtejo@apambiente.pt",
        department: "Poços e Furos",
      },
      {
        name: "ARH Algarve",
        phone: "218 430 000",
        email: "arhalgarve@apambiente.pt",
        department: "Poços e Furos",
      },
      {
        name: "ARH Centro",
        phone: "239 850 200",
        email: "arhcentro@apambiente.pt",
        department: "Poços e Furos",
      },
      {
        name: "ARH Alentejo",
        phone: "284 315 440",
        email: "arhalentejo@apambiente.pt",
        department: "Poços e Furos",
      },
      {
        name: "ARH Norte",
        phone: "223 400 000",
        email: "arhnorte@apambiente.pt",
        department: "Poços e Furos",
      },

      // Alterações Climáticas e Jovens Agricultores
      {
        name: "GPP - Gabinete de Planeamento, Políticas e Administração Geral",
        phone: "213 234 600",
        email: "geral@gpp.pt",
        department: "Alterações Climáticas / CAJA",
      },

      // Parcelário e Pagamentos
      {
        name: "IFAP - Instituto de Financiamento da Agricultura e Pescas",
        phone: "212 427 708",
        email: "ifap@ifap.pt",
        department: "Parcelário e Pagamentos",
      },
      {
        name: "IFAP Helpdesk",
        phone: "212 427 652",
        email: "helpdesk@ifap.pt",
        department: "Apoio Técnico IFAP",
      },

      // Conservação da Natureza e Florestas
      {
        name: "ICNF - Instituto da Conservação da Natureza e das Florestas",
        phone: "213 507 900",
        email: "icnf@icnf.pt",
        department: "Conservação Natureza e Florestas",
      },

      // Veterinária
      {
        name: "DGAV - Direção-Geral de Alimentação e Veterinária",
        phone: "213 239 500",
        email: "geral@dgav.pt",
        department: "Quintas Pedagógicas / Veterinária",
      },

      // Desenvolvimento Regional
      {
        name: "CCDR Norte",
        phone: "226 086 300",
        email: "geral@ccdr-n.pt",
        department: "Desenvolvimento Regional Norte",
      },
      {
        name: "CCDR Centro",
        phone: "239 400 100",
        email: "geral@ccdrc.pt",
        department: "Desenvolvimento Regional Centro",
      },
      {
        name: "CCDR Lisboa e Vale do Tejo",
        phone: "213 837 100",
        email: "geral@ccdr-lvt.pt",
        department: "Desenvolvimento Regional LVT",
      },
      {
        name: "CCDR Alentejo",
        phone: "266 740 300",
        email: "geral@ccdr-a.gov.pt",
        department: "Desenvolvimento Regional Alentejo",
      },
      {
        name: "CCDR Algarve",
        phone: "289 895 200",
        email: "geral@ccdr-alg.pt",
        department: "Desenvolvimento Regional Algarve",
      },

      // Investigação Agrária
      {
        name: "INIAV - Instituto Nacional de Investigação Agrária e Veterinária",
        phone: "214 403 500",
        email: "geral@iniav.pt",
        department: "Investigação Agrária",
      },

      // Meteorologia
      {
        name: "IPMA - Instituto Português do Mar e da Atmosfera",
        phone: "218 447 000",
        email: "info@ipma.pt",
        department: "Meteorologia",
      },

      // Vitivinicultura
      {
        name: "IVV - Instituto da Vinha e do Vinho",
        phone: "213 506 700",
        email: "ivv@ivv.gov.pt",
        department: "Vitivinicultura",
      },

      // Fundos Europeus
      {
        name: "Portugal 2030",
        phone: "800 103 510",
        email: "linhadosfundos@linhadosfundos.pt",
        department: "Fundos Europeus",
      },
    ];
  }

  /** =========================
   *  PROCEDURES (DGADR-ALIGNED)
   *  ========================= */
  private async loadProcedures(): Promise<void> {
    // Procedimentos específicos, alinhados com as competências DGADR
    // (texto neutro, sem valores que “expiram”, e com encaminhamentos oficiais)

    this.procedures.set(
      "estatuto_agricultura_familiar",
      `
ESTATUTO DA AGRICULTURA FAMILIAR (EAF)
Enquadramento: a DGADR coordena a operacionalização do EAF e as plataformas AgriFam/SAAF.

Requisitos (síntese):
- Maioridade do titular da exploração;
- Exploração agrícola familiar (caráter familiar do trabalho e do rendimento agrícola);
- Situação fiscal e contributiva regularizada;
- Registo/identificação da exploração e das parcelas nos sistemas oficiais aplicáveis.

Como pedir:
1) Registe/atualize os seus dados nas plataformas AgriFam/SAAF;
2) Submeta o pedido de reconhecimento do EAF na plataforma indicada;
3) Acompanhe o estado do pedido e eventual pedido de elementos adicionais.

Encaminhamentos úteis:
- DGADR (informação técnica e operacional)
- IFAP (articulação com apoios/PEPAC quando aplicável)

Contactos: Atendimento Geral DGADR — 21 844 22 00 | geral@dgadr.pt
`
    );

    this.procedures.set(
      "jovem_empresario_rural",
      `
JOVEM AGRICULTOR (PEPAC) ou JOVEM EMPRESÁRIO RURAL
Nota: o regime de instalação de jovens agricultores integra o PEPAC e a gestão de candidaturas/pagamentos é efetuada pelo IFAP.

Requisitos (síntese):
- Idade típica até 40 anos (ver aviso/medida aplicável);
- Primeira instalação como responsável pela exploração;
- Plano empresarial e compromissos mínimos (conforme aviso).

Como proceder:
1) Consulte os avisos/condições no IFAP;
2) Elabore o plano empresarial com apoio técnico;
3) Submeta candidatura no IFAP dentro do prazo do aviso.

Competências:
- DGADR: enquadramento técnico/orientações setoriais;
- IFAP: candidaturas, elegibilidade administrativa e pagamentos.

Contactos: IFAP (candidaturas) | DGADR (enquadramento técnico)
`
    );

    this.procedures.set(
      "producao_biologica",
      `
MODO DE PRODUÇÃO BIOLÓGICA (MPB)
Nota: o controlo e certificação do MPB é da competência da DGAV e dos Organismos de Controlo (OC) reconhecidos.

Passos essenciais:
1) Notificar a atividade e escolher um OC reconhecido;
2) Celebrar contrato com o OC e cumprir o caderno de especificações;
3) Cumprir período de conversão (variável por cultura/uso do solo);
4) Manter registos e sujeitar-se a auditorias.

Encaminhamentos:
- DGAV: enquadramento, reconhecimento de OC, normas;
- DGADR: informação setorial, recursos técnicos (ex.: Rede Rural, Biblioteca DGADR).

Contactos: DGAV (normas/OC) | Biblioteca DGADR (recursos técnicos)
`
    );

    this.procedures.set(
      "gasóleo_agricola",
      `
BENEFÍCIO FISCAL — GASÓLEO AGRÍCOLA (GCM)
Nota: o benefício fiscal do gasóleo colorido e marcado é da **Autoridade Tributária (AT)**. A articulação de elegibilidade setorial pode envolver o **IFAP** (quando aplicável).

Como proceder:
1) Verifique critérios e documentação no portal da AT;
2) Garanta o registo setorial/elegibilidade quando aplicável (IFAP);
3) Submeta o pedido/declaração anual na AT e mantenha registos de consumo.

Encaminhamentos:
- AT (processo e reembolsos/isenções);
- IFAP (elegibilidade setorial ligada à atividade agrícola, quando aplicável).
`
    );

    this.procedures.set(
      "mecanizacao_agraria",
      `
MECANIZAÇÃO AGRÍCOLA / TRATORES
Nota: homologação, matrícula e inspeções de tratores são competência do **IMT, I.P.** (e entidades por este reconhecidas). A DGADR intervém em matérias de **engenharia rural** (vias rurais, drenagem, segurança de operações em contexto agrícola), não na homologação de veículos.

Como proceder:
- Homologação/Matrícula/Inspeções: IMT, I.P.;
- Requisitos de segurança e operação: consulte normas técnicas e formação aplicável.

Encaminhamentos:
- IMT, I.P. (veículos);
- DGADR/DER (engenharia rural — segurança em operações e vias rurais).
`
    );
  }

  /** =========================
   *  LEGISLATION (CURATED)
   *  ========================= */
  private async loadLegislation(): Promise<void> {
    // Legislação com referências estáveis (evita números nacionais incertos/obsoletos)
    this.legislation.set(
      "agricultura_familiar",
      `
LEGISLAÇÃO — AGRICULTURA FAMILIAR
- Decreto-Lei n.º 64/2018 — Estatuto da Agricultura Familiar (EAF)
- Regulamentação complementar aplicável e orientações DGADR
- PEPAC/Portugal — enquadramento de medidas relacionadas (IFAP)
`
    );

    this.legislation.set(
      "producao_biologica",
      `
LEGISLAÇÃO — PRODUÇÃO BIOLÓGICA
- Regulamento (UE) 2018/848 — Produção biológica e rotulagem
- Atos de execução/delegados da UE aplicáveis
- Normas nacionais e orientações DGAV (organismos de controlo)
`
    );
  }

  /** ==========================================================
   *  SEARCH (scope + keywords + routing aligned with competencies)
   *  ========================================================== */
  public async searchRealData(query: string): Promise<RealDataResult> {
    await this.loadRealData();

    const isOutOfScope = this.isQueryOutOfScope(query);

    if (isOutOfScope) {
      const externalContacts = this.findExternalContacts(query);
      return {
        contacts: [],
        procedures: [],
        legislation: [],
        isOutOfScope: true,
        externalContacts,
      };
    }

    const keywords = this.extractKeywords(query);
    const relevantContacts = this.findRelevantContacts(keywords);
    const relevantProcedures = this.findRelevantProcedures(keywords);
    const relevantLegislation = this.findRelevantLegislation(keywords);

    return {
      contacts: relevantContacts,
      procedures: relevantProcedures,
      legislation: relevantLegislation,
      isOutOfScope: false,
    };
  }

  /** =========================
   *  KEYWORDS (DGADR-ALIGNED)
   *  ========================= */
  private extractKeywords(query: string): string[] {
    const normalized = query.toLowerCase();
    const picked: string[] = [];

    const map = {
      // DGADR core
      familiar: [
        "familiar",
        "agricultura familiar",
        "estatuto",
        "agri fam",
        "saaf",
        "agrifam",
      ],
      jovem: [
        "jovem",
        "primeira instalação",
        "instalação",
        "plano empresarial",
        "jovem empresário rural",
      ],
      biologica: ["biológica", "bio", "orgânica", "certificação", "conversão"],
      integrada: ["integrada", "produção integrada", "prodi", "sustentável"],
      dop: [
        "dop",
        "igp",
        "etg",
        "indicação geográfica",
        "denominação de origem",
        "tradicional",
      ],
      emparcelamento: [
        "emparcelamento",
        "estruturação",
        "fundiária",
        "parcelas",
        "concentração",
      ],
      hidroagricola: [
        "hidroagrícola",
        "regadio",
        "rega",
        "água",
        "irrigação",
        "eficiência hídrica",
        "sir",
      ],
      gasoleo: [
        "gasóleo",
        "gasoil",
        "combustível",
        "benefício fiscal",
        "reembolso",
        "agrícola",
      ],
      trator: ["trator", "mecanização", "máquina", "homologação", "matrícula"],
      agrupamento: [
        "agrupamento",
        "organização de produtores",
        "op",
        "cooperativa",
        "reconhecimento",
      ],
      formacao: ["formação", "curso", "capacitação", "qualificação"],
      associativismo: ["associação", "cooperativa", "associativismo"],
      leader: ["leader", "desenvolvimento local", "gal", "estratégia"],
      apicultura: ["apicultura", "mel", "abelha", "colmeia", "apiário"],
      frutas: ["frutas", "hortícolas", "programa operacional", "op"],
      aguas: ["águas residuais", "efluentes", "ambiente", "depuração"],
      fertilizante: [
        "fertilizante",
        "adubo",
        "nutrição",
        "solo",
        "matéria orgânica",
      ],
      biblioteca: [
        "biblioteca",
        "arquivo",
        "documentação",
        "publicação",
        "informação",
      ],
      agricultura: [
        "agricultura",
        "agrícola",
        "exploração",
        "produtor",
        "rural",
      ],
      apoios: [
        "apoio",
        "subsídio",
        "financiamento",
        "candidatura",
        "pepac",
        "ifap",
      ],
      dgadr: ["dgadr", "direção-geral", "agricultura desenvolvimento rural"],

      // Fora de âmbito (para roteamento) — identificados aqui para contactos externos
      animal: [
        "animal",
        "bem-estar",
        "veterinário",
        "sanidade",
        "matadouro",
        "estabelecimento aprovado",
      ],
      florestal: [
        "floresta",
        "corte de árvores",
        "licenciamento florestal",
        "caça",
        "natura 2000",
      ],
      agua_publica: [
        "licença captação",
        "domínio público hídrico",
        "título utilização recursos hídricos",
      ],
      vitivinicultura: ["vinho", "vinha", "plantação de vinha", "doc", "ivv"],
      cartao_aplicador: [
        "cartão aplicador",
        "produtos fitofarmacêuticos",
        "apf",
        "renovação cartão",
        "cartão fitossanitário",
        "aplicador fitofarmacêuticos",
      ],
    } as Record<string, string[]>;

    for (const [key, list] of Object.entries(map)) {
      if (list.some((k) => normalized.includes(k))) picked.push(key);
    }

    return picked.length > 0 ? picked : ["agricultura"];
  }

  /** ======================================
   *  CONTACTS (internal matching kept same)
   *  ====================================== */
  private findRelevantContacts(keywords: string[]): Contact[] {
    const results: Contact[] = [];

    keywords.forEach((kw) => {
      const contacts = this.realContacts.filter((contact) => {
        const s = `${contact.name} ${contact.department}`.toLowerCase();

        switch (kw) {
          case "familiar":
            return /agricultura familiar|estatuto|saaf|agrifam/.test(s);
          case "jovem":
            return /jovem|instala[cç][aã]o|pepac|ifap/.test(s);
          case "biologica":
            return /biol[oó]gica|mpb|org[aâ]nica/.test(s);
          case "integrada":
            return /integrada|prodi/.test(s);
          case "dop":
            return /indica[cç][oõ]es|geogr[aá]ficas|tradicional/.test(s);
          case "emparcelamento":
            return /estrutura[cç][aã]o|fundi[aá]ria|emparcelamento/.test(s);
          case "hidroagricola":
            return /hidroagr[ií]colas?|regadio|sir|[aá]gua/.test(s);
          case "gasoleo":
            return /gas[oó]leo|benef[ií]cio|fiscal/.test(s);
          case "trator":
            return /mecaniza[cç][aã]o|tratores?/.test(s);
          case "agrupamento":
            return /agrupamentos?|organiza[cç][oõ]es de produtores|cooperativas?/.test(
              s
            );
          case "formacao":
            return /forma[cç][aã]o|capacita[cç][aã]o/.test(s);
          case "associativismo":
            return /associativismo|cooperativas?/.test(s);
          case "leader":
            return /leader|gal/.test(s);
          case "apicultura":
            return /apicultura|abelhas?/.test(s);
          case "frutas":
            return /frutas?|hort[ií]colas?/.test(s);
          case "aguas":
            return /[aá]guas|efluentes|depura[cç][aã]o/.test(s);
          case "fertilizante":
            return /fertilizantes?|nutri[cç][aã]o|solos?/.test(s);
          case "biblioteca":
            return /biblioteca|arquivo|documenta[cç][aã]o/.test(s);
          case "agricultura":
            return /agricultura|agr[ií]cola|rural|dgadr/.test(s);
          case "apoios":
            return /apoios?|subs[ií]dios?|financiamento|ifap/.test(s);
          case "dgadr":
            return /geral|atendimento|rece[cç][aã]o/.test(s);
          default:
            return /geral|atendimento|rece[cç][aã]o/.test(s);
        }
      });

      results.push(...contacts);
    });

    // Dedup por email e limita a 3
    const unique = results.filter(
      (c, i, arr) => i === arr.findIndex((x) => x.email === c.email)
    );

    return unique.slice(0, 3);
  }

  /** ==========================================
   *  PROCEDURE PICKER (keys kept; fixed routing)
   *  ========================================== */
  private findRelevantProcedures(keywords: string[]): string[] {
    const out: string[] = [];

    for (const kw of keywords) {
      if (
        kw === "familiar" &&
        this.procedures.has("estatuto_agricultura_familiar")
      ) {
        out.push(this.procedures.get("estatuto_agricultura_familiar")!);
      }
      if (kw === "jovem" && this.procedures.has("jovem_empresario_rural")) {
        out.push(this.procedures.get("jovem_empresario_rural")!);
      }
      if (kw === "biologica" && this.procedures.has("producao_biologica")) {
        out.push(this.procedures.get("producao_biologica")!);
      }
      if (kw === "gasoleo" && this.procedures.has("gasóleo_agricola")) {
        out.push(this.procedures.get("gasóleo_agricola")!);
      }
      if (kw === "trator" && this.procedures.has("mecanizacao_agraria")) {
        out.push(this.procedures.get("mecanizacao_agraria")!);
      }
      if (out.length >= 2) break; // mantém saída concisa
    }

    return out;
  }

  /** ==================================
   *  LEGISLATION PICKER (stable items)
   *  ================================== */
  private findRelevantLegislation(keywords: string[]): string[] {
    const out: string[] = [];

    if (
      keywords.includes("familiar") &&
      this.legislation.has("agricultura_familiar")
    ) {
      out.push(this.legislation.get("agricultura_familiar")!);
    }
    if (
      keywords.includes("biologica") &&
      this.legislation.has("producao_biologica")
    ) {
      out.push(this.legislation.get("producao_biologica")!);
    }

    return out.slice(0, 2);
  }

  /** =========================
   *  SCOPE CHECK (refinado)
   *  ========================= */
  private isQueryOutOfScope(query: string): boolean {
    const q = query.toLowerCase();

    // Competências DGADR (indicativas)
    const inScope = [
      "estatuto agricultura familiar",
      "agricultura familiar",
      "saaf",
      "agrifam",
      "jovem agricultor",
      "primeira instalação",
      "pepac",
      "produção integrada",
      "prodi",
      "indicações geográficas",
      "dop",
      "igp",
      "etg",
      "produtos tradicionais",
      "estruturação fundiária",
      "emparcelamento",
      "aproveitamentos hidroagrícolas",
      "regadio",
      "sir",
      "eficiência hídrica",
      "mecanização agrária",
      "engenharia rural",
      "caminhos rurais",
      "drenagem",
      "organizações de produtores",
      "associativismo",
      "formação",
      "água em contexto agrícola",
      "solo",
      "conservação do solo",
      "biblioteca dgadr",
      "rede rural",
    ];

    // Fora de âmbito (roteamento) - verifica primeiro para ter prioridade
    const out = [
      // DGAV
      "sanidade animal",
      "certificação veterinária",
      "segurança alimentar",
      "matadouro",
      "capar",
      "castrar",
      "vacinar",
      "bem-estar animal",
      "cativeiro",
      "porcos",
      "aves",
      "veterinário",
      "doença animal",
      "tratamento veterinário",
      // ICNF
      "licenciamento florestal",
      "corte de árvores",
      "caça",
      "rede natura",
      // AT/IFAP (específico fiscal/parcelário)
      "benefício fiscal",
      "reembolso at",
      "parcelário ifap",
      "pagamento único",
      "rpup",
      // APA/ARH
      "licença captação água",
      "domínio público hídrico",
      "título utilização recursos hídricos",
      // IMT/veículos
      "homologação trator",
      "matrícula trator",
      "inspeção trator",
      // IVV/vinho
      "plantação de vinha",
      "autorização de plantação",
      "ivv",
      // CCDR
      "cartão aplicador",
      "produtos fitofarmacêuticos",
      "apf",
      "renovação cartão",
      "cartão fitossanitário",
      // outros não relacionados com agricultura/desenvolvimento rural
      "segurança social",
      "irs",
      "transportes públicos",
      "serviços hospitalares",
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
      "turismo urbano",
      "hotéis",
      "restaurantes",
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
      "meteorologia geral",
      "previsão do tempo",
      "animais",
    ];

    // Se encontrou termos fora de âmbito, retorna true
    if (out.some((t) => q.includes(t))) return true;

    // Se não encontrou termos fora de âmbito, verifica se está dentro do âmbito
    if (inScope.some((t) => q.includes(t))) return false;

    // Se não encontrou nem dentro nem fora, assume que está fora de âmbito
    return true;
  }

  /** =====================================
   *  EXTERNAL CONTACTS (refined routing)
   *  ===================================== */
  private findExternalContacts(query: string): Contact[] {
    const q = query.toLowerCase();
    const out: Contact[] = [];

    // Cartão de aplicador de produtos fitofarmacêuticos (CCDR)
    if (
      /(cart[aã]o.*aplicador|produtos fitofarmac[eê]uticos|apf|renova[cç][aã]o.*cart[aã]o|fitossanit[aá]rio)/.test(
        q
      )
    ) {
      out.push(...this.externalContacts.filter((c) => /CCDR/i.test(c.name)));
    }

    // Recursos hídricos (APA/ARH)
    if (
      /(po[cç]o|furo|capta[cç][aã]o|dom[ií]nio p[úu]blico h[ií]drico|t[ií]tulo utiliza[cç][aã]o)/.test(
        q
      )
    ) {
      out.push(
        ...this.externalContacts.filter((c) =>
          /APA|Administra[cç][aã]o da Regi[aã]o Hidrogr[aá]fica/i.test(c.name)
        )
      );
    }

    // Parcelário/PEPAC/IFAP
    if (/(parcel[aá]rio|ifap|pepac|pagamento|candidatura)/.test(q)) {
      out.push(
        ...this.externalContacts.filter(
          (c) => /IFAP/i.test(c.name) || /Parcel[aá]rio/.test(c.department)
        )
      );
    }

    // DGAV — sanidade/segurança alimentar/MPB (certificação/OC)
    if (
      /(sanidade|veterin[aá]ria|seguran[çc]a alimentar|matadouro|oc biol[oó]gico)/.test(
        q
      )
    ) {
      out.push(...this.externalContacts.filter((c) => /DGAV/i.test(c.name)));
    }

    // ICNF — florestas/caça/natura
    if (/(floresta|corte|licenciamento florestal|ca[cç]a|natura)/.test(q)) {
      out.push(...this.externalContacts.filter((c) => /ICNF/i.test(c.name)));
    }

    // IMT — tratores/veículos
    if (/(trator|homologa[cç][aã]o|matr[ií]cula|inspe[cç][aã]o)/.test(q)) {
      out.push(...this.externalContacts.filter((c) => /IMT/i.test(c.name)));
    }

    // IVV — vinha/vinho
    if (/(vinho|vinha|plant[aã]o|doc|ivv)/.test(q)) {
      out.push(...this.externalContacts.filter((c) => /IVV/i.test(c.name)));
    }

    // IPMA — meteorologia (agrometeorologia)
    if (/(tempo|clima|meteorologia)/.test(q)) {
      out.push(...this.externalContacts.filter((c) => /IPMA/i.test(c.name)));
    }

    // INIAV — investigação
    if (/(investiga[cç][aã]o|ensaio|estudo)/.test(q)) {
      out.push(...this.externalContacts.filter((c) => /INIAV/i.test(c.name)));
    }

    // AT — benefício fiscal gasóleo
    if (/(gas[oó]leo|benef[ií]cio fiscal|reembolso)/.test(q)) {
      out.push(
        ...this.externalContacts.filter((c) =>
          /Autoridade Tribut[aá]ria|AT/i.test(c.name)
        )
      );
    }

    // Se não encontrou contactos específicos, retorna lista vazia
    // O AIService vai tratar do fallback apropriado

    // Para CCDR (cartão aplicador), mostra todas as regiões
    const hasCCDR = out.some((c) => /CCDR/i.test(c.name));
    if (hasCCDR) {
      return out.filter((c) => /CCDR/i.test(c.name)); // Todas as CCDR
    }

    // Para outras entidades, máximo 2 contactos
    return out.slice(0, 2);
  }
}
