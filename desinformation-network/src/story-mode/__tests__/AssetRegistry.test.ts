import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AssetRegistry,
  __resetAssetRegistryForTests,
  getAssetRegistry,
  initAssetRegistry,
  subscribeAssets,
  voiceAssetId,
} from '../assets/AssetRegistry';
import type { AssetsManifest } from '../assets/types';

// Beispiel-Manifest im Export-Schema des Asset Studios / der Pipeline.
const MANIFEST: AssetsManifest = {
  assets: [
    { id: 'room_zentrale', type: 'image', file: 'images/room_zentrale.png', chosen: true },
    {
      id: 'player_walk',
      type: 'sheet',
      file: 'sheets/player_walk.png',
      chosen: true,
      frameWidth: 32,
      frameHeight: 32,
      animations: { walkRight: { row: 0, frames: 8, frameTime: 90, loop: true } },
    },
    // Sheet ohne Frame-Maße: darf von sheet() NICHT geliefert werden.
    { id: 'broken_sheet', type: 'sheet', file: 'sheets/broken.png', chosen: true },
    { id: 'sfx_click', type: 'sfx', file: 'sounds/sfx_click.mp3', chosen: true },
    { id: 'music_theme_main', type: 'music', file: 'sounds/music_theme_main.mp3', chosen: true },
    { id: 'voice_direktor_intro', type: 'voice', file: 'sounds/voice_direktor_intro.mp3', chosen: true },
  ],
};

describe('AssetRegistry (Auflösung von Asset-ids)', () => {
  it('leeres Manifest => alles null, size 0 (Fallback-Modus)', () => {
    const reg = new AssetRegistry(null);
    expect(reg.size).toBe(0);
    expect(reg.imageUrl('room_zentrale')).toBeNull();
    expect(reg.soundUrl('sfx_click')).toBeNull();
    expect(reg.sheet('player_walk')).toBeNull();
  });

  it('löst Bild-, Sound- und Sheet-URLs mit baseUrl auf', () => {
    const reg = new AssetRegistry(MANIFEST, '/assets');
    expect(reg.size).toBe(MANIFEST.assets.length);
    expect(reg.imageUrl('room_zentrale')).toBe('/assets/images/room_zentrale.png');
    expect(reg.soundUrl('music_theme_main')).toBe('/assets/sounds/music_theme_main.mp3');
    // Typ-Disziplin: ein Bild ist keine Tonquelle und umgekehrt.
    expect(reg.soundUrl('room_zentrale')).toBeNull();
    expect(reg.imageUrl('sfx_click')).toBeNull();
  });

  it('sheet() liefert Frame-Maße + Animationen, aber nur wenn vollständig', () => {
    const reg = new AssetRegistry(MANIFEST);
    const sheet = reg.sheet('player_walk');
    expect(sheet).not.toBeNull();
    expect(sheet!.frameWidth).toBe(32);
    expect(sheet!.animations.walkRight.frames).toBe(8);
    expect(reg.sheet('broken_sheet')).toBeNull();
    // Sheets sind auch als Bild adressierbar (z. B. statische Vorschau).
    expect(reg.imageUrl('player_walk')).toBe('/assets/sheets/player_walk.png');
  });

  it('sheet() ist referenz-stabil (verhindert Frame-Reset der Lauf-Animation)', () => {
    const reg = new AssetRegistry(MANIFEST);
    // Gleiche Objekt-Identität über mehrere Aufrufe → useSprite-Effekt läuft NICHT
    // bei jedem Re-Render neu (sonst springt der laufende Avatar zurück auf Frame 0).
    expect(reg.sheet('player_walk')).toBe(reg.sheet('player_walk'));
    expect(reg.sheet('broken_sheet')).toBe(reg.sheet('broken_sheet')); // auch null stabil
  });

  it('idsByType filtert und sortiert', () => {
    const reg = new AssetRegistry(MANIFEST);
    expect(reg.idsByType('sheet')).toEqual(['broken_sheet', 'player_walk']);
    expect(reg.idsByType('voice')).toEqual(['voice_direktor_intro']);
  });

  it('voiceAssetId folgt der Studio-Konvention (concept.ts)', () => {
    expect(voiceAssetId('marina', 'greeting_2')).toBe('voice_marina_greeting_2');
    expect(voiceAssetId('direktor', 'reaction_crisis')).toBe('voice_direktor_reaction_crisis');
  });
});

describe('initAssetRegistry (Singleton-Ladepfad)', () => {
  beforeEach(() => {
    __resetAssetRegistryForTests();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    __resetAssetRegistryForTests();
  });

  it('fehlendes Manifest (404) => leere Registry, kein Fehler', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    const reg = await initAssetRegistry('/assets');
    expect(reg.size).toBe(0);
    expect(getAssetRegistry().size).toBe(0);
  });

  it('Netzwerkfehler => leere Registry, kein Throw', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(initAssetRegistry()).resolves.toBeDefined();
    expect(getAssetRegistry().size).toBe(0);
  });

  it('gültiges Manifest => Registry gefüllt, Subscriber benachrichtigt, fetch nur 1×', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MANIFEST),
    });
    vi.stubGlobal('fetch', fetchMock);

    let notified = 0;
    const unsubscribe = subscribeAssets(() => {
      notified++;
    });

    await initAssetRegistry('/assets');
    await initAssetRegistry('/assets'); // zweiter Aufruf lädt nicht erneut

    expect(getAssetRegistry().size).toBe(MANIFEST.assets.length);
    expect(getAssetRegistry().imageUrl('room_zentrale')).toBe('/assets/images/room_zentrale.png');
    expect(notified).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('kaputtes JSON-Shape (kein assets-Array) => bleibt leer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ foo: 'bar' }),
    }));
    await initAssetRegistry();
    expect(getAssetRegistry().size).toBe(0);
  });
});
