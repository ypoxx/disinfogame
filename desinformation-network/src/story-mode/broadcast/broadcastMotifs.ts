/**
 * broadcastMotifs — die gepflegte Ereignis→Motiv-Tabelle des Ministeriums-Fernsehers.
 * =================================================================================
 * Owner-Entscheidung 2026-07-06 (MINISTRY_BROADCAST_CONCEPT.md §7, BINDEND): jedes
 * wichtige Ereignis bekommt ein EIGENES Pixel-Art-Bild bzw. eine Mini-Animation im
 * Fernseher — nicht nur eine Textzeile. Diese Datei ist die EINE gepflegte Zuordnung
 * (Diskussionspunkt §5.2 „erst Mapping-Tabelle, später in die Aktions-Daten").
 *
 * Reine Daten + reine Funktionen (Muster MaschenGedaechtnis): kein React, kein
 * Math.random, voll testbar. Die Anzeige-Schicht (BroadcastBar) rendert das Motiv als
 * statisches Pixel-Art-Bild mit CSS-Mini-Animation (`motion`: Krisen-Puls/Störbild-
 * Flackern/Sirene — die Owner-genannten Loops). Genuine mehrframige Sheets (useSprite/
 * PixelSprite) sind das nächste Inkrement: die Asset-Pipeline montiert Sheets nur aus
 * Chroma-Subjekten (repackSheet), nicht aus Vollbild-Szenen — dafür braucht sie erst
 * einen Frame-Montage-Helfer (dokumentiert im HANDOFF).
 *
 * Granularität (Owner „je Kanal/Masche/Tier"): TV-Maßnahmen tragen das Motiv der
 * MASCHE (18 Familien → 6 sichtbar unterschiedliche Archetypen), Presse/Netz tragen
 * ihr KANAL-Format je TIER, und die Sondersendung übernimmt bei GROSS-Wirkung. So
 * variiert das Bild entlang aller drei Achsen ohne 18×3×3-Kombinatorik.
 *
 * E35: kein gebackener Text, keine realen Staatssymbole — die Motive sind abstrakt
 * (Kritzel statt Buchstaben), die Beschriftung bleibt Engine-Ebene (`caption_de`).
 */
import type { Channel } from '../audience/audienceModel';
import disinfoMethods from '../data/disinfo_methods.json';
import { methodFamilyForTags, type MethodFamilyRef } from '../engine/ImmuneSystem';

/** Wirkungs-Treppe (Konzept §4): klein / mittel / groß. */
export type BroadcastTier = 'klein' | 'mittel' | 'gross';

/**
 * Ereignis-Klasse einer Sendung (Konzept §3 Format-Palette / §4 Wirkungs-Treppe).
 * Bestimmt zusammen mit Kanal/Tier/Masche das Motiv.
 */
export type BroadcastCategory =
  | 'massnahme' // ausgespielte eigene Maßnahme (Motiv über motifForMeasure)
  | 'gegenreaktion' // gescheiterte Maßnahme = öffentlicher Rückschlag (Leserbrief/Zweifel)
  | 'faktencheck' // Gegenseite kontert sichtbar (Faktencheck-Banner)
  | 'krise' // Krise / Weltereignis (Sondersendung)
  | 'enttarnung' // die Operation fliegt auf
  | 'wahltag' // Wahlabend / Auszählung
  | 'wochenschau'; // Phasen-Ende: Zusammenschau der Sendungen

/** 18 Maschen-Familien → 6 sichtbar unterschiedliche TV-Archetypen (die „je Masche"-Achse). */
export type MascheArchetype =
  | 'bots' // koordiniertes Verhalten, Bot-Schwärme, Plattform-Spiel
  | 'fake' // Fälschung/Deepfake/Klon-/Pseudo-Experten
  | 'spaltung' // Emotionalisierung/Spaltung/Gerücht/Erinnerung/Demobilisierung
  | 'kompromat' // Rufmord/Hack-and-Leak/verdeckte Finanzierung/Tarnung
  | 'strasse' // Offline-Mobilisierung/Krisen-Tempo
  | 'firehose'; // Faktencheck untergraben / bezahlte Influencer

