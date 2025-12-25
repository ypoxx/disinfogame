# System Design Briefing: Four Core Missing Systems

**Erstellt:** 2025-12-24
**Zweck:** Technische Spezifikation für maschinenlesbare Implementierung
**Zielgruppe:** Entwickler, Claude Code, Game Engine
**Status:** Design Specification

---

## 🎯 Executive Summary

Vier kritische Systeme fehlen für vollständige Game-Engine-Funktionalität:

| System | Priorität | Bisherige Abdeckung | Kritikalität |
|--------|-----------|---------------------|--------------|
| **1. Event-System** | HIGH | ⚠️ Konzeptuell (E-Mail-Inbox in Docs) | Narrative-Mechanik Brücke |
| **2. Detection-System** | CRITICAL | ❌ Nicht vorhanden | Macht Risk real, Balance essentiell |
| **3. Opposition-System** | CRITICAL | ❌ Komplett fehlend | Gegner-AI, Countermeasures, Game Challenge |
| **4. Progression-System** | MEDIUM | ⚠️ Phasen im JSON, keine Logic | Unlock-Kurve, Player-Growth |

**Detection und Opposition sind die größten Lücken** - ohne diese Systeme gibt es:
- Kein Risk (Spieler kann alles ohne Konsequenz tun)
- Keine Gegner (Kein Challenge, keine Defeat-Condition)
- Keine Spannung (Kein Push-back gegen Player-Aktionen)

---

# 1. EVENT-SYSTEM

## 1.1 Purpose & Scope

**Funktion:** Verbindet Narrative (Story) mit Mechanik (Game-State)
**Rolle:** Delivery-System für:
- Story-Beats (narrative Events)
- Game-State-Changes (mechanische Events)
- Player-Choices (Dilemmata)
- Opposition-Actions (Countermeasures)
- Random/Scripted Ereignisse

**Integration:**
- Input: Game-State (Tag, Ressourcen, Player-Aktionen)
- Output: E-Mails/Events im Inbox mit Choices
- Trigger: Zeit (Tag-basiert), Player-Aktion, Opposition-Aktion, Random

---

## 1.2 Core Requirements

### Functional Requirements:
1. **Event-Templating**: JSON-basierte Event-Definitionen
2. **Branching**: Events können andere Events triggern
3. **Conditionals**: Events erscheinen nur bei bestimmtem Game-State
4. **Choices**: Events haben 1-N Antwortoptionen mit Konsequenzen
5. **Priority-System**: Wichtige Events zuerst im Inbox
6. **Persistence**: Event-History für Narrative-Konsistenz

### Non-Functional Requirements:
- Maschinenlesbar (JSON)
- Erweiterbar (neue Events ohne Code-Change)
- Lokalisierbar (Text-Keys für i18n)
- Testbar (Deterministisches Triggern möglich)

---

## 1.3 Data Structures

### Event Definition Schema:

```json
{
  "event": {
    "id": "string",              // Unique: "event.day01.pm_meeting"
    "type": "enum",               // story | mechanic | opposition | random | scripted
    "priority": "number",         // 1-10 (10 = highest, appears first)
    "trigger": {
      "type": "enum",            // day | player_action | opposition_action | state_condition | random
      "condition": "object",     // Conditional logic (see below)
      "day_range": {             // Optional: nur für type=day
        "min": "number",
        "max": "number"
      },
      "probability": "number"    // 0.0-1.0 für random events
    },
    "sender": {
      "id": "string",            // NPC-ID oder "system" oder "opposition.journalist.anna_weber"
      "name": "string",          // Display name
      "role": "string"           // "Premierminister" | "Journalistin" | "Strategie-Direktor"
    },
    "content": {
      "subject": "string",       // E-Mail Betreff
      "body": "string",          // Markdown-formatierter Text, kann {{variables}} enthalten
      "attachments": [           // Optional
        {
          "type": "enum",        // image | document | report
          "url": "string"
        }
      ]
    },
    "choices": [
      {
        "id": "string",          // "choice.event01.accept"
        "label": "string",       // Player-facing Text
        "consequences": {
          "resources": {         // Resource-Changes
            "money": "number",   // +/- delta
            "credibility": "number",
            "production": "number",
            "contacts": "number",
            "platform_coop": "number",
            "actions": "number"
          },
          "game_state": {        // State-Changes
            "pm_trust": "number",      // Boss-Vertrauen -100 to +100
            "opposition_alert": "number", // Opposition-Awareness 0-100
            "detection_risk": "number",   // Akkumuliert Detection
            "moral_degradation": "number" // Optional: Moral-Tracking
          },
          "triggers": [          // Follow-up Events
            {
              "event_id": "string",
              "delay_days": "number"  // 0 = sofort, 1+ = später
            }
          ],
          "unlocks": [           // Freischaltungen
            "string"             // ability_id | npc_id | technique_id
          ],
          "flags": [             // Story-Flags
            {
              "key": "string",
              "value": "any"
            }
          ]
        },
        "availability": {        // Optional: Kann Choice gewählt werden?
          "requires_resources": {
            "money": "number"    // Mindestens X nötig
          },
          "requires_unlocks": ["string"],
          "requires_flags": [
            {
              "key": "string",
              "value": "any"
            }
          ]
        }
      }
    ],
    "auto_resolve": {            // Optional: Was passiert wenn ignoriert?
      "after_days": "number",
      "default_choice_id": "string"
    },
    "metadata": {
      "tags": ["string"],        // story | tutorial | opposition | critical
      "scenario_id": "string",   // Welchem Szenario gehört es an?
      "repeatable": "boolean",
      "one_time_only": "boolean"
    }
  }
}
```

### Trigger Condition Schema:

```json
{
  "condition": {
    "type": "enum",  // AND | OR | resource_check | flag_check | action_taken | day_reached
    "operator": "enum",  // >= | <= | == | != | contains
    "operands": [
      {
        "type": "enum",  // resource | flag | ability_usage | npc_interaction | opposition_action
        "key": "string",  // "money" | "flag.met_journalist" | "ability.deepfake_used"
        "value": "any"
      }
    ],
    "nested_conditions": [  // For AND/OR
      "condition_object"
    ]
  }
}
```

### Event Instance (Runtime):

