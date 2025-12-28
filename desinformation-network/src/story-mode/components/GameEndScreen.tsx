import { useState } from 'react';
import { StoryModeColors } from '../theme';

// ============================================
// TYPES
// ============================================

export type EndingType = 'victory' | 'defeat' | 'escape' | 'moral_redemption';

export interface GameEndData {
  type: EndingType;
  title_de: string;
  title_en: string;
  description_de: string;
  description_en: string;
  epilogue_de: string;
  epilogue_en: string;
  stats: {
    phasesPlayed: number;
    actionsExecuted: number;
    consequencesTriggered: number;
    npcsCrisis: number;
    moralWeight: number;
    finalTrust?: number;
    finalRisk?: number;
  };
}

interface GameEndScreenProps {
  endData: GameEndData;
  onRestart: () => void;
  onMainMenu: () => void;
}

// ============================================
// ENDING CONFIGURATIONS
// ============================================

const ENDING_CONFIGS: Record<EndingType, {
  icon: string;
  color: string;
  borderColor: string;
  accentColor: string;
  showMoralReflection: boolean;
}> = {
  victory: {
    icon: '🎖️',
    color: StoryModeColors.militaryOlive,
    borderColor: StoryModeColors.darkOlive,
    accentColor: StoryModeColors.warning,
    showMoralReflection: true,
  },
  defeat: {
    icon: '💀',
    color: StoryModeColors.danger,
    borderColor: '#8B0000',
    accentColor: '#fff',
    showMoralReflection: false,
  },
  escape: {
    icon: '🏃',
    color: StoryModeColors.agencyBlue,
    borderColor: StoryModeColors.darkBlue,
    accentColor: StoryModeColors.warning,
    showMoralReflection: true,
  },
  moral_redemption: {
    icon: '🕊️',
    color: StoryModeColors.document,
    borderColor: StoryModeColors.oldPaper,
    accentColor: StoryModeColors.background,
    showMoralReflection: true,
  },
};

// ============================================
// MORAL REFLECTION MESSAGES
// ============================================

const MORAL_REFLECTIONS: Record<string, string[]> = {
  low: [
    'Sie haben Ihre Ziele mit minimalen ethischen Kompromissen erreicht.',
    'Ihre Methoden waren vergleichsweise zurückhaltend.',
    'Die Kolateralschäden waren begrenzt.',
  ],
  medium: [
    'Auf Ihrem Weg lagen Trümmer - menschliche Schicksale, die Sie in Kauf nahmen.',
    'Einige Ihrer Aktionen haben bleibende Schäden hinterlassen.',
    'Ihre Teammitglieder werden nie vergessen, was sie für Sie getan haben.',
  ],
  high: [
    'Die Spuren Ihrer Arbeit sind tief. Leben wurden zerstört, Gesellschaften gespalten.',
    'Sie haben bewiesen, wie effektiv Desinformation sein kann - zu welchem Preis?',
    'Moskau ist zufrieden. Können Sie das Gleiche von sich behaupten?',
  ],
  extreme: [
    'Sie haben Grenzen überschritten, die nie hätten überschritten werden dürfen.',
    'Die Demokratie, die Sie angegriffen haben, mag sich erholen. Die Menschen, die Sie zerstört haben, nicht.',
    'In den Annalen der Propaganda werden Sie als Meister gelten. Ist das ein Vermächtnis, auf das Sie stolz sein können?',
  ],
};

function getMoralReflection(moralWeight: number): string {
  if (moralWeight < 20) return MORAL_REFLECTIONS.low[Math.floor(Math.random() * MORAL_REFLECTIONS.low.length)];
  if (moralWeight < 50) return MORAL_REFLECTIONS.medium[Math.floor(Math.random() * MORAL_REFLECTIONS.medium.length)];
  if (moralWeight < 80) return MORAL_REFLECTIONS.high[Math.floor(Math.random() * MORAL_REFLECTIONS.high.length)];
  return MORAL_REFLECTIONS.extreme[Math.floor(Math.random() * MORAL_REFLECTIONS.extreme.length)];
}

// ============================================
// EDUCATIONAL MESSAGES
// ============================================

const EDUCATIONAL_MESSAGES = {
  victory: `LERNEFFEKT: Sie haben erlebt, wie eine koordinierte Desinformationskampagne funktioniert.
In der echten Welt nutzen staatliche und nicht-staatliche Akteure genau diese Taktiken.
Erkennen Sie die Muster: Bot-Netzwerke, emotionale Manipulation, Spaltungsnarrative.`,

  defeat: `LERNEFFEKT: Ihre Kampagne wurde aufgedeckt - genau das passiert auch in der Realität.
Investigative Journalisten, Faktenchecker und aufmerksame Bürger können Desinformation entlarven.
Medienkompetenz und kritisches Denken sind unsere beste Verteidigung.`,

  escape: `LERNEFFEKT: Viele reale Akteure in Desinformationskampagnen hatten ähnliche Gewissensbisse.
Manche wurden zu Whistleblowern, andere versteckten sich.
Die psychologische Last dieser Arbeit ist real und dokumentiert.`,

  moral_redemption: `LERNEFFEKT: Whistleblower wie Reality Winner oder Christopher Wylie haben unter großem persönlichem Risiko Desinformationsoperationen aufgedeckt.
Ihr mutiges Handeln hat der Öffentlichkeit gezeigt, wie diese Systeme funktionieren.
Manchmal ist das Richtige zu tun schwieriger als weiterzumachen.`,
};

