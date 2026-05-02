import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Contact } from "../types/chat";

// ── Types ────────────────────────────────────────────────────────────────────

interface DgadrEntry {
  subjects: string[];
  keywords: string[];
  division: string;
  division_abbr: string;
  phones: string[];
}

interface DgadrKB {
  type: string;
  divisionNames: Record<string, string>;
  entries: DgadrEntry[];
}

interface ExternalEntity {
  abbr: string;
  name: string;
  subjects: string[];
  keywords: string[];
  site: string;
  address: string;
  email: string;
  phone: string;
  is_ccdr: boolean;
  ccdr_regions: string[];
}

interface ExternalKB {
  type: string;
  entities: ExternalEntity[];
}

export interface DgadrLookupResult {
  type: "dgadr";
  division: string;
  division_abbr: string;
  phones: string[];
  contacts: Contact[];
}

export interface ExternalLookupResult {
  type: "external";
  entities: ExternalEntity[];
  isCcdrFiltered: boolean;
}

export type LookupResult = DgadrLookupResult | ExternalLookupResult | null;

// ── Assets ───────────────────────────────────────────────────────────────────

const dgadrAsset = Asset.fromModule(require("../data/dgadr_contacts.kb"));
const externalAsset = Asset.fromModule(require("../data/entidades_externas.kb"));

// ── Service ──────────────────────────────────────────────────────────────────

export class ContactLookupService {
  private static instance: ContactLookupService;

