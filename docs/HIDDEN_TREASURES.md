# Hidden Treasures - Unentdeckte Inhalte im Repository

**Erstellt:** 2025-12-29
**Zweck:** Dokumentation aller existierenden aber ungenutzten/unterintegrierten Inhalte
**Zielgruppe:** Claude Code Sessions, Entwickler

---

## WICHTIG FÜR CLAUDE CODE

Bevor du neue Inhalte erstellst, prüfe IMMER zuerst:
1. Existiert bereits etwas Ähnliches in diesem Repository?
2. Gibt es Dokumentation in `/docs/` die relevant sein könnte?
3. Gibt es JSON-Daten in `/src/data/` die genutzt werden könnten?

**Mantra:** "Integrieren vor Neu-Erstellen"

---

## Übersicht: Existierende Systeme

### Vollständig implementiert aber NICHT in Story Mode integriert

| System | Pfad | Beschreibung | Integrations-Aufwand |
|--------|------|--------------|---------------------|
| Combo-System | `src/game-logic/combo-system.ts` | Belohnt strategische Aktions-Ketten | Mittel |
| Actor-AI | `src/game-logic/actor-ai.ts` | KI-Verhalten für Akteure (Gegenwehr) | Mittel |
| NarrativeGenerator | `src/game-logic/NarrativeGenerator.ts` | Dynamische Story-Texte | Gering |
| Event-Chain-System | `src/game-logic/event-chain-system.ts` | Verkettete Events mit Spielerwahl | Hoch |
| Sound-System | `src/story-mode/utils/SoundSystem.ts` | Web Audio Feedback | Gering |

---

## Kategorie 1: Inhalts-Daten (JSON)

### 1.1 Persuasion Taxonomy
**Pfad:** `src/data/persuasion/taxonomy.json`
**Zeilen:** ~800
**Status:** ❌ Nicht mit Story Mode verbunden

**Inhalt:**
- 27+ Überzeugungstechniken
- Jede Technik enthält:
  - `description` / `longDescription`
  - `example` / `extendedExample`
  - `empiricalEvidence` (echte Studien!)
  - `counterStrategies`
  - `manipulationPotential` (0-1)
  - `wikipediaQuery`

**Techniken (Auszug):**
```
framing, emotional_appeal, authority, social_proof,
scarcity, anchoring, false_balance, whataboutism,
ad_hominem, strawman, slippery_slope, bandwagon,
appeal_to_fear, cherry_picking, gish_gallop...
```

**Integration möglich:**
- Story-Mode-Aktionen könnten `basedOn: ["framing", "emotional_appeal"]` haben
- UI könnte "Basiert auf: Framing (Kahneman & Tversky, 1981)" anzeigen
- Bildungswert: Spieler lernt echte Techniken

---

### 1.2 Combo-Definitionen
**Pfad:** `src/data/game/combo-definitions.json`
**Zeilen:** ~200
**Status:** ❌ Nicht in Story Mode

**Enthält:**
```json
{
  "id": "propaganda_blitz",
  "name": "Propaganda Blitz",
  "requiredAbilities": ["spread_fake_news", "amplify_disinformation"],
  "windowRounds": 2,
  "bonusEffect": { "trustReduction": 0.15, "attentionCost": -10 }
}
```

**Alle Combos:**
- `propaganda_blitz` - Aggressive Überflutung
- `credibility_erosion` - Systematische Rufschädigung
- `emotional_manipulation` - Angst-Ausbeutung
- `infrastructure_takeover` - Narrative Kontrolle
- `authority_impersonation` - Fake Experten
- `conspiracy_network` - Sich verstärkende Verschwörungen
- `media_saturation` - Alle Kanäle gleichzeitig
- `divide_and_conquer` - Polarisierung
- `astroturf_groundswell` - Fake Graswurzel
- `long_game` - Langzeit-Infiltration

**Integration:**
- Wenn Spieler passende Aktionen in X Phasen macht → Combo-Bonus
- UI: "COMBO! Propaganda Blitz - +15% Effektivität"

---

### 1.3 Event-Chains (Spielerentscheidungen)
**Pfad:** `src/data/game/event-chains.json`
**Zeilen:** ~400
**Status:** ❌ Nicht in Story Mode

