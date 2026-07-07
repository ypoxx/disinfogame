/**
 * MaschenVortestView — die neu gedachte Zielgruppenanalyse (Redesign).
 *
 * Statt vier abstrakter Appelle testet der Spieler eine KONKRETE, spielbare Masche
 * (Phänomen-Aktion 11.x) an einem Querschnitt der acht Resonanzgruppen — und sieht die
 * WAHRE Vorschau des Wettrennens (FRISCH/BEKANNT/VERBRANNT, wer wittert, wer kurz vorm
 * Kippen steht, wer geimpft abwehrt), gelesen aus derselben Live-Kette (getSegmentVortest).
 * „Masche starten ▸" reiht genau diese Aktion in den Sendeplan.
 *
 * Props-getrieben (kein Hook auf Spiel-State) → isoliert testbar; der Orchestrator reicht
 * `runVortest` (= engine.getSegmentVortest) und die Karten (= engine.getVortestMaschen) herein.
 */
import { useMemo, useState } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors, StoryModeFonts } from '../theme';
import { repraesentativeStimmen, type MascheKarte, type MaschenVortestResult, type PersonaLite, type SegmentVortest, type Stimme } from '../audience/maschenVortest';
import type { MaschenStempel } from '../engine/MaschenGedaechtnis';
import type { Channel } from '../audience/audienceModel';

export interface GruppeInfo {
  id: string;
  label_de: string;
  /** Bevölkerungsanteil 0..1 (Sortierung: größte zuerst). */
  size: number;
}

export interface MaschenVortestViewProps {
  maschen: MascheKarte[];
  gruppen: GruppeInfo[];
  /** Repräsentative Gesichter je Gruppe für den O-Ton-Vorgriff (§6). */
  personas: PersonaLite[];
  budget: number;
  cost: number;
  /** Freie Stichproben-Auswahl freigeschaltet (Profi/spätere Phase)? Sonst nur geführt. */
  allowFreeSample: boolean;
  freeSampleLockHint?: string;
  runVortest: (actionId: string, sampleIds: string[]) => MaschenVortestResult | null;
  onCommission: () => void;
  onLaunchMasche: (actionId: string) => void;
  onClose: () => void;
}

// ─── Anzeige-Vokabular ────────────────────────────────────────────────────────

const KANAL_LABEL: Record<Channel, string> = { tv: 'TV', social: 'Social', print: 'Print' };

/** Kurze, kühle Themen-Etiketten (Aktendeckel-Ton, kein Lehrsatz). */
const THEMA_LABEL: Record<string, string> = {
  anti_establishment: '„die da oben"',
  misstrauen_medien: 'Medien-Misstrauen',
  abstiegs_angst: 'Abstiegsangst',
  wirtschafts_sorge: 'Wohlstandssorge',
  energie_angst: 'Energieangst',
  sicherheits_beduerfnis: 'Sicherheit',
  nostalgie: 'Nostalgie',
  gesundheits_angst: 'Gesundheitsangst',
  klima_sorge: 'Klimasorge',
  soziale_gerechtigkeit: 'Gerechtigkeit',
  friedens_sehnsucht: 'Friedenssehnsucht',
  false_balance: 'Scheinausgewogenheit',
  maennlichkeit: 'Männlichkeit',
};
const themaLabel = (id: string): string => THEMA_LABEL[id] ?? id;

