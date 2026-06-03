/**
 * BlueprintStudio — Neuanfang „Sendung & Publikum" als eigenständige, grafikfreie Skizze.
 *
 * Eigenes Design-System (Blueprint/Schematik): Tinten-Navy, feines Koordinaten-Raster als Stil,
 * dünne Linien, Mono-Labels, EIN Amber-Akzent. KEIN Bezug zur alten Story-Mode-Hülle/Brutalismus.
 * Wiederverwendet ausschließlich die *reine Logik* aus dem Publikums-Modell.
 *
 * Erreichbar unter  #studio  (siehe App.tsx). Koordinaten sind hier Teil der Ästhetik:
 * Gebäude A/B × Etage + L (Lift), HUD-Zonen F1 (Sendung) · Q (Quote) · P (Publikum).
 */
import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import buildingData from '../story-mode/data/building.json';
import {
  loadAudience,
  reactToEffect,
  detectionDampen,
  type AudienceCountry,
  type Channel,
  type Mood,
} from '../story-mode/audience/audienceModel';
import { THEME_LABEL, THEME_HEADLINE } from '../story-mode/audience/themeText';

// ── Design-Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#0a0f1e',
  panel: 'rgba(143,184,200,0.035)',
  line: 'rgba(143,184,200,0.30)',
  lineSoft: 'rgba(143,184,200,0.14)',
  ink: '#8fb8c8',
  text: '#d6ebf1',
  dim: '#6b8a99',
  accent: '#f5c451',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

const MOODS: Record<Mood, { c: string; l: string }> = {
  ruhig: { c: '#5fd0e0', l: 'ruhig' },
  verunsichert: { c: '#f5c451', l: 'verunsichert' },
  wuetend: { c: '#ff6b5e', l: 'wütend' },
  misstrauisch: { c: '#b39ddb', l: 'misstrauisch' },
};

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'tv', label: 'TV' },
  { id: 'print', label: 'ZEITUNG' },
  { id: 'social', label: 'SOCIAL' },
];

interface BFloor { id: string; level: number; label_de: string }
interface BRoom { id: string; floor: string; col?: number; npcId: string; label_de: string }

const FLOORS = (buildingData.floors as BFloor[]).slice().sort((a, b) => b.level - a.level);
const ROOMS = buildingData.rooms as BRoom[];
const COLS = Math.max(1, ...ROOMS.map((r) => r.col ?? 1));
const colLetter = (c: number): string => String.fromCharCode(64 + c);

function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function freshCopy(cs: AudienceCountry[]): AudienceCountry[] {
  return cs.map((c) => ({
    ...c,
    segments: c.segments.map((s) => ({
      ...s,
      vulnerabilities: [...s.vulnerabilities],
      reachedBy: [...s.reachedBy],
      demographics: { ...s.demographics },
    })),
  }));
}

// ── Bausteine ────────────────────────────────────────────────────────────────
function Panel({ label, code, children, style }: { label: string; code?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <section style={{ position: 'relative', border: `1px solid ${T.line}`, background: T.panel, padding: '20px 16px 16px', ...style }}>
      <span style={{ position: 'absolute', top: -8, left: 12, background: T.bg, padding: '0 6px', font: `600 11px ${T.mono}`, letterSpacing: '0.14em', color: T.ink }}>{label}</span>
      {code && <span style={{ position: 'absolute', top: -8, right: 12, background: T.bg, padding: '0 5px', font: `700 10px ${T.mono}`, color: T.accent }}>{code}</span>}
      {children}
    </section>
  );
}

function ElevatorColumn() {
  return (
    <div style={{ width: 36, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 18, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: T.lineSoft }} />
      <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', font: `700 11px ${T.mono}`, color: T.accent }}>L</span>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '4%', width: 22, height: '22%', border: `1px solid ${T.ink}`, background: hexA(T.ink, 0.08), animation: 'bp-lift 9s ease-in-out infinite' }}>
        <div style={{ height: '100%', width: 1, margin: '0 auto', background: T.lineSoft }} />
      </div>
    </div>
  );
}

