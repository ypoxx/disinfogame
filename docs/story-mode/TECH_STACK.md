# Story Mode - Technische Architektur

Alle technischen Entscheidungen, Bibliotheken und Architektur-Patterns.

---

## Übersicht

| Aspekt | Entscheidung | Referenz |
|--------|--------------|----------|
| Plattform | Web | Antwort #43 |
| Framework | React (bestehend) | Codebase |
| Entwicklung | Solo + Claude Code | Antwort #84 |
| Budget | Minimal, nur Free/Open Source | Antwort #82, #34 |
| Priorität | Mechanik > Narrative > Visual | Antwort #86 |

---

## Architektur-Prinzipien

### Synchrone Engine-Entwicklung

**Entscheidung:** D-T002

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE ENGINE                              │
│  (Algorithmen, Konsequenzen, Dynamiken, Seed-System)        │
├─────────────────────────────────────────────────────────────┤
│                           ▲                                  │
│                           │                                  │
│         ┌─────────────────┴─────────────────┐               │
│         │                                   │                │
│   ┌─────▼─────┐                     ┌──────▼──────┐         │
│   │ Wargaming │                     │ Story Mode  │         │
│   │    UI     │                     │     UI      │         │
│   │ (Graph)   │                     │ (Narrative) │         │
│   └───────────┘                     └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**Wichtig:**
- Keine zwei separaten Spiele
- Story Mode entwickelbar ohne totale Abhängigkeit vom Wargaming
- StoryEngineAdapter als Brücke

### StoryEngineAdapter

**Pattern:** Facade/Adapter

```typescript
// Konzept (noch zu implementieren)
interface StoryEngineAdapter {
  // Story-spezifische Methoden
  advanceTime(): void;           // statt advanceRound
  getAvailableActions(): StoryAction[];
  executeAction(action: StoryAction): ActionResult;

  // NPC-bezogen
  getNPCStatus(npcId: string): NPCStatus;
  dialogWithNPC(npcId: string, choice: string): DialogResult;

  // Narrative
  getCurrentNarrative(): NarrativeContext;
  getSecondaryConsequences(): Consequence[];

  // Seed-System (nutzt bestehende Implementierung)
  getSeed(): string;
  setSeed(seed: string): void;
  resetWithSeed(seed: string): void;
}
```

---

## Internationalisierung (i18n)

**Entscheidung:** D-T005 - Deutsch + Englisch von Anfang an

### Empfohlene Bibliothek

**i18next** + **react-i18next**
- Lizenz: MIT ✅
- Standard in React-Projekten
- Gute TypeScript-Unterstützung

### Struktur

```
/locales
  /de
    common.json      # Allgemeine UI
    game.json        # Spielspezifisch
    npcs.json        # NPC-Dialoge
    events.json      # Ereignis-Texte
  /en
    common.json
    game.json
    npcs.json
    events.json
```

### Beispiel

```typescript
// Translation key
t('npc.marina.distrust.1')
// → DE: "Marina meidet deinen Blick"
// → EN: "Marina avoids eye contact"
```

---

## State Management

### Aktuelle Situation

Bestehende Codebase analysieren für vorhandenes State Management.

### Empfohlene Optionen

| Bibliothek | Lizenz | Für Story Mode geeignet? |
|------------|--------|--------------------------|
| Zustand | MIT ✅ | ✅ Leichtgewichtig, einfach |
| Jotai | MIT ✅ | ✅ Atomar, React-nativ |
| Redux | MIT ✅ | ⚠️ Möglicherweise Overkill |

**Empfehlung:** Zustand oder Jotai (was besser zur bestehenden Codebase passt)

---

## Animationen

### Anforderungen (gering)

- Hover-Effekte
- Klick-Feedback
- Fade-Übergänge
- Optional: Mikro-Animationen

### Empfohlene Optionen

| Bibliothek | Lizenz | Empfehlung |
|------------|--------|------------|
| Framer Motion | MIT ✅ | ✅ Beste React-Integration |
| react-spring | MIT ✅ | ✅ Physics-basiert |
| CSS Transitions | - | ✅ Für einfache Fälle ausreichend |
| GSAP | Eingeschränkt kostenlos | ⚠️ Lizenz prüfen |
| Lottie | Apache 2.0 ✅ | 💡 Falls komplexe Animationen nötig |

**Empfehlung für MVP:**
- CSS Transitions für einfache Effekte
- Framer Motion nur bei Bedarf

---

## Accessibility

**Entscheidung:** D-T006 - Von Anfang an einbauen

### Technische Anforderungen

```typescript
// Semantic HTML
<button> statt <div onClick>
<nav> statt <div className="nav">

// ARIA Labels
<button aria-label="Aktion ausführen">
<div role="dialog" aria-modal="true">

// Focus Management
<button tabIndex={0}>
<div tabIndex={-1}> // Programmatisch fokussierbar

// Screen Reader
aria-live="polite" // Für dynamische Updates
```

### Testing

- [ ] Tastatur-Navigation testen
- [ ] Screen Reader testen (NVDA, VoiceOver)
- [ ] Farbkontrast prüfen

---

## Speichersystem

### Lokal

**Entscheidung:** D-020 - Freies Speichern

```typescript
interface SaveGame {
  version: string;
  seed: string;
  timestamp: number;
  gameState: GameState;
  npcStates: Record<string, NPCState>;
  playerProgress: PlayerProgress;
}
```

