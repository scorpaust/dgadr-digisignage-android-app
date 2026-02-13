import * as functions from 'firebase-functions';
import { onFlow } from '@genkit-ai/firebase/functions';
import { queryRAGFlow, ingestPDFsFlow } from './index';

// Expor como Cloud Function
export const chatQuery = onFlow(queryRAGFlow);
export const ingestDocuments = onFlow(ingestPDFsFlow);

// Ou criar HTTP endpoint
export const chat = functions.https.onRequest(async (req, res) => {
  const { query } = req.body;
  
  const result = await queryRAGFlow({ query });
  
  res.json(result);
});