# Story Mode - Szenario-Framework

Technische und konzeptionelle Dokumentation des erweiterbaren Szenario-Systems.

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE ENGINE                             │
│  (Universelle Mechaniken, Taktiken, Akteurs-Typen)         │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ SZENARIO-PACK   │ │ SZENARIO-PACK   │ │ SZENARIO-PACK   │
│ "Geopolitik"    │ │ "Innenpolitik"  │ │ "Kommerziell"   │
│ (MVP)           │ │ (v2.0)          │ │ (v3.0)          │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Universelle Engine-Komponenten

Diese Elemente sind szenario-unabhängig:

### Mechaniken
| Mechanik | Beschreibung | Engine-Feld |
|----------|--------------|-------------|
| Vertrauen (Trust) | Grundwährung der Manipulation | `actor.trust` |
| Resilienz | Widerstandsfähigkeit gegen Angriffe | `actor.resilience` |
| Emotionaler Zustand | Anfälligkeit für emotionale Appelle | `actor.emotionalState` |
| Polarisierung | Spaltung zwischen Gruppen | `network.polarizationIndex` |
| Detection Risk | Gefahr der Enttarnung | `state.detectionRisk` |

### Taktiken (aus Taxonomie)
Alle 27 Persuasion-Techniken sind universell anwendbar:
- Framing, Emotional Appeal, Ad Hominem, False Balance...
- Definiert in: `src/data/persuasion/taxonomy.json`

### Akteurs-Typen
| Typ | Beschreibung | Universell? |
|-----|--------------|-------------|
| Medien (Tabloid) | Hohe Reichweite, niedrige Glaubwürdigkeit | ✅ |
| Medien (Qualität) | Hohe Glaubwürdigkeit, geringere Reichweite | ✅ |
| Experten | Autoritätsfiguren, Wissenschaftler | ✅ |
| Pseudo-Experten | Fake Credentials | ✅ |
| Bot-Farms | Infrastruktur für Amplifikation | ✅ |
| Institutionen | Regierung, NGOs | ✅ |
| Defensive Akteure | Fact-Checker, Regulatoren | ✅ |

---

## Szenario-Pack Struktur

Jedes Szenario-Pack enthält:

```
scenarios/
├── geopolitik/
│   ├── config.json           # Szenario-Metadaten
│   ├── actors/               # Szenario-spezifische Akteure
│   │   ├── countries.json    # Länder der Westunion
│   │   ├── media.json        # Medien in diesen Ländern
│   │   └── npcs.json         # Story-Mode NPCs
│   ├── objectives/           # Strategische Ziele
│   │   └── okrs.json         # Objective Key Results
│   ├── events/               # Szenario-spezifische Events
│   │   └── events.json
│   ├── dialogues/            # NPC-Dialoge
│   │   └── marina.json
│   └── narratives/           # Template-Texte
│       └── templates.json
```

### config.json Beispiel

```json
{
  "id": "geopolitik_ostland_westunion",
  "name": "Operation Spaltung",
  "version": "1.0.0",
  "description": "Ostland versucht, die Westunion zu destabilisieren",
  "setting": {
    "playerRole": "Leiter der Abteilung für spezielle Projekte",
    "homeCountry": "Ostland",
    "targetRegion": "Westunion",
    "context": "Ostland führt einen Konflikt gegen einen Nachbarstaat. Die Westunion unterstützt den Gegner."
  },
  "difficulty": {
    "default": "normal",
    "available": ["tutorial", "normal", "hard"]
  },
  "duration": {
    "chapters": 4,
    "phasesPerChapter": 3,
    "daysPerPhase": 4
  },
  "victoryConditions": [
    {
      "id": "unity_break",
      "name": "Einheit brechen",
      "description": "EU-Sanktionseinheit um 50% senken",
      "metric": "westunion.cohesion < 0.5"
    }
  ],
  "defeatConditions": [
    {
      "id": "exposed",
      "name": "Enttarnt",
      "description": "Deine Operation wurde aufgedeckt",
      "metric": "state.detectionRisk > 0.9"
    }
  ]
}
```

---

## MVP-Szenario: "Operation Spaltung"

### Setting

```
KONTEXT:
Du bist Leiter der "Abteilung für spezielle Projekte" in Ostland.
Dein Land führt einen Konflikt gegen einen Nachbarstaat.
Die Westunion unterstützt deinen Gegner mit Waffen und Sanktionen.

DEIN AUFTRAG:
Schwäche die Westunion von innen. Spalte sie. Säe Zweifel.
Sorge dafür, dass die Unterstützung für deinen Gegner nachlässt.
```

