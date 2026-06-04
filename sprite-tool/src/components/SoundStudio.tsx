'use client';

// ===========================================
// 🔊 SOUND-STUDIO (M5) — SFX · Musik · Stimmen
// ===========================================
// Gleicher Kurations-Ablauf wie bei Bildern: erzeugen → anhören → übernehmen.
// Bearbeitung bewusst schlank (nur Audition + Auswahl).

import { useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { genSfx, genMusic, type AudioResult } from '@/lib/studio/sound';
import { createLibraryAsset, defaultIdFromPrompt } from '@/lib/assets';
import { putAsset } from '@/lib/library';
import { VoiceStudio } from './VoiceStudio';

type Sub = 'sfx' | 'music' | 'voice';

interface Clip {
  id: string;
  text: string;
  base64: string;
  saved?: boolean;
}

export function SoundStudio() {
  const { keys, bumpLibrary } = useStudio();
  const [sub, setSub] = useState<Sub>('sfx');

  // SFX
  const [sfxText, setSfxText] = useState('');
  const [sfxDur, setSfxDur] = useState('');
  const [sfxClips, setSfxClips] = useState<Clip[]>([]);
  const [sfxBusy, setSfxBusy] = useState(false);

  // Musik
  const [musicPrompt, setMusicPrompt] = useState('');
  const [musicLen, setMusicLen] = useState(30);
  const [musicClips, setMusicClips] = useState<Clip[]>([]);
  const [musicBusy, setMusicBusy] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function makeSfx() {
    if (!sfxText.trim()) return;
    setSfxBusy(true);
    setError(null);
    try {
      const res: AudioResult = await genSfx(sfxText.trim(), sfxDur ? Number(sfxDur) : undefined);
      setSfxClips((prev) => [
        { id: defaultIdFromPrompt(sfxText, 'sfx'), text: sfxText.trim(), base64: res.audioBase64 },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'SFX fehlgeschlagen');
    } finally {
      setSfxBusy(false);
    }
  }

  async function makeMusic() {
    if (!musicPrompt.trim()) return;
    setMusicBusy(true);
    setError(null);
    try {
      const res = await genMusic(musicPrompt.trim(), musicLen * 1000);
      setMusicClips((prev) => [
        { id: defaultIdFromPrompt(musicPrompt, 'music'), text: musicPrompt.trim(), base64: res.audioBase64 },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Musik fehlgeschlagen');
    } finally {
      setMusicBusy(false);
    }
  }

  async function adopt(
    clips: Clip[],
    setClips: (c: Clip[]) => void,
    idx: number,
    type: 'sfx' | 'music'
  ) {
    const clip = clips[idx];
    const id = clip.id.replace(/[^a-z0-9_]+/g, '_') || type;
    await putAsset(
      createLibraryAsset({
        id,
        type,
        dataBase64: clip.base64,
        mime: 'audio/mpeg',
        provider: 'elevenlabs',
        prompt: clip.text,
        chosen: true,
      })
    );
    setClips(clips.map((c, i) => (i === idx ? { ...c, saved: true } : c)));
    bumpLibrary();
  }

  function updateId(clips: Clip[], setClips: (c: Clip[]) => void, idx: number, id: string) {
    setClips(clips.map((c, i) => (i === idx ? { ...c, id } : c)));
  }

  const TABS: { id: Sub; label: string }[] = [
    { id: 'sfx', label: 'SFX' },
    { id: 'music', label: 'Musik' },
    { id: 'voice', label: 'Stimmen' },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-1 text-lg font-bold">🔊 Sound-Studio</h2>
        <p className="text-sm text-gray-400">
          Effekte, Musik und NPC-Stimmen über ElevenLabs. Erzeugen → anhören → „übernehmen" landet als Audio-Asset
          in der Bibliothek (Export wie gehabt nach <code className="rounded bg-gray-800 px-1">public/assets/sounds</code>).
        </p>
        {!keys.elevenlabs && (
          <div className="mt-3 rounded border border-yellow-700 bg-yellow-900/30 p-2 text-xs text-yellow-200">
            ElevenLabs-Key nötig (⚙️ Einstellungen).
          </div>
        )}
      </div>

      <nav className="flex gap-1 border-b border-gray-800 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`rounded-t px-3 py-1.5 text-sm ${sub === t.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {error && <div className="rounded-lg border border-red-700 bg-red-900/40 p-3 text-sm text-red-300">{error}</div>}

      {sub === 'sfx' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex-1">
                <span className="mb-1 block text-xs text-gray-400">Beschreibung (englisch klappt am besten)</span>
                <input
                  value={sfxText}
                  onChange={(e) => setSfxText(e.target.value)}
                  placeholder="e.g. old rotary phone ringing in a concrete office"
                  className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                />
              </label>
              <label>
                <span className="mb-1 block text-xs text-gray-400">Dauer (s, optional)</span>
                <input value={sfxDur} onChange={(e) => setSfxDur(e.target.value)} type="number" min={0.5} max={30} placeholder="auto" className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-2 text-sm" />
              </label>
              <button onClick={makeSfx} disabled={sfxBusy || !keys.elevenlabs || !sfxText.trim()} className="rounded bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {sfxBusy ? 'Erzeuge…' : 'SFX erzeugen'}
              </button>
            </div>
          </div>
          <ClipList clips={sfxClips} onId={(i, id) => updateId(sfxClips, setSfxClips, i, id)} onAdopt={(i) => adopt(sfxClips, setSfxClips, i, 'sfx')} />
        </div>
      )}

      {sub === 'music' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <textarea
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              placeholder="e.g. cold-war bureaucratic ambient, tense strings, muted, looping"
              className="h-20 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <span>Länge</span>
                <input type="range" min={3} max={120} value={musicLen} onChange={(e) => setMusicLen(Number(e.target.value))} className="w-40" />
                <span>{musicLen}s</span>
              </label>
              <button onClick={makeMusic} disabled={musicBusy || !keys.elevenlabs || !musicPrompt.trim()} className="ml-auto rounded bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {musicBusy ? 'Komponiere…' : 'Musik erzeugen'}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-600">Hinweis: kommerzielle Game-Nutzung von ElevenLabs-Musik nur im Bezahltarif.</p>
          </div>
          <ClipList clips={musicClips} onId={(i, id) => updateId(musicClips, setMusicClips, i, id)} onAdopt={(i) => adopt(musicClips, setMusicClips, i, 'music')} />
        </div>
      )}

      {sub === 'voice' && <VoiceStudio />}
    </div>
  );
}

function ClipList({
  clips,
  onId,
  onAdopt,
}: {
  clips: Clip[];
  onId: (idx: number, id: string) => void;
  onAdopt: (idx: number) => void;
}) {
  if (clips.length === 0) return <p className="text-sm text-gray-600">Noch nichts erzeugt.</p>;
  return (
    <div className="space-y-2">
      {clips.map((c, i) => (
        <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
          <audio controls src={`data:audio/mpeg;base64,${c.base64}`} className="h-9" />
          <input value={c.id} onChange={(e) => onId(i, e.target.value)} className="w-44 rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-xs" />
          <span className="min-w-0 flex-1 truncate text-xs text-gray-500">{c.text}</span>
          <button onClick={() => onAdopt(i)} disabled={c.saved} className="rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-50">
            {c.saved ? '✓ übernommen' : 'übernehmen'}
          </button>
        </div>
      ))}
    </div>
  );
}
