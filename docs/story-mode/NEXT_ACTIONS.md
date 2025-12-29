# Story Mode - Nächste Aktionen

Priorisierte Aktionsliste basierend auf Q&A vom 2025-12-27.

---

## Sofort (vor Implementierung)

### 1. Sekundäre Konsequenzen ausarbeiten
**Priorität:** 🔴 HOCH
**Referenz:** Q-NEW-008

Die Long-List der sekundären Konsequenzen muss vor der Implementierung definiert werden.

**Aktion:**
- [ ] Brainstorming-Session für Konsequenz-Ketten
- [ ] Pro Aktionstyp 3-5 mögliche Sekundäreffekte
- [ ] In maschinenlesbares Format bringen

---

### 2. Psychologische Modelle recherchieren
**Priorität:** 🟡 MITTEL
**Referenz:** Q-NEW-007

Für NPC-Persönlichkeiten und Beziehungshinweise.

**Aktion:**
- [ ] Big Five vs. andere Modelle vergleichen
- [ ] Dark Triad für Täter-Seite evaluieren
- [ ] 10+ Beziehungshinweis-Varianten pro Zustand schreiben

---

### 3. NPC-Definitionen erstellen
**Priorität:** 🔴 HOCH
**Vorbedingung:** #2

**Aktion:**
- [ ] 5 NPCs mit Persönlichkeitsprofil
- [ ] Basis-Dialoge pro NPC
- [ ] Beziehungs-Varianten

---

## Phase 1: Kern-Mechanik

### 4. StoryEngineAdapter implementieren
**Abhängigkeit:** Verständnis der bestehenden Engine

```typescript
// Grundgerüst
interface StoryEngineAdapter {
  advanceTime(): void;
  getAvailableActions(): StoryAction[];
  executeAction(action: StoryAction): ActionResult;
}
```

**Aktion:**
- [ ] Bestehende GameState.ts analysieren
- [ ] Adapter-Interface definieren
- [ ] Grundimplementierung

---

### 5. Aktions-System
**Abhängigkeit:** #4

**Aktion:**
- [ ] Aktions-Typen definieren (reduziertes Set für MVP)
- [ ] ~5 Aktionen pro Phase
- [ ] Ressourcen-Kosten

---

### 6. Zeit-System
**Abhängigkeit:** #4

**Aktion:**
- [ ] Phasen-Logik (~12-20 Phasen für ~10 Jahre)
- [ ] Phase-Übergang
- [ ] Ereignisse pro Phase

---

### 7. Konsequenz-System
**Abhängigkeit:** #1, #4

**Aktion:**
- [ ] Primärkonsequenzen implementieren
- [ ] Sekundärkonsequenzen-Ketten
- [ ] Konsequenz-Visualisierung

---

## Phase 2: NPCs & Dialog

### 8. Dialog-System
**Abhängigkeit:** #3

**Aktion:**
- [ ] Entscheidungsbaum-Datenstruktur
- [ ] Dialog-Renderer (Visual Novel Stil)
- [ ] NPC-Reaktionen

---

### 9. Beziehungs-System
**Abhängigkeit:** #2, #8

**Aktion:**
- [ ] Beziehungswerte pro NPC
- [ ] Qualitative Hinweise (10+ Varianten)
- [ ] Auswirkungen auf Dialoge

---

## Phase 3: UI/UX

### 10. Büro-Szene
**Aktion:**
- [ ] Isometrisches Hintergrundbild (oder 2D-Fallback)
- [ ] Interaktive Bereiche definieren
- [ ] Day/Night-Cycle (CSS)

---

### 11. HUD
**Aktion:**
- [ ] Ressourcen-Anzeige
- [ ] Zeit/Phase-Anzeige
- [ ] Kontextuelle Bereiche

---

### 12. News-Liste
**Aktion:**
- [ ] Klickbare Liste-Komponente
- [ ] Neu vs. Alt Unterscheidung
- [ ] Konsequenzen-Integration

---

## Phase 4: Spielfluss

### 13. Intro & Onboarding
**Aktion:**
- [ ] Intro-Text schreiben (mit Warnung)
- [ ] Kleine Chat-Sequenz
- [ ] Tutorial-Integration

---

### 14. Speicher-System
**Aktion:**
- [ ] Save/Load Funktionen
- [ ] localStorage Integration
- [ ] Autosave?

---

### 15. Enden
**Aktion:**
- [ ] 2-3 Ende-Zustände definieren
- [ ] Ende-Bedingungen prüfen
- [ ] Post-Game Zusammenfassung

---

## Phase 5: Polish

### 16. Internationalisierung
**Aktion:**
- [ ] i18next einrichten
- [ ] Alle Texte extrahieren
- [ ] DE + EN übersetzen

---

### 17. Accessibility
**Aktion:**
- [ ] Screen Reader testen
- [ ] Tastatur-Navigation testen
- [ ] ARIA-Labels

---

### 18. Tests & Bugfixes
**Aktion:**
- [ ] Interne Playtests
- [ ] Bug-Liste erstellen
- [ ] Kritische Bugs fixen

---

## Offene Klärungen (während Entwicklung)

| Frage | Wann klären |
|-------|-------------|
| Moralische Erlösung | Bei Ende-Definitionen |
| Memory-Funktion | Bei Dialog-System |
| Schwierigkeitsgrade | Nach ersten Playtests |
| Bibliotheken-Auswahl | Bei Implementierungsstart |

---

## Checklisten (vor Release)

- [ ] Open-Source-Checkliste (CL-001)
- [ ] Modding-Checkliste (CL-002) - architektonisch vorbereitet

---

## Zusammenfassung

```
Unmittelbar:
1. Sekundäre Konsequenzen definieren
2. Psychologie-Recherche
3. NPC-Definitionen

Dann in Reihenfolge:
4-7: Kern-Mechanik
8-9: NPCs & Dialog
10-12: UI/UX
13-15: Spielfluss
16-18: Polish
```
