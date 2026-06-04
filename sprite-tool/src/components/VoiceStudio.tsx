'use client';

// ===========================================
// STIMMEN — feste NPC-Stimmen + TTS-Zeilen (M5)
// ===========================================
// Pro NPC eine STABILE Stimme casten (manuell oder per Claude-Vorschlag),
// dann Dialogzeilen aus npcs.json (oder freie Zeilen) als Audio erzeugen und
// als `voice`-Assets übernehmen. Einmalig erzeugt, kein Livestream.

import { useEffect, useMemo, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { npcLines, type NpcLine } from '@/lib/studio/concept';
import { getVoices, genSpeech, type Voice } from '@/lib/studio/sound';
import { loadCasting, saveCasting, type VoiceCasting } from '@/lib/studio/casting';
import { voiceCast } from '@/lib/studio/director';
import { createLibraryAsset, defaultIdFromPrompt } from '@/lib/assets';
import { putAsset } from '@/lib/library';

export function VoiceStudio() {
  const { concept, keys, bumpLibrary } = useStudio();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesBusy, setVoicesBusy] = useState(false);
  const [casting, setCasting] = useState<VoiceCasting>({});
  const [npcId, setNpcId] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState('');
  const [results, setResults] = useState<Record<string, { text: string; base64: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [castMsg, setCastMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCasting().then(setCasting);
  }, []);

  const npc = useMemo(() => concept?.npcs.find((n) => n.id === npcId), [concept, npcId]);
  const lines: NpcLine[] = useMemo(() => (npc ? npcLines(npc) : []), [npc]);
  const voiceId = npcId ? casting[npcId] : '';

  async function loadVoiceList() {
    setVoicesBusy(true);
    setError(null);
    try {
      setVoices(await getVoices());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stimmen konnten nicht geladen werden');
    } finally {
      setVoicesBusy(false);
    }
  }

  async function setVoiceForNpc(id: string) {
    if (!npcId) return;
    const next = { ...casting, [npcId]: id };
    setCasting(next);
    await saveCasting(next);
  }

  async function suggestVoice() {
    if (!npc || voices.length === 0) return;
    setBusy('cast');
    setError(null);
    try {
      const s = await voiceCast(
        { name: npc.name, role: npc.role_de, traits: npc.personality?.traits },
        voices
      );
      if (s.voiceId) {
        await setVoiceForNpc(s.voiceId);
        setCastMsg(`${s.voiceName || s.voiceId}: ${s.rationale}`);
      } else {
        setCastMsg(s.rationale);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Casting-Vorschlag fehlgeschlagen');
    } finally {
      setBusy(null);
    }
  }

  function toggle(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function speak(key: string, text: string) {
    if (!voiceId) {
      setError('Bitte zuerst eine Stimme für diesen NPC wählen.');
      return;
    }
    setBusy(key);
    setError(null);
    try {
      const res = await genSpeech(text, voiceId);
      setResults((prev) => ({ ...prev, [key]: { text, base64: res.audioBase64 } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sprachausgabe fehlgeschlagen');
    } finally {
      setBusy(null);
    }
  }

  async function speakSelected() {
    if (!voiceId) {
      setError('Bitte zuerst eine Stimme für diesen NPC wählen.');
      return;
    }
    const chosen = lines.filter((l) => selectedKeys.has(l.key));
    // sequenziell (Rate-Limit-schonend)
    for (const line of chosen) {
      await speak(line.key, line.text);
    }
  }

  async function adopt(key: string) {
    const r = results[key];
    if (!r || !npc) return;
    const id = `voice_${npc.id}_${key}`.replace(/[^a-z0-9_]+/g, '_');
    await putAsset(
      createLibraryAsset({
        id,
        type: 'voice',
        dataBase64: r.base64,
        mime: 'audio/mpeg',
        provider: 'elevenlabs',
        prompt: r.text,
        family: `voice:${npc.id}`,
        chosen: true,
      })
    );
    setSaved((prev) => ({ ...prev, [key]: true }));
    bumpLibrary();
  }

  async function adoptAll() {
    for (const key of Object.keys(results)) {
      if (!saved[key]) {
        await adopt(key);
      }
    }
  }

  if (!keys.elevenlabs) {
    return (
      <div className="rounded-lg border border-yellow-700 bg-yellow-900/30 p-3 text-sm text-yellow-200">
        Für Stimmen brauchst du einen ElevenLabs-Key (⚙️ Einstellungen).
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg border border-red-700 bg-red-900/40 p-3 text-sm text-red-300">{error}</div>}

      {/* Casting */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select value={npcId} onChange={(e) => setNpcId(e.target.value)} className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm">
            <option value="">— NPC wählen —</option>
            {concept?.npcs.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
          <button onClick={loadVoiceList} disabled={voicesBusy} className="rounded bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600 disabled:opacity-50">
            {voicesBusy ? 'Lade…' : voices.length ? `Stimmen neu laden (${voices.length})` : 'Stimmen laden'}
          </button>
          {npcId && voices.length > 0 && (
            <>
              <select value={voiceId || ''} onChange={(e) => setVoiceForNpc(e.target.value)} className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm">
                <option value="">— Stimme —</option>
                {voices.map((v) => (
                  <option key={v.voice_id} value={v.voice_id}>
                    {v.name}
                    {v.category ? ` (${v.category})` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={suggestVoice}
                disabled={busy === 'cast' || !keys.anthropic}
                title={keys.anthropic ? '' : 'Claude-Key nötig'}
                className="rounded bg-purple-600 px-3 py-2 text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                {busy === 'cast' ? 'Claude…' : '🎙️ Stimme vorschlagen'}
              </button>
            </>
          )}
        </div>
        {castMsg && <p className="mt-2 text-xs text-gray-400">Casting: {castMsg}</p>}
        {npcId && !voices.length && <p className="mt-2 text-xs text-gray-600">Erst „Stimmen laden", dann casten.</p>}
      </div>

      {/* Zeilen */}
      {npc && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Dialogzeilen — {npc.name}</h3>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setSelectedKeys(new Set(lines.map((l) => l.key)))} className="text-gray-400 hover:text-white">alle</button>
              <button onClick={() => setSelectedKeys(new Set())} className="text-gray-400 hover:text-white">keine</button>
              <button
                onClick={speakSelected}
                disabled={!voiceId || selectedKeys.size === 0 || busy !== null}
                className="rounded bg-green-600 px-3 py-1 font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {busy && busy !== 'cast' ? 'Erzeuge…' : `${selectedKeys.size} erzeugen`}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {lines.map((l) => (
              <div key={l.key} className="flex items-start gap-2 rounded border border-gray-800 bg-gray-950 p-2 text-sm">
                <input type="checkbox" checked={selectedKeys.has(l.key)} onChange={() => toggle(l.key)} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase text-gray-600">{l.category}</span>
                  <div className="text-gray-300">{l.text}</div>
                  {results[l.key] && (
                    <div className="mt-1 flex items-center gap-2">
                      <audio controls src={`data:audio/mpeg;base64,${results[l.key].base64}`} className="h-8" />
                      <button onClick={() => adopt(l.key)} disabled={saved[l.key]} className="rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700 disabled:opacity-50">
                        {saved[l.key] ? '✓ übernommen' : 'übernehmen'}
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => speak(l.key, l.text)} disabled={!voiceId || busy !== null} className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600 disabled:opacity-50">
                  ▶ erzeugen
                </button>
              </div>
            ))}
          </div>

          {/* Freie Zeile (für weitere Sprechsituationen) */}
          <div className="mt-3 flex gap-2">
            <input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Freie Zeile (z. B. neue Sprechsituation)…"
              className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                const key = `custom_${defaultIdFromPrompt(customText, 'line')}`;
                if (customText.trim()) speak(key, customText.trim());
              }}
              disabled={!voiceId || !customText.trim() || busy !== null}
              className="rounded bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600 disabled:opacity-50"
            >
              erzeugen
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="mt-3 text-right">
              <button onClick={adoptAll} className="rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700">
                Alle erzeugten übernehmen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
