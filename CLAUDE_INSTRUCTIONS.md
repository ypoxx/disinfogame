# Claude Code Anweisungen für dieses Projekt

**Projekt:** Desinformations-Simulations-Spiel (Story Mode)
**Letzte Aktualisierung:** 2026-06-01 *(zuvor 2026-05-31)*

> **Stand 2026-05-31:** Projekt ist **Story-only** (Pro Mode archiviert unter `archive/pro-mode/`).
> **Aktuelle Richtung & Roadmap:** `ROADMAP.md` + `docs/BUILDING_AND_ASSETS.md` — Ziel: **TVTower-Gebäude** + Grafik-Pipeline.
> Verbindliche Wahrheit: `docs/VISION_LOCK.md`. Diese Datei bleibt nützlich für **Story-Inhalt** (Lore, Datendateien, Konventionen); einzelne Pfade unten sind historisch.

---

## Repository-Struktur — ZWEI eigenständige Projekte

Dieses Repo enthält **zwei getrennte Projekte** mit je eigener `package.json`, eigenem Build und **eigener Netlify-Site**:

| Projekt | Pfad | Was | Stack | Netlify-Site |
|---|---|---|---|---|
| **Das Spiel** | `desinformation-network/` | Story-Mode-Spiel = das eigentliche Produkt | Vite + React + TS, Vitest | **disinfogame** (Base dir = `desinformation-network`) |
| **Asset Studio** | `sprite-tool/` | **Eigenständiges, backend-artiges Werkzeug** zur KI-Bilderzeugung — klare Funktion + Brücke zum Spiel, **aber nicht das Spiel** | Next.js | separate Site (Base dir = `sprite-tool`), z. B. „thunderous-unicorn…" |

**Konsequenzen:**
- Build/Tests/CI sind **pro Projekt getrennt**. Ein **roter CI-Check der sprite-tool-Site betrifft NICHT das Spiel** (und umgekehrt).
- Die sprite-tool-Netlify-Site braucht im **Dashboard** „Base directory = `sprite-tool`" (siehe `sprite-tool/netlify.toml` + `sprite-tool/DEPLOY.md`). Fehlt das, schlägt ihr Deploy fehl, obwohl `next build` lokal grün ist.
- **Kein Root-`netlify.toml`** anlegen — das würde beide Sites beeinflussen.
- Beim Arbeiten/Committen immer klarstellen, **welches Projekt** gemeint ist.

---

## Goldene Regeln

### 1. IMMER ZUERST SUCHEN

Bevor du IRGENDETWAS neu erstellst:

```
1. Lies docs/HIDDEN_TREASURES.md
2. Durchsuche src/data/ nach existierenden JSON-Daten
3. Prüfe src/game-logic/ auf existierende Module
4. Schaue in docs/ nach relevanter Dokumentation
```

**Warum?** Das Repository enthält ~5000 Zeilen ungenutzter/unterintegrierter Inhalte!

### 2. INTEGRIEREN VOR NEU-ERSTELLEN

Existierende Systeme die auf Integration warten:

| System | Pfad | Was es tut |
|--------|------|------------|
| Combo-System | `src/game-logic/combo-system.ts` | Belohnt Aktions-Ketten |
| Actor-AI | `src/game-logic/actor-ai.ts` | NPCs schlagen zurück |
| NarrativeGenerator | `src/game-logic/NarrativeGenerator.ts` | Dynamische Texte |
| Event-Chains (Daten) | `src/data/game/event-chains.json` → `CrisisMomentSystem` | Krisen-Momente *(Code `event-chain-system.ts` ist archiviert)* |
| Taxonomy | `src/data/persuasion/taxonomy.json` | 27 Techniken mit Forschung |

### 3. LORE BEACHTEN

**Westunion = Europäische Union** (fiktives Äquivalent)

Mitgliedsstaaten:
- **Nordmark** = Deutschland (Wirtschaftsängste)
- **Gallia** = Frankreich (Nationale Identität)
- **Insulandia** = UK (Separatismus)
- **Balticum** = Baltikum (Russische Minderheit)
- **Südland** = Südeuropa (Wirtschaftskrise)
- **Ostmark** = Osteuropa (Historische Verbindungen)

