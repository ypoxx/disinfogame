import { useEffect } from 'react';
import { StoryModeColors } from '../theme';
import { MOOD_LABEL_DE, type Mood } from '../audience/audienceModel';
import type { NightReport } from '../engine/ImmuneSystem';
import type { TrancheResult } from '../engine/Finanzen';

// ============================================
// TAGESFAZIT / "LAGEBERICHT" (K1, A4) — der A4-Pflichtmoment
// ============================================
// Vollbild-Overlay nach Tagesende, VOR dem nächsten Tag. Pixel/Brutalist,
// dunkel, Letterbox-Gefühl. Drei Blöcke: ① was wir ausspielten, ② das Land,
// ③ die Gegenseite. Unten: Kennzahlen + Vertrauens-Balken + "NÄCHSTER TAG".
// Stagger-Einblendung; prefers-reduced-motion wird global (index.css) respektiert.

interface AudienceSegment {
  label: string;
  belief: number; // 0–100
  mood: string;
}

interface DayReportProps {
  phase: number;
  headline: string | null;
  tierLabel: string | null;
  audienceSegments: AudienceSegment[];
  counterHeadlines: string[];
  resources: { risk: number; budget: number; attention: number };
  trustProgress: number; // 0–100 (Ministerium Institutionen)
  /** Etappe 3 Paket D: Nacht-Transparenz — null an Tag 1 (keine Nacht vergangen). */
  nightReport?: NightReport | null;
  /** Etappe 5 (E18): projizierte Tranche der Zentrale für die kommende Nacht (sonst null). */
  tranchePreview?: TrancheResult | null;
  onNextDay: () => void;
}

/** Rundet auf eine Nachkommastelle, deutsches Komma statt Punkt (Stempel-Ästhetik). */
function formatDe(n: number): string {
  return n.toFixed(1).replace('.', ',');
}

