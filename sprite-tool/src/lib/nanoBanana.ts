// ===========================================
// NANO BANANA PRO API INTEGRATION
// Google's Gemini Image Generation
// ===========================================

import { GoogleGenAI } from '@google/genai';
import type { GenerateImageResponse, InpaintResponse } from '@/types';
import { DEFAULT_IMAGE_MODEL, type AspectRatio } from '@/lib/constants';

let envClient: GoogleGenAI | null = null;

/**
 * Liefert einen Gemini-Client. Ein per-Request übergebener Key (aus der Tool-UI)
 * hat Vorrang. Der .env-Fallback (GOOGLE_AI_API_KEY) gilt BEWUSST nur lokal:
 * In Produktion liegt /api nicht hinter dem Seiten-Passwort (siehe proxy.ts),
 * also darf es ohne UI-Key nichts tun — ein Server-Key wäre sonst öffentlich
 * nutzbar. Daher wird der Env-Fallback im Production-Build hart deaktiviert.
 */
function getClient(apiKey?: string): GoogleGenAI {
  if (apiKey) {
    return new GoogleGenAI({ apiKey });
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Kein Google-AI-Key: bitte in der Tool-UI unter ⚙️ Einstellungen eingeben.');
  }
  if (!envClient) {
    const envKey = process.env.GOOGLE_AI_API_KEY;
    if (!envKey) {
      throw new Error(
        'Kein Google-AI-Key: in der UI (Einstellungen) eingeben oder GOOGLE_AI_API_KEY in .env.local setzen.'
      );
    }
    envClient = new GoogleGenAI({ apiKey: envKey });
  }
  return envClient;
}


interface GenerateOptions {
  prompt: string;
  referenceImages?: string[]; // base64 encoded
  aspectRatio?: AspectRatio;
  thinkingMode?: boolean;
  seed?: number;
  numImages?: number;
  apiKey?: string; // optionaler UI-Key; sonst .env.local
}

/**
 * Generiert Bilder mit Nano Banana Pro (Gemini Image)
 */
export async function generateImages(options: GenerateOptions): Promise<GenerateImageResponse> {
  const client = getClient(options.apiKey);

  const modelName = process.env.NANO_BANANA_MODEL || DEFAULT_IMAGE_MODEL;
  const numImages = Math.min(options.numImages || 4, 4); // Max 4 Bilder

  const results: { base64: string; seed?: number }[] = [];
  const errors: string[] = [];

  // Generiere Bilder sequentiell (API-Limit)
  for (let i = 0; i < numImages; i++) {
    try {
      // Seed je Variante versetzen: gleicher Basis-Seed → reproduzierbares Set,
      // aber die einzelnen Varianten unterscheiden sich (sonst wären alle identisch).
      const seedForImage = options.seed !== undefined ? options.seed + i : undefined;

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      // Referenz-Bilder hinzufügen (falls vorhanden)
      if (options.referenceImages?.length) {
        for (const refImg of options.referenceImages.slice(0, 8)) {
          parts.push({
            inlineData: {
              mimeType: 'image/png',
              data: refImg,
            },
          });
        }
      }

      // Prompt hinzufügen
      parts.push({ text: options.prompt });

      const response = await client.models.generateContent({
        model: modelName,
        contents: [{ parts }],
        config: {
          responseModalities: ['image', 'text'],
          // Seed an die API durchreichen (war zuvor nur UI-Feld, ohne Wirkung).
          ...(seedForImage !== undefined ? { seed: seedForImage } : {}),
          // Seitenverhältnis via ImageConfig an Nano Banana Pro durchreichen.
          ...(options.aspectRatio ? { imageConfig: { aspectRatio: options.aspectRatio } } : {}),
        },
      });

      // Extrahiere Bild aus Response
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if ('inlineData' in part && part.inlineData?.data) {
            results.push({
              base64: part.inlineData.data,
              seed: seedForImage,
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Fehler bei Bildgenerierung ${i + 1}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      errors.push(`Variante ${i + 1}: ${errorMessage}`);
    }
  }

  if (results.length === 0) {
    throw new Error('Keine Bilder konnten generiert werden');
  }

  return { images: results, errors: errors.length > 0 ? errors : undefined };
}

interface InpaintOptions {
  image: string; // base64
  mask?: string; // base64 (optional für mask-free inpainting)
  prompt: string;
  apiKey?: string; // optionaler UI-Key; sonst .env.local
}

/**
 * Inpainting: Ändert nur markierte Bereiche eines Bildes
 */
export async function inpaintImage(options: InpaintOptions): Promise<InpaintResponse> {
  const client = getClient(options.apiKey);

  const modelName = process.env.NANO_BANANA_MODEL || DEFAULT_IMAGE_MODEL;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Original-Bild
  parts.push({
    inlineData: {
      mimeType: 'image/png',
      data: options.image,
    },
  });

  // Maske (falls vorhanden)
  if (options.mask) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: options.mask,
      },
    });
    parts.push({
      text: `Edit the masked area of the image: ${options.prompt}. Keep everything outside the mask exactly as it is.`,
    });
  } else {
    // Mask-free inpainting
    parts.push({
      text: `Edit this image: ${options.prompt}. Keep everything else exactly as it is.`,
    });
  }

  const response = await client.models.generateContent({
    model: modelName,
    contents: [{ parts }],
    config: {
      responseModalities: ['image', 'text'],
    },
  });

  // Extrahiere Bild aus Response
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if ('inlineData' in part && part.inlineData?.data) {
        return { image: part.inlineData.data };
      }
    }
  }

  throw new Error('Kein Bild vom Inpainting erhalten');
}

/**
 * Echter Auth-Check für den Google-AI-Key: holt die erste Seite der Modell-Liste.
 * Das macht eine echte (kostenlose) Anfrage — bei ungültigem Key wirft sie.
 */
export async function testConnection(apiKey?: string): Promise<boolean> {
  try {
    const client = getClient(apiKey);
    await client.models.list({ config: { pageSize: 1 } });
    return true;
  } catch {
    return false;
  }
}
