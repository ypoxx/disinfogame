/**
 * useTypingEffect Hook (Week 5: UX Animations)
 *
 * Creates a typewriter effect for text, perfect for NPC dialogues.
 * Supports variable speed and completion callbacks.
 */

import { useState, useEffect, useCallback } from 'react';

interface UseTypingEffectOptions {
  /** Characters per second (default: 40) */
  speed?: number;
  /** Delay before starting (ms) */
  delay?: number;
  /** Callback when typing completes */
  onComplete?: () => void;
  /** Skip effect and show full text immediately */
  skip?: boolean;
}

interface UseTypingEffectReturn {
  /** Current displayed text */
  displayedText: string;
  /** Whether typing is still in progress */
  isTyping: boolean;
  /** Skip to end of text */
  skipToEnd: () => void;
  /** Reset and start over */
  reset: () => void;
  /** Progress (0-1) */
  progress: number;
}

export function useTypingEffect(
  fullText: string,
  options: UseTypingEffectOptions = {}
): UseTypingEffectReturn {
  const {
    speed = 40,
    delay = 0,
    onComplete,
    skip = false,
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate interval from speed (chars per second)
  const intervalMs = 1000 / speed;

  // Reset when fullText changes
  useEffect(() => {
    if (skip) {
      setDisplayedText(fullText);
      setCurrentIndex(fullText.length);
      setIsTyping(false);
      return;
    }

    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(true);
  }, [fullText, skip]);

  // Typing animation
  useEffect(() => {
    if (skip || !isTyping) return;

    // Initial delay
    const delayTimeout = setTimeout(() => {
      if (currentIndex >= fullText.length) {
        setIsTyping(false);
        onComplete?.();
        return;
      }

      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          setDisplayedText(fullText.slice(0, next));

          if (next >= fullText.length) {
            clearInterval(interval);
            setIsTyping(false);
            onComplete?.();
          }

          return next;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [fullText, currentIndex, isTyping, intervalMs, delay, onComplete, skip]);

  const skipToEnd = useCallback(() => {
    setDisplayedText(fullText);
    setCurrentIndex(fullText.length);
    setIsTyping(false);
    onComplete?.();
  }, [fullText, onComplete]);

  const reset = useCallback(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(true);
  }, []);

  const progress = fullText.length > 0 ? currentIndex / fullText.length : 1;

  return {
    displayedText,
    isTyping,
    skipToEnd,
    reset,
    progress,
  };
}

export default useTypingEffect;