```json
{
  "instance": {
    "event_id": "string",
    "instance_id": "string",     // UUID for this occurrence
    "triggered_on_day": "number",
    "status": "enum",            // pending | read | resolved
    "chosen_option_id": "string",
    "resolved_on_day": "number"
  }
}
```

---

## 1.4 API / Interfaces

### Event Manager Interface:

```typescript
interface EventManager {
  // Triggering
  checkTriggers(gameState: GameState, currentDay: number): Event[];
  triggerEvent(eventId: string, delay: number): void;

  // Inbox Management
  getInbox(status?: EventStatus): EventInstance[];
  markAsRead(instanceId: string): void;
  resolveEvent(instanceId: string, choiceId: string): EventResolution;

  // History
  getEventHistory(): EventInstance[];
  hasEventOccurred(eventId: string): boolean;

  // Flags
  setFlag(key: string, value: any): void;
  getFlag(key: string): any;
  checkCondition(condition: Condition): boolean;
}

interface EventResolution {
  success: boolean;
  resourceDeltas: ResourceDeltas;
  stateChanges: StateChanges;
  triggeredEvents: string[];
  unlocks: string[];
  flags: Record<string, any>;
}
```

---

## 1.5 Integration Points

### With Existing Systems:

| System | Integration |
|--------|-------------|
| **JSON Actors** | Event.sender.id references actor IDs |
| **JSON Techniques** | Event.choices.consequences.unlocks references technique IDs |
| **JSON Countermeasures** | Opposition-Events use countermeasure IDs |
| **Game State** | Events read/write GameState (resources, flags, unlocks) |
| **NPC System** | Events from NPCs trigger dialogues/abilities |
| **Detection System** | Events können detection_risk erhöhen |
| **Opposition System** | Opposition-Actions generate Events |

---

## 1.6 Implementation Notes

### Event Library Structure:

```
/data/events/
  /story/
    day01_intro.json
    day05_pm_pressure.json
    ...
  /opposition/
    journalist_investigation.json
    platform_moderation.json
    fact_checker_alert.json
    ...
  /tutorial/
    first_ability_unlock.json
    first_npc_meeting.json
    ...
  /random/
    budget_cut.json
    staff_complaint.json
    media_leak.json
    ...
```

### Event Triggering Flow:

```
1. Start of Day:
   - EventManager.checkTriggers(gameState, day)
   - Filter events by trigger.condition
   - Add to Inbox sorted by priority

2. Player opens Inbox:
   - Display events (unread first)
   - Player selects event
   - EventManager.markAsRead(instanceId)

3. Player chooses option:
   - Validate choice.availability
   - EventManager.resolveEvent(instanceId, choiceId)
   - Apply consequences to GameState
   - Trigger follow-up events if any
   - Update Event History

4. End of Day:
   - Check auto_resolve for pending events
   - Apply default choices if timeout reached
```

### Example Event JSON:

```json
{
  "event": {
    "id": "event.day03.journalist_inquiry",
    "type": "opposition",
    "priority": 8,
    "trigger": {
      "type": "state_condition",
      "condition": {
        "type": "AND",
        "operands": [
          {
            "type": "resource",
            "key": "detection_risk",
            "operator": ">=",
            "value": 30
          },
          {
            "type": "flag",
            "key": "bot_network_active",
            "operator": "==",
            "value": true
          }
        ]
      },
      "day_range": { "min": 3, "max": 10 }
    },
    "sender": {
      "id": "opposition.journalist.anna_weber",
      "name": "Anna Weber",
      "role": "Investigative Journalistin, Der Spiegel"
    },
    "content": {
      "subject": "Anfrage: Verdächtige Social-Media-Aktivitäten",
      "body": "Sehr geehrte Damen und Herren,\n\nim Rahmen meiner Recherchen bin ich auf auffällige Muster in sozialen Netzwerken gestoßen, die auf koordinierte Manipulation hindeuten könnten.\n\n**Konkret:** Ein Netzwerk von {{bot_count}} Accounts verbreitet regierungsnahe Narrative mit identischen Formulierungen.\n\nIch bitte um Stellungnahme bis **morgen 18 Uhr**.\n\nMit freundlichen Grüßen,\nAnna Weber"
    },
    "choices": [
      {
        "id": "choice.deny",
        "label": "Vorwürfe kategorisch zurückweisen",
        "consequences": {
          "resources": {
            "credibility": -5
          },
          "game_state": {
            "opposition_alert": 10,
            "detection_risk": 5
          },
          "triggers": [
            {
              "event_id": "event.journalist_publishes_anyway",
              "delay_days": 1
            }
          ]
        }
      },
      {
        "id": "choice.delay",
        "label": "Um Fristverlängerung bitten, Zeit gewinnen",
        "consequences": {
          "resources": {
            "actions": -1
          },
          "game_state": {
            "opposition_alert": 5
          },
          "triggers": [
            {
              "event_id": "event.journalist_second_inquiry",
              "delay_days": 2
            }
          ]
        }
      },
      {
        "id": "choice.offer_interview",
        "label": "Interview anbieten, Story kontrollieren",
        "consequences": {
          "resources": {
            "credibility": 10,
            "contacts": -5
          },
          "game_state": {
            "opposition_alert": -5,
            "pm_trust": -10
          },
          "flags": [
            {
              "key": "weber_relationship",
              "value": "cooperative"
            }
          ]
        },
        "availability": {
          "requires_resources": {
            "contacts": 5
          }
        }
      },
      {
        "id": "choice.silence_via_pm",
        "label": "PM bitten, Druck auf Verlag auszuüben",
        "consequences": {
          "resources": {
            "credibility": -15
          },
          "game_state": {
            "pm_trust": 15,
            "opposition_alert": 20,
            "detection_risk": 15,
            "moral_degradation": 10
          },
          "triggers": [
            {
              "event_id": "event.press_freedom_scandal",
              "delay_days": 3
            }
          ],
          "flags": [
            {
              "key": "weber_relationship",
              "value": "hostile"
            }
          ]
        },
        "availability": {
          "requires_resources": {
            "credibility": 20
          }
        }
      }
    ],
    "auto_resolve": {
      "after_days": 1,
      "default_choice_id": "choice.deny"
    },
    "metadata": {
      "tags": ["opposition", "critical", "journalist"],
      "scenario_id": "hybrid_crisis",
      "one_time_only": true
    }
  }
}
```

