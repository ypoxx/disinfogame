/**
 * Render-Schicht der LB-Statisten (Review E3): Die Abnahme-Kriterien
 * „pointer-events-frei", „kein Fade auf der Figur" und „RoomDoor öffnet für
 * Ambient-Türen" waren nur im puren Modell getestet — hier die jsdom-Probe
 * über den echten AmbientLifeLayer/RoomDoor-Pfad (sampleAmbient gemockt).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup, fireEvent, screen } from '@testing-library/react';
import { BuildingStage } from '../building/BuildingStage';
import { roomById, STAGE } from '../building/buildingLayout';
import { __resetAssetRegistryForTests } from '../assets/AssetRegistry';
import type { NavigatorState } from '../building/useNavigator';
import type { AssetsManifest } from '../assets/types';

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
const MANIFEST: AssetsManifest = {
  assets: [
    { id: 'bld_door_closed', type: 'image', file: 'images/bld_door_closed.png', chosen: true },
    { id: 'bld_door_open', type: 'image', file: 'images/bld_door_open.png', chosen: true },
    { id: 'elevator_cabin_closed', type: 'image', file: 'images/elevator_cabin_closed.png', chosen: true },
    { id: 'elevator_cabin_open', type: 'image', file: 'images/elevator_cabin_open.png', chosen: true },
    // Alle Flur-Statisten (FLOOR_AMBIENT) benutzen dieses Blatt.
    {
      id: 'figure_clerk', type: 'sheet', file: 'sheets/figure_clerk.png', chosen: true,
      frameWidth: 48, frameHeight: 96,
      animations: { idle: { row: 0, frames: 4, frameTime: 200, loop: true } },
    },
    {
      id: 'figure_cleaner_walk', type: 'sheet', file: 'sheets/figure_cleaner_walk.png', chosen: true,
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

    // RoomDoor: exakt die Ambient-Tür dreht ihr Blatt räumlich auf; alle
    // anderen bleiben bei rotateY(0deg). Keine Opazitätsblende mehr.
    const openDoors = [...container.querySelectorAll('[data-door-state="open"]')];
    expect(openDoors).toHaveLength(1);
    const openLeaf = openDoors[0].querySelector('[data-door-leaf]') as HTMLElement;
    expect(openLeaf.style.transform).toContain('rotateY(-82deg)');
    const closedLeaves = [...container.querySelectorAll('[data-door-state="closed"] [data-door-leaf]')] as HTMLElement[];
    expect(closedLeaves.length).toBeGreaterThan(0);
    expect(closedLeaves.every((leaf) => leaf.style.transform === 'rotateY(0deg)')).toBe(true);
  });

  it('Fahrstuhl öffnet zwei Schiebepaneele und markiert den sichtbaren Tiefenschritt', async () => {
    const nav: NavigatorState = {
      ...NAV_IDLE,
      mode: 'ride',
      cabinDoorsOpen: true,
      avatarInCabin: true,
      cabinTransfer: 'entering',
    };
    const { container } = render(<BuildingStage npcs={[]} nav={nav} />);
    const panels = await waitFor(() => {
      const found = [...container.querySelectorAll('[data-elevator-panel]')] as HTMLElement[];
      expect(found).toHaveLength(2);
      return found;
    });
    expect(panels[0].style.transform).toBe('translateX(-100%)');
    expect(panels[1].style.transform).toBe('translateX(100%)');
    const transfer = container.querySelector('[data-cabin-transfer="entering"]') as HTMLElement;
    expect(transfer).toBeTruthy();
    expect(transfer.style.animation).toContain('bs-elevator-enter');
    expect(screen.getByTestId('building-camera').style.transition).toBe('none');
    const keyframes = container.querySelector('style')?.textContent ?? '';
    expect(keyframes).not.toContain('scale(1.07)');
    expect(keyframes).not.toContain('filter:brightness');
  });

  it('verschiebt Tür, Schild/Lampe und Klickfläche gemeinsam in die Wandebene', async () => {
    const { container } = render(<BuildingStage npcs={[]} nav={NAV_IDLE} />);
    const zentrale = roomById('zentrale')!;
    const finanzen = roomById('finanzen')!;

    const zentraleDoor = await waitFor(() => container.querySelector('[data-room-door="zentrale"]') as HTMLElement);
    const finanzenDoor = container.querySelector('[data-room-door="finanzen"]') as HTMLElement;
    const zentraleCapture = container.querySelector('[data-door-capture="zentrale"]') as HTMLElement;
    const finanzenCapture = container.querySelector('[data-door-capture="finanzen"]') as HTMLElement;

    expect(zentraleDoor.style.top).toBe(`${zentrale.doorFootY - STAGE.doorHeight}px`);
    expect(finanzenDoor.style.top).toBe(`${finanzen.doorFootY - STAGE.doorHeight}px`);
    expect(zentraleCapture.style.top).toBe(`${zentrale.doorFootY - STAGE.doorHeight - 40}px`);
    expect(finanzenCapture.style.top).toBe(`${finanzen.doorFootY - STAGE.doorHeight - 40}px`);
    expect(zentraleDoor.dataset.doorFootY).toBe(String(zentrale.doorFootY));
    expect(finanzenDoor.dataset.doorFootY).toBe(String(finanzen.doorFootY));

    const floor4 = container.querySelector('[data-floor-id="etage4"]') as HTMLElement;
    expect(Number(floor4.dataset.walkFootY)).toBe(Number(floor4.dataset.doorFootY));
    expect(Number(floor4.dataset.walkFootY)).toBeGreaterThan(Number(floor4.dataset.wallFootY));
  });

  /**
   * Die Flur-Statisten haben seit Strang 5 je eine Zeile — der Owner hielt sie
   * trotzdem für nicht umgesetzt. Zu Recht: Sie sahen aus wie Kulisse, und wer
   * doch mehrere traf, hatte danach vier Blasen über den Etagenschildern.
   */
  it('Flur-Statist: nennt sich bei Berührung und es spricht immer nur einer', async () => {
    render(<BuildingStage npcs={[]} nav={NAV_IDLE} />);

    const knoepfe = await waitFor(() => {
      const els = screen.getAllByRole('button', { name: /ansprechen/i });
      expect(els.length).toBeGreaterThanOrEqual(2);
      return els;
    });

    // Kein Zeichen, solange niemand hinzeigt.
    expect(screen.queryAllByTestId('ambient-schild')).toHaveLength(0);
    fireEvent.mouseEnter(knoepfe[0]);
    expect(screen.getAllByTestId('ambient-schild')).toHaveLength(1);
    fireEvent.mouseLeave(knoepfe[0]);
    expect(screen.queryAllByTestId('ambient-schild')).toHaveLength(0);

    // Erster Klick: genau eine Blase.
    fireEvent.click(knoepfe[0]);
    expect(screen.getAllByTestId('ambient-bubble')).toHaveLength(1);

    // Zweiter Statist: weiterhin genau eine — die erste schließt sich.
    fireEvent.click(knoepfe[1]);
    expect(screen.getAllByTestId('ambient-bubble')).toHaveLength(1);

    // Erneuter Klick auf dieselbe Figur schließt sie.
    fireEvent.click(knoepfe[1]);
    expect(screen.queryAllByTestId('ambient-bubble')).toHaveLength(0);
  });
});
