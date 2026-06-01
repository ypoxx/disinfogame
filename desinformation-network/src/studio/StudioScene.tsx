/**
 * StudioScene — „Sendung & Publikum" als EINE gezeichnete Gebäude-Schnitt-Szene (SVG), keine Panels.
 *
 * Ein zusammenhängender Querschnitt: Fassade, Etagenböden, offene Räume mit angedeuteten Möbeln +
 * kleinen Arbeiter-Figuren, durchgehender Lift, Studio mit Dach-Antenne. Eine animierte Ausstrahlungs-
 * Linie führt zum „Wohnzimmer" des Publikums rechts — dort zeigt ein gezeichnetes Gerät (TV/Zeitung/
 * Handy, je nach Kanal) die Sendung, davor sitzt das Publikum als Figuren (Stimmung/Resonanz). Zahlen
 * (Quote/Glaube) BESCHRIFTEN die Zeichnung. Leichter Handzeichnungs-Filter (feTurbulence) für Skizzen-Look.
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
  grid: 'rgba(143,184,200,0.10)',
  ink: '#9fc6d6',
  inkSoft: 'rgba(159,198,214,0.40)',
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
const levelOf = (id: string): number => FLOORS.find((f) => f.id === id)?.level ?? 0;
const roomAt = (col: number, lvl: number): BRoom | undefined => ROOMS.find((r) => levelOf(r.floor) === lvl && (r.col ?? 1) === col);
const colLetter = (c: number): string => String.fromCharCode(64 + c);

function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function freshCopy(cs: AudienceCountry[]): AudienceCountry[] {
  return cs.map((c) => ({ ...c, segments: c.segments.map((s) => ({ ...s, vulnerabilities: [...s.vulnerabilities], reachedBy: [...s.reachedBy], demographics: { ...s.demographics } })) }));
}

const BAND: Record<number, [number, number]> = { 2: [70, 226], 1: [226, 382], 0: [382, 540] };
const COLX: Record<number, [number, number]> = { 1: [56, 300], 2: [300, 516] };

function Furniture({ id, x, y }: { id: string; x: number; y: number }) {
  switch (id) {
    case 'cyber_lab':
      return (<g>{[0, 15, 30].map((d) => <rect key={d} x={x + d} y={y} width={11} height={26} />)}{[0, 15, 30].map((d) => <circle key={d} cx={x + d + 5.5} cy={y + 6} r={1.6} fill={T.accent} stroke="none" />)}</g>);
    case 'medien_zentrum':
      return (<g><rect x={x} y={y} width={32} height={22} /><line x1={x + 48} y1={y + 24} x2={x + 48} y2={y + 6} /><rect x={x + 40} y={y - 6} width={18} height={12} /><circle cx={x + 58} cy={y} r={3} /></g>);
    case 'zentrale':
      return (<g><rect x={x} y={y + 10} width={46} height={8} /><line x1={x + 8} y1={y + 18} x2={x + 8} y2={y + 28} /><circle cx={x - 6} cy={y + 8} r={6} /></g>);
    case 'feld_ops':
      return (<g><rect x={x} y={y} width={40} height={28} /><line x1={x} y1={y} x2={x + 40} y2={y + 28} /><circle cx={x + 28} cy={y + 10} r={3} fill={T.accent} stroke="none" /></g>);
    case 'finanzen':
      return (<g><rect x={x} y={y} width={30} height={30} /><circle cx={x + 15} cy={y + 15} r={7} /><line x1={x + 15} y1={y + 15} x2={x + 21} y2={y + 11} /></g>);
    default:
      return null;
  }
}

function Person({ x, y, mood, on = false, scale = 1 }: { x: number; y: number; mood: Mood; on?: boolean; scale?: number }) {
  const c = MOODS[mood].c;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {on && <circle cx={0} cy={-12} r={24} fill="none" stroke={T.accent} strokeWidth={2} className="ss-pulse" />}
      <path d="M -11 16 Q 0 -10 11 16 Z" fill={hexA(c, 0.18)} stroke={c} strokeWidth={1.6} />
      <circle cx={0} cy={-17} r={7} fill={hexA(c, 0.28)} stroke={c} strokeWidth={1.6} />
      {mood === 'wuetend' && <><line x1={-4.5} y1={-21} x2={-1.5} y2={-19} stroke={c} strokeWidth={1.3} /><line x1={4.5} y1={-21} x2={1.5} y2={-19} stroke={c} strokeWidth={1.3} /></>}
      {mood === 'ruhig' && <line x1={-3} y1={-15.5} x2={3} y2={-15.5} stroke={c} strokeWidth={1.3} />}
      {mood === 'verunsichert' && <line x1={-2.5} y1={-14.5} x2={2.5} y2={-15.5} stroke={c} strokeWidth={1.3} />}
    </g>
  );
}

/** Gezeichnetes Sende-Gerät je Kanal (Rahmen im Filter-Layer). Liefert Screen-Rechteck für die Beschriftung. */
function deviceGeom(channel: Channel): { fx: number; fy: number; fw: number; fh: number } {
  if (channel === 'social') return { fx: 700, fy: 150, fw: 80, fh: 104 };
  if (channel === 'print') return { fx: 642, fy: 150, fw: 168, fh: 74 };
  return { fx: 646, fy: 150, fw: 160, fh: 86 };
}
function DeviceFrame({ channel }: { channel: Channel }) {
  if (channel === 'social') {
    return (<g><rect x={694} y={138} width={92} height={128} rx={10} /><line x1={732} y1={146} x2={748} y2={146} /><circle cx={740} cy={260} r={3} /></g>);
  }
  if (channel === 'print') {
    return (<g><rect x={636} y={140} width={180} height={96} /><line x1={636} y1={158} x2={816} y2={158} /><line x1={726} y1={158} x2={726} y2={236} /></g>);
  }
  return (<g><rect x={636} y={138} width={180} height={110} rx={4} /><line x1={690} y1={248} x2={684} y2={262} /><line x1={762} y1={248} x2={768} y2={262} /><line x1={726} y1={128} x2={726} y2={138} /></g>);
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
  const dev = deviceGeom(channel);

  const air = () => {
    setCountries((prev) => prev.map((c) => c.id !== countryId ? c : {
      ...c, segments: c.segments.map((s) => { const r = byId.get(s.id); return r ? { ...s, belief: r.newBelief, mood: r.newMood } : s; }),
    }));
    setAired(true);
  };

  // Publikum in 3×2-Raster (großzügig, keine Überlappung)
  const aud = country.segments.map((seg, i) => ({ seg, x: 678 + (i % 3) * 128, y: 372 + Math.floor(i / 3) * 122 }));

  const selectStyle: CSSProperties = { background: T.bg, color: T.text, border: `1px solid ${T.inkSoft}`, font: `12px ${T.mono}`, padding: '4px 6px' };
  const txt = (size: number, color = T.text, weight = 400): CSSProperties => ({ font: `${weight} ${size}px ${T.mono}`, fill: color } as CSSProperties);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, overflow: 'auto' }}>
      <style>{`
        @keyframes ss-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes ss-pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes ss-lift { 0%,12%{transform:translateY(0)} 30%,42%{transform:translateY(156px)} 60%,72%{transform:translateY(312px)} 90%,100%{transform:translateY(0)} }
        @keyframes ss-dash { to { stroke-dashoffset: -28; } }
        @keyframes ss-wave { 0%{opacity:.9;transform:scale(.35)} 100%{opacity:0;transform:scale(1.5)} }
        .ss-pulse{animation:ss-blink 1.6s ease-in-out infinite}
        .ss-cab{animation:ss-lift 9s ease-in-out infinite}
        .ss-sig{stroke-dasharray:6 7;animation:ss-dash 1.1s linear infinite}
        .ss-wave{transform-origin:408px 42px;animation:ss-wave 2.3s ease-out infinite}
        .ss-blink{animation:ss-blink 1.4s ease-in-out infinite}
      `}</style>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '18px 20px 22px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
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

        <svg viewBox="0 0 1000 600" width="100%" style={{ display: 'block', border: `1px solid ${hexA(T.ink, 0.18)}`, background: `linear-gradient(${T.grid} 1px,transparent 1px) 0 0/30px 30px, linear-gradient(90deg,${T.grid} 1px,transparent 1px) 0 0/30px 30px, ${T.bg}` }}>
          <defs>
            <filter id="ss-sketch"><feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves={2} seed={7} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={2.1} /></filter>
          </defs>

          {/* ── Gezeichnete Struktur + Figuren (Handzeichnungs-Filter) ── */}
          <g filter="url(#ss-sketch)" fill="none" stroke={T.ink} strokeWidth={2} strokeLinecap="round">
            {/* Straße + Fassade + Etagen + Wände */}
            <line x1={20} y1={540} x2={840} y2={540} stroke={hexA(T.ink, 0.5)} />
            <rect x={56} y={70} width={460} height={470} />
            <line x1={56} y1={226} x2={576} y2={226} />
            <line x1={56} y1={382} x2={576} y2={382} />
            <line x1={300} y1={70} x2={300} y2={540} stroke={T.inkSoft} />
            <line x1={516} y1={70} x2={516} y2={540} />
            {/* Lift-Außenwand bis 576 (Schacht) */}
            <line x1={576} y1={70} x2={576} y2={540} />
            <line x1={516} y1={70} x2={576} y2={70} />
            {/* Tür (Erdgeschoss) + paar Fenster */}
            <rect x={92} y={500} width={26} height={40} />
            {[100, 130].map((y) => <rect key={y} x={66} y={y} width={16} height={12} />)}
            {/* Antenne auf dem Dach über Studio (B2) */}
            <line x1={408} y1={70} x2={408} y2={42} /><line x1={400} y1={50} x2={416} y2={50} />
            {/* Möbel */}
            <Furniture id="cyber_lab" x={150} y={150} />
            <Furniture id="medien_zentrum" x={344} y={150} />
            <Furniture id="zentrale" x={168} y={300} />
            <Furniture id="feld_ops" x={356} y={300} />
            <Furniture id="finanzen" x={150} y={455} />
            {/* kleine Arbeiter-Figuren */}
            <Person x={236} y={196} mood="ruhig" scale={0.5} />
            <Person x={476} y={196} mood="ruhig" scale={0.5} />
            <Person x={236} y={352} mood="ruhig" scale={0.5} />
            <Person x={476} y={352} mood="ruhig" scale={0.5} />
            <Person x={236} y={510} mood="ruhig" scale={0.5} />
            {/* Titelblock im leeren Raum B0 */}
            <rect x={320} y={470} width={180} height={56} stroke={T.inkSoft} />
            <line x1={320} y1={490} x2={500} y2={490} stroke={T.inkSoft} />
            <line x1={410} y1={490} x2={410} y2={526} stroke={T.inkSoft} />
            {/* Wohnzimmer (Publikum) */}
            <rect x={610} y={108} width={372} height={432} stroke={hexA(T.ink, 0.45)} />
            <DeviceFrame channel={channel} />
            {/* Couch hinter der vorderen Reihe + Teppich */}
            <rect x={636} y={500} width={324} height={26} rx={9} />
            <ellipse cx={800} cy={520} rx={170} ry={14} stroke={T.inkSoft} />
            {/* Publikum-Figuren */}
            {aud.map(({ seg, x, y }) => {
              const r = byId.get(seg.id); const on = !!r && r.reached && r.resonance > 0;
              return <g key={seg.id} opacity={r && !r.reached ? 0.35 : 1}><Person x={x} y={y} mood={seg.mood} on={on} /></g>;
            })}
          </g>

          {/* Antennen-Wellen + Ausstrahlungs-Linie + Lift-Kabine (animiert, ohne Filter) */}
          {[0, 0.75, 1.5].map((d, i) => <circle key={i} cx={408} cy={42} r={9} fill="none" stroke={T.accent} strokeWidth={1.5} className="ss-wave" style={{ animationDelay: `${d}s` }} />)}
          <path d="M 418 46 C 540 56, 560 150, 636 168" fill="none" stroke={hexA(T.accent, 0.85)} strokeWidth={1.6} className="ss-sig" />
          <g className="ss-cab"><rect x={528} y={74} width={40} height={120} fill={hexA(T.ink, 0.08)} stroke={T.ink} strokeWidth={1.5} /><line x1={548} y1={74} x2={548} y2={194} stroke={T.inkSoft} /></g>

          {/* ── Beschriftungen (scharf) ── */}
          <text x={180} y={62} textAnchor="middle" style={txt(12, T.accent, 700)}>A</text>
          <text x={408} y={62} textAnchor="middle" style={txt(12, T.accent, 700)}>B</text>
          <text x={546} y={62} textAnchor="middle" style={txt(12, T.accent, 700)}>L</text>
          {[2, 1, 0].map((lvl) => <text key={lvl} x={44} y={(BAND[lvl][0] + BAND[lvl][1]) / 2} textAnchor="middle" style={txt(13, T.accent, 700)}>{lvl}</text>)}
          {[2, 1, 0].flatMap((lvl) => [1, 2].map((col) => {
            const room = roomAt(col, lvl); const [x0] = COLX[col]; const [y0] = BAND[lvl]; const code = `${colLetter(col)}${lvl}`;
            return (
              <g key={code}>
                <text x={x0 + 10} y={y0 + 18} style={txt(9, T.accent, 700)}>{code}</text>
                {room && <text x={x0 + 10} y={y0 + 32} style={txt(11, T.text)}>{room.label_de}</text>}
              </g>
            );
          }))}
          <text x={344} y={146} style={txt(8, T.red, 700)} className="ss-blink">● ON AIR</text>
          <text x={330} y={484} style={txt(7.5, T.dim, 700)}>SENDESCHNITT</text>
          <text x={330} y={508} style={txt(7, T.dim)}>M 1:100</text>
          <text x={416} y={508} style={txt(7, T.dim)}>BLATT 01</text>

          {/* Gerät-Inhalt (Sendung) */}
          <foreignObject x={dev.fx} y={dev.fy} width={dev.fw} height={dev.fh}>
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', font: `600 10px ${T.mono}`, color: '#cfe8ee', lineHeight: 1.18 }}>
              <div style={{ color: T.dim, fontSize: 7.5 }}>» {CHANNELS.find((c) => c.id === channel)?.label} · {aired ? 'GESENDET' : 'VORSCHAU'}</div>
              <div>{headline}</div>
            </div>
          </foreignObject>
          {factcheck && <text x={726} y={130} textAnchor="middle" style={txt(8.5, T.red, 700)}>⚠ FAKTENCHECK</text>}

          {/* Publikum-Label + Quote */}
          <text x={624} y={130} style={txt(11, T.dim, 700)}>PUBLIKUM · {country.label_de.toUpperCase()}</text>
          <text x={624} y={144} style={txt(8.5, T.dim)}>wer schaut zu?</text>
          <text x={966} y={132} textAnchor="end" style={txt(9, T.dim, 700)}>QUOTE</text>
          <text x={966} y={162} textAnchor="end" style={txt(30, T.accent, 700)}>{quotePct}%</text>

          {/* Publikum-Beschriftungen */}
          {aud.map(({ seg, x, y }) => {
            const r = byId.get(seg.id); const on = !!r && r.reached && r.resonance > 0;
            return (
              <g key={seg.id} opacity={r && !r.reached ? 0.5 : 1}>
                {on && <text x={x} y={y - 32} textAnchor="middle" style={txt(8, T.accent, 700)}>▲ springt an</text>}
                <text x={x} y={y + 34} textAnchor="middle" style={txt(9, on ? T.accent : MOODS[seg.mood].c, 700)}>{Math.round(seg.belief * 100)}%</text>
                <text x={x} y={y + 46} textAnchor="middle" style={txt(7.5, T.dim)}>{seg.label_de.split(' · ')[0]}</text>
              </g>
            );
          })}
        </svg>

        {/* Steuerung + Legende */}
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
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            RISIKO <input type="range" min={0} max={100} value={risk} onChange={(e) => setRisk(Number(e.target.value))} style={{ accentColor: T.accent }} />
            <span style={{ color: factcheck ? T.red : T.ink, width: 34 }}>{risk}%</span>
          </label>
          <span style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
            {(Object.keys(MOODS) as Mood[]).map((k) => (
              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: MOODS[k].c }} /> {MOODS[k].l}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StudioScene;