// ============================================
// STATS COMPONENT
// ============================================

function StatsGrid({ stats }: { stats: GameEndData['stats'] }) {
  const statItems: Array<{ label: string; value: number; suffix?: string; color: string }> = [
    { label: 'Jahre gespielt', value: Math.floor(stats.phasesPlayed / 12), color: StoryModeColors.warning },
    { label: 'Phasen', value: stats.phasesPlayed, color: StoryModeColors.textPrimary },
    { label: 'Aktionen', value: stats.actionsExecuted, color: StoryModeColors.agencyBlue },
    { label: 'Konsequenzen', value: stats.consequencesTriggered, color: StoryModeColors.danger },
    { label: 'NPCs in Krise', value: stats.npcsCrisis, color: StoryModeColors.sovietRed },
    { label: 'Moralische Last', value: stats.moralWeight, color: StoryModeColors.sovietRed },
  ];

  if (stats.finalTrust !== undefined) {
    statItems.push({ label: 'Finales Vertrauen', value: stats.finalTrust, suffix: '%', color: StoryModeColors.militaryOlive });
  }
  if (stats.finalRisk !== undefined) {
    statItems.push({ label: 'Finales Risiko', value: stats.finalRisk, suffix: '%', color: StoryModeColors.danger });
  }

  return (
    <div
      className="grid grid-cols-4 gap-3 p-4 border-2"
      style={{
        backgroundColor: StoryModeColors.background,
        borderColor: StoryModeColors.borderLight,
      }}
    >
      {statItems.map((item, i) => (
        <div key={i} className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: item.color }}
          >
            {item.value}{item.suffix || ''}
          </div>
          <div
            className="text-xs"
            style={{ color: StoryModeColors.textSecondary }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function GameEndScreen({ endData, onRestart, onMainMenu }: GameEndScreenProps) {
  const [showEducation, setShowEducation] = useState(false);
  const config = ENDING_CONFIGS[endData.type];
  const moralReflection = getMoralReflection(endData.stats.moralWeight);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto py-8"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      <div
        className="max-w-3xl w-full mx-4 border-8"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: config.color,
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b-4 text-center"
          style={{
            backgroundColor: config.color,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-5xl mb-3">{config.icon}</div>
          <h1
            className="font-bold text-3xl tracking-wider mb-2"
            style={{ color: config.accentColor }}
          >
            {endData.title_de}
          </h1>
          <p
            className="text-sm opacity-80"
            style={{ color: config.accentColor }}
          >
            {endData.title_en}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Main Description */}
          <div
            className="text-center mb-6 font-mono text-lg"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {endData.description_de}
          </div>

          {/* Stats */}
          <StatsGrid stats={endData.stats} />

          {/* Epilogue */}
          <div
            className="mt-6 p-4 border-l-4 font-mono text-sm italic"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.document,
              color: StoryModeColors.textSecondary,
            }}
          >
            "{endData.epilogue_de}"
          </div>

          {/* Moral Reflection */}
          {config.showMoralReflection && (
            <div
              className="mt-4 p-4 border-2 text-center"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.sovietRed,
              }}
            >
              <div className="text-xs mb-2" style={{ color: StoryModeColors.textMuted }}>
                REFLEXION
              </div>
              <div
                className="font-mono text-sm"
                style={{ color: StoryModeColors.textPrimary }}
              >
                {moralReflection}
              </div>
            </div>
          )}

          {/* Educational Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowEducation(!showEducation)}
              className="w-full py-2 border-2 font-bold text-sm transition-all hover:brightness-110"
              style={{
                backgroundColor: StoryModeColors.agencyBlue,
                borderColor: StoryModeColors.darkBlue,
                color: StoryModeColors.warning,
              }}
            >
              {showEducation ? '▼ LERNEFFEKT VERBERGEN' : '▶ LERNEFFEKT ANZEIGEN'}
            </button>

            {showEducation && (
              <div
                className="mt-2 p-4 border-2 font-mono text-sm"
                style={{
                  backgroundColor: StoryModeColors.background,
                  borderColor: StoryModeColors.agencyBlue,
                  color: StoryModeColors.textPrimary,
                }}
              >
                {EDUCATIONAL_MESSAGES[endData.type]}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onRestart}
              className="flex-1 py-4 border-4 font-bold text-lg transition-all hover:brightness-110 active:translate-y-1"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              NOCHMAL SPIELEN
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 py-4 border-4 font-bold text-lg transition-all hover:brightness-110 active:translate-y-1"
              style={{
                backgroundColor: StoryModeColors.concrete,
                borderColor: StoryModeColors.borderLight,
                color: StoryModeColors.textPrimary,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              HAUPTMENÜ
            </button>
          </div>

          {/* DISARM Framework Link */}
          <div
            className="mt-6 text-center text-xs"
            style={{ color: StoryModeColors.textMuted }}
          >
            Mehr über Desinformationstaktiken erfahren:{' '}
            <span style={{ color: StoryModeColors.agencyBlue }}>
              disarm.foundation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameEndScreen;
