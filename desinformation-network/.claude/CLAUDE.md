# Desinformation Network Game - Master Documentation

## Project Overview

**Desinformation Network** is an educational strategy game that simulates the spread of disinformation through a network of societal actors (media, experts, lobby groups, and organizations). Players take the role of a disinformation agent, using real-world persuasion techniques to manipulate trust levels across the network.

**Core Concept:**
- **Democracy-style complexity** - System-level strategy, not character POV
- **Educational focus** - Learn about persuasion techniques through gameplay
- **Emergent complexity** - Feedback loops, unintended consequences, defensive mechanisms
- **Infographic aesthetic** - Clean, modern, data-visualization style

**Target Platform:**
- Web (React + TypeScript + Vite)
- Tablet-optimized (iPad landscape, 1024x768+)
- Touch-first controls
- Deployed on Netlify with serverless backend

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Canvas API** for network visualization

### Backend (Netlify)
- **Netlify Functions** (Serverless API routes)
- **Upstash Redis** for seeds & quick data
- **Neon Postgres** for structured data (leaderboard, analytics)

---

## Architecture Principles

### 1. Separation of Concerns

**Game Logic is PURE TypeScript** - No React dependencies!
```
src/game-logic/
  ├── Standalone classes (Actor, Network, Ability, etc.)
  ├── No imports from React or UI libraries
  └── Testable in isolation
```

**React Components are THIN wrappers**
```
src/components/
  ├── Use hooks to interface with game logic
  ├── Handle only rendering & user interaction
  └── No business logic in components
```

### 2. Actor-Centric Design

Unlike generic "tactics," each Actor has **specific abilities** based on their role:

```typescript
MediaActor {
  abilities: [
    "Agenda setzen" (Framing + Priming)
    "Skandalisieren" (Emotional Appeal)
    "Gatekeeper spielen" (Info Suppression)
  ]
}

ExpertActor {
  abilities: [
    "Autorität untergraben" (Authority Attack)
    "Komplexität verschleiern" (False Dichotomy)
    "Zweifel säen" (Manufactured Uncertainty)
  ]
}
```

**Gameplay flow:**
1. Click on Actor → See their abilities
2. Select Ability → Choose target(s)
3. Confirm → Effect propagates through network

### 3. Persuasion Taxonomy Integration

The `src/data/persuasion/taxonomy.json` (27+ techniques) is the **scientific foundation**:

```
Persuasion Technique (from JSON)
  ↓
Game Ability (actor-specific manifestation)
  ↓
Mechanical Effects (trust, resilience, propagation)
  ↓
Educational Content (encyclopedia, tooltips)
```

**Mapping Strategy:**
- Not all techniques are direct abilities
- Some are combined (e.g., Framing + Priming = "Agenda setzen")
- Some are emergent (e.g., Illusory Truth Effect from Repetition)
- Some are context-dependent (e.g., Reactance from counter-pressure)

### 4. Backend-First Thinking

Even though initial traffic is low, we design for scale:

**Features enabled by backend:**
- Seed-based replay system (share challenges)
- Anonymous gameplay analytics (balance adjustments)
- Leaderboard (optional, later)
- Save/Load game state (cloud sync)

**Data Flow:**
```
Frontend Game State
  ↓ (on key events)
POST /.netlify/functions/analytics-record
  ↓
Aggregate in Upstash Redis / Neon Postgres
  ↓
GET /.netlify/functions/analytics-aggregate
  ↓
Inform balance decisions
```

---

## File Structure

