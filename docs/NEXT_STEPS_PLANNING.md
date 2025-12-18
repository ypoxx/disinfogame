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

### 7. Proof-of-Concept Plan ⚠️ AKTUALISIERT nach technischer Recherche

**Ziel:** Technische Machbarkeit testen BEVOR Full Development
**Scope:** Minimal Viable Prototype
**Timeframe:** **3-5 Tage** (aktualisiert von 1-2 Tagen)

#### **Technische Entscheidungen (basierend auf Recherche):**

**Framework:** Pure React + Vite (NICHT Phaser für MVP)
- ✅ Niedrigste Lernkurve
- ✅ Hot-Reload < 100ms
- ✅ Bestehender Code wiederverwendbar
- 🟡 CSS-basiertes Pixel-Art Rendering (ausreichend für UI-Game)

**Asset-Strategie:** KEINE Custom Pixel-Art im PoC
- ✅ Colored Rectangles (CSS `background-color`)
- ✅ System Fonts (Monospace für Retro-Feel)
- ✅ Emoji als Icons (💰 = Money, 👁️ = Attention, 👨‍💼 = NPC)
- **Warum:** Pixel-Art dauert 6x länger als erwartet (siehe DUAL_INTERFACE_VISION.md)

**Architecture:** Mediator Pattern
- `useStoryMode.ts` Hook als Brücke zu `useGameState`
- Atomic Design von Anfang an (Atoms → Molecules → Organisms)

---

#### **Features im PoC:**

**✅ Enthalten:**
- Mode Selection Screen (simpel: 2 Buttons)
- 1 Office-Raum mit 1 NPC (CSS-Rechtecke + Emoji)
- 1 Dialog mit 2 Ability-Optionen
- Simplified Targeting (nur 3 Akteure zur Auswahl)
- Ability Execution über `useGameState` Hook
- "Tag beenden" → Round Processing → Simple Summary
- **NEU:** `image-rendering: pixelated` CSS-Test (ein Testbild)

**❌ Explizit NICHT im PoC:**
- Custom Pixel-Art Assets (Phase 2!)
- Volle Office-Layout-Grafik
- Alle NPCs/Räume (nur 1!)
- E-Mail System (Phase 2)
- Events (Phase 2)
- Tutorial (Phase 3)
- Animationen (optional für v2.0)

---

#### **Erfolgs-Kriterien:**

**Technisch:**
- [ ] User kann zwischen Profi/Spieler-Modus wählen
- [ ] Office-Screen rendert mit Placeholder-Grafiken
- [ ] NPC-Dialog funktioniert (Text-basiert)
- [ ] Ability wird korrekt an Engine übergeben
- [ ] Trust-Änderung sichtbar nach Round
- [ ] Zurück zu Office nach Aktion
- [ ] **NEU:** `image-rendering: pixelated` funktioniert auf Testbild

**Architektur:**
- [ ] `useStoryMode` Hook isoliert UI-Logik von Engine
- [ ] Atomic Design Structure angelegt (atoms/, molecules/, organisms/)
- [ ] Komponenten haben TypeScript Props
- [ ] Hot-Reload funktioniert (< 200ms)

**Learning:**
- [ ] Ist Pure React ausreichend oder brauchen wir Phaser?
- [ ] Wie komplex ist State-Transformation (Events → E-Mails)?
- [ ] Performance OK mit DOM-Rendering?
- [ ] Macht Placeholder-Ansatz Sinn für Team/Playtesting?

---

#### **Detaillierter Timeline-Plan (5 Tage):**

**Tag 1: Setup & Architecture**
- Vite-Projekt aufsetzen (`npm create vite@latest`)
- Folder Structure erstellen (Atomic Design)
- `useStoryMode` Hook Boilerplate
- Mode Selection Screen (2 Buttons, Routing)

**Tag 2: Office Screen & NPC**
- Office-Layout (CSS Grid, Placeholder-Rechtecke)
- NPC-Portrait Component (Emoji-basiert)
- Navigation (Office → NPC-Room → zurück)
- Zustand: `currentRoom` State Management

**Tag 3: Dialog & Ability Integration**
- Dialog Component (Text + 2 Optionen)
- Ability-Mapping (Engine-Abilities → Dialog-Optionen)
- `selectAbility` Action in `useStoryMode`
- Test: Ability-Klick → Engine-Call

