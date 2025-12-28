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
  isVisible: boolean;
}

// ============================================
// NPC PORTRAITS (ASCII Art placeholders)
// ============================================

const NPC_PORTRAITS: Record<string, Record<string, string>> = {
  direktor: {
    neutral: '👔',
    happy: '😊',
    angry: '😠',
    worried: '😟',
    suspicious: '🤨',
  },
  marina: {
    neutral: '🖥️',
    happy: '😄',
    angry: '😤',
    worried: '😰',
    suspicious: '🧐',
  },
  volkov: {
    neutral: '🤖',
    happy: '😎',
    angry: '💢',
    worried: '😥',
    suspicious: '👀',
  },
  katja: {
    neutral: '📊',
    happy: '🙂',
    angry: '😡',
    worried: '😨',
    suspicious: '🕵️',
  },
  igor: {
    neutral: '🔒',
    happy: '😁',
    angry: '😤',
    worried: '😓',
    suspicious: '🤔',
  },
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

export function DialogBox({ message, onChoice, onContinue, isVisible }: DialogBoxProps) {
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
  const portrait = NPC_PORTRAITS[speakerKey]?.[message.mood || 'neutral'] || '👤';
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
          <span className="text-2xl">{portrait}</span>
          <div>
            <div className="font-bold text-white text-lg">{message.speaker}</div>
            {message.speakerTitle && (
              <div className="text-xs text-white/70">{message.speakerTitle}</div>
            )}
          </div>
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
