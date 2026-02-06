# Story Mode UX Transformation - Implementierungsplan

> **Ziel:** Die mechanische Tiefe des Spiels (Betrayal, Consequences, Combos, NPC-Advisor, Crisis, Endings) im Frontend sichtbar und gleichzeitig bedienbar machen.
>
> **Kerndiagnose:** 60% UX-Design (Büro-Metapher als Modal-Gateway), 25% Frontend-Architektur (16 useState-Hooks, kein UI-State-Management), 15% Backend-Architektur (StoryEngineAdapter-Monolith).
>
> **Prinzip:** Inkrementell. Jede Phase ist unabhängig deploybar und verschlechtert nie den bestehenden Zustand.

---

## Architektur-Übersicht: IST → SOLL

### IST (aktuelle Struktur)
```
┌─────────────────────────────────────────────────┐
│ StoryHUD (fixed top, z-40)                      │
│  Year │ Month │ AP │ Budget │ Capacity │ Risk │ │
│  Attention │ Moral │ [MENU] │ [END PHASE]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  OfficeScreen (relative, z-0)                   │
│  ┌─────────┐  ┌───────────────┐  ┌──────────┐ │
│  │  WallTV  │  │ DeskComputer  │  │OfficeDoor│ │
│  │ (Stats)  │  │  (Actions)    │  │ (Events) │ │
│  └────┬─────┘  └──────┬────────┘  └────┬─────┘ │
│       │               │                │        │
│  Klick = Fullscreen-Modal (z-50) öffnen         │
│                                                 │
│  ┌──────┐  ┌───────┐  ┌────────┐              │
│  │Phone │  │Smartph│  │ Folder │              │
│  │(NPCs)│  │(News) │  │(Mission)│              │
│  └──┬───┘  └──┬────┘  └───┬────┘              │
│     │         │            │                    │
│  Klick = Fullscreen-Modal (z-50) öffnen         │
│                                                 │
├───────────────────────────────┬─────────────────┤
│ ComboHints (fixed BL, z-20)  │ Advisor (fixed R)│
│ ObjectiveTracker (fixed BL)  │ Queue (fixed BR) │
└───────────────────────────────┴─────────────────┘
```

**Probleme:**
- 6 Panels, alle als exklusive Fullscreen-Modals
- Kein gleichzeitiges Arbeiten möglich
- OfficeScreen-Statusbar dupliziert HUD-Daten
- TV-Statistiken hardcoded (nicht mit Game-State verbunden)
- 16 separate useState-Hooks für Panel-Sichtbarkeit

### SOLL (neue Struktur)
```
┌─────────────────────────────────────────────────────────────┐
│ StoryHUD (fixed top, z-40) - ERWEITERT                     │
│  Year │ Month │ AP ││ Budget │ Cap │ Risk │ Att │ Moral    │
│  [NPC-Portraits mit Betrayal-Indicator]  [MENU] [END PHASE]│
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  Zentrale Spielfläche            │  Rechtes Panel (w-96)    │
│  ┌────────────────────────────┐  │  ┌────────────────────┐ │
│  │                            │  │  │ Tab: Actions       │ │
│  │  Office-View (kompakt)     │  │  │ Tab: NPCs          │ │
│  │  ODER                      │  │  │ Tab: News          │ │
│  │  Dashboard-View            │  │  │ Tab: Events        │ │
│  │  (toggle per Hotkey)       │  │  │ Tab: Mission       │ │
│  │                            │  │  │ Tab: Stats         │ │
│  │                            │  │  │                    │ │
│  │                            │  │  │ [Panel-Inhalt      │ │
│  │                            │  │  │  scrollbar]        │ │
│  └────────────────────────────┘  │  └────────────────────┘ │
│                                  │                          │
├──────────────────────────────────┤  ┌────────────────────┐ │
│ Consequences-Timeline (h-24)     │  │ Advisor (kollabierb)│ │
│ [Phase 3: Bot deployed] ──→ ... │  │ Queue (kollabierbar)│ │
│ ComboHints │ ObjectiveTracker    │  └────────────────────┘ │
└──────────────────────────────────┴──────────────────────────┘
```

