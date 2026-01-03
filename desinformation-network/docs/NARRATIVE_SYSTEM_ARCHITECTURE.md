# NARRATIVE SYSTEM ARCHITECTURE
## Systematische Querverbindungen: "Alles hängt mit allem zusammen"

**Status:** In Development
**Ziel:** Emergentes, holistisches Narrative-System mit vollständigen Feedback-Loops
**Prinzip:** "Wie im Leben - systematisch zusammenhängend"

---

## VISION: DER PERFEKTE ALGORITHMUS

Das Narrative System soll ein **lebendiges Ökosystem** sein, wo:
- Jede Aktion Wellen schlägt
- Charaktere auf die Welt reagieren
- Die Welt auf Charaktere reagiert
- Konsequenzen sich akkumulieren
- Patterns erkannt und bestraft/belohnt werden
- Zeit echte Bedeutung hat

**Technisch:** 10 Subsysteme bilden einen vollständig vernetzten Graph mit Feedback-Loops.

---

## ARCHITEKTUR-ÜBERSICHT

### Aktuelle Systeme (10 Subsysteme)

```
┌─────────────────────────────────────────────────────────────┐
│                   STORY ENGINE ADAPTER                       │
│                   (Zentrale Orchestrierung)                  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐           ┌────▼────┐          ┌────▼────┐
   │  NPC    │           │ ACTION  │          │ PHASE   │
   │ SYSTEM  │◄─────────►│ SYSTEM  │◄─────────┤ SYSTEM  │
   └────┬────┘           └────┬────┘          └────┬────┘
        │                     │                     │
        │    ┌────────────────┴──────┐              │
        │    │   NEWS/EVENTS HUB     │◄─────────────┤
        │    │  (Narrative Nexus)    │              │
        │    └───────────┬───────────┘              │
        ▼                ▼                           ▼
   ┌────────┐      ┌─────────┐               ┌──────────┐
   │BETRAYAL│◄─────┤ CRISIS  │◄──────────────┤RESOURCE  │
   │ SYSTEM │      │ SYSTEM  │               │ SYSTEM   │
   └────────┘      └─────────┘               └──────────┘
        │                │                          │
        └────────────────┼──────────────────────────┘
                         ▼
                  ┌─────────────┐
                  │ CONSEQUENCE │
                  │   SYSTEM    │
                  └─────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                                 │
   ┌────▼────┐                      ┌────▼────┐
   │  COMBO  │                      │EXTENDED │
   │ SYSTEM  │                      │ ACTORS  │
   └─────────┘                      └─────────┘
```

**Legende:**
- `─►` = Existierende Verbindung
- `◄─►` = Bidirektionale Verbindung

---

## SUBSYSTEM DETAILS

### 1. NPC SYSTEM
**Location:** `src/game-logic/StoryEngineAdapter.ts` (Lines 520-2300)

**State:**
```typescript
interface NPCState {
  id: string;
  name: string;
  relationshipLevel: 0-3;        // Vertrauensstufen
  relationshipProgress: 0-100;    // Punkte zur nächsten Stufe
  morale: 0-100;                  // Moral (beeinflusst durch dark actions)
  inCrisis: boolean;              // Persönliche Krise
  currentMood: 'positive' | 'neutral' | 'worried' | 'hostile';
  specialtyAreas: string[];       // Expertise-Bereiche
  enhancedActions: string[];      // Verstärkte Actions
}
```

**Existierende Connections:**
- ✅ Actions (npc_affinity) → Relationship +10
- ✅ Actions (moral_weight ≥ 3) → Morale -X
- ✅ Morale < 30 → Crisis Trigger
- ✅ Relationship Level Up → Sound + Mood Update

**Fehlende Connections:**
- ❌ World Events → NPC Reactions
- ❌ Consequences → Morale Impact
- ❌ NPC Crisis → News Generation
- ❌ Phase Milestones → Relationship Evolution