**Beispiel:**
```json
{
  "id": "whistleblower_investigation_start",
  "name": "Anonymous Tip",
  "description": "A whistleblower has contacted a journalist...",
  "condition": "detectionRisk > 0.6 && round > 8",
  "playerChoice": [
    {
      "text": "Accelerate - Strike before investigation",
      "cost": { "attention": 20 },
      "consequence": "Gain resources but risk exposure"
    },
    {
      "text": "Lay low - Pause operations",
      "consequence": "Network recovers but buys time"
    },
    {
      "text": "Discredit whistleblower",
      "cost": { "money": 150, "attention": 30 }
    }
  ],
  "chainTo": "whistleblower_investigation_result"
}
```

**Enthaltene Event-Chains:**
- Whistleblower Investigation (Start → Result)
- Viral Moment (Capitalize vs. Diversify)
- Platform Crackdown
- Defensive Alliance Forms
- Economic Pressure
- Election Interference Window

**Integration:**
- Könnte als "Krisen-Momente" in Story Mode eingebaut werden
- Echte moralische Dilemmata mit Konsequenzen

---

### 1.4 Erweiterte Abilities (v2)
**Pfad:** `src/data/game/ability-definitions-v2.json`
**Zeilen:** ~600
**Status:** ⚠️ Parallel zu Story Mode Aktionen

**Beispiel:**
```json
{
  "id": "skandal_schlagzeile",
  "name": "Skandal-Schlagzeile",
  "category": "media_manipulation",
  "realExample": "2024 Harris hit-and-run hoax - fake video spread by Storm-1516",
  "basedOn": ["emotional_appeal", "framing"],
  "tactics": ["Out-of-context quotes", "Emotional headlines", "Urgent framing"],
  "animationType": "pulse",
  "animationColor": "#EF4444",
  "icon": "📰💥"
}
```

**Besonderheiten:**
- Deutsche Namen
- Echte Beispiele aus Kampagnen
- Animations-Definitionen
- Verknüpfung zur Taxonomy

---

### 1.5 Erweiterte Akteure
**Pfade:**
- `src/data/game/actors/media-extended.json` (~300 Zeilen)
- `src/data/game/actors/experts-extended.json` (~200 Zeilen)
- `src/data/game/actors/lobby-extended.json` (~200 Zeilen)
- `src/data/game/actors/organizations-infrastructure.json` (~150 Zeilen)

**Beispiel (media-extended):**
```json
{
  "id": "faz",
  "name": "Frankfurter Allgemeine Zeitung",
  "baseTrust": 0.76,
  "resilience": 0.58,
  "vulnerabilities": ["ad_hominem", "bias_framing"],
  "resistances": ["emotional_appeal", "scarcity"],
  "behavior": {
    "type": "defensive",
    "counterAbilities": ["fact_check"],
    "reactionProbability": 0.3
  }
}
```

**Enthaltene Medien:**
- FAZ, Die Welt, Die ZEIT, Süddeutsche, Der Spiegel
- BILD, Focus, Stern
- taz, nd, Junge Freiheit
- ARD, ZDF, RTL, Sat.1
- Twitter DE, Facebook DE, Telegram

---

## Kategorie 2: TypeScript-Module

### 2.1 NarrativeGenerator
**Pfad:** `src/game-logic/NarrativeGenerator.ts`
**Zeilen:** ~400
**Status:** ❌ Story Mode nutzt es nicht

**Funktionen:**
```typescript
ABILITY_NARRATIVES: {
  agenda_setting: {
    headline: (s, t) => `${s.name} Reshapes Public Discourse`,
    description: (s, t) => `${s.name} successfully controlled...`,
    examples: (s, t) => [
      "News cycles dominated by sensationalized coverage...",
      "Social media trends artificially amplified..."
    ]
  },
  scandalize: { ... },
  undermine_authority: { ... },
  sow_doubt: { ... },
  conspiracy_framing: { ... }
}
```

**Integration:**
- Story Mode könnte dynamische Narrative aus Templates generieren
- Statt statischer Texte: kontextabhängige Generierung

