/**
 * BeraterRegie — die Stimme der NPC-Berater-Architektur.
 *
 * Auftrag 2026-07-06 (`docs/AUFTRAG_2026-07-06_NPC_REGIE_VOLLER_WURF.md`):
 * Aus einer gewählten Aktion + zuständigem NPC baut diese Schicht ein `Angebot`
 * ({ziel?, wirkung, freischaltung, kosten, rhetorik, audienceFit}) und rendert
 * daraus die **substanzielle Bestätigung** (3. Takt) in der Stimme der Figur.
 *
 * Rein & deterministisch: KEIN LLM zur Laufzeit. Die Formulierungen kommen aus
 * der Autoren-Zeit-Bank (`data/formulierungsbank.json`); hier werden nur Slots
 * gefüllt. Slots sitzen an agreement-sicheren Stellen (Freischaltung in
 * Anführungszeichen = wie Eigenname; Wirkung als fertige Akkusativ-Nominalphrase).
 *
 * WICHTIG (Verbotsliste, NPC_VOICE_PROFILES): keine Möbel-/Dev-Begriffe
 * (Sendeplan, Narrativ-Tafel, „Maßnahme ausspielen") — die Bank hält das ein.
 */

import formulierungsbankRaw from '../data/formulierungsbank.json';
import personasRaw from '../data/personas.json';
import type { RawAction } from './ActionLoader';

// ============================================
// TYPEN
// ============================================

/** Ein konkretes, erzählerisch anbietbares Angebot eines NPCs für eine Aktion. */
export interface Angebot {
  npcId: string;
  actionId: string;
  /** Plan-Name (Infinitiv) — NICHT die Ergebnis-Schlagzeile. */
  label_de: string;
  /** Eigenname der Zielperson, falls die Aktion an ein Ziel gebunden ist. */
  ziel?: string;
  /** Fertige Akkusativ-Nominalphrase der Wirkung, z. B. „ihre wunden Punkte". */
  wirkungNomen?: string;
  /** In Anführungszeichen gesetzter Aktions-Name, der danach möglich wird. */
  freischaltung?: string;
  kosten: { budget?: number; kapazitaet?: number };
  /**
   * Überzeugungskraft der Figur (0..1) — persona-fix, NICHT die Korrektheit.
   * Marina hoch (verkauft alles), Alexei niedrig (warnt). Trennung von
   * `audienceFit` ist der didaktische Kern „überzeugend ≠ richtig" (R3).
   */
  rhetorik: number;
  /**
   * Welchen Appell die Aktion beim Publikum spielt (aus tags abgeleitet).
   * null = kein klarer Appell (Aufbau-/Technik-Aktion ohne Publikumswirkung).
   */
  appeal: MessageAppeal | null;
  /**
   * Wie gut das PUBLIKUM auf diesen Appell reagiert, [-1..1] — datengetrieben
   * aus `personas.json` (Mittel der Rezeptivität). UNABHÄNGIG von `rhetorik`:
   * ein glatter Pitch (hohe rhetorik) kann schlecht sitzen (niedriger fit).
   * Das ist der mechanische Beleg für „überzeugend ≠ richtig" (R3). null, wenn
   * die Aktion keinen Publikums-Appell spielt.
   */
  audienceFit: number | null;
}

export type MessageAppeal = 'hope' | 'fear' | 'anger' | 'trust';

interface BankVariante {
  needs: string[];
  text_de: string;
  text_en?: string;
}

interface BankNpc {
  bestaetigung: BankVariante[];
  wettstreit?: BankVariante[];
  uebergangen?: BankVariante[];
}

type Formulierungsbank = {
  npcs: Record<string, BankNpc>;
};

const bank = formulierungsbankRaw as unknown as Formulierungsbank;

// ============================================
// ABLEITUNGEN AUS DEN DATEN
// ============================================

/**
 * Persona-feste Überzeugungskraft. Bewusst getrennt von der tatsächlichen
 * Wirksamkeit — der glatteste Pitch (Marina) darf die falsche Wahl sein (R3).
 */
const RHETORIK: Record<string, number> = {
  marina: 0.9,
  direktor: 0.75,
  katja: 0.55,
  igor: 0.45,
  alexei: 0.35,
};

/**
 * Effekt-Schlüssel → fertige Akkusativ-Nominalphrase („Das bringt uns ___").
 * Reihenfolge = Priorität: der erste passende Treffer gewinnt, damit die
 * markanteste Wirkung genannt wird (nicht eine Kostennebenwirkung).
 */
