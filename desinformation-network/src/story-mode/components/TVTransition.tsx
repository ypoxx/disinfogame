import { useState, useEffect } from 'react';

// ============================================
// TV TRANSITION EFFECTS
// Channel-switch static, power on/off effects
// ============================================

type TransitionType = 'static' | 'power-on' | 'power-off' | 'channel-switch';

type TVTransitionProps = {
  type: TransitionType;
  isActive: boolean;
  duration?: number; // ms
  onComplete?: () => void;
};

export function TVTransition({
  type,
  isActive,
  duration = 400,
  onComplete,
}: TVTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'animate' | 'done'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    setPhase('animate');
    const timer = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, onComplete]);

  if (!isActive && phase === 'idle') return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[90]"
      style={{
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      {type === 'static' && <StaticNoise phase={phase} />}
      {type === 'power-on' && <PowerOn phase={phase} duration={duration} />}
      {type === 'power-off' && <PowerOff phase={phase} duration={duration} />}
      {type === 'channel-switch' && <ChannelSwitch phase={phase} />}
    </div>
  );
}

// TV Static / White noise
function StaticNoise({ phase }: { phase: string }) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (phase !== 'animate') return;
    const interval = setInterval(() => setSeed(s => s + 1), 50);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="absolute inset-0" style={{ backgroundColor: '#111' }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${80 + (seed % 20)}' numOctaves='3' seed='${seed}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          filter: 'contrast(3) brightness(1.2)',
          opacity: 0.6,
        }}
      />
      {/* Horizontal sync line */}
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          top: `${(seed * 7) % 100}%`,
          backgroundColor: 'rgba(255,255,255,0.3)',
          boxShadow: '0 0 10px rgba(255,255,255,0.5)',
        }}
      />
    </div>
  );
}

// CRT Power-on effect: horizontal line expanding to full screen
function PowerOn({ phase, duration }: { phase: string; duration: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'animate') return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [phase, duration]);

  // Easing: fast start, slow end
  const eased = 1 - Math.pow(1 - progress, 3);

  return (
    <div className="absolute inset-0" style={{ backgroundColor: '#000' }}>
      {/* White expanding line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: `${50 - eased * 50}%`,
          height: `${eased * 100}%`,
          backgroundColor: progress < 0.3 ? '#fff' : 'transparent',
          boxShadow: progress < 0.5 ? '0 0 30px rgba(255,255,255,0.8)' : 'none',
          transition: 'background-color 0.1s',
        }}
      />
      {/* Fade to transparent */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#000',
          opacity: 1 - eased,
        }}
      />
    </div>
  );
}

// CRT Power-off effect: screen collapses to a line then dot
function PowerOff({ phase, duration }: { phase: string; duration: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== 'animate') return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [phase, duration]);

  const eased = progress * progress; // ease-in

  return (
    <div className="absolute inset-0" style={{ backgroundColor: '#000' }}>
      {/* Collapsing bright line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: `${eased * 50}%`,
          height: `${Math.max(2, (1 - eased) * 100)}%`,
          backgroundColor: eased > 0.8 ? '#fff' : 'transparent',
          boxShadow: eased > 0.5 ? `0 0 ${(1 - eased) * 40}px rgba(255,255,255,0.8)` : 'none',
        }}
      />
      {/* Center dot at the end */}
      {eased > 0.9 && (
        <div
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: '50%',
            width: `${(1 - eased) * 40}px`,
            height: `${(1 - eased) * 40}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            boxShadow: '0 0 20px rgba(255,255,255,0.6)',
          }}
        />
      )}
    </div>
  );
}

// Quick channel switch: brief static flash
function ChannelSwitch({ phase }: { phase: string }) {
  return (
    <div className="absolute inset-0">
      {/* Brief white flash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#fff',
          opacity: phase === 'animate' ? 0.15 : 0,
          transition: 'opacity 0.05s',
        }}
      />
      {/* Horizontal interference lines */}
      {phase === 'animate' && (
        <>
          <div
            className="absolute left-0 right-0 h-[3px]"
            style={{ top: '30%', backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{ top: '65%', backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
          <div
            className="absolute left-0 right-0 h-[1px]"
            style={{ top: '85%', backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
        </>
      )}
    </div>
  );
}

// ============================================
// Hook for managing transitions
// ============================================

export function useTVTransition() {
  const [transition, setTransition] = useState<{
    type: TransitionType;
    active: boolean;
    duration: number;
  }>({ type: 'static', active: false, duration: 400 });

  const trigger = (type: TransitionType, duration = 400) => {
    setTransition({ type, active: true, duration });
  };

  const handleComplete = () => {
    setTransition(prev => ({ ...prev, active: false }));
  };

  return {
    transition,
    trigger,
    handleComplete,
    TVTransitionComponent: (
      <TVTransition
        type={transition.type}
        isActive={transition.active}
        duration={transition.duration}
        onComplete={handleComplete}
      />
    ),
  };
}