**Vorteile:**
- Rechtes Panel mit Tabs statt 6 Fullscreen-Modals
- Office-View bleibt als atmosphärischer Hub erhalten
- Dashboard-View als Alternative für Strategie-fokussiertes Spielen
- Consequences-Timeline macht versteckte Ketten sichtbar
- NPC-Betrayal-Indikatoren immer im HUD

---

## Phase 0: UI-State-Foundation (Voraussetzung)

### 0.1 Panel-State-Store erstellen

**Datei:** `src/story-mode/stores/panelStore.ts` (NEU)

```typescript
import { create } from 'zustand';

type PanelId = 'actions' | 'npcs' | 'news' | 'events' | 'mission' | 'stats';
type ViewMode = 'office' | 'dashboard';

interface PanelStore {
  // Welches Panel ist im rechten Bereich aktiv (null = keins)
  activePanel: PanelId | null;
  setActivePanel: (panel: PanelId | null) => void;
  togglePanel: (panel: PanelId) => void;

  // View-Modus: Office-Szene oder Dashboard
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Advisor und Queue bleiben eigenständig (bereits implementiert)
  advisorCollapsed: boolean;
  toggleAdvisor: () => void;
  queueCollapsed: boolean;
  toggleQueue: () => void;

  // Modals die weiterhin exklusiv sein müssen (Game-Events)
  // Diese unterbrechen das Spiel und MÜSSEN modal bleiben:
  // - ConsequenceModal
  // - BetrayalEventModal
  // - CrisisModal
  // - DialogBox
  // - PauseMenu
  // - GameEndScreen
}
```

**Begründung:** Die 16 useState-Hooks in StoryModeGame.tsx werden durch einen Zustand-Store ersetzt. Nur ein Panel kann gleichzeitig im rechten Bereich aktiv sein (Tab-Logik), aber das Panel überlagert nicht mehr den gesamten Bildschirm.

**Aufwand:** ~2h
**Risiko:** Niedrig (additive Änderung, bestehende useState können parallel existieren)
**Test:** Panel-Toggle per Store funktioniert, bestehende Modals unverändert

### 0.2 Keyboard-Shortcuts auf Panel-Store umleiten

**Dateien:** `StoryModeGame.tsx`, `OfficeScreen.tsx`

Aktuell: Tastenkürzel in OfficeScreen.tsx setzen Parent-State via Callbacks.
Neu: Tastenkürzel lesen/schreiben direkt den panelStore.

```
[A] → panelStore.togglePanel('actions')
[N] → panelStore.togglePanel('news')
[S] → panelStore.togglePanel('stats')
[P] → panelStore.togglePanel('npcs')
[M] → panelStore.togglePanel('mission')
[E] → panelStore.togglePanel('events')
[V] → panelStore.toggleViewMode()  // NEU: Office ↔ Dashboard
[ESC] → panelStore.setActivePanel(null) // Panel schließen
```

**Aufwand:** ~1h
**Risiko:** Niedrig
**Test:** Tastenkürzel öffnen/schließen Panels, ESC schließt aktives Panel

---

## Phase 1: Rechtes Sidebar-Panel-System

### 1.1 SidePanel-Container erstellen

**Datei:** `src/story-mode/components/SidePanel.tsx` (NEU)

Ein generischer Container, der rechts neben der Spielfläche sitzt und Tabs anzeigt.

```
Visuelles Konzept:
┌──────────────────────────────────────────────────────┐
│ [📋] [👥] [📰] [🌍] [📁] [📊]    ← Tab-Icons       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  AKTIONEN PLANEN                  ← Panel-Titel      │
│  Phase: TA03 | 12 verfügbar                          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ [LEGAL] [GREY] [ILLEGAL] [NEU]  [Suche...]  │   │
│  ├──────────────────────────────────────────────┤   │
│  │                                              │   │
│  │  Action-Card 1                               │   │
│  │  Action-Card 2 ⭐ (empfohlen)               │   │
│  │  Action-Card 3                               │   │
│  │  ...                                         │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  💰 $97K  ⚡ 3  🎯 2 AP           ← Ressourcen-Bar  │
└──────────────────────────────────────────────────────┘
```

