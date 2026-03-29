import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

/**
 * Sprite Studio: Inpainting mit Google Gemini
 *
 * POST /api/sprite-inpaint
 * Body: { image (base64), mask? (base64), prompt }
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
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GOOGLE_AI_API_KEY nicht konfiguriert' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { image, mask, prompt } = body;

    if (!image || typeof image !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'image (base64) ist erforderlich' }) };
    }
    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'prompt ist erforderlich' }) };
    }

    const client = getClient();
    const modelName = process.env.NANO_BANANA_MODEL || 'gemini-2.0-flash-exp';

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    // Original image
    parts.push({ inlineData: { mimeType: 'image/png', data: image } });

    // Mask + prompt
    if (mask) {
      parts.push({ inlineData: { mimeType: 'image/png', data: mask } });
      parts.push({ text: `Edit the masked area of the image: ${prompt}. Keep everything outside the mask exactly as it is.` });
    } else {
      parts.push({ text: `Edit this image: ${prompt}. Keep everything else exactly as it is.` });
    }

    const response = await client.models.generateContent({
      model: modelName,
      contents: [{ parts }],
      config: { responseModalities: ['image', 'text'] },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if ('inlineData' in part && part.inlineData?.data) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ image: part.inlineData.data }),
          };
        }
      }
    }

    throw new Error('Kein Bild vom Inpainting erhalten');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';

    if (message.includes('API_KEY') || message.includes('401') || message.includes('403')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Google AI API Key ungültig' }) };
    }

    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
};

export { handler };
