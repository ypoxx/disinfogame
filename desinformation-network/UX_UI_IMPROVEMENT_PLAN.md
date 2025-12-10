# UX/UI Verbesserungsplan für Desinformation Network Game

**Datum:** 2025-12-10
**Status:** Konzeptphase
**Basiert auf:** Best Practices für Netzwerk-Visualisierung, Force-Directed Graphs & Game UI Design

---

## Executive Summary

Das Desinformation Network Game ist ein komplexes, netzwerk-orientiertes Strategiespiel mit ~58 Akteuren. Die aktuelle Implementierung verwendet Canvas-Rendering mit Force-Directed Layout, was eine solide technische Basis bietet. Jedoch gibt es erhebliches Verbesserungspotenzial in den Bereichen:

1. **Information Density Management** - Zu viele Elemente auf einmal
2. **Visual Hierarchy** - Wichtigkeit wird nicht klar kommuniziert
3. **Progressive Disclosure** - Informationen sollten kontextbezogen erscheinen
4. **Spatial Navigation** - Orientierung im komplexen Netzwerk
5. **Interaction Feedback** - Klarere Rückmeldungen für Spieleraktionen

---

## 1. CURRENT STATE ANALYSE

### 1.1 Spiel-Kontext

- **Genre:** Netzwerk-basiertes Strategiespiel
- **Spielmechanik:** Manipulation von Vertrauenswerten durch Abilities
- **Ziel:** 75% der Akteure unter 40% Vertrauen in 32 Runden
- **Komplexität:** 58 Akteure, 4-6 Kategorien, multiple Ressourcen, Combos, Events

### 1.2 Technische Implementation

**Canvas-basierte Visualisierung:**
- ✅ Force-Directed Layout für organische Anordnung
- ✅ Zoom & Pan (Mausrad, Pinch-to-zoom)
- ✅ Hover-Tooltips
- ✅ Responsive Design
- ✅ Performance-Optimierungen (Viewport Culling, React.memo)

**UI-Komponenten:**
- ✅ Bottom Sheet für Akteur-Details
- ✅ Filter Controls (Tier, Kategorie, Trust)
- ✅ HUD-Elemente (Ressourcen, Progress, Round)
- ✅ Overlay-Systeme (Combo, Topology, Reactions)

### 1.3 Identifizierte UX-Probleme

#### Problem 1: Information Overload (Kritisch ⚠️)

**Symptome:**
- 58 Akteure gleichzeitig sichtbar
- Alle Nodes gleich prominent dargestellt
- Viele Overlays konkurrieren um Bildschirmfläche
- Kategorie-Labels verdecken Netzwerk

**Impact:** Nutzer fühlen sich überfordert, verlieren Orientierung

**Best Practice verletzt:** "Progressive Disclosure" - zeige nur was relevant ist

#### Problem 2: Fehlende Visual Hierarchy (Hoch ⚠️)

**Symptome:**
- Tier-System (1-3) existiert im Code, wird aber visuell nicht genutzt
- Wichtige/zentrale Akteure gehen unter
- Keine Unterscheidung zwischen "Background noise" und "Key players"

**Impact:** Spieler übersehen strategisch wichtige Akteure

**Best Practice verletzt:** "Visual Hierarchy" - wichtige Elemente hervorheben

#### Problem 3: Schwache Spatial Navigation (Mittel ⚠️)

**Symptome:**
- Keine Minimap/Overview
- Keine visuelle Führung zu Points of Interest
- Force-Layout ist dynamisch, keine mentale Karte möglich
- Kategorie-Regionen sind statisch und überlappen

**Impact:** Nutzer verlieren Kontext beim Zoomen

**Best Practice verletzt:** "Mental Map Preservation" - Layout-Stabilität

#### Problem 4: Versteckte Funktionalität (Mittel ⚠️)

**Symptome:**
- Ability Preview ist vorhanden, aber versteckt hinter Button
- Filter-Controls sind collapsed
- Keine proaktive Guidance für neue Features

**Impact:** Nutzer entdecken Features nicht

**Best Practice verletzt:** "Affordance" - Funktionen sollten entdeckbar sein

#### Problem 5: Information Density in Overlays (Niedrig ⚠️)

**Symptome:**
- Combo Tracker, Topology Overlay, Reactions Overlay stapeln sich
- Bottom Sheet nimmt viel Platz ein
- HUD-Elemente überlappen bei kleinen Bildschirmen

**Impact:** Bildschirm-Real-Estate wird ineffizient genutzt

---

## 2. BEST PRACTICES AUS FORSCHUNG