---

### 2. ACTION SYSTEM
**Location:** `src/story-mode/data/actions.json`

**Structure:**
```typescript
interface StoryAction {
  id: string;
  phase: string;                  // ta01-ta07, targeting
  costs: {
    budget: number;
    capacity: number;
    risk: number;
    attention: number;
    moralWeight: number;
  };
  effects: {
    influence?: number;
    momentum?: number;
  };
  npcAffinity: string[];          // NPCs die diese Action mögen
  tags: string[];                 // 'bot', 'propaganda', 'violent', etc.
  legality: 'legal' | 'grey' | 'illegal';
}
```

**Existierende Connections:**
- ✅ Actions → Resources (Costs/Effects)
- ✅ Actions → NPC Affinity (Relationship Bonus)
- ✅ Actions → Consequences (Trigger-System)
- ✅ Actions → Combos (Sequence Recognition)

**Fehlende Connections:**
- ❌ Actions → News Generation (CRITICAL!)
- ❌ Action Tags → Event Triggers
- ❌ Action Frequency → Escalation
- ❌ Action Success → Phase Progression

---

### 3. NEWS/EVENTS SYSTEM (TARGET: NARRATIVE HUB)
**Location:** `src/story-mode/data/world-events.json` + `StoryEngineAdapter.generateWorldEvents()`

**Current State:**
```typescript
interface NewsEvent {
  id: string;
  phase: number;
  headline_de: string;
  headline_en: string;
  type: 'world_event' | 'consequence' | 'action_result' | 'crisis';
  severity: 'info' | 'success' | 'warning' | 'danger';
  scale: 'local' | 'regional' | 'national' | 'transnational';
}
```

**Existierende Connections:**
- ✅ Phase → World Events (Periodic Generation)
- ✅ Risk/Attention Thresholds → Events
- ✅ Events → Opportunity Windows
- ✅ Events → Cascade Chains

**Fehlende Connections (TARGET HUB):**
- ❌ Actions → News (PIPELINE 1 - Priority!)
- ❌ Events → NPC Reactions (PIPELINE 2 - Priority!)
- ❌ Consequences → News
- ❌ Combos → News
- ❌ NPC Crisis → News
- ❌ Resource Trends → Dynamic Events

---

### 4. PHASE SYSTEM
**Location:** `StoryEngineAdapter.advancePhase()` (Lines 605-783)

**Structure:**
```typescript
interface StoryPhase {
  number: 1-120;                  // 10 Jahre × 12 Monate
  year: 1-10;
  month: 1-12;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isNewYear: boolean;
}
```

**Phase Pipeline (advancePhase):**
1. Phase increment
2. Opportunity Windows cleanup
3. Combo Progress cleanup
4. Resource regeneration (Budget +5, Capacity +2, Risk/Attention -2)
5. Consequence activation
6. World Events generation
7. Crisis checks
8. AI defensive actions

**Existierende Connections:**
- ✅ Phase → Resource Regen
- ✅ Phase → Consequence Triggers
- ✅ Phase → World Events
- ✅ Phase → Crisis Checks

**Fehlende Connections:**
- ❌ Phase Milestones → Narrative Events (Jahr 1/5/10)
- ❌ Season → Themed Events
- ❌ Phase → NPC Development Arcs
- ❌ Phase → Story Act Structure (3-Act)

---

### 5. RESOURCE SYSTEM
**Location:** `StoryEngineAdapter` (Resource Management)

**Resources:**
```typescript
interface StoryResources {
  // Aktive (ausgegeben)
  budget: number;                 // 💰 Geld
  capacity: number;               // ⚡ Kapazität

  // Passive (akkumulieren)
  risk: number;                   // ⚠️ Entdeckungsrisiko
  attention: number;              // 👁️ Gegner-Aufmerksamkeit
  moralWeight: number;            // 💀 Moralische Last

  // Meta
  actionPointsRemaining: number;
}
```

