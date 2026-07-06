/**
 * WahlabendScene (Etappe 5, Paket C) — „Ein TV-Set, drei Enden" (Zielbild §9).
 * ============================================================================
 * Das Rennen endet immer im selben Wahlstudio; nur das Bild kippt anders:
 *   - victory → die Hochrechnung kippt, die Regierung fällt (Kurator: „Auftrag ausgeführt.")
 *   - timeout → der Balken kippt NICHT, die Regierung wird bestätigt (kein Knall)
 *   - immune/exposed → SONDERSENDUNG: die eigenen Schlagzeilen laufen als Beweismittel,
 *     Masche für Masche mit rotem GEFÄLSCHT-Stempel; unten das Bürogebäude, Blaulicht.
 *
 * Der TvSet ist der E17-Baukasten (Pixel-Hintergrund + austauschbare Text-Ebene): heute
 * CSS-/Pixel-Fallback wie überall im Projekt — ein echtes Studio-Asset kann später
 * transparent daruntergelegt werden, ohne die API zu ändern (Priorität E17: Sprecherin,
 * Umfrage-Ticker, Faktencheck, Wahlstudio). Die Szene läuft VOR dem GameEndScreen und
 * schaltet per onComplete weiter; ein „Weiter"-Klick überspringt jederzeit.
 */
import { useEffect, useState } from 'react';
import { StoryModeColors } from '../theme';

export type WahlabendBranch = 'victory' | 'timeout' | 'immune' | 'exposed';

export interface WahlabendSceneProps {
  branch: WahlabendBranch;
  partyName: string;
  startPollPct: number;
  finalPollPct: number;
  thresholdPct: number;
  audience: { label: string; belief: number; mood: string }[];
  /** Vom Spieler erzeugte Schlagzeilen — laufen in der Sondersendung als „Beweismittel". */
  playerHeadlines: string[];
  onComplete: () => void;
}

/** Ein Milieu-Reaktions-Bild fürs Wohnzimmer-Schnitt (belief hoch = jubelt, mittel = stumm, niedrig = schaltet ab). */
function segmentReaktion(belief: number): { icon: string; text: string; color: string } {
  if (belief >= 60) return { icon: '▲', text: 'jubelt', color: StoryModeColors.ministryRed };
  if (belief >= 35) return { icon: '■', text: 'sitzt stumm', color: '#A89878' /* hell: Near-Black-Szene */ };
  return { icon: '○', text: 'schaltet ab', color: '#C8BC9E' /* hell: Near-Black-Szene */ };
}

/**
 * TvSet — der Baukasten: ein Röhren-TV-Rahmen mit Studio-Hintergrund, Sprecherin-Zeile
 * (Lower Third), optionalem Umfrage-Balken und optionalem GEFÄLSCHT-Stempel.
 */
function TvSet({
  studio,
  anchorLine,
  children,
  stamp,
}: {
  studio: 'wahlstudio' | 'sondersendung';
  anchorLine: string;
  children?: React.ReactNode;
  stamp?: string;
}): React.JSX.Element {
  const bg = studio === 'sondersendung'
    ? 'linear-gradient(180deg, #2a0d0d 0%, #140707 100%)'
    : 'linear-gradient(180deg, #0d1b2a 0%, #08111c 100%)';
  return (
    <div
      style={{
        position: 'relative', width: 'min(92vw, 720px)', aspectRatio: '4 / 3',
        background: bg, border: `4px solid ${StoryModeColors.border}`,
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -3px 0 rgba(0,0,0,0.5), 0 0 0 6px #050507',
        imageRendering: 'pixelated', overflow: 'hidden', color: '#fff',
      }}
      data-testid="tv-set"
    >
      {/* Scanlines (Röhren-TV-Anmutung, dezent). */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.14,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)',
      }} />
      {/* ON AIR */}
      <div style={{
        position: 'absolute', top: 10, right: 12, fontSize: 10, letterSpacing: 2, fontWeight: 900,
        color: studio === 'sondersendung' ? StoryModeColors.danger : StoryModeColors.warning,
        animation: 'wa-blink 1.1s steps(1) infinite',
      }}>
        ● {studio === 'sondersendung' ? 'SONDERSENDUNG' : 'LIVE'}
      </div>

      {/* Inhalts-Ebene */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 26px 64px' }}>
        {children}
      </div>

      {/* GEFÄLSCHT-Stempel (Faktencheck-Ebene) */}
      {stamp && (
        <div style={{
          position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%) rotate(-11deg)',
          border: `4px solid ${StoryModeColors.danger}`, color: StoryModeColors.danger,
          padding: '4px 16px', fontSize: 30, fontWeight: 900, letterSpacing: 4, opacity: 0.92,
          textTransform: 'uppercase', background: 'rgba(20,7,7,0.25)',
        }}>
          {stamp}
        </div>
      )}

      {/* Sprecherin-Lower-Third */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, padding: '8px 14px',
        background: 'rgba(5,7,12,0.82)', borderTop: `2px solid ${StoryModeColors.border}`,
        fontFamily: "'VT323', monospace", fontSize: 15, minHeight: 44, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 1, color: StoryModeColors.warning, fontWeight: 900 }}>WESTUNION TV</span>
        <span>{anchorLine}</span>
      </div>
    </div>
  );
}