**Architektur:**

```typescript
interface SidePanelProps {
  children: React.ReactNode;
}

// SidePanel rendert:
// 1. Tab-Leiste (6 Icons) - liest activePanel aus panelStore
// 2. Panel-Content (children) - via activePanel bestimmt
// 3. Position: fixed right-0, top-16 (unter HUD), bottom-0
// 4. Breite: w-[420px] (breiter als Advisor, schmaler als Modal)
// 5. z-index: z-35 (unter HUD, über Office)
```

**Aufwand:** ~3h
**Risiko:** Mittel (Layout-Integration mit bestehenden Elementen)
**Test:** Tab-Klick wechselt Panel-Inhalt, Scrolling funktioniert

### 1.2 Bestehende Panels als Sidebar-Varianten

Jedes Panel bekommt eine **Sidebar-Variante** zusätzlich zur bestehenden Modal-Variante. Die Modal-Variante bleibt als Fallback und für mobile Ansichten erhalten.

**Strategie:** Nicht die bestehenden Komponenten zerstören, sondern in jedem Panel eine `variant`-Prop einführen:

```typescript
interface ActionPanelProps {
  // ... bestehende Props
  variant?: 'modal' | 'sidebar';  // NEU
}
```

**Änderungen pro Panel:**

| Panel | Sidebar-Anpassung | Aufwand |
|-------|-------------------|---------|
| **ActionPanel** | 2-Spalten-Grid → 1-Spalten-Liste. Filter-Tabs werden kompakter (Icons statt Text). Footer-Ressourcen bleiben. | ~4h |
| **NewsPanel** | Kaum Änderung nötig. Bereits vertikal. Nur max-width entfernen. | ~1h |
| **StatsPanel** | Stat-Boxes stacken vertikal statt 2×2-Grid. Ressource-Bars bleiben. | ~2h |
| **NpcPanel** | Größte Anpassung: 2-Spalten-Layout → vertikale NPC-Liste. Detail-View als expandierbare Sektion oder als separater Klick (öffnet Dialog). | ~4h |
| **MissionPanel** | Kaum Änderung. Vertikales Briefing-Dokument. | ~1h |
| **EventsPanel** | Kategorie-Gruppen kollabierbar machen. Sonst vertikal kompatibel. | ~2h |

**Gesamt-Aufwand Phase 1.2:** ~14h
**Risiko:** Mittel (viel Styling-Arbeit, aber keine Logik-Änderungen)
**Test:** Jedes Panel im sidebar-Modus rendert korrekt, scrollt, alle Callbacks funktionieren

### 1.3 Layout-Integration in StoryModeGame.tsx

**Änderungen in StoryModeGame.tsx:**

```
IST:
<div className="fixed inset-0">
  <StoryHUD />
  <div className="pt-16 h-full">
    <OfficeScreen />
  </div>
  {showActionPanel && <ActionPanel variant="modal" />}
  {showNewsPanel && <NewsPanel variant="modal" />}
  ...
</div>

SOLL:
<div className="fixed inset-0">
  <StoryHUD />
  <div className="pt-16 h-full flex">
    {/* Linker Bereich: Office oder Dashboard */}
    <div className="flex-1 relative">
      {viewMode === 'office' ? <OfficeScreen /> : <DashboardView />}
    </div>
    {/* Rechter Bereich: Panel-Sidebar */}
    {activePanel && (
      <SidePanel>
        {activePanel === 'actions' && <ActionPanel variant="sidebar" />}
        {activePanel === 'news' && <NewsPanel variant="sidebar" />}
        {activePanel === 'npcs' && <NpcPanel variant="sidebar" />}
        ...
      </SidePanel>
    )}
  </div>
  {/* Modale Overlays bleiben für Game-Events */}
  {state.activeConsequence && <ConsequenceModal />}
  {state.activeBetrayalEvent && <BetrayalEventModal />}
  {state.activeCrisis && <CrisisModal />}
  {state.currentDialog && <DialogBox />}
</div>
```

