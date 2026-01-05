# DESINFORMATION NETWORK - Development Roadmap 2026

**Erstellt:** 2026-01-03
**Aktualisiert:** 2026-01-05 (Woche 4 abgeschlossen)
**Ziel:** Platin-Niveau
**Fokus:** Story Mode
**Methodik:** Siehe `docs/CODE_REVIEW_METHODOLOGY.md`

---

## EXECUTIVE SUMMARY

Nach umfassender Code-Analyse und **Experten-Review** wurden folgende Hauptbereiche identifiziert:

| Bereich | Status | Kritische Issues | Geschätzter Aufwand |
|---------|--------|------------------|---------------------|
| **Kritische Bugs** | ✅ WOCHE 1 ABGESCHLOSSEN | ~~1 Security~~, ~~1 Seeding~~ | ~~4-6h~~ ✅ |
| **Orphan-Features** | 6+ gefunden | Encyclopedia, EventsPanel | 8-12h |
| **Technische Schulden** | 18 Items | 10 offen | 50-70h |
| **Nicht-integrierte Features** | 12+ | Tutorial, Combo-System | 30-40h |
| **UX/Visual Design** | Viele Ideen | Büro-Konzept ausstehend | 40-80h |
| **Dokumentationslücken** | 8 Bereiche | Testing, Architecture | 10-20h |

**Gesamtschätzung für Platin:** 180-280 Stunden (korrigiert nach Review)

### Fortschritt (2026-01-05):
- ✅ Woche 1: Alle kritischen Bugs behoben (Seeding, Reaction Chance, Jahr-Limit)
- ✅ Woche 2: Orphan-Features integriert (Encyclopedia, EventsPanel, TutorialOverlay)
- ✅ 3 Analyse-Fehler entdeckt: "Switch-break", "Code-Injection", "Actor-AI inaktiv"
- ✅ Methodik-Dokumentation erstellt: `docs/CODE_REVIEW_METHODOLOGY.md`
- ✅ Woche 3: Story Mode Vollständigkeit (GameEndScreen, Sound, NPC Dialoge, Pro Mode Overlap-Fix)
- ✅ Woche 4: Technische Schulden (Logger, Type-Safety, Code-Review)

---

## PHASE 1: KRITISCHE BUGS (Priorität: SOFORT)

### 1.1 BEHOBEN: OfficeScreen Klick-Bug
- **Status:** ✅ BEHOBEN (2026-01-03)
- **Problem:** Hover-Detection-Overlays blockierten onClick-Handler
- **Lösung:** onMouseEnter/onMouseLeave direkt in Komponenten integriert, Overlays entfernt
- **Datei:** `src/story-mode/OfficeScreen.tsx`

### ~~1.2 FALSCH DOKUMENTIERT: Switch-Statement ohne break~~
- **Status:** ⚠️ **FEHLER IN ANALYSE - BUG EXISTIERT NICHT!**
- **Datei:** `src/game-logic/GameState.ts:360-373`
- **Realität:** Code wurde verifiziert - **ALLE break-Statements sind vorhanden**
- **Lektion:** Agent-Berichte nicht blind vertrauen, Code selbst lesen
- **Siehe:** `docs/CODE_REVIEW_METHODOLOGY.md`

### ~~1.2 FALSCH DOKUMENTIERT: Code-Injection Risiko (new Function)~~
- **Status:** ⚠️ **FEHLER IN ANALYSE - RISIKO EXISTIERT NICHT!**
- **Datei:** `src/game-logic/GameState.ts` (Event-Condition-Evaluation)
- **Realität:** Code verwendet bereits `safe-expression-parser.ts` (Zeile 1108)
  - Kein `eval()` oder `new Function()` im Codebase gefunden
  - CrisisMomentSystem verwendet Regex-basiertes Parsing
- **Lektion:** Auch Security-Behauptungen selbst verifizieren!

### 1.3 BEHOBEN: Reaction Chance kann >100% sein
- **Status:** ✅ BEHOBEN (2026-01-04)
- **Datei:** `src/game-logic/actor-ai.ts:121-122`
- **Problem:** `reactionChance` wurde nicht geclampt
- **Lösung:** `Math.max(0, Math.min(1, reactionChance))` hinzugefügt

