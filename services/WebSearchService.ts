interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export class WebSearchService {
  private static instance: WebSearchService;

  public static getInstance(): WebSearchService {
    if (!WebSearchService.instance) {
      WebSearchService.instance = new WebSearchService();
    }
    return WebSearchService.instance;
  }

  public async searchDGADRSites(query: string): Promise<SearchResult[]> {
    const dgadrSites = [
      "site:dgadr.gov.pt",
      "site:tradicional.dgadr.gov.pt",
      "site:sir.dgadr.gov.pt",
      "site:saaf.dgadr.gov.pt",
      "site:biblioteca.dgadr.pt",
      "site:snisolos.dgadr.gov.pt",
      "site:animalbio.dgadr.gov.pt",
      "site:producaobiologica.pt",
    ];

    const results: SearchResult[] = [];

    try {
      // Pesquisa nos sites da DGADR usando Google Custom Search ou similar
      for (const site of dgadrSites.slice(0, 3)) {
        // Limita a 3 sites para não sobrecarregar
        const searchQuery = `${query} ${site}`;
        const siteResults = await this.performWebSearch(searchQuery);
        results.push(...siteResults);
      }

      return results.slice(0, 5); // Máximo 5 resultados
    } catch (error) {
      console.error("Erro na pesquisa web:", error);
      return [];
    }
  }

  private async performWebSearch(query: string): Promise<SearchResult[]> {
    try {
      // Implementação usando DuckDuckGo Instant Answer API (gratuita)
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      const results: SearchResult[] = [];

      // Processa resultados do DuckDuckGo
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 3)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.substring(0, 100) + "...",
              url: topic.FirstURL,
              snippet: topic.Text,
            });
          }
        }
      }

      // Se não encontrou resultados, tenta com Abstract
      if (results.length === 0 && data.Abstract) {
        results.push({
          title: data.Heading || "Informação encontrada",
          url: data.AbstractURL || "https://www.dgadr.gov.pt",
          snippet: data.Abstract,
        });
      }

      return results;
    } catch (error) {
      console.error("Erro na pesquisa DuckDuckGo:", error);
      return [];
    }
  }

  public async searchLegislation(topic: string): Promise<SearchResult[]> {
    const legislationSites = [
      "site:dre.pt",
      "site:pgdlisboa.pt",
      "site:parlamento.pt",
    ];

    const results: SearchResult[] = [];

    try {
      for (const site of legislationSites.slice(0, 2)) {
        const searchQuery = `${topic} agricultura portugal ${site}`;
        const siteResults = await this.performWebSearch(searchQuery);
        results.push(...siteResults);
      }

      return results.slice(0, 3); // Máximo 3 resultados de legislação
    } catch (error) {
      console.error("Erro na pesquisa de legislação:", error);
      return [];
    }
  }

  public getRelevantDGADRLinks(keywords: string[]): string[] {
    const linkMap: { [key: string]: string[] } = {
      apoios: [
        "https://saaf.dgadr.gov.pt",
        "https://www.rederural.gov.pt/pt",
        "https://sir.dgadr.gov.pt/pt",
      ],
      jovens: ["https://saaf.dgadr.gov.pt", "https://sir.dgadr.gov.pt/pt"],
      florestal: [
        "https://www.dgadr.gov.pt/pt/estruturacao-fundiaria/emparcelar-para-ordenar",
        "https://parceriaptsolo.dgadr.gov.pt",
      ],
      animal: [
        "https://animalbio.dgadr.gov.pt/menu_publico",
        "https://app.dgadr.gov.pt/apoiotecnico/entrada",
      ],
      vegetal: [
        "https://snisolos.dgadr.gov.pt",
        "https://app.dgadr.gov.pt/rectec/menu_publico",
      ],
      biblioteca: ["https://biblioteca.dgadr.pt"],
      tradicional: ["https://tradicional.dgadr.gov.pt/"],
    };

    const relevantLinks: string[] = [];

    keywords.forEach((keyword) => {
      if (linkMap[keyword]) {
        relevantLinks.push(...linkMap[keyword]);
      }
    });

    // Sempre inclui o portal principal
    relevantLinks.push("https://www.dgadr.gov.pt");

    // Remove duplicados e limita a 3
    return [...new Set(relevantLinks)].slice(0, 3);
  }
}
