/**
 * Porträt-Normierung (P10, Fremdmodell-Durchgang 2026-08-22).
 *
 * Die Normierung existierte schon einmal — als Prompt-Satz in der Shot-Liste
 * („head is exactly 40 percent of the image height"). Ein Bildgenerator hält das
 * nicht ein, und niemand prüfte nach; die Kopfhöhen reichten am Ende von 19 % bis
 * 40 %, Faktor 2,1. Genau deshalb prüft es jetzt ein Test statt eines Wunsches.
 */
import { describe, it, expect } from 'vitest';
import {
  PLAYER_PORTRAITS,
  playerPortraitRahmen,
  playerPortraitImgStyle,
} from '../stores/playerProfileStore';

describe('Porträt-Rahmen', () => {
  it('kennt jedes wählbare Porträt', () => {
    for (const opt of PLAYER_PORTRAITS) {
      const r = playerPortraitRahmen(opt.id);
      expect(r.groesse, `${opt.id} hat keinen eigenen Rahmen`).toBeLessThanOrEqual(1);
      expect(r.groesse).toBeGreaterThan(0.2);
    }
  });

  it('hält jeden Ausschnitt innerhalb des Quellbildes', () => {
    for (const opt of PLAYER_PORTRAITS) {
      const { x, y, groesse } = playerPortraitRahmen(opt.id);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x + groesse, `${opt.id} läuft rechts aus dem Bild`).toBeLessThanOrEqual(1.001);
      expect(y + groesse, `${opt.id} läuft unten aus dem Bild`).toBeLessThanOrEqual(1.001);
    }
  });

  it('gibt unbekannten IDs das ganze Bild statt zu werfen', () => {
    expect(playerPortraitRahmen('gibtsnicht')).toEqual({ x: 0, y: 0, groesse: 1 });
  });

  it('rechnet den Ausschnitt korrekt in Bild-Styles um', () => {
    const s = playerPortraitImgStyle('m2');
    expect(s).toMatchObject({ width: '100%', height: '100%', marginLeft: '0%', marginTop: '0%' });
    // Die hochauflösenden Porträts werden verkleinert und deshalb bewusst
    // geglättet; `pixelated` erzeugte die beanstandeten groben Gesichter.
    expect(s.imageRendering).toBe('auto');
  });
});