function RoomCell({ room, code }: { room: BRoom; code: string }) {
  const onAir = room.id === 'medien_zentrum';
  return (
    <div style={{ position: 'relative', border: `1px solid ${T.line}`, padding: '8px 8px 10px', minHeight: 58, background: hexA(T.ink, 0.03) }}>
      <span style={{ position: 'absolute', top: 3, right: 5, font: `700 10px ${T.mono}`, color: T.accent }}>{code}</span>
      <div style={{ font: `600 12px ${T.mono}`, color: T.text }}>{room.label_de}</div>
      <div style={{ font: `10px ${T.mono}`, color: T.dim, marginTop: 2 }}>◦ {room.npcId}</div>
      {onAir && (
        <div style={{ position: 'absolute', bottom: 5, right: 6, font: `700 8px ${T.mono}`, color: '#ff6b5e' }}>
          <span style={{ animation: 'bp-blink 1.4s ease-in-out infinite' }}>● ON AIR</span>
        </div>
      )}
    </div>
  );
}

function EmptyCell({ code }: { code: string }) {
  return (
    <div style={{ position: 'relative', border: `1px dashed ${T.lineSoft}`, minHeight: 58, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ font: `10px ${T.mono}`, color: hexA(T.ink, 0.35) }}>{code}</span>
    </div>
  );
}

