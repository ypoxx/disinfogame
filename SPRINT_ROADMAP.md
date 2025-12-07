# Sprint Roadmap: Desinformation Network 2.0

## Übersicht der Sprints

```
SPRINT 1: Quick Wins          → Sofort spürbare Verbesserungen
SPRINT 2: Trade-offs          → "Jede Entscheidung ist interessant" (Sid Meier)
SPRINT 3: Lebendiges System   → Emergenz & Reaktionen (Will Wright)
SPRINT 4: Emotionale Tiefe    → Bedeutung & Konsequenzen (This War of Mine)
SPRINT 5: Replayability       → Modi & Progression (Roguelike)
```

---

## SPRINT 1: Quick Wins
**Fokus:** Sofort spürbare Verbesserungen, minimale Code-Änderungen
**Prinzip:** "Feedback ist entscheidend" (Sid Meier)

### 1.1 Verstärktes Ability-Feedback
**Problem:** Aktionen fühlen sich "still" an
**Lösung:**
- [ ] Dramatischere Animationen (längere Dauer, intensivere Farben)
- [ ] Sound-Effekte für Ability-Nutzung (optional, mit Toggle)
- [ ] "Impact-Zahl" die aufpoppt (-15% Trust!)
- [ ] Screen-Shake bei starken Abilities

**Files:** `NetworkVisualization.tsx`, neuer `SoundManager.ts`

### 1.2 Bessere Trust-Visualisierung
**Problem:** Veränderungen sind schwer zu sehen
**Lösung:**
- [ ] Pulsierender Ring um Akteure bei Trust-Änderung
- [ ] Farbübergang-Animation (rot → gelb → grün)
- [ ] Größenänderung basierend auf Trust (kleiner = weniger Trust)
- [ ] "Danger Zone" Indikator unter 40%

**Files:** `NetworkVisualization.tsx`, `colors.ts`

### 1.3 Aktions-Vorschau
**Problem:** Spieler wissen nicht, was passieren wird
**Lösung:**
- [ ] Bei Ability-Hover: Zeige Zielbereich
- [ ] Bei Target-Hover im Targeting-Mode: Zeige erwartete Änderung
- [ ] "Propagation Preview" für netzwerk-weite Abilities

**Files:** `BottomSheet.tsx`, `AbilityCard.tsx`

### 1.4 Micro-Rewards
**Problem:** Erfolge werden nicht gefeiert
**Lösung:**
- [ ] "Actor Controlled!" Meldung wenn Trust < 40%
- [ ] Combo-Counter für aufeinanderfolgende erfolgreiche Aktionen
- [ ] Mini-Celebration bei 25%, 50%, 75% Fortschritt

**Files:** `StatusDisplay.tsx`, neue `Celebrations.tsx`

---

## SPRINT 2: Trade-offs & Versteckte Kosten
**Fokus:** Jede Entscheidung interessant machen
**Prinzip:** "Keine Entscheidung sollte die 'beste' sein" (Sid Meier)

### 2.1 Risiko-System für Abilities
**Konzept:** Jede Ability hat eine Entdeckungs-Wahrscheinlichkeit

```typescript
type AbilityRisk = {
  detectionChance: number;      // 0-1: Chance entdeckt zu werden
  backlashMultiplier: number;   // Wie stark der Backlash
  exposureGrowth: number;       // Steigt mit jeder Nutzung
};
```

**Gameplay:**
- "Scandalize" hat 15% Chance, dass Quelle enthüllt wird
- Bei Entdeckung: Alle Akteure gewinnen +10% Trust (Sympathy-Effekt)
- Akkumulierend: Jede weitere Nutzung +5% Entdeckungsrisiko

**Neues UI-Element:** "Detection Risk Meter"

### 2.2 Aufmerksamkeits-Ökonomie
**Konzept:** Akteure haben begrenzte "Aufmerksamkeit"

```typescript
type ActorAttention = {
  currentFocus: string[];       // Worauf sie gerade achten
  attentionCapacity: number;    // Max gleichzeitige Themen
  fatigueLevel: number;         // Ermüdung reduziert Reaktion
};
```

**Gameplay:**
- Max 3 "Themen" pro Akteur gleichzeitig
- Alte Themen verfallen, neue verdrängen
- Überladung = reduzierte Wirkung aller Abilities

### 2.3 Beziehungsnetzwerk zwischen Akteuren
**Konzept:** Akteure haben Beziehungen zueinander

```typescript
type ActorRelationship = {
  targetId: string;
  type: 'ally' | 'rival' | 'neutral';
  strength: number;             // -1 bis +1
};
```

**Gameplay:**
- Angriff auf Ally → automatische Reaktion
- Rival angreifen → weniger Backlash
- Starke Allianzen schützen voreinander

**Files:** `actor-definitions.json` erweitern, `GameState.ts`

### 2.4 Resource-Trade-offs
**Konzept:** Nicht nur Kosten, sondern echte Opportunitätskosten

