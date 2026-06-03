'use client';

// ===========================================
// REGIE — Rahmen mit Unter-Tabs + Shot-Workspace
// ===========================================

import { useState } from 'react';
import { BriefingPanel } from './BriefingPanel';
import { StyleFinder } from './StyleFinder';
import { ShotList } from './ShotList';
import { ShotWorkspace } from './ShotWorkspace';
import { BiblePanel } from './BiblePanel';
import type { Shot } from '@/lib/studio/shots';

type Sub = 'briefing' | 'style' | 'shots' | 'bible';

const TABS: { id: Sub; label: string }[] = [
  { id: 'briefing', label: 'Briefing' },
  { id: 'style', label: 'Stil-Findung' },
  { id: 'shots', label: 'Shots' },
  { id: 'bible', label: 'Stil-Bibel' },
];

export function DirectorPanel() {
  const [sub, setSub] = useState<Sub>('briefing');
  const [activeShot, setActiveShot] = useState<Shot | null>(null);

  function openShot(shot: Shot) {
    setActiveShot(shot);
    setSub('shots');
  }

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap gap-1 border-b border-gray-800 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSub(t.id);
              if (t.id !== 'shots') setActiveShot(null);
            }}
            className={`rounded-t px-3 py-1.5 text-sm ${
              sub === t.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {sub === 'briefing' && (
        <BriefingPanel onGoToStyle={() => setSub('style')} onGoToShots={() => setSub('shots')} />
      )}
      {sub === 'style' && <StyleFinder />}
      {sub === 'shots' &&
        (activeShot ? (
          <ShotWorkspace shot={activeShot} onBack={() => setActiveShot(null)} />
        ) : (
          <ShotList onSelect={openShot} />
        ))}
      {sub === 'bible' && <BiblePanel />}
    </div>
  );
}
