# Persuasion Taxonomy Integration

## Overview

The game is built on a scientific taxonomy of persuasion techniques (`src/data/persuasion/taxonomy.json`). This document explains how the taxonomy maps to game mechanics.

---

## Taxonomy Structure

### Source: taxonomy.json (version9)

```typescript
type TaxonomyNode = {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  category: string;              // Technique category
  description: string;           // Short description
  longDescription: string;       // Full explanation
  example: string;               // Short example
  extendedExample: string;       // Detailed example
  wikipediaQuery: string;        // For further reading
  taxonomyGroups: string[];      // Classification tags
  applications: string[];        // Real-world use cases
  manipulationPotential: number; // 0-1 effectiveness rating
  uncertainty: {
    confidenceInterval: [number, number];
    confidenceLevel: string;
    basis: string;
  };
  empiricalEvidence: string[];   // Research citations
  counterStrategies: string[];   // How to defend
};

type TaxonomyEdge = {
  source: string;       // Technique ID
  target: string;       // Related technique ID
  relationship: string; // Type of relationship
  strength: number;     // 0-1 connection strength
};
```

### Categories in Taxonomy

1. **Psychological Techniques** - framing, priming, anchoring, social_proof, scarcity, reciprocity, authority, liking, consistency, reactance_theory
2. **Rhetorical Techniques** - ad_hominem, false_dichotomy, straw_man, equivocation, emotional_appeal, repetition
3. **Neurolinguistic Techniques** - pacing_and_leading, embedded_commands
4. **Digital Manipulation** - microtargeting, digital_influence, visual_manipulation, synthetic_media, dark_patterns, ai_persuasion
5. **Behavioral Economics** - nudging
6. **Narrative Techniques** - narrative_persuasion
7. **Cultural/Neural** - social_hierarchy, collective_orientation, uncertainty_avoidance, communication_context, moral_foundations, predictive_processing, reward_circuits, fear_circuits, mirror_neuron_systems, prefrontal_maturation, aging_brain, stress_effects, attention_networks

---

## Mapping Strategy

### Principle: Techniques → Abilities

Not every technique becomes a direct ability. Instead:

1. **Direct Mapping** - Technique → Ability (1:1)
2. **Combined Mapping** - Multiple techniques → Single ability
3. **Emergent Mapping** - Technique emerges from game mechanics
4. **Contextual Mapping** - Technique varies by actor type

### Actor-Technique Affinity

Each actor category has natural affinities:

| Actor Type | Strong Techniques | Weak Techniques |
|------------|-------------------|-----------------|
| Media | framing, priming, agenda_setting | authority, reciprocity |
| Expert | authority, false_dichotomy | emotional_appeal, social_proof |
| Lobby | astroturfing, dark_patterns | authority, transparency |
| Organization | social_proof, consistency | emotional_appeal |
| Defensive | prebunking, fact_checking | all manipulation |

---

## Ability Definitions

### Media Actor Abilities

#### 1. Agenda Setting (agenda_setting)
**Based on:** framing, priming
**Effect:** Sets the narrative frame, primes audience for specific interpretations

```typescript
const agendaSetting: AbilityDefinition = {
  id: 'agenda_setting',
  name: 'Agenda setzen',
  description: 'Bestimmt, welche Themen als wichtig wahrgenommen werden',
  
  basedOn: ['framing', 'priming'],
  actorTypes: ['media'],
  
  resourceCost: 20,
  cooldown: 2,
  
  targetType: 'adjacent',
  effects: {
    trustDelta: -0.15,
    emotionalDelta: 0.1,
    propagation: true,
  },
  
  animationType: 'wave',
  
  educationalContent: {
    technique: 'Durch die Auswahl und Priorisierung von Themen wird gesteuert, worüber Menschen nachdenken.',
    realWorld: 'Nachrichtenredaktionen entscheiden täglich, welche Geschichten "wichtig" sind.',
    counter: 'Verschiedene Nachrichtenquellen konsumieren, um blinde Flecken zu erkennen.',
  }
};
```

#### 2. Scandal Creation (scandal)
**Based on:** emotional_appeal, framing
**Effect:** Triggers strong emotional response, reduces trust rapidly

```typescript
const scandal: AbilityDefinition = {
  id: 'scandal',
  name: 'Skandalisieren',
  description: 'Erzeugt Empörung durch emotionale Aufbereitung',
  
  basedOn: ['emotional_appeal', 'framing'],
  actorTypes: ['media'],
  
  resourceCost: 30,
  cooldown: 3,
  
  targetType: 'single',
  effects: {
    trustDelta: -0.25,
    emotionalDelta: 0.3,
    duration: 2,
  },
  
  animationType: 'pulse',
  
  educationalContent: {
    technique: 'Emotionale Appelle umgehen rationale Verarbeitung.',
    realWorld: 'Boulevardmedien nutzen Skandale zur Aufmerksamkeitsgenerierung.',
    counter: 'Emotionale Reaktion bewusst wahrnehmen, Fakten prüfen.',
  }
};
```