---

# 2. DETECTION-SYSTEM

## 2.1 Purpose & Scope

**Funktion:** Macht RISK real - verhindert consequence-free Gameplay
**Rolle:**
- Tracking von Player-Aktionen die detektierbar sind
- Berechnung von Detection-Wahrscheinlichkeit
- Triggering von Aufdeckungs-Events
- Balancing von Risk vs. Reward

**KRITISCH:** Ohne Detection-System kann Spieler alles tun ohne Konsequenz

---

## 2.2 Core Requirements

### Functional Requirements:
1. **Risk-Tracking**: Jede Ability hat detection_risk_value
2. **Risk-Accumulation**: Detection-Risk akkumuliert über Zeit
3. **Risk-Decay**: Risk sinkt langsam wenn keine riskante Aktionen
4. **Detection-Triggers**: Bei Threshold werden Aufdeckungs-Events triggered
5. **Mitigation**: Spieler kann Risk durch Abilities senken (Opsec, Cover-ups)
6. **Actor-Specific Risk**: Verschiedene Actors haben verschiedene Detection-Difficulty
7. **Countermeasure-Integration**: Opposition-Countermeasures erhöhen Detection-Chance

### Non-Functional Requirements:
- Transparent (Spieler sieht Risk-Level)
- Fair (Risk ist berechenbar, nicht random-unfair)
- Granular (Verschiedene Detection-Types: Bot, Financial, Content, Behavioral)
- Balanciert (High-Risk-Abilities haben High-Reward)

---

## 2.3 Data Structures

### Detection Risk Schema:

```json
{
  "detection_risk": {
    "total": "number",           // 0-100 aggregierte Risk
    "by_category": {
      "bot_detection": "number", // 0-100 Risk dass Bots entdeckt werden
      "financial_trail": "number", // 0-100 Risk durch Geld-Spuren
      "content_analysis": "number", // 0-100 Risk durch Content-Patterns
      "behavioral_signature": "number", // 0-100 Risk durch Verhaltensmuster
      "network_analysis": "number", // 0-100 Risk durch Netzwerk-Graphen
      "whistleblower": "number"   // 0-100 Risk durch interne Leaks
    },
    "thresholds": {
      "low_alert": 25,           // Erste Warnungen
      "medium_alert": 50,        // Investigationen starten
      "high_alert": 75,          // Majore Aufdeckungs-Events
      "critical": 90             // Game-Over-Risk
    },
    "modifiers": {
      "base_decay_per_day": -2,  // Risk sinkt um 2/Tag wenn inaktiv
      "opposition_countermeasure_multiplier": 1.5,  // CM erhöhen Detection um 50%
      "difficulty_multiplier": 1.0  // Easy: 0.5, Hard: 1.5
    }
  }
}
```

### Ability Risk Profile:

```json
{
  "ability": {
    "id": "ability.deepfake",
    "detection_profile": {
      "base_risk": 40,           // Basis-Risk beim Nutzen
      "risk_categories": {
        "content_analysis": 30,  // Primär detektierbar durch Content
        "behavioral_signature": 10
      },
      "risk_factors": [
        {
          "condition": "sophistication >= high",
          "risk_modifier": -10   // Hochwertige Deepfakes schwerer zu erkennen
        },
        {
          "condition": "opposition.fact_checker.active",
          "risk_modifier": 20    // Fact-Checker erhöhen Risk
        }
      ],
      "detection_delay_days": 2  // Wie lange bis Risk akkumuliert (nicht sofort)
    }
  }
}
```

### Detection Event Trigger:

```json
{
  "detection_trigger": {
    "id": "trigger.bot_detection",
    "threshold": 50,             // Bei bot_detection >= 50
    "category": "bot_detection",
    "events": [
      {
        "event_id": "event.platform_flags_bots",
        "probability": 0.7,      // 70% Chance bei Threshold
        "cooldown_days": 5       // Kann nur alle 5 Tage triggern
      },
      {
        "event_id": "event.researcher_publishes_analysis",
        "probability": 0.3,
        "cooldown_days": 10
      }
    ],
    "consequences": {
      "on_trigger": {
        "resources": {
          "credibility": -20,
          "platform_coop": -15
        },
        "game_state": {
          "opposition_alert": 25
        }
      }
    }
  }
}
```

### Actor Detection Attributes (extends JSON actors):

```json
{
  "actor": {
    "id": "actor.automation.simple_bot",
    "detection_attributes": {
      "detection_difficulty": "low",  // From JSON
      "detection_difficulty_numeric": 20,  // 0-100
      "primary_detection_category": "bot_detection",
      "opsec_vulnerability": "high",  // Wie leicht macht es OPSEC-Fehler?
      "pattern_predictability": "high"  // Wie vorhersehbar sind Patterns?
    }
  }
}
```

---

## 2.4 API / Interfaces

### Detection Manager Interface:

```typescript
interface DetectionManager {
  // Risk Management
  getCurrentRisk(): DetectionRisk;
  getRiskByCategory(category: DetectionCategory): number;
  addRisk(abilityId: string, context: GameContext): void;
  applyRiskDecay(days: number): void;

  // Detection Events
  checkDetectionTriggers(): DetectionEvent[];
  calculateDetectionProbability(abilityId: string, context: GameContext): number;

  // Mitigation
  mitigateRisk(category: DetectionCategory, amount: number): void;

  // Indicators (Player-facing)
  getDetectionIndicators(): DetectionIndicator[];
  getRiskForecast(abilityId: string): RiskForecast;

  // Opposition-Integration
  applyCountermeasure(countermeasureId: string): void;
}

interface DetectionRisk {
  total: number;
  by_category: Record<DetectionCategory, number>;
  alert_level: "none" | "low" | "medium" | "high" | "critical";
}

interface RiskForecast {
  current_risk: number;
  projected_risk_after_action: number;
  detection_probability: number;  // 0.0-1.0
  primary_risk_category: DetectionCategory;
  mitigation_options: MitigationOption[];
}

interface DetectionIndicator {
  category: DetectionCategory;
  signals: string[];  // Player-facing warnings
  severity: "low" | "medium" | "high";
}
```

---

## 2.5 Integration Points

### With Existing Systems:

