# Game Design Patterns Research - Simulation & Strategy Games

**Datum:** 2025-12-10
**Kontext:** UX/UI Verbesserung für Desinformation Network Game

---

## 1. PLAGUE INC. - Complexity Management

**Quelle:** [Plague Inc. – Designing Virtual Pandemics](https://hccd.hypotheses.org/393), [The Graphics of Plague Inc.](https://www.ndemiccreations.com/en/news/50-the-graphics-of-plague-inc)

### Key Patterns

#### 1.1 Three-Layer Complexity Model
> "Plague Inc handles its complex mixture through three game levels: environmental conditions of the virus, human research, and the internal development of the pathogen."

**Anwendung auf unser Spiel:**
- **Layer 1:** Network Topology (Connections, Centrality)
- **Layer 2:** Actor States (Trust, Resilience, Awareness)
- **Layer 3:** Player Actions (Abilities, Combos, Resources)

**Implementierung:** Separate Views/Overlays für jede Layer

#### 1.2 Voronoi Tree Maps für Netzwerkvisualisierung
> "Meaningfully clustered, merging 'cell threads' gradually expand the map into an individually formed complex network of interacting symptoms, using modified Voronoi tree maps."

**Lesson Learned:**
- Organisches Clustering ist visuell ansprechender als Grid-basierte Layouts
- "Threads" (unsere Connections) sollten visuell verschmelzen bei hoher Dichte

**Für unser Spiel:**
✅ Wir haben bereits Force-Directed Layout (organisch)
⚠️ **Verbesserung:** Edge Bundling für visuelle "Threads"

#### 1.3 Microinteractions für Feedback
> "Microinteractions and animations enhance player engagement by providing dynamism and responsiveness, with players receiving immediate feedback that their actions have been recognized."

**Best Practice:**
- Jede Aktion = sofortiges visuelles Feedback
- Animationen sollten 200-300ms dauern
- "Juice" hinzufügen (Particle Effects, Screen Shake, Sound)

**Für unser Spiel:**
✅ Haben wir: Pulse/Wave/Ripple Animationen
⚠️ **Verbesserung:** Mehr "Juice" bei erfolgreichen Combos

#### 1.4 Problem: Navigation Friction
> "Users complained about having to keep clicking back and forth from the upgrade page to the main map."

**Critical Lesson:** Vermeide Context-Switching zwischen Screens

**Für unser Spiel:**
✅ Unser Bottom Sheet ist gut (keine separate Seite)
⚠️ **Aber:** Radial Menu könnte noch besser sein (kein Context Switch überhaupt)

---

## 2. DEMOCRACY 4 - Visual Information Architecture

**Quelle:** [Democracy 4 GUI update](https://www.positech.co.uk/cliffsblog/2019/11/09/democracy-4-gui-update/), [Overcomplexity is by design](https://www.positech.co.uk/cliffsblog/2023/02/19/democracy-4s-overcomplexity-is-by-design/)

### Key Patterns

#### 2.1 "Overcomplexity by Design" - But Visually Manageable
> "Overcomplexity is a feature, not a bug... The game often looks a lot like a super-interactive infographic."

**Philosophy:** Komplexität ist OK, solange sie **visuell verständlich** ist

**Für unser Spiel:**
- 58 Akteure sind OK ✅
- ABER: Visualisierung muss "infographic-artig" sein
- **Implementierung:** Semantic Zoom mit LOD (wie geplant in Konzept 3.1)

#### 2.2 Color-Coded Connection Lines
> "Hovering over any icon, demographic, or minister displays color-coded moving lines connecting every relevant factor to each other, with arrow speed indicating the intensity of connections."

**Pattern:** Dynamic Connection Visualization on Hover

**Visual Rules:**
- ✅ Green = Positive effects
- ❌ Red = Negative effects
- 🔵 Blue = Neutral connections
- Speed = Intensity

**Für unser Spiel:**
**NEUE FEATURE-IDEE:** "Connection Explorer Mode"
- Hover über Actor → zeige alle Connections mit Farb-Coding
- Trust-Flow-Richtung durch Animation
- Propagation-Pfade hervorheben

**Implementation:**
```typescript
function highlightActorConnections(actorId: string) {
  const connections = getActorConnections(actorId);
  connections.forEach(conn => {
    const color = getTrustFlowColor(conn.trustFlow);
    drawAnimatedLine(conn, color, conn.strength * 5); // Speed
  });
}
```

#### 2.3 Vector-Art für perfekte Skalierung
> "Vector-art rendering for most UI elements, meaning everything is pixel perfect regardless of screen resolution or zooming/scaling."

**Technical Decision:** SVG > Canvas für UI-Elemente

**Für unser Spiel:**
✅ Nutzen bereits Canvas für Performance
⚠️ **Aber:** UI-Overlays sollten SVG sein (Filter, Minimap, etc.)

#### 2.4 Dual-Graph Feedback System
> "The polling screen shows two graph lines - voting intention and average approval - which is new for Democracy 4, and the difference between the two is incredibly important."

**Pattern:** Show TWO metrics to reveal hidden dynamics

**Für unser Spiel:**
**NEUE FEATURE-IDEE:** "Trust vs. Awareness" Dual-Graph
- Graph 1: Average Network Trust (sichtbarer Erfolg)
- Graph 2: Average Actor Awareness (verstecktes Risiko)
- Differenz = "Safety Margin"

**Warum wichtig:**
Spieler könnte Trust senken, aber Awareness steigt → spätes Game-Over durch Exposure

---

## 3. SERIOUS GAMES - Educational Design Principles

**Quelle:** [UX and Serious Games—A Research Agenda](https://link.springer.com/chapter/10.1007/978-3-031-49065-1_21), [The Complete Game UX Guide for 2025](https://game-ace.com/blog/the-complete-game-ux-guide/)

### Key Patterns

#### 3.1 Learning Experience Design (LXD) Integration
> "Key design principles used in LXD come from interaction design, user experience design, experience design, graphic design, and game design."

**Multi-Disciplinary Approach:**
- UX Design: User flows, Usability
- Game Design: Engagement, Reward loops
- Graphic Design: Visual hierarchy
- Education: Scaffolding, Feedback

**Für unser Spiel:**
Unser Spiel IST ein Lernspiel (Persuasion Techniken)
→ **Muss** pedagogische Prinzipien folgen

#### 3.2 Context + Learner Profile Awareness
> "UX and game usability must be considered according to the context of usage and learners' profiles."

**Player Types für unser Spiel:**
1. **Researcher/Academic** - Will Taxonomie verstehen
2. **Casual Gamer** - Will einfach spielen
3. **Activist** - Will Counter-Strategien lernen

**Implementierung:** Difficulty Settings mit unterschiedlichem Info-Depth
- **Easy:** Minimale Taxonomie-Referenzen
- **Medium:** Tooltips mit Technique-Namen
- **Hard:** Vollständige Taxonomie-Integration + Encyclopedia

#### 3.3 Iterative Evaluation & User Feedback
> "Gamers today expect not only innovative gameplay but also a seamless user experience, requiring developers to prioritize user feedback and iterate on their designs."

**Process:**
1. Prototyp
2. User Testing (5-8 Personen)
3. Iterate
4. Repeat

**Für unser Spiel:**
Nach Phase 1 Implementation → Playtesting Session

---

## 4. PROGRESSIVE DISCLOSURE - Tutorial Design

**Quelle:** [Progressive Disclosure - NN/g](https://www.nngroup.com/videos/progressive-disclosure/), [Progressive Disclosure Examples](https://userpilot.com/blog/progressive-disclosure-examples/)

### Key Patterns

#### 4.1 Animated Hints & Contextual Tutorials
> "Plants vs. Zombies 2 uses a combination of exercises and text assistance to teach new players."

**Pattern:** Just-in-Time Learning

**Game Examples:**
- **Plants vs. Zombies:** Animated exercises
- **Pudding Monsters:** Animated hand showing gestures
- **Assassin's Creed:** Gradual detail introduction through dialogue

**Für unser Spiel:**
**NEUE FEATURE:** Animated Tutorial Overlays
- Round 1: "Click an Actor to select"
- Round 2: "Try an Ability" (after selection)
- Round 3: "See the Propagation" (after ability use)
- Round 5: "Check the Combo Tracker" (after 2 abilities)

**Implementation Pattern:**
```typescript
const TUTORIAL_STEPS = [
  { round: 1, trigger: 'game_start', hint: 'Click an actor', highlight: 'actor' },
  { round: 2, trigger: 'actor_selected', hint: 'Select ability', highlight: 'ability_panel' },
  { round: 3, trigger: 'ability_used', hint: 'Watch propagation', highlight: 'connections' },
];
```

#### 4.2 Modal Windows + Accordions für Advanced Features
> "Designers use UI patterns like modal windows and accordions to hide advanced features and information."

**Pattern Hierarchy:**
1. **Always Visible:** Core gameplay (Network, Resources, Progress)
2. **Toggle-able:** Advanced stats (Topology, Reactions, Combos)
3. **On-Demand:** Encyclopedia, Settings, Statistics

**Für unser Spiel:**
✅ Haben bereits: Smart Layering (Konzept 3.3)
⚠️ **Verbesserung:** Accordion-Pattern für collapsible Overlays

#### 4.3 Tooltips für Feature Discovery
> "Tooltips display additional information and highlight a feature without overloading the UI."

**Best Practices:**
- Delay: 500ms hover before show
- Content: 1-2 sentences max
- Position: Contextual (avoid covering content)
- Dismissal: Auto-hide on mouse-out

**Für unser Spiel:**
✅ Haben bereits: Hover Tooltips auf Abilities
⚠️ **Missing:** Tooltips auf UI-Elementen
  - Combo Tracker Icon: "What are Combos?"
  - Topology Button: "Shows network structure"
  - Detection Risk Bar: "Risk of being exposed"

---

## 5. COMPARATIVE ANALYSIS - Unsere Position

### Stärken unseres aktuellen Designs ✅

1. **Force-Directed Layout** - Wie Plague Inc, organisch
2. **Canvas-Performance** - Gut für 58 Akteure
3. **Color-Coding** - Trust als Farbe (ähnlich Democracy 4)
4. **Bottom Sheet** - Vermeidet Plague Inc's Navigation-Problem
5. **Tier-System** - Basis für LOD vorhanden

### Schwächen / Verbesserungspotential ⚠️

1. **Kein Progressive Disclosure** - Alles auf einmal sichtbar
2. **Fehlende Animated Hints** - Kein Tutorial-System
3. **Keine Connection Highlighting** - Democracy 4's beste Feature fehlt
4. **Keine Dual-Metric Visualization** - Nur Trust, nicht Awareness
5. **Statische Connections** - Keine Edge Bundling
6. **Überlappende Overlays** - Nicht collapsible

---

## 6. NEUE FEATURE-VORSCHLÄGE (basierend auf Recherche)

### 6.1 CONNECTION EXPLORER MODE (Democracy 4-inspiriert)
**Priority:** HIGH ⭐⭐⭐

**Beschreibung:** Hover über Actor → zeige alle verbundenen Paths mit Animation

**Visual:**
```
Actor A (hovered)
  ↓ 🟢 (green, fast) → Actor B (+0.2 trust flow)
  ↓ 🔴 (red, slow) → Actor C (-0.1 trust flow)
  ↓ 🔵 (blue, medium) → Actor D (neutral)
```

**Implementation:**
- Canvas: Draw animated dashed lines
- Color: trustFlow > 0 ? green : red
- Speed: Math.abs(trustFlow) * 10
- Thickness: connection.strength * 3

**Effort:** Medium (2 Tage)

### 6.2 TRUST vs. AWARENESS DUAL-GRAPH (Democracy 4-inspiriert)
**Priority:** MEDIUM ⭐⭐

**Beschreibung:** Zeige zwei Linien im Progress-Tracker

**Rationale:**
Spieler sehen nur Trust sinken (Erfolg), aber Awareness steigt (Gefahr) versteckt
→ Überraschungs-Game-Over durch Exposure vermeiden

**Visual:**
```
Progress Chart:
━━━━━━━━━━━━━━━━━━━━━
Trust:     80% → 40% ↓ (green line going down = good)
Awareness: 10% → 85% ↑ (red line going up = danger!)
                    ↑ WARNING: Detection imminent!
```

**Effort:** Low (1 Tag)

### 6.3 ANIMATED TUTORIAL SYSTEM (Plants vs. Zombies-inspiriert)
**Priority:** HIGH ⭐⭐⭐

**Beschreibung:** Just-in-Time Tutorial Overlays

**Sequence:**
1. Round 1: Animated arrow pointing to Actor + "Click to select"
2. Round 2: Pulse effect on Ability + "Try an ability"
3. Round 3: Highlight connections + "Watch the propagation"
4. Round 5: Point to Combo Tracker + "Chain abilities for bonus"

**Visual Style:**
- Semi-transparent overlay
- Animated hand/arrow (CSS animation)
- "Got it" button to dismiss
- Auto-skip if user already did action

**Effort:** Medium (2-3 Tage)

### 6.4 EDGE BUNDLING für Connections (Plague Inc-inspiriert)
**Priority:** LOW ⭐

**Beschreibung:** Cluster ähnliche Connections zu "Threads"

**Visual Improvement:**
```
Before:  A ━━ B      After:  A ╲
         A ━━ C              A ─┤━━ B
         A ━━ D              A ╱   ━━ C
                                   ━━ D
```

**Benefit:** Reduziert visuelles Chaos bei hoher Connection-Density

**Effort:** High (4-5 Tage) - Komplexer Algorithmus

---

## 7. PRIORISIERTE ROADMAP (Research-basiert)

### Phase 1A: Quick Wins from Research (1 Woche)
1. ✅ Connection Explorer Mode (6.1)
2. ✅ Trust vs. Awareness Dual-Graph (6.2)
3. ✅ Tooltip-System erweitern

**Deliverable:** Besseres Feedback, versteckte Dynamiken sichtbar

### Phase 2A: Tutorial & Onboarding (1 Woche)
1. ✅ Animated Tutorial System (6.3)
2. ✅ Progressive Disclosure für Advanced Features
3. ✅ First-Time User Experience (FTUE)

**Deliverable:** Neue Spieler verstehen Game sofort

### Phase 3A: Advanced Visualization (Optional)
1. ⚠️ Edge Bundling (6.4)
2. ⚠️ Vector-UI für Overlays

**Deliverable:** Professionelles "Infographic" Look

---

## 8. DESIGN PRINCIPLES (abgeleitet aus Recherche)

### Principle 1: "Overcomplexity is OK if Visually Manageable"
**Quelle:** Democracy 4

→ 58 Akteure sind OK, aber brauchen **klare visuelle Hierarchie**

### Principle 2: "Immediate Feedback is Non-Negotiable"
**Quelle:** Plague Inc, General Game UX

→ Jede Aktion muss **within 200ms** visuelles Feedback haben

### Principle 3: "Progressive Disclosure for Learning Curve"
**Quelle:** Plants vs. Zombies, Serious Games Research

→ Features **schrittweise** einführen, nicht alles auf einmal

### Principle 4: "Show Hidden Dynamics Visually"
**Quelle:** Democracy 4 Dual-Graph

→ **Wichtige** aber **nicht-offensichtliche** Mechaniken visualisieren

### Principle 5: "Context is King"
**Quelle:** Serious Games Research

→ UI passt sich **Player Type** und **Skill Level** an

---

## 9. A/B TESTING KANDIDATEN

Basierend auf Recherche, sollten wir testen:

### Test 1: Connection Visualization Style
- **Variant A:** Static lines (current)
- **Variant B:** Animated lines on hover (Democracy 4 style)
- **Metric:** User understanding of network dynamics

### Test 2: Tutorial Style
- **Variant A:** Text-based tooltips
- **Variant B:** Animated overlays (Plants vs. Zombies style)
- **Metric:** Time to first successful action

### Test 3: Information Density
- **Variant A:** All overlays visible by default
- **Variant B:** Collapsed by default (Progressive Disclosure)
- **Metric:** Cognitive load (NASA-TLX), Player retention

---

## 10. SOURCES

### Plague Inc.
- [Plague Inc. – Designing Virtual Pandemics](https://hccd.hypotheses.org/393)
- [The Graphics of Plague Inc.](https://www.ndemiccreations.com/en/news/50-the-graphics-of-plague-inc)
- [Top UI, UX design trends for game designers](https://logicsimplified.com/newgames/key-ui-ux-game-design-trends-to-focus-in-2021/)

### Democracy 4
- [Democracy 4: Resizable GUI](https://www.positech.co.uk/cliffsblog/2021/07/07/democracy-4-resizable-gui/)
- [Democracy 4's overcomplexity is by design](https://www.positech.co.uk/cliffsblog/2023/02/19/democracy-4s-overcomplexity-is-by-design/)
- [Democracy 4 GUI update](https://www.positech.co.uk/cliffsblog/2019/11/09/democracy-4-gui-update/)
- [On the visualization of voter approval distribution](https://www.positech.co.uk/cliffsblog/2022/03/02/on-the-visualization-of-voter-approval-distribution-in-democracy-4/)

### Serious Games
- [The Complete Game UX Guide for 2025](https://game-ace.com/blog/the-complete-game-ux-guide/)
- [UX and Serious Games—A Research Agenda](https://link.springer.com/chapter/10.1007/978-3-031-49065-1_21)
- [Frontiers | Designing learning experiences using serious games](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1322704/full)

### Progressive Disclosure
- [Progressive Disclosure - NN/g](https://www.nngroup.com/videos/progressive-disclosure/)
- [Progressive Disclosure Examples](https://userpilot.com/blog/progressive-disclosure-examples/)
- [Design Patterns: Progressive Disclosure](https://uxplanet.org/design-patterns-progressive-disclosure-for-mobile-apps-f41001a293ba)

---

**Version:** 1.0
**Letztes Update:** 2025-12-10
**Status:** 🟢 Research Complete - Ready for Integration