```
desinformation-network/
├── .claude/                    # Documentation for Claude Code
│   ├── CLAUDE.md              # This file (master doc)
│   ├── ARCHITECTURE.md        # Technical deep-dive
│   ├── GAME_DESIGN.md         # Mechanics & balance
│   ├── PERSUASION_INTEGRATION.md  # Taxonomy → Game mapping
│   ├── BACKEND_API.md         # API documentation
│   └── VISUAL_STYLE_GUIDE.md  # Design system
│
├── netlify/
│   └── functions/             # Netlify serverless functions
│       ├── seed-create.ts
│       ├── seed-get.ts
│       ├── analytics-record.ts
│       └── leaderboard.ts
│
├── src/
│   ├── components/            # React UI components
│   │   ├── GameCanvas/
│   │   ├── ActorPanel/
│   │   ├── StatusDisplay/
│   │   ├── EventSystem/
│   │   ├── Encyclopedia/
│   │   └── Screens/
│   │
│   ├── game-logic/            # Pure TypeScript (NO React!)
│   │   ├── types/
│   │   ├── actors/
│   │   ├── abilities/
│   │   ├── network/
│   │   ├── effects/
│   │   ├── events/
│   │   ├── resources/
│   │   ├── seed/
│   │   └── GameState.ts
│   │
│   ├── hooks/                 # React hooks (bridge to game logic)
│   ├── services/              # API communication
│   ├── stores/                # Zustand stores
│   ├── utils/
│   └── data/                  # JSON definitions
│       ├── persuasion/
│       │   └── taxonomy.json  # Scientific persuasion data
│       └── game/
│           ├── actor-definitions.json
│           ├── ability-definitions.json
│           └── event-definitions.json
│
├── public/
├── netlify.toml
├── package.json
└── README.md
```

---

## Coding Standards

### TypeScript

**Strict mode enabled:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Naming conventions:**
- `PascalCase` for classes, interfaces, types, components
- `camelCase` for functions, variables, properties
- `UPPER_SNAKE_CASE` for constants
- `kebab-case` for file names (except components: `PascalCase.tsx`)

**Type over interface** (prefer `type` for consistency):
```typescript
// ✅ Preferred
type Actor = {
  id: string;
  name: string;
  trust: number;
};

// ❌ Avoid (unless extending)
interface Actor {
  id: string;
  name: string;
  trust: number;
}
```

**Explicit return types:**
```typescript
// ✅ Always specify return type
function calculateTrust(actor: Actor): number {
  return actor.trust * actor.resilience;
}

// ❌ Avoid implicit returns
function calculateTrust(actor: Actor) {
  return actor.trust * actor.resilience;
}
```

### React Components

**Functional components only** (no class components):
```tsx
// ✅ Preferred
export function ActorPanel({ actor }: ActorPanelProps) {
  return <div>...</div>;
}

// ❌ Avoid
export const ActorPanel: React.FC<ActorPanelProps> = ({ actor }) => {
  return <div>...</div>;
};
```

**Props destructuring:**
```tsx
// ✅ Destructure in signature
export function ActorCard({ name, trust, category }: ActorCardProps) {
  // ...
}

// ❌ Avoid props object
export function ActorCard(props: ActorCardProps) {
  const { name, trust, category } = props;
  // ...
}
```

**Co-locate related code:**
```
ActorPanel/
  ├── ActorPanel.tsx        # Main component
  ├── AbilitySelector.tsx   # Sub-component
  ├── TargetSelector.tsx    # Sub-component
  └── types.ts              # Local types
```

### CSS (Tailwind)

**Utility-first approach:**
```tsx
// ✅ Use Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md">
  ...
</div>

// ❌ Avoid custom CSS unless necessary
<div className="actor-card">
  ...
</div>
```

**Use `cn()` helper for conditional classes:**
```tsx
import { cn } from '@/utils/cn';

<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)}>
```

**Extract component variants with CVA:**
```typescript
// For complex component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva("base-button-class", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
    size: {
      sm: "px-2 py-1",
      md: "px-4 py-2",
    }
  }
});
```

### Game Logic Classes

**Immutable state updates:**
```typescript
// ✅ Return new objects
class Network {
  updateActorTrust(actorId: string, delta: number): Network {
    return new Network({
      ...this,
      actors: this.actors.map(a => 
        a.id === actorId 
          ? { ...a, trust: a.trust + delta }
          : a
      )
    });
  }
}

// ❌ Avoid mutations
class Network {
  updateActorTrust(actorId: string, delta: number): void {
    const actor = this.actors.find(a => a.id === actorId);
    actor.trust += delta; // MUTATION!
  }
}
```