#### 3. Gatekeeping (gatekeeping)
**Based on:** information_suppression, selective_exposure
**Effect:** Controls information flow, isolates targets

```typescript
const gatekeeping: AbilityDefinition = {
  id: 'gatekeeping',
  name: 'Gatekeeper spielen',
  description: 'Kontrolliert, welche Informationen verbreitet werden',
  
  basedOn: ['framing'], // Simplified - controls narrative
  actorTypes: ['media'],
  
  resourceCost: 25,
  cooldown: 2,
  
  targetType: 'network',
  effects: {
    connectionStrengthDelta: -0.2, // Weakens connections
    resilienceDelta: -0.1,
  },
  
  animationType: 'ripple',
};
```

### Expert Actor Abilities

#### 4. Undermine Authority (undermine_authority)
**Based on:** ad_hominem, authority (inverted)
**Effect:** Attacks credibility of other experts

```typescript
const undermineAuthority: AbilityDefinition = {
  id: 'undermine_authority',
  name: 'Autorität untergraben',
  description: 'Greift die Glaubwürdigkeit von Experten an',
  
  basedOn: ['ad_hominem', 'authority'],
  actorTypes: ['expert'],
  
  resourceCost: 25,
  cooldown: 2,
  
  targetType: 'category',
  targetFilter: (actor) => actor.category === 'expert',
  effects: {
    trustDelta: -0.2,
    resilienceDelta: -0.15,
  },
  
  animationType: 'beam',
  
  educationalContent: {
    technique: 'Ad-hominem-Angriffe zielen auf die Person statt auf Argumente.',
    realWorld: 'Wissenschaftler werden persönlich diskreditiert statt inhaltlich widerlegt.',
    counter: 'Zwischen Person und Argument unterscheiden.',
  }
};
```

#### 5. False Dichotomy (false_dichotomy)
**Based on:** false_dichotomy
**Effect:** Reduces perceived options, increases polarization

```typescript
const falseDichotomy: AbilityDefinition = {
  id: 'false_dichotomy_ability',
  name: 'Falsche Dichotomie',
  description: 'Reduziert komplexe Fragen auf Entweder-Oder',
  
  basedOn: ['false_dichotomy'],
  actorTypes: ['expert'],
  
  resourceCost: 15,
  cooldown: 1,
  
  targetType: 'adjacent',
  effects: {
    resilienceDelta: -0.1,
    emotionalDelta: 0.15,
    polarizationDelta: 0.1,
  },
  
  animationType: 'pulse',
};
```

#### 6. Manufactured Uncertainty (doubt_seed)
**Based on:** uncertainty creation, scientific doubt
**Effect:** Creates doubt about established facts

```typescript
const doubtSeed: AbilityDefinition = {
  id: 'doubt_seed',
  name: 'Zweifel säen',
  description: 'Erzeugt Unsicherheit über etablierte Fakten',
  
  basedOn: ['uncertainty_avoidance'], // Exploits need for certainty
  actorTypes: ['expert', 'lobby'],
  
  resourceCost: 20,
  cooldown: 2,
  
  targetType: 'network',
  effects: {
    trustDelta: -0.1,
    resilienceDelta: -0.1,
  },
  
  animationType: 'ripple',
  
  educationalContent: {
    technique: 'Wissenschaftliche Unsicherheit wird überbetont, um Zweifel zu erzeugen.',
    realWorld: 'Tabakindustrie und Klimawandelleugner nutzen diese Strategie.',
    counter: 'Wissenschaftlichen Konsens vs. künstliche Kontroverse unterscheiden.',
  }
};
```

### Lobby Actor Abilities

#### 7. Astroturfing (astroturfing)
**Based on:** social_proof (manufactured)
**Effect:** Creates fake grassroots support

```typescript
const astroturfing: AbilityDefinition = {
  id: 'astroturfing',
  name: 'Astroturfing',
  description: 'Erzeugt künstliche Graswurzelbewegungen',
  
  basedOn: ['social_proof'],
  actorTypes: ['lobby'],
  
  resourceCost: 35,
  cooldown: 3,
  
  targetType: 'network',
  effects: {
    trustDelta: -0.15,
    socialProofBonus: 0.2, // Makes future social_proof more effective
  },
  
  animationType: 'ripple',
  
  educationalContent: {
    technique: 'Fake-Accounts und koordinierte Kampagnen simulieren öffentliche Meinung.',
    realWorld: 'Bot-Netzwerke auf Social Media, bezahlte Kommentatoren.',
    counter: 'Quellenprüfung, Muster erkennen, kritisch bei "viralen" Meinungen.',
  }
};
```

