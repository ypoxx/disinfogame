/**
 * soundDirector — pure Zuordnung von Spielzustand → Klang (testbar, ohne Audio-API).
 *
 * Zwei Entscheidungen aus DECISIONS_2026-06-13B (J34/J35 adaptive Musik, J36
 * Raum-Kulissen) als reine Funktionen; die Verdrahtung (playMusic/playAmbience)
 * passiert in StoryModeGame über useEffects.
 */

/** Kontext für die Raum-Klangkulisse: Overlay hat Vorrang, dann Gespräch, dann Ansicht. */
export interface AmbienceContext {
  viewMode: 'building' | 'office';
  dialogNpcId?: string | null;
  overlay?: 'newsroom' | 'fokusgruppe' | 'akte' | 'lagebild' | 'board' | null;
  /** Nur im laufenden Spiel klingt es; sonst Stille. */
  active?: boolean;
}

const AMBIENCE_BY_NPC: Record<string, string> = {
  direktor: 'sfx_amb_zentrale',
  alexei: 'sfx_amb_cyber',
  marina: 'sfx_amb_newsroom',
  katja: 'sfx_amb_buero',
  igor: 'sfx_amb_keller',
};

/** Passende Raum-Kulisse (Asset-id) oder null = Stille. */
export function ambienceForContext(ctx: AmbienceContext): string | null {
  if (ctx.active === false) return null;
  switch (ctx.overlay) {
    case 'newsroom': return 'sfx_amb_newsroom';
    case 'fokusgruppe': return 'sfx_amb_zentrale'; // Einwegspiegel-Beobachtungsraum
    case 'akte': return 'sfx_amb_cyber';           // Operationszentrale (Technik-Brummen)
    case 'lagebild':
    case 'board':
    case null:
    case undefined:
      break;
  }
  if (ctx.dialogNpcId) return AMBIENCE_BY_NPC[ctx.dialogNpcId] ?? 'sfx_amb_buero';
  if (ctx.viewMode === 'office') return 'sfx_amb_buero';
  return 'sfx_amb_lobby'; // Gebäude-Übersicht: dezenter Hallen-Ton
}

/** Adaptive Musik: Lage bestimmt den Loop (heller → düster, Ende → Sieg/Spannung). */
export function musicForState(s: { risk: number; gameEnded?: boolean; won?: boolean }): string {
  if (s.gameEnded) return s.won ? 'music_victory' : 'music_tense';
  if (s.risk >= 66) return 'music_tense';
  if (s.risk >= 33) return 'music_gameplay';
  return 'music_calm_archive';
}