### 2.1 Network Graph Visualization Best Practices

**Quelle:** Cambridge Intelligence, IxDF, Research Papers

#### Progressive Disclosure (Detail on Demand)
> "Provide overview first, zoom and filter, then details on demand" - Shneiderman's Mantra

**Anwendung:**
- Level of Detail (LOD) basierend auf Zoom
- Semantic Zooming: Bei niedrigem Zoom nur Cluster, bei hohem Zoom einzelne Nodes
- Contextual Information: Details nur bei Hover/Selection

#### Visual Hierarchy durch Graph-Metriken
> "Highlight the most important nodes using network centrality metrics"

**Anwendung:**
- Node-Größe basierend auf Betweenness Centrality
- Helligkeit/Opacity basierend auf Degree Centrality
- Special Markers für Bottleneck-Nodes

#### Mental Map Preservation
> "Incremental layout algorithms place new elements without changing existing positions too much"

**Anwendung:**
- Force-Directed Layout mit Dämpfung
- Fixierung wichtiger Nodes
- Smooth Transitions bei Layout-Änderungen

### 2.2 Force-Directed Graph UX Patterns

**Quelle:** yWorks, Cambridge Intelligence

#### Edge Bundling für Clutter Reduction
> "Group edges with similar paths to reduce overlap and highlight structural relationships"

**Anwendung:**
- Hierarchical Edge Bundling für Kategorie-übergreifende Verbindungen
- Reduziert visuelle Komplexität bei vielen Edges

#### Clustering & Grouping
> "Create groups to hide complexity inside group nodes and limit coupling"

**Anwendung:**
- Meta-Nodes für Gruppen von ähnlichen Akteuren
- Expandable/Collapsible Cluster

#### Interactive Features
> "Transform user experience from passive observation to active investigation"

**Anwendung:**
- Draggable Nodes (bereits implementiert via Pan)
- Semantic Zoom (verschiedene Detail-Level)
- Filtering & Simplification (bereits vorhanden, muss verbessert werden)

### 2.3 Game UI Best Practices

**Quelle:** UX Design Patterns for Games

#### Information Layering
> "Layer information based on importance and frequency of use"

**Primäre Ebene:** Immer sichtbar (Netzwerk, kritische Stats)
**Sekundäre Ebene:** Kontextbezogen (Tooltips, Details)
**Tertiäre Ebene:** On-Demand (Encyclopedia, Settings)

#### Visual Feedback Loops
> "Every player action should have immediate, clear visual feedback"

**Anwendung:**
- Ability Impact Prediction (Show before execute)
- Propagation Visualization (Animated ripple effects)
- State Change Indicators (Trust change animations)

#### Guided Discovery
> "Introduce complexity gradually, guide users to discover features"

**Anwendung:**
- Tutorial System (bereits vorhanden)
- Progressive Feature Unlock
- Contextual Hints

---

## 3. VERBESSERUNGS-KONZEPTE

### 3.1 KONZEPT 1: Semantic Zoom mit LOD System

**Problem gelöst:** Information Overload, Fehlende Visual Hierarchy

**Beschreibung:**
Implementiere ein dreistufiges Zoom-System mit unterschiedlichen Detail-Levels:

#### Level 1: Strategic Overview (Zoom < 0.7)
**Sichtbar:**
- Nur Tier 1 Akteure (Core, ~8-12 Nodes)
- Cluster-Visualisierung für Tier 2+3 als Meta-Nodes
- Kategorie-Regionen als Hintergrund
- Aggregierte Statistiken pro Cluster

**Darstellung:**
- Große Node-Größe für Lesbarkeit
- Trust als Farbe + Prozentzahl im Node
- Verbindungen zwischen Clustern (gebündelt)
- Labels immer sichtbar

**Code-Änderungen:**
```typescript
// In NetworkVisualization.tsx
const LOD_THRESHOLDS = {
  OVERVIEW: 0.7,    // < 0.7 = Strategic Overview
  TACTICAL: 1.3,    // 0.7-1.3 = Tactical View
  DETAILED: 1.3,    // > 1.3 = Detailed View
};

const getVisibleActors = (zoom: number, actors: Actor[]) => {
  if (zoom < LOD_THRESHOLDS.OVERVIEW) {
    // Show only Tier 1 + Clusters for Tier 2+3
    return actors.filter(a => a.tier === 1);
  } else if (zoom < LOD_THRESHOLDS.TACTICAL) {
    // Show Tier 1+2
    return actors.filter(a => a.tier <= 2);
  } else {
    // Show all
    return actors;
  }
};
```