**Existierende Connections:**
- ✅ Actions → Resource Costs
- ✅ Resources → Action Availability
- ✅ Risk → AI Counter-Actions
- ✅ Attention → World Events (Threshold)
- ✅ Moral Weight → NPC Morale

**Fehlende Connections:**
- ❌ Risk → NPC Paranoia Dialogues
- ❌ Moral Weight → Dialogue Variations
- ❌ Resource Trends → Dynamic News
- ❌ Low Resources → Crisis Triggers

---

### 6. CRISIS SYSTEM
**Location:** `src/story-mode/engine/CrisisMomentSystem.ts`

**Structure:**
```typescript
interface CrisisMoment {
  id: string;
  name_de: string;
  choices: CrisisChoice[];        // Player decisions
  chainTo?: string;               // Follow-up crisis
  deadline?: number;              // Auto-resolve timer
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

**Existierende Connections:**
- ✅ Phase + Risk/Attention → Crisis Triggers
- ✅ Crisis → Player Choices
- ✅ Crisis → Chain Events
- ✅ Crisis → AI Defenders

**Fehlende Connections:**
- ❌ Crisis Resolution → NPC Reactions (PIPELINE 2)
- ❌ NPC Crisis → System Crisis
- ❌ Crisis → Phase Arc Impact
- ❌ Crisis Chains → Betrayal System

---

### 7. CONSEQUENCE SYSTEM
**Location:** `src/story-mode/engine/ConsequenceSystem.ts` + `consequences.json`

**Structure:**
```typescript
interface ConsequenceDefinition {
  triggered_by: string[];         // Action IDs
  delay: {
    min_phases: number;
    max_phases: number;
  };
  probability: {
    base: number;
    per_use_increase: number;     // Repeated actions = more likely
    risk_multiplier: number;
    attention_multiplier: number;
  };
  effects: ConsequenceEffects;
  player_choices: ConsequenceChoice[];
}
```

**Existierende Connections:**
- ✅ Actions → Consequence Triggers
- ✅ Consequence → Delayed Activation (Phase-based)
- ✅ Consequence → Player Choices
- ✅ Consequence → Resource Changes

**Fehlende Connections:**
- ❌ Consequence → NPC Morale (PIPELINE 3 - Priority!)
- ❌ Consequence → World Events
- ❌ Consequence → Crisis Escalation
- ❌ Ignored Consequences → Betrayal

---

### 8. BETRAYAL SYSTEM
**Location:** `src/story-mode/engine/BetrayalSystem.ts`

**Structure:**
```typescript
interface BetrayalState {
  warningLevel: 0-4;              // Escalation stages
  betrayalRisk: 0-100;
  personalRedLines: MoralRedLine[]; // 'violence', 'children', etc.
  grievances: BetrayalGrievance[];
  recentMoralActions: string[];
}
```

**Existierende Connections:**
- ✅ Moral Weight → Betrayal Risk
- ✅ NPC Morale → Warning Level
- ✅ Actions → Grievances
- ✅ Warning Level → Dialogues

**Fehlende Connections:**
- ❌ Betrayal Events → Crisis System
- ❌ Betrayal Warnings → News
- ❌ Betrayal → Consequence Chains
- ❌ Betrayal Resolution → Recovery

---

### 9. COMBO SYSTEM
**Location:** `src/story-mode/engine/StoryComboSystem.ts`

**Structure:**
```typescript
interface StoryComboProgress {
  comboId: string;
  requiredSequence: string[];     // Action IDs in order
  currentStep: number;
  expiresPhase: number;
}
```

**Existierende Connections:**
- ✅ Action Sequences → Combo Activation
- ✅ Combo → Bonus Effects
- ✅ Combo → Phase Expiration

**Fehlende Connections:**
- ❌ Combo Activation → News Events
- ❌ Combo → NPC Reactions ("Brilliant!")
- ❌ Combo → World Impact

---

### 10. EXTENDED ACTORS
**Location:** `src/story-mode/engine/ExtendedActorLoader.ts`

**Structure:**
```typescript
interface ExtendedActor {
  id: string;
  category: string;
  vulnerabilities: string[];      // Effective tags
  resistances: string[];          // Ineffective tags
}
```

**Existierende Connections:**
- ✅ Action Tags → Effectiveness Modifiers

**Fehlende Connections:**
- ❌ Actor State → World Events
- ❌ Actors → NPC Expertise Bonuses

---

## IMPLEMENTATION ROADMAP

### 🔴 PHASE 1: CORE PIPELINES (KRITISCH)
**Ziel:** Fundamentale Feedback-Loops etablieren

#### Pipeline 1: Actions → News ⚡ IN PROGRESS
**Warum kritisch:** Spieler-Agency wird sichtbar

**Implementation:**
- [ ] `generateActionNews(action, result)` Funktion
- [ ] News-Templates für Action-Types
- [ ] Smart Filtering (nur bedeutende Actions)
- [ ] Integration in `executeAction()`

**Code Location:** `StoryEngineAdapter.executeAction()` ~Line 1500

**Impact:**
- Bot-Kampagne → "Coordinated Bot Activity Detected" News
- Blackmail → "Political Figure Under Pressure" News
- Journalist rekrutiert → "Media Leak Suspected" News

---

#### Pipeline 2: Events → NPC Reactions ⚡ NEXT
**Warum kritisch:** NPCs werden lebendig

**Implementation:**
- [ ] `generateNPCEventReactions(event)` Funktion
- [ ] Event-Type → NPC-Character Mapping
- [ ] Dialogue Selection basierend auf Mood/Level
- [ ] Integration in `advancePhase()`

**Code Location:** `StoryEngineAdapter.advancePhase()` after `generateWorldEvents()` ~Line 668

**Impact:**
- "Economic Crisis" → Marina: "Das wird Targets beeinflussen..."
- "Security Leak" → Igor: "Erhöhe Verschlüsselung."
- "Protest Movement" → Volkov: "Perfekt! Lass uns das anheizen!"

---

#### Pipeline 3: Consequences → NPC Morale ⚡ PRIORITY
**Warum kritisch:** Team reagiert auf Gameplay-Konsequenzen

**Implementation:**
- [ ] `applyConsequenceMoraleImpact(consequence)` Funktion
- [ ] Severity → Morale-Change Mapping
- [ ] NPC-spezifische Modifiers
- [ ] Integration in Consequence Application

**Code Location:** `ConsequenceSystem` oder `StoryEngineAdapter.applyConsequenceEffects()`

**Impact:**
- "Investigation Active" → All NPCs -5 Morale (Volkov +5)
- "Team Member Arrested" → -15 Morale + Crisis Trigger
- "Bot Network Exposed" → Igor -10 Morale (sein Spezialgebiet)

---

### 🟡 PHASE 2: FEEDBACK LOOPS
**Ziel:** Systeme reagieren aufeinander

- [ ] Resource Trends → Dynamic Events
  - Rising Risk über 3 Phasen → "Heat Rising" News
  - Low Budget über 2 Phasen → "Financial Crisis" Event

- [ ] Combo Achievements → News
  - 5-Action Combo → "Masterful Campaign Observed" News
  - First Combo → NPC Congratulations

- [ ] NPC Crisis → World Events
  - Marina in Crisis → "Team Member Distressed" subtle News
  - Betrayal Warning Level 4 → "Internal Tensions" News

---

### 🟢 PHASE 3: TEMPORAL ARCS
**Ziel:** Zeit hat Bedeutung

#### Phase Milestones
- [ ] Jahr 1 Ende: "First Year Complete" Reflection Event
- [ ] Jahr 5 Mitte: "Midpoint Crisis" Major Story Beat
- [ ] Jahr 10 Finale: "Endgame Begins" Countdown

#### Seasonal Themes
- [ ] Winter: Weihnachts-Kampagnen, Jahresend-Reflexion
- [ ] Sommer: Ferienzeit-Opportunitäten, langsamere News-Zyklen
- [ ] Frühling: Wahlen, politische Aktivität
- [ ] Herbst: Zurück-zu-Schule, akademische Targets

#### Long-term Consequences
- [ ] Phase 1 Action → Phase 50+ Consequence
- [ ] Accumulated Patterns → Meta-Consequences
- [ ] Historical Record → Reputation System

---

### 🔵 PHASE 4: EMERGENT NARRATIVE
**Ziel:** Systemische Komplexität

#### Cross-System Cascades
```
Action (Bot Campaign)
  → News ("Bot Activity Detected")
    → NPC Reaction (Igor: "They're onto us")
      → Morale Drop
        → Crisis Trigger
          → Player Choice (Abandon/Double Down)
            → New Actions Unlocked/Locked
              → Phase Event (Investigation Escalates)
