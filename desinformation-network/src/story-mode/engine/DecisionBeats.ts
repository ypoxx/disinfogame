/**
 * DecisionBeats — die *Inhalts*-Schicht der Spine (Spine Slice 4, Baukasten:
 * `BEAT_MUSTER_KATALOG.md`). Während `StoryDirector` *koordiniert* (welcher Beat
 * kommt) und `directorStore` ihn *hält*, liefert dieses Modul den **Inhalt**: die
 * aufgeladenen Entscheidungs-Beats mit ihren nicht-dominierten Trade-off-Optionen.
 *
 * Kernprinzip des Katalogs: **kein neues System pro Beat.** Jede Option mappt auf
 * bestehende Achsen — Gesellschaftswerte (`SocietyValueKey`, vgl. `Auftraege.ts`) und
 * Spieler-Kosten (Risiko/Aufmerksamkeit/Budget, `StoryEngineAdapter.ts`). Reine Daten
 * + reine Helfer (kein React/Math.random) → testbar; die Engine wendet eine gewählte
 * Option an (`applyDecisionBeatOption`).
 *
 * Qualitäts-Gate (testbar, `evaluateBeatGate`): jede Option ist für *mindestens eine*
 * Strategie/Lage die beste (**Deckung**) und *keine* für alle (**kein
 * Universalsieger**). Ein Beat, der das nicht besteht, ist ein Fehler, kein Beat.
 */

import type { SocietyValueKey } from '../../game-logic/StoryEngineAdapter';
import type { AuftragId } from './Auftraege';
import { AUFTRAEGE } from './Auftraege';

export type BeatRegion = 'offensiv' | 'intern' | 'epistemisch' | 'zeitlich';
export type BeatEbene = 'union' | 'staat' | 'stadt' | 'transnational';
export type RelativitaetsAchse = 'auftrag' | 'lage' | 'geschichte';
export type AusgangsForm = 'deterministisch' | 'backfire' | 'akkumulierend' | 'stochastisch';

/** Werte-Delta einer Option auf die Gesellschaftswerte. `vertrauen` ist ein Design-/
 * Beratungs-Signal (Auftrags-Signatur) — die Engine koppelt es NICHT mechanisch an die
 * Sieg-Achse `obj_destabilize` (R2, balance-neutral wie `completeEpisode`). */
export type WerteDelta = Partial<Record<SocietyValueKey | 'vertrauen', number>>;

/** Spieler-Kosten: Risiko/Aufmerksamkeit (0–100-Achsen), Budget (Tsd. €, negativ = Ausgabe). */
export interface SpielerKosten {
  risk?: number;
  attention?: number;
  budget?: number;
}

export interface BeatOption {
  /** Stabiler Buchstabe 'A'..'D' (auch UI-Tastenkürzel). */
  id: string;
  label_de: string;
  /** Die reale Desinfo-Technik hinter der Option (Bildungs-Kern). */
  technik_de: string;
  /** Was sie bewirkt — trägt auch das narrativ, was mechanisch (Vertrauen) NICHT bewegt wird. */
  wirkung_de: string;
  werteDelta: WerteDelta;
  spielerKosten: SpielerKosten;
  ausgang: AusgangsForm;
}

export interface DecisionBeat {
  id: string;
  name_de: string;
  region: BeatRegion;
  ebene: BeatEbene;
  /** Diegetischer Ort (Stadt/Staat) — Skala gemäß `WELT_ECKPUNKTE_WESTUNION.md`. */
  ort_de: string;
  /** Die Bühne: was passiert (vom Director gesetzt, nie was der Spieler tut). */
  anlass_de: string;
  /** Marinas Vorgriffszeile fürs Morgenbriefing (foreshadow). */
  vorgriffZeile_de: string;
  leitspannung_de: string;
  /** Die *eine* primär abgewogene Kosten-Währung (Lückenkarte des Katalogs). */
  kostenAchse_de: string;
  /** Woran sich „richtig" misst (Teil C.1) — steuert die Berater-Empfehlung. */
  relativitaetsAchse: RelativitaetsAchse;
  optionen: BeatOption[];
}

// ============================================================================
// Der Katalog (Slice 4: die zwei offensiven, auftrags-relativen Beats)
// ============================================================================

/**
 * Beat #1 „Stadtrat" (Spine §Lackmustest). Geplant/proaktiv: ein bekannter Termin,
 * der Spieler *erschafft* Inhalt. Kosten-Achse: Lautstärke (lauter → mehr Aufmerksamkeit).
 * Magnituden bewusst so gesetzt, dass das Gate die Bijektion Keil→A · Wahl→C · Zweifel→B
 * · überhitzt→D erfüllt (Autoren-Disziplin, gepinnt im Test).
 */
