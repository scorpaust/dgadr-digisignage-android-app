import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Modelo de embedding (recomendado: text-embedding-3-small)
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, $0.00002/1K tokens
// Alternativa mais potente: 'text-embedding-3-large' // 3072 dimensions, $0.00013/1K tokens

/**
 * Gerar embedding usando OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Truncar texto se for muito longo (OpenAI suporta até 8191 tokens)
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) : text;
    
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncatedText,
      encoding_format: 'float',
    });
    
    return response.data[0].embedding;
    
  } catch (error: any) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
}

/**
 * Gerar múltiplos embeddings em batch (OpenAI suporta até 2048 inputs por request)
 */
export async function generateEmbeddings(
  texts: string[],
  options: { 
    batchSize?: number; 
    retries?: number;
    delayMs?: number;
  } = {}
): Promise<number[][]> {
  const { 
    batchSize = 100, // OpenAI permite até 2048, mas vamos usar 100 para segurança
    retries = 3,
    delayMs = 100,
  } = options;
  
  const embeddings: number[][] = [];
  
  console.log(`\n📊 Generating ${texts.length} embeddings with OpenAI...`);
  console.log(`   Model: ${EMBEDDING_MODEL}`);
  console.log(`   Batch size: ${batchSize}\n`);
  
  const totalBatches = Math.ceil(texts.length / batchSize);
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    
    console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} items)`);
    
    let attempt = 0;
    let success = false;
    
    while (attempt < retries && !success) {
      try {
        // Truncar textos do batch
        const truncatedBatch = batch.map(text => 
          text.length > 8000 ? text.substring(0, 8000) : text
        );
        
        const response = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: truncatedBatch,
          encoding_format: 'float',
        });
        
        // Adicionar embeddings na ordem correta
        response.data.forEach(item => {
          embeddings.push(item.embedding);
        });
        
        success = true;
        console.log(`  ✅ Completed (total: ${embeddings.length}/${texts.length})`);
        
      } catch (error: any) {
        attempt++;
        
        if (attempt >= retries) {
          console.error(`\n  ❌ Batch ${batchNum} failed after ${retries} attempts`);
          console.error(`     Error: ${error.message}`);
          throw error;
        }
        
        const waitTime = delayMs * Math.pow(2, attempt); // Exponential backoff
        console.log(`  ⚠️  Retry ${attempt}/${retries} (waiting ${waitTime}ms)...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Rate limiting entre batches
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log(`\n✅ All embeddings generated: ${embeddings.length}/${texts.length}\n`);
  
  // Validar que temos todos os embeddings
  if (embeddings.length !== texts.length) {
    throw new Error(`Embedding count mismatch: ${embeddings.length} vs ${texts.length}`);
  }
  
  return embeddings;
}

/**
 * Verificar se a API está funcionando
 */
export async function testEmbeddingAPI(): Promise<boolean> {
  try {
    console.log('🧪 Testing OpenAI embedding API...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in .env file');
    }
    
    const testEmbedding = await generateEmbedding('Test message for API validation');
    
    console.log(`✅ API working!`);
    console.log(`   Model: ${EMBEDDING_MODEL}`);
    console.log(`   Embedding dimensions: ${testEmbedding.length}`);
    console.log(`   Sample values: [${testEmbedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
    
    return true;
    
  } catch (error: any) {
    console.error('❌ API test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('\n💡 Solution:');
      console.error('   1. Get API key from: https://platform.openai.com/api-keys');
      console.error('   2. Add to .env file: OPENAI_API_KEY=sk-...');
    }
    
    return false;
  }
}

/**
 * Estimar custo de processamento
 */
export function estimateCost(textCount: number, avgLength: number = 500): void {
  const totalChars = textCount * avgLength;
  const totalTokens = Math.ceil(totalChars / 4); // Aproximação: 4 chars = 1 token
  
  // Preços OpenAI (text-embedding-3-small)
  const costPer1KTokens = 0.00002; // $0.00002 por 1K tokens
  const estimatedCost = (totalTokens / 1000) * costPer1KTokens;
  
  console.log('\n💰 Estimated Cost:');
  console.log(`   Texts: ${textCount}`);
  console.log(`   Avg length: ${avgLength} chars`);
  console.log(`   Est. tokens: ${totalTokens.toLocaleString()}`);
  console.log(`   Est. cost: $${estimatedCost.toFixed(4)} USD`);
  console.log('');
}