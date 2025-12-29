# Story Mode - Visual Design Spezifikation

Alle Entscheidungen zu Grafiken, UI/UX, Animationen und visueller Darstellung.

---

## Übersicht

| Aspekt | Entscheidung | Referenz |
|--------|--------------|----------|
| Kunststil | Isometrisch 2.5D Diorama | Antwort #53 |
| Fotorealismus | NEIN | Antwort #53 |
| Priorität | Mechanik > Narrative > Visuals | Antwort #86 |
| Budget | Minimal | Antwort #82 |
| Assets | KI-generiert + Open Source | Antwort #81 |

---

## Art Style

### Kernprinzipien

**Stil:** Isometrische 2D-„2.5D"-Rasterillustration (Diorama)
- Gebackenes Licht und Ambient Occlusion
- Flat/Vektor-UI als scharfer, skalierbarer Overlay-Layer

**Kernregel:** Kamera/Winkel/Lichtrichtung sind FIX
- Konsistenz ist wichtiger als Detail
- Keine Kameraschwenks (würden baked lighting brechen)

**Content-Strategie:**
- Wenige Hero-Räume statt riesigem Tileset
- Variation über Props, Decals, Screen-Content, Farbvarianten

---

## Räume & Hintergründe

### Konzept

```
Raum-Progression (via Tür freigeschaltet):
├── Büro (Start) - Isometrisch
├── [Weitere Räume später] - Nach MVP
```

### Technische Umsetzung

| Element | Format | Auflösung |
|---------|--------|-----------|
| Hintergrund | Statisches Bild (Backplate) | @2x |
| Interaktables | Separate Sprites/Layers | Individuell |
| UI-Elemente | Vektor-basiert / 9-slice | Skalierbar |

**Wichtig:** Sorting/Occlusion früh definieren!

### Fallback

