// ===========================================
// VOICE-CASTING — feste Stimme je NPC (persistiert)
// ===========================================
// Alex' Wunsch: einmalig erzeugte, STABILE Stimmen pro Person. Wir merken uns
// pro NPC eine feste voice_id; TTS-Zeilen werden damit reproduzierbar erzeugt.

import { kvGet, kvSet } from './db';

const KEY = 'voiceCasting';

/** npcId → ElevenLabs voice_id */
export type VoiceCasting = Record<string, string>;

export async function loadCasting(): Promise<VoiceCasting> {
  const raw = await kvGet(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as VoiceCasting;
  } catch {
    return {};
  }
}

export async function saveCasting(casting: VoiceCasting): Promise<void> {
  await kvSet(KEY, JSON.stringify(casting));
}
