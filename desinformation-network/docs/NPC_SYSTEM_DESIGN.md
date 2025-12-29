# NPC System - Vollständige Design-Dokumentation

> **Ziel:** NPCs von passiven Dekoration-Elementen zu mechanisch relevanten, narrativ tiefgehenden Charakteren mit klarer Funktion machen.

---

## 🎯 Executive Summary

### Problem
- NPCs haben keine mechanische Relevanz im Gameplay
- Dialoge sind zu kurz und zwecklos
- Spieler verstehen nicht, WARUM sie mit NPCs interagieren sollen
- Relationship Progress existiert in Datenstruktur, wird aber NIE aktualisiert
- Morale wird nicht getrackt, Krisen werden nie getriggert
- Tutorial verspricht Mechaniken, die nicht implementiert sind

### Lösung
Ein **4-Säulen NPC-System**:

1. **Mechanik**: NPCs reduzieren Kosten, erhöhen Effektivität, geben Boni
2. **Progression**: Beziehungen entwickeln sich durch Spieler-Aktionen
3. **Konsequenz**: Morale-System mit Krisen und Zusammenbrüchen
4. **Narrativ**: Tiefe, verzweigte Dialoge mit Charakterentwicklung

---

## 📊 System-Architektur

### Kern-Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                    NPC SYSTEM CORE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Relationship │  │   Morale     │  │   Crisis     │     │
│  │   Tracker    │  │   Tracker    │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dialogue   │  │   Affinity   │  │   Reaction   │     │
│  │   Engine     │  │   Matcher    │  │   System     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
      ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
      │ StoryEngine  │ │ UI Layer  │ │   Content   │
      │   Adapter    │ │Components │ │   Database  │
      └──────────────┘ └───────────┘ └─────────────┘
```

---

## 🔢 Mechanik-Design

### 1. Relationship System

#### States
```typescript
NPCState {
  relationshipLevel: 0 | 1 | 2 | 3  // Neutral → Bekannt → Vertraut → Loyal
  relationshipProgress: 0-100        // Fortschritt zum nächsten Level
  morale: 0-100                      // Moralische Stabilität
  inCrisis: boolean                  // Aktive Krise
  currentMood: 'positive' | 'neutral' | 'concerned' | 'upset'
}
```

#### Progression Formula
```
Base Progress per Matching Action: 10 points
Level-up Threshold: 100 points
Max Level: 3 (Loyal)

Example:
- Action mit Marina's specialty "media" → +10 progress
- Bei 100 progress: Level 0 → Level 1
- Progress reset auf 0
```

#### Relationship Bonuses by Level

| Level | Label      | Cost Reduction | Effectiveness | Special Unlock          |
|-------|------------|----------------|---------------|-------------------------|
| 0     | Neutral    | 0%             | 0%            | -                       |
| 1     | Bekannt    | 10%            | +5%           | Basic Topics            |
| 2     | Vertraut   | 20%            | +10%          | Personal Topics         |
| 3     | Loyal      | 30%            | +15%          | Crisis Support, Secrets |

### 2. Morale System

#### Morale Decay Triggers
```typescript
DarkActionThresholds = {
  moral_weight_50_to_70: -5 morale (all NPCs)
  moral_weight_70_to_85: -10 morale (all NPCs), -20 morale (Marina, sensitive NPCs)
  moral_weight_85_plus:  -15 morale (all NPCs), -30 morale (Marina)
}
```

#### Morale Thresholds
```
100-70: Positive mood, normal effectiveness
70-50:  Neutral mood, slight effectiveness drop
50-30:  Concerned mood, visible worry in dialogues
30-0:   Crisis triggering, major effectiveness drop
```

#### Morale Recovery
```
+2 morale per successful action with affinity match
+10 morale when player chooses empathetic crisis response
+5 morale per phase if no dark actions (passive recovery)
```

### 3. Crisis System

#### Crisis Trigger Conditions
```typescript
CrisisTriggers = {
  moral_breakdown: morale < 30 && dark_actions_recent > 2
  exposure_panic:  risk > 80
  moscow_pressure: phase % 24 === 0 && progress_low
  personal_trauma: consequence_victim_suicide && npc === 'marina'
  burnout:        consecutive_dark_actions > 5
}
```

#### Crisis States
```
BUILDING:  Morale 30-40, concerned dialogues
ACTIVE:    inCrisis = true, crisis dialogue required
RESOLVED:  Player chose response, consequences applied
BREAKDOWN: Ignored or bad response, NPC effectiveness -50% or defection
```

### 4. Cost Reduction Formula

#### Calculation
```typescript
calculateActionCost(action: Action, npcs: NPCState[]): number {
  let baseCost = action.costs.budget;
  let totalDiscount = 0;

  for (const npcId of action.npc_affinity) {
    const npc = npcs.get(npcId);
    if (!npc) continue;

    // Discount based on relationship level
    const discountPercent = npc.relationshipLevel * 10; // 0%, 10%, 20%, 30%

    // Morale modifier
    const moraleModifier = npc.morale / 100; // 0.0 to 1.0
    const effectiveDiscount = discountPercent * moraleModifier;

    totalDiscount += effectiveDiscount;
  }

  // Cap total discount at 50%
  totalDiscount = Math.min(50, totalDiscount);

  return baseCost * (1 - totalDiscount / 100);
}
```

#### Example
```
Action: "Social Media Kampagne"
Base Cost: 100 Budget
NPC Affinity: [marina]

