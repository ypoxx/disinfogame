/**
 * EndReport – vollständige Auswertung nach Spielende.
 * Wird von GameEndScreen aus geöffnet (eigenständige Vollansicht).
 * KEIN Hook-Zugriff – alle Daten kommen als Props herein.
 */

import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { EndingCategory } from '../engine/EndingSystem';

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
  /** Finale Ressourcen */
  finalResources: {
    budget: number;
    risk: number;
    moralWeight: number;
  };
  /** Schließen-Callback */
  onClose: () => void;
}

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
  /** Jahr aus Phasen-Rechnung */
  year: number;
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

    // round → Jahr (Phase/12, aufgerundet)
    const round = trustHistory[i].round;
    const year = Math.max(1, Math.ceil(round / 12));

    pivots.push({
      index: i,
      round,
      delta: Math.abs(delta),
      direction: delta >= 0 ? 'up' : 'down',
      year,
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

  // Amtszeit-Länge
  const years = Math.floor(phasesPlayed / 12);
  const months = phasesPlayed % 12;
  if (years >= 8) {
    paragraphs.push(
      `Die Amtszeit von ${years} Jahren und ${months} Monaten entspricht einer Langzeitoperation. ` +
      'Ausdauer erhöht die kumulative Wirkung, steigert aber auch das Entdeckungsrisiko exponentiell.'
    );
  }

  return paragraphs;
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

  // X-Achsenbeschriftungen: Jahr 1 … Jahr N (bis zu 10)
  const maxYear = Math.max(1, Math.ceil(maxRound / 12));
  const yearLabels: Array<{ x: number; label: string }> = [];
  for (let y = 1; y <= Math.min(maxYear, 10); y++) {
    yearLabels.push({ x: toX(y * 12), label: `J${y}` });
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
      {/* Hintergrund */}
      <rect width={W} height={H} fill={StoryModeColors.background} rx={2} />

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
      {yearLabels.map(({ x, label }) => (
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
        Amtszeit (Jahre)
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
            {/* Balken */}
            <div
              style={{
                height: '16px',
                backgroundColor: StoryModeColors.darkConcrete,
                borderRadius: '2px',
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
  /** Kurze Bedingungsbeschreibung ("wäre eingetreten, wenn …") */
  condition_de: string;
}> = [
  {
    key: 'victory',
    label_de: 'Sieg',
    condition_de: 'alle primären Ziele vor dem letzten Jahr erfüllt waren.',
  },
  {
    key: 'exposure',
    label_de: 'Enthüllung',
    condition_de: 'das Entdeckungsrisiko dauerhaft über 85 % geblieben wäre.',
  },
  {
    key: 'pyrrhic',
    label_de: 'Pyrrhussieg',
    condition_de: 'die Ziele erreicht wurden, aber moralische Last und Risiko kritische Schwellen überstiegen.',
  },
  {
    key: 'escape',
    label_de: 'Flucht',
    condition_de: 'die Operation freiwillig vor der Aufdeckung abgebrochen worden wäre.',
  },
  {
    key: 'collapse',
    label_de: 'Zusammenbruch',
    condition_de: 'Budget und Kapazität gleichzeitig erschöpft wurden.',
  },
  {
    key: 'redemption',
    label_de: 'Wandel',
    condition_de: 'aktiv gegen die eigene Operation vorgegangen worden wäre.',
  },
  {
    key: 'stalemate',
    label_de: 'Patt',
    condition_de: 'weder Ziele erreicht noch aufgedeckt worden wäre und die Zeit abgelaufen wäre.',
  },
  {
    key: 'continuation',
    label_de: 'Fortsetzung',
    condition_de: 'die Operation in eine neue Phase überführt worden wäre.',
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
  finalResources,
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

  const reachedCategory = endTypeToCategory(endType);
  const years = Math.floor(phasesPlayed / 12);
  const months = phasesPlayed % 12;

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
          border: `3px solid ${StoryModeColors.agencyBlue}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
          fontFamily: 'monospace',
        }}
      >
        {/* ── 1. KOPF ── */}
        <div
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderBottom: `3px solid ${StoryModeColors.darkBlue}`,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: StoryModeColors.textSecondary,
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
              color: StoryModeColors.warning,
              margin: '0 0 6px',
            }}
          >
            {endTitle}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: StoryModeColors.textPrimary,
              margin: '0 0 8px',
            }}
          >
            {endNarrative}
          </p>
          <div
            style={{
              fontSize: '11px',
              color: StoryModeColors.textSecondary,
            }}
          >
            Amtszeit:{' '}
            <span style={{ color: StoryModeColors.textPrimary }}>
              {years > 0 ? `${years} Jahr${years !== 1 ? 'e' : ''}` : ''}
              {months > 0 ? ` ${months} Monat${months !== 1 ? 'e' : ''}` : ''}
              {years === 0 && months === 0 ? '< 1 Monat' : ''}
            </span>
            {' · '}
            Aktionen gesamt:{' '}
            <span style={{ color: StoryModeColors.textPrimary }}>
              {completedActionIds.length}
            </span>
            {finalTrustPct !== null && (
              <>
                {' · '}
                Finales Vertrauen:{' '}
                <span style={{ color: StoryModeColors.textPrimary }}>
                  {finalTrustPct} %
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── INHALT ── */}
        <div style={{ padding: '20px 24px' }}>

          {/* ── 2. VERLAUFS-DIAGRAMM ── */}
          <SectionHeading>Vertrauensverlauf</SectionHeading>
          <div
            style={{
              backgroundColor: StoryModeColors.background,
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
                    backgroundColor: StoryModeColors.darkConcrete,
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
                    {Math.round(p.delta * 100)} Pp. — Jahr {p.year}
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
                    backgroundColor: isReached
                      ? StoryModeColors.darkBlue
                      : StoryModeColors.darkConcrete,
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

          {/* ── 6. KOMMENTAR ── */}
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
                fontFamily: 'monospace',
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
