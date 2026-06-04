'use client';

// ===========================================
// ASSET STUDIO — Shell (Tabs + Provider)
// ===========================================
// 🎬 Regie (geführter Art-Director-Workflow) · 🎞️ Sprite-Sheet · ✨ Frei erzeugen ·
// 📚 Bibliothek · ⚙️ Einstellungen. Zustand (Konzept/Bibel/Shots/Keys) im StudioProvider.

import { useState } from 'react';
import { StudioProvider, useStudio } from '@/lib/studio/StudioContext';
import { DirectorPanel } from '@/components/director/DirectorPanel';
import { SheetStudio } from '@/components/SheetStudio';
import { SoundStudio } from '@/components/SoundStudio';
import { FreeCreate } from '@/components/FreeCreate';
import { LibraryPanel } from '@/components/LibraryPanel';
import { SettingsPanel } from '@/components/SettingsPanel';

type Tab = 'director' | 'sheet' | 'sound' | 'free' | 'library';

const TABS: { id: Tab; label: string }[] = [
  { id: 'director', label: '🎬 Regie' },
  { id: 'sheet', label: '🎞️ Sprite-Sheet' },
  { id: 'sound', label: '🔊 Sound' },
  { id: 'free', label: '✨ Frei erzeugen' },
  { id: 'library', label: '📚 Bibliothek' },
];

function Shell() {
  const { keys, refreshKeys } = useStudio();
  const [tab, setTab] = useState<Tab>('director');
  const [showSettings, setShowSettings] = useState(false);

  const noKeys = !keys.google && !keys.anthropic;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <span className="text-lg font-bold">Asset Studio</span>
          </div>
          <nav className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded px-3 py-1.5 text-sm transition-colors ${
                  tab === t.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-500 sm:inline">
              <span className={keys.google ? 'text-green-400' : 'text-gray-600'}>● Google</span>{' '}
              <span className={keys.anthropic ? 'text-green-400' : 'text-gray-600'}>● Claude</span>
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded text-sm text-gray-400 hover:text-white"
              title="API-Keys"
            >
              ⚙️ Einstellungen
            </button>
          </div>
        </div>
      </header>

      {noKeys && (
        <div className="border-b border-yellow-800 bg-yellow-900/30 px-4 py-2 text-center text-sm text-yellow-200">
          Noch keine API-Keys hinterlegt — unter ⚙️ Einstellungen Google- (Bilder) und Claude-Key (Regie) eingeben.
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'director' && <DirectorPanel />}
        {tab === 'sheet' && <SheetStudio />}
        {tab === 'sound' && <SoundStudio />}
        {tab === 'free' && <FreeCreate />}
        {tab === 'library' && <LibraryPanel embedded />}
      </main>

      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-gray-500">
          Asset Studio (internes Werkzeug) · Bilder: Gemini 3 Pro Image · Regie & Prompt-Hilfe: Claude
        </div>
      </footer>

      {showSettings && (
        <SettingsPanel
          onClose={() => {
            setShowSettings(false);
            refreshKeys();
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  );
}