#### Level 2: Tactical View (Zoom 0.7-1.3)
**Sichtbar:**
- Tier 1+2 Akteure (~20-30 Nodes)
- Tier 3 als kleinere Nodes (optional)
- Individuelle Verbindungen
- Cluster-Highlights für dichte Bereiche

**Darstellung:**
- Standard Node-Größe
- Names sichtbar
- Connections mit Strength-Indicator
- Hover für Details

#### Level 3: Detailed View (Zoom > 1.3)
**Sichtbar:**
- Alle Akteure
- Alle Details
- Connection-Labels
- Mini-Stats im Node

**Darstellung:**
- Große Nodes mit allen Infos
- Vulnerabilities als Icons
- Active Effects als Badges
- Tooltips mit Full Details

**Begründung:**
- ✅ Reduziert kognitive Last bei niedrigem Zoom
- ✅ Ermöglicht strategische Übersicht
- ✅ Nutzt Tier-System aus Code
- ✅ Standard Pattern aus Graph-Visualisierung

**Effort:** Mittel (2-3 Tage)

---

### 3.2 KONZEPT 2: Adaptive Minimap mit Context

**Problem gelöst:** Schwache Spatial Navigation

**Beschreibung:**
Füge eine intelligente Minimap hinzu, die Kontext bewahrt beim Zoomen/Pannen.

**Features:**

#### Minimap Display
- Position: Unten links (aktuell: Zoom Controls)
- Größe: 200x150px
- Toggle-bar: Ein/Ausblendbar
- Inhalt:
  - Gesamtes Netzwerk als vereinfachte Darstellung
  - Viewport-Rectangle zeigt aktuellen Ausschnitt
  - Cluster-Farben (kein Detail)
  - Click to Jump Navigation

#### Context Indicators
- Heat Map Overlay (Trust-Durchschnitt pro Region)
- Points of Interest Markers:
  - 🎯 Niedrigstes Trust (rot)
  - ⭐ Höchstes Centrality (gelb)
  - 🔥 Aktive Combos (orange)
  - 🛡️ Defensive Akteure (grün)

**Mockup:**
```
┌─────────────────┐
│  ╔═══════╗      │
│  ║ 🎯    ║      │ <- Minimap
│  ║   ⭐  ║      │    Viewport als weißer Rahmen
│  ║    🔥 ║      │    POI als Symbole
│  ╚═══════╝      │
└─────────────────┘
```

**Code-Änderungen:**
```typescript
// New component: MinimapOverlay.tsx
export function MinimapOverlay({
  actors,
  viewport,
  onViewportChange,
  collapsed
}: MinimapProps) {
  // Render simplified network
  // Show viewport rectangle
  // Handle click-to-navigate
}
```

**Begründung:**
- ✅ Standard Feature in komplexen Visualisierungen
- ✅ Bewahrt "Mental Map" beim Zoomen
- ✅ Schnelle Navigation zu POIs
- ✅ Minimaler Screen Space

**Effort:** Mittel (2 Tage)

---

### 3.3 KONZEPT 3: Smart Information Layering

**Problem gelöst:** Information Density in Overlays

**Beschreibung:**
Reorganisiere Overlay-System mit intelligenter Priorisierung und Auto-Hide.

**Neue Overlay-Hierarchie:**

#### Primäre HUD (Immer sichtbar)
- **Position:** Top-Left, Top-Right
- **Inhalt:**
  - Ressourcen (Money, Attention, Infrastructure)
  - Round Counter
  - Victory Progress
- **Optimierung:** Kompakter, Icon-basiert

#### Sekundäre Overlays (Contextual)
- **Combo Tracker:** Nur wenn Combo aktiv → Auto-Hide nach 3 Sekunden
- **Topology Insights:** Als Collapsible Badge (nicht permanentes Panel)
- **Actor Reactions:** Als Notification-Toast, nicht permanentes Panel

#### Tertiary Controls (On-Demand)
- **Filter Controls:** In Radial Menu (siehe Konzept 4)
- **Statistics:** Modal on request
- **Encyclopedia:** Sidebar

**Auto-Hide Logic:**
```typescript
// Auto-hide combo tracker if no activity for 5 seconds
useEffect(() => {
  if (gameState.activeCombos.length > 0) {
    const timer = setTimeout(() => {
      setShowComboTracker(false);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [gameState.activeCombos]);
```

**Begründung:**
- ✅ Reduziert permanente UI-Elemente
- ✅ Zeigt Info nur wenn relevant
- ✅ Mehr Platz für Netzwerk-Visualisierung
- ✅ Standard Pattern in modernen UIs

