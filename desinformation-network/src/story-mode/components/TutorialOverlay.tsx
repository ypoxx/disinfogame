import { useState, useCallback } from 'react';
import { StoryModeColors } from '../theme';

// ============================================
// TYPES
// ============================================

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  highlight?: 'hud' | 'office' | 'dialog' | 'actions' | 'news' | 'objectives' | 'advisors' | 'queue';
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  requiresAction?: boolean;
  actionLabel?: string;
}

interface TutorialOverlayProps {
  step: TutorialStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

// ============================================
// TUTORIAL STEPS DATA
// ============================================

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Willkommen bei Operation Westunion',
    content: `Sie sind der neue Leiter der Abteilung für Sonderoperationen.

Ihre Aufgabe: Die politische Landschaft von Westunion durch gezielte Informationsoperationen zu destabilisieren.

Dieses Spiel ist eine Simulation zu Bildungszwecken. Es zeigt, wie Desinformationskampagnen funktionieren - damit Sie sie in der echten Welt erkennen können.`,
    position: 'center',
  },
  {
    id: 'time',
    title: 'Zeitmanagement',
    content: `Das Spiel läuft über 10 Jahre (120 Phasen).

Jede Phase entspricht etwa einem Monat. Sie haben pro Phase eine begrenzte Anzahl an Aktionspunkten (AP), die Sie für verschiedene Operationen einsetzen können.

Oben links sehen Sie das aktuelle Jahr und den Monat.`,
    position: 'top',
    highlight: 'hud',
  },
  {
    id: 'resources',
    title: 'Das Rennen',
    content: `Zwei Läufer rennen auf den Wahltag zu:

SONNTAGSFRAGE - Ihr Umfragewert. Bringen Sie ihn über die Schwelle.
ABWEHR - das Immunsystem der Gesellschaft. Erreicht es 100, ist die
Operation aufgeflogen.
KASSE - die Zentrale zahlt in Tranchen, wenn Sie liefern.
TAG X/40 - der Wahltag ist die Ziellinie.

Lautes Spiel treibt die Abwehr. Wer zuerst durchs Ziel geht, gewinnt.`,
    position: 'top',
    highlight: 'hud',
  },
  {
    id: 'office',
    title: 'Ihr Büro',
    content: `Dies ist Ihr Arbeitsplatz. Hier starten Sie Operationen.

[PC] COMPUTER - E-Mails und Aktionen auswählen
[Tel] TELEFON - Mit Ihrem Team sprechen
[TV] BILDSCHIRM - Kampagnen-Statistiken
[Mob] SMARTPHONE - Nachrichten-Feed
[Tür] TÜR - Besucher und Events

Klicken Sie auf die verschiedenen Bereiche, um zu interagieren.`,
    position: 'center',
    highlight: 'office',
  },
  {
    id: 'team',
    title: 'Ihr Team',
    content: `Fünf Spezialisten unterstützen Sie:

[Dir] DIREKTOR VOLKOV - Strategie, Druck von oben
[TV] MARINA - Medien, Content, Narrative
[PC] ALEXEI - Bot-Netzwerke, Infrastruktur
[Feld] KATJA - Feld-Operationen, Kontakte
[Fin] IGOR - Finanzen, Tarnfirmen

Je besser Ihre Beziehung zu einem NPC, desto günstiger werden dessen Aktionen.`,
    position: 'center',
  },
  {
    id: 'advisors',
    title: 'Berater-System',
    content: `Rechts sehen Sie das BERATER-PANEL.

[★] Ihre NPCs analysieren die Situation kontinuierlich
[Stats] Sie erhalten kontextuelle Empfehlungen basierend auf:
   • Aktuellem Spielfortschritt
   • Ressourcenlage
   • Bedrohungen und Chancen
   • NPC-Expertise

[Rot] CRITICAL - Sofort handeln!
[Orange] HIGH - Wichtig, bald umsetzen
[Gelb] MEDIUM - Sollte beachtet werden
[Grau] LOW - Optional, aber sinnvoll

Klicken Sie auf einen NPC für Details.`,
    position: 'right',
    highlight: 'advisors',
  },
  {
    id: 'recommendations',
    title: 'NPC-Empfehlungen nutzen',
    content: `Empfehlungen helfen Ihnen, strategisch zu spielen:

[★] EMPFOHLENE AKTIONEN werden im Terminal golden markiert
[Liste] Sie werden automatisch an den Anfang sortiert
[Ziel] Klicken Sie auf eine Empfehlung → sie wird im Terminal hervorgehoben

NPCs passen ihre Empfehlungen dynamisch an:
• Phase im Spielverlauf
• Ihre Ressourcen
• Drohende Konsequenzen
• Verfallende Combos

Nutzen Sie die Expertise Ihres Teams!`,
    position: 'right',
    highlight: 'advisors',
  },
  {
    // N3: Das schwebende Queue-Widget ist Geschichte — geplant wird an der Tafel.
    id: 'queue',
    title: 'Planen an der Narrativ-Tafel',
    content: `Planen Sie mehrere Maßnahmen im Voraus!

Am TERMINAL (Taste A): AUSFÜHREN wirkt sofort, ANHEFTEN schickt die Maßnahme ans Korkbrett.

An der TAFEL (Korkbrett im Büro): angeheftete Karten prüfen, Gesamtkosten sehen, mit AUSSPIELEN alle auf einmal senden.

Der Zähler am Korkbrett zeigt, wie viel dort hängt.

Tipp: Kombinieren Sie komplementäre Maßnahmen für maximalen Effekt!`,
    position: 'center',
  },
  {
    id: 'actions',
    title: 'Das Vorgangs-Terminal',
    content: `Am Terminal in Ihrem Büro (oder mit Taste A) wählen Sie Ihre Maßnahmen.

Die Eingangsseite zeigt die HEUTE passenden Vorgänge; der volle Katalog liegt in der Schublade „ARCHIV".

Jedes Vorgangsblatt trägt VOR dem Klick Wirkung, Preis und einen Frische-Stempel (FRISCH / BEKANNT / VERBRANNT) je Ziel-Milieu — verbrannte Maschen verpuffen.

Ausführen wirkt sofort; Anheften plant den Vorgang am Korkbrett.`,
    position: 'center',
    highlight: 'actions',
  },
  {
    id: 'consequences',
    title: 'Konsequenzen',
    content: `Jede Aktion kann Konsequenzen haben:

• ENTDECKUNG - Ihre Bots werden erkannt
• RÜCKSCHLAG - Ihre Narrative werden widerlegt
• ESKALATION - Akteure reagieren aggressiv
• INTERN - Ihr Team wird unzufrieden
• KOLLATERAL - Unbeabsichtigte Opfer

Konsequenzen treten verzögert ein. Manchmal haben Sie Wahlmöglichkeiten.`,
    position: 'center',
  },
  {
    // N2: Das Wettrennen ist das Ziel-Vokabular — nicht mehr „Vertrauen unter 40 %".
    id: 'objectives',
    title: 'Das Rennen',
    content: `Zwei Läufer rennen auf den Wahltag zu:

SONNTAGSFRAGE - Ihr Läufer. Bringen Sie die Partei über die Schwelle, bevor die Kampagne endet.

ABWEHR - ihr Läufer. Das Immunsystem der Gesellschaft: erreicht es 100, ist die Operation aufgeflogen.

Beide Balken zeigt das HUD (Taste H), das Lagebild am Wand-Monitor und die Tafel. Halten Sie außerdem das Risiko unten - eine Untersuchung endet mit Enttarnung.`,
    position: 'center',
  },
  {
    id: 'endings',
    title: 'Mögliche Enden',
    content: `Es gibt acht Ending-Kategorien — unter anderem:

[Sieg] SIEG - Ziele erreicht, nicht enttarnt
[Tod] ENTTARNUNG - Risiko zu hoch, Game Over
[Flucht] FLUCHT - Sie können aussteigen (mit Konsequenzen)
[Moral] MORAL. ERLÖSUNG - Whistleblower werden

Ihre Entscheidungen bestimmen Ihr Schicksal.`,
    position: 'center',
  },
  {
    id: 'start',
    title: 'Beginnen Sie',
    content: `Sie sind bereit.

Klicken Sie auf den Computer, um Ihre erste E-Mail zu lesen und Ihre erste Aktion auszuwählen.

Viel Erfolg, Direktor der Sonderoperationen.`,
    position: 'center',
    requiresAction: true,
    actionLabel: 'MISSION STARTEN',
  },
];

