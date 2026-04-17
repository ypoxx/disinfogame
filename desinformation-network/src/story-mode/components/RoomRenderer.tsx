import { useState, useEffect, useRef } from 'react';
import { StoryModeColors } from '../theme';
import type { Room, Interactable } from '../config/building';
import type { AmbientAnimation } from '../config/animations';

// ============================================
// ROOM RENDERER
// Config-driven room rendering from building.ts
// Falls back to CSS placeholder when no pixel-art assets exist
// ============================================

type RoomRendererProps = {
  room: Room;
  onInteract: (action: string) => void;
  /** Optional fallback background when pixel-art layers aren't available */
  fallbackImage?: string;
  /** Notification badges per interactable id */
  badges?: Record<string, number>;
  /** Custom overlay for special interactables (e.g. NewsTV) */
  customOverlays?: Record<string, React.ReactNode>;
};

type HoveredId = string | null;

// ============================================
// AMBIENT ANIMATION RENDERERS
// ============================================

function LedBlink({ anim }: { anim: AmbientAnimation }) {
  const [on, setOn] = useState(true);
  const interval = anim.config.interval || 500;

  useEffect(() => {
    const timer = setInterval(() => setOn((v) => !v), interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div
      className="absolute rounded-full transition-opacity duration-100"
      style={{
        left: anim.position.x,
        top: anim.position.y,
        width: 4,
        height: 4,
        backgroundColor: anim.config.color || '#33FF33',
        opacity: on ? 1 : 0.15,
        boxShadow: on ? `0 0 6px ${anim.config.color || '#33FF33'}` : 'none',
      }}
    />
  );
}

function ScreenFlicker({ anim }: { anim: AmbientAnimation }) {
  const [flicker, setFlicker] = useState(false);
  const intensity = anim.config.intensity || 0.1;

  useEffect(() => {
    const doFlicker = () => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 80);
    };
    const interval = setInterval(doFlicker, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: anim.position.x,
        top: anim.position.y,
        width: 60,
        height: 40,
        backgroundColor: flicker ? `rgba(255,255,255,${intensity})` : 'transparent',
        transition: 'background-color 0.05s',
      }}
    />
  );
}

function FanSpin({ anim }: { anim: AmbientAnimation }) {
  const speed = anim.config.speed || 2;

  return (
    <div
      className="absolute"
      style={{
        left: anim.position.x,
        top: anim.position.y,
        width: 12,
        height: 12,
        animation: `spin ${1 / speed}s linear infinite`,
      }}
    >
      <div
        className="w-full h-full rounded-full border"
        style={{
          borderColor: StoryModeColors.concrete,
          borderTopColor: StoryModeColors.lightConcrete,
        }}
      />
    </div>
  );
}

function NeonFlicker({ anim }: { anim: AmbientAnimation }) {
  const [on, setOn] = useState(true);
  const interval = anim.config.interval || 8000;

  useEffect(() => {
    const doFlicker = () => {
      setOn(false);
      setTimeout(() => setOn(true), 100 + Math.random() * 200);
    };
    const timer = setInterval(doFlicker, interval + Math.random() * 2000);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: anim.position.x,
        top: anim.position.y,
        width: 100,
        height: 3,
        backgroundColor: on ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)',
        boxShadow: on ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
        transition: 'all 0.05s',
      }}
    />
  );
}

function SteamEffect({ anim }: { anim: AmbientAnimation }) {
  return (
    <div
      className="absolute pointer-events-none animate-pulse"
      style={{
        left: anim.position.x,
        top: anim.position.y,
        width: 20,
        height: 30,
        background: `radial-gradient(ellipse, rgba(200,200,200,${anim.config.intensity || 0.2}) 0%, transparent 70%)`,
      }}
    />
  );
}

function AmbientRenderer({ animation }: { animation: AmbientAnimation }) {
  switch (animation.type) {
    case 'led_blink':
      return <LedBlink anim={animation} />;
    case 'screen_flicker':
      return <ScreenFlicker anim={animation} />;
    case 'fan_spin':
      return <FanSpin anim={animation} />;
    case 'neon_flicker':
      return <NeonFlicker anim={animation} />;
    case 'steam':
      return <SteamEffect anim={animation} />;
    case 'paper_flutter':
      // Simple CSS animation placeholder
      return (
        <div
          className="absolute pointer-events-none"
          style={{
            left: animation.position.x,
            top: animation.position.y,
            width: 8,
            height: 10,
            backgroundColor: StoryModeColors.document,
            opacity: 0.5,
            animation: `float ${2 / (animation.config.speed || 0.5)}s ease-in-out infinite`,
          }}
        />
      );
    default:
      return null;
  }
}

// ============================================
// HOTSPOT (interactive area)
// ============================================