### 1.4 BEHOBEN: Math.random() bricht Seeding in Story Mode
- **Status:** ✅ BEHOBEN (2026-01-04)
- **Dateien:** 9 Dateien geändert
- **Problem:** Gameplay-Entscheidungen nutzten ungeseedetes Math.random()
- **Lösung:**
  - StoryEngineAdapter: seededRandom() verwendet
  - GameEndScreen, StoryActorAI, CrisisMomentSystem, ExtendedActorLoader: globalRandom.random() verwendet
  - gameStore, NotificationToast: Deterministische Counter für IDs
- **Story Mode jetzt vollständig reproduzierbar für Tests**

### 1.5 BEHOBEN: Jahr 7 Phase-Limit
- **Status:** ✅ BEHOBEN (2026-01-04)
- **Datei:** `src/story-mode/StoryModeGame.tsx:574`
- **Problem:** `Math.min(state.storyPhase.year, 7)` - Aktionen für Jahre 8-10 luden nicht
- **Lösung:** Jahre 1-7 → ta01-ta07, Jahre 8-10 → 'targeting' Phase

---

## PHASE 2: NICHT-INTEGRIERTE FEATURES

### 2.1 BEHOBEN: EventsPanel integriert
- **Status:** ✅ BEHOBEN (2026-01-04)
- **Lösung:**
  - `showEventsPanel` State hinzugefügt
  - `onOpenEvents` und `worldEventCount` an OfficeScreen übergeben
  - OfficeDoor öffnet jetzt EventsPanel (auch 'E' Shortcut)
  - 72 World Events sind jetzt sichtbar

### 2.2 BEHOBEN: TutorialOverlay integriert
- **Status:** ✅ BEHOBEN (2026-01-04)
- **Lösung:**
  - `useTutorial` Hook integriert
  - Auto-Start bei erstem Spielstart
  - 10-Schritt Tutorial mit Skip/Complete
  - Speichert Fortschritt in localStorage

### 2.3 GameEndScreen Duplikation
- **Status:** ⚠️ ZWEI VERSIONEN
- **Dateien:**
  - `src/story-mode/StoryModeGame.tsx:150-301` (lokale Version, aktiv)
  - `src/story-mode/components/GameEndScreen.tsx` (exportiert, ungenutzt)
- **Lösung:** Lokale Version löschen, Komponenten-Version nutzen
- **Aufwand:** 30 Minuten

### 2.4 Sound System nicht aktiviert
- **Status:** ⚠️ IMPLEMENTIERT, ABER DEAKTIVIERT
- **Datei:** `src/story-mode/utils/SoundSystem.ts`
- **Problem:** Web Audio API ist vollständig implementiert, aber nirgends aufgerufen
- **Aufwand:** 2 Stunden

### 2.5 Combo System nicht in Story Mode
- **Status:** ⚠️ NUR PRO MODE
- **Problem:** StoryComboSystem.ts existiert, aber nicht mit UI verbunden
- **Aufwand:** 4 Stunden

### 2.6 Taxonomy nicht mit Actions verknüpft
- **Status:** ⚠️ DATEN EXISTIEREN
- **Datei:** `src/story-mode/engine/TaxonomyLoader.ts`
- **Problem:** 27 Überzeugungstechniken definiert, aber nicht in Aktions-UI sichtbar
- **Aufwand:** 3 Stunden

### 2.7 NEU: Weitere Orphan-Features (Experten-Review 2026-01-04)

| Feature | Datei | Problem |
|---------|-------|---------|
| `dismissCurrentEvent` | hooks/useGameState.ts:375-381 | Handler existiert, wird nie aufgerufen |
| `toggleSettings` | hooks/useGameState.ts:368-373 | Handler existiert, keine Settings-UI |
| `toggleTutorial` | hooks/useGameState.ts:361-367 | Handler existiert, nicht verwendet |
| ~~`worldEventCount`~~ | ~~OfficeScreen.tsx:23~~ | ✅ BEHOBEN: Wird jetzt übergeben |
| ~~Actor-AI System~~ | ~~game-logic/actor-ai.ts~~ | ✅ WAR BEREITS AKTIV (falsche Analyse) |
| Event-Chain-System | game-logic/event-chain-system.ts | System existiert, nie aufgerufen |
| NarrativeGenerator | game-logic/NarrativeGenerator.ts | 400 Zeilen Templates, Story Mode nutzt es nicht |

