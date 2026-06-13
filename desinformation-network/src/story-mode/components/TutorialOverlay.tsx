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
    title: 'Ressourcen',
    content: `Sie verwalten fünf Ressourcen:

💰 BUDGET - Geld für Operationen
⚡ KAPAZITÄT - Operative Bandbreite (regeneriert)
⚠️ RISIKO - Entdeckungsgefahr (Game Over bei 85%+)
👁️ AUFMERKSAMKEIT - Zieht Gegner an
💀 MORALISCHE LAST - Beeinflusst NPCs und Enden

Halten Sie das Risiko niedrig!`,
    position: 'top',
    highlight: 'hud',
  },
  {
    id: 'office',
    title: 'Ihr Büro',
    content: `Dies ist Ihr Arbeitsplatz. Hier starten Sie Operationen.

💻 COMPUTER - E-Mails und Aktionen auswählen
☎️ TELEFON - Mit Ihrem Team sprechen
📺 BILDSCHIRM - Kampagnen-Statistiken
📱 SMARTPHONE - Nachrichten-Feed
🚪 TÜR - Besucher und Events

Klicken Sie auf die verschiedenen Bereiche, um zu interagieren.`,
    position: 'center',
    highlight: 'office',
  },
  {
    id: 'team',
    title: 'Ihr Team',
    content: `Fünf Spezialisten unterstützen Sie:

👔 DIREKTOR VOLKOV - Strategie, Druck von oben
📺 MARINA - Medien, Content, Narrative
🖥️ ALEXEI - Bot-Netzwerke, Infrastruktur
🎯 KATJA - Feld-Operationen, Kontakte
💰 IGOR - Finanzen, Tarnfirmen

Je besser Ihre Beziehung zu einem NPC, desto günstiger werden dessen Aktionen.`,
    position: 'center',
  },
  {
    id: 'advisors',
    title: 'Berater-System',
    content: `Rechts sehen Sie das BERATER-PANEL.

⭐ Ihre NPCs analysieren die Situation kontinuierlich
📊 Sie erhalten kontextuelle Empfehlungen basierend auf:
   • Aktuellem Spielfortschritt
   • Ressourcenlage
   • Bedrohungen und Chancen
   • NPC-Expertise

🔴 CRITICAL - Sofort handeln!
🟠 HIGH - Wichtig, bald umsetzen
🟡 MEDIUM - Sollte beachtet werden
⚪ LOW - Optional, aber sinnvoll

Klicken Sie auf einen NPC für Details.`,
    position: 'right',
    highlight: 'advisors',
  },
  {
    id: 'recommendations',
    title: 'NPC-Empfehlungen nutzen',
    content: `Empfehlungen helfen Ihnen, strategisch zu spielen:

⭐ EMPFOHLENE AKTIONEN werden im Terminal golden markiert
📋 Sie werden automatisch an den Anfang sortiert
🎯 Klicken Sie auf eine Empfehlung → sie wird im Terminal hervorgehoben

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
    id: 'queue',
    title: 'Aktionen-Warteschlange',
    content: `Planen Sie mehrere Aktionen im Voraus!

📋 WARTESCHLANGE (unten rechts):
▶ AUSFÜHREN - Aktion sofort starten
+ EINREIHEN - Zur Warteschlange hinzufügen

BATCH-AUSFÜHRUNG:
1️⃣ Mehrere Aktionen einreihen
2️⃣ Gesamtkosten überprüfen
3️⃣ Alle auf einmal ausführen
4️⃣ Detaillierte Gesamt-Bilanz sehen

💡 TIPP: Kombinieren Sie komplementäre Aktionen für maximalen Effekt!`,
    position: 'right',
    highlight: 'queue',
  },
  {
    id: 'actions',
    title: 'Aktionen',
    content: `Aktionen sind Ihre Werkzeuge. Es gibt 110 verschiedene Aktionen in 8 Kategorien:

• Analyse & Strategie (legal)
• Infrastruktur aufbauen (teils legal)
• Content erstellen (teils illegal)
• Distribution & Verstärkung
• Politik & Lobbying
• Gesellschaftliche Spaltung
• Gezielte Angriffe

Illegale Aktionen sind effektiver, aber riskanter.`,
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
    id: 'objectives',
    title: 'Ihre Ziele',
    content: `Hauptziel: Institutionelles Vertrauen unter 40% senken.

Nebenziel: Nicht enttarnt werden (Risiko < 85%).

Die Fortschrittsanzeige zeigt Ihren aktuellen Stand. Erreichen Sie Ihr Ziel in 10 Jahren, gewinnen Sie.

Aber bedenken Sie: Es gibt verschiedene Enden - manche besser als andere.`,
    position: 'bottom',
    highlight: 'objectives',
  },
  {
    id: 'endings',
    title: 'Mögliche Enden',
    content: `Es gibt acht Ending-Kategorien — unter anderem:

🏆 SIEG - Ziele erreicht, nicht enttarnt
💀 ENTTARNUNG - Risiko zu hoch, Game Over
🏃 FLUCHT - Sie können aussteigen (mit Konsequenzen)
🕊️ MORAL. ERLÖSUNG - Whistleblower werden

Ihre Entscheidungen bestimmen Ihr Schicksal.`,
    position: 'center',
  },
  {
    id: 'start',
    title: 'Beginnen Sie',
    content: `Sie sind bereit.

Klicken Sie auf den Computer, um Ihre erste E-Mail zu lesen und Ihre erste Aktion auszuwählen.

Viel Erfolg, Genosse Direktor der Sonderoperationen.`,
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
            boxShadow: `0 0 30px ${StoryModeColors.warning}`,
            borderRadius: '8px',
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
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.9)',
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
              color: StoryModeColors.warning,
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
                color: StoryModeColors.warning,
                boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              {step.requiresAction ? step.actionLabel : isLastStep ? 'ABSCHLIESSEN' : 'WEITER →'}
            </button>
          </div>
        </div>
      </div>

      {/* Skip hint */}
      <div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-xs"
        style={{ color: StoryModeColors.textMuted }}
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
    case 'objectives':
      return { bottom: '20px', left: '20px', width: '250px', height: '100px' };
    case 'advisors':
      return { top: '64px', right: 0, width: '320px', bottom: 0 };
    case 'queue':
      return { bottom: '16px', right: '16px', width: '384px', height: '360px' };
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
