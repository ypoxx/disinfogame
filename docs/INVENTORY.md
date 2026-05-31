# 🧾 Vollständiges Inventar — „das Feld bestellen"

> **Status:** Referenz (Bestandsaufnahme) · **Aktualisiert:** 2026-05-31 · **Scope:** ganzes Repo (289 Dateien)
> **Methodik:** 5 Helfer haben jede Datei jedes Ordners gelesen; ich habe ihre Funde **mechanisch gegengeprüft**
> (Typecheck + Import-Graph `madge` mit `@/`-Auflösung) und alle Widersprüche per Code-Suche **selbst entschieden**.
> **Vertrauen:** ✅ selbst verifiziert · ⚠️ Helfer-Aussage, plausibel · Konflikte unten im „Prüf-Protokoll".

---

## 0. Ausgangslage
- **Typecheck: sauber** ✅ — alles kompiliert. Das ist die grüne Linie, die jeder Aufräumschritt halten muss.
- 289 Dateien: 93×`.ts`, 63×`.tsx`, 73×`.md`, 35×`.json`, Rest Assets/Binär.
- Das Projekt sind **zwei Spiele**: **Story Mode** (Grundlage, die wir behalten) und **Pro Mode** (eingefroren).

## 1. Prüf-Protokoll — wo die Helfer sich irrten (selbst entschieden)
| Frage | Helfer sagte | Wahrheit (selbst geprüft) |
|---|---|---|
| Backend (`services/api.ts` + 6 Netlify-Funktionen) | „alle aktiv" | ✅ **TOT** — `api.ts` importiert *niemand*; die Funktionen sind unerreichbar |
| `data/game/scenarios.json` | „tot" | ✅ **genutzt** von `App.tsx` |
| `components/RoundSummary.tsx` | „aktiv, 3 Importe" | ✅ **tot** — nur der *Typ* `RoundSummary` wird genutzt, die Komponente nie |
| `components/Tooltip.tsx` | „intern genutzt" | ✅ **tot** — kein einziger Import |
| `OfficeScreen.tsx` | „wird nie ausgeführt" | ✅ **lebt** — `StoryModeGame` zeigt es bei `viewMode==='office'` |
| `ui/Button|Card|ProgressBar` | „geteilte Primitive" | ✅ **ungenutzt** — niemand importiert sie (Tailwind direkt verwendet) |

## 2. BEHALTEN — die Grundlage für den neuen Story Mode

### 2a. Story Mode (Kern) — `src/story-mode/` ✅
**~70 Dateien BEHALTEN.** Komplett der Keeper: alle Komponenten (DialogBox, NpcPanel, ActionPanel, OfficeScreen, StoryModeGame …), die Engine (DialogLoader, BetrayalSystem, ConsequenceSystem, CrisisMomentSystem, EndingSystem, ActionLoader, ExtendedActorLoader, StoryActorAI, StoryComboSystem, StoryNarrativeGenerator, TaxonomyLoader, NPCAdvisorEngine + 5 Strategien), `useStoryGameState`, `panelStore`, `SoundSystem`, `theme`, und die **echten Daten** (`actions(_continued)`, `consequences`, `countermeasures`, `dialogues`, `topics_dialogues`, `npcs`, `insert_library`, `world-events`).
→ *Ausnahme: 6 tote Dateien, siehe §4.*

### 2b. Geteilte Infrastruktur (beide Modi / der Build brauchen) ✅ KEEP-SHARED
- `game-logic/StoryEngineAdapter.ts` (die Brücke Story↔Engine) — **behalten, aber Monolith mit 5119 Zeilen → später aufteilen**
- `game-logic/types/*`, `game-logic/seed/SeededRandom.ts`, `game-logic/balance-config.ts`
- `utils/*` (Mathe, Farben, `cn`, Logger, network/, rendering/), `services/globalRandom.ts`
- `src/index.css`, `src/main.tsx`, `src/App.tsx` (Router), Konfig (`package.json`, `tsconfig*`, `vite.config`, `netlify.toml`, `tailwind`, `postcss`, `index.html`)
- Daten: `data/game/actors/*`, `actor-definitions-v2.json`, `persuasion/taxonomy.json`, `scenarios.json`
- `components/Encyclopedia.tsx` (von Story **und** Pro genutzt)

### 2c. Doku & Recherche — `docs/` ✅ KEEP-REF (wertvolle Grundlage)
Kanonisch: `VISION_LOCK`, `ROADMAP`, `README`, `CLAUDE_INSTRUCTIONS`, das Diagramm, `archive/pro-mode/SPEC`, sowie Story-Design-Docs (`story-mode/README`, `MVP_SCOPE`, `TECHNICAL_DEBT`, `SCENARIO_FRAMEWORK`, `PERSONAS`).
Referenz (behalten): `HIDDEN_TREASURES`, `DESIGN_DECISIONS`, `DAY_ONE_WALKTHROUGH`, `DUAL_INTERFACE_VISION`, Recherche (`THREAT_INTELLIGENCE_REVIEW`, `SCENARIO_ANALYSIS…`, PDF/EPUB), Playtests, Schemas.

