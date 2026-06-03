// ===========================================
// BILD-GENERIERUNG — schlanker Client-Helfer
// ===========================================
// Eine Stelle für /api/generate (Gemini), genutzt von Stil-Findung & Shot-Workspace.

import { keyHeaders } from '../keys';

export interface GenerateOptions {
  prompt: string;
  numImages?: number;
  aspectRatio?: string;
  seed?: number;
  referenceImages?: string[]; // Base64 ohne Präfix (Master-Referenzen)
}

export interface GenerateResult {
  images: { base64: string; seed?: number }[];
  errors?: string[];
}

export async function generate(opts: GenerateOptions): Promise<GenerateResult> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...keyHeaders() },
    body: JSON.stringify(opts),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Generierung fehlgeschlagen (HTTP ${res.status})`);
  }
  return (await res.json()) as GenerateResult;
}