```

#### Reputation System
- [ ] World Memory: Actions sind nicht vergessen
- [ ] Pattern Recognition: "They always use bots" → Countermeasures
- [ ] Notoriety Levels: From "Unknown" to "Most Wanted"

#### Legacy System
- [ ] Past Actions Return: Frühere Entscheidungen kommen zurück
- [ ] Character Development: NPCs ändern sich über 10 Jahre
- [ ] World State Evolution: Gesellschaft verändert sich

---

## TECHNICAL DETAILS

### News Generation Pipeline
**Trigger Points:**
1. **executeAction()** - Nach Action-Ausführung
2. **advancePhase()** - Periodische World Events
3. **applyConsequence()** - Nach Konsequenz-Activation
4. **resolveCrisis()** - Nach Crisis-Entscheidung
5. **updateNPCMorale()** - Bei NPC Crisis Trigger

**News Types:**
```typescript
type NewsType =
  | 'action_result'        // Player action hatte Effekt
  | 'world_event'          // Unabhängiges Weltereignis
  | 'consequence'          // Verzögerte Konsequenz
  | 'crisis'               // Crisis-Trigger
  | 'npc_reaction'         // NPC kommentiert Event
  | 'combo_achievement'    // Combo erfolgreich
  | 'phase_milestone'      // Story-Beat erreicht
  | 'resource_trend'       // Resource-Warnung
  | 'reputation_change';   // Notoriety-Änderung
