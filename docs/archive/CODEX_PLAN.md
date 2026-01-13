# Story-Mode ↔ Wargaming-Engine: Codex-Plan

> **Transparenz:** Dieser Plan wurde von mir (ChatGPT) erstellt. Ich habe ihn so formuliert, dass ein Programmier-Agent (z. B. Codex/Claude Code) ihn direkt als Arbeitsauftrag interpretieren kann. Meine Begründungen sind jeweils explizit angegeben.

## Ziel
Eine klare, nachvollziehbare Brücke zwischen Story‑Mode‑UI und der bestehenden Wargaming‑Engine schaffen, inklusive fehlender Mechaniken (AP/Day, Dialog/NPC‑Layer) und einer minimalen, stabilen Engine‑API für den Story‑Mode.

---

## Issue 1 — Story‑Mode & Engine brauchen eine formale Mapping‑Schicht
**Begründung (von mir):** Aktuell ist die Zuordnung von Story‑UI‑Elementen zu Engine‑Konzepten nur interpretativ; im Code ist kein Adapter vorhanden. Für agentisches Arbeiten braucht es eindeutige, dokumentierte Kontrakte.

:::task-stub{title="Definiere und dokumentiere die Mapping-Schicht zwischen Story-UI und Engine"}
1. Erstelle eine Markdown-Datei (z. B. `docs/story-engine-mapping.md`) mit einer tabellarischen Zuordnung:
   - Spalten: *Story-UI-Element*, *Wargaming-System*, *Engine-API*, *Begründung*, *Status (impl/fehlend)*.
   - Verwende als Quellen die existierenden UI-Elemente in `src/story-mode/OfficeScreen.tsx` und die Systems in `src/game-logic/GameState.ts`/`types`.
2. Ergänze bei jeder Zuordnung eine präzise, nicht interpretative Begründung:
   - Beispiel: "TV zeigt Events" → nachweisbar durch `lastTriggeredEvent` in `GameStateManager` + TV-Element im OfficeScreen.
3. Kennzeichne ausdrücklich fehlende Adapter-Funktionen (z. B. `applyNarrativeChoice`, `advanceDay`, `getDailyActions`), statt sie als vorhanden darzustellen.
4. (Optional) Ergänze einen kurzen Abschnitt "Nicht abgedeckte Story-UI", falls UI-Elemente keinen klaren Engine-Gegenpart haben.
:::

---

## Issue 2 — AP/Day (Action Points pro Tag) fehlt im Engine‑State
**Begründung (von mir):** Story‑Mode benötigt eine Tageslogik; die Engine kennt nur `round` und `resources`. AP/Day ist damit keine Native-Funktion.

:::task-stub{title="Spezifiziere AP/Day als Engine-Konzept und Adapter"}
1. Lege fest, ob AP/Day:
   - a) eine neue Resource (`resources.actionPoints`) oder
   - b) ein separater State (`dailyActionsRemaining`) sein soll.
2. Ergänze ein Datenfeld im `GameState` (z. B. `dailyActionsRemaining: number`), inkl. Initialwert in `createInitialState`.
3. Implementiere `getDailyActions()` als öffentliche Methode in `GameStateManager`:
   ```ts
   getDailyActions(): number {
     return this.state.dailyActionsRemaining;
   }
   ```
4. Passe `advanceRound()`/`advanceDay()` so an, dass:
   - Tagesende die AP zurücksetzt,
   - und Story-Mode Aktionen AP verbrauchen.
5. Ergänze eine Test- oder Smoke-Check-Notiz (falls Tests existieren).
:::

---

## Issue 3 — Dialog/NPC‑System ist nur als Event‑Choices rudimentär vorhanden
**Begründung (von mir):** `EventChoice` ist kein NPC‑ oder Dialog‑System. Story‑Mode braucht potenziell wiederholbare, zustandsbehaftete Dialoge.

:::task-stub{title="Entwirf minimalen Dialog/NPC-Layer als Erweiterung von Event-Choices"}
1. Definiere neue Typen in `src/game-logic/types`:
   - `NpcProfile`, `DialogueNode`, `DialogueOption`, `DialogueState`.
2. Ergänze im `GameState` einen Bereich `dialogueState` oder `storyState`.
3. Implementiere eine Engine-Methode `applyNarrativeChoice(choiceId: string)`:
   - Erstes Mapping: nutze `makeEventChoice` als Übergangslösung.
4. Dokumentiere die Übergangs-Strategie:
   - Event‑Choices funktionieren kurzfristig,
   - echtes NPC‑System folgt später.
5. Beispielstruktur (skizzenhaft):
   ```ts
   type DialogueNode = {
     id: string;
     text: string;
     options: DialogueOption[];
   };
   type DialogueOption = {
     id: string;
     text: string;
     effects: EventEffect[];
     nextNodeId?: string;
   };
   ```
:::

---

## Issue 4 — Fehlende Story‑Mode‑Engine‑API‑Facade
**Begründung (von mir):** Story‑UI sollte nicht direkt `GameStateManager` aufrufen. Eine minimal‑gemeinsame API reduziert Kopplung.

:::task-stub{title="Baue eine Engine-API-Facade für Story-Mode"}
1. Lege eine neue Datei an (z. B. `src/story-mode/StoryEngineAdapter.ts`).
2. Implementiere eine minimalistische API:
   - `getDailyActions()`
   - `applyNarrativeChoice(choiceId)`
   - `advanceDay()` → intern `advanceRound()`
   - `getStoryResources()` → mappt auf `GameState.resources`
3. Beispiel (nur Skizze):
   ```ts
   export class StoryEngineAdapter {
     constructor(private gameState: GameStateManager) {}
     advanceDay(): void { this.gameState.advanceRound(); }
     getDailyActions(): number { return this.gameState.getDailyActions(); }
   }
   ```
4. Dokumentiere in der Mapping‑Datei, welche UI‑Elemente diese API nutzen.
:::

---

## Issue 5 — Story‑UI‑Elemente sind nicht mit Engine‑Actions verbunden
**Begründung (von mir):** `OfficeScreen.tsx` enthält Interaktionen/Sounds, aber keine Engine‑Bindings.

:::task-stub{title="Verbinde Story-UI-Elemente mit Engine-Adapter"}
1. Identifiziere in `src/story-mode/OfficeScreen.tsx` die UI-Triggerpunkte (Computer, Phone, TV, Smartphone, Door).
2. Injecte `StoryEngineAdapter` und mappe:
   - Computer → Übersicht (Actors/Resources)
   - Phone → Ressourcenaktionen
   - TV → `lastTriggeredEvent`/Eventliste
   - Smartphone → schnelle Ability-Aktionen
   - Door → `advanceDay()`
3. Achte darauf, dass UI nur Adapter-Methoden nutzt (keine direkten `GameStateManager` Calls).
4. Ergänze kurze UI‑Beschreibungen in `docs/story-engine-mapping.md`.
:::
