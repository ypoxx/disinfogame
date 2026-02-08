# Story Mode Visual System - MadTV-Style

Basierend auf der Analyse von TVTower, Isometric NYC und dem Asset-Sheet Skill.

---

## Erkenntnisse aus den Referenzprojekten

### TVTower (MadTV-Klon)
- **Modularer Ansatz**: Gebäude, Figuren, Wettereffekte strikt getrennt
- **Layer-System**: `screen_office.png` + `screen_office_elements.png`
- **Funktionale Ordner**: `/building`, `/office`, `/studio`, etc.
- **Sprite-Sheets**: `figures.png`, `figures_janitor.png`, `figures_special.png`

### Isometric NYC (AI-Workflow)
- "No code doesn't mean no engineering" - auch mit KI braucht es Struktur
- **Composability ist entscheidend**: Kleine, modulare Assets kombinieren
- Unix-Philosophie: Kleine Tools → Utility Functions → Komplexe Szenen
- Wechsel zwischen Claude Code, Gemini CLI, Cursor je nach Aufgabe

### Isometric City (Asset-Sheet System)
- **Grid-basierte Sprite-Sheets** mit Row/Column-Koordinaten
- **Varianten**: `main`, `construction`, `abandoned` mit identischem Grid
- **Konfiguration in TypeScript**: Metadaten getrennt von Grafiken
- **Multi-Layer-Rendering** mit Tiefensortierung

---

## Style Anchor für Disinfo-Spiel

### Visueller Referenzpunkt

```
┌─────────────────────────────────────────────────────────────┐
│                    STYLE ANCHOR                              │
├─────────────────────────────────────────────────────────────┤
│  Ära:           1970er-80er DDR/Sowjet                      │
│  Perspektive:   Seitenansicht (wie MadTV, nicht isometrisch)│
│  Stil:          Pixel-Art, 16-bit Retro                     │
│  Farbpalette:   Gedeckt (Grau, Olive, Beige, Sowjet-Rot)    │
│  Beleuchtung:   Neonröhren, kalt, bürokratisch              │
│  Atmosphäre:    Klaustrophobisch, überwacht, steril         │
└─────────────────────────────────────────────────────────────┘
```

### Farbpalette (Hex-Codes)

```
PRIMÄR (Gebäude/Räume):
├── Beton-Dunkel:    #4A4A4A
├── Beton-Hell:      #7A7A7A
├── Linoleum-Grün:   #5C6B4A
├── Holz-Braun:      #6B5344
└── Metall-Grau:     #8A8A8A

AKZENT:
├── Sowjet-Rot:      #B22234
├── Warnung-Gelb:    #FFD700
├── Monitor-Grün:    #33FF33
└── Neon-Weiß:       #F0F0F0

FIGUREN:
├── Anzug-Grau:      #505050
├── Haut-Ton:        #E0C8A8
├── Haar-Braun:      #4A3728
└── Haar-Grau:       #8A8A8A
```

---

## Asset-Struktur (nach TVTower-Vorbild)