---

### 2.2 Actor-AI System
**Pfad:** `src/game-logic/actor-ai.ts`
**Zeilen:** ~300
**Status:** ❌ Nicht verbunden

**Verhaltens-Typen:**
```typescript
ACTOR_BEHAVIORS: {
  passive: { counterAttackChance: 0 },
  vigilant: { counterAttackChance: 0.1, allySupport: true },
  defensive: { counterAttackChance: 0.3, allySupport: true },
  aggressive: { counterAttackChance: 0.5 }
}
```

**Features:**
- Awareness-System (Akteure werden aufmerksamer)
- Counter-Strategien
- Ally-Support (Akteure helfen sich gegenseitig)

**Integration:**
- Westunion-Institutionen könnten zurückschlagen
- Countermeasures könnten davon profitieren

---

### 2.3 Combo-System
**Pfad:** `src/game-logic/combo-system.ts`
**Zeilen:** ~250
**Status:** ❌ Nicht in Story Mode

**Logik:**
```typescript
interface ComboProgress {
  comboId: string;
  abilitiesUsed: string[];
  startRound: number;
  targetActorId: string;
}

// Prüft ob Combo aktiviert wurde
function checkComboCompletion(progress: ComboProgress, combo: ComboDefinition): boolean
```

---

### 2.4 Event-Chain-System
**Pfad:** `src/game-logic/event-chain-system.ts`
**Zeilen:** ~200
**Status:** ❌ Nicht in Story Mode

**Features:**
- Bedingte Event-Auslösung
- Spieler-Entscheidungen
- Verkettete Konsequenzen
- Timed Triggers

---

## Kategorie 3: Dokumentation

### 3.1 SCENARIO_ANALYSIS_REAL_CAMPAIGNS.md
**Pfad:** `docs/SCENARIO_ANALYSIS_REAL_CAMPAIGNS.md`
**Zeilen:** ~500
**Status:** 💡 Wertvolle Recherche, nicht umgesetzt

**Enthält 6 echte Kampagnen-Typen:**

1. **Wahl-Interferenz (2016-2024)**
   - 13,493 Bots vor Brexit
   - Typosquatted Domains
   - AI-Generated Content

2. **COVID Vaccine Misinformation**
   - 800 "Superspreaders" = 35% aller Reshares
   - Messbar: -6.2% Impfbereitschaft UK
   - Pentagon Anti-Sinovac Kampagne (!)

3. **Ukraine-Russia Info War**
   - Pravda flooded LLMs mit 3.6M Artikeln
   - 33% der Chatbots wiederholten Falschinfos

4. **Climate Disinformation**
   - "Tobacco Playbook"
   - Manufactured Doubt

5. **Public Health Scares**
   - 5G-COVID Verschwörung
   - Anti-Fluoride Campaigns

6. **Corporate Disinformation**
   - Greenwashing
   - Astroturfing

**Nutzbar für:**
- Alternative Szenarien/Kampagnen
- Mehr Aktionen inspiriert von echten Taktiken
- Historische Referenzen in Dialogen

---

### 3.2 IDEAS.md
**Pfad:** `docs/story-mode/IDEAS.md`
**Zeilen:** ~425
**Status:** 💡 Viele unimplementierte Ideen

**Highlights:**

**I-001: Gegenseite spielen (Same Seed)** ✅ Angenommen
- Nach Spiel-Ende denselben Seed als Verteidiger spielen

**I-002: Sprachraum-Vulnerabilität**
- Kleine Länder = schnellerer Erfolg, weniger Impact
- Strategische Ressourcen-Allokation

**I-003: Raum-Progression**
- Büro → Operations Center → Server-Raum
- Visueller Fortschritt

**I-005: Template-basierte Narrative**
- 50 Kern-Narrative → 200 Templates → 500 Varianten → ∞ Kombinationen

**I-006: Chaos-Level im Büro**
- Visuelles Feedback bei Stress

---

### 3.3 VISUAL_DESIGN.md
**Pfad:** `docs/story-mode/VISUAL_DESIGN.md`
**Zeilen:** ~400
**Status:** ⚠️ Teilweise umgesetzt

