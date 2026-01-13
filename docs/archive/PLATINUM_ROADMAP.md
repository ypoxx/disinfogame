# Platinum-Level Gameplay Roadmap

This document tracks the implementation status of platinum-level gameplay features for Story Mode.

## Implemented Features (Ready to Use)

### 1. Sound System (Platinum Extension)
**Location:** `src/story-mode/utils/SoundSystem.ts`

New sound types added:
- `combo` - Triumphant sound for combo completion
- `crisis` - Ominous sound for crisis moments
- `betrayal` - Dissonant sound for NPC betrayal
- `moralShift` - Dark sound for morally heavy actions
- `opportunityOpen` - Hopeful sound for opportunity windows
- `countermeasure` - Threatening sound for enemy countermeasures
- `worldEvent` - Notification for major world events

### 2. Taxonomy System
**Location:** `src/story-mode/engine/TaxonomyLoader.ts`

Links game actions to real-world persuasion research:
- Maps action IDs and tags to taxonomy technique IDs
- Provides `TaxonomyInfo` with techniques, counter-strategies, and evidence
- Educational value: players learn about real manipulation techniques

Usage in adapter:
```typescript
const taxonomy = adapter.getTaxonomyForAction(actionId);
const display = adapter.getActionTaxonomyDisplay(actionId, 'de');
```

### 3. Opportunity Windows
**Location:** `src/game-logic/StoryEngineAdapter.ts` (integrated)

Time-limited windows that boost action effectiveness:
- Created automatically from world event effects
- Types: elections, crisis, scandal, protest, extremism, division, etc.
- Each window has: effectiveness multiplier, cost reduction, risk reduction
- Windows expire after a configurable duration (default 6 phases)

Usage:
```typescript
const windows = adapter.getActiveOpportunityWindows();
const modifiers = adapter.getOpportunityModifiers(actionId, tags, phase);
// modifiers.effectivenessMultiplier, costMultiplier, riskMultiplier
```

### 4. Combo System
**Location:** `src/story-mode/engine/StoryComboSystem.ts`

Discoverable action combos with bonuses:
- 15 combo definitions from `combo-definitions.json`
- Combos are discovered when 50%+ complete (not shown beforehand)
- Each combo requires specific action sequences
- Bonuses: trust reduction, risk reduction, budget refunds, etc.

Design Decision: Combos are meant to be discovered, not planned upfront.

Usage:
```typescript
const hints = adapter.getActiveComboHints();
const stats = adapter.getComboStats();
// Combos are processed automatically in executeAction
```

### 5. Crisis Moments (Event Chains)
**Location:** `src/story-mode/engine/CrisisMomentSystem.ts`

Critical decision points with lasting consequences:
- Triggered by game conditions (risk level, phase, actions)
- Player must choose from 2-3 options
- Each choice has different costs and effects
- Some crises chain to follow-up crises
- Auto-resolution if player doesn't choose before deadline

Usage:
```typescript
const crises = adapter.getActiveCrises();
const urgent = adapter.getMostUrgentCrisis();
const resolution = adapter.resolveCrisis(crisisId, choiceId);
```

---

## Pending Features (Documentation for Future Implementation)

### 6. Actor-AI (Arms Race)
**Source:** `src/game-logic/actor-ai.ts` (existing file, needs integration)

The Actor-AI system simulates dynamic opposition that evolves based on player actions.

**Key Concepts:**
- Defensive actors spawn based on player behavior
- Opposition intelligence increases over time
- Counter-tactics become more sophisticated
- Creates "arms race" dynamic

**Integration Points:**
```typescript
// In StoryEngineAdapter
private actorAI: ActorAI;

// In advancePhase()
const aiActions = this.actorAI.computeDefensiveActions(gameState);
this.applyAIActions(aiActions);

// AI should:
// - Spawn fact-checkers when disinformation is high
// - Deploy platform moderation when bot activity detected
// - Initiate investigations when risk is high
// - Counter specific narratives with debunking
```

**Design Decision:** The AI should feel like a worthy opponent, not a rubber-band difficulty system.

### 7. Betrayal Warning Signs
**Based on:** User research on authoritarian collapse patterns

NPC betrayal should follow observable patterns:
1. **Early Warning (Morale < 40):**
   - Dialogue hints at discomfort
   - Slower response times
   - Reluctant cooperation

2. **Mid Warning (Morale < 25 + High Moral Weight):**
   - Direct questions about ethics
   - Missed deadlines
   - Errors in work

3. **Critical Warning (Morale < 15):**
   - Evasive behavior
   - Contact with external parties
   - Last chance to address concerns