// ============================================
// TUTORIAL OVERLAY COMPONENT
// ============================================

export function TutorialOverlay({
  step,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
  onComplete,
}: TutorialOverlayProps) {
  const isLastStep = currentStep === totalSteps - 1;

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    top: {
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
    },
    right: {
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      {/* Highlight overlay */}
      {step.highlight && (
        <div
          className="absolute pointer-events-none"
          style={{
            ...getHighlightPosition(step.highlight),
            border: `3px solid ${StoryModeColors.warning}`,
            animation: 'pulse 2s infinite',
          }}
        />
      )}

      {/* Tutorial Card */}
      <div
        className="fixed w-[500px] max-w-[90vw] border-4"
        style={{
          ...positionStyles[step.position],
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.ministryRed,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-3 border-b-4 flex items-center justify-between"
          style={{
            backgroundColor: StoryModeColors.ministryRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <h2 className="font-bold text-lg text-white">{step.title}</h2>
          <span
            className="text-sm px-2 py-0.5 border"
            style={{
              backgroundColor: StoryModeColors.darkRed,
              borderColor: StoryModeColors.border,
              // Auf dem dunkelroten Chip muss der Zähler Papier-hell sein (§4.7 Regel 2).
              color: StoryModeColors.document,
            }}
          >
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className="font-mono text-sm whitespace-pre-line leading-relaxed"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {step.content}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t-2" style={{ borderColor: StoryModeColors.borderLight }}>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-sm font-bold transition-all hover:brightness-110"
              style={{ color: StoryModeColors.textSecondary }}
            >
              ÜBERSPRINGEN
            </button>

            <button
              onClick={isLastStep ? onComplete : onNext}
              className="px-6 py-2 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: isLastStep ? StoryModeColors.militaryOlive : StoryModeColors.agencyBlue,
                borderColor: StoryModeColors.border,
                // Auf dunklem Oliv/Blau muss die Beschriftung Papier-hell sein (§4.7 Regel 2).
                color: StoryModeColors.document,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
              }}
            >
              {step.requiresAction ? step.actionLabel : isLastStep ? 'ABSCHLIESSEN' : 'WEITER →'}
            </button>
          </div>
        </div>
      </div>

      {/* Skip hint — liegt auf dem dunklen Scrim → heller Papier-Ton statt Tinte (§4.7 Regel 2). */}
      <div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-xs"
        style={{ color: StoryModeColors.lightConcrete }}
      >
        Drücken Sie ESC um das Tutorial zu überspringen
      </div>
    </div>
  );
}

// Helper function to get highlight positions
function getHighlightPosition(highlight: string): React.CSSProperties {
  switch (highlight) {
    case 'hud':
      return { top: 0, left: 0, right: 0, height: '60px' };
    case 'office':
      return { top: '60px', left: 0, right: '300px', bottom: '60px' };
    case 'dialog':
      return { bottom: 0, left: 0, right: 0, height: '250px' };
    case 'actions':
      return { top: '50%', left: '50%', width: '600px', height: '400px', transform: 'translate(-50%, -50%)' };
    // ('objectives'/'queue' entfallen — Ziel-Tracker und Queue-Widget gibt es
    //  seit N2/N3 nicht mehr; die Schritte erklären jetzt ohne Spotlight.)
    case 'advisors':
      return { top: '64px', right: 0, width: '320px', bottom: 0 };
    default:
      return {};
  }
}

// ============================================
// USE TUTORIAL HOOK
// ============================================

export function useTutorial() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);

  const start = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const next = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    setIsActive(false);
    setHasSkipped(true);
    localStorage.setItem('storyMode_tutorialSkipped', 'true');
  }, []);

  const complete = useCallback(() => {
    setIsActive(false);
    setHasCompleted(true);
    localStorage.setItem('storyMode_tutorialCompleted', 'true');
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompleted(false);
    setHasSkipped(false);
  }, []);

  const shouldShowTutorial = useCallback(() => {
    return !localStorage.getItem('storyMode_tutorialCompleted') &&
           !localStorage.getItem('storyMode_tutorialSkipped');
  }, []);

  return {
    isActive,
    currentStep,
    totalSteps: TUTORIAL_STEPS.length,
    currentStepData: TUTORIAL_STEPS[currentStep],
    hasCompleted,
    hasSkipped,
    start,
    next,
    skip,
    complete,
    reset,
    shouldShowTutorial,
  };
}

export default TutorialOverlay;
