# Next Steps: Von Konzept zu Umsetzung

**Stand:** 2025-12-12
**Phase:** Konzeptvalidierung → Detailplanung
**Priorität:** Fragen klären BEVOR Programmierung beginnt

---

## 🎯 Wo stehen wir?

### ✅ Erledigt:
1. **Umfassende Spielerecherche** durchgeführt:
   - Office Management Sims (News Tower, Mad News, Mad TV)
   - Narrative Autoritäre Spiele (Papers Please, Beholder, The Westport Independent)
   - Hybride (Reigns, This War of Mine)
   - Educational Serious Games (BotBusters, Troll Factory, etc.)

2. **Architektur-Analyse** abgeschlossen:
   - Core Engine ist 100% wiederverwendbar
   - UI-Layer ist vollständig austauschbar
   - JSON-basierte Konfiguration ermöglicht Flexibilität

3. **Vision dokumentiert** in `DUAL_INTERFACE_VISION.md`:
   - Konzept: Zwei Türen zum gleichen Spiel
   - Profi-Modus: Graph-basiertes Wargaming (aktuell)
   - Spieler-Modus: Narrative Office-Simulation (neu)

4. **Design-Prinzipien** definiert:
   - Klarheit vor Komplexität
   - Narrative Integration = Mechanik
   - Räumliche Metaphern
   - Educational Value durch Immersion

### ❓ Kritische Blocker - MÜSSEN beantwortet werden:

Siehe `DUAL_INTERFACE_VISION.md` → Abschnitt "❓ Kritische Fragen zur Visionspräzisierung"

**Top-Priorität Fragen:**

1. **Narrative:** Was ist das konkrete Spielziel? (Referendum verhindern? Wahl gewinnen? Anderes?)
2. **Tonalität:** Wie moralisch ambigue? Satirisch? Mit Dilemmata? Rein educational?
3. **Scope:** Wie viele NPCs/Räume im MVP? (4-5 minimal, 8-10 erweitert)
4. **Targeting:** Wie wird Akteur-Auswahl vereinfacht? (Empfehlungen? Kategorien?)
5. **Pace:** Zeitdruck pro Tag? Aktionen-Limit? Oder frei wie aktuell?

---

## 📋 Immediate Action Items (vor Programmierung)

### 1. Fragen-Workshop durchführen
**Wer:** Team/Stakeholder
**Wann:** ASAP
**Wo:** Meeting oder asynchron via Dokument-Kommentare
**Output:** Antworten zu allen 24 Fragen in `DUAL_INTERFACE_VISION.md`

**Methode:**
- Jede Kategorie durchgehen (Narrative, Gameplay, Pace, Educational, Technical, Content)
- Entscheidungen dokumentieren
- Trade-offs diskutieren
- MVP-Scope festlegen

### 2. Szenario ausarbeiten
**Basierend auf:** Antworten zu Q1.1-Q1.3
**Output:** 1-2 Seiten Narrative Design Doc
**Inhalt:**
- Konkrete Story-Setup
- Protagonist-Hintergrund
- Hauptziel (statt abstraktes Win-Condition)
- Moralische Rahmung
- Event-Beispiele die zur Story passen

**Template:**
```markdown
# Szenario: [Titel]

## Setup
[Wie wurde der Spieler Propagandaminister? Warum jetzt? Was ist der Kontext?]

## Hauptziel
[Konkret: Was muss bis Tag 32 erreicht werden?]

## Antagonisten
[Wer arbeitet gegen dich? Opposition? Ausland? Medien?]

## NPCs
[Wer sind deine "Kollegen"? Namen, Persönlichkeiten, Motivationen]

## Moralische Dimension
[Gibt es persönliche Stakes? Familie? Gewissen? Oder rein mechanisch?]

## Beispiel Event-Ketten
[2-3 Story-Beats die durch das Spiel leiten]
```

### 3. Wireframes erstellen
**Tool:** Figma / Excalidraw / Hand-Sketch
**Output:** 5-8 Screen-Mockups (Low-Fidelity)

**Screens zu erstellen:**
1. **Mode Selection Screen**
   - "Profi-Modus" vs "Story-Modus" Auswahl
   - Kurze Erklärung beider Modi
   - Visuelle Differenzierung

2. **Office Overview** (Hauptbildschirm Spieler-Modus)
   - Büro-Layout mit Türen zu NPCs
   - Schreibtisch mit Computer/Inbox
   - Ressourcen-Anzeige
   - Kalender/Tage-Counter

3. **E-Mail/Inbox Screen**
   - Liste von E-Mails (Events)
   - E-Mail öffnen → Event-Text + Entscheidungen
   - 90er-Ästhetik (Pixel-Art-Mockup)

