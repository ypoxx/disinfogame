# Visual Style Guide

## Design Philosophy

**Infographic Aesthetic** - The game should feel like an interactive data visualization, not a traditional game. Think "Our World in Data" meets "Democracy 3".

### Core Principles

1. **Clarity** - Information is easy to parse at a glance
2. **Minimalism** - Remove visual noise, every element has purpose
3. **Hierarchy** - Clear visual priorities guide attention
4. **Data-First** - Graphics serve information, not decoration
5. **Accessibility** - WCAG AA compliant, colorblind-friendly

---

## Color System

### Trust Scale (Primary)

The trust value (0-1) maps to a continuous color scale:

```typescript
// src/utils/colors.ts
export function trustToColor(trust: number): string {
  if (trust >= 0.9) return '#22C55E'; // Green 500
  if (trust >= 0.7) return '#84CC16'; // Lime 500
  if (trust >= 0.5) return '#EAB308'; // Yellow 500
  if (trust >= 0.3) return '#F97316'; // Orange 500
  return '#EF4444'; // Red 500
}

// For gradients and smooth transitions
export function trustToHex(trust: number): string {
  const colors = [
    { stop: 0.0, color: [239, 68, 68] },   // Red
    { stop: 0.3, color: [249, 115, 22] },  // Orange
    { stop: 0.5, color: [234, 179, 8] },   // Yellow
    { stop: 0.7, color: [132, 204, 22] },  // Lime
    { stop: 1.0, color: [34, 197, 94] },   // Green
  ];
  
  // Interpolate between stops
  let lower = colors[0], upper = colors[colors.length - 1];
  for (let i = 0; i < colors.length - 1; i++) {
    if (trust >= colors[i].stop && trust <= colors[i + 1].stop) {
      lower = colors[i];
      upper = colors[i + 1];
      break;
    }
  }
  
  const range = upper.stop - lower.stop;
  const factor = range === 0 ? 0 : (trust - lower.stop) / range;
  
  const r = Math.round(lower.color[0] + factor * (upper.color[0] - lower.color[0]));
  const g = Math.round(lower.color[1] + factor * (upper.color[1] - lower.color[1]));
  const b = Math.round(lower.color[2] + factor * (upper.color[2] - lower.color[2]));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
```

### Actor Categories

```typescript
export const CATEGORY_COLORS = {
  media: {
    primary: '#3B82F6',    // Blue 500
    light: '#93C5FD',      // Blue 300
    dark: '#1D4ED8',       // Blue 700
    bg: '#EFF6FF',         // Blue 50
  },
  expert: {
    primary: '#8B5CF6',    // Violet 500
    light: '#C4B5FD',      // Violet 300
    dark: '#6D28D9',       // Violet 700
    bg: '#F5F3FF',         // Violet 50
  },
  lobby: {
    primary: '#EC4899',    // Pink 500
    light: '#F9A8D4',      // Pink 300
    dark: '#BE185D',       // Pink 700
    bg: '#FDF2F8',         // Pink 50
  },
  organization: {
    primary: '#14B8A6',    // Teal 500
    light: '#5EEAD4',      // Teal 300
    dark: '#0F766E',       // Teal 700
    bg: '#F0FDFA',         // Teal 50
  },
  defensive: {
    primary: '#F59E0B',    // Amber 500
    light: '#FCD34D',      // Amber 300
    dark: '#B45309',       // Amber 700
    bg: '#FFFBEB',         // Amber 50
  },
};

export function getCategoryColor(category: string, variant: 'primary' | 'light' | 'dark' | 'bg' = 'primary'): string {
  return CATEGORY_COLORS[category]?.[variant] || '#6B7280';
}
```

### UI Colors

```typescript
export const UI_COLORS = {
  // Backgrounds
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F9FAFB',    // Gray 50
  bgTertiary: '#F3F4F6',     // Gray 100
  
  // Text
  textPrimary: '#111827',    // Gray 900
  textSecondary: '#4B5563',  // Gray 600
  textTertiary: '#9CA3AF',   // Gray 400
  
  // Borders
  borderLight: '#E5E7EB',    // Gray 200
  borderMedium: '#D1D5DB',   // Gray 300
  borderDark: '#9CA3AF',     // Gray 400
  
  // Interactive
  interactive: '#3B82F6',    // Blue 500
  interactiveHover: '#2563EB', // Blue 600
  interactiveActive: '#1D4ED8', // Blue 700
  
  // Status
  success: '#22C55E',        // Green 500
  warning: '#EAB308',        // Yellow 500
  error: '#EF4444',          // Red 500
  info: '#3B82F6',           // Blue 500
};
```

---

## Typography

### Font Stack

