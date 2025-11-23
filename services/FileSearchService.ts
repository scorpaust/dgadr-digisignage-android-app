interface FileSearchResult {
  filename: string;
  content: string;
  relevance: number;
}

export class FileSearchService {
  private static instance: FileSearchService;
  private knowledgeFiles: Map<string, string> = new Map();
  private isLoaded = false;

  public static getInstance(): FileSearchService {
    if (!FileSearchService.instance) {
      FileSearchService.instance = new FileSearchService();
    }
    return FileSearchService.instance;
  }

  public async loadKnowledgeFiles(): Promise<void> {
    if (this.isLoaded) return;

    try {
      await this.loadStaticKnowledge();
      this.isLoaded = true;
    } catch (error) {
      // Erro silencioso para produção
    }
  }

  private async loadStaticKnowledge(): Promise<void> {
    // --- Tópicos alinhados com a DGADR ---

    this.knowledgeFiles.set(
      "apoios_pepac.txt",
      `
APOIOS À AGRICULTURA — PEPAC/PORTUGAL
Enquadramento:
- A DGADR presta enquadramento técnico e orientações setoriais.
- As candidaturas e pagamentos são geridos pelo IFAP.

Principais linhas (exemplos):
- Instalação de Jovens Agricultores (condições definidas em aviso).
- Investimento nas explorações e modernização (condições de elegibilidade em aviso).
- Medidas ambientais/climáticas e eficiência de recursos (solo/água).

Como proceder:
1) Consultar avisos e regras no IFAP.
2) Preparar plano/propósito do investimento com apoio técnico.
3) Submeter candidatura no portal IFAP, dentro do prazo.

Referências úteis:
- IFAP (candidaturas/pagamentos)
- DGADR (orientações técnicas; Rede Rural Nacional)
`
    );

    this.knowledgeFiles.set(
      "agricultura_familiar.txt",
      `
ESTATUTO DA AGRICULTURA FAMILIAR (EAF)
Âmbito:
- Reconhecimento do caráter familiar da exploração agrícola.
- DGADR coordena a operacionalização (AgriFam/SAAF).

Síntese de requisitos (indicativos):
- Maioridade do titular e exploração com predominância de trabalho/rendimento familiar.
- Situação fiscal e contributiva regularizada.
- Registo da exploração e identificação parcelar nos sistemas aplicáveis.

Procedimento:
1) Registo/atualização nas plataformas AgriFam/SAAF.
2) Submissão do pedido de reconhecimento.
3) Acompanhamento do processo na plataforma.

Suporte:
- DGADR (informação técnica/operacional)
- IFAP (eventual articulação com medidas PEPAC)
`
    );

    this.knowledgeFiles.set(
      "ordenamento_engenharia.txt",
      `
ORDENAMENTO DO ESPAÇO RURAL E ENGENHARIA RURAL (DOER/DER)
Temáticas:
- Estruturação fundiária e emparcelamento.
- Caminhos rurais, drenagem e pequenas obras de engenharia rural.
- Planeamento e ordenamento do espaço rural em articulação com entidades competentes.

Boas práticas:
- Diagnóstico técnico, compatibilização com instrumentos de gestão territorial.
- Segurança nas operações agrícolas e acessibilidades.

Recursos:
- Orientações e normas técnicas DGADR.
- Biblioteca DGADR (documentação técnica).
`
    );

    this.knowledgeFiles.set(
      "regadio_infraestruturas.txt",
      `
REGADIO E INFRAESTRUTURAS HIDRÁULICAS (DIR/DIH)
Âmbito:
- Aproveitamentos hidroagrícolas de fins agrícolas (regadio público).
- Operação, manutenção e reabilitação de infraestruturas de rega.

Instrumentos:
- SIR — Sistema de Informação do Regadio.

Focos técnicos:
- Eficiência hídrica e gestão de água de rega.
- Planeamento, segurança e conservação de obras hidráulicas agrícolas.

Referências:
- DGADR (DIR/DIH) — enquadramento e informação técnica.
`
    );

    this.knowledgeFiles.set(
      "recursos_naturais_solos_agua.txt",
      `
GESTÃO DE RECURSOS NATURAIS: SOLO E ÁGUA (DGRN)
Âmbito:
- Conservação do solo e combate à erosão.
- Eficiência hídrica e boa gestão da água na exploração agrícola.

Ferramentas:
- SNISolos — Sistema Nacional de Informação de Solos.
- Parceria Portuguesa para o Solo (recursos e rede).

Práticas recomendadas:
- Plano de conservação do solo, rotação cultural, cobertura do solo.
- Monitorização e técnicas de rega eficiente.
`
    );

    this.knowledgeFiles.set(
      "qualidade_recursos_geneticos.txt",
      `
QUALIDADE E RECURSOS GENÉTICOS (DQRG)
Temas:
- Conservação e valorização de recursos genéticos de interesse agrícola.
- Material de reprodução vegetal e variedades tradicionais.

Recursos:
- Portal “Tradicional” — Produtos Tradicionais Portugueses.

Notas:
- Articulação com normativos europeus e nacionais aplicáveis.
`
    );

    this.knowledgeFiles.set(
      "diversificacao_formacao_associativismo.txt",
      `
DIVERSIFICAÇÃO, FORMAÇÃO E ASSOCIATIVISMO (DDAAFA)
Âmbitos:
- Diversificação da atividade agrícola e cadeias curtas.
- Organizações/agrupamentos de produtores e cooperativismo.
- Formação e capacitação do setor.

Plataformas/Redes:
- Rede Rural Nacional (informação, projetos, eventos, boas práticas).
`
    );

    this.knowledgeFiles.set(
      "biblioteca_recursos.txt",
      `
BIBLIOTECA DGADR
Serviços:
- Consulta presencial e digital de publicações técnicas.
- Apoio à pesquisa bibliográfica e a projetos.
- Acesso ao catálogo online.

Catálogo:
- https://biblioteca.dgadr.pt

Horário:
- Dias úteis: 09:00–17:00 (marcação recomendada).
Contacto geral:
- 21 844 22 00 | geral@dgadr.pt
`
    );

    // --- Fora de âmbito DGADR: ficheiro de encaminhamento institucional ---
    this.knowledgeFiles.set(
      "fora_ambito.txt",
      `
ASSUNTOS FORA DO ÂMBITO DGADR — ENCAMINHAMENTO
- DGAV: sanidade animal, certificação veterinária, segurança alimentar, MPB (certificação e OC).
- ICNF: matérias florestais, caça, Rede Natura 2000.
- IFAP: parcelário, candidaturas e pagamentos PEPAC.
- APA/ARH: títulos de utilização do domínio público hídrico (captações, etc.).
- IMT: homologação, matrícula e inspeções de tratores/veículos.
- IVV: vinha e vinho (autorização de plantação, DO/IG).

Para apoio técnico setorial (DGADR), indique o tema para encaminhamento à divisão competente.
Contacto geral DGADR: 21 844 22 00 | geral@dgadr.pt
`
    );
  }

