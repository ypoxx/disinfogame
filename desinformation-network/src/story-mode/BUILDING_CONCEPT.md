# Gebäude-Navigation System - Konzept

## Übersicht

Ein mehrstöckiges Gebäude als Hub für den Story Mode. Der Spieler steuert eine
animierte Figur, die zwischen verschiedenen Büros navigiert. Jedes Büro
repräsentiert einen NPC mit spezifischen Fähigkeiten.

```
┌─────────────────────────────────────────────────────────────────┐
│  DACH (Optional: Geheimes Labor / Endgame Content)              │
├─────────────────────────────────────────────────────────────────┤
│  ETAGE 3: SPEZIAL-OPERATIONEN                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ CYBER-LAB   │ │ PROPAGANDA  │ │ STRATEGIE   │               │
│  │ (Hacker)    │ │ (Medien)    │ │ (General)   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  ETAGE 2: ANALYSE & INTEL                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ DATEN-RAUM  │ │ MONITORING  │ │ ARCHIV      │               │
│  │ (Analystin) │ │ (Spion)     │ │ (Historiker)│               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  ETAGE 1: ZENTRALE                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ DEIN BÜRO   │ │ KONFERENZ   │ │ EMPFANG     │               │
│  │ (Hauptraum) │ │ (Briefings) │ │ (Tutorial)  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  KELLER: GEHEIMOPERATIONEN                                      │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │ SERVER-RAUM │ │ TRESOR      │                               │
│  │ (Botfarmen) │ │ (Ressourcen)│                               │
│  └─────────────┘ └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Spielfigur-Animation (Sprite Sheet)

### Benötigte Animationen für Hauptfigur

```
SPRITE SHEET LAYOUT (32x32 pro Frame, 8 Frames pro Animation)
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ I1 │ I2 │ I3 │ I4 │ W1 │ W2 │ W3 │ W4 │  Row 1: Idle (4) + Walk Right (4)
├────┼────┼────┼────┼────┼────┼────┼────┤
│ W5 │ W6 │ W7 │ W8 │ U1 │ U2 │ U3 │ U4 │  Row 2: Walk Right (4) + Climb Up (4)
├────┼────┼────┼────┼────┼────┼────┼────┤
│ D1 │ D2 │ D3 │ D4 │ E1 │ E2 │ E3 │ E4 │  Row 3: Climb Down (4) + Enter Door (4)
└────┴────┴────┴────┴────┴────┴────┴────┘

Animationen:
- idle:       Subtiles Atmen/Bewegung (4 Frames, Loop)
- walkRight:  Gehen nach rechts (8 Frames)
- walkLeft:   = walkRight gespiegelt (CSS transform: scaleX(-1))
- climbUp:    Treppe hoch (4 Frames)
- climbDown:  Treppe runter (4 Frames)
- enterDoor:  Büro betreten (4 Frames)
```

### Stil-Richtung

- **Pixel Art** im Stil von 16-bit Retro-Games
- Passend zur brutalistischen Sowjet-Ästhetik
- Farben: Gedeckte Töne (Grau, Olive, Rot-Akzente)
- Figur: Anzug, aktentasche, neutraler Ausdruck

---

## Büro-Designs

### 1. Technik-Büro (Cyber-Lab)
**NPC:** Der Hacker / Tech-Spezialist
**Fähigkeiten:** Botfarmen, DDoS, Datenleaks

```
┌─────────────────────────────────────┐
│  ░░░ CYBER-LAB ░░░                  │
│                                     │
│  ┌───────┐  ┌───────┐  ┌───────┐   │
│  │MONITOR│  │MONITOR│  │MONITOR│   │  <- Server-Monitore (grün leuchtend)
│  │ ▓▓▓▓▓ │  │ ████▓ │  │ ░░▓▓▓ │   │
│  └───────┘  └───────┘  └───────┘   │
│                                     │
│    [NPC]    ████████████           │  <- Server-Racks (blinkende LEDs)
│    ◉ ◡ ◉    ▓▓▓▓▓▓▓▓▓▓▓▓           │
│             ████████████           │
│                                     │
│  ⚡ Kabel   🔴🟢🔴 LEDs    📡      │  <- Animierte Elemente
└─────────────────────────────────────┘

