# UI/UX Redesign Plan: Desinformation Network Game

> **Ziel**: Professionelles Spielerlebnis mit korrekter Layer-Hierarchie, visueller Kohärenz und Experten-Level UI/UX.
> **Ausführung**: Claude Code Sonnet 4.5
> **Methode**: Task-Dekomposition mit klaren Akzeptanzkriterien

---

## Analyse der Kernprobleme

### Problem 1: Layer-Überlagerung (rechte Seite)
- `VictoryProgressBar` in Top-Right HUD (`fixed top-6 right-6 z-40`)
- `CompactSidePanel` rechts (`fixed top-0 right-0 w-[300px] z-30`)
- Beide konkurrieren um denselben Bereich
- **Dateien**: `App.tsx:428-464`, `CompactSidePanel.tsx`

### Problem 2: Canvas-Entkopplung von Kategoriekreisen
- Kategoriekreise sind nur dekorativ (nicht als Constraint)
- Force-directed Layout positioniert Akteure FREI im Raum
- Akteure driften visuell aus ihren Kategorien heraus
- **Dateien**: `NetworkVisualization.tsx:108-111`, `GameState.ts`

### Problem 3: Mehrfache Notification-Systeme
- `EventNotification` (Legacy): `App.tsx:592-596`
- `NotificationToast`: `App.tsx:521-525`
- `UnifiedRoundModal`: `App.tsx:542-573`
- Alle auf z-50 = visuelle Kollisionen
- **Dateien**: `EventNotification.tsx`, `NotificationToast.tsx`, `UnifiedRoundModal.tsx`

---

## Task-Dekomposition

### TASK 1: Z-Index-System neu definieren
<task id="1" priority="critical" effort="low">

**Ziel**: Einheitliches, skalierbares Z-Index-System

**Schritte**:
1. Erstelle CSS-Variablen in `index.css`:
   ```css
   :root {
     --z-canvas: 0;
     --z-overlay: 10;
     --z-panel: 20;
     --z-hud: 30;
     --z-notification: 40;
     --z-modal: 50;
     --z-tooltip: 60;
   }
   ```
2. Ersetze alle hardcoded z-index Werte in:
   - `App.tsx`
   - `CompactSidePanel.tsx`
   - `NetworkVisualization.tsx`
   - `NotificationToast.tsx`
   - `EventNotification.tsx`

**Akzeptanzkriterien**:
- [ ] Keine hardcoded z-index Werte mehr in TSX-Dateien
- [ ] Alle Komponenten nutzen CSS-Variablen
- [ ] Dokumentation der Layer-Hierarchie in Kommentar

</task>

---

### TASK 2: Unified Right Panel Layout
<task id="2" priority="critical" effort="medium">

**Ziel**: Integriertes Panel-System ohne Überlappung

**Aktuelle Struktur** (problematisch):
```
Top-Right HUD (z-40):     CompactSidePanel (z-30):
├─ VictoryProgressBar     ├─ Actor Header
├─ Network Stats          ├─ Stats Grid
└─ End Round Button       ├─ Abilities
                          └─ Resources Footer
```

**Neue Struktur**:
```
UnifiedRightPanel (fixed right-0, w-[320px], z-20):
├─ HEADER SECTION (sticky top-0)
│   ├─ Round Counter (compact)
│   ├─ Victory Progress (inline bar)
│   └─ Resources Row (💰 👁️ 🔧)
├─ ACTION SECTION
│   └─ [End Round] Button (prominent, full-width)
├─ DIVIDER
└─ ACTOR SECTION (scrollable, flex-1)
    ├─ Actor Header (wenn ausgewählt)
    ├─ Stats Grid
    ├─ Vulnerabilities/Resistances
    └─ Abilities List
```

**Schritte**:
1. Erstelle neue Komponente `UnifiedRightPanel.tsx`
2. Integriere `VictoryProgressBar` als Inline-Element
3. Verschiebe Resources aus Top-Left HUD
4. Behalte `End Round` Button prominent
5. Integriere `CompactSidePanel`-Inhalte als scrollbaren Bereich
6. Entferne redundante HUD-Elemente aus `App.tsx`
7. Passe Canvas-Bereich an: `right-[320px]`

**Akzeptanzkriterien**:
- [ ] Nur EIN Panel auf der rechten Seite
- [ ] Kein visuelles Überlappen von Elementen
- [ ] Victory Progress immer sichtbar
- [ ] Actor Details erscheinen im selben Panel
- [ ] Responsives Verhalten bei Resize

</task>

---

### TASK 3: Kategoriekreis-Bindung (Constrained Layout)
<task id="3" priority="critical" effort="high">

**Ziel**: Akteure bleiben visuell INNERHALB ihrer Kategoriekreise

**Problem-Code** (`NetworkVisualization.tsx:108-111`):
```typescript
const getActorPosition = useCallback((actor: Actor) => {
  return actor.position; // ← Keine Constraint-Prüfung!
}, []);
```