| System | Integration |
|--------|-------------|
| **Ability System** | Each Ability has detection_profile |
| **Actor System** | Actors have detection_difficulty from JSON |
| **Event System** | Detection triggers Opposition-Events |
| **Opposition System** | Countermeasures increase detection_risk |
| **Game State** | Detection-Risk tracked in GameState.detection |
| **UI** | Risk-Meter visible to player, Forecasts before actions |

---

## 2.6 Implementation Notes

### Risk Calculation Algorithm:

```typescript
function calculateDetectionRisk(
  ability: Ability,
  actor: Actor,
  gameState: GameState
): DetectionRiskDelta {

  let baseRisk = ability.detection_profile.base_risk;

  // Actor-basierte Modifikation
  const actorDifficultyModifier = {
    "low": 1.5,      // Simple Bots: +50% Risk
    "medium": 1.0,
    "high": 0.7,     // Sophisticated Bots: -30% Risk
    "very_high": 0.5
  };

  const actorModifier = actorDifficultyModifier[actor.detection_attributes.detection_difficulty];
  baseRisk *= actorModifier;

  // Opposition-Countermeasure-Check
  if (gameState.opposition.activeCountermeasures.includes("C00092")) { // Bot Detection
    if (ability.detection_profile.risk_categories.bot_detection > 0) {
      baseRisk *= 1.5; // +50% wenn Bot-Detection-Countermeasure aktiv
    }
  }

  // Difficulty-Modifier
  baseRisk *= gameState.difficulty.detection_multiplier;

  // Risk-Faktoren aus Ability-Definition
  for (const factor of ability.detection_profile.risk_factors) {
    if (evaluateCondition(factor.condition, gameState)) {
      baseRisk += factor.risk_modifier;
    }
  }

  // Kategorie-Split
  const riskByCategory: Record<DetectionCategory, number> = {};
  for (const [category, percentage] of Object.entries(ability.detection_profile.risk_categories)) {
    riskByCategory[category] = baseRisk * (percentage / 100);
  }

  return {
    total: baseRisk,
    by_category: riskByCategory,
    delay_days: ability.detection_profile.detection_delay_days
  };
}
```

### Risk Decay:

```typescript
function applyDailyDecay(detectionRisk: DetectionRisk): void {
  const decayRate = detectionRisk.modifiers.base_decay_per_day;

  for (const category of Object.keys(detectionRisk.by_category)) {
    detectionRisk.by_category[category] = Math.max(
      0,
      detectionRisk.by_category[category] + decayRate
    );
  }

  detectionRisk.total = Object.values(detectionRisk.by_category)
    .reduce((sum, val) => sum + val, 0) / Object.keys(detectionRisk.by_category).length;
}
```

### Detection Trigger Check:

```typescript
function checkDetectionTriggers(
  detectionRisk: DetectionRisk,
  triggers: DetectionTrigger[]
): Event[] {
  const triggeredEvents: Event[] = [];

  for (const trigger of triggers) {
    const categoryRisk = detectionRisk.by_category[trigger.category];

    if (categoryRisk >= trigger.threshold) {
      // Check Cooldown
      if (canTrigger(trigger)) {
        // Roll for probability
        for (const eventConfig of trigger.events) {
          if (Math.random() < eventConfig.probability) {
            triggeredEvents.push(getEvent(eventConfig.event_id));
            updateCooldown(trigger, eventConfig);
          }
        }
      }
    }
  }

  return triggeredEvents;
}
```

### Player-Facing Risk Indicators:

```typescript
function getDetectionIndicators(detectionRisk: DetectionRisk): DetectionIndicator[] {
  const indicators: DetectionIndicator[] = [];

  // Bot Detection
  if (detectionRisk.by_category.bot_detection > 30) {
    indicators.push({
      category: "bot_detection",
      signals: [
        "Plattformen haben verdächtige Aktivitätsmuster gemeldet",
        "Mehrere Accounts zeigen identisches Posting-Verhalten",
        "Forscher diskutieren anomale Netzwerk-Strukturen"
      ],
      severity: detectionRisk.by_category.bot_detection > 60 ? "high" : "medium"
    });
  }

  // Financial Trail
  if (detectionRisk.by_category.financial_trail > 40) {
    indicators.push({
      category: "financial_trail",
      signals: [
        "Ungewöhnliche Zahlungsströme könnten Aufmerksamkeit erregen",
        "Journalisten recherchieren zu PR-Agentur-Budgets"
      ],
      severity: detectionRisk.by_category.financial_trail > 70 ? "high" : "medium"
    });
  }

  // ... weitere Kategorien

  return indicators;
}
```

### Example: Deepfake Detection Profile

```json
{
  "ability": {
    "id": "ability.create_deepfake",
    "name": "Deepfake Video erstellen",
    "technique_id": "disarm_unverified.tech.t0086",
    "detection_profile": {
      "base_risk": 40,
      "risk_categories": {
        "content_analysis": 30,
        "behavioral_signature": 5,
        "whistleblower": 5
      },
      "risk_factors": [
        {
          "condition": "actor.sophistication >= high",
          "risk_modifier": -10,
          "reason": "High-quality Deepfakes schwerer zu erkennen"
        },
        {
          "condition": "opposition.fact_checker.active == true",
          "risk_modifier": 20,
          "reason": "Fact-Checker nutzen Deepfake-Detection-Tools"
        },
        {
          "condition": "gameState.flags.deepfake_scandal_occurred == true",
          "risk_modifier": 30,
          "reason": "Nach Skandal sind Medien hypersensibel"
        }
      ],
      "detection_delay_days": 2,
      "mitigation_options": [
        {
          "ability_id": "ability.damage_control",
          "risk_reduction": -15
        }
      ]
    }
  }
}
```

---

# 3. OPPOSITION-SYSTEM

## 3.1 Purpose & Scope

**Funktion:** Gegner-AI, macht das Spiel zu einem echten Challenge
**Rolle:**
- Definiert Gegner (Investigative Journalisten, Fact-Checkers, Plattformen, NGOs, Regulatoren)
- Gegner-Actions (Investigationen, Countermeasures, Publikationen)
- Opposition-AI (Wann/wie reagieren Gegner auf Player-Aktionen?)
- Win/Loss-Conditions (Player kann verlieren durch Opposition-Success)

**KRITISCH:** Aktuell komplett fehlend - sowohl in JSON als auch in Docs

