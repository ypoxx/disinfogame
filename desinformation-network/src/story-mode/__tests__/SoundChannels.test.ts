/**
 * Tests für F37: Kanal-Lautstärken (music/sfx/voice) im SoundSystem.
 * Abgedeckt: setChannelVolume/getChannelVolume, Clamping, Persistenz-Roundtrip,
 * Migration alter Settings ohne Kanal-Felder.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// --- localStorage-Mock -------------------------------------------------------

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// AudioContext minimal-Mock (kein echter Audio-Kontext im jsdom/node)
const mockOscillator = {
  type: 'sine' as OscillatorType,
  frequency: { value: 0 },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};
const mockGain = {
  gain: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
};
const mockContext = {
  currentTime: 0,
  state: 'running',
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGain),
  destination: {},
  resume: vi.fn(),
};

// @ts-ignore — globaler Stub
globalThis.AudioContext = vi.fn(() => mockContext);
// @ts-ignore
globalThis.webkitAudioContext = vi.fn(() => mockContext);

// AssetRegistry-Stub: keine Assets vorhanden → Synth-Pfad aktiv
vi.mock('../assets/AssetRegistry', () => ({
  getAssetRegistry: () => ({ soundUrl: () => null }),
}));

// --- Hilfsfunktion: SoundSystem-Singleton zurücksetzen -----------------------
async function freshSystem() {
  // Modul-Cache wegwerfen, damit jede Testgruppe einen frischen Singleton bekommt
  vi.resetModules();
  const mod = await import('../utils/SoundSystem');
  return mod;
}

// =============================================================================

describe('SoundChannels – getChannelVolume / setChannelVolume', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('Default-Werte sind 1 für alle Kanäle', async () => {
    const { getChannelVolume } = await freshSystem();
    expect(getChannelVolume('music')).toBe(1);
    expect(getChannelVolume('sfx')).toBe(1);
    expect(getChannelVolume('voice')).toBe(1);
  });

  it('setChannelVolume speichert und getChannelVolume gibt korrekten Wert zurück', async () => {
    const { setChannelVolume, getChannelVolume } = await freshSystem();
    setChannelVolume('music', 0.6);
    expect(getChannelVolume('music')).toBeCloseTo(0.6);
    setChannelVolume('sfx', 0.3);
    expect(getChannelVolume('sfx')).toBeCloseTo(0.3);
    setChannelVolume('voice', 0.8);
    expect(getChannelVolume('voice')).toBeCloseTo(0.8);
  });

  it('Clamping: Werte > 1 werden auf 1 begrenzt', async () => {
    const { setChannelVolume, getChannelVolume } = await freshSystem();
    setChannelVolume('music', 2.5);
    expect(getChannelVolume('music')).toBe(1);
    setChannelVolume('sfx', 99);
    expect(getChannelVolume('sfx')).toBe(1);
  });

  it('Clamping: Werte < 0 werden auf 0 begrenzt', async () => {
    const { setChannelVolume, getChannelVolume } = await freshSystem();
    setChannelVolume('voice', -0.5);
    expect(getChannelVolume('voice')).toBe(0);
    setChannelVolume('music', -100);
    expect(getChannelVolume('music')).toBe(0);
  });
});

describe('SoundChannels – Persistenz-Roundtrip', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('Kanal-Werte werden in localStorage persistiert und beim nächsten Laden wiederhergestellt', async () => {
    // Ersten Singleton anlegen, Werte setzen
    const mod1 = await freshSystem();
    mod1.setChannelVolume('music', 0.4);
    mod1.setChannelVolume('sfx', 0.7);
    mod1.setChannelVolume('voice', 0.2);

    // Prüfen, dass localStorage beschrieben wurde
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'storyMode_sound',
      expect.stringContaining('"musicVolume":0.4'),
    );

    // Zweiten Singleton erzeugen (Modul-Reset simuliert Neustart)
    vi.resetModules();
    const mod2 = await import('../utils/SoundSystem');
    expect(mod2.getChannelVolume('music')).toBeCloseTo(0.4);
    expect(mod2.getChannelVolume('sfx')).toBeCloseTo(0.7);
    expect(mod2.getChannelVolume('voice')).toBeCloseTo(0.2);
  });

  it('Migration: alter Save ohne Kanal-Felder → Default 1 für alle Kanäle', async () => {
    // Alten Save-Stand simulieren (nur enabled + volume)
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({ enabled: true, volume: 0.5 }),
    );
    const { getChannelVolume } = await freshSystem();
    expect(getChannelVolume('music')).toBe(1);
    expect(getChannelVolume('sfx')).toBe(1);
    expect(getChannelVolume('voice')).toBe(1);
  });
});
