# Claude Code Prompt: UI/UX Redesign Implementation

> **Kopiere diesen Prompt in Claude Code Sonnet 4.5**
> **Projekt**: `/home/user/disinfogame/desinformation-network`

---

## SYSTEM CONTEXT

```
Du bist ein Senior UI/UX Engineer mit Expertise in:
- React + TypeScript
- HTML5 Canvas Rendering
- Game UI Design Patterns
- CSS Architecture (z-index, layouts)

Deine Aufgabe: Implementiere das UI/UX Redesign für das Desinformation Network Game.
Arbeite systematisch durch die Tasks. Committe nach jedem abgeschlossenen Task.
```

---

## PROJEKT-KONTEXT

<project_info>
- Framework: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- Canvas: Native HTML5 Canvas (kein Konva/Fabric)
- State: Custom useGameState Hook
- Hauptdateien:
  - `src/App.tsx` - Haupt-Layout
  - `src/components/NetworkVisualization.tsx` - Canvas-Rendering
  - `src/components/CompactSidePanel.tsx` - Actor-Panel rechts
  - `src/components/NotificationToast.tsx` - Toast-System
  - `src/index.css` - Globale Styles
</project_info>

---

## TASKS (in Reihenfolge ausführen)

### TASK 1: Z-Index System

<task_instructions>
1. Öffne `src/index.css`
2. Füge am Anfang hinzu:
```css
:root {
  /* Z-Index Layer System */
  --z-canvas: 0;
  --z-overlay: 10;
  --z-panel: 20;
  --z-hud: 30;
  --z-notification: 40;
  --z-modal: 50;
  --z-tooltip: 60;
}
```

3. Ersetze in allen Dateien hardcoded z-index:
   - `z-20` → `z-[var(--z-overlay)]`
   - `z-30` → `z-[var(--z-panel)]`
   - `z-40` → `z-[var(--z-hud)]`
   - `z-50` → `z-[var(--z-modal)]` oder `z-[var(--z-tooltip)]`

4. Durchsuche: `grep -r "z-[0-9]" src/`
5. Ersetze alle Fundstellen
</task_instructions>

<acceptance_criteria>
- Keine hardcoded z-index Werte in TSX-Dateien
- CSS-Variablen in :root definiert
</acceptance_criteria>

**Nach Abschluss**: `git commit -m "refactor: implement z-index layer system"`

---

### TASK 2: Unified Right Panel

<task_instructions>
1. Erstelle `src/components/UnifiedRightPanel.tsx`:

