/**
 * FokusgruppePreTest — beauftragbare Fokusgruppe (Konzept §3/§7). Der Spieler wählt
 * einen Botschafts-Appell + eine STICHPROBE von Personas, beauftragt die Befragung
 * (kostet Zeit = eine Phase) und sieht die Prognose je Persona — plus die
 * Sample-Bias-Warnung: eine einseitige Stichprobe bestätigt einen nur selbst.
 *
 * Props-getrieben (kein Hook auf Spiel-State) → isoliert testbar. Porträts kommen
 * aus dem Asset-Registry (persona_<id>_<mood>), mit Initialen-Fallback.
 */
import { useMemo, useState } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors, StoryModeFonts } from '../theme';
import {
  preTest,
  type Persona,
  type MessageAppeal,
  type PersonaMood,
  type PreTestResult,
} from '../audience/fokusgruppeModel';
import {
  buildWirkungsMatrix,
  recommendCampaigns,
  APPEAL_LABEL,
  APPEALS as ALL_APPEALS,
  type CellClass,
  type WirkungsMatrix,
  type MatrixCell,
  type KampagnenEmpfehlung,
  type CampaignSeed,
  type SegmentInfo,
} from '../audience/kampagnenSchmiede';
import type { Target, Carrier, Platform } from '../battlefield/BattlefieldChain';
import {
  findingsFromMatrix,
  mergeFindings,
  detectArcs,
  type Erkenntnis,
  type KampagnenArc,
} from '../audience/dossierModel';

/** Budget-Kosten einer Beauftragung (bewusst moderat — Testen soll sich lohnen). */
export const FOKUSGRUPPE_COST = 8;

const APPEALS: { id: MessageAppeal; label: string; desc: string }[] = [
  { id: 'hope', label: 'Aufbruch', desc: 'Modernisierung, Versprechen' },
  { id: 'fear', label: 'Abstiegsangst', desc: 'Bedrohung, Nostalgie' },
  { id: 'anger', label: 'Empörung', desc: '„die da oben", Schuldige' },
  { id: 'trust', label: 'Seriosität', desc: 'Establishment, Institutionen' },
];

// Auf den dunklen Video-Kacheln (diegetisch); v3: danger ist jetzt Tinte,
// daher hartkodiert das helle v2-Rot.
const MOOD_COLOR: Record<PersonaMood, string> = {
  zustimmend: '#6a8a6a',
  skeptisch: '#F0B429' /* hell: dunkle Video-Kulisse */,
  ablehnend: '#E5484D',
};
const MOOD_LABEL: Record<PersonaMood, string> = {
  zustimmend: 'Zustimmung',
  skeptisch: 'skeptisch',
  ablehnend: 'Ablehnung',
};

export interface FokusgruppePreTestProps {
  personas: Persona[];
  /** Aktuelles Budget (für die Bezahlbarkeits-Sperre). */
  budget: number;
  /** Beauftragung bestätigt — Aufrufer zieht Budget (FOKUSGRUPPE_COST) ab + kostet eine Phase. */
  onCommission: () => void;
  // ── Kampagnen-Schmiede (optional): erst mit diesen Props erscheinen Empfehlungen ──
  /** Audience-Milieus (Größe/Glaube) — priorisieren die Empfehlungen. */
  segments?: SegmentInfo[];
  /** Ziel-Roster (Operations-Akte) für die Vorbelegung. */
  targets?: Target[];
  /** Verbreiter-Roster. */
  carriers?: Carrier[];
  /** Plattform-Roster. */
  platforms?: Platform[];
  /** Aktueller Faktencheck-/Gegendruck 0..1 (erwartete Wirkung). */
  factcheckPressure?: number;
  /** Sättigung des Informationsraums 0..1. */
  saturation?: number;
  /** Empfehlung starten → Aufrufer öffnet die Operations-Akte vorbefüllt. */
  onLaunchCampaign?: (seed: CampaignSeed) => void;
  // ── Erkenntnis-Dossier (optional): Befunde über Runden sammeln ──
  /** Bereits gesammelte Erkenntnisse (aus dem dossierStore). */
  dossier?: Erkenntnis[];
  /** Aktuelle Phase — stempelt neue Befunde. */
  phase?: number;
  /** Neue Sweet-Spot-Befunde ans Dossier melden (bei Beauftragung). */
  onRecordFindings?: (findings: Erkenntnis[]) => void;
  onClose: () => void;
}