/** Alle Motiv-Ids — jede entspricht einem generierten Pipeline-Asset (shotlist.mjs). */
export type BroadcastMotifId =
  // TV-Maßnahmen je Masche (6)
  | 'bc_masche_bots'
  | 'bc_masche_fake'
  | 'bc_masche_spaltung'
  | 'bc_masche_kompromat'
  | 'bc_masche_strasse'
  | 'bc_masche_firehose'
  // Kanal-Formate (Presse/Netz, 4)
  | 'bc_print_notice'
  | 'bc_print_headline'
  | 'bc_social_feed'
  | 'bc_social_viral'
  // Wirkungs-/Ereignis-Formate (7)
  | 'bc_tv_sonder'
  | 'bc_faktencheck'
  | 'bc_krise'
  | 'bc_enttarnung'
  | 'bc_wahltag'
  | 'bc_wochenschau'
  | 'bc_gegenwind';

/** Rahmen + Behandlung des Motivs im Fernseher/der Zeitung. */
export type BroadcastSurface = 'tv' | 'print' | 'social' | 'special';

/**
 * CSS-Mini-Animation über dem statischen Motiv (Owner: „Störbild-Flackern,
 * Krisen-Banner-Puls" — die Wirkungs-Loops sind hier als CSS umgesetzt; genuine
 * mehrframige Sheets sind das nächste Inkrement, s. broadcastMotifs-Kopf/HANDOFF).
 */
export type BroadcastMotion = 'pulse-red' | 'siren' | 'flicker' | 'none';

export interface BroadcastMotif {
  id: BroadcastMotifId;
  /** Asset-Id (images/) — Fallback-Glyph, wenn das Bild (noch) fehlt. */
  assetId: string;
  /** Rahmen/Behandlung: tv/social = Röhre, print = Zeitung, special = Röhre + Effekt. */
  surface: BroadcastSurface;
  /** CSS-Mini-Animation (Puls/Sirene/Störbild-Flackern) über dem statischen Bild. */
  motion: BroadcastMotion;
  /** Diegetische Kurz-Beschriftung (Alt-Text/Untertitel; NIE ins Bild gebacken, E35). */
  caption_de: string;
  /** Emoji/ASCII-Fallback (Projektdisziplin: jedes Bild hat einen Fallback). */
  glyph: string;
}

/**
 * Die gepflegte Motiv-Tabelle. Jeder Eintrag = ein generiertes Asset gleichen Namens.
 * Sheets tragen `animation`; statische Banner tragen `motion` für die CSS-Bewegung.
 */
