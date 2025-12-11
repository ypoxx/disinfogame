/**
 * Animated Arrow Component for Tutorial
 * Plants vs. Zombies-inspired bouncing arrow
 */

interface AnimatedArrowProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: HTMLElement | null;
}

export function AnimatedArrow({ position, targetElement }: AnimatedArrowProps) {
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();

  // Calculate arrow position based on target element
  const getArrowStyle = () => {
    const offset = 40; // Distance from element

    switch (position) {
      case 'top':
        return {
          top: rect.top - offset,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) rotate(180deg)',
        };
      case 'bottom':
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%) rotate(0deg)',
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - offset,
          transform: 'translateY(-50%) rotate(90deg)',
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + offset,
          transform: 'translateY(-50%) rotate(-90deg)',
        };
    }
  };

  const arrowStyle = getArrowStyle();

  return (
    <div
      className="fixed z-50 pointer-events-none animate-tutorial-bounce"
      style={arrowStyle}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
        }}
      >
        <path
          d="M12 4L12 20M12 20L6 14M12 20L18 14"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