4. **Betrayal Trigger:**
   - Player ignored warnings
   - Specific moral threshold crossed
   - NPC's personal red line violated

**Implementation:**
```typescript
interface BetrayalState {
  warningLevel: 0 | 1 | 2 | 3;  // None, Early, Mid, Critical
  warningsShown: string[];
  betrayalRisk: number;  // 0-100
  personalRedLines: string[];  // Moral categories that trigger
}

// Check in advancePhase() or after morally heavy actions
checkBetrayalWarnings(npc: NPCState): BetrayalWarning | null;
```

### 8. Modular Ending System
**Design:** Multiple endings based on game state, not single victory/defeat

**Ending Axes:**
1. **Mission Success** (0-100)
   - Based on objective completion
   - Westunion destabilization level

2. **Player Exposure** (0-100)
   - Based on risk level at end
   - Determines personal fate

3. **Moral Weight** (0-100)
   - Cumulative ethical cost
   - Affects ending tone

4. **NPC Outcomes**
   - Who remained loyal
   - Who betrayed
   - Who was sacrificed

**Ending Categories:**
- **Victory + Safe + Low Moral:** Clean win, player stays hidden
- **Victory + Exposed + Low Moral:** Mission success, player caught but satisfied
- **Victory + Safe + High Moral:** Hollow victory, player questions everything
- **Victory + Exposed + High Moral:** Exposed and regretful
- **Partial + Safe:** Escaped but didn't achieve goals
- **Failure + Exposed:** Complete failure and exposure
- **Early Exit:** Player chose to abort mission

**Implementation:**
```typescript
interface EndingState {
  category: EndingCategory;
  missionSuccess: number;
  exposureLevel: number;
  moralWeight: number;
  npcOutcomes: Record<string, 'loyal' | 'betrayed' | 'sacrificed' | 'escaped'>;
  keyEvents: string[];  // Notable moments from the game
}

calculateEnding(): EndingState;
getEndingNarrative(state: EndingState): EndingNarrative;
```

### 9. Additional Enhancements (Nice-to-Have)

**Narrative Generator:**
- Source: `src/game-logic/narrative-generator.ts`
- Purpose: Generate dynamic flavor text for actions and events
- Integration: Add to action results and news events

**Event Consequences:**
- Source: `src/data/game/event-consequences.json`
- Purpose: Deeper consequence chains from world events
- Integration: Extend ConsequenceSystem

**Regional Targeting:**
- The world-events.json already has 6 member states defined
- Actions could be targeted at specific regions
- Regional effects accumulate differently

---

## Architecture Notes

### State Management
All new systems follow the pattern:
```typescript
class System {
  // Core logic

  exportState(): StateType { ... }
  importState(state: StateType): void { ... }
  reset(): void { ... }
}
```

The StoryEngineAdapter manages all systems and handles:
- Initialization in constructor
- State persistence in saveState/loadState
- Cleanup in reset()
- Integration in advancePhase() and executeAction()

### Event Flow
1. **Player Action** -> executeAction()
   - Deduct costs
   - Apply effects
   - Check combos
   - Update NPCs

2. **Phase Advance** -> advancePhase()
   - Regenerate resources
   - Check consequences
   - Generate world events
   - Create opportunity windows
   - Check for crises
   - Cleanup expired items

3. **Crisis Resolution** -> resolveCrisis()
   - Apply chosen effects
   - Chain to follow-up crises
   - Update news

### Sound Integration
Play sounds at dramatic moments:
- `playSound('combo')` - When combo completes
- `playSound('crisis')` - When crisis triggers
- `playSound('opportunityOpen')` - When window opens
- `playSound('moralShift')` - For morally heavy actions
- `playSound('worldEvent')` - For significant events

---

## Files Reference

**New Files Created:**
- `src/story-mode/engine/TaxonomyLoader.ts`
- `src/story-mode/engine/StoryComboSystem.ts`
- `src/story-mode/engine/CrisisMomentSystem.ts`

**Modified Files:**
- `src/story-mode/utils/SoundSystem.ts` - Added 7 new sounds
- `src/story-mode/engine/index.ts` - Exports new systems
- `src/game-logic/StoryEngineAdapter.ts` - Full integration

**Existing Files to Integrate:**
- `src/game-logic/actor-ai.ts` - For Arms Race
- `src/game-logic/narrative-generator.ts` - For dynamic text
- `src/data/game/event-consequences.json` - For deeper consequences

---

*Last Updated: Session implementing platinum features*
