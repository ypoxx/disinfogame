import { describe, expect, it } from 'vitest';
import manifest from '../../../public/assets/assets.json';
import { audienceFrameOffset } from '../broadcast/BroadcastBar';

const AUDIENCE_IDS = [
  'audience_optimiererin',
  'audience_macher',
  'audience_bohemien',
  'audience_besorgte_mitte',
  'audience_zorniger',
  'audience_idealistin',
  'audience_eigenheimer',
  'audience_liberale',
] as const;

describe('finale Publikums-Sprites', () => {
  it('hat für jeden Archetyp vier echte Stimmungsreihen', () => {
    for (const id of AUDIENCE_IDS) {
      const asset = manifest.assets.find((candidate) => candidate.id === id);
      expect(asset, id).toBeTruthy();
      expect(asset?.frameWidth).toBe(96);
      expect(asset?.frameHeight).toBe(96);
      const animations = asset?.animations as Record<string, { row?: number; frames: number; frameTimes?: number[] }> | undefined;
      for (const [row, mood] of ['ruhig', 'verunsichert', 'wuetend', 'misstrauisch'].entries()) {
        const animation = animations?.[mood];
        expect(animation?.row, `${id}/${mood}`).toBe(row);
        expect(animation?.frames, `${id}/${mood}`).toBe(4);
      }
    }
  });

  it('hält lange Ruhephasen, aber einen kurzen natürlichen Blink', () => {
    for (const id of AUDIENCE_IDS) {
      const asset = manifest.assets.find((candidate) => candidate.id === id);
      const animations = asset?.animations as Record<string, { frameTimes?: number[] }> | undefined;
      const times = animations?.ruhig?.frameTimes ?? [];
      expect(Math.max(...times), id).toBeGreaterThanOrEqual(1400);
      expect(Math.min(...times), id).toBeLessThanOrEqual(150);
    }
  });

  it('startet die sichtbaren Milieus in verschiedenen Phasen', () => {
    const offsets = ['wu_optimiererin', 'wu_macher', 'wu_bohemien', 'wu_besorgte_mitte'].map(audienceFrameOffset);
    expect(new Set(offsets).size).toBeGreaterThan(1);
  });
});
