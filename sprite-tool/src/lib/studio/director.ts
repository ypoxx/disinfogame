// ===========================================
// REGIE-ASSISTENT — Client-Wrapper (+ deterministische Fallbacks)
// ===========================================
// Spricht /api/director (Claude). WICHTIG: Wenn kein Claude-Key da ist oder der
// Aufruf scheitert, liefern die Fallbacks weiterhin brauchbare Prompts — das
// Studio bleibt benutzbar (Generieren/Slicen/Export hängen NICHT an Claude).

import { keyHeaders } from '../keys';
import { buildAnchor, type StyleBible } from './bible';
import { describeNpc, npcById, type GameConcept } from './concept';
import type { Shot } from './shots';
import type {
  ChatMessage,
  ChatResult,
  CritiqueResult,
  ShotPromptResult,
  StyleDirectionDraft,
} from './directorTypes';

async function postDirector<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/director', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...keyHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Regie-Assistent fehlgeschlagen (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}

/** Kompakter Konzept-Überblick als Text für Claude (statt roher JSON-Dumps). */
export function conceptSummary(concept: GameConcept): string {
  const floors = concept.floors
    .map((f) => {
      const rooms = concept.rooms
        .filter((r) => r.floor === f.id)
        .map((r) => {
          const npc = npcById(concept, r.npcId);
          return `${r.label_de}${npc ? ` (${npc.name}, ${npc.role_de ?? ''})` : ''}`;
        })
        .join('; ');
      return `- ${f.label_de}: ${rooms || '—'}`;
    })
    .join('\n');
  const npcs = concept.npcs.map((n) => `- ${describeNpc(n)}`).join('\n');
  return `GEBÄUDE (${concept.floors.length} Etagen, ${concept.rooms.length} Räume):\n${floors}\n\nPERSONEN:\n${npcs}`;
}

export async function styleDirections(
  concept: GameConcept,
  brief: string,
  count = 3
): Promise<StyleDirectionDraft[]> {
  const data = await postDirector<{ directions: StyleDirectionDraft[] }>({
    task: 'style-directions',
    brief,
    styleGuide: concept.styleGuide,
    conceptSummary: conceptSummary(concept),
    count,
  });
  return data.directions ?? [];
}

export async function shotPrompt(
  concept: GameConcept,
  bible: StyleBible,
  shot: Shot,
  notes: string
): Promise<ShotPromptResult> {
  const npc = shot.subjectId ? npcById(concept, shot.subjectId) : undefined;
  return postDirector<ShotPromptResult>({
    task: 'shot-prompt',
    anchor: buildAnchor(bible),
    styleGuide: concept.styleGuide,
    shot: { id: shot.id, kind: shot.kind, title: shot.title, brief: shot.brief },
    subject: npc ? { name: npc.name, role: npc.role_de, traits: npc.personality?.traits } : undefined,
    notes,
  });
}

export async function critiqueVariants(
  bible: StyleBible,
  subject: string,
  thumbsBase64: string[]
): Promise<CritiqueResult> {
  return postDirector<CritiqueResult>({
    task: 'critique',
    anchor: buildAnchor(bible),
    subject,
    images: thumbsBase64,
  });
}

export async function directorChat(
  context: string,
  messages: ChatMessage[]
): Promise<ChatResult> {
  return postDirector<ChatResult>({ task: 'chat', context, messages });
}

// ----- Deterministische Fallbacks (ohne Claude) -----

const TECH_BY_KIND: Record<Shot['kind'], string> = {
  walkcycle:
    'Horizontal sprite sheet, 8-frame side-view walk cycle, transparent background, consistent character.',
  character:
    'Full-body character, side or 3/4 view, transparent background, clean readable silhouette.',
  room: 'Background scene / room cross-section, no characters, leave space for clickable hotspots.',
  building: 'Multi-floor building cross-section, schematic but atmospheric.',
  prop: 'Single isolated object/prop, transparent background.',
};

/** Baut ohne Claude einen brauchbaren Prompt aus Bibel + Shot + Konzept. */
export function fallbackPrompt(shot: Shot, concept: GameConcept, bible: StyleBible): string {
  const npc = shot.subjectId ? npcById(concept, shot.subjectId) : undefined;
  const subject = npc ? `${npc.name} — ${npc.role_de ?? ''} (${npc.personality?.traits?.join(', ') ?? ''})` : shot.title;
  return [buildAnchor(bible), '', `SUBJECT: ${subject}`, shot.brief, '', TECH_BY_KIND[shot.kind]]
    .filter(Boolean)
    .join('\n');
}

// ----- Master-Referenzen (Konsistenz) -----

/** Welcher Bibel-Master-Slot passt zu diesem Shot-Typ? */
export function masterSlotForKind(kind: Shot['kind']): string {
  if (kind === 'room' || kind === 'building') return 'room';
  return 'character';
}

/** Library-Keys der Master, die für diesen Shot als Referenz mitgeschickt werden. */
export function referenceKeysForShot(bible: StyleBible, shot: Shot): string[] {
  const slot = masterSlotForKind(shot.kind);
  const key = bible.masters[slot];
  return key ? [key] : [];
}
