//import { db } from "../index";
import { db } from "../index";
import { generateEmbedding } from "./embeddingService";

interface CacheEntry {
  query: string;
  embedding: number[];
  timestamp: Date;
  hitCount: number;
}

export class EmbeddingCache {
  private static CACHE_COLLECTION = "embedding_cache";
  private static CACHE_TTL_DAYS = 30;
  private static MAX_CACHE_SIZE = 1000;

  /**
   * Obter embedding com cache
   */
  static async getEmbedding(query: string): Promise<number[]> {
    // Normalizar query
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Tentar buscar do cache
    const cached = await this.getCachedEmbedding(normalizedQuery);
    if (cached) {
      console.log("✅ Cache hit for query");
      await this.incrementHitCount(normalizedQuery);
      return cached;
    }

    // 2. Gerar novo embedding
    console.log("❌ Cache miss, generating embedding...");
    const embedding = await generateEmbedding(query);

    // 3. Guardar no cache
    await this.saveToCache(normalizedQuery, embedding);

    return embedding;
  }

  /**
   * Buscar embedding do cache
   */
  private static async getCachedEmbedding(
    query: string,
  ): Promise<number[] | null> {
    try {
      const docRef = db
        .collection(this.CACHE_COLLECTION)
        .doc(this.hashQuery(query));
      const doc = await docRef.get();

      if (!doc.exists) return null;

      const data = doc.data() as CacheEntry;

      // Verificar se expirou
      const expirationDate = new Date(data.timestamp);
      expirationDate.setDate(expirationDate.getDate() + this.CACHE_TTL_DAYS);

      if (new Date() > expirationDate) {
        await docRef.delete();
        return null;
      }

      return data.embedding;
    } catch (error) {
      console.error("Error fetching from cache:", error);
      return null;
    }
  }

  /**
   * Guardar no cache
   */
  private static async saveToCache(
    query: string,
    embedding: number[],
  ): Promise<void> {
    try {
      // Verificar tamanho do cache
      await this.cleanupCache();

      const docRef = db
        .collection(this.CACHE_COLLECTION)
        .doc(this.hashQuery(query));
      await docRef.set({
        query,
        embedding,
        timestamp: new Date(),
        hitCount: 0,
      });
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

  /**
   * Incrementar contador de hits
   */
  private static async incrementHitCount(query: string): Promise<void> {
    try {
      const docRef = db
        .collection(this.CACHE_COLLECTION)
        .doc(this.hashQuery(query));
      const doc = await docRef.get();
      const currentCount = doc.data()?.hitCount || 0;

      await docRef.update({
        hitCount: currentCount + 1,
      });
    } catch (error) {
      // Ignorar erros de increment
    }
  }

  /**
   * Limpar cache quando excede tamanho
   */
  private static async cleanupCache(): Promise<void> {
    const snapshot = await db.collection(this.CACHE_COLLECTION).get();

    if (snapshot.size < this.MAX_CACHE_SIZE) return;

    // Ordenar por hitCount
    const docs = snapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        hitCount: doc.data().hitCount || 0,
      }))
      .sort((a: any, b: any) => a.hitCount - b.hitCount);

    // Remover 20% menos usados
    const toRemove = Math.floor(this.MAX_CACHE_SIZE * 0.2);
    const batch = db.batch();

    for (let i = 0; i < toRemove; i++) {
      batch.delete(db.collection(this.CACHE_COLLECTION).doc(docs[i].id));
    }

    await batch.commit();
    console.log(`🧹 Cleaned up ${toRemove} cache entries`);
  }

  /**
   * Hash da query
   */
  private static hashQuery(query: string): string {
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `cache_${Math.abs(hash)}`;
  }

  /**
   * Limpar todo o cache
   */
  static async clearAll(): Promise<void> {
    const snapshot = await db.collection(this.CACHE_COLLECTION).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    await batch.commit();
  }
}