Marina:
  relationshipLevel: 2 (Vertraut)
  morale: 80

Calculation:
  discount_percent = 2 * 10 = 20%
  morale_modifier = 80 / 100 = 0.8
  effective_discount = 20% * 0.8 = 16%

Final Cost: 100 * (1 - 0.16) = 84 Budget ✅
```

---

## 🎭 Dialogue System Enhancement

### Current State
```
Greetings: 1-2 per level (8 total per NPC)
Topics: 3 static responses per NPC
Reactions: 3 generic types
Crisis: Defined but never triggered
Ambient: 2 per NPC
```

### Target State
```
Greetings: 4 per level (16 per NPC) × 5 NPCs = 80 greetings
Topics: 5-10 branching conversations per NPC = 250 dialogue nodes
Reactions: 10 situational types = 50 reactions
Crisis: 3-5 per NPC, properly triggered = 20 crisis dialogues
Ambient: 20 per NPC = 100 ambient
Endings: 5 variations per NPC = 25 endings

TOTAL: ~525 dialogue pieces (up from ~60)
```

### Dialogue Context System

#### Context Variables
```typescript
DialogueContext {
  // Game State
  phase: number
  risk: number
  attention: number
  morale: number

  // NPC State
  relationshipLevel: 0-3
  npcMorale: number
  inCrisis: boolean

  // Recent History
  lastAction: string
  recentDarkActions: number
  recentExposure: boolean

  // Relationship History
  dialoguesSeen: Set<string>
  topicsDiscussed: Set<string>
  crisesSurvived: number
}
```

#### Dynamic Greeting Selection
```typescript
getGreeting(npc, context) {
  // Priority 1: Crisis state
  if (npc.inCrisis) return getCrisisGreeting(npc);

  // Priority 2: High risk/exposure
  if (context.risk > 80) return getHighRiskGreeting(npc, context.relationshipLevel);

  // Priority 3: Low morale
  if (npc.morale < 40) return getLowMoraleGreeting(npc, context.relationshipLevel);

  // Priority 4: Recent action reaction
  if (context.lastAction && npc.affinity.includes(context.lastAction)) {
    return getActionReactionGreeting(npc, context.lastAction);
  }

  // Default: Relationship-based
  return getRelationshipGreeting(npc, context.relationshipLevel);
}
```

### Topic Branching Structure

#### Example: Marina's "Zielgruppen" Topic
```
Topic: "Zielgruppen-Analyse"
├── Initial: "Ich kann Ihnen zeigen, wie wir vulnerable Gruppen identifizieren..."
│
├─┬─ Choice 1: "Wie funktioniert das technisch?"
│ └── Response: [Technical explanation] → Unlocks "Algorithmen" topic
│     └── Choice 1.1: "Können wir das automatisieren?"
│     └── Choice 1.2: "Ist das ethisch vertretbar?" (morale effect)
│
├─┬─ Choice 2: "Welche Gruppen sind am verwundbarsten?"
│ └── Response: [Demographic data] → Relationship +5
│     └── Choice 2.1: "Nutzen wir das maximal aus" (morale -10)
│     └── Choice 2.2: "Das fühlt sich falsch an..." (morale +5, relationship +10)
│
└─┬─ Choice 3: "Fühlen Sie sich unwohl dabei?"
  └── Response: [Personal confession] → Relationship +10, Morale check
      └── Choice 3.1: "Wir tun, was nötig ist" (morale -5)
      └── Choice 3.2: "Ich verstehe Ihre Bedenken" (morale +10, unlock crisis support)
```

---

## 🎨 UI/UX Design

### 1. Action Feedback System

#### Real-Time Notification
```tsx
<NPCReactionToast>
  <NPCAvatar src={marina.portrait} mood={npc.currentMood} />
  <Message>
    <NPCName>Marina</NPCName>
    <Reaction tone="positive">
      "Gute Arbeit mit dieser Targeting-Strategie!"
    </Reaction>
    <Effect>+10 Beziehung (65/100 → Level 1)</Effect>
  </Message>
  <ProgressBar value={65} max={100} animated />
</NPCReactionToast>
```

#### Action Panel Enhancement
```tsx
// Current: Shows NPC affinity as small tags
<span>marina</span>

// New: Detailed affinity display
<NPCAffinityBadge>
  <NPCIcon>Marina</NPCIcon>
  <Benefits>
    <Benefit type="relationship">+10 Beziehung</Benefit>
    {npc.relationshipLevel >= 2 && (
      <Benefit type="cost">-20% Kosten (240 statt 300)</Benefit>
    )}
    {npc.relationshipLevel >= 3 && (
      <Benefit type="effectiveness">+15% Reichweite</Benefit>
    )}
  </Benefits>
  {npc.morale < 50 && (
    <Warning>Marina ist besorgt - Morale niedrig</Warning>
  )}
