# Sprite-Tool Konzept

Ein Browser-basiertes Tool zur KI-gestützten Erstellung von Spielgrafiken
für den Story Mode des Disinfo-Spiels.

---

## Kernidee

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SPRITE STUDIO                                     │
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   PROMPT     │    │   GENERATE   │    │   REFINE     │              │
│  │   ASSISTANT  │ -> │   & PREVIEW  │ -> │   & EXPORT   │              │
│  │   (Claude)   │    │ (NanoBanana) │    │  (Inpaint)   │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                   │                   │                       │
│         ▼                   ▼                   ▼                       │
│  Kennt Spiel-Kontext   Generiert Bilder    Markieren & Korrigieren     │
│  Verbessert Prompts    Referenz-Bilder     Annotation mit Text         │
│  Schlägt Stile vor     Thinking Mode       Mask-free Editing           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Warum dieses Tool?

| Problem | Lösung |
|---------|--------|
| Text-only Interface (Claude Code) kann keine Bilder zeigen | Browser-Tool mit visueller Preview |
| Generische KI-Prompts erzeugen inkonsistente Ergebnisse | Claude kennt den Spiel-Kontext (Sowjet-Ästhetik, Charaktere) |
| Iteratives Korrigieren ist mühsam | Inpainting: nur Teile ändern, Rest behalten |
| Sprite-Sheets brauchen präzise Anordnung | Integrierter Sheet-Editor |

---

## Nano Banana Pro - Relevante Features

Basierend auf der Recherche:

### 1. Referenz-Bilder (bis zu 8)
```
Perfekt für: Konsistente Charaktere über mehrere Sprites
Workflow:   Einmal Basis-Charakter erstellen → als Referenz für alle Posen
```

### 2. Inpainting mit Masken
```
Perfekt für: Korrekturen ohne Neugenerierung
Workflow:   Bereich markieren → beschreiben was sich ändern soll
            "Ändere nur den Arm zu einer Wink-Pose"
```

### 3. Mask-free Inpainting
```
Perfekt für: Schnelle Änderungen per Text
Workflow:   Bild + Text-Anweisung, KI erkennt Bereich automatisch
            "Füge dem Charakter eine Brille hinzu"
```

### 4. Thinking Mode
```
Perfekt für: Komplexe Kompositionen (Büro-Szenen, Gebäude)
Workflow:   Aktivieren für präzisere Ergebnisse bei vielen Elementen
```

### 5. Seed-Kontrolle
```
Perfekt für: Batch-Generierung im gleichen Stil
Workflow:   Seed speichern → gleicher Stil für alle Assets
```

---

## Tool-Architektur

### Komponenten

```
sprite-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Haupt-Interface
│   │   ├── api/
│   │   │   ├── claude/route.ts   # Prompt-Verbesserung
│   │   │   ├── generate/route.ts # Nano Banana Pro API
│   │   │   └── inpaint/route.ts  # Inpainting API
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── PromptAssistant.tsx   # Claude-gestützter Prompt-Editor
│   │   ├── ImageCanvas.tsx       # Hauptansicht mit Zoom/Pan
│   │   ├── MaskEditor.tsx        # Inpainting-Masken zeichnen
│   │   ├── AnnotationLayer.tsx   # Notizen anheften
│   │   ├── ReferenceGallery.tsx  # Referenz-Bilder verwalten
│   │   ├── SpriteSheetGrid.tsx   # Frames anordnen
│   │   ├── AnimationPreview.tsx  # Animation abspielen
│   │   └── ExportDialog.tsx      # PNG/JSON Export
│   │
│   ├── lib/
│   │   ├── nanoBanana.ts         # API-Wrapper
│   │   ├── claude.ts             # Claude API für Prompts
│   │   ├── gameContext.ts        # Spiel-spezifischer Kontext
│   │   └── spriteSheet.ts        # Sheet-Utilities
│   │
│   └── types/
│       └── index.ts
│
├── public/
│   └── context/                  # Spiel-Kontext für Claude
│       ├── style-guide.md        # Visuelle Richtlinien
│       ├── characters.md         # NPC-Beschreibungen
│       └── reference-images/     # Beispiel-Assets
│
└── package.json
```

### Tech Stack

- **Next.js 14** (App Router) - wie das Sprite-Sheet-Creator Repo
- **React 18** + TypeScript
- **Tailwind CSS** - schnelles Styling
- **Claude API** - Prompt-Engineering
- **Nano Banana Pro API** (Google AI) - Bildgenerierung

---

## Screens & Workflow

### Screen 1: Projekt-Auswahl

