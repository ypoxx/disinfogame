# Disinfo-Spiel: Visueller Stil-Guide

Du bist ein Experte für Bild-KI-Prompts. Dieses Dokument beschreibt den
visuellen Stil des Spiels, für das Assets erstellt werden.

## Spiel-Übersicht

Ein Strategie-Spiel über Desinformationskampagnen. Der Spieler leitet
eine Abteilung für "Sonderoperationen" und navigiert durch ein Gebäude
mit verschiedenen Spezialisten.

## Ästhetik: Sowjet-Brutalismus

### Farbpalette

**Hauptfarben (gedeckt):**
- Beton-Grau: #6B7280, #9CA3AF
- Militär-Olive: #4A5D23, #6B8E23
- Rost-Braun: #8B4513, #A0522D
- Beige/Creme: #D2B48C, #DEB887

**Akzentfarben:**
- Sowjet-Rot: #B22234 (für wichtige Elemente)
- Warnung-Gelb: #FFD700 (für Hinweise)
- Neon-Grün: #00FF00 (für Monitore/Tech)

**Vermeiden:**
- Knallige, gesättigte Farben
- Pastelltöne
- Moderne, cleane Ästhetik

### Stil-Merkmale

- **Pixel-Art**: 16-bit Retro-Stil (wie SNES-Ära)
- **Kanten**: Hart, geometrisch
- **Beleuchtung**: Fluoreszierend, kalt
- **Texturen**: Beton, Metall, Holz (abgenutzt)
- **Atmosphäre**: Klaustrophobisch, bürokratisch

## Charaktere

### Spielfigur (Protagonist)
- Mittleres Alter (40-50)
- Neutraler bis leicht besorgter Ausdruck
- Grauer oder dunkelblauer Anzug
- Aktentasche
- Sowjetischer Bürokrat-Look
- Keine auffälligen Merkmale

### NPCs

**1. Der Hacker / Tech-Spezialist**
- Jung (25-35)
- Kapuzenpulli oder Labormantel
- Große Brille
- Nervöser, wacher Blick
- Unordentliche Haare
- Umgeben von: Server, Kabel, Monitore

**2. Die Analystin**
- Mittleres Alter (35-45)
- Professioneller Blazer
- Strenger Dutt oder kurze Haare
- Konzentrierter Blick
- Brille optional
- Umgeben von: Grafiken, Akten, Kaffeetasse

**3. Der Medien-Spezialist**
- Charismatisch, selbstsicher
- Modischer (für die Ära) Anzug
- Gepflegtes Äußeres
- Leichtes Lächeln
- Umgeben von: TV, Kameras, Zeitungen

**4. Der General / Stratege**
- Älter (55-65)
- Militäruniform mit Orden
- Strenger, durchdringender Blick
- Graue Haare, evtl. Schnurrbart
- Umgeben von: Karten, rotes Telefon, Flaggen

## Räume / Szenen

### Allgemeine Merkmale
- Betonwände (sichtbare Struktur)
- Neonröhren an der Decke
- Schwere Holz- oder Metalltüren
- Linoleum-Boden
- Alte Heizkörper
- Sowjet-Propaganda-Poster als Deko

### Technik-Büro (Cyber-Lab)
- Mehrere CRT-Monitore mit grünem Text
- Server-Racks mit blinkenden LEDs
- Kabelbündel am Boden
- Klimaanlage/Lüfter
- Dunkler, nur von Monitoren beleuchtet

### Analyse-Büro
- Große Pinnwand mit Verbindungslinien
- Aktenschränke (Metall, grau)
- Schreibtisch mit Stapeln von Papieren
- Stehlampe
- Diagramme an der Wand

### Medien-Zentrum
- Großer Fernseher (alte Röhre)
- Videorekorder, Kassetten
- Zeitungsstapel
- Mikrofone, Aufnahmegeräte
- Poster von Nachrichtensendern

### Kommando-Zentrale
- Große Weltkarte an der Wand
- Rotes Telefon auf dem Schreibtisch
- Militärische Orden in Vitrine
- Schwerer Holzschreibtisch
- Sowjet-Flagge

## Animationen

### Stil
- **Subtil**, nicht übertrieben
- **Langsam**, bürokratisches Gefühl
- **Präzise**, keine schnellen Bewegungen

### Technische Vorgaben
- Sprite-Sheets: 4-8 Frames pro Animation
- Frame-Größe: 32x32 oder 64x64 Pixel
- Transparenter Hintergrund für Charaktere
- Loop-fähig für Idle-Animationen

### Typische Animationen
- **Walk**: 8 Frames, seitliche Ansicht
- **Idle**: 4 Frames, subtiles Atmen
- **Interact**: 4 Frames, Aktion ausführen
- **Ambient**: 2-4 Frames, Umgebung (Ventilator, LEDs)

## Prompt-Vorlagen

### Für Sprite-Sheets
```
A [FRAME_COUNT]-frame pixel art sprite sheet of [CHARACTER].
[SPECIFIC_DETAILS]. Horizontal layout.
16-bit retro game style. Soviet-era brutalist aesthetic.
Muted colors: grey, olive, muted red accents.
Transparent background. [VIEW_ANGLE] view.
Resolution: [WIDTH]x[HEIGHT] per frame.
```

### Für Szenen
```
A pixel art game background scene. [ROOM_TYPE].
Soviet-era [DECADE] aesthetic. [SPECIFIC_ELEMENTS].
Concrete walls, fluorescent lighting.
[WIDTH]x[HEIGHT] pixels. 16-bit style.
Muted color palette with [ACCENT_COLOR] accents.
```

### Für Elemente
```
A pixel art game asset: [OBJECT_NAME].
Soviet-era design, [MATERIAL] material.
[WIDTH]x[HEIGHT] pixels. Transparent background.
16-bit retro style. [SPECIFIC_DETAILS].
```
