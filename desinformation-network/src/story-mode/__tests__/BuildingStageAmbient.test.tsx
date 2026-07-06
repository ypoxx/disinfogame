/**
 * Render-Schicht der LB-Statisten (Review E3): Die Abnahme-Kriterien
 * „pointer-events-frei", „kein Fade auf der Figur" und „RoomDoor öffnet für
 * Ambient-Türen" waren nur im puren Modell getestet — hier die jsdom-Probe
 * über den echten AmbientLifeLayer/RoomDoor-Pfad (sampleAmbient gemockt).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { BuildingStage } from '../building/BuildingStage';
import { __resetAssetRegistryForTests } from '../assets/AssetRegistry';
import type { NavigatorState } from '../building/useNavigator';

// ambientLife mocken: fester Schnappschuss statt rAF-Uhr — getestet wird die
// RENDER-Schicht (Figur-Container, Tür-Blende), nicht die (pur getestete) Logik.
vi.mock('../building/ambientLife', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../building/ambientLife')>();
  return {
    ...mod,
    // Kein Sheet-Preload nötig (leere Agentenliste ⇒ Uhr startet sofort).
    AMBIENT_AGENTS: [],
    createAmbientLife: vi.fn(() => ({ agents: [], layout: null as never })),
    tickAmbientLife: vi.fn(),
    sampleAmbient: vi.fn(() => ({
      figures: [
        { id: 'reinigung', floorLevel: 3, x: 500, facing: -1 as const, anim: 'walk' as const, sheet: 'figure_cleaner_walk', speedPxS: 44 },
      ],
      openDoorRoomIds: ['analyse'],
    })),
    nudgeAmbient: vi.fn(() => true),
  };
});

const NAV_IDLE: NavigatorState = {
  pos: { floorLevel: 0, x: 200 },
  facing: 1,
  mode: 'idle',
  cabinLevel: 0,
  cabinDoorsOpen: false,
  avatarInCabin: false,
  openDoorRoomId: null,
  targetRoomId: null,
};

// Minimal-Manifest: Tür-Bilder (RoomDoor-Blende) + das Walk-Sheet der Figur.
const MANIFEST = {
  assets: [
    { id: 'bld_door_closed', type: 'image' as const, file: 'images/bld_door_closed.png', chosen: true },
    { id: 'bld_door_open', type: 'image' as const, file: 'images/bld_door_open.png', chosen: true },
    {
      id: 'figure_cleaner_walk', type: 'sheet' as const, file: 'sheets/figure_cleaner_walk.png', chosen: true,
      frameWidth: 48, frameHeight: 96,
      animations: { walk: { row: 0, frames: 8, frameTime: 100, loop: true } },
    },
  ],
};

describe('BuildingStage — Ambient-Render-Schicht (LB)', () => {
  beforeEach(() => {
    __resetAssetRegistryForTests(MANIFEST);
    // jsdom kennt weder ResizeObserver (Bühnen-Maße) noch matchMedia (dpr/
    // reduced-motion) — Minimal-Stubs, beide Pfade sind nicht Testgegenstand.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    if (typeof window.matchMedia !== 'function') {
      vi.stubGlobal('matchMedia', (media: string) => ({
        matches: false,
        media,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
      }));
    }
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    __resetAssetRegistryForTests(null);
  });

  it('Statist rendert pointer-events-frei, ohne Fade, Füße-bündig; Ambient-Tür blendet auf', async () => {
    const { container } = render(<BuildingStage npcs={[]} nav={NAV_IDLE} />);

    // rAF-Loop des Layers liefert den (gemockten) Schnappschuss.
    const walker = await waitFor(() => {
      const el = container.querySelector('[data-bs-walker="reinigung"]') as HTMLElement | null;
      expect(el).toBeTruthy();
      return el!;
    });

    // Abnahme: klick-transparent und OHNE Fade-Mechanik auf der Figur.
    expect(walker.style.pointerEvents).toBe('none');
    expect(walker.style.opacity).toBe('');
    expect(walker.style.transition).toBe('');
    // Füße auf der Wand-Fuß-Linie: flex-end im Container (B6-Muster).
    expect(walker.style.alignItems).toBe('flex-end');

    // RoomDoor: die von der Ambient-Figur benutzte Tür (analyse) blendet auf …
    const doors = [...container.querySelectorAll('img[src*="bld_door_open"]')] as HTMLImageElement[];
    expect(doors.length).toBeGreaterThan(0);
    const openOnes = doors.filter((d) => d.style.opacity === '1');
    expect(openOnes).toHaveLength(1);
    // … alle anderen offenen Türblätter bleiben ausgeblendet.
    for (const d of doors.filter((x) => !openOnes.includes(x))) {
      expect(d.style.opacity).toBe('0');
    }
  });
});
