# Story Engine Refactor v2 — Korrigierter Plan

> **Basis:** STORY_ENGINE_REFACTOR_PLAN.md + STORY_ENGINE_REFACTOR_PLAN_REVIEW.md
> **Korrekturen:** Lücken geschlossen, Risiken adressiert, State-of-the-Art Methoden angewendet
> **Datum:** 2026-02-07
> **Prinzip:** Strangler Fig — Adapter behält öffentliches API, delegiert intern schrittweise an neue Module

---

## Ist-Zustand (quantifiziert)

| Datei | LOC | Methoden | State-Properties | Problem |
|-------|-----|----------|-----------------|---------|
| StoryEngineAdapter.ts | 5.119 | 57 public + 45 private | 21 + 10 Subsysteme | God-Object Facade |
| useStoryGameState.ts | 1.447 | 31 useCallback, 25 useState | 14 engine-derived, 11 independent | React-Monolith |
| Tests gesamt | 3.639 | — | — | ~4% Coverage auf Adapter |

### Subsystem-Unabhängigkeit (IST)

```
Standalone (8-10/10): TaxonomyLoader, ActionLoader, CountermeasureSystem,
                      CrisisMomentSystem, ExtendedActorLoader, BetrayalSystem,
                      EndingSystem, ConsequenceSystem
Gekoppelt (4-6/10):   DialogLoader, StoryComboSystem, StoryActorAI
Hub (0/10):           StoryEngineAdapter (orchestriert alle 13 Systeme)
```

### Methoden-Cluster im Adapter (Extraktions-Ziele)

| Cluster | Methoden | LOC (ca.) | Ziel-Modul |
|---------|----------|-----------|------------|
| Action Execution | executeAction + 7 Helfer | ~600 | ActionExecutor |
| Phase Pipeline | advancePhase + 10 Helfer | ~800 | PhaseManager |
| NPC State/Reactions | processNPCReactions + 4 Helfer | ~300 | NPCOrchestrator |
| Dialogue | 11 public + 3 private | ~500 | → Existierender DialogLoader |
| News/Events | 6 private Generatoren | ~400 | NewsGenerator |
| Consequence Cascade | checkConsequences + 7 Helfer | ~500 | → Existierendes ConsequenceSystem |
| Getters (thin) | 20+ reine Weiterleitungen | ~200 | Bleiben im Adapter |
| Save/Load | saveState + loadState | ~60 | StateSerializer |

---

## Architektur-Prinzipien

### 1. Strangler Fig Pattern
Der Adapter behält sein **gesamtes öffentliches API**. Intern delegiert er schrittweise:

```typescript
// VORHER (God-Object):
executeAction(actionId: string): ActionResult {
  // 200 Zeilen inline-Logik
}

// NACHHER (Strangler Fig):
executeAction(actionId: string): ActionResult {
  return this.actionExecutor.execute(actionId, this.getExecutionContext());
}
```

**Vorteil:** Kein Consumer-Code (useStoryGameState, Tests) muss sich ändern, bis wir bereit sind.

### 2. Constructor Injection (konkretes DI-Pattern)

```typescript
interface ActionExecutorDeps {
  getResources(): StoryResources;
  getNPCState(id: string): NPCState | null;
  getPhase(): StoryPhase;
  consequenceSystem: ConsequenceSystem;
  comboSystem: StoryComboSystem;
  betrayalSystem: BetrayalSystem;
}

class ActionExecutor {
  constructor(private deps: ActionExecutorDeps) {}
}
```

**Regel:** Jedes neue Modul bekommt ein `Deps`-Interface. Der Adapter implementiert dieses Interface.

### 3. Characterization Tests (nicht Coverage-Quote)
Statt "30% Coverage" schreiben wir **gezielte Characterization Tests** für:
- Die 3 kritischsten Pfade (executeAction, advancePhase, handleConsequenceChoice)
- Snapshot-Vergleich des gesamten State nach einer deterministischen Spielsequenz
- Diese Tests dokumentieren IST-Verhalten, nicht SOLL-Verhalten

---

## Phase 0: Sicherheitsnetz (keine Logikänderung)

### 0.1 State-Inventory ✅ (bereits erledigt)
Komplett dokumentiert: 21 Properties, 10 Subsysteme, 57 public Methoden.

