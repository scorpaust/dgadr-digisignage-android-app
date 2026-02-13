import { z } from "zod";
import { ai } from "../config";
import { processAllPDFs } from "../utils/pdfProcessor";
import { generateEmbedding } from "../utils/embeddingService";
import path from "path";
import fs from "fs";

export const ingestPDFsFlow = ai.defineFlow(
  {
    name: "ingestPDFs",
    inputSchema: z.object({
      pdfDirectory: z.string().optional(),
    }),
    outputSchema: z.object({
      processedChunks: z.number(),
      message: z.string(),
    }),
  },
  async (input: any) => {
    const pdfDir = input.pdfDirectory || path.join(__dirname, "../../pdfs");

    // 1. Processar PDFs
    console.log("Processing PDFs...");
    const chunks = await processAllPDFs(pdfDir);

    // 2. Gerar embeddings e guardar em ficheiro JSON local (RAG knowledge base)
    console.log("Generating embeddings and storing...");

    const knowledgeBase: Array<{
      id: string;
      content: string;
      embedding: number[];
      metadata: { source: string; page: number; chunkIndex: number };
      createdAt: string;
    }> = [];

    for (const chunk of chunks) {
      console.log(`Processing chunk: ${chunk.id}`);
      const embedding = await generateEmbedding(chunk.content);

      // Convert embedding to plain array of numbers
      const embeddingArray: number[] = [];
      for (let i = 0; i < embedding.length; i++) {
        embeddingArray.push(Number(embedding[i]));
      }

      knowledgeBase.push({
        id: chunk.id,
        content: chunk.content,
        embedding: embeddingArray,
        metadata: {
          source: String(chunk.metadata.source),
          page: Number(chunk.metadata.page),
          chunkIndex: Number(chunk.metadata.chunkIndex),
        },
        createdAt: new Date().toISOString(),
      });
      console.log(`Processed chunk: ${chunk.id}`);
    }

    // Save to local JSON file
    const outputPath = path.join(__dirname, "../../data/knowledge_base.json");
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));
    console.log(`Saved knowledge base to ${outputPath}`);

    return {
      processedChunks: chunks.length,
      message: `Successfully processed ${chunks.length} chunks from PDFs`,
    };
  },
);