/** Spalten-Block mit Brutalist-Rahmen + Stagger-Index für die Einblendung. */
function ReportColumn({
  title,
  index,
  children,
}: {
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex-1 border-2 p-4 animate-fade-in"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        // Stagger: jeder Block 120ms später.
        animationDelay: `${index * 0.12}s`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <h3
        className="text-sm font-bold uppercase tracking-wider mb-3 pb-2 border-b-2"
        style={{ color: StoryModeColors.warning, borderColor: StoryModeColors.borderLight }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Kennzahl in der Fußzeile. */
function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase" style={{ color: StoryModeColors.textSecondary }}>
        {label}
      </div>
      <div className="text-lg font-bold font-mono" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

export function DayReport({
  phase,
  headline,
  tierLabel,
  audienceSegments,
  counterHeadlines,
  resources,
  trustProgress,
  nightReport,
  tranchePreview,
  onNextDay,
}: DayReportProps) {
  // Weiter auch per Enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNextDay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNextDay]);

  const trust = Math.max(0, Math.min(100, trustProgress));

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ backgroundColor: '#0a0a0aF2' }}
    >
      {/* Letterbox-Balken oben */}
      <div className="h-[6vh] w-full" style={{ backgroundColor: '#000' }} />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Kopf */}
          <div className="text-center mb-6 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <div className="text-xs uppercase tracking-[0.3em]" style={{ color: StoryModeColors.textSecondary }}>
              Redaktionsschluss
            </div>
            <h2
              className="text-2xl font-bold uppercase tracking-wider"
              style={{ color: StoryModeColors.ministryRed }}
            >
              Lagebericht — Tag {phase}
            </h2>
          </div>

          {/* Drei Blöcke */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* ① Was wir ausspielten */}
            <ReportColumn title="① Was wir ausspielten" index={0}>
              {headline ? (
                <>
                  <p
                    className="font-mono text-sm leading-relaxed mb-3"
                    style={{ color: StoryModeColors.textPrimary }}
                  >
                    „{headline}"
                  </p>
                  <div
                    className="inline-block px-3 py-1 border-2 text-xs font-bold uppercase"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.warning,
                      color: StoryModeColors.warning,
                    }}
                  >
                    Wirkung: {tierLabel ?? '—'}
                  </div>
                </>
              ) : (
                <p className="font-mono text-sm" style={{ color: StoryModeColors.textMuted }}>
                  Heute kein Stück ausgespielt — ein stiller Tag.
                </p>
              )}
            </ReportColumn>

            {/* ② Das Land */}
            <ReportColumn title="② Das Land" index={1}>
              {audienceSegments.length > 0 ? (
                <ul className="space-y-2">
                  {audienceSegments.map((seg) => (
                    <li key={seg.label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span style={{ color: StoryModeColors.textPrimary }}>{seg.label}</span>
                        <span style={{ color: StoryModeColors.textSecondary }}>{MOOD_LABEL_DE[seg.mood as Mood] ?? seg.mood}</span>
                      </div>
                      <div
                        className="h-2 rounded-sm overflow-hidden"
                        style={{ backgroundColor: StoryModeColors.border }}
                      >
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, seg.belief))}%`,
                            backgroundColor: StoryModeColors.ministryRed,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-sm" style={{ color: StoryModeColors.textMuted }}>
                  Keine Publikumsdaten verfügbar.
                </p>
              )}
            </ReportColumn>

            {/* ③ Die Gegenseite */}
            <ReportColumn title="③ Die Gegenseite" index={2}>
              {counterHeadlines.length > 0 ? (
                <ul className="space-y-2">
                  {counterHeadlines.map((line, i) => (
                    <li
                      key={i}
                      className="border-l-4 pl-2 py-1 text-sm font-mono"
                      style={{
                        borderColor: StoryModeColors.agencyBlue,
                        color: StoryModeColors.textPrimary,
                        backgroundColor: StoryModeColors.surfaceLight,
                      }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-sm italic" style={{ color: StoryModeColors.textMuted }}>
                  Keine nennenswerte Gegenwehr — noch.
                </p>
              )}
            </ReportColumn>
          </div>

          {/* Kennzahlen-Zeile */}
          <div
            className="border-2 p-4 mb-6 animate-fade-in"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              opacity: 0,
              animationDelay: '0.36s',
              animationFillMode: 'forwards',
            }}
          >
            <div className="flex justify-around mb-4">
              <Metric
                label="Risiko"
                value={`${Math.round(resources.risk)}%`}
                color={resources.risk >= 70 ? StoryModeColors.danger : StoryModeColors.warning}
              />
              <Metric label="Budget" value={`$${resources.budget}K`} color={StoryModeColors.document} />
              <Metric
                label="Aufmerksamkeit"
                value={`${Math.round(resources.attention)}%`}
                color={StoryModeColors.agencyBlue}
              />
            </div>

            {/* Vertrauens-Wettrennen: Ministerium Institutionen */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: StoryModeColors.ministryRed }}>Ministerium</span>
                <span style={{ color: StoryModeColors.textSecondary }}>Deutungshoheit</span>
                <span style={{ color: StoryModeColors.agencyBlue }}>Institutionen</span>
              </div>
              <div
                className="h-3 rounded-sm overflow-hidden flex"
                style={{ backgroundColor: StoryModeColors.agencyBlue }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${trust}%`, backgroundColor: StoryModeColors.ministryRed }}
                />
              </div>
            </div>
          </div>

          {/* Nacht-Transparenz (Etappe 3 Paket D): das Rennen wird jeden Abend fühlbar —
              wer den zweiten Läufer nicht bremst, sieht hier, warum Nichtstun verliert.
              Tag 1 hat keine Vorgängernacht → Zeile entfällt (nightReport === null). */}
          {nightReport && (
            <div
              className="border-2 p-4 mb-6 animate-fade-in"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                opacity: 0,
                animationDelay: '0.42s',
                animationFillMode: 'forwards',
              }}
              data-testid="night-report-row"
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: StoryModeColors.textSecondary }}>
                Über Nacht
              </div>
              <p className="font-mono text-sm" style={{ color: StoryModeColors.textPrimary }}>
                Institutionen holen {formatDe(nightReport.trustRegeneration)} Punkte Vertrauen zurück · Abwehr{' '}
                +{formatDe(nightReport.abwehrDelta)} → {Math.round(nightReport.abwehrAfter)}
              </p>
              {/* Aufschlüsselung der Zuflüsse — nur nennenswerte (> 0,05) zeigen (keine Zahlen-Buchhalterei). */}
              {(() => {
                const parts = [
                  { label: 'Lärm', value: nightReport.abwehrParts.noise },
                  { label: 'Verteidiger', value: nightReport.abwehrParts.defenders },
                  { label: 'Grundrauschen', value: nightReport.abwehrParts.baseline },
                ].filter((p) => p.value > 0.05);
                if (parts.length === 0) return null;
                return (
                  <p className="font-mono text-xs mt-1" style={{ color: StoryModeColors.textSecondary }}>
                    {parts.map((p) => `${p.label} +${formatDe(p.value)}`).join(' · ')}
                  </p>
                );
              })()}
            </div>
          )}

          {/* Tranche der Zentrale (Etappe 5, E18): kommt in der nächsten Nacht Geld —
              oder eine Mahnung? Nur an Tranchen-Tagen (5/10/…) sichtbar. */}
          {tranchePreview && (
            <div
              className="border-2 p-4 mb-6 animate-fade-in"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: tranchePreview.auszahlung < 0 ? StoryModeColors.ministryRed : StoryModeColors.border,
                opacity: 0,
                animationDelay: '0.5s',
                animationFillMode: 'forwards',
              }}
              data-testid="tranche-row"
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: StoryModeColors.textSecondary }}>
                Die Zentrale
              </div>
              <p className="font-mono text-sm" style={{ color: StoryModeColors.textPrimary }}>
                {tranchePreview.text_de}
              </p>
            </div>
          )}

          {/* Weiter-Button */}
          <div className="text-center pb-6">
            <button
              onClick={onNextDay}
              className="px-8 py-3 border-4 font-bold text-lg uppercase tracking-wider transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: StoryModeColors.ministryRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
              }}
            >
              Nächster Tag ▸
            </button>
          </div>
        </div>
      </div>

      {/* Letterbox-Balken unten */}
      <div className="h-[6vh] w-full" style={{ backgroundColor: '#000' }} />
    </div>
  );
}

export default DayReport;