### 0.2 Deterministischer Test-Harness
**Aktion:** Fester Seed + fixe Action-Sequenz über 5 Phasen.

```typescript
const GOLDEN_SEED = "refactor-baseline-2026";
const GOLDEN_ACTIONS = [
  { phase: 1, actions: ["ta01_fake_news_basic", "ta01_social_bot_simple"] },
  { phase: 2, actions: ["ta02_emotional_framing", "ta02_troll_recruiting"] },
  { phase: 3, actions: ["ta03_conspiracy_lite"] },
  // ... bis Phase 5
];
```

**Risiko:** Edge-Cases nicht abgedeckt.
**Absicherung:** Mindestens 1 legal, 1 grey, 1 illegal Aktion. Mindestens 1 Consequence-Trigger.

### 0.3 Snapshot-Tests (zweistufig)
**Minimal-Snapshot:** Resources, NPC-States, Objectives, Consequences, ActionHistory.
**Voll-Snapshot:** + NewsEvents, ComboState, AIState, BetrayalState.

**Kritisch:** Snapshots werden als `.snap`-Dateien gespeichert. Bei Refactoring-Phasen wird der Snapshot **einmal bewusst aktualisiert** (nach Verifikation), nicht bei jedem Lauf.

### 0.4 Characterization Tests für kritische Pfade
**NEU** (ersetzt Review-Punkt 0.6 "30% Coverage"):

```
Zu testen (IST-Verhalten dokumentieren):
1. executeAction() — Kosten-Abzug, Effekt-Anwendung, Consequence-Registrierung
2. advancePhase() — Ressourcen-Regen, Consequence-Check, World-Events
3. handleConsequenceChoice() — Effekt-Anwendung, Ketten-Trigger
4. processNPCReactions() — Morale-Updates, Betrayal-Warnings
5. saveState()/loadState() — Roundtrip-Konsistenz
```

**Ziel:** ~500 Testzeilen für die 5 kritischsten Pfade. Nicht mehr, nicht weniger.

### 0.5 Save-State-Versionierung
**NEU** (fehlte im Original-Plan):

```typescript
// In saveState():
{
  "version": "2.0.0",  // Bump bei jeder State-Shape-Änderung
  "migrationVersion": 2,
  // ... rest
}

// Migration-Layer:
function migrateState(saved: any): CurrentState {
  if (saved.version === "1.0.0") return migrateV1toV2(saved);
  return saved;
}
```

**Risiko:** Bestehende Saves brechen.
**Absicherung:** Migration-Layer + Roundtrip-Test in Phase 0.4.

### 0.6 Performance-Baseline
**NEU** (verschoben von Phase 8):

```typescript
// Messen vor Refactoring:
benchmark("advancePhase", () => engine.advancePhase(), 1000);
benchmark("executeAction", () => engine.executeAction("ta01_fake_news_basic"), 1000);
// Ergebnisse als Referenz speichern
```

**Threshold:** Neue Module dürfen max. +10% langsamer sein.

### 0.7 Git-Tags & Rollback-Strategie
Tag pro Phase: `refactor/phase-0-baseline`, `refactor/phase-1-action-executor`, etc.
Rollback = `git revert` zum vorherigen Tag.

---

## Phase 1: ActionExecutor extrahieren

### 1.1 ActionExecutor-Klasse erstellen

**Zu extrahieren aus StoryEngineAdapter:**
```
executeAction()           [3076, ~180 LOC]
canAffordAction()         [3259, ~20 LOC]
calculateNPCDiscount()    [3279, ~25 LOC]
deductActionCosts()       [3306, ~40 LOC]
applyActionEffects()      [3348, ~150 LOC]
registerPotentialConsequences() [3504, ~45 LOC]
updateNPCRelationships()  [3622, ~60 LOC]
updateNPCMorale()         [3683, ~80 LOC]
```

**Deps-Interface:**
```typescript
interface ActionExecutorDeps {
  getResources(): StoryResources;
  setResources(r: StoryResources): void;
  getNPCStates(): Map<string, NPCState>;
  getPhase(): StoryPhase;
  getActionHistory(): ActionHistoryEntry[];
  addActionHistory(entry: ActionHistoryEntry): void;
  consequenceSystem: ConsequenceSystem;
  comboSystem: StoryComboSystem;
  betrayalSystem: BetrayalSystem;
  actionLoader: ActionLoader;
  seededRandom(input: string): number;
}
```

