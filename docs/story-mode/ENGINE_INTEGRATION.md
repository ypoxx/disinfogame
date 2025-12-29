# Story Mode - Engine Integration

Technische Dokumentation der Brücke zwischen Story Mode und Wargaming Engine.

---

## Bestehende Engine-Capabilities

### Was bereits existiert ✅

| Feature | Datei | Status |
|---------|-------|--------|
| Seed-System | `src/game-logic/seed/SeededRandom.ts` | ✅ Vollständig |
| Deterministische Zufälle | `SeededRandom.random()` | ✅ Vollständig |
| Seed-Sharing via URL | `src/services/api.ts` | ✅ Vollständig |
| Seed-Speicherung (API) | `createSeed()`, `getSeed()` | ✅ Vorhanden |
| Populäre Seeds | `getPopularSeeds()` | ✅ Vorhanden |
| Actor-System | `src/game-logic/types/index.ts` | ✅ Vollständig |
| Ability-System | `ability-definitions-v2.json` | ✅ 40+ Abilities |
| Event-System | `event-definitions.json` | ✅ 15+ Events |
| Event-Chains | `event-chains.json` | ✅ Vorhanden |
| Combo-System | `combo-definitions.json` | ✅ 10+ Combos |
| Actor-AI | `GameState.ts` (Reactions) | ✅ Grundlegend |
| Propagation | `propagateTrust()` | ✅ Vollständig |
| Narrative Generator | `NarrativeGenerator.ts` | ✅ Grundlegend |

### Was fehlt für Story Mode ❌

| Feature | Beschreibung | Priorität |
|---------|--------------|-----------|
| AP/Day-System | Action Points pro Tag | 🔴 HOCH |
| NPC-Datenmodell | Charaktere mit Beziehungen | 🔴 HOCH |
| Dialog-System | Verzweigte Gespräche | 🔴 HOCH |
| OKR-Tracking | Strategische Ziele messen | 🟡 MITTEL |
| Story-Engine-Adapter | Fassade für Story-UI | 🔴 HOCH |
| Zeit-Transformation | Runden → Tage/Kapitel | 🟡 MITTEL |
| Moralisches Tracking | Gewissens-State (optional) | 🟢 NIEDRIG |

---

## Seed-System Details

### Bestehende Implementierung

```typescript
// src/game-logic/seed/SeededRandom.ts

export class SeededRandom {
  constructor(seedString: string);

  // Basis-Random (0-1)
  random(): number;

  // Integer in Range
  randomInt(min: number, max: number): number;

  // Array shufflen
  shuffle<T>(array: T[]): T[];

  // Element aus Array wählen
  choose<T>(array: T[]): T;

  // Für Replay: Reset zum Anfang
  reset(): void;

  // State speichern/laden
  getState(): number;
  setState(state: number): void;
}

// Seed generieren (12 Zeichen, Base62)
export function generateSeedString(length?: number): string;

// Seed validieren
export function isValidSeed(seed: string): boolean;
```

### URL-Sharing

```typescript
// src/services/api.ts

// URL generieren
generateShareUrl(seed: string): string
// → "https://game.example.com/?seed=ABC123456789"

// Seed aus URL lesen
parseSeedFromUrl(): string | null
```

### Implikation für "Gegenseite spielen"

Das Seed-System ermöglicht:
1. Gleiches Spiel mit identischen Zufällen
2. Angreifer spielt → speichert Seed
3. Verteidiger lädt Seed → sieht gleiche Ausgangslage
4. Vergleich der Ergebnisse möglich

**Technische Erweiterung nötig:**
```typescript
interface GameReplay {
  seed: string;
  perspective: 'attacker' | 'defender';
  actions: PlayerAction[];
  finalState: GameState;
}
```

---

## StoryEngineAdapter (zu implementieren)

### Konzept

```
┌─────────────────────────────────────────────────────────┐
│                    STORY MODE UI                        │
│  (OfficeScreen, NPCDialogs, EmailSystem, etc.)         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               STORY ENGINE ADAPTER                      │
│  - advanceDay()           - interactWithNPC()          │
│  - getDailyActions()      - getCurrentNarrative()       │
│  - applyNarrativeChoice() - getObjectiveProgress()      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 WARGAMING ENGINE                        │
│  (GameStateManager, Actors, Abilities, Events)         │
└─────────────────────────────────────────────────────────┘
```

### Interface-Definition

```typescript
// src/story-mode/StoryEngineAdapter.ts

export interface StoryEngineAdapter {
  // === Zeit-Management ===
  advanceDay(): DaySummary;
  getCurrentDay(): number;
  getCurrentPhase(): Phase;
  getCurrentChapter(): Chapter;

  // === Action Points ===
  getDailyActions(): number;
  consumeAction(): void;
  canAct(): boolean;

  // === NPCs ===
  getNPCs(): NPC[];
  interactWithNPC(npcId: string, choiceId: string): NPCReaction;
  getNPCRelationship(npcId: string): Relationship;

  // === Narrative ===
  getCurrentNarrative(): StoryContext;
  getActiveEvents(): StoryEvent[];
  applyNarrativeChoice(choiceId: string): ChoiceConsequence;

  // === Objectives ===
  getObjectives(): Objective[];
  getObjectiveProgress(objectiveId: string): number;

  // === Engine-Zugriff (versteckt) ===
  getState(): GameState; // Für Debug/Analyse
  executeAbility(abilityId: string, targetIds: string[]): AbilityResult;
}
```

### Beispiel-Implementierung