- [ ] "Schnell & Laut" vs "Langsam & Leise" Ability-Varianten
- [ ] Investitions-System: Ressourcen für permanente Boni ausgeben
- [ ] "Burn Rate": Hohe Ausgaben pro Runde = höheres Risiko

---

## SPRINT 3: Lebendiges Ökosystem
**Fokus:** Emergenz durch Akteur-Autonomie
**Prinzip:** "Emergenz entdecken, nicht konstruieren" (Will Wright)

### 3.1 Akteur-Persönlichkeiten
**Konzept:** Jeder Akteur hat eigene Verhaltensregeln

```typescript
type ActorPersonality = {
  // Reaktionen
  onAttacked: 'retaliate' | 'flee' | 'seek_allies' | 'ignore';
  retaliationChance: number;

  // Ziele
  primaryGoal: 'influence' | 'credibility' | 'stability';
  targetPriority: 'weakest' | 'strongest' | 'closest';

  // Gedächtnis
  memory: AttackMemory[];       // Wer hat mich angegriffen?
  grudgeDecay: number;          // Wie schnell vergisst er?
};
```

**Gameplay:**
- BILD rächt sich für Angriffe (retaliates)
- Professor sucht Verbündete (seek_allies)
- Scientist ignoriert emotionale Angriffe (ignore wenn emotional)

### 3.2 Akteur-Aktionen pro Runde
**Konzept:** Akteure handeln selbst

**Pro Runde kann jeder Akteur:**
- Allies stärken (+Trust für Verbündete)
- Rivalen angreifen (-Trust für Feinde)
- Sich verteidigen (+Resilience wenn bedroht)
- Öffentliche Statements machen (Events)

**Neues UI:** "Akteur-Aktionen Log" neben News Ticker

### 3.3 Dynamische Allianzen
**Konzept:** Beziehungen verändern sich

```typescript
type AllianceSystem = {
  // Trigger
  sharedEnemy: boolean;         // Gemeinsamer Feind = Allianz-Chance
  trustCorrelation: number;     // Ähnliches Trust-Level = Attraktion

  // Aktionen
  formAlliance(a: Actor, b: Actor): void;
  breakAlliance(a: Actor, b: Actor): void;
};
```

**Gameplay:**
- Zwei Akteure unter Angriff → bilden temporäre Allianz
- Zu unterschiedliches Trust-Level → Allianz bricht
- Allianzen verstärken Trust-Propagation

### 3.4 Kaskaden-Konsequenzen
**Konzept:** Aktionen haben Spätfolgen

```typescript
type DelayedConsequence = {
  triggerRound: number;
  effect: Effect;
  visibility: 'hidden' | 'hinted' | 'visible';
  cancellable: boolean;
};
```

**Beispiele:**
- "Scandalize" → 3 Runden später: Gegenstudie erscheint
- "Astroturfing" zu oft → Journalisten werden misstrauisch
- Trust unter 20% → Akteur "verlässt" das Netzwerk (wird inaktiv)

---

## SPRINT 4: Emotionale Tiefe
**Fokus:** Bedeutung und echte Konsequenzen
**Prinzip:** "Emotionale Realität schafft Bedeutung" (This War of Mine)

### 4.1 Personalisierte Akteure
**Konzept:** Namen und Geschichten statt Abstraktionen

```json
{
  "id": "mainstream_media",
  "name": "Maria Bergmann",
  "role": "Chefredakteurin, Süddeutsche Zeitung",
  "age": 52,
  "backstory": "30 Jahre Journalismus, hat die Wiedervereinigung berichtet",
  "family": "Verheiratet, 2 erwachsene Kinder",
  "motivation": "Glaubt an die Macht der Wahrheit"
}
```

**UI:** Bei Hover/Auswahl kurze Bio anzeigen

### 4.2 Konsequenzen-Nachrichten
**Konzept:** Zeige, was Aktionen bewirken

**Nach jeder Ability:**
```
"Nach dem Skandal erhält Maria Bergmann 2.300 Hassnachrichten auf Twitter."
"Dr. Klaus Weber's Forschungsantrag wird abgelehnt - sein Institut fragt nach seiner Glaubwürdigkeit."
"Die Bot-Kampagne hat 50.000 Menschen erreicht. 12% glauben jetzt an die Verschwörung."
```

**Files:** Neuer `ConsequenceGenerator.ts`

### 4.3 Langzeit-Auswirkungen Tracker
**Konzept:** Dashboard der Zerstörung

```typescript
type SocietalImpact = {
  livesAffected: number;           // Geschätzte betroffene Menschen
  trustInInstitutions: number;     // Allgemeines Vertrauen
  polarizationLevel: number;       // Gesellschaftliche Spaltung
  misinformationSpread: number;    // Falschinformationen im Umlauf
};
```

**UI:** Neue "Impact" Sektion im Status-Display

### 4.4 Epilog-System
**Konzept:** Was passiert nach dem Spiel?

**Victory-Epilog:**
```
2 Jahre später:
- Die Süddeutsche hat 40% ihrer Leser verloren
- Prof. Weber hat die Universität verlassen
- 23% der Bevölkerung glaubt nicht mehr an den Klimawandel
- Die Impfrate ist um 15% gesunken

10 Jahre später:
- Die Demokratie wurde geschwächt
- Extremistische Parteien haben 35% der Stimmen
- Das Vertrauen erholt sich langsam, aber die Narben bleiben
```

