/**
 * soundDirector (pure): Raum-Kulisse je Kontext + adaptive Musik je Lage.
 */
import { describe, it, expect } from 'vitest';
import { ambienceForContext, musicForState } from '../utils/soundDirector';

describe('ambienceForContext', () => {
  it('Overlay hat Vorrang vor Ansicht/Gespräch', () => {
    expect(ambienceForContext({ viewMode: 'office', overlay: 'newsroom' })).toBe('sfx_amb_newsroom');
    expect(ambienceForContext({ viewMode: 'building', overlay: 'akte' })).toBe('sfx_amb_cyber');
  });
  it('Gespräch wählt die Raum-Kulisse der Figur', () => {
    expect(ambienceForContext({ viewMode: 'building', dialogNpcId: 'igor' })).toBe('sfx_amb_keller');
    expect(ambienceForContext({ viewMode: 'building', dialogNpcId: 'marina' })).toBe('sfx_amb_newsroom');
  });
  it('Büro vs. Gebäude-Übersicht', () => {
    expect(ambienceForContext({ viewMode: 'office' })).toBe('sfx_amb_buero');
    expect(ambienceForContext({ viewMode: 'building' })).toBe('sfx_amb_lobby');
  });
  it('inaktiv → Stille (null)', () => {
    expect(ambienceForContext({ viewMode: 'office', active: false })).toBeNull();
  });
});

describe('musicForState', () => {
  it('Risiko hebt die Spannung (ruhig → Spiel → angespannt)', () => {
    expect(musicForState({ risk: 10 })).toBe('music_calm_archive');
    expect(musicForState({ risk: 40 })).toBe('music_gameplay');
    expect(musicForState({ risk: 80 })).toBe('music_tense');
  });
  it('Spielende: Sieg vs. Niederlage', () => {
    expect(musicForState({ risk: 10, gameEnded: true, won: true })).toBe('music_victory');
    expect(musicForState({ risk: 10, gameEnded: true, won: false })).toBe('music_tense');
  });
});
