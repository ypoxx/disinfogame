/**
 * FokusgruppePreTest — beauftragbare Fokusgruppe (Konzept §3/§7). Der Spieler wählt
 * einen Botschafts-Appell + eine STICHPROBE von Personas, beauftragt die Befragung
 * (kostet Zeit = eine Phase) und sieht die Prognose je Persona — plus die
 * Sample-Bias-Warnung: eine einseitige Stichprobe bestätigt einen nur selbst.
 *
 * Props-getrieben (kein Hook auf Spiel-State) → isoliert testbar. Porträts kommen
 * aus dem Asset-Registry (persona_<id>_<mood>), mit Initialen-Fallback.
 */
import { useState } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors, StoryModeFonts } from '../theme';
import {
  preTest,
  type Persona,
  type MessageAppeal,
  type PersonaMood,
  type PreTestResult,
} from '../audience/fokusgruppeModel';

const APPEALS: { id: MessageAppeal; label: string; desc: string }[] = [
  { id: 'hope', label: 'Aufbruch', desc: 'Modernisierung, Versprechen' },
  { id: 'fear', label: 'Abstiegsangst', desc: 'Bedrohung, Nostalgie' },
  { id: 'anger', label: 'Empörung', desc: '„die da oben", Schuldige' },
  { id: 'trust', label: 'Seriosität', desc: 'Establishment, Institutionen' },
];

const MOOD_COLOR: Record<PersonaMood, string> = {
  zustimmend: '#6a8a6a',
  skeptisch: StoryModeColors.warning,
  ablehnend: StoryModeColors.danger,
};
const MOOD_LABEL: Record<PersonaMood, string> = {
  zustimmend: 'Zustimmung',
  skeptisch: 'skeptisch',
  ablehnend: 'Ablehnung',
};

export interface FokusgruppePreTestProps {
  personas: Persona[];
  /** Beauftragung bestätigt (kostet eine Phase Zeit). */
  onCommission: () => void;
  onClose: () => void;
}

/** -1..1 → 0..100 % für die Balkenbreite. */
const pct = (v: number): number => Math.round(((v + 1) / 2) * 100);

export function FokusgruppePreTest({ personas, onCommission, onClose }: FokusgruppePreTestProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_analyse'); // Einwegspiegel-Beobachtungsraum (diegetisch)
  const [appeal, setAppeal] = useState<MessageAppeal>('hope');
  const [sample, setSample] = useState<string[]>(personas.map((p) => p.id));
  const [result, setResult] = useState<PreTestResult | null>(null);

  const toggle = (id: string): void =>
    setSample((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const commission = (): void => {
    if (sample.length === 0 || result) return;
    onCommission();
    setResult(preTest(appeal, personas, sample));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fokusgruppe beauftragen"
      data-testid="fokusgruppe-pretest"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        color: StoryModeColors.textPrimary, fontFamily: StoryModeFonts.world,
      }}
    >
      {/* Diegetischer Hintergrund: Einwegspiegel-Beobachtungsraum (room_analyse) statt schwarzem Panel.
          Das Publikum ist im Raumbild hinter der Scheibe zu sehen — kein Live-Rendering nötig. */}
      {bgUrl ? (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.56) 38%, rgba(0,0,0,0.8) 100%)' }} />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#080b10' }} />
      )}
      {/* Scanlines (dezenter Monitor-Look, wie FokusgruppeView) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)' }} />

      {/* Inhalt über dem Raum */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', padding: '18px 20px', overflowY: 'auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <span style={{ fontFamily: StoryModeFonts.label, fontSize: 16, color: StoryModeColors.warning, letterSpacing: 2 }}>
          ZIELGRUPPEN-ANALYSE
        </span>
        <span style={{ fontSize: 14, color: StoryModeColors.textSecondary }}>Fokusgruppe beauftragen</span>
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{ marginLeft: 'auto', fontSize: 14, color: '#ccc', border: '2px solid #555', padding: '4px 12px', background: 'transparent', cursor: 'pointer' }}
        >
          ✕ Schließen
        </button>
      </div>

      {!result ? (
        <>
          {/* Schritt 1: Appell */}
          <div style={{ fontSize: 13, color: StoryModeColors.textSecondary, marginBottom: 6 }}>1 · Welche Botschaft testen?</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {APPEALS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAppeal(a.id)}
                aria-pressed={appeal === a.id}
                style={{
                  textAlign: 'left', padding: '8px 12px', cursor: 'pointer',
                  border: `2px solid ${appeal === a.id ? StoryModeColors.warning : StoryModeColors.borderLight}`,
                  background: appeal === a.id ? 'rgba(232,178,58,0.12)' : 'transparent', color: StoryModeColors.textPrimary,
                }}
              >
                <div style={{ fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: StoryModeColors.textMuted }}>{a.desc}</div>
              </button>
            ))}
          </div>

          {/* Schritt 2: Stichprobe */}
          <div style={{ fontSize: 13, color: StoryModeColors.textSecondary, marginBottom: 6 }}>
            2 · Wen befragen? <span style={{ color: StoryModeColors.textMuted }}>(Vorsicht: eine einseitige Auswahl verzerrt das Ergebnis.)</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            {personas.map((p) => {
              const on = sample.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  data-testid={`pretest-sample-${p.id}`}
                  style={{
                    width: 150, textAlign: 'left', padding: 8, cursor: 'pointer',
                    border: `2px solid ${on ? StoryModeColors.warning : StoryModeColors.borderLight}`,
                    background: on ? 'rgba(232,178,58,0.10)' : 'transparent', color: StoryModeColors.textPrimary, opacity: on ? 1 : 0.6,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: StoryModeColors.textMuted }}>{p.milieu}</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={commission}
            disabled={sample.length === 0}
            data-testid="pretest-commission"
            style={{
              alignSelf: 'flex-start', padding: '10px 20px', fontSize: 15, fontWeight: 700, cursor: sample.length ? 'pointer' : 'not-allowed',
              border: `3px solid ${StoryModeColors.darkRed}`, background: StoryModeColors.ministryRed, color: '#fff', opacity: sample.length ? 1 : 0.5,
            }}
          >
            BEFRAGUNG BEAUFTRAGEN ▸ <span style={{ fontWeight: 400, fontSize: 12 }}>(kostet eine Phase)</span>
          </button>
        </>
      ) : (
        <PreTestResultView result={result} personas={personas} assets={assets} onReset={() => setResult(null)} />
      )}
      </div>
    </div>
  );
}

