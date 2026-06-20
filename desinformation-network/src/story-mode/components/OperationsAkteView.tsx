/**
 * OperationsAkteView — „Operations-Akte" (P2 Kommunikations-Schlachtfeld).
 *
 * Kompaktes, diegetisches Aktendeckblatt: der Spieler stellt eine Operation aus
 * vier Schritten zusammen — Ziel → Schwäche → Verbreiter → Plattform-Mix — und sieht
 * rechts die Live-Wirkungs-Analyse (Reichweite/Wirkung/Milieu-Passung/Enttarnungs-Risiko)
 * direkt aus der reinen BattlefieldChain-Engine. „Ausspielen" reicht die Auswahl als
 * params an den Orchestrator zurück (params-Durchstich).
 *
 * Props-getrieben (kein Hook auf Spiel-State, wie FokusgruppeView): Daten kommen über
 * die Loader-Listen, die Bewertung über evaluateOperationParams. Konzept/Skizze:
 * docs/STRANG34_P2_VERBREITER_PLATTFORM_KONZEPT.md (§4 Trade-off, §5 Kette, §6 Schema).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoryModeColors } from '../theme';
import {
  evaluateOperationParams,
  resolveOperationParams,
  kompromatCost,
  type Carrier,
  type OperationParams,
  type OperationResult,
  type Platform,
  type ResolvedOperation,
  type Target,
} from '../battlefield/BattlefieldChain';

// ─── Öffentliche Props ────────────────────────────────────────────────────────

export interface OperationsAkteViewProps {
  targets: Target[];
  carriers: Carrier[];
  platforms: Platform[];
  /** Aktueller Gegendruck/Faktencheck (0..1, z. B. attention/100) — speist die Vorschau. */
  factcheckPressure?: number;
  /** Sättigung des Informationsraums (0..1, z. B. risk/100). */
  saturation?: number;
  /** Optionales Raum-Hintergrundbild (Operationszentrale) hinter dem abgedunkelten Deckel. */
  backdropUrl?: string;
  // ── Operations-Ökonomie (optional; ohne diese Props keine Aufbau-/Beschaffungs-Pflicht) ──
  /** Verbreiter-Zustände (`verfügbar`/`aufbau`/`aktiv`/`verbrannt`) je carrier-id. */
  carrierStates?: Record<string, string>;
  /** Beschaffte Kompromat-Schlüssel `targetId:vulnId`. */
  acquiredKompromat?: string[];
  /** Verbreiter aufbauen (kostet Budget/Kapazität). */
  onBuildCarrier?: (carrierId: string) => void;
  /** Kompromat beschaffen (kostet Budget ~ Heikelheit). */
  onAcquireKompromat?: (targetId: string, vulnId: string) => void;
  /** Auswahl als params + bewertetes Resultat — der Orchestrator spielt aus. */
  onAusspielen: (params: OperationParams, result: OperationResult) => void;
  onClose: () => void;
}

// ─── Auswahl-Zustand + reine Helfer (testbar) ────────────────────────────────

export interface AkteSelection {
  targetId: string | null;
  vulnId: string | null;
  carrierId: string | null;
  platformIds: string[];
}

export const EMPTY_SELECTION: AkteSelection = {
  targetId: null,
  vulnId: null,
  carrierId: null,
  platformIds: [],
};

/** Auswahl → params (leere Felder fallen weg, rückwärtskompatibel zur Engine). */
export function operationParamsOf(sel: AkteSelection): OperationParams {
  return {
    target: sel.targetId ?? undefined,
    vulnerability: sel.vulnId ?? undefined,
    carrier: sel.carrierId ?? undefined,
    platforms: sel.platformIds.length > 0 ? sel.platformIds : undefined,
  };
}

/** Welche Schritte fehlen noch? (für die diegetische „unvollständig"-Anzeige). */
export function missingSteps(resolved: ResolvedOperation): string[] {
  const missing: string[] = [];
  if (!resolved.target) missing.push('Ziel');
  if (!resolved.vulnerability) missing.push('Schwäche');
  if (!resolved.carrier) missing.push('Verbreiter');
  if (resolved.platforms.length === 0) missing.push('Plattform');
  return missing;
}

/** 0..1 → „72 %". */
export function formatPct(value: number): string {
  return `${Math.round(value * 100)} %`;
}

/**
 * Ampelfarbe für eine Messgröße. Bei `invert` (Risiko) ist hoch = gefährlich (rot),
 * sonst ist hoch = stark (grün). Drei Stufen passend zur v2-Palette.
 */