```

### NPC Reaction System
**Reaction Triggers:**
```typescript
interface ReactionTrigger {
  eventType: string;              // z.B. 'economic_crisis'
  npcId: string;                  // 'marina', 'volkov', etc.
  relationshipLevel?: number;     // Optional: nur bei Level X
  moraleRange?: [number, number]; // Optional: nur bei Morale Y-Z
}
```

**Dialogue Selection:**
1. Filter Dialogues by Event Type
2. Check NPC Relationship Level
3. Check NPC Morale Range
4. Check NPC Mood
5. Random Selection from valid pool

---

## SUCCESS METRICS

**Narrative Coherence:**
- ✅ Every action has visible consequence
- ✅ NPCs feel like real people reacting to world
- ✅ World feels dynamic and reactive
- ✅ Decisions accumulate weight over time

**Player Experience:**
- ✅ "My actions matter"
- ✅ "The world is alive"
- ✅ "Characters have opinions"
- ✅ "Every playthrough feels different"

**Technical Metrics:**
- Target: 80%+ of player actions generate news
- Target: 90%+ of world events trigger NPC reactions
- Target: 100% of severe consequences affect NPC morale
- Target: Every phase has minimum 1 unique event

---

## NOTES

**Performance Considerations:**
- News generation should be lightweight (no AI calls)
- Template-based with smart parameter substitution
- Limit news feed to last 20 items (older archived)

**Localization:**
- All news templates need DE + EN versions
- NPC reactions use existing dialogue system

**Balance:**
- Not every action = news (would overwhelm)
- Filter by: Impact, Legality, Tags, Risk Level
- Smart throttling: Max 3 action-news per phase

---

## CURRENT STATUS

### ✅ COMPLETED PIPELINES

**Pipeline 1: Actions → News** ✓ DONE (Commit 822b209)
- Smart filtering: Only 40-60% of actions generate news
- 10 tag-based contextual templates
- Dynamic severity based on legality, moral weight, risk
- World reactions for very significant actions
- Risk-based modifiers (⚠️ prefix at risk ≥70)

**Pipeline 2: Events → NPC Reactions** ✓ DONE (Commit 4f5fa84)
- NPCs react to world events based on expertise
- Context-aware dialogues (relationship/mood/morale)
- 40+ unique dialogue paths across 5 NPCs
- **BONUS:** Pipeline 1 Synergy - NPCs react to player action-news!
- Smart NPC selection by event type + severity
- 100+ possible reaction variations

### 🎯 ACTIVE IMPACT

**Narrative Feedback Loops Working:**
```
Player Action
  → Pipeline 1: Generates contextual news
    → Pipeline 2: NPCs react to news
      → Player sees team opinions
        → Influences next decision
