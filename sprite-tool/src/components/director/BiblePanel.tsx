'use client';

// ===========================================
// STIL-BIBEL — Editor + Versionen + Master-Referenzen
// ===========================================

import { useEffect, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { buildAnchor, listBibleSnapshots, type StyleBible } from '@/lib/studio/bible';
import { getAsset } from '@/lib/library';

export function BiblePanel() {
  const { bible, saveBible } = useStudio();
  const [local, setLocal] = useState<StyleBible>(bible);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<StyleBible[]>([]);
  const [masterThumbs, setMasterThumbs] = useState<Record<string, string>>({});

  // local wird beim Mount aus der Bibel initialisiert (Panel re-mountet beim
  // Tab-Wechsel) — kein Sync-Effekt nötig.
  useEffect(() => {
    listBibleSnapshots().then(setSnapshots);
  }, [savedMsg]);
  useEffect(() => {
    let active = true;
    (async () => {
      const entries = await Promise.all(
        Object.entries(local.masters).map(async ([slot, key]) => {
          const a = await getAsset(key);
          return [slot, a?.dataBase64] as const;
        })
      );
      if (!active) return;
      const map: Record<string, string> = {};
      for (const [slot, b64] of entries) if (b64) map[slot] = b64;
      setMasterThumbs(map);
    })();
    return () => {
      active = false;
    };
  }, [local.masters]);

  function set<K extends keyof StyleBible>(key: K, value: StyleBible[K]) {
    setLocal((p) => ({ ...p, [key]: value }));
  }

  async function save(snapshot: boolean) {
    await saveBible(local, snapshot);
    setSavedMsg(snapshot ? 'Version gesichert ✓' : 'Gespeichert ✓');
    window.setTimeout(() => setSavedMsg(null), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Felder */}
        <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
          <Field label="Richtung">
            <input value={local.directionName} onChange={(e) => set('directionName', e.target.value)} className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
          <Field label="Version">
            <input value={local.styleVersion} onChange={(e) => set('styleVersion', e.target.value)} className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
          <Field label="Mood">
            <textarea value={local.mood} onChange={(e) => set('mood', e.target.value)} className="h-16 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
          <Field label="Do's (eine pro Zeile)">
            <textarea value={local.dos.join('\n')} onChange={(e) => set('dos', e.target.value.split('\n').filter(Boolean))} className="h-20 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
          <Field label="Don'ts (eine pro Zeile)">
            <textarea value={local.donts.join('\n')} onChange={(e) => set('donts', e.target.value.split('\n').filter(Boolean))} className="h-20 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
          <Field label="Render-Hinweise">
            <textarea value={local.renderNotes} onChange={(e) => set('renderNotes', e.target.value)} className="h-16 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm" />
          </Field>
        </div>

        {/* Palette + Master + Anchor */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-300">Palette</h3>
            <div className="space-y-2">
              {local.palette.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c.hex} onChange={(e) => set('palette', local.palette.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} className="h-7 w-9 rounded border border-gray-700 bg-gray-800" />
                  <input value={c.name} onChange={(e) => set('palette', local.palette.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className="flex-1 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs" />
                  <button onClick={() => set('palette', local.palette.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400">✕</button>
                </div>
              ))}
              <button onClick={() => set('palette', [...local.palette, { name: 'Neu', hex: '#888888' }])} className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600">+ Farbe</button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-300">Master-Referenzen</h3>
            {Object.keys(local.masters).length === 0 ? (
              <p className="text-xs text-gray-600">Noch keine. Im Shot-Workspace „auch als Stil-Master" anhaken.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {Object.entries(local.masters).map(([slot]) => (
                  <div key={slot} className="text-center text-xs">
                    <div className="h-16 w-16 overflow-hidden rounded border border-gray-700 bg-gray-800">
                      {masterThumbs[slot] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`data:image/png;base64,${masterThumbs[slot]}`} alt={slot} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600">?</div>
                      )}
                    </div>
                    <div className="mt-1 text-gray-400">{slot}</div>
                    <button
                      onClick={() => {
                        const next = { ...local.masters };
                        delete next[slot];
                        set('masters', next);
                      }}
                      className="text-gray-600 hover:text-red-400"
                    >
                      entfernen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Anchor-Vorschau */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">Anchor (wird jedem Prompt vorangestellt)</h3>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-gray-950 p-3 text-xs text-gray-400">{buildAnchor(local)}</pre>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => save(false)} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700">Speichern</button>
          <button onClick={() => save(true)} className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600">Als Version sichern</button>
          {savedMsg && <span className="text-sm text-green-400">{savedMsg}</span>}
        </div>
      </div>

      {snapshots.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-300">Versionen</h3>
          <div className="space-y-1 text-xs">
            {snapshots.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-gray-400">
                <span>{new Date(s.updatedAt).toLocaleString()}</span>
                <span className="text-gray-500">{s.directionName} ({s.styleVersion})</span>
                <button
                  onClick={() => {
                    const restored = { ...s, id: bible.id };
                    saveBible(restored).then(() => {
                      setLocal(restored);
                      setSavedMsg('Wiederhergestellt ✓');
                    });
                  }}
                  className="ml-auto rounded bg-gray-700 px-2 py-0.5 hover:bg-gray-600"
                >
                  wiederherstellen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-gray-400">{label}</span>
      {children}
    </label>
  );
}
