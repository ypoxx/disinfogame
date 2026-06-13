import { describe, it, expect, beforeEach } from 'vitest';
import {
  useDayClockStore,
  clockLabel,
  isAfterWarn,
  TIME_COST,
  DAY_START_HOUR,
  DAY_END_HOUR,
  WARN_HOUR,
} from '../stores/dayClockStore';

// Pure Tests der Tages-Uhr (Label, Klemmen, Warn-Schwelle, Reset).

describe('dayClockStore', () => {
  beforeEach(() => {
    useDayClockStore.getState().resetDay();
  });

  describe('Konstanten', () => {
    it('hat die abgenommenen Tagesgrenzen', () => {
      expect(DAY_START_HOUR).toBe(9);
      expect(DAY_END_HOUR).toBe(18);
      expect(WARN_HOUR).toBe(17);
    });

    it('hat die Zeitkosten-Tabelle', () => {
      expect(TIME_COST).toEqual({
        action: 90,
        dialog: 30,
        walkPerFloor: 10,
        elevatorPerFloor: 5,
        doorway: 2,
      });
    });
  });

  describe('clockLabel', () => {
    it('bildet 0 Minuten auf 09:00 ab', () => {
      expect(clockLabel(0)).toBe('09:00');
    });

    it('rechnet Minuten korrekt (90 → 10:30)', () => {
      expect(clockLabel(90)).toBe('10:30');
      expect(clockLabel(330)).toBe('14:30');
    });

    it('klemmt das Label bei 18:00 (Tagesende)', () => {
      expect(clockLabel(540)).toBe('18:00');
      expect(clockLabel(9999)).toBe('18:00');
    });
  });

  describe('isAfterWarn', () => {
    it('ist vor 17:00 falsch', () => {
      expect(isAfterWarn(0)).toBe(false);
      expect(isAfterWarn(479)).toBe(false); // 16:59
    });

    it('ist ab 17:00 wahr', () => {
      expect(isAfterWarn(480)).toBe(true); // 17:00
      expect(isAfterWarn(540)).toBe(true); // 18:00
    });
  });

  describe('advance', () => {
    it('springt vor, ohne den Tag zu beenden', () => {
      useDayClockStore.getState().advance(TIME_COST.action);
      const s = useDayClockStore.getState();
      expect(s.minutes).toBe(90);
      expect(s.dayEnded).toBe(false);
    });

    it('klemmt bei 18:00 und setzt dayEnded', () => {
      useDayClockStore.getState().advance(600); // > 540
      const s = useDayClockStore.getState();
      expect(s.minutes).toBe(540);
      expect(s.dayEnded).toBe(true);
      expect(clockLabel(s.minutes)).toBe('18:00');
    });

    it('setzt dayEnded genau bei 18:00', () => {
      useDayClockStore.getState().advance(540);
      expect(useDayClockStore.getState().dayEnded).toBe(true);
    });

    it('ignoriert negative Werte', () => {
      useDayClockStore.getState().advance(120);
      useDayClockStore.getState().advance(-60);
      expect(useDayClockStore.getState().minutes).toBe(120);
    });
  });

  describe('resetDay', () => {
    it('setzt Uhr und Tagesende zurück auf den Morgen', () => {
      useDayClockStore.getState().advance(600);
      expect(useDayClockStore.getState().dayEnded).toBe(true);
      useDayClockStore.getState().resetDay();
      const s = useDayClockStore.getState();
      expect(s.minutes).toBe(0);
      expect(s.dayEnded).toBe(false);
    });
  });
});
