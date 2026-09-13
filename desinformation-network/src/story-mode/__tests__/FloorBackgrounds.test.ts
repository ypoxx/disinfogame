import { describe, expect, it } from 'vitest';
import { FLOOR_BACKGROUND_BY_LEVEL, floorBackgroundAssetId } from '../building/BuildingStage';

describe('maßgeschneiderte Etagenpanoramen', () => {
  it('ordnet jeder spielbaren Etage genau eine eigene Kulisse zu', () => {
    expect(FLOOR_BACKGROUND_BY_LEVEL).toEqual({
      4: 'bld_floor_special_ops',
      3: 'bld_floor_analysis_media',
      2: 'bld_floor_field_ops',
      1: 'bld_floor_headquarters',
      0: 'bld_floor_lobby',
      [-1]: 'bld_floor_basement',
    });
    expect([4, 3, 2, 1, 0, -1].map(floorBackgroundAssetId)).not.toContain(null);
    expect(floorBackgroundAssetId(99)).toBeNull();
  });
});
