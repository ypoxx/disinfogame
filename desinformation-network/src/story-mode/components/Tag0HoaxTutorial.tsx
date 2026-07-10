/**
 * Tag-0-Hoax-Tutorial (Zielbild §10/§15, O7) — das Zwei-Balken-Onboarding.
 * ======================================================================
 * Der erste „Aha"-Beat VOR der Auftrags-Vergabe: Marina schiebt eine folgenlose
 * Probier-Zone vor (Toy before Game, Will Wright). Der Spieler wählt EINEN absurden
 * Hoax und spielt ihn aus — und sieht in Sekunden BEIDE Rennläufer einmal zucken:
 *
 *   • SONNTAGSFRAGE (dein Balken) hüpft ein Stück — „selbst völliger Unsinn verbreitet
 *     sich" (ein Milieu glaubt es). Die prozedurale Pointe des Spiels.
 *   • ABWEHR (der zweite Balken) bekommt seinen ERSTEN sichtbaren Tick — Dr. Lena Ferro
 *     deckt den Hoax auf. Das Immunsystem beginnt buchstäblich im Tutorial (§10).
 *
 * Folgenlos für die Spieler-Ressourcen (kein Budget/AP/Risiko, „kein Zug", IDEE §D) —
 * aber der Abwehr-Tick ist real und wird über `onComplete` in die Partie getragen, damit
 * Tag 1 zeigt: die Gegenseite hat dich einmal durchschaut. Reine Anzeige-Schicht mit
 * eigenen (lokalen) Balken; die Mechanik-Wirkung liegt allein im Abwehr-Tick des Adapters.
 *
 * Prop-getrieben, isoliert testbar; CSS-Fallback ohne Portrait-Asset.
 */
import { useEffect, useState } from 'react';
import { StoryModeColors } from '../theme';

/** Ein absurder Köder (IDEE §B — drei geführte Köder, geführte Freiheit). */
interface Hoax {
  id: string;
  koeder_de: string;
  /** Marinas kurzer Verkaufs-Nachsatz (Voice). */
  pitch_de: string;
  /** Wer im Wohnzimmer darauf anspringt (die Bildungs-Pointe: Unsinn verfängt). */
  glaube_de: string;
}

const HOAXES: Hoax[] = [
  {
    id: 'tauben',
    koeder_de: 'Die Stadttauben sind in Wahrheit Regierungsdrohnen.',
    pitch_de: 'Absurd? Sicher. Aber jeder hat schon mal eine Taube komisch angeschaut.',
    glaube_de: 'füttert keine Taube mehr und filmt jede, die zu nah kommt',
  },
  {
    id: 'trinkwasser',
    koeder_de: 'Im Trinkwasser ist ein Mittel, das die Leute fügsam macht.',
    pitch_de: 'Angst plus Alltag. Das trinkt jeder — im wahrsten Sinne.',
    glaube_de: 'kauft die Regale leer nach Flaschenwasser',
  },
  {
    id: 'bruecke',
    koeder_de: 'Die berühmte Brücke wurde nie gebaut — alles nur Kulisse.',
    pitch_de: 'Je größer das Bauwerk, desto größer der Zweifel. Vertrauen Sie mir.',
    glaube_de: 'teilt Fotos „von der anderen Seite" und findet überall Beweise',
  },
];

type Step = 'intro' | 'choose' | 'onair' | 'lesson' | 'bridge';

export interface Tag0HoaxTutorialProps {
  /** Marina-Portrait-URL (optional; CSS-Kachel als Fallback). */
  portraitUrl?: string;
  /** Abschluss → weiter zur Vergabe-Szene. `hoaxId` = gespielter Köder (Diegese/Telemetrie). */
  onComplete: (hoaxId: string) => void;
}