</NPCAffinityBadge>
```

### 2. NPC Panel Enhancements

#### Progress Visualization Fix
```tsx
// CURRENT (WRONG): Shows relationshipProgress as 0-100% between levels
<ProgressBar value={npc.relationshipProgress} max={100} />
<Text>{npc.relationshipProgress}%</Text>

// PROBLEM: relationshipProgress is absolute points (0-100), not percentage
// When it hits 100, level increases and progress resets to 0

// FIXED: Show actual progress points with clear label
<ProgressBar value={npc.relationshipProgress} max={100} />
<Text>{npc.relationshipProgress}/100 Punkte bis Level {nextLevel}</Text>
<Sublabel>Aktionen mit {npc.name}'s Spezialisierung: +10 Punkte</Sublabel>
```

#### Morale Indicator
```tsx
<MoraleDisplay>
  <Label>Morale</Label>
  <MoraleBar value={npc.morale} colorCode={getMoraleColor(npc.morale)} />
  <MoraleValue>{npc.morale}/100</MoraleValue>
  <MoraleStatus>
    {npc.morale > 70 && "Stabil 💚"}
    {npc.morale > 50 && npc.morale <= 70 && "Neutral 🟡"}
    {npc.morale > 30 && npc.morale <= 50 && "Besorgt 🟠"}
    {npc.morale <= 30 && "KRISE 🔴"}
  </MoraleStatus>
</MoraleDisplay>
```

#### Crisis Indicator
```tsx
{npc.inCrisis && (
  <CrisisAlert severity="high">
    <Icon>⚠️</Icon>
    <Message>{npc.name} braucht sofort Ihre Aufmerksamkeit!</Message>
    <Action onClick={() => triggerCrisisDialogue(npc.id)}>
      KRISENGESPRACH FUHREN
    </Action>
  </CrisisAlert>
)}
```

### 3. Tutorial Enhancement

#### Current Tutorial (Incomplete)
```
"Je besser Ihre Beziehung zu einem NPC, desto günstiger werden dessen Aktionen."
```

#### New Tutorial (Complete & Accurate)
```tsx
<TutorialStep id="npcs_mechanics">
  <Title>NPCs & Spezialisierungen</Title>
  <Content>
    <Section>
      <Heading>Wie funktioniert das NPC-System?</Heading>
      <List>
        <Item>Jede Aktion hat NPC-Affinität (z.B. "Marina" bei Media-Aktionen)</Item>
        <Item>Aktionen mit Affinität verbessern die Beziehung (+10 Punkte)</Item>
        <Item>Bei 100 Punkten: Beziehungs-Level steigt (max. Level 3)</Item>
        <Item>Höhere Beziehung = Günstigere Aktionen & höhere Effektivität</Item>
      </List>
    </Section>

    <Section>
      <Heading>Beziehungs-Boni</Heading>
      <Table>
        <Row>Level 1: -10% Kosten, +5% Effektivität</Row>
        <Row>Level 2: -20% Kosten, +10% Effektivität</Row>
        <Row>Level 3: -30% Kosten, +15% Effektivität</Row>
      </Table>
    </Section>

    <Section>
      <Heading>Morale & Krisen</Heading>
      <Text>
        Dunkle Aktionen (hoher moral_weight) senken NPC-Morale.
        Bei Morale < 30: NPC gerät in Krise und braucht Unterstützung.
        Ignorierte Krisen können zu Verrat oder Zusammenbruch führen!
      </Text>
    </Section>

    <Example>
      <DemoAction>
        Aktion: "Social Media Kampagne"
        Basis-Kosten: 300 Budget
        NPC: Marina (Level 2, Morale 80)

        Rabatt: 20% × (80/100 Morale) = 16%
        Endkosten: 252 Budget ✅
        Nach Aktion: +10 Beziehung (70/100 → Level 2)
      </DemoAction>
    </Example>
  </Content>