### Länder der Westunion

| Fiktiver Name | Charakter | Vulnerabilität | Allegorie |
|---------------|-----------|----------------|-----------|
| **Nordmark** | Wirtschaftsstark, zentral, export-abhängig | Energie-Angst, Wirtschafts-Sorgen | Deutschland |
| **Gallia** | Kulturell stolz, unabhängig, eigene Agenda | Nationale Identität, Anti-EU-Strömungen | Frankreich |
| **Insulandia** | Insel, Sonderweg-Neigung, distanziert | Bereits gespalten, Exit-Tendenzen | UK (vor Brexit) |
| **Balticum** | Klein, historisch traumatisiert, wachsam | Kleine Medienlandschaft, Sprachraum-Vulnerabilität | Baltikum |
| **Südland** | Wirtschaftlich schwächer, populistische Tendenzen | Unzufriedenheit, Anti-Establishment | Südeuropa |
| **Ostmark** | Nahe an Ostland, gespalten, historische Verbindungen | Nostalgische Strömungen, geteilte Identität | Osteuropa |

### Strategische Ziele (OKRs)

```
OBJECTIVE 1: UNITY BREAK (Einheit brechen)
├── KR1: Öffentliche Meinung zu Sanktionen spalten
├── KR2: Waffenlieferungs-Debatte polarisieren
└── Messbar: Westunion.cohesion < 0.5

OBJECTIVE 2: ENERGY LEVERAGE (Energie-Hebel)
├── KR1: Energie-Abhängigkeit als Angst-Narrativ etablieren
├── KR2: Wirtschaftliche Ängste verstärken
└── Messbar: Nordmark.economicAnxiety > 0.7

OBJECTIVE 3: NARRATIVE CONTROL (Narrative Kontrolle)
├── KR1: Alternative Kriegsursachen-Erklärungen verbreiten
├── KR2: "Beide Seiten"-Framing in Mainstream etablieren
└── Messbar: Westunion.narrativeControl > 0.6

OBJECTIVE 4: DEMOCRATIC FATIGUE (Demokratie-Müdigkeit)
├── KR1: Vertrauen in Institutionen senken
├── KR2: Populistische/extremistische Parteien stärken
└── Messbar: Westunion.democraticTrust < 0.4
```

---

## Erweiterbarkeit: Zukünftige Szenarien

### Szenario-Pack: "Die Wahl" (Innenpolitik)

```json
{
  "id": "innenpolitik_wahl",
  "name": "Die Wahl",
  "setting": {
    "playerRole": "Kampagnen-Stratege",
    "context": "Du arbeitest für eine Partei, die mit allen Mitteln gewinnen will."
  },
  "objectives": [
    { "id": "win_election", "metric": "party.voteShare > 0.5" },
    { "id": "destroy_opponent", "metric": "opponent.trust < 0.3" }
  ]
}
```

### Szenario-Pack: "Der Konzern" (Kommerziell)

```json
{
  "id": "kommerziell_konzern",
  "name": "Schadensbegrenzung",
  "setting": {
    "playerRole": "PR-Direktor",
    "context": "Dein Pharma-Konzern hat einen Skandal. Vertuschen oder transparent sein?"
  },
  "objectives": [
    { "id": "protect_stock", "metric": "company.stockPrice > 0.8" },
    { "id": "avoid_lawsuit", "metric": "company.legalRisk < 0.5" }
  ]
}
```

---

## Technische Anforderungen

### Szenario-Loader

```typescript
interface ScenarioLoader {
  loadScenario(scenarioId: string): Promise<Scenario>;
  getAvailableScenarios(): ScenarioMetadata[];
  validateScenario(scenario: Scenario): ValidationResult;
}
```

### Szenario-Adapter

```typescript
interface ScenarioAdapter {
  // Übersetzt szenario-spezifische Ziele in Engine-Metriken
  translateObjective(objective: Objective, state: GameState): number;

  // Lädt szenario-spezifische Akteure
  getActors(): Actor[];

  // Lädt szenario-spezifische Events
  getEvents(): GameEvent[];

  // Generiert szenario-spezifische Narrative
  generateNarrative(state: GameState, template: string): string;
}
```

---

## Nächste Schritte

1. [ ] `config.json` für MVP-Szenario erstellen
2. [ ] Länder der Westunion als Akteure definieren
3. [ ] OKR-System in Engine integrieren
4. [ ] ScenarioLoader implementieren
5. [ ] Erste NPC-Dialoge schreiben