Externe:
- **Ostland** = Russland (Spieler-Heimatland)

Dokumentiert in: `docs/story-mode/SCENARIO_FRAMEWORK.md`

---

## Datei-Übersicht

### Story Mode Kern-Dateien

```
src/story-mode/
├── data/
│   ├── actions.json          # Spieler-Aktionen (100+)
│   ├── consequences.json     # Konsequenzen-Ketten
│   ├── countermeasures.json  # Gegner-Reaktionen (DISARM)
│   ├── dialogues.json        # NPC-Dialoge
│   └── world-events.json     # 72 mehrstufige Ereignisse
├── engine/
│   ├── ActionLoader.ts
│   ├── ConsequenceSystem.ts
│   ├── CountermeasureSystem.ts
│   ├── DialogLoader.ts
│   └── index.ts
└── utils/
    └── SoundSystem.ts        # Web Audio (untergenutzt!)
```

### Haupt-Adapter

```
src/game-logic/StoryEngineAdapter.ts
```

Dies ist die ZENTRALE Datei für Story Mode. Alle Systeme werden hier koordiniert.

### Ungenutzte aber wertvolle Daten

```
src/data/
├── persuasion/
│   └── taxonomy.json         # 27 Techniken - GOLD!
└── game/
    ├── combo-definitions.json    # Taktische Kombos
    ├── event-chains.json         # Spielerentscheidungen
    ├── ability-definitions-v2.json
    └── actors/
        ├── media-extended.json   # FAZ, ZEIT, etc.
        ├── experts-extended.json
        └── lobby-extended.json
```

---

## Typische Aufgaben

### "Füge neue Aktionen hinzu"

1. Prüfe `src/data/game/ability-definitions-v2.json` - vielleicht existiert es schon
2. Prüfe `taxonomy.json` für passende Basis-Techniken
3. Füge zu `src/story-mode/data/actions.json` hinzu
4. Verknüpfe mit Taxonomy: `"basedOn": ["framing", "emotional_appeal"]`

### "Verbessere NPC-Dialoge"

1. Lies `docs/story-mode/PERSONAS.md` für Charakter-Hintergründe
2. Prüfe `src/story-mode/data/dialogues.json` (existiert bereits!)
3. DialogLoader in `src/story-mode/engine/DialogLoader.ts`

### "Füge neue Events hinzu"

1. Prüfe `src/data/game/event-chains.json` - viele existieren bereits!
2. Beachte die 4 Skalen: local, regional, national, transnational
3. Beachte Mitgliedsstaaten für regionale Events
4. Füge zu `src/story-mode/data/world-events.json` hinzu

### "Implementiere Countermeasures"

1. Lies `src/story-mode/data/countermeasures.json` (20+ existieren)
2. CountermeasureSystem in `src/story-mode/engine/CountermeasureSystem.ts`
3. DISARM-Framework beachten (dokumentiert in countermeasures.json)

---

## Code-Konventionen

### TypeScript

```typescript
// Immer explizite Typen
interface NewsEvent {
  id: string;
  scale?: EventScale;  // 'local' | 'regional' | 'national' | 'transnational'
  region?: MemberState; // 'nordmark' | 'gallia' | etc.
}

// Seeded Random für Reproduzierbarkeit
private seededRandom(seed: string): number
```

### JSON-Daten

```json
{
  "id": "snake_case_id",
  "label_de": "Deutscher Text",
  "label_en": "English Text",
  "description_de": "Ausführliche Beschreibung",
  "description_en": "Detailed description"
}
```

### Zweisprachigkeit

ALLE spielerrelevanten Texte müssen `_de` und `_en` Varianten haben.

---

## Debugging

### Tests ausführen

```bash
cd desinformation-network
npm test
```

### Playtest-Framework

```bash
npm test -- --grep "playtest"
```

Generiert Berichte in Konsole.

### TypeScript prüfen

```bash
npx tsc --noEmit
```

---