</TutorialStep>
```

---

## 📝 Content-Erweiterung

### Phase 1: Greetings (Priorität: HIGH)

#### Ziel: 4 Variationen pro Level pro NPC
```
5 NPCs × 4 Levels × 4 Greetings = 80 neue Greetings
Aktuell: ~20 Greetings
Neu schreiben: ~60 Greetings
```

#### Variationen-Typen pro Level

**Level 0 (Neutral):**
1. Kurz/Abweisend
2. Professionell/Distanziert
3. Beschäftigt/Gestresst
4. Neugierig/Evaluierend

**Level 1 (Bekannt):**
1. Freundlich-Professionell
2. Update-gebend
3. Rat-suchend
4. Kollegial

**Level 2 (Vertraut):**
1. Warm/Persönlich
2. Besorgt/Fürsorgend
3. Enthusiastisch/Motiviert
4. Vertrauensvoll/Offen

**Level 3 (Loyal):**
1. Tief-Verbunden
2. Verschwörerisch
3. Beschützend
4. Bewundernd

#### Beispiel: Marina Level 2 Greetings
```json
{
  "id": "mar_greet_2_1",
  "text_de": "Es ist gut, Sie zu sehen. *lächelt echt* Nach all dem... Sie sind einer der wenigen, denen ich noch vertraue.",
  "tone": "warm_personal"
},
{
  "id": "mar_greet_2_2",
  "text_de": "Ah, perfektes Timing! Ich habe neue Analysedaten - möchten Sie sich das gemeinsam ansehen? *wirkt enthusiastisch*",
  "tone": "enthusiastic_motivated"
},
{
  "id": "mar_greet_2_3",
  "text_de": "*schaut besorgt* Ich habe die Exposure-Reports gesehen. Geht es Ihnen gut? Wir müssen vorsichtiger sein...",
  "tone": "concerned_caring",
  "context_trigger": "risk > 60"
},
{
  "id": "mar_greet_2_4",
  "text_de": "Ihre letzte Kampagne war brillant. *zeigt Diagramme* Die Engagement-Zahlen übertreffen alle Erwartungen!",
  "tone": "trusting_open",
  "context_trigger": "last_action_marina_affinity"
}
```

### Phase 2: Ambient Dialogues (Priorität: MEDIUM)

#### Ziel: 20 pro NPC = 100 Ambient Dialogues

#### Ambient-Kategorien
1. **Work Actions** (6 per NPC): NPC bei der Arbeit
2. **Emotional States** (5 per NPC): Stimmungen, Gedanken
3. **Personal Life** (4 per NPC): Familie, Hintergrund
4. **Reactions to Game State** (5 per NPC): Risk, Morale, Phase

#### Beispiele: Marina Ambient
```json
[
  {
    "id": "mar_ambient_work_1",
    "text_de": "*tippt hektisch* Diese Targeting-Parameter... *murmelt* 75% Engagement bei 45-60 Jahre. Erschreckend wirksam.",
    "category": "work",
    "probability": 0.4
  },
  {
    "id": "mar_ambient_emotion_1",
    "text_de": "*starrt aus dem Fenster* Früher habe ich von einem Job geträumt, der die Welt verändert. *lacht bitter* Vorsicht vor deinen Wünschen.",
    "category": "emotional",
    "probability": 0.3,
    "condition": "morale < 60"
  },
  {
    "id": "mar_ambient_personal_1",
    "text_de": "*telefoniert leise* Ja, Mama, mir geht's gut. Nein, ich kann nicht sagen, woran ich arbeite. *lacht gezwungen* Marketing, wie immer. Ich liebe dich auch. *legt auf, Tränen in den Augen*",
    "category": "personal",
    "probability": 0.2
  },
  {
    "id": "mar_ambient_gamestate_1",
    "text_de": "*nervös* Die News berichten über uns. Nicht direkt, aber... sie kommen näher. *atmet tief* Wir müssen vorsichtiger sein.",
    "category": "game_state",
    "probability": 0.5,
    "condition": "risk > 70"
  }
]
```

### Phase 3: Reaction System (Priorität: HIGH)

#### 10 Neue Reaktions-Typen
```typescript
ReactionTypes {
  first_dark_action:     Erste moralisch fragwürdige Aktion
  repeated_dark_action:  Spieler wählt wiederholt dunkle Aktionen
  high_exposure:         Risk > 70
  low_resources:         Budget < 50
  crisis_averted:        Erfolgreiche Crisis-Bewältigung
  combo_achieved:        Combo-Activation
  relationship_milestone: Level-up Event
  betrayal_warning:      Betrayal-System Warnung
  moscow_pressure:       Direktor unter Druck von oben
  team_morale_low:       Durchschnittliche Team-Morale < 50
}
```

#### Beispiel: first_dark_action Reactions
```json
{
  "marina": {
    "id": "mar_react_first_dark",
    "text_de": "*blickt auf den Bildschirm, dann zu Ihnen* Das... das war wirklich dunkel. Deepfakes von echten Opfern? *atmet tief durch* Okay. Okay. Das ist jetzt unser Leben. Ich werde die Daten aufbereiten.",
    "morale_change": -15,
    "relationship_change": -5,
    "triggered_by": "moral_weight > 70 && npc.darkActionsWitnessed === 0"
  },
  "volkov": {
    "id": "vol_react_first_dark",
    "text_de": "*reibt sich die Hände* Na endlich! Ich dachte schon, wir spielen hier Kindergarten. *grinst* Jetzt wird's interessant.",
    "morale_change": +5,
    "relationship_change": +10,
    "triggered_by": "moral_weight > 70 && npc.darkActionsWitnessed === 0"
  },
  "direktor": {
    "id": "dir_react_first_dark",
    "text_de": "*nickt zustimmend* Gut. Sie verstehen, was auf dem Spiel steht. Moskau wird das zu schätzen wissen.",
    "morale_change": 0,
    "relationship_change": +5,
    "triggered_by": "moral_weight > 70 && npc.darkActionsWitnessed === 0"
  }
}
```

### Phase 4: Topic Branching (Priorität: HIGH)

#### Struktur
```
5 NPCs × 5 Topics × 3-Tier Branching = ~75 Topic Nodes