**Speicherort:** localStorage (IndexedDB für größere Daten)

### Cloud Saves

**Entscheidung:** D-T004 - Falls machbar

**Optionen:**
1. Eigener Backend-Service
2. Firebase (kostenlose Stufe)
3. Supabase (Open Source)

**Für MVP:** localStorage ausreichend, Cloud später

---

## Seed-System

**Status:** ✅ Bereits implementiert

**Bestehende Komponenten:**
- `SeededRandom.ts` - Deterministisches RNG
- URL-Sharing mit `?seed=`
- API-Funktionen für Seed-Speicherung
- Reset-Funktion für Replay

**Nutzung im Story Mode:**
- Same-Seed für Verteidiger-Perspektive
- Strategie-Vergleich
- KEIN Leaderboard

---

## Modding-Support

**Entscheidung:** D-T008 - Architektonisch vorbereiten

### Datenstruktur

```
/scenarios
  /geopolitik            # MVP Szenario
    scenario.json        # Metadaten
    actors.json          # Akteure
    events.json          # Ereignisse
    npcs.json            # NPC-Definitionen
    consequences.json    # Konsequenz-Ketten
  /konzern               # Nächstes Szenario
    ...
```

### Schema-Validierung

JSON-Schema für Szenario-Validierung:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "version": { "type": "string" },
    "actors": { "type": "array" }
  },
  "required": ["id", "name", "version"]
}
```

---

## Build & Deploy

### Aktuell

Bestehende Build-Pipeline analysieren (Vite/Webpack/etc.)

### Empfehlung

- **Bundler:** Vite (schnell, modern)
- **Hosting:** Vercel, Netlify, oder GitHub Pages (kostenlos)
- **CI/CD:** GitHub Actions

---

## Bibliotheken-Empfehlungsliste

### Empfohlen (kostenlos, MIT/Apache)

| Bibliothek | Zweck | Lizenz | Empfehlung |
|------------|-------|--------|------------|
| i18next | Internationalisierung | MIT | ✅ Standard |
| Zustand | State Management | MIT | ✅ Leichtgewichtig |
| Framer Motion | Animationen | MIT | ✅ Falls nötig |
| react-spring | Animationen | MIT | ✅ Alternative |

### Bereits vorhanden (prüfen)

- React
- TypeScript
- CSS/Styling-Lösung

### Zu vermeiden

| Bibliothek | Grund |
|------------|-------|
| GSAP | Eingeschränkte Lizenz |
| Kommerzielle UI-Kits | Budget |

---

## Performance-Überlegungen

### Anforderungen

- Ältere Browser/Geräte unterstützen
- Mobile-Performance (falls responsive)

### Optimierungen

```typescript
// Lazy Loading für Routen
const StoryMode = React.lazy(() => import('./StoryMode'));

// Memoization für teure Berechnungen
const memoizedValue = useMemo(() => expensiveCalc(), [deps]);

// Image Optimization
<img
  src="room.webp"
  srcSet="room@1x.webp 1x, room@2x.webp 2x"
  loading="lazy"
/>
```

---

## Testing-Strategie

**Status:** Intern mit Freunden (Antwort #89)

### Typen

| Test-Typ | Priorität | Tool |
|----------|-----------|------|
| Manual Playtesting | Hoch | - |
| Unit Tests | Mittel | Vitest/Jest |
| E2E Tests | Niedrig | Playwright |

### Fokus für MVP

1. Spielmechanik funktioniert
2. Keine kritischen Bugs
3. Accessibility funktioniert

---

## Checklisten

### Open-Source-Checkliste (CL-001)

- [ ] **Lizenz wählen**
  - MIT: Permissiv, einfach
  - Apache 2.0: Mit Patent-Schutz
  - GPL: Copyleft (viral)
  - **Empfehlung:** MIT oder Apache 2.0

- [ ] **Repository-Setup**
  - README.md
  - LICENSE
  - CONTRIBUTING.md
  - CODE_OF_CONDUCT.md
  - SECURITY.md

- [ ] **GitHub-Konfiguration**
  - Issue Templates
  - PR Templates
  - Branch Protection
  - GitHub Discussions

- [ ] **Dokumentation**
  - Installation
  - Development Setup
  - Architektur-Übersicht
  - API-Dokumentation

### Modding-Checkliste (CL-002)

- [ ] **Szenario-Format**
  - JSON-Schema dokumentieren
  - Beispiel-Szenario
  - Validierungs-Tool

- [ ] **Entwickler-Dokumentation**
  - Wie erstelle ich ein Szenario?
  - Welche Felder sind Pflicht?
  - Wie teste ich mein Szenario?

- [ ] **Community**
  - GitHub Discussions für Modding
  - Showcase für Community-Szenarien
  - Qualitätssicherung definieren

---

## Zusammenfassung für MVP

### Must-Have

- [ ] StoryEngineAdapter-Grundgerüst
- [ ] i18n-Setup (DE + EN)
- [ ] localStorage Save/Load
- [ ] Accessibility-Grundlagen
- [ ] Seed-System-Integration

### Nice-to-Have

- [ ] Cloud Saves
- [ ] Modding-Schema-Validierung
- [ ] Animation-Library-Integration

### Post-MVP

- [ ] Vollständige Modding-Dokumentation
- [ ] Wissenschaftler-API
- [ ] Community-Features
