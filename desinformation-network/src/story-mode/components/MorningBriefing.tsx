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
//
// P0b/B5/D-4: Dazu ein KONKRETER Tageshinweis — er benennt das drängendste Problem
// mit echter Zahl und verweist DIEGETISCH auf das zuständige Büro (kein klickbarer
// Shortcut; der Spieler geht selbst hin). Owner-Abnahme: warnen + sagen, wo man die
// Empfehlung holt.

interface MorningBriefingProps {
  phase: number;
  risk: number;
  trustProgress: number;   // 0..1 — Fortschritt Richtung Destabilisierungs-Ziel
  budget: number;          // verbleibendes Budget in Tausend Euro
  attention: number;       // 0..100 — Aufmerksamkeit der Gegenseite
  /** T2/#7: Titel des aktiven Auftrags — für die gerichtete Tag-1-Eröffnung. */
  auftragTitel?: string;
  /** Spine Slice 2: Vorgriffszeile des vom Director gekürten Beats (Marina). */
  beatHook?: string;
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
  // trustProgress ist 0..1 (NICHT 0..100) — Schwellen entsprechend (zuvor verglich
  // `< 30`/`>= 60` gegen einen 0..1-Wert → Laune war praktisch immer „kritisch").
  // Hohes Risiko ODER zurückliegender Vertrauens-Stand = kritisch.
  if (risk >= 65 || trustProgress < 0.3) return 'kritisch';
  // Niedriges Risiko UND klarer Vorsprung = gut.
  if (risk < 40 && trustProgress >= 0.6) return 'gut';
  return 'mittel';
}

export interface BriefingHint {
  /** Konkret benanntes Problem inkl. echter Zahl (B5: nicht mehr vage). */
  problem: string;
  /** Wohin der Spieler für die Empfehlung geht — diegetisch, nicht klickbar (D-4). */
  pointer: string;
}

export interface BriefingState {
  risk: number;          // 0..100
  attention: number;     // 0..100
  budget: number;        // Tausend Euro
  trustProgress: number; // 0..1
}

/**
 * Den drängendsten Tageshinweis deterministisch ableiten.
 * Priorität nach Dringlichkeit: drohende Enttarnung (Verlust) > leere Kasse
 * (handlungsunfähig) > erwachende Gegenseite > stockender Fortschritt > gute Lage.
 * Verweist je Lage auf das ZUSTÄNDIGE Büro (Büro-Labels aus building.json).
 */
export function deriveBriefingHint(s: BriefingState): BriefingHint {
  const trustPct = Math.round(Math.max(0, Math.min(1, s.trustProgress)) * 100);
  if (s.risk >= 60) {
    return {
      problem: `Das Entdeckungsrisiko steht bei ${Math.round(s.risk)} % — noch ein unsauberer Zug und die Ermittler haben uns.`,
      pointer: 'Gehen Sie zu Alexei ins Cyber-Lab; er soll unsere Spuren verwischen, bevor wir auffliegen.',
    };
  }
  if (s.budget <= 15) {
    return {
      problem: `Die Kasse ist fast leer — nur noch ${Math.round(s.budget)} k stehen bereit.`,
      pointer: 'Sprechen Sie mit Igor in Finanzen / Tresor, ehe Sie die nächste Operation bezahlen.',
    };
  }
  if (s.attention >= 55) {
    return {
      problem: `Die Gegenseite wird wach — ihre Aufmerksamkeit liegt bei ${Math.round(s.attention)} %.`,
      pointer: 'Lassen Sie sich von Katja in den Feld-Operationen sagen, wer da gegen uns ermittelt.',
    };
  }
  if (s.trustProgress < 0.4) {
    return {
      problem: `Beim Vertrauensbruch kommen wir kaum voran — erst ${trustPct} % des Ziels.`,
      // P0-4: P2-Schlachtfeld auffindbar machen — der Direktor verweist auf die Operationszentrale (Etage 4).
      pointer: 'Holen Sie sich bei Marina im Medien-Zentrum eine schärfere Linie — und eskalieren Sie gezielt: in der Operationszentrale (Etage 4) setzen Sie eine Operation gegen eine Schlüsselfigur auf.',
    };
  }
  return {
    problem: `Die Lage läuft für uns — ${trustPct} % des Ziels sind erreicht.`,
    // P0-4: auch in guter Lage bleibt die Operationszentrale (Etage 4) als Eskalations-Hebel sichtbar.
    pointer: 'Halten Sie das Tempo. Marina im Medien-Zentrum hat den nächsten Hebel — und in der Operationszentrale (Etage 4) warten gezielte Operationen gegen Schlüsselfiguren.',
  };
}