**Tag 4: Targeting & Round Processing**
- Targeting-Interface (Simplified: Dropdown mit 3 Akteuren)
- Ability Execution über `useGameState.executeAbility()`
- "Tag beenden" Button
- Round Summary Component (Trust-Änderungen anzeigen)

**Tag 5: Testing & Crisp Pixel Test**
- End-to-End Flow testen (Mode Select → Office → NPC → Ability → Round End)
- `image-rendering: pixelated` auf Testbild (z.B. ein Button-Mock)
- Performance-Check (Chrome DevTools)
- Dokumentation: Was funktioniert, was nicht?

---

#### **Budget (falls relevant):**

- **Zeit:** 3-5 Tage (1 Person Vollzeit)
- **Kosten:** €0 (alles gratis: Vite, React, Placeholder-Assets)
- **Optional:** Figma Pro (€12/Monat) für Prototyping - NICHT essentiell

---

#### **Exit-Kriterien:**

**PoC ist erfolgreich wenn:**
- ✅ Vollständiger Flow funktioniert (Start → Ability → Round End)
- ✅ Architecture ist sauber (Mediator Pattern klar getrennt)
- ✅ Performance ist OK (keine Lags bei Interaktionen)
- ✅ Team kann Flow playtesten (auch mit Placeholders)

**PoC zeigt Probleme wenn:**
- ❌ React zu langsam für UI-Updates (→ Phaser evaluieren)
- ❌ State-Transformation zu komplex (→ Architecture überdenken)
- ❌ Placeholder-Assets verwirren Playtester (→ früher Assets kaufen)

**Nach PoC Entscheidung:**
- **Erfolgreich:** → MVP Development (Phase 2: Purchased Assets)
- **Problematisch:** → Pivot oder Alternative Ansätze (z.B. Phaser Hybrid)
- **Mixed:** → PoC v2 mit Anpassungen (z.B. 1-2 gekaufte Assets testen)

---

## 🗓️ Vorgeschlagener Zeitplan ⚠️ AKTUALISIERT

### Woche 1: Konzeptvalidierung (unverändert)
- [ ] Tag 1-2: Fragen-Workshop & Entscheidungen (5 Sofort-Fragen beantworten)
- [ ] Tag 3-4: Szenario ausarbeiten & Wireframes in Figma
- [ ] Tag 5: UX-Flow & Tech Architecture Doc
- [ ] Tag 6-7: MVP Feature Matrix & PoC Planning

### Woche 2: **Optional - Figma Prototyping** (NEU - empfohlen!)
- [ ] Tag 1-2: Figma Wireframes → Pixel Art UI Kit Integration
- [ ] Tag 3-4: Clickable Prototype (Office → NPC → Dialog Flow)
- [ ] Tag 5: Playtesting mit Stakeholders (OHNE Code!)
- [ ] Tag 6-7: Iteration basierend auf Feedback

**Warum neu?** Recherche zeigt: Figma-Prototyping spart 2-3 Code-Iterations-Runden

### Woche 3-4: Proof-of-Concept ⚠️ Timeline aktualisiert
- [ ] **Tag 1: Setup** (Vite + Folder Structure + `useStoryMode` Hook)
- [ ] **Tag 2: Office Screen** (Placeholder-Layout + NPC Component)
- [ ] **Tag 3: Dialog & Integration** (Ability-Mapping + Engine-Call)
- [ ] **Tag 4: Targeting & Round** (Simplified Targeting + Round Processing)
- [ ] **Tag 5: Testing** (E2E Flow + `image-rendering` Test + Performance)
- [ ] **Tag 6-7: Buffer** (Unvorhergesehenes + Dokumentation)

**Änderung:** Von "1-2 Tage" auf **5-7 Tage** basierend auf realistischer Einschätzung

### Woche 5: PoC Review & Entscheidung
- [ ] Tag 1-2: Interne Playtests (Team + Stakeholder)
- [ ] Tag 3: Review-Meeting (Go/No-Go/Pivot Decision)
- [ ] Tag 4-5: Dokumentation Learnings (`docs/POC_RESULTS.md`)

**PoC Outcomes:**
- **Erfolgreich:** → MVP Development mit Purchased Assets (Woche 6+)
- **Problematisch:** → Alternative Ansätze evaluieren (z.B. Phaser Hybrid)
- **Mixed:** → PoC v2 mit Anpassungen

