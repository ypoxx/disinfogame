import { useState, useEffect, useRef } from 'react';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { Icon } from './Icon';
import { playVoiceLine, stopVoiceLine, playSound } from '../utils/SoundSystem';

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
  npcRecommendation?: string; // New: show active recommendation
  npcBetrayalWarning?: string; // New: show betrayal warning
  /** Asset-id einer Sprachzeile (voice_<npc>_<lineKey>) — wird abgespielt, wenn vorhanden. */
  voiceAssetId?: string;
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
  // Echtes Porträt aus dem Asset-Manifest (portrait_<npc>_<mood>, sonst
  // portrait_<npc>) hat Vorrang vor dem CSS-Gesicht.
  const assets = useAssets();
  const assetUrl =
    assets.imageUrl(`portrait_${npc.toLowerCase()}_${mood}`) ??
    assets.imageUrl(`portrait_${npc.toLowerCase()}`);
  if (assetUrl) {
    return (
      <img
        src={assetUrl}
        alt={npc}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          border: '3px solid',
          borderColor: NPC_COLORS[npc.toLowerCase()] || StoryModeColors.warning,
          backgroundColor: '#1a1a1a',
          imageRendering: 'pixelated',
        }}
      />
    );
  }

  // Kein echtes Porträt vorhanden → neutraler Pixel-Platzhalter (kein CSS-Gesicht,
  // kein Emoji): gerahmtes Kästchen mit der Initiale des NPC.
  return (
    <div
      aria-label={npc}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StoryModeColors.surfaceLight,
        border: `3px solid ${NPC_COLORS[npc.toLowerCase()] || StoryModeColors.warning}`,
        color: StoryModeColors.textPrimary,
        fontWeight: 'bold',
        fontSize: Math.round(size * 0.5),
        imageRendering: 'pixelated',
      }}
    >
      {(npc[0] ?? '?').toUpperCase()}
    </div>
  );
}

const KNOWN_NPC_IDS = ['direktor', 'marina', 'alexei', 'volkov', 'katja', 'igor'];

/**
 * Leitet die NPC-id aus dem Sprecher ab. Dialoge setzen meist den vollen Namen
 * („Marina Petrova"), die Porträt-/Farb-Logik arbeitet aber mit Kurz-ids —
 * deshalb tokenweise matchen statt nur exakt (behebt: Porträts erschienen
 * bisher nur beim Intro-„Direktor").
 */
function resolveSpeakerKey(speaker: string): string {
  const lower = speaker.toLowerCase();
  if (KNOWN_NPC_IDS.includes(lower)) return lower;
  for (const token of lower.split(/\s+/)) {
    if (KNOWN_NPC_IDS.includes(token)) return token;
  }
  return lower;
}

const NPC_COLORS: Record<string, string> = {
  direktor: StoryModeColors.ministryRed,
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
    45, // Slowed down from 25ms to 45ms per character for better readability
    message?.isTyping !== false
  );

  // Reset selection when message changes
  useEffect(() => {
    setSelectedChoice(null);
  }, [message?.text]);

  // F39: genau EIN dezenter Ton, wenn der Text fertig getippt ist (kein Tippgeräusch
  // je Buchstabe). Ref-Guard verhindert Mehrfach-Auslösung pro Nachricht.
  const dialogEndFiredRef = useRef<string | null>(null);
  useEffect(() => {
    if (isComplete && message?.text && dialogEndFiredRef.current !== message.text) {
      dialogEndFiredRef.current = message.text;
      playSound('dialogEnd');
    }
  }, [isComplete, message?.text]);

  // Sprachzeile abspielen, wenn das Manifest sie liefert (sonst No-op).
  // `assets` in den Deps: Erscheint der Dialog VOR dem Manifest-Load (z. B. die
  // Intro-Zeile direkt nach Spielstart), holt der Effekt die Wiedergabe nach,
  // sobald die Registry gefüllt ist — die Registry-Instanz wechselt genau einmal.
  const assets = useAssets();
  const voiceAssetId = message?.voiceAssetId;
  useEffect(() => {
    if (voiceAssetId) playVoiceLine(voiceAssetId);
    return () => stopVoiceLine();
  }, [voiceAssetId, assets]);

  if (!isVisible || !message) return null;

  const speakerKey = resolveSpeakerKey(message.speaker);
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
        className="mx-4 mb-4 cursor-pointer"
        style={{
          backgroundColor: StoryModeColors.surface,
          border: `2px solid ${StoryModeColors.borderLight}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
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
          <NPCPortrait npc={speakerKey} mood={message.mood || 'neutral'} size={48} />
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
          {/* Recommendation Banner */}
          {message.npcRecommendation && (
            <div
              className="mb-4 p-3 border-2 flex items-start gap-2"
              style={{
                backgroundColor: StoryModeColors.agencyBlue + '20',
                borderColor: StoryModeColors.agencyBlue,
              }}
            >
              <Icon name="actions" size={18} title="Empfehlung" />
              <div className="flex-1 text-sm" style={{ color: StoryModeColors.textPrimary }}>
                <div className="font-bold mb-1" style={{ color: StoryModeColors.agencyBlue }}>
                  AKTIVE EMPFEHLUNG:
                </div>
                {message.npcRecommendation}
              </div>
            </div>
          )}

          {/* Betrayal Warning Banner */}
          {message.npcBetrayalWarning && (
            <div
              className="mb-4 p-3 border-2 flex items-start gap-2 animate-pulse"
              style={{
                backgroundColor: StoryModeColors.danger + '20',
                borderColor: StoryModeColors.danger,
              }}
            >
              <Icon name="risk" size={18} title="Warnung" />
              <div className="flex-1 text-sm" style={{ color: StoryModeColors.textPrimary }}>
                <div className="font-bold mb-1" style={{ color: StoryModeColors.danger }}>
                  WARNUNG:
                </div>
                {message.npcBetrayalWarning}
              </div>
            </div>
          )}

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
                      ? StoryModeColors.ministryRed
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
                        {choice.cost.ap ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><Icon name="capacity" size={12} />{choice.cost.ap} AP</span> : null}
                        {choice.cost.ap && choice.cost.budget && <span> | </span>}
                        {choice.cost.budget ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><Icon name="budget" size={12} />${choice.cost.budget}K</span> : null}
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
