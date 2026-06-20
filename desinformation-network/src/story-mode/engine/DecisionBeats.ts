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

/** Spieler-Kosten: Risiko/Aufmerksamkeit (0–100-Achsen), Budget (Tsd. €, negativ = Ausgabe), Moral-Last. */
export interface SpielerKosten {
  risk?: number;
  attention?: number;
  budget?: number;
  moralWeight?: number;
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
  /**
   * Nur für NICHT-auftrags-relative Beats (relativitaetsAchse ≠ 'auftrag'): Eignung je
   * operativem/historischem Kontext (Befund C.1). Bei auftrags-relativen Beats wird die
   * Empfehlung stattdessen aus `werteDelta` + Auftrags-Signatur abgeleitet.
   */
  eignung?: Record<string, number>;
  /**
   * Schicht 3: Wirkung dieser Option skaliert mit der Inokulation des Beat-Themas
   * (abnehmende Erträge + Rückschlag/Streisand bei hoher Inokulation). Nur sinnvoll für
   * Recycling-Optionen reaktiver Beats (Bumerang/Recyceln).
   */
  inoculationScaled?: boolean;
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
  /**
   * Kontext-Labels, gegen die ein NICHT-auftrags-relativer Beat geprüft/empfohlen wird
   * (Pflicht bei relativitaetsAchse ≠ 'auftrag'; bei 'auftrag' implizit Keil/Wahl/Zweifel).
   */
  kontexte?: string[];
  /** Schicht 3: Narrativ-Thema, das dieser Beat sät/recycelt (NarrativeMemory). */
  themaId?: string;
  /** Schicht 3 (reaktiv): Beat ist erst verfügbar, wenn dieses Thema schon gelaufen ist. */
  requiresThema?: string;
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
  themaId: 'reizthema_gallia',
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
  themaId: 'reizthema_gallia',
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

/**
 * Beat #3 „Der Schwelbrand" (`IDEE_BEAT_SCHWELBRAND.md`). Offensiv, mehrtägig,
 * akkumulierend — Leitfrage „wann aufhören?". Kosten-Achse: Dauer/Gier. Auftrags-relativ;
 * Gate-Deckung: Keil→A · Wahl→B · Zweifel→A · überhitzt→C (3 Optionen, A deckt zwei Fälle).
 */
const SCHWELBRAND: DecisionBeat = {
  id: 'schwelbrand',
  name_de: 'Der Schwelbrand',
  region: 'offensiv',
  ebene: 'staat',
  ort_de: 'landesweit in Gallia',
  anlass_de:
    'Eine Kampagne, die Sie vor Tagen gelegt haben, glimmt weiter und wird größer. Die Versuchung: noch mehr herausholen. Die Gefahr: je länger sie brennt, desto sichtbarer wird die Quelle.',
  vorgriffZeile_de: 'Marina: „Unser Schwelbrand in Gallia greift weiter um sich — wir müssen entscheiden, ob wir nachlegen oder ernten."',
  leitspannung_de: 'Wann aufhören?',
  kostenAchse_de: 'Dauer / Gier (je länger, desto sichtbarer)',
  relativitaetsAchse: 'auftrag',
  themaId: 'reizthema_gallia',
  optionen: [
    {
      id: 'A',
      label_de: 'Weiter anfachen — nachlegen',
      technik_de: 'Eskalation / Persistenz-Kampagne',
      wirkung_de: 'Treibt die Spaltung weiter hoch und vergiftet die Debatte — aber jeder Tag mehr erhöht die Sichtbarkeit der Quelle.',
      werteDelta: { polarisierung: 18, diskursqualitaet: -8, zynismus: 6 },
      spielerKosten: { attention: 16, risk: 8 },
      ausgang: 'akkumulierend',
    },
    {
      id: 'B',
      label_de: 'Ernten — jetzt Kapital schlagen',
      technik_de: 'Gezielte Konversion (Reichweite → Wirkung)',
      wirkung_de: 'Verwandelt die aufgebaute Reichweite in einen konkreten Vorteil für die uns nahe Kraft — bevor das Feuer auffällt.',
      werteDelta: { fraktionsstaerke: 22, zynismus: 10 },
      spielerKosten: { attention: 8, risk: 10 },
      ausgang: 'deterministisch',
    },
    {
      id: 'C',
      label_de: 'Löschen — abklingen lassen',
      technik_de: 'Rückzug / Spuren kühlen',
      wirkung_de: 'Kein weiterer Gewinn, aber die Sichtbarkeit sinkt, bevor die Quelle auffliegt.',
      werteDelta: {},
      spielerKosten: { attention: -12, risk: -10 },
      ausgang: 'deterministisch',
    },
  ],
};

/**
 * Beat #4 „Die Loyalitätsprobe" (`IDEE_BEAT_LOYALITAETSPROBE.md`). Intern (nach innen) —
 * eigene Leute managen. Relativitäts-Achse: **operative Lage** (Befund C.1), NICHT der
 * Auftrag → die Eignung jeder Option ist je Lage deklariert (`eignung`), nicht aus den
 * Gesellschaftswerten abgeleitet. Kosten-Achse: interne Loyalität/Sicherheit (Moral-Last).
 */
const LOYALITAETSPROBE: DecisionBeat = {
  id: 'loyalitaetsprobe',
  name_de: 'Die Loyalitätsprobe',
  region: 'intern',
  ebene: 'transnational',
  ort_de: 'die eigene Abteilung',
  anlass_de:
    'Ein Verbreiter wird unzuverlässig — er stellt Fragen, hortet Material. Ein Risiko nach innen. Wie gehen Sie mit den eigenen Leuten um?',
  vorgriffZeile_de: 'Marina: „Einer unserer Leute wird zum Risiko. Wir müssen entscheiden, wie wir mit ihm verfahren."',
  leitspannung_de: 'Eigene Leute managen?',
  kostenAchse_de: 'Interne Loyalität / Sicherheit',
  relativitaetsAchse: 'lage',
  kontexte: ['lage_ruhig', 'leck_gefahr', 'akut_bedroht', 'kosten_druck'],
  optionen: [
    {
      id: 'A',
      label_de: 'Einbinden — stärker binden, investieren',
      technik_de: 'Loyalitäts-Bindung (Anreize)',
      wirkung_de: 'Kostet Budget, senkt aber das Leck-Risiko nachhaltig — lohnt, wenn die Lage Luft lässt.',
      werteDelta: {},
      spielerKosten: { budget: -8, risk: -4 },
      ausgang: 'deterministisch',
      eignung: { lage_ruhig: 3, leck_gefahr: 1, akut_bedroht: 0, kosten_druck: 0 },
    },
    {
      id: 'B',
      label_de: 'Kaltstellen — sauber aus dem Verkehr ziehen',
      technik_de: 'Kompartmentierung / Isolierung',
      wirkung_de: 'Neutralisiert das Leck ohne Lärm — die solide Wahl, wenn die Sicherheit kippt.',
      werteDelta: {},
      spielerKosten: { risk: -8, attention: 4, moralWeight: 3 },
      ausgang: 'deterministisch',
      eignung: { lage_ruhig: 1, leck_gefahr: 3, akut_bedroht: 1, kosten_druck: 1 },
    },
    {
      id: 'C',
      label_de: 'Verbrennen — das Asset opfern',
      technik_de: 'Asset-Verbrennung (harter Schnitt)',
      wirkung_de: 'Eliminiert das Leck sofort und vollständig — der härteste, teuerste Schnitt, nur bei akuter Enttarnungsgefahr.',
      werteDelta: {},
      spielerKosten: { risk: -16, attention: 10, moralWeight: 10 },
      ausgang: 'deterministisch',
      eignung: { lage_ruhig: 0, leck_gefahr: 1, akut_bedroht: 3, kosten_druck: 0 },
    },
    {
      id: 'D',
      label_de: 'Vertrauen — nichts tun, Risiko hinnehmen',
      technik_de: '— (Zurückhaltung)',
      wirkung_de: 'Kostet nichts, lässt aber das Risiko stehen — die Option, wenn jede Ressource zählt.',
      werteDelta: {},
      spielerKosten: { risk: 6 },
      ausgang: 'backfire',
      eignung: { lage_ruhig: 1, leck_gefahr: 0, akut_bedroht: 0, kosten_druck: 3 },
    },
  ],
};

/**
 * Beat #6 „Der Bumerang" (`IDEE_BEAT_BUMERANG.md`). Der erste **reaktive** Beat: die
 * *Vergangenheit* ist der zentrale Input. Relativitäts-Achse = **Spielgeschichte**
 * (Befund C.1/C.3) — „richtig" hängt am akkumulierten Inokulations-Stand des Themas.
 * `requiresThema`: erscheint erst, wenn die Erzählung im Spiel schon lief (man kann nichts
 * recyceln, was nie gesät wurde). Option A (Recyceln) ist `inoculationScaled` → abnehmende
 * Erträge + Rückschlag/Streisand bei hoher Inokulation (Engine: `applyDecisionBeatOption`).
 */
const BUMERANG: DecisionBeat = {
  id: 'bumerang',
  name_de: 'Der Bumerang',
  region: 'zeitlich',
  ebene: 'transnational',
  ort_de: 'Gallia und darüber hinaus',
  anlass_de:
    'Eine Erzählung, die Sie vor Tagen gesät haben, taucht auf einem neuen realweltlichen Aufhänger wieder auf — diesmal wirkt sie anders. History matters: das Publikum erinnert sich.',
  vorgriffZeile_de: 'Marina: „Unsere alte Erzählung lebt wieder auf — ein neuer Aufhänger. Recyceln, umdrehen, mainstreamen oder begraben?"',
  leitspannung_de: 'Recyceln oder begraben?',
  kostenAchse_de: 'Narrativ-Lebenszyklus / Verfall',
  relativitaetsAchse: 'geschichte',
  kontexte: ['frisch', 'inokuliert', 'breitenwirkung', 'abklingen'],
  themaId: 'reizthema_gallia',
  requiresThema: 'reizthema_gallia',
  optionen: [
    {
      id: 'A',
      label_de: 'Recyceln — 1:1 neu aufladen',
      technik_de: 'Recycling (Reaktivierung auf neuem Peg)',
      wirkung_de: 'Billig, das Asset existiert — aber je inokulierter das Publikum, desto schwächer, und „längst widerlegt" kann zurückschlagen.',
      werteDelta: { polarisierung: 18, zynismus: 8 },
      spielerKosten: { attention: 6, risk: 4 },
      ausgang: 'backfire',
      inoculationScaled: true,
      eignung: { frisch: 3, inokuliert: 0, breitenwirkung: 1, abklingen: 1 },
    },
    {
      id: 'B',
      label_de: 'Mutieren — neuer Dreh, Inokulation ausweichen',
      technik_de: 'Mutation (Reframing gegen die Immunabwehr)',
      wirkung_de: 'Umgeht das Gedächtnis des Publikums, verliert aber den „klingt vertraut"-Vorteil — mehr Aufwand.',
      werteDelta: { polarisierung: 12, fragmentierung: 8 },
      spielerKosten: { attention: 8, risk: 8, budget: -4 },
      ausgang: 'deterministisch',
      eignung: { frisch: 1, inokuliert: 3, breitenwirkung: 1, abklingen: 0 },
    },
    {
      id: 'C',
      label_de: 'Mainstreamen — glaubwürdigen Träger gewinnen',
      technik_de: 'Mainstreaming (Adoption durch glaubwürdigen Träger)',
      wirkung_de: 'Höchste Reichweite in neue Publika — aber teuer/riskant: der Träger kann verbrennen und bindet uns öffentlich an die Story.',
      werteDelta: { fraktionsstaerke: 18, polarisierung: 6 },
      spielerKosten: { attention: 14, risk: 16, budget: -8 },
      ausgang: 'backfire',
      eignung: { frisch: 1, inokuliert: 1, breitenwirkung: 3, abklingen: 0 },
    },
    {
      id: 'D',
      label_de: 'Begraben lassen — schonen',
      technik_de: '— (Verfall zulassen)',
      wirkung_de: 'Oft klug bei hoher Resilienz; vielleicht lebt die Story ohne uns von selbst wieder auf.',
      werteDelta: {},
      spielerKosten: { attention: -8, risk: -6 },
      ausgang: 'deterministisch',
      eignung: { frisch: 0, inokuliert: 1, breitenwirkung: 0, abklingen: 3 },
    },
  ],
};

export const ALL_DECISION_BEATS: DecisionBeat[] = [
  STADTRAT,
  REALE_VORLAGE,
  SCHWELBRAND,
  LOYALITAETSPROBE,
  BUMERANG,
];

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

const AUFTRAG_IDS = new Set<string>(['keil', 'wahl', 'zweifel']);

/**
 * Die beste Option für *einen* Kontext — der Kern, auf dem Empfehlung UND Gate ruhen.
 * Die Relativitäts-Achse „wandert" (Befund C.1): der Kontext ist entweder ein Auftrag
 * (Score aus `werteDelta` + Signatur), die universelle Überhitzung (geringste Hitze =
 * Abkühl-Ventil) oder ein deklarierter operativer/historischer Kontext (`eignung`).
 */
export function bestForContext(beat: DecisionBeat, context: string): BeatOption {
  if (context === 'ueberhitzt') {
    return beat.optionen.reduce((best, o) => (hitzeKosten(o) < hitzeKosten(best) ? o : best));
  }
  if (AUFTRAG_IDS.has(context)) {
    const id = context as AuftragId;
    return beat.optionen.reduce((best, o) =>
      scoreForAuftrag(o, id) > scoreForAuftrag(best, id) ? o : best,
    );
  }
  // Deklarierter Kontext (lage/geschichte): höchste deklarierte Eignung.
  return beat.optionen.reduce((best, o) =>
    (o.eignung?.[context] ?? -Infinity) > (best.eignung?.[context] ?? -Infinity) ? o : best,
  );
}

/**
 * Empfehlung des Beraters für auftrags-relative Beats (Komfort-Wrapper um `bestForContext`).
 * Bei überhitzter Lage schlägt die Lage den Auftrag (situative Überschreibung).
 */
export function recommendOption(
  beat: DecisionBeat,
  auftragId: AuftragId,
  ueberhitzt = false,
): BeatOption {
  return bestForContext(beat, ueberhitzt ? 'ueberhitzt' : auftragId);
}

/** Die Kontexte, gegen die ein Beat geprüft wird — je nach Relativitäts-Achse (Befund C.1). */
export function gateContexts(beat: DecisionBeat): string[] {
  if (beat.relativitaetsAchse === 'auftrag') return ['keil', 'wahl', 'zweifel', 'ueberhitzt'];
  return beat.kontexte ?? [];
}

export interface GateResult {
  ok: boolean;
  /** Jede Option ist für ≥1 Kontext die beste. */
  coverage: boolean;
  /** Keine Option ist für *alle* Kontexte die beste. */
  noUniversalWinner: boolean;
  /** Bester Options-Id je Kontext. */
  bestByCase: Record<string, string>;
  /** Optionen, die in keinem Kontext gewinnen (Gate-Verletzung, wenn nicht leer). */
  uncovered: string[];
}

/**
 * Das testbare Qualitäts-Gate (Katalog Teil B): prüft über die Relativitäts-Kontexte des
 * Beats, dass jede Option für mindestens einen Kontext die beste ist (Deckung) und keine
 * für alle (kein Universalsieger).
 */
export function evaluateBeatGate(beat: DecisionBeat): GateResult {
  const bestByCase: Record<string, string> = {};
  for (const ctx of gateContexts(beat)) bestByCase[ctx] = bestForContext(beat, ctx).id;
  const winners = new Set(Object.values(bestByCase));
  const uncovered = beat.optionen.map((o) => o.id).filter((id) => !winners.has(id));
  const coverage = uncovered.length === 0;
  const noUniversalWinner = winners.size > 1;
  return { ok: coverage && noUniversalWinner, coverage, noUniversalWinner, bestByCase, uncovered };
}

/**
 * Schicht 3: leitet aus Inokulations-Stand + Auftrag den Geschichts-Kontext für einen
 * reaktiven Beat (Bumerang) ab — „richtig" ist history- UND auftrags-relativ (Litmus ③).
 * Überhitzung/sehr hohe Inokulation → begraben; mittel → mutieren; „Wahl" braucht Reichweite
 * → mainstreamen; sonst frisch genug zum Recyceln.
 */
export function geschichteContextForInoculation(
  inoculation: number,
  auftragId: AuftragId,
  ueberhitzt = false,
): string {
  if (ueberhitzt || inoculation >= 80) return 'abklingen';
  if (inoculation >= 50) return 'inokuliert';
  if (auftragId === 'wahl') return 'breitenwirkung';
  return 'frisch';
}

/**
 * Kandidaten für den Director-Pool: noch nicht aufgelöste Beats als
 * {id, vorgriffZeile_de}. Reaktive Beats (mit `requiresThema`) erscheinen erst, wenn ihr
 * Thema schon gelaufen ist (`seededThemes`) — man kann nichts recyceln, was nie gesät wurde.
 * Der Aufrufer (useStoryGameState) füllt beide Listen aus dem Engine-Zustand.
 */
export function unresolvedDecisionCandidates(
  resolvedIds: Iterable<string>,
  seededThemes: Iterable<string> = [],
): { id: string; vorgriffZeile_de: string }[] {
  const resolved = new Set(resolvedIds);
  const seeded = new Set(seededThemes);
  return ALL_DECISION_BEATS.filter((b) => !resolved.has(b.id))
    .filter((b) => !b.requiresThema || seeded.has(b.requiresThema))
    .map((b) => ({ id: b.id, vorgriffZeile_de: b.vorgriffZeile_de }));
}
