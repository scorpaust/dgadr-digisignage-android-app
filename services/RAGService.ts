import Constants from "expo-constants";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

interface KnowledgeBaseEntry {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    page: number;
    chunkIndex: number;
  };
  createdAt: string;
}

interface RAGContact {
  name: string;
  phone: string;
  department: string;
}

interface RAGResponse {
  answer: string;
  sources: Array<{
    source: string;
    page: number;
  }>;
  confidence: number;
  contacts?: RAGContact[];
}

const knowledgeBaseAsset = Asset.fromModule(
  require("../data/knowledge_base.kb"),
);

export class RAGService {
  private static instance: RAGService;
  private knowledgeBase: KnowledgeBaseEntry[] = [];
  private isLoaded = false;
  private isLoading = false;
  private googleApiKey: string;

  private constructor() {
    // Obter API key do .env via expo-constants
    this.googleApiKey =
      Constants.expoConfig?.extra?.GOOGLE_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      "";
  }

  public static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  public async loadKnowledgeBase(): Promise<void> {
    // Prevenir loop infinito e carregamento múltiplo
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;

    try {
      const knowledgeBaseData = await this.readKnowledgeBaseFromAsset();

      // Verificar se o arquivo existe e é um array
      if (!knowledgeBaseData || !Array.isArray(knowledgeBaseData)) {
        console.warn("⚠️ RAG: Knowledge base file is empty or invalid format");
        this.isLoaded = true; // Marca como carregado para não tentar novamente
        this.isLoading = false;
        this.knowledgeBase = [];
        return;
      }

      // Validar se os embeddings existem e não são null
      const validEntries = knowledgeBaseData.filter(
        (entry: KnowledgeBaseEntry) =>
          entry &&
          entry.embedding &&
          Array.isArray(entry.embedding) &&
          entry.embedding.length > 0 &&
          entry.embedding[0] !== null,
      );

      if (validEntries.length === 0) {
        console.warn("⚠️ RAG: Knowledge base has no valid embeddings");
        this.isLoaded = true; // Marca como carregado para não tentar novamente
        this.isLoading = false;
        this.knowledgeBase = [];
        return;
      }

      this.knowledgeBase = validEntries;
      this.isLoaded = true;
      this.isLoading = false;
      console.log(`✅ RAG: Loaded ${validEntries.length} entries from knowledge base`);
    } catch (error) {
      // Knowledge base não encontrada, continua sem RAG
      console.warn("⚠️ RAG: Failed to load knowledge base, RAG disabled");
      this.isLoaded = true; // Marca como carregado para não tentar novamente
      this.isLoading = false;
      this.knowledgeBase = [];
    }
  }