/** -1..1 → 0..100 % für die Balkenbreite. */
const pct = (v: number): number => Math.round(((v + 1) / 2) * 100);

export function FokusgruppePreTest({
  personas,
  budget,
  onCommission,
  segments,
  targets,
  carriers,
  platforms,
  factcheckPressure,
  saturation,
  onLaunchCampaign,
  dossier,
  phase,
  onRecordFindings,
  onClose,
}: FokusgruppePreTestProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_analyse'); // Einwegspiegel-Beobachtungsraum (diegetisch)
  const [appeal, setAppeal] = useState<MessageAppeal>('hope');
  const [sample, setSample] = useState<string[]>(personas.map((p) => p.id));
  const [result, setResult] = useState<PreTestResult | null>(null);

  const affordable = budget >= FOKUSGRUPPE_COST;
  const canCommission = sample.length > 0 && affordable && !result;

  const toggle = (id: string): void =>
    setSample((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const commission = (): void => {
    if (!canCommission) return;
    onCommission();
    setResult(preTest(appeal, personas, sample));
    // Erkenntnis-Dossier: die entdeckten Sweet Spots dieser Befragung festhalten.
    if (onRecordFindings) {
      const found = findingsFromMatrix(buildWirkungsMatrix(personas, sample), phase ?? 0);
      if (found.length > 0) onRecordFindings(found);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fokusgruppe beauftragen"
      data-testid="fokusgruppe-pretest"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        // v3: Raum bleibt dunkel-diegetisch → heller Papier-Ton statt Tinten-Token.
        color: StoryModeColors.document, fontFamily: StoryModeFonts.world,
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
        <span style={{ fontFamily: StoryModeFonts.label, fontSize: 16, color: '#F0B429' /* hell: dunkle Video-Kulisse */, letterSpacing: 2 }}>
          ZIELGRUPPEN-ANALYSE
        </span>
        <span style={{ fontSize: 14, color: StoryModeColors.lightConcrete }}>Fokusgruppe beauftragen</span>
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
          <div style={{ fontSize: 13, color: StoryModeColors.lightConcrete, marginBottom: 6 }}>1 · Welche Botschaft testen?</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {APPEALS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAppeal(a.id)}
                aria-pressed={appeal === a.id}
                style={{
                  textAlign: 'left', padding: '8px 12px', cursor: 'pointer',
                  border: `2px solid ${appeal === a.id ? '#F0B429' /* hell: dunkle Video-Kulisse */ : StoryModeColors.borderLight}`,
                  background: appeal === a.id ? 'rgba(232,178,58,0.12)' : 'transparent', color: StoryModeColors.document,
                }}
              >
                <div style={{ fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete }}>{a.desc}</div>
              </button>
            ))}
          </div>

          {/* Schritt 2: Stichprobe */}
          <div style={{ fontSize: 13, color: StoryModeColors.lightConcrete, marginBottom: 6 }}>
            2 · Wen befragen? <span style={{ color: StoryModeColors.lightConcrete }}>(Vorsicht: eine einseitige Auswahl verzerrt das Ergebnis.)</span>
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
                    border: `2px solid ${on ? '#F0B429' /* hell: dunkle Video-Kulisse */ : StoryModeColors.borderLight}`,
                    background: on ? 'rgba(232,178,58,0.10)' : 'transparent', color: StoryModeColors.document, opacity: on ? 1 : 0.6,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete }}>{p.milieu}</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={commission}
            disabled={!canCommission}
            data-testid="pretest-commission"
            style={{
              alignSelf: 'flex-start', padding: '10px 20px', fontSize: 15, fontWeight: 700, cursor: canCommission ? 'pointer' : 'not-allowed',
              border: `3px solid ${StoryModeColors.darkRed}`, background: StoryModeColors.ministryRed, color: '#fff', opacity: canCommission ? 1 : 0.5,
            }}
          >
            BEFRAGUNG BEAUFTRAGEN ▸ <span style={{ fontWeight: 400, fontSize: 12 }}>(kostet {FOKUSGRUPPE_COST} Budget + eine Phase)</span>
          </button>
          {!affordable && (
            // v3: danger ist Tinte — auf dem dunklen Raum helles v2-Rot (diegetisch).
            <div data-testid="pretest-unaffordable" style={{ marginTop: 8, fontSize: 12, color: '#E5484D' }}>
              Budget zu niedrig ({budget} / {FOKUSGRUPPE_COST}).
            </div>
          )}
        </>
      ) : (
        <PreTestResultView
          result={result}
          personas={personas}
          sample={sample}
          assets={assets}
          onReset={() => setResult(null)}
          segments={segments}
          targets={targets}
          carriers={carriers}
          platforms={platforms}
          factcheckPressure={factcheckPressure}
          saturation={saturation}
          onLaunchCampaign={onLaunchCampaign}
          dossier={dossier}
          phase={phase}
        />
      )}
      </div>
    </div>
  );
}