```
┌─────────────────────────────────────────────────────────────────┐
│  SPRITE STUDIO                                    [Einstellungen]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Was möchtest du erstellen?                                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │              │  │              │  │              │          │
│  │  🚶 SPRITE   │  │  🏢 SZENE    │  │  🖼️ ELEMENT  │          │
│  │    SHEET     │  │   (Büro/    │  │   (Möbel,   │          │
│  │  (Charakter  │  │   Gebäude)  │  │   Props)    │          │
│  │   Animation) │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  Letzte Projekte:                                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🚶 Spielfigur_v2.sprite    │  gestern  │  [Öffnen]    │    │
│  │ 🏢 TechnikBuero.scene      │  vor 3d   │  [Öffnen]    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 2: Prompt Assistant (Claude-Integration)

```
┌─────────────────────────────────────────────────────────────────┐
│  SPRITE SHEET > Spielfigur                       [<] [Generieren]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DEIN PROMPT:                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Ein Büroangestellter im sowjetischen Stil, der durch ein   │ │
│  │ Gebäude läuft                                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ CLAUDE ASSISTANT ─────────────────────────────────────────┐ │
│  │                                                             │ │
│  │ Ich verbessere deinen Prompt für den Spiel-Kontext:       │ │
│  │                                                             │ │
│  │ VERBESSERTER PROMPT:                                       │ │
│  │ ┌─────────────────────────────────────────────────────┐   │ │
│  │ │ A 32x32 pixel art character sprite sheet.            │   │ │
│  │ │ Soviet-era office worker in grey suit, carrying      │   │ │
│  │ │ briefcase. Brutalist aesthetic matching the game's   │   │ │
│  │ │ visual style. 8 frames horizontal walk cycle.        │   │ │
│  │ │ Muted colors: grey, olive, red accents.              │   │ │
│  │ │ Transparent background. Side view.                   │   │ │
│  │ └─────────────────────────────────────────────────────┘   │ │
│  │                                                             │ │
│  │ VORSCHLÄGE:                                                │ │
│  │ [+ Aktentasche hinzufügen]  [+ Hut hinzufügen]            │ │
│  │ [+ Nervöser Ausdruck]       [+ Militär-Stil]              │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  EINSTELLUNGEN:                                                 │
│  Auflösung: [32x32 ▼]  Frames: [8 ▼]  Stil: [Pixel Art ▼]     │
│  [x] Thinking Mode    [ ] Seed fixieren: [_______]            │
│                                                                  │
│  REFERENZ-BILDER (0/8):                                        │
│  [+ Hinzufügen]                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 3: Generierung & Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  SPRITE SHEET > Spielfigur > Generierung         [<] [Speichern]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ GENERIERTE VARIANTEN ───────────────────────────────────┐  │
│  │                                                           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │  │
│  │  │ VAR 1   │  │ VAR 2   │  │ VAR 3   │  │ VAR 4   │    │  │
│  │  │ ░░██░░  │  │ ░░██░░  │  │ ░░██░░  │  │ ░░██░░  │    │  │
│  │  │ ░████░  │  │ ░████░  │  │ ░████░  │  │ ░████░  │    │  │
│  │  │  ⬤ ⬤   │  │  ⬤ ⬤   │  │  ⬤ ⬤   │  │  ⬤ ⬤   │    │  │
│  │  │ [Wählen]│  │ [Wählen]│  │ [Wählen]│  │ [Wählen]│    │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │  │
│  │                                                           │  │
│  │  [Mehr generieren]  [Mit Seed regenerieren]              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ ANIMATION PREVIEW ──────────────────────────────────────┐  │
│  │                                                           │  │
│  │            ░░██░░                                        │  │
│  │            ░████░    FPS: [12 ▼]                         │  │
│  │             ⬤ ⬤                                          │  │
│  │                       [▶ Play] [⏸ Pause] [⏮ Reset]      │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Weiter zu Bearbeitung →]                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 4: Inpainting & Annotation