interface ResultProps {
  result: PreTestResult;
  personas: Persona[];
  assets: ReturnType<typeof useAssets>;
  onReset: () => void;
}

function PreTestResultView({ result, personas, assets, onReset }: ResultProps): React.JSX.Element {
  const byId = new Map(personas.map((p) => [p.id, p]));
  return (
    <div>
      {/* Prognose vs. Realität */}
      <div style={{ marginBottom: 14 }}>
        <Bar label="Ihre Prognose (Stichprobe)" value={result.predictedReception} color={StoryModeColors.warning} testid="pretest-predicted" />
        <Bar label="Tatsächliche Gesamtwirkung" value={result.trueReception} color={StoryModeColors.agencyBlue} testid="pretest-true" />
      </div>

      {result.warning && (
        <div
          data-testid="pretest-warning"
          style={{
            border: `2px solid ${StoryModeColors.danger}`, background: 'rgba(194,37,59,0.12)', padding: '8px 12px',
            marginBottom: 14, fontSize: 13, color: StoryModeColors.textPrimary,
          }}
        >
          ⚠ {result.warning}
        </div>
      )}

      {/* Personas mit Mimik + Einwand */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        {result.reactions.map((r) => {
          const p = byId.get(r.personaId);
          if (!p) return null;
          const url = assets.imageUrl(`persona_${p.id}_${r.mood}`);
          return (
            <div key={r.personaId} data-testid={`pretest-reaction-${r.personaId}`} style={{ width: 168, border: `1px solid ${StoryModeColors.borderLight}`, background: 'rgba(12,12,16,0.6)' }}>
              <div style={{ height: 200, background: '#15161c', borderBottom: `3px solid ${MOOD_COLOR[r.mood]}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {url ? (
                  <img src={url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                ) : (
                  <span style={{ fontFamily: StoryModeFonts.display, fontSize: 22, color: StoryModeColors.textMuted }}>
                    {p.name.split(' ').map((s) => s[0]).join('')}
                  </span>
                )}
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: StoryModeColors.textMuted, marginBottom: 4 }}>{p.milieu}</div>
                <div style={{ fontSize: 12, color: MOOD_COLOR[r.mood], fontWeight: 700 }}>{MOOD_LABEL[r.mood]}</div>
                {p.vulnerabilities.length > 0 && (
                  <div style={{ fontSize: 11, color: StoryModeColors.textSecondary, marginTop: 4 }}>
                    Einwand: {p.vulnerabilities[0]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        style={{ padding: '8px 16px', fontSize: 13, border: `2px solid ${StoryModeColors.borderLight}`, background: 'transparent', color: '#ccc', cursor: 'pointer' }}
      >
        ◂ Neue Befragung
      </button>
    </div>
  );
}

function Bar({ label, value, color, testid }: { label: string; value: number; color: string; testid: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: StoryModeColors.textSecondary }}>
        <span>{label}</span>
        <span data-testid={testid} style={{ color }}>{value >= 0 ? '+' : ''}{Math.round(value * 100)} %</span>
      </div>
      <div style={{ height: 12, background: '#1a1b22', border: `1px solid ${StoryModeColors.borderLight}`, position: 'relative' }}>
        {/* Mittellinie (neutral) */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#444' }} />
        <div style={{ position: 'absolute', left: `${Math.min(50, pct(value))}%`, width: `${Math.abs(pct(value) - 50)}%`, top: 0, bottom: 0, background: color, opacity: 0.85 }} />
      </div>
    </div>
  );
}

export default FokusgruppePreTest;