**Validation & Clamping:**
```typescript
// ✅ Always validate and clamp values
function setTrust(value: number): number {
  return Math.max(0, Math.min(1, value));
}

// ✅ Throw on invalid input
function createActor(config: ActorConfig): Actor {
  if (!config.id || !config.name) {
    throw new Error('Actor must have id and name');
  }
  // ...
}
```

---

## Development Workflow

### Phase 1: Setup (Do this first!)

1. **Initialize project:**
   ```bash
   npm create vite@latest desinformation-network -- --template react-ts
   cd desinformation-network
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npm install zustand
   npm install class-variance-authority clsx tailwind-merge
   npm install lucide-react
   ```

3. **Setup Tailwind:**
   ```bash
   npx tailwindcss init -p
   ```

4. **Copy all files from this package** into the project

5. **Verify structure:**
   ```bash
   tree -L 2 -I 'node_modules'
   ```

### Phase 2: Core Development

**Work in this order:**

1. **Game Logic First** (src/game-logic/)
   - Types & interfaces
   - Actor classes
   - Ability classes
   - Network class
   - Test in isolation (no UI!)

2. **Canvas Rendering** (src/components/GameCanvas/)
   - Setup Canvas context
   - Render nodes & edges
   - Handle zoom/pan
   - Test with dummy data

3. **Game State Hook** (src/hooks/useGameState.ts)
   - Bridge between React and game logic
   - Handle rounds & updates
   - Test with console logs

4. **UI Components** (src/components/)
   - Build incrementally
   - Test each component in isolation
   - Use Storybook if needed

5. **Backend Integration** (netlify/functions/)
   - Start with seed system
   - Add analytics
   - Test with curl/Postman

### Phase 3: Testing & Iteration

**Testing strategy:**
- Unit tests for game logic (Vitest)
- Integration tests for API (Vitest + node-fetch)
- Manual testing for UI (local dev server)
- Playtest balance (iterate on numbers)

**Balance iteration:**
```bash
# 1. Collect analytics
GET /.netlify/functions/analytics-aggregate

# 2. Adjust values in JSON
src/data/game/ability-definitions.json

# 3. Test locally
npm run dev

# 4. Deploy when satisfied
git push origin main  # Auto-deploys to Netlify
```

---

## Git Workflow

**Branch strategy:**
- `main` - Production (auto-deploys to Netlify)
- `develop` - Integration branch
- `feature/*` - Feature branches

**Commit conventions:**
```
feat: Add ability cooldown system
fix: Canvas rendering bug on zoom
docs: Update GAME_DESIGN.md with new mechanics
chore: Update dependencies
refactor: Extract ability effects to separate file
test: Add tests for Network propagation
```

**Before pushing (PFLICHT):**
```bash
cd desinformation-network
npm run build      # KRITISCH: Muss ohne Fehler durchlaufen!
npm run typecheck  # No TypeScript errors
npm run lint       # Fix linting issues
```

⚠️ **WICHTIG:** `npm run build` muss IMMER vor dem Push ausgeführt werden!
- Netlify-Deployment schlägt bei TypeScript-Fehlern fehl
- Lokaler `npm run dev` zeigt nicht alle Fehler (nur Hot-Reload)
- Der Build (`tsc && vite build`) ist strenger als die IDE

**Häufige Fehlerquelle:** Lokale Interface-Kopien in Test-Dateien, die nicht mit
den Original-Typen übereinstimmen. Typen immer aus Quelldateien importieren:
```typescript
// ✅ Korrekt: Import aus Quelldatei
import { StoryAction } from '@/game-logic/StoryEngineAdapter';

// ❌ Falsch: Lokale Kopie (kann divergieren)
interface StoryAction { ... }
```

---

## Netlify Deployment

### Initial Setup

1. **Connect GitHub repo to Netlify:**
   - Go to https://app.netlify.com
   - "Add new site" → "Import from GitHub"
   - Select repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Setup Upstash Redis:**
   - Go to https://console.upstash.com
   - Create Redis database
   - Copy REST URL + Token
   - Add to Netlify Environment Variables

4. **Setup Neon Postgres:**
   - Go to https://neon.tech
   - Create project
   - Copy connection string
   - Add to Netlify Environment Variables