```
desinformation-network/
└── public/
    └── story-assets/
        ├── building/
        │   ├── building_exterior.png      # Gebäude-Außenansicht
        │   ├── building_floors.png        # Etagen-Übersicht
        │   ├── elevator_shaft.png         # Aufzugschacht
        │   └── stairwell.png              # Treppenhaus
        │
        ├── rooms/
        │   ├── base/                      # Basis-Räume (leer)
        │   │   ├── room_small.png         # Kleiner Raum (1 NPC)
        │   │   ├── room_medium.png        # Mittlerer Raum (2 NPCs)
        │   │   └── room_large.png         # Großer Raum (3+ NPCs)
        │   │
        │   ├── cyber_lab/                 # Technik-Büro
        │   │   ├── background.png         # Raum-Hintergrund
        │   │   ├── furniture.png          # Möbel-Layer
        │   │   ├── screens.png            # Monitore (animiert)
        │   │   └── effects.png            # LEDs, Kabel
        │   │
        │   ├── analysis/                  # Analyse-Büro
        │   │   ├── background.png
        │   │   ├── furniture.png
        │   │   ├── charts.png             # Diagramme
        │   │   └── papers.png             # Akten
        │   │
        │   ├── media_center/              # Medien-Zentrum
        │   │   ├── background.png
        │   │   ├── furniture.png
        │   │   ├── tv_screens.png         # TVs (animiert)
        │   │   └── newspapers.png
        │   │
        │   ├── command/                   # Kommando-Zentrale
        │   │   ├── background.png
        │   │   ├── furniture.png
        │   │   ├── world_map.png
        │   │   └── red_phone.png
        │   │
        │   └── player_office/             # Spieler-Büro
        │       ├── background.png
        │       ├── furniture.png
        │       └── desk_items.png
        │
        ├── figures/
        │   ├── player/
        │   │   ├── idle.png               # 4 Frames
        │   │   ├── walk.png               # 8 Frames
        │   │   ├── climb.png              # 4 Frames
        │   │   └── enter_door.png         # 4 Frames
        │   │
        │   ├── npcs/
        │   │   ├── hacker_idle.png        # Technik-NPC
        │   │   ├── hacker_typing.png
        │   │   ├── analyst_idle.png       # Analystin-NPC
        │   │   ├── analyst_reading.png
        │   │   ├── media_idle.png         # Medien-NPC
        │   │   ├── media_talking.png
        │   │   ├── general_idle.png       # General-NPC
        │   │   └── general_nodding.png
        │   │
        │   └── extras/
        │       ├── janitor.png            # Hausmeister
        │       └── secretary.png          # Sekretärin
        │
        ├── ui/
        │   ├── floor_indicator.png        # Etagen-Anzeige
        │   ├── elevator_buttons.png       # Aufzug-Buttons
        │   ├── door_signs.png             # Türschilder
        │   └── room_labels.png            # Raum-Beschriftungen
        │
        └── effects/
            ├── ambient/
            │   ├── dust_particles.png     # Staubpartikel
            │   ├── light_flicker.png      # Neon-Flackern
            │   └── steam.png              # Dampf (Kaffee, Heizung)
            │
            └── interactive/
                ├── highlight_glow.png     # Hover-Effekt
                ├── click_pulse.png        # Klick-Feedback
                └── notification.png       # Alert-Bubble
```

---

## Layer-System (nach TVTower-Vorbild)

### Raum-Komposition

```
RENDERING ORDER (von hinten nach vorne):
───────────────────────────────────────────
Layer 0: background.png     │ Wand, Boden, Fenster
Layer 1: furniture.png      │ Schreibtische, Schränke
Layer 2: effects_back.png   │ Kabel, Schatten
Layer 3: npc.png            │ NPC-Figur
Layer 4: furniture_front.png│ Möbel vor NPC (Schreibtischplatte)
Layer 5: effects_front.png  │ Monitor-Glow, Dampf
Layer 6: player.png         │ Spielerfigur (wenn im Raum)
Layer 7: ui_overlay.png     │ Türschilder, Labels
───────────────────────────────────────────
```

### Beispiel: Cyber-Lab Komposition

```typescript
// src/story-mode/config/rooms.ts

export const CYBER_LAB_LAYERS: RoomLayer[] = [
  { id: 'background', src: '/story-assets/rooms/cyber_lab/background.png', z: 0 },
  { id: 'furniture', src: '/story-assets/rooms/cyber_lab/furniture.png', z: 1 },
  { id: 'cables', src: '/story-assets/rooms/cyber_lab/effects.png', z: 2 },
  { id: 'npc', src: null, z: 3, dynamic: true },  // NPC wird zur Laufzeit eingefügt
  { id: 'desk_front', src: '/story-assets/rooms/cyber_lab/desk_front.png', z: 4 },
  { id: 'screens', src: '/story-assets/rooms/cyber_lab/screens.png', z: 5, animated: true },
];
```

---

## Sprite-Sheet Konventionen (nach Isometric City)

### Grid-Layout

```
SPRITE SHEET FORMAT:
┌─────────────────────────────────────────────────────────────┐
│  Alle Frames in einer Zeile (horizontal)                    │
│  Frame-Größe: 64x64px (Figuren) oder 128x128px (Details)   │
│  Transparenter Hintergrund (PNG-24 mit Alpha)              │
│  Konsistente Pivot-Punkte (Füße mittig-unten)              │
└─────────────────────────────────────────────────────────────┘

Beispiel: player_walk.png (8 Frames, 64x64 each)
┌────┬────┬────┬────┬────┬────┬────┬────┐
│ F1 │ F2 │ F3 │ F4 │ F5 │ F6 │ F7 │ F8 │
│ 🚶 │ 🚶 │ 🚶 │ 🚶 │ 🚶 │ 🚶 │ 🚶 │ 🚶 │
└────┴────┴────┴────┴────┴────┴────┴────┘
     512px total width (8 × 64px)
```

### Animations-Konfiguration

