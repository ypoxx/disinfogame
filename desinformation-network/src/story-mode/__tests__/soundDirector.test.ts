/**
 * soundDirector (pure): Raum-Kulisse je Kontext + adaptive Musik je Lage.
 */
import { describe, it, expect } from 'vitest';
import { ambienceForContext, musicForState, musicPoolForState, musicTrimGain, MUSIC_TRIM_DB } from '../utils/soundDirector';

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
  it('Broadcast → Wohnzimmer-Kulisse, Wahlabend → TV-Studio (Luxus-Sound-Review)', () => {
    expect(ambienceForContext({ viewMode: 'office', overlay: 'broadcast' })).toBe('sfx_amb_wohnzimmer');
    expect(ambienceForContext({ viewMode: 'building', overlay: 'wahlabend' })).toBe('sfx_amb_tvstudio');
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

describe('musicPoolForState', () => {
  it('jedes Lauf-Band ist gepoolt (Klang-Vielfalt: drei gleichwertige Tracks)', () => {
    expect(musicPoolForState({ risk: 10 })).toEqual(['music_calm_archive', 'music_night_city', 'music_calm_dossier']);
    expect(musicPoolForState({ risk: 40 })).toEqual(['music_gameplay', 'music_gameplay_teletype', 'music_gameplay_corridor']);
    expect(musicPoolForState({ risk: 80 })).toEqual(['music_tense', 'music_tense_pursuit', 'music_tense_lockdown']);
  });
  it('Spielende bleibt bewusst einzeln (Sieg/Niederlage)', () => {
    expect(musicPoolForState({ risk: 10, gameEnded: true, won: true })).toEqual(['music_victory']);
    expect(musicPoolForState({ risk: 80, gameEnded: true, won: false })).toEqual(['music_tense']);
  });
  it('musicForState bleibt das erste Pool-Element = Anker (deterministisch, rückwärtskompatibel)', () => {
    for (const risk of [10, 40, 80]) {
      expect(musicForState({ risk })).toBe(musicPoolForState({ risk })[0]);
    }
  });
});

describe('musicTrimGain', () => {
  it('Anker-Tracks + Unbekanntes bleiben unverändert (Faktor 1)', () => {
    expect(musicTrimGain('music_gameplay')).toBe(1);
    expect(musicTrimGain('music_tense')).toBe(1);
    expect(musicTrimGain(null)).toBe(1);
    expect(musicTrimGain('gibt_es_nicht')).toBe(1);
  });
  it('Zusatz-Tracks werden nur abgesenkt (Faktor < 1, nie Anhebung → kein Clipping)', () => {
    for (const id of Object.keys(MUSIC_TRIM_DB)) {
      const gain = musicTrimGain(id);
      expect(gain).toBeGreaterThan(0);
      expect(gain).toBeLessThan(1);
    }
    // −3,8 dB → ~0,646 (gameplay_teletype, der lauteste Ausreißer im gameplay-Band)
    expect(musicTrimGain('music_gameplay_teletype')).toBeCloseTo(0.646, 2);
  });
});
