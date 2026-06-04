// ===========================================
// REGIE-ASSISTENT — Server (Claude)
// ===========================================
// Nur serverseitig (importiert das Anthropic-SDK). Nutzt die gehärtete
// Client-Erzeugung aus lib/claude.ts (Prod erzwingt UI-Key). Multimodal bei
// der Varianten-Kritik: Claude SIEHT die generierten Bilder und bewertet sie
// gegen die Stil-Bibel.

import type Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient } from '../claude';
import { DEFAULT_CLAUDE_MODEL } from '../constants';
import type {
  ChatMessage,
  ChatResult,
  CritiqueResult,
  ShotPromptResult,
  StyleDirectionDraft,
  VoiceCastSuggestion,
} from './directorTypes';

function model(): string {
  return process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL;
}

function textOf(resp: Anthropic.Messages.Message): string {
  const block = resp.content.find((b) => b.type === 'text');
  return block && block.type === 'text' ? block.text : '';
}

/** Extrahiert robust das erste JSON-Objekt/Array aus einem Text. */
function parseJson<T>(text: string): T | null {
  const match = text.match(/[[{][\s\S]*[\]}]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

function clip(s: string, max = 6000): string {
  return s.length > max ? s.slice(0, max) + '\n…(gekürzt)' : s;
}

export async function proposeStyleDirections(input: {
  brief: string;
  styleGuide: string;
  conceptSummary: string;
  count: number;
  apiKey?: string;
}): Promise<StyleDirectionDraft[]> {
  const client = getAnthropicClient(input.apiKey);
  const count = Math.min(Math.max(input.count || 3, 2), 4);
  const system = `Du bist Art Director für ein narratives Strategiespiel über eine Desinformations-Agentur (Kalter-Krieg-Bürokratie, Medien, Paranoia).
Schlage ${count} DEUTLICH UNTERSCHIEDLICHE visuelle Richtungen vor — nicht nur Varianten derselben Idee.
Für jede: prägnanter Name, Mood, Palette (6–9 Hex-Farben mit Namen), Do's, Don'ts, eine kurze Begründung WARUM es zu Desinfo/Bürokratie/70er-Medien passt (und Risiken), sowie EIN fertiger Bild-Prompt für DASSELBE Testmotiv über alle Richtungen: „Marina Petrova (Medien-Spezialistin) an ihrem Schreibtisch im Medien-Zentrum".
Prosa-Felder (mood, dos, donts, rationale) auf DEUTSCH; samplePrompt auf ENGLISCH (Bild-KI versteht Englisch besser) und MIT der jeweiligen Palette/Mood angereichert.
Antworte NUR mit JSON: {"directions":[{"name","mood","palette":[{"name","hex"}],"dos":[],"donts":[],"rationale","samplePrompt"}]}`;
  const user = `AKTUELLER STIL-GUIDE (Referenz/Ausgangspunkt):\n${clip(input.styleGuide)}\n\nSPIEL-KONZEPT:\n${input.conceptSummary}\n\nBRIEF/WUNSCH VON ALEX:\n${input.brief || '(kein zusätzlicher Wunsch — explorier frei, inkl. einer mutigen Alternative zum Brutalismus)'}`;

  const resp = await client.messages.create({
    model: model(),
    max_tokens: 3000,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const parsed = parseJson<{ directions: StyleDirectionDraft[] }>(textOf(resp));
  return parsed?.directions ?? [];
}

export async function writeShotPrompt(input: {
  anchor: string;
  styleGuide: string;
  shot: { id: string; kind: string; title: string; brief: string };
  subject?: { name?: string; role?: string; traits?: string[] };
  notes: string;
  apiKey?: string;
}): Promise<ShotPromptResult> {
  const client = getAnthropicClient(input.apiKey);
  const system = `Du bist Art Director und schreibst EINEN exzellenten Bild-Prompt für Nano Banana (Gemini 3 Pro Image).
Halte dich strikt an den STYLE ANCHOR (Konsistenz!). Der Prompt ist auf ENGLISCH, technisch präzise (Perspektive, Hintergrund/Transparenz, Komposition), OHNE eingebauten Text in der Grafik.
Gib zusätzlich eine kurze DEUTSCHE Begründung und eine snake_case-id (a-z,0-9,_) als Vorschlag.
Antworte NUR mit JSON: {"prompt","rationale","suggestedId"}`;
  const subj = input.subject
    ? `SUBJEKT: ${input.subject.name ?? ''} — ${input.subject.role ?? ''} (${(input.subject.traits ?? []).join(', ')})`
    : '';
  const user = `${input.anchor}\n\nSTIL-GUIDE (Auszug):\n${clip(input.styleGuide, 3500)}\n\nSHOT: ${input.shot.title} [${input.shot.kind}]\nBESCHREIBUNG: ${input.shot.brief}\n${subj}\n\nZUSATZ-WÜNSCHE: ${input.notes || '(keine)'}`;

  const resp = await client.messages.create({
    model: model(),
    max_tokens: 1200,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const parsed = parseJson<ShotPromptResult>(textOf(resp));
  return (
    parsed ?? {
      prompt: '',
      rationale: 'Konnte keine strukturierte Antwort erzeugen.',
      suggestedId: input.shot.id.replace(/[^a-z0-9]+/gi, '_').toLowerCase(),
    }
  );
}

export async function critiqueVariants(input: {
  anchor: string;
  subject: string;
  images: string[]; // Base64-Thumbnails (PNG)
  apiKey?: string;
}): Promise<CritiqueResult> {
  const client = getAnthropicClient(input.apiKey);
  const system = `Du bist Art Director. Bewerte die gezeigten Varianten für dasselbe Motiv GEGEN den STYLE ANCHOR.
Sei konkret (Palette-Treue, Linienstärke, Stimmung, Lesbarkeit, Konsistenz). Stelle Alex 1–3 gezielte Rückfragen, um die nächste Iteration zu schärfen.
Antworte NUR mit JSON (alles DEUTSCH): {"perVariant":[{"index","score","note"}],"bestIndex","questions":[],"summary"}. index = 0-basiert, score 0–100.`;
  const content: Anthropic.Messages.ContentBlockParam[] = [];
  input.images.slice(0, 6).forEach((b64, i) => {
    content.push({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: b64 } });
    content.push({ type: 'text', text: `^ Variante #${i}` });
  });
  content.push({
    type: 'text',
    text: `${input.anchor}\n\nMOTIV: ${input.subject}\n\nBewerte die ${Math.min(input.images.length, 6)} Varianten oben.`,
  });

  const resp = await client.messages.create({
    model: model(),
    max_tokens: 1500,
    system,
    messages: [{ role: 'user', content }],
  });
  const parsed = parseJson<CritiqueResult>(textOf(resp));
  return (
    parsed ?? { perVariant: [], bestIndex: 0, questions: [], summary: 'Keine strukturierte Bewertung erhalten.' }
  );
}

export async function suggestVoiceCast(input: {
  npc: { name: string; role?: string; traits?: string[] };
  voices: { voice_id: string; name: string; labels?: Record<string, string>; category?: string }[];
  apiKey?: string;
}): Promise<VoiceCastSuggestion> {
  const client = getAnthropicClient(input.apiKey);
  const voiceList = input.voices
    .slice(0, 60)
    .map(
      (v) =>
        `- ${v.name} [${v.voice_id}]${v.category ? ` (${v.category})` : ''}${
          v.labels ? ` ${Object.values(v.labels).join('/')}` : ''
        }`
    )
    .join('\n');
  const system = `Du bist Casting-Regisseur für ein Spiel (Kalter-Krieg-Bürokratie, deutsche Sprache). Wähle aus der Liste die EINE Stimme, die am besten zur Figur passt. Antworte NUR mit JSON: {"voiceId","voiceName","rationale"} (rationale kurz, deutsch). voiceId MUSS exakt eine [voice_id] aus der Liste sein.`;
  const user = `FIGUR: ${input.npc.name} — ${input.npc.role ?? ''} (${(input.npc.traits ?? []).join(', ')})\n\nVERFÜGBARE STIMMEN:\n${voiceList}`;
  const resp = await client.messages.create({
    model: model(),
    max_tokens: 500,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return parseJson<VoiceCastSuggestion>(textOf(resp)) ?? { voiceId: '', voiceName: '', rationale: 'Keine Empfehlung erhalten.' };
}

export async function chatTurn(input: {
  context: string;
  messages: ChatMessage[];
  apiKey?: string;
}): Promise<ChatResult> {
  const client = getAnthropicClient(input.apiKey);
  const system = `Du bist der Art-Director-Assistent für dieses Spiel. Du kennst das Konzept (unten). Sei konkret, ehrlich, knapp; mach Vorschläge statt nur zu fragen. Antworte auf Deutsch.\n\nKONTEXT:\n${clip(input.context, 4000)}`;
  const msgs: Anthropic.Messages.MessageParam[] = input.messages
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));
  const resp = await client.messages.create({
    model: model(),
    max_tokens: 1024,
    system,
    messages: msgs.length ? msgs : [{ role: 'user', content: 'Hallo' }],
  });
  return { reply: textOf(resp) || '(keine Antwort)' };
}
