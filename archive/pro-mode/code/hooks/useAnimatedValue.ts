/**
 * useAnimatedValue Hook (Week 5: UX Animations)
 *
 * Animates number changes with easing and CSS class triggers.
 * Perfect for resource displays, scores, and counters.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimatedValueOptions {
  /** Animation duration in ms (default: 500) */
  duration?: number;
  /** Easing function (default: easeOutCubic) */
  easing?: 'linear' | 'easeOut' | 'easeIn' | 'easeInOut' | 'easeOutCubic' | 'spring';
  /** Decimal places for display (default: 0) */
  decimals?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Format function for display */
  format?: (value: number) => string;
}

interface UseAnimatedValueReturn {
  /** Current animated display value */
  displayValue: number;
  /** Formatted string value */
  formattedValue: string;
  /** Whether animation is running */
  isAnimating: boolean;
  /** CSS class for value change direction */
  changeClass: 'animate-value-increase' | 'animate-value-decrease' | '';
  /** Delta from previous value */
  delta: number;
  /** Force update to new value without animation */
  setValue: (value: number) => void;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

export function useAnimatedValue(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): UseAnimatedValueReturn {
  const {
    duration = 500,
    easing = 'easeOutCubic',
    decimals = 0,
    onComplete,
    format,
  } = options;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [changeClass, setChangeClass] = useState<'animate-value-increase' | 'animate-value-decrease' | ''>('');
  const [delta, setDelta] = useState(0);

  const previousValue = useRef(targetValue);
  const animationFrame = useRef<number>();
  const startTime = useRef<number>();
  const startValue = useRef(targetValue);

  // Animation loop
  useEffect(() => {
    if (targetValue === previousValue.current) return;

    const valueDelta = targetValue - previousValue.current;
    setDelta(valueDelta);
    setChangeClass(valueDelta > 0 ? 'animate-value-increase' : 'animate-value-decrease');
    setIsAnimating(true);

    startValue.current = displayValue;
    startTime.current = performance.now();

    const easingFn = easingFunctions[easing];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - (startTime.current || currentTime);
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);

      const currentValue = startValue.current + (targetValue - startValue.current) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        setIsAnimating(false);
        previousValue.current = targetValue;

        // Clear change class after animation
        setTimeout(() => setChangeClass(''), 100);
        onComplete?.();
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [targetValue, duration, easing, onComplete]);

  // Format the display value
  const formattedValue = format
    ? format(displayValue)
    : displayValue.toFixed(decimals);

  // Force set value without animation
  const setValue = useCallback((value: number) => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setDisplayValue(value);
    previousValue.current = value;
    setIsAnimating(false);
    setChangeClass('');
  }, []);

  return {
    displayValue: Number(displayValue.toFixed(decimals)),
    formattedValue,
    isAnimating,
    changeClass,
    delta,
    setValue,
  };
}

/**
 * Format helpers for common use cases
 */
export const formatters = {
  /** Format as percentage: 0.75 → "75%" */
  percent: (value: number) => `${Math.round(value * 100)}%`,

  /** Format as currency: 1234 → "$1,234" */
  currency: (value: number) => `$${value.toLocaleString()}`,

  /** Format with K/M suffix: 1500 → "1.5K" */
  compact: (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  },

  /** Format with +/- sign: 5 → "+5", -3 → "-3" */
  signed: (value: number) => value > 0 ? `+${value}` : value.toString(),
};

export default useAnimatedValue;
