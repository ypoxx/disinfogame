import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';

/**
 * Sprite Studio: Prompt-Verbesserung mit OpenAI
 *
 * POST /api/sprite-improve
 * Body: { userPrompt, assetType, additionalContext? }
 * Headers: x-admin-token (SHA-256 hash of admin PIN)
 */

const ADMIN_TOKEN = '5db1fee4b5703808c48078a76768b155b421b210c0761cd6a5d223f4d99f1eaa';

const SYSTEM_PROMPT = `Du bist ein Experte für Bild-KI-Prompts, spezialisiert auf Pixel-Art für Retro-Spiele.

DEINE AUFGABE:
1. Verbessere den User-Prompt für optimale Ergebnisse mit Google Gemini (Bild-KI)
2. Füge technische Details hinzu (Auflösung, Transparenz, Stil, Perspektive)
3. Behalte den Sowjet-Brutalismus-Stil des Spiels bei
4. Schlage 3-4 Variationen/Verbesserungen vor

SPIEL-KONTEXT:
- Strategie-Spiel über Desinformationskampagnen
- Ästhetik: Sowjet-Brutalismus der 1970er-80er
- Farben: Gedeckte Töne (Grau, Olive, Rost), Akzente in Sowjet-Rot
- Stil: 16-bit Pixel-Art (SNES-Ära)
- Atmosphäre: Bürokratisch, klaustrophobisch, kalt

FARBPALETTE:
- Beton-Grau: #6B7280, #9CA3AF
- Militär-Olive: #4A5D23, #6B8E23
- Rost-Braun: #8B4513, #A0522D
- Sowjet-Rot: #B22234 (Akzente)
- Neon-Grün: #00FF00 (Monitore)

ANTWORT-FORMAT (JSON):
{
  "improvedPrompt": "Der verbesserte, technisch präzise Prompt auf Englisch",
  "suggestions": ["Vorschlag 1", "Vorschlag 2", "Vorschlag 3"],
  "technicalNotes": "Kurze Erklärung der Änderungen"
}`;

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY nicht konfiguriert');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
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

  // Auth check
  const token = event.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'OPENAI_API_KEY nicht konfiguriert. Bitte im Netlify Dashboard unter Site Settings → Environment Variables eintragen.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { userPrompt, assetType, additionalContext } = body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'userPrompt ist erforderlich' }) };
    }

    if (!assetType || !['sprite', 'scene', 'element'].includes(assetType)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'assetType muss sprite, scene oder element sein' }) };
    }

    const assetTypeInfo: Record<string, string> = {
      sprite: 'Sprite-Sheet mit mehreren Frames für Animation',
      scene: 'Hintergrund-Szene / Raum',
      element: 'Einzelnes Element / Möbelstück / Prop',
    };

    const userMessage = `ASSET-TYP: ${assetTypeInfo[assetType]}

USER-PROMPT: "${userPrompt}"

${additionalContext ? `ZUSÄTZLICHER KONTEXT: ${additionalContext}` : ''}

Bitte verbessere den Prompt und gib deine Antwort als JSON zurück.`;

    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error('Keine Antwort von OpenAI erhalten');
    }

    const parsed = JSON.parse(textContent);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        improvedPrompt: parsed.improvedPrompt || userPrompt,
        suggestions: parsed.suggestions || [],
        technicalNotes: parsed.technicalNotes || '',
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';

    if (message.includes('API_KEY') || message.includes('401')) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'OpenAI API Key ungültig' }) };
    }

    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
};

export { handler };
