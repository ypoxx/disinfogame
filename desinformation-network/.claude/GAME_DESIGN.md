# Game Design Document

## Core Concept

**Desinformation Network** is a single-player strategy game where players take the role of a disinformation agent, manipulating trust levels across a network of societal actors.

**Genre:** Strategy / Simulation / Educational
**Platform:** Web (tablet-optimized)
**Session Length:** 15-30 minutes
**Target Audience:** Adults interested in media literacy, educators, journalists

---

## Win & Loss Conditions

### Victory Condition
**75% of actors must have trust below 40% by round 32**

```typescript
function checkVictory(state: GameState): boolean {
  const lowTrustActors = state.actors.filter(a => a.trust < 0.40);
  return lowTrustActors.length >= state.actors.length * 0.75;
}
```

### Defeat Conditions

1. **Time Limit:** Round 32 reached without victory
2. **Exposure:** (Optional) Total manipulation detected exceeds threshold
3. **Defensive Victory:** Defensive actors restore network trust above 80%

```typescript
function checkDefeat(state: GameState): DefeatReason | null {
  if (state.round > 32) return 'time_limit';
  
  const avgTrust = state.actors.reduce((sum, a) => sum + a.trust, 0) / state.actors.length;
  if (avgTrust > 0.80 && state.defensiveActors.length > 0) {
    return 'defensive_victory';
  }
  
  return null;
}
```

---

## Core Mechanics

### 1. Actors

**Categories:**

| Category | Role | Base Trust | Resilience | Special |
|----------|------|------------|------------|---------|
| Media | Information spreader | 0.6-0.8 | 0.3-0.5 | Wide influence radius |
| Expert | Authority figure | 0.7-0.9 | 0.5-0.7 | High resilience |
| Lobby | Interest group | 0.4-0.6 | 0.2-0.4 | Economic abilities |
| Organization | Institution | 0.5-0.7 | 0.4-0.6 | Network effects |
| Defensive | Counter-agent | 0.8-1.0 | 0.7-0.9 | Spawns over time |

**Actor Properties:**

```typescript
type Actor = {
  id: string;
  name: string;
  category: ActorCategory;
  
  // Core values (0-1 normalized)
  trust: number;           // Current trust level
  baseTrust: number;       // Starting value (for recovery)
  resilience: number;      // Resistance to manipulation
  influenceRadius: number; // Connection range (pixels)
  emotionalState: number;  // 0=rational, 1=emotional
  recoveryRate: number;    // Trust recovery per round
  
  // Position
  position: { x: number; y: number };
  
  // Abilities
  abilities: string[];
  cooldowns: Map<string, number>;
  
  // Taxonomy links
  vulnerabilities: string[]; // Technique IDs
  resistances: string[];     // Technique IDs
};
```

### 2. Network & Connections

**Connection Formation:**
Actors are connected if their distance is less than the average of their influence radii.

```typescript
function calculateConnections(actors: Actor[]): Connection[] {
  const connections: Connection[] = [];
  
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const a1 = actors[i];
      const a2 = actors[j];
      
      const distance = euclideanDistance(a1.position, a2.position);
      const avgRadius = (a1.influenceRadius + a2.influenceRadius) / 2;
      
      if (distance < avgRadius) {
        const strength = 1 - (distance / avgRadius);
        connections.push({
          sourceId: a1.id,
          targetId: a2.id,
          strength: strength,
          trustFlow: strength * 0.1 // 10% of strength
        });
      }
    }
  }
  
  return connections;
}
```

**Trust Propagation:**
Each round, trust flows through connections based on strength.

```typescript
function propagateTrust(network: Network): Network {
  const trustDeltas = new Map<string, number>();
  
  for (const connection of network.connections) {
    const source = network.getActor(connection.sourceId);
    const target = network.getActor(connection.targetId);
    
    // Trust flows from higher to lower
    const trustDiff = source.trust - target.trust;
    const flow = trustDiff * connection.trustFlow;
    
    // Accumulate deltas
    trustDeltas.set(target.id, (trustDeltas.get(target.id) || 0) + flow);
    trustDeltas.set(source.id, (trustDeltas.get(source.id) || 0) - flow * 0.5);
  }
  
  // Apply deltas
  return network.applyTrustDeltas(trustDeltas);
}
```