Tier 1: Initial topic response (5)
Tier 2: Player choice branches (15)
Tier 3: Deep conversation nodes (30)
Tier 4: Resolution/Unlock (25)
```

#### Implementation
```json
{
  "topic_id": "marina_targeting",
  "tier": 1,
  "text_de": "Zielgruppen-Analyse ist mein Spezialgebiet. *öffnet Laptop* Was möchten Sie wissen?",
  "responses": [
    {
      "id": "targeting_tech",
      "text_de": "Wie funktioniert das technisch?",
      "leads_to": "marina_targeting_tech_2",
      "effect": { "relationship": +2 }
    },
    {
      "id": "targeting_vulnerable",
      "text_de": "Welche Gruppen sind am verwundbarsten?",
      "leads_to": "marina_targeting_vulnerable_2",
      "effect": { "relationship": +5 }
    },
    {
      "id": "targeting_ethics",
      "text_de": "Fühlen Sie sich unwohl, Menschen zu manipulieren?",
      "leads_to": "marina_targeting_ethics_2",
      "effect": { "relationship": +10, "morale": +5 },
      "requires": { "relationshipLevel": 2 }
    }
  ]
},
{
  "topic_id": "marina_targeting_ethics_2",
  "tier": 2,
  "text_de": "*seufzt tief* Jeden Tag. Jeden einzelnen Tag. *schaut weg* Ich sehe die Zahlen - nicht nur Engagement-Raten, sondern echte Menschen. Mütter. Großeltern. Menschen wie meine Familie. *Pause* Aber ich habe Schulden. Eine Schwester auf der Uni. Eltern, die auf mich angewiesen sind. *blickt Sie an* Haben Sie den Luxus, ethische Bedenken zu haben?",
  "responses": [
    {
      "id": "ethics_dismiss",
      "text_de": "Wir tun, was nötig ist. Keine Entschuldigungen.",
      "leads_to": "marina_targeting_ethics_cold",
      "effect": { "morale": -10, "relationship": -5 }
    },
    {
      "id": "ethics_empathy",
      "text_de": "Ich verstehe. Wir alle haben unsere Gründe, hier zu sein.",
      "leads_to": "marina_targeting_ethics_understand",
      "effect": { "morale": +10, "relationship": +15 }
    },
    {
      "id": "ethics_shared",
      "text_de": "Ich frage mich das auch. Jeden Tag.",
      "leads_to": "marina_targeting_ethics_bond",
      "effect": { "morale": +15, "relationship": +20 },
      "unlocks": "marina_crisis_support"
    }
  ]
}
```

### Phase 5: Endings (Priorität: MEDIUM)

#### 5 Ending-Typen pro NPC = 25 Endings

**Ending Matrix:**
```
                Low Relationship    High Relationship
