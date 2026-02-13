import fs from 'fs';
import path from 'path';
const { PDFParse } = require('pdf-parse');

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    page: number;
    chunkIndex: number;
  };
}

export async function processPDF(filePath: string): Promise<DocumentChunk[]> {
  try {
    // Read PDF file as buffer
    const dataBuffer = fs.readFileSync(filePath);

    // Initialize PDFParse with data buffer
    const parser = new PDFParse({ data: dataBuffer });

    // Extract text from PDF
    const textResult = await parser.getText();
    
    const chunks: DocumentChunk[] = [];
    const chunkSize = 1000; // caracteres por chunk
    const overlap = 200; // overlap entre chunks
    
    const text = textResult.text;
    const fileName = path.basename(filePath);
    const numPages = textResult.numpages || textResult.info?.numPages || 1;
    
    // Dividir em chunks com overlap
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunk = text.slice(i, i + chunkSize);
      const chunkIndex = Math.floor(i / (chunkSize - overlap));
      
      chunks.push({
        id: `${fileName}-chunk-${chunkIndex}`,
        content: chunk.trim(),
        metadata: {
          source: fileName,
          page: Math.floor(i / (text.length / numPages)),
          chunkIndex,
        },
      });
    }

    await parser.destroy();
    return chunks;
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error);
    throw error;
  }
}

export async function processAllPDFs(pdfDir: string): Promise<DocumentChunk[]> {
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  const allChunks: DocumentChunk[] = [];
  
  for (const file of files) {
    const filePath = path.join(pdfDir, file);
    console.log(`Processing ${file}...`);
    const chunks = await processPDF(filePath);
    allChunks.push(...chunks);
  }
  
  return allChunks;
}