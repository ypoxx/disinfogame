import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetRegistry } from '../assets/AssetRegistry';
import {
  collectPreloadUrls,
  isPriorityAsset,
  warmImageCache,
  __resetPreloadCacheForTests,
} from '../assets/preloadAssets';
import type { AssetsManifest } from '../assets/types';

const MANIFEST: AssetsManifest = {
  assets: [
    { id: 'building_exterior', type: 'image', file: 'images/building_exterior.png', chosen: true },
    { id: 'room_newsroom', type: 'image', file: 'images/room_newsroom.png', chosen: true },
    { id: 'portrait_direktor', type: 'image', file: 'images/portrait_direktor.png', chosen: true },
    { id: 'ui_header_band', type: 'image', file: 'images/ui_header_band.png', chosen: true },
    { id: 'icon_save', type: 'image', file: 'images/icon_save.png', chosen: true },
    // Nicht-prioritär: großes Fokusgruppen-Publikum + Deko.
    { id: 'persona_lea_zustimmend', type: 'image', file: 'images/persona_lea_zustimmend.png', chosen: true },
    { id: 'prop_coffee_station', type: 'image', file: 'images/prop_coffee_station.png', chosen: true },
    // Sheet zählt als Bild-Asset und muss ebenfalls vorgeladen werden.
    {
      id: 'player_walk',
      type: 'sheet',
      file: 'sheets/player_walk.png',
      chosen: true,
      frameWidth: 32,
      frameHeight: 32,
      animations: { walkRight: { row: 0, frames: 8, frameTime: 90, loop: true } },
    },
    // Audio darf NICHT als vorzuladendes Bild auftauchen.
    { id: 'sfx_click', type: 'sfx', file: 'sounds/sfx_click.mp3', chosen: true },
    { id: 'music_theme_main', type: 'music', file: 'sounds/music_theme_main.mp3', chosen: true },
  ],
};

describe('isPriorityAsset', () => {
  it('erkennt früh-sichtbare Präfixe als prioritär', () => {
    expect(isPriorityAsset('building_exterior')).toBe(true);
    expect(isPriorityAsset('room_newsroom')).toBe(true);
    expect(isPriorityAsset('portrait_marina_happy')).toBe(true);
    expect(isPriorityAsset('ui_header_band')).toBe(true);
    expect(isPriorityAsset('icon_save')).toBe(true);
    expect(isPriorityAsset('player_walk')).toBe(true);
  });

  it('stuft selten/spät Sichtbares als nicht prioritär ein', () => {
    expect(isPriorityAsset('persona_lea_zustimmend')).toBe(false);
    expect(isPriorityAsset('prop_coffee_station')).toBe(false);
  });
});

describe('collectPreloadUrls', () => {
  it('sammelt nur Bild-/Sheet-Assets und teilt nach Priorität', () => {
    const reg = new AssetRegistry(MANIFEST);
    const { priority, rest } = collectPreloadUrls(reg);

    // Audio ist nicht dabei.
    const all = [...priority, ...rest];
    expect(all).not.toContain('/assets/sounds/sfx_click.mp3');
    expect(all).not.toContain('/assets/sounds/music_theme_main.mp3');

    // Prioritär: Fassade, Raum, Porträt, UI, Icon, Spielfigur-Sheet.
    expect(priority).toContain('/assets/images/building_exterior.png');
    expect(priority).toContain('/assets/images/room_newsroom.png');
    expect(priority).toContain('/assets/images/portrait_direktor.png');
    expect(priority).toContain('/assets/images/ui_header_band.png');
    expect(priority).toContain('/assets/images/icon_save.png');
    expect(priority).toContain('/assets/sheets/player_walk.png');

    // Rest: Publikum + Deko.
    expect(rest).toContain('/assets/images/persona_lea_zustimmend.png');
    expect(rest).toContain('/assets/images/prop_coffee_station.png');
    expect(rest).not.toContain('/assets/images/building_exterior.png');
  });

  it('leere Registry => keine URLs', () => {
    const reg = new AssetRegistry(null);
    const { priority, rest } = collectPreloadUrls(reg);
    expect(priority).toHaveLength(0);
    expect(rest).toHaveLength(0);
  });
});

describe('warmImageCache', () => {
  afterEach(() => {
    __resetPreloadCacheForTests();
    vi.restoreAllMocks();
  });

  it('legt für prioritäre Assets sofort Image-Objekte an und plant den Rest im Leerlauf', () => {
    const srcs: string[] = [];
    // Image in jsdom lädt nicht wirklich — wir beobachten nur die gesetzten src.
    const OriginalImage = globalThis.Image;
    class FakeImage {
      decoding = '';
      fetchPriority = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(value: string) {
        srcs.push(value);
      }
    }
    // @ts-expect-error Test-Double
    globalThis.Image = FakeImage;

    let idleFn: (() => void) | null = null;
    const schedule = (fn: () => void): void => {
      idleFn = fn;
    };

    try {
      const reg = new AssetRegistry(MANIFEST);
      warmImageCache(reg, { schedule });

      // Prioritäre Bilder wurden sofort angefragt …
      expect(srcs).toContain('/assets/images/building_exterior.png');
      expect(srcs).toContain('/assets/images/room_newsroom.png');
      // … der Rest noch NICHT (wartet auf Leerlauf).
      expect(srcs).not.toContain('/assets/images/persona_lea_zustimmend.png');
      expect(idleFn).toBeTypeOf('function');

      // Leerlauf auslösen → Rest wird geladen.
      idleFn!();
      expect(srcs).toContain('/assets/images/persona_lea_zustimmend.png');
    } finally {
      globalThis.Image = OriginalImage;
    }
  });

  it('ohne Manifest (size 0) ein No-op', () => {
    const schedule = vi.fn();
    const reg = new AssetRegistry(null);
    warmImageCache(reg, { schedule });
    expect(schedule).not.toHaveBeenCalled();
  });
});