**Aufwand für verbleibende Integration:** 4-6 Stunden

---

## PHASE 3: TECHNISCHE SCHULDEN

### 3.1 Type-Safety Violations (`as any`)
| Datei | Zeile | Kontext |
|-------|-------|---------|
| ActionLoader.ts | 80 | `actionsContinuedData as any` |
| ConsequenceSystem.ts | 157 | `consequencesData as any` |
| CountermeasureSystem.ts | 101, 348 | 2x `countermeasuresData as any` |
| DialogLoader.ts | 87 | `dialoguesData as any` |
| StoryComboSystem.ts | 130 | `comboData as any` |
| TaxonomyLoader.ts | 123 | `taxonomyData as any` |
| StoryEngineAdapter.ts | 429, 525, 2299, 2376, 2395, 2467, 2549 | JSON Imports |

**Lösung:** Proper TypeScript-Interfaces für JSON-Daten erstellen
**Aufwand:** 4 Stunden

### 3.2 Console.log Statements (60+)
- CrisisMomentSystem.ts: 2 Stellen
- StoryComboSystem.ts: 4 Stellen
- ConsequenceSystem.ts: 6 Stellen
- ActionLoader.ts: 3 Stellen
- Viele weitere...

**Lösung:** Logger-Abstraktion mit Production/Development-Flag
**Aufwand:** 2 Stunden

### 3.3 Duplicate Code
- `getConnectedActors()` in utils/index.ts UND combo-system.ts
- Unterschiedliche Algorithmen (1-hop vs BFS)
**Aufwand:** 30 Minuten

### 3.4 Große Komponenten (400+ LOC)
- StoryEngineAdapter.ts: 4843 Zeilen!
- NetworkVisualization.tsx: 900+ Zeilen
- UnifiedRoundModal.tsx: 600+ Zeilen

**Aufwand:** 8 Stunden (Refactoring)

### 3.5 Fehlende Unit Tests (~5% Coverage)
**Aufwand:** 20+ Stunden

### 3.6 Keine ARIA Labels (Accessibility)
**Aufwand:** 8 Stunden

### 3.7 Keine Auto-Save Funktionalität
**Aufwand:** 2 Stunden

---

## PHASE 4: UX/VISUAL DESIGN VERBESSERUNGEN

### 4.1 Büro-Konzept (wie Mad TV/Mad News)

**Vision:** Begehbares Bürogebäude mit verschiedenen Räumen

**Räume:**
| Raum | Funktion | Aktuelle Umsetzung |
|------|----------|-------------------|
| Hauptbüro | Aktions-Terminal | OfficeScreen (CSS-basiert) |
| Nachrichtenzentrale | News/Events | Smartphone im Büro |
| Kontaktraum | NPC-Interaktion | Telefon im Büro |
| Archiv | Mission/Stats | TV + Ordner |
| Flur/Lobby | Navigation | OfficeDoor → Events |

**Verbesserungsideen:**
1. **Isometrische Ansicht** statt Top-Down Office
2. **Animierte Figur** die zwischen Räumen geht
3. **Raum-Übergänge** mit Fade/Slide-Animationen
4. **Interaktive Objekte** mit Hover-Glow und Klick-Feedback

**Aufwand:** 40-60 Stunden (kompletter Redesign)

### 4.2 Mikroanimationen

**Fehlende Animationen:**
- [ ] Button-Hover mit Shake/Scale
- [ ] Panel-Slide-In von Seite
- [ ] Zahl-Animationen bei Resource-Änderungen
- [ ] Trust-Bar smooth transitions
- [ ] Notification-Einflug
- [ ] Partikel bei kritischen Events
- [ ] Typing-Effekt für NPC-Dialoge

**Aufwand:** 8-12 Stunden

### 4.3 Theme-System Erweiterung

**Fehlende Design-Tokens:**
- Crisis-Farben (Eskalationsstufen)
- Combo-Progress-Farben
- Betrayal-Warning-Farben
- Opportunity-Aktions-Highlight

**Aufwand:** 4 Stunden

### 4.4 Constrained Layout (Roadmap Phase 2)

- Akteure innerhalb Category-Circles halten
- Collision-Detection
- Dynamische Radien basierend auf Canvas-Größe