interface ResultProps {
  result: PreTestResult;
  personas: Persona[];
  sample: string[];
  assets: ReturnType<typeof useAssets>;
  onReset: () => void;
  segments?: SegmentInfo[];
  targets?: Target[];
  carriers?: Carrier[];
  platforms?: Platform[];
  factcheckPressure?: number;
  saturation?: number;
  onLaunchCampaign?: (seed: CampaignSeed) => void;
  dossier?: Erkenntnis[];
  phase?: number;
}

function PreTestResultView({
  result,
  personas,
  sample,
  assets,
  onReset,
  segments,
  targets,
  carriers,
  platforms,
  factcheckPressure,
  saturation,
  onLaunchCampaign,
  dossier,
  phase,
}: ResultProps): React.JSX.Element {
  const byId = new Map(personas.map((p) => [p.id, p]));

  // Baustein 2: Wirkungs-Matrix (Appell × Milieu) über die befragte Stichprobe.
  const matrix = useMemo(() => buildWirkungsMatrix(personas, sample), [personas, sample]);

  // Baustein 1: Kampagnen-Empfehlungen — nur mit den Operations-Rostern + Start-Callback.
  const recommendations = useMemo<KampagnenEmpfehlung[]>(() => {
    if (!targets || !carriers || !platforms || !onLaunchCampaign) return [];
    return recommendCampaigns({
      personas,
      sampleIds: sample,
      segments: segments ?? [],
      targets,
      carriers,
      platforms,
      factcheckPressure,
      saturation,
    });
  }, [personas, sample, segments, targets, carriers, platforms, factcheckPressure, saturation, onLaunchCampaign]);

  const segLabelById = new Map((segments ?? []).map((s) => [s.id, s.label_de]));

  // Erkenntnis-Dossier: gesammelte Befunde (inkl. dieser Runde) + daraus abgeleitete Arcs.
  const roundFindings = useMemo(() => findingsFromMatrix(matrix, phase ?? 0), [matrix, phase]);
  const allFindings = useMemo(() => mergeFindings(dossier ?? [], roundFindings), [dossier, roundFindings]);
  const arcs = useMemo(() => detectArcs(allFindings, segLabelById), [allFindings, segLabelById]);

  return (
    <div>
      {/* Prognose vs. Realität */}
      <div style={{ marginBottom: 14 }}>
        <Bar label="Ihre Prognose (Stichprobe)" value={result.predictedReception} color={'#F0B429' /* hell: dunkle Video-Kulisse */} testid="pretest-predicted" />
        {/* v3: agencyBlue ist Tinte — auf dem dunklen Raum helleres Blau (diegetisch). */}
        <Bar label="Tatsächliche Gesamtwirkung" value={result.trueReception} color="#3a7acc" testid="pretest-true" />
      </div>

      {result.warning && (
        <div
          data-testid="pretest-warning"
          style={{
            border: `2px solid ${StoryModeColors.danger}`, background: 'rgba(194,37,59,0.12)', padding: '8px 12px',
            marginBottom: 14, fontSize: 13, color: StoryModeColors.document,
          }}
        >
          ⚠ {result.warning}
        </div>
      )}

      {/* Baustein 2: Wirkungs-Landkarte — wo welcher Appell zündet (Sweet Spot) oder zurückschlägt (Falle). */}
      <WirkungsMatrixView matrix={matrix} segLabelById={segLabelById} />

      {/* Baustein 1: Kampagnen-Empfehlungen — startklare Operationen aus den Sweet Spots. */}
      {recommendations.length > 0 && onLaunchCampaign && (
        <div data-testid="pretest-empfehlungen" style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: StoryModeFonts.label, fontSize: 13, color: '#F0B429', letterSpacing: 1, marginBottom: 8 }}>
            EMPFEHLUNGEN DER ANALYSE-ABTEILUNG
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {recommendations.map((emp) => (
              <EmpfehlungCard key={emp.id} emp={emp} onLaunch={() => onLaunchCampaign(emp.seed)} />
            ))}
          </div>
        </div>
      )}

      {/* Erkenntnis-Dossier: über Runden gesammelte Sweet Spots + verdichtete Arcs. */}
      {dossier !== undefined && allFindings.length > 0 && (
        <div data-testid="pretest-dossier" style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: StoryModeFonts.label, fontSize: 13, color: '#3a7acc', letterSpacing: 1, marginBottom: 8 }}>
            ERKENNTNIS-DOSSIER · {allFindings.length} SWEET SPOT{allFindings.length === 1 ? '' : 'S'}
          </div>
          {/* Befund-Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: arcs.length > 0 ? 10 : 0 }}>
            {allFindings
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((f) => (
                <span
                  key={f.id}
                  style={{
                    fontSize: 10,
                    padding: '2px 7px',
                    border: '1px solid #3a7acc',
                    background: 'rgba(58,122,204,0.10)',
                    color: StoryModeColors.document,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {APPEAL_LABEL[f.appeal]} · {segLabelById.get(f.segmentId) ?? f.segmentId.replace(/^wu_/, '')}{' '}
                  <span style={{ color: '#8fb8e8' }}>+{Math.round(f.value * 100)}</span>
                </span>
              ))}
          </div>
          {/* Kampagnen-Arcs (verdichtete Strategie über mehrere Befunde) */}
          {arcs.map((arc) => (
            <ArcCard key={arc.id} arc={arc} />
          ))}
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
                  <span style={{ fontFamily: StoryModeFonts.display, fontSize: 22, color: StoryModeColors.lightConcrete }}>
                    {p.name.split(' ').map((s) => s[0]).join('')}
                  </span>
                )}
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete, marginBottom: 4 }}>{p.milieu}</div>
                <div style={{ fontSize: 12, color: MOOD_COLOR[r.mood], fontWeight: 700 }}>{MOOD_LABEL[r.mood]}</div>
                {p.vulnerabilities.length > 0 && (
                  <div style={{ fontSize: 11, color: StoryModeColors.lightConcrete, marginTop: 4 }}>
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

// ─── Wirkungs-Matrix (Appell × Milieu) ────────────────────────────────────────

/** Farb-/Textcode je Zellen-Klasse — auf der dunklen, diegetischen Video-Kulisse. */
const CELL_STYLE: Record<CellClass, { bg: string; fg: string; border: string }> = {
  sweet: { bg: '#2f6b2f', fg: '#e6f2e6', border: '#4a8a4a' },
  gut: { bg: '#4a5626', fg: '#eef0d2', border: '#7a8a3a' },
  neutral: { bg: '#33343c', fg: '#a8a8b0', border: '#4a4a52' },
  falle: { bg: '#7a1f22', fg: '#f5dada', border: '#c0333a' },
  unbekannt: { bg: '#14151b', fg: '#4a4b53', border: '#26262e' },
};

function WirkungsMatrixView({
  matrix,
  segLabelById,
}: {
  matrix: WirkungsMatrix;
  segLabelById: Map<string, string>;
}): React.JSX.Element {
  const cols = matrix.segmentIds;
  const cellFor = (appeal: MessageAppeal, seg: string): MatrixCell =>
    matrix.cells.find((c) => c.appeal === appeal && c.segmentId === seg)!;
  const shortLabel = (id: string): string =>
    (segLabelById.get(id) ?? id.replace(/^wu_/, '')).replace(/^Die /, '');

  return (
    <div data-testid="pretest-matrix" style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: StoryModeFonts.label, fontSize: 13, color: '#F0B429', letterSpacing: 1, marginBottom: 8 }}>
        WIRKUNGS-LANDKARTE · APPELL × MILIEU
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `70px repeat(${cols.length}, minmax(48px, 1fr))`,
            gap: 2,
            minWidth: 70 + cols.length * 50,
          }}
        >
          {/* Kopfzeile: Milieu-Kürzel */}
          <div />
          {cols.map((seg) => (
            <div
              key={`h-${seg}`}
              title={segLabelById.get(seg) ?? seg}
              style={{ fontSize: 9, color: StoryModeColors.lightConcrete, textAlign: 'center', padding: '2px 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {shortLabel(seg)}
            </div>
          ))}

          {/* Zeilen: je Appell eine Reihe */}
          {ALL_APPEALS.map((appeal) => (
            <FragmentRow key={appeal} appeal={appeal} cols={cols} cellFor={cellFor} />
          ))}
        </div>
      </div>
      <div style={{ fontSize: 9, color: StoryModeColors.lightConcrete, marginTop: 6, letterSpacing: 0.5 }}>
        <span style={{ color: CELL_STYLE.sweet.border }}>██ Sweet Spot</span> ·{' '}
        <span style={{ color: CELL_STYLE.falle.border }}>██ Falle (schlägt zurück)</span> · ? unbefragt
      </div>
    </div>
  );
}

