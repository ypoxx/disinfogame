import { useState, useEffect } from 'react';
import { StoryModeColors } from '../theme';

// ============================================
// TYPES
// ============================================

export interface DialogChoice {
  id: string;
  text: string;
  cost?: { ap?: number; budget?: number };
  consequence?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface DialogMessage {
  speaker: string;
  speakerTitle?: string;
  portrait?: string;
  text: string;
  mood?: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious';
  choices?: DialogChoice[];
  isTyping?: boolean;
}

interface DialogBoxProps {
  message: DialogMessage | null;
  onChoice?: (choiceId: string) => void;
  onContinue?: () => void;
  onClose?: () => void;
  isVisible: boolean;
}

// ============================================
// NPC PORTRAIT COMPONENT (CSS-based brutalist style)
// ============================================

interface PortraitProps {
  npc: string;
  mood: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious';
  size?: number;
}

function NPCPortrait({ npc, mood, size = 48 }: PortraitProps) {
  // Base styles for all portraits
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
    backgroundColor: '#1a1a1a',
    border: '3px solid',
    overflow: 'hidden',
  };

  // Mood-based expressions (eye and mouth positions)
  const getMoodExpression = () => {
    switch (mood) {
      case 'happy':
        return { eyeY: '30%', mouthCurve: 'up', eyeSize: 6 };
      case 'angry':
        return { eyeY: '35%', mouthCurve: 'down', eyeSize: 5, eyebrowAngle: -15 };
      case 'worried':
        return { eyeY: '32%', mouthCurve: 'flat', eyeSize: 7, eyebrowAngle: 10 };
      case 'suspicious':
        return { eyeY: '35%', mouthCurve: 'flat', eyeSize: 4, eyeSquint: true };
      default:
        return { eyeY: '33%', mouthCurve: 'flat', eyeSize: 5 };
    }
  };

  const expr = getMoodExpression();

  // NPC-specific styling
  const getNPCStyle = () => {
    switch (npc.toLowerCase()) {
      case 'direktor':
        return {
          borderColor: StoryModeColors.sovietRed,
          faceColor: '#d4a574',
          hairColor: '#2d2d2d',
          hairStyle: 'slicked', // slicked back
          accessory: 'glasses',
          accessoryColor: '#333',
        };
      case 'marina':
        return {
          borderColor: StoryModeColors.agencyBlue,
          faceColor: '#e8c4a0',
          hairColor: '#8B4513',
          hairStyle: 'long',
          accessory: 'headset',
          accessoryColor: StoryModeColors.agencyBlue,
        };
      case 'alexei':
      case 'volkov':
        return {
          borderColor: StoryModeColors.militaryOlive,
          faceColor: '#c9a87c',
          hairColor: '#1a1a1a',
          hairStyle: 'short',
          accessory: 'cap',
          accessoryColor: StoryModeColors.militaryOlive,
        };
      case 'katja':
        return {
          borderColor: StoryModeColors.document,
          faceColor: '#f5deb3',
          hairColor: '#daa520',
          hairStyle: 'bob',
          accessory: 'earrings',
          accessoryColor: '#gold',
        };
      case 'igor':
        return {
          borderColor: StoryModeColors.darkBlue,
          faceColor: '#c4a882',
          hairColor: '#4a4a4a',
          hairStyle: 'bald',
          accessory: 'scar',
          accessoryColor: '#8b0000',
        };
      default:
        return {
          borderColor: StoryModeColors.warning,
          faceColor: '#888',
          hairColor: '#444',
          hairStyle: 'none',
          accessory: 'none',
          accessoryColor: '#fff',
        };
    }
  };

  const npcStyle = getNPCStyle();

