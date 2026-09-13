import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSprite } from '../assets/useSprite';
import type { SheetInfo } from '../assets/types';

const SHEET: SheetInfo = {
  id: 'audience_test',
  url: '/assets/sheets/audience_test.png',
  frameWidth: 48,
  frameHeight: 48,
  animations: {
    ruhig: {
      row: 0,
      frames: 4,
      frameTime: 999,
      frameTimes: [1800, 120, 750, 1450],
      loop: true,
    },
  },
};

describe('useSprite — natürliche Einzelbild-Zeiten', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('beginnt am Phasenoffset und hält den kurzen Blink nur 120 ms', () => {
    const { result } = renderHook(() => useSprite(SHEET, 'ruhig', undefined, 1));
    expect(result.current?.frame).toBe(1);

    act(() => vi.advanceTimersByTime(119));
    expect(result.current?.frame).toBe(1);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current?.frame).toBe(2);

    act(() => vi.advanceTimersByTime(750));
    expect(result.current?.frame).toBe(3);
  });

  it('lässt einen Bewegungs-Override Vorrang vor den Mimikzeiten haben', () => {
    const { result } = renderHook(() => useSprite(SHEET, 'ruhig', 80));
    expect(result.current?.frame).toBe(0);
    act(() => vi.advanceTimersByTime(79));
    expect(result.current?.frame).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current?.frame).toBe(1);
  });
});
