/**
 * Tests für den Spieler-Profil-Store (K10): Default, Setzen, Asset-id, Trim/Clamp.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import manifest from '../../../public/assets/assets.json';
import {
  usePlayerProfile,
  playerPortraitAssetId,
  playerWalkSheetId,
  playerIdleSheetId,
  playerWalkAnimationId,
  playerIdleAnimationId,
  normalizedPlayerPortraitId,
  isFemaleProfile,
  PLAYER_PORTRAITS,
} from '../stores/playerProfileStore';

describe('playerProfileStore', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* jsdom */ }
    usePlayerProfile.setState({ name: 'Agent', portraitId: 'm2', chosen: false });
  });

  it('bietet 6 Porträt-Optionen', () => {
    expect(PLAYER_PORTRAITS).toHaveLength(6);
    expect(PLAYER_PORTRAITS.map((p) => p.id)).toEqual(['m1', 'm2', 'm3', 'f1', 'f2', 'f3']);
  });

  it('Default ist Agent / m2 / nicht gewählt', () => {
    const s = usePlayerProfile.getState();
    expect(s.name).toBe('Agent');
    expect(s.portraitId).toBe('m2');
    expect(s.chosen).toBe(false);
  });

  it('setProfile speichert Name + Porträt und markiert als gewählt', () => {
    usePlayerProfile.getState().setProfile('Marina', 'f1');
    const s = usePlayerProfile.getState();
    expect(s.name).toBe('Marina');
    expect(s.portraitId).toBe('f1');
    expect(s.chosen).toBe(true);
  });

  it('leerer Name fällt auf Agent zurück, lange Namen werden gekürzt', () => {
    usePlayerProfile.getState().setProfile('   ', 'm1');
    expect(usePlayerProfile.getState().name).toBe('Agent');
    usePlayerProfile.getState().setProfile('X'.repeat(40), 'm1');
    expect(usePlayerProfile.getState().name.length).toBe(24);
  });

  it('playerPortraitAssetId bildet die Asset-Konvention ab', () => {
    expect(playerPortraitAssetId('f3')).toBe('portrait_player_f3');
    expect(playerPortraitAssetId('kaputte-alt-id')).toBe('portrait_player_m2');
  });

  it('jede Auswahl behält eine eigene Atlas-Zeile bis in die Spielfigur', () => {
    expect(isFemaleProfile('m2')).toBe(false);
    expect(isFemaleProfile('f1')).toBe(true);
    expect(playerWalkSheetId('m2')).toBe('player_profiles_walk');
    expect(playerIdleSheetId('f1')).toBe('player_profiles_idle');
    for (const opt of PLAYER_PORTRAITS) {
      expect(playerWalkAnimationId(opt.id)).toBe(`walk_${opt.id}`);
      expect(playerIdleAnimationId(opt.id)).toBe(`idle_${opt.id}`);
    }
    expect(normalizedPlayerPortraitId('altwert')).toBe('m2');
    expect(playerWalkAnimationId('altwert')).toBe('walk_m2');
    usePlayerProfile.getState().setProfile('Altbestand', 'altwert');
    expect(usePlayerProfile.getState().portraitId).toBe('m2');
  });

  it('Manifest hält beide Profil-Atlanten bei 96 px und in derselben Zeilenfolge', () => {
    const walk = manifest.assets.find((asset) => asset.id === 'player_profiles_walk');
    const idle = manifest.assets.find((asset) => asset.id === 'player_profiles_idle');
    expect(walk).toMatchObject({ frameWidth: 96, frameHeight: 96, chosen: true });
    expect(idle).toMatchObject({ frameWidth: 96, frameHeight: 96, chosen: true });
    const walkAnimations = walk?.animations as Record<string, { row?: number }> | undefined;
    const idleAnimations = idle?.animations as Record<string, { row?: number }> | undefined;
    for (const [row, profile] of PLAYER_PORTRAITS.entries()) {
      expect(walkAnimations?.[`walk_${profile.id}`]?.row).toBe(row);
      expect(idleAnimations?.[`idle_${profile.id}`]?.row).toBe(row);
    }
  });
});