**Strangler-Delegation im Adapter:**
```typescript
// StoryEngineAdapter.ts
executeAction(actionId: string, options?: ActionOptions): ActionResult {
  return this.actionExecutor.execute(actionId, options);
}
```

**Risiko:** Reihenfolge der Effekte ändert sich.
**Absicherung:** Snapshot muss 100% identisch sein.

### 1.2 Unit-Tests: Action-Kosten + NPC-Discount
Tests für Budget/Capacity/Risk/Attention inkl. NPC-Morale-Modifier.
Fixierte NPC-States im Test.

### 1.3 Action-News bleibt vorerst im Adapter
`generateActionNews()` + `createPrimaryActionNews()` + `createWorldReactionNews()` werden erst in Phase 4 extrahiert. Grund: Sie sind Teil des Action-Flows, aber auch Teil des News-Systems. Erst News extrahieren, dann Action-News mitnehmen.

**Adapter ruft nach ActionExecutor.execute() weiterhin selbst generateActionNews() auf.**

---

## Phase 2: PhaseManager extrahieren

### 2.1 PhaseManager-Klasse erstellen

**Zu extrahieren:**
```
advancePhase()                    [615, ~200 LOC]
createPhase()                     [498, ~20 LOC]
checkConsequences()               [819, ~70 LOC]
applyConsequenceEffects()         [1757, ~125 LOC]
applyConsequenceMoraleImpact()    [889, ~525 LOC]
handleIgnoredConsequence()        [1884, ~55 LOC]
cleanupExpiredOpportunityWindows() [2745, ~18 LOC]
```

**Pipeline-Reihenfolge (MUSS erhalten bleiben):**
```
1. cleanupExpiredOpportunityWindows()
2. comboSystem.cleanupExpired()
3. checkConsequences()
4. crisisMomentSystem.checkForCrises()
5. generateWorldEvents()         ← bleibt vorerst im Adapter
6. generateNPCCrisisEvents()     ← bleibt vorerst im Adapter
7. generateResourceTrendEvents() ← bleibt vorerst im Adapter
8. actorAI.processPhase()
```

**Risiko:** SEHR HOCH — Pipeline-Reihenfolge ist gameplay-kritisch.
**Absicherung:**
- Pipeline als explizite Schrittliste (nicht implizit)
- Test prüft Reihenfolge via Mock-Aufrufe
- Snapshot-Regression

### 2.2 Ressourcen-Regen + Consequence-Tests
Tests für Regeneration und Consequence-Handling mit fixen Werten.

### 2.3 Basis-Event-Bus einführen
**NEU** (vorgezogen von Phase 7):

```typescript
type GameEvent =
  | { type: 'ACTION_EXECUTED'; actionId: string; result: ActionResult }
  | { type: 'PHASE_ADVANCED'; from: number; to: number }
  | { type: 'CONSEQUENCE_TRIGGERED'; consequenceId: string }
  | { type: 'NPC_BETRAYAL'; npcId: string };

class GameEventBus {
  private listeners = new Map<string, Set<(event: GameEvent) => void>>();
  emit(event: GameEvent): void { /* ... */ }
  on(type: string, handler: (event: GameEvent) => void): () => void { /* ... */ }
}
```

**Warum jetzt:** Die aktuellen Kaskaden (Action → Consequence → NPC Morale → Combo → AI) sind bereits implizit Event-basiert. Ein expliziter Bus macht sie sichtbar und testbar.

**Scope:** Nur Basis-Events. Kein Event-Sourcing, kein Replay.

---

## Phase 3: NPCOrchestrator + DialogLoader-Integration

### 3.1 NPCOrchestrator erstellen

**Zu extrahieren:**
```
processNPCReactions()      [3550, ~70 LOC]
updateNPCRelationships()   [3622, ~60 LOC] (falls nicht schon in ActionExecutor)
updateNPCMorale()          [3683, ~80 LOC] (falls nicht schon in ActionExecutor)
updateNPCMood()            [3768, ~15 LOC]
generateNPCEventReactions() [1943, ~40 LOC]
determineReactingNPCs()    [1981, ~90 LOC]
selectNPCEventDialogue()   [2072, ~670 LOC]
```