**Effort:** Niedrig (1 Tag)

---

### 3.4 KONZEPT 4: Radial Context Menu für Akteur-Interaktion

**Problem gelöst:** Bottom Sheet nimmt zu viel Platz

**Beschreibung:**
Ersetze Bottom Sheet durch Radial Menu direkt am Actor Node.

**Features:**

#### Radial Menu Struktur
- **Trigger:** Right-Click oder Long-Press auf Actor
- **Layout:** Kreisförmig um Actor herum
- **Inhalt:**
  - Abilities als Segments (max 8)
  - Zentrum: Actor Stats (Trust, Resilience)
  - Hover Segment: Ability Preview

**Visual Design:**
```
        [Ability 1]
    /                 \
[Ab 8]    ACTOR     [Ab 2]
    \     80%      /
        [Ability 3]
```

**Interaction:**
1. User clicks Actor → Actor selected, Radial Menu appears
2. User hovers Ability Segment → Preview shows impact
3. User clicks Segment → Ability activated (if targeting needed, enters targeting mode)
4. Click outside → Close menu

**Bottom Sheet Alternative:**
- Bottom Sheet wird zu Info-Panel (nicht Interaction)
- Zeigt:
  - Actor History
  - Active Effects
  - Connections List
  - Vulnerabilities/Resistances
- Erscheint nur bei explizitem "Info" click

**Code-Änderungen:**
```typescript
// New component: RadialActorMenu.tsx
export function RadialActorMenu({
  actor,
  abilities,
  position, // Actor screen position
  onAbilitySelect,
  onClose
}: RadialMenuProps) {
  // Calculate segment positions
  // Render ability segments
  // Handle hover preview
}
```

**Begründung:**
- ✅ Reduziert vertikalen Platzbedarf massiv
- ✅ Schnellerer Zugriff auf Abilities (1 Click vs 2)
- ✅ Contextual Positioning (Menu bei Actor, nicht am Bildschirmrand)
- ✅ Etabliertes Pattern in Games (z.B. Mass Effect, Witcher)

**Effort:** Mittel (2-3 Tage)

---

### 3.5 KONZEPT 5: Visual Hierarchy durch Node-Styling

**Problem gelöst:** Fehlende Visual Hierarchy

**Beschreibung:**
Nutze verschiedene visuelle Parameter um Wichtigkeit zu kommunizieren.

**Hierarchie-Parameter:**

#### Node-Größe (Tier-basiert)
```typescript
const NODE_SIZE_BY_TIER = {
  1: canvasSize * 0.05,  // Core: 5% of canvas (groß)
  2: canvasSize * 0.04,  // Secondary: 4%
  3: canvasSize * 0.03,  // Background: 3% (klein)
};
```

#### Node-Opacity (Centrality-basiert)
```typescript
const getNodeOpacity = (actor: Actor) => {
  // Actors with high betweenness centrality = more opaque
  if (actor.centrality > 0.7) return 1.0;
  if (actor.centrality > 0.4) return 0.9;
  return 0.7; // Background actors slightly transparent
};
```

#### Border/Glow (Strategic Importance)
```typescript
// Highlight bottleneck actors
if (actor.isBottleneck) {
  // Add pulsing golden border
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
}
```

#### Label Priority
```typescript
// Always show labels for:
const shouldShowLabel = (actor: Actor, zoom: number) => {
  if (actor.tier === 1) return true; // Core actors
  if (actor.isBottleneck) return true; // Strategic actors
  if (actor.trust < 0.3) return true; // Manipulated actors
  if (zoom > 1.0) return true; // When zoomed in
  return false;
};
```

**Begründung:**
- ✅ Nutzt existing Tier-System
- ✅ Macht strategisch wichtige Akteure sofort erkennbar
- ✅ Kein extra UI, nur visuelle Änderung
- ✅ Best Practice aus Network Analysis

**Effort:** Niedrig (1 Tag)

---

### 3.6 KONZEPT 6: Ability Impact Prediction & Visualization

**Problem gelöst:** Versteckte Funktionalität, Unklares Feedback

**Beschreibung:**
Zeige Ability-Impact BEVOR User es ausführt.

**Features:**

#### Preview Mode (On Ability Hover)
Wenn User über Ability hovert (im Radial Menu):
1. **Ghost Effect:** Zeige vorhergesagten Trust-Wert als Ghost-Circle
2. **Propagation Preview:** Zeige betroffene Nodes mit Transparenz
3. **Numeric Indicator:** Zeige "-15%" neben Target-Node

