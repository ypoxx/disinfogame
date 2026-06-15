/**
 * AuftragSelect (P5) — Auftrags-Wahl beim Einstieg/Neustart (Plague-Inc.-Stil).
 * „Vertrauen = Mittel, Auftrag = Ziel": der Spieler wählt seine Strategie. Prop-getrieben,
 * keine Hook-Zugriffe → isoliert testbar.
 */
import { StoryModeColors } from '../theme';
import { AUFTRAEGE, type AuftragId } from '../engine/Auftraege';

export interface AuftragSelectProps {
  onChoose: (id: AuftragId) => void;
  /** „Später"/Default-Auftrag (Keil) ohne Auswahl übernehmen. */
  onSkip?: () => void;
}

export function AuftragSelect({ onChoose, onSkip }: AuftragSelectProps): React.JSX.Element {
  const auftraege = Object.values(AUFTRAEGE);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Auftrag wählen"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 18, padding: 24, background: 'rgba(8,8,10,0.92)', fontFamily: 'monospace',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 3, color: StoryModeColors.warning }}>
          IHR AUFTRAG
        </div>
        <div style={{ fontSize: 12, color: StoryModeColors.textSecondary, marginTop: 6, maxWidth: 560 }}>
          Vertrauenserosion ist das Mittel — das Ziel wählen Sie. Jeder Auftrag hat eine eigene
          Signatur und ein eigenes Ende.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 980 }}>
        {auftraege.map((a) => (
          <button
            key={a.id}
            onClick={() => onChoose(a.id)}
            style={{
              width: 280, textAlign: 'left', cursor: 'pointer',
              background: StoryModeColors.surfaceLight,
              border: `3px solid ${StoryModeColors.border}`,
              padding: '14px 16px', color: StoryModeColors.textPrimary,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -2px 0 rgba(0,0,0,0.4)',
              transition: 'border-color 150ms, filter 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = StoryModeColors.ministryRed; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = StoryModeColors.border; }}
          >
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: 1, color: StoryModeColors.ministryRed }}>
              {a.titel_de}
              {a.istDefault && (
                <span style={{ fontSize: 9, color: StoryModeColors.textMuted, marginLeft: 6 }}>· EINSTIEG</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: StoryModeColors.warning, margin: '4px 0 8px' }}>{a.kurz_de}</div>
            <div style={{ fontSize: 11, lineHeight: 1.5, color: StoryModeColors.textSecondary }}>{a.beschreibung_de}</div>
            <div style={{ fontSize: 10, color: StoryModeColors.textMuted, marginTop: 10 }}>
              Barometer: {a.instrument_de}
            </div>
          </button>
        ))}
      </div>

      {onSkip && (
        <button
          onClick={onSkip}
          style={{
            marginTop: 4, background: 'none', border: 'none', cursor: 'pointer',
            color: StoryModeColors.textMuted, fontSize: 11, textDecoration: 'underline dotted',
          }}
        >
          Mit dem Einstiegs-Auftrag „Der Keil" beginnen
        </button>
      )}
    </div>
  );
}

export default AuftragSelect;