4. **NPC-Raum Screen**
   - NPC-Portrait
   - Dialog-Box mit Optionen (= Abilities)
   - Ressourcen-Kosten sichtbar
   - Targeting-Interface

5. **Targeting-Interface**
   - Vereinfachte Akteur-Auswahl
   - Kategorien ODER Top-Empfehlungen
   - "Bestätigen" Button

6. **Tages-Zusammenfassung**
   - "Was ist passiert" Narrative
   - Ressourcen-Entwicklung
   - Fortschritt-Indikator
   - "Nächster Tag" Button

7. **Game Over / Victory Screen**
   - Outcome (Win/Lose + Grund)
   - Statistiken
   - Educational Debriefing (optional)
   - "Play Again" Button

8. **Shared: Encyclopedia/Tutorial**
   - Kann beides Modi nutzen?
   - Oder separate Versionen?

**Stil:** Lo-Fi Wireframes (Boxen + Pfeile), NICHT High-Fidelity Design

### 4. UX-Flow Diagramm
**Tool:** Miro / Whimsical / Draw.io
**Output:** Vollständiger Spieler-Journey Flow

**Struktur:**
```
START
  ↓
Mode Selection → Wählt "Spieler-Modus"
  ↓
Intro/Tutorial (optional)
  ↓
┌─────────────────────────────────┐
│ MAIN GAME LOOP (32 Runden)     │
│                                 │
│ Tag N Start                     │
│   ↓                             │
│ Office Screen                   │
│   ├─→ E-Mails lesen             │
│   │   ├─→ Event mit Entscheidung│
│   │   └─→ Zurück zu Office      │
│   ├─→ Zu NPC gehen              │
│   │   ├─→ Dialog                │
│   │   ├─→ Ability wählen        │
│   │   ├─→ Targeting             │
│   │   └─→ Zurück zu Office      │
│   └─→ "Tag beenden"             │
│        ↓                        │
│   Automatische Verarbeitung     │
│        ↓                        │
│   Tages-Zusammenfassung         │
│        ↓                        │
│   Win/Lose Check                │
│     ├─→ Weiter → Tag N+1        │
│     └─→ Game Over Screen → END  │
└─────────────────────────────────┘
```

Mit:
- Entscheidungspunkten markiert
- "Back"-Flows eingezeichnet
- Alternative Pfade (z.B. Tutorial überspringen)

### 5. Technical Architecture Document
**Output:** `docs/TECHNICAL_ARCHITECTURE_DUAL_MODE.md`

**Inhalt:**
```markdown
# Technical Architecture: Dual-Mode System

## 1. Folder Structure
src/
  ├── game-logic/          → SHARED (beide Modi)
  ├── data/                → SHARED (beide Modi)
  ├── stores/              → SHARED mit Extensions
  ├── hooks/
  │   ├── useGameState.ts  → SHARED
  │   └── useStoryMode.ts  → NEU (Spieler-Modus spezifisch)
  ├── components/
  │   ├── pro-mode/        → Graph UI (aktuell)
  │   └── story-mode/      → Office UI (neu)
  ├── utils/               → SHARED + mode-specific
  └── App.tsx              → Router zwischen Modi

## 2. Shared Engine Interface
[Welche Methoden/Hooks werden von beiden UIs genutzt?]

## 3. Mode-Specific Layers
[Was ist NICHT shared?]

## 4. Data Flow
[GameState → Hooks → Components, für beide Modi visualisiert]

## 5. Asset Management
[Wie werden Pixel-Art-Assets geladen? Wo gespeichert?]

## 6. Routing Strategy
[React Router? Mode als Query-Param? Separate Builds?]
```

### 6. MVP Feature Matrix
**Output:** Google Sheet oder Markdown Table