**Visual:**
```
Aktuell: [Actor 80% Trust] ━━ [Connected Actor 70%]
Preview: [Actor 65% ⬇-15%] ━━ [Connected 68% ⬇-2%]
         └─ Ghost in rot    └─ Propagation-Effect
```

#### Execution Visualization
Nach Ability-Aktivierung:
1. **Beam Effect:** Von Source zu Target
2. **Ripple Animation:** Bei Propagation
3. **Trust Bar Animation:** Smooth transition mit Easing
4. **Floating Number:** "-15%" fliegt vom Node weg

**Code-Änderungen:**
```typescript
// In AbilitySystem
function predictAbilityImpact(
  ability: Ability,
  target: Actor,
  network: Network
): AbilityImpactPrediction {
  // Calculate direct effect
  const directImpact = calculateDirectEffect(ability, target);

  // Calculate propagation
  const propagationImpacts = calculatePropagation(target, network, directImpact);

  return {
    target: targetId,
    directDelta: directImpact,
    propagation: propagationImpacts,
    totalAffectedActors: propagationImpacts.length + 1
  };
}
```

**Begründung:**
- ✅ Reduziert "Trial & Error" Gameplay
- ✅ Macht Spielmechanik verständlicher
- ✅ Erhöht Spieler-Confidence
- ✅ Standard in modernen Strategy Games

**Effort:** Mittel (2 Tage)

---

### 3.7 KONZEPT 7: Adaptive Force-Directed Layout

**Problem gelöst:** Schwache Spatial Navigation, Chaotisches Layout

**Beschreibung:**
Verbessere Force-Directed Layout für stabileres, vorhersagbareres Verhalten.

**Änderungen:**

#### Fixed Category Centers
Statt dynamischer Kategorie-Positionen, fixiere Centers:
```typescript
const FIXED_CATEGORY_POSITIONS = {
  media: { x: 0.2, y: 0.2 },       // Top-Left
  expert: { x: 0.8, y: 0.2 },      // Top-Right
  lobby: { x: 0.2, y: 0.8 },       // Bottom-Left
  organization: { x: 0.8, y: 0.8 }, // Bottom-Right
  defensive: { x: 0.5, y: 0.5 },   // Center
};
```

#### Pinning Mechanism
Erlaube User, wichtige Nodes zu "pinnen":
- Right-Click Menu: "Pin Position"
- Pinned Nodes bewegen sich nicht mehr
- Visual Indicator: Pin-Icon am Node

#### Layout Damping
Reduziere "Jitter" durch Dämpfung:
```typescript
const updateForceLayout = (actors: Actor[], damping = 0.8) => {
  actors.forEach(actor => {
    if (actor.pinned) return; // Skip pinned

    const force = calculateForces(actor, actors);
    actor.velocity = {
      x: (actor.velocity.x + force.x) * damping,
      y: (actor.velocity.y + force.y) * damping
    };

    // Only update if velocity is significant
    if (Math.abs(actor.velocity.x) > 0.1 || Math.abs(actor.velocity.y) > 0.1) {
      actor.position.x += actor.velocity.x;
      actor.position.y += actor.velocity.y;
    }
  });
};
```

#### Smart Collision Avoidance
Verhindere Überlappungen durch bessere Collision-Detection:
```typescript
const MIN_DISTANCE_BY_TIER = {
  1: 120, // Core actors need more space
  2: 80,
  3: 60
};
```

**Begründung:**
- ✅ Stabileres Layout = bessere Mental Map
- ✅ User-Control über wichtige Nodes
- ✅ Reduziert visuelles "Rauschen"
- ✅ Best Practice: "Mental Map Preservation"

**Effort:** Mittel (2 Tage)

---

## 4. PRIORISIERUNG & ROADMAP

### 4.1 Priorisierungs-Matrix

| Konzept | Impact | Effort | Priorität | Phase |
|---------|--------|--------|-----------|-------|
| **3.5 Visual Hierarchy** | Hoch | Niedrig | ⭐⭐⭐ MUST | 1 |
| **3.3 Smart Layering** | Hoch | Niedrig | ⭐⭐⭐ MUST | 1 |
| **3.1 Semantic Zoom** | Hoch | Mittel | ⭐⭐⭐ MUST | 2 |
| **3.6 Impact Prediction** | Hoch | Mittel | ⭐⭐ SHOULD | 2 |
| **3.2 Minimap** | Mittel | Mittel | ⭐⭐ SHOULD | 3 |
| **3.7 Adaptive Layout** | Mittel | Mittel | ⭐ COULD | 3 |
| **3.4 Radial Menu** | Mittel | Mittel | ⭐ COULD | 4 |