```css
/* Primary: Clean sans-serif */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace: For numbers and data */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

```typescript
export const TYPE_SCALE = {
  // Display (for large headers, screens)
  displayLarge: { size: '3rem', weight: 700, lineHeight: 1.1 },    // 48px
  displayMedium: { size: '2.25rem', weight: 700, lineHeight: 1.2 }, // 36px
  displaySmall: { size: '1.875rem', weight: 600, lineHeight: 1.2 }, // 30px
  
  // Headlines
  h1: { size: '1.5rem', weight: 600, lineHeight: 1.3 },    // 24px
  h2: { size: '1.25rem', weight: 600, lineHeight: 1.4 },   // 20px
  h3: { size: '1.125rem', weight: 600, lineHeight: 1.4 },  // 18px
  h4: { size: '1rem', weight: 600, lineHeight: 1.5 },      // 16px
  
  // Body
  bodyLarge: { size: '1.125rem', weight: 400, lineHeight: 1.6 },  // 18px
  bodyMedium: { size: '1rem', weight: 400, lineHeight: 1.6 },     // 16px
  bodySmall: { size: '0.875rem', weight: 400, lineHeight: 1.5 },  // 14px
  
  // Labels
  labelLarge: { size: '0.875rem', weight: 500, lineHeight: 1.4 },  // 14px
  labelMedium: { size: '0.75rem', weight: 500, lineHeight: 1.4 },  // 12px
  labelSmall: { size: '0.625rem', weight: 500, lineHeight: 1.4 },  // 10px
  
  // Data (monospace)
  dataLarge: { size: '1.5rem', weight: 600, lineHeight: 1 },   // 24px
  dataMedium: { size: '1rem', weight: 500, lineHeight: 1 },    // 16px
  dataSmall: { size: '0.75rem', weight: 500, lineHeight: 1 },  // 12px
};
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
};
```

---

## Spacing System

### Base Unit: 4px

```typescript
export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

### Layout Grid

```
Canvas Area: 60-70% width
Side Panel: 30-40% width (min 320px)
Header: 64px height
Footer/Controls: 48px height
Padding: 16-24px
```

---

## Component Styles

### Cards

```tsx
// Base card
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
  {children}
</div>

// Elevated card
<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
  {children}
</div>

// Interactive card
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 
                hover:shadow-md hover:border-gray-300 
                transition-all duration-200 cursor-pointer">
  {children}
</div>
```

### Buttons

```tsx
// Primary button
<button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg
                   hover:bg-blue-600 active:bg-blue-700
                   transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed">
  Action
</button>

// Secondary button
<button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg
                   hover:bg-gray-200 active:bg-gray-300
                   transition-colors duration-150">
  Secondary
</button>

// Ghost button
<button className="px-4 py-2 text-gray-600 font-medium rounded-lg
                   hover:bg-gray-100 active:bg-gray-200
                   transition-colors duration-150">
  Ghost
</button>

// Icon button
<button className="p-2 text-gray-500 rounded-lg
                   hover:bg-gray-100 hover:text-gray-700
                   transition-colors duration-150">
  <Icon size={20} />
</button>
```

### Badges

```tsx
// Trust badge
function TrustBadge({ trust }: { trust: number }) {
  const color = trustToColor(trust);
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {Math.round(trust * 100)}%
    </span>
  );
}

// Category badge
function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: colors.bg, color: colors.dark }}
    >
      {category}
    </span>
  );
}
```

### Progress Bars

```tsx
// Trust bar
function TrustBar({ trust }: { trust: number }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-300"
        style={{ 
          width: `${trust * 100}%`,
          backgroundColor: trustToColor(trust)
        }}
      />
    </div>
  );
}

// Resource bar
function ResourceBar({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  return (
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
```

---

## Canvas Rendering

### Node Styles

