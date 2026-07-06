/**
 * EndReport – vollständige Auswertung nach Spielende.
 * Wird von GameEndScreen aus geöffnet (eigenständige Vollansicht).
 * KEIN Hook-Zugriff – alle Daten kommen als Props herein.
 */

import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { EndingCategory } from '../engine/EndingSystem';
import type { MethodInsight } from '../engine/DisinfoMethodAtlas';

// ============================================
// TYPEN
// ============================================

/** Minimale Beschreibung einer Aktion für die Auswertung */
export interface ActionCatalogEntry {
  id: string;
  label: string;
  legality: 'legal' | 'grey' | 'illegal';
  /** z. B. "ta01", "ta03" etc. */
  phase?: string;
  tags?: string[];
}

export interface EndReportProps {
  /** Spielende-Typ aus GameEndState */
  endType: 'victory' | 'defeat' | 'escape' | 'moral_redemption';
  /** Titel (de) */
  endTitle: string;
  /** Einzeiler-Beschreibung (de) */
  endNarrative: string;
  /** Anzahl gespielter Phasen (1 Phase = 1 Monat) */
  phasesPlayed: number;
  /** IDs aller ausgeführten Aktionen (können mehrfach auftauchen) */
  completedActionIds: string[];
  /** Katalog aller bekannten Aktionen – für Legality-Aufschlüsselung */
  actionsCatalog: ActionCatalogEntry[];
  /** Vertrauensverlauf (je Phase ein Punkt) */
  trustHistory: TrustHistoryPoint[];
  /** Etappe 5: die beiden Rennkurven (Tag · Sonntagsfrage-Fortschritt 0..1 · ABWEHR 0..100). */
  laeuferHistorie?: { day: number; fortschritt: number; abwehr: number }[];
  /** Etappe 5: die Machtwechsel-Schwelle (WIN_THRESHOLD 0..1) für die Sonntagsfrage-Linie. */
  winThreshold?: number;
  /** Finale Ressourcen */
  finalResources: {
    budget: number;
    risk: number;
    moralWeight: number;
  };
  /**
   * Bildungs-Kern (SOUL §5): die realen Desinfo-Methoden hinter den genutzten
   * Mechaniken — aus DisinfoMethodAtlas.classifyMethods(). Optional/rückwärtskompatibel.
   */
  methodsUsed?: MethodInsight[];
  /** Bilanz der P2-Operationen (Schlachtfeld) — optional. */
  operationsSummary?: {
    operationsPlayed: number;
    carriersUsed: string[];
    platformsUsed: string[];
    kompromatAcquired: number;
    carriersBurned: number;
  };
  /**
   * P0-2: state-getriebenes Ende (8 Kategorien × 7 Tonalitäten) aus dem EndingSystem.
   * Optional/rückwärtskompatibel — liefert Spielstil-Bewertung + Wiederspiel-Hinweise.
   */
  endingStyle?: {
    category: string;
    tone: string;
    narrative_de: string;
    replayHints_de: string[];
  };
  /** Schließen-Callback */
  onClose: () => void;
}

/** Deutsche Labels für die EndingSystem-Kategorien/Tonalitäten (P0-2). */
const ENDING_CATEGORY_DE: Record<string, string> = {
  exposure: 'Enttarnung', victory: 'Triumph', pyrrhic: 'Pyrrhussieg', escape: 'Flucht',
  collapse: 'Kollaps', redemption: 'Umkehr', stalemate: 'Patt', continuation: 'Hängepartie',
};
const ENDING_TONE_DE: Record<string, string> = {
  triumphant: 'triumphal', bittersweet: 'bittersüß', tragic: 'tragisch', haunting: 'nachhallend',
  hopeful: 'hoffnungsvoll', dark: 'düster', ambiguous: 'ambivalent',
};

// ============================================
// HILFS-TYPEN
// ============================================

export interface TrustPivot {
  /** Phasenindex im trustHistory-Array */
  index: number;
  /** Spielphase (round) */
  round: number;
  /** Absolutwert des Sprungs */
  delta: number;
  /** Richtung: positiv = Vertrauensgewinn */
  direction: 'up' | 'down';
  /** Kampagnentag des Pivots (Etappe 5: Tage statt Jahre). */
  day: number;
  /** Optionale Ereignis-Beschreibung */
  eventDescription?: string;
}

// ============================================
// PURE HILFSFUNKTIONEN (exportiert → testbar)
// ============================================

/**
 * Berechnet die N größten Sprünge im Vertrauensverlauf.
 * Gibt die Pivots sortiert nach Absolutwert absteigend zurück.
 */
export function findTrustPivots(
  trustHistory: TrustHistoryPoint[],
  topN = 3
): TrustPivot[] {
  if (trustHistory.length < 2) return [];

  const pivots: TrustPivot[] = [];

  for (let i = 1; i < trustHistory.length; i++) {
    const prev = trustHistory[i - 1].averageTrust;
    const curr = trustHistory[i].averageTrust;
    const delta = curr - prev;

    // round = Kampagnentag (Etappe 5).
    const round = trustHistory[i].round;

    pivots.push({
      index: i,
      round,
      delta: Math.abs(delta),
      direction: delta >= 0 ? 'up' : 'down',
      day: round,
      eventDescription: trustHistory[i].event?.description,
    });
  }

  return pivots
    .sort((a, b) => b.delta - a.delta)
    .slice(0, topN);
}