### Continuous Deployment

**Automatic:**
- Push to `main` → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview with unique URL

**Manual:**
```bash
netlify deploy         # Deploy preview
netlify deploy --prod  # Deploy to production
```

---

## Claude Code Usage

### Starting a new feature

1. **Read relevant docs:**
   ```
   .claude/GAME_DESIGN.md
   .claude/ARCHITECTURE.md
   ```

2. **Plan the implementation:**
   - Break into small, testable steps
   - Identify affected files
   - Consider edge cases

3. **Implement incrementally:**
   - Start with types/interfaces
   - Implement core logic
   - Add tests
   - Build UI
   - Integrate

4. **Test & verify:**
   ```bash
   npm run dev
   npm run build
   npm run typecheck
   ```

### Code-Analyse & Roadmap-Erstellung

**PFLICHT: Bei jeder Code-Analyse diese Methodik befolgen:**

**Skill verwenden:** `/code-review` - Führt interaktiv durch alle Phasen der Methodik.

Siehe `docs/CODE_REVIEW_METHODOLOGY.md` für detaillierte Checkliste.

**Kurzfassung:**
1. **Design-Docs ZUERST lesen** - Verstehe Intentionen vor Code-Analyse
2. **Bugs SELBST verifizieren** - Nie Agent-Berichte blind vertrauen
3. **"Ungenutzt" differenzieren:**
   - ORPHAN = Code da, UI fehlt → INTEGRIEREN
   - SUPERSEDED = Durch neuere Version ersetzt → REFERENZ BEHALTEN
   - EXPERIMENTAL = Alternativer Ansatz → DOKUMENTIEREN
   - PLANNED = Für zukünftige Phase → NICHT ANFASSEN
   - DEAD = Wirklich ungenutzt → ENTFERNEN
4. **Abhängigkeitsanalyse** - Wie viele Dateien betroffen?
5. **Cross-Reference** - Abgleich mit ROADMAP.md, AUDIT_REPORT, etc.

**Anti-Patterns vermeiden:**
- ❌ "Agent sagt Bug existiert" → Code nicht selbst geprüft
- ❌ "Komponente wird nicht importiert" → Als toter Code markiert
- ❌ "Einfache Änderung" → Abhängigkeiten nicht geprüft

### Common tasks

**Add new actor type:**
1. Define in `src/data/game/actor-definitions.json`
2. Create class in `src/game-logic/actors/`
3. Update factory in `actorFactory.ts`
4. Add abilities in `src/data/game/ability-definitions.json`
5. Test in isolation

**Add new ability:**
1. Define in `src/data/game/ability-definitions.json`
2. Create effect function in `src/game-logic/abilities/abilityEffects.ts`
3. Map to persuasion technique in `src/services/persuasion/TechniqueMapper.ts`
4. Add UI icon/animation
5. Playtest & balance

**Fix bug:**
1. Reproduce the bug locally
2. Add console.logs to trace
3. Identify root cause
4. Write test that fails
5. Fix bug
6. Verify test passes
7. Commit with clear message

---

## Performance Considerations

### Canvas Optimization

**Only redraw when necessary:**
```typescript
useEffect(() => {
  if (!needsRedraw) return;
  
  drawNetwork();
  setNeedsRedraw(false);
}, [gameState, needsRedraw]);
```

**Use requestAnimationFrame for animations:**
```typescript
function animateEffect(effect: Effect) {
  let frame = 0;
  const animate = () => {
    frame++;
    // Update animation
    if (frame < 60) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}
```

**Offscreen canvas for complex renders:**
```typescript
// Render static elements to offscreen canvas once
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
renderStaticElements(offscreenCtx);

// Main render: just copy from offscreen
ctx.drawImage(offscreenCanvas, 0, 0);
```

### State Management

**Zustand slices for modularity:**
```typescript
// Separate stores for different concerns
const useGameStore = create<GameStore>((set) => ({ ... }));
const useUIStore = create<UIStore>((set) => ({ ... }));
const useAnalyticsStore = create<AnalyticsStore>((set) => ({ ... }));
```