## 3. EINFRIEREN — Pro Mode (`ARCHIVE-PRO`, aber **verflochten**) ⚠️
- **Pro-Oberfläche:** NetworkVisualization, UnifiedRightPanel, UnifiedRoundModal, ComboTracker, TopologyOverlay, FilterControls, GameStatistics, NotificationToast, AbilityPreview, ActorPanel, TrustEvolutionChart, StatusDisplay, NewsTicker, GameCanvas, TutorialOverlay(Pro).
- **Pro-Engine:** `GameState.ts`, `actor-ai.ts`, `NarrativeGenerator.ts`, `combo-system.ts`, `event-chain-system.ts`, `useGameState.ts`, `gameStore.ts`, `data/game/{ability-definitions-v2,combo-definitions,event-definitions,event-chains}.json`, Pro-Tests.

> **WICHTIG (Verflechtung):** `StoryEngineAdapter` (den Story braucht) **importiert `GameState`** (Pro). Pro lässt sich
> deshalb **nicht einfach verschieben** — das ist ein **vorsichtiger Entflechtungs-Schritt**, kein simples Archivieren.
> Bis dahin bleibt der Pro-Code im Baum (eingefroren), wie in `VISION_LOCK §6` festgelegt.

## 4. ENTFERNEN — nachweislich tot (kein Import, build-sicher) ✅
**Tote Pro-Komponenten (12)** in `src/components/`: `ActorReactionsOverlay`, `EventNotification`, `EventChoiceModal`, `BottomSheet`, `CompactSidePanel`, `VictoryProgressBar`, `ScoreDisplay`, `RoundSummary`, `Tooltip`, `ui/Button`, `ui/Card`, `ui/ProgressBar`. *(Mehrere im Code als „removed/consolidated" markiert.)*
**Tote Story-Hooks (5)** in `src/story-mode/hooks/`: `useActionPreview`, `useAdvisorSummary`, `useBetrayalIndicators`, `useComboProgress`, `useConsequenceTimeline` (~226 Zeilen).
**Verwaist (1):** `story-mode/components/ActorEffectivenessWidget.tsx` (nur vom Barrel re-exportiert).
**Totes Backend (7):** `services/api.ts` + die 6 `netlify/functions/*` → optional als „spätere Online-Features" ins Archiv statt löschen (deine Wahl).

## 5. WEGRÄUMEN — Müll & veraltete Doppel ✅
- **Müll/Binär:** `desinformation-network-complete.zip` (167 KB, alter Snapshot), `docs/actors_abilities_chatgpt.zip`, `docs/story-mode/data/add-effects.js`, `docs/story-mode/data/validate-actions.js`.
- **Veraltete Daten-Doppel:** `docs/story-mode/data/{actions,actions_continued,consequences,countermeasures,dialogues}.json` — **abweichende Alt-Kopien** der echten `src/story-mode/data/`-Dateien → löschen oder als `_reference/` markieren.
- **Überholte Design-Docs (Referenz behalten oder archivieren):** `NPC_ADVISOR_*`, `PLATINUM_DIALOG_*` (durch Code ersetzt).

## 6. Größte Aufräum-/Refactor-Brocken im Keeper (für den neuen Story Mode)
1. `useStoryGameState.ts` — **1447 Zeilen „Gott-Objekt"** (Spielablauf, Dialoge, Konsequenzen, Verrat, Combos in einem). Aufteilen.
2. `StoryEngineAdapter.ts` — **5119 Zeilen**. Aufteilen + von Pro entflechten.
3. `DialogLoader.ts` (1336) — und der **Reaktions-Fehler** aus `DIALOGUE_DIAGNOSIS.md` (Stichwort-Mismatch) sitzt genau hier.
4. Große Komponenten >600 Zeilen: `ActionFeedbackDialog` (906), `ActionPanel` (690), `DialogBox` (616), `NpcPanel` (550).
5. `actions.json` + `actions_continued.json` zu einer Datei zusammenführen.

---

## 7. Empfohlener Aufräum-Plan (klein, jeder Schritt build-/test-geprüft)
- **Phase 1 (sicher, sofort):** §4 tote Dateien entfernen + §5 Müll/Doppel wegräumen. Nach **jedem** Schritt `typecheck` + Tests grün halten. Risiko: minimal.
- **Phase 2 (später, vorsichtig):** Pro von Story entflechten (`StoryEngineAdapter` ↔ `GameState`), dann Pro nach `archive/pro-mode/` auslagern.
- **Phase 3 (laufend):** die Monolithen aus §6 beim Bau des verbesserten Story Mode in kleine Teile zerlegen.

*Diese Datei ist die abgeglichene Wahrheit. Bei Daten-/Code-Änderungen neu erzeugen.*
