import { db } from "../index";
import { EmbeddingCache } from "./cacheService";

// Type definitions for knowledge base documents
interface KnowledgeBaseMetadata {
  source: string;
  page: number;
  chunkIndex: number;
}

interface KnowledgeBaseDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: KnowledgeBaseMetadata;
  createdAt?: string;
}

interface DocumentSnapshot {
  id: string;
  exists: boolean;
  data: () => KnowledgeBaseDocument;
  ref: any;
}

interface QuerySnapshot {
  docs: DocumentSnapshot[];
  size: number;
}

interface CollectionQuery {
  doc?: (id: string) => any;
  get: () => Promise<QuerySnapshot>;
  where: (field: string, op: string, value: any) => CollectionQuery;
}

interface SearchResult {
  id: string;
  content: string;
  metadata: KnowledgeBaseMetadata;
  similarity: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function searchKnowledgeBase(
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
  // 1. Gerar embedding da query
  const queryEmbedding = await EmbeddingCache.getEmbedding(query);

  // 2. Buscar todos os documentos do Firestore
  const snapshot = (await db.collection("knowledge_base").get()) as QuerySnapshot;

  if (snapshot.size === 0) {
    console.log("⚠️  No documents found in knowledge_base collection");
    return [];
  }

  // 3. Calcular similaridade para cada documento
  const results: SearchResult[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    const similarity = cosineSimilarity(queryEmbedding, data.embedding);

    return {
      id: doc.id,
      content: data.content,
      metadata: data.metadata,
      similarity,
    };
  });

  // 4. Ordenar por similaridade e retornar top K
  return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
}

/**
 * Buscar com filtros adicionais
 */
export async function searchKnowledgeBaseWithFilters(
  query: string,
  options: {
    topK?: number;
    source?: string;
    minSimilarity?: number;
  } = {},
): Promise<SearchResult[]> {
  const { topK = 5, source, minSimilarity = 0 } = options;

  const queryEmbedding = await EmbeddingCache.getEmbedding(query);

  // Query com filtros
  let firestoreQuery: CollectionQuery = db.collection("knowledge_base") as CollectionQuery;

  if (source) {
    // Quando usamos .where(), muda para tipo Query
    firestoreQuery = firestoreQuery.where("metadata.source", "==", source);
  }

  const snapshot = (await firestoreQuery.get()) as QuerySnapshot;

  if (snapshot.size === 0) {
    return [];
  }

  const results: SearchResult[] = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const similarity = cosineSimilarity(queryEmbedding, data.embedding);

      return {
        id: doc.id,
        content: data.content,
        metadata: data.metadata,
        similarity,
      };
    })
    .filter((r) => r.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}

/**
 * Obter estatísticas da knowledge base
 */
export async function getKnowledgeBaseStats(): Promise<{
  totalChunks: number;
  totalSources: number;
  sources: string[];
}> {
  const snapshot = (await db.collection("knowledge_base").get()) as QuerySnapshot;

  const sources = new Set<string>();
  let totalChunks = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.metadata?.source) {
      sources.add(data.metadata.source);
    }
    totalChunks++;
  });

  return {
    totalChunks,
    totalSources: sources.size,
    sources: Array.from(sources),
  };
}