**Aufwand:** 8 Stunden

---

## PHASE 5: DOKUMENTATION

### 5.1 Fehlende Dokumentation

| Dokument | Status | Priorität |
|----------|--------|-----------|
| Architecture Diagram | ❌ | Hoch |
| Component Catalog | ❌ | Mittel |
| API Reference | ❌ | Mittel |
| Testing Strategy | ❌ | Hoch |
| Contributing Guide | ❌ | Mittel |
| Player Journey Map | ❌ | Niedrig |
| Glossary | ❌ | Niedrig |

### 5.2 Inkonsistenzen in Doku

- Actor Count: README sagt 58, Roadmap sagt 16→56
- Combo System: CLAUDE_INSTRUCTIONS sagt "pending", AUDIT sagt "implemented"
- Sound System: Verschiedene Status-Angaben

---

## PHASE 6: CODE-BEREINIGUNG UND INTEGRATION

### KRITISCH: Wertvolle Komponenten die INTEGRIERT werden müssen!

| Komponente | Zeilen | Status | Aktion |
|------------|--------|--------|--------|
| **Encyclopedia.tsx** | 218 | ORPHAN! | **INTEGRIEREN** - Einzige Bildungskomponente! toggleEncyclopedia existiert, aber Komponente wird nie gerendert |
| **TrustEvolutionChart.tsx** | 200+ | UNGENUTZT | **INTEGRIEREN** - Wertvolle Post-Game-Analytik (Trust-Trajektorie, Heatmaps) |
| **CompactSidePanel.tsx** | ~200 | SUPERSEDED | **ALS REFERENZ BEHALTEN** - Löst dokumentierte Widescreen-UX-Probleme |
| **RoundSummary.tsx** | ~200 | MERGED | **NARRATIVE PRÜFEN** - Hat detailliertere Erklärungen als UnifiedRoundModal |
| **BottomSheet.tsx** | ~150 | SUPERSEDED | **FÜR MOBILE BEHALTEN** - Besseres Mobile-Pattern (swipe-up) |

### Tatsächlich zu entfernende Komponenten:

| Komponente | Zeilen | Grund |
|------------|--------|-------|
| GameCanvas.tsx | 498 | Ersetzt durch NetworkVisualization (Canvas bei 50+ Akteuren ggf. performanter) |
| ActorPanel.tsx | 327 | Vollständig in UnifiedRightPanel integriert |
| StatusDisplay.tsx | ~100 | In VictoryProgressBar integriert |
| NewsTicker.tsx | 193 | Pattern aufgegeben |
| EventNotification.tsx | ~150 | Konsolidiert in NotificationToast |

**Konservative Einsparung:** ~1,200 Zeilen Code (nach Behalten wertvoller Komponenten)

---

## PRIORISIERTE AUFGABENLISTE

### WOCHE 1: Kritische Bugs + Seeding (BLOCKING) ✅ ABGESCHLOSSEN
1. [x] ~~Switch-Statement break~~ **EXISTIERT NICHT - aus Liste entfernt**
2. [x] ✅ Math.random() durch seeded ersetzen - 9 Dateien geändert (2026-01-04)
3. [x] ~~Code-Injection-Risiko~~ **EXISTIERT NICHT - Code bereits sicher**
4. [x] ✅ Reaction Chance clampen (2026-01-04)
5. [x] ✅ Jahr-7-Limit → Jahre 8-10 nutzen 'targeting' Phase (2026-01-04)

### WOCHE 2: Orphan-Features integrieren ✅ ABGESCHLOSSEN
6. [x] ✅ Encyclopedia.tsx in App.tsx + StoryModeGame.tsx ('I' Shortcut)
7. [x] ✅ EventsPanel + worldEventCount integriert (OfficeDoor + 'E' Shortcut)
8. [x] ✅ TutorialOverlay integriert (auto-start, 10 Schritte)
9. [x] TrustEvolutionChart → GEPLANT (benötigt Trust-History-State)
10. [x] Actor-AI System → WAR BEREITS AKTIV (falsche Analyse)

