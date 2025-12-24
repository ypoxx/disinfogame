# Story Mode - Getroffene Entscheidungen

Dokumentation aller finalen Entscheidungen für den Story Mode.

---

## Grundsatzentscheidungen

### D-001: Zwei Spielmodi mit gemeinsamer Engine
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Es gibt zwei separate Spielmodi, die die gleiche Engine nutzen:
- **Wargaming Mode**: Graph-basiert, für professionelle Kommunikatoren
- **Story Mode**: Narrativ, zugänglich für die breite Öffentlichkeit

**Begründung:**
- Wargaming ist ein Nischen-Tool für Profis
- Story Mode erreicht ein größeres Publikum
- Gemeinsame Engine spart Entwicklungsaufwand und sichert Konsistenz

---

### D-002: Fiktive Länder statt realer Länder
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Verwendung von Ebene 2 - "Erkennbar, aber fiktiv":
- Länder haben erfundene Namen (z.B. "Ostland", "Westunion")
- Spieler kann Parallelen zur Realität ziehen
- Keine explizite Benennung realer Staaten

**Begründung:**
- Rechtliche Sicherheit (keine Verleumdungsklagen)
- Verhindert politische Instrumentalisierung
- Ermöglicht kreative Freiheit
- Veraltet nicht so schnell wie reale Ereignisse

**Beispiel-Mapping:**
| Fiktiv | Erkennbar als |
|--------|---------------|
| Ostland | Autoritärer Staat im Osten |
| Westunion | EU-ähnliche Allianz |
| Nordmark | Großes zentrales Land (DE) |
| Balticum | Kleine Länder mit historischem Trauma |

---

### D-003: Erweiterbares Szenario-Framework
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Die Engine wird so gebaut, dass sie mehrere Szenarien unterstützt:

```
CORE ENGINE (universell)
│
├─── SZENARIO-PACK: "Geopolitik" (MVP)
├─── SZENARIO-PACK: "Innenpolitik" (später)
├─── SZENARIO-PACK: "Kommerziell" (später)
└─── SZENARIO-PACK: "Historisch" (später)
```

**Begründung:**
- Universelle Anwendbarkeit (Brasilien, Nigeria, etc.)
- Replay-Value durch verschiedene Szenarien
- Möglichkeit für Community-Szenarien
- Trennung von Mechanik (Engine) und Inhalt (Szenarien)

---

### D-004: MVP-Szenario "Ostland vs. Westunion"
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Das erste Szenario ist das geopolitische "Operation Spaltung":
- Spieler arbeitet für Ostland
- Ziel: Die Westunion (mehrere Länder) destabilisieren
- Kontext: Ostland führt einen Konflikt gegen einen Nachbarn

**Begründung:**
- Meiste verfügbare Daten und Fallstudien (Storm-1516, Doppelgänger)
- Hohe aktuelle Relevanz
- Klare Angreifer/Verteidiger-Struktur
- Europäisches Publikum als primäre Zielgruppe

---

### D-005: Perspektive Angreifer (mit Verteidiger-Option)
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
- **Primär:** Spieler ist Angreifer (Propagandist)
- **Sekundär:** Verteidiger-Perspektive wird mitgedacht
- **Idee:** Nach Spielende kann man gleichen Seed als Verteidiger spielen

**Begründung:**
- "Learning by doing" ist effektiver als passive Beobachtung
- Beide Perspektiven erhöhen das Verständnis
- Seed-System ermöglicht direkten Vergleich
- Asymmetrisches Gameplay ist spannend

**Technische Voraussetzung:**
Seed-System ist bereits implementiert (SeededRandom.ts, URL-Sharing)

---

### D-006: Zielgruppe Story Mode
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Story Mode richtet sich an:
- Allgemeine Öffentlichkeit
- Menschen, die gerne spielen
- Interesse an edukativen/serious games
- Keine Vorkenntnisse über Desinformation nötig

**Begründung:**
- Wargaming bedient bereits die Profis
- Story Mode soll Reichweite maximieren
- Pädagogischer Impact durch Zugänglichkeit

**Nächster Schritt:**
Konkrete Persona(s) entwickeln → siehe PERSONAS.md

---

## Technische Entscheidungen

### D-T001: StoryEngineAdapter als Brücke
**Datum:** 2025-12-24
**Status:** ✅ Entschieden (aus CODEX_PLAN.md übernommen)

**Entscheidung:**
Eine Adapter-Klasse (`StoryEngineAdapter.ts`) als Fassade zwischen Story-UI und Wargaming-Engine.

**Begründung:**
- Entkopplung von UI und Engine
- Story-spezifische Methoden (advanceDay statt advanceRound)
- Narrative Transformation der Engine-Daten

---

### D-T002: AP/Day-System für Story Mode
**Datum:** 2025-12-24
**Status:** ✅ Entschieden (aus CODEX_PLAN.md übernommen)

**Entscheidung:**
Neues State-Feld `dailyActionsRemaining` für Story Mode.

**Begründung:**
- Story Mode braucht Tageslogik
- Engine kennt nur Runden
- AP begrenzt Aktionen pro "Tag"

---

## Offene Entscheidungen

Siehe [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) für noch nicht getroffene Entscheidungen.