```typescript
export class StoryEngineAdapterImpl implements StoryEngineAdapter {
  private gameState: GameStateManager;
  private npcManager: NPCManager;
  private narrativeGen: NarrativeGenerator;
  private dailyActionsRemaining: number;

  constructor(
    seed?: string,
    scenario?: ScenarioConfig
  ) {
    this.gameState = createGameState(seed);
    this.npcManager = new NPCManager(scenario?.npcs || []);
    this.narrativeGen = new NarrativeGenerator();
    this.dailyActionsRemaining = scenario?.actionsPerDay || 3;
  }

  advanceDay(): DaySummary {
    // 1. Engine-Runde abschließen
    this.gameState.advanceRound();

    // 2. Narrative Zusammenfassung generieren
    const summary = this.narrativeGen.generateDaySummary(
      this.gameState.getState()
    );

    // 3. AP zurücksetzen
    this.dailyActionsRemaining = 3;

    // 4. NPC-Reaktionen verarbeiten
    const npcReactions = this.npcManager.processDay(
      this.gameState.getState()
    );

    return {
      day: this.getCurrentDay(),
      narrative: summary,
      npcReactions,
      objectiveChanges: this.calculateObjectiveChanges(),
    };
  }

  interactWithNPC(npcId: string, choiceId: string): NPCReaction {
    const npc = this.npcManager.getNPC(npcId);
    const choice = npc.getChoice(choiceId);

    // Engine-Effekte anwenden
    if (choice.engineEffect) {
      this.applyEffect(choice.engineEffect);
    }

    // Beziehung aktualisieren
    this.npcManager.updateRelationship(npcId, choice.relationshipDelta);

    // Aktion verbrauchen
    this.consumeAction();

    return {
      npcId,
      response: choice.response,
      relationshipChange: choice.relationshipDelta,
      consequences: choice.consequences,
    };
  }

  // ... weitere Methoden
}
```

---

## Mapping: Story UI → Engine

Basierend auf OfficeScreen.tsx:

| UI-Element | Story-Aktion | Engine-Methode |
|------------|--------------|----------------|
| Computer | E-Mails lesen, Übersicht | `getActiveEvents()`, `getState()` |
| Telefon | NPC anrufen | `interactWithNPC()` |
| TV | Nachrichten sehen | `getActiveEvents()`, News-Filter |
| Smartphone | Schnelle Aktionen | `executeAbility()` |
| Tür | Tag beenden | `advanceDay()` |
| Kalender | Zeit-Übersicht | `getCurrentDay()`, `getCurrentPhase()` |

---

## NPC-System (zu implementieren)

### Datenmodell

```typescript
// src/story-mode/types/npc.ts

export interface NPC {
  id: string;
  name: string;
  role: string;
  archetype: 'ally' | 'rival' | 'boss' | 'threat' | 'neutral';
  portrait?: string;

  // Beziehungs-State
  relationship: {
    loyalty: number;    // 0-1
    fear: number;       // 0-1
    respect: number;    // 0-1
    trust: number;      // 0-1
  };

  // Persönlichkeit
  personality: {
    morality: number;   // 0-1 (amoral → moralisch)
    ambition: number;   // 0-1
    competence: number; // 0-1
  };

  // Verfügbare Dialoge/Aktionen
  availableDialogues: DialogueNode[];

  // Trigger für Events
  triggers: NPCTrigger[];
}

export interface DialogueNode {
  id: string;
  text: string;
  condition?: Condition; // Wann ist dieser Dialog verfügbar?
  options: DialogueOption[];
}

export interface DialogueOption {
  id: string;
  text: string;
  cost?: ResourceCost;
  effects: {
    engineEffect?: EngineEffect;
    relationshipDelta?: Partial<Relationship>;
    triggerEvent?: string;
  };
  response: string; // NPC-Antwort
  nextNodeId?: string; // Für verzweigte Dialoge
}
```

### NPC-Archetypen für MVP

```json
[
  {
    "id": "marina",
    "name": "Marina Sokolova",
    "role": "Leiterin Analyse-Abteilung",
    "archetype": "ally",
    "personality": {
      "morality": 0.6,
      "ambition": 0.4,
      "competence": 0.9
    },
    "initialRelationship": {
      "loyalty": 0.7,
      "fear": 0.2,
      "respect": 0.5,
      "trust": 0.6
    }
  },
  {
    "id": "volkov",
    "name": "Dmitri Volkov",
    "role": "Chef Bot-Farm 'Storm'",
    "archetype": "ally",
    "personality": {
      "morality": 0.2,
      "ambition": 0.8,
      "competence": 0.7
    }
  },
  {
    "id": "direktor",
    "name": "Der Direktor",
    "role": "Dein Vorgesetzter",
    "archetype": "boss",
    "personality": {
      "morality": 0.1,
      "ambition": 0.9,
      "competence": 0.8
    }
  },
  {
    "id": "aleksei",
    "name": "Aleksei Petrov",
    "role": "Stellvertretender Leiter",
    "archetype": "rival"
  },
  {
    "id": "journalist",
    "name": "Sarah Mueller",
    "role": "Investigativ-Journalistin",
    "archetype": "threat"
  }
]
```

---

## Nächste Implementierungsschritte

### Phase 1: Foundation
1. [ ] `StoryEngineAdapter.ts` erstellen (Interface + Grundimplementierung)
2. [ ] `dailyActionsRemaining` zu GameState hinzufügen
3. [ ] `NPCManager.ts` mit Basis-Funktionalität

### Phase 2: NPC-System
4. [ ] NPC-Datenmodell definieren
5. [ ] 5 NPCs für MVP erstellen (JSON)
6. [ ] Beziehungs-Tracking implementieren

### Phase 3: UI-Verbindung
7. [ ] OfficeScreen mit Adapter verbinden
8. [ ] NPC-Dialog-UI erstellen
9. [ ] Tages-Zusammenfassung implementieren

### Phase 4: Objectives
10. [ ] OKR-System in Engine integrieren
11. [ ] Progress-Tracking UI