```typescript
// Actor node rendering
function drawActorNode(
  ctx: CanvasRenderingContext2D,
  actor: Actor,
  isSelected: boolean,
  isHovered: boolean
) {
  const { x, y } = actor.position;
  const radius = actor.size || 24;
  const trustColor = trustToHex(actor.trust);
  const categoryColor = getCategoryColor(actor.category);
  
  // Glow effect for selected
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = `${categoryColor}40`;
    ctx.fill();
  }
  
  // Hover effect
  if (isHovered && !isSelected) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = `${categoryColor}20`;
    ctx.fill();
  }
  
  // Main circle (category color)
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = categoryColor;
  ctx.fill();
  
  // Inner circle (trust color)
  ctx.beginPath();
  ctx.arc(x, y, radius - 4, 0, Math.PI * 2);
  ctx.fillStyle = trustColor;
  ctx.fill();
  
  // Trust percentage text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(actor.trust * 100)}`, x, y);
  
  // Name label
  ctx.fillStyle = '#374151';
  ctx.font = '11px Inter';
  ctx.fillText(actor.name, x, y + radius + 12);
}
```

### Edge Styles

```typescript
// Connection rendering
function drawConnection(
  ctx: CanvasRenderingContext2D,
  connection: Connection,
  actors: Map<string, Actor>
) {
  const source = actors.get(connection.sourceId);
  const target = actors.get(connection.targetId);
  if (!source || !target) return;
  
  // Line opacity based on strength
  const opacity = 0.2 + connection.strength * 0.4;
  
  // Gradient based on trust flow direction
  const gradient = ctx.createLinearGradient(
    source.position.x, source.position.y,
    target.position.x, target.position.y
  );
  gradient.addColorStop(0, trustToHex(source.trust));
  gradient.addColorStop(1, trustToHex(target.trust));
  
  ctx.beginPath();
  ctx.moveTo(source.position.x, source.position.y);
  ctx.lineTo(target.position.x, target.position.y);
  ctx.strokeStyle = gradient;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 1 + connection.strength * 2;
  ctx.stroke();
  ctx.globalAlpha = 1;
}
```

### Animation Effects

```typescript
// Pulse animation (ability activation)
function drawPulseEffect(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  progress: number, // 0-1
  color: string
) {
  const maxRadius = 100;
  const radius = maxRadius * progress;
  const opacity = 1 - progress;
  
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Wave animation (propagation)
function drawWaveEffect(
  ctx: CanvasRenderingContext2D,
  source: { x: number; y: number },
  target: { x: number; y: number },
  progress: number,
  color: string
) {
  const x = source.x + (target.x - source.x) * progress;
  const y = source.y + (target.y - source.y) * progress;
  
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// Ripple animation (network-wide effect)
function drawRippleEffect(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  progress: number,
  color: string
) {
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.2;
    const rippleProgress = (progress + offset) % 1;
    const radius = 200 * rippleProgress;
    const opacity = (1 - rippleProgress) * 0.5;
    
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
```

---

## Responsive Design

### Breakpoints

```typescript
export const BREAKPOINTS = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet portrait
  lg: 1024,  // Tablet landscape (target)
  xl: 1280,  // Desktop
  '2xl': 1536, // Large desktop
};
```

### Layout Adaptations

```tsx
// Main layout
<div className="h-screen flex flex-col">
  {/* Header */}
  <header className="h-16 flex-shrink-0">...</header>
  
  {/* Main content */}
  <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
    {/* Canvas - full width on mobile, 60-70% on tablet+ */}
    <div className="flex-1 lg:w-2/3">
      <GameCanvas />
    </div>
    
    {/* Side panel - bottom sheet on mobile, sidebar on tablet+ */}
    <div className="h-64 lg:h-full lg:w-1/3 lg:min-w-[320px]">
      <ActorPanel />
    </div>
  </main>
  
  {/* Controls */}
  <footer className="h-12 flex-shrink-0">...</footer>
</div>
```

### Touch Targets

```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Accessibility

### Color Contrast

- Text on white: minimum #4B5563 (Gray 600) - 4.7:1 ratio
- Text on colored: ensure 4.5:1 for normal, 3:1 for large text
- Use patterns/icons in addition to color for trust indicators

### Focus States

```css
/* Visible focus ring */
.focusable:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Remove default outline, add custom */
button:focus-visible,
[tabindex]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
```

### Screen Reader Support

```tsx
// Announce trust changes
<div role="status" aria-live="polite" className="sr-only">
  {`${actor.name}'s trust changed from ${oldTrust}% to ${newTrust}%`}
</div>

// Describe network state
<div aria-label={`Network with ${actors.length} actors, average trust ${avgTrust}%`}>
  <canvas ... />
</div>
```

---

## Icons

### Icon Library: Lucide React

```tsx
import { 
  Users,           // Actors
  Network,         // Connections
  Zap,             // Abilities
  TrendingDown,    // Trust decrease
  TrendingUp,      // Trust increase
  Shield,          // Defensive
  AlertTriangle,   // Warning
  CheckCircle,     // Success
  XCircle,         // Failure
  Info,            // Info
  Settings,        // Settings
  HelpCircle,      // Help
  Play,            // Start
  Pause,           // Pause
  SkipForward,     // End round
  RotateCcw,       // Undo
  Share2,          // Share
  BookOpen,        // Encyclopedia
} from 'lucide-react';

// Standard size: 20px for UI, 16px for inline
<Users size={20} className="text-gray-600" />
```

---

## Motion & Animation

### Timing Functions

```css
/* Snappy interactions */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth easing */
transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1);

/* Bounce effect */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Guidelines

- Micro-interactions: 150ms
- UI transitions: 200-300ms
- Canvas animations: 300-500ms
- Page transitions: 400-600ms

### Tailwind Animation Classes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};
```

---

*Last updated: 2025-01*
*Version: 1.0.0*