const STADTRAT: DecisionBeat = {
  id: 'stadtrat',
  name_de: 'Der Stadtrat',
  region: 'offensiv',
  ebene: 'stadt',
  ort_de: 'eine Stadt in Gallia (Fokus-Mitgliedsstaat)',
  anlass_de:
    'Der Stadtrat tagt morgen über das Reizthema. Eine Bühne, die sich von selbst aufbaut — die Frage ist nur, welche Antwort Sie darauf geben.',
  vorgriffZeile_de: 'Marina: „Morgen tagt der Stadtrat in Gallia über das Reizthema — wir sollten vorbereitet sein."',
  leitspannung_de: 'Welche Antwort?',
  kostenAchse_de: 'Lautstärke / Aufmerksamkeit',
  relativitaetsAchse: 'auftrag',
  optionen: [
    {
      id: 'A',
      label_de: 'Hetzen — den Skandal aufladen',
      technik_de: 'Emotionalisierung / Skandalisierung',
      wirkung_de: 'Treibt die Lager auseinander und vergiftet die Debatte — laut, weithin sichtbar.',
      werteDelta: { polarisierung: 18, zynismus: 8, diskursqualitaet: -10 },
      spielerKosten: { attention: 18, risk: 8 },
      ausgang: 'deterministisch',
    },
    {
      id: 'B',
      label_de: 'Einschleusen — das Verfahren delegitimieren',
      technik_de: 'Astroturfing / Verfahrens-Delegitimierung',
      wirkung_de: 'Leise: streut Zweifel, ob der Rat überhaupt legitim entscheidet — untergräbt das Vertrauen ins Verfahren.',
      werteDelta: { vertrauen: -12, zynismus: 8, diskursqualitaet: -10 },
      spielerKosten: { attention: -4, risk: 12 },
      ausgang: 'backfire',
    },
    {
      id: 'C',
      label_de: 'Fraktion stärken — die uns nahe Kraft pushen',
      technik_de: 'Gezielte Verstärkung (Amplifikation einer Kraft)',
      wirkung_de: 'Bringt die uns nahe Fraktion in Stellung — gezielt, nicht flächig.',
      werteDelta: { fraktionsstaerke: 24, polarisierung: 8 },
      spielerKosten: { attention: 10, risk: 10 },
      ausgang: 'deterministisch',
    },
    {
      id: 'D',
      label_de: 'Laufen lassen — abkühlen',
      technik_de: 'Zurückhaltung (sät evtl. eine emergente Vorlage)',
      wirkung_de: 'Kein Fortschritt, aber die Hitze sinkt — und manchmal liefert die Realität von selbst eine Vorlage nach.',
      werteDelta: {},
      spielerKosten: { attention: -10, risk: -8 },
      ausgang: 'deterministisch',
    },
  ],
};

/**
 * Beat #2 „Die reale Vorlage" (`IDEE_BEAT_REALE_VORLAGE.md`). Emergent/reaktiv: es ist
 * *wirklich* etwas passiert, das dem Narrativ nützt. Kosten-Achse: Authentizität (weiter
 * von der Wahrheit → widerlegbarer). Gate-Bijektion: Zweifel→A · Keil→B · Wahl→C ·
 * überhitzt→D (sauberes 1:1, vgl. Idee-Doc).
 */
const REALE_VORLAGE: DecisionBeat = {
  id: 'reale_vorlage',
  name_de: 'Die reale Vorlage',
  region: 'offensiv',
  ebene: 'stadt',
  ort_de: 'eine Stadt in Gallia (Fokus-Mitgliedsstaat)',
  anlass_de:
    'Ein Lokalpolitiker hat bei der Ratssitzung etwas Unbedachtes gesagt — auf Video. Es hilft dem Narrativ, ganz ohne unser Zutun. Wie weit nutzen Sie es aus?',
  vorgriffZeile_de: 'Marina: „Aus Gallia ist ein Video aufgetaucht — echtes Material, das uns in die Hände spielt. Ihre Entscheidung."',
  leitspannung_de: 'Ob und wie ausnutzen?',
  kostenAchse_de: 'Authentizität / Widerlegbarkeit',
  relativitaetsAchse: 'auftrag',
  optionen: [
    {
      id: 'A',
      label_de: 'Verkürzen — aus dem Kontext schneiden',
      technik_de: 'Dekontextualisierung',
      wirkung_de: 'Echtes Material, neu gerahmt: schwer zu widerlegen, nagt am Vertrauen — bis ein Faktencheck den Kontext wiederherstellt.',
      werteDelta: { vertrauen: -12, zynismus: 10 },
      spielerKosten: { risk: 4, attention: 4 },
      ausgang: 'backfire',
    },
    {
      id: 'B',
      label_de: 'Aufbauschen — Bedeutung inflationieren',
      technik_de: 'Amplifikation',
      wirkung_de: 'Nichts gefälscht, nur lauter gemacht: am sichersten, aber schwächster Stoß — treibt vor allem die Lager auseinander.',
      werteDelta: { polarisierung: 16 },
      spielerKosten: { risk: 2, attention: 6 },
      ausgang: 'deterministisch',
    },
    {
      id: 'C',
      label_de: 'Anreichern — eine erfundene Verknüpfung andocken',
      technik_de: 'Fabrikation („finanziert von …")',
      wirkung_de: 'Maximale Wirkung gegen den Rivalen — aber der erfundene Teil ist widerlegbar: echter Backfire-Kandidat.',
      werteDelta: { fraktionsstaerke: 24 },
      spielerKosten: { risk: 18, attention: 8 },
      ausgang: 'backfire',
    },
    {
      id: 'D',
      label_de: 'Liegenlassen — nur beobachten',
      technik_de: '— (Kontrolle abgegeben)',
      wirkung_de: 'Sie greifen nicht ein; vielleicht wächst es organisch, vielleicht verpufft es. Die Hitze sinkt.',
      werteDelta: {},
      spielerKosten: { risk: -6, attention: -8 },
      ausgang: 'deterministisch',
    },
  ],
};