## Bekannte Architektur-Entscheidungen

### Warum StoryEngineAdapter?

Trennt Story Mode von der ursprünglichen Sandbox-Engine. Ermöglicht:
- Phasen-basiertes Gameplay
- NPC-Beziehungen
- Narrative Konsequenzen
- Mehrstufige Weltereignisse

### Warum JSON statt TypeScript für Daten?

- Einfacher zu bearbeiten
- Kann später aus externen Quellen geladen werden
- Trennung von Logik und Inhalt

### Warum Seeded Random?

- Reproduzierbare Spielzustände
- "Gegenseite spielen" Feature vorbereitet
- Debugging erleichtert

---

## Offene Aufgaben / Tech Debt

> **Aktualisiert 2026-05-31:** Viele frühere TODOs sind **erledigt** — Combo (`StoryComboSystem`),
> Sound (`SoundSystem`), Actor-AI (`StoryActorAI`), Krisen (`CrisisMomentSystem`) existieren bereits als
> Story-Systeme; Pro Mode ist archiviert. **Aktuelle Prioritäten stehen in [`ROADMAP.md`](ROADMAP.md) +
> [`docs/BUILDING_AND_ASSETS.md`](docs/BUILDING_AND_ASSETS.md)** — Schwerpunkt: **TVTower-Gebäude + Grafik-Pipeline**.

### Weiterhin offen / sinnvoll
- [ ] Taxonomy stärker mit Aktionen verknüpfen (`basedOn`)
- [ ] Extended Actors für Countermeasures nutzen
- [ ] Gebäude-Querschnitt + Raum-Progression (Track A der Roadmap)

---

## Wichtige Dokumente

| Dokument | Zweck |
|----------|-------|
| `docs/HIDDEN_TREASURES.md` | Alle ungenutzten Inhalte |
| `docs/story-mode/SCENARIO_FRAMEWORK.md` | Westunion-Lore |
| `docs/story-mode/IDEAS.md` | Unimplementierte Features |
| `docs/story-mode/PERSONAS.md` | NPC-Charaktere |
| `docs/SCENARIO_ANALYSIS_REAL_CAMPAIGNS.md` | Echte Kampagnen-Recherche |
| `docs/DAY_ONE_WALKTHROUGH.md` | Erster Spieltag |

---

## Schnell-Referenz: Wo finde ich...

| Ich suche... | Schaue in... |
|--------------|--------------|
| Spieler-Aktionen | `src/story-mode/data/actions.json` |
| NPC-Dialoge | `src/story-mode/data/dialogues.json` |
| Weltereignisse | `src/story-mode/data/world-events.json` |
| Konsequenzen | `src/story-mode/data/consequences.json` |
| Gegner-Reaktionen | `src/story-mode/data/countermeasures.json` |
| Persuasion-Techniken | `src/data/persuasion/taxonomy.json` |
| Combo-Definitionen | `src/data/game/combo-definitions.json` |
| Event-Ketten | `src/data/game/event-chains.json` |
| Medien-Akteure | `src/data/game/actors/media-extended.json` |
| Experten-Akteure | `src/data/game/actors/experts-extended.json` |
| Westunion-Lore | `docs/story-mode/SCENARIO_FRAMEWORK.md` |
| Game Design Ideen | `docs/story-mode/IDEAS.md` |
| Visual Design | `docs/story-mode/VISUAL_DESIGN.md` |

---

## Letzte Änderungen (2025-12-29)

1. **72 mehrstufige Weltereignisse** erstellt
   - 4 Skalen: local, regional, national, transnational
   - Kaskadeneffekte zwischen Events
   - Alle 6 Mitgliedsstaaten abgedeckt

2. **DialogLoader & CountermeasureSystem** integriert
   - `docs/story-mode/data/dialogues.json` kopiert nach `src/`
   - `docs/story-mode/data/countermeasures.json` kopiert nach `src/`

3. **HIDDEN_TREASURES.md** erstellt
   - Dokumentation aller ungenutzten Inhalte

---

**Viel Erfolg bei der Weiterentwicklung!**