  return (
    <div style={{ ...baseStyle, borderColor: npcStyle.borderColor }}>
      {/* Face base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '75%',
          backgroundColor: npcStyle.faceColor,
          borderRadius: '45% 45% 40% 40%',
        }}
      />

      {/* Hair */}
      {npcStyle.hairStyle !== 'bald' && npcStyle.hairStyle !== 'none' && (
        <div
          style={{
            position: 'absolute',
            top: npcStyle.hairStyle === 'cap' ? '5%' : '8%',
            left: npcStyle.hairStyle === 'long' ? '5%' : '15%',
            right: npcStyle.hairStyle === 'long' ? '5%' : '15%',
            height: npcStyle.hairStyle === 'long' ? '45%' : '25%',
            backgroundColor: npcStyle.hairColor,
            borderRadius: npcStyle.hairStyle === 'slicked'
              ? '50% 50% 0 0'
              : npcStyle.hairStyle === 'bob'
                ? '40% 40% 30% 30%'
                : '50% 50% 20% 20%',
          }}
        />
      )}

      {/* Cap for Alexei */}
      {npcStyle.accessory === 'cap' && (
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '5%',
            right: '5%',
            height: '28%',
            backgroundColor: npcStyle.accessoryColor,
            borderRadius: '50% 50% 0 0',
            borderBottom: '3px solid #333',
          }}
        />
      )}

      {/* Left eye */}
      <div
        style={{
          position: 'absolute',
          top: expr.eyeY,
          left: '25%',
          width: expr.eyeSize,
          height: expr.eyeSquint ? expr.eyeSize / 2 : expr.eyeSize,
          backgroundColor: '#1a1a1a',
          borderRadius: '50%',
          transform: expr.eyebrowAngle ? `rotate(${expr.eyebrowAngle}deg)` : undefined,
        }}
      />

      {/* Right eye */}
      <div
        style={{
          position: 'absolute',
          top: expr.eyeY,
          right: '25%',
          width: expr.eyeSize,
          height: expr.eyeSquint ? expr.eyeSize / 2 : expr.eyeSize,
          backgroundColor: '#1a1a1a',
          borderRadius: '50%',
          transform: expr.eyebrowAngle ? `rotate(${-expr.eyebrowAngle}deg)` : undefined,
        }}
      />

      {/* Glasses for Direktor */}
      {npcStyle.accessory === 'glasses' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 'calc(' + expr.eyeY + ' - 3px)',
              left: '18%',
              width: 14,
              height: 10,
              border: '2px solid ' + npcStyle.accessoryColor,
              borderRadius: '20%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(' + expr.eyeY + ' - 3px)',
              right: '18%',
              width: 14,
              height: 10,
              border: '2px solid ' + npcStyle.accessoryColor,
              borderRadius: '20%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(' + expr.eyeY + ' + 2px)',
              left: '46%',
              width: '8%',
              height: 2,
              backgroundColor: npcStyle.accessoryColor,
            }}
          />
        </>
      )}

      {/* Headset for Marina */}
      {npcStyle.accessory === 'headset' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '0',
              right: '0',
              height: 4,
              backgroundColor: npcStyle.accessoryColor,
              borderRadius: '50% 50% 0 0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '-5%',
              width: 8,
              height: 12,
              backgroundColor: npcStyle.accessoryColor,
              borderRadius: 2,
            }}
          />
        </>
      )}

      {/* Scar for Igor */}
      {npcStyle.accessory === 'scar' && (
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '20%',
            width: 3,
            height: 15,
            backgroundColor: npcStyle.accessoryColor,
            transform: 'rotate(-20deg)',
          }}
        />
      )}

      {/* Mouth */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '35%',
          right: '35%',
          height: expr.mouthCurve === 'up' ? 6 : 3,
          backgroundColor: '#8b0000',
          borderRadius: expr.mouthCurve === 'up'
            ? '0 0 50% 50%'
            : expr.mouthCurve === 'down'
              ? '50% 50% 0 0'
              : '2px',
        }}
      />

      {/* Mood indicator border glow */}
      {(mood === 'angry' || mood === 'worried') && (
        <div
          style={{
            position: 'absolute',
            inset: -3,
            border: '2px solid',
            borderColor: mood === 'angry' ? StoryModeColors.danger : StoryModeColors.warning,
            animation: 'pulse 2s infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// Fallback emoji portraits for system/unknown
const FALLBACK_PORTRAITS: Record<string, Record<string, string>> = {
  system: {
    neutral: '⚙️',
    happy: '✅',
    angry: '⚠️',
    worried: '❓',
    suspicious: '🔍',
  },
};

const NPC_COLORS: Record<string, string> = {
  direktor: StoryModeColors.sovietRed,
  marina: StoryModeColors.agencyBlue,
  alexei: StoryModeColors.militaryOlive,
  volkov: StoryModeColors.militaryOlive,
  katja: StoryModeColors.document,
  igor: StoryModeColors.darkBlue,
  system: StoryModeColors.warning,
};

// ============================================
// TYPEWRITER EFFECT HOOK
// ============================================

function useTypewriter(text: string, speed: number = 30, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  const skipToEnd = () => {
    setDisplayedText(text);
    setIsComplete(true);
  };

  return { displayedText, isComplete, skipToEnd };
}

// ============================================
// DIALOG BOX COMPONENT
// ============================================

export function DialogBox({ message, onChoice, onContinue, onClose, isVisible }: DialogBoxProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const { displayedText, isComplete, skipToEnd } = useTypewriter(
    message?.text || '',
    25,
    message?.isTyping !== false
  );

  // Reset selection when message changes
  useEffect(() => {
    setSelectedChoice(null);
  }, [message?.text]);

  if (!isVisible || !message) return null;

  const speakerKey = message.speaker.toLowerCase();
  const isKnownNPC = ['direktor', 'marina', 'alexei', 'volkov', 'katja', 'igor'].includes(speakerKey);
  const fallbackEmoji = FALLBACK_PORTRAITS[speakerKey]?.[message.mood || 'neutral'] || '👤';
  const speakerColor = NPC_COLORS[speakerKey] || StoryModeColors.textPrimary;

  const handleClick = () => {
    if (!isComplete) {
      skipToEnd();
    } else if (!message.choices && onContinue) {
      onContinue();
    }
  };

  const handleChoiceClick = (choice: DialogChoice) => {
    if (choice.disabled) return;
    setSelectedChoice(choice.id);
    setTimeout(() => {
      onChoice?.(choice.id);
    }, 150);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      style={{
        background: `linear-gradient(to top, ${StoryModeColors.background}f0, transparent)`,
        paddingTop: '60px',
      }}
    >
      <div
        className="mx-4 mb-4 border-4 cursor-pointer"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={handleClick}
      >
        {/* Speaker Name Bar */}
        <div
          className="flex items-center gap-3 px-4 py-2 border-b-4"
          style={{
            backgroundColor: speakerColor,
            borderColor: StoryModeColors.border,
          }}
        >
          {isKnownNPC ? (
            <NPCPortrait
              npc={speakerKey}
              mood={message.mood || 'neutral'}
              size={48}
            />
          ) : (
            <span className="text-2xl">{fallbackEmoji}</span>
          )}
          <div className="flex-1">
            <div className="font-bold text-white text-lg">{message.speaker}</div>
            {message.speakerTitle && (
              <div className="text-xs text-white/70">{message.speakerTitle}</div>
            )}
          </div>
          {/* Close Button */}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/20 transition-colors"
              style={{ fontSize: '24px', fontWeight: 'bold' }}
              title="Schließen (Esc)"
            >
              ×
            </button>
          )}
        </div>

        {/* Message Content */}
        <div className="p-6">
          <div
            className="font-mono text-base leading-relaxed min-h-[80px]"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {displayedText}
            {!isComplete && (
              <span
                className="animate-pulse ml-1"
                style={{ color: StoryModeColors.warning }}
              >
                ▌
              </span>
            )}
          </div>

          {/* Choices */}
          {isComplete && message.choices && message.choices.length > 0 && (
            <div className="mt-4 space-y-2 border-t-4 pt-4" style={{ borderColor: StoryModeColors.borderLight }}>
              {message.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChoiceClick(choice);
                  }}
                  disabled={choice.disabled}
                  className={`
                    w-full text-left px-4 py-3 border-2 font-mono transition-all
                    ${choice.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:translate-y-0.5'}
                    ${selectedChoice === choice.id ? 'translate-y-0.5' : ''}
                  `}
                  style={{
                    backgroundColor: selectedChoice === choice.id
                      ? StoryModeColors.sovietRed
                      : StoryModeColors.surfaceLight,
                    borderColor: choice.disabled
                      ? StoryModeColors.borderLight
                      : StoryModeColors.border,
                    color: selectedChoice === choice.id
                      ? '#fff'
                      : StoryModeColors.textPrimary,
                    boxShadow: selectedChoice === choice.id
                      ? 'none'
                      : '3px 3px 0px 0px rgba(0,0,0,0.8)',
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <span className="text-sm" style={{ color: StoryModeColors.warning }}>
                        [{index + 1}]
                      </span>{' '}
                      {choice.text}
                      {choice.disabled && choice.disabledReason && (
                        <div className="text-xs mt-1" style={{ color: StoryModeColors.danger }}>
                          ({choice.disabledReason})
                        </div>
                      )}
                    </div>
                    {choice.cost && (
                      <div className="text-xs whitespace-nowrap" style={{ color: StoryModeColors.textSecondary }}>
                        {choice.cost.ap && <span>⚡{choice.cost.ap} AP</span>}
                        {choice.cost.ap && choice.cost.budget && <span> | </span>}
                        {choice.cost.budget && <span>💰${choice.cost.budget}K</span>}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Continue Indicator */}
          {isComplete && !message.choices && (
            <div
              className="text-center mt-4 text-sm animate-pulse"
              style={{ color: StoryModeColors.textSecondary }}
            >
              Click to continue...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