#### 8. Dark Pattern Deployment (dark_patterns_ability)
**Based on:** dark_patterns, nudging
**Effect:** Manipulative interface/interaction design

```typescript
const darkPatterns: AbilityDefinition = {
  id: 'dark_patterns_ability',
  name: 'Dark Patterns',
  description: 'Nutzt manipulative Design-Muster',
  
  basedOn: ['dark_patterns', 'nudging'],
  actorTypes: ['lobby', 'organization'],
  
  resourceCost: 30,
  cooldown: 3,
  
  targetType: 'adjacent',
  effects: {
    trustDelta: -0.2,
    resilienceDelta: -0.15,
    duration: 3,
  },
  
  animationType: 'wave',
};
```

### Organization Actor Abilities

#### 9. Institutional Capture (institutional_capture)
**Based on:** authority, consistency
**Effect:** Takes over institution's credibility

```typescript
const institutionalCapture: AbilityDefinition = {
  id: 'institutional_capture',
  name: 'Institutionelle Übernahme',
  description: 'Übernimmt die Glaubwürdigkeit einer Institution',
  
  basedOn: ['authority', 'consistency'],
  actorTypes: ['organization'],
  
  resourceCost: 40,
  cooldown: 4,
  
  targetType: 'single',
  targetFilter: (actor) => actor.category === 'organization',
  effects: {
    trustDelta: -0.3,
    categoryConversion: true, // Can convert actor loyalty
  },
  
  animationType: 'pulse',
};
```

#### 10. Network Effect Amplification (network_effect)
**Based on:** social_proof, consistency
**Effect:** Amplifies effects on connected actors

```typescript
const networkEffect: AbilityDefinition = {
  id: 'network_effect',
  name: 'Netzwerkeffekt',
  description: 'Verstärkt Effekte auf verbundene Akteure',
  
  basedOn: ['social_proof', 'consistency'],
  actorTypes: ['organization'],
  
  resourceCost: 25,
  cooldown: 2,
  
  targetType: 'adjacent',
  effects: {
    amplificationFactor: 1.5, // Subsequent effects are 50% stronger
    duration: 2,
  },
  
  animationType: 'ripple',
};
```

---

## Defensive Abilities

### Fact Checker Abilities

```typescript
const factCheck: AbilityDefinition = {
  id: 'fact_check',
  name: 'Faktencheck',
  description: 'Überprüft und korrigiert Falschinformationen',
  
  basedOn: ['fact_checking'], // Countermeasure from taxonomy
  actorTypes: ['defensive'],
  
  resourceCost: 0, // Defensive actors don't use player resources
  cooldown: 1,
  
  targetType: 'adjacent',
  effects: {
    trustDelta: 0.1, // Restores trust
    resilienceDelta: 0.05,
  },
  
  animationType: 'pulse',
};
```

### Media Literacy Abilities

```typescript
const literacyTraining: AbilityDefinition = {
  id: 'literacy_training',
  name: 'Medienkompetenz-Training',
  description: 'Stärkt die Widerstandsfähigkeit gegen Manipulation',
  
  basedOn: ['media_literacy'],
  actorTypes: ['defensive'],
  
  resourceCost: 0,
  cooldown: 2,
  
  targetType: 'network',
  effects: {
    resilienceDelta: 0.15,
  },
  
  animationType: 'ripple',
};
```

---

## Vulnerability & Resistance System

### How It Works

Each actor has vulnerabilities and resistances based on their category:

```typescript
const ACTOR_AFFINITIES = {
  media: {
    vulnerabilities: ['authority', 'scarcity', 'social_proof'],
    resistances: ['emotional_appeal', 'ad_hominem'],
  },
  expert: {
    vulnerabilities: ['social_proof', 'consistency'],
    resistances: ['emotional_appeal', 'false_dichotomy'],
  },
  lobby: {
    vulnerabilities: ['transparency', 'fact_checking'],
    resistances: ['framing', 'dark_patterns'],
  },
  organization: {
    vulnerabilities: ['social_proof', 'authority'],
    resistances: ['ad_hominem', 'emotional_appeal'],
  },
  defensive: {
    vulnerabilities: [],
    resistances: ['all'], // Resistant to manipulation
  },
};
```

### Effect Modification

```typescript
function calculateFinalEffect(
  baseEffect: number,
  ability: Ability,
  target: Actor
): number {
  let effect = baseEffect;
  
  // Check for vulnerability match
  const hasVulnerability = ability.basedOn.some(
    technique => target.vulnerabilities.includes(technique)
  );
  if (hasVulnerability) {
    effect *= 1.25; // +25% effect
  }
  
  // Check for resistance match
  const hasResistance = ability.basedOn.some(
    technique => target.resistances.includes(technique)
  );
  if (hasResistance) {
    effect *= 0.5; // -50% effect
  }
  
  return effect;
}
```