/**
 * Zählt Aktionen nach Legalität.
 * Unbekannte Aktionen (nicht im Katalog) werden als 'grey' gezählt.
 */
export function countByLegality(
  completedActionIds: string[],
  catalog: ActionCatalogEntry[]
): { legal: number; grey: number; illegal: number } {
  const lookup = new Map<string, 'legal' | 'grey' | 'illegal'>();
  catalog.forEach(a => lookup.set(a.id, a.legality));

  const counts = { legal: 0, grey: 0, illegal: 0 };
  completedActionIds.forEach(id => {
    const leg = lookup.get(id) ?? 'grey';
    counts[leg]++;
  });
  return counts;
}

/**
 * Ermittelt die Top-N-Tags (nach Häufigkeit) aus den abgeschlossenen Aktionen.
 */
export function topTags(
  completedActionIds: string[],
  catalog: ActionCatalogEntry[],
  topN = 5
): Array<{ tag: string; count: number }> {
  const lookup = new Map<string, ActionCatalogEntry>();
  catalog.forEach(a => lookup.set(a.id, a));

  const tagCounts = new Map<string, number>();
  completedActionIds.forEach(id => {
    const entry = lookup.get(id);
    if (!entry?.tags) return;
    entry.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([tag, count]) => ({ tag, count }));
}

/**
 * Erzeugt aus den Spielerdaten kommentierte Absätze (sachlicher Ton, kein Urteil).
 */
export function generateCommentParagraphs(params: {
  illegalCount: number;
  totalActions: number;
  trustHistory: TrustHistoryPoint[];
  finalRisk: number;
  finalMoralWeight: number;
  phasesPlayed: number;
  endType: string;
}): string[] {
  const {
    illegalCount,
    totalActions,
    trustHistory,
    finalRisk,
    finalMoralWeight,
    phasesPlayed,
    endType,
  } = params;

  const paragraphs: string[] = [];

  // Aktionsstil
  if (totalActions === 0) {
    paragraphs.push(
      'In dieser Amtszeit wurden keine Aktionen protokolliert — das Spielfeld blieb unberührt.'
    );
  } else {
    const illegalRate = illegalCount / totalActions;
    if (illegalRate > 0.5) {
      paragraphs.push(
        `Mehr als die Hälfte der eingesetzten Aktionen (${Math.round(illegalRate * 100)} %) ` +
        'lagen außerhalb des legalen Rahmens. ' +
        'Hoch-Risiko-Strategien erhöhen kurzfristig die operative Schlagkraft, ' +
        'erzeugen jedoch akkumulierte Exposition gegenüber Gegenmaßnahmen.'
      );
    } else if (illegalRate > 0.25) {
      paragraphs.push(
        `Ein wesentlicher Anteil der Maßnahmen (${Math.round(illegalRate * 100)} %) ` +
        'bewegte sich in der Grauzone oder überschritt den legalen Rahmen. ' +
        'Diese Mischstrategie ist in realen Desinformationskampagnen häufig anzutreffen.'
      );
    } else {
      paragraphs.push(
        'Die gewählten Aktionen blieben überwiegend im formell legalen Bereich. ' +
        'Legale Operationen sind schwerer zu exponieren, begrenzen jedoch die direkten Effekte.'
      );
    }
  }

  // Vertrauensverlauf
  if (trustHistory.length >= 2) {
    const firstTrust = trustHistory[0].averageTrust;
    const lastTrust = trustHistory[trustHistory.length - 1].averageTrust;
    const change = lastTrust - firstTrust;
    const changePercent = Math.round(Math.abs(change) * 100);

    if (change < -0.3) {
      paragraphs.push(
        `Das gesellschaftliche Vertrauen sank im Verlauf der Amtszeit um ${changePercent} Prozentpunkte. ` +
        'Starke Vertrauenseinbrüche korrelieren in der Forschung mit erhöhter Anfälligkeit ' +
        'für weitere Desinformationsnarrative — ein Kaskadeneffekt.'
      );
    } else if (change < 0) {
      paragraphs.push(
        `Das Vertrauen verringerte sich moderat um ${changePercent} Prozentpunkte. ` +
        'Solche graduellen Verschiebungen sind in der Öffentlichkeit kaum wahrnehmbar, ' +
        'kumulieren sich jedoch über längere Zeiträume.'
      );
    } else if (change > 0.1) {
      paragraphs.push(
        `Das Vertrauen stieg trotz der Operationen um ${changePercent} Prozentpunkte — ` +
        'ein unerwartetes Ergebnis, das auf Gegenmaßnahmen oder zufällige Ereignisse hinweisen kann.'
      );
    }
  }

  // Risikoprofil
  if (finalRisk > 75) {
    paragraphs.push(
      `Das Entdeckungsrisiko erreichte ${Math.round(finalRisk)} % — ein kritischer Wert. ` +
      'In realen Operationen markiert dieser Bereich üblicherweise den Beginn aktiver Strafverfolgung.'
    );
  } else if (finalRisk > 40) {
    paragraphs.push(
      `Mit einem abschließenden Risikowert von ${Math.round(finalRisk)} % ' +
      'befand sich die Operation in der Beobachtungszone. ` +
      'Investigative Strukturen nehmen ab diesem Schwellenwert gezielt Ermittlungen auf.'
    );
  }

  // Spielende-Kontext
  const endContextMap: Record<string, string> = {
    victory:
      'Das erreichte Ende entspricht dem vollständigen Abschluss der Missionsziele. ' +
      'In historischen Fallstudien endet ein großer Teil solcher Operationen erst durch externe Faktoren.',
    defeat:
      'Die Aufdeckung ist das häufigste Ende realer Desinformationsoperationen. ' +
      'Faktenchecker-Netzwerke, Whistleblower und investigativer Journalismus spielen dabei eine zentrale Rolle.',
    escape:
      'Das Ausscheiden vor Aufdeckung dokumentiert ein bekanntes Muster: ' +
      'viele Akteure beenden Operationen selbst, sobald das Risiko zu groß wird.',
    moral_redemption:
      'Whistleblowing aus laufenden Desinformationsoperationen ist selten, ' +
      'aber historisch belegt — mit erheblichen persönlichen Konsequenzen für die Beteiligten.',
  };
  const endContext = endContextMap[endType];
  if (endContext) paragraphs.push(endContext);

  // Kampagnen-Länge (Etappe 2: Tage statt Jahre — die Wahlkampagne läuft ~40 Tage).
  if (phasesPlayed >= 30) {
    paragraphs.push(
      `Die Operation lief ${phasesPlayed} Tage bis zum Wahltag. ` +
      'Jeder zusätzliche Tag erhöht die kumulative Wirkung, steigert aber auch das Entdeckungsrisiko.'
    );
  }

  return paragraphs;
}

/** Ampelfarbe für die Methoden-Schwere. */
export function severityColor(severity: string): string {
  if (severity === 'hoch') return StoryModeColors.danger;
  if (severity === 'mittel') return StoryModeColors.warning;
  return StoryModeColors.militaryOlive;
}

// ============================================
// BILDUNGS-ABSCHNITT — reale Methoden hinter den Mechaniken (SOUL §5)
// ============================================

interface MethodsSectionProps {
  methods: MethodInsight[];
  operationsSummary?: EndReportProps['operationsSummary'];
}

/**
 * Der eigentliche Lernmoment: was der Spieler tat → die reale Desinfo-Methode
 * dahinter, samt dokumentiertem Fall. Bewusst breit (das Kompromat-Schlachtfeld
 * ist nur eine von vielen Familien).
 */
function MethodsSection({ methods, operationsSummary }: MethodsSectionProps) {
  const ops = operationsSummary;
  const hasOps = !!ops && ops.operationsPlayed > 0;
  // P4-Politur: die in abgeschlossenen Episoden vermittelten Lernmomente explizit ausweisen.
  const episodeLearnings = methods.filter((m) => m.fromEpisode);

  return (
    <>
      <p
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: StoryModeColors.textSecondary,
          margin: '0 0 12px',
        }}
      >
        Jede Mechanik in diesem Spiel bildet eine reale Methode der Desinformation ab.
        Das ist der eigentliche Zweck: Wer die Muster hier erkennt, erkennt sie auch draußen.
      </p>

      {episodeLearnings.length > 0 && (
        <div
          style={{
            // Helle Karteikarte statt Kraftpapier — Tinten-Text bleibt lesbar (§4.7 Regel 3).
            backgroundColor: StoryModeColors.surfaceLight,
            border: `1px solid ${StoryModeColors.agencyBlue}`,
            borderLeft: `3px solid ${StoryModeColors.agencyBlue}`,
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '11px',
            color: StoryModeColors.textSecondary,
          }}
        >
          <span style={{ color: StoryModeColors.agencyBlue, fontWeight: 'bold' }}>
            ★ Lernmomente aus Ihren Episoden:{' '}
          </span>
          {episodeLearnings.map((m) => m.label_de).join(' · ')}
          <div style={{ marginTop: '4px', color: StoryModeColors.textMuted }}>
            Diese Methoden hat Ihnen eine durchgespielte Episode konkret vor Augen geführt
            (unten mit ★ markiert).
          </div>
        </div>
      )}

      {hasOps && (
        <div
          style={{
            // Helle Karteikarte statt Kraftpapier (§4.7 Regel 3).
            backgroundColor: StoryModeColors.surfaceLight,
            border: `1px solid ${StoryModeColors.borderLight}`,
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '11px',
            color: StoryModeColors.textSecondary,
          }}
        >
          <span style={{ color: StoryModeColors.warning, fontWeight: 'bold' }}>Schlachtfeld-Bilanz: </span>
          {ops!.operationsPlayed} Operation{ops!.operationsPlayed !== 1 ? 'en' : ''} ·{' '}
          {ops!.carriersUsed.length} Verbreiter genutzt ·{' '}
          {ops!.kompromatAcquired}× Kompromat beschafft
          {ops!.carriersBurned > 0 && (
            <span style={{ color: StoryModeColors.danger }}>
              {' '}· {ops!.carriersBurned} Verbreiter aufgeflogen
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {methods.map((m) => (
          <div
            key={m.id}
            style={{
              // Helle Karteikarte statt dunklem Kraftpapier (§4.7 Regel 3).
              backgroundColor: StoryModeColors.surfaceLight,
              border: `1px solid ${StoryModeColors.borderLight}`,
              borderLeft: `3px solid ${severityColor(m.severity)}`,
              padding: '10px 12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: StoryModeColors.textPrimary }}>
                {m.fromEpisode && (
                  <span title="Lernmoment aus einer abgeschlossenen Episode" style={{ color: StoryModeColors.agencyBlue }}>★ </span>
                )}
                {m.label_de}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: severityColor(m.severity),
                  border: `1px solid ${severityColor(m.severity)}`,
                  padding: '1px 5px',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.severity}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: StoryModeColors.warning, margin: '3px 0 6px', fontStyle: 'italic' }}>
              Reale Methode: {m.real_method_de}
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.55', color: StoryModeColors.textPrimary, margin: '0 0 6px' }}>
              {m.what_de}
            </p>
            <p style={{ fontSize: '11px', lineHeight: '1.5', color: StoryModeColors.textSecondary, margin: '0 0 4px' }}>
              <span style={{ color: StoryModeColors.textMuted }}>Dokumentiert: </span>
              {m.real_case_de}
            </p>
            {/* P7/B4 — Resilienz-Geländer: „So wäre es erkannt/gekontert worden." */}
            {m.counter_de && (
              <p
                style={{
                  fontSize: '11px',
                  lineHeight: '1.5',
                  color: StoryModeColors.agencyBlue,
                  margin: '0 0 4px',
                  paddingLeft: '8px',
                  borderLeft: `2px solid ${StoryModeColors.agencyBlue}`,
                }}
              >
                <span style={{ fontWeight: 700 }}>So wäre es gekontert worden: </span>
                {m.counter_de}
              </p>
            )}
            <div style={{ fontSize: '10px', color: StoryModeColors.textMuted }}>
              Erkannt an: {m.evidence_de}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================
// SVG LINIENDIAGRAMM – DAS RENNEN (Etappe 5, Zielbild §10)
// ============================================

/**
 * Die beiden Rennkurven über die Kampagne: die SONNTAGSFRAGE (unser Läufer, steigt
 * Richtung Machtwechsel-Schwelle) und die ABWEHR (der Gegner, holt auf). Wer die eigene
 * Linie zuerst über die Schwelle bringt, bevor die Abwehr 100 erreicht, gewinnt das Rennen.
 */
function RennenChart({
  historie, winThreshold,
}: { historie: { day: number; fortschritt: number; abwehr: number }[]; winThreshold: number }) {
  const W = 560, H = 220;
  const PAD = { top: 16, right: 40, bottom: 40, left: 40 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  if (historie.length < 2) {
    return (
      <div style={{ color: StoryModeColors.textSecondary, padding: '1rem' }}>
        Nicht genug Datenpunkte für das Rennen.
      </div>
    );
  }
  const maxDay = Math.max(...historie.map((p) => p.day), 1);
  const toX = (day: number) => PAD.left + (day / maxDay) * cW;
  const toY = (frac: number) => PAD.top + cH - Math.max(0, Math.min(1, frac)) * cH; // 0..1
  // Sonntagsfrage = fortschritt (0..1); ABWEHR = abwehr/100 (0..1).
  const sfPath = 'M ' + historie.map((p) => `${toX(p.day)},${toY(p.fortschritt)}`).join(' L ');
  const abPath = 'M ' + historie.map((p) => `${toX(p.day)},${toY(p.abwehr / 100)}`).join(' L ');
  const schwelleY = toY(Math.max(0, Math.min(1, winThreshold)));
  const dayStep = maxDay > 20 ? 10 : 5;
  const dayLabels: number[] = [];
  for (let d = dayStep; d <= maxDay; d += dayStep) dayLabels.push(d);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%', display: 'block' }} aria-label="Das Rennen: Sonntagsfrage gegen Abwehr">
      {/* Papier-Diagrammfläche: Tinten-Linien/-Beschriftungen sind auf Kraftpapier unlesbar (§4.7 Regel 3). */}
      <rect width={W} height={H} fill={StoryModeColors.surfaceLight} />
      {/* Schwelle (Sieglinie der Sonntagsfrage) */}
      <line x1={PAD.left} y1={schwelleY} x2={PAD.left + cW} y2={schwelleY} stroke={StoryModeColors.success} strokeWidth={1.2} strokeDasharray="6 3" />
      <text x={PAD.left + cW + 2} y={schwelleY + 4} fontSize={9} fill={StoryModeColors.success}>Ziel</text>
      {/* Abwehr-100-Linie (Verlustlinie) = oben (frac 1.0) */}
      <text x={PAD.left + cW + 2} y={toY(1) + 4} fontSize={9} fill={StoryModeColors.danger}>100</text>
      {/* ABWEHR (Gegner) */}
      <path d={abPath} fill="none" stroke={StoryModeColors.tech} strokeWidth={2} strokeLinejoin="round" />
      {/* SONNTAGSFRAGE (wir) */}
      <path d={sfPath} fill="none" stroke={StoryModeColors.ministryRed} strokeWidth={2.4} strokeLinejoin="round" />
      {/* X-Achse */}
      <line x1={PAD.left} y1={PAD.top + cH} x2={PAD.left + cW} y2={PAD.top + cH} stroke={StoryModeColors.borderLight} strokeWidth={1} />
      {dayLabels.map((d) => (
        <text key={d} x={toX(d)} y={PAD.top + cH + 14} textAnchor="middle" fontSize={10} fill={StoryModeColors.textMuted}>T{d}</text>
      ))}
      {/* Legende */}
      <text x={PAD.left} y={PAD.top + 2} fontSize={10} fill={StoryModeColors.ministryRed}>■ Sonntagsfrage</text>
      <text x={PAD.left + 120} y={PAD.top + 2} fontSize={10} fill={StoryModeColors.danger}>■ Abwehr</text>
    </svg>
  );
}

// ============================================
// SVG LINIENDIAGRAMM – Vertrauensverlauf
// ============================================

interface TrustLineChartProps {
  trustHistory: TrustHistoryPoint[];
}

function TrustLineChart({ trustHistory }: TrustLineChartProps) {
  // Diagramm-Dimensionen
  const W = 560;
  const H = 220;
  const PAD = { top: 16, right: 16, bottom: 40, left: 48 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  if (trustHistory.length < 2) {
    return (
      <div style={{ color: StoryModeColors.textSecondary, padding: '1rem' }}>
        Nicht genug Datenpunkte für Diagramm.
      </div>
    );
  }

  // Skalierung: X = Runde, Y = averageTrust (0..1)
  const maxRound = Math.max(...trustHistory.map(p => p.round), 1);
  const toX = (round: number) => PAD.left + (round / maxRound) * cW;
  const toY = (trust: number) => PAD.top + cH - trust * cH;

  // Pfad-Daten
  const points = trustHistory.map(p => `${toX(p.round)},${toY(p.averageTrust)}`);
  const pathD = `M ${points.join(' L ')}`;

  // Fläche unterhalb
  const areaD =
    `M ${toX(trustHistory[0].round)},${PAD.top + cH} ` +
    `L ${points.join(' L ')} ` +
    `L ${toX(trustHistory[trustHistory.length - 1].round)},${PAD.top + cH} Z`;

  // Schwellenlinie bei 40 % (trust = 0.4)
  const thresholdY = toY(0.4);

  // X-Achsenbeschriftungen: Kampagnentage (Etappe 5 — die Achse ist der Wahlkampf,
  // nicht mehr „Jahre"; round = Tag 1..Wahltag).
  const dayLabels: Array<{ x: number; label: string }> = [];
  const dayStep = maxRound > 20 ? 10 : 5;
  for (let d = dayStep; d <= maxRound; d += dayStep) {
    dayLabels.push({ x: toX(d), label: `T${d}` });
  }

  // Y-Achsenbeschriftungen: 0 %, 50 %, 100 %
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ maxWidth: '100%', display: 'block' }}
      aria-label="Vertrauensverlauf über die Amtszeit"
    >
      {/* Hintergrund — Papier-Diagrammfläche (§4.7 Regel 3). */}
      <rect width={W} height={H} fill={StoryModeColors.surfaceLight} />

      {/* Y-Rasterlinien */}
      {yTicks.map(v => (
        <line
          key={v}
          x1={PAD.left}
          y1={toY(v)}
          x2={PAD.left + cW}
          y2={toY(v)}
          stroke={StoryModeColors.borderLight}
          strokeWidth={0.5}
          strokeDasharray="4 4"
        />
      ))}

      {/* Y-Beschriftungen */}
      {yTicks.map(v => (
        <text
          key={v}
          x={PAD.left - 6}
          y={toY(v) + 4}
          textAnchor="end"
          fontSize={10}
          fill={StoryModeColors.textMuted}
        >
          {Math.round(v * 100)}%
        </text>
      ))}

      {/* Schwellenlinie 40 % */}
      <line
        x1={PAD.left}
        y1={thresholdY}
        x2={PAD.left + cW}
        y2={thresholdY}
        stroke={StoryModeColors.danger}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />
      <text
        x={PAD.left + cW + 2}
        y={thresholdY + 4}
        fontSize={9}
        fill={StoryModeColors.danger}
      >
        40%
      </text>

      {/* Fläche */}
      <path
        d={areaD}
        fill={StoryModeColors.agencyBlue}
        fillOpacity={0.18}
      />

      {/* Linie */}
      <path
        d={pathD}
        fill="none"
        stroke={StoryModeColors.warning}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Datenpunkte */}
      {trustHistory.map((p, i) => (
        <circle
          key={i}
          cx={toX(p.round)}
          cy={toY(p.averageTrust)}
          r={p.event ? 4 : 2}
          fill={p.event ? StoryModeColors.danger : StoryModeColors.warning}
          stroke={StoryModeColors.background}
          strokeWidth={1}
        />
      ))}

      {/* X-Achse */}
      <line
        x1={PAD.left}
        y1={PAD.top + cH}
        x2={PAD.left + cW}
        y2={PAD.top + cH}
        stroke={StoryModeColors.borderLight}
        strokeWidth={1}
      />

      {/* X-Beschriftungen */}
      {dayLabels.map(({ x, label }) => (
        <text
          key={label}
          x={x}
          y={PAD.top + cH + 14}
          textAnchor="middle"
          fontSize={10}
          fill={StoryModeColors.textMuted}
        >
          {label}
        </text>
      ))}

      {/* Achsentitel */}
      <text
        x={PAD.left + cW / 2}
        y={H - 2}
        textAnchor="middle"
        fontSize={10}
        fill={StoryModeColors.textSecondary}
      >
        Kampagne (Tage)
      </text>
      <text
        x={10}
        y={PAD.top + cH / 2}
        textAnchor="middle"
        fontSize={10}
        fill={StoryModeColors.textSecondary}
        transform={`rotate(-90, 10, ${PAD.top + cH / 2})`}
      >
        Vertrauen
      </text>
    </svg>
  );
}

// ============================================
// HORIZONTALE BALKEN (Legality-Aufschlüsselung)
// ============================================

interface LegalityBarsProps {
  legal: number;
  grey: number;
  illegal: number;
}

function LegalityBars({ legal, grey, illegal }: LegalityBarsProps) {
  const total = legal + grey + illegal || 1;

  const bars: Array<{ label: string; count: number; color: string }> = [
    { label: 'Legal', count: legal, color: StoryModeColors.militaryOlive },
    { label: 'Grauzone', count: grey, color: StoryModeColors.warning },
    { label: 'Illegal', count: illegal, color: StoryModeColors.danger },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {bars.map(bar => {
        const pct = Math.round((bar.count / total) * 100);
        return (
          <div key={bar.label}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2px',
                fontSize: '12px',
                color: StoryModeColors.textSecondary,
              }}
            >
              <span>{bar.label}</span>
              <span style={{ color: bar.color }}>
                {bar.count} ({pct} %)
              </span>
            </div>
            {/* Balken — Papier-Träger: die Tinten-Füllungen (Oliv/Gelbbraun/Rot) sind
                auf Kraftpapier nicht mehr unterscheidbar (§4.7 Regel 3). */}
            <div
              style={{
                height: '16px',
                backgroundColor: StoryModeColors.oldPaper,
                borderRadius: 0,
                overflow: 'hidden',
                border: `1px solid ${StoryModeColors.borderLight}`,
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: bar.color,
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// ENDING-KATEGORIEN (alle 8 aus EndingSystem)
// ============================================

const ALL_ENDING_CATEGORIES: Array<{
  key: EndingCategory;
  label_de: string;
  /** Kurze Bedingungsbeschreibung ("wäre eingetreten, wenn …") — entspricht der echten
   *  Klassifikation in EndingSystem.determineCategory (P1-10: an die reale Logik angeglichen). */
  condition_de: string;
}> = [
  {
    key: 'victory',
    label_de: 'Sieg',
    condition_de: 'Sie fast alle Ziele (mind. 80 %) bei niedrigem Entdeckungsrisiko (unter 50 %) erreicht hätten.',
  },
  {
    key: 'exposure',
    label_de: 'Enthüllung',
    condition_de: 'das Entdeckungsrisiko 90 % erreicht hätte — die Ermittler hätten Sie.',
  },
  {
    key: 'pyrrhic',
    label_de: 'Pyrrhussieg',
    condition_de: 'Sie die meisten Ziele (mind. 60 %) erreicht, dabei aber eine schwere moralische Last (ab 60) aufgehäuft hätten.',
  },
  {
    key: 'escape',
    label_de: 'Flucht',
    condition_de: 'Sie sich bei hohem Risiko (70–90 %) mit noch gefüllter Kasse (Budget ab 30) rechtzeitig abgesetzt hätten.',
  },
  {
    key: 'collapse',
    label_de: 'Zusammenbruch',
    condition_de: 'das Wettrüsten eskaliert (Stufe 4+) und die Gegenseite zugleich übermächtig geworden wäre (mind. 4 aktive Verteidiger).',
  },
  {
    key: 'redemption',
    label_de: 'Wandel',
    condition_de: 'Sie überwiegend sauber gespielt (mehr ethische als illegale Aktionen) und die moralische Last sehr niedrig (unter 20) gehalten hätten.',
  },
  {
    key: 'stalemate',
    label_de: 'Patt',
    condition_de: 'Sie nur Teilerfolge erzielt hätten (mindestens ein Ziel, aber unter 60 %) — das große Ziel verfehlt.',
  },
  {
    key: 'continuation',
    label_de: 'Fortsetzung',
    condition_de: 'die Operation ergebnislos ausgelaufen wäre — kein Ziel erreicht, aber auch nicht enttarnt.',
  },
];

// Mapping GameEndState.type → EndingCategory
function endTypeToCategory(endType: string): EndingCategory {
  const map: Record<string, EndingCategory> = {
    victory: 'victory',
    defeat: 'exposure',
    escape: 'escape',
    moral_redemption: 'redemption',
  };
  return map[endType] ?? 'stalemate';
}

// ============================================
// ABSCHNITTSÜBERSCHRIFT
// ============================================

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: '13px',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: StoryModeColors.warning,
        borderBottom: `1px solid ${StoryModeColors.borderLight}`,
        paddingBottom: '4px',
        marginBottom: '12px',
        marginTop: '24px',
      }}
    >
      {children}
    </h2>
  );
}

// ============================================
// HAUPTKOMPONENTE
// ============================================

export function EndReport({
  endType,
  endTitle,
  endNarrative,
  phasesPlayed,
  completedActionIds,
  actionsCatalog,
  trustHistory,
  laeuferHistorie,
  winThreshold,
  finalResources,
  methodsUsed,
  operationsSummary,
  endingStyle,
  onClose,
}: EndReportProps) {
  const [expanded, setExpanded] = useState(true);

  // Berechnungen
  const legalityCounts = countByLegality(completedActionIds, actionsCatalog);
  const pivots = findTrustPivots(trustHistory, 3);
  const tags = topTags(completedActionIds, actionsCatalog, 5);
  const comments = generateCommentParagraphs({
    illegalCount: legalityCounts.illegal,
    totalActions: completedActionIds.length,
    trustHistory,
    finalRisk: finalResources.risk,
    finalMoralWeight: finalResources.moralWeight,
    phasesPlayed,
    endType,
  });

  // P1-10: die TATSÄCHLICH erreichte Stil-Kategorie (aus dem EndingSystem, via endingStyle)
  // markieren — nicht die grobe 4-Typ-Näherung. Fallback auf die Typ-Zuordnung.
  const reachedCategory = (endingStyle?.category as EndingCategory | undefined) ?? endTypeToCategory(endType);

  const finalTrustPct =
    trustHistory.length > 0
      ? Math.round(trustHistory[trustHistory.length - 1].averageTrust * 100)
      : null;

  return (
    // Overlay
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '24px 16px',
        zIndex: 200,
      }}
    >
      {/* Bericht-Container */}
      <div
        style={{
          maxWidth: '720px',
          width: '100%',
          backgroundColor: StoryModeColors.surface,
          border: `3px solid ${StoryModeColors.border}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
          fontFamily: "'VT323', monospace",
        }}
      >
        {/* ── 1. KOPF ── Kraftpapier-Kopfband (§4.7) statt Groß-Blau (Vision-Review E2):
            das Blau las sich als Web-App-Header, Kraftband + helle Schrift = Akte. */}
        <div
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderBottom: `3px solid ${StoryModeColors.border}`,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: StoryModeColors.lightConcrete,
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Abschluss-Bericht — Vertraulich
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: StoryModeColors.surfaceLight,
              margin: '0 0 6px',
            }}
          >
            {endTitle}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: StoryModeColors.document,
              margin: '0 0 8px',
            }}
          >
            {endNarrative}
          </p>
          <div
            style={{
              fontSize: '11px',
              color: StoryModeColors.lightConcrete,
            }}
          >
            Kampagne:{' '}
            <span style={{ color: StoryModeColors.surfaceLight }}>
              {`${phasesPlayed} ${phasesPlayed === 1 ? 'Tag' : 'Tage'} bis zum Wahltag`}
            </span>
            {' · '}
            Aktionen gesamt:{' '}
            <span style={{ color: StoryModeColors.surfaceLight }}>
              {completedActionIds.length}
            </span>
            {finalTrustPct !== null && (
              <>
                {' · '}
                Finales Vertrauen:{' '}
                <span style={{ color: StoryModeColors.surfaceLight }}>
                  {finalTrustPct} %
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── INHALT ── */}
        <div style={{ padding: '20px 24px' }}>

          {/* ── P0-2: SPIELSTIL-BEWERTUNG (state-getriebenes Ende) ── */}
          {endingStyle && (
            <>
              <SectionHeading>Spielstil-Bewertung</SectionHeading>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  ENDING_CATEGORY_DE[endingStyle.category] ?? endingStyle.category,
                  ENDING_TONE_DE[endingStyle.tone] ?? endingStyle.tone,
                ].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: StoryModeColors.textPrimary,
                      // Heller Stempel-Chip statt Kraftpapier — Tinte bleibt lesbar (§4.7).
                      backgroundColor: StoryModeColors.surfaceLight,
                      border: `1px solid ${StoryModeColors.borderLight}`,
                      padding: '2px 8px',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              {endingStyle.narrative_de && (
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: StoryModeColors.textPrimary,
                    whiteSpace: 'pre-line',
                    margin: '0 0 8px',
                  }}
                >
                  {endingStyle.narrative_de}
                </p>
              )}
              {endingStyle.replayHints_de.length > 0 && (
                <div
                  style={{
                    // Helle Karteikarte statt Kraftpapier (§4.7 Regel 3).
                    backgroundColor: StoryModeColors.surfaceLight,
                    border: `1px solid ${StoryModeColors.borderLight}`,
                    padding: '8px 10px',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: StoryModeColors.textSecondary,
                      marginBottom: '4px',
                    }}
                  >
                    Beim nächsten Mal
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {endingStyle.replayHints_de.map((hint, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '11px',
                          color: StoryModeColors.textPrimary,
                          marginBottom: '2px',
                        }}
                      >
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ── 2a. DAS RENNEN (Etappe 5): die beiden Läufer über die Kampagne ── */}
          {laeuferHistorie && laeuferHistorie.length >= 2 && (
            <>
              <SectionHeading>Das Rennen</SectionHeading>
              <div
                style={{
                  // Papier-Träger passend zur hellen Diagrammfläche (§4.7 Regel 3).
                  backgroundColor: StoryModeColors.surfaceLight,
                  border: `1px solid ${StoryModeColors.borderLight}`,
                  padding: '8px',
                  marginBottom: '4px',
                }}
              >
                <RennenChart historie={laeuferHistorie} winThreshold={winThreshold ?? 0.6} />
              </div>
              <p style={{ fontSize: '10px', color: StoryModeColors.textMuted, margin: '4px 0 12px' }}>
                Ihre Sonntagsfrage gegen die Abwehr der Gesellschaft. Wer zuerst durchs Ziel geht, entscheidet den Wahlabend.
              </p>
            </>
          )}

          {/* ── 2. VERLAUFS-DIAGRAMM ── */}
          <SectionHeading>Vertrauensverlauf</SectionHeading>
          <div
            style={{
              // Papier-Träger passend zur hellen Diagrammfläche (§4.7 Regel 3).
              backgroundColor: StoryModeColors.surfaceLight,
              border: `1px solid ${StoryModeColors.borderLight}`,
              padding: '8px',
              marginBottom: '4px',
            }}
          >
            <TrustLineChart trustHistory={trustHistory} />
          </div>
          <p
            style={{
              fontSize: '10px',
              color: StoryModeColors.textMuted,
              margin: '4px 0 0',
            }}
          >
            Rote gestrichelte Linie: kritischer Schwellenwert 40 %.
            Gefüllte Punkte markieren protokollierte Ereignisse.
          </p>

          {/* ── 3. AKTIONSBILANZ ── */}
          <SectionHeading>Aktions-Bilanz</SectionHeading>
          <LegalityBars
            legal={legalityCounts.legal}
            grey={legalityCounts.grey}
            illegal={legalityCounts.illegal}
          />

          {tags.length > 0 && (
            <>
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '11px',
                  color: StoryModeColors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                Top-Kategorien (nach Tag-Häufigkeit)
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: StoryModeColors.textPrimary,
                  fontSize: '12px',
                  lineHeight: '1.7',
                }}
              >
                {tags.map(({ tag, count }) => (
                  <li key={tag}>
                    <span style={{ color: StoryModeColors.warning }}>{tag}</span>
                    {' — '}
                    {count}×
                  </li>
                ))}
              </ol>
            </>
          )}

          {/* ── 4. WENDEPUNKTE ── */}
          <SectionHeading>Schlüsselmomente</SectionHeading>
          {pivots.length === 0 ? (
            <p style={{ color: StoryModeColors.textSecondary, fontSize: '12px' }}>
              Keine signifikanten Vertrauenssprünge erkannt.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pivots.map((p, i) => (
                <div
                  key={i}
                  style={{
                    // Helle Karteikarte statt Kraftpapier — Akzent-/Tinten-Text bleibt lesbar (§4.7 Regel 3).
                    backgroundColor: StoryModeColors.surfaceLight,
                    border: `1px solid ${p.direction === 'down' ? StoryModeColors.danger : StoryModeColors.militaryOlive}`,
                    padding: '8px 12px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: p.direction === 'down' ? StoryModeColors.danger : StoryModeColors.militaryOlive,
                      marginBottom: '2px',
                    }}
                  >
                    {p.direction === 'down' ? '▼' : '▲'}{' '}
                    {Math.round(p.delta * 100)} Pp. — Tag {p.day}
                  </div>
                  {p.eventDescription && (
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      {p.eventDescription}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── 5. VERPASSTE ENDEN ── */}
          <SectionHeading>Mögliche Spielenden</SectionHeading>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
            }}
          >
            {ALL_ENDING_CATEGORIES.map(cat => {
              const isReached = cat.key === reachedCategory;
              return (
                <div
                  key={cat.key}
                  style={{
                    // Papierkarten statt dunkler Kacheln (§4.7 Regel 3); das erreichte Ende
                    // hebt sich als hellere Karte mit Marker-Rand ab.
                    backgroundColor: isReached
                      ? StoryModeColors.surfaceLight
                      : StoryModeColors.surface,
                    border: `1px solid ${isReached ? StoryModeColors.warning : StoryModeColors.borderLight}`,
                    padding: '8px 10px',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: isReached ? StoryModeColors.warning : StoryModeColors.textPrimary,
                      marginBottom: '3px',
                    }}
                  >
                    {isReached ? '✓ ' : '○ '}
                    {cat.label_de}
                    {isReached && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: StoryModeColors.textSecondary,
                          fontWeight: 'normal',
                          marginLeft: '4px',
                        }}
                      >
                        (erreicht)
                      </span>
                    )}
                  </div>
                  <div style={{ color: StoryModeColors.textMuted }}>
                    … wenn {cat.condition_de}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 6. REALE METHODEN (Bildungs-Kern, SOUL §5) ── */}
          {methodsUsed && methodsUsed.length > 0 && (
            <>
              <SectionHeading>Reale Methoden hinter Ihren Mechaniken</SectionHeading>
              <MethodsSection methods={methodsUsed} operationsSummary={operationsSummary} />
            </>
          )}

          {/* ── 7. KOMMENTAR ── */}
          <SectionHeading>Einordnung</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((para, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontSize: '13px',
                  lineHeight: '1.65',
                  color: StoryModeColors.textPrimary,
                  borderLeft: `3px solid ${StoryModeColors.agencyBlue}`,
                  paddingLeft: '12px',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* ── 7. FUSSZEILE ── */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '16px',
              borderTop: `1px solid ${StoryModeColors.borderLight}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: StoryModeColors.textMuted,
                margin: '0 0 16px',
              }}
            >
              Dieses Spiel dient dem Verständnis von Desinformationstaktiken.
            </p>
            <button
              onClick={onClose}
              style={{
                backgroundColor: StoryModeColors.concrete,
                border: `2px solid ${StoryModeColors.borderLight}`,
                color: StoryModeColors.textPrimary,
                padding: '10px 28px',
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
                fontFamily: "'VT323', monospace",
              }}
            >
              BERICHT SCHLIESSEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EndReport;
