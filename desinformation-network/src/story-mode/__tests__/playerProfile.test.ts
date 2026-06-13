/**
 * Tests für den Spieler-Profil-Store (K10): Default, Setzen, Asset-id, Trim/Clamp.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerProfile, playerPortraitAssetId, PLAYER_PORTRAITS } from '../stores/playerProfileStore';

describe('playerProfileStore', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* jsdom */ }
    usePlayerProfile.setState({ name: 'Direktor', portraitId: 'm2', chosen: false });
  });

  it('bietet 6 Porträt-Optionen', () => {
    expect(PLAYER_PORTRAITS).toHaveLength(6);
    expect(PLAYER_PORTRAITS.map((p) => p.id)).toEqual(['m1', 'm2', 'm3', 'f1', 'f2', 'f3']);
  });

  it('Default ist Direktor / m2 / nicht gewählt', () => {
    const s = usePlayerProfile.getState();
    expect(s.name).toBe('Direktor');
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

  it('leerer Name fällt auf Direktor zurück, lange Namen werden gekürzt', () => {
    usePlayerProfile.getState().setProfile('   ', 'm1');
    expect(usePlayerProfile.getState().name).toBe('Direktor');
    usePlayerProfile.getState().setProfile('X'.repeat(40), 'm1');
    expect(usePlayerProfile.getState().name.length).toBe(24);
  });

  it('playerPortraitAssetId bildet die Asset-Konvention ab', () => {
    expect(playerPortraitAssetId('f3')).toBe('portrait_player_f3');
  });
});