const WIRKUNG_NOMEN: Array<[string, string]> = [
  ['reveals_weaknesses', 'ihre wunden Punkte'],
  ['target_damage', 'einen Treffer, der sitzt'],
  ['political_leverage', 'einen Hebel gegen sie'],
  ['loyalty_trap', 'eine Loyalität, die wir in der Hand haben'],
  ['social_division', 'einen tieferen Keil'],
  ['wedge_topics', 'einen tieferen Keil'],
  ['demoralization', 'mürbe Stimmung auf der Gegenseite'],
  ['reach_multiplier', 'mehr Reichweite'],
  ['organic_reach', 'mehr Reichweite'],
  ['amplification_bonus', 'mehr Reichweite'],
  ['flooding', 'einen Lärmpegel, der alles übertönt'],
  ['trending_topics', 'ein Bild von der Stimmung im Netz'],
  ['sentiment_analysis', 'ein Bild von der Stimmung im Netz'],
  ['content_quality', 'sauber gebautes Material'],
  ['message_optimization', 'eine Botschaft, die sitzt'],
  ['emotional_impact', 'einen Nerv, den wir treffen'],
  ['deniability', 'sauberere Hände'],
  ['opsec_bonus', 'sauberere Hände'],
  ['detection_difficulty', 'einen Vorsprung vor der Aufklärung'],
  ['funding_injection', 'frisches, getarntes Geld'],
  ['financial_cover', 'eine saubere Tarnung fürs Geld'],
  ['insider_access', 'einen Fuß in der Tür'],
  ['witting_agent', 'einen Mann auf der anderen Seite'],
  ['legitimacy_boost', 'einen Anstrich von Seriosität'],
  ['high_legitimacy', 'einen Anstrich von Seriosität'],
  ['long_term_influence', 'einen langen Hebel'],
];

/** Leitet die markanteste Wirkung aus den Roh-Effekten ab (oder null). */
export function wirkungNomenAusEffekten(
  effects?: Record<string, unknown>,
): string | null {
  if (!effects) return null;
  for (const [key, phrase] of WIRKUNG_NOMEN) {
    const v = effects[key];
    // truthy-Flag oder positive Zahl gilt als „Wirkung vorhanden"
    if (v === true || (typeof v === 'number' && v > 0)) return phrase;
  }
  return null;
}

// --- R3: Publikums-Passung (Wahrheits-Check gegen die Rhetorik) ---

const APPEALS: MessageAppeal[] = ['hope', 'fear', 'anger', 'trust'];

/**
 * Aktions-`tags` → Publikums-Appell. Direkte Appell-Namen zuerst; sonst eine
 * kuratierte Themen→Appell-Zuordnung. Bewusst schlank: viele Aufbau-/Technik-
 * Aktionen haben keinen Appell (→ null), das ist korrekt (kein Publikums-Spiel).
 */
const TAG_APPEAL: Record<string, MessageAppeal> = {
  hope: 'hope', fear: 'fear', anger: 'anger', trust: 'trust',
  emotional: 'fear', threat: 'fear', crisis: 'fear', health: 'fear',
  polarization: 'anger', division: 'anger', outrage: 'anger', wedge: 'anger', scandal: 'anger',
  authority: 'trust', legitimacy: 'trust', expert: 'trust', institutional: 'trust',
  optimism: 'hope', progress: 'hope', aspiration: 'hope',
};

/** Mittlere Rezeptivität des GESAMT-Publikums je Appell (aus personas.json). */
const MEAN_RECEPTIVITY: Record<MessageAppeal, number> = (() => {
  const personas = (personasRaw as { personas: Array<{ receptivity: Record<string, number> }> }).personas;
  const acc: Record<MessageAppeal, number> = { hope: 0, fear: 0, anger: 0, trust: 0 };
  for (const p of personas) for (const a of APPEALS) acc[a] += p.receptivity?.[a] ?? 0;
  const n = Math.max(1, personas.length);
  for (const a of APPEALS) acc[a] = acc[a] / n;
  return acc;
})();

/** Leitet den Publikums-Appell einer Aktion aus ihren tags ab (oder null). */
export function appealAusTags(tags: string[] | undefined): MessageAppeal | null {
  if (!tags) return null;
  for (const t of tags) {
    const a = TAG_APPEAL[t.toLowerCase()];
    if (a) return a;
  }
  return null;
}

/**
 * Wie gut das Publikum auf den Appell dieser Aktion reagiert, [-1..1].
 * Datengetrieben, unabhängig von der Überzeugungskraft des anbietenden NPCs.
 */
export function audienceFitForAction(tags: string[] | undefined): { appeal: MessageAppeal | null; fit: number | null } {
  const appeal = appealAusTags(tags);
  if (!appeal) return { appeal: null, fit: null };
  return { appeal, fit: MEAN_RECEPTIVITY[appeal] };
}

/**
 * Baut die Freischaltungs-Phrase aus `unlocks`: der Label des zuerst
 * freigeschalteten Aktions-Namens, in Anführungszeichen (wirkt wie Eigenname →
 * agreement-sicher). `resolveLabel` liefert label_de zu einer Aktions-id.
 */