### 4.2 Implementierungs-Phasen

#### Phase 1: Quick Wins (1 Woche)
**Ziel:** Reduziere Information Overload ohne große Umbauten

**Tasks:**
1. ✅ Implementiere Visual Hierarchy (Konzept 3.5)
   - Node-Größe nach Tier
   - Opacity nach Centrality
   - Label-Priorisierung
2. ✅ Smart Information Layering (Konzept 3.3)
   - Auto-Hide für Combo Tracker
   - Collapsible Topology
   - Toast Notifications für Reactions

**Deliverable:** Klarere Netzwerk-Darstellung, weniger permanente Overlays

#### Phase 2: Core Experience (2 Wochen)
**Ziel:** Verbessere Haupt-Interaktions-Loop

**Tasks:**
1. ✅ Semantic Zoom System (Konzept 3.1)
   - LOD Thresholds definieren
   - Cluster-Visualisierung für niedrigen Zoom
   - Detail-Level für hohen Zoom
2. ✅ Ability Impact Prediction (Konzept 3.6)
   - Preview-Modus
   - Propagation-Visualization
   - Animation System

**Deliverable:** Intuitivere Interaktion, besseres Verständnis

#### Phase 3: Navigation & Context (1-2 Wochen)
**Ziel:** Verbessere Spatial Awareness

**Tasks:**
1. ✅ Minimap mit POI (Konzept 3.2)
2. ✅ Adaptive Force Layout (Konzept 3.7)
   - Fixed Category Centers
   - Layout Damping
   - Pinning Mechanism

**Deliverable:** Bessere Orientierung, stabileres Layout

#### Phase 4: Advanced Interactions (Optional)
**Ziel:** Alternative Interaktions-Patterns

**Tasks:**
1. ⚠️ Radial Actor Menu (Konzept 3.4)
   - Nur wenn Bottom Sheet als Problem identifiziert

**Deliverable:** Platzsparendere Interaktion

---

## 5. DESIGN-BEGRÜNDUNGEN

### 5.1 Warum Semantic Zoom?

**Problem:** 58 Akteure sind zu viele für simultane Darstellung

**Alternativen:**
❌ Paging: Zerstört Netzwerk-Kontext
❌ Fisheye-Lens: Verzerrt visuelle Darstellung
✅ **Semantic Zoom:** Bewahrt Kontext, reduziert Detail

**Precedents:**
- Google Maps (Buildings erscheinen bei Zoom)
- Figma (Layer-Details bei Zoom)
- Network Analysis Tools (Gephi, Cytoscape)

**Research-Backed:**
> "Semantic zooming allows different levels of detail to emerge, with broad patterns visible at high levels and intricate sub-networks revealed when zooming in" - Cambridge Intelligence

### 5.2 Warum Minimap?

**Problem:** User verlieren Orientierung beim Zoomen/Pannen

**Alternativen:**
❌ Breadcrumbs: Funktioniert nicht bei 2D-Navigation
❌ Zoom-Reset Button: Unterbricht Flow
✅ **Minimap:** Permanent Context, Quick Navigation

**Precedents:**
- Spiele: Starcraft, Civilization, Anno
- Design Tools: Photoshop, Sketch
- Karten: Google Maps Mini-Overview

**Research-Backed:**
> "Overview+Detail interfaces provide context preservation by showing the full dataset in a small overview window while allowing detailed examination in the main view" - Visualization Research

### 5.3 Warum Visual Hierarchy statt mehr UI?

**Problem:** Wichtige Akteure gehen unter

**Alternativen:**
❌ Weitere Filter: Mehr UI-Komplexität
❌ Separate List-View: Zerstört Netzwerk-Sicht
✅ **Visual Hierarchy:** Nutzt menschliche Wahrnehmung

**Precedents:**
- Data Visualization: Größe = Wichtigkeit (Universal)
- Maps: POI-Marker in verschiedenen Größen
- Social Networks: Verified Badges, Follower Count

**Research-Backed:**
> "Network analysis uses algorithms to highlight the most important or central nodes in a graph, helping to surface useful patterns and reduce clutter" - Graph Visualization Best Practices

### 5.4 Warum Ability Impact Prediction?

**Problem:** User wissen nicht, was Abilities tun

**Alternativen:**
❌ Bessere Beschreibungen: Text wird nicht gelesen
❌ Tutorial: Nur beim ersten Mal
✅ **Live Preview:** Zeigt direkt den Effekt