function Hotspot({
  interactable,
  isHovered,
  badge,
  customOverlay,
  containerSize,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  interactable: Interactable;
  isHovered: boolean;
  badge?: number;
  customOverlay?: React.ReactNode;
  containerSize: { width: number; height: number };
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { bounds, tooltip_de, hotkey } = interactable;

  // Convert pixel bounds to percentage for responsive positioning
  // Assume config bounds are based on a 640x240 reference (can be adjusted)
  const REF_WIDTH = 640;
  const REF_HEIGHT = 240;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${(bounds.x / REF_WIDTH) * 100}%`,
    top: `${(bounds.y / REF_HEIGHT) * 100}%`,
    width: `${(bounds.width / REF_WIDTH) * 100}%`,
    height: `${(bounds.height / REF_HEIGHT) * 100}%`,
    zIndex: 10,
    cursor: 'pointer',
  };

  // Color per type
  const colors: Record<string, string> = {
    door: StoryModeColors.militaryOlive,
    object: StoryModeColors.sovietRed,
    npc: StoryModeColors.warning,
  };
  const color = colors[interactable.type] || StoryModeColors.agencyBlue;

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Custom overlay (e.g. NewsTV) replaces default hotspot */}
      {customOverlay ? (
        customOverlay
      ) : (
        <div
          className="w-full h-full rounded transition-all duration-200"
          style={{
            border: isHovered ? `3px solid ${color}` : '3px solid transparent',
            boxShadow: isHovered ? `0 0 25px ${color}, inset 0 0 15px ${color}33` : 'none',
            backgroundColor: isHovered ? `${color}12` : 'transparent',
          }}
        />
      )}

      {/* Badge */}
      {badge && badge > 0 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center border-2 font-bold text-xs animate-pulse"
          style={{
            backgroundColor: color,
            borderColor: StoryModeColors.border,
            color: '#fff',
            borderRadius: '50%',
            zIndex: 11,
          }}
        >
          {badge}
        </div>
      )}

      {/* Tooltip */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
          style={{
            backgroundColor: color,
            borderColor: StoryModeColors.border,
            color: '#fff',
            zIndex: 12,
          }}
        >
          {tooltip_de}
          {hotkey && (
            <span className="ml-1 opacity-70">[{hotkey.toUpperCase()}]</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// IMAGE LAYER (with fallback)
// ============================================

function ImageLayer({
  src,
  z,
  fallback,
}: {
  src: string | null;
  z: number;
  fallback?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src) return null;

  // If the image fails to load, show nothing (the fallback bg handles it)
  if (hasError) return null;

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: z,
        objectFit: 'cover',
        imageRendering: 'pixelated',
      }}
      onError={() => setHasError(true)}
      draggable={false}
    />
  );
}

// ============================================
// MAIN ROOM RENDERER
// ============================================

export function RoomRenderer({
  room,
  onInteract,
  fallbackImage,
  badges = {},
  customOverlays = {},
}: RoomRendererProps) {
  const [hoveredId, setHoveredId] = useState<HoveredId>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 640, height: 240 });

  // Track container size for responsive hotspots
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sort layers by z-index
  const sortedLayers = [...room.layers].sort((a, b) => a.z - b.z);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      {/* Fallback background (KI image or CSS placeholder) */}
      {fallbackImage ? (
        <img
          src={fallbackImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, imageRendering: 'auto' }}
          draggable={false}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 0,
            background: `linear-gradient(180deg, ${StoryModeColors.darkConcrete} 0%, ${StoryModeColors.background} 100%)`,
          }}
        />
      )}

      {/* Room layers (pixel-art assets — will silently fail if not present) */}
      {sortedLayers.map((layer) => (
        <ImageLayer
          key={layer.id}
          src={layer.src}
          z={layer.z}
        />
      ))}

      {/* Ambient animations */}
      {room.ambientAnimations.map((anim) => (
        <AmbientRenderer key={anim.id} animation={anim} />
      ))}

      {/* Interactive hotspots */}
      {room.interactables.map((interactable) => (
        <Hotspot
          key={interactable.id}
          interactable={interactable}
          isHovered={hoveredId === interactable.id}
          badge={badges[interactable.id]}
          customOverlay={customOverlays[interactable.id]}
          containerSize={containerSize}
          onClick={() => {
            setHoveredId(null);
            onInteract(interactable.action);
          }}
          onMouseEnter={() => setHoveredId(interactable.id)}
          onMouseLeave={() => setHoveredId(null)}
        />
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 20,
          background:
            'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Scanline overlay for pixel-art feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 21,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Room name & shortcut hints */}
      <div
        className="absolute bottom-0 left-0 right-0 py-2 px-4 text-center"
        style={{
          zIndex: 22,
          backgroundColor: 'rgba(45, 45, 45, 0.7)',
        }}
      >
        <span className="text-xs font-bold mr-4" style={{ color: StoryModeColors.textPrimary }}>
          {room.name_de}
        </span>
        <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>
          {room.interactables
            .filter((i) => i.hotkey)
            .map((i) => `[${i.hotkey!.toUpperCase()}] ${i.tooltip_de.split(' [')[0]}`)
            .join('  ')}
        </span>
      </div>
    </div>
  );
}