export const MOTIF_CATALOG: Record<BroadcastMotifId, BroadcastMotif> = {
  // ── TV-Maßnahmen je Masche (statische Szenen mit Scanline) ────────────────────────
  bc_masche_bots: {
    id: 'bc_masche_bots', assetId: 'bc_masche_bots', surface: 'tv', motion: 'none',
    caption_de: 'Wie von selbst: dieselbe Meldung überall zugleich.', glyph: '📱',
  },
  bc_masche_fake: {
    id: 'bc_masche_fake', assetId: 'bc_masche_fake', surface: 'tv', motion: 'none',
    caption_de: 'Ein Beleg taucht auf — täuschend echt.', glyph: '🎭',
  },
  bc_masche_spaltung: {
    id: 'bc_masche_spaltung', assetId: 'bc_masche_spaltung', surface: 'tv', motion: 'none',
    caption_de: 'Zwei Lager, ein Studio — es wird laut.', glyph: '⚡',
  },
  bc_masche_kompromat: {
    id: 'bc_masche_kompromat', assetId: 'bc_masche_kompromat', surface: 'tv', motion: 'none',
    caption_de: 'Ein Umschlag, ein Ruf — beschädigt.', glyph: '🗞️',
  },
  bc_masche_strasse: {
    id: 'bc_masche_strasse', assetId: 'bc_masche_strasse', surface: 'tv', motion: 'none',
    caption_de: 'Von der Timeline auf die Straße.', glyph: '📣',
  },
  bc_masche_firehose: {
    id: 'bc_masche_firehose', assetId: 'bc_masche_firehose', surface: 'tv', motion: 'none',
    caption_de: 'So viel Lärm, dass niemand mehr prüft.', glyph: '🔊',
  },

  // ── Kanal-Formate: Presse / Netz ─────────────────────────────────────────────────
  bc_print_notice: {
    id: 'bc_print_notice', assetId: 'bc_print_notice', surface: 'print', motion: 'none',
    caption_de: 'Eine Randnotiz auf Seite drei.', glyph: '📄',
  },
  bc_print_headline: {
    id: 'bc_print_headline', assetId: 'bc_print_headline', surface: 'print', motion: 'none',
    caption_de: 'Aufmacher — die Schlagzeile trägt unser Thema.', glyph: '📰',
  },
  bc_social_feed: {
    id: 'bc_social_feed', assetId: 'bc_social_feed', surface: 'social', motion: 'none',
    caption_de: 'Der Feed scrollt — unser Beitrag mittendrin.', glyph: '📲',
  },
  bc_social_viral: {
    id: 'bc_social_viral', assetId: 'bc_social_viral', surface: 'social', motion: 'none',
    caption_de: 'Die Kurve kippt nach oben — es geht viral.', glyph: '🚀',
  },

  // ── Wirkungs-/Ereignis-Formate ───────────────────────────────────────────────────
  bc_tv_sonder: {
    id: 'bc_tv_sonder', assetId: 'bc_tv_sonder', surface: 'special', motion: 'pulse-red',
    caption_de: 'Sondersendung — das Programm wird unterbrochen.', glyph: '🚨',
  },
  bc_faktencheck: {
    id: 'bc_faktencheck', assetId: 'bc_faktencheck', surface: 'special', motion: 'flicker',
    caption_de: 'Faktencheck: die Gegenseite hält dagegen.', glyph: '✓',
  },
  bc_krise: {
    id: 'bc_krise', assetId: 'bc_krise', surface: 'special', motion: 'pulse-red',
    caption_de: 'Eilmeldung — eine Lage spitzt sich zu.', glyph: '🔴',
  },
  bc_enttarnung: {
    id: 'bc_enttarnung', assetId: 'bc_enttarnung', surface: 'special', motion: 'siren',
    caption_de: 'Aufgedeckt: die Kampagne hat einen Absender.', glyph: '🔦',
  },
  bc_wahltag: {
    id: 'bc_wahltag', assetId: 'bc_wahltag', surface: 'special', motion: 'none',
    caption_de: 'Wahlabend — die Balken kommen herein.', glyph: '🗳️',
  },
  bc_wochenschau: {
    id: 'bc_wochenschau', assetId: 'bc_wochenschau', surface: 'tv', motion: 'none',
    caption_de: 'Wochenschau: was diese Runde lief.', glyph: '🎞️',
  },
  bc_gegenwind: {
    id: 'bc_gegenwind', assetId: 'bc_gegenwind', surface: 'tv', motion: 'none',
    caption_de: 'Gegenwind — Zweifel an den Berichten.', glyph: '💬',
  },
};