**Precedents:**
- Strategy Games: XCOM (Hit Chance Preview)
- Photo Editing: Photoshop (Filter Preview)
- CAD Software: Live Dimension Updates

**Research-Backed:**
> "Preview features transform the user experience from uncertainty to confidence by showing the outcome before commitment" - UX Research

---

## 6. ERFOLGSKRITERIEN

### 6.1 Quantitative Metriken

**Messbar nach Implementation:**

1. **Information Density Reduction**
   - Metric: Anzahl gleichzeitig sichtbarer UI-Elemente
   - Ziel: Von ~15 auf ~8 reduzieren

2. **User Navigation Efficiency**
   - Metric: Anzahl Zoom/Pan-Aktionen bis Zielfindung
   - Ziel: 30% Reduktion

3. **Feature Discovery Rate**
   - Metric: % neuer User, die Impact Preview nutzen
   - Ziel: >70% in ersten 5 Minuten

4. **Cognitive Load** (Subjektiv, via NASA-TLX)
   - Metric: User-Rating (1-10)
   - Ziel: Von ~7 auf ~4

### 6.2 Qualitative Kriterien

**Durch User Testing validieren:**

1. **Klarheit:**
   - "Ich verstehe sofort, welche Akteure wichtig sind"
   - "Ich weiß immer, wo ich mich im Netzwerk befinde"

2. **Kontrolle:**
   - "Ich kann schnell zu interessanten Bereichen navigieren"
   - "Ich verstehe, was meine Aktionen bewirken"

3. **Engagement:**
   - "Das Spiel fühlt sich nicht überwältigend an"
   - "Ich möchte verschiedene Strategien ausprobieren"

### 6.3 A/B Testing Kandidaten

**Features zum Testen:**

1. **Semantic Zoom Thresholds**
   - Variant A: 0.7 / 1.3
   - Variant B: 0.5 / 1.0
   - Metric: User Zoom-Verhalten

2. **Node Sizing Factor**
   - Variant A: Tier-basiert (5%/4%/3%)
   - Variant B: Centrality-basiert
   - Metric: Strategische Entscheidungen

3. **Minimap Position**
   - Variant A: Bottom-Left
   - Variant B: Top-Right
   - Metric: Usage Frequency

---

## 7. TECHNISCHE UMSETZUNG

### 7.1 Architektur-Änderungen

#### Neue Utility-Module

```typescript
// src/utils/rendering/lod-manager.ts
export class LODManager {
  getVisibleActors(actors: Actor[], zoom: number, tier: ActorTier[]): Actor[];
  shouldShowLabel(actor: Actor, zoom: number): boolean;
  getNodeSize(actor: Actor, zoom: number): number;
}

// src/utils/rendering/impact-predictor.ts
export class ImpactPredictor {
  predictAbilityImpact(ability: Ability, target: Actor, network: Network): Prediction;
  visualizePrediction(ctx: CanvasRenderingContext2D, prediction: Prediction): void;
}

// src/utils/network/layout-stabilizer.ts
export class LayoutStabilizer {
  applyDamping(actors: Actor[], dampingFactor: number): void;
  fixCategoryCenters(actors: Actor[]): void;
  avoidCollisions(actors: Actor[]): void;
}
```

#### Component-Änderungen

```typescript
// NetworkVisualization.tsx
// + Add LOD logic
// + Add Minimap integration
// + Add Visual Hierarchy rendering

// BottomSheet.tsx (oder RadialActorMenu.tsx)
// + Add Impact Preview on hover
// + Simplify to Info-Panel

// App.tsx
// + Add Smart Overlay Management
// + Add Auto-Hide logic
```

### 7.2 State Management

#### Neue Zustand-Slice

```typescript
// src/stores/uiStore.ts
interface UIState {
  // Existing...

  // New:
  currentZoom: number;
  lodLevel: 'overview' | 'tactical' | 'detailed';
  pinnedActors: Set<string>;
  minimapVisible: boolean;

  // Auto-hide states
  comboTrackerVisible: boolean;
  topologyVisible: boolean;
  lastInteractionTime: number;
}
```

### 7.3 Performance-Überlegungen

#### Optimierungen

1. **LOD System:**
   - Rendert nur sichtbare Nodes → Weniger Draw Calls
   - Cluster als einzelne Shapes → Weniger Complexity

2. **Minimap:**
   - Reduzierte Auflösung (1/4 der Hauptansicht)
   - Throttled Updates (nur bei Pan/Zoom)
   - Separate Canvas für Isolation

3. **Impact Prediction:**
   - Cached Calculations
   - Debounced Hover (300ms delay)
   - Limit zu max 20 affected actors

