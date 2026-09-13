/**
 * VQA-Fixture-Bühne — deterministisches Mounten prop-getriebener Szenen für die
 * Visual-Review-Ernte (scripts/visual-review/). KEIN Spieler-Pfad: die Seite ist
 * nur über /vqa.html erreichbar und wird von Playwright angesteuert.
 *
 * Szenen (Query-Parameter):
 *   /vqa.html?scene=wahlabend&branch=victory|timeout|immune|exposed[&hold=1]
 *     hold=1 → Auto-Vorlauf via onComplete-Marker beobachtbar; die Szene selbst
 *     steuert ihre Schritte (Klick überspringt). Nach onComplete zeigt die Seite
 *     einen [data-vqa-done]-Marker, auf den der Harvester warten kann.
 *   /vqa.html?scene=broadcast
 *     Finales Nachrichten-TV und gemischte Publikums-Mimiken.
 *     audienceSet=secondary → zweite Vierergruppe derselben Laufzeitdarstellung.
 *   /vqa.html?scene=sprites
 *     Kontaktbogen aller finalisierten Mood- und Geh-Sheets.
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { WahlabendScene, type WahlabendBranch } from './story-mode/components/WahlabendScene';
import { PARTEI_NAME_DE } from './story-mode/engine/Auftraege';
import { BroadcastBar } from './story-mode/broadcast/BroadcastBar';
import type { AudienceBroadcastState } from './story-mode/broadcast/useAudienceBroadcast';
import type { BroadcastItem } from './story-mode/broadcast/broadcastMapping';
import { getCountry, reactToEffect, type Mood } from './story-mode/audience/audienceModel';
import { initAssetRegistry } from './story-mode/assets';

const params = new URLSearchParams(window.location.search);
const scene = params.get('scene') ?? 'wahlabend';
const branch = (params.get('branch') ?? 'victory') as WahlabendBranch;

/** Milieu-Fixtures — realistische Spannbreite (jubelt / stumm / schaltet ab). */
const AUDIENCE_FIXTURE = [
  { label: 'Zornige', belief: 78, mood: 'wütend' },
  { label: 'Eigenheimer', belief: 64, mood: 'zustimmend' },
  { label: 'Besorgte Mitte', belief: 47, mood: 'unsicher' },
  { label: 'Macher', belief: 41, mood: 'skeptisch' },
  { label: 'Liberale', belief: 22, mood: 'ablehnend' },
  { label: 'Bohemiens', belief: 12, mood: 'abgewandt' },
];

const HEADLINES_FIXTURE = [
  'Ministerium verschweigt Zahlen zur Wasserqualität',
  'Anwohner berichten: nächtliche Konvois an der Ostgrenze',
  'Experte zweifelt an Unabhängigkeit der Wahlkommission',
  'Leak: Geheimpapier zur Rentenkürzung nach der Wahl',
];

function WahlabendFixture(): React.JSX.Element {
  const [done, setDone] = useState(false);
  const won = branch === 'victory';
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      {/* Werte spiegeln die echte Engine-Abbildung (StoryEngineAdapter.getWahlabendData):
          Sonntagsfrage 9 % + Fortschritt·18 %, Schwelle bei WIN_THRESHOLD (0.6 → 19.8 %). */}
      {!done && (
        <WahlabendScene
          branch={branch}
          partyName={PARTEI_NAME_DE}
          startPollPct={9}
          finalPollPct={won ? 21.6 : 15.3}
          thresholdPct={19.8}
          audience={AUDIENCE_FIXTURE}
          playerHeadlines={HEADLINES_FIXTURE}
          onComplete={() => setDone(true)}
        />
      )}
      {done && (
        <div data-vqa-done style={{ color: '#888', fontFamily: 'monospace', padding: 20 }}>
          wahlabend:{branch} abgeschlossen
        </div>
      )}
    </div>
  );
}

function BroadcastFixture(): React.JSX.Element {
  const [assetsReady, setAssetsReady] = useState(false);
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    void initAssetRegistry().then(() => setAssetsReady(true));
  }, []);
  const source = getCountry('westunion');
  if (!source) return <div data-vqa-done>audience fixture fehlt</div>;
  if (!assetsReady) return <div style={{ color: '#888', padding: 20 }}>Assets werden geladen…</div>;
  const item: BroadcastItem = {
    id: 'vqa_infrastruktur',
    channel: 'tv',
    themes: ['energie_angst', 'sicherheits_beduerfnis'],
    intensity: 0.82,
    headline: 'Versorgungslage: Behörden widersprechen sich nach Zwischenfall',
    tier: 'gross',
    kind: 'eigen',
  };
  const reaction = reactToEffect(source, item);
  const moods: Mood[] = ['verunsichert', 'ruhig', 'misstrauisch', 'wuetend'];
  const audienceStart = params.get('audienceSet') === 'secondary' ? 4 : 0;
  const orderedSegments = [
    ...source.segments.slice(audienceStart),
    ...source.segments.slice(0, audienceStart),
  ];
  const country = {
    ...source,
    segments: orderedSegments.map((segment, index) => ({
      ...segment,
      mood: moods[index] ?? segment.mood,
      belief: [0.46, 0.31, 0.58, 0.72][index] ?? segment.belief,
    })),
  };
  const audience: AudienceBroadcastState = { country, lastItem: item, lastReaction: reaction, history: [item] };
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-end', background: '#10141d' }}>
      <BroadcastBar audience={audience} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
    </div>
  );
}

const AUDIENCE_SHEETS = [
  'audience_optimiererin',
  'audience_macher',
  'audience_bohemien',
  'audience_besorgte_mitte',
  'audience_zorniger',
  'audience_idealistin',
  'audience_eigenheimer',
  'audience_liberale',
];

const WALK_SHEETS = ['player_profiles_walk', 'player_profiles_idle', 'figure_clerk_walk', 'figure_cleaner_walk'];

function SpriteSheetFixture(): React.JSX.Element {
  const card = (id: string, width?: number) => (
    <figure key={id} style={{ margin: 0, padding: 10, border: '1px solid #3b4655', background: '#18202b' }}>
      <figcaption style={{ marginBottom: 7, color: '#d8dee8', font: '18px monospace' }}>{id}</figcaption>
      <img
        src={`/assets/sheets/${id}.png`}
        alt={id}
        style={{ display: 'block', width: width ?? 384, maxWidth: '100%', height: 'auto', imageRendering: 'pixelated' }}
      />
    </figure>
  );
  return (
    <main style={{ minHeight: '100vh', padding: 20, background: '#0e131b', color: '#fff' }}>
      <h1 style={{ margin: '0 0 6px', font: 'bold 24px monospace' }}>FINALE SPRITE-SHEETS</h1>
      <p style={{ margin: '0 0 14px', color: '#9ba8b7', font: '14px monospace' }}>
        Publikum: ruhig · verunsichert · wütend · misstrauisch / Gehfiguren: acht Phasen
      </p>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {AUDIENCE_SHEETS.map((id) => card(id))}
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 14 }}>
        {WALK_SHEETS.map((id) => card(id, id.startsWith('player_') ? 512 : 384))}
      </section>
    </main>
  );
}

function VqaApp(): React.JSX.Element {
  if (scene === 'wahlabend') return <WahlabendFixture />;
  if (scene === 'broadcast') return <BroadcastFixture />;
  if (scene === 'sprites') return <SpriteSheetFixture />;
  return <div style={{ color: '#f66', fontFamily: 'monospace', padding: 20 }}>Unbekannte Szene: {scene}</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<VqaApp />);
