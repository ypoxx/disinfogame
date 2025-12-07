# Roadmap & Verbesserungsvorschläge

> **Erstellt:** 2025-12-07
> **Letzte Aktualisierung:** 2025-12-07
> **Status:** Aktiv

Dieses Dokument enthält alle geplanten Verbesserungen, Feature-Ideen und Forschungsergebnisse für die Weiterentwicklung des Spiels.

---

## Inhaltsverzeichnis

1. [Kritische Fixes (Blocker)](#1-kritische-fixes-blocker)
2. [UX/UI Verbesserungen](#2-uxui-verbesserungen)
3. [Gameplay & Balance](#3-gameplay--balance)
4. [Architektur-Verbesserungen](#4-architektur-verbesserungen)
5. [Neue Features](#5-neue-features)
6. [Forschung: Aktuelle Desinformationskampagnen](#6-forschung-aktuelle-desinformationskampagnen)
7. [Neue Szenarien & Kampagnen](#7-neue-szenarien--kampagnen)
8. [Post-Game Analyse & Lernmodul](#8-post-game-analyse--lernmodul)
9. [Defender-Modus](#9-defender-modus)
10. [Implementierungsdetails](#10-implementierungsdetails)

---

## 1. Kritische Fixes (Blocker)

Diese Probleme verhindern oder beeinträchtigen die Nutzung des Spiels erheblich.

### 1.1 Touch-Support für Canvas [KRITISCH]

**Problem:** Das Spiel ist für Tablets konzipiert, aber der Canvas reagiert nicht auf Touch-Events.

**Betroffene Datei:** `src/components/NetworkVisualization.tsx`

**Aktueller Zustand:**
```typescript
// Nur Mouse-Events implementiert
onClick={handleClick}
onMouseMove={handleMouseMove}
onMouseLeave={() => { ... }}
```

**Lösung:**
```typescript
// Touch-Events hinzufügen
const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
  e.preventDefault();
  const touch = e.touches[0];
  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const actor = findActorAtPosition(x, y);
  if (actor) {
    onActorClick(actor.id);
  }
}, [findActorAtPosition, onActorClick]);

const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
  const touch = e.touches[0];
  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const actor = findActorAtPosition(x, y);
  onActorHover(actor?.id || null);

  if (actor) {
    setHoveredActor(actor);
    setTooltipPosition({ x: touch.clientX, y: touch.clientY });
  } else {
    setHoveredActor(null);
    setTooltipPosition(null);
  }
}, [findActorAtPosition, onActorHover]);

// Im JSX:
<canvas
  ref={canvasRef}
  className="absolute inset-0 cursor-pointer touch-none"
  onClick={handleClick}
  onMouseMove={handleMouseMove}
  onMouseLeave={() => { ... }}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={() => {
    onActorHover(null);
    setHoveredActor(null);
    setTooltipPosition(null);
  }}
/>
```

**Priorität:** 🔴 KRITISCH
**Aufwand:** Klein (1-2 Stunden)
**Status:** [x] Erledigt (2025-12-07)

---

### 1.2 Tutorial-Persistenz [KRITISCH]

**Problem:** Tutorial startet bei jedem Seitenreload erneut, obwohl der Nutzer es bereits übersprungen hat.

**Betroffene Datei:** `src/App.tsx`

**Aktueller Zustand:**
```typescript
const [tutorialState, setTutorialState] = useState<TutorialState>(createInitialTutorialState());
// Kein Speichern des Skip-Status
```

**Lösung:**
```typescript
// Tutorial-Status aus localStorage laden
const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
  const saved = localStorage.getItem('tutorial-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.skipped || parsed.completed) {
        return { ...createInitialTutorialState(), skipped: parsed.skipped, completed: parsed.completed };
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return createInitialTutorialState();
});

// Beim Skippen/Beenden speichern
const handleTutorialSkip = () => {
  const newState = { ...tutorialState, active: false, skipped: true, completed: false };
  setTutorialState(newState);
  setShowTutorial(false);
  localStorage.setItem('tutorial-state', JSON.stringify({ skipped: true, completed: false }));
};

const handleTutorialNext = () => {
  setTutorialState(prev => {
    const nextStep = prev.currentStep + 1;
    if (nextStep >= prev.steps.length) {
      const newState = { ...prev, active: false, completed: true };
      localStorage.setItem('tutorial-state', JSON.stringify({ skipped: false, completed: true }));
      return newState;
    }
    return {
      ...prev,
      currentStep: nextStep,
      steps: prev.steps.map((step, i) =>
        i === prev.currentStep ? { ...step, completed: true } : step
      )
    };
  });
};
```

**Priorität:** 🔴 KRITISCH
**Aufwand:** Klein (30 Minuten)
**Status:** [x] Erledigt (2025-12-07)

---

### 1.3 Button-Komponente konsistent nutzen [WICHTIG]

**Problem:** Verschiedene Button-Styles im Code, obwohl eine wiederverwendbare Komponente existiert.

**Betroffene Dateien:** `src/App.tsx`, diverse Komponenten

**Aktueller Zustand:**
```typescript
// Inkonsistente Inline-Styles:
<button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl...">
<button className="px-6 py-3 bg-gray-700 hover:bg-gray-600...">
<button className="px-4 py-3 bg-green-600 hover:bg-green-700...">
```

**Lösung:** Existierende `Button`-Komponente aus `src/components/ui/Button.tsx` nutzen:
```typescript
import { Button } from '@/components/ui/Button';

// Start Screen
<Button variant="primary" size="lg" onClick={startGame}>
  Start Game
</Button>

// Victory/Defeat Screens
<Button variant="secondary" size="md" onClick={resetGame}>
  Play Again
</Button>

// End Round
<Button variant="success" size="md" onClick={advanceRound}>
  End Round →
</Button>
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Klein (1 Stunde)
**Status:** [x] Erledigt (2025-12-07)

---

## 2. UX/UI Verbesserungen

### 2.1 Undo-Button implementieren

**Problem:** GameState hat history-Array, aber kein UI zum Rückgängigmachen.

**Lösung:**
```typescript
// In App.tsx HUD hinzufügen:
<button
  onClick={undoAction}
  disabled={!canUndo}
  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50..."
>
  ↩ Undo
</button>

// Im useGameState Hook:
const canUndo = gameState.history.length > 0;
const undoAction = useCallback(() => {
  if (canUndo) {
    gameManager.current.undo();
    syncState();
  }
}, [canUndo, syncState]);
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Mittel (2-3 Stunden)
**Status:** [x] Erledigt (2025-12-07)

---

### 2.2 Pause-Funktion

**Problem:** `phase: 'paused'` existiert im GameState, aber kein UI.

**Lösung:**
```typescript
// Pause-Button im HUD
<button onClick={togglePause}>
  {gameState.phase === 'paused' ? '▶ Resume' : '⏸ Pause'}
</button>

// Pause-Overlay
{gameState.phase === 'paused' && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-8 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Paused</h2>
      <div className="flex gap-4">
        <Button onClick={togglePause}>Resume</Button>
        <Button variant="secondary" onClick={resetGame}>Quit to Menu</Button>
      </div>
    </div>
  </div>
)}
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Klein (1 Stunde)
**Status:** [x] Erledigt (2025-12-07)

---

### 2.3 Tastatursteuerung

**Problem:** Keine Keyboard-Shortcuts für Accessibility.

**Lösung:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        if (uiState.targetingMode) cancelAbility();
        else if (uiState.selectedActor) selectActor(null);
        break;
      case 'Enter':
        if (!uiState.targetingMode) advanceRound();
        break;
      case ' ':
        e.preventDefault();
        togglePause();
        break;
      case 'z':
        if (e.ctrlKey || e.metaKey) undoAction();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [uiState, cancelAbility, selectActor, advanceRound, togglePause, undoAction]);
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Mittel (2 Stunden)
**Status:** [x] Erledigt (2025-12-07)

---

### 2.4 Trust-Change Animationen (Floating Numbers)

**Problem:** Trust-Änderungen sind nicht visuell sichtbar.

**Lösung:** Floating Numbers bei Trust-Änderungen:
```typescript
// Neuer State für Animationen
const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

type FloatingNumber = {
  id: string;
  actorId: string;
  value: number;
  x: number;
  y: number;
  createdAt: number;
};

// Bei Trust-Änderung hinzufügen
function addFloatingNumber(actorId: string, delta: number) {
  const actor = getActor(actorId);
  const pos = getActorPosition(actor);
  setFloatingNumbers(prev => [...prev, {
    id: crypto.randomUUID(),
    actorId,
    value: delta,
    x: pos.x,
    y: pos.y - 20,
    createdAt: Date.now()
  }]);
}

// Im Canvas zeichnen mit Animation
floatingNumbers.forEach(fn => {
  const age = Date.now() - fn.createdAt;
  if (age > 2000) return; // 2 Sekunden anzeigen

  const opacity = 1 - (age / 2000);
  const yOffset = age * 0.02; // Nach oben schweben

  ctx.globalAlpha = opacity;
  ctx.fillStyle = fn.value < 0 ? '#EF4444' : '#22C55E';
  ctx.font = 'bold 16px Inter';
  ctx.fillText(
    `${fn.value > 0 ? '+' : ''}${Math.round(fn.value * 100)}%`,
    fn.x,
    fn.y - yOffset
  );
  ctx.globalAlpha = 1;
});
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Mittel (3-4 Stunden)
**Status:** [x] Erledigt (2025-12-07)

---

### 2.5 Animation-Loop Optimierung

**Problem:** `requestAnimationFrame` läuft ständig, auch wenn keine Animation nötig.

**Lösung:**
```typescript
// Nur bei Bedarf animieren
const [needsAnimation, setNeedsAnimation] = useState(false);

useEffect(() => {
  if (targetingMode || floatingNumbers.length > 0) {
    setNeedsAnimation(true);
  } else {
    setNeedsAnimation(false);
    draw(); // Einmaliges Zeichnen
  }
}, [targetingMode, floatingNumbers.length]);

useEffect(() => {
  if (needsAnimation) {
    animationFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }
}, [needsAnimation, draw]);
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Klein (1 Stunde)
**Status:** [ ] Offen

---

### 2.6 Zoom & Pan für Netzwerk

**Problem:** Bei großen Netzwerken keine Navigation möglich.

**Lösung:**
```typescript
const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

// Wheel-Event für Zoom
const handleWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  setTransform(prev => ({
    ...prev,
    scale: Math.max(0.5, Math.min(3, prev.scale * delta))
  }));
}, []);

// Drag für Pan
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

const handleMouseDown = (e: React.MouseEvent) => {
  if (e.button === 1 || e.altKey) { // Middle click or Alt+Click
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }
};

// Im draw():
ctx.save();
ctx.translate(transform.x, transform.y);
ctx.scale(transform.scale, transform.scale);
// ... zeichnen ...
ctx.restore();
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Groß (4-6 Stunden)
**Status:** [x] Erledigt (2025-12-07) - Inkl. Pinch-to-Zoom für Touch

---

### 2.7 Bottom Sheet Swipe-Geste

**Problem:** Nur Button zum Expandieren, keine Touch-Geste.

**Lösung:**
```typescript
const [dragStartY, setDragStartY] = useState<number | null>(null);

const handleTouchStart = (e: React.TouchEvent) => {
  setDragStartY(e.touches[0].clientY);
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (dragStartY === null) return;
  const deltaY = dragStartY - e.touches[0].clientY;

  if (deltaY > 50 && !isExpanded) {
    setIsExpanded(true);
  } else if (deltaY < -50 && isExpanded) {
    setIsExpanded(false);
  }
};

const handleTouchEnd = () => {
  setDragStartY(null);
};
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Klein (1-2 Stunden)
**Status:** [ ] Offen

---

## 3. Gameplay & Balance

### 3.1 Eskalationssystem

**Problem:** Defensive spawnen nur passiv alle 8 Runden.

**Lösung:** Dynamisches Eskalationssystem basierend auf Spieleraktionen:

```typescript
type EscalationState = {
  level: number;           // 0-5
  publicAwareness: number; // 0-1
  mediaAttention: number;  // 0-1
  counterMeasures: number; // Anzahl aktivierte Gegenmaßnahmen
};

function updateEscalation(
  state: GameState,
  action: AbilityAction
): EscalationState {
  let awareness = state.escalation.publicAwareness;
  let attention = state.escalation.mediaAttention;

  // Aggressive Aktionen erhöhen Aufmerksamkeit
  if (action.ability.effects.trustDelta < -0.2) {
    awareness += 0.05;
  }

  // Propagierende Effekte sind auffälliger
  if (action.ability.effects.propagates) {
    attention += 0.03;
  }

  // Eskalationslevel bestimmt Spawning
  const newLevel = Math.floor((awareness + attention) * 2.5);

  return {
    level: Math.min(5, newLevel),
    publicAwareness: Math.min(1, awareness),
    mediaAttention: Math.min(1, attention),
    counterMeasures: state.escalation.counterMeasures
  };
}

// Spawn-Chance basierend auf Eskalation
function getDefensiveSpawnChance(escalation: EscalationState): number {
  const baseChance = 0.1; // 10% Basis
  return baseChance + (escalation.level * 0.15); // +15% pro Level
}
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Groß (6-8 Stunden)
**Status:** [ ] Offen

---

### 3.2 Mehrstufige Win-Conditions

**Problem:** Nur binärer Sieg/Niederlage.

**Lösung:**
```typescript
type VictoryType =
  | 'complete_victory'    // 100% unter 40%
  | 'strategic_victory'   // 75% unter 40%, <24 Runden
  | 'tactical_victory'    // 75% unter 40%, normal
  | 'pyrrhic_victory'     // 75% unter 40%, aber hohe Eskalation
  | 'partial_success'     // 50-74% unter 40%
  | 'stalemate'           // Timeout ohne klaren Sieger
  | 'defeat';             // Defensive Victory

function evaluateVictory(state: GameState): VictoryType {
  const lowTrustPercent = state.network.actors.filter(a => a.trust < 0.4).length
    / state.network.actors.length;

  if (lowTrustPercent >= 1.0) return 'complete_victory';
  if (lowTrustPercent >= 0.75) {
    if (state.escalation.level >= 4) return 'pyrrhic_victory';
    if (state.round <= 24) return 'strategic_victory';
    return 'tactical_victory';
  }
  if (lowTrustPercent >= 0.5) return 'partial_success';
  if (state.round >= state.maxRounds) return 'stalemate';

  return 'defeat';
}
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Mittel (3-4 Stunden)
**Status:** [ ] Offen

---

### 3.3 Counter-Abilities für Defensive

**Problem:** Defensive Akteure sind passiv.

**Lösung:** Aktive Fähigkeiten für Defensive Akteure:

```json
{
  "id": "fact_check_viral",
  "name": "Viral Fact-Check",
  "description": "Veröffentlicht einen viralen Fact-Check, der Trust bei verbundenen Akteuren wiederherstellt",
  "category": "defensive",
  "resourceCost": 0,
  "cooldown": 3,
  "effects": {
    "trustDelta": 0.15,
    "propagates": true,
    "propagationStrength": 0.7
  },
  "targetType": "adjacent",
  "autoTrigger": {
    "condition": "connected_actor_trust_below_30",
    "probability": 0.6
  }
}
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Groß (4-6 Stunden)
**Status:** [ ] Offen

---

### 3.4 Event-System erweitern

**Problem:** Events zu selten und oft ohne Impact.

**Lösung:** Mehr Events mit stärkeren Effekten:

```typescript
const newEvents: GameEvent[] = [
  {
    id: 'whistleblower',
    name: 'Whistleblower enthüllt Kampagne',
    triggerType: 'conditional',
    condition: (state) => state.escalation.level >= 3 && Math.random() < 0.3,
    effects: {
      globalTrustShift: 0.1,
      escalationIncrease: 0.2,
      spawnActor: 'investigative_journalist'
    },
    newsTickerText: 'BREAKING: Whistleblower enthüllt koordinierte Desinformationskampagne'
  },
  {
    id: 'algorithm_change',
    name: 'Plattform ändert Algorithmus',
    triggerType: 'random',
    probability: 0.15,
    effects: {
      abilityEffectivenessModifier: 0.7, // 30% weniger effektiv
      duration: 4
    },
    newsTickerText: 'Social Media Plattform führt neue Anti-Misinfo Maßnahmen ein'
  },
  {
    id: 'international_crisis',
    name: 'Internationale Krise',
    triggerType: 'random',
    probability: 0.1,
    effects: {
      globalEmotionalIncrease: 0.2,
      resourceBonus: 30
    },
    newsTickerText: 'Internationale Spannungen eskalieren - Bevölkerung verunsichert'
  }
];
```

**Priorität:** 🟠 WICHTIG
**Aufwand:** Mittel (3-4 Stunden)
**Status:** [ ] Offen

---

## 4. Architektur-Verbesserungen

### 4.1 GameStateManager aufteilen

**Problem:** `GameState.ts` mit 23KB ist ein God Object.

**Lösung:** Modulare Systeme:

```
src/game-logic/
├── GameStateManager.ts     # Koordinator (klein)
├── systems/
│   ├── AbilitySystem.ts    # Ability-Anwendung & Cooldowns
│   ├── TrustSystem.ts      # Trust-Berechnung & Propagation
│   ├── EventSystem.ts      # Random/Conditional Events
│   ├── DefensiveSystem.ts  # Defensive Actor Spawning & AI
│   ├── ScoringSystem.ts    # Score-Berechnung
│   └── EscalationSystem.ts # Eskalationsmechanik
├── types/
│   └── index.ts
└── seed/
    └── SeededRandom.ts
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Sehr Groß (2-3 Tage)
**Status:** [ ] Offen

---

### 4.2 Zustand-Store aufräumen

**Problem:** `gameStore.ts` definiert, aber kaum genutzt.

**Optionen:**
1. **Entfernen:** Store komplett entfernen, nur Custom Hook nutzen
2. **Vollständig nutzen:** Custom Hook durch Zustand ersetzen

**Empfehlung:** Option 2 - Zustand für alle persistent States:
- Settings
- Tutorial-Status
- Statistiken
- Aktueller Spielstand (optional)

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Mittel (4-6 Stunden)
**Status:** [ ] Offen

---

## 5. Neue Features

### 5.1 Sound-System

**Problem:** Settings für Sound existieren, aber keine Implementierung.

**Lösung:**
```typescript
// src/utils/sound.ts
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.preload([
      ['click', '/sounds/click.mp3'],
      ['ability', '/sounds/ability.mp3'],
      ['trust_down', '/sounds/trust_down.mp3'],
      ['trust_up', '/sounds/trust_up.mp3'],
      ['round_end', '/sounds/round_end.mp3'],
      ['victory', '/sounds/victory.mp3'],
      ['defeat', '/sounds/defeat.mp3'],
      ['event', '/sounds/event.mp3']
    ]);
  }

  play(id: string, volume: number = 0.5) {
    if (!this.enabled) return;
    const sound = this.sounds.get(id);
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Mittel (4-6 Stunden inkl. Sound-Dateien)
**Status:** [ ] Offen

---

### 5.2 Speicherstand-System

**Problem:** Kein Speichern des Spielstands.

**Lösung:**
```typescript
// Auto-Save nach jeder Runde
useEffect(() => {
  if (gameState.phase === 'playing') {
    const saveData = {
      seed: gameState.seed,
      round: gameState.round,
      state: JSON.stringify(gameState),
      timestamp: Date.now()
    };
    localStorage.setItem('desinformation_save', JSON.stringify(saveData));
  }
}, [gameState.round]);

// Load beim Start
const loadSave = (): GameState | null => {
  const saved = localStorage.getItem('desinformation_save');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Prüfen ob Save nicht zu alt (24h)
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return JSON.parse(data.state);
      }
    } catch (e) {}
  }
  return null;
};
```

**Priorität:** 🟡 NICE-TO-HAVE
**Aufwand:** Mittel (2-3 Stunden)
**Status:** [ ] Offen

---

## 6. Forschung: Aktuelle Desinformationskampagnen

### 6.1 Russische Operationen (FIMI)

**Quellen:**
- [EUvsDisinfo](https://euvsdisinfo.eu/) - 18,000+ dokumentierte Fälle
- [EEAS 3rd FIMI Report 2025](https://www.eeas.europa.eu/sites/default/files/documents/2025/EEAS-3nd-ThreatReport-March-2025-05-Digital-HD.pdf)

**Schlüsseloperationen:**

#### Doppelganger-Kampagne
- **Umfang:** 228+ Domains, 25,000 koordinierte Fake-Accounts
- **Sprachen:** 9 (EN, DE, FR, ES, TR, AR, HE, IT, weitere)
- **Methode:** Fake-Nachrichtenwebsites, die legitime Medien imitieren
- **Ziele:** Deutschland, Polen, Frankreich primär

**Spielintegration:**
```json
{
  "id": "doppelganger",
  "name": "Doppelganger-Taktik",
  "description": "Erstelle gefälschte Versionen legitimer Nachrichtenquellen",
  "category": "media",
  "effects": {
    "trustDelta": -0.18,
    "confusionEffect": true,
    "propagates": true
  },
  "realWorldExample": "Doppelganger-Kampagne imitierte Le Monde, Der Spiegel und andere"
}
```

#### Diplomatische Verstärkung
- Russische Diplomaten nutzen Social Media als Verstärker
- Internationale Foren für "Legitimierung" von Narrativen
- Zielregionen: Afrika, Naher Osten, Lateinamerika

**Budget 2025:** ~1.18 Milliarden EUR für staatliche Medien

---

### 6.2 Chinesische Operationen

**Quellen:**
- [RAND Report](https://www.rand.org/pubs/research_reports/RR4373z3.html)
- [Taiwan NSB Report 2024](https://www.nsb.gov.tw/en/)

**Schlüsseloperationen:**

#### Spamouflage-Netzwerk
- **Wachstum 2024:** +60% (2.16 Mio. kontroverse Inhalte)
- **Fake Accounts:** 28,216 identifiziert (+11,661 vs. 2023)
- **Plattformen:** Facebook (21,967), TikTok (+1,614%)
- **Methode:** Kommentar-Flooding, manipulierte Videos/Memes

**Spielintegration:**
```json
{
  "id": "spamouflage",
  "name": "Kommentar-Flut",
  "description": "Überflute Kommentarsektionen mit koordinierten Botschaften",
  "category": "digital",
  "effects": {
    "trustDelta": -0.12,
    "emotionalDelta": 0.15,
    "targetType": "network"
  },
  "realWorldExample": "Spamouflage-Operation mit 28,000+ Fake-Accounts"
}
```

#### Fake-Medien-Netzwerk
- Shenzhen Haimai Yunxiang Media: Fake-Outlets wie "Bohemia Daily", "Güell Herald"
- Weiterverbreitung von Staatsmedien-Inhalten
- Promotion des "Ein-China-Prinzips"

#### Taiwan als Testgebiet
- 84 identifizierte Narrative gegen US-Zuverlässigkeit
- Test für Angriffsvektoren vor globalem Einsatz

---

### 6.3 Iranische Operationen

**Quellen:**
- [Atlantic Council Report](https://www.atlanticcouncil.org/in-depth-research-reports/report/iranian-digital-influence-efforts-guerrilla-broadcasting-for-the-twenty-first-century/)
- [OpenAI Storm-2035 Report](https://www.axios.com/2024/08/16/openai-iran-disinformation-chatgpt)

**Charakteristika:**
- **"Distorted Truth"** statt offensichtliche Lügen
- Übertreibung moralischer Autorität Irans
- Minimierung interner Repression

#### Storm-2035 Operation
- ChatGPT zur Erstellung von Fake-News
- Ziel: US-Wahlen 2024
- Fake-Outlets: "Nio Thinker" (progressiv), "Savannah Time" (konservativ)

**Spielintegration:**
```json
{
  "id": "distorted_truth",
  "name": "Verzerrte Wahrheit",
  "description": "Präsentiere wahre Fakten in irreführendem Kontext",
  "category": "narrative",
  "effects": {
    "trustDelta": -0.10,
    "resilienceDelta": -0.05,
    "detectionDifficulty": "high"
  },
  "realWorldExample": "Iranische 'Guerilla Broadcasting' Taktik"
}
```

#### IRGC Cyber-Operationen
- Gen. Hossein Salami: "Cyberspace ist das neue Schlachtfeld"
- Fake-Accounts im Namen prominenter Dissidenten
- Psychologische Operationen zur Diskreditierung von Opposition

---

### 6.4 Schwedische Verteidigungsstrategie

**Quellen:**
- [Swedish Psychological Defence Agency (MPF)](https://mpf.se/psychological-defence-agency)
- [MSB (Civil Contingencies Agency)](https://www.msb.se/en/)

**Ansatz:**
- 70 Jahre Geschichte psychologischer Verteidigung
- Wiederaufbau nach Krim-Annexion 2014
- ~60 Mitarbeiter in 3 Abteilungen

**Schlüsselkonzepte für Spielintegration:**

1. **Vulnerabilität vs. Bedrohung:**
   - Inländische Misinfo-Spreader = Vulnerabilität (Dialog, Korrektur)
   - Ausländische Akteure = Bedrohung (aktive Bekämpfung)

2. **Inokulationsstrategie:**
   - Bevölkerung resilient machen durch Aufklärung
   - Unterstützung für Medien bei Fact-Checking

**Defensive Mechanik:**
```typescript
{
  id: 'psychological_defence',
  name: 'Psychologische Verteidigung',
  type: 'defensive',
  effects: {
    networkResilienceBonus: 0.15,
    emotionalDampening: 0.2,
    trustRecoveryBoost: 1.5
  },
  triggerCondition: 'round >= 16 && avgTrust < 0.45'
}
```

---

### 6.5 UK Counter-Disinformation

**Quellen:**
- [Counter Disinformation Unit (CDU)](https://www.gov.uk/government/publications/counter-disinformation-unit-open-source-information-collection-and-analysis-privacy-notice)
- [NCSC/GCHQ](https://www.gov.uk/government/news/uk-exposes-attempted-russian-cyber-interference-in-politics-and-democratic-processes)

**Erkenntnisse:**
- 95% der CDU-Referrals betreffen staatlich gestützte Desinformation
- Star Blizzard (FSB Centre 18): Spear-Phishing von Parlamentariern seit 2015
- 2018: Hack des Institute for Statecraft

**GCHQ AI Security Lab (2024):**
- Neues "Laboratory for AI Security Research"
- Fokus: AI-generierte Misinfo, Bio-Waffen, Cyber-Bedrohungen

---

## 7. Neue Szenarien & Kampagnen

### 7.1 Szenario: EU-Parlamentswahl

**Basierend auf:** EEAS-Bericht zu EU-Wahlen 2024

```typescript
const euElectionScenario: Scenario = {
  id: 'eu_election_2024',
  name: 'Europawahl 2024',
  description: 'Beeinflusse die öffentliche Meinung vor der EU-Parlamentswahl',

  actors: [
    { template: 'mainstream_media', count: 2 },
    { template: 'tabloid', count: 2 },
    { template: 'fact_checker', count: 1, spawnRound: 8 },
    { template: 'political_party_left', count: 1 },
    { template: 'political_party_right', count: 1 },
    { template: 'social_media_influencer', count: 3 },
    { template: 'eu_institution', count: 1 },
    { template: 'national_government', count: 1 }
  ],

  specialMechanics: {
    electionDay: 24, // Spezial-Event
    volatilityMultiplier: 1.5, // Mehr Bewegung
    polarizationBonus: true
  },

  victoryCondition: {
    type: 'polarization',
    threshold: 0.7, // Polarisationsindex
    alternativeWin: {
      type: 'trust',
      threshold: 0.35,
      actorCategories: ['political_party']
    }
  },

  events: [
    {
      id: 'debate_scandal',
      name: 'TV-Debatte eskaliert',
      round: 12,
      effects: { emotionalSpike: 0.3 }
    },
    {
      id: 'leak',
      name: 'Dokumenten-Leak',
      round: 18,
      effects: { trustDelta: -0.15, targetCategory: 'political' }
    }
  ]
};
```

---

### 7.2 Szenario: Gesundheitskrise

**Basierend auf:** COVID-19 Misinfo-Muster

```typescript
const healthCrisisScenario: Scenario = {
  id: 'health_crisis',
  name: 'Gesundheitskrise',
  description: 'Verbreite Misstrauen gegenüber Gesundheitsmaßnahmen',

  actors: [
    { template: 'health_ministry', trust: 0.7 },
    { template: 'hospital', trust: 0.75 },
    { template: 'pharma_company', trust: 0.45 },
    { template: 'scientist', count: 2, trust: 0.8 },
    { template: 'alternative_healer', trust: 0.5 },
    { template: 'concerned_citizens', trust: 0.6 },
    { template: 'conspiracy_influencer', trust: 0.4 }
  ],

  specialAbilities: [
    'vaccine_doubt',
    'natural_immunity_myth',
    'big_pharma_conspiracy',
    'expert_discrediting',
    'anecdotal_evidence'
  ],

  victoryCondition: {
    type: 'category_trust',
    categories: ['health_ministry', 'scientist', 'hospital'],
    threshold: 0.35
  }
};
```

---

### 7.3 Szenario: Geopolitische Krise

**Basierend auf:** Ukraine-Krieg Desinformation

```typescript
const geopoliticalScenario: Scenario = {
  id: 'geopolitical_crisis',
  name: 'Geopolitische Krise',
  description: 'Untergrabe die Unterstützung für internationale Solidarität',

  actors: [
    { template: 'national_government', trust: 0.6 },
    { template: 'foreign_ministry', trust: 0.55 },
    { template: 'military', trust: 0.65 },
    { template: 'peace_movement', trust: 0.5 },
    { template: 'defense_industry', trust: 0.4 },
    { template: 'international_organization', trust: 0.6 },
    { template: 'refugee_organization', trust: 0.55 }
  ],

  narratives: [
    'war_fatigue',
    'economic_burden',
    'both_sides',
    'peace_at_any_cost',
    'domestic_priorities'
  ],

  specialMechanics: {
    warFatigue: {
      startsRound: 1,
      increasePerRound: 0.02,
      effect: 'trust_recovery_reduction'
    }
  }
};
```

---

## 8. Post-Game Analyse & Lernmodul

### 8.1 Analyse-Dashboard

**Konzept:** Nach Spielende detaillierte Analyse mit Lerneffekt.

```typescript
type PostGameAnalysis = {
  // Spielstatistiken
  stats: {
    roundsPlayed: number;
    abilitiesUsed: AbilityUsage[];
    totalTrustReduction: number;
    actorsCompromised: number;
    defensiveActorsSpawned: number;
    eventsTriggered: string[];
  };

  // Taktik-Analyse
  tactics: {
    mostEffectiveAbility: string;
    leastEffectiveAbility: string;
    vulnerabilitiesExploited: string[];
    resistancesEncountered: string[];
    propagationChains: PropagationChain[];
  };

  // Lern-Sektion
  learning: {
    techniquesUsed: TechniqueExplanation[];
    realWorldParallels: RealWorldExample[];
    counterStrategies: CounterStrategy[];
    mediaLiteracyTips: string[];
  };

  // "Was wäre wenn" Szenarien
  whatIf: {
    ifDefenderPerspective: string;
    howToProtectYourself: string[];
    warningSignsToWatch: string[];
  };
};
```

---

### 8.2 Lern-Karten nach Technik

```typescript
type TechniqueCard = {
  id: string;
  name: string;
  category: 'psychological' | 'rhetorical' | 'digital' | 'narrative';

  // Im Spiel
  inGameUsage: {
    timesUsed: number;
    effectiveness: number;
    bestTarget: string;
  };

  // Bildungsinhalte
  education: {
    definition: string;
    howItWorks: string;
    realWorldExamples: {
      campaign: string;
      actor: string;
      year: number;
      description: string;
      source: string;
    }[];

    // Schutz
    howToRecognize: string[];
    howToDefend: string[];
    criticalQuestions: string[];
  };
};

// Beispiel:
const framingCard: TechniqueCard = {
  id: 'framing',
  name: 'Framing',
  category: 'psychological',
  inGameUsage: { timesUsed: 5, effectiveness: 0.72, bestTarget: 'Mainstream Media' },
  education: {
    definition: 'Die Art, wie Informationen präsentiert werden, beeinflusst deren Interpretation.',
    howItWorks: 'Durch selektive Betonung bestimmter Aspekte wird die Wahrnehmung gesteuert.',
    realWorldExamples: [
      {
        campaign: 'Doppelganger',
        actor: 'Russland',
        year: 2024,
        description: 'Gefälschte Nachrichtenseiten rahmten Ukraine-Hilfe als "Verschwendung von Steuergeldern"',
        source: 'EEAS FIMI Report 2025'
      }
    ],
    howToRecognize: [
      'Achte auf emotional aufgeladene Sprache',
      'Frage: Welche Aspekte werden betont, welche ausgelassen?',
      'Vergleiche Berichterstattung verschiedener Quellen'
    ],
    howToDefend: [
      'Konsumiere Nachrichten aus verschiedenen Perspektiven',
      'Hinterfrage die Wortwahl',
      'Suche nach Primärquellen'
    ],
    criticalQuestions: [
      'Wer profitiert von dieser Darstellung?',
      'Welche Emotionen soll ich empfinden?',
      'Was wird nicht erwähnt?'
    ]
  }
};
```

---

### 8.3 Interaktive Reflexion

```typescript
// Nach Spielende: Reflexionsfragen
const reflectionQuestions: ReflectionQuestion[] = [
  {
    question: 'Welche Taktik hat dich am meisten überrascht in ihrer Wirksamkeit?',
    type: 'open',
    followUp: (answer) => {
      // KI-generierte Erklärung basierend auf Spielverlauf
      return `Diese Technik war besonders effektiv, weil...`;
    }
  },
  {
    question: 'Hättest du als Verteidiger diese Angriffe erkannt?',
    type: 'scale', // 1-5
    educationalContent: (score) => {
      if (score <= 2) {
        return 'Das zeigt, wie subtil diese Techniken sein können. Hier sind Warnsignale...';
      }
      return 'Gut! Hier sind zusätzliche Strategien zur Erkennung...';
    }
  },
  {
    question: 'Welche dieser Techniken hast du schon in echten Nachrichten bemerkt?',
    type: 'multiple_choice',
    options: ['Framing', 'Emotional Appeal', 'False Balance', 'Keine'],
    response: 'Diese Techniken sind allgegenwärtig. Hier ist, worauf du achten kannst...'
  }
];
```

---

### 8.4 Comparison mit echten Kampagnen

```typescript
// Vergleich des Spielverlaufs mit echten Operationen
function compareWithRealCampaigns(gameStats: GameStats): Comparison[] {
  const comparisons: Comparison[] = [];

  if (gameStats.primaryTactic === 'emotional_appeal') {
    comparisons.push({
      realCampaign: 'Iranian Storm-2035',
      similarity: 0.75,
      explanation: 'Deine Strategie ähnelt der iranischen Operation, die emotionale Polarisierung nutzte...',
      source: 'OpenAI/Microsoft Threat Intelligence 2024'
    });
  }

  if (gameStats.targetedCategory === 'expert') {
    comparisons.push({
      realCampaign: 'Anti-Vaccine Disinformation',
      similarity: 0.82,
      explanation: 'Das Untergraben von Experten-Vertrauen war zentral für COVID-Misinfo...',
      source: 'WHO Infodemic Report 2023'
    });
  }

  return comparisons;
}
```

---

## 9. Defender-Modus

### 9.1 Konzept

**Inspiration:** Plague Inc. Cure-Modus

Der Spieler übernimmt die Rolle eines Fact-Checkers/Medienkompetenz-Trainers und muss das Netzwerk vor Desinformation schützen.

```typescript
type DefenderGameState = {
  phase: 'start' | 'playing' | 'victory' | 'defeat';
  round: number;

  // Ressourcen
  budget: number;
  credibility: number; // 0-1, sinkt bei Fehlern
  reach: number; // Wie viele Menschen erreicht werden

  // Netzwerk
  network: Network;
  incomingAttacks: Attack[]; // KI-gesteuerte Angriffe

  // Fähigkeiten
  availableDefenses: Defense[];
  activePrograms: Program[]; // Langfristige Maßnahmen
};
```

---

### 9.2 Defender-Mechaniken

```typescript
type Defense = {
  id: string;
  name: string;
  type: 'reactive' | 'proactive' | 'structural';

  // Kosten
  budgetCost: number;
  credibilityCost?: number; // Manche Maßnahmen sind kontrovers

  // Effekte
  effects: {
    trustRecovery?: number;
    resilienceBoost?: number;
    attackBlocking?: number;
    reachIncrease?: number;
  };

  // Targeting
  targetType: 'single' | 'category' | 'network';
  cooldown: number;
};

const defenderAbilities: Defense[] = [
  {
    id: 'fact_check',
    name: 'Fact-Check veröffentlichen',
    type: 'reactive',
    budgetCost: 15,
    effects: { trustRecovery: 0.1 },
    targetType: 'single',
    cooldown: 1
  },
  {
    id: 'prebunking',
    name: 'Prebunking-Kampagne',
    type: 'proactive',
    budgetCost: 40,
    effects: { resilienceBoost: 0.15, reachIncrease: 0.1 },
    targetType: 'network',
    cooldown: 4
  },
  {
    id: 'media_literacy',
    name: 'Medienkompetenz-Training',
    type: 'structural',
    budgetCost: 60,
    effects: { resilienceBoost: 0.2 },
    targetType: 'category',
    cooldown: 6
  },
  {
    id: 'platform_report',
    name: 'Plattform-Meldung',
    type: 'reactive',
    budgetCost: 10,
    credibilityCost: 0.02, // Kann nach hinten losgehen
    effects: { attackBlocking: 0.5 },
    targetType: 'single',
    cooldown: 2
  },
  {
    id: 'transparency_initiative',
    name: 'Transparenz-Initiative',
    type: 'structural',
    budgetCost: 80,
    effects: { trustRecovery: 0.05, resilienceBoost: 0.1 },
    targetType: 'network',
    cooldown: 8
  }
];
```

---

### 9.3 KI-Angreifer

```typescript
type AIAttacker = {
  type: 'state_actor' | 'commercial' | 'ideological';
  aggression: number; // 0-1
  sophistication: number; // 0-1
  resources: number;

  // Strategie
  preferredTactics: string[];
  targetPreferences: string[]; // Actor-Kategorien
  adaptability: number; // Wie schnell lernt die KI
};

function generateAIAttack(
  attacker: AIAttacker,
  gameState: DefenderGameState
): Attack {
  // Wähle Taktik basierend auf Präferenzen und Spielzustand
  const tactic = selectTactic(attacker, gameState);

  // Wähle Ziel basierend auf Vulnerabilitäten
  const target = selectTarget(attacker, gameState);

  // Berechne Stärke
  const strength = calculateAttackStrength(attacker, tactic);

  return {
    id: crypto.randomUUID(),
    tactic,
    targetActorId: target.id,
    strength,
    round: gameState.round,
    visible: attacker.sophistication < 0.7 // Ausgeklügelte Angriffe schwerer zu erkennen
  };
}
```

---

### 9.4 Victory/Defeat Conditions (Defender)

```typescript
// Sieg: Netzwerk-Trust über Schwelle halten für X Runden
const defenderVictoryCondition = {
  type: 'sustained_trust',
  threshold: 0.55,
  duration: 10, // Runden
  description: 'Halte das durchschnittliche Vertrauen über 55% für 10 Runden'
};

// Niederlage
const defenderDefeatConditions = [
  {
    type: 'trust_collapse',
    threshold: 0.3,
    description: 'Durchschnittliches Vertrauen fällt unter 30%'
  },
  {
    type: 'credibility_loss',
    threshold: 0.2,
    description: 'Eigene Glaubwürdigkeit fällt unter 20%'
  },
  {
    type: 'budget_depleted',
    threshold: 0,
    description: 'Budget aufgebraucht'
  }
];
```

---

## 10. Implementierungsdetails

### 10.1 Prioritäten-Matrix

| Feature | Priorität | Aufwand | Abhängigkeiten |
|---------|-----------|---------|----------------|
| Touch-Support | 🔴 KRITISCH | Klein | - |
| Tutorial-Persistenz | 🔴 KRITISCH | Klein | - |
| Button-Konsistenz | 🟠 WICHTIG | Klein | - |
| Undo-Button | 🟠 WICHTIG | Klein | - |
| Tastatursteuerung | 🟠 WICHTIG | Mittel | - |
| Trust-Animationen | 🟠 WICHTIG | Mittel | - |
| Eskalationssystem | 🟠 WICHTIG | Groß | - |
| Mehrstufige Victories | 🟠 WICHTIG | Mittel | - |
| Pause-Funktion | 🟡 NICE | Klein | - |
| Sound-System | 🟡 NICE | Mittel | - |
| Zoom/Pan | 🟡 NICE | Groß | - |
| Post-Game Analyse | 🟠 WICHTIG | Groß | - |
| Defender-Modus | 🟡 NICE | Sehr Groß | Eskalationssystem |
| Neue Szenarien | 🟡 NICE | Groß | - |
| GameState Refactoring | 🟡 NICE | Sehr Groß | - |

---

### 10.2 Sprint-Planung

#### Sprint 1: Kritische Fixes ✅ ABGESCHLOSSEN
- [x] Touch-Support implementieren
- [x] Tutorial-Persistenz
- [x] Button-Komponente durchgängig nutzen
- [x] Undo-Button hinzufügen

#### Sprint 2: UX-Polish ✅ ABGESCHLOSSEN
- [x] Tastatursteuerung
- [x] Trust-Animationen
- [x] Pause-Funktion
- [x] Zoom & Pan (vorgezogen)

#### Sprint 3: Gameplay-Vertiefung ✅ ABGESCHLOSSEN
- [x] Eskalationssystem (Level 0-5, Public Awareness, Media Attention)
- [x] Mehrstufige Victory-Conditions (Complete/Strategic/Tactical/Pyrrhic/Partial)
- [x] Counter-Abilities für Defensive (6 Abilities mit Auto-Trigger)
- [x] Event-System erweitern (12 neue Events, Escalation-basiert)

#### Sprint 4: Lern-Features ✅
- [x] Post-Game Analyse (Detaillierte Kampagnen-Analyse mit 5 Tabs)
- [x] Technik-Karten (Technik-Übersicht mit Kategorien und Statistiken)
- [x] Realworld-Vergleiche (Bildungsinhalte mit echten Fallstudien)
- [x] Reflexionsfragen (10 Reflexionsfragen zur Selbstreflexion)

#### Sprint 5+: Major Features
- [ ] Defender-Modus (MVP)
- [ ] Neue Szenarien
- [ ] Sound-System
- [ ] Speicherstand-System

---

### 10.3 Technische Schulden

1. **Zustand-Store:** Entscheidung treffen (nutzen oder entfernen)
2. **GameStateManager:** Refactoring in modulare Systeme
3. **Type-Konsistenz:** Alle Types in zentrale Datei
4. **Test-Coverage:** Unit-Tests für GameState-Logik
5. **Performance:** Canvas-Optimierung für große Netzwerke

---

## Quellen & Referenzen

### Forschungsberichte
- [EUvsDisinfo](https://euvsdisinfo.eu/)
- [EEAS FIMI Reports](https://www.eeas.europa.eu/eeas/information-integrity-and-countering-foreign-information-manipulation-interference-fimi_en)
- [Swedish MPF](https://mpf.se/psychological-defence-agency)
- [UK CDU](https://www.gov.uk/government/news/fact-sheet-on-the-cdu-and-rru)
- [RAND China Disinformation](https://www.rand.org/pubs/research_reports/RR4373z3.html)
- [Atlantic Council Iran Report](https://www.atlanticcouncil.org/in-depth-research-reports/report/iranian-digital-influence-efforts-guerrilla-broadcasting-for-the-twenty-first-century/)

### Akademische Quellen
- [EU Parliament Study on Resilience](https://www.europarl.europa.eu/RegData/etudes/STUD/2025/777917/IUST_STU(2025)777917_EN.pdf)
- [UK POST on AI Disinformation](https://post.parliament.uk/ai-disinformation-and-cyber-security/)

### News & Analyse
- [NBC on Iran Election Targeting](https://www.nbcnews.com/politics/2024-election/iran-targeting-us-election-fake-news-sites-cyber-operations-research-rcna165902)
- [NPR on China Fake Voters](https://www.npr.org/2024/09/03/nx-s1-5096151/china-tiktok-x-fake-voters-influence-campaign)

---

*Dieses Dokument wird kontinuierlich aktualisiert.*