**Memoize expensive computations:**
```typescript
const connections = useMemo(
  () => calculateConnections(actors),
  [actors] // Only recalculate when actors change
);
```

---

## Troubleshooting

### Common Issues

**Canvas not rendering:**
- Check canvas dimensions are set
- Verify Canvas ref is attached
- Check if drawNetwork() is called
- Look for JS errors in console

**TypeScript errors:**
- Run `npm run typecheck` for full report
- Check all imports are correct
- Verify types match expected shapes
- Use `// @ts-expect-error` with comment if unavoidable

### TypeScript Type Safety - Recurring Bug Prevention

**CRITICAL: Diese Fehler traten beim Netlify-Build auf und müssen vermieden werden:**

1. **Mixed Union Types in Conditions:**
   ```typescript
   // ❌ FALSCH: Condition kann string oder Condition-Objekt sein
   if (!this.evaluateCondition(reaction.condition, context)) continue;

   // ✅ RICHTIG: Separate Methode für gemischte Typen
   private evaluateMixedCondition(
     condition: string | Condition,
     context: Record<string, unknown>
   ): boolean {
     if (typeof condition === 'string') {
       return this.evaluateCondition(condition, context);
     }
     // Handle Condition object...
   }
   ```

2. **Interface-zu-Record Konvertierung:**
   ```typescript
   // ❌ FALSCH: Interface kann nicht direkt zu Record<string, unknown> gecastet werden
   const result = this.evaluateCondition(cond, context as Record<string, unknown>);

   // ✅ RICHTIG: Explizite Konvertierung der Felder
   private evaluateLegacyCondition(condition: string, context: DialogueContext): boolean {
     const contextRecord: Record<string, unknown> = {
       phase: context.phase,
       risk: context.risk,
       // ... alle Felder explizit kopieren
     };
     return this.evaluateCondition(condition, contextRecord);
   }
   ```

3. **Array.includes() mit union types:**
   ```typescript
   // ❌ FALSCH: string | string[] | [number, number] - includes weiß nicht welcher Typ
   return clause.value.includes(value);

   // ✅ RICHTIG: Expliziter Cast zu unknown[]
   return (clause.value as unknown[]).includes(value);
   ```

4. **Nicht-existierende Methoden aufrufen:**
   ```typescript
   // ❌ FALSCH: Methode updateNPCRelationship existiert nicht (nur updateNPCRelationships)
   this.updateNPCRelationship(npcId, delta);

   // ✅ RICHTIG: Logik inline implementieren oder richtige Methode verwenden
   npc.relationshipProgress += delta;
   if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
     npc.relationshipLevel++;
     npc.relationshipProgress -= 100;
   }
   ```

**Vor jedem Commit prüfen:**
```bash
npx tsc --noEmit  # Muss ohne Fehler durchlaufen!
```

**Netlify build fails:**
- Check build logs in Netlify dashboard
- Verify all dependencies in package.json
- Test build locally: `npm run build`
- Check for missing environment variables

**Function returns 500:**
- Check Netlify function logs
- Verify Redis/Postgres connections
- Test with curl locally using `netlify dev`
- Add error handling & logging

---

## Resources

### Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Upstash Redis](https://docs.upstash.com/)
- [Neon Postgres](https://neon.tech/docs)

### Persuasion Taxonomy
- Located in `src/data/persuasion/taxonomy.json`
- See `PERSUASION_INTEGRATION.md` for mapping details
- Educational content extracted to encyclopedia component

### Design References
- [Democracy game](https://store.steampowered.com/app/245470/Democracy_3/) - Complexity inspiration
- [Our World in Data](https://ourworldindata.org/) - Infographic style
- [Observable](https://observablehq.com/) - Data viz inspiration

---

## Contact & Support

**Project Owner:** (Add your contact info)

**For Claude Code:**
- Read docs in `.claude/` before starting work
- Break large features into small PRs
- Test thoroughly before committing
- Ask clarifying questions in comments

**For Contributors:**
- Follow coding standards
- Write clear commit messages
- Update docs when changing architecture
- Add tests for new features

---

*Last updated: 2025-01*
*Version: 1.0.0*