**Kernentscheidung:** NPCOrchestrator wird **Single Source of Truth** für `Map<string, NPCState>`.

```typescript
class NPCOrchestrator {
  private npcStates: Map<string, NPCState>;

  getNPC(id: string): NPCState | null;
  getAllNPCs(): NPCState[];
  updateMorale(npcId: string, delta: number): void;
  updateRelationship(npcId: string, delta: number): void;
  processReactions(action: StoryAction, result: ActionResult): NPCReaction[];
}
```

**Risiko:** 5+ Systeme lesen NPC-State direkt. Alle müssen über NPCOrchestrator gehen.
**Absicherung:** Adapter-Property `npcStates` wird durch Getter ersetzt, der an NPCOrchestrator delegiert.

### 3.2 Betrayal/Morale/Relationship Tests
Fixed-Action-Set → erwartete Morale-Deltas, Betrayal-Warnings.

### 3.3 DialogLoader-Integration
**NEU** (fehlte im Original-Plan):

DialogLoader (1336 LOC) bleibt eigenständig, aber:
- NPCOrchestrator erhält `getDialogue(npcId, context)` als Methode
- DialogLoader.buildContext() bekommt NPC-State vom Orchestrator
- Adapter delegiert alle 11 Dialog-Methoden an NPCOrchestrator

---

## Phase 4: NewsGenerator extrahieren

### 4.1 NewsGenerator-Klasse erstellen

**Zu extrahieren:**
```
generateActionNews()          [2893, ~35 LOC]
createPrimaryActionNews()     [2927, ~95 LOC]
createWorldReactionNews()     [3023, ~50 LOC]
generateWorldEvents()         [2311, ~80 LOC]
shouldTriggerWorldEvent()     [2410, ~30 LOC]
createNewsEventFromDef()      [2391, ~20 LOC]
generateNPCCrisisEvents()     [1415, ~340 LOC]
generateResourceTrendEvents() [1610, ~150 LOC]
applyWorldEventEffects()      [2482, ~95 LOC]
createOpportunityWindowsFromEvent() [2579, ~165 LOC]
```

### 4.2 Narrativ-Snapshots
News-Snapshots sichern: Headlines, Severity, Tag-Logik.
Narrative-Snapshots: Headline + Description.

---

## Phase 5: Side-Effects + Config

### 5.1 Sound/Logger Interfaces
`playSound` und `storyLogger` als injizierbare Interfaces.

### 5.2 Balance-Config zentralisieren
Alle Magic Numbers (CAPACITY_REGEN_PER_PHASE=2, ACTION_POINTS_PER_PHASE=5, etc.) in `balance-config.ts`.

### 5.3 Daten-Quellen injizierbar
NPC/World-Events JSON als Injected Data Source mit Schema-Validierung.

---

## Phase 6: useStoryGameState aufteilen

**NEU** (fehlte komplett im Original-Plan):

### 6.1 Subsystem-Hooks extrahieren

```
useActionExecution.ts   — executeAction, addToQueue, removeFromQueue, executeQueue (~300 LOC)
usePhaseManagement.ts   — endPhase, resources sync (~150 LOC)
useNPCInteraction.ts    — interactWithNpc, handleDialogChoice, dismissDialog (~250 LOC)
useBetrayalCrisis.ts    — acknowledgeBetrayal, addressGrievance, resolveCrisis (~100 LOC)
useGameLifecycle.ts     — startGame, resetGame, pauseGame, saveGame, loadGame (~200 LOC)
useAdvisorSystem.ts     — generateRecommendations, recommendationTracking (~100 LOC)
```

### 6.2 useStoryGameState wird Orchestrator

```typescript
export function useStoryGameState(seed?: string) {
  const engine = useEngine(seed);
  const lifecycle = useGameLifecycle(engine);
  const actions = useActionExecution(engine);
  const phases = usePhaseManagement(engine);
  const npcs = useNPCInteraction(engine);
  const betrayal = useBetrayalCrisis(engine);
  const advisor = useAdvisorSystem(engine);

  return {
    state: { ...lifecycle.state, ...actions.state, ...phases.state, ...npcs.state, ...betrayal.state },
    ...lifecycle.actions, ...actions.actions, ...phases.actions, ...npcs.actions, ...betrayal.actions,
  };
}
```

