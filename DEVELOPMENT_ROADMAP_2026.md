# DESINFORMATION NETWORK - Development Roadmap 2026

**Erstellt:** 2026-01-03
**Ziel:** Platin-Niveau
**Fokus:** Story Mode

---

## EXECUTIVE SUMMARY

Nach umfassender Code-Analyse wurden folgende Hauptbereiche identifiziert:

| Bereich | Status | Kritische Issues | Geschätzter Aufwand |
|---------|--------|------------------|---------------------|
| **Kritische Bugs** | 5 gefunden | 2 Balance-breaking | 2-4h |
| **Technische Schulden** | 18 Items | 10 offen | 40-60h |
| **Nicht-integrierte Features** | 12+ | EventsPanel, Tutorial | 20-30h |
| **UX/Visual Design** | Viele Ideen | Büro-Konzept ausstehend | 40-80h |
| **Dokumentationslücken** | 8 Bereiche | Testing, Architecture | 10-20h |

**Gesamtschätzung für Platin:** 120-200 Stunden

---

## PHASE 1: KRITISCHE BUGS (Priorität: SOFORT)

### 1.1 BEHOBEN: OfficeScreen Klick-Bug
- **Status:** ✅ BEHOBEN (2026-01-03)
- **Problem:** Hover-Detection-Overlays blockierten onClick-Handler
- **Lösung:** onMouseEnter/onMouseLeave direkt in Komponenten integriert, Overlays entfernt
- **Datei:** `src/story-mode/OfficeScreen.tsx`

### 1.2 KRITISCH: Switch-Statement ohne break (Balance-Breaking)
- **Status:** ❌ OFFEN
- **Datei:** `src/game-logic/GameState.ts:360-373`
- **Problem:**
  ```typescript
  case 'media': moneyGain += 5;  // Missing break!
  case 'expert': moneyGain += 3;
  case 'lobby': moneyGain += 4;
  ```
- **Auswirkung:** Media-Akteure geben +14 statt +5 pro Runde (Fallthrough)
- **Aufwand:** 5 Minuten

### 1.3 KRITISCH: Reaction Chance kann >100% sein
- **Status:** ❌ OFFEN
- **Datei:** `src/game-logic/actor-ai.ts:110-119`
- **Problem:** `reactionChance` wird nicht geclampt
- **Auswirkung:** Bei hohen Werten immer 100% Reaktionswahrscheinlichkeit
- **Aufwand:** 10 Minuten

### 1.4 HOCH: Math.random() bricht Seeding in Story Mode
- **Status:** ❌ OFFEN
- **Datei:** `src/game-logic/StoryEngineAdapter.ts:2042, 2044`
- **Problem:** Gameplay-Entscheidungen nutzen ungeseedetes Math.random()
- **Auswirkung:** Story Mode nicht reproduzierbar
- **Aufwand:** 15 Minuten

### 1.5 HOCH: Jahr 7 Phase-Limit
- **Status:** ❌ OFFEN
- **Datei:** `src/story-mode/StoryModeGame.tsx:574`
- **Problem:** `Math.min(state.storyPhase.year, 7)` - Aktionen für Jahre 8-10 laden nicht
- **Aufwand:** 10 Minuten

---

## PHASE 2: NICHT-INTEGRIERTE FEATURES

### 2.1 EventsPanel nicht verbunden
- **Status:** ❌ KOMPONENTE EXISTIERT, ABER NICHT GERENDERT
- **Dateien:**
  - `src/story-mode/components/EventsPanel.tsx` (vollständig implementiert)
  - `src/story-mode/StoryModeGame.tsx:512-525` (fehlt `onOpenEvents` prop)
- **Problem:**
  - OfficeDoor ist klickbar aber funktionslos
  - Keyboard-Shortcut 'e' macht nichts
  - 72 World Events existieren, aber Spieler können sie nicht sehen
- **Lösung:**
  1. `showEvents` State hinzufügen
  2. `onOpenEvents` Callback an OfficeScreen übergeben
  3. EventsPanel rendern
- **Aufwand:** 30 Minuten

### 2.2 TutorialOverlay nicht integriert
- **Status:** ❌ KOMPONENTE EXISTIERT, ABER NICHT GERENDERT
- **Dateien:**
  - `src/story-mode/components/TutorialOverlay.tsx` (200+ Zeilen)
  - `src/story-mode/hooks/useStoryGameState.ts:160` (setzt 'tutorial' Phase)
- **Problem:** Tutorial-Phase wird gesetzt, aber keine UI gezeigt
- **Aufwand:** 1 Stunde

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

### WOCHE 1: Kritische Bugs + Integration
1. [ ] Switch-Statement break hinzufügen (5 min)
2. [ ] Reaction Chance clampen (10 min)
3. [ ] Math.random() durch seeded ersetzen (15 min)
4. [ ] Jahr-7-Limit entfernen (10 min)
5. [ ] EventsPanel integrieren (30 min)
6. [ ] TutorialOverlay integrieren (1h)
7. [ ] **KRITISCH: Encyclopedia.tsx rendern!** (30 min) - Komponente existiert, wird nie angezeigt
8. [ ] TrustEvolutionChart in Post-Game integrieren (1h)

### WOCHE 2: Story Mode Vollständigkeit
9. [ ] GameEndScreen Duplikation beheben (30 min)
10. [ ] Sound System aktivieren (2h)
11. [ ] Combo System in Story Mode (4h)
12. [ ] Taxonomy in UI anzeigen (3h)

### WOCHE 3: Technische Schulden
13. [ ] Type-Safety verbessern (4h)
14. [ ] Console.log entfernen (2h)
15. [ ] Duplicate Code konsolidieren (30 min)
16. [ ] Große Komponenten aufteilen (8h)

### WOCHE 4-6: UX/Visual Design
17. [ ] Mikroanimationen hinzufügen (12h)
18. [ ] Theme-System erweitern (4h)
19. [ ] Büro-Konzept redesignen (40-60h)

### WOCHE 7-8: Testing + Dokumentation
20. [ ] Unit Tests schreiben (20h)
21. [ ] Accessibility (ARIA) (8h)
22. [ ] Dokumentation vervollständigen (10h)

### WOCHE 9+: Polish
23. [ ] Wertvolle Komponenten prüfen und ggf. integrieren
24. [ ] Tatsächlich toten Code entfernen (nach Prüfung!)
25. [ ] Performance-Optimierung
26. [ ] Playtesting & Balancing

---

## METRIKEN FÜR PLATIN-NIVEAU

| Metrik | Aktuell | Ziel Platin |
|--------|---------|-------------|
| Kritische Bugs | 5 | 0 |
| Test Coverage | ~5% | 60%+ |
| Accessibility Score | ~10% | WCAG 2.1 AA |
| Story Mode Completion | 75% | 100% |
| UI/UX Design | Basic | Polished |
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

**Letzte Aktualisierung:** 2026-01-03 | **Nächstes Review:** 2026-01-10