| Feature                     | Profi-Modus | Spieler-Modus MVP | Spieler v2.0 | Notes                          |
|-----------------------------|-------------|-------------------|--------------|--------------------------------|
| 58 Akteure                  | ✅          | ✅                | ✅           | Gleiche Daten                  |
| Graph Visualisierung        | ✅          | ❌                | Optional?    | Spieler: nur in Strategie-Raum |
| Network Topology Analysis   | ✅          | 🟡                | ✅           | MVP: Vereinfacht               |
| Alle 30+ Abilities          | ✅          | 🟡                | ✅           | MVP: Reduziert auf Top 15?     |
| Office UI                   | ❌          | ✅                | ✅           |                                |
| E-Mail System               | ❌          | ✅                | ✅           |                                |
| NPC Dialoge                 | ❌          | ✅                | ✅           | MVP: Text-basiert              |
| NPC Persönlichkeiten        | ❌          | 🟡                | ✅           | MVP: Basic, v2: Rich           |
| Event System                | ✅          | ✅                | ✅           | Gleiche Events, andere UI      |
| Combo System                | ✅          | ✅                | ✅           | Gleiche Mechanik               |
| Actor AI                    | ✅          | ✅                | ✅           | Im Hintergrund                 |
| Tutorial                    | ✅          | ✅ (angepasst)    | ✅           | Unterschiedliche Inhalte       |
| Encyclopedia                | ✅          | 🟡                | ✅           | MVP: Post-Game? v2: Ingame     |
| Statistics                  | ✅          | ✅                | ✅           | Unterschiedliche Präsentation  |
| Pixel-Art Ästhetik          | ❌          | ✅                | ✅           |                                |
| Story-Events                | ❌          | 🟡                | ✅           | MVP: Wenige, v2: Viele         |
| Moralische Reflexion        | ❌          | ?                 | ✅           | Abhängig von Fragen-Antworten  |
| Multi-Language              | 🟡 (DE)     | 🟡 (DE)           | ✅ (DE+EN)   |                                |

Legende: ✅ = Full Implementation, 🟡 = Partial/Simplified, ❌ = Not Included

### 7. Proof-of-Concept Plan
**Ziel:** Technische Machbarkeit testen BEVOR Full Development
**Scope:** Minimal Viable Prototype (1-2 Tage Entwicklung)

**Features:**
- Mode Selection Screen (simpel)
- 1 Office-Raum mit 1 NPC (Pixel-Art Mock)
- 1 Dialog mit 2 Ability-Optionen
- Simplified Targeting (nur 3 Akteure zur Auswahl)
- Ability Execution über bestehende Engine
- "Tag beenden" → Round Processing → Simple Summary

**Nicht im PoC:**
- Volle Pixel-Art Assets (Placeholder Grafiken OK)
- Alle NPCs/Räume
- E-Mail System
- Events
- Tutorial

**Erfolgs-Kriterien:**
- [ ] User kann zwischen Modi wählen
- [ ] Office-Screen rendert
- [ ] NPC-Dialog funktioniert
- [ ] Ability wird korrekt an Engine übergeben
- [ ] Trust-Änderung sichtbar nach Round
- [ ] Zurück zu Office nach Aktion

**Timeframe:** 1 Sprint (ca. 1 Woche)

---

## 🗓️ Vorgeschlagener Zeitplan

### Woche 1: Konzeptvalidierung
- [ ] Tag 1-2: Fragen-Workshop & Entscheidungen
- [ ] Tag 3-4: Szenario ausarbeiten & Wireframes
- [ ] Tag 5: UX-Flow & Tech Architecture Doc
- [ ] Tag 6-7: MVP Feature Matrix & PoC Planning

### Woche 2: Proof-of-Concept
- [ ] Tag 1-2: Mode Selection + Office Basic Layout
- [ ] Tag 3-4: NPC Dialog System + Ability Integration
- [ ] Tag 5: Round Processing Integration
- [ ] Tag 6-7: Testing & Iteration

### Woche 3+: Entscheidung basierend auf PoC
- **Wenn PoC erfolgreich:**
  - → Full MVP Development (siehe Roadmap in DUAL_INTERFACE_VISION.md)
- **Wenn PoC zeigt Probleme:**
  - → Pivot oder Konzept anpassen
  - → Alternative technische Ansätze evaluieren

---

## 📁 Dokument-Struktur für weitere Arbeit

### Bereits erstellt:
- ✅ `docs/DUAL_INTERFACE_VISION.md` - Vollständige Vision & Recherche
- ✅ `docs/NEXT_STEPS_PLANNING.md` - Dieser Plan

### Zu erstellen:
- [ ] `docs/SCENARIO_[Name].md` - Ausgearbeitetes Narrativ-Szenario
- [ ] `docs/TECHNICAL_ARCHITECTURE_DUAL_MODE.md` - Technische Architektur
- [ ] `docs/wireframes/` - Ordner mit Wireframe-Bildern oder Figma-Links
- [ ] `docs/UX_FLOW_STORY_MODE.md` - Detaillierter UX-Flow
- [ ] `docs/MVP_FEATURE_SPEC.md` - Feature-Spezifikationen für MVP
- [ ] `docs/POC_RESULTS.md` - Learnings aus Proof-of-Concept
- [ ] `docs/PIXEL_ART_STYLE_GUIDE.md` - Ästhetik-Richtlinien
- [ ] `docs/NPC_CHARACTERS.md` - NPC-Charakterisierungen
- [ ] `docs/DIALOG_WRITING_GUIDE.md` - Tonalität & Schreibstil

