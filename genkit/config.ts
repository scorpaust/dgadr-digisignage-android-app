import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import path from 'path';

// Inicializar Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
initializeApp({
  credential: cert(path.resolve(serviceAccountPath)),
});

// Initialize Firestore with REST to avoid gRPC/Long serialization issues
export const db = getFirestore();
db.settings({ preferRest: true });

// Configurar Genkit
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
});