**Kritische Entscheidung:** Der OfficeScreen wird schmaler (flex-1 statt full-width), wenn ein Panel offen ist. Die CSS-Objekte im Office nutzen prozentuale Positionierung, also skalieren sie automatisch mit. Muss getestet werden.

**Aufwand:** ~3h
**Risiko:** Mittel-Hoch (Layout-Bruch wenn Office-Objekte bei schmaler Breite unbrauchbar werden)
**Mitigation:** Min-width für Office-Bereich setzen; bei < 800px wird Panel als Overlay statt Sidebar gerendert.
**Test:** Panel öffnen/schließen animiert sauber, Office skaliert, keine Überlappungen

### 1.4 OfficeScreen-Statusbar entfernen

Die OfficeScreen-interne Status-Bar (Zeile 551-597 in OfficeScreen.tsx) zeigt dieselben Daten wie der StoryHUD. Diese entfernen.

**Änderung:** OfficeScreen-Header-Bar entfernen, `h-full` anpassen.
**Aufwand:** ~30min
**Risiko:** Niedrig (reine Redundanz-Entfernung)

### 1.5 TV-Statistiken mit echtem State verbinden

Die WallTV-Komponente in OfficeScreen.tsx zeigt hardcodierte Balken (65%, 45%, 25%). Diese mit den tatsächlichen resources-Werten verbinden.

**Änderung:** OfficeScreen erhält bereits `resources` als Prop. WallTV nutzt diese statt hardcodierter Werte.

```typescript
// IST (hardcoded):
<div style={{ width: '65%', backgroundColor: danger }} />

// SOLL (dynamisch):
<div style={{
  width: `${Math.min(100, resources?.risk ?? 0)}%`,
  backgroundColor: danger
}} />
```

**Aufwand:** ~1h
**Risiko:** Niedrig
**Test:** TV-Balken ändern sich wenn Resources sich ändern

---

## Phase 2: Dashboard-View als Office-Alternative

### 2.1 DashboardView-Komponente

**Datei:** `src/story-mode/components/DashboardView.tsx` (NEU)

Eine kompakte, informationsdichte Alternative zur Office-Szene. Zeigt auf einen Blick, was der Spieler wissen muss, ohne Panels öffnen zu müssen.