```typescript
import { useState } from 'react';
import type { Actor, Ability, Resources } from '@/game-logic/types';
import { VictoryProgressBar } from './VictoryProgressBar';
import { trustToHex } from '@/utils/colors';

type Props = {
  // Game State
  round: number;
  maxRounds: number;
  resources: Resources;
  networkMetrics: {
    averageTrust: number;
    lowTrustCount: number;
    highTrustCount: number;
    polarizationIndex: number;
  };
  totalActors: number;
  victoryThreshold: number;
  trustThreshold: number;

  // Actor State
  selectedActor: Actor | null;
  abilities: Ability[];
  selectedAbilityId: string | null;
  targetingMode: boolean;

  // Callbacks
  onAdvanceRound: () => void;
  onSelectAbility: (id: string) => void;
  onCancel: () => void;
  canUseAbility: (ability: Ability) => { canUse: boolean; reason?: string };
};

export function UnifiedRightPanel({ ... }: Props) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className={`
      fixed top-0 right-0 bottom-0
      ${isMinimized ? 'w-16' : 'w-80'}
      bg-gray-900/95 backdrop-blur-md
      border-l border-gray-700/50
      z-[var(--z-panel)]
      flex flex-col
      transition-all duration-300
    `}>
      {/* HEADER: Round + Victory */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Round</span>
          <span className="text-lg font-bold text-white">{round}/{maxRounds}</span>
        </div>
        <VictoryProgressBar
          metrics={networkMetrics}
          round={round}
          maxRounds={maxRounds}
          victoryThreshold={victoryThreshold}
          trustThreshold={trustThreshold}
          compact={true}  // Neue Prop für kompakte Darstellung
        />
      </div>

      {/* RESOURCES */}
      <div className="px-4 py-3 border-b border-gray-700/50">
        <div className="flex justify-between text-sm">
          <span className="text-yellow-400">💰 {resources.money}</span>
          <span className="text-red-400">👁️ {Math.round(resources.attention)}</span>
          <span className="text-purple-400">🔧 {resources.infrastructure}</span>
        </div>
      </div>

      {/* END ROUND BUTTON */}
      <div className="p-4 border-b border-gray-700/50">
        <button
          onClick={onAdvanceRound}
          className="w-full py-3 bg-green-600 hover:bg-green-500
                     text-white font-semibold rounded-lg
                     transition-all hover:shadow-lg hover:shadow-green-600/30"
        >
          End Round →
        </button>
      </div>

      {/* ACTOR DETAILS (scrollable) */}
      <div className="flex-1 overflow-y-auto">
        {selectedActor ? (
          <ActorDetails
            actor={selectedActor}
            abilities={abilities}
            // ... weitere Props
          />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">👆</div>
            <p>Click an actor to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

2. Modifiziere `App.tsx`:
   - Entferne Top-Right HUD (`fixed top-6 right-6 z-40`)
   - Entferne separaten CompactSidePanel-Import
   - Importiere und nutze `UnifiedRightPanel`
   - Passe Canvas-Container an: `right-[320px]`

3. Migriere `CompactSidePanel.tsx` Inhalte als `ActorDetails` Sub-Komponente
</task_instructions>

<acceptance_criteria>
- Nur EIN Panel auf der rechten Seite
- Victory Progress im Panel-Header integriert
- Resources im Panel sichtbar
- End Round Button prominent
- Actor Details bei Auswahl angezeigt
- Kein Top-Right HUD mehr
</acceptance_criteria>

**Nach Abschluss**: `git commit -m "feat: implement unified right panel layout"`

---

### TASK 3: Remove Legacy EventNotification

<task_instructions>
1. In `App.tsx`:
   - Lösche Import: `import { EventNotification } from '@/components/EventNotification';`
   - Lösche JSX Block (ca. Zeile 592-596):
   ```tsx
   {uiState.currentEvent && (
     <EventNotification ... />
   )}
   ```

2. Lösche Datei: `rm src/components/EventNotification.tsx`

3. In `NotificationToast.tsx`:
   - Ändere Position von `bottom-6 right-6` zu `bottom-6 left-6`
   - Ändere `maxVisible` default von 3 auf 2
   - Ändere default duration von 5000 auf 3500

4. In `App.tsx` Toast-Aufruf:
   - Prüfe dass Events über UnifiedRoundModal oder Toast-System laufen
</task_instructions>

<acceptance_criteria>
- EventNotification.tsx existiert nicht mehr
- Toasts erscheinen unten-links
- Max 2 Toasts gleichzeitig
- Kürzere Toast-Dauer (3.5s)
</acceptance_criteria>

**Nach Abschluss**: `git commit -m "refactor: consolidate notification system, remove legacy EventNotification"`

---

### TASK 4: Constrained Category Layout

<task_instructions>
1. Erstelle `src/utils/constrainedLayout.ts`:

```typescript
export interface CategoryConstraint {
  center: { x: number; y: number };
  radius: number;
}

export const CATEGORY_LAYOUT: Record<string, { rx: number; ry: number }> = {
  media: { rx: 0.25, ry: 0.3 },
  expert: { rx: 0.75, ry: 0.3 },
  lobby: { rx: 0.25, ry: 0.7 },
  organization: { rx: 0.75, ry: 0.7 },
  defensive: { rx: 0.5, ry: 0.5 },
};

export function getCategoryConstraint(
  category: string,
  canvasWidth: number,
  canvasHeight: number
): CategoryConstraint {
  const layout = CATEGORY_LAYOUT[category] || { rx: 0.5, ry: 0.5 };
  const radius = Math.min(canvasWidth, canvasHeight) * 0.14; // 14% of smaller dimension

  return {
    center: {
      x: layout.rx * canvasWidth,
      y: layout.ry * canvasHeight,
    },
    radius,
  };
}

export function constrainPositionToCategory(
  position: { x: number; y: number },
  constraint: CategoryConstraint,
  padding: number = 0.85 // 85% of radius to keep actors inside
): { x: number; y: number } {
  const dx = position.x - constraint.center.x;
  const dy = position.y - constraint.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = constraint.radius * padding;

  if (distance <= maxDistance) {
    return position;
  }

  // Project back onto circle boundary
  const scale = maxDistance / distance;
  return {
    x: constraint.center.x + dx * scale,
    y: constraint.center.y + dy * scale,
  };
}

