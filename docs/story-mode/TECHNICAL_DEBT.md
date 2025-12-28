# Technical Debt - Story Mode

> Dokumentation technischer Schulden für Nachvollziehbarkeit und Priorisierung.
> Erstellt: 2025-12-28

---

## Legende

| Status | Bedeutung |
|--------|-----------|
| `[OFFEN]` | Noch nicht bearbeitet |
| `[IN ARBEIT]` | Wird gerade bearbeitet |
| `[ERLEDIGT]` | Abgeschlossen |
| `[WONTFIX]` | Bewusst nicht behoben |

---

## KRITISCH (Blockiert Funktionalität)

### TD-001: Consequence Effects werden nicht angewandt
- **Erstellt:** 2025-12-28
- **Status:** `[ERLEDIGT]` (2025-12-28)
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Zeile:** ~536
- **Problem:** `applyConsequenceEffects()` fügt nur NewsEvents hinzu, aber die eigentlichen Ressourcen-Änderungen (risk, budget, attention, infrastructure_loss) aus dem JSON werden nicht auf den Spielzustand angewandt.
- **Auswirkung:** Konsequenzen haben keinen mechanischen Effekt auf das Spiel.
- **Lösung:** Effekte aus `consequence.effects` parsen und auf `storyResources` anwenden.

### TD-002: Private Member Access Violation
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Zeile:** ~1019
- **Problem:** `this.consequenceSystem['definitions'].get(pending.consequenceId)` greift über Bracket-Notation auf private Map zu.
- **Auswirkung:** TypeScript-Fehler bei stricter Konfiguration, fragile Kopplung.
- **Lösung:** Public Getter in ConsequenceSystem hinzufügen oder Methode refactoren.

### TD-003: Consequence Chain Trigger nicht implementiert
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Problem:** `effects_if_ignored.chain_trigger` in JSON definiert aber nicht implementiert.
- **Auswirkung:** Ignorierte Konsequenzen lösen keine Folge-Konsequenzen aus.
- **Lösung:** Chain-Trigger-Logik in `handleIgnoredConsequence()` implementieren.

### TD-004: Effects bei Ignorieren nicht angewandt
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Problem:** `effects_if_ignored` Objekt wird nicht verarbeitet.
- **Auswirkung:** Ignorieren einer Konsequenz hat keine negativen Folgen.
- **Lösung:** Effekte aus `effects_if_ignored` beim Deadline-Ablauf anwenden.

---

## HOCH (Beeinträchtigt Spielerlebnis erheblich)

### TD-005: Nur 2 von 4 Endings implementiert
- **Erstellt:** 2025-12-28
- **Status:** `[ERLEDIGT]` (2025-12-28)
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Problem:** Nur "victory" und "defeat" implementiert. "Flucht" und "moralische Erlösung" fehlen.
- **Auswirkung:** Reduzierte Replay-Value und narrative Tiefe.
- **Lösung:** Zusätzliche End-Bedingungen und Ending-Screens implementieren.

### TD-006: NPC-Dialoge hardcoded statt aus JSON
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/story-mode/hooks/useStoryGameState.ts`
- **Zeile:** ~272-276
- **Problem:** NPC-Interaktionen nutzen hardcoded Antworten statt die Dialogdaten aus npcs.json.
- **Auswirkung:** NPCs wirken statisch und nicht reaktiv.
- **Lösung:** Dialogue-System das JSON-Daten basierend auf Beziehungslevel und Kontext auswählt.

### TD-007: Objectives hardcoded statt Szenario-basiert
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/game-logic/StoryEngineAdapter.ts`
- **Zeile:** ~400
- **Problem:** TODO-Kommentar "Load from scenario definition" - Objectives sind hardcoded.
- **Auswirkung:** Keine verschiedenen Szenarien möglich.
- **Lösung:** Szenario-JSON erstellen und Objectives daraus laden.

