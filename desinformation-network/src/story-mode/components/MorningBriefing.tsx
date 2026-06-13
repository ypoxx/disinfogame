import { useEffect } from 'react';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';

// ============================================
// MORGENBRIEFING (K1) — kurzer Direktor-Moment am Tagesbeginn
// ============================================
// Schlankes Overlay unten (wie DialogBox-Position, aber kompakter): Direktor-
// Porträt mit Mimik je Laune + 1–2 Sätze Tagesziel/Laune. Texte regelbasiert
// aus 3 Lagen (gut/mittel/kritisch) mit je 3 Varianten, DETERMINISTISCH per
// phase gewählt — kein Math.random im Render. KEIN voiceAssetId (dynamisch).

interface MorningBriefingProps {
  phase: number;
  risk: number;
  trustProgress: number;
  onDone: () => void;
}

type Laune = 'gut' | 'mittel' | 'kritisch';
type Mood = 'happy' | 'neutral' | 'worried';

interface BriefingText {
  text: string;
}

// Drei Lagen mit je drei Varianten. Auswahl deterministisch über phase.
const BRIEFINGS: Record<Laune, BriefingText[]> = {
  gut: [
    { text: 'Die Lage spielt uns in die Hände. Heute treiben wir das Land weiter, bevor es Atem schöpft.' },
    { text: 'Vortrefflich. Die Institutionen schlafen — nutzen Sie den Tag, solange der Wind günstig steht.' },
    { text: 'Unsere Saat geht auf. Bleiben Sie unauffällig, dann gehört uns die Deutungshoheit.' },
  ],
  mittel: [
    { text: 'Solide, aber unentschieden. Heute zählt jeder Zug — vergeuden Sie keine Stunde.' },
    { text: 'Die Gegenseite regt sich. Setzen Sie Schwerpunkte und meiden Sie unnötiges Risiko.' },
    { text: 'Noch ist alles offen. Liefern Sie Ergebnisse, bevor man auf uns aufmerksam wird.' },
  ],
  kritisch: [
    { text: 'Das Risiko brennt. Ein Fehler heute und wir fliegen auf — arbeiten Sie sauber.' },
    { text: 'Die Verteidiger holen auf. Wir verlieren Boden; heute muss die Wende kommen.' },
    { text: 'Mir gefällt das nicht. Halten Sie sich bedeckt und reduzieren Sie die Spuren.' },
  ],
};

const MOOD_BY_LAUNE: Record<Laune, Mood> = {
  gut: 'happy',
  mittel: 'neutral',
  kritisch: 'worried',
};

const LAUNE_LABEL: Record<Laune, string> = {
  gut: 'gelöst',
  mittel: 'nüchtern',
  kritisch: 'angespannt',
};

/** Lage regelbasiert aus risk + Vertrauens-Fortschritt ableiten. */
function deriveLaune(risk: number, trustProgress: number): Laune {
  // Hohes Risiko ODER zurückliegender Vertrauens-Stand = kritisch.
  if (risk >= 65 || trustProgress < 30) return 'kritisch';
  // Niedriges Risiko UND klarer Vorsprung = gut.
  if (risk < 40 && trustProgress >= 60) return 'gut';
  return 'mittel';
}

export function MorningBriefing({ phase, risk, trustProgress, onDone }: MorningBriefingProps) {
  const assets = useAssets();
  const laune = deriveLaune(risk, trustProgress);
  const mood = MOOD_BY_LAUNE[laune];

  // Deterministische Variantenwahl: gleiche Phase → gleicher Text.
  const variants = BRIEFINGS[laune];
  const variant = variants[Math.abs(phase) % variants.length];

  // Porträt: mood-spezifisch, sonst Basis-Porträt; null → CSS-Fallback unten.
  const portraitUrl =
    assets.imageUrl(`portrait_direktor_${mood}`) ?? assets.imageUrl('portrait_direktor');

  // Weiter per Klick/Leertaste/Enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up cursor-pointer"
      style={{
        background: `linear-gradient(to top, ${StoryModeColors.background}f0, transparent)`,
        paddingTop: '40px',
      }}
      onClick={onDone}
      role="button"
      aria-label="Morgenbriefing weiter"
    >
      <div
        className="mx-4 mb-4 border-4 flex items-stretch"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        {/* Porträt links */}
        <div
          className="flex items-center justify-center p-3 border-r-4"
          style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.border }}
        >
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt="Direktor"
              width={64}
              height={64}
              style={{
                width: 64,
                height: 64,
                objectFit: 'cover',
                border: '3px solid',
                borderColor: StoryModeColors.darkRed,
                backgroundColor: '#1a1a1a',
                imageRendering: 'pixelated',
              }}
            />
          ) : (
            <span className="text-4xl">🧑‍💼</span>
          )}
        </div>

        {/* Text rechts */}
        <div className="flex-1 p-4">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: StoryModeColors.warning }}
            >
              MORGENBRIEFING — TAG {phase}
            </span>
            <span className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Laune: {LAUNE_LABEL[laune]}
            </span>
          </div>
          <p
            className="font-mono text-base leading-relaxed"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {variant.text}
          </p>
          <div className="mt-3 text-right">
            <span
              className="inline-block px-4 py-1.5 border-2 font-bold text-sm"
              style={{
                backgroundColor: StoryModeColors.surfaceLight,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textPrimary,
                boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              Verstanden ▸
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MorningBriefing;