```
┌─────────────────────────────────────────────────────────────────┐
│  SPRITE SHEET > Spielfigur > Bearbeitung         [<] [Speichern]│
├─────────────────────────────────────────────────────────────────┤
│  WERKZEUGE:                                                      │
│  [🖌️ Maske] [📝 Annotation] [🔍 Zoom] [↩️ Undo]                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ CANVAS (Zoom: 400%) ────────────────────────────────────┐  │
│  │                                                           │  │
│  │         ░░░░██████░░░░                                   │  │
│  │         ░░████████░░░░                                   │  │
│  │         ░░░░⬤░░⬤░░░░   ← 📝 "Augen größer machen"       │  │
│  │         ░░░░░██░░░░░░                                    │  │
│  │         ░░░██████░░░░   ← [MASKE: rot markiert]          │  │
│  │         ░░██░░░░██░░░                                    │  │
│  │         ░░██░░░░██░░░                                    │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ INPAINT-ANWEISUNG ──────────────────────────────────────┐  │
│  │ Ändere den markierten Bereich (Torso) zu einer          │  │
│  │ leicht nach vorne gebeugten Haltung                      │  │
│  │                                                           │  │
│  │ [Inpaint ausführen]                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ANNOTATIONEN:                                                  │
│  • "Augen größer machen" (Frame 1)                             │
│  • "Arm-Position anpassen" (Frame 3-4)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 5: Sprite Sheet Editor

```
┌─────────────────────────────────────────────────────────────────┐
│  SPRITE SHEET > Spielfigur > Sheet-Editor        [<] [Export]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ANIMATION: Walk Cycle                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐│   │
│  │  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │ 5  │ │ 6  │ │ 7  │ │ 8  ││   │
│  │  │ 🚶 │ │ 🚶 │ │ 🚶 │ │ 🚶 │ │ 🚶 │ │ 🚶 │ │ 🚶 │ │ 🚶 ││   │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘│   │
│  │  [Drag to reorder]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ANIMATION: Idle                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                            │   │
│  │  │ 1  │ │ 2  │ │ 3  │ │ 4  │  [+ Frame hinzufügen]     │   │
│  │  │ 🧍 │ │ 🧍 │ │ 🧍 │ │ 🧍 │                            │   │
│  │  └────┘ └────┘ └────┘ └────┘                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [+ Neue Animation hinzufügen]                                  │
│                                                                  │
│  EXPORT-VORSCHAU:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████████████████████████████│   │
│  │ (256x64px, 2 rows, 12 total frames)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Export als PNG]  [Export mit JSON-Metadaten]                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Spiel-Kontext für Claude

Der Prompt-Assistant braucht Kontext über das Spiel. Diese Datei wird
an Claude übergeben:

```markdown
# Disinfo-Spiel: Visueller Stil-Guide

## Ästhetik
- Sowjet-Brutalismus der 1970er-80er Jahre
- Gedeckte Farben: Grau, Olive, Rostrot, Beige
- Akzentfarben: Sowjet-Rot (#B22234), Warnung-Gelb (#FFD700)
- Pixel-Art im 16-bit Retro-Stil

## Charaktere

### Spielfigur (Protagonist)
- Mittleres Alter, neutraler Ausdruck
- Grauer Anzug, Aktentasche
- Sowjetischer Bürokrat-Look

### NPCs
1. **Der Hacker** - Jung, Kapuzenpulli, Brille, nervös
2. **Die Analystin** - Professionell, Blazer, Datenblätter
3. **Der Medien-Typ** - Charismatisch, modischer Anzug
4. **Der General** - Älter, Uniform, strenger Blick

## Räume
- Betonwände, Neonlicht
- Alte Monitore, Kabel, Aktenschränke
- Sowjet-Propaganda-Poster als Deko
- Ventilatoren, Telefone mit Schnur

## Animationen
- Subtil, nicht übertrieben
- 4-8 Frames pro Cycle
- Langsame Bewegungen (Bürokratie-Gefühl)
```

---

## API-Integration

### Claude API (Prompt-Verbesserung)

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function improvePrompt(
  userPrompt: string,
  assetType: 'sprite' | 'scene' | 'element',
  gameContext: string
): Promise<{
  improvedPrompt: string;
  suggestions: string[];
}> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `Du bist ein Experte für Bild-KI-Prompts, spezialisiert auf Pixel-Art
für Spiele. Du kennst den visuellen Stil des Disinfo-Spiels:

${gameContext}

Verbessere User-Prompts für Nano Banana Pro (Google's Bild-KI).
Füge technische Details hinzu (Auflösung, Transparenz, Stil).
Schlage Variationen vor.`,
    messages: [{
      role: 'user',
      content: `Asset-Typ: ${assetType}\nUser-Prompt: ${userPrompt}`
    }]
  });

  // Parse response...
  return { improvedPrompt, suggestions };
}
```

### Nano Banana Pro API (Bildgenerierung)

```typescript
// lib/nanoBanana.ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY });

export async function generateImage(options: {
  prompt: string;
  referenceImages?: string[];  // base64
  aspectRatio?: string;
  thinkingMode?: boolean;
  seed?: number;
}): Promise<string> {  // returns base64 image

  const model = ai.getGenerativeModel({
    model: 'gemini-3-pro-image-preview'  // Nano Banana Pro
  });

  const request: any = {
    contents: [{
      parts: [{ text: options.prompt }]
    }],
    generationConfig: {
      responseModalities: ['image'],
      aspectRatio: options.aspectRatio || '1:1',
    }
  };

  // Add reference images
  if (options.referenceImages?.length) {
    request.contents[0].parts.unshift(
      ...options.referenceImages.map(img => ({
        inlineData: { mimeType: 'image/png', data: img }
      }))
    );
  }

  // Enable thinking mode for complex compositions
  if (options.thinkingMode) {
    request.generationConfig.thinkingConfig = { enabled: true };
  }

  const response = await model.generateContent(request);
  return response.response.candidates[0].content.parts[0].inlineData.data;
}