### Im Code später:
- [ ] `src/components/story-mode/README.md` - Story-Mode Komponenten-Doku
- [ ] `src/data/story-mode/` - Story-spezifische Daten (NPCs, Dialoge, etc.)

---

## 🎓 Lessons Learned aus Recherche

### Was funktioniert (von anderen Spielen lernen):

1. **Papers, Please:**
   - ✅ Klare Rollen-Immersion ("Du bist X")
   - ✅ Moralische Ambiguität OHNE explizite Moral-Bar
   - ✅ Zeitdruck schafft Engagement
   - ✅ Einfache UI, komplexe Entscheidungen

2. **Reigns:**
   - ✅ Binäre/Ternäre Entscheidungen sind zugänglich
   - ✅ Adaptive Narrative durch Zustandsmaschine
   - ✅ Ressourcen-Balance als Core Loop
   - ✅ Humor + Ernst kombinieren

3. **News Tower:**
   - ✅ Räumliche Metaphern (Stockwerke = Bereiche)
   - ✅ Mitarbeiter-Management macht abstrakte Systeme greifbar
   - ⚠️ Zu komplex wenn zu viele Systeme gleichzeitig

4. **Beholder:**
   - ✅ Du arbeitest für autoritäres Regime (nicht dagegen)
   - ✅ Persönliche Dilemmata durch Charaktere
   - ⚠️ Zu düster für manche Spieler

5. **This War of Mine:**
   - ✅ Keine expliziten Moral-Indikatoren = mehr Reflexion
   - ✅ Langfristige Konsequenzen zeigen
   - ✅ Playtest-Feedback für emotionale Kalibrierung

6. **Educational Serious Games:**
   - ✅ Narrative erhöht Engagement mit Educational Content
   - ✅ "Learning by Doing" > "Learning by Reading"
   - ✅ Debriefing nach Spiel verstärkt Lernen
   - ⚠️ Zu "schulisch" vermeiden

### Was zu vermeiden ist:

1. ❌ **Dual-Mode als Afterthought:** Modi müssen gleichwertig designed sein
2. ❌ **"Dumbed Down":** Zugänglichkeit ≠ Simplifikation
3. ❌ **Narrative Overhead:** Story darf Mechanik nicht verdecken
4. ❌ **Asset Treadmill:** Nicht zu viele Custom Assets für MVP
5. ❌ **Scope Creep:** MVP fokussiert halten
6. ❌ **Moralische Verwirrung:** Klares Framing (Satire/Educational) nötig

---

## 🤔 Offene Design-Dilemmata (zum Diskutieren)

### 1. **Wie viel Strategie-Zugang im Spieler-Modus?**
- **Option A:** "Strategie-Raum" mit vereinfachtem Graph (wie Profi-Modus)
  - Pro: Fortgeschrittene Spieler können tiefer gehen
  - Contra: Bricht vielleicht Immersion
- **Option B:** Keine visuelle Netzwerk-Darstellung, nur "Berichte"
  - Pro: Fokus auf Narrative
  - Contra: Strategische Tiefe verloren
- **Option C:** Unlock nach X Runden
  - Pro: Progressive Complexity
  - Contra: Frühe Spieler frustriert?

### 2. **NPC-Dialoge: Dynamisch oder Scripted?**
- **Option A:** Scripted (wie Reigns-Karten)
  - Pro: Kontrolle über Narrative
  - Contra: Weniger Reaktivität
- **Option B:** Template-basiert mit Variablen
  - Pro: Reaktiv auf Spielzustand
  - Contra: Generisch wirkend?
- **Option C:** Hybrid (Scripted Highlights + Template Filler)
  - Pro: Best of Both
  - Contra: Mehr Arbeit

### 3. **E-Mail UI: Wie retro?**
- **Option A:** Voll 90er (CRT-Scanlines, Monospace Font, Beeps)
  - Pro: Starke Ästhetik
  - Contra: Lesbarkeit?
- **Option B:** "Inspired by 90s" aber modern lesbar
  - Pro: Zugänglichkeit
  - Contra: Weniger charakteristisch
- **Option C:** User-Setting (Retro vs. Clean Mode)
  - Pro: Beste aus beiden Welten
  - Contra: Mehr Development

### 4. **Targeting: Wie viel Kontrolle?**
- **Option A:** NPC schlägt 3 Top-Targets vor, Spieler wählt aus
  - Pro: Schnell, einfach
  - Contra: Wenig Agency