**Lösung-Ansatz**: Constraint-basiertes Force-Directed Layout

**Schritte**:
1. In `GameState.ts` oder neuem Modul `ConstrainedLayout.ts`:
   ```typescript
   interface LayoutConstraint {
     categoryCenter: { x: number; y: number };
     maxRadius: number;
   }

   function constrainToCategory(
     position: { x: number; y: number },
     constraint: LayoutConstraint
   ): { x: number; y: number } {
     const dx = position.x - constraint.categoryCenter.x;
     const dy = position.y - constraint.categoryCenter.y;
     const distance = Math.sqrt(dx * dx + dy * dy);

     if (distance > constraint.maxRadius) {
       // Projiziere zurück auf Kreisrand mit 10% Padding
       const scale = (constraint.maxRadius * 0.9) / distance;
       return {
         x: constraint.categoryCenter.x + dx * scale,
         y: constraint.categoryCenter.y + dy * scale,
       };
     }
     return position;
   }
   ```

2. Modifiziere Force-Layout-Berechnung:
   - Nach jeder Iterations-Berechnung: `constrainToCategory()` aufrufen
   - Kategorie-Zentren relativ zu Canvas-Größe berechnen
   - CATEGORY_RADIUS als max constraint radius

3. In `NetworkVisualization.tsx`:
   - Kategoriekreise visuell verstärken (mehr Kontrast)
   - Inner Shadow für "Container"-Gefühl
   - Akteure die am Rand sind: leichte Opacity-Reduktion

**Akzeptanzkriterien**:
- [ ] Alle Akteure sind visuell innerhalb ihrer Kategoriekreise
- [ ] Force-Layout respektiert Kreisränder
- [ ] Keine Akteure "schweben" im leeren Raum
- [ ] Defensive Actors bleiben im Zentrum
- [ ] Bei Zoom/Pan bleibt Zuordnung korrekt

</task>

---

### TASK 4: Notification-System Konsolidierung
<task id="4" priority="high" effort="medium">

**Ziel**: EIN einheitliches Notification-System

**Aktuelle Systeme (zu entfernen/konsolidieren)**:
1. `EventNotification.tsx` → **ENTFERNEN** (Legacy)
2. `NotificationToast.tsx` → **BEHALTEN** (primäres System)
3. `UnifiedRoundModal.tsx` → **BEHALTEN** (nur für Blocking-Events)

**Neue Hierarchie**:
| Typ | Komponente | Position | Blocking? |
|-----|------------|----------|-----------|
| Toast | NotificationToast | bottom-left | Nein |
| Modal | UnifiedRoundModal | center | Ja |

**Schritte**:
1. Entferne `EventNotification` komplett aus `App.tsx`
2. Entferne `EventNotification.tsx` Datei
3. Ändere Toast-Position von `bottom-right` zu `bottom-left`:
   ```typescript
   // NotificationToast.tsx
   className="fixed bottom-6 left-6 z-[var(--z-notification)]"
   ```
4. Reduziere max sichtbare Toasts von 3 auf 2
5. Reduziere auto-dismiss von 5000ms auf 3500ms
6. Füge Regel hinzu: Keine Toasts wenn Modal offen

**Akzeptanzkriterien**:
- [ ] `EventNotification.tsx` existiert nicht mehr
- [ ] Toasts erscheinen unten-links (nicht rechts)
- [ ] Max 2 Toasts gleichzeitig
- [ ] Keine Toast + Modal Kollision
- [ ] Actor-Reactions nutzen Toast-System

</task>

---

### TASK 5: Visual Hierarchy & Polish
<task id="5" priority="medium" effort="medium">

**Ziel**: Professionelle visuelle Hierarchie nach Game UI Best Practices