High Morale     Professional Exit   Loyal Farewell
Medium Morale   Distant Goodbye     Conflicted Parting
Low Morale      Bitter Accusation   Tragic Breakdown
```

#### Beispiel: Marina Endings
```json
{
  "marina_ending_bitter": {
    "condition": "relationshipLevel < 2 && morale < 40",
    "text_de": "Es ist vorbei. *packt ihre Sachen* Sie wissen, was das Schlimmste ist? Nicht das, was wir getan haben. Sondern dass Sie nie gezögert haben. Nie gefragt haben, ob es einen besseren Weg gibt. *zur Tür* Ich hoffe, der Erfolg war es wert. Ich... ich muss mit dem leben, was ich geworden bin. *geht ohne zurückzublicken*",
    "epilogue_de": "Marina Petrova verließ die Agentur und verschwand. Gerüchte besagen, sie arbeitet nun für eine Whistleblower-Organisation.",
    "morale_impact": "team_morale_-20"
  },
  {
    "marina_ending_loyal": {
    "condition": "relationshipLevel >= 3 && morale >= 60",
    "text_de": "*umarmt Sie* Wir haben... wir haben die Welt verändert. Zum Guten? *lacht unsicher* Ich weiß es nicht. Aber ich bin froh, dass ich es mit Ihnen durchgestanden habe. Sie haben mir gezeigt, dass selbst in der Dunkelheit... *Tränen* ...man noch Menschlichkeit bewahren kann. Danke.",
    "epilogue_de": "Marina Petrova blieb loyal und half beim Aufbau der nächsten Operation. Ihre Analysen sind legendär geworden.",
    "morale_impact": "none"
  }
}
```

---

## 🔧 Implementation Roadmap

### Sprint 1: Core Mechanics (P0 - Critical)
**Ziel:** System funktionsfähig machen

- [ ] Fix Relationship Progress Update (StoryEngineAdapter.ts line 2091)
- [ ] Implement Morale Decay on Dark Actions
- [ ] Implement Cost Reduction Calculation
- [ ] Fix NPC Panel Progress Bar (shows wrong scale)
- [ ] Add NPC Reaction Toast Component
- [ ] Enhance ActionPanel with NPC Benefits Display

**Akzeptanzkriterien:**
- ✅ Aktionen mit NPC Affinity erhöhen Relationship Progress (+10)
- ✅ Bei 100 Progress: Level-up, Progress reset
- ✅ Dark Actions (moral_weight > 50) senken Morale
- ✅ Aktionen kosten 10-30% weniger mit NPC Bonus
- ✅ UI zeigt Progress korrekt (X/100 Punkte)
- ✅ Toast erscheint nach Aktion mit NPC Reaktion

### Sprint 2: Crisis & Dialogue (P1 - High Priority)
**Ziel:** Narrative Tiefe schaffen

- [ ] Implement Crisis Triggering (morale < 30)
- [ ] Create Crisis Dialogue UI Component
- [ ] Extend DialogLoader with Context-Aware Selection
- [ ] Implement Dynamic Greeting System
- [ ] Add Morale Visualization to NPC Panel
- [ ] Write 20 new Greeting variations

**Akzeptanzkriterien:**
- ✅ Bei Morale < 30: inCrisis = true
- ✅ Crisis Dialogue wird automatisch angezeigt
- ✅ Greetings ändern sich basierend auf risk/morale/phase
- ✅ NPC Panel zeigt Morale-Bar mit Farbcodierung
- ✅ Mindestens 4 Greetings pro Level für jeden NPC

### Sprint 3: Content Expansion (P2 - Medium Priority)
**Ziel:** Dialogvielfalt massiv erhöhen

- [ ] Write 100 Ambient Dialogues
- [ ] Write 25 Situational Reactions
- [ ] Design Topic Branching System (5 topics × 5 NPCs)
- [ ] Implement Topic Progression Tracking
- [ ] Write 20 Ending Variations

**Akzeptanzkriterien:**
- ✅ Ambient Dialogues erscheinen zufällig in NPC Panel
- ✅ Reactions triggern basierend auf Game State
- ✅ Topics haben mindestens 3-Tier Branching
- ✅ Endings variieren basierend auf Relationship + Morale

### Sprint 4: Polish & Testing
**Ziel:** System perfektionieren

- [ ] Tutorial Update mit vollständiger NPC-Erklärung
- [ ] Add NPC System Documentation
- [ ] Comprehensive Testing
- [ ] Balance Tuning (costs, progression speed)
- [ ] Sound Effects for NPC interactions
- [ ] Animations for Relationship Level-Up

---

## 📊 Metrics & Success Criteria

### Quantitative Metrics
```
Dialogue Count:         60 → 525 (+775%)
NPC Interactions/Game:  ~3 → ~30 (+900%)
Relationship Changes:   0 → ~120 events per game
Crisis Events:          0 → ~5-10 per game
Player Engagement Time: +15-20 minutes per playthrough
```

### Qualitative Success Criteria
1. **Klarheit:** Spieler verstehen nach 1 Runde, warum NPCs wichtig sind
2. **Feedback:** Jede Aktion mit NPC Affinity zeigt sofortiges Feedback
3. **Progression:** Beziehungs-Entwicklung ist sichtbar und rewarding
4. **Konsequenz:** Entscheidungen haben echten Impact auf NPCs
5. **Narrativ:** Spieler entwickeln emotionale Bindung zu mindestens 1 NPC

---

## 🎮 Player Experience Journey

### Early Game (Phase 1-24)
```
Player discovers: "Oh, diese Aktion hat Marina's Icon..."
System feedback:  Toast: "Marina +10 Beziehung!"
Player thinks:    "Was bringt mir das?"
Tutorial shows:   "Level 1 = -10% Kosten!"
Player realizes:  "Ich sollte mehr Media-Aktionen machen!"
```

### Mid Game (Phase 25-72)
```
Player has:      Marina Level 2, Alexei Level 1
Player sees:     "Social Media Kampagne: 300 Budget"
System shows:    "Mit Marina Bonus: 240 Budget (-20%)"
Player chooses:  Dark Action (moral_weight 80)
Marina reacts:   "*schaut weg* Das sind harte Methoden..."
Marina morale:   80 → 60
Player notices:  Discount reduced to -16% (morale effect)
```

### Late Game (Phase 73-120)
```
Marina morale:   30 (after repeated dark actions)
System triggers: CRISIS - Marina moral breakdown
Dialogue:        "Ich kann nicht mehr schlafen..."
Player choices:  [Comfort] [Dismiss] [Threaten]
Player chooses:  [Comfort] "Das ist nicht einfach, aber..."
Marina:          Morale 30 → 50, Relationship +10
System unlocks:  "Marina Crisis Support" perk
```

### Ending
```
Victory Screen shows NPC Endings based on:
  Marina (Lvl 3, Morale 65): Loyal but scarred
  Volkov (Lvl 2, Morale 90): Eager for next op
  Direktor (Lvl 2, Morale 70): Satisfied but distant

Player sees emotional epilogues for each NPC
Player thinks: "Wow, meine Entscheidungen hatten echtes Gewicht"
```

---

## 🔒 Technical Specifications

### Data Structures

#### NPCState (Enhanced)
```typescript
interface NPCState {
  // Identity
  id: string;
  name: string;
  role_de: string;
  role_en: string;

  // Progression
  relationshipLevel: 0 | 1 | 2 | 3;
  relationshipProgress: number;  // 0-100 points

  // Morale System
  morale: number;  // 0-100
  moraleHistory: number[];  // Last 5 phases
  inCrisis: boolean;
  crisisType?: CrisisType;
  crisisTriggeredPhase?: number;

  // State
  available: boolean;
  currentMood: 'positive' | 'neutral' | 'concerned' | 'upset';

  // Specialization
  specialtyAreas: string[];
  enhancedActions: string[];

  // Tracking
  actionsWithAffinity: number;
  darkActionsWitnessed: number;
  crisesResolved: number;
  dialoguesSeen: Set<string>;
  topicsUnlocked: Set<string>;
}
```

#### CrisisEvent
```typescript
interface CrisisEvent {
  id: string;
  npcId: string;
  type: 'moral_breakdown' | 'exposure_panic' | 'moscow_pressure' | 'burnout';
  triggeredPhase: number;
  deadline?: number;

  dialogue: Dialogue;
  choices: CrisisChoice[];

  status: 'active' | 'resolved' | 'ignored';
  resolution?: {
    choiceId: string;
    effects: CrisisEffects;
  };
}

interface CrisisChoice {
  id: string;
  label_de: string;
  label_en: string;

  effects: {
    morale: number;
    relationship: number;
    unlocks?: string[];
    consequence?: string;
  };
}
```

### API Methods

#### StoryEngineAdapter
```typescript
// Relationship Management
updateNPCRelationships(action: StoryAction, npcAssist?: string): void
getNPCRelationshipBonus(npcId: string, action: StoryAction): NPCBonus
checkNPCLevelUp(npcId: string): boolean

// Morale Management
updateNPCMorale(action: StoryAction): void
checkCrisisTriggers(): CrisisEvent[]
triggerNPCCrisis(npcId: string, type: CrisisType): CrisisEvent
resolveCrisis(crisisId: string, choiceId: string): void

// Cost Calculation
calculateNPCDiscount(action: StoryAction): number
getEffectivenessModifier(action: StoryAction): number

// Reactions
getNPCReaction(npcId: string, context: ReactionContext): Dialogue
getAmbientDialogue(npcId: string): Dialogue | null
```

#### DialogLoader (Enhanced)
```typescript
// Context-Aware Loading
getGreeting(npcId: string, context: DialogueContext): Dialogue
getTopicBranch(npcId: string, topicId: string, tier: number): DialogueBranch
getReaction(npcId: string, reactionType: string, context: DialogueContext): Dialogue

// Tracking
markDialogueSeen(npcId: string, dialogueId: string): void
unlockTopic(npcId: string, topicId: string): void
isTopicUnlocked(npcId: string, topicId: string): boolean
```

---

## 📚 File Structure

```
/desinformation-network/
├── src/
│   ├── story-mode/
│   │   ├── data/
│   │   │   ├── npcs.json (EXTEND)
│   │   │   ├── dialogues.json (MASSIVE EXPANSION)
│   │   │   └── npc-reactions.json (NEW)
│   │   │
│   │   ├── engine/
│   │   │   ├── DialogLoader.ts (ENHANCE)
│   │   │   ├── NPCManager.ts (NEW)
│   │   │   └── CrisisManager.ts (NEW)
│   │   │
│   │   └── components/
│   │       ├── NpcPanel.tsx (FIX + ENHANCE)
│   │       ├── ActionPanel.tsx (ENHANCE)
│   │       ├── NPCReactionToast.tsx (NEW)
│   │       ├── CrisisDialogue.tsx (NEW)
│   │       └── NPCAffinityBadge.tsx (NEW)
│   │
│   └── game-logic/
│       └── StoryEngineAdapter.ts (ENHANCE)
│
└── docs/
    ├── NPC_SYSTEM_DESIGN.md (THIS FILE)
    ├── NPC_CONTENT_GUIDE.md (NEW)
    └── NPC_DIALOGUE_WRITING.md (NEW)
```

---

## ✅ Testing Plan

### Unit Tests
```typescript
describe('NPC Relationship System', () => {
  test('Action with affinity increases progress by 10', () => {
    const npc = createNPC('marina', { relationshipProgress: 50 });
    executeAction('social_media_campaign', { npcAffinity: ['marina'] });
    expect(npc.relationshipProgress).toBe(60);
  });

  test('Progress at 100 triggers level-up', () => {
    const npc = createNPC('marina', {
      relationshipProgress: 95,
      relationshipLevel: 0
    });
    executeAction('social_media_campaign', { npcAffinity: ['marina'] });
    expect(npc.relationshipLevel).toBe(1);
    expect(npc.relationshipProgress).toBe(5); // 95 + 10 - 100 = 5
  });
});

describe('Morale System', () => {
  test('Dark action reduces morale', () => {
    const npc = createNPC('marina', { morale: 80 });
    executeAction('deepfake_campaign', { moral_weight: 85 });
    expect(npc.morale).toBe(60); // -20 for marina on high moral_weight
  });

  test('Morale < 30 triggers crisis', () => {
    const npc = createNPC('marina', { morale: 35 });
    executeAction('harassment_campaign', { moral_weight: 90 });
    expect(npc.morale).toBe(15);
    expect(npc.inCrisis).toBe(true);
  });
});

describe('Cost Reduction', () => {
  test('Level 2 NPC gives 20% discount', () => {
    const npc = createNPC('marina', {
      relationshipLevel: 2,
      morale: 100
    });
    const action = createAction({ budget: 100, npc_affinity: ['marina'] });
    const cost = calculateCost(action, [npc]);
    expect(cost).toBe(80); // 100 * 0.8
  });

  test('Low morale reduces discount effectiveness', () => {
    const npc = createNPC('marina', {
      relationshipLevel: 2,
      morale: 50
    });
    const action = createAction({ budget: 100, npc_affinity: ['marina'] });
    const cost = calculateCost(action, [npc]);
    expect(cost).toBe(90); // 100 * (1 - 0.2 * 0.5) = 90
  });
});
```

### Integration Tests
```typescript
describe('NPC System Integration', () => {
  test('Full playthrough: relationship progression', () => {
    const game = createGame();

    // Execute 10 media actions with Marina affinity
    for (let i = 0; i < 10; i++) {
      game.executeAction('social_media_campaign');
    }

    const marina = game.getNPC('marina');
    expect(marina.relationshipLevel).toBe(1); // 10 * 10 = 100 points
    expect(marina.actionsWithAffinity).toBe(10);
  });

  test('Crisis flow: trigger → dialogue → resolution', () => {
    const game = createGame();
    const marina = game.getNPC('marina');

    // Lower morale through dark actions
    game.executeAction('deepfake_campaign'); // moral_weight: 85
    game.executeAction('harassment_campaign'); // moral_weight: 90

    expect(marina.morale).toBeLessThan(30);
    expect(marina.inCrisis).toBe(true);

    // Trigger crisis dialogue
    const crisis = game.getActiveCrisis('marina');
    expect(crisis).toBeDefined();
    expect(crisis.choices.length).toBeGreaterThan(0);

    // Resolve with empathy
    game.resolveCrisis(crisis.id, 'resp_comfort');

    expect(marina.morale).toBeGreaterThan(30);
    expect(marina.inCrisis).toBe(false);
  });
});
```

---

## 🎓 Content Writing Guidelines

### Tone & Voice per NPC

#### Direktor Volkov
- **Formal, autoritär, ergebnisorientiert**
- Kurze Sätze, Befehle
- Selten emotional, immer kontrolliert
- "Sie", nie "du"
- Beispiel: "Berichten Sie. Moskau ist ungeduldig."

#### Marina Petrova
- **Professionell aber emotional zugänglich**
- Technisches Vokabular gemischt mit persönlichen Gefühlen
- Zunehmend vulnerabel bei höherer Beziehung
- Beispiel: "Die Zahlen sind eindeutig... *seufzt* ...auch wenn ich mir wünschte, sie wären es nicht."

#### Alexei (Volkov) - Tech Lead
- **Direkt, ungefiltert, zynisch**
- Vulgäre Sprache, schwarzer Humor
- Keine moralischen Bedenken
- Beispiel: "*grinst* Endlich wird's interessant. Lass uns richtig Chaos stiften."

#### Katja Orlova
- **Kreativ, enthusiastisch, idealistisch**
- Metaphern, Storytelling-Sprache
- Fragt philosophische Fragen
- Beispiel: "Jede große Veränderung braucht eine große Geschichte. Wir sind die Erzähler."

#### Igor Smirnov
- **Minimalistisch, technisch, distanziert**
- Kurze Antworten, Fachbegriffe
- Emotionslos
- Beispiel: "*nickt* Saubere Ausführung. Effizient."

### Branching Logic Best Practices

1. **Jede Choice hat Impact**: Minimum: +/- 5 relationship oder morale
2. **Context Matters**: High-risk choices nur bei relationshipLevel >= 2
3. **Consequences erkennbar**: Spieler sieht Effekt sofort in Toast
4. **No dead ends**: Jeder Branch führt zu Resolution oder neuem Topic
5. **Character-consistent**: Volkov liebt Chaos, Marina hasst es

---

**Status:** Living Document - Updated as System Evolves
**Version:** 1.0
**Last Updated:** 2025-12-29
**Owner:** NPC System Development Team
