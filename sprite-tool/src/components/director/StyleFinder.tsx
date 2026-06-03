'use client';

// ===========================================
// STIL-FINDUNG — "ist Brutalismus richtig?"
// ===========================================
// Claude schlägt mehrere DISTINKTE Richtungen vor; pro Richtung kann dasselbe
// Testmotiv generiert werden → sehen, vergleichen, übernehmen → Stil-Bibel v1.

import { useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { styleDirections } from '@/lib/studio/director';
import { generate } from '@/lib/studio/generate';
import type { StyleDirectionDraft } from '@/lib/studio/directorTypes';

export function StyleFinder() {
  const { concept, bible, saveBible, keys } = useStudio();
  const [brief, setBrief] = useState('');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directions, setDirections] = useState<StyleDirectionDraft[]>([]);
  const [samples, setSamples] = useState<Record<number, string>>({});
  const [sampleBusy, setSampleBusy] = useState<Record<number, boolean>>({});
  const [adopted, setAdopted] = useState<string | null>(null);

  async function propose() {
    if (!concept) return;
    setLoading(true);
    setError(null);
    setSamples({});
    try {
      const dirs = await styleDirections(concept, brief, count);
      setDirections(dirs);
      if (dirs.length === 0) setError('Keine Richtungen erhalten — bitte erneut versuchen.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }

  async function makeSample(i: number, dir: StyleDirectionDraft) {
    setSampleBusy((p) => ({ ...p, [i]: true }));
    try {
      const res = await generate({ prompt: dir.samplePrompt, numImages: 1, aspectRatio: '1:1' });
      const first = res.images[0]?.base64;
      if (first) setSamples((p) => ({ ...p, [i]: first }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Test-Bild fehlgeschlagen');
    } finally {
      setSampleBusy((p) => ({ ...p, [i]: false }));
    }
  }

  async function adopt(dir: StyleDirectionDraft) {
    await saveBible(
      {
        ...bible,
        directionName: dir.name,
        mood: dir.mood,
        palette: dir.palette.length ? dir.palette : bible.palette,
        dos: dir.dos.length ? dir.dos : bible.dos,
        donts: dir.donts.length ? dir.donts : bible.donts,
        anchorOverride: undefined,
      },
      true
    );
    setAdopted(dir.name);
    window.setTimeout(() => setAdopted(null), 2500);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-1 text-lg font-bold">🎨 Stil-Findung</h2>
        <p className="text-sm text-gray-400">
          Claude schlägt unterschiedliche Richtungen vor — inkl. einer mutigen Alternative zum Brutalismus. Erzeuge
          pro Richtung dasselbe Testmotiv (Marina im Medien-Zentrum), vergleiche und übernimm die beste als
          Stil-Bibel.
        </p>
        {!keys.anthropic && (
          <div className="mt-3 rounded border border-yellow-700 bg-yellow-900/30 p-2 text-xs text-yellow-200">
            Für Vorschläge brauchst du einen Claude-Key (⚙️ Einstellungen).
          </div>
        )}
        <div className="mt-4 space-y-2">
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder='Optionaler Wunsch, z. B. "weniger sauber, mehr Bedrohung" oder "auch was ganz anderes als Brutalismus"'
            className="h-20 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <span>Richtungen</span>
              <input
                type="range"
                min={2}
                max={4}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-24"
              />
              <span>{count}</span>
            </label>
            <button
              onClick={propose}
              disabled={loading || !keys.anthropic || !concept}
              className="rounded bg-purple-600 px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Claude denkt…' : 'Richtungen vorschlagen'}
            </button>
            {adopted && <span className="text-green-400">„{adopted}" übernommen ✓</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/40 p-3 text-sm text-red-300">{error}</div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {directions.map((dir, i) => (
          <div key={`${dir.name}-${i}`} className="space-y-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white">{dir.name}</h3>
              <button
                onClick={() => adopt(dir)}
                className="shrink-0 rounded bg-green-700 px-3 py-1 text-xs font-medium hover:bg-green-600"
              >
                Übernehmen
              </button>
            </div>
            <p className="text-xs text-gray-400">{dir.mood}</p>
            <div className="flex flex-wrap gap-1">
              {dir.palette.map((c) => (
                <span
                  key={c.hex}
                  title={`${c.name} ${c.hex}`}
                  className="h-5 w-5 rounded border border-gray-700"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-gray-400">Warum:</span> {dir.rationale}
            </p>

            {/* Testmotiv */}
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
              {samples[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/png;base64,${samples[i]}`}
                  alt={`Testmotiv ${dir.name}`}
                  className="mx-auto max-h-56 rounded object-contain"
                />
              ) : (
                <div className="py-6 text-center text-xs text-gray-600">Noch kein Testbild</div>
              )}
              <button
                onClick={() => makeSample(i, dir)}
                disabled={sampleBusy[i] || !keys.google}
                className="mt-2 w-full rounded bg-gray-700 px-3 py-1.5 text-xs hover:bg-gray-600 disabled:opacity-50"
              >
                {sampleBusy[i] ? 'Generiere…' : samples[i] ? 'Neu generieren' : 'Testmotiv generieren'}
              </button>
              {!keys.google && (
                <p className="mt-1 text-center text-[11px] text-gray-600">Google-Key nötig (⚙️)</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
