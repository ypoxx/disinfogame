'use client';

// ===========================================
// BRIEFING — das Studio kennt das Konzept bereits
// ===========================================
// Zeigt: was das Spiel an Assets braucht (aus den Daten), Stand der Stil-Bibel,
// und globale Notizen. Macht klar: der "leere Prompt-Kasten" existiert nicht.

import { useEffect, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { kvGet, kvSet } from '@/lib/studio/db';
import { roomsForFloor, npcById } from '@/lib/studio/concept';

export function BriefingPanel({
  onGoToStyle,
  onGoToShots,
}: {
  onGoToStyle: () => void;
  onGoToShots: () => void;
}) {
  const { concept, conceptLoading, bible, shots } = useStudio();
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    kvGet('briefingNotes').then((v) => setNotes(v ?? ''));
  }, []);

  async function saveNotes() {
    await kvSet('briefingNotes', notes);
    setNotesSaved(true);
    window.setTimeout(() => setNotesSaved(false), 1500);
  }

  const approved = shots.filter((s) => s.status === 'approved').length;

  if (conceptLoading) return <p className="text-gray-500">Lade Spielkonzept…</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-1 text-lg font-bold">🎬 Regie-Briefing</h2>
        <p className="text-sm text-gray-400">
          Das Studio kennt dein Spielkonzept bereits (aus <code className="rounded bg-gray-800 px-1">building.json</code>{' '}
          + <code className="rounded bg-gray-800 px-1">npcs.json</code> + Stil-Guide). Du musst nichts beschreiben —
          du entscheidest. Ablauf: <strong>Stil festlegen → Shots abarbeiten → exportieren</strong>.
        </p>
        {concept?.source === 'partial' && (
          <div className="mt-3 rounded border border-yellow-700 bg-yellow-900/30 p-2 text-xs text-yellow-200">
            ⚠ Konzept nur teilweise geladen: {concept.warnings.join(' ')} (Snapshot mit{' '}
            <code>npm run sync:game</code> aktualisieren.)
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Gebäude */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-3 font-semibold">🏢 Gebäude ({concept?.floors.length ?? 0} Etagen)</h3>
          <div className="space-y-2 text-sm">
            {concept?.floors.map((f) => (
              <div key={f.id}>
                <div className="text-gray-300">{f.label_de}</div>
                <div className="ml-3 text-gray-500">
                  {roomsForFloor(concept, f.id).map((r) => {
                    const npc = npcById(concept, r.npcId);
                    return (
                      <div key={r.id}>
                        {r.icon ?? '·'} {r.label_de}
                        {npc ? <span className="text-gray-600"> — {npc.name}</span> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stil-Bibel-Status */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="mb-3 font-semibold">🎨 Aktueller Stil ({bible.styleVersion})</h3>
          <div className="text-sm text-gray-300">{bible.directionName}</div>
          <p className="mt-1 text-xs text-gray-500">{bible.mood}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {bible.palette.map((c) => (
              <span
                key={c.hex}
                title={`${c.name} ${c.hex}`}
                className="h-5 w-5 rounded border border-gray-700"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Fortschritt: {approved}/{shots.length} Shots freigegeben
          </div>
          <button
            onClick={onGoToStyle}
            className="mt-4 w-full rounded bg-purple-600 px-3 py-2 text-sm font-medium hover:bg-purple-700"
          >
            Stil-Findung starten / ändern
          </button>
        </div>
      </div>

      {/* Globale Notizen */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="mb-2 font-semibold">📝 Globale Notizen (für dich & den Assistenten)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="z. B. Vorlieben, Referenzen, mehr Bedrohung, weniger sauber…"
          className="h-24 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
        />
        <div className="mt-2 flex items-center gap-3">
          <button onClick={saveNotes} className="rounded bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700">
            Notizen speichern
          </button>
          {notesSaved && <span className="text-sm text-green-400">Gespeichert ✓</span>}
          <button
            onClick={onGoToShots}
            className="ml-auto rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600"
          >
            Zu den Shots →
          </button>
        </div>
      </div>
    </div>
  );
}