Minimale Animationen:
- Server-LEDs blinken (CSS animation)
- Monitor-Text scrollt
- NPC tippt gelegentlich
```

### 2. Analyse-Büro (Daten-Raum)
**NPC:** Die Analystin
**Fähigkeiten:** Zielgruppen-Analyse, Trend-Erkennung

```
┌─────────────────────────────────────┐
│  ░░░ ANALYSE-ZENTRUM ░░░            │
│                                     │
│    ┌─────────────────┐              │
│    │ GRAFIK/CHART    │   📊        │  <- Animiertes Diagramm
│    │   ╱╲            │              │
│    │  ╱  ╲  ╱╲       │              │
│    │ ╱    ╲╱  ╲      │              │
│    └─────────────────┘              │
│                                     │
│    [NPC]      📁 📁 📁             │  <- Akten-Stapel
│    ◉ ◡ ◉      📋                   │
│    🖊️         ☕                    │  <- Kaffeetasse (dampft)
│                                     │
└─────────────────────────────────────┘

Minimale Animationen:
- Diagramm-Linien zeichnen sich
- NPC blättert in Akten
- Kaffee dampft
```

### 3. Propaganda-Büro (Medien-Zentrum)
**NPC:** Der Medien-Spezialist
**Fähigkeiten:** Fake News, Meme-Kampagnen, Influencer

```
┌─────────────────────────────────────┐
│  ░░░ MEDIEN-ZENTRUM ░░░             │
│                                     │
│  ┌──────────────────────┐          │
│  │ 📺 TV BILDSCHIRM     │          │  <- Wechselnde "Nachrichten"
│  │ "BREAKING NEWS..."   │          │
│  └──────────────────────┘          │
│                                     │
│  🎬       [NPC]        📱 📱       │  <- Smartphones
│  Kamera   ◉ ◡ ◉       🎤          │
│           Anzug                     │
│                                     │
│  📰 📰 📰 Zeitungen                │  <- Flatternde Blätter
└─────────────────────────────────────┘

Minimale Animationen:
- TV flackert, Nachrichten wechseln
- NPC gestikuliert
- Zeitungen flattern leicht
```

### 4. Strategie-Büro (Kommando-Zentrale)
**NPC:** Der General / Stratege
**Fähigkeiten:** Langzeit-Planung, Ressourcen-Allokation

```
┌─────────────────────────────────────┐
│  ░░░ KOMMANDO-ZENTRALE ░░░          │
│                                     │
│  ┌──────────────────────────┐      │
│  │ 🗺️ WELTKARTE            │      │  <- Interaktive Karte
│  │   ⬤ ─── ⬤ ─── ⬤        │      │
│  │     Westunion            │      │
│  └──────────────────────────┘      │
│                                     │
│        [NPC]     🎖️ 🎖️            │  <- Orden an der Wand
│        ◉ ◡ ◉    ⭐               │
│        Uniform   🏆                │
│                                     │
│  📞 Rotes Telefon                  │  <- Blinkt bei Events
└─────────────────────────────────────┘

Minimale Animationen:
- Punkte auf Karte pulsieren
- Telefon blinkt
- NPC nickt gelegentlich
```

---

## Technische Architektur

### Komponenten-Struktur

```
src/story-mode/
├── building/
│   ├── BuildingView.tsx       # Hauptkomponente (Gebäude-Übersicht)
│   ├── FloorView.tsx          # Einzelne Etage
│   ├── RoomView.tsx           # Büro-Ansicht
│   ├── PlayerSprite.tsx       # Animierte Spielfigur
│   ├── NavigationPath.tsx     # Pfad-Berechnung
│   │
│   ├── rooms/
│   │   ├── CyberLab.tsx       # Technik-Büro
│   │   ├── AnalysisRoom.tsx   # Analyse-Büro
│   │   ├── MediaCenter.tsx    # Propaganda-Büro
│   │   ├── CommandCenter.tsx  # Strategie-Büro
│   │   └── ...
│   │
│   ├── sprites/
│   │   ├── SpriteSheet.tsx    # Sprite-Sheet Renderer
│   │   ├── animations.ts      # Animation-Definitionen
│   │   └── useSprite.ts       # Sprite-Hook
│   │
│   └── assets/
│       ├── player.png         # Spielfigur Sprite-Sheet
│       ├── npcs/              # NPC Sprites
│       └── furniture/         # Möbel-Sprites (optional)
```

### State Management

```typescript
interface BuildingState {
  currentFloor: number;        // 0 = Keller, 1-3 = Etagen
  currentRoom: string | null;  // null = im Flur
  playerPosition: { x: number; y: number };
  playerAnimation: 'idle' | 'walkRight' | 'walkLeft' | 'climbUp' | 'climbDown' | 'enterDoor';
  isTransitioning: boolean;
  unlockedRooms: Set<string>;
  roomStates: Map<string, RoomState>;
}