Falls isometrisch zu aufwändig wird:
- 2D-Ansicht als Alternative (Antwort #60)
- Hybrid: Isometrisch im Raum, 2D für UI/Overlays

---

## Tag/Nacht-Zyklus

**Status:** ✅ Angenommen (Antwort #56)
**Aufwand:** Gering

### Implementierung

| Tageszeit | Farbton | Beschreibung |
|-----------|---------|--------------|
| Morgen | Warm/Orange | Sanftes Morgenlicht |
| Mittag | Neutral | Standard-Beleuchtung |
| Abend | Golden | Warmes Abendlicht |
| Nacht | Blau/Kalt | Lampen an, Monitore leuchten |

**Technik:** CSS-Filter/Overlay auf Hintergrund-Layer

```css
/* Beispiel-Implementierung */
.room-background--morning { filter: sepia(0.2) brightness(1.1); }
.room-background--evening { filter: sepia(0.3) saturate(1.2); }
.room-background--night { filter: brightness(0.6) saturate(0.8) hue-rotate(20deg); }
```

---

## NPC-Portraits

**Status:** ✅ Entschieden (Antwort #55)

### Stil

- **Format:** Pixel Art Portraits
- **Generierung:** KI-generiert (einmalig)
- **Konsistenz:** Einheitlicher Stil über alle NPCs
- **Animation:** KEINE (statische Portraits)

### Anforderungen

- Mindestens 5 verschiedene Charaktere
- Erkennbare Persönlichkeit im Design
- Passend zum dokumentarisch-ernsten Ton

---

## UI/UX Design

### Navigation

**Typ:** Hybrid (Antwort #63)
- Diegetic UI wo sinnvoll (Büro-Objekte klickbar)
- NICHT übertreiben - kritisch evaluieren
- Klassische Overlays für komplexe Interaktionen

**Bestehende Lösung:**
HTML-Script für manuelle Koordinaten-Auswahl (funktioniert bereits)

### HUD

**Status:** ✅ Ja, HUD vorhanden (Antwort #64)

```
┌─────────────────────────────────────────┐
│  [Ressourcen]              [Zeit/Tag]   │  ← Persistent HUD
├─────────────────────────────────────────┤
│                                         │
│           [Spielbereich]                │
│                                         │
├─────────────────────────────────────────┤
│  [Kontextuelle Einblendungen]           │  ← Für Details/Narrative
└─────────────────────────────────────────┘
```

### Fortschrittsanzeige

**Status:** Ja, aber sparsam (Antwort #65)
- Keine detaillierte Timeline
- Minimale Kapitel-/Phasen-Anzeige

### Dialog-System

**Stil:** Visual Novel (Antwort #68)
- Portrait + Textbox
- Einfachste Variante mit größtem Effekt

```
┌─────────────────────────────────────────┐
│  [Raum-Hintergrund]                     │
│                                         │
├────────────┬────────────────────────────┤
│ [Portrait] │ "Dialog-Text hier..."      │
│  (NPC)     │                            │
│            │ [Option A] [Option B]      │
└────────────┴────────────────────────────┘
```

### News/Ereignisse

**Format:** Klickbare Liste (Antwort #78)
- KEIN animierter Ticker
- Klare Unterscheidung: Neu vs. Alt
- Zeigt: Reaktionen, Warnsignale, Konsequenzen

### Konsequenzen-Anzeige

**Timing:** Nach der Entscheidung (Antwort #70)
- Spieler lernt "auf die harte Tour"
- ABER: Andeutungsweise Hinweise vorher
- Weniger spezifisch, mehr suggestiv

---

## Interaktionen

### Eingabemethoden

**Unterstützt:** (Antwort #67)
- Maus
- Tastatur (Shortcuts)
- Touch

### Hervorhebung interaktiver Elemente

**Aufwand:** Gering (Antwort #61)
- Cursor-Wechsel bei Hover
- Subtiles Highlighting
- KEIN aufwändiges Glühen

### Hover-/Klick-Feedback

**Status:** ✅ Ja (Antwort #73)
- Hover-Effekte: Ja
- Klick-Feedback: Ja
- Sound-Feedback: Ja (minimal)

---

## Animationen

### Was wird animiert

| Element | Animation | Status |
|---------|-----------|--------|
| Hover-Effekte | Ja | ✅ MVP |
| Klick-Feedback | Ja | ✅ MVP |
| Übergänge zwischen Screens | Fade | ✅ MVP |
| NPC-Portraits | NEIN (statisch) | ✅ |
| UI-Mikro-Animationen | Wahrscheinlich nicht | ⚠️ Aufwand |
| Atmosphärische Loops | Ja (niedrige Priorität) | 💡 Nice-to-have |

### Atmosphärische Mikro-Animationen

**Status:** Nice-to-have (Antwort #73)
**Technik:** Tween/Opacity/UV-Scroll

Mögliche Elemente:
- Monitor-Flackern
- LED-Blinken
- Partikel (Staub im Licht)
- Sanfter Glow auf aktiven Elementen

### Tagesübergänge

**Status:** Fade (Antwort #75)
- Einfacher Überblendeffekt
- Keine aufwändige Animation

### Erfolg/Misserfolg-Feedback

**Status:** Minimal (Antwort #76)
- Sound: Ja
- Visuell: Text/Kontextuelle Bereiche
- KEIN Konfetti/aufwändige Effekte

---

## Cutscenes

**Status:** ✅ Ja, aber minimal (Antwort #58)

### Format

- Text mit einer Illustration
- Optional: Musik im Hintergrund
- KEINE Animation

### Anwendung

- Intro
- Kapitelübergänge (falls vorhanden)
- Wichtige Story-Momente
- Ende

---

## Screen-Größen

### Priorität

1. **Desktop** (primär) - Antwort #59
2. **Mobile/Responsive** (vorbereitet)

### Anforderungen

- Desktop-first Design
- Mobile-responsive von Anfang an technisch vorbereiten
- Mindestbreite definieren

### Technische Umsetzung

```css
/* Beispiel Breakpoints */
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 768px) { /* Tablet */ }
@media (max-width: 767px) { /* Mobile */ }
```

---

## Accessibility

**Status:** ✅ Pflicht von Anfang an (Antwort #30, #66)

### Anforderungen

| Feature | Status |
|---------|--------|
| Screen-Reader-Support | ✅ Pflicht |
| Tastatur-Navigation | ✅ Pflicht |
| Schriftgrößen-Optionen | 💡 Später |
| Farbblind-Modi | 💡 Später |

### Implementierung

- Semantic HTML
- ARIA-Labels
- Focus-States
- Tab-Reihenfolge
- Alt-Texte für Bilder

---

## Asset-Pipeline

### Generierung

| Asset-Typ | Quelle |
|-----------|--------|
| Hintergründe | KI-generiert |
| NPC-Portraits | KI-generiert (Pixel Art) |
| UI-Elemente | Open Source / Selbst erstellt |
| Icons | Open Source |
| Props/Decals | KI-generiert |

### Konsistenz-Sicherung

- AI-Generierung mit Style-Constraints
- Einheitliches Color-Grading/Grain am Ende
- Style-Guide erstellen

### Tools (vorgeschlagen)

- **Bilder:** Midjourney, DALL-E, Stable Diffusion
- **Nachbearbeitung:** Photoshop, GIMP
- **Vektor:** Figma, Inkscape

---

## Sound-Design

**Status:** Wichtig, aber nicht PlayStation-Level (Antwort #29)

### Elemente

| Sound | Priorität |
|-------|-----------|
| Atmosphäre (Ventilator, Hintergrund) | Mittel |
| Klick-Sounds | Hoch |
| Erfolg/Misserfolg | Hoch |
| Musik | Mittel |

### Generierung

- KI-Tools (ElevenLabs, Suno)
- Open Source Sounds

---

## Branding

### Story Mode vs. Wargaming

**Unterscheidung:** Nur durch Grafik (Antwort #62)
- KEIN separates Logo
- Visueller Stil ist die Differenzierung

---

## Performance

### Budget

**Erwartung:** Niedrig (Antwort #80)
- Geplante Animationen brauchen keine große Performance
- Ältere Browser/Geräte sollten unterstützt werden

### Optimierungen

- Bilder komprimiert (@1x und @2x)
- Lazy Loading für nicht-sichtbare Elemente
- CSS-Animationen statt JavaScript wo möglich

---

## Zusammenfassung für MVP

### Must-Have

- [ ] Isometrischer Büro-Raum (oder 2D-Fallback)
- [ ] 5 NPC-Portraits (Pixel Art)
- [ ] Day/Night-Cycle (CSS-Filter)
- [ ] Visual Novel Dialog-System
- [ ] HUD mit Ressourcen/Zeit
- [ ] Klickbare News-Liste
- [ ] Fade-Übergänge
- [ ] Hover/Klick-Feedback
- [ ] Accessibility-Grundlagen

### Nice-to-Have

- [ ] Atmosphärische Mikro-Animationen
- [ ] Sound-Atmosphäre
- [ ] Props-Variation

### Explizit NICHT im MVP

- Animierte NPC-Portraits
- Animierte Übergänge
- Animierter News-Ticker
- UI-Mikro-Animationen
- Mehrere Räume (nur Vorbereitung)
