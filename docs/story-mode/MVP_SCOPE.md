# Story Mode - MVP Scope Definition

Klare Grenzen für das Minimum Viable Product.

---

## MVP-Vision

> Ein **komplett durchspielbares** Desinformations-Simulationsspiel aus Angreifer-Perspektive,
> das in einem isometrischen Büro stattfindet und durch dokumentarisch-ernsten Ton
> die Mechanismen von Desinformation erfahrbar macht.

**Referenz:** Antwort #90

---

## Kernanforderungen

### 1. Vollständig Durchspielbar

- Spieler kann vom Anfang bis zum Ende spielen
- Mindestens ein vollständiges Ende erreichbar
- Keine "Coming Soon"-Platzhalter im kritischen Pfad

### 2. Text-First Approach

> "Vieles lässt sich mit einem schönen Text-Modus mit etwas Farbe und CSS gut lösen."
> — Antwort #90

- Fokus auf Mechanik und Narrative
- Visuelles muss nicht pixelgenau sein
- Aktueller Dummy ist bereits akzeptables Niveau

---

## Was ist IM MVP

### Gameplay

| Feature | Details | Priorität |
|---------|---------|-----------|
| Hauptszenario | "Operation Spaltung" (Ostland vs. Westunion) | ✅ Pflicht |
| Zeitstruktur | Globaler Timer (~10 Jahre, ~12-20 Phasen) | ✅ Pflicht |
| Aktionen | ~5 pro Zeiteinheit, ressourcen-begrenzt | ✅ Pflicht |
| NPCs | 5 Charaktere (weniger Varianten OK) | ✅ Pflicht |
| Konsequenzen | Sekundäre Konsequenzen (Grundsystem) | ✅ Pflicht |
| Tutorial | In erste Aktionen integriert | ✅ Pflicht |
| Speichern | Freies Speichern (localStorage) | ✅ Pflicht |
| Ende | Mindestens 2-3 verschiedene Enden | ✅ Pflicht |
| Post-Game | Kompakte Zusammenfassung | ✅ Pflicht |

### NPCs (reduziert für MVP)

| NPC | Rolle | MVP-Umfang |
|-----|-------|------------|
| Der Direktor | Boss | Kernfunktionalität |
| Marina | Analystin | Kernfunktionalität |
| Volkov | Bot-Farm-Chef | Kernfunktionalität |
| Aleksei | Rivale | Grundversion |
| TBD | Weitere Rolle | Minimal |

**Vereinfachungen erlaubt:**
- Weniger Dialog-Varianten
- Weniger Persönlichkeits-Tiefe
- Keine Austausch-Dynamik (Post-MVP)

### Visuals

| Element | MVP-Zustand |
|---------|-------------|
| Büro-Hintergrund | 1 isometrischer Raum (oder 2D-Fallback) |
| NPC-Portraits | 5 Pixel-Art Portraits (KI-generiert) |
| Tag/Nacht | Ja (CSS-Filter) |
| UI/HUD | Funktional, nicht poliert |
| Dialog-System | Visual Novel Stil |
| News-Liste | Klickbar, funktional |
| Animationen | Hover + Klick-Feedback nur |

### Technik

| Feature | MVP-Zustand |
|---------|-------------|
| Sprachen | Deutsch + Englisch |
| Speichern | localStorage |
| Accessibility | Screen Reader + Tastatur (Grundfunktionen) |
| Seed-System | Integration (bereits vorhanden) |
| Desktop | Primär |
| Mobile | Technisch vorbereitet, nicht optimiert |

---

## Was ist NICHT im MVP

### Gameplay

| Feature | Warum nicht |
|---------|-------------|
| Verteidiger-Modus | Erst nach Angreifer-Modus |
| Mehrere Szenarien | Nur "Geopolitik" im MVP |
| Protagonist-Hintergründe | Post-MVP Erweiterung |
| NPC-Austausch | Zu komplex für MVP |
| Memory-System (Dialoge) | Zu komplex für MVP |
| Schwierigkeitsgrade | Unentschieden, wahrscheinlich nicht |
| Ausstiegs-Quiz | Idee für später |

### Visuals

| Feature | Warum nicht |
|---------|-------------|
| Weitere Räume | Die Tür zeigt "Coming Soon" |
| Animierte Portraits | Statisch ist ausreichend |
| Animierte Übergänge | Fade reicht |
| Mikro-Animationen | Nice-to-have |
| Sound/Musik | Nice-to-have |

### Technik

| Feature | Warum nicht |
|---------|-------------|
| Cloud Saves | localStorage reicht |
| Modding-System | Architektonisch vorbereitet, nicht aktiv |
| Mobile-Optimierung | Technisch möglich, nicht Fokus |
| Multiplayer | Kein MVP-Feature |
| Leaderboards | Abgelehnt (falscher Anreiz) |