```typescript
// src/story-mode/config/animations.ts

export interface SpriteAnimation {
  name: string;
  src: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;  // ms
  loop: boolean;
}

export const PLAYER_ANIMATIONS: Record<string, SpriteAnimation> = {
  idle: {
    name: 'idle',
    src: '/story-assets/figures/player/idle.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
    frameDuration: 200,
    loop: true,
  },
  walk: {
    name: 'walk',
    src: '/story-assets/figures/player/walk.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    frameDuration: 100,
    loop: true,
  },
  climb: {
    name: 'climb',
    src: '/story-assets/figures/player/climb.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
    frameDuration: 150,
    loop: true,
  },
};

export const NPC_ANIMATIONS: Record<string, Record<string, SpriteAnimation>> = {
  hacker: {
    idle: {
      name: 'idle',
      src: '/story-assets/figures/npcs/hacker_idle.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 300,
      loop: true,
    },
    typing: {
      name: 'typing',
      src: '/story-assets/figures/npcs/hacker_typing.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 6,
      frameDuration: 100,
      loop: true,
    },
  },
  // ... weitere NPCs
};
```

---

## Raum-Konfiguration (nach Isometric City)

```typescript
// src/story-mode/config/building.ts

export interface Room {
  id: string;
  name_de: string;
  floor: number;           // 0 = Keller, 1-3 = Etagen
  position: number;        // Position auf der Etage (links nach rechts)
  size: 'small' | 'medium' | 'large';
  npcId?: string;
  layers: RoomLayer[];
  interactables: Interactable[];
  ambientAnimations: AmbientAnimation[];
  unlockCondition?: string;
}

export interface RoomLayer {
  id: string;
  src: string | null;
  z: number;
  dynamic?: boolean;
  animated?: boolean;
  animationConfig?: {
    frameCount: number;
    frameDuration: number;
    loop: boolean;
  };
}

export interface Interactable {
  id: string;
  type: 'door' | 'object' | 'npc';
  bounds: { x: number; y: number; width: number; height: number };
  action: string;
  tooltip_de: string;
}

export interface AmbientAnimation {
  id: string;
  type: 'led_blink' | 'screen_flicker' | 'fan_spin' | 'steam' | 'paper_flutter';
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

// Beispiel: Cyber-Lab Konfiguration
export const ROOMS: Room[] = [
  {
    id: 'cyber_lab',
    name_de: 'Cyber-Labor',
    floor: 2,
    position: 0,
    size: 'medium',
    npcId: 'hacker',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/cyber_lab/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/cyber_lab/furniture.png', z: 1 },
      { id: 'cables', src: '/story-assets/rooms/cyber_lab/effects.png', z: 2 },
      { id: 'npc', src: null, z: 3, dynamic: true },
      {
        id: 'screens',
        src: '/story-assets/rooms/cyber_lab/screens.png',
        z: 5,
        animated: true,
        animationConfig: { frameCount: 4, frameDuration: 200, loop: true }
      },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 100, width: 60, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Raum verlassen',
      },
      {
        id: 'hacker_npc',
        type: 'npc',
        bounds: { x: 200, y: 150, width: 64, height: 64 },
        action: 'talk_to_npc',
        tooltip_de: 'Mit Hacker sprechen',
      },
      {
        id: 'server_rack',
        type: 'object',
        bounds: { x: 350, y: 80, width: 80, height: 150 },
        action: 'inspect_servers',
        tooltip_de: 'Server untersuchen',
      },
    ],
    ambientAnimations: [
      { id: 'led1', type: 'led_blink', position: { x: 360, y: 90 }, config: { color: '#33FF33', interval: 500 } },
      { id: 'led2', type: 'led_blink', position: { x: 370, y: 95 }, config: { color: '#FF3333', interval: 700 } },
      { id: 'led3', type: 'led_blink', position: { x: 380, y: 100 }, config: { color: '#33FF33', interval: 300 } },
      { id: 'screen1', type: 'screen_flicker', position: { x: 150, y: 120 }, config: { intensity: 0.1 } },
    ],
  },
  // ... weitere Räume
];
```

---

## Gebäude-Konfiguration