/** Ein Läufer-Balken en miniature (nur Anzeige — die echte Mechanik lebt im HUD). */
function MiniBar({
  label, pct, color, hint,
}: { label: string; pct: number; color: string; hint?: string }): React.JSX.Element {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
        <span style={{ color: StoryModeColors.textSecondary, fontWeight: 700, letterSpacing: 1 }}>{label}</span>
        {hint && <span style={{ color, fontWeight: 800 }}>{hint}</span>}
      </div>
      <div style={{ height: 12, background: StoryModeColors.border, border: `2px solid ${StoryModeColors.borderLight}` }}>
        <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`, background: color, transition: 'width 900ms ease-out' }} />
      </div>
    </div>
  );
}

/** Marina-Sprechzeile mit Porträt (CSS-Fallback). */
function MarinaSays({ portraitUrl, children }: { portraitUrl?: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', maxWidth: 560 }}>
      <div
        aria-hidden
        style={{
          width: 52, height: 52, flexShrink: 0, imageRendering: 'pixelated',
          border: `2px solid ${StoryModeColors.borderLight}`,
          background: portraitUrl ? `center/cover no-repeat url(${portraitUrl})` : StoryModeColors.agencyBlue,
        }}
      />
      <div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: StoryModeColors.warning, textTransform: 'uppercase', marginBottom: 2 }}>
          Marina Petrova · Medien
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: StoryModeColors.textPrimary }}>{children}</div>
      </div>
    </div>
  );
}

function PixelButton({ onClick, children, primary }: { onClick: () => void; children: React.ReactNode; primary?: boolean }): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 22px', cursor: 'pointer', fontFamily: "'VT323', monospace",
        background: primary ? StoryModeColors.ministryRed : StoryModeColors.surfaceLight,
        border: `3px solid ${primary ? StoryModeColors.darkRed : StoryModeColors.border}`,
        color: primary ? '#fff' : StoryModeColors.textPrimary,
        fontWeight: 900, letterSpacing: 1.5, fontSize: 14,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 0 rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </button>
  );
}

export function Tag0HoaxTutorial({ portraitUrl, onComplete }: Tag0HoaxTutorialProps): React.JSX.Element {
  const [step, setStep] = useState<Step>('intro');
  const [picked, setPicked] = useState<Hoax | null>(null);
  // Lokale Balken-Werte (nur Anzeige). Start: Partei niedrig, Abwehr bei Null.
  const [sonntag, setSonntag] = useState(9);
  const [abwehr, setAbwehr] = useState(0);

  // Beim Eintritt in „onair" die beiden Balken einmal zucken lassen (en miniature).
  useEffect(() => {
    if (step !== 'onair') return;
    const t1 = window.setTimeout(() => setSonntag(13), 350);      // Unsinn verfängt → +4
    const t2 = window.setTimeout(() => setAbwehr(6), 1400);       // Ferro deckt auf → erster Tick
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [step]);

  const twoBars = (
    <div style={{
      width: 320, maxWidth: '90vw', display: 'flex', flexDirection: 'column', gap: 12,
      padding: 14, background: StoryModeColors.surface, border: `2px solid ${StoryModeColors.border}`,
    }}>
      <MiniBar label="SONNTAGSFRAGE (Sie)" pct={sonntag} color={StoryModeColors.ministryRed} hint={`${Math.round(sonntag)} %`} />
      <MiniBar label="ABWEHR (die Gegenseite)" pct={abwehr} color={StoryModeColors.danger} hint={`${Math.round(abwehr)}`} />
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tag 0 — die Probier-Zone"
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: 24, background: 'rgba(8,8,10,0.95)', fontFamily: "'VT323', monospace",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 3, color: StoryModeColors.textMuted, textTransform: 'uppercase' }}>
        Tag 0 · Probelauf · noch zählt nichts
      </div>

      {step === 'intro' && (
        <>
          <MarinaSays portraitUrl={portraitUrl}>
            „Bevor wir's ernst meinen: Spielen Sie irgendwas aus. Egal was — schauen Sie einfach, was passiert.
            Kostet nichts, zählt nicht. Reichweite schlägt Wahrheit, aber das glauben Sie mir erst, wenn Sie es sehen."
          </MarinaSays>
          <PixelButton primary onClick={() => setStep('choose')}>ZEIG MIR DAS ▸</PixelButton>
        </>
      )}

      {step === 'choose' && (
        <>
          <MarinaSays portraitUrl={portraitUrl}>„Suchen Sie sich eine Absurdität aus. Je alberner, desto lehrreicher."</MarinaSays>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 520, maxWidth: '92vw' }}>
            {HOAXES.map((h) => (
              <button
                key={h.id}
                onClick={() => { setPicked(h); setStep('onair'); }}
                style={{
                  textAlign: 'left', cursor: 'pointer', padding: '12px 14px', fontFamily: "'VT323', monospace",
                  background: StoryModeColors.oldPaper, color: '#241d15',
                  border: `3px solid ${StoryModeColors.border}`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 0 rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 900 }}>„{h.koeder_de}"</div>
                <div style={{ fontSize: 11, color: '#5a4a35', marginTop: 3 }}>{h.pitch_de}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'onair' && picked && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 900, letterSpacing: 2,
            color: '#fff', background: StoryModeColors.ministryRed, padding: '4px 12px', border: `2px solid ${StoryModeColors.darkRed}`,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> ON AIR — „{picked.koeder_de}"
          </div>
          {twoBars}
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: StoryModeColors.success }}>
              ▸ <b>Die Abgehängten</b> springen an: {picked.glaube_de}.
            </div>
            <div style={{ fontSize: 13, color: StoryModeColors.danger }}>
              ▸ <b>Dr. Lena Ferro (Faktencheck)</b>: „Frei erfunden. Es gibt keine Quelle — es gibt nur die Erzählung."
            </div>
          </div>
          <PixelButton onClick={() => setStep('lesson')}>WEITER ▸</PixelButton>
        </>
      )}

      {step === 'lesson' && (
        <>
          {twoBars}
          <MarinaSays portraitUrl={portraitUrl}>
            „Sehen Sie? Es muss nicht stimmen. Es muss nur ankommen. — Und sehen Sie den <b>zweiten Balken</b>?
            Der wächst, wenn man Sie durchschaut. Ferro hat gerade angefangen, gegen Sie zu arbeiten.
            Das ist von jetzt an das Rennen: Ihr Balken gegen ihren."
          </MarinaSays>
          <PixelButton primary onClick={() => setStep('bridge')}>VERSTANDEN ▸</PixelButton>
        </>
      )}

      {step === 'bridge' && (
        <>
          <MarinaSays portraitUrl={portraitUrl}>
            „Süß, oder? Das war der Spaß. — Jetzt mit Absicht. Der Kurator wartet mit einer Akte."
          </MarinaSays>
          <PixelButton primary onClick={() => onComplete(picked?.id ?? 'tauben')}>AN DIE ARBEIT ▸</PixelButton>
        </>
      )}
    </div>
  );
}

export default Tag0HoaxTutorial;