/** Eine Matrix-Zeile (Appell-Label + Milieu-Zellen). */
function FragmentRow({
  appeal,
  cols,
  cellFor,
}: {
  appeal: MessageAppeal;
  cols: string[];
  cellFor: (appeal: MessageAppeal, seg: string) => MatrixCell;
}): React.JSX.Element {
  return (
    <>
      <div style={{ fontSize: 10, color: StoryModeColors.document, display: 'flex', alignItems: 'center', paddingRight: 4, whiteSpace: 'nowrap' }}>
        {APPEAL_LABEL[appeal]}
      </div>
      {cols.map((seg) => {
        const c = cellFor(appeal, seg);
        const st = CELL_STYLE[c.klass];
        const text = c.value === null ? '?' : `${c.value >= 0 ? '+' : ''}${Math.round(c.value * 100)}`;
        return (
          <div
            key={`${appeal}-${seg}`}
            data-testid={`matrix-cell-${appeal}-${seg}`}
            title={c.value === null ? 'nicht befragt' : `${c.sampled} befragt`}
            style={{
              backgroundColor: st.bg,
              color: st.fg,
              border: `1px solid ${st.border}`,
              fontSize: 11,
              fontWeight: 700,
              textAlign: 'center',
              padding: '4px 1px',
            }}
          >
            {text}
          </div>
        );
      })}
    </>
  );
}