```
Visuelles Konzept:
┌─────────────────────────────────────────────────┐
│  OPERATION WESTUNION - DASHBOARD      [🏢 Office]│
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  RESSOURCEN  │  AKTUELLE PHASE                  │
│  ┌────────┐  │  Jahr 3, März - Infiltration     │
│  │💰 $97K │  │                                  │
│  │⚡ 3/5  │  │  Primärziel: Trust < 40%         │
│  │⚠️ 23%  │  │  ████████░░░░ 67%               │
│  │👁️ 15%  │  │                                  │
│  │💀 12   │  │  Sekundärziel: 3 Medien          │
│  └────────┘  │  ██████░░░░░░ 50%                │
│              │                                  │
│  NPC-STATUS  ├──────────────────────────────────┤
│  ┌────────┐  │                                  │
│  │Direktor│  │  LETZTE AKTIONEN                 │
│  │ 🟢 72% │  │  ▸ Bot-Netzwerk aktiviert (-$3K) │
│  │Marina  │  │  ▸ Fake-Experte platziert (+12%) │
│  │ 🟡 45% │  │  ▸ Troll-Armee gestartet (+8% R) │
│  │Alexei  │  │                                  │
│  │ 🔴 23% │  │  OFFENE KONSEQUENZEN             │
│  │⚠ Verrat│  │  ▸ Phase 5: Entdeckungsrisiko    │
│  │Katja   │  │  ▸ Phase 7: NPC-Reaktion         │
│  │ 🟢 81% │  │                                  │
│  │Igor    │  │  COMBO-FORTSCHRITT               │
│  │ 🟢 65% │  │  ▸ "Medien-Blitz" 2/3 ████░░    │
│  └────────┘  │                                  │
│              │                                  │
│  EMPFEHLUNG  │  WELT-EVENTS                     │
│  ⭐ Marina   │  ▸ Wahlkampf in Westunion        │
│  empfiehlt:  │  ▸ Medien-Skandal                │
│  Aktion 3.2  │  ▸ Wirtschaftskrise              │
│  [→ Öffnen]  │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

**Architektur:**
- Liest direkt aus dem StoryGameState (resources, npcs, objectives, newsEvents, comboHints, recommendations, completedActions)
- Keine eigene Logik, nur Darstellung
- Klickbare Bereiche öffnen das entsprechende Panel im SidePanel (`panelStore.setActivePanel(...)`)
- NPC-Portraits zeigen Betrayal-Warnstufe als Farbring (grün/gelb/rot)

**Props:**
```typescript
interface DashboardViewProps {
  resources: StoryResources;
  phase: StoryPhase;
  objectives: Objective[];
  npcs: NPCState[];
  betrayalStates: Map<string, BetrayalState>;
  recommendations: AdvisorRecommendation[];
  newsEvents: NewsEvent[];
  comboHints: ComboHint[];
  completedActions: string[];
  lastActionResult: ActionResult | null;
  onOpenPanel: (panel: PanelId) => void;
}
```

**Aufwand:** ~6h
**Risiko:** Mittel (neues UI-Element, muss gestalterisch ins brutalist-Theme passen)
**Test:** Alle Daten werden korrekt angezeigt, Klick auf Bereiche öffnet das richtige Panel

### 2.2 View-Toggle (Office ↔ Dashboard)

**Ort:** StoryHUD oder als floating Button

```
Hotkey: [V] = View umschalten
Oder: Icon-Button im HUD: 🏢 (Office) / 📊 (Dashboard)
```

Der aktuelle View-Modus wird im panelStore gespeichert und bleibt über die Session erhalten.

**Aufwand:** ~1h
**Risiko:** Niedrig

---

## Phase 3: HUD-Erweiterung - Versteckte Systeme sichtbar machen

### 3.1 NPC-Betrayal-Indikatoren im HUD

**Änderung in StoryHUD.tsx:**

Zwischen der Ressourcen-Anzeige und den Buttons erscheinen 5 kleine NPC-Kreise:

```
[Year|Month|AP]  [💰|⚡|⚠️|👁️|💀]  [D🟢][M🟡][A🔴][K🟢][I🟢]  [MENU][END]
```

Jeder Kreis:
- Zeigt den ersten Buchstaben des NPC-Namens
- Hintergrundfarbe = Betrayal-Warnstufe (grün < 25%, gelb 25-60%, rot > 60%)
- Klick → öffnet NPC-Panel im SidePanel
- Tooltip (title-Attribut) → "Marina: Moral 45%, Verratsrisiko 12%"
- Pulsiert bei Warnstufe 3+ (animate-pulse)

**Neue Props für StoryHUD:**
```typescript
interface StoryHUDProps {
  // ... bestehende Props
  npcIndicators?: Array<{
    id: string;
    initial: string;    // "D", "M", "A", "K", "I"
    morale: number;     // 0-100
    betrayalRisk: number; // 0-100
    warningLevel: number; // 0-5
  }>;
  onNpcClick?: (npcId: string) => void;
}
```

**Aufwand:** ~2h
**Risiko:** Niedrig (additive HUD-Erweiterung)
**Test:** Indikatoren reflektieren echten Betrayal-State, Klick öffnet NPC-Panel

### 3.2 Consequences-Timeline-Widget

**Datei:** `src/story-mode/components/ConsequenceTimeline.tsx` (NEU)

Ein horizontaler Streifen am unteren Rand der Spielfläche (über ComboHints), der anstehende Konsequenzen als Timeline-Punkte visualisiert.

```
Visuelles Konzept:
Phase 1    2    3    4    5    6    7    8    9    10
  │    │    │    │    │    │    │    │    │    │
  ●────●────●────◉────○────○────◉────○────○────●
  ↑              ↑                   ↑
  jetzt     "Bot-Entdeckung"   "NPC-Reaktion"
            (15% Chance)       (Alexei verärgert)