```

**Example Cascade:**
```
Bot Campaign (illegal, moral_weight: 5)
  → News: "Koordinierte Bot-Aktivität beobachtet" (warning)
    → Igor: "*runzelt Stirn* Signatur zu offensichtlich"
    → Marina: "*seufzt* Ich verstehe die Notwendigkeit..."
    → Volkov: "*grinst* Ah, Sie zeigen Zähne. Gut."
```

**Pipeline 3: Consequences → NPC Morale** ✓ DONE (Commit 64dce02)
- Character-specific morale impacts based on consequence type
- 5 consequence categories with nuanced reactions
- Varies by expertise, relationship level, and current morale
- 40+ unique dialogue variations in German/English
- **BONUS:** Transparent news about WHY morale changed
- **BONUS:** Team summary news when 3+ NPCs affected
- **BONUS:** Crisis cascade integration (morale < 30 → inCrisis)
- Linguistically rich reactions maintaining character consistency

### ✅ PHASE 2: FEEDBACK LOOPS ✓ COMPLETE

**NPC Crisis → World Events** ✓ DONE (Commit d190106)
- When NPCs are in crisis, their mistakes become visible to the world
- Character-specific manifestations based on expertise areas
- Igor: Technical anomalies (40% probability when in crisis)
- Marina: Financial leaks (35%)
- Volkov: Sloppy trolling (45%)
- Katja: Narrative breakdown (30%)
- Direktor: Leadership rumors (15%, catastrophic)
- Team crisis: 3+ NPCs → "Internal Tensions" world event
- **BONUS:** Betrayal system integration (crisis + high betrayal risk → leak warnings)

**Resource Trends → Dynamic Events** ✓ DONE (Commit d190106)
- World monitors and reacts to sustained resource patterns
- High Risk (≥70) → "Operational Risk Rising"
- High Attention (≥65) → "Media Attention Growing"
- Low Budget (≤30) → "Financial Bottlenecks Suspected"
- Low Capacity (≤2) → "Operative Capacity Exhausted"
- High Moral Weight (≥40) → "Ethical Concerns Mounting"
- Multi-Crisis: 3+ critical resources → "Multiple Crises Detected" (danger level)

---

**Last Updated:** 2026-01-01
**Status:** Phase 1 & 2 ✅ COMPLETE (Full bidirectional feedback loops established)
**Commits:** 822b209 (Pipeline 1), 4f5fa84 (Pipeline 2), 64dce02 (Pipeline 3), d190106 (Phase 2 Feedback)
