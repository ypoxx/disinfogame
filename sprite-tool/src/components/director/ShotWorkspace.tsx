'use client';

// ===========================================
// SHOT-WORKSPACE — die Co-Design-Schleife pro Asset
// ===========================================
// Prompt (Claude oder Fallback) → Generieren mit Master-Referenzen (Konsistenz)
// → Claude-Kritik der Varianten → Pixel-Nachbearbeitung → Freigabe in die
// Bibliothek (+ optional als Stil-Master) → Hotspots für Räume → Regie-Chat.

import { useEffect, useRef, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import {
  fallbackPrompt,
  masterSlotForKind,
  referenceKeysForShot,
  shotPrompt,
  conceptSummary,
  directorChat,
  critiqueVariants,
} from '@/lib/studio/director';
import { buildAnchor } from '@/lib/studio/bible';
import { generate } from '@/lib/studio/generate';
import { getAsset, putAsset } from '@/lib/library';
import { createLibraryAsset, defaultIdFromPrompt, type AssetRegion } from '@/lib/assets';
import { ASPECT_RATIOS, DEFAULT_IMAGE_MODEL } from '@/lib/constants';
import { downscaleNearest, keyOutBackground, quantizeToPalette, toThumb } from '@/lib/studio/pixel';
import type { CritiqueResult, ChatMessage } from '@/lib/studio/directorTypes';
import type { Shot } from '@/lib/studio/shots';
import { RegionEditor } from './RegionEditor';

type Ratio = keyof typeof ASPECT_RATIOS;

function defaultRatio(kind: Shot['kind']): Ratio {
  if (kind === 'room' || kind === 'building') return '16:9';
  return '1:1';
}

function defaultAssetId(shot: Shot): string {
  if (shot.kind === 'walkcycle') return 'player_walk';
  if (shot.kind === 'building') return 'building_cross';
  if (shot.subjectId) return `${shot.kind === 'room' ? 'room' : 'char'}_${shot.subjectId}`;
  return defaultIdFromPrompt(shot.title);
}

export function ShotWorkspace({ shot, onBack }: { shot: Shot; onBack: () => void }) {
  const { concept, bible, saveBible, updateShot, keys, bumpLibrary } = useStudio();

  const [prompt, setPrompt] = useState('');
  const [promptBusy, setPromptBusy] = useState(false);
  const [notes, setNotes] = useState('');

  const [numImages, setNumImages] = useState(shot.kind === 'room' || shot.kind === 'building' ? 2 : 4);
  const [ratio, setRatio] = useState<Ratio>(defaultRatio(shot.kind));
  const [seed, setSeed] = useState('');
  const [generating, setGenerating] = useState(false);
  const [variants, setVariants] = useState<{ base64: string; seed?: number }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [masterImgs, setMasterImgs] = useState<string[]>([]);
  const [critique, setCritique] = useState<CritiqueResult | null>(null);
  const [critiqueBusy, setCritiqueBusy] = useState(false);

  const [assetId, setAssetId] = useState(defaultAssetId(shot));
  const [asMaster, setAsMaster] = useState(false);
  const [regions, setRegions] = useState<AssetRegion[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);

  const undoRef = useRef<string | null>(null);

  // Master-Referenzen für Konsistenz laden.
  useEffect(() => {
    let active = true;
    (async () => {
      const refKeys = referenceKeysForShot(bible, shot);
      const imgs = await Promise.all(refKeys.map((k) => getAsset(k)));
      if (active) setMasterImgs(imgs.map((a) => a?.dataBase64).filter((b): b is string => Boolean(b)));
    })();
    return () => {
      active = false;
    };
  }, [bible, shot]);

  // Vorbelegung: Fallback-Prompt, falls leer.
  useEffect(() => {
    if (concept) setPrompt(fallbackPrompt(shot, concept, bible));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shot.id]);

  async function suggest() {
    if (!concept) return;
    setPromptBusy(true);
    setError(null);
    try {
      const res = await shotPrompt(concept, bible, shot, notes);
      if (res.prompt) setPrompt(res.prompt);
      if (res.suggestedId) setAssetId(res.suggestedId.replace(/[^a-z0-9_]+/g, '_'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Prompt-Vorschlag fehlgeschlagen');
    } finally {
      setPromptBusy(false);
    }
  }

  async function doGenerate() {
    if (!prompt.trim()) {
      setError('Bitte zuerst einen Prompt erzeugen/eingeben.');
      return;
    }
    setGenerating(true);
    setError(null);
    setCritique(null);
    setSelected(null);
    try {
      const res = await generate({
        prompt,
        numImages,
        aspectRatio: ratio,
        seed: seed ? Number(seed) : undefined,
        referenceImages: masterImgs.length ? masterImgs : undefined,
      });
      setVariants(res.images);
      if (res.errors?.length) setError(res.errors.join(' · '));
      if (shot.status === 'todo') void updateShot({ ...shot, status: 'in_progress' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generierung fehlgeschlagen');
    } finally {
      setGenerating(false);
    }
  }

  async function runCritique() {
    if (variants.length === 0) return;
    setCritiqueBusy(true);
    setError(null);
    try {
      const thumbs = await Promise.all(variants.map((v) => toThumb(v.base64, 384)));
      const result = await critiqueVariants(bible, shot.title, thumbs);
      setCritique(result);
      if (result.bestIndex >= 0 && result.bestIndex < variants.length) setSelected(result.bestIndex);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bewertung fehlgeschlagen');
    } finally {
      setCritiqueBusy(false);
    }
  }

  function mutateSelected(next: string) {
    if (selected === null) return;
    undoRef.current = variants[selected].base64;
    setVariants((prev) => prev.map((v, i) => (i === selected ? { ...v, base64: next } : v)));
  }

  async function applyDownscale(target: number) {
    if (selected === null) return;
    mutateSelected(await downscaleNearest(variants[selected].base64, target, target));
  }
  async function applyKeyOut() {
    if (selected === null) return;
    mutateSelected(await keyOutBackground(variants[selected].base64, { sample: 'corner', tolerance: 30 }));
  }
  async function applyPalette() {
    if (selected === null) return;
    mutateSelected(await quantizeToPalette(variants[selected].base64, bible.palette.map((c) => c.hex)));
  }
  function undo() {
    if (selected === null || undoRef.current === null) return;
    const prevB64 = undoRef.current;
    undoRef.current = null;
    setVariants((prev) => prev.map((v, i) => (i === selected ? { ...v, base64: prevB64 } : v)));
  }

  async function approve() {
    if (selected === null || !concept) return;
    const img = variants[selected];
    const id = (assetId || defaultAssetId(shot)).replace(/[^a-z0-9_]+/g, '_');
    const slot = masterSlotForKind(shot.kind);
    const asset = createLibraryAsset({
      id,
      type: 'image',
      dataBase64: img.base64,
      mime: 'image/png',
      prompt,
      seed: img.seed,
      provider: DEFAULT_IMAGE_MODEL,
      styleVersion: bible.styleVersion,
      family: slot,
      role: asMaster ? 'master' : 'asset',
      referenceMasterKeys: referenceKeysForShot(bible, shot),
      shotId: shot.id,
      regions: shot.kind === 'room' && regions.length ? regions : undefined,
      chosen: true,
    });
    await putAsset(asset);
    if (asMaster) {
      await saveBible({ ...bible, masters: { ...bible.masters, [slot]: asset.key } });
    }
    await updateShot({ ...shot, status: 'approved', assetKey: asset.key });
    bumpLibrary();
    setSaveMsg(`✓ „${id}" in der Bibliothek${asMaster ? ' + als Stil-Master gesetzt' : ''}`);
    window.setTimeout(() => setSaveMsg(null), 3000);
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || !concept) return;
    const next = [...chat, { role: 'user' as const, content: text }];
    setChat(next);
    setChatInput('');
    setChatBusy(true);
    try {
      const context = `${conceptSummary(concept)}\n\n${buildAnchor(bible)}\n\nSHOT: ${shot.title} — ${shot.brief}`;
      const res = await directorChat(context, next);
      setChat([...next, { role: 'assistant', content: res.reply }]);
    } catch (e) {
      setChat([...next, { role: 'assistant', content: `⚠ ${e instanceof Error ? e.message : 'Fehler'}` }]);
    } finally {
      setChatBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Kopf */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded p-2 text-gray-400 hover:text-white" aria-label="Zurück">
          ←
        </button>
        <div>
          <h2 className="text-lg font-bold">{shot.title}</h2>
          <p className="text-xs text-gray-500">{shot.brief}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-900/40 p-3 text-sm text-red-300">{error}</div>
      )}

      {/* Prompt */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300">Prompt</h3>
          <div className="flex gap-2">
            <button
              onClick={() => concept && setPrompt(fallbackPrompt(shot, concept, bible))}
              className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
            >
              Aus Bibel (ohne Claude)
            </button>
            <button
              onClick={suggest}
              disabled={promptBusy || !keys.anthropic}
              className="rounded bg-purple-600 px-2 py-1 text-xs hover:bg-purple-700 disabled:opacity-50"
              title={keys.anthropic ? '' : 'Claude-Key nötig'}
            >
              {promptBusy ? 'Claude…' : 'Prompt vorschlagen (Claude)'}
            </button>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-32 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-xs"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Zusatz-Wunsch für den Vorschlag (z. B. strengerer Blick)"
          className="mt-2 w-full rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs"
        />
        {masterImgs.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Konsistenz-Referenz:</span>
            {masterImgs.map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`data:image/png;base64,${m}`} alt="Master" className="h-8 w-8 rounded border border-gray-700 object-cover" />
            ))}
            <span className="text-gray-600">(automatisch mitgeschickt)</span>
          </div>
        )}
      </div>

      {/* Generierungs-Controls */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span>Varianten</span>
            <input type="range" min={1} max={4} value={numImages} onChange={(e) => setNumImages(Number(e.target.value))} className="w-20" />
            <span>{numImages}</span>
          </label>
          <label className="flex items-center gap-2">
            <span>Ratio</span>
            <select value={ratio} onChange={(e) => setRatio(e.target.value as Ratio)} className="rounded border border-gray-700 bg-gray-800 px-2 py-1">
              {Object.keys(ASPECT_RATIOS).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>Seed</span>
            <input value={seed} onChange={(e) => setSeed(e.target.value)} type="number" placeholder="optional" className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1" />
          </label>
          <button
            onClick={doGenerate}
            disabled={generating || !keys.google}
            className="ml-auto rounded bg-green-600 px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
            title={keys.google ? '' : 'Google-Key nötig'}
          >
            {generating ? 'Generiere…' : 'Varianten generieren'}
          </button>
        </div>
        {!keys.google && <p className="mt-2 text-xs text-gray-600">Google-Key nötig (⚙️ Einstellungen).</p>}
      </div>

      {/* Varianten + Auswahl */}
      {variants.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Varianten</h3>
            <button
              onClick={runCritique}
              disabled={critiqueBusy || !keys.anthropic}
              className="rounded bg-purple-600 px-3 py-1 text-xs hover:bg-purple-700 disabled:opacity-50"
              title={keys.anthropic ? '' : 'Claude-Key nötig'}
            >
              {critiqueBusy ? 'Claude bewertet…' : 'Bewerten lassen (Claude)'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {variants.map((v, i) => {
              const c = critique?.perVariant.find((p) => p.index === i);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative overflow-hidden rounded-lg border-2 ${
                    selected === i ? 'border-blue-500' : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`data:image/png;base64,${v.base64}`} alt={`Variante ${i + 1}`} className="aspect-square w-full bg-gray-950 object-contain" />
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px]">#{i + 1}</span>
                  {c && (
                    <span className="absolute right-1 top-1 rounded bg-black/70 px-1 text-[10px] text-green-300">{c.score}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kritik */}
          {critique && (
            <div className="mt-3 space-y-2 rounded-lg border border-gray-800 bg-gray-950 p-3 text-xs">
              <div className="text-gray-300">{critique.summary}</div>
              {critique.perVariant.map((p) => (
                <div key={p.index} className="text-gray-500">
                  <span className="text-gray-400">#{p.index + 1} ({p.score}):</span> {p.note}
                </div>
              ))}
              {critique.questions.length > 0 && (
                <div className="mt-1 text-yellow-300">
                  Rückfragen: {critique.questions.join(' · ')}
                </div>
              )}
            </div>
          )}

          {/* Werkzeuge auf der Auswahl */}
          {selected !== null && (
            <div className="mt-4 space-y-3 border-t border-gray-800 pt-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400">Pixel-Nachbearbeitung:</span>
                <button onClick={() => applyDownscale(32)} className="rounded bg-gray-700 px-2 py-1 hover:bg-gray-600">→ 32px</button>
                <button onClick={() => applyDownscale(64)} className="rounded bg-gray-700 px-2 py-1 hover:bg-gray-600">→ 64px</button>
                <button onClick={applyKeyOut} className="rounded bg-gray-700 px-2 py-1 hover:bg-gray-600">Hintergrund → transparent</button>
                <button onClick={applyPalette} className="rounded bg-gray-700 px-2 py-1 hover:bg-gray-600">Paletten-Lock</button>
                <button onClick={undo} disabled={!undoRef.current} className="rounded bg-gray-800 px-2 py-1 hover:bg-gray-700 disabled:opacity-40">Undo</button>
              </div>

              {shot.kind === 'room' && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-400">Hotspots markieren (für building.json)</div>
                  <RegionEditor base64={variants[selected].base64} regions={regions} onChange={setRegions} />
                </div>
              )}

              {/* Freigabe */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-950 p-3">
                <span className="text-xs text-gray-400">Asset-id</span>
                <input value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-44 rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-xs" />
                <label className="flex items-center gap-1 text-xs text-gray-300">
                  <input type="checkbox" checked={asMaster} onChange={(e) => setAsMaster(e.target.checked)} />
                  auch als Stil-Master
                </label>
                <button onClick={approve} className="ml-auto rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700">
                  Übernehmen → Bibliothek
                </button>
              </div>
              {shot.kind === 'walkcycle' && (
                <p className="text-[11px] text-gray-600">
                  Tipp: Für ein spielfertiges Sheet das übernommene Bild im Tab „Sprite-Sheet" in Frames zerlegen.
                </p>
              )}
              {saveMsg && <div className="text-sm text-green-400">{saveMsg}</div>}
            </div>
          )}
        </div>
      )}

      {/* Regie-Chat */}
      <details className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-300">💬 Mit dem Regisseur besprechen</summary>
        <div className="mt-3 space-y-2">
          {chat.map((m, i) => (
            <div key={i} className={`text-sm ${m.role === 'user' ? 'text-gray-300' : 'text-blue-200'}`}>
              <span className="text-gray-600">{m.role === 'user' ? 'Du' : 'Regie'}:</span> {m.content}
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder="z. B. „Was würde diese Szene bedrohlicher machen?"
              disabled={!keys.anthropic}
              className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm disabled:opacity-50"
            />
            <button onClick={sendChat} disabled={chatBusy || !keys.anthropic || !chatInput.trim()} className="rounded bg-purple-600 px-3 py-1.5 text-sm hover:bg-purple-700 disabled:opacity-50">
              {chatBusy ? '…' : 'Senden'}
            </button>
          </div>
          {!keys.anthropic && <p className="text-xs text-gray-600">Claude-Key nötig (⚙️).</p>}
        </div>
      </details>
    </div>
  );
}