```

**Datenquelle:** Die Daten existieren bereits:
- `ConsequenceSystem.checkPhase()` gibt anstehende Konsequenzen zurück
- `ActiveConsequence` hat `triggerPhase`, `probability`, `description`
- `CrisisMomentSystem` hat Krisen mit Deadline-Phasen

**Props:**
```typescript
interface ConsequenceTimelineProps {
  currentPhase: number;
  maxPhase: number;          // 120 (10 Jahre × 12 Monate)
  pendingConsequences: Array<{
    phase: number;
    label: string;
    probability: number;     // 0-1
    severity: 'low' | 'medium' | 'high';
    type: 'consequence' | 'crisis' | 'npc_reaction';
  }>;
  onClick?: (consequenceId: string) => void;
}
```

**Aufwand:** ~4h
**Risiko:** Mittel (braucht neue Daten-Extraktion aus ConsequenceSystem)
**Test:** Timeline zeigt korrekte Phasen, Hover zeigt Details, Punkte bewegen sich mit Phase-Fortschritt

### 3.3 Aktions-Impact-Preview

**Änderung in ActionPanel.tsx (Sidebar-Variante):**

Wenn der Spieler über eine Aktion hovert, erscheint ein kompakter Preview:

```
┌─────────────────────────────────────┐
│  Fake-Experte in Medien platzieren  │
│  ✓ LEGAL                           │
│                                     │
│  KOSTEN: 💰 $3K  ⚡ 1  💀 +2       │
│                                     │
│  VORAUSSICHTLICHE AUSWIRKUNGEN:     │
│  ▸ Trust-Schaden: -8% bei Medien    │
│  ▸ Combo "Experten-Netzwerk": 2/3   │
│  ▸ Marina: +10 Beziehung, -15% Cost │
│  ▸ Konsequenz (Phase +3): 15%       │
│    Chance auf Entlarvung            │
│                                     │
│  [▶ AUSFÜHREN]  [+ EINREIHEN]      │
└─────────────────────────────────────┘
```

**Datenquellen (alle vorhanden):**
- Kosten: `action.costs` (direkt)
- Trust-Schaden: `ExtendedActorLoader.calculateEffectivenessModifiers()`
- Combo-Progress: `StoryComboSystem.getActiveHints()`
- NPC-Rabatt: `StoryEngineAdapter` berechnet NPC-Affinität bereits
- Konsequenz-Vorschau: `ConsequenceSystem.getDefinition(action.id)` gibt Chance und Effekte zurück

**Aufwand:** ~4h
**Risiko:** Mittel (mehrere Subsysteme abfragen für eine Vorschau)
**Test:** Hover/Fokus zeigt korrekte Vorschau-Daten, Werte stimmen mit tatsächlicher Ausführung überein

---

## Phase 4: Hook-Extraktion (Architektur-Verbesserung)

### 4.1 Fokussierte Hooks extrahieren

Statt den monolithischen `useStoryGameState` zu zerschlagen (riskant), werden **zusätzliche, fokussierte Hooks** erstellt, die direkt auf Subsysteme zugreifen.

**Dateistruktur:** `src/story-mode/hooks/`

```
hooks/
├── useStoryGameState.ts       # Bestehend (unverändert)
├── usePanelStore.ts           # Phase 0 (Zustand-Store)
├── useBetrayalIndicators.ts   # NEU
├── useConsequenceTimeline.ts  # NEU
├── useActionPreview.ts        # NEU
├── useAdvisorSummary.ts       # NEU
└── useComboProgress.ts        # NEU
```

**Hook-Definitionen:**

```typescript
// useBetrayalIndicators.ts
// Liest Betrayal-State für alle NPCs, berechnet Warnstufe-Farben
// Input: engine (StoryEngineAdapter), npcs (NPCState[])
// Output: { indicators: NpcIndicator[], criticalCount: number }

