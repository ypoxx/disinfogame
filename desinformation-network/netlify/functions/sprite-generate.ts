import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

/**
 * Sprite Studio: Bildgenerierung mit Google Gemini
 *
 * POST /api/sprite-generate
 * Body: { prompt, aspectRatio?, numImages?, seed?, referenceImages? }
 * Headers: x-admin-token (SHA-256 hash of admin PIN)
 */

const ADMIN_TOKEN = '5db1fee4b5703808c48078a76768b155b421b210c0761cd6a5d223f4d99f1eaa';

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY nicht konfiguriert');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = event.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GOOGLE_AI_API_KEY nicht konfiguriert. Bitte im Netlify Dashboard unter Site Settings → Environment Variables eintragen.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { prompt, referenceImages, seed } = body;
    // Default to 2 images (Netlify has 26s timeout, sequential generation)
    const numImages = Math.min(Math.max(body.numImages || 2, 1), 4);

    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'prompt ist erforderlich' }) };
    }

    const client = getClient();
    const modelName = process.env.NANO_BANANA_MODEL || 'gemini-2.0-flash-exp';

    const results: { base64: string; seed?: number }[] = [];
    const errors: string[] = [];

    for (let i = 0; i < numImages; i++) {
      try {
        const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

        // Reference images
        if (referenceImages?.length) {
          for (const refImg of referenceImages.slice(0, 4)) {
            parts.push({ inlineData: { mimeType: 'image/png', data: refImg } });
          }
        }

        parts.push({ text: prompt });

        const response = await client.models.generateContent({
          model: modelName,
          contents: [{ parts }],
          config: { responseModalities: ['image', 'text'] },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if ('inlineData' in part && part.inlineData?.data) {
              results.push({ base64: part.inlineData.data, seed });
              break;
            }
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unbekannter Fehler';
        errors.push(`Variante ${i + 1}: ${msg}`);
      }
    }

    if (results.length === 0) {
      throw new Error(`Keine Bilder generiert. Fehler: ${errors.join('; ')}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        images: results,
        errors: errors.length > 0 ? errors : undefined,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';

    if (message.includes('API_KEY') || message.includes('401') || message.includes('403')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Google AI API Key ungültig' }) };
    }
    if (message.includes('429') || message.includes('rate')) {
      return { statusCode: 429, headers, body: JSON.stringify({ error: 'Rate Limit erreicht. Bitte warte einen Moment.' }) };
    }

    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
};

export { handler };