---

## Educational Content Integration

### Encyclopedia Entries

Each technique from the taxonomy becomes an encyclopedia entry:

```typescript
function createEncyclopediaEntry(node: TaxonomyNode): EncyclopediaEntry {
  return {
    id: node.id,
    name: node.name,
    category: node.category,
    
    // Direct from taxonomy
    description: node.description,
    longDescription: node.longDescription,
    example: node.example,
    extendedExample: node.extendedExample,
    counterStrategies: node.counterStrategies,
    empiricalEvidence: node.empiricalEvidence,
    
    // Game-specific additions
    relatedAbilities: getAbilitiesForTechnique(node.id),
    inGameEffect: getInGameEffectDescription(node.id),
    
    // Links
    wikipediaUrl: `https://en.wikipedia.org/wiki/${node.wikipediaQuery}`,
    manipulationPotential: node.manipulationPotential,
  };
}
```

### In-Game Learning

1. **Ability Tooltips** - Show technique name and short description
2. **Detailed View** - Expandable panel with full explanation
3. **Post-Action Summary** - "You used [Framing] to..."
4. **Encyclopedia Access** - Full technique browser
5. **End-Game Report** - Statistics on techniques used

### Tooltip Example

```tsx
function AbilityTooltip({ ability }: { ability: Ability }) {
  const techniques = ability.basedOn.map(id => 
    taxonomy.nodes.find(n => n.id === id)
  );
  
  return (
    <div className="tooltip">
      <h4>{ability.name}</h4>
      <p>{ability.description}</p>
      
      <div className="techniques">
        <span className="label">Basiert auf:</span>
        {techniques.map(t => (
          <span key={t.id} className="technique-tag">
            {t.name}
          </span>
        ))}
      </div>
      
      <div className="effect">
        <span>Vertrauen: {ability.effects.trustDelta * 100}%</span>
        <span>Kosten: {ability.resourceCost}</span>
      </div>
      
      <button className="learn-more">
        Mehr erfahren →
      </button>
    </div>
  );
}
```

---

## Countermeasures Integration

### From Taxonomy

The taxonomy includes countermeasures for each technique:

```typescript
// Example from taxonomy
{
  id: 'framing',
  counterStrategies: [
    'Bewusstes Hinterfragen der präsentierten Perspektive.',
    'Suche nach alternativen Rahmungen und Interpretationen.',
    'Fokus auf die zugrundeliegenden Fakten anstatt der Präsentation.',
    'Bewusst verschiedene Nachrichtenquellen mit unterschiedlichen Blickwinkeln konsumieren.'
  ]
}
```

### In-Game Application

1. **Defensive Actor Abilities** - Based on countermeasures
2. **Recovery Bonus** - Actors using counter-strategies recover faster
3. **Tutorial Tips** - Teach players the real-world applications

```typescript
// Countermeasure effectiveness
type CountermeasureInteraction = {
  primaryCountermeasure: string;
  secondaryCountermeasure: string;
  interactionType: 'synergistic' | 'additive' | 'redundant';
  effectSize: number;
  description: string;
};

// From taxonomy
const interactions: CountermeasureInteraction[] = [
  {
    primaryCountermeasure: 'media_literacy',
    secondaryCountermeasure: 'critical_thinking',
    interactionType: 'synergistic',
    effectSize: 0.25,
    description: 'Kombination verstärkt die Wirkung beider Maßnahmen um ca. 25%',
  },
  // ... more interactions
];
```

---

## Implementation Checklist

### Phase 1: Core Abilities (8)
- [x] agenda_setting (Media)
- [x] scandal (Media)
- [x] undermine_authority (Expert)
- [x] false_dichotomy (Expert)
- [x] astroturfing (Lobby)
- [x] doubt_seed (Lobby/Expert)
- [x] institutional_capture (Organization)
- [x] network_effect (Organization)

### Phase 2: Extended Abilities (8 more)
- [ ] gatekeeping (Media)
- [ ] dark_patterns_ability (Lobby)
- [ ] emotional_manipulation (All)
- [ ] repetition_effect (Media)
- [ ] authority_appeal (Expert)
- [ ] scarcity_creation (Lobby)
- [ ] social_proof_manipulation (Organization)
- [ ] narrative_control (Media)

### Phase 3: Defensive Abilities (4)
- [ ] fact_check (Defensive)
- [ ] literacy_training (Defensive)
- [ ] prebunking (Defensive)
- [ ] transparency_enforcement (Defensive)

### Encyclopedia
- [ ] Import all 27+ techniques from taxonomy
- [ ] Create educational content for each
- [ ] Link abilities to techniques
- [ ] Add real-world examples
- [ ] Include counter-strategies

---

*Last updated: 2025-01*
*Version: 1.0.0*