---

## 3.2 Core Requirements

### Functional Requirements:
1. **Opposition-Archetypen**: 5-7 Gegner-Typen mit verschiedenen Fähigkeiten
2. **Opposition-Actions**: Konkrete Aktionen die Gegner durchführen können
3. **Opposition-AI**: Regelbasierte Entscheidungslogik wann Gegner agieren
4. **Alert-System**: Opposition wird aufmerksam durch Player-Aktionen/Detection-Risk
5. **Investigation-Progression**: Gegner bauen Cases über Zeit auf
6. **Countermeasure-Execution**: Gegner nutzen DISARM-Countermeasures aus JSON
7. **Multi-Actor-Coordination**: Gegner können zusammenarbeiten (z.B. Journalist + Fact-Checker)
8. **Win-Conditions für Opposition**: Wenn Opposition erfolgreich = Player verliert

### Non-Functional Requirements:
- Fair (Spieler kann Opposition-Actions vorhersehen/mitigieren)
- Skalierbar (Easy: Passive Gegner, Hard: Proaktive Multi-Actor-Koordination)
- Konsistent (Opposition-Verhalten folgt logischen Regeln)
- Interessant (Verschiedene Gegner erfordern verschiedene Strategien)

---

## 3.3 Data Structures

### Opposition Actor Archetype:

```json
{
  "opposition_actor": {
    "id": "string",              // "opposition.journalist.investigative"
    "type": "enum",              // journalist | fact_checker | platform | regulator | ngo | researcher
    "name": "string",
    "organization": "string",    // "Der Spiegel" | "Correctiv" | "Twitter Safety"
    "attributes": {
      "resources": "enum",       // low | medium | high | very_high
      "sophistication": "enum",  // low | medium | high | very_high
      "reach": "enum",           // local | national | regional | global
      "independence": "enum",    // low | medium | high (Wie unabhängig von Staat?)
      "credibility": "number"    // 0-100 Public Trust
    },
    "capabilities": [
      {
        "countermeasure_id": "string",  // Referenz zu DISARM Countermeasures
        "effectiveness": "number",      // 0-100 Wie gut können sie es nutzen?
        "cooldown_days": "number"       // Wie oft können sie es nutzen?
      }
    ],
    "detection_specialization": [
      "string"  // "bot_detection" | "financial_investigation" | "content_analysis"
    ],
    "alert_triggers": [
      {
        "condition": "string",   // "detection_risk.bot_detection >= 40"
        "alert_increase": "number"  // +20 Alert
      }
    ],
    "investigation_templates": [
      {
        "template_id": "string",
        "required_alert_level": "number",  // Min. Alert um zu starten
        "duration_days": "number",         // Wie lange dauert Investigation?
        "success_conditions": {
          "detection_risk_category": "string",
          "threshold": "number"
        }
      }
    ]
  }
}
```

### Opposition State (Runtime):

```json
{
  "opposition_state": {
    "actors": {
      "opposition.journalist.anna_weber": {
        "alert_level": 45,       // 0-100 Wie aufmerksam ist sie?
        "active_investigations": [
          {
            "investigation_id": "uuid",
            "template_id": "investigation.bot_network",
            "started_day": 5,
            "progress": 0.6,     // 0.0-1.0
            "evidence_gathered": [
              {
                "type": "bot_detection",
                "strength": 70   // Wie stark ist der Beweis?
              },
              {
                "type": "financial_trail",
                "strength": 30
              }
            ],
            "completion_day": 12
          }
        ],
        "relationship_to_player": "hostile",  // cooperative | neutral | suspicious | hostile
        "last_action_day": 3,
        "cooldowns": {
          "countermeasure.c00092": 2  // Noch 2 Tage Cooldown
        }
      }
    },
    "coordinated_actions": [
      {
        "id": "uuid",
        "actors": ["opposition.journalist.anna_weber", "opposition.fact_checker.correctiv"],
        "action": "joint_publication",
        "trigger_day": 15,
        "impact": "critical"
      }
    ],
    "total_opposition_pressure": 67  // 0-100 Aggregierte Opposition
  }
}
```

### Opposition Action Definition:

```json
{
  "opposition_action": {
    "id": "action.journalist_investigation",
    "actor_type": "journalist",
    "action_type": "investigation",
    "prerequisites": {
      "alert_level": 30,
      "detection_category": "bot_detection",
      "detection_threshold": 40
    },
    "duration_days": 7,
    "execution": {
      "phases": [
        {
          "day": 0,
          "event_id": "event.journalist_starts_research",
          "visibility_to_player": "hidden"
        },
        {
          "day": 3,
          "event_id": "event.journalist_asks_questions",
          "visibility_to_player": "visible",
          "player_can_intervene": true
        },
        {
          "day": 7,
          "event_id": "event.journalist_publishes",
          "visibility_to_player": "visible",
          "success_condition": {
            "evidence_strength": 60
          }
        }
      ]
    },
    "outcomes": {
      "on_success": {
        "consequences": {
          "resources": {
            "credibility": -30,
            "platform_coop": -20
          },
          "game_state": {
            "opposition_alert": 30,
            "pm_trust": -25,
            "detection_risk": {
              "bot_detection": -40  // Risk sinkt nach Aufdeckung
            }
          },
          "flags": [
            {
              "key": "bot_scandal_public",
              "value": true
            }
          ],
          "player_abilities_disabled": [
            "ability.bot_amplification"  // Kann temporär nicht genutzt werden
          ]
        },
        "game_over_risk": 0.3  // 30% Chance dass PM dich feuert
      },
      "on_failure": {
        "consequences": {
          "game_state": {
            "opposition_alert": -10
          }
        }
      }
    },
    "player_mitigation_options": [
      {
        "ability_id": "ability.damage_control",
        "impact_reduction": 0.5  // Reduziert Konsequenzen um 50%
      },
      {
        "ability_id": "ability.silence_journalist",
        "success_probability": 0.3,
        "backfire_risk": 0.4
      }
    ]
  }
}
```

### Opposition AI Decision Tree:

```json
{
  "opposition_ai": {
    "decision_model": "rule_based",  // Oder: "state_machine" | "utility_based"
    "rules": [
      {
        "priority": 10,
        "condition": {
          "type": "AND",
          "operands": [
            {
              "key": "opposition.alert_level",
              "operator": ">=",
              "value": 50
            },
            {
              "key": "detection_risk.bot_detection",
              "operator": ">=",
              "value": 60
            },
            {
              "key": "opposition.active_investigations",
              "operator": "==",
              "value": 0
            }
          ]
        },
        "action": {
          "type": "start_investigation",
          "action_id": "action.journalist_investigation"
        }
      },
      {
        "priority": 8,
        "condition": {
          "key": "flags.bot_scandal_public",
          "operator": "==",
          "value": true
        },
        "action": {
          "type": "execute_countermeasure",
          "countermeasure_id": "disarm_unverified.cm.c00013",  // Deplatforming
          "target": "player.bot_networks"
        }
      },
      {
        "priority": 5,
        "condition": {
          "type": "AND",
          "operands": [
            {
              "key": "opposition.alert_level",
              "operator": ">=",
              "value": 70
            },
            {
              "key": "day",
              "operator": ">=",
              "value": 20
            }
          ]
        },
        "action": {
          "type": "coordinate_multi_actor",
          "actors": ["opposition.journalist", "opposition.fact_checker", "opposition.ngo"],
          "action_id": "action.joint_expose_campaign"
        }
      }
    ],
    "daily_decision_logic": {
      "step_1": "Evaluate all rules by priority",
      "step_2": "Check conditions for each rule",
      "step_3": "Execute highest-priority matching rule",
      "step_4": "Update opposition state",
      "step_5": "Generate events if visible to player"
    }
  }
}
```

---

## 3.4 Opposition Actor Catalog (NEW - Missing from JSON)

### Definierte Opposition-Archetypen:

```json
{
  "opposition_actors": [
    {
      "id": "opposition.journalist.investigative",
      "type": "journalist",
      "name": "Investigative Journalistin",
      "example_character": "Anna Weber, Der Spiegel",
      "attributes": {
        "resources": "high",
        "sophistication": "high",
        "reach": "national",
        "independence": "high",
        "credibility": 85
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00021",
          "label": "Independent Reporting",
          "effectiveness": 90,
          "cooldown_days": 14
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00092",
          "label": "Bot Detection & Analysis",
          "effectiveness": 70,
          "cooldown_days": 7
        }
      ],
      "detection_specialization": ["bot_detection", "financial_trail", "network_analysis"],
      "alert_triggers": [
        {
          "condition": "detection_risk.bot_detection >= 40",
          "alert_increase": 20
        },
        {
          "condition": "ability.deepfake_used == true",
          "alert_increase": 30
        }
      ]
    },
    {
      "id": "opposition.fact_checker.professional",
      "type": "fact_checker",
      "name": "Professionelle Fact-Checker",
      "example_character": "Correctiv, Mimikama",
      "attributes": {
        "resources": "medium",
        "sophistication": "very_high",
        "reach": "national",
        "independence": "high",
        "credibility": 80
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00008",
          "label": "Shared Fact-Checking Database",
          "effectiveness": 95,
          "cooldown_days": 1
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00153",
          "label": "Prebunking",
          "effectiveness": 75,
          "cooldown_days": 7
        }
      ],
      "detection_specialization": ["content_analysis"],
      "alert_triggers": [
        {
          "condition": "detection_risk.content_analysis >= 35",
          "alert_increase": 25
        },
        {
          "condition": "ability.distort_facts_used >= 3",
          "alert_increase": 20
        }
      ]
    },
    {
      "id": "opposition.platform.moderation",
      "type": "platform",
      "name": "Social Media Platform Safety Team",
      "example_character": "Twitter/X Safety, Meta Integrity",
      "attributes": {
        "resources": "very_high",
        "sophistication": "high",
        "reach": "global",
        "independence": "medium",
        "credibility": 60
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00092",
          "label": "Automated Bot Detection",
          "effectiveness": 80,
          "cooldown_days": 1
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00013",
          "label": "Deplatforming",
          "effectiveness": 100,
          "cooldown_days": 30
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00126",
          "label": "Account Verification Requirements",
          "effectiveness": 70,
          "cooldown_days": 60
        }
      ],
      "detection_specialization": ["bot_detection", "behavioral_signature"],
      "alert_triggers": [
        {
          "condition": "detection_risk.bot_detection >= 50",
          "alert_increase": 30
        },
        {
          "condition": "flags.platform_coop < 30",
          "alert_increase": 15
        }
      ],
      "special_mechanics": {
        "can_be_influenced": true,
        "influence_cost": {
          "platform_coop": 20
        },
        "influence_effect": {
          "alert_reduction": 20,
          "effectiveness_reduction": 30
        }
      }
    },
    {
      "id": "opposition.regulator.government",
      "type": "regulator",
      "name": "Regulierungsbehörde",
      "example_character": "Bundesnetzagentur, FTC",
      "attributes": {
        "resources": "very_high",
        "sophistication": "medium",
        "reach": "national",
        "independence": "medium",
        "credibility": 70
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00012",
          "label": "Platform Regulation",
          "effectiveness": 85,
          "cooldown_days": 90
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00027",
          "label": "Audit Search Algorithms",
          "effectiveness": 60,
          "cooldown_days": 60
        }
      ],
      "detection_specialization": ["financial_trail"],
      "alert_triggers": [
        {
          "condition": "flags.public_scandal == true",
          "alert_increase": 40
        }
      ],
      "special_mechanics": {
        "influenced_by_pm": true,
        "influence_threshold": {
          "pm_trust": 60
        }
      }
    },
    {
      "id": "opposition.ngo.media_literacy",
      "type": "ngo",
      "name": "Media Literacy NGO",
      "example_character": "Reporter ohne Grenzen, Neue deutsche Medienmacher",
      "attributes": {
        "resources": "low",
        "sophistication": "medium",
        "reach": "national",
        "independence": "very_high",
        "credibility": 75
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00029",
          "label": "Media Literacy Campaign",
          "effectiveness": 65,
          "cooldown_days": 30
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00153",
          "label": "Prebunking Workshops",
          "effectiveness": 60,
          "cooldown_days": 14
        }
      ],
      "detection_specialization": ["content_patterns"],
      "alert_triggers": [
        {
          "condition": "detection_risk.total >= 60",
          "alert_increase": 15
        }
      ]
    },
    {
      "id": "opposition.researcher.academic",
      "type": "researcher",
      "name": "Akademische Forscher",
      "example_character": "Computational Propaganda Lab, DFRLab",
      "attributes": {
        "resources": "medium",
        "sophistication": "very_high",
        "reach": "global",
        "independence": "very_high",
        "credibility": 90
      },
      "capabilities": [
        {
          "countermeasure_id": "disarm_unverified.cm.c00092",
          "label": "Network Analysis Research",
          "effectiveness": 95,
          "cooldown_days": 21
        },
        {
          "countermeasure_id": "disarm_unverified.cm.c00010",
          "label": "Social Engineering Detection",
          "effectiveness": 85,
          "cooldown_days": 30
        }
      ],
      "detection_specialization": ["network_analysis", "behavioral_signature"],
      "alert_triggers": [
        {
          "condition": "detection_risk.network_analysis >= 50",
          "alert_increase": 25
        }
      ]
    }
  ]
}
```