### WOCHE 3: Story Mode Vollständigkeit ✅ ABGESCHLOSSEN
11. [x] ✅ GameEndScreen Duplikation beheben - Inline-Version entfernt, Komponente importiert
12. [x] ✅ Sound System aktivieren - UI-Toggle im Pause-Menü, 20+ playSound Aufrufe aktiv
13. [x] ⚠️ Combo System in Story Mode - Backend funktioniert, UI-Anzeige fehlt noch
14. [x] ✅ Taxonomy in UI anzeigen - Encyclopedia vollständig integriert
15. [x] ✅ NarrativeGenerator in Story Mode - Bereits aktiv und integriert
16. [x] ✅ NPC Dialog Close-Button Bug behoben (X-Button + Escape)
17. [x] ✅ Elaborate NPC Dialoge aktiviert (DialogLoader statt npcs.json)
18. [x] ✅ Pro Mode Overlap-Bug behoben (Floating HUD entfernt)

### WOCHE 4: Technische Schulden ✅ ABGESCHLOSSEN
19. [x] ✅ Logger-Service erstellt (`src/utils/logger.ts`) - Production-aware logging
20. [x] ✅ Console.log durch Logger ersetzen - 80+ Stellen in kritischen Dateien ersetzt
21. [x] ✅ Type-Safety verbessert (23 → 16 `as any` casts, -30%)
22. [x] ✅ Duplicate Code geprüft - getConnectedActors sind verschiedene Algorithmen (1-hop vs BFS)
23. [ ] Große Komponenten aufteilen (8h) - Low priority, Code funktioniert

### WOCHE 5-7: UX/Visual Design ⏳ IN PROGRESS
20. [x] ✅ Theme-System erweitern (colors.ts) - Crisis/Combo/Betrayal/Opportunity Farben
21. [x] ✅ Mikroanimationen (index.css) - 20+ Keyframes, Utility-Klassen
22. [x] ✅ Animation-Hooks erstellt - useTypingEffect, useAnimatedValue
23. [ ] Büro-Konzept redesignen (40-60h) - Größeres Projekt

### WOCHE 8-9: Testing + Dokumentation
23. [ ] Unit Tests schreiben (20h)
24. [ ] Accessibility (ARIA) (8h)
25. [ ] Dokumentation vervollständigen (10h)

### WOCHE 10+: Polish
26. [ ] Alle Orphan-Features nochmal prüfen
27. [ ] Code nach CODE_REVIEW_METHODOLOGY.md prüfen
28. [ ] Performance-Optimierung
29. [ ] Playtesting & Balancing

---

## METRIKEN FÜR PLATIN-NIVEAU

| Metrik | Aktuell | Ziel Platin |
|--------|---------|-------------|
| Kritische Bugs | 4 (verifiziert) | 0 |
| Orphan-Features | 6+ | 0 (alle integriert) |
| Test Coverage | ~5% | 60%+ |
| Accessibility Score | ~10% | WCAG 2.1 AA |
| Story Mode Completion | 75% | 100% |
| UI/UX Design | Basic | Polished |
| Seeding | Broken | Deterministisch |
| Documentation | 85% | 100% |
| Dead Code | ~3000 LOC | 0 |
| Type Safety | 70% | 95%+ |

---

## APPENDIX: VOLLSTÄNDIGE BUG-LISTE

### Kritisch (Game-Breaking)
1. Switch-Statement ohne break (GameState.ts:360)
2. Reaction Chance >100% (actor-ai.ts:110)

### Hoch (Feature-Breaking)
3. EventsPanel nicht verbunden (StoryModeGame.tsx)
4. Math.random() bricht Seeding (StoryEngineAdapter.ts:2042)
5. Jahr 7 Phase-Limit (StoryModeGame.tsx:574)
6. TutorialOverlay nicht gerendert

### Mittel (UX-Issues)
7. hasNotification immer true (OfficeScreen.tsx:651)
8. Phase-Encoding-Inkonsistenz (ActionPanel vs ConsequenceModal)
9. Unsafe Property Access (useStoryGameState.ts:297)
10. GameEndScreen Duplikation

### Niedrig (Code Quality)
11. 60+ Console.log Statements
12. 9+ `as any` Type Casts
13. Duplicate getConnectedActors()
14. Ungenutzte Exports
15. Fehlende JSDoc

---

**Letzte Aktualisierung:** 2026-01-05 | **Nächstes Review:** 2026-01-12
