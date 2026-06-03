'use client';

// ===========================================
// SETTINGS PANEL — API-Keys eingeben & testen
// ===========================================
// Keys nur lokal (localStorage), pro Request als Header an die API-Routen;
// .env.local bleibt serverseitiger Fallback. Siehe lib/keys.ts + lib/providers.ts.

import { useState } from 'react';
import { loadKeys, saveKeys, type ApiKeys } from '@/lib/keys';
import { KEY_HEADERS, type ProviderId } from '@/lib/providers';

interface SettingsPanelProps {
  onClose: () => void;
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail';

const PROVIDERS: {
  id: ProviderId;
  label: string;
  placeholder: string;
  hint: string;
  testable: boolean;
}[] = [
  {
    id: 'google',
    label: 'Google AI — Gemini / Nano Banana Pro (Bilder)',
    placeholder: 'AIza…',
    hint: 'aistudio.google.com/app/apikey',
    testable: true,
  },
  {
    id: 'anthropic',
    label: 'Claude (Anthropic) — Prompt-Hilfe, optional',
    placeholder: 'sk-ant-…',
    hint: 'console.anthropic.com/settings/keys',
    testable: true,
  },
  {
    id: 'elevenlabs',
    label: 'ElevenLabs — Audio (ab Milestone M5)',
    placeholder: '…',
    hint: 'elevenlabs.io/app/settings/api-keys',
    testable: false,
  },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  // Lazy-Init liest localStorage erst beim Mounten (Panel öffnet client-seitig auf Klick).
  const [keys, setKeys] = useState<ApiKeys>(() => loadKeys());
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [tests, setTests] = useState<Record<string, TestState>>({});
  const [saved, setSaved] = useState(false);

  function update(id: ProviderId, value: string) {
    setKeys((prev) => ({ ...prev, [id]: value }));
    setTests((prev) => ({ ...prev, [id]: 'idle' }));
    setSaved(false);
  }

  function handleSave() {
    saveKeys(keys);
    setSaved(true);
  }

  async function handleTest(id: ProviderId) {
    // Mit dem AKTUELL eingegebenen Key testen (auch ungespeichert).
    setTests((prev) => ({ ...prev, [id]: 'testing' }));
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const value = keys[id]?.trim();
      if (value) headers[KEY_HEADERS[id]] = value;
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers,
        body: JSON.stringify({ provider: id }),
      });
      const data = res.ok
        ? ((await res.json().catch(() => ({}))) as { ok?: boolean })
        : { ok: false };
      setTests((prev) => ({ ...prev, [id]: data.ok ? 'ok' : 'fail' }));
    } catch {
      setTests((prev) => ({ ...prev, [id]: 'fail' }));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg space-y-5 rounded-xl border border-gray-700 bg-gray-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">⚙️ Einstellungen — API-Keys</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Schließen">
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Keys werden nur lokal im Browser gespeichert (localStorage) und pro Anfrage an die lokalen
          API-Routen geschickt. Fehlt ein Key, greift der{' '}
          <code className="rounded bg-gray-800 px-1">.env.local</code>-Fallback. Nichts wird ins Repo committet.
        </p>

        {PROVIDERS.map((p) => (
          <div key={p.id} className="space-y-1">
            <label className="text-sm text-gray-300">{p.label}</label>
            <div className="flex gap-2">
              <input
                type={show[p.id] ? 'text' : 'password'}
                value={keys[p.id] || ''}
                onChange={(e) => update(p.id, e.target.value)}
                placeholder={p.placeholder}
                className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm"
              />
              <button
                onClick={() => setShow((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className="px-2 text-sm text-gray-400 hover:text-white"
                aria-label="Key anzeigen/verbergen"
              >
                {show[p.id] ? '🙈' : '👁️'}
              </button>
              {p.testable && (
                <button
                  onClick={() => handleTest(p.id)}
                  disabled={tests[p.id] === 'testing'}
                  className="whitespace-nowrap rounded bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600 disabled:opacity-50"
                >
                  {tests[p.id] === 'testing' ? '…' : 'Test'}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{p.hint}</span>
              {tests[p.id] === 'ok' && <span className="text-green-400">✓ verbindet</span>}
              {tests[p.id] === 'fail' && (
                <span className="text-red-400">✗ Key ungültig / nicht erreichbar</span>
              )}
              {!p.testable && <span className="text-gray-600">Test ab M5</span>}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && <span className="text-sm text-green-400">Gespeichert ✓</span>}
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