**Nicht umgesetzt:**
- Tag/Nacht-Zyklus (Morgen → Mittag → Abend → Nacht)
- Raum-Progression via Tür
- Chaos-Visualisierung

---

### 3.4 DAY_ONE_WALKTHROUGH.md
**Pfad:** `docs/DAY_ONE_WALKTHROUGH.md`
**Zeilen:** ~800
**Status:** 💡 Vollständiger erster Tag, nicht als Tutorial

**Enthält:**
- Minute-für-Minute Spielablauf
- Alle UI-Interaktionen
- NPC-Dialoge für Tag 1
- Entscheidungspunkte

---

## Kategorie 4: Westunion Lore

**Wichtig:** Diese Informationen sind dokumentiert aber verstreut.

### Mitgliedsstaaten der Westunion (= EU)
Quelle: `docs/story-mode/SCENARIO_FRAMEWORK.md`

| Staat | Allegorie | Vulnerabilität |
|-------|-----------|----------------|
| Nordmark | Deutschland | Wirtschaftsängste, Energieabhängigkeit |
| Gallia | Frankreich | Nationale Identität, Anti-EU |
| Insulandia | UK | Separatismus, Exit-Tendenzen |
| Balticum | Baltikum | Kleine Medienlandschaft, Russ. Minderheit |
| Südland | Südeuropa | Wirtschaftliche Unzufriedenheit |
| Ostmark | Osteuropa | Historische Verbindungen, Nostalgie |

### Externe Akteure
| Akteur | Allegorie | Rolle |
|--------|-----------|-------|
| Ostland | Russland | Spieler-Heimatland, Aggressor |
| Der Nachbarstaat | Ukraine | Konfliktzone |

---

## Integrations-Prioritäten

### Schnelle Gewinne (1-2 Stunden)
1. **Sound-System aktivieren** - Existiert bereits, nur einbinden
2. **Taxonomy in Aktionen referenzieren** - `basedOn` Feld hinzufügen
3. **NarrativeGenerator für News-Texte** - Dynamischere Meldungen

### Mittlerer Aufwand (4-8 Stunden)
4. **Combo-System integrieren** - Strategische Tiefe
5. **Event-Chains als Krisen-Momente** - Spielerentscheidungen
6. **Extended Actors für Countermeasures** - FAZ fact-checkt zurück

### Größere Projekte (1-2 Tage)
7. **Actor-AI für reaktive Welt** - Gegner schlagen zurück
8. **Alternative Szenarien** - COVID, Wahl, Corporate
9. **"Gegenseite spielen" Mode** - Gleicher Seed, andere Rolle

---

## Checkliste für neue Features

Bevor du etwas Neues entwickelst, prüfe:

- [ ] Gibt es bereits JSON-Daten die ich nutzen kann?
  - `src/data/game/` durchsuchen
  - `docs/story-mode/data/` prüfen

- [ ] Gibt es ein TypeScript-Modul das ich integrieren kann?
  - `src/game-logic/` durchsuchen
  - Besonders: combo-system, actor-ai, NarrativeGenerator

- [ ] Gibt es Dokumentation die relevant ist?
  - `docs/` durchsuchen
  - Besonders: IDEAS.md, SCENARIO_ANALYSIS

- [ ] Gibt es Lore die ich beachten muss?
  - SCENARIO_FRAMEWORK.md für Westunion-Welt
  - Mitgliedsstaaten und ihre Eigenschaften

---

## Suchbefehle für Claude Code

```bash
# Finde alle JSON-Daten
find . -name "*.json" -not -path "*/node_modules/*"

# Finde alle TypeScript-Module in game-logic
ls -la src/game-logic/

# Suche nach bestimmten Konzepten
grep -r "combo" src/
grep -r "taxonomy" src/
grep -r "narrative" src/

# Finde Dokumentation
find docs/ -name "*.md"
```

---

## Kontakt / Wartung

Dieses Dokument sollte aktualisiert werden wenn:
- Neue Systeme integriert werden (Status ändern)
- Neue Inhalte entdeckt werden
- Prioritäten sich ändern

**Letzte Aktualisierung:** 2025-12-29