  public async searchFiles(query: string): Promise<FileSearchResult[]> {
    await this.loadKnowledgeFiles();

    const results: FileSearchResult[] = [];
    const queryWords = query
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2);

    for (const [filename, content] of this.knowledgeFiles.entries()) {
      const relevance = this.calculateRelevance(
        content.toLowerCase(),
        queryWords
      );

      if (relevance > 0) {
        const excerpt = this.extractRelevantExcerpt(content, queryWords);
        results.push({ filename, content: excerpt, relevance });
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  }

  private calculateRelevance(content: string, queryWords: string[]): number {
    let score = 0;
    queryWords.forEach((word) => {
      const matches = (content.match(new RegExp(word, "g")) || []).length;
      score += matches;
      const titleMatches = (
        content.match(new RegExp(word.toUpperCase(), "g")) || []
      ).length;
      score += titleMatches * 2;
    });
    return score;
  }

  private extractRelevantExcerpt(
    content: string,
    queryWords: string[]
  ): string {
    const lines = content.split("\n").filter((line) => line.trim());
    const relevantLines: string[] = [];

    for (const line of lines) {
      const lineWords = line.toLowerCase();
      const hasMatch = queryWords.some((word) => lineWords.includes(word));
      if (hasMatch) {
        relevantLines.push(line.trim());
        if (relevantLines.length >= 5) break;
      }
    }

    return relevantLines.length > 0
      ? relevantLines.join("\n")
      : content.substring(0, 300) + "...";
  }

  public getFileByTopic(topic: string): string | null {
    // Mapeamento atualizado para a realidade DGADR; temas fora de âmbito -> "fora_ambito.txt"
    const topicMap: { [key: string]: string } = {
      apoios: "apoios_pepac.txt",
      pepac: "apoios_pepac.txt",
      ifap: "apoios_pepac.txt",
      jovens: "apoios_pepac.txt",

      eaf: "agricultura_familiar.txt",
      "agricultura familiar": "agricultura_familiar.txt",
      saaf: "agricultura_familiar.txt",
      agrifam: "agricultura_familiar.txt",

      ordenamento: "ordenamento_engenharia.txt",
      emparcelamento: "ordenamento_engenharia.txt",
      engenharia: "ordenamento_engenharia.txt",

      regadio: "regadio_infraestruturas.txt",
      hidroagrícola: "regadio_infraestruturas.txt",
      sir: "regadio_infraestruturas.txt",

      solos: "recursos_naturais_solos_agua.txt",
      água: "recursos_naturais_solos_agua.txt",
      recursos: "recursos_naturais_solos_agua.txt",

      qualidade: "qualidade_recursos_geneticos.txt",
      "recursos genéticos": "qualidade_recursos_geneticos.txt",
      tradicional: "qualidade_recursos_geneticos.txt",

      diversificação: "diversificacao_formacao_associativismo.txt",
      associativismo: "diversificacao_formacao_associativismo.txt",
      formação: "diversificacao_formacao_associativismo.txt",
      leader: "diversificacao_formacao_associativismo.txt",
      rrn: "diversificacao_formacao_associativismo.txt",

      biblioteca: "biblioteca_recursos.txt",

      // Fora de âmbito DGADR:
      florestal: "fora_ambito.txt",
      floresta: "fora_ambito.txt",
      animal: "fora_ambito.txt",
      veterinario: "fora_ambito.txt",
      vegetal: "fora_ambito.txt",
      fitossanitario: "fora_ambito.txt",
      alimentar: "fora_ambito.txt",
      imt: "fora_ambito.txt",
      parcelario: "fora_ambito.txt",
      ivv: "fora_ambito.txt",
      apa: "fora_ambito.txt",
    };

    const filename = topicMap[topic.toLowerCase()];
    return filename ? this.knowledgeFiles.get(filename) || null : null;
  }
}