function BuildingSchematic() {
  const gridCols = `26px repeat(${COLS}, 1fr)`;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: gridCols, gap: 8 }}>
          <div />
          {Array.from({ length: COLS }, (_, i) => (
            <div key={i} style={{ textAlign: 'center', font: `700 11px ${T.mono}`, color: T.accent }}>{colLetter(i + 1)}</div>
          ))}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <div style={{ flex: 1 }}>
          {FLOORS.map((floor) => (
            <div key={floor.id} style={{ marginBottom: 10 }}>
              <div style={{ font: `10px ${T.mono}`, color: T.dim, marginBottom: 4, paddingLeft: 34, letterSpacing: '0.04em' }}>{floor.label_de}</div>
              <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 13px ${T.mono}`, color: T.accent }}>{floor.level}</div>
                {Array.from({ length: COLS }, (_, i) => {
                  const col = i + 1;
                  const room = ROOMS.find((r) => r.floor === floor.id && (r.col ?? 1) === col);
                  const code = `${colLetter(col)}${floor.level}`;
                  return room ? <RoomCell key={col} room={room} code={code} /> : <EmptyCell key={col} code={code} />;
                })}
              </div>
            </div>
          ))}
        </div>
        <ElevatorColumn />
      </div>
    </div>
  );
}

// ── Hauptkomponente ──────────────────────────────────────────────────────────
export function BlueprintStudio() {
  const [countries, setCountries] = useState<AudienceCountry[]>(() => freshCopy(loadAudience()));
  const [countryId, setCountryId] = useState<string>('nordmark');
  const [channel, setChannel] = useState<Channel>('social');
  const [theme, setTheme] = useState<string>('anti_establishment');
  const [risk, setRisk] = useState<number>(20);
  const [lastSource, setLastSource] = useState<string | null>(null);

  const country = countries.find((c) => c.id === countryId) ?? countries[0];
  const effIntensity = detectionDampen(0.85, risk);

  const themes = useMemo(() => {
    const set = new Set<string>();
    country.segments.forEach((s) => s.vulnerabilities.forEach((v) => set.add(v)));
    set.add(theme);
    return Array.from(set);
  }, [country, theme]);

  const preview = useMemo(
    () => reactToEffect(country, { themes: [theme], channel, intensity: effIntensity }),
    [country, theme, channel, effIntensity],
  );
  const byId = new Map(preview.reactions.map((r) => [r.segmentId, r]));
  const quotePct = Math.round(preview.quote * 100);
  const channelLabel = CHANNELS.find((c) => c.id === channel)?.label ?? '';
  const headline = THEME_HEADLINE[theme] ?? theme;

  const air = () => {
    setCountries((prev) =>
      prev.map((c) =>
        c.id !== countryId
          ? c
          : {
              ...c,
              segments: c.segments.map((s) => {
                const r = byId.get(s.id);
                return r ? { ...s, belief: r.newBelief, mood: r.newMood } : s;
              }),
            },
      ),
    );
    setLastSource('Manuelle Sendung');
  };

  const selectStyle: CSSProperties = { background: T.bg, color: T.text, border: `1px solid ${T.line}`, font: `12px ${T.mono}`, padding: '4px 6px' };

  return (
    <div className="bp-root" style={{ minHeight: '100vh', maxHeight: '100vh', overflow: 'auto', background: T.bg, color: T.text }}>
      <style>{`
        .bp-root{
          background-image:
            linear-gradient(${T.lineSoft} 1px, transparent 1px),
            linear-gradient(90deg, ${T.lineSoft} 1px, transparent 1px);
          background-size: 30px 30px;
        }
        @keyframes bp-lift { 0%,12%{top:4%} 30%,42%{top:38%} 60%,72%{top:72%} 90%,100%{top:4%} }
        @keyframes bp-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes bp-pulse { 0%,100%{box-shadow:0 0 0 0 ${hexA(T.accent,0)} } 50%{box-shadow:0 0 12px 1px ${hexA(T.accent,0.55)} } }
        @keyframes bp-scan { 0%{transform:translateY(-120%)} 100%{transform:translateY(520%)} }
        .bp-root select:focus{ outline:1px solid ${T.accent}; }
      `}</style>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 22px 28px' }}>
        {/* Kopf */}
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${T.line}`, paddingBottom: 12, marginBottom: 18 }}>
          <div>
            <div style={{ font: `700 18px ${T.mono}`, letterSpacing: '0.14em', color: T.text }}>DESINFORMATION · LAGEBILD</div>
            <div style={{ font: `11px ${T.mono}`, color: T.dim, marginTop: 3, letterSpacing: '0.06em' }}>OPERATION SPALTUNG · grafikfreie Skizze · Koordinaten = Stil</div>
          </div>
          <label style={{ font: `10px ${T.mono}`, color: T.dim, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            ZIELLAND
            <select value={countryId} onChange={(e) => setCountryId(e.target.value)} style={selectStyle}>
              {countries.map((c) => (<option key={c.id} value={c.id}>{c.label_de}{c.allegory ? ` (≈ ${c.allegory})` : ''}</option>))}
            </select>
          </label>
        </header>

        {/* Obere Reihe: Gebäude | Sendung+Quote+Risiko */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 18, alignItems: 'start' }}>
          <Panel label="GEBÄUDE — SCHNITT">
            <BuildingSchematic />
          </Panel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Panel label="SENDUNG" code="F1">
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChannel(c.id)}
                    style={{ flex: 1, cursor: 'pointer', font: `700 10px ${T.mono}`, letterSpacing: '0.08em', padding: '4px 0', background: 'transparent', color: channel === c.id ? T.accent : T.dim, border: `1px solid ${channel === c.id ? T.accent : T.line}` }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', overflow: 'hidden', border: `1px solid ${T.line}`, padding: '10px 12px', minHeight: 60, background: hexA(T.ink, 0.04) }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 16, background: `linear-gradient(${hexA(T.ink, 0.12)}, transparent)`, animation: 'bp-scan 3.6s linear infinite', pointerEvents: 'none' }} />
                <div style={{ font: `10px ${T.mono}`, color: T.dim, marginBottom: 5 }}>» {channelLabel} · {lastSource ? 'GESENDET' : 'VORSCHAU'}</div>
                <div style={{ font: '600 14px system-ui, sans-serif', color: T.text, lineHeight: 1.25 }}>{headline}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                  {themes.map((t) => (<option key={t} value={t}>{THEME_LABEL[t] ?? t}</option>))}
                </select>
                <button onClick={air} style={{ cursor: 'pointer', font: `700 12px ${T.mono}`, letterSpacing: '0.08em', color: T.accent, background: 'transparent', border: `1px solid ${T.accent}`, padding: '6px 12px' }}>▷ AUSSTRAHLEN</button>
              </div>
            </Panel>

            <Panel label="EINSCHALTQUOTE" code="Q">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} style={{ width: 9, height: 24, border: `1px solid ${T.line}`, background: i < Math.round((quotePct / 100) * 12) ? T.accent : 'transparent' }} />
                  ))}
                </div>
                <div style={{ font: `700 30px ${T.mono}`, color: T.accent, lineHeight: 1 }}>{quotePct}<span style={{ fontSize: 14 }}>%</span></div>
              </div>
              <div style={{ font: `10px ${T.mono}`, color: T.dim, marginTop: 6 }}>{country.label_de} · {channelLabel} · {lastSource ?? 'Prognose'}</div>
            </Panel>

            <Panel label="LAGE / RISIKO">
              <div style={{ display: 'flex', justifyContent: 'space-between', font: `10px ${T.mono}`, color: T.dim }}>
                <span>ENTDECKUNGS-RISIKO</span><span style={{ color: risk >= 50 ? '#ff6b5e' : T.ink }}>{risk}%</span>
              </div>
              <input type="range" min={0} max={100} value={risk} onChange={(e) => setRisk(Number(e.target.value))} style={{ width: '100%', accentColor: T.accent, marginTop: 6 }} />
              {risk >= 50 && <div style={{ font: `700 10px ${T.mono}`, color: '#ff6b5e', marginTop: 4 }}>⚠ FAKTENCHECK AKTIV — Wirkung gedämpft</div>}
            </Panel>
          </div>
        </div>

        {/* Publikum */}
        <Panel label="PUBLIKUM — WER SPRINGT AN?" code="P" style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {country.segments.map((seg) => {
              const r = byId.get(seg.id);
              const m = MOODS[seg.mood];
              const on = !!r && r.reached && r.resonance > 0;
              const dim = 46 + Math.round(seg.size * 46);
              return (
                <div key={seg.id} style={{ width: 128, opacity: r && !r.reached ? 0.4 : 1 }}>
                  <div style={{ width: dim, height: dim, margin: '0 auto', borderRadius: '50%', border: `2px solid ${on ? T.accent : m.c}`, background: `radial-gradient(circle, ${hexA(m.c, 0.18)}, transparent 72%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: on ? 'bp-pulse 1.7s ease-in-out infinite' : undefined }}>
                    <span style={{ font: `700 12px ${T.mono}`, color: m.c }}>{Math.round(seg.belief * 100)}%</span>
                  </div>
                  <div style={{ font: `10px ${T.mono}`, color: T.dim, textAlign: 'center', marginTop: 8, lineHeight: 1.25 }}>{seg.label_de}</div>
                  <div style={{ font: `9px ${T.mono}`, color: on ? T.accent : m.c, textAlign: 'center', marginTop: 2 }}>{on ? '▲ springt an' : m.l}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Fuß / Legende */}
        <footer style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 16, font: `10px ${T.mono}`, color: T.dim }}>
          <span style={{ color: T.ink }}>LEGENDE</span>
          {(Object.keys(MOODS) as Mood[]).map((k) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: MOODS[k].c, display: 'inline-block' }} /> {MOODS[k].l}
            </span>
          ))}
          <span style={{ marginLeft: 'auto' }}>fiktiv · Bildungszweck · Glaube = Anteil im Segment · Effekt = DISARM-Aktion</span>
        </footer>
      </div>
    </div>
  );
}

export default BlueprintStudio;
