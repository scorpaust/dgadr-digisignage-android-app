import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';
import { ai, db } from '../config';
import { generateEmbedding } from '../utils/embeddingService';

// Função para calcular similaridade de cosseno
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export const queryRAGFlow = ai.defineFlow(
  {
    name: 'queryRAG',
    inputSchema: z.object({
      query: z.string(),
      topK: z.number().optional().default(5),
    }),
    outputSchema: z.object({
      answer: z.string(),
      sources: z.array(z.object({
        source: z.string(),
        page: z.number(),
      })),
    }),
  },
  async (input) => {
    // 1. Gerar embedding da query
    const queryEmbedding = await generateEmbedding(input.query);
    
    // 2. Buscar documentos similares
    const snapshot = await db.collection('knowledge_base').get();
    
    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      const similarity = cosineSimilarity(queryEmbedding, data.embedding);
      
      return {
        id: doc.id,
        content: data.content,
        metadata: data.metadata,
        similarity,
      };
    });
    
    // 3. Ordenar por similaridade e pegar top K
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, input.topK);
    
    // 4. Construir contexto
    const context = topResults
      .map(r => `[${r.metadata.source}, página ${r.metadata.page}]\n${r.content}`)
      .join('\n\n---\n\n');
    
    // 5. Gerar resposta com o modelo
    const prompt = `Você é o assistente virtual da DGADR (Direção-Geral de Agricultura e Desenvolvimento Rural de Portugal).
    
Contexto relevante dos documentos:
${context}

Pergunta do utilizador: ${input.query}

Instruções:
- Responda em português de Portugal
- Use apenas informação do contexto fornecido e forneça apenas o contacto telefónico e um pequeno sumário esclarecedor em resposta ao pedido (sumário de 350 caracteres no máximo num parágrafo)
- Se não souber a resposta com base no contexto, diga isso claramente
- Seja preciso e útil

Resposta:`;

    const response = await ai.generate({
      model: gemini15Flash,
      prompt,
    });
    
    return {
      answer: response.text(),
      sources: topResults.map(r => ({
        source: r.metadata.source,
        page: r.metadata.page,
      })),
    };
  }
);