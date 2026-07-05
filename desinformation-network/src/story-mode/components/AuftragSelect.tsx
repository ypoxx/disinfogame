/**
 * AuftragSelect → Vergabe-Szene (Etappe 5, Zielbild §8): kein Auswahlmenü mehr.
 * Tag 0 schiebt der Kurator EINE Akte über den Tisch — „Die Wahl". Parteilogo,
 * Startwert, Zielstrich, Wahldatum, Stempel. Ein „Übernehmen" beginnt die Operation.
 *
 * keil/zweifel bleiben als Daten erhalten (Akt-Dramaturgie / Wiederspiel-Kampagnen),
 * aber die Auswahl-UI entfällt (Zielbild §8/§12.3). Prop-getrieben, isoliert testbar.
 */
import { StoryModeColors } from '../theme';
import { AUFTRAEGE, PARTEI_NAME_DE, type AuftragId } from '../engine/Auftraege';

export interface AuftragSelectProps {
  /** Übernimmt den EINEN Auftrag „Die Wahl" und startet die Operation. */
  onChoose: (id: AuftragId) => void;
  /** DEPRECATED (Etappe 5): keine Auswahl mehr — bleibt optional für Rückwärts-Kompatibilität. */
  onSkip?: () => void;
}

export function AuftragSelect({ onChoose }: AuftragSelectProps): React.JSX.Element {
  const wahl = AUFTRAEGE.wahl;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Auftrag der Zentrale"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 18, padding: 24, background: 'rgba(8,8,10,0.94)', fontFamily: "'VT323', monospace",
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: StoryModeColors.textMuted, textTransform: 'uppercase' }}>
          Kurator Volkov schiebt eine Akte über den Tisch
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: StoryModeColors.textSecondary, marginTop: 6 }}>
          „Das Vertrauen der Leute zu zersetzen, ist nur das Mittel. Das{' '}
          <span style={{ color: StoryModeColors.warning }}>Ziel</span> steht in der Akte. Daran misst die Zentrale Sie."
        </div>
      </div>

      {/* Die Akte — ein physisches Objekt (STRENG GEHEIM), kein Menü. */}
      <div
        style={{
          width: 360, maxWidth: '92vw', textAlign: 'left',
          background: StoryModeColors.oldPaper, color: '#241d15',
          border: `3px solid ${StoryModeColors.border}`, padding: '16px 18px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 0 rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: StoryModeColors.ministryRed, fontWeight: 900 }}>STRENG GEHEIM</span>
          <span style={{ fontSize: 9, letterSpacing: 1, color: '#6b5b45' }}>AKTE · DIE WAHL</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 1, color: '#241d15', marginTop: 8 }}>
          {wahl.titel_de}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: '#3a2f22', margin: '6px 0 12px' }}>
          {wahl.beschreibung_de}
        </div>

        {/* Sonntagsfrage: Startwert → Ziel, mit Zielstrich (Zielbild §3, illustrativ 9→27 %). */}
        <div style={{ fontSize: 11, color: '#4a3d2c', fontWeight: 900, marginBottom: 4 }}>{PARTEI_NAME_DE}</div>
        <div style={{ position: 'relative', height: 16, background: '#d8c9a8', border: '2px solid #7a6a4a' }}>
          <div style={{ height: '100%', width: '18%', background: StoryModeColors.ministryRed }} />
          <div style={{ position: 'absolute', top: -3, bottom: -3, left: '70%', width: 2, background: '#241d15' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#5a4a35', marginTop: 3 }}>
          <span>Start 9 %</span>
          <span>Ziel: über die Schwelle · Wahltag Tag 40</span>
        </div>

        <div style={{ fontSize: 10, color: '#6b5b45', marginTop: 10 }}>
          Barometer: {wahl.instrument_de}
        </div>
      </div>

      <button
        onClick={() => onChoose('wahl')}
        style={{
          marginTop: 4, padding: '11px 26px', cursor: 'pointer',
          background: StoryModeColors.ministryRed, border: `3px solid ${StoryModeColors.darkRed}`,
          color: '#fff', fontWeight: 900, letterSpacing: 2, fontSize: 15,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.4)',
        }}
      >
        AKTE ÜBERNEHMEN ▸
      </button>
    </div>
  );
}

export default AuftragSelect;
