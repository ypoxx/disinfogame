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
  overlay?: 'newsroom' | 'fokusgruppe' | 'akte' | 'lagebild' | 'board' | 'broadcast' | 'wahlabend' | null;
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
    case 'broadcast': return 'sfx_amb_wohnzimmer';  // Publikums-Wohnzimmer (warm)
    case 'wahlabend': return 'sfx_amb_tvstudio';    // Wahlabend-TV-Studio (kühl, angespannt)
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

/**
 * Adaptive Musik: Lage bestimmt das Band. Pro Band gibt es MEHRERE gleichwertige
 * Tracks (Pool) → zufällige Auswahl + Rotation, damit man früh hört, dass es
 * verschiedene Musik gibt, und kein Band ein einsamer Loop ist (Klang-Vielfalt,
 * Luxus-Sound). Der Anker-Track (der ursprüngliche einzelne) steht bewusst
 * zuerst → `musicForState` bleibt deterministisch rückwärtskompatibel.
 *
 * Die Zusatz-Tracks sind stilistische Geschwister ihres Ankers (gleiche Klangwelt,
 * Behörden-Akte/Cold-War), keine Stil-Abweichung. Lautheit ist über `musicTrimGain`
 * an den Anker angeglichen (siehe unten), damit die Rotation nicht springt.
 */
export function musicPoolForState(s: { risk: number; gameEnded?: boolean; won?: boolean }): string[] {
  if (s.gameEnded) return s.won ? ['music_victory'] : ['music_tense'];
  if (s.risk >= 66) return ['music_tense', 'music_tense_pursuit', 'music_tense_lockdown'];
  if (s.risk >= 33) return ['music_gameplay', 'music_gameplay_teletype', 'music_gameplay_corridor'];
  // Ruhiges Band: drei Stimmungen im selben Stil.
  return ['music_calm_archive', 'music_night_city', 'music_calm_dossier'];
}

/** Einzeltrack (deterministisch = erstes Pool-Element = Anker). Rückwärtskompatibel/testbar. */
export function musicForState(s: { risk: number; gameEnded?: boolean; won?: boolean }): string {
  return musicPoolForState(s)[0];
}

/**
 * Nicht-destruktive Lautheits-Angleichung je Musik-Track (dB, ≤ 0 = Absenkung).
 *
 * Ersatz für den ffmpeg-`loudnorm`-Schritt, der in Erzeuger-Umgebungen ohne
 * ffmpeg nicht läuft: Die Rohausgabe von ElevenLabs `/music` ist lauter als die
 * (früher auf −18 LUFS normalisierte) Bestandsbibliothek. Statt die mp3 destruktiv
 * neu zu encodieren, senkt der Player jeden Zusatz-Track beim Abspielen um diesen
 * dB-Wert ab, sodass er im gated-RMS auf dem Niveau seines Band-Ankers landet.
 *
 * Werte gemessen mit `scripts/sound-review/measure-loudness.mjs` (Chromium/Web-Audio):
 *   Anker gameplay −21,85 · tense −22,49 · calm-Mittel −22,39 dBFS.
 * Nur Absenkungen → nie Clipping, nie Anheben des Grundrauschens. Anker-Tracks
 * (nicht gelistet) bleiben bei 0 dB unverändert.
 */
export const MUSIC_TRIM_DB: Record<string, number> = {
  music_calm_dossier: -2.4,
  music_gameplay_teletype: -3.8,
  music_gameplay_corridor: -1.5,
  music_tense_pursuit: -4.2,
  music_tense_lockdown: -5.3,
};

/** Linearer Verstärkungsfaktor (0..1) für einen Track; 1 = unverändert. */
export function musicTrimGain(assetId: string | null | undefined): number {
  if (!assetId) return 1;
  const db = MUSIC_TRIM_DB[assetId];
  return db === undefined ? 1 : Math.pow(10, db / 20);
}