**Referenz**: [Game-Ace UX Guide](https://game-ace.com/blog/the-complete-game-ux-guide/), [UX Planet Best Practices](https://uxplanet.org/game-design-ux-best-practices-guide-4a3078c32099)

**Design-Prinzipien**:
1. **Kontrast**: Wichtige Elemente hervorheben
2. **Konsistenz**: Gleiche Patterns überall
3. **Hierarchie**: Primär > Sekundär > Tertiär

**Schritte**:
1. Definiere Farbsystem in `index.css`:
   ```css
   :root {
     /* Surfaces */
     --surface-base: hsl(220, 20%, 10%);
     --surface-elevated: hsl(220, 20%, 14%);
     --surface-overlay: hsl(220, 20%, 18%);

     /* Borders */
     --border-subtle: hsla(220, 20%, 50%, 0.15);
     --border-default: hsla(220, 20%, 50%, 0.25);

     /* Trust Colors (konsistent) */
     --trust-high: hsl(142, 71%, 45%);
     --trust-medium: hsl(45, 93%, 47%);
     --trust-low: hsl(0, 84%, 60%);

     /* Accent */
     --accent-primary: hsl(217, 91%, 60%);
     --accent-success: hsl(142, 71%, 45%);
     --accent-warning: hsl(38, 92%, 50%);
     --accent-danger: hsl(0, 84%, 60%);
   }
   ```

2. Standardisiere Abstände (8px Grid):
   - `space-1`: 4px
   - `space-2`: 8px
   - `space-3`: 12px
   - `space-4`: 16px
   - `space-6`: 24px

3. Standardisiere Border-Radius:
   - Buttons: `rounded-md` (6px)
   - Cards: `rounded-lg` (8px)
   - Panels: `rounded-xl` (12px)
   - Modals: `rounded-2xl` (16px)

4. Hover/Active States:
   ```css
   .interactive {
     transition: all 150ms ease;
   }
   .interactive:hover {
     transform: translateY(-1px);
     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
   }
   .interactive:active {
     transform: scale(0.98);
   }
   ```

**Akzeptanzkriterien**:
- [ ] Alle Farben nutzen CSS-Variablen
- [ ] Konsistente Abstände (8px Grid)
- [ ] Konsistente Border-Radius
- [ ] Smooth Hover-Transitions (150ms)
- [ ] Trust-Farben sind überall identisch

</task>

---

### TASK 6: Canvas Layer Separation
<task id="6" priority="medium" effort="low">

**Ziel**: Bessere Performance durch Layer-Trennung

**Referenz**: [MDN Canvas Optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

**Aktuelle Situation**:
- Ein Canvas rendert ALLES (Background, Connections, Actors, Effects)
- Jeder Frame zeichnet alles neu

**Verbesserung** (optional, für Performance):
```
Layer 1 (static): Category circles, grid
Layer 2 (semi-static): Connections (nur bei Änderung neu)
Layer 3 (dynamic): Actors, effects, selection
```

**Schritte**:
1. Prüfe ob Performance-Problem besteht (> 60fps?)
2. Falls ja: Implementiere Multi-Canvas-Ansatz
3. Falls nein: Dokumentiere als zukünftige Optimierung

**Akzeptanzkriterien**:
- [ ] Performance-Messung dokumentiert
- [ ] Bei Bedarf: Layer-Trennung implementiert
- [ ] 60fps auf Standard-Hardware

</task>

---

## Ausführungsreihenfolge

```
TASK 1 (Z-Index)          ← Foundation, zuerst
    ↓
TASK 2 (Unified Panel)    ← Löst Hauptproblem #1
    ↓
TASK 4 (Notifications)    ← Löst Hauptproblem #3
    ↓
TASK 3 (Kategoriekreise)  ← Löst Hauptproblem #2 (komplex)
    ↓
TASK 5 (Visual Polish)    ← Verfeinerung
    ↓
TASK 6 (Canvas Layers)    ← Optional/Performance
```

---

## Validierung nach Abschluss

### Checkliste für Experten-Freigabe

**Layout & Struktur**:
- [ ] Keine überlappenden UI-Elemente
- [ ] Klare visuelle Hierarchie
- [ ] Konsistente Abstände und Größen
- [ ] Responsives Verhalten

**Canvas & Visualisierung**:
- [ ] Akteure sind in ihren Kategoriekreisen
- [ ] Verbindungen sind lesbar
- [ ] Zoom/Pan funktioniert korrekt
- [ ] Selection-States sind klar erkennbar

**Interaktion**:
- [ ] Alle Buttons haben Hover/Active-States
- [ ] Feedback bei Aktionen (Toasts)
- [ ] Keine blockierenden Overlays (außer Modals)
- [ ] Touch-Targets mindestens 44x44px

**Konsistenz**:
- [ ] Einheitliches Farbsystem
- [ ] Einheitliche Typografie
- [ ] Einheitliche Icons/Symbole
- [ ] Einheitliche Animations-Timings

---

## Referenzen

### Game UI/UX Best Practices
- [Game-Ace: Complete Game UX Guide 2025](https://game-ace.com/blog/the-complete-game-ux-guide/)
- [UX Planet: Game Design UX Best Practices](https://uxplanet.org/game-design-ux-best-practices-guide-4a3078c32099)
- [Justinmind: Game UI Design Principles](https://www.justinmind.com/ui-design/game)
- [DEV.to: Game UI/UX Dos and Don'ts](https://dev.to/okoye_ndidiamaka_5e3b7d30/game-uiux-design-dos-and-donts-of-creating-engaging-and-natural-interfaces-2198)

### Canvas & Performance
- [MDN: Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [Smashing Magazine: Managing CSS Z-Index](https://www.smashingmagazine.com/2021/02/css-z-index-large-projects/)

### Claude Code Best Practices
- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Apidog: CLAUDE.md Best Practices](https://apidog.com/blog/claude-md/)
- [Claude Blog: Using CLAUDE.md Files](https://claude.com/blog/using-claude-md-files)