#### Benchmarks

**Ziel-Performance:**
- 60 FPS bei allen Zoom-Levels
- < 100ms Response Time für Interaktionen
- < 50ms für Impact Prediction

**Profiling-Punkte:**
```typescript
// Monitor these:
console.time('draw-frame');
console.time('calculate-forces');
console.time('predict-impact');
```

---

## 8. RISIKEN & MITIGATIONEN

### 8.1 Technische Risiken

#### Risiko 1: Performance-Degradation durch Semantic Zoom
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch
**Mitigation:**
- Viewport Culling bereits implementiert
- LOD reduziert Draw Calls
- Profiling nach jeder Phase

#### Risiko 2: Komplexität des Radial Menu
**Wahrscheinlichkeit:** Hoch
**Impact:** Mittel
**Mitigation:**
- Als Phase 4 (Optional)
- Prototyp zuerst
- Fallback: Behalte Bottom Sheet

### 8.2 UX-Risiken

#### Risiko 1: User verwirrt durch Semantic Zoom
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch
**Mitigation:**
- Klare visuelle Indikatoren für Zoom-Level
- Tutorial-Step für Zoom
- Smooth Transitions zwischen Levels

#### Risiko 2: Minimap lenkt ab
**Wahrscheinlichkeit:** Niedrig
**Impact:** Niedrig
**Mitigation:**
- Collapsible by default
- Optional in Settings
- A/B Testing

### 8.3 Scope Creep

**Gefahr:** Plan ist sehr umfangreich (7 Konzepte)

**Mitigation:**
- Strikte Phasen-Einteilung
- Jede Phase hat Deliverable
- Stop nach Phase 2 möglich (Core Experience erreicht)

---

## 9. QUELLEN & REFERENZEN

### Best Practice Sources

1. **Cambridge Intelligence** - "10 Rules of Great Graph Visualization Design"
   - Visual Hierarchy
   - Progressive Disclosure
   - Mental Map Preservation

2. **Interaction Design Foundation** - "Network Data Visualization"
   - Semantic Zooming
   - Detail on Demand
   - Overview+Detail Pattern

3. **yWorks** - "Force-Directed Graph Layout"
   - Layout Stability
   - Incremental Algorithms
   - User Control

4. **Research Papers:**
   - Shneiderman (1996) - "The Eyes Have It: A Task by Data Type Taxonomy"
   - Holten (2006) - "Hierarchical Edge Bundles"
   - van Ham (2009) - "Interactive Visualization of State Transition Systems"

### Game UX References

- **XCOM Series** - Ability Preview System
- **Civilization VI** - Minimap & Strategic View
- **Plague Inc** - Network Propagation Visualization
- **Democracy 3** - Complex System Visualization

---

## 10. NÄCHSTE SCHRITTE

### Immediate Actions

1. **Review & Feedback:**
   - [ ] Stakeholder Review dieses Plans
   - [ ] Priorisierung bestätigen
   - [ ] Budget/Timeline klären

2. **Technical Preparation:**
   - [ ] Performance Baseline messen
   - [ ] Prototyping-Umgebung setup
   - [ ] Component-Architecture skizzieren

3. **Design Phase:**
   - [ ] Mockups für Semantic Zoom erstellen
   - [ ] Minimap Design finalisieren
   - [ ] Animation-Specs definieren

### Phase 1 Start (Nach Approval)

**Week 1:**
- [ ] Implementiere Visual Hierarchy (3.5)
- [ ] Refactore Overlay System (3.3)
- [ ] User Testing Setup

**Week 2:**
- [ ] QA Phase 1
- [ ] Collect Metrics
- [ ] Go/No-Go Decision für Phase 2

---

## APPENDIX

### A. Glossar

- **LOD:** Level of Detail
- **Semantic Zoom:** Zoom mit sich änderndem Detailgrad
- **Progressive Disclosure:** Schrittweise Informationsfreigabe
- **Mental Map:** Mentales Modell der räumlichen Anordnung
- **Betweenness Centrality:** Maß für Knoten auf kürzesten Pfaden
- **Force-Directed Layout:** Physics-basiertes Graph-Layout

### B. Code-Snippets

Siehe jeweilige Konzept-Beschreibungen (3.1-3.7)

### C. Visual Mockups

[Erstellt in separatem Design-Tool, Referenz: Figma/Sketch Files]

---

**Dokument-Version:** 1.0
**Autor:** Claude (AI Assistant)
**Letztes Update:** 2025-12-10
**Status:** 🟡 Awaiting Review