### Woche 6-9: MVP Development (wenn PoC erfolgreich) ⚠️ Timeline realistischer
- **Woche 6:**
  - [ ] Asset-Packs kaufen (itch.io: €30-50 Budget)
  - [ ] Asset-Integration (Sprite Sheets erstellen)
  - [ ] Atomic Design Components (Atoms: PixelButton, PixelText, PixelIcon)

- **Woche 7:**
  - [ ] Molecules (EmailListItem, NPCPortrait, ResourceDisplay)
  - [ ] Organisms (InboxPanel, NPCDialogBox, OfficeRoom)
  - [ ] Office-Screen komplett (mit gekauften Assets)

- **Woche 8:**
  - [ ] 3-4 NPCs implementieren (Medien, Bots, NGO, Strategie)
  - [ ] E-Mail-System (Events → E-Mails Transformation)
  - [ ] Tages-Zusammenfassung Screen

- **Woche 9:**
  - [ ] Tutorial für Spieler-Modus
  - [ ] Polish (Transitions, Sounds optional)
  - [ ] Testing & Bug Fixes
  - [ ] Deployment (Netlify/Vercel)

**Änderung:** Von "1 Woche" auf **4 Wochen** MVP (realistischer)

### Woche 10+: Post-MVP (optional)
- **Custom Pixel-Art** (falls gewünscht): 6-10 Wochen
- **Phaser Integration** (für Animationen): 2-4 Wochen
- **Zusätzliche Features** (siehe DUAL_INTERFACE_VISION.md Roadmap)

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

## 📚 Ressourcen für nächste Schritte ⚠️ ERWEITERT

### 1. Prototyping & Design Tools