### TD-008: NPC-Portraits sind Emoji-Platzhalter
- **Erstellt:** 2025-12-28
- **Status:** `[ERLEDIGT]` (2025-12-28)
- **Datei:** `src/story-mode/components/DialogBox.tsx`
- **Problem:** `NPC_PORTRAITS` nutzt Emojis (👔, 😠) statt Grafiken.
- **Auswirkung:** Unprofessionelles Erscheinungsbild.
- **Lösung:** Pixel-Art oder AI-generierte Portraits erstellen und integrieren.

### TD-009: Office-Hintergrund ist CSS-Fallback
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/story-mode/OfficeScreen.tsx`
- **Problem:** CSS-gerenderte Möbel statt AI-generiertem Hintergrundbild.
- **Auswirkung:** Weniger immersive Atmosphäre.
- **Lösung:** Hintergrundbild generieren oder erstellen und integrieren.

---

## MITTEL (Sollte behoben werden)

### TD-010: Große Komponenten (400+ LOC)
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Dateien:** ActionPanel.tsx (474), StatsPanel.tsx (435), NpcPanel.tsx (436)
- **Problem:** Komponenten sind zu groß und schwer wartbar.
- **Lösung:** In kleinere, wiederverwendbare Subkomponenten aufteilen.

### TD-011: Magic Numbers statt Konstanten
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Dateien:** Mehrere
- **Problem:** Zahlen wie Phasenanzahl, Ressourcenwerte sind hardcoded.
- **Lösung:** Konstanten-Datei erstellen (GAME_CONSTANTS.ts).

### TD-012: Ungenutzte Imports
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Dateien:** Verschiedene Komponenten
- **Problem:** Imports die nicht verwendet werden.
- **Lösung:** ESLint-Regel aktivieren und Cleanup durchführen.

### TD-013: Fehlende Unit-Tests
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Dateien:** ActionLoader.ts, ConsequenceSystem.ts
- **Problem:** Nur StoryEngineAdapter hat Tests, Coverage gering.
- **Lösung:** Unit-Tests für alle Engine-Klassen schreiben.

### TD-014: Type-Safety Lücken
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Dateien:** StoryEngineAdapter.ts
- **Problem:** `as any` Casts an mehreren Stellen.
- **Lösung:** Proper Types definieren und Casts entfernen.

---

## NIEDRIG (Nice to have)

### TD-015: Fehlende JSDoc Dokumentation
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Problem:** Public APIs nicht dokumentiert.
- **Lösung:** JSDoc für alle public Methoden.

### TD-016: Keine ARIA-Labels
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Problem:** Accessibility nicht implementiert.
- **Lösung:** ARIA-Labels zu interaktiven Elementen hinzufügen.

### TD-017: Kein Sound-System
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Problem:** Nur console.log Platzhalter für Audio.
- **Lösung:** Web Audio API oder Howler.js integrieren.

### TD-018: Kein Auto-Save
- **Erstellt:** 2025-12-28
- **Status:** `[OFFEN]`
- **Datei:** `src/story-mode/hooks/useStoryGameState.ts`
- **Problem:** Nur manuelles Speichern.
- **Lösung:** Auto-Save bei Phasenwechsel implementieren.

---

## Changelog

| Datum | Aktion | Details |
|-------|--------|---------|
| 2025-12-28 | Erstellt | Initiale Dokumentation aller bekannten technischen Schulden |
| 2025-12-28 | TD-001 erledigt | Consequence Effects vollständig implementiert |
| 2025-12-28 | TD-005 erledigt | Alle 4 Endings implementiert (victory, defeat, escape, moral_redemption) |
| 2025-12-28 | TD-008 erledigt | CSS-basierte NPC-Portraits erstellt |
| 2025-12-28 | Datenpfade gefixt | JSON-Dateien nach src/story-mode/data/ verschoben |

---

## Nächste Review

Geplant: Nach Abschluss der vier Prioritäten (TD-001, TD-005, TD-008, Datenpfade)