/** Umfrage-/Hochrechnungs-Balken: die Sonntagsfrage kippt (oder nicht) über die Schwelle. */
function HochrechnungBar({
  partyName, pct, thresholdPct, crosses,
}: { partyName: string; pct: number; thresholdPct: number; crosses: boolean }): React.JSX.Element {
  // Skala bis knapp über die relevante Marke, damit die Schwelle nicht am Rand klebt.
  const scaleMax = Math.max(pct, thresholdPct) + 8;
  const barPct = Math.min(100, (pct / scaleMax) * 100);
  const linePct = Math.min(100, (thresholdPct / scaleMax) * 100);
  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: 900, color: StoryModeColors.ministryRed }}>{partyName}</span>
        <span style={{ fontFamily: "'VT323', monospace" }}>{pct.toFixed(1)} %</span>
      </div>
      <div style={{ position: 'relative', height: 26, background: 'rgba(255,255,255,0.08)', border: `2px solid ${StoryModeColors.border}` }}>
        <div style={{
          height: '100%', width: `${barPct}%`,
          background: crosses ? StoryModeColors.ministryRed : StoryModeColors.militaryOlive,
          transition: 'width 1.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
        {/* Machtwechsel-Schwelle */}
        <div style={{ position: 'absolute', top: -4, bottom: -4, left: `${linePct}%`, width: 2, background: StoryModeColors.warning }} />
        <div style={{ position: 'absolute', top: -18, left: `calc(${linePct}% - 30px)`, fontSize: 9, letterSpacing: 1, color: StoryModeColors.warning }}>
          SCHWELLE
        </div>
      </div>
    </div>
  );
}