### 3. Abilities

**Ability Structure:**

```typescript
type Ability = {
  id: string;
  name: string;
  description: string;
  
  // Costs
  resourceCost: number;      // 10-50
  cooldown: number;          // 0-4 rounds
  
  // Targeting
  targetType: 'single' | 'adjacent' | 'category' | 'network';
  targetFilter?: (actor: Actor) => boolean;
  
  // Effects
  effects: {
    trustDelta?: number;      // Direct trust change
    resilienceDelta?: number; // Resilience change
    emotionalDelta?: number;  // Emotional state change
    propagation?: boolean;    // Does effect spread?
    duration?: number;        // Rounds (0 = instant)
  };
  
  // Taxonomy
  basedOn: string[];          // Technique IDs from taxonomy
  
  // Visual
  animationType: 'pulse' | 'wave' | 'beam' | 'ripple';
};
```

**Core Abilities (Phase 1):**

| ID | Name | Actor | Cost | Cooldown | Effect |
|----|------|-------|------|----------|--------|
| agenda_setting | Agenda setzen | Media | 20 | 2 | -15% trust, propagates |
| scandal | Skandalisieren | Media | 30 | 3 | -25% trust, +30% emotional |
| undermine_authority | Autorität untergraben | Expert | 25 | 2 | -20% trust to experts |
| false_dichotomy | Falsche Dichotomie | Expert | 15 | 1 | -10% resilience |
| astroturfing | Astroturfing | Lobby | 35 | 3 | Fake grassroots support |
| doubt_seed | Zweifel säen | Lobby | 20 | 2 | -15% trust, +20% emotional |
| institutional_capture | Institutionelle Übernahme | Org | 40 | 4 | Convert actor loyalty |
| network_effect | Netzwerkeffekt | Org | 25 | 2 | Amplify adjacent effects |

### 4. Resources

**Resource System:**

- **Starting Resources:** 100
- **Per-Round Income:** 20 + bonus
- **Bonus Calculation:** Based on controlled actors

```typescript
function calculateResourceBonus(state: GameState): number {
  const lowTrustActors = state.actors.filter(a => a.trust < 0.5);
  return Math.floor(lowTrustActors.length * 2); // +2 per low-trust actor
}
```

**Cost Guidelines:**
- Minor effects: 10-15 resources
- Standard effects: 20-30 resources
- Major effects: 35-50 resources

### 5. Events

**Event Types:**

1. **Random Events** (30% per round)
   - News stories
   - Scandals
   - External crises

2. **Conditional Events** (trigger on state)
   - Defensive spawns (every 8 rounds)
   - Trust collapse cascades
   - Recovery movements

3. **Milestone Events**
   - First actor below 40%
   - Half network compromised
   - Defensive actor spawns

**Event Structure:**

```typescript
type GameEvent = {
  id: string;
  name: string;
  description: string;
  
  triggerType: 'random' | 'conditional' | 'milestone';
  probability?: number;
  condition?: (state: GameState) => boolean;
  
  effects: {
    globalTrustShift?: number;
    targetedEffects?: Effect[];
    resourceBonus?: number;
    spawnActor?: ActorConfig;
  };
  
  newsTickerText: string;
};
```

---

## Difficulty Scaling

### Diminishing Returns

As network trust decreases, abilities become less effective:

```typescript
function calculateEffectiveness(
  baseEffect: number,
  networkTrust: number
): number {
  // Full effect above 60% trust
  // Reduced effect below 60%
  if (networkTrust > 0.6) return baseEffect;
  
  // Linear reduction to 50% effectiveness at 30% trust
  const reduction = (0.6 - networkTrust) / 0.3 * 0.5;
  return baseEffect * (1 - reduction);
}
```

### Defensive Spawns

Every 8 rounds, a defensive actor spawns if average trust is below 50%:

```typescript
function checkDefensiveSpawn(state: GameState): Actor | null {
  if (state.round % 8 !== 0) return null;
  
  const avgTrust = calculateAverageTrust(state.actors);
  if (avgTrust >= 0.5) return null;
  
  const defensiveTypes = ['fact_checker', 'media_literacy', 'regulatory_body'];
  const type = defensiveTypes[state.round / 8 - 1] || 'fact_checker';
  
  return createDefensiveActor(type);
}
```

**Defensive Actor Types:**

| Type | Round | Effect |
|------|-------|--------|
| Fact Checker | 8 | +10% trust to connected actors |
| Media Literacy | 16 | +15% resilience network-wide |
| Regulatory Body | 24 | Blocks certain abilities |

### Recovery Mechanic

Actors naturally recover trust toward their base value:

```typescript
function applyRecovery(actor: Actor): Actor {
  const recoveryAmount = (actor.baseTrust - actor.trust) * actor.recoveryRate;
  return {
    ...actor,
    trust: Math.min(actor.trust + recoveryAmount, actor.baseTrust)
  };
}
```

---

## Balance Formulas

### Trust Calculation

```typescript
function applyTrustEffect(
  actor: Actor,
  baseEffect: number,
  ability: Ability,
  state: GameState
): number {
  // Start with base effect
  let effect = baseEffect;
  
  // Apply resilience reduction
  effect *= (1 - actor.resilience * 0.5);
  
  // Apply emotional amplification
  if (actor.emotionalState > 0.5) {
    effect *= 1 + (actor.emotionalState - 0.5);
  }
  
  // Apply vulnerability bonus
  const hasVulnerability = ability.basedOn.some(
    tech => actor.vulnerabilities.includes(tech)
  );
  if (hasVulnerability) {
    effect *= 1.25; // +25% effect
  }
  
  // Apply resistance reduction
  const hasResistance = ability.basedOn.some(
    tech => actor.resistances.includes(tech)
  );
  if (hasResistance) {
    effect *= 0.5; // -50% effect
  }
  
  // Apply diminishing returns
  effect = calculateEffectiveness(effect, state.averageTrust);
  
  // Clamp result
  return Math.max(-1, Math.min(1, effect));
}
```

### Network Statistics

```typescript
function calculateNetworkStats(network: Network): NetworkStats {
  const actors = network.actors;
  const n = actors.length;
  
  // Average trust
  const avgTrust = actors.reduce((s, a) => s + a.trust, 0) / n;
  
  // Trust variance (for polarization)
  const variance = actors.reduce(
    (s, a) => s + Math.pow(a.trust - avgTrust, 2), 0
  ) / n;
  
  // Polarization index (0-1)
  const polarization = Math.min(1, variance * 4);
  
  // Emotional state
  const avgEmotional = actors.reduce((s, a) => s + a.emotionalState, 0) / n;
  
  // Connection density
  const maxConnections = (n * (n - 1)) / 2;
  const density = network.connections.length / maxConnections;
  
  return {
    averageTrust: avgTrust,
    polarizationIndex: polarization,
    emotionalState: avgEmotional,
    connectionDensity: density,
    lowTrustCount: actors.filter(a => a.trust < 0.4).length,
    highTrustCount: actors.filter(a => a.trust > 0.7).length
  };
}
```

---

## Progression & Scoring

### Score Calculation

```typescript
function calculateScore(state: GameState, victory: boolean): number {
  let score = 0;
  
  // Base score for victory
  if (victory) {
    score += 1000;
    
    // Bonus for fast victory
    const roundsUnder = 32 - state.round;
    score += roundsUnder * 50;
  }
  
  // Points for low-trust actors
  const lowTrustActors = state.actors.filter(a => a.trust < 0.4);
  score += lowTrustActors.length * 100;
  
  // Points for efficiency (resources remaining)
  score += state.resources;
  
  // Penalty for defensive actors
  score -= state.defensiveActors.length * 200;
  
  return Math.max(0, score);
}
```

### Achievements (Future)