  private dgadrKB: DgadrKB | null = null;
  private externalKB: ExternalKB | null = null;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): ContactLookupService {
    if (!ContactLookupService.instance) {
      ContactLookupService.instance = new ContactLookupService();
    }
    return ContactLookupService.instance;
  }

  // ── Loading ─────────────────────────────────────────────────────────────────

  public async load(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      const [dgadrData, externalData] = await Promise.all([
        this.readAsset(dgadrAsset),
        this.readAsset(externalAsset),
      ]);
      this.dgadrKB = dgadrData as DgadrKB | null;
      this.externalKB = externalData as ExternalKB | null;
      this.isLoaded = true;
    })();

    try {
      await this.loadPromise;
    } finally {
      this.loadPromise = null;
    }
  }

  private async readAsset(asset: Asset): Promise<unknown | null> {
    try {
      if (!asset.downloaded) await asset.downloadAsync();
      const uri = asset.localUri ?? asset.uri;
      if (!uri) return null;
      const text = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // ── Main lookup ─────────────────────────────────────────────────────────────

  /**
   * Score both DGADR and External in parallel; the higher score wins.
   * Ties go to External (more specific/deterministic data).
   * Min threshold of 2 avoids noise matches on single generic tokens.
   */
  public async lookup(query: string): Promise<LookupResult> {
    await this.load();

    const tokens = this.tokenize(query);
    if (tokens.length === 0) return null;
    const queryLower = query.toLowerCase();

    const { entry: dgadrEntry, score: dgadrScore } =
      this.bestDgadrEntry(tokens);
    const { entity: extEntity, score: extScore } =
      this.bestExternalEntity(tokens);

    const MIN = 2; // require at least 2 points to avoid noise

    // External wins on tie (it's a deterministic redirect)
    if (extScore >= dgadrScore && extScore >= MIN) {
      return this.buildExternalResult(extEntity!, tokens, queryLower);
    }

    if (dgadrScore >= MIN && dgadrEntry) {
      return this.buildDgadrResult(dgadrEntry);
    }

    // Neither scored enough — return null (fall through to RAG/OpenAI)
    return null;
  }

  // ── DGADR scoring ────────────────────────────────────────────────────────────

  private bestDgadrEntry(
    tokens: string[],
  ): { entry: DgadrEntry | null; score: number } {
    if (!this.dgadrKB?.entries?.length) return { entry: null, score: 0 };

    let bestEntry: DgadrEntry | null = null;
    let bestScore = 0;

    for (const entry of this.dgadrKB.entries) {
      const s = this.scoreMatch(tokens, entry.keywords);
      if (s > bestScore) {
        bestScore = s;
        bestEntry = entry;
      }
    }
    return { entry: bestEntry, score: bestScore };
  }

  private buildDgadrResult(entry: DgadrEntry): DgadrLookupResult {
    const contacts: Contact[] = entry.phones.map((phone, idx) => ({
      name: idx === 0 ? entry.division_abbr : "",
      phone,
      email: "",
      department: idx === 0 ? entry.division : "",
    }));
    return {
      type: "dgadr",
      division: entry.division,
      division_abbr: entry.division_abbr,
      phones: entry.phones,
      contacts,
    };
  }

  // ── External entities scoring ─────────────────────────────────────────────────

  private bestExternalEntity(
    tokens: string[],
  ): { entity: ExternalEntity | null; score: number } {
    if (!this.externalKB?.entities?.length) return { entity: null, score: 0 };

    let bestEntity: ExternalEntity | null = null;
    let bestScore = 0;

    for (const entity of this.externalKB.entities) {
      const s = this.scoreMatch(tokens, entity.keywords);
      if (s > bestScore) {
        bestScore = s;
        bestEntity = entity;
      }
    }
    return { entity: bestEntity, score: bestScore };
  }

  private buildExternalResult(
    topEntity: ExternalEntity,
    tokens: string[],
    queryLower: string,
  ): ExternalLookupResult {
    // If the winning entity is a CCDR, apply geographic filtering
    if (topEntity.is_ccdr) {
      return this.handleCcdrResult(queryLower);
    }

    // Check if a CCDR scored similarly to the top entity — show all CCDRs if so
    const allCcdrScores = (this.externalKB?.entities ?? [])
      .filter((e) => e.is_ccdr)
      .map((e) => this.scoreMatch(tokens, e.keywords));
    const bestCcdrScore = Math.max(0, ...allCcdrScores);
    const topEntityScore = this.scoreMatch(tokens, topEntity.keywords);

    if (bestCcdrScore > 0 && bestCcdrScore >= topEntityScore * 0.8) {
      return this.handleCcdrResult(queryLower);
    }

    return { type: "external", entities: [topEntity], isCcdrFiltered: false };
  }

  // ── CCDR geographic filtering ────────────────────────────────────────────────

  private handleCcdrResult(queryLower: string): ExternalLookupResult {
    const allCcdr = this.externalKB!.entities.filter((e) => e.is_ccdr);

    // Try to match a specific CCDR by location keywords in the query
    const matchedCcdr = allCcdr.find((ccdr) =>
      ccdr.ccdr_regions.some((region) => queryLower.includes(region.toLowerCase())),
    );

    if (matchedCcdr) {
      return {
        type: "external",
        entities: [matchedCcdr],
        isCcdrFiltered: true,
      };
    }

    // No location specified → return all CCDRs
    return {
      type: "external",
      entities: allCcdr,
      isCcdrFiltered: false,
    };
  }

  // ── Response formatters ──────────────────────────────────────────────────────

  /**
   * Format a DgadrLookupResult into a human-readable answer string.
   */
  public formatDgadrAnswer(result: DgadrLookupResult): string {
    const abbr = result.division_abbr;
    const name = result.division;

    // Handle combined divisions (e.g. "DER / DIH / DIR")
    if (abbr.includes("/")) {
      return `Este assunto é da competência de várias divisões da DGADR: ${name} (${abbr}).`;
    }
    return `Este assunto é tratado pela ${name} (${abbr}) da DGADR.`;
  }

  /**
   * Format an ExternalLookupResult into a human-readable answer string.
   * Includes site, address, email and phone for each entity.
   */
  public formatExternalAnswer(result: ExternalLookupResult): string {
    if (result.entities.length === 0) return "";

    if (result.entities.length === 1) {
      const e = result.entities[0];
      const lines = this.buildEntityBlock(e);
      const intro = e.is_ccdr && result.isCcdrFiltered
        ? `Este assunto não é da competência da DGADR. Com base na localização indicada, deve contactar:`
        : `Este assunto não é da competência da DGADR. Para esta questão, deve contactar:`;
      return `${intro}\n\n${lines}`;
    }

    // Multiple CCDRs
    if (result.entities.every((e) => e.is_ccdr)) {
      const blocks = result.entities.map((e) => this.buildEntityBlock(e)).join("\n\n");
      return (
        `Este assunto não é da competência da DGADR. Deve contactar a CCDR da sua região.\n` +
        `Se indicar o local da exploração agrícola, podemos indicar a CCDR específica.\n\n` +
        blocks
      );
    }

    // Multiple non-CCDR entities (edge case)
    const blocks = result.entities.map((e) => this.buildEntityBlock(e)).join("\n\n");
    return `Este assunto não é da competência da DGADR. Deve contactar:\n\n${blocks}`;
  }

  private buildEntityBlock(e: ExternalEntity): string {
    const lines: string[] = [];
    lines.push(`${e.name} (${e.abbr})`);
    if (e.site) lines.push(`Site: ${e.site}`);
    if (e.address) lines.push(`Morada: ${e.address}`);
    if (e.email && e.email.includes("@")) lines.push(`E-mail: ${e.email}`);
    if (e.phone && e.phone !== "Não disponível") lines.push(`Tel.: ${e.phone}`);
    return lines.join("\n");
  }

  /**
   * Convert external entities to Contact[] for the phone-call UI cards.
   * Only includes entities that have a phone number for the call button.
   * Name = entity name; department = site URL.
   */
  public externalToContacts(result: ExternalLookupResult): Contact[] {
    return result.entities
      .filter((e) => e.phone && e.phone !== "Não disponível")
      .map((entity) => ({
        name: `${entity.name} (${entity.abbr})`,
        phone: entity.phone,
        email: entity.email.includes("@") ? entity.email : "",
        department: entity.site,
      }));
  }

  // ── Tokenizer & scorer ───────────────────────────────────────────────────────

  private static readonly STOPWORDS = new Set([
    "que", "qual", "como", "para", "por", "com", "uma", "uns", "umas",
    "dos", "das", "nos", "nas", "num", "numa", "pelo", "pela", "aos",
    "este", "esta", "esse", "essa", "isso", "isto", "aqui", "ali",
    "onde", "mais", "muito", "bem", "ser", "ter", "pode", "está",
    "são", "tem", "foi", "era", "sim", "não", "nao", "sobre", "entre",
    "até", "também", "quando", "quem", "seu", "sua", "seus", "suas",
    "meu", "minha", "nosso", "nossa", "outro", "outra", "todo", "toda",
    "cada", "mesmo", "ainda", "fazer", "quero", "saber", "gostaria",
    "preciso", "queria", "diga", "diz", "informação", "informacao",
    "contacto", "contato", "telefone", "numero", "número", "assunto",
    "questão", "questao", "pergunta", "ajuda",
  ]);

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // remove diacritics for matching
      .split(/[\s,;:.!?()[\]{}"'/]+/)
      .filter((t) => t.length > 2 && !ContactLookupService.STOPWORDS.has(t));
  }

  /**
   * Score how well `tokens` (from query) match against `keywordList`.
   *
   * Per-token scoring uses MAX across all keywords (not sum), so a token that
   * appears in 10 different keywords still only contributes once. This prevents
   * generic words like "rural" from inflating entries with many such keywords.
   *
   *   exact word match  → 3 pts
   *   partial / phrase  → 1 pt
   *
   * Bonus: if the joined query phrase matches a keyword phrase exactly,
   * add (nTokens × 2) — rewards specificity.
   */
  private scoreMatch(tokens: string[], keywordList: string[]): number {
    const normKws = keywordList.map((k) =>
      k.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
    );

    let score = 0;

    for (const token of tokens) {
      // Best score this token can earn against ANY keyword (max, not sum)
      let tokenBest = 0;
      for (const kw of normKws) {
        if (kw === token) {
          tokenBest = 3;
          break; // exact match is the maximum possible
        } else if (kw.includes(token) || token.includes(kw)) {
          tokenBest = Math.max(tokenBest, 1);
        }
      }
      score += tokenBest;
    }

    // Phrase bonus: rewards queries that match a specific multi-word keyword
    const queryPhrase = tokens.join(" ");
    for (const kw of normKws) {
      if (kw === queryPhrase || kw.includes(queryPhrase) || queryPhrase.includes(kw)) {
        score += tokens.length * 2;
        break;
      }
    }

    return score;
  }

  // ── CCDR helper ──────────────────────────────────────────────────────────────

  /**
   * Returns all CCDR entities (for cases where all CCDRs must be shown).
   */
  public getAllCcdr(): ExternalEntity[] {
    return this.externalKB?.entities.filter((e) => e.is_ccdr) ?? [];
  }

  /**
   * Find CCDR by location text (returns null if none matched).
   */
  public findCcdrByLocation(locationText: string): ExternalEntity | null {
    const lower = locationText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    return (
      this.externalKB?.entities.find(
        (e) =>
          e.is_ccdr &&
          e.ccdr_regions.some((r) => {
            const rNorm = r
              .toLowerCase()
              .normalize("NFD")
              .replace(/[̀-ͯ]/g, "");
            return lower.includes(rNorm);
          }),
      ) ?? null
    );
  }
}