export const ALL_DECISION_BEATS: DecisionBeat[] = [STADTRAT, REALE_VORLAGE];

const BEATS_BY_ID: Record<string, DecisionBeat> = Object.fromEntries(
  ALL_DECISION_BEATS.map((b) => [b.id, b]),
);

export function getDecisionBeat(id: string): DecisionBeat | undefined {
  return BEATS_BY_ID[id];
}

export function getBeatOption(beat: DecisionBeat, optionId: string): BeatOption | undefined {
  return beat.optionen.find((o) => o.id === optionId);
}

// ============================================================================
// Berater-Relativität + Qualitäts-Gate (reine, testbare Helfer)
// ============================================================================

/**
 * Wie gut eine Option den *aktiven Auftrag* bedient: Summe der auftragsgerichteten
 * Werte-Bewegungen (Signatur will hoch → +Delta, will runter → −Delta). „Richtig" ist
 * damit strategie-relativ (Relativitäts-Achse „auftrag").
 */
export function scoreForAuftrag(option: BeatOption, auftragId: AuftragId): number {
  let score = 0;
  for (const sig of AUFTRAEGE[auftragId].signatur) {
    const d = option.werteDelta[sig.wert] ?? 0;
    score += sig.richtung === 'hoch' ? d : -d;
  }
  return score;
}

/** Hitze, die eine Option erzeugt (Risiko + Aufmerksamkeit) — Maß für die Lage-Überschreibung. */
export function hitzeKosten(option: BeatOption): number {
  return (option.spielerKosten.risk ?? 0) + (option.spielerKosten.attention ?? 0);
}

/**
 * Welche Option der Berater empfiehlt. Normalfall: relativ zum aktiven Auftrag (höchster
 * Score). Bei *überhitzter Lage* schlägt die Lage den Auftrag (Spine: situative
 * Überschreibung) → die Option, die am stärksten Hitze senkt (das Abkühl-Ventil).
 */
export function recommendOption(
  beat: DecisionBeat,
  auftragId: AuftragId,
  ueberhitzt = false,
): BeatOption {
  if (ueberhitzt) {
    return beat.optionen.reduce((best, o) => (hitzeKosten(o) < hitzeKosten(best) ? o : best));
  }
  return beat.optionen.reduce((best, o) =>
    scoreForAuftrag(o, auftragId) > scoreForAuftrag(best, auftragId) ? o : best,
  );
}

export interface GateResult {
  ok: boolean;
  /** Jede Option ist für ≥1 Fall die beste. */
  coverage: boolean;
  /** Keine Option ist für *alle* Fälle die beste. */
  noUniversalWinner: boolean;
  /** Bester Options-Id je Fall (keil/wahl/zweifel/ueberhitzt). */
  bestByCase: Record<string, string>;
  /** Optionen, die in keinem Fall gewinnen (Gate-Verletzung, wenn nicht leer). */
  uncovered: string[];
}

/**
 * Das testbare Qualitäts-Gate (Katalog Teil B): prüft über die Fälle Keil/Wahl/Zweifel
 * (auftrags-relativ) + überhitzte Lage, dass jede Option für mindestens einen Fall die
 * beste ist (Deckung) und keine für alle (kein Universalsieger).
 */
export function evaluateBeatGate(beat: DecisionBeat): GateResult {
  const bestByCase: Record<string, string> = {
    keil: recommendOption(beat, 'keil').id,
    wahl: recommendOption(beat, 'wahl').id,
    zweifel: recommendOption(beat, 'zweifel').id,
    ueberhitzt: recommendOption(beat, 'keil', true).id,
  };
  const winners = new Set(Object.values(bestByCase));
  const uncovered = beat.optionen.map((o) => o.id).filter((id) => !winners.has(id));
  const coverage = uncovered.length === 0;
  const noUniversalWinner = winners.size > 1;
  return { ok: coverage && noUniversalWinner, coverage, noUniversalWinner, bestByCase, uncovered };
}

/**
 * Kandidaten für den Director-Pool: noch nicht aufgelöste Beats als
 * {id, vorgriffZeile_de}. Der Aufrufer (useStoryGameState) füllt `resolvedIds` aus dem
 * Engine-Zustand.
 */
export function unresolvedDecisionCandidates(
  resolvedIds: Iterable<string>,
): { id: string; vorgriffZeile_de: string }[] {
  const resolved = new Set(resolvedIds);
  return ALL_DECISION_BEATS.filter((b) => !resolved.has(b.id)).map((b) => ({
    id: b.id,
    vorgriffZeile_de: b.vorgriffZeile_de,
  }));
}