- **Speed Run:** Win in under 16 rounds
- **Efficient:** Win with 50+ resources remaining
- **Stealth:** Win without triggering defensive spawns
- **Complete:** Reduce all actors below 40%
- **Educator:** Read all encyclopedia entries

---

## UI/UX Design

### Main Game Screen Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header: Round | Resources | Avg Trust | [Menu] [Help]   │
├────────────────────────────────────┬─────────────────────┤
│                                    │                     │
│                                    │   Actor Panel       │
│         Network Canvas             │   - Name            │
│         (Touch/Click to select)    │   - Stats           │
│                                    │   - Abilities       │
│                                    │   - [Use Ability]   │
│                                    │                     │
├────────────────────────────────────┴─────────────────────┤
│  News Ticker: [Event text scrolling...]                  │
├──────────────────────────────────────────────────────────┤
│  Controls: [End Round] [Undo] [Speed]                    │
└──────────────────────────────────────────────────────────┘
```

### Interaction Flow

1. **Select Actor:** Tap on node in canvas
2. **View Details:** Panel shows actor info
3. **Select Ability:** Tap ability button
4. **Choose Target:** Canvas highlights valid targets
5. **Confirm:** Tap target to execute
6. **See Effect:** Animation shows result
7. **End Round:** Tap button to advance

### Visual Feedback

**Trust Colors:**
- 0.0-0.3: Red (#EF4444)
- 0.3-0.5: Orange (#F97316)
- 0.5-0.7: Yellow (#EAB308)
- 0.7-0.9: Light Green (#84CC16)
- 0.9-1.0: Green (#22C55E)

**Animations:**
- Pulse: Radial expansion from actor
- Wave: Ripple through connections
- Beam: Direct line to target
- Ripple: Network-wide effect

---

## Educational Integration

### Learning Moments

1. **Ability Tooltips:** Explain the persuasion technique
2. **Encyclopedia:** Deep-dive into each technique
3. **Post-Game Summary:** Which techniques were most effective
4. **Counter-Strategy Tips:** How to defend against manipulation

### Encyclopedia Structure

```typescript
type EncyclopediaEntry = {
  techniqueId: string;        // From taxonomy
  name: string;
  category: string;
  
  // Content from taxonomy.json
  description: string;
  longDescription: string;
  example: string;
  extendedExample: string;
  
  // Game-specific
  relatedAbilities: string[];
  effectivenessInGame: string;
  realWorldExamples: string[];
  
  // Counter-strategies
  counterStrategies: string[];
  
  // Links
  wikipediaQuery: string;
  furtherReading: string[];
};
```

---

## Technical Specifications

### Performance Targets

- **Canvas FPS:** 60fps on iPad
- **Load Time:** <3s initial load
- **Bundle Size:** <500KB gzipped
- **Memory:** <100MB heap

### Save System

**Local Storage:**
```typescript
type LocalSave = {
  seed: string;
  round: number;
  state: string; // JSON-encoded GameState
  timestamp: number;
};

// Auto-save every round
localStorage.setItem('desinformation_save', JSON.stringify(save));
```

**Cloud Save (Optional):**
```typescript
// POST /.netlify/functions/game-state-save
{
  seed: string;
  round: number;
  state: string;
}
```

### Seed System

**Deterministic Generation:**
```typescript
class SeededRandom {
  private seed: number;
  
  constructor(seedString: string) {
    this.seed = this.hashString(seedString);
  }
  
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
```

---

## Roadmap

### Phase 1: MVP (Week 1-2)
- [x] Core game loop
- [x] 6-8 actors
- [x] 8 abilities
- [x] Basic UI
- [x] Win/loss conditions
- [ ] Seed system

### Phase 2: Polish (Week 3-4)
- [ ] Event system
- [ ] Defensive spawns
- [ ] Tutorial
- [ ] Sound effects
- [ ] Animations

### Phase 3: Content (Week 5+)
- [ ] Full encyclopedia
- [ ] More abilities (16+)
- [ ] Multiple scenarios
- [ ] Leaderboard
- [ ] "Defender" mode

---

*Last updated: 2025-01*
*Version: 1.0.0*
