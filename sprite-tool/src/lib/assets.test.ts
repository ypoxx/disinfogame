import { describe, it, expect } from 'vitest';
import {
  buildManifest,
  validateForExport,
  filePathFor,
  folderForType,
  extForAsset,
  defaultIdFromPrompt,
  createLibraryAsset,
  type LibraryAsset,
} from '@/lib/assets';

function asset(partial: Partial<LibraryAsset> = {}): LibraryAsset {
  return createLibraryAsset({
    id: 'x',
    type: 'image',
    dataBase64: '',
    mime: 'image/png',
    chosen: true,
    ...partial,
  });
}

describe('folderForType / extForAsset / filePathFor', () => {
  it('mappt Typ → Ordner', () => {
    expect(folderForType('image')).toBe('images');
    expect(folderForType('sheet')).toBe('sheets');
    expect(folderForType('sfx')).toBe('sounds');
    expect(folderForType('voice')).toBe('sounds');
    expect(folderForType('music')).toBe('sounds');
  });

  it('leitet Endung aus MIME ab, sonst aus Typ', () => {
    expect(extForAsset({ mime: 'image/png', type: 'image' })).toBe('png');
    expect(extForAsset({ mime: 'audio/mpeg', type: 'voice' })).toBe('mp3');
    expect(extForAsset({ mime: 'image/webp', type: 'image' })).toBe('webp');
    expect(extForAsset({ mime: 'unknown/x', type: 'sheet' })).toBe('png'); // Fallback Bild
    expect(extForAsset({ mime: 'unknown/x', type: 'music' })).toBe('mp3'); // Fallback Audio
  });

  it('baut den relativen Pfad <ordner>/<id>.<ext>', () => {
    expect(filePathFor(asset({ id: 'room_bg', type: 'image', mime: 'image/png' }))).toBe('images/room_bg.png');
    expect(filePathFor(asset({ id: 'door', type: 'sfx', mime: 'audio/mpeg' }))).toBe('sounds/door.mp3');
  });
});

describe('defaultIdFromPrompt', () => {
  it('slugifiziert und kürzt auf 5 Wörter', () => {
    expect(defaultIdFromPrompt('Old Rotary Phone Ringing In Office Loudly')).toBe('old_rotary_phone_ringing_in');
  });
  it('entfernt Sonderzeichen und Ränder', () => {
    expect(defaultIdFromPrompt('  Hallo, Welt!  ')).toBe('hallo_welt');
  });
  it('nutzt den Fallback bei leerem Ergebnis', () => {
    expect(defaultIdFromPrompt('!!!', 'sfx')).toBe('sfx');
  });
});

describe('buildManifest', () => {
  it('nimmt nur gewählte Assets und setzt file/provider/prompt/seed', () => {
    const m = buildManifest([
      asset({ id: 'a', chosen: true, provider: 'gemini', prompt: 'p', seed: 7 }),
      asset({ id: 'b', chosen: false }),
    ]);
    expect(m.assets).toHaveLength(1);
    expect(m.assets[0]).toMatchObject({ id: 'a', type: 'image', file: 'images/a.png', provider: 'gemini', prompt: 'p', seed: 7, chosen: true });
  });

  it('wandelt Sheet-Animationen in ein Record und übernimmt Regionen', () => {
    const m = buildManifest([
      asset({
        id: 'walk',
        type: 'sheet',
        frameWidth: 32,
        frameHeight: 32,
        animations: [{ name: 'walkRight', row: 0, frames: 8, frameTime: 90, loop: true }],
      }),
      asset({
        id: 'room',
        type: 'image',
        regions: [{ id: 'tv', x: 1, y: 2, w: 3, h: 4 }],
      }),
    ]);
    const walk = m.assets.find((a) => a.id === 'walk')!;
    expect(walk.frameWidth).toBe(32);
    expect(walk.animations).toEqual({ walkRight: { row: 0, frames: 8, frameTime: 90, loop: true } });
    const room = m.assets.find((a) => a.id === 'room')!;
    expect(room.regions).toEqual([{ id: 'tv', x: 1, y: 2, w: 3, h: 4 }]);
  });
});

describe('validateForExport', () => {
  it('meckert bei leerer Auswahl', () => {
    expect(validateForExport([asset({ chosen: false })])).toContain('Keine Assets als „fürs Spiel" markiert.');
  });
  it('erkennt ungültige id-Zeichen', () => {
    const errs = validateForExport([asset({ id: 'Bad Id' })]);
    expect(errs.some((e) => e.includes('ungültige Zeichen'))).toBe(true);
  });
  it('verlangt Frame-Maße für Sheets', () => {
    const errs = validateForExport([asset({ id: 'sheet1', type: 'sheet' })]);
    expect(errs.some((e) => e.includes('Frame-Maße'))).toBe(true);
  });
  it('verbietet doppelte id im selben Typ, erlaubt sie über Typen hinweg', () => {
    const dup = validateForExport([asset({ id: 'door', type: 'sfx' }), asset({ id: 'door', type: 'sfx' })]);
    expect(dup.some((e) => e.includes('2×'))).toBe(true);

    const crossType = validateForExport([asset({ id: 'door', type: 'sfx' }), asset({ id: 'door', type: 'image' })]);
    expect(crossType).toEqual([]);
  });
});