#### **Figma (🔥 Top-Empfehlung für Anfänger)**
- **URL:** https://figma.com
- **Kosten:** Gratis für Solo-Projekte
- **Warum:** Web-based, kollaborativ, riesige Community
- **Spezifische Ressourcen:**
  - [Pixel Art UI Kit](https://www.figma.com/community/file/1224460064522598216) - Fertige Components
  - [Pixel Game Prototype Template](https://www.figma.com/community/file/1364337760230397087)
  - [Pixel Game Playground](https://www.figma.com/community/file/1496921984465285822)
- **Workflow:** Wireframes → UI Kit → Clickable Prototype → PNG Export für PoC
- **Learning:** Figma Tutorials auf YouTube (~2h für Basics)

#### **Excalidraw (für schnelle Skizzen)**
- **URL:** https://excalidraw.com
- **Kosten:** Gratis
- **Wann nutzen:** Brainstorming, UX-Flows, Lo-Fi Wireframes
- **Vorteil:** Kein Account nötig, schneller als Figma

#### **Whimsical (für UX-Flows)**
- **URL:** https://whimsical.com
- **Kosten:** Gratis (Limited), €10/Monat (Pro)
- **Wann nutzen:** Flow-Diagramme, User Journeys
- **Alternative:** Draw.io (gratis, aber weniger schön)

---

### 2. Pixel-Art Creation Tools

#### **Aseprite (🔥 Beste für Pixel-Art) - NUR falls Custom Assets**
- **URL:** https://www.aseprite.org
- **Kosten:** €19.99 (einmalig) oder gratis selbst kompilieren
- **Features:** Animationen, Onion Skinning, Sprite Sheets Export
- **Lernen:** [Derek Yu Tutorial](https://www.derekyu.com/makegames/pixelart.html) (gratis)
- **ABER:** Für PoC & MVP NICHT nötig (Assets kaufen!)

#### **Lospec (Farbpaletten - gratis)**
- **URL:** https://lospec.com/palette-list
- **Features:** 16-32 Color Palettes für retro Look
- **Empfehlung:** "Sweetie 16" oder "AAP-64" Palette

#### **Pixilart (Web-based, für Quick Tests)**
- **URL:** https://www.pixilart.com
- **Kosten:** Gratis
- **Wann nutzen:** Schnelle Mockups testen ohne Software-Install

---

### 3. Asset-Packs (für PoC & MVP)

#### **itch.io (🔥 Top-Empfehlung)**
- **Office-themed:** https://itch.io/game-assets/tag-office/tag-pixel-art
  - Preis: €5-20 pro Pack
  - Enthält: Tileset, UI-Elemente, Icons
  - **Kaufempfehlung:** 1-2 Packs reichen für MVP

- **UI-Elements:** https://itch.io/game-assets/tag-ui/tag-pixel-art
  - Buttons, Windows, Dialoge
  - Oft mit verschiedenen Themes (90s, Retro, etc.)

#### **CraftPix**
- **URL:** https://craftpix.net/categorys/pixel-art-game-ui/
- **Preis:** €15-30 pro Pack
- **Qualität:** Höher als itch.io, professioneller
- **Lizenz:** Meist auch Commercial Use OK

#### **OpenGameArt (gratis, aber variabel Qualität)**
- **URL:** https://opengameart.org
- **Vorteil:** Kostenlos, Public Domain / CC
- **Nachteil:** Inkonsistente Styles, muss Mix-and-Match

**Budget-Empfehlung für MVP:** €30-50 für 2-3 Packs (Office + UI + Icons)

---

### 4. React & Development Tools

#### **Vite (🔥 Build Tool - verwenden!)**
- **URL:** https://vitejs.dev
- **Setup:** `npm create vite@latest story-mode-poc -- --template react-ts`
- **Vorteil vs. Create-React-App:**
  - 10x schneller Hot-Reload (< 100ms)
  - Kleinere Bundle Size
  - Native TypeScript Support
  - Bessere Asset Handling

#### **Storybook (optional für Component Development)**
- **URL:** https://storybook.js.org
- **Setup:** `npx storybook@latest init`
- **Wann nutzen:** Wenn > 20 Components (Katalog-View)
- **Für PoC:** NICHT nötig (zu viel Overhead)
- **Für MVP:** Evaluieren (beschleunigt Iteration)

#### **VS Code Extensions für Pixel-Art/React:**
- **Prettier** - Code Formatting
- **ESLint** - Linting
- **Error Lens** - Inline Error Display
- **Auto Rename Tag** - HTML Tag Sync
- **Image Preview** - Hover über PNG → Preview

---

### 5. CSS & Pixel-Art Rendering

#### **CSS Snippets (kritisch!):**

**Crisp Pixel Rendering:**
```css
/* IMMER verwenden für Pixel-Art! */
.pixel-art {
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

**Pixel Font (Retro-Feel ohne Custom Font):**
```css
.retro-text {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  letter-spacing: 1px;
  image-rendering: pixelated;
}
```

**Button mit Pixel-Art Feel (CSS-only):**
```css
.pixel-button {
  border: 3px solid #000;
  background: #4a90e2;
  padding: 8px 16px;
  font-family: monospace;
  cursor: pointer;
  image-rendering: pixelated;
  transition: none; /* Kein smooth Transition! */
}
.pixel-button:hover {
  background: #6aade2;
}
.pixel-button:active {
  background: #2a70c2;
}
```

#### **Referenzen:**
- [MDN: Crisp Pixel Art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look)
- [CSS Tricks: Keep Pixelated Images Pixelated](https://css-tricks.com/keep-pixelated-images-pixelated-as-they-scale/)

---

### 6. Learning Resources (für Anfänger)

#### **React Basics (falls Auffrischung nötig):**
- **React Official Tutorial:** https://react.dev/learn
  - ~2-3 Stunden für Basics
  - Fokus: Components, Props, State, Hooks
- **React + TypeScript Cheatsheet:** https://react-typescript-cheatsheet.netlify.app

#### **Pixel-Art Tutorials:**
- **Derek Yu: Pixel Art Basics** - https://www.derekyu.com/makegames/pixelart.html
  - Gratis, kompakt, fokussiert auf Game Art
- **Pedro Medeiros (@saint11) Twitter** - Viele GIFs mit Tutorials
- **Lospec Tutorials** - https://lospec.com/articles/

#### **Game UI Design:**
- **Interface In Game:** https://interfaceingame.com
  - Screenshotsammlung von Game UIs
  - Filterable by genre, style
- **Game UI Database:** https://gameuidatabase.com
  - Gute Beispiele für verschiedene Screens

#### **Narrative Design:**
- **"Hamlet on the Holodeck"** (Janet Murray) - Interactive Narrative Theorie
- **Emily Short's Blog** - https://emshort.blog - Interactive Fiction
- **Gamasutra Narrative Design Articles** - Viele Praxis-Beispiele

---

### 7. Performance & Testing

#### **Chrome DevTools (wichtigste Features):**
- **Performance Tab:**
  - Identifiziere langsame Renders
  - Ziel: < 16ms pro Frame (60 FPS)
- **Network Tab:**
  - Prüfe Asset-Ladezeiten
  - Sprite Sheets = weniger Requests
- **Lighthouse:**
  - Performance Score für Web-Apps
  - Accessibility Check

#### **React DevTools (Browser Extension):**
- **URL:** https://react.dev/learn/react-developer-tools
- **Features:**
  - Component Tree inspizieren
  - Props/State debuggen
  - Re-Render Highlighting (Performance)

---

### 8. Deployment (für MVP)

#### **Netlify (🔥 Empfehlung für static React Apps)**
- **URL:** https://netlify.com
- **Kosten:** Gratis (100GB/Monat Bandwidth)
- **Setup:** `npm run build` → Drag & Drop Ordner
- **Features:** Auto-Deploy von Git, Preview Branches

#### **Vercel (Alternative)**
- **URL:** https://vercel.com
- **Vorteil:** Besser für Next.js (falls später SSR)
- **Für Vite:** Netlify ist simpler

---

### 9. Community & Support

#### **Discord/Forums:**
- **r/PixelArt (Reddit):** Feedback auf Assets
- **r/reactjs (Reddit):** React-Fragen
- **Phaser Discord:** Falls später Phaser (https://discord.gg/phaser)

#### **Stack Overflow Tags:**
- `reactjs` + `typescript`
- `pixel-art` + `canvas`
- `css` + `image-rendering`

---

### 10. Spezielle Tools (für Fortgeschrittene)

#### **Sprite Sheet Generator (falls Custom Pixel-Art):**
- **Leshy SpriteSheet Tool:** https://www.leshylabs.com/apps/sstool/ (Web, gratis)
- **Aseprite:** Built-in Sheet Export
- **TexturePacker:** Pro Tool (€40), Overkill für MVP

#### **Pixel Art Scaling (für HiDPI):**
- **xBRZ Algorithm:** Für non-integer Scales (selten nötig)
- **Rotsprite:** Rotation ohne Blur (advanced)

---

### 📦 Empfohlenes Starter-Kit (Budget: €20-50)

**Für PoC (€0):**
- ✅ Figma (gratis)
- ✅ Vite (gratis)
- ✅ VS Code (gratis)
- ✅ Placeholder-Assets (CSS + Emoji)

**Für MVP (€30-50):**
- ✅ 2x itch.io Asset Packs (€10-20 each)
  - Office Pack (Rooms, Furniture)
  - UI Pack (Buttons, Icons, Windows)
- ✅ Optional: CraftPix Premium Pack (€15-30)

**Für Custom Assets später (€20):**
- ✅ Aseprite License (€19.99)

**Total für vollständigen Workflow:** ~€70 (einmalig)

---

### ⚠️ Was NICHT kaufen/lernen für MVP:

❌ **Photoshop/Illustrator** - Overkill, Aseprite reicht
❌ **Unity/Unreal** - Falsche Tools für Web-Game
❌ **Phaser Kurse** - Erst nach PoC evaluieren
❌ **Game Design Bücher** - Zu theoretisch, fokussiere auf Praxis
❌ **Animationssoftware** - Aseprite hat alles
❌ **Paid Fonts** - Monospace System-Fonts genügen

---

**Zusammenfassung für Anfänger:**

1. **Starte mit Figma** - Kein Code, schnelles Feedback
2. **PoC mit Vite + React** - Technologie die du kennst
3. **Kaufe Assets für MVP** - Spare Wochen/Monate
4. **Custom Assets nur wenn nötig** - Unterschätz Zeit nicht

**Zeitinvestition Learning:**
- Figma Basics: 2-3 Stunden
- Vite Setup: 30 Minuten
- CSS Pixel-Art Rendering: 1 Stunde
- React Hooks Refresh: 2 Stunden (optional)

**Total:** ~6 Stunden Learning für vollständige Tool-Chain

---

**Nächster Meilenstein:** PoC Success oder Pivot-Decision
**Zeitrahmen:** 2-3 Wochen
**Checkpoint:** Nach PoC → Review & Go/No-Go Decision für Full MVP