export function gaugeColor(value: number, invert = false): string {
  const v = invert ? 1 - value : value;
  if (v >= 0.6) return StoryModeColors.success;
  if (v >= 0.33) return StoryModeColors.warning;
  return StoryModeColors.danger;
}

/** Kleiner „Dossier-Aktion"-Knopf (Aufbauen/Beschaffen) im Papier-Look. */
const dossierBtnStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  marginLeft: 19,
  padding: '2px 8px',
  fontSize: 9,
  fontFamily: "'VT323', monospace",
  fontWeight: 700,
  letterSpacing: 0.5,
  color: '#1a1a1a',
  backgroundColor: '#c9b27a',
  border: '1px solid #8a7c5a',
  cursor: 'pointer',
};

// ─── CSS-Keyframes (Präfix oa-) ───────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes oa-in {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes oa-bar {
    from { width: 0%; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-oa-panel] { animation: none !important; }
    [data-oa-fill]  { animation: none !important; }
  }
`;

// ─── kleine Bausteine ─────────────────────────────────────────────────────────

/** Schritt-Überschrift mit Nummern-Marke (diegetische Reiter). */
function StepHeader({ num, title, hint }: { num: string; title: string; hint?: string }): React.JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 900,
          color: '#0d0d0d',
          backgroundColor: StoryModeColors.ministryRed,
          padding: '1px 6px',
          letterSpacing: 1,
        }}
      >
        {num}
      </span>
      <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1, color: '#1a1a1a' }}>{title}</span>
      {hint && <span style={{ fontSize: 9, color: '#5a5040', fontStyle: 'italic' }}>{hint}</span>}
    </div>
  );
}

/** Mini-Balken für eine 0..1-Kennzahl in einer Options-Zeile. */
function MiniStat({ label, value, invert }: { label: string; value: number; invert?: boolean }): React.JSX.Element {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }} title={`${label}: ${formatPct(value)}`}>
      <span style={{ fontSize: 8, color: '#6a5f4a', letterSpacing: 0.5 }}>{label}</span>
      <span style={{ position: 'relative', width: 26, height: 5, backgroundColor: '#c4b48e', border: '1px solid #8a7c5a' }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            width: `${Math.round(value * 100)}%`,
            backgroundColor: gaugeColor(value, invert),
          }}
        />
      </span>
    </span>
  );
}

/** Auswahl-Zeile (Ziel/Verbreiter): Radio-artig, paper-Look. */
function OptionRow({
  selected,
  onClick,
  title,
  subtitle,
  stats,
  testid,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  stats?: React.ReactNode;
  testid?: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      aria-pressed={selected}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        textAlign: 'left',
        padding: '5px 8px',
        backgroundColor: selected ? '#e7d9b4' : '#d8c9a8',
        border: `2px solid ${selected ? StoryModeColors.ministryRed : '#a8966c'}`,
        cursor: 'pointer',
        fontFamily: "'VT323', monospace",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 11,
          height: 11,
          flexShrink: 0,
          borderRadius: '50%',
          border: `2px solid ${selected ? StoryModeColors.ministryRed : '#8a7c5a'}`,
          backgroundColor: selected ? StoryModeColors.ministryRed : 'transparent',
        }}
      />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: 9, color: '#5a5040', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {subtitle}
        </span>
      </span>
      {stats && <span style={{ display: 'flex', gap: 6, flexShrink: 0 }}>{stats}</span>}
    </button>
  );
}

/** Wirkungs-Anzeige: ein Balken pro Kennzahl. */
function Gauge({ label, value, invert }: { label: string; value: number | null; invert?: boolean }): React.JSX.Element {
  const v = value ?? 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: StoryModeColors.textSecondary, marginBottom: 2 }}>
        <span style={{ letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontWeight: 700, color: value === null ? StoryModeColors.textMuted : gaugeColor(v, invert) }}>
          {value === null ? '—' : formatPct(v)}
        </span>
      </div>
      <div style={{ position: 'relative', height: 9, backgroundColor: StoryModeColors.background, border: `1px solid ${StoryModeColors.border}` }}>
        <div
          data-oa-fill=""
          style={{
            position: 'absolute',
            inset: 0,
            width: `${Math.round(v * 100)}%`,
            backgroundColor: value === null ? StoryModeColors.surfaceLight : gaugeColor(v, invert),
            animation: 'oa-bar 0.4s ease-out',
          }}
        />
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export function OperationsAkteView({
  targets,
  carriers,
  platforms,
  factcheckPressure,
  saturation,
  backdropUrl,
  carrierStates,
  acquiredKompromat,
  onBuildCarrier,
  onAcquireKompromat,
  onAusspielen,
  onClose,
}: OperationsAkteViewProps): React.JSX.Element {
  const [sel, setSel] = useState<AkteSelection>(EMPTY_SELECTION);

  // Ökonomie-Helfer: ohne Props (Standalone/Test) gilt alles als nutzbar.
  const economy = Boolean(carrierStates || acquiredKompromat);
  const carrierStateOf = (id: string): string => carrierStates?.[id] ?? 'aktiv';
  const carrierActive = (id: string): boolean => !carrierStates || carrierStateOf(id) === 'aktiv';
  const carrierBurned = (id: string): boolean => carrierStateOf(id) === 'verbrannt';
  const kompromatKey = (targetId: string, vulnId: string) => `${targetId}:${vulnId}`;
  const vulnAcquired = (targetId: string, vulnId: string): boolean =>
    !acquiredKompromat || acquiredKompromat.includes(kompromatKey(targetId, vulnId));

  // Escape schließt die Akte.
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selectedTarget = useMemo(() => targets.find((t) => t.id === sel.targetId) ?? null, [targets, sel.targetId]);

  // Ziel wählen setzt die Schwäche-Auswahl zurück (vuln-ids sind zielgebunden).
  const pickTarget = useCallback((id: string) => {
    setSel((s) => (s.targetId === id ? s : { ...s, targetId: id, vulnId: null }));
  }, []);
  const pickVuln = useCallback((id: string) => setSel((s) => ({ ...s, vulnId: id })), []);
  const pickCarrier = useCallback((id: string) => setSel((s) => ({ ...s, carrierId: id })), []);
  const togglePlatform = useCallback((id: string) => {
    setSel((s) => ({
      ...s,
      platformIds: s.platformIds.includes(id) ? s.platformIds.filter((p) => p !== id) : [...s.platformIds, id],
    }));
  }, []);

  const ctx = useMemo(() => ({ targets, carriers, platforms, factcheckPressure, saturation }), [targets, carriers, platforms, factcheckPressure, saturation]);
  const params = useMemo(() => operationParamsOf(sel), [sel]);
  const resolved = useMemo(() => resolveOperationParams(params, ctx), [params, ctx]);
  const result = useMemo(() => evaluateOperationParams(params, ctx), [params, ctx]);
  const missing = useMemo(() => missingSteps(resolved), [resolved]);
  // Ökonomie-Reife: gewählter Verbreiter aktiv UND Kompromat beschafft.
  const economyReady =
    !economy ||
    ((sel.carrierId ? carrierActive(sel.carrierId) : false) &&
      (sel.targetId && sel.vulnId ? vulnAcquired(sel.targetId, sel.vulnId) : false));
  const complete = missing.length === 0 && result !== null && economyReady;

  // Zusatz-Hinweis, wenn Auswahl komplett aber Ökonomie fehlt.
  const economyHint = (() => {
    if (!economy || missing.length > 0) return null;
    if (sel.carrierId && carrierBurned(sel.carrierId)) return 'Verbreiter verbrannt — anderen wählen.';
    if (sel.carrierId && !carrierActive(sel.carrierId)) return 'Verbreiter erst aufbauen.';
    if (sel.targetId && sel.vulnId && !vulnAcquired(sel.targetId, sel.vulnId)) return 'Kompromat erst beschaffen.';
    return null;
  })();

  const ausspielen = useCallback(() => {
    if (result && economyReady) onAusspielen(params, result);
  }, [result, economyReady, params, onAusspielen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Operations-Akte"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: "'VT323', monospace",
        // Diegetisch: Operationszentrale-Raum durchscheinend hinter dem Aktendeckel.
        backgroundColor: '#08080a',
        ...(backdropUrl
          ? {
              backgroundImage: `linear-gradient(rgba(8,8,10,0.86), rgba(8,8,10,0.86)), url(${backdropUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'pixelated' as const,
            }
          : { backgroundColor: 'rgba(8,8,10,0.82)' }),
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Aktendeckel (kompakt, paper-Look) ─────────────────────────────── */}
      <div
        data-oa-panel=""
        style={{
          width: 'min(880px, 96vw)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: StoryModeColors.document,
          border: `3px solid ${StoryModeColors.border}`,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18)',
          animation: 'oa-in 0.28s ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Kopfband */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 14px',
            backgroundColor: '#1a1715',
            borderBottom: `3px solid ${StoryModeColors.ministryRed}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 3, color: StoryModeColors.textPrimary }}>OPERATIONS-AKTE</span>
            <span style={{ fontSize: 9, letterSpacing: 1, color: StoryModeColors.textMuted }}>
              AZ WU-{String(targets.length)}{String(carriers.length)}/{String(platforms.length)} · SONDEROPERATIONEN
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 1,
                color: StoryModeColors.ministryRed,
                border: `1px solid ${StoryModeColors.ministryRed}`,
                padding: '0 5px',
                transform: 'rotate(-3deg)',
              }}
              aria-hidden="true"
            >
              VERTRAULICH
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Operations-Akte schliessen"
            style={{
              background: 'none',
              border: `2px solid ${StoryModeColors.ministryRed}`,
              color: StoryModeColors.textPrimary,
              fontSize: 15,
              fontWeight: 900,
              width: 28,
              height: 28,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </header>

        {/* Körper: links Auswahl, rechts Wirkungs-Analyse */}
        <div style={{ display: 'flex', minHeight: 0, flex: 1 }}>
          {/* ── Linke Spalte: vier Schritte ───────────────────────────────── */}
          <div style={{ flex: '1 1 58%', minWidth: 0, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 1 · Ziel */}
            <section>
              <StepHeader num="1" title="ZIEL" hint="fiktive Archetypen" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {targets.map((t) => (
                  <OptionRow
                    key={t.id}
                    testid={`oa-target-${t.id}`}
                    selected={sel.targetId === t.id}
                    onClick={() => pickTarget(t.id)}
                    title={t.name}
                    subtitle={t.role_de}
                    stats={<MiniStat label="ANS" value={t.standing} />}
                  />
                ))}
              </div>
            </section>

            {/* 2 · Schwäche (nur wenn Ziel gewählt) */}
            <section>
              <StepHeader num="2" title="SCHWÄCHE" hint={selectedTarget ? 'Angriffsfläche' : 'erst Ziel wählen'} />
              {selectedTarget ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selectedTarget.vulnerabilities.map((v) => {
                    const acquired = vulnAcquired(selectedTarget.id, v.id);
                    return (
                      <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <OptionRow
                          testid={`oa-vuln-${v.id}`}
                          selected={sel.vulnId === v.id}
                          onClick={() => pickVuln(v.id)}
                          title={v.label_de}
                          subtitle={`Heikelheit ${formatPct(v.heikelheit)}${economy ? (acquired ? ' · beschafft ✓' : '') : ''}`}
                          stats={<MiniStat label="GLB" value={v.glaubwuerdigkeit} />}
                        />
                        {economy && !acquired && (
                          <button
                            type="button"
                            data-testid={`oa-acquire-${v.id}`}
                            onClick={() => onAcquireKompromat?.(selectedTarget.id, v.id)}
                            style={dossierBtnStyle}
                          >
                            ▸ Kompromat beschaffen ({kompromatCost(v)}k)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: 10, fontStyle: 'italic', color: '#7a6e54', padding: '4px 2px' }}>— Kein Ziel gewählt —</div>
              )}
            </section>

            {/* 3 · Verbreiter */}
            <section>
              <StepHeader num="3" title="VERBREITER" hint="WER trägt die Botschaft" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {carriers.map((c) => {
                  const state = carrierStateOf(c.id);
                  const active = carrierActive(c.id);
                  const burned = carrierBurned(c.id);
                  const stateLabel = !economy ? '' : burned ? ' · VERBRANNT' : active ? ' · aktiv ✓' : ' · verfügbar';
                  return (
                    <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, opacity: burned ? 0.55 : 1 }}>
                      <OptionRow
                        testid={`oa-carrier-${c.id}`}
                        selected={sel.carrierId === c.id}
                        onClick={() => pickCarrier(c.id)}
                        title={`${c.label_de}${stateLabel}`}
                        subtitle={`Aufbau ${c.buildCost.budget}k · ${c.buildCost.phases} Phase(n)`}
                        stats={
                          <>
                            <MiniStat label="RW" value={c.reach} />
                            <MiniStat label="GLB" value={c.credibility} />
                            <MiniStat label="RISK" value={c.exposure} invert />
                          </>
                        }
                      />
                      {economy && !active && !burned && (
                        <button
                          type="button"
                          data-testid={`oa-build-${c.id}`}
                          onClick={() => onBuildCarrier?.(c.id)}
                          style={dossierBtnStyle}
                        >
                          ▸ Verbreiter aufbauen ({c.buildCost.budget}k · {c.buildCost.capacity} Kap.)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4 · Plattform-Mix (Mehrfachauswahl) */}
            <section>
              <StepHeader num="4" title="PLATTFORM-MIX" hint="WO es landet · mehrere möglich" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {platforms.map((p) => {
                  const on = sel.platformIds.includes(p.id);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      data-testid={`oa-platform-${p.id}`}
                      aria-pressed={on}
                      onClick={() => togglePlatform(p.id)}
                      title={`${p.label_de} — Reichweite ${formatPct(p.reach)}, Moderation ${formatPct(p.moderation)}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        padding: '4px 8px',
                        backgroundColor: on ? '#e7d9b4' : '#d8c9a8',
                        border: `2px solid ${on ? StoryModeColors.ministryRed : '#a8966c'}`,
                        cursor: 'pointer',
                        fontFamily: "'VT323', monospace",
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>
                        {on ? '☑' : '☐'} {p.label_de}
                      </span>
                      <span style={{ display: 'flex', gap: 6 }}>
                        <MiniStat label="RW" value={p.reach} />
                        <MiniStat label="MOD" value={p.moderation} invert />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Rechte Spalte: Wirkungs-Analyse + Ausspielen ──────────────── */}
          <aside
            style={{
              flex: '1 1 42%',
              minWidth: 0,
              padding: '12px 14px',
              backgroundColor: StoryModeColors.surface,
              borderLeft: `3px solid ${StoryModeColors.border}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, color: StoryModeColors.textPrimary, marginBottom: 10 }}>
              WIRKUNGS-ANALYSE
            </div>

            <Gauge label="Reichweite" value={result?.reach ?? null} />
            <Gauge label="Wirkung" value={result?.impact ?? null} />
            <Gauge label="Milieu-Passung" value={result?.milieuFit ?? null} />
            <Gauge label="Enttarnungs-Risiko" value={result?.exposureRisk ?? null} invert />

            {/* FOLGEN — der Loop sichtbar machen: Wirkung ↔ Sieg, Enttarnung ↔ Rückschlag */}
            {result && (
              <div
                style={{
                  marginTop: 4,
                  padding: '7px 9px',
                  backgroundColor: StoryModeColors.background,
                  border: `1px solid ${StoryModeColors.border}`,
                  fontSize: 10,
                  lineHeight: 1.45,
                }}
              >
                <div style={{ fontSize: 8, letterSpacing: 1, color: StoryModeColors.textMuted, marginBottom: 3 }}>FOLGEN</div>
                <div style={{ color: StoryModeColors.success }}>
                  ▼ Wirkung senkt das Institutionen-Vertrauen (Ihr Sieg-Ziel).
                </div>
                {result.exposureRisk >= 0.5 && (
                  <div style={{ color: StoryModeColors.danger, marginTop: 2 }}>
                    ⚠ Enttarnungs-Gefahr: Verbreiter kann verbrennen → Vertrauen der Gegenseite steigt zurück, Risiko + moralische Last springen.
                  </div>
                )}
              </div>
            )}

            {/* Schlagzeilen-Vorschau */}
            <div
              style={{
                marginTop: 10,
                padding: '8px 10px',
                backgroundColor: StoryModeColors.background,
                border: `1px dashed ${StoryModeColors.borderLight}`,
                minHeight: 46,
              }}
            >
              <div style={{ fontSize: 8, letterSpacing: 1, color: StoryModeColors.textMuted, marginBottom: 3 }}>VORSCHAU — AUSSPIELUNG</div>
              <div data-testid="oa-headline" style={{ fontSize: 11, color: result ? (economyHint ? StoryModeColors.danger : StoryModeColors.warning) : StoryModeColors.textMuted, lineHeight: 1.4 }}>
                {economyHint ? economyHint : result ? result.headline_de : `Es fehlt noch: ${missing.join(', ')}.`}
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <button
              type="button"
              data-testid="oa-ausspielen"
              disabled={!complete}
              onClick={ausspielen}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '9px 0',
                backgroundColor: complete ? StoryModeColors.ministryRed : StoryModeColors.surfaceLight,
                border: `2px solid ${complete ? StoryModeColors.darkRed : StoryModeColors.border}`,
                color: complete ? '#fff' : StoryModeColors.textMuted,
                fontSize: 13,
                fontFamily: "'VT323', monospace",
                fontWeight: 900,
                letterSpacing: 2,
                cursor: complete ? 'pointer' : 'not-allowed',
              }}
            >
              AUSSPIELEN ▸
            </button>
            <div style={{ marginTop: 6, textAlign: 'center', fontSize: 8, letterSpacing: 1, color: StoryModeColors.textMuted }}>
              REIN BEWERTEND · ESC ZUM SCHLIESSEN
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OperationsAkteView;