---

## Akzeptanzkriterien

### Must Pass

- [ ] Spieler kann ein neues Spiel starten
- [ ] Spieler versteht die Situation durch Intro
- [ ] Spieler kann Aktionen ausführen
- [ ] Aktionen haben sichtbare Konsequenzen
- [ ] NPCs reagieren auf Spieleraktionen
- [ ] Zeit schreitet voran
- [ ] Spieler kann speichern und laden
- [ ] Spieler erreicht ein Ende
- [ ] Post-Game zeigt Zusammenfassung
- [ ] Deutsch und Englisch funktionieren
- [ ] Tastatur-Navigation funktioniert
- [ ] Screen Reader kann Grundfunktionen lesen

### Quality Bar

- Spielbar ohne Crashes
- Keine offensichtlichen Bugs im Hauptpfad
- Text ist grammatikalisch korrekt
- Konsequenzen sind logisch nachvollziehbar

---

## Vereinfachungen für MVP

### Narrative

| Geplant | MVP-Version |
|---------|-------------|
| 50+ Kern-Narrative | ~20 Kern-Narrative |
| 5000 generierte Texte | Template-System Grundversion |
| 10+ Beziehungshinweise/Zustand | 4-5 Varianten/Zustand |

### Mechanik

| Geplant | MVP-Version |
|---------|-------------|
| Komplexes Konsequenz-System | Lineare Konsequenzen |
| Dynamische NPC-Entwicklung | Statische NPCs mit einfachen Reaktionen |
| Fähigkeiten-Wachstum | Grundset von Aktionen |

### Akteure/Instrumente

| Geplant | MVP-Version |
|---------|-------------|
| Volle Engine-Komplexität | Reduziertes Set |
| Alle Fähigkeiten | Kern-Fähigkeiten |
| Alle Instrumente | Wichtigste Instrumente |

---

## Phasen-Plan

### Phase 1: Kern-Mechanik

- [ ] StoryEngineAdapter Grundgerüst
- [ ] Aktions-System
- [ ] Zeit-System
- [ ] Konsequenz-System (Basis)

### Phase 2: NPCs & Dialog

- [ ] 5 NPC-Definitionen
- [ ] Dialog-System (Entscheidungsbäume)
- [ ] Beziehungshinweise

### Phase 3: UI/UX

- [ ] Büro-Szene
- [ ] HUD
- [ ] Dialog-Darstellung
- [ ] News-Liste

### Phase 4: Spielfluss

- [ ] Intro/Onboarding
- [ ] Tutorial-Integration
- [ ] Speichersystem
- [ ] Ende-Zustände
- [ ] Post-Game

### Phase 5: Polish

- [ ] i18n (DE/EN)
- [ ] Accessibility
- [ ] Bug-Fixing
- [ ] Interne Tests

---

## Risiken & Mitigationen

### Risiko: Scope Creep

**Mitigation:**
- Dieses Dokument als Referenz
- Neue Features → Post-MVP
- "Ist das MVP-kritisch?" bei jeder Entscheidung fragen

### Risiko: Technische Komplexität

**Mitigation:**
- Text-First Approach
- 2D-Fallback bei isometrischen Problemen
- Bestehende Engine wiederverwenden

### Risiko: Content-Menge

**Mitigation:**
- Template-System für Skalierung
- Weniger Varianten, aber funktional
- KI-generierter Content wo möglich

---

## Definition of Done

Das MVP ist fertig wenn:

1. ✅ Alle "Must Pass" Akzeptanzkriterien erfüllt
2. ✅ Quality Bar erreicht
3. ✅ Interne Tests bestanden
4. ✅ Dokumentation aktualisiert
5. ✅ Deploy auf Web möglich

---

## Post-MVP Roadmap (Überblick)

| Priorität | Feature |
|-----------|---------|
| 1 | Verteidiger-Modus |
| 2 | Weitere Räume |
| 3 | NPC-Tiefe (Memory, Austausch) |
| 4 | Konzern-Szenario |
| 5 | Protagonist-Hintergründe |
| 6 | Sound/Musik |
| 7 | Modding-System aktiv |
| 8 | Community-Features |

---

## Zusammenfassung

```
MVP =
  1 Szenario (Geopolitik)
+ 1 Raum (Büro)
+ 5 NPCs (vereinfacht)
+ Komplett durchspielbar
+ Deutsch + Englisch
+ Grundlegende Accessibility
+ Funktional > Poliert
```

**Mantra:** "Es muss funktionieren und spielbar sein. Schönheit kommt später."