export function MorningBriefing({ phase, risk, trustProgress, budget, attention, auftragTitel, beatHook, onDone }: MorningBriefingProps) {
  const assets = useAssets();
  // T2/#7: Tag 1 bekommt eine eigene, gerichtete Eröffnung (statt der laufenden
  // Lage-Logik): sie erklärt die Kern-Schleife und verweist auf EINE klare Anlaufstelle.
  const firstDay = phase <= 1;
  const laune: Laune = firstDay ? 'gut' : deriveLaune(risk, trustProgress);
  const mood = MOOD_BY_LAUNE[laune];

  // Deterministische Variantenwahl: gleiche Phase → gleicher Text.
  const variant = firstDay
    ? { text: `Willkommen in der Abteilung. Ihr Auftrag: „${auftragTitel ?? 'Westunion destabilisieren'}". Bringen wir das Land in Bewegung — Schritt für Schritt.` }
    : BRIEFINGS[laune][Math.abs(phase) % BRIEFINGS[laune].length];

  // Konkreter, diegetischer Tageshinweis (B5/D-4); an Tag 1 die Kern-Schleife.
  const hint = firstDay
    ? {
        problem: 'Ihr erster Schritt: Öffnen Sie das Terminal (Taste A) und führen Sie eine Maßnahme aus.',
        pointer: 'Im Ergebnis sehen Sie sofort, wie sie Gesellschaft, Auftrag und Publikum bewegt — daran richten Sie die nächsten Züge aus. (Taste ? zeigt alle Tastenkürzel.)',
      }
    : deriveBriefingHint({ risk, attention, budget, trustProgress });

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
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
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
            <span className="text-sm font-bold" style={{ color: StoryModeColors.textSecondary }}>DIR.</span>
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

          {/* Konkreter Tageshinweis: Problem mit Zahl + Verweis aufs zuständige Büro (B5/D-4). */}
          <div
            className="mt-3 pt-3 border-t-2"
            style={{ borderColor: StoryModeColors.border }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: StoryModeColors.warning }}
            >
              Tageshinweis
            </span>
            <p
              className="font-mono text-sm leading-relaxed mt-1"
              style={{ color: StoryModeColors.textPrimary }}
            >
              {hint.problem}{' '}
              <span style={{ color: StoryModeColors.textSecondary }}>{hint.pointer}</span>
            </p>
          </div>

          {/* Spine Slice 2: Marinas Vorgriff auf den nächsten Beat (wenn gesetzt). */}
          {beatHook && (
            <div className="mt-2 pt-2 border-t-2" style={{ borderColor: StoryModeColors.borderLight }}>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: StoryModeColors.agencyBlue }}
              >
                Marina — Vorgriff
              </span>
              <p
                className="font-mono text-xs leading-relaxed mt-1"
                style={{ color: StoryModeColors.textPrimary }}
              >
                {beatHook}
              </p>
            </div>
          )}

          <div className="mt-3 text-right">
            <span
              className="inline-block px-4 py-1.5 border-2 font-bold text-sm"
              style={{
                backgroundColor: StoryModeColors.surfaceLight,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textPrimary,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
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