// ── Masche → Archetyp (die „je Masche"-Achse, alle 18 Familien abgedeckt) ────────────
// Quelle des Vokabulars ist der Atlas (disinfo_methods.json); die Familien-Klassifikation
// selbst kommt aus der Engine (methodFamilyForTags), damit Anzeige & Mechanik EIN
// Vokabular teilen. Hier wird nur die zusätzliche Anzeige-Sicht (Familie→Archetyp) gepflegt.
export const FAMILY_ARCHETYPE: Record<string, MascheArchetype> = {
  bot_amplification: 'bots',
  sockpuppets: 'bots',
  platform_gaming: 'bots',
  synthetic_media: 'fake',
  clone_front_media: 'fake',
  fake_experts: 'fake',
  divisive_narratives: 'spaltung',
  rumor_ecology: 'spaltung',
  memory_conflict: 'spaltung',
  demobilization: 'spaltung',
  character_assassination: 'kompromat',
  hack_and_leak: 'kompromat',
  covert_financing: 'kompromat',
  opsec_tradecraft: 'kompromat',
  offline_mobilization: 'strasse',
  crisis_vacuum: 'strasse',
  firehose_undermining: 'firehose',
  paid_influencers: 'firehose',
};

/** Der Atlas als Familien-Referenz für die Engine-Klassifikation (id/label/matchTags). */
const FAMILIES: MethodFamilyRef[] = (
  disinfoMethods.methods as Array<{ id: string; label_de: string; matchTags?: string[] }>
).map((m) => ({ id: m.id, label_de: m.label_de, matchTags: m.matchTags ?? [] }));

const ARCHETYPE_MOTIF: Record<MascheArchetype, BroadcastMotifId> = {
  bots: 'bc_masche_bots',
  fake: 'bc_masche_fake',
  spaltung: 'bc_masche_spaltung',
  kompromat: 'bc_masche_kompromat',
  strasse: 'bc_masche_strasse',
  firehose: 'bc_masche_firehose',
};

/**
 * Aktions-Tags → Maschen-Archetyp. Nutzt die authoritative Engine-Klassifikation
 * (erste Atlas-Familie, deren matchTags treffen) und bildet sie auf den TV-Archetyp
 * ab. Trifft keine Familie, ist „Spaltung" der breite Default (Emotionalisierung).
 */
export function archetypeForTags(tags: string[]): MascheArchetype {
  const fam = methodFamilyForTags(tags, FAMILIES);
  return (fam && FAMILY_ARCHETYPE[fam.id]) ?? 'spaltung';
}

/**
 * Motiv einer ausgespielten Maßnahme (Owner „je Kanal/Masche/Tier"):
 * - Presse → Notiz (klein) / Aufmacher (mittel+groß)
 * - Netz → Feed (klein+mittel) / Viral (groß)
 * - TV → Sondersendung (groß) sonst das Masche-Motiv (klein+mittel)
 */
export function motifForMeasure(channel: Channel, tier: BroadcastTier, tags: string[]): BroadcastMotifId {
  if (channel === 'print') return tier === 'klein' ? 'bc_print_notice' : 'bc_print_headline';
  if (channel === 'social') return tier === 'gross' ? 'bc_social_viral' : 'bc_social_feed';
  // channel === 'tv'
  if (tier === 'gross') return 'bc_tv_sonder';
  return ARCHETYPE_MOTIF[archetypeForTags(tags)];
}

/** Motiv einer erzählerischen Sendung (Gegenreaktion/Krise/Enttarnung/Wahltag/Wochenschau). */
export function motifForCategory(category: BroadcastCategory): BroadcastMotifId {
  switch (category) {
    case 'faktencheck':
      return 'bc_faktencheck';
    case 'krise':
      return 'bc_krise';
    case 'enttarnung':
      return 'bc_enttarnung';
    case 'wahltag':
      return 'bc_wahltag';
    case 'wochenschau':
      return 'bc_wochenschau';
    case 'gegenreaktion':
      return 'bc_gegenwind';
    case 'massnahme':
      // Maßnahmen wählen ihr Motiv über motifForMeasure; dieser Zweig ist nur der
      // Vollständigkeits-Default (breite Emotionalisierungs-Szene).
      return 'bc_masche_spaltung';
  }
}

/** Nachschlag mit Fallback auf ein neutrales Motiv (nie undefined für die Anzeige). */
export function motif(id: BroadcastMotifId): BroadcastMotif {
  return MOTIF_CATALOG[id] ?? MOTIF_CATALOG.bc_masche_spaltung;
}