---

## 3.5 API / Interfaces

### Opposition Manager Interface:

```typescript
interface OppositionManager {
  // State Management
  getOppositionState(): OppositionState;
  getActorState(actorId: string): OppositionActorState;
  updateAlertLevel(actorId: string, delta: number): void;

  // AI Decision-Making
  executeOppositionTurn(day: number, gameState: GameState): OppositionAction[];
  evaluateOppositionRules(actor: OppositionActor, gameState: GameState): OppositionAction | null;

  // Investigations
  startInvestigation(actorId: string, templateId: string): Investigation;
  updateInvestigationProgress(investigationId: string, day: number): void;
  resolveInvestigation(investigationId: string): InvestigationResult;

  // Countermeasures
  executeCountermeasure(actorId: string, countermeasureId: string, target: any): CountermeasureResult;

  // Coordination
  canCoordinate(actorIds: string[]): boolean;
  coordinateAction(actorIds: string[], actionId: string): CoordinatedAction;

  // Player-Facing
  getVisibleOppositionActions(): OppositionAction[];
  getMitigationOptions(actionId: string): MitigationOption[];
}

interface OppositionAction {
  id: string;
  actor_id: string;
  action_type: "investigation" | "countermeasure" | "publication" | "coordination";
  visibility: "hidden" | "visible";
  impact_level: "low" | "medium" | "high" | "critical";
  execution_day: number;
  player_can_intervene: boolean;
}

interface InvestigationResult {
  success: boolean;
  evidence_strength: number;  // 0-100
  consequences: Consequences;
  follow_up_actions: string[];
}
```

---

## 3.6 Integration Points

### With Existing Systems:

| System | Integration |
|--------|-------------|
| **Detection System** | Detection-Risk triggers Opposition-Alert |
| **Event System** | Opposition-Actions generate Events |
| **Countermeasures (JSON)** | Opposition uses DISARM Countermeasures |
| **Game State** | Opposition-State tracked in GameState |
| **Ability System** | Player-Abilities affect Opposition-Alert |
| **Win/Loss System** | Opposition-Success can trigger Game-Over |

---

## 3.7 Implementation Notes

### Opposition AI Turn Execution:

```typescript
function executeOppositionTurn(day: number, gameState: GameState): void {
  const oppositionState = gameState.opposition;

  // 1. Update Investigations
  for (const actor of Object.values(oppositionState.actors)) {
    for (const investigation of actor.active_investigations) {
      if (investigation.completion_day === day) {
        const result = resolveInvestigation(investigation, gameState);
        if (result.success) {
          applyConsequences(result.consequences);
          generateEvent(result.publication_event_id);
        }
      }
    }
  }

  // 2. Decay Alert Levels
  for (const actor of Object.values(oppositionState.actors)) {
    actor.alert_level = Math.max(0, actor.alert_level - 2); // -2/day
  }

  // 3. Check Triggers & Execute Rules
  for (const actor of getActiveOppositionActors()) {
    const action = evaluateOppositionRules(actor, gameState);
    if (action) {
      scheduleAction(action);
    }
  }

  // 4. Update Cooldowns
  for (const actor of Object.values(oppositionState.actors)) {
    for (const [cm_id, daysLeft] of Object.entries(actor.cooldowns)) {
      if (daysLeft > 0) {
        actor.cooldowns[cm_id]--;
      }
    }
  }
}
```

### Example: Investigation Resolution

```typescript
function resolveInvestigation(
  investigation: Investigation,
  gameState: GameState
): InvestigationResult {

  // Berechne Beweis-Stärke
  let evidenceStrength = 0;
  for (const evidence of investigation.evidence_gathered) {
    evidenceStrength += evidence.strength;
  }
  evidenceStrength /= investigation.evidence_gathered.length;

  // Check Success
  const threshold = investigation.success_conditions.threshold;
  const success = evidenceStrength >= threshold;

  if (success) {
    return {
      success: true,
      evidence_strength: evidenceStrength,
      consequences: {
        resources: {
          credibility: -30,
          platform_coop: -20
        },
        game_state: {
          opposition_alert: 30,
          pm_trust: -25
        }
      },
      follow_up_actions: [
        "action.platform_deplatforming",
        "action.regulator_investigation"
      ]
    };
  } else {
    return {
      success: false,
      evidence_strength: evidenceStrength,
      consequences: {
        game_state: {
          opposition_alert: -10
        }
      },
      follow_up_actions: []
    };
  }
}
```

---

# 4. PROGRESSION-SYSTEM

## 4.1 Purpose & Scope

**Funktion:** Unlock-Kurve, verhindert Ability-Overload am Start
**Rolle:**
- Tech-Tree basierend auf DISARM-Phasen (TA01-TA07)
- Ability-Freischaltung über Zeit/Erfolge
- NPC-Freischaltung
- Difficulty-Progression (Gegner werden stärker)

---

## 4.2 Core Requirements

### Functional Requirements:
1. **Phase-basierte Progression**: DISARM TA01→TA07 als Progression-Phasen
2. **Unlock-Conditions**: Abilities freischalten durch Zeit/Erfolge/Ressourcen
3. **NPC-Availability**: NPCs schalten sich über Zeit frei
4. **Upgrade-System**: Bestehende Abilities upgraden
5. **Difficulty-Scaling**: Opposition wird stärker je weiter das Spiel fortschreitet

---

## 4.3 Data Structures