// useConsequenceTimeline.ts
// Sammelt anstehende Konsequenzen aus ConsequenceSystem + CrisisMomentSystem
// Input: engine, currentPhase
// Output: { events: TimelineEvent[], nextCritical: TimelineEvent | null }

// useActionPreview.ts
// Berechnet Vorschau-Daten für eine einzelne Aktion
// Input: engine, actionId, npcStates
// Output: { costs, trustImpact, comboProgress, npcDiscounts, consequenceRisk }

// useAdvisorSummary.ts
// Kompakte Zusammenfassung der Top-Empfehlung pro NPC
// Input: engine, recommendations
// Output: { topRecommendation, npcSummaries }

// useComboProgress.ts
// Aufbereiteter Combo-Fortschritt
// Input: engine
// Output: { activeProgress: ComboProgress[], nearCompletion: string[] }
```

**Aufwand:** ~6h (alle 5 Hooks)
**Risiko:** Niedrig (additive Hooks, bestehender Hook bleibt unverändert)
**Test:** Jeder Hook hat Unit-Tests, Rückgabewerte sind korrekt

### 4.2 panelStore in StoryModeGame.tsx integrieren

Die 16 useState-Hooks werden **schrittweise** durch panelStore-Aufrufe ersetzt:

```typescript
// IST:
const [showActionPanel, setShowActionPanel] = useState(false);
const [showNewsPanel, setShowNewsPanel] = useState(false);
// ... 6 weitere

// SOLL:
const { activePanel, setActivePanel, viewMode } = usePanelStore();
// showActionPanel wird zu: activePanel === 'actions'
// setShowActionPanel(true) wird zu: setActivePanel('actions')
```

Die Modal-spezifischen States bleiben als useState (ConsequenceModal, BetrayalEvent, Crisis etc.), da diese vom Spiel getriggert werden und keine Panel-Logik sind.

**Aufwand:** ~2h
**Risiko:** Mittel (Refactoring bestehender Logik)
**Test:** Alle Panel-Toggle-Logik funktioniert wie vorher, kein Regression

---

## Phase 5: Sprachkonsistenz

### 5.1 Audit aller UI-Strings

Alle englischen Strings in Story-Mode-Komponenten identifizieren und auf Deutsch umstellen.

**Bekannte englische Strings:**
- StoryHUD: "YEAR", "MONTH", "AP", "Current Objective", "END PHASE →"
- ActionPanel: "AVAILABLE ACTIONS", "ALREADY USED", "LOCKED", "Search actions...", "No actions available", "Click an action to execute"
- DialogBox: "Click to continue..."
- ActionCard: "ID: {id}"
- Diverse Filter-Labels

**Aufwand:** ~2h (Audit) + ~2h (Umstellung)
**Risiko:** Niedrig
**Test:** Grep nach englischen Wörtern in Story-Mode-Komponenten, visueller Check

---

## Phasenplan & Abhängigkeiten

```
Phase 0: UI-State-Foundation
  0.1 panelStore erstellen          [~2h]  ──┐
  0.2 Keyboard-Shortcuts umleiten   [~1h]  ──┤
                                              │
Phase 1: Sidebar-Panel-System                 │
  1.1 SidePanel-Container           [~3h]  ◄─┘
  1.2 Panel-Sidebar-Varianten       [~14h] ◄── 1.1
  1.3 Layout-Integration            [~3h]  ◄── 1.1 + 1.2
  1.4 OfficeScreen-Statusbar        [~0.5h] (unabhängig)
  1.5 TV-Stats verbinden            [~1h]   (unabhängig)

Phase 2: Dashboard-View
  2.1 DashboardView-Komponente      [~6h]  ◄── Phase 1
  2.2 View-Toggle                   [~1h]  ◄── 2.1

Phase 3: HUD + Tiefe sichtbar machen
  3.1 NPC-Betrayal im HUD           [~2h]  (unabhängig)
  3.2 Consequences-Timeline          [~4h]  ◄── Phase 4.1 (Hook)
  3.3 Aktions-Impact-Preview         [~4h]  ◄── Phase 4.1 (Hook)