interface RoomState {
  npcMood: 'neutral' | 'happy' | 'suspicious';
  ambientAnimations: boolean;
  hasNotification: boolean;
}
```

### Sprite Animation System

```typescript
// useSprite.ts
interface SpriteConfig {
  src: string;
  frameWidth: number;
  frameHeight: number;
  animations: {
    [key: string]: {
      row: number;
      frames: number;
      frameTime: number;  // ms pro Frame
      loop: boolean;
    };
  };
}

function useSprite(config: SpriteConfig) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animation, setAnimation] = useState('idle');

  useEffect(() => {
    const anim = config.animations[animation];
    const interval = setInterval(() => {
      setCurrentFrame(f => (f + 1) % anim.frames);
    }, anim.frameTime);

    return () => clearInterval(interval);
  }, [animation]);

  return {
    setAnimation,
    style: {
      backgroundImage: `url(${config.src})`,
      backgroundPosition: `-${currentFrame * config.frameWidth}px -${anim.row * config.frameHeight}px`,
      width: config.frameWidth,
      height: config.frameHeight,
    }
  };
}
```

---

## Navigation Flow

```
1. Spieler ist im aktuellen Raum (z.B. "Dein Büro")
2. Spieler klickt auf Tür oder Etagen-Anzeige
3. Animation: Figur geht zur Tür, "enterDoor" Animation
4. Übergang: Fade-out / Slide
5. Neuer Raum: Figur erscheint an der Tür, "idle" Animation
6. Raum-Interaktion möglich

Etagen-Wechsel:
1. Spieler klickt auf Treppe oder Etagen-Buttons
2. Animation: Figur geht zur Treppe
3. "climbUp" oder "climbDown" Animation
4. Flur der neuen Etage erscheint
5. Spieler wählt Raum auf dieser Etage
```

---

## Minimale Animationen (CSS-basiert)

### NPC Blinzeln
```css
@keyframes blink {
  0%, 90%, 100% {
    clip-path: ellipse(50% 50% at 50% 50%);
  }
  95% {
    clip-path: ellipse(50% 5% at 50% 50%);
  }
}

.npc-eyes {
  animation: blink 4s infinite;
}
```

### Ventilator
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fan-blades {
  animation: spin 0.5s linear infinite;
}
```

### Server-LEDs
```css
@keyframes led-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.server-led {
  animation: led-blink 0.3s ease-in-out infinite;
  animation-delay: var(--led-delay, 0s);
}
```

### Dampfender Kaffee
```css
@keyframes steam {
  0% { transform: translateY(0) scale(1); opacity: 0.5; }
  100% { transform: translateY(-10px) scale(1.5); opacity: 0; }
}

.coffee-steam {
  animation: steam 2s ease-out infinite;
}
```

---

## Phasen der Implementierung

### Phase 1: Grundgerüst
- [ ] BuildingView mit Etagen-Navigation
- [ ] Einfache CSS-basierte Räume (wie aktuell)
- [ ] Spielfigur als statisches Element

### Phase 2: Spielfigur-Animation
- [ ] Sprite-Sheet erstellen oder generieren
- [ ] useSprite Hook implementieren
- [ ] Geh-Animationen zwischen Räumen

### Phase 3: Raum-Details
- [ ] Individuelle Büro-Designs
- [ ] NPC-Sprites oder CSS-Avatare
- [ ] Minimale Ambiente-Animationen

### Phase 4: Polish
- [ ] Übergänge und Transitions
- [ ] Sound-Effekte (Schritte, Türen)
- [ ] Tutorial für Navigation

---

## Asset-Anforderungen

### Muss-haben (Minimum Viable)
1. **Spielfigur Sprite-Sheet** (256x96px, 24 Frames)
   - Kann mit AI generiert werden (Pixel Art Generator)
   - Oder als CSS-basierte Figur (wie aktuelle Möbel)

### Nice-to-have
2. **NPC Portraits** (je 64x64px)
   - Hacker, Analystin, Medien-Typ, General
   - Mit Blinzel-Frame

3. **Raum-Hintergründe** (je 800x600px)
   - Alternativ: Komplett CSS-basiert (wie jetzt)

---

## Nächste Schritte

1. **Entscheidung**: Pixel-Art Sprites oder CSS-basiert erweitern?
2. **Prototyp**: BuildingView mit Etagen-Navigation
3. **Asset-Erstellung**: Spielfigur (AI-generiert oder manuell)
4. **Integration**: Mit bestehendem Story-Mode State verbinden
