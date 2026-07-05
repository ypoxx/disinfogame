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
 */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { WahlabendScene, type WahlabendBranch } from './story-mode/components/WahlabendScene';
import { PARTEI_NAME_DE } from './story-mode/engine/Auftraege';

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

function VqaApp(): React.JSX.Element {
  if (scene === 'wahlabend') return <WahlabendFixture />;
  return <div style={{ color: '#f66', fontFamily: 'monospace', padding: 20 }}>Unbekannte Szene: {scene}</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<VqaApp />);