Phase 4: Hook-Extraktion
  4.1 Fokussierte Hooks (5×)        [~6h]  (unabhängig)
  4.2 panelStore-Integration        [~2h]  ◄── Phase 0.1

Phase 5: Sprachkonsistenz
  5.1 String-Audit + Umstellung     [~4h]  (unabhängig)
```

### Empfohlene Umsetzungsreihenfolge

```
Woche 1: Foundation + Quick Wins
  ├── Phase 0 (0.1 + 0.2)           3h
  ├── Phase 1.4 (Statusbar weg)     0.5h
  ├── Phase 1.5 (TV-Stats live)     1h
  └── Phase 3.1 (NPC-HUD)           2h
  Summe: ~6.5h

Woche 2: Sidebar-System
  ├── Phase 1.1 (SidePanel)         3h
  ├── Phase 1.2 (Varianten)         14h
  └── Phase 1.3 (Layout)            3h
  Summe: ~20h

Woche 3: Dashboard + Hooks
  ├── Phase 4.1 (Hooks)             6h
  ├── Phase 2.1 (Dashboard)         6h
  └── Phase 2.2 (Toggle)            1h
  Summe: ~13h

Woche 4: Tiefe + Polish
  ├── Phase 3.2 (Timeline)          4h
  ├── Phase 3.3 (Impact-Preview)    4h
  ├── Phase 4.2 (Store-Migration)   2h
  └── Phase 5.1 (Sprache)           4h
  Summe: ~14h
```

**Gesamtaufwand: ~53.5h** über 4 Wochen

---

## Risikomatrix

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Office-Szene bricht bei schmaler Breite | Hoch | Mittel | Min-width 600px, unter 600px → Panel als Overlay |
| ActionPanel zu komplex für Sidebar | Mittel | Hoch | 1-Spalten-Layout, kompaktere ActionCards, "Erweitern"-Button für Details |
| Performance bei vielen gleichzeitigen Widgets | Niedrig | Mittel | React.memo auf Panel-Inhalte, Virtualisierung bei langen Listen |
| Savegame-Kompatibilität | Niedrig | Hoch | panelStore-State wird NICHT im Savegame gespeichert (nur UI-Präferenz) |
| Typewriter-Effekt blockiert Sidebar | Mittel | Niedrig | DialogBox bleibt als Modal-Overlay (z-50), überlagert alles |

---

## Abgrenzung: Was dieser Plan NICHT macht

1. **StoryEngineAdapter aufteilen** - Zu riskant ohne 50%+ Test-Coverage. Die neuen Hooks greifen auf Subsystem-Singletons direkt zu, umgehen den Adapter teilweise.
2. **Pro Mode ändern** - Fokus ist Story Mode.
3. **Responsive/Mobile Design** - Nicht im Scope. Desktop-first.
4. **NPC-Portraits durch Sprites ersetzen** - Visuelles Polish, nicht UX-relevant.
5. **Neue Spielmechaniken** - Nur bestehende Mechaniken sichtbar machen.
6. **Tailwind-Migration** - Zu viel Risiko für Styling-Regression. Kann nach Phase 5 separat erfolgen.
7. **Test-Coverage erhöhen** - Separate Initiative. Aber neue Hooks werden mit Tests geschrieben.

---

## Validierungskriterien pro Phase

| Phase | Fertig wenn... |
|-------|---------------|
| 0 | panelStore-Test grün, Tastenkürzel togglen Panels im Store |
| 1 | Spieler kann ActionPanel + Office gleichzeitig sehen, alle 6 Panels als Sidebar nutzbar |
| 2 | Dashboard zeigt alle Kernmetriken, Toggle Office↔Dashboard funktioniert |
| 3 | NPC-Betrayal-Dots im HUD, Timeline zeigt 2+ Konsequenzen, Action-Preview zeigt Impact |
| 4 | 5 neue Hooks mit Tests, panelStore ersetzt useState-Hooks in StoryModeGame |
| 5 | `grep -ri "AVAILABLE\|ALREADY USED\|Click to continue\|LOCKED\|Search" src/story-mode/` liefert 0 Treffer |