### Progression Phase (extends JSON):

```json
{
  "progression_phase": {
    "phase_id": "TA02",
    "tactic_id": "disarm_unverified.tactic.ta02",
    "label": "Assets & Infrastructure",
    "unlock_condition": {
      "day": 3,
      "OR": [
        {
          "previous_phase_completed": "TA01"
        },
        {
          "abilities_used_count": 5
        }
      ]
    },
    "unlocks": {
      "abilities": [
        "ability.create_bot_network",
        "ability.develop_personas",
        "ability.create_fake_media_sites"
      ],
      "npcs": [
        "npc.bot_farm_tech_chief"
      ]
    },
    "opposition_scaling": {
      "alert_multiplier": 1.1,
      "new_opposition_actors": [
        "opposition.platform.moderation"
      ]
    }
  }
}
```

### Unlock System:

```json
{
  "unlock": {
    "id": "unlock.ability.deepfake",
    "type": "ability",
    "target_id": "ability.create_deepfake",
    "requirements": {
      "phase": "TA03",
      "AND": [
        {
          "day": 10
        },
        {
          "resources": {
            "money": 500,
            "production": 50
          }
        },
        {
          "abilities_mastered": [
            "ability.ai_text_generation"
          ]
        }
      ]
    },
    "unlock_cost": {
      "money": 200,
      "actions": 2
    }
  }
}
```

---

## 4.4 API / Interfaces

```typescript
interface ProgressionManager {
  getCurrentPhase(): ProgressionPhase;
  checkPhaseUnlock(phaseId: string): boolean;
  unlockPhase(phaseId: string): void;

  getAvailableAbilities(): Ability[];
  canUnlock(unlockId: string): boolean;
  unlock(unlockId: string): UnlockResult;

  scaleDifficulty(day: number): void;
}
```

---

## 4.5 Implementation Notes

**Progression-Kurve:**
- Tag 1-5: TA01 (Strategie) + TA02 (Assets) - Basics
- Tag 6-12: TA03 (Content) + TA04 (Distribution) - Content-Creation
- Tag 13-20: TA05 (Amplification) + TA06 (Engagement) - Scaling
- Tag 21-32: TA07 (Vulnerabilities) - Advanced Manipulation

**Opposition-Scaling:**
- Tag 1-10: Nur passive Opposition (Fact-Checkers)
- Tag 11-20: + Aktive Journalisten
- Tag 21-32: + Koordinierte Multi-Actor-Opposition

---

# 5. INTEGRATION OVERVIEW

## System Dependencies:

```
Event-System
  ├─ Reads: Game-State, Detection-Risk, Opposition-State
  ├─ Writes: Game-State, Triggers, Flags
  └─ Triggers: Opposition-Actions, Detection-Events

Detection-System
  ├─ Reads: Ability-Usage, Actor-Attributes, Opposition-Countermeasures
  ├─ Writes: Detection-Risk
  └─ Triggers: Detection-Events → Event-System

Opposition-System
  ├─ Reads: Detection-Risk, Game-State, Player-Actions
  ├─ Writes: Opposition-State, Alert-Levels, Investigations
  └─ Triggers: Opposition-Events → Event-System
  └─ Uses: Countermeasures (JSON)

Progression-System
  ├─ Reads: Game-State, Day, Resources
  ├─ Writes: Unlocks, Phase-State
  └─ Triggers: Unlock-Events → Event-System
```

---

# 6. IMPLEMENTATION ROADMAP

## Phase 1: Data Layer (Week 1-2)
1. Define JSON-Schemas für alle 4 Systeme
2. Erstelle Beispiel-Daten (10 Events, 3 Opposition-Actors, 1 Progression-Phase)
3. Validiere Schemas gegen Beispiel-Daten

## Phase 2: Core Logic (Week 3-4)
1. Implementiere Event-Manager (Trigger-Logic, Inbox, Choices)
2. Implementiere Detection-Manager (Risk-Calculation, Decay, Triggers)
3. Implementiere Opposition-Manager (AI-Rules, Investigations, Countermeasures)
4. Implementiere Progression-Manager (Phase-Unlock, Ability-Unlock)

## Phase 3: Integration (Week 5)
1. Verbinde Detection → Event-System
2. Verbinde Opposition → Event-System
3. Verbinde Progression → Unlock-System
4. End-to-End-Test: Player-Action → Detection → Opposition-Reaction → Event

## Phase 4: Content (Week 6-8)
1. Erstelle 100+ Events (Story, Opposition, Random)
2. Definiere 5-7 Opposition-Actors mit AI-Rules
3. Definiere komplette Progression-Kurve (TA01-TA07)
4. Erstelle Balancing-Tabelle

## Phase 5: Balancing & Testing (Week 9-10)
1. Playtest: Easy/Medium/Hard Difficulty
2. Balance Detection-Risk-Werte
3. Balance Opposition-AI-Aggressiveness
4. Balance Progression-Kurve

---

# 7. OPEN QUESTIONS & DESIGN DECISIONS NEEDED

## Event-System:
- ❓ Wie viele Events sollten gleichzeitig im Inbox sein? (Max 5? 10?)
- ❓ Sollen Events auto-expire oder kann Spieler alle sammeln?
- ❓ Priorität-System: Automatisch oder Player-wählbar?

## Detection-System:
- ❓ Risk-Decay: -2/Tag zu schnell/langsam?
- ❓ Detection-Trigger: Probability-based oder Threshold-deterministic?
- ❓ Kann Spieler Detection-Risk sehen (transparent) oder nur Indicators (opaque)?

## Opposition-System:
- ❓ Wie viele Opposition-Actors gleichzeitig aktiv? (3? 5? Alle?)
- ❓ Investigation-Duration: 3-7 Tage realistisch?
- ❓ Multi-Actor-Coordination: Ab welchem Difficulty-Level?
- ❓ Kann Spieler Opposition-Actors permanent ausschalten oder respawnen sie?

## Progression-System:
- ❓ Linear (Phase 1→2→3) oder Player-Choice (freie Reihenfolge)?
- ❓ Unlock-Costs: Free oder Resources?
- ❓ Abilities upgraden oder nur freischalten?

---

**Ende des Briefings**

Dieses Dokument dient als technische Spezifikation für die Implementierung der vier fehlenden Kern-Systeme.