  private async readKnowledgeBaseFromAsset(): Promise<
    KnowledgeBaseEntry[] | undefined
  > {
    try {
      if (!knowledgeBaseAsset.downloaded) {
        await knowledgeBaseAsset.downloadAsync();
      }

      const fileUri = knowledgeBaseAsset.localUri ?? knowledgeBaseAsset.uri;
      if (!fileUri) {
        throw new Error("Knowledge base asset URI unavailable");
      }

      const fileContents = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsed = JSON.parse(fileContents);

      if (Array.isArray(parsed)) {
        return parsed as KnowledgeBaseEntry[];
      }

      return undefined;
    } catch (error) {
      console.warn("⚠️ RAG: Unable to read knowledge base asset", error);
      return undefined;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: {
              parts: [{ text }],
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Embedding API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.embedding.values;
    } catch (error) {
      throw new Error("Erro ao gerar embedding");
    }
  }

  public async query(
    query: string,
    topK: number = 5,
  ): Promise<RAGResponse | null> {
    await this.loadKnowledgeBase();

    if (!this.isLoaded || this.knowledgeBase.length === 0) {
      return null;
    }

    // Tentar primeiro com embeddings + Gemini (requer rede)
    if (this.googleApiKey) {
      try {
        const embeddingResult = await this.queryWithEmbeddings(query, topK);
        if (embeddingResult) {
          console.log(`✅ RAG[embedding]: confidence=${embeddingResult.confidence.toFixed(2)}`);
          return embeddingResult;
        }
      } catch (err) {
        console.warn("⚠️ RAG: API indisponível, a usar pesquisa local:", (err as Error).message);
      }
    }

    // Fallback: pesquisa local por palavras-chave (offline)
    const localResult = this.queryLocal(query, topK);
    if (localResult) {
      console.log(`✅ RAG[local]: confidence=${localResult.confidence.toFixed(2)}, source=${localResult.sources[0]?.source}`);
    } else {
      console.warn("⚠️ RAG[local]: sem resultados para:", query);
    }
    return localResult;
  }

  private async queryWithEmbeddings(
    query: string,
    topK: number,
  ): Promise<RAGResponse | null> {
    // 1. Gerar embedding da query
    const queryEmbedding = await this.generateEmbedding(query);

    // 2. Buscar documentos similares
    const results = this.knowledgeBase.map((entry) => ({
      content: entry.content,
      metadata: entry.metadata,
      similarity: this.cosineSimilarity(queryEmbedding, entry.embedding),
    }));

    // 3. Ordenar por similaridade e pegar top K
    const relevantResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter((r) => r.similarity > 0.5);

    if (relevantResults.length === 0) return null;

    // 4. Construir contexto e gerar resposta com Gemini
    const context = relevantResults
      .map(
        (r) =>
          `[${r.metadata.source}, página ${r.metadata.page}]\n${r.content}`,
      )
      .join("\n\n---\n\n");

    const prompt = `Você é o assistente virtual da DGADR (Direção-Geral de Agricultura e Desenvolvimento Rural de Portugal).

Contexto relevante dos documentos:
${context}

Pergunta do utilizador: ${query}

Instruções:
- Responda em português de Portugal
- Use apenas informação do contexto fornecido
- Forneça uma resposta concisa (máximo 350 caracteres)
- Se não souber a resposta com base no contexto, diga "Não tenho informação específica sobre este assunto"
- NUNCA mencione números de telefone ou emails na resposta
- O contacto será fornecido automaticamente pelo sistema

Resposta:`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.googleApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 400 },
        }),
      },
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API Error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const geminiAnswer =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui processar a sua pergunta.";

    // Se a fonte principal é a central telefónica, extrair contactos
    const bestSource = relevantResults[0].metadata.source;
    if (bestSource.toLowerCase().includes("central_telefonica")) {
      const queryTokens = query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.replace(/[?!.,;:'"()[\]{}]/g, ""))
        .filter((t) => t.length > 2 && !RAGService.STOPWORDS.has(t));
      const combinedContent = relevantResults
        .filter((r) =>
          r.metadata.source.toLowerCase().includes("central_telefonica"),
        )
        .map((r) => r.content)
        .join("\n\n");
      const { contacts, intro } = this.parsePhoneDirectoryContacts(
        combinedContent,
        queryTokens,
      );
      if (contacts.length > 0) {
        return {
          answer: intro,
          sources: relevantResults.map((r) => ({
            source: r.metadata.source,
            page: r.metadata.page,
          })),
          confidence: relevantResults[0].similarity,
          contacts,
        };
      }
    }

    return {
      answer: geminiAnswer,
      sources: relevantResults.map((r) => ({
        source: r.metadata.source,
        page: r.metadata.page,
      })),
      confidence: relevantResults[0].similarity,
    };
  }

  private static readonly STOPWORDS = new Set([
    "que", "qual", "como", "para", "por", "com", "uma", "uns",
    "umas", "dos", "das", "nos", "nas", "num", "numa", "pelo",
    "pela", "aos", "este", "esta", "esse", "essa", "isso",
    "isto", "aqui", "ali", "onde", "mais", "muito", "bem",
    "ser", "ter", "pode", "está", "são", "tem", "foi", "era",
    "sim", "não", "nao", "sobre", "entre", "até", "também",
    "quando", "quem", "seu", "sua", "seus", "suas", "meu",
    "minha", "nosso", "nossa", "outro", "outra", "todo", "toda",
    "cada", "mesmo", "ainda", "fazer", "quero", "saber",
    "gostaria", "preciso", "queria", "diga", "diz",
    // Palavras de intenção de consulta (não discriminam conteúdo)
    "telefone", "telemóvel", "telemovel", "número", "numero",
    "contacto", "contato", "email", "ligar", "extensão",
    "extensao", "assunto", "assuntos", "informação", "informacao",
  ]);

  // Sinónimos para expandir a pesquisa
  private static readonly SYNONYMS: Record<string, string[]> = {
    "telefone": ["tel", "telefone", "contacto", "extensão", "ext", "ligar", "telefonar"],
    "número": ["número", "numero", "ext", "extensão"],
    "contacto": ["contacto", "contato", "telefone", "tel", "email"],
    "horário": ["horário", "horario", "funcionamento", "atendimento", "horas"],
    "morada": ["morada", "endereço", "endereco", "localização"],
  };

  private queryLocal(
    query: string,
    topK: number,
  ): RAGResponse | null {
    const queryLower = query.toLowerCase();

    // Filtrar stopwords, palavras curtas, e limpar pontuação
    const rawTokens = queryLower
      .split(/\s+/)
      .map((t) => t.replace(/[?!.,;:'"()[\]{}]/g, ""))
      .filter((t) => t.length > 2 && !RAGService.STOPWORDS.has(t));

    if (rawTokens.length === 0) return null;

    // Recolher sinónimos (separados dos tokens originais)
    const synonymTokens = new Set<string>();
    for (const token of rawTokens) {
      const syns = RAGService.SYNONYMS[token];
      if (syns) syns.forEach((s) => { if (!rawTokens.includes(s)) synonymTokens.add(s); });
    }

    // Pontuar cada entrada: tokens originais peso total, sinónimos peso reduzido
    const scored = this.knowledgeBase.map((entry) => {
      const contentLower = entry.content.toLowerCase();
      let score = 0;
      let rawMatches = 0;

      // Tokens originais: 3 pontos cada + TF bonus
      for (const token of rawTokens) {
        let idx = 0;
        let count = 0;
        while ((idx = contentLower.indexOf(token, idx)) !== -1) {
          count++;
          idx += token.length;
        }
        if (count > 0) {
          rawMatches++;
          score += 3 + Math.min(count - 1, 3) * 0.5;
        }
      }

      // Sinónimos: apenas 0.25 pontos cada (tiebreaker, não domina)
      for (const syn of synonymTokens) {
        if (contentLower.includes(syn)) score += 0.25;
      }

      // Bónus grande se TODOS os tokens originais aparecem (relevância completa)
      if (rawMatches === rawTokens.length) score *= 1.5;

      // Bónus para correspondência da frase inteira
      if (contentLower.includes(queryLower)) score += rawTokens.length * 3;

      return { entry, score, rawMatches };
    });

    const hits = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (hits.length === 0) return null;

    const bestScore = hits[0].score;
    const maxExpected = rawTokens.length * 3;
    const matchRatio = Math.min(bestScore / maxExpected, 1);
    const confidence = Math.min(0.5 + matchRatio * 0.45, 0.95);

    const bestSource = hits[0].entry.metadata.source;

    // Se a melhor fonte é a central telefónica, extrair contactos estruturados
    if (bestSource.toLowerCase().includes("central_telefonica")) {
      // Juntar conteúdo de todos os hits da central telefónica
      const phoneHits = hits.filter((h) =>
        h.entry.metadata.source.toLowerCase().includes("central_telefonica"),
      );
      const combinedContent = phoneHits
        .map((h) => h.entry.content)
        .join("\n\n");

      const { contacts, intro } = this.parsePhoneDirectoryContacts(
        combinedContent,
        rawTokens,
      );

      if (contacts.length > 0) {
        console.log(
          `✅ RAG[local]: ${contacts.length} contacto(s) extraído(s) da central telefónica`,
        );
        return {
          answer: intro,
          sources: phoneHits.map((h) => ({
            source: h.entry.metadata.source,
            page: h.entry.metadata.page,
          })),
          confidence,
          contacts,
        };
      }
    }

    // Para outras fontes, extrair as linhas mais relevantes do conteúdo
    const answer = this.extractRelevantLines(hits[0].entry.content, rawTokens);

    return {
      answer,
      sources: hits.map((h) => ({
        source: h.entry.metadata.source,
        page: h.entry.metadata.page,
      })),
      confidence,
    };
  }

  /**
   * Analisa o conteúdo da central telefónica e extrai contactos estruturados.
   * Formato: [Assunto] [Prioridade] - Nome DIVISÃO EXT TELEFONE
   */
  private parsePhoneDirectoryContacts(
    content: string,
    queryTokens: string[],
  ): { contacts: RAGContact[]; intro: string } {
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
    const phonePattern = /(21\s*844\s*\d{2}\s*\d{2})\s*$/;

    // Estrutura para guardar todos os contactos encontrados neste chunk
    const allContacts: Array<RAGContact & { subject: string }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const phoneMatch = line.match(phonePattern);
      if (!phoneMatch) continue;

      const phone = phoneMatch[1];
      const beforePhone = line.substring(0, phoneMatch.index).trim();

      // Extensão: 4 dígitos antes do telefone
      const extMatch = beforePhone.match(/(\d{4})\s*$/);
      if (!extMatch) continue;
      const beforeExt = beforePhone.substring(0, extMatch.index).trim();

      // Divisão: código maiúsculas como DSR/DER, DSPAA/DGRN
      const divMatch = beforeExt.match(/([A-Z]{2,}(?:\/[A-Z]{2,})?)\s*$/);
      if (!divMatch) continue;
      const division = divMatch[1];
      const beforeDiv = beforeExt.substring(0, divMatch.index).trim();

      let name = "";
      let inlineSubject = "";

      // Verificar se tem marcador de prioridade (1.ª -, 2.º -, etc.)
      const priorityMatch = beforeDiv.match(
        /^(.*?)(\d+\.(?:ª|º|a|o))\s*-\s*(.+)$/,
      );
      if (priorityMatch) {
        inlineSubject = priorityMatch[1].trim();
        name = priorityMatch[3].trim();
      } else {
        // Sem prioridade - últimas 2-3 palavras são o nome
        const words = beforeDiv.split(/\s+/);
        if (words.length >= 2) {
          name = words.slice(-2).join(" ");
          inlineSubject = words.slice(0, -2).join(" ");
        } else {
          name = beforeDiv;
        }
      }

      // Se não há assunto inline, buscar nas linhas anteriores
      let subject = inlineSubject;
      if (!subject) {
        const subjectLines: string[] = [];
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = lines[j];
          if (phonePattern.test(prevLine)) break;
          if (/^Assunto|^DS\.|^Ext\.|^Tel\./i.test(prevLine)) break;
          if (/^--\s*\d+\s*of\s*\d+\s*--$/.test(prevLine)) break;
          subjectLines.unshift(prevLine);
        }
        subject = subjectLines.join(" ").replace(/\s+/g, " ").trim();
      }

      allContacts.push({
        name,
        phone,
        department: subject || division,
        subject: subject || "",
      });
    }

    if (allContacts.length === 0) {
      return { contacts: [], intro: "" };
    }

    // Pontuar contactos pelos tokens da query (preferir quem tem mais matches)
    const scoredContacts = allContacts.map((c) => {
      const searchText = `${c.name} ${c.department} ${c.subject}`.toLowerCase();
      const matchCount = queryTokens.filter((t) => searchText.includes(t)).length;
      return { ...c, matchCount };
    });

    const bestMatchCount = Math.max(
      ...scoredContacts.map((c) => c.matchCount),
    );
    const matchingContacts = scoredContacts.filter(
      (c) => c.matchCount === bestMatchCount && c.matchCount > 0,
    );

    const finalContacts =
      matchingContacts.length > 0 ? matchingContacts : allContacts.slice(0, 2);

    // Gerar texto introdutório curto (os detalhes aparecem no cartão de contacto)
    let intro: string;
    if (finalContacts.length === 1) {
      const c = finalContacts[0];
      intro = c.department
        ? `Segue o contacto para ${c.department}:`
        : `Segue o contacto de ${c.name}:`;
    } else {
      const subjects = [
        ...new Set(finalContacts.map((c) => c.department).filter(Boolean)),
      ];
      intro = subjects.length > 0
        ? `Contactos para ${subjects[0]}:`
        : `Contactos encontrados:`;
    }

    return {
      contacts: finalContacts.map((c) => ({
        name: c.name,
        phone: c.phone,
        department: c.department,
      })),
      intro,
    };
  }

  /**
   * Extrai apenas as linhas relevantes do conteúdo, com contexto.
   * Para a central telefónica, devolve a linha da pessoa + info de contacto.
   * Para outros documentos, devolve as linhas que contêm os tokens.
   */
  private extractRelevantLines(content: string, tokens: string[]): string {
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    // Pontuar cada linha
    const scoredLines = lines.map((line, idx) => {
      const lower = line.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (lower.includes(token)) score++;
      }
      return { line, idx, score };
    });

    const matchingLines = scoredLines.filter((l) => l.score > 0);

    if (matchingLines.length === 0) {
      // Sem linhas específicas, devolver resumo do conteúdo
      const text = content.replace(/\s+/g, " ").trim();
      return text.length > 400 ? text.substring(0, 397) + "..." : text;
    }

    // Ordenar por score e pegar as melhores
    matchingLines.sort((a, b) => b.score - a.score);

    // Para cada linha com match, incluir 2 linhas antes (contexto) e 1 depois
    const selectedIndices = new Set<number>();
    const topLines = matchingLines.slice(0, 3);
    for (const ml of topLines) {
      for (let i = Math.max(0, ml.idx - 2); i <= Math.min(lines.length - 1, ml.idx + 1); i++) {
        selectedIndices.add(i);
      }
    }

    // Juntar linhas selecionadas em ordem
    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const result = sortedIndices.map((i) => lines[i]).join("\n");

    // Limpar emails (mas NÃO telefones — o utilizador pode perguntar por números)
    const cleaned = result
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return cleaned.length > 500 ? cleaned.substring(0, 497) + "..." : cleaned;
  }
}