```typescript
// src/story-mode/config/building.ts

export interface Floor {
  id: number;
  name_de: string;
  rooms: string[];  // Room IDs
  background: string;
  accessible: boolean;
}

export const BUILDING: Floor[] = [
  {
    id: 0,
    name_de: 'Keller',
    rooms: ['server_room', 'archive'],
    background: '/story-assets/building/floor_basement.png',
    accessible: true,
  },
  {
    id: 1,
    name_de: 'Erdgeschoss',
    rooms: ['player_office', 'reception', 'conference'],
    background: '/story-assets/building/floor_1.png',
    accessible: true,
  },
  {
    id: 2,
    name_de: '1. Etage',
    rooms: ['cyber_lab', 'analysis', 'monitoring'],
    background: '/story-assets/building/floor_2.png',
    accessible: true,
  },
  {
    id: 3,
    name_de: '2. Etage',
    rooms: ['media_center', 'command', 'strategy'],
    background: '/story-assets/building/floor_3.png',
    accessible: false,  // Wird später freigeschaltet
  },
];

export const ELEVATOR_CONFIG = {
  travelTimePerFloor: 1500,  // ms
  doorOpenTime: 500,
  doorCloseTime: 500,
  sprite: '/story-assets/building/elevator.png',
  buttonSprite: '/story-assets/ui/elevator_buttons.png',
};
```

---

## KI-Workflow für Asset-Erstellung

### Basierend auf Isometric NYC Erfahrungen

```
WORKFLOW: Neues Asset erstellen
═══════════════════════════════════════════════════════════════

1. STYLE ANCHOR REFERENZ
   ├── Lade vorhandene Assets als Referenz in Sprite Studio
   ├── Max. 8 Referenzbilder für Konsistenz
   └── Immer game-style-guide.md als Kontext

2. PROMPT ENGINEERING (GPT)
   ├── Beschreibe Asset + Kontext
   ├── GPT verbessert mit technischen Details
   └── Überprüfe: Farbpalette, Perspektive, Auflösung

3. GENERIERUNG (Nano Banana Pro)
   ├── 4 Varianten generieren
   ├── Thinking Mode für komplexe Assets
   └── Seed speichern für Konsistenz

4. ITERATION (Inpainting)
   ├── Bereiche markieren die nicht passen
   ├── Beschreiben was sich ändern soll
   └── Wiederholen bis zufrieden

5. POST-PROCESSING
   ├── Sprite-Sheet aus Frames erstellen
   ├── Transparenz prüfen (PNG-24)
   └── In Asset-Ordner speichern

6. KONFIGURATION
   ├── Metadaten in config/*.ts eintragen
   ├── Layer-Reihenfolge definieren
   └── Interactables & Animationen konfigurieren

═══════════════════════════════════════════════════════════════
```

### Prompt-Templates für Konsistenz

```markdown
# RAUM-HINTERGRUND
A pixel art game background. Soviet-era office room interior.
Concrete walls, fluorescent ceiling lights, linoleum floor.
[SPECIFIC_FURNITURE]. 1970s-80s DDR aesthetic.
800x600px. 16-bit retro style. Muted color palette.
Side view perspective (not isometric).

# NPC-FIGUR
A pixel art character sprite. Soviet-era [ROLE].
[CLOTHING_DESCRIPTION]. [EXPRESSION].
64x64px per frame. Transparent background.
Side view facing right. 16-bit retro style.
Muted colors matching the game palette.

# MÖBEL/OBJEKT
A pixel art game asset. Soviet-era [OBJECT].
[MATERIAL] material. [CONDITION] condition.
[SIZE]px. Transparent background.
16-bit retro style. Side view.
```

---

## Nächste Schritte

### Phase 1: Style Anchor etablieren (1-2 Assets manuell)
- [ ] Einen Basis-Raum erstellen (player_office)
- [ ] Eine NPC-Figur erstellen (hacker)
- [ ] Diese als Referenz für alle weiteren Assets nutzen

### Phase 2: Gebäude-Grundstruktur
- [ ] Etagen-Übersicht erstellen
- [ ] Aufzug-System implementieren
- [ ] Navigation zwischen Räumen

### Phase 3: Räume befüllen
- [ ] Cyber-Lab
- [ ] Analysis-Büro
- [ ] Media-Center
- [ ] Command-Center

### Phase 4: NPCs & Animationen
- [ ] Alle NPC-Sprites
- [ ] Ambient-Animationen
- [ ] Interaktions-Feedback

---

## Quellen

- [TVTower (GitHub)](https://github.com/TVTower/TVTower) - MadTV-Klon mit modularer Asset-Struktur
- [Isometric NYC](https://cannoneyed.com/projects/isometric-nyc) - KI-gestützte Spielentwicklung
- [Isometric City Asset-Sheet Skill](https://github.com/amilich/isometric-city/blob/main/skills/adding-asset-sheets.md) - Sprite-Sheet-Workflow
- [PC Gamer: Isometric NYC](https://www.pcgamer.com/software/ai/software-engineer-creates-classic-simcity-style-map-of-nyc-and-argues-that-ai-is-good-for-creatives-actually/) - AI Workflow Insights
