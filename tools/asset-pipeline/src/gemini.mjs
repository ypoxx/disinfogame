// ===========================================
// GEMINI-BILDGENERIERUNG (Nano Banana Pro) — Headless
// ===========================================
// Spiegel von sprite-tool/src/lib/nanoBanana.ts (gleiche API-Nutzung, gleiches
// Default-Modell), nur ohne Browser/Next: Key kommt aus GOOGLE_AI_API_KEY.
// Benötigte Netz-Freigabe: generativelanguage.googleapis.com

import { GoogleGenAI } from '@google/genai';

export const DEFAULT_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image';

export function requireGoogleKey() {
  // Beide gängigen Namen akzeptieren (Claude-Code-Umgebungen liefern oft GEMINI_API_KEY).
  const key = (process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY)?.trim();
  if (!key) {
    throw new Error(
      'GOOGLE_AI_API_KEY (oder GEMINI_API_KEY) fehlt. Als Umgebungsvariable setzen (Allowlist: generativelanguage.googleapis.com).'
    );
  }
  return key;
}

let client = null;

function getClient() {
  if (!client) client = new GoogleGenAI({ apiKey: requireGoogleKey() });
  return client;
}

/**
 * Erzeugt genau EIN Bild.
 * @param {{prompt: string, aspectRatio?: string, seed?: number, referenceImagesBase64?: string[]}} options
 * @returns {Promise<{base64: string, mime: string}>}
 */
export async function generateImage(options) {
  const parts = [];
  for (const ref of (options.referenceImagesBase64 ?? []).slice(0, 8)) {
    parts.push({ inlineData: { mimeType: 'image/png', data: ref } });
  }
  parts.push({ text: options.prompt });

  const response = await getClient().models.generateContent({
    model: DEFAULT_IMAGE_MODEL,
    contents: [{ parts }],
    config: {
      responseModalities: ['image', 'text'],
      ...(options.seed !== undefined ? { seed: options.seed } : {}),
      ...(options.aspectRatio ? { imageConfig: { aspectRatio: options.aspectRatio } } : {}),
    },
  });

  const candidate = response.candidates?.[0];
  for (const part of candidate?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      return { base64: part.inlineData.data, mime: part.inlineData.mimeType || 'image/png' };
    }
  }
  throw new Error('Gemini lieferte kein Bild (nur Text/leer).');
}