export async function inpaintImage(options: {
  image: string;       // base64
  mask?: string;       // base64 (optional for mask-free)
  prompt: string;
}): Promise<string> {

  const model = ai.getGenerativeModel({
    model: 'gemini-3-pro-image-preview'
  });

  const parts: any[] = [
    { inlineData: { mimeType: 'image/png', data: options.image } },
    { text: options.prompt }
  ];

  if (options.mask) {
    parts.splice(1, 0, {
      inlineData: { mimeType: 'image/png', data: options.mask }
    });
  }

  const response = await model.generateContent({
    contents: [{ parts }],
    generationConfig: { responseModalities: ['image'] }
  });

  return response.response.candidates[0].content.parts[0].inlineData.data;
}
```

---

## Beispiel-Workflow

### Spielfigur erstellen

```
1. User wählt "Sprite Sheet"
2. User gibt ein: "Ein Büroangestellter der läuft"

3. Claude verbessert zu:
   "A 32x32 pixel art character sprite sheet. Soviet-era office worker
   in grey suit, briefcase in hand. 8-frame horizontal walk cycle.
   Brutalist aesthetic, muted colors (grey, olive, red accents).
   Transparent background. Side view facing right."

4. Nano Banana Pro generiert 4 Varianten
5. User wählt beste Variante

6. User sieht Animation-Preview, bemerkt: Arm sieht komisch aus
7. User zeichnet Maske über Arm-Bereich
8. User schreibt: "Arm natürlicher, mehr geschwungen beim Gehen"
9. Inpainting korrigiert nur den Arm

10. User fügt Annotation hinzu: "Vielleicht Hut hinzufügen?"
11. Später: Mask-free Inpaint mit "Füge einen kleinen Hut hinzu"

12. Export als PNG + JSON mit Frame-Koordinaten
```

### Büro-Szene erstellen

```
1. User wählt "Szene"
2. User gibt ein: "Das Technik-Büro mit Servern"

3. Claude verbessert zu:
   "A pixel art game background scene. Soviet-era computer room.
   Multiple server racks with blinking LEDs. CRT monitors showing
   green text. Concrete walls, fluorescent lighting. Cable bundles
   on floor. 800x600px. Brutalist aesthetic."

4. Nano Banana Pro generiert mit Thinking Mode (komplexe Szene)
5. User wählt, korrigiert Details per Inpainting
6. Export als statisches Hintergrundbild
```

---

## MVP-Scope (Phase 1)

Minimal funktionsfähiges Tool:

- [ ] Projekt-Auswahl (Sprite/Szene/Element)
- [ ] Prompt-Eingabe mit Claude-Verbesserung
- [ ] Bildgenerierung mit Nano Banana Pro
- [ ] 4 Varianten anzeigen
- [ ] Einfache Masken-Zeichnung
- [ ] Inpainting
- [ ] PNG-Export

**Nicht in MVP:**
- Animation-Preview
- Sprite-Sheet-Editor mit Drag&Drop
- Annotation-System
- Projekt-Speicherung

---

## Technische Anforderungen

### API Keys benötigt
1. **Claude API Key** (Anthropic) - für Prompt-Verbesserung
2. **Google AI API Key** - für Nano Banana Pro

### Kosten-Schätzung (pro Asset)
- Claude Sonnet: ~$0.003 pro Prompt-Verbesserung
- Nano Banana Pro: ~$0.04 pro Bild (1024x1024)
- Inpainting: ~$0.02 pro Edit

→ Ca. $0.10-0.20 pro fertiges Asset mit Iterationen

---

## Nächste Schritte

1. **Entscheidung**: MVP-Scope bestätigen
2. **Setup**: Next.js Projekt im Repo erstellen
3. **APIs**: Keys beschaffen und testen
4. **UI**: Basis-Interface bauen
5. **Integration**: Claude + Nano Banana Pro anbinden
6. **Test**: Erste Spielfigur generieren

---

## Quellen

- [Nano Banana Pro Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Google Blog: Nano Banana Pro](https://blog.google/technology/ai/nano-banana-pro/)
- [Sprite Sheet Generation Guide](https://lab.rosebud.ai/blog/how-to-create-a-sprite-sheet-with-ai-using-google-gemini-and-nano-banana-easy-guide)
- [Inpainting Tutorial](https://pixpretty.tenorshare.ai/ai-generator/how-to-use-nano-banana-pro-inpaint.html)
- [Game Assets Generation](https://help.apiyi.com/nano-banana-pro-game-assets-generation-en.html)
