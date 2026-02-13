import "dotenv/config";

import * as fs from 'fs';
import * as path from 'path';
import { processAllPDFs } from '../utils/pdfProcessor';
import { generateEmbeddings } from '../utils/embeddingService';

// Caminho do ficheiro JSON
const DB_FILE = path.join(__dirname, '../../data/knowledge_base.json');

// Interface para compatibilidade
interface DocRef {
  _collection: string;
  _id: string;
}

interface DocSnapshot {
  id: string;
  exists: boolean;
  data: () => any;
}

interface QuerySnapshot {
  docs: DocSnapshot[];
  size: number;
}

interface Batch {
  operations: Array<{ type: string; collection: string; id: string; data: any }>;
  set: (ref: DocRef, data: any) => void;
  commit: () => Promise<void>;
}

// Implementação do "database" local
export const db = {
  collection: (name: string) => ({
    doc: (id: string): any => {
      const ref: DocRef = { _collection: name, _id: id };
      
      return {
        ...ref,
        set: async (data: any) => {
          const dbData = loadDB();
          if (!dbData[name]) dbData[name] = {};
          dbData[name][id] = data;
          saveDB(dbData);
        },
        get: async (): Promise<DocSnapshot> => {
          const dbData = loadDB();
          const exists = !!dbData[name]?.[id];
          return {
            id,
            exists,
            data: () => dbData[name]?.[id],
          };
        },
        update: async (data: any) => {
          const dbData = loadDB();
          if (!dbData[name]) dbData[name] = {};
          if (!dbData[name][id]) dbData[name][id] = {};
          dbData[name][id] = { ...dbData[name][id], ...data };
          saveDB(dbData);
        },
        delete: async () => {
          const dbData = loadDB();
          if (dbData[name]?.[id]) {
            delete dbData[name][id];
            saveDB(dbData);
          }
        },
      };
    },
    
    get: async (): Promise<QuerySnapshot> => {
      const dbData = loadDB();
      const collection = dbData[name] || {};
      
      const docs: DocSnapshot[] = Object.entries(collection).map(([id, data]) => ({
        id,
        exists: true,
        data: () => data,
      }));
      
      return {
        docs,
        size: docs.length,
      };
    },
  }),
  
  batch: (): Batch => {
    const operations: Array<{ type: string; collection: string; id: string; data: any }> = [];
    
    return {
      operations,
      set: (ref: DocRef, data: any) => {
        operations.push({
          type: 'set',
          collection: ref._collection,
          id: ref._id,
          data,
        });
      },
      commit: async () => {
        const dbData = loadDB();
        
        operations.forEach(op => {
          if (!dbData[op.collection]) dbData[op.collection] = {};
          dbData[op.collection][op.id] = op.data;
        });
        
        saveDB(dbData);
        console.log(`  ✓ Batch committed: ${operations.length} operations`);
      },
    };
  },
};

// Funções auxiliares
function loadDB(): any {
  const dir = path.dirname(DB_FILE);
  
  // Criar diretório se não existir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Criar ficheiro se não existir
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
    return {};
  }
  
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading database:', error);
    return {};
  }
}

function saveDB(data: any): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
}

// Funções utilitárias públicas
export function getDBStats() {
  const dbData = loadDB();
  const collections = Object.keys(dbData);
  
  const stats = collections.map(collection => ({
    collection,
    documents: Object.keys(dbData[collection] || {}).length,
  }));
  
  return {
    collections: collections.length,
    details: stats,
    totalDocuments: stats.reduce((sum, s) => sum + s.documents, 0),
  };
}

export function clearDB() {
  saveDB({});
  console.log('🧹 Database cleared');
}

export function exportDB(outputPath: string) {
  const dbData = loadDB();
  fs.writeFileSync(outputPath, JSON.stringify(dbData, null, 2));
  console.log(`📤 Database exported to ${outputPath}`);
}

console.log('✅ Local JSON database initialized');
console.log(`📂 Database file: ${DB_FILE}`);

// Main ingest function
async function runIngest() {
  try {
    console.log('\n🚀 Starting PDF ingestion process...\n');

    // 1. Process PDFs from the pdfs directory
    const pdfDir = path.join(__dirname, '../../pdfs');

    if (!fs.existsSync(pdfDir)) {
      console.error(`❌ PDF directory not found: ${pdfDir}`);
      process.exit(1);
    }

    const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.error(`❌ No PDF files found in: ${pdfDir}`);
      process.exit(1);
    }

    console.log(`📁 Found ${pdfFiles.length} PDF file(s):`);
    pdfFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');

    // 2. Process all PDFs into chunks
    console.log('📄 Processing PDFs into chunks...\n');
    const chunks = await processAllPDFs(pdfDir);
    console.log(`✅ Processed ${chunks.length} chunks from ${pdfFiles.length} PDF(s)\n`);

    // 3. Generate embeddings for all chunks
    console.log('🧠 Generating embeddings with OpenAI...\n');
    const texts = chunks.map(chunk => chunk.content);
    const embeddings = await generateEmbeddings(texts);
    console.log(`✅ Generated ${embeddings.length} embeddings\n`);

    // 4. Create knowledge base entries
    console.log('💾 Creating knowledge base entries...\n');
    const knowledgeBase = chunks.map((chunk, index) => ({
      id: chunk.id,
      content: chunk.content,
      embedding: embeddings[index],
      metadata: {
        source: chunk.metadata.source,
        page: chunk.metadata.page,
        chunkIndex: chunk.metadata.chunkIndex,
      },
      createdAt: new Date().toISOString(),
    }));

    // 5. Save to local JSON file
    const outputDir = path.dirname(DB_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(knowledgeBase, null, 2));

    console.log('✅ Knowledge base saved successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Total chunks: ${chunks.length}`);
    console.log(`   - Total embeddings: ${embeddings.length}`);
    console.log(`   - Output file: ${DB_FILE}`);
    console.log(`   - File size: ${(fs.statSync(DB_FILE).size / 1024 / 1024).toFixed(2)} MB`);
    console.log('\n✨ Ingestion completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Ingestion failed:', error);
    process.exit(1);
  }
}

// Run the ingest process
if (require.main === module) {
  runIngest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}