const STEMPEL_STYLE: Record<MaschenStempel, { label: string; color: string }> = {
  frisch: { label: 'FRISCH', color: '#4a8a4a' },
  bekannt: { label: 'BEKANNT', color: '#c8960c' },
  verbrannt: { label: 'VERBRANNT', color: '#8a8a90' },
};

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export function MaschenVortestView({
  maschen,
  gruppen,
  personas,
  budget,
  cost,
  allowFreeSample,
  freeSampleLockHint,
  runVortest,
  onCommission,
  onLaunchMasche,
  onClose,
}: MaschenVortestViewProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_analyse');

  const gruppenSorted = useMemo(() => [...gruppen].sort((a, b) => b.size - a.size), [gruppen]);
  const alleIds = useMemo(() => gruppen.map((g) => g.id), [gruppen]);

  const [selected, setSelected] = useState<string | null>(null);
  const [sampleMode, setSampleMode] = useState<'gefuehrt' | 'frei'>('gefuehrt');
  const [freeSample, setFreeSample] = useState<string[]>(alleIds);
  const [result, setResult] = useState<MaschenVortestResult | null>(null);
  const [testedId, setTestedId] = useState<string | null>(null);

  const sampleIds = sampleMode === 'gefuehrt' ? alleIds : freeSample;
  const affordable = budget >= cost;
  const canCommission = selected !== null && affordable && sampleIds.length > 0 && !result;

  const toggleGruppe = (id: string): void =>
    setFreeSample((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const commission = (): void => {
    if (!canCommission || selected === null) return;
    onCommission();
    setResult(runVortest(selected, sampleIds));
    setTestedId(selected);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Zielgruppenanalyse"
      data-testid="maschen-vortest"
      style={{ position: 'fixed', inset: 0, zIndex: 1100, color: StoryModeColors.document, fontFamily: StoryModeFonts.world }}
    >
      {bgUrl ? (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.58) 38%, rgba(0,0,0,0.82) 100%)' }} />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#080b10' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)' }} />

      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 20px', overflowY: 'auto', boxSizing: 'border-box' }}>
        {/* Kopf */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: StoryModeFonts.label, fontSize: 16, color: '#F0B429', letterSpacing: 2 }}>ZIELGRUPPEN-ANALYSE</span>
          <span style={{ fontSize: 13, color: StoryModeColors.lightConcrete }}>Masche vortesten</span>
          <button onClick={onClose} aria-label="Schließen" style={{ marginLeft: 'auto', fontSize: 14, color: '#ccc', border: '2px solid #555', padding: '4px 12px', background: 'transparent', cursor: 'pointer' }}>✕ Schließen</button>
        </div>
        {/* Glossar-Unterzeile (Wissenskern, ein Satz) */}
        <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete, marginBottom: 14 }}>
          Acht Resonanzgruppen, ein Querschnitt. Testen Sie eine Masche, bevor Westunion sie hört.
        </div>

        {!result ? (
          <>
            {/* Schritt 1: Masche */}
            <div style={{ fontSize: 13, color: StoryModeColors.lightConcrete, marginBottom: 6 }}>1 · Welche Masche testen?</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {maschen.map((m) => (
                <MascheCard key={m.id} masche={m} selected={selected === m.id} onSelect={() => setSelected(m.id)} />
              ))}
            </div>

            {/* Schritt 2: Stichprobe */}
            <div style={{ fontSize: 13, color: StoryModeColors.lightConcrete, marginBottom: 6 }}>2 · Wen befragen?</div>
            <div data-testid="mv-sample" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: sampleMode === 'gefuehrt' ? '#6a8a6a' : StoryModeColors.lightConcrete, marginBottom: 6 }}>
                ◆ Repräsentativer Querschnitt · alle {gruppen.length} Gruppen {sampleMode === 'gefuehrt' ? '(empfohlen)' : ''}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {gruppenSorted.map((g) => {
                  const on = sampleMode === 'gefuehrt' || freeSample.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      data-testid={`mv-gruppe-${g.id}`}
                      disabled={sampleMode === 'gefuehrt'}
                      onClick={() => toggleGruppe(g.id)}
                      style={{
                        fontSize: 10, padding: '3px 8px', cursor: sampleMode === 'frei' ? 'pointer' : 'default',
                        border: `1px solid ${on ? '#3a7acc' : StoryModeColors.borderLight}`,
                        background: on ? 'rgba(58,122,204,0.12)' : 'transparent',
                        color: on ? StoryModeColors.document : StoryModeColors.lightConcrete,
                        opacity: on ? 1 : 0.55,
                      }}
                    >
                      {g.label_de} · {Math.round(g.size * 100)} %
                    </button>
                  );
                })}
              </div>
              {/* Profi-Schublade */}
              <div style={{ marginTop: 8 }}>
                {allowFreeSample ? (
                  <button
                    type="button"
                    data-testid="mv-profi-toggle"
                    onClick={() => setSampleMode((m) => (m === 'gefuehrt' ? 'frei' : 'gefuehrt'))}
                    style={{ fontSize: 11, color: '#8fb8e8', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {sampleMode === 'gefuehrt' ? '▸ Stichprobe selbst zusammenstellen (Profi)' : '▾ Zurück zum Querschnitt'}
                  </button>
                ) : (
                  <div data-testid="mv-profi-locked" style={{ fontSize: 11, color: StoryModeColors.lightConcrete }}>
                    🔒 {freeSampleLockHint ?? 'Freihändige Auswahl nach der Einarbeitung.'}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={commission}
              disabled={!canCommission}
              data-testid="mv-commission"
              style={{
                alignSelf: 'flex-start', padding: '10px 20px', fontSize: 15, fontWeight: 700, cursor: canCommission ? 'pointer' : 'not-allowed',
                border: `3px solid ${StoryModeColors.darkRed}`, background: StoryModeColors.ministryRed, color: '#fff', opacity: canCommission ? 1 : 0.5,
              }}
            >
              BEFRAGUNG BEAUFTRAGEN ▸ <span style={{ fontWeight: 400, fontSize: 12 }}>(kostet {cost} Budget + eine Phase)</span>
            </button>
            {!affordable && (
              <div data-testid="mv-unaffordable" style={{ marginTop: 8, fontSize: 12, color: '#E5484D' }}>Budget zu niedrig ({budget} / {cost}).</div>
            )}
          </>
        ) : (
          <VortestResultView
            result={result}
            masche={maschen.find((m) => m.id === testedId) ?? null}
            personas={personas}
            onReset={() => { setResult(null); setTestedId(null); }}
            onLaunch={() => { if (testedId) onLaunchMasche(testedId); }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Masche-Karte (Schritt 1) ─────────────────────────────────────────────────

function MascheCard({ masche, selected, onSelect }: { masche: MascheKarte; selected: boolean; onSelect: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid={`mv-masche-${masche.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: 250, textAlign: 'left', padding: '9px 11px', cursor: 'pointer',
        border: `2px solid ${selected ? '#F0B429' : StoryModeColors.borderLight}`,
        background: selected ? 'rgba(232,178,58,0.10)' : 'rgba(10,12,18,0.55)', color: StoryModeColors.document,
        display: 'flex', flexDirection: 'column', gap: 5,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13 }}>{masche.label_de}</div>
      <div style={{ fontSize: 11, fontStyle: 'italic', color: '#d8cba8', lineHeight: 1.4 }}>»{masche.botschaft_de}«</div>
      <div style={{ fontSize: 9, color: StoryModeColors.lightConcrete, letterSpacing: 0.3 }}>
        {masche.familieLabel ? `${masche.familieLabel.toUpperCase()} · ` : ''}
        trifft: {masche.themen.slice(0, 2).map(themaLabel).join(', ')} · Kanal: {KANAL_LABEL[masche.kanal]}
      </div>
    </button>
  );
}

// ─── Ergebnis (Prognose je Gruppe) ────────────────────────────────────────────

function VortestResultView({
  result,
  masche,
  personas,
  onReset,
  onLaunch,
}: {
  result: MaschenVortestResult;
  masche: MascheKarte | null;
  personas: PersonaLite[];
  onReset: () => void;
  onLaunch: () => void;
}): React.JSX.Element {
  const stimmen = repraesentativeStimmen(result.segmente, personas);
  return (
    <div>
      {masche && (
        <div style={{ fontSize: 12, marginBottom: 10, color: StoryModeColors.document }}>
          Getestet: <b>{masche.label_de}</b> <span style={{ color: '#d8cba8', fontStyle: 'italic' }}>»{masche.botschaft_de}«</span>
        </div>
      )}

      {/* Stimmen aus der Stichprobe (§6): das Leitmotiv kippt mit dem Stempel. */}
      {stimmen.length > 0 && (
        <div data-testid="mv-stimmen" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          {stimmen.map((v) => (
            <StimmeCard key={v.gruppeLabel} v={v} />
          ))}
        </div>
      )}

      {/* Prognose vs. Wahrheit — zwei zahllose Balken; die Länge IST die Aussage (nie die Matrix als Zahl). */}
      <div data-testid="mv-barometer" style={{ marginBottom: 12 }}>
        <Bar label="So klingt es in der Stichprobe" value={result.predictedReception} color="#F0B429" testid="mv-predicted" />
        <Bar label="So klingt es in ganz Westunion" value={result.trueReception} color="#3a7acc" testid="mv-true" />
        <div data-testid="mv-bias" style={{ fontSize: 11, color: biasStyle(result.sampleBias).color, marginTop: 3 }}>
          {biasStyle(result.sampleBias).text}
        </div>
      </div>

      {result.warning && (
        <div data-testid="mv-warning" style={{ border: `2px solid ${StoryModeColors.danger}`, background: 'rgba(194,37,59,0.12)', padding: '7px 11px', marginBottom: 12, fontSize: 12 }}>
          ⚠ {result.warning}
        </div>
      )}

      {/* Prognose je Resonanzgruppe */}
      <div style={{ fontFamily: StoryModeFonts.label, fontSize: 13, color: '#F0B429', letterSpacing: 1, marginBottom: 6 }}>
        PROGNOSE JE GRUPPE · Abnutzung · Abwehr · Kipp-Nähe
      </div>
      <div data-testid="mv-prognose" style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
        {result.segmente.map((s) => (
          <SegmentRow key={s.segmentId} s={s} />
        ))}
      </div>

      {/* Versteckter Einwand (E2) */}
      {result.einwand_de && (
        <div data-testid="mv-einwand" style={{ border: '1px solid #3a7acc', background: 'rgba(58,122,204,0.10)', padding: '7px 11px', marginBottom: 14, fontSize: 11, lineHeight: 1.45 }}>
          <span style={{ color: '#8fb8e8', fontWeight: 700 }}>VERSTECKTER EINWAND · </span>
          Läuft diese Masche zu oft, greifen die Redaktionen den Konter auf: „{result.einwand_de}"
          {result.einwandReife && result.einwandReife.einsaetze > 0 && (
            <span style={{ color: '#E5484D' }}> (schon {result.einwandReife.einsaetze}× gelaufen — beim {result.einwandReife.patchBei}. Mal steigt die Abwehr).</span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          data-testid="mv-launch"
          onClick={onLaunch}
          style={{ padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#fff', border: `3px solid ${StoryModeColors.darkRed}`, background: StoryModeColors.ministryRed }}
        >
          MASCHE STARTEN ▸
        </button>
        <button onClick={onReset} style={{ padding: '9px 16px', fontSize: 13, border: `2px solid ${StoryModeColors.borderLight}`, background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
          ◂ Neue Befragung
        </button>
      </div>
    </div>
  );
}

/** Eine Zeile der Prognose-Tabelle: Gruppe · Stempel · Wirkungs-Balken · Badges. */
function SegmentRow({ s }: { s: SegmentVortest }): React.JSX.Element {
  const st = STEMPEL_STYLE[s.stempel];
  const muted = !s.reached || s.wirkung <= 0.001;
  return (
    <div
      data-testid={`mv-row-${s.segmentId}`}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 6px', background: 'rgba(8,10,16,0.5)', border: '1px solid rgba(60,60,70,0.5)', opacity: muted ? 0.55 : 1 }}
    >
      <span style={{ flex: '0 0 150px', fontSize: 11, color: StoryModeColors.document, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label_de}</span>
      {/* Stempel (kein Zahlwert) */}
      <span data-testid={`mv-stempel-${s.segmentId}`} style={{ flex: '0 0 76px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: st.color }}>
        {s.reached ? st.label : '— nicht erreicht'}
      </span>
      {/* Wirkungs-Balken (Glyph, kein Prozent) */}
      <span style={{ flex: 1, height: 7, background: '#1a1b22', border: '1px solid rgba(80,80,90,0.5)', position: 'relative', minWidth: 40 }}>
        <span style={{ position: 'absolute', inset: 0, width: `${Math.round(s.wirkung * 100)}%`, background: st.color, opacity: 0.8 }} />
      </span>
      {/* Badges */}
      <span style={{ flex: '0 0 auto', display: 'flex', gap: 5, fontSize: 9 }}>
        {s.geimpft && <span style={{ color: '#6a8acc' }} title="Faktencheck-Zeitung auf dem Tisch">✚ geimpft</span>}
        {!s.geimpft && s.wittert && <span style={{ color: '#c8960c' }}>◔ wittert</span>}
        {s.kippNah && !s.geimpft && (
          <span data-testid={`mv-kipp-${s.segmentId}`} style={{ color: '#E5484D', fontWeight: 700 }} title="steht kurz vorm Umschlagen">
            ⚑ noch {s.stoesseBisFahne} {s.stoesseBisFahne === 1 ? 'Stoß' : 'Stöße'}
          </span>
        )}
      </span>
    </div>
  );
}

/** Repräsentative Stimme (§6): Name · Gruppe · Stempel-farbiger O-Ton. */
function StimmeCard({ v }: { v: Stimme }): React.JSX.Element {
  const st = STEMPEL_STYLE[v.stempel];
  const rand = v.geimpft ? '#6a8acc' : st.color;
  return (
    <div
      data-testid={`mv-stimme-${v.gruppeLabel}`}
      style={{ flex: '1 1 240px', minWidth: 220, borderLeft: `3px solid ${rand}`, background: 'rgba(8,10,16,0.55)', padding: '7px 11px' }}
    >
      <div style={{ fontSize: 13, fontStyle: 'italic', color: '#e6dcc0', lineHeight: 1.45 }}>{v.oTon}</div>
      <div style={{ fontSize: 10, color: StoryModeColors.lightConcrete, marginTop: 4 }}>
        — <b style={{ color: StoryModeColors.document }}>{v.name}</b>, {v.gruppeLabel}
        <span style={{ color: rand, marginLeft: 6, fontWeight: 700, letterSpacing: 0.5 }}>
          {v.geimpft ? '✚ GEIMPFT' : st.label}
        </span>
      </div>
    </div>
  );
}

/** Qualitative Deutung der Stichproben-Verzerrung (kein Zahlwert, „nie die Matrix als Zahl"). */
function biasStyle(bias: number): { text: string; color: string } {
  if (bias > 0.12) return { text: '↯ Die Stichprobe schmeichelt der Masche — draußen verfängt sie schwächer.', color: '#E5484D' };
  if (bias > 0.04) return { text: '↗ Die Stichprobe ist etwas zu wohlgesonnen.', color: '#c8960c' };
  if (bias < -0.04) return { text: '↘ Die Stichprobe ist strenger als die Wirklichkeit.', color: '#6a8acc' };
  return { text: '≈ Stichprobe und Wirklichkeit decken sich.', color: '#6a8a6a' };
}

/** Zahlloser Wirkungs-Balken: nur die Länge trägt die Aussage (Stempel/Stöße-Doktrin). */
function Bar({ label, value, color, testid }: { label: string; value: number; color: string; testid: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete, marginBottom: 2 }}>{label}</div>
      <div style={{ height: 10, background: '#1a1b22', border: `1px solid ${StoryModeColors.borderLight}`, position: 'relative' }}>
        <div data-testid={testid} style={{ position: 'absolute', inset: 0, width: `${Math.round(value * 100)}%`, background: color, opacity: 0.85 }} />
      </div>
    </div>
  );
}

export default MaschenVortestView;
