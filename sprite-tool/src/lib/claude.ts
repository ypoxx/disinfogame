// ===========================================
// OPENAI API INTEGRATION
// Prompt-Verbesserung mit Spiel-Kontext
// ===========================================

import OpenAI from 'openai';
import type { AssetType, ImprovePromptResponse } from '@/types';

// Client wird server-side initialisiert
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY nicht konfiguriert. Bitte in .env.local eintragen.');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `Du bist ein Experte für Bild-KI-Prompts, spezialisiert auf Pixel-Art für Retro-Spiele.

DEINE AUFGABE:
1. Verbessere den User-Prompt für optimale Ergebnisse mit Nano Banana Pro (Google's Bild-KI)
2. Füge technische Details hinzu (Auflösung, Transparenz, Stil, Perspektive)
3. Behalte den Sowjet-Brutalismus-Stil des Spiels bei
4. Schlage 3-4 Variationen/Verbesserungen vor

SPIEL-KONTEXT:
- Strategie-Spiel über Desinformationskampagnen
- Ästhetik: Sowjet-Brutalismus der 1970er-80er
- Farben: Gedeckte Töne (Grau, Olive, Rost), Akzente in Sowjet-Rot
- Stil: 16-bit Pixel-Art (SNES-Ära)
- Atmosphäre: Bürokratisch, klaustrophobisch, kalt

ANTWORT-FORMAT (JSON):
{
  "improvedPrompt": "Der verbesserte, technisch präzise Prompt auf Englisch",
  "suggestions": ["Vorschlag 1", "Vorschlag 2", "Vorschlag 3"],
  "technicalNotes": "Kurze Erklärung der Änderungen"
}`;

export async function improvePrompt(
  userPrompt: string,
  assetType: AssetType,
  gameContext: string,
  additionalContext?: string
): Promise<ImprovePromptResponse> {
  const openai = getClient();

  const assetTypeInfo = {
    sprite: 'Sprite-Sheet mit mehreren Frames für Animation',
    scene: 'Hintergrund-Szene / Raum',
    element: 'Einzelnes Element / Möbelstück / Prop',
  };

  const userMessage = `
ASSET-TYP: ${assetTypeInfo[assetType]}

USER-PROMPT: "${userPrompt}"

${additionalContext ? `ZUSÄTZLICHER KONTEXT: ${additionalContext}` : ''}

STIL-GUIDE DES SPIELS:
${gameContext}

Bitte verbessere den Prompt und gib deine Antwort als JSON zurück.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    response_format: { type: 'json_object' },
  });

  // Extract text content
  const textContent = response.choices[0]?.message?.content;
  if (!textContent) {
    throw new Error('Keine Text-Antwort von OpenAI erhalten');
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(textContent) as ImprovePromptResponse;
    return {
      improvedPrompt: parsed.improvedPrompt || userPrompt,
      suggestions: parsed.suggestions || [],
      technicalNotes: parsed.technicalNotes || '',
    };
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    // Fallback: return original prompt
    return {
      improvedPrompt: userPrompt,
      suggestions: [],
      technicalNotes: 'Fehler beim Parsen der OpenAI-Antwort',
    };
  }
}
