/**
 * Animated Hand Component for Tutorial
 * Pointing hand with click animation
 */

interface AnimatedHandProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: HTMLElement | null;
}

export function AnimatedHand({ position, targetElement }: AnimatedHandProps) {
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  // Calculate hand position based on target element
  const getHandStyle = () => {
    const offset = 50; // Distance from element

    switch (position) {
      case 'top':
        return {
          top: rect.top - offset,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) rotate(-45deg)',
        };
      case 'bottom':
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) rotate(135deg)',
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - offset,
          transform: 'translateY(-50%) rotate(45deg)',
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + offset,
          transform: 'translateY(-50%) rotate(-135deg)',
        };
    }
  };

  const handStyle = getHandStyle();

  return (
    <div
      className="fixed z-50 pointer-events-none animate-tutorial-point"
      style={handStyle}
    >
      <div className="relative">
        {/* Hand emoji with shadow */}
        <div
          className="text-4xl"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
          }}
        >
          👆
        </div>
        {/* Click ripple effect */}
        <div
          className="absolute inset-0 -m-2 rounded-full animate-tutorial-click-ripple"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
