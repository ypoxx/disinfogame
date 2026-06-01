/**
 * StudioScene — „Sendung & Publikum" als EINE gezeichnete Gebäude-Schnitt-Szene (SVG), keine Panels.
 *
 * Ansatz: ein zusammenhängender Querschnitt (Fassade, Etagenböden, offene Räume mit angedeuteten
 * Möbeln, durchgehender Lift), ein Studio mit Dach-Antenne, eine Ausstrahlungs-Linie zum Wohnzimmer-
 * TV des Publikums, und das Publikum als gezeichnete Figuren auf einer Couch. Zahlen (Quote/Glaube)
 * BESCHRIFTEN die Zeichnung. Leichter Handzeichnungs-Filter (feTurbulence/Displacement) für Skizzen-Look.
 *
 * Eigenständig (#studio), eigenes Design-System; wiederverwendet nur die reine Logik (audienceModel).
 */
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
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

const T = {
  bg: '#0a0f1e',
  grid: 'rgba(143,184,200,0.12)',
  ink: '#9fc6d6',
  inkSoft: 'rgba(159,198,214,0.45)',
  text: '#d6ebf1',
  dim: '#7796a5',
  accent: '#f5c451',
  red: '#ff6b5e',
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
const FLOORS = buildingData.floors as BFloor[];
const ROOMS = buildingData.rooms as BRoom[];
const levelOf = (floorId: string): number => FLOORS.find((f) => f.id === floorId)?.level ?? 0;
const roomAt = (col: number, level: number): BRoom | undefined =>
  ROOMS.find((r) => levelOf(r.floor) === level && (r.col ?? 1) === col);
const colLetter = (c: number): string => String.fromCharCode(64 + c);

function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function freshCopy(cs: AudienceCountry[]): AudienceCountry[] {
  return cs.map((c) => ({ ...c, segments: c.segments.map((s) => ({ ...s, vulnerabilities: [...s.vulnerabilities], reachedBy: [...s.reachedBy], demographics: { ...s.demographics } })) }));
}

// Geometrie des Schnitts
const BAND: Record<number, [number, number]> = { 2: [60, 216], 1: [216, 372], 0: [372, 528] };
const COLX: Record<number, [number, number]> = { 1: [60, 300], 2: [300, 540] };
const LIFT: [number, number] = [540, 620];

/** Angedeutete Möbel je Raum (dünne Linien). */
function Furniture({ id, x, y }: { id: string; x: number; y: number }) {
  const s = { stroke: T.ink, strokeWidth: 1.4, fill: 'none' };
  switch (id) {
    case 'cyber_lab':
      return (
        <g {...s}>
          {[0, 16, 32].map((dx) => <rect key={dx} x={x + dx} y={y} width={12} height={26} />)}
          {[0, 16, 32].map((dx) => <circle key={dx} cx={x + dx + 6} cy={y + 6} r={1.6} fill={T.accent} stroke="none" />)}
        </g>
      );
    case 'medien_zentrum': // Studio: Kamera + kleiner Monitor
      return (
        <g {...s}>
          <rect x={x} y={y} width={34} height={22} />
          <line x1={x + 50} y1={y + 24} x2={x + 50} y2={y + 6} />
          <rect x={x + 42} y={y - 6} width={18} height={12} />
          <circle cx={x + 60} cy={y} r={3} />
        </g>
      );
    case 'zentrale':
      return (<g {...s}><rect x={x} y={y + 10} width={46} height={8} /><line x1={x + 8} y1={y + 18} x2={x + 8} y2={y + 28} /><circle cx={x - 6} cy={y + 8} r={6} /></g>);
    case 'feld_ops':
      return (<g {...s}><rect x={x} y={y} width={40} height={28} /><line x1={x} y1={y} x2={x + 40} y2={y + 28} /><circle cx={x + 28} cy={y + 10} r={3} fill={T.accent} stroke="none" /></g>);
    case 'finanzen':
      return (<g {...s}><rect x={x} y={y} width={30} height={30} /><circle cx={x + 15} cy={y + 15} r={7} /><line x1={x + 15} y1={y + 15} x2={x + 21} y2={y + 11} /></g>);
    default:
      return null;
  }
}

function Person({ x, y, mood, on }: { x: number; y: number; mood: Mood; on: boolean }) {
  const c = MOODS[mood].c;
  return (
    <g transform={`translate(${x},${y})`}>
      {on && <circle cx={0} cy={-10} r={22} fill="none" stroke={T.accent} strokeWidth={2} className="ss-pulse" />}
      <path d="M -10 14 Q 0 -10 10 14 Z" fill={hexA(c, 0.18)} stroke={c} strokeWidth={1.6} />
      <circle cx={0} cy={-16} r={6.5} fill={hexA(c, 0.28)} stroke={c} strokeWidth={1.6} />
      {mood === 'wuetend' && <><line x1={-4} y1={-19} x2={-1.5} y2={-17.5} stroke={c} strokeWidth={1.2} /><line x1={4} y1={-19} x2={1.5} y2={-17.5} stroke={c} strokeWidth={1.2} /></>}
      {mood === 'ruhig' && <line x1={-2.5} y1={-15} x2={2.5} y2={-15} stroke={c} strokeWidth={1.2} />}
    </g>
  );
}

export function StudioScene() {
  const [countries, setCountries] = useState<AudienceCountry[]>(() => freshCopy(loadAudience()));
  const [countryId, setCountryId] = useState('nordmark');
  const [channel, setChannel] = useState<Channel>('social');
  const [theme, setTheme] = useState('anti_establishment');
  const [risk, setRisk] = useState(20);
  const [aired, setAired] = useState(false);

  const country = countries.find((c) => c.id === countryId) ?? countries[0];
  const effIntensity = detectionDampen(0.85, risk);
  const themes = useMemo(() => {
    const set = new Set<string>();
    country.segments.forEach((s) => s.vulnerabilities.forEach((v) => set.add(v)));
    set.add(theme);
    return Array.from(set);
  }, [country, theme]);
  const preview = useMemo(() => reactToEffect(country, { themes: [theme], channel, intensity: effIntensity }), [country, theme, channel, effIntensity]);
  const byId = new Map(preview.reactions.map((r) => [r.segmentId, r]));
  const quotePct = Math.round(preview.quote * 100);
  const headline = THEME_HEADLINE[theme] ?? theme;
  const factcheck = risk >= 50;

  const air = () => {
    setCountries((prev) => prev.map((c) => c.id !== countryId ? c : {
      ...c, segments: c.segments.map((s) => { const r = byId.get(s.id); return r ? { ...s, belief: r.newBelief, mood: r.newMood } : s; }),
    }));
    setAired(true);
  };

  // Publikum-Figuren auf der Couch verteilen
  const segs = country.segments;
  const coLeft = 705, coRight = 950;
  const step = segs.length > 1 ? (coRight - coLeft) / (segs.length - 1) : 0;

  const selectStyle: CSSProperties = { background: T.bg, color: T.text, border: `1px solid ${T.inkSoft}`, font: `12px ${T.mono}`, padding: '4px 6px' };
  const txt = (size: number, color = T.text, weight = 400): CSSProperties => ({ font: `${weight} ${size}px ${T.mono}`, fill: color } as CSSProperties);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, overflow: 'auto' }}>
      <style>{`
        @keyframes ss-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes ss-pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes ss-lift { 0%,12%{transform:translateY(0)} 30%,42%{transform:translateY(150px)} 60%,72%{transform:translateY(300px)} 90%,100%{transform:translateY(0)} }
        @keyframes ss-dash { to { stroke-dashoffset: -24; } }
        @keyframes ss-wave { 0%{opacity:.9;transform:scale(.4)} 100%{opacity:0;transform:scale(1.4)} }
        .ss-pulse{animation:ss-blink 1.6s ease-in-out infinite}
        .ss-cab{animation:ss-lift 9s ease-in-out infinite}
        .ss-sig{stroke-dasharray:6 6;animation:ss-dash 1s linear infinite}
        .ss-wave{transform-origin:center;animation:ss-wave 2.2s ease-out infinite}
        .ss-blink{animation:ss-blink 1.4s ease-in-out infinite}
      `}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '18px 20px 26px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <div style={{ font: `700 17px ${T.mono}`, letterSpacing: '0.12em' }}>DESINFORMATION · SENDESCHNITT</div>
            <div style={{ font: `11px ${T.mono}`, color: T.dim, marginTop: 2 }}>Skizze · Agentur sendet → Publikum schaut · fiktiv, Bildungszweck</div>
          </div>
          <label style={{ font: `10px ${T.mono}`, color: T.dim, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            ZIELLAND
            <select value={countryId} onChange={(e) => { setCountryId(e.target.value); setAired(false); }} style={selectStyle}>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.label_de}{c.allegory ? ` (≈ ${c.allegory})` : ''}</option>)}
            </select>
          </label>
        </header>

        <svg viewBox="0 0 1000 590" width="100%" style={{ display: 'block', border: `1px solid ${hexA(T.ink, 0.18)}`, background: `linear-gradient(${T.grid} 1px,transparent 1px) 0 0/30px 30px, linear-gradient(90deg,${T.grid} 1px,transparent 1px) 0 0/30px 30px, ${T.bg}` }}>
          <defs>
            <filter id="ss-sketch"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={7} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} /></filter>
          </defs>

          {/* ── Gezeichnete Struktur (mit Skizzen-Filter) ── */}
          <g filter="url(#ss-sketch)" fill="none" stroke={T.ink} strokeWidth={2} strokeLinecap="round">
            {/* Fassade */}
            <rect x={60} y={60} width={560} height={468} />
            {/* Etagenböden */}
            <line x1={60} y1={216} x2={620} y2={216} />
            <line x1={60} y1={372} x2={620} y2={372} />
            {/* Innenwände + Lift-Schacht */}
            <line x1={300} y1={60} x2={300} y2={528} stroke={T.inkSoft} />
            <line x1={540} y1={60} x2={540} y2={528} />
            {/* Antenne auf dem Dach (über Studio B2) */}
            <line x1={420} y1={60} x2={420} y2={28} />
            <line x1={412} y1={36} x2={428} y2={36} />
            {/* Möbel */}
            <Furniture id="cyber_lab" x={150} y={150} />
            <Furniture id="medien_zentrum" x={350} y={150} />
            <Furniture id="zentrale" x={170} y={300} />
            <Furniture id="feld_ops" x={360} y={300} />
            <Furniture id="finanzen" x={165} y={455} />
            {/* Wohnzimmer (Publikum) rechts: Wand + Couch */}
            <rect x={672} y={300} width={316} height={228} stroke={hexA(T.ink, 0.5)} />
            <rect x={690} y={318} width={120} height={74} />{/* TV-Gehäuse */}
            <rect x={700} y={476} width={262} height={26} rx={8} />{/* Couch */}
            <line x1={700} y1={476} x2={700} y2={462} /><line x1={962} y1={476} x2={962} y2={462} />
          </g>

          {/* Antennen-Wellen */}
          {[0, 0.7, 1.4].map((d, i) => (
            <circle key={i} cx={420} cy={30} r={10} fill="none" stroke={T.accent} strokeWidth={1.5} className="ss-wave" style={{ animationDelay: `${d}s` }} />
          ))}
          {/* Ausstrahlungs-Linie Antenne → Wohnzimmer-TV */}
          <path d="M 430 34 C 560 40, 600 320, 690 350" fill="none" stroke={hexA(T.accent, 0.8)} strokeWidth={1.6} className="ss-sig" />

          {/* Lift-Kabine */}
          <g className="ss-cab"><rect x={560} y={70} width={36} height={120} fill={hexA(T.ink, 0.08)} stroke={T.ink} strokeWidth={1.5} /><line x1={578} y1={70} x2={578} y2={190} stroke={T.inkSoft} /></g>

          {/* ── Beschriftungen (ohne Filter, scharf) ── */}
          {/* Spalten / Etagen / Lift */}
          <text x={180} y={52} textAnchor="middle" style={txt(12, T.accent, 700)}>A</text>
          <text x={420} y={52} textAnchor="middle" style={txt(12, T.accent, 700)}>B</text>
          <text x={580} y={52} textAnchor="middle" style={txt(12, T.accent, 700)}>L</text>
          {[2, 1, 0].map((lvl) => <text key={lvl} x={48} y={(BAND[lvl][0] + BAND[lvl][1]) / 2} textAnchor="middle" style={txt(13, T.accent, 700)}>{lvl}</text>)}
          {/* Raum-Labels + Codes */}
          {[2, 1, 0].flatMap((lvl) => [1, 2].map((col) => {
            const room = roomAt(col, lvl); const [x0] = COLX[col]; const [y0] = BAND[lvl];
            const code = `${colLetter(col)}${lvl}`;
            return (
              <g key={code}>
                <text x={x0 + 10} y={y0 + 18} style={txt(9, T.accent, 700)}>{code}</text>
                {room
                  ? <text x={x0 + 10} y={y0 + 32} style={txt(11, T.text)}>{room.label_de}</text>
                  : <text x={x0 + 10} y={y0 + 32} style={txt(10, hexA(T.ink, 0.4))}>—</text>}
              </g>
            );
          }))}
          {/* Studio ON AIR */}
          <text x={356} y={146} style={txt(8, T.red, 700)} className="ss-blink">● ON AIR</text>

          {/* Wohnzimmer-TV-Inhalt (foreignObject für Textumbruch) */}
          <foreignObject x={696} y={324} width={108} height={62}>
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', font: `600 9.5px ${T.mono}`, color: '#cfe8ee', lineHeight: 1.15 }}>
              <div style={{ color: T.dim, fontSize: 7.5 }}>» {CHANNELS.find((c) => c.id === channel)?.label} · {aired ? 'GESENDET' : 'VORSCHAU'}</div>
              <div>{headline}</div>
            </div>
          </foreignObject>
          {factcheck && <text x={750} y={312} textAnchor="middle" style={txt(8, T.red, 700)}>⚠ FAKTENCHECK</text>}

          {/* Publikum-Label + Quote */}
          <text x={672} y={292} style={txt(11, T.dim, 700)}>PUBLIKUM · {country.label_de.toUpperCase()} — wer schaut zu?</text>
          <text x={905} y={336} textAnchor="end" style={txt(9, T.dim, 700)}>QUOTE</text>
          <text x={905} y={364} textAnchor="end" style={txt(30, T.accent, 700)}>{quotePct}%</text>

          {/* Figuren (Publikum) */}
          {segs.map((seg, i) => {
            const r = byId.get(seg.id); const on = !!r && r.reached && r.resonance > 0;
            const x = coLeft + step * i; const reached = r ? r.reached : true;
            return (
              <g key={seg.id} opacity={reached ? 1 : 0.4}>
                <Person x={x} y={470} mood={seg.mood} on={on} />
                <text x={x} y={500} textAnchor="middle" style={txt(8.5, on ? T.accent : MOODS[seg.mood].c, 700)}>{Math.round(seg.belief * 100)}%</text>
                <text x={x} y={512} textAnchor="middle" style={txt(7, T.dim)}>{seg.label_de.split(' · ')[0]}</text>
                {on && <text x={x} y={444} textAnchor="middle" style={txt(7.5, T.accent, 700)}>▲ springt an</text>}
              </g>
            );
          })}
        </svg>

        {/* Schmale Steuerleiste (bewusst unauffällig, kein Dashboard) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 12, font: `11px ${T.mono}`, color: T.dim }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {CHANNELS.map((c) => (
              <button key={c.id} onClick={() => setChannel(c.id)} style={{ cursor: 'pointer', font: `700 10px ${T.mono}`, padding: '4px 8px', background: 'transparent', color: channel === c.id ? T.accent : T.dim, border: `1px solid ${channel === c.id ? T.accent : T.inkSoft}` }}>{c.label}</button>
            ))}
          </div>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={selectStyle}>
            {themes.map((t) => <option key={t} value={t}>{THEME_LABEL[t] ?? t}</option>)}
          </select>
          <button onClick={air} style={{ cursor: 'pointer', font: `700 11px ${T.mono}`, letterSpacing: '0.06em', color: T.accent, background: 'transparent', border: `1px solid ${T.accent}`, padding: '5px 12px' }}>▷ AUSSTRAHLEN</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            RISIKO <input type="range" min={0} max={100} value={risk} onChange={(e) => setRisk(Number(e.target.value))} style={{ accentColor: T.accent }} />
            <span style={{ color: factcheck ? T.red : T.ink, width: 34 }}>{risk}%</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default StudioScene;
