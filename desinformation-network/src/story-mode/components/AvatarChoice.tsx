/**
 * AvatarChoice — einfache Spieler-Wahl im Einstieg (K10/D27).
 *
 * Sechs Porträts (m/w × jung/mittel/erfahren) + Namensfeld. Bewusst niedrig-
 * schwellig: aussuchen, benennen, los. Erscheint nach „Neue Mission",
 * vor der Ankunfts-Sequenz.
 */
import { useState } from 'react';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { Icon } from './Icon';
import { PLAYER_PORTRAITS, playerPortraitAssetId, usePlayerProfile } from '../stores/playerProfileStore';
import { PixelModal } from './PixelModal';

export interface AvatarChoiceProps {
  onConfirm: () => void;
}

export function AvatarChoice({ onConfirm }: AvatarChoiceProps): React.JSX.Element {
  const assets = useAssets();
  const setProfile = usePlayerProfile((s) => s.setProfile);
  const [portraitId, setPortraitId] = useState<string>(usePlayerProfile.getState().portraitId);
  // T2/#10: Neue Spieler starten mit LEEREM Feld (Platzhalter lädt zur Eingabe ein),
  // statt mit „Direktor" vorbelegt (Rollenkollision mit Direktor Volkov). Rückkehrer
  // sehen ihren gewählten Namen.
  const [name, setName] = useState<string>(() => {
    const p = usePlayerProfile.getState();
    return p.chosen ? p.name : '';
  });

  const confirm = (): void => {
    setProfile(name, portraitId);
    onConfirm();
  };

  return (
    <PixelModal
      open
      variant="alarm"
      maxWidthClass="max-w-lg"
      backdrop={0.97}
      style={{ background: 'linear-gradient(180deg, #05070d 0%, #11131c 100%)' }}
    >
      {/* Eigener farbiger Kopf */}
      <div
        className="px-6 py-3 border-b-4 text-center font-bold tracking-wider"
        style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.border, color: StoryModeColors.warning }}
      >
        IHRE PERSONALAKTE
      </div>

      <div className="p-6">
        <p className="text-sm text-center mb-4" style={{ color: StoryModeColors.textSecondary }}>
          Wählen Sie Ihr Dienstporträt und tragen Sie Ihren Namen ein.
        </p>

        {/* Porträt-Raster */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {PLAYER_PORTRAITS.map((opt) => {
            const url = assets.imageUrl(playerPortraitAssetId(opt.id));
            const selected = portraitId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPortraitId(opt.id)}
                aria-pressed={selected}
                aria-label={`Porträt ${opt.label} (${opt.id.startsWith('f') ? 'weiblich' : 'männlich'})`}
                className="relative border-2 transition-all"
                style={{
                  borderColor: selected ? StoryModeColors.warning : StoryModeColors.borderLight,
                  backgroundColor: StoryModeColors.background,
                  aspectRatio: '1 / 1',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                {url ? (
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                ) : (
                  <Icon name="npcs" size={32} />
                )}
                <span
                  className="absolute bottom-0 inset-x-0 text-[10px] py-0.5 text-center"
                  style={{ backgroundColor: 'rgba(10,10,14,0.78)', color: selected ? StoryModeColors.warning : '#c8c8b8' }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Namensfeld */}
        <label className="block text-xs mb-1" style={{ color: StoryModeColors.textSecondary }}>
          NAME
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }}
          maxLength={24}
          className="w-full px-3 py-2 mb-5 border-2 font-mono"
          style={{ backgroundColor: StoryModeColors.background, borderColor: StoryModeColors.borderLight, color: StoryModeColors.textPrimary }}
          placeholder="Ihr Deckname"
          aria-label="Ihr Name"
        />

        <button
          onClick={confirm}
          className="w-full py-3 border-4 font-bold text-lg transition-all hover:brightness-110 active:translate-y-0.5"
          style={{
            backgroundColor: StoryModeColors.ministryRed,
            borderColor: StoryModeColors.darkRed,
            color: '#fff',
          }}
        >
          MISSION BEGINNEN ▸
        </button>
      </div>
    </PixelModal>
  );
}

export default AvatarChoice;