**Files:** Neuer `EpilogGenerator.ts`, `VictoryScreen.tsx` erweitern

### 4.5 Moralische Grauzone
**Konzept:** Nicht alles ist schwarz-weiß

**Neue Event-Typen:**
```json
{
  "id": "professor_scandal_real",
  "name": "Echter Skandal",
  "description": "Prof. Weber hat tatsächlich Daten manipuliert.",
  "choice": {
    "expose": {
      "effect": "-0.3 trust to experts",
      "moral": "Du hast die Wahrheit gesagt, aber Experten geschadet"
    },
    "ignore": {
      "effect": "nothing",
      "moral": "Du hast geschwiegen - ist das besser?"
    }
  }
}
```

---

## SPRINT 5: Replayability & Modi
**Fokus:** Verschiedene Spielerfahrungen
**Prinzip:** "Permadeath macht Entscheidungen bedeutsam" (Roguelike)

### 5.1 Spielmodi
**Implementierung:**

| Modus | Beschreibung | Änderungen |
|-------|--------------|------------|
| **Tutorial** | Geführte Einführung | Existiert ✅ |
| **Standard** | Normales Spiel | Existiert ✅ |
| **Hardcore** | Kein Undo, härtere Defender | `canUndo: false`, `defenderSpawnRate: 1.5x` |
| **Sandbox** | Keine Win-Condition | `maxRounds: Infinity`, `victoryEnabled: false` |
| **Verteidiger** | Spiele als Fact-Checker | Komplett neuer Modus |
| **Szenario** | Historische Ereignisse | Vordefinierte Netzwerke |

### 5.2 Verteidiger-Modus (NEU)
**Konzept:** Perspektivwechsel - spiele gegen die Desinformation

```typescript
type DefenderMode = {
  role: 'fact_checker' | 'media_literacy' | 'regulator';

  abilities: [
    'debunk',           // Widerlege Falschinformation
    'educate',          // Erhöhe Medienkompetenz
    'investigate',      // Enthülle Manipulation
    'coalition',        // Bilde Allianz mit Akteuren
  ];

  winCondition: 'averageTrust > 0.7 for 5 rounds';
  loseCondition: 'averageTrust < 0.3';
};
```

**Bildungswert:** Spieler lernen beide Seiten

### 5.3 Historische Szenarien
**Konzept:** Echte Desinformations-Kampagnen nachspielen

**Szenarien:**
- **US-Wahl 2016:** Russische Einflussnahme
- **Brexit:** Leave-Kampagne
- **COVID-19:** Impfskepsis-Kampagnen
- **Klimawandel:** Jahrzehnte der Leugnung

**Pro Szenario:**
- Vordefiniertes Netzwerk (echte Akteure)
- Historische Events
- Dokumentierte Taktiken
- Lern-Zusammenfassung am Ende

### 5.4 Meta-Progression (Roguelite)
**Konzept:** Zwischen Spielen etwas mitnehmen

```typescript
type MetaProgression = {
  // Freischaltungen
  unlockedAbilities: string[];     // Neue Abilities
  unlockedActors: string[];        // Neue Akteure
  unlockedModes: string[];         // Neue Modi

  // Wissen
  techniquesMastered: string[];    // Beherrschte Manipulationstechniken
  counterStrategiesLearned: string[]; // Gelernte Gegenstrategien

  // Statistiken
  totalImpact: number;             // Kumulativer Impact
  bestVictory: GameResult;
  worstDefeat: GameResult;
};
```

**Freischaltungs-Beispiele:**
- 5 Spiele gewonnen → "Bot Army" Ability freigeschaltet
- Alle Akteure kontrolliert → "Master Manipulator" Titel
- Als Verteidiger gewonnen → "Both Sides" Achievement

---

## Priorisierung & Abhängigkeiten

```
                    ┌─────────────┐
                    │  SPRINT 1   │ Quick Wins
                    │  (Sofort)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │ SPRINT 2 │  │ SPRINT 4 │  │ SPRINT 5 │
       │Trade-offs│  │ Emotion  │  │  Modi    │
       └────┬─────┘  └──────────┘  └──────────┘
            │
            ▼
       ┌──────────┐
       │ SPRINT 3 │ Lebendiges System
       │(Komplex) │
       └──────────┘
```

**Empfehlung:**
1. Sprint 1 zuerst (macht das Spiel sofort besser)
2. Sprint 2 + 4 parallel (unabhängig voneinander)
3. Sprint 3 zuletzt (baut auf Sprint 2 auf)
4. Sprint 5 kann jederzeit parallel laufen

---

## Nächster Schritt

**Sprint 1 starten mit:**
1. Impact-Zahlen bei Abilities
2. Trust-Änderungs-Animationen
3. "Actor Controlled" Celebration
4. Ability-Vorschau

Soll ich mit Sprint 1.1 beginnen?