export function WahlabendScene({
  branch, partyName, startPollPct, finalPollPct, thresholdPct, audience, playerHeadlines, onComplete,
}: WahlabendSceneProps): React.JSX.Element {
  const [step, setStep] = useState(0);
  const sondersendung = branch === 'immune' || branch === 'exposed';
  const won = branch === 'victory';
  // Schrittzahl: 0 Titelkarte · 1 Hochrechnung/Sondersendung · 2 Ergebnis · 3 Wohnzimmer.
  const LAST_STEP = 3;

  // Auto-Vorlauf mit dramaturgischen Pausen; Klick überspringt.
  useEffect(() => {
    if (step >= LAST_STEP) return;
    const delays = [1900, 2600, 3000];
    const t = setTimeout(() => setStep((s) => s + 1), delays[step] ?? 2400);
    return () => clearTimeout(t);
  }, [step]);

  const advance = () => (step >= LAST_STEP ? onComplete() : setStep((s) => s + 1));

  // Für die Hochrechnung: der Balken wächst erst im Schritt ≥1 auf den Endwert.
  const shownPct = step >= 1 ? finalPollPct : startPollPct;

  return (
    <div
      role="dialog"
      aria-label="Wahlabend"
      onClick={advance}
      style={{
        position: 'fixed', inset: 0, zIndex: 1400, cursor: 'pointer',
        background: 'radial-gradient(circle at 50% 40%, #0b0b10 0%, #050506 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
        fontFamily: "'VT323', monospace",
      }}
    >
      {/* Szenen-lokale Keyframes (kein globales CSS nötig). */}
      <style>{`
        @keyframes wa-blink { 0%,60% { opacity: 1 } 61%,100% { opacity: 0.15 } }
        @keyframes wa-rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>

      {step === 0 ? (
        <div style={{ textAlign: 'center', animation: 'wa-rise 500ms ease-out' }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: '#A89878' }}>WAHLTAG · WESTUNION</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 2, color: StoryModeColors.warning, marginTop: 8 }}>
            DIE HOCHRECHNUNG
          </div>
          <div style={{ fontSize: 13, color: '#C8BC9E', marginTop: 10 }}>
            Das Büro ist dunkel. Nur der News-Fernseher läuft.
          </div>
        </div>
      ) : (
        <TvSet
          studio={sondersendung ? 'sondersendung' : 'wahlstudio'}
          stamp={sondersendung && step >= 2 ? 'GEFÄLSCHT' : undefined}
          anchorLine={
            sondersendung
              ? (step >= 2
                  ? (branch === 'exposed'
                      ? 'Die Ermittler haben das Netzwerk aufgedeckt — wir zeigen die Belege.'
                      : 'Faktenchecker erklären die Kampagne — Masche für Masche.')
                  : 'Wir unterbrechen das Programm für eine Sondersendung.')
              : (step >= 2
                  ? (won
                      ? 'Damit ist klar — die Regierung ist abgewählt.'
                      : 'Die Regierung wird bestätigt. Ein ereignisloser Abend.')
                  : 'Erste Hochrechnung aus den Wahllokalen …')
          }
        >
          {sondersendung ? (
            <div style={{ animation: 'wa-rise 500ms ease-out' }}>
              <div style={{ fontSize: 12, letterSpacing: 2, color: StoryModeColors.danger, marginBottom: 10, fontWeight: 900 }}>
                IHRE SCHLAGZEILEN — GEPRÜFT
              </div>
              {(playerHeadlines.length ? playerHeadlines : ['Ihre Kampagne']).slice(0, 4).map((h, i) => (
                <div key={i} style={{
                  fontSize: 13, padding: '3px 0', color: '#e8d8d8',
                  textDecoration: step >= 2 ? 'line-through' : 'none',
                  opacity: step >= 2 ? 0.7 : 1,
                }}>
                  › {h}
                </div>
              ))}
            </div>
          ) : (
            <HochrechnungBar partyName={partyName} pct={shownPct} thresholdPct={thresholdPct} crosses={won && step >= 2} />
          )}
        </TvSet>
      )}

      {/* Kurator-/Zentrale-Nachsatz + Wohnzimmer-Schnitt im letzten Schritt. */}
      {step >= LAST_STEP && (
        <div style={{ textAlign: 'center', maxWidth: 640, animation: 'wa-rise 600ms ease-out' }}>
          <div style={{ fontSize: 14, color: '#D8C9A8', marginBottom: 12 }}>
            {won
              ? 'Das Telefon. Der Kurator, eine Zeile, kühl: „Auftrag ausgeführt. Die Prämie ist angewiesen."'
              : branch === 'timeout'
                ? 'Im Büro: „Die Zentrale beendet die Finanzierung. Packen Sie die Akten."'
                : 'Unten im Bild: Ihr Bürogebäude, Blaulicht. Die Zentrale ist nicht mehr erreichbar.'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', margin: '10px 0 4px' }}>
            {audience.slice(0, 6).map((seg, i) => {
              const r = segmentReaktion(seg.belief);
              return (
                <div key={i} style={{ fontSize: 11, color: r.color, border: `1px solid ${StoryModeColors.border}`, padding: '3px 7px' }}>
                  <span style={{ fontWeight: 900 }}>{r.icon}</span> {seg.label} {r.text}
                </div>
              );
            })}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              marginTop: 14, padding: '10px 22px', cursor: 'pointer',
              background: StoryModeColors.ministryRed, border: `3px solid ${StoryModeColors.darkRed}`,
              color: '#fff', fontWeight: 900, letterSpacing: 2, fontSize: 14,
            }}
          >
            WEITER ▸
          </button>
        </div>
      )}

      {step < LAST_STEP && (
        <div style={{ fontSize: 11, color: '#A89878', letterSpacing: 1 }}>Klicken zum Fortfahren</div>
      )}
    </div>
  );
}

export default WahlabendScene;