- **Option B:** Volle Liste mit Filtern
  - Pro: Strategische Tiefe
  - Contra: Overwhelming für Casual Spieler
- **Option C:** "Empfohlen" (3) + "Erweitert" (alle)
  - Pro: Optionalität
  - Contra: UI-Komplexität

---

## ✅ Definition of "Ready to Code"

Programmierung startet WENN:

- [ ] **Alle Top-5 kritischen Fragen beantwortet** (Narrative, Tonalität, Scope, Targeting, Pace)
- [ ] **Szenario ausgearbeitet** (1-2 Seiten Narrative Design Doc)
- [ ] **Wireframes für mindestens 5 Core Screens erstellt** (Lo-Fi OK)
- [ ] **UX-Flow Diagramm vollständig** (Start → Game Loop → End)
- [ ] **MVP Feature Matrix ausgefüllt** (Was ist in/out für erste Version)
- [ ] **Technical Architecture Doc erstellt** (Folder Structure, Data Flow)
- [ ] **PoC Scope definiert** (Was wird im Proof-of-Concept getestet)
- [ ] **Team-Alignment** (Alle Stakeholder verstehen & unterstützen Vision)

---

## 🎯 Erfolgs-Kriterien für diesen Planning-Phase

### Diese Phase ist erfolgreich wenn:

1. ✅ **Vision ist klar & geteilt**
   - Alle verstehen Dual-Mode Konzept
   - Unterschiede zwischen Modi sind klar
   - Shared Engine Approach ist akzeptiert

2. ✅ **Scope ist definiert & realistisch**
   - MVP ist klein genug für Timeframe
   - Features sind priorisiert
   - "Nice to have" vs "Must have" ist klar

3. ✅ **Narrative ist konkret**
   - Spielziel ist spezifisch (nicht abstrakt)
   - NPCs haben Namen & Persönlichkeiten
   - Tonalität ist definiert

4. ✅ **Technical Approach ist solide**
   - Architektur ermöglicht beide Modi
   - Keine technischen Blocker identifiziert
   - Asset Pipeline ist klar

5. ✅ **Nächste Schritte sind actionable**
   - Jeder Task hat Owner (wenn Team)
   - Timeline ist realistisch
   - PoC kann starten

---

## 📞 Wer macht was? (Template für Team)

Wenn Team-Arbeit:

| Aufgabe                              | Owner | Deadline | Status |
|--------------------------------------|-------|----------|--------|
| Fragen-Workshop moderieren           | ?     | ?        | ⏳     |
| Szenario ausarbeiten                 | ?     | ?        | ⏳     |
| Wireframes erstellen                 | ?     | ?        | ⏳     |
| UX-Flow diagrammieren                | ?     | ?        | ⏳     |
| Tech Architecture Doc schreiben      | ?     | ?        | ⏳     |
| MVP Feature Matrix erstellen         | ?     | ?        | ⏳     |
| Pixel-Art Asset Research             | ?     | ?        | ⏳     |
| PoC Development                      | ?     | ?        | ⏳     |

Wenn Solo-Arbeit:
- Einfach Tasks nacheinander abarbeiten
- Priorität: Top-5 Fragen → Szenario → Wireframes → PoC

---

## 📚 Ressourcen für nächste Schritte

### Wireframing Tools:
- **Excalidraw** (Web, kostenlos, schnell)
- **Figma** (Web, kostenlos für Solo, kollaborativ)
- **Balsamiq** (Desktop, Low-Fi spezialisiert)
- **Papier + Stift** (schnellste Option für erste Iteration)

### UX-Flow Tools:
- **Whimsical** (Web, schöne Flow-Diagramme)
- **Miro** (Web, kollaborativ, Templates)
- **Draw.io** (Web/Desktop, kostenlos, flexibel)
- **Lucidchart** (Web, professionell)

### Pixel-Art References:
- **Lospec Palette List** (Farbpaletten)
- **itch.io Asset Packs** (Platzhalter für PoC)
- **OpenGameArt** (Kostenlose Game Assets)
- **Pinterest "90s Computer UI"** (Inspiration)

### Narrative Design Resources:
- **"Hamlet on the Holodeck"** (Janet Murray) - Interactive Narrative
- **"The Art of Game Design"** (Jesse Schell) - Chapter on Story
- **Game Writing Style Guides** (Valve, Riot, etc. online verfügbar)

---

**Nächster Meilenstein:** PoC Success oder Pivot-Decision
**Zeitrahmen:** 2-3 Wochen
**Checkpoint:** Nach PoC → Review & Go/No-Go Decision für Full MVP