export function freischaltungAusUnlocks(
  unlocks: string[] | undefined,
  resolveLabel: (id: string) => string | undefined,
): string | null {
  if (!unlocks || unlocks.length === 0) return null;
  for (const id of unlocks) {
    const label = resolveLabel(id);
    if (label) return `„${label}"`;
  }
  return null;
}

/**
 * Baut ein `Angebot` aus einer Roh-Aktion. `resolveLabel` löst unlocks-ids zu
 * Namen auf (aus dem ActionLoader). `zielName` optional, falls ein Ziel
 * gebunden ist.
 */
export function buildAngebot(
  action: RawAction,
  npcId: string,
  resolveLabel: (id: string) => string | undefined,
  zielName?: string,
): Angebot {
  const { appeal, fit } = audienceFitForAction(action.tags);
  return {
    npcId,
    actionId: action.id,
    label_de: action.label_de,
    ziel: zielName,
    wirkungNomen: wirkungNomenAusEffekten(action.effects) ?? undefined,
    freischaltung: freischaltungAusUnlocks(action.unlocks, resolveLabel) ?? undefined,
    kosten: { budget: action.costs?.budget, kapazitaet: action.costs?.capacity },
    rhetorik: RHETORIK[npcId] ?? 0.5,
    appeal,
    audienceFit: fit,
  };
}

// ============================================
// RENDERN (3. Takt: substanzielle Bestätigung)
// ============================================

/** Deterministischer Slot-Wert-Beutel aus einem Angebot. */
function slotsFromAngebot(a: Angebot): Record<string, string | undefined> {
  return {
    ziel: a.ziel,
    wirkungNomen: a.wirkungNomen,
    freischaltung: a.freischaltung,
    // Kosten nur als Slot, wenn > 0 — sonst „Gebucht: 0 Taler" bei Gratis-Aktionen.
    budget: a.kosten.budget && a.kosten.budget > 0 ? String(a.kosten.budget) : undefined,
    kapazitaet: a.kosten.kapazitaet && a.kosten.kapazitaet > 0 ? String(a.kosten.kapazitaet) : undefined,
  };
}

/**
 * Wählt aus einer Varianten-Liste die **reichste erfüllbare** (alle `needs`
 * vorhanden) und füllt die Slots. `rng` (0..1) bricht Gleichstände unter den
 * gleich-reichen Varianten. Fällt sicher auf eine `needs:[]`-Variante zurück.
 */
export function renderVariante(
  varianten: BankVariante[] | undefined,
  slots: Record<string, string | undefined>,
  rng: number,
  locale: 'de' | 'en' = 'de',
): string | null {
  if (!varianten || varianten.length === 0) return null;
  const erfuellbar = varianten.filter((v) =>
    v.needs.every((n) => {
      const val = slots[n];
      return val != null && val !== '';
    }),
  );
  if (erfuellbar.length === 0) return null;
  const maxNeeds = Math.max(...erfuellbar.map((v) => v.needs.length));
  const reichste = erfuellbar.filter((v) => v.needs.length === maxNeeds);
  // rng defensiv: NaN/negativ → 0 (kein undefined-Zugriff); rng≥1 fängt Math.min.
  const r = Number.isFinite(rng) && rng >= 0 ? rng : 0;
  const idx = Math.min(reichste.length - 1, Math.floor(r * reichste.length));
  const chosen = reichste[idx];
  const template = (locale === 'en' && chosen.text_en) || chosen.text_de;
  return fillSlots(template, slots);
}

function fillSlots(
  template: string,
  slots: Record<string, string | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (_m, key: string) => slots[key] ?? '');
}

/**
 * 3. Takt — die substanzielle Bestätigung in der Stimme des NPCs.
 * Ersetzt den betonierten Einheitssatz (useStoryGameState.ts:674).
 */
export function renderBestaetigung(a: Angebot, rng: number, locale: 'de' | 'en' = 'de'): string {
  const npcBank = bank.npcs[a.npcId];
  const rendered = renderVariante(npcBank?.bestaetigung, slotsFromAngebot(a), rng, locale);
  // Harter Rückfall, falls ein NPC (noch) keine Bank hat: sachlich, aber ohne
  // Tempus-Widerspruch und ohne Möbel-Vokabular.
  if (rendered) return rendered;
  return locale === 'en'
    ? `Understood. I'll get "${a.label_de}" moving.`
    : `Verstanden. Ich bringe „${a.label_de}" auf den Weg.`;
}

/** Kurze Wettstreit-Spitze des NPCs (R2), wenn mehrere Körbe konkurrieren. */
export function renderWettstreit(npcId: string, rng: number, locale: 'de' | 'en' = 'de'): string | null {
  return renderVariante(bank.npcs[npcId]?.wettstreit, {}, rng, locale);
}

/** Reaktion, wenn der Spieler diesen NPC übergangen hat (R4). */
export function renderUebergangen(npcId: string, rng: number, locale: 'de' | 'en' = 'de'): string | null {
  return renderVariante(bank.npcs[npcId]?.uebergangen, {}, rng, locale);
}