**Risiko:** Cross-Hook State-Dependencies (executeAction braucht recommendations aus useAdvisorSystem).
**Absicherung:** Shared Context via Engine-Ref oder Zustand-Store.

---

## Phase 7: StateSerializer + Save-Migration

### 7.1 StateSerializer extrahieren
`saveState()` und `loadState()` in eigene Klasse mit Versionierung.

### 7.2 Migration-Layer
```typescript
const MIGRATIONS: Record<string, (state: any) => any> = {
  "1.0.0": migrateV1toV2,  // npcStates: Map → NPCOrchestrator format
  "2.0.0": identity,       // current
};
```

---

## Phase 8: Stabilität & Abschluss

### 8.1 Regression-Matrix
Alle Phasen durchlaufen, Snapshot + Unit-Tests grün.

### 8.2 Performance-Vergleich
Messen gegen Phase 0.6 Baseline. Threshold: +10% max.

### 8.3 Runtime-Guards (optional)
Invariant-Checks: Resources nicht negativ, Risk/Attention 0-100.

---

## Reihenfolge & Abhängigkeiten

```
Phase 0 ──────────────────────────── Sicherheitsnetz
   │
Phase 1 (ActionExecutor) ─────────── Höchster Wert, mittleres Risiko
   │
Phase 2 (PhaseManager + EventBus) ── Höchstes Risiko, Pipeline-kritisch
   │
Phase 3 (NPCOrchestrator) ────────── Breite Auswirkung, State-Migration
   │
Phase 4 (NewsGenerator) ──────────── Relativ isoliert
   │
Phase 5 (Side-Effects + Config) ──── Niedrig-Risiko Aufräumarbeiten
   │
Phase 6 (useStoryGameState) ──────── React-Schicht, nach Engine stabil
   │
Phase 7 (StateSerializer) ────────── Save-Kompatibilität sichern
   │
Phase 8 (Stabilität) ─────────────── Regression + Performance
```

**Kritische Regel:** Nach jeder Phase:
1. Snapshot-Tests grün
2. Build erfolgreich
3. Git-Tag gesetzt
4. Save-State Roundtrip funktioniert

---

## Risiko-Matrix (korrigiert)

| Phase | Risiko | Mitigierung |
|-------|--------|-------------|
| 0 | NIEDRIG | Keine Logikänderung |
| 1 | MITTEL→HOCH | Snapshot-Regression, Reihenfolge-Tests |
| 2 | **SEHR HOCH** | Pipeline-Order als Test fixiert, Mock-basierte Reihenfolge-Prüfung |
| 3 | HOCH | NPCOrchestrator als Single Source of Truth, Getter-Delegation |
| 4 | MITTEL | News-Snapshots, Tag-Logik-Tests |
| 5 | NIEDRIG | Interface-Extraktion, keine Logik |
| 6 | MITTEL | Cross-Hook Dependencies, Shared Engine Context |
| 7 | MITTEL | Migration-Layer + Roundtrip-Tests |
| 8 | NIEDRIG | Verifikation |

---

## Unterschiede zum Original-Plan

| Aspekt | Original | Korrigiert | Grund |
|--------|----------|-----------|-------|
| useStoryGameState | Nicht erwähnt | Phase 6 | React-Monolith ist 50% des Problems |
| DialogLoader | Nicht erwähnt | Phase 3.3 | 1336 LOC, stark mit NPC verwoben |
| Events | Phase 7 (optional) | Phase 2.3 (Pflicht) | Kaskaden sind bereits implizit events |
| DI-Pattern | "injizierbar" | Constructor Injection + Deps-Interface | Konkret umsetzbar |
| Test-Ziel | "100% Regression" | Characterization Tests für 5 Pfade | Realistisch mit 4% Baseline |
| Performance | Phase 8 | Phase 0.6 | Baseline VOR Refactoring |
| Save-State | Nicht erwähnt | Phase 0.5 + Phase 7 | Bricht sonst bestehende Saves |
| EndingSystem | Nicht erwähnt | Bleibt isoliert | Kopplung 2/10, kein Refactoring nötig |
