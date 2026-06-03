'use client';

// ===========================================
// SHOT-LISTE — der Backlog, geordnet nach echter Spiel-Abhängigkeit
// ===========================================

import { useEffect, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { getAsset } from '@/lib/library';
import { makeCustomShot, type Shot, type ShotKind, type ShotStatus } from '@/lib/studio/shots';

const KIND_LABEL: Record<ShotKind, string> = {
  walkcycle: 'Lauf-Zyklus',
  building: 'Gebäude',
  room: 'Räume',
  character: 'Figuren',
  prop: 'Props / Sonstiges',
};

const STATUS_STYLE: Record<ShotStatus, string> = {
  todo: 'bg-gray-700 text-gray-300',
  in_progress: 'bg-yellow-800 text-yellow-200',
  approved: 'bg-green-800 text-green-200',
};

const STATUS_LABEL: Record<ShotStatus, string> = {
  todo: 'offen',
  in_progress: 'in Arbeit',
  approved: 'freigegeben',
};

export function ShotList({ onSelect }: { onSelect: (shot: Shot) => void }) {
  const { shots, addShot, removeShot, libraryVersion } = useStudio();
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const entries = await Promise.all(
        shots
          .filter((s) => s.assetKey)
          .map(async (s) => {
            const a = await getAsset(s.assetKey as string);
            return [s.id, a?.dataBase64] as const;
          })
      );
      if (!active) return;
      const map: Record<string, string> = {};
      for (const [id, b64] of entries) if (b64) map[id] = b64;
      setThumbs(map);
    })();
    return () => {
      active = false;
    };
  }, [shots, libraryVersion]);

  const kinds: ShotKind[] = ['walkcycle', 'building', 'room', 'character', 'prop'];
  const approved = shots.filter((s) => s.status === 'approved').length;

  async function add() {
    const shot = makeCustomShot(newTitle);
    setNewTitle('');
    await addShot(shot);
    onSelect(shot);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-400">
          {approved}/{shots.length} freigegeben · Reihenfolge = Spiel-Abhängigkeit (Lauf-Zyklus zuerst)
        </div>
        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && newTitle.trim() && add()}
            placeholder="Eigenes Asset hinzufügen…"
            className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm"
          />
          <button
            onClick={add}
            disabled={!newTitle.trim()}
            className="rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600 disabled:opacity-50"
          >
            + Shot
          </button>
        </div>
      </div>

      {kinds.map((kind) => {
        const group = shots.filter((s) => s.kind === kind);
        if (group.length === 0) return null;
        return (
          <div key={kind}>
            <h3 className="mb-2 text-sm font-semibold text-gray-400">{KIND_LABEL[kind]}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((shot) => (
                <button
                  key={shot.id}
                  onClick={() => onSelect(shot)}
                  className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900 p-3 text-left transition-colors hover:border-blue-600"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-800">
                    {thumbs[shot.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`data:image/png;base64,${thumbs[shot.id]}`}
                        alt={shot.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] ${STATUS_STYLE[shot.status]}`}>
                        {STATUS_LABEL[shot.status]}
                      </span>
                      {shot.custom && <span className="text-[10px] text-gray-600">eigen</span>}
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-gray-200">{shot.title}</div>
                    <div className="line-clamp-2 text-xs text-gray-500">{shot.brief}</div>
                  </div>
                </button>
              ))}
            </div>
            {kind === 'prop' && (
              <div className="mt-2 text-right">
                {group
                  .filter((s) => s.custom)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => removeShot(s.id)}
                      className="ml-2 text-[11px] text-gray-600 hover:text-red-400"
                    >
                      „{s.title}" entfernen
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