// ─── Empfehlungs-Karte (Brücke Analyse → Operations-Akte) ─────────────────────

function EmpfehlungCard({ emp, onLaunch }: { emp: KampagnenEmpfehlung; onLaunch: () => void }): React.JSX.Element {
  const warn = emp.biasWarned;
  return (
    <div
      data-testid={`pretest-empfehlung-${emp.segmentId}`}
      style={{
        width: 236,
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${warn ? '#E5484D' : '#3a7acc'}`,
        background: warn ? 'rgba(120,30,34,0.18)' : 'rgba(12,20,34,0.7)',
      }}
    >
      <div style={{ padding: '6px 9px', borderBottom: `1px solid ${warn ? '#E5484D' : '#3a7acc'}`, background: 'rgba(5,8,14,0.55)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: StoryModeColors.document, lineHeight: 1.2 }}>{emp.title_de}</div>
        {warn && (
          <div style={{ fontSize: 9, fontWeight: 700, color: '#E5484D', letterSpacing: 0.5, marginTop: 2 }}>⚠ RISIKO: WUNSCH-STICHPROBE</div>
        )}
      </div>
      <div style={{ padding: '7px 9px', fontSize: 10, color: StoryModeColors.lightConcrete, lineHeight: 1.4, flex: 1 }}>
        {emp.rationale_de}
      </div>
      {emp.expected && (
        <div style={{ display: 'flex', gap: 8, padding: '0 9px 6px', fontSize: 9, color: StoryModeColors.lightConcrete }}>
          <span title="erwartete Reichweite">Reichw. {Math.round(emp.expected.reach * 100)}%</span>
          <span title="erwartete Wirkung">Wirk. {Math.round(emp.expected.impact * 100)}%</span>
          <span title="Enttarnungs-Risiko" style={{ color: emp.expected.exposureRisk >= 0.66 ? '#E5484D' : StoryModeColors.lightConcrete }}>
            Enttarn. {Math.round(emp.expected.exposureRisk * 100)}%
          </span>
        </div>
      )}
      {emp.partial && (
        <div style={{ padding: '0 9px 6px', fontSize: 9, color: '#F0B429' }}>Ziel in der Akte noch wählen.</div>
      )}
      <button
        type="button"
        data-testid={`pretest-launch-${emp.segmentId}`}
        onClick={onLaunch}
        style={{
          margin: '0 9px 9px',
          padding: '7px 10px',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'VT323', monospace",
          cursor: 'pointer',
          color: '#fff',
          border: `2px solid ${StoryModeColors.darkRed}`,
          background: StoryModeColors.ministryRed,
        }}
      >
        KAMPAGNE STARTEN ▸
      </button>
    </div>
  );
}

// ─── Kampagnen-Arc-Karte (verdichtete Strategie aus mehreren Befunden) ────────

function ArcCard({ arc }: { arc: KampagnenArc }): React.JSX.Element {
  const isBrand = arc.kind === 'flaechenbrand';
  const accent = isBrand ? '#F0B429' : '#8fb8e8';
  return (
    <div
      data-testid={`pretest-arc-${arc.kind}`}
      style={{
        border: `1px solid ${isBrand ? '#c8960c' : '#3a7acc'}`,
        background: isBrand ? 'rgba(200,150,12,0.10)' : 'rgba(58,122,204,0.10)',
        padding: '6px 9px',
        marginBottom: 6,
        display: 'flex',
        gap: 8,
        alignItems: 'baseline',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 900, color: accent, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
        ◆ {arc.title_de}
      </span>
      <span style={{ fontSize: 10, color: StoryModeColors.lightConcrete, lineHeight: 1.35, flex: 1, minWidth: 180 }}>
        {arc.rationale_de}
      </span>
    </div>
  );
}

function Bar({ label, value, color, testid }: { label: string; value: number; color: string; testid: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: StoryModeColors.lightConcrete }}>
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