export function calculateConstrainedPositions(
  actors: Array<{ id: string; category: string; position: { x: number; y: number } }>,
  canvasWidth: number,
  canvasHeight: number
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  actors.forEach(actor => {
    const constraint = getCategoryConstraint(actor.category, canvasWidth, canvasHeight);
    const constrainedPos = constrainPositionToCategory(actor.position, constraint);
    positions.set(actor.id, constrainedPos);
  });

  return positions;
}
```

2. In `NetworkVisualization.tsx`:
   - Importiere constrainedLayout utils
   - Modifiziere `getActorPosition`:
   ```typescript
   const getActorPosition = useCallback((actor: Actor) => {
     const constraint = getCategoryConstraint(actor.category, canvasSize.width, canvasSize.height);
     return constrainPositionToCategory(actor.position, constraint);
   }, [canvasSize]);
   ```

3. Verstärke Kategoriekreis-Visualisierung:
   - Erhöhe Fill-Opacity von 0.08 auf 0.12
   - Füge inneren Schatten hinzu (radial gradient)
   - Dickere Umrandung (3px statt 2px)
</task_instructions>

<acceptance_criteria>
- Alle Akteure sind visuell innerhalb ihrer Kategoriekreise
- Kategoriekreise sind als "Container" erkennbar
- Force-Layout Positionen werden constrainted
- Defensive Actors bleiben im Zentrum
</acceptance_criteria>

**Nach Abschluss**: `git commit -m "feat: implement constrained category layout for actors"`

---

### TASK 5: Visual Polish

<task_instructions>
1. In `src/index.css`, füge Design-System hinzu:

```css
:root {
  /* ... existing z-index vars ... */

  /* Color System */
  --color-surface-base: 220 20% 10%;
  --color-surface-elevated: 220 20% 14%;
  --color-surface-overlay: 220 20% 18%;

  --color-border-subtle: 220 20% 50% / 0.15;
  --color-border-default: 220 20% 50% / 0.25;

  --color-trust-high: 142 71% 45%;
  --color-trust-medium: 45 93% 47%;
  --color-trust-low: 0 84% 60%;

  --color-accent-primary: 217 91% 60%;
}

/* Interactive Elements */
.interactive {
  @apply transition-all duration-150 ease-out;
}

.interactive:hover {
  @apply -translate-y-0.5;
}

.interactive:active {
  @apply scale-[0.98];
}

/* Card Style */
.card {
  @apply bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50;
}

.card-elevated {
  @apply bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-xl;
}
```

2. Wende `.interactive` Klasse auf alle Buttons an
3. Wende `.card` / `.card-elevated` auf Panel-Sections an
4. Stelle sicher: Alle Trust-Farben nutzen konsistente Werte
</task_instructions>

<acceptance_criteria>
- CSS-Variablen für Farben definiert
- Konsistente Hover/Active-States
- Card-Styles für Panel-Sections
- 150ms Transitions
</acceptance_criteria>

**Nach Abschluss**: `git commit -m "style: implement design system with consistent colors and interactions"`

---

## VALIDATION CHECKLIST

Nach Abschluss aller Tasks, prüfe:

```bash
# 1. Build ohne Errors
npm run build

# 2. TypeScript Check
npm run typecheck

# 3. Keine hardcoded z-index mehr
grep -r "z-[0-9][0-9]" src/ --include="*.tsx" | grep -v "z-\[var"

# 4. Visueller Test
npm run dev
# Prüfe:
# - [ ] Unified Panel rechts (kein Overlap)
# - [ ] Actors in Kategoriekreisen
# - [ ] Toasts unten-links
# - [ ] Smooth Hover-Transitions
```

---

## FINAL COMMIT

```bash
git add -A
git commit -m "feat: complete UI/UX redesign - unified panel, constrained layout, consolidated notifications"
```

---

## WICHTIGE HINWEISE

<rules>
1. Führe Tasks in der angegebenen Reihenfolge aus
2. Committe nach JEDEM abgeschlossenen Task
3. Bei Fehlern: Behebe sie bevor du fortfährst
4. Teste visuell nach Tasks 2, 3, 4
5. Keine neuen Features hinzufügen - nur das Beschriebene implementieren
6. Behalte bestehende Funktionalität bei
</rules>

<do_not>
- Keine neuen npm packages installieren
- Keine Änderungen an GameState-Logik (nur Layout)
- Keine Änderungen an Ability/Combat-System
- Keine neuen Dateien außer den beschriebenen
</do_not>
