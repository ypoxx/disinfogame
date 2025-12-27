# Story Mode - Design & Entwicklungsdokumentation

Dieser Ordner enthält alle Design-Entscheidungen, offene Fragen und Ideen für den Story Mode.

## Ordnerstruktur

```
docs/story-mode/
├── README.md                    # Diese Datei
├── DECISIONS.md                 # Alle getroffenen Entscheidungen (40+)
├── OPEN_QUESTIONS.md            # Offene Fragen zur Diskussion
├── IDEAS.md                     # Ideen-Sammlung (angenommen/verworfen/konzept)
├── MVP_SCOPE.md                 # ⭐ MVP Definition & Grenzen
├── VISUAL_DESIGN.md             # Grafiken, UI/UX, Animationen
├── TECH_STACK.md                # Technische Architektur & Bibliotheken
├── SCENARIO_FRAMEWORK.md        # Szenario-System Design
├── ENGINE_INTEGRATION.md        # Technische Brücke zur Wargaming-Engine
└── PERSONAS.md                  # Zielgruppen-Personas
```

## Status

**Letzte Aktualisierung:** 2025-12-27

**Phase:** Konzeption abgeschlossen → Bereit für Implementierung

## Schnellzugriff

### Priorität 1: MVP verstehen
- [⭐ MVP Scope Definition →](./MVP_SCOPE.md) — Was ist drin, was nicht
- [Alle Entscheidungen →](./DECISIONS.md) — 40+ dokumentierte Entscheidungen

### Priorität 2: Design-Details
- [Visual Design →](./VISUAL_DESIGN.md) — Grafik, UI/UX, Animationen
- [Tech Stack →](./TECH_STACK.md) — Architektur, Bibliotheken
- [Szenario-Framework →](./SCENARIO_FRAMEWORK.md) — Ostland vs. Westunion

### Priorität 3: Offen & Ideen
- [Offene Fragen →](./OPEN_QUESTIONS.md) — Noch zu klären (8 Fragen)
- [Ideen-Backlog →](./IDEAS.md) — Alle Ideen mit Status

---

## Übersicht: Entscheidungen nach Kategorie

### Grundsatz (D-001 bis D-006)
- Zwei Modi mit gemeinsamer Engine
- Fiktive Länder (Ostland, Westunion)
- Erweiterbares Szenario-Framework
- MVP: Geopolitik-Szenario
- Angreifer-Perspektive (Verteidiger später)
- Zielgruppe: Allgemeine Öffentlichkeit

### Tonalität & Narrativ (D-007 bis D-014)
- Dokumentarisch-ernst mit zynischen Momenten
- Protagonist als Spielerhülle
- Ausstieg mit Hindernissen
- NPCs als komplexe Kollegen (Big Five)
- Sekundäre Konsequenzen-System
- Freiwillige Teilnahme betonen
- Multiple Enden
- Referenzen als dynamische Grundlage

### Gameplay (D-015 bis D-028)
- ~5 Aktionen pro Zeiteinheit (flexibel)
- Globaler Timer (~10 Jahre)
- Ressourcen sichtbar + narrativ
- Freies Speichern
- Tutorial integriert
- Keine Romanzen
- Und mehr...

### Technik (D-T001 bis D-T009)
- StoryEngineAdapter
- Synchrone Engine-Entwicklung
- Web-Plattform
- Deutsch + Englisch
- Accessibility Pflicht
- Open Source mit Community
- Kein Multiplayer (außer Wargaming)

### Visual (siehe VISUAL_DESIGN.md)
- Isometrisch 2.5D Diorama
- Pixel Art NPC-Portraits
- Visual Novel Dialoge
- Day/Night-Cycle

---

## Offene Fragen (Zusammenfassung)

| # | Frage | Priorität |
|---|-------|-----------|
| Q-NEW-001 | Was ist "moralische Erlösung"? | 🟡 |
| Q-NEW-002 | Memory-Funktion in Dialogen? | 🟡 |
| Q-NEW-003 | Schwierigkeitsgrade? | 🟡 |
| Q-NEW-004 | Welche Bibliotheken? | 🟡 |
| Q-NEW-008 | Sekundäre Konsequenzen Liste | 🔴 |

---

## Nächste Schritte

1. **Phase 1: Kern-Mechanik**
   - StoryEngineAdapter implementieren
   - Aktions- und Zeit-System
   - Konsequenz-System (Basis)

2. **Phase 2: NPCs & Dialog**
   - 5 NPC-Definitionen
   - Dialog-System

3. **Phase 3: UI/UX**
   - Büro-Szene
   - HUD & Dialoge

4. **Phase 4: Spielfluss**
   - Intro, Tutorial, Speichern, Enden

5. **Phase 5: Polish**
   - i18n, Accessibility, Tests
