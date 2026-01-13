# Disinfogame - Massive Expansion & Mechanics Roadmap

**Goal:** Scale game to 56+ actors with enhanced mechanics while maintaining excellent UX and performance.

**Scope:** Complete overhaul in one major update
- Massive Actor Expansion: +40 actors (16 → 56)
- All new mechanics: Combo System, Network Topology, Actor AI, Advanced Events
- Performance target: 60fps with 60+ actors

---

## Architecture Overview

### Current State (v1.0)
- 16 actors (manual positioning)
- O(n²) connection algorithm
- All actors rendered always
- Simple event system (30% random chance)
- No actor AI (except basic defensive spawning)
- Linear resource economy
- Single victory condition

### Target State (v2.0)
- 56+ actors (auto-positioning via force-directed layout)
- Tier-based rendering (1=Core, 2=Secondary, 3=Background)
- Smart connection algorithm with spatial indexing
- LOD (Level of Detail) rendering based on zoom
- Combo system with ability chains
- Network topology detection (bottlenecks, clusters, bridges)
- Actor AI with reactions and counter-strategies
- Advanced event system with chains and player choices
- Multiple victory paths

---

## Phase 1: Foundation Layer (Architecture)

### 1.1 Type System Extensions

**File:** `src/game-logic/types/index.ts`

```typescript
// Enhanced Actor interface
interface Actor {
  // ... existing fields

  // NEW: Tier & Visibility
  tier: 1 | 2 | 3;
  renderPriority: number; // 1-10 for sorting
  minZoomLevel?: number; // Only render when zoomed past this

  // NEW: Grouping & Clustering
  groupId?: string; // Visual/logical group (e.g., "quality_media")
  representsCount?: number; // For aggregate actors

  // NEW: AI & Behavior
  behavior?: ActorBehavior;
  awareness: number; // 0-1, tracks if actor is aware of manipulation
  lastAttacked?: number; // Round number of last attack

  // NEW: Network Topology
  centrality?: number; // Betweenness centrality (calculated)
  isBottleneck?: boolean; // Critical bridge actor
}

interface ActorBehavior {
  type: 'passive' | 'defensive' | 'aggressive';
  triggerThreshold: number; // Trust level that triggers behavior
  counterAbilities?: string[]; // Can use these to counter player
}

// Enhanced Connection
interface Connection {
  // ... existing
  strength: number; // 0-1 (weak, medium, strong)
  type: 'structural' | 'ideological' | 'financial' | 'social';
  visible: boolean; // Render or not
  bidirectional: boolean;
}

// NEW: Combo tracking
interface AbilityCombo {
  id: string;
  name: string;
  description: string;
  sequence: string[]; // Array of ability IDs in order
  timeWindow: number; // Rounds to complete combo
  bonusEffect: number; // Multiplier (e.g., 2.0 = double effect)
  unlocksAt?: number; // Min round to unlock
}

// NEW: Network Topology Metrics
interface NetworkTopology {
  clusters: ActorCluster[];
  bottlenecks: Actor[]; // Critical bridge actors
  communities: Community[];
  centralActors: Actor[]; // High betweenness centrality
}

interface ActorCluster {
  id: string;
  name: string;
  actors: string[]; // Actor IDs
  averageTrust: number;
  center: Position; // Visual center point
  radius: number;
}

interface Community {
  id: string;
  type: 'media_ecosystem' | 'expert_network' | 'lobby_coalition';
  members: string[];
  cohesion: number; // 0-1
}

// NEW: Advanced Events
interface ConditionalEvent extends GameEvent {
  // ... existing
  chainTo?: string; // ID of next event in chain
  playerChoice?: EventChoice[];
}

interface EventChoice {
  text: string;
  cost?: ResourceCost;
  effects: EventEffect[];
  consequence?: string; // Text description
}
```

### 1.2 Auto-Connection Algorithm

**File:** `src/utils/network/connections.ts` (NEW)

```typescript
/**
 * Smart connection algorithm based on actor properties
 * instead of spatial distance only
 */

interface ConnectionRule {
  fromCategory?: ActorCategory;
  toCategory?: ActorCategory;
  fromSubcategory?: string;
  toSubcategory?: string;
  strength: number; // 0-1
  type: ConnectionType;
  maxDistance?: number; // Optional spatial constraint
}

// Predefined connection rules
const CONNECTION_RULES: ConnectionRule[] = [
  // Media connections
  { fromCategory: 'media', toCategory: 'media', strength: 0.6, type: 'structural' },
  { fromSubcategory: 'quality', toSubcategory: 'quality', strength: 0.8, type: 'ideological' },
  { fromSubcategory: 'tabloid', toSubcategory: 'tabloid', strength: 0.7, type: 'structural' },

  // Media <-> Expert
  { fromCategory: 'media', toCategory: 'expert', strength: 0.5, type: 'social' },
  { fromSubcategory: 'quality', toCategory: 'expert', strength: 0.8, type: 'social' },

  // Lobby connections
  { fromCategory: 'lobby', toCategory: 'expert', strength: 0.6, type: 'financial' },
  { fromCategory: 'lobby', toCategory: 'media', strength: 0.4, type: 'financial' },

  // Infrastructure hubs (high connectivity)
  { fromCategory: 'infrastructure', toCategory: 'media', strength: 0.9, type: 'structural' },
  { fromCategory: 'infrastructure', toCategory: 'expert', strength: 0.7, type: 'structural' },

  // Defensive actors connect to vulnerable
  { fromCategory: 'defensive', toCategory: 'media', strength: 0.5, type: 'social' },
];

function calculateSmartConnections(actors: Actor[]): Connection[] {
  const connections: Connection[] = [];

  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const connection = evaluateConnection(actors[i], actors[j]);
      if (connection) {
        connections.push(connection);
      }
    }
  }

  return connections;
}

function evaluateConnection(a: Actor, b: Actor): Connection | null {
  // Find matching rules
  const matchingRules = CONNECTION_RULES.filter(rule =>
    matchesRule(a, b, rule) || matchesRule(b, a, rule)
  );

  if (matchingRules.length === 0) return null;

  // Take strongest matching rule
  const bestRule = matchingRules.reduce((best, rule) =>
    rule.strength > best.strength ? rule : best
  );

  // Check spatial constraint if exists
  if (bestRule.maxDistance) {
    const distance = calculateDistance(a.position, b.position);
    if (distance > bestRule.maxDistance) return null;
  }

  return {
    sourceId: a.id,
    targetId: b.id,
    strength: bestRule.strength,
    type: bestRule.type,
    visible: bestRule.strength > 0.5, // Only show strong connections
    bidirectional: true,
  };
}
```

### 1.3 Spatial Indexing

**File:** `src/utils/network/spatial-index.ts` (NEW)

```typescript
/**
 * Grid-based spatial index for O(1) nearby actor queries
 * Essential for performance with 60+ actors
 */

interface GridCell {
  x: number;
  y: number;
  actors: Actor[];
}

export class SpatialIndex {
  private gridSize: number;
  private grid: Map<string, GridCell>;
  private bounds: { width: number; height: number };

  constructor(width: number, height: number, gridSize: number = 100) {
    this.gridSize = gridSize;
    this.bounds = { width, height };
    this.grid = new Map();
  }

  /**
   * Add actor to spatial index
   */
  insert(actor: Actor): void {
    const cell = this.getCell(actor.position);
    const key = this.getCellKey(cell.x, cell.y);

    if (!this.grid.has(key)) {
      this.grid.set(key, { x: cell.x, y: cell.y, actors: [] });
    }

    this.grid.get(key)!.actors.push(actor);
  }

  /**
   * Get all actors within radius (fast!)
   */
  getNearby(position: Position, radius: number): Actor[] {
    const cells = this.getCellsInRadius(position, radius);
    const nearby: Actor[] = [];

    for (const cell of cells) {
      const key = this.getCellKey(cell.x, cell.y);
      const gridCell = this.grid.get(key);
      if (gridCell) {
        nearby.push(...gridCell.actors);
      }
    }

    // Filter by actual distance
    return nearby.filter(actor => {
      const dist = calculateDistance(position, actor.position);
      return dist <= radius;
    });
  }

  /**
   * Update spatial index (call when actors move)
   */
  rebuild(actors: Actor[]): void {
    this.grid.clear();
    actors.forEach(actor => this.insert(actor));
  }

  private getCell(pos: Position): { x: number; y: number } {
    return {
      x: Math.floor(pos.x / this.gridSize),
      y: Math.floor(pos.y / this.gridSize),
    };
  }

  private getCellKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  private getCellsInRadius(pos: Position, radius: number): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const cellRadius = Math.ceil(radius / this.gridSize);
    const center = this.getCell(pos);

    for (let x = center.x - cellRadius; x <= center.x + cellRadius; x++) {
      for (let y = center.y - cellRadius; y <= center.y + cellRadius; y++) {
        cells.push({ x, y });
      }
    }

    return cells;
  }
}
```

### 1.4 Visual Hierarchy System

**File:** `src/components/NetworkVisualization.tsx` (UPDATE)

```typescript
// Add LOD (Level of Detail) rendering

interface RenderOptions {
  zoomLevel: number; // 0.1 - 3.0
  showTier1: boolean;
  showTier2: boolean;
  showTier3: boolean;
  showWeakConnections: boolean;
}

function shouldRenderActor(actor: Actor, options: RenderOptions): boolean {
  // Always show Tier 1
  if (actor.tier === 1) return options.showTier1;

  // Tier 2: Show if zoomed in or high priority
  if (actor.tier === 2) {
    return options.showTier2 && (
      options.zoomLevel > 1.0 ||
      actor.renderPriority >= 7
    );
  }

  // Tier 3: Only when zoomed in significantly
  if (actor.tier === 3) {
    return options.showTier3 && options.zoomLevel > 1.5;
  }

  return true;
}

function getActorVisualProperties(actor: Actor, options: RenderOptions) {
  const baseSize = actor.size || 50;
  const baseOpacity = 1.0;

  // Tier-based scaling
  let sizeMultiplier = 1.0;
  let opacity = baseOpacity;

  switch (actor.tier) {
    case 1:
      sizeMultiplier = 1.2;
      opacity = 1.0;
      break;
    case 2:
      sizeMultiplier = 1.0;
      opacity = 0.85;
      break;
    case 3:
      sizeMultiplier = 0.8;
      opacity = 0.7;
      break;
  }

  // Zoom-based adjustments
  if (options.zoomLevel < 1.0) {
    // Zoomed out: emphasize important actors
    sizeMultiplier *= actor.tier === 1 ? 1.2 : 0.8;
  }

  return {
    size: baseSize * sizeMultiplier,
    opacity,
    strokeWidth: actor.tier === 1 ? 3 : 2,
  };
}
```

---

## Phase 2: UX Layer

### 2.1 Filter UI Component

**File:** `src/components/filters/ActorFilter.tsx` (NEW)

```typescript
/**
 * Filter actors by tier, category, trust level, etc.
 */

interface FilterState {
  tiers: Set<1 | 2 | 3>;
  categories: Set<ActorCategory>;
  trustRange: [number, number]; // 0-1
  searchQuery: string;
  showOnlyActive: boolean; // Only show actors in active combos/effects
}

export function ActorFilter({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    tiers: new Set([1, 2, 3]),
    categories: new Set(['media', 'expert', 'lobby', 'organization', 'infrastructure']),
    trustRange: [0, 1],
    searchQuery: '',
    showOnlyActive: false,
  });

  return (
    <div className="actor-filter">
      {/* Tier toggles */}
      <div className="filter-section">
        <label>Importance</label>
        <ToggleGroup>
          <Toggle active={filters.tiers.has(1)} onClick={() => toggleTier(1)}>
            Core
          </Toggle>
          <Toggle active={filters.tiers.has(2)} onClick={() => toggleTier(2)}>
            Secondary
          </Toggle>
          <Toggle active={filters.tiers.has(3)} onClick={() => toggleTier(3)}>
            Background
          </Toggle>
        </ToggleGroup>
      </div>

      {/* Category filter */}
      <div className="filter-section">
        <label>Type</label>
        <CategorySelect
          selected={filters.categories}
          onChange={setCategories}
        />
      </div>

      {/* Trust range slider */}
      <div className="filter-section">
        <label>Trust Level</label>
        <RangeSlider
          min={0}
          max={1}
          step={0.1}
          value={filters.trustRange}
          onChange={setTrustRange}
        />
      </div>

      {/* Quick filters */}
      <div className="filter-section">
        <Button onClick={() => filterLowTrust()}>
          Show Low Trust Only
        </Button>
        <Button onClick={() => filterHighValue()}>
          High Value Targets
        </Button>
      </div>
    </div>
  );
}
```

### 2.2 Search Component

**File:** `src/components/filters/ActorSearch.tsx` (NEW)

```typescript
/**
 * Search actors by name, fuzzy matching
 */

export function ActorSearch({ actors, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Actor[]>([]);

  const search = useMemo(() => {
    return new Fuse(actors, {
      keys: ['name', 'description', 'category', 'subcategory'],
      threshold: 0.3,
    });
  }, [actors]);

  const handleSearch = (query: string) => {
    setQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const results = search.search(query).map(r => r.item);
    setResults(results.slice(0, 10));
  };

  return (
    <div className="actor-search">
      <input
        type="text"
        placeholder="Search actors..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-results">
          {results.map(actor => (
            <SearchResult
              key={actor.id}
              actor={actor}
              onClick={() => {
                onSelect(actor);
                setQuery('');
                setResults([]);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2.3 Cluster Visualization

**File:** `src/utils/network/clustering.ts` (NEW)

```typescript
/**
 * Auto-detect clusters using community detection algorithm
 * (Simplified Louvain algorithm)
 */

export function detectClusters(
  actors: Actor[],
  connections: Connection[]
): ActorCluster[] {
  // Build adjacency list
  const adjacency = buildAdjacencyList(actors, connections);

  // Initialize: each actor in own cluster
  let clusters = actors.map(a => ({
    id: a.id,
    members: new Set([a.id]),
  }));

  // Iteratively merge clusters to maximize modularity
  let improved = true;
  while (improved) {
    improved = false;

    for (let i = 0; i < clusters.length; i++) {
      const bestMerge = findBestMerge(clusters[i], clusters, adjacency);
      if (bestMerge) {
        mergeClusters(clusters, i, bestMerge.index);
        improved = true;
        break;
      }
    }
  }

  // Convert to ActorCluster format
  return clusters.map(cluster => ({
    id: generateClusterId(cluster),
    name: inferClusterName(cluster, actors),
    actors: Array.from(cluster.members),
    averageTrust: calculateAverageTrust(cluster, actors),
    center: calculateCenter(cluster, actors),
    radius: calculateRadius(cluster, actors),
  }));
}

function inferClusterName(cluster: any, actors: Actor[]): string {
  const members = Array.from(cluster.members).map(id =>
    actors.find(a => a.id === id)!
  );

  // Find most common category
  const categories = members.map(a => a.category);
  const mostCommon = mode(categories);

  // Check for subcategory patterns
  const subcategories = members.map(a => a.subcategory).filter(Boolean);
  const commonSub = mode(subcategories);

  if (commonSub && subcategories.length > members.length * 0.6) {
    return `${capitalize(commonSub)} Network`;
  }

  return `${capitalize(mostCommon)} Cluster`;
}
```

**File:** `src/components/visualization/ClusterOverlay.tsx` (NEW)

```typescript
/**
 * Visual overlay showing detected clusters
 */

export function ClusterOverlay({ clusters, visible }: Props) {
  if (!visible) return null;

  return (
    <svg className="cluster-overlay">
      {clusters.map(cluster => (
        <g key={cluster.id}>
          {/* Cluster boundary circle */}
          <circle
            cx={cluster.center.x}
            cy={cluster.center.y}
            r={cluster.radius}
            fill={getClusterColor(cluster)}
            opacity={0.1}
            stroke={getClusterColor(cluster)}
            strokeWidth={2}
            strokeDasharray="5,5"
          />

          {/* Cluster label */}
          <text
            x={cluster.center.x}
            y={cluster.center.y - cluster.radius - 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
          >
            {cluster.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
```

---

## Phase 3: Massive Actor Expansion

### 3.1 Actor Organization Structure

```
data/game/actors/
├── core/
│   ├── media-core.json          (Tier 1: BILD, SZ, ARD, Spiegel)
│   ├── experts-core.json        (Tier 1: Top scientists)
│   └── infrastructure-core.json (Tier 1: Twitter, Bot Farm)
│
├── media/
│   ├── quality-newspapers.json  (FAZ, Zeit, taz, FR, Welt, ...)
│   ├── tabloids.json           (Express, Focus, Bunte, ...)
│   ├── regional.json           (Regional newspapers aggregated)
│   ├── tv-channels.json        (RTL2, Pro7, ZDF, Arte, ...)
│   ├── radio.json              (Radio networks)
│   └── influencers.json        (Social media influencers)
│
├── experts/
│   ├── medicine.json
│   ├── climate.json
│   ├── economics.json
│   ├── technology.json
│   ├── sociology.json
│   ├── psychology.json
│   └── pseudo-experts.json     (Multiple fake credential actors)
│
├── lobby/
│   ├── industry.json           (Pharma, Energy, Auto, Tech, Banking)
│   ├── ngos.json              (Environment, Consumer, Human Rights)
│   └── think-tanks.json       (Various think tanks, real and fake)
│
└── organizations/
    ├── government.json         (Ministries, EU bodies)
    ├── institutions.json       (Universities, Hospitals)
    ├── regulatory.json         (Fact-checkers, Media councils)
    └── international.json      (International media, WHO, etc.)
```

### 3.2 Actor Count Breakdown

| Category | Tier 1 | Tier 2 | Tier 3 | Total |
|----------|--------|--------|--------|-------|
| **Media** | 4 | 10 | 8 | 22 |
| **Experts** | 2 | 6 | 6 | 14 |
| **Lobby/NGO** | 2 | 5 | 3 | 10 |
| **Organizations** | 2 | 4 | 2 | 8 |
| **Infrastructure** | 2 | 1 | 1 | 4 |
| **Defensive** | 0 | 0 | 0 | 0* |
| **TOTAL** | **12** | **26** | **20** | **58** |

*Defensive actors spawn dynamically during gameplay

### 3.3 Sample New Actors

**Media - Quality Newspapers:**
```json
{
  "id": "faz",
  "name": "Frankfurter Allgemeine Zeitung",
  "tier": 2,
  "category": "media",
  "subcategory": "quality_conservative",
  "description": "Conservative quality newspaper - business & politics focus",
  "realWorldContext": "Leading German quality daily, business-oriented",
  "baseTrust": 0.76,
  "resilience": 0.58,
  "reach": 0.42,
  "influenceRadius": 120,
  "emotionalState": 0.18,
  "recoveryRate": 0.026,
  "abilities": ["investigativ_framing", "business_angle"],
  "vulnerabilities": ["ad_hominem", "bias_framing"],
  "resistances": ["emotional_appeal", "scarcity"],
  "connections": {
    "categories": ["media.quality", "expert.economics", "lobby.industry"],
    "strength": 0.7
  },
  "behavior": {
    "type": "defensive",
    "triggerThreshold": 0.5,
    "counterAbilities": ["fact_check"]
  },
  "visual": {
    "color": "#2563EB",
    "size": 58,
    "icon": "📰"
  }
}
```

**Experts - Technology:**
```json
{
  "id": "prof_digital_tech",
  "name": "Prof. Dr. Schneider",
  "tier": 2,
  "category": "expert",
  "subcategory": "scientist_technology",
  "description": "Digital technology & AI expert",
  "expertise": "Artificial Intelligence & Digital Ethics",
  "baseTrust": 0.70,
  "resilience": 0.55,
  "reach": 0.48,
  "influenceRadius": 105,
  "emotionalState": 0.22,
  "recoveryRate": 0.024,
  "abilities": ["publish_research", "tv_appearance", "tech_prediction"],
  "vulnerabilities": ["credential_attack", "complexity_dismissal"],
  "resistances": ["emotional_appeal"],
  "connections": {
    "categories": ["expert.technology", "media.quality", "lobby.tech"],
    "specific": ["twitter_x", "der_spiegel"],
    "strength": 0.6
  },
  "visual": {
    "color": "#8B5CF6",
    "size": 52,
    "icon": "👨‍💻"
  }
}
```

**Infrastructure - Influencer Network:**
```json
{
  "id": "influencer_network",
  "name": "Social Media Influencer Sphere",
  "tier": 3,
  "category": "infrastructure",
  "subcategory": "influencer_aggregate",
  "description": "Network of mid-tier influencers (10k-100k followers each)",
  "realWorldContext": "Represents ecosystem of lifestyle, political, conspiracy influencers",
  "representsCount": 50,
  "baseTrust": 0.32,
  "resilience": 0.18,
  "reach": 0.88,
  "influenceRadius": 180,
  "emotionalState": 0.72,
  "recoveryRate": 0.008,
  "abilities": ["viral_content", "emotional_manipulation", "trend_hijacking"],
  "vulnerabilities": ["platform_ban", "fact_check"],
  "resistances": [],
  "connections": {
    "categories": ["infrastructure.social", "media.tabloid"],
    "strength": 0.8
  },
  "specialMechanic": "Can amplify any narrative rapidly but with low credibility",
  "visual": {
    "color": "#EC4899",
    "size": 65,
    "icon": "📱👥"
  }
}
```

### 3.4 Auto-Positioning Algorithm

**File:** `src/utils/network/force-layout.ts` (NEW)

```typescript
/**
 * Force-directed graph layout for automatic actor positioning
 * Based on D3 force simulation but custom implementation
 */

interface ForceSimulation {
  nodes: Actor[];
  connections: Connection[];
  width: number;
  height: number;
}

export function calculateForceLayout(sim: ForceSimulation, iterations = 300): Actor[] {
  const nodes = sim.nodes.map(n => ({
    ...n,
    vx: 0,
    vy: 0,
    fx: n.tier === 1 ? n.position?.x : undefined, // Pin Tier 1 actors
    fy: n.tier === 1 ? n.position?.y : undefined,
  }));

  for (let i = 0; i < iterations; i++) {
    // Apply forces
    applyRepulsionForce(nodes);
    applyAttractionForce(nodes, sim.connections);
    applyCenteringForce(nodes, sim.width / 2, sim.height / 2);
    applyCategoryClusteringForce(nodes);

    // Update positions
    nodes.forEach(node => {
      if (node.fx === undefined) {
        node.position.x += node.vx;
        node.position.y += node.vy;

        // Apply damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Keep in bounds
        node.position.x = clamp(node.position.x, 50, sim.width - 50);
        node.position.y = clamp(node.position.y, 50, sim.height - 50);
      }
    });
  }

  return nodes.map(n => ({
    ...n,
    position: n.position,
  }));
}

function applyRepulsionForce(nodes: any[]): void {
  const strength = 1000;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].position.x - nodes[i].position.x;
      const dy = nodes[j].position.y - nodes[i].position.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      const force = strength / (distance * distance);
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      nodes[i].vx -= fx;
      nodes[i].vy -= fy;
      nodes[j].vx += fx;
      nodes[j].vy += fy;
    }
  }
}

function applyAttractionForce(nodes: any[], connections: Connection[]): void {
  const strength = 0.01;

  connections.forEach(conn => {
    const source = nodes.find(n => n.id === conn.sourceId);
    const target = nodes.find(n => n.id === conn.targetId);
    if (!source || !target) return;

    const dx = target.position.x - source.position.x;
    const dy = target.position.y - source.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    const force = distance * strength * conn.strength;
    const fx = (dx / distance) * force;
    const fy = (dy / distance) * force;

    source.vx += fx;
    source.vy += fy;
    target.vx -= fx;
    target.vy -= fy;
  });
}

function applyCategoryClusteringForce(nodes: any[]): void {
  // Group nodes of same category together
  const categoryGroups = groupBy(nodes, 'category');

  Object.entries(categoryGroups).forEach(([category, groupNodes]) => {
    // Calculate center of mass for this category
    const centerX = mean(groupNodes.map(n => n.position.x));
    const centerY = mean(groupNodes.map(n => n.position.y));

    // Pull nodes towards category center
    groupNodes.forEach(node => {
      const dx = centerX - node.position.x;
      const dy = centerY - node.position.y;
      node.vx += dx * 0.005;
      node.vy += dy * 0.005;
    });
  });
}
```

---

## Phase 4: Enhanced Mechanics

### 4.1 Combo System

**File:** `src/game-logic/ComboSystem.ts` (NEW)

```typescript
/**
 * Combo system: Chain abilities for bonus effects
 */

export class ComboSystem {
  private activeCombos: Map<string, ComboProgress> = new Map();
  private comboDefinitions: AbilityCombo[] = [];

  loadCombos(combos: AbilityCombo[]): void {
    this.comboDefinitions = combos;
  }

  /**
   * Track ability usage and detect combo progress
   */
  onAbilityUsed(
    abilityId: string,
    targetId: string,
    currentRound: number
  ): ComboDetection {
    // Check if this ability is part of any combo
    const possibleCombos = this.comboDefinitions.filter(combo =>
      combo.sequence.includes(abilityId)
    );

    const triggered: AbilityCombo[] = [];

    for (const combo of possibleCombos) {
      const progress = this.getOrCreateProgress(combo.id, currentRound);

      // Check if this is the next ability in sequence
      const nextIndex = progress.completedSteps.length;
      if (combo.sequence[nextIndex] === abilityId) {
        progress.completedSteps.push({
          abilityId,
          targetId,
          round: currentRound,
        });

        // Check if combo completed
        if (progress.completedSteps.length === combo.sequence.length) {
          triggered.push(combo);
          this.activeCombos.delete(combo.id);
        }
      }

      // Check if combo expired
      if (currentRound - progress.startRound > combo.timeWindow) {
        this.activeCombos.delete(combo.id);
      }
    }

    return {
      inProgress: Array.from(this.activeCombos.values()),
      triggered,
    };
  }

  /**
   * Apply combo bonus effects
   */
  applyComboBonus(
    combo: AbilityCombo,
    baseEffect: number
  ): number {
    return baseEffect * combo.bonusEffect;
  }

  private getOrCreateProgress(comboId: string, round: number): ComboProgress {
    if (!this.activeCombos.has(comboId)) {
      this.activeCombos.set(comboId, {
        comboId,
        startRound: round,
        completedSteps: [],
      });
    }
    return this.activeCombos.get(comboId)!;
  }
}

interface ComboProgress {
  comboId: string;
  startRound: number;
  completedSteps: Array<{
    abilityId: string;
    targetId: string;
    round: number;
  }>;
}

interface ComboDetection {
  inProgress: ComboProgress[];
  triggered: AbilityCombo[];
}
```

**File:** `data/game/combos.json` (NEW)

```json
[
  {
    "id": "information_laundering_chain",
    "name": "Information Laundering Chain",
    "description": "Plant story in Telegram → Express reports → BILD amplifies",
    "sequence": ["anonymous_leak", "lokale_empoerung", "skandal_schlagzeile"],
    "timeWindow": 3,
    "bonusEffect": 2.5,
    "category": "advanced",
    "realExample": "Classic laundering: obscure source → tabloid → mainstream"
  },
  {
    "id": "expert_corruption_path",
    "name": "Expert Corruption",
    "description": "Commission biased study → Leak to media → TV appearance",
    "sequence": ["commission_report", "leak_study", "tv_appearance"],
    "timeWindow": 4,
    "bonusEffect": 2.0,
    "category": "authority_laundering"
  },
  {
    "id": "viral_amplification",
    "name": "Viral Amplification",
    "description": "Create bot army → Amplify content → Trending topic",
    "sequence": ["create_bot_army", "amplify_content", "trending_topic"],
    "timeWindow": 3,
    "bonusEffect": 3.0,
    "category": "infrastructure",
    "unlockAt": 5
  },
  {
    "id": "scandal_cascade",
    "name": "Scandal Cascade",
    "description": "Anonymous leak → Skandal headline → Viral story",
    "sequence": ["anonymous_leak", "skandal_schlagzeile", "viral_story"],
    "timeWindow": 3,
    "bonusEffect": 2.2,
    "category": "media_manipulation"
  },
  {
    "id": "authority_building",
    "name": "Authority Building",
    "description": "Create think tank → Commission report → Publish book",
    "sequence": ["think_tank_front", "commission_report", "publish_book"],
    "timeWindow": 5,
    "bonusEffect": 2.8,
    "category": "long_term",
    "unlockAt": 8
  }
]
```

### 4.2 Network Topology Analysis

**File:** `src/utils/network/topology.ts` (NEW)

```typescript
/**
 * Network topology analysis: detect bottlenecks, central actors, communities
 */

export function analyzeNetworkTopology(
  actors: Actor[],
  connections: Connection[]
): NetworkTopology {
  return {
    clusters: detectClusters(actors, connections),
    bottlenecks: findBottlenecks(actors, connections),
    communities: detectCommunities(actors, connections),
    centralActors: findCentralActors(actors, connections),
  };
}

/**
 * Find bottleneck actors using betweenness centrality
 * Bottlenecks = actors that bridge different parts of network
 */
function findBottlenecks(actors: Actor[], connections: Connection[]): Actor[] {
  const centrality = calculateBetweennessCentrality(actors, connections);

  // Mark actors with high centrality as bottlenecks
  const threshold = 0.7;
  const bottlenecks = actors.filter(actor => {
    const score = centrality.get(actor.id) || 0;
    return score > threshold;
  });

  // Update actor properties
  bottlenecks.forEach(actor => {
    actor.isBottleneck = true;
    actor.centrality = centrality.get(actor.id);
  });

  return bottlenecks;
}

/**
 * Calculate betweenness centrality for each actor
 * Measures how many shortest paths pass through each node
 */
function calculateBetweennessCentrality(
  actors: Actor[],
  connections: Connection[]
): Map<string, number> {
  const centrality = new Map<string, number>();
  const graph = buildGraph(actors, connections);

  // Initialize
  actors.forEach(a => centrality.set(a.id, 0));

  // For each pair of actors
  for (let s = 0; s < actors.length; s++) {
    for (let t = s + 1; t < actors.length; t++) {
      const source = actors[s];
      const target = actors[t];

      // Find all shortest paths from source to target
      const paths = findAllShortestPaths(source.id, target.id, graph);

      // For each actor on these paths (except source/target)
      actors.forEach(actor => {
        if (actor.id === source.id || actor.id === target.id) return;

        // Count how many paths pass through this actor
        const pathsThroughActor = paths.filter(path =>
          path.includes(actor.id)
        ).length;

        // Add to centrality score
        const contribution = pathsThroughActor / paths.length;
        centrality.set(
          actor.id,
          (centrality.get(actor.id) || 0) + contribution
        );
      });
    }
  }

  // Normalize
  const maxCentrality = Math.max(...Array.from(centrality.values()));
  if (maxCentrality > 0) {
    centrality.forEach((value, key) => {
      centrality.set(key, value / maxCentrality);
    });
  }

  return centrality;
}

/**
 * Detect communities using modularity optimization
 */
function detectCommunities(
  actors: Actor[],
  connections: Connection[]
): Community[] {
  const clusters = detectClusters(actors, connections);

  // Convert clusters to communities with additional metadata
  return clusters.map(cluster => {
    const members = cluster.actors.map(id =>
      actors.find(a => a.id === id)!
    );

    // Infer community type from member categories
    const categories = members.map(m => m.category);
    const dominantCategory = mode(categories);

    let type: Community['type'] = 'media_ecosystem';
    if (dominantCategory === 'expert') type = 'expert_network';
    if (dominantCategory === 'lobby') type = 'lobby_coalition';

    // Calculate cohesion (density of internal connections)
    const internalConnections = connections.filter(c =>
      cluster.actors.includes(c.sourceId) &&
      cluster.actors.includes(c.targetId)
    ).length;

    const maxPossibleConnections = (cluster.actors.length * (cluster.actors.length - 1)) / 2;
    const cohesion = internalConnections / maxPossibleConnections;

    return {
      id: cluster.id,
      type,
      members: cluster.actors,
      cohesion,
    };
  });
}

/**
 * New ability: Bridge Attack
 * Target a bottleneck actor to damage entire communities
 */
export function calculateBridgeAttackEffect(
  targetActor: Actor,
  actors: Actor[],
  connections: Connection[]
): { affectedActors: Actor[], effectMultiplier: number } {
  if (!targetActor.isBottleneck) {
    return { affectedActors: [], effectMultiplier: 1.0 };
  }

  // Find communities this bottleneck connects
  const communities = detectCommunities(actors, connections);
  const connectedCommunities = communities.filter(c =>
    c.members.includes(targetActor.id) ||
    connections.some(conn =>
      (conn.sourceId === targetActor.id && c.members.includes(conn.targetId)) ||
      (conn.targetId === targetActor.id && c.members.includes(conn.sourceId))
    )
  );

  // Attacking a bottleneck affects all connected communities
  const affectedActors = connectedCommunities.flatMap(c =>
    c.members.map(id => actors.find(a => a.id === id)!)
  );

  // Effect multiplier based on centrality
  const multiplier = 1.0 + (targetActor.centrality || 0) * 2.0;

  return { affectedActors, effectMultiplier: multiplier };
}
```

### 4.3 Actor AI & Reactions

**File:** `src/game-logic/ActorAI.ts` (NEW)

```typescript
/**
 * Actor AI: Actors react to player actions
 */

export class ActorAI {
  /**
   * Execute AI behaviors for all actors
   */
  executeActorBehaviors(
    actors: Actor[],
    playerActions: AbilityUsage[],
    currentRound: number
  ): ActorReaction[] {
    const reactions: ActorReaction[] = [];

    for (const actor of actors) {
      if (!actor.behavior) continue;

      // Check if actor should react
      const reaction = this.evaluateReaction(actor, playerActions, currentRound);
      if (reaction) {
        reactions.push(reaction);
      }
    }

    return reactions;
  }

  private evaluateReaction(
    actor: Actor,
    playerActions: AbilityUsage[],
    round: number
  ): ActorReaction | null {
    // Check if actor was recently attacked
    const recentAttacks = playerActions.filter(action =>
      action.targetIds.includes(actor.id) &&
      round - action.round <= 2
    );

    if (recentAttacks.length === 0) return null;

    // Increase awareness
    actor.awareness = Math.min(1.0, actor.awareness + 0.1 * recentAttacks.length);

    // Check if threshold reached
    if (actor.trust < actor.behavior.triggerThreshold || actor.awareness > 0.6) {
      return this.generateReaction(actor, recentAttacks);
    }

    return null;
  }

  private generateReaction(
    actor: Actor,
    attacks: AbilityUsage[]
  ): ActorReaction {
    switch (actor.behavior!.type) {
      case 'defensive':
        return this.generateDefensiveReaction(actor);

      case 'aggressive':
        return this.generateAggressiveReaction(actor, attacks);

      default:
        return this.generatePassiveReaction(actor);
    }
  }

  private generateDefensiveReaction(actor: Actor): ActorReaction {
    // Defensive actors try to restore trust and increase resilience
    return {
      actorId: actor.id,
      type: 'defensive',
      action: 'self_heal',
      effects: [
        { type: 'trust_delta', target: actor.id, value: 0.1 },
        { type: 'resilience_delta', target: actor.id, value: 0.05 },
      ],
      message: `${actor.name} publishes fact-check and restores credibility`,
    };
  }

  private generateAggressiveReaction(
    actor: Actor,
    attacks: AbilityUsage[]
  ): ActorReaction {
    // Aggressive actors counter-attack player's strategy
    // Find most used player tactic
    const tacticCounts = new Map<string, number>();
    attacks.forEach(attack => {
      const count = tacticCounts.get(attack.abilityId) || 0;
      tacticCounts.set(attack.abilityId, count + 1);
    });

    const mostUsedTactic = Array.from(tacticCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      actorId: actor.id,
      type: 'aggressive',
      action: 'counter_tactic',
      targetTactic: mostUsedTactic,
      effects: [
        { type: 'ability_weakened', abilityId: mostUsedTactic, value: 0.3 },
      ],
      message: `${actor.name} exposes manipulation tactic, weakening future use`,
    };
  }

  private generatePassiveReaction(actor: Actor): ActorReaction {
    // Passive actors just increase awareness and resilience
    return {
      actorId: actor.id,
      type: 'passive',
      action: 'increase_awareness',
      effects: [
        { type: 'resilience_delta', target: actor.id, value: 0.03 },
      ],
      message: `${actor.name} becomes more cautious`,
    };
  }
}

interface ActorReaction {
  actorId: string;
  type: 'defensive' | 'aggressive' | 'passive';
  action: string;
  targetTactic?: string;
  effects: any[];
  message: string;
}

interface AbilityUsage {
  abilityId: string;
  sourceId: string;
  targetIds: string[];
  round: number;
}
```

### 4.4 Advanced Event System

**File:** `data/game/events-advanced.json` (NEW)

```json
[
  {
    "id": "whistleblower_choice",
    "name": "Whistleblower Threat",
    "description": "A whistleblower threatens to expose your operation",
    "triggerType": "conditional",
    "condition": "detectionRisk > 0.6 && round > 10",
    "playerChoice": [
      {
        "text": "Pay them off (50 Money)",
        "cost": { "money": 50 },
        "effects": [
          { "type": "detection_delta", "value": -0.2 }
        ],
        "consequence": "Threat neutralized, but expensive"
      },
      {
        "text": "Discredit them publicly",
        "cost": { "attention": 20 },
        "effects": [
          { "type": "trust_delta", "target": "random", "value": -0.15 },
          { "type": "detection_delta", "value": 0.1 }
        ],
        "consequence": "Whistleblower silenced, but risky"
      },
      {
        "text": "Ignore the threat",
        "cost": {},
        "effects": [
          { "type": "random_leak", "probability": 0.5 }
        ],
        "consequence": "Might leak, might not..."
      }
    ],
    "newsTickerText": "Insider threatens to expose disinformation campaign",
    "iconType": "alert-triangle"
  },
  {
    "id": "media_consolidation",
    "name": "Media Consolidation",
    "description": "Two media actors merge, creating new opportunities",
    "triggerType": "conditional",
    "condition": "round % 8 === 0 && round > 8",
    "effects": [
      {
        "type": "merge_actors",
        "targets": ["random_media_1", "random_media_2"],
        "result": {
          "trust": "average",
          "reach": "combined",
          "resilience": "average"
        }
      }
    ],
    "chainTo": "media_monopoly_concerns",
    "newsTickerText": "Major media merger creates new powerhouse",
    "iconType": "merge"
  },
  {
    "id": "platform_algorithm_change",
    "name": "Platform Algorithm Change",
    "description": "Social media platforms change their algorithms",
    "triggerType": "random",
    "probability": 0.1,
    "effects": [
      {
        "type": "modify_ability",
        "abilityId": "viral_story",
        "modifier": { "effectiveness": 0.7, "duration": 5 }
      },
      {
        "type": "modify_ability",
        "abilityId": "trending_topic",
        "modifier": { "effectiveness": 1.3, "duration": 5 }
      }
    ],
    "newsTickerText": "Platform updates algorithm: viral strategies less effective",
    "iconType": "code"
  },
  {
    "id": "regulatory_investigation",
    "name": "Regulatory Investigation",
    "description": "Authorities launch investigation into disinformation",
    "triggerType": "conditional",
    "condition": "detectionRisk > 0.75",
    "effects": [
      {
        "type": "spawn_defensive",
        "value": "regulatory"
      },
      {
        "type": "increase_all_costs",
        "multiplier": 1.5,
        "duration": 3
      }
    ],
    "chainTo": "investigation_outcome",
    "newsTickerText": "BREAKING: Regulatory body announces disinformation probe",
    "iconType": "shield-alert"
  }
]
```

**File:** `src/game-logic/AdvancedEventSystem.ts` (NEW)

```typescript
/**
 * Advanced event system with chains, player choices, dynamic triggers
 */

export class AdvancedEventSystem {
  private eventChains: Map<string, string[]> = new Map();

  /**
   * Trigger event with player choice
   */
  async triggerPlayerChoiceEvent(
    event: ConditionalEvent,
    onChoice: (choice: EventChoice) => void
  ): Promise<void> {
    // Show modal to player with choices
    const choice = await this.showEventChoiceModal(event);

    // Apply chosen effects
    onChoice(choice);

    // Chain to next event if specified
    if (event.chainTo) {
      this.scheduleChainedEvent(event.chainTo, 2); // Trigger in 2 rounds
    }
  }

  /**
   * Check if conditions met for conditional events
   */
  evaluateAdvancedConditions(
    event: ConditionalEvent,
    state: GameState
  ): boolean {
    const condition = event.condition || '';

    // Parse and evaluate condition string
    // Support: detectionRisk, round, trust levels, actor states, etc.

    // Example conditions:
    // "detectionRisk > 0.6 && round > 10"
    // "averageTrust < 0.3 || polarizationIndex > 0.8"
    // "actor.bild_tabloid.trust < 0.2"

    try {
      // Create safe evaluation context
      const context = {
        detectionRisk: state.detectionRisk,
        round: state.round,
        averageTrust: state.network.averageTrust,
        polarizationIndex: state.network.polarizationIndex,
        actors: state.network.actors,
        // Helper functions
        hasActor: (id: string) => state.network.actors.some(a => a.id === id),
        getActorTrust: (id: string) => {
          const actor = state.network.actors.find(a => a.id === id);
          return actor?.trust || 0;
        },
      };

      // Safe eval (in production, use proper parser)
      return this.safeEval(condition, context);
    } catch (e) {
      console.error('Error evaluating event condition:', e);
      return false;
    }
  }

  private safeEval(condition: string, context: any): boolean {
    // Simplified safe evaluation
    // In production, use a proper expression parser library

    // Replace variable names with context values
    let evaluated = condition;

    Object.entries(context).forEach(([key, value]) => {
      if (typeof value === 'number') {
        evaluated = evaluated.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value));
      }
    });

    // Evaluate
    return Function(`"use strict"; return (${evaluated})`)();
  }
}
```

---

## Phase 5: Performance & Polish

### 5.1 Performance Optimization

**File:** `src/utils/performance/renderer.ts` (NEW)

```typescript
/**
 * Optimized rendering for 60+ actors
 */

export class OptimizedRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private spatialIndex: SpatialIndex;
  private visibleActors: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.spatialIndex = new SpatialIndex(canvas.width, canvas.height);
  }

  /**
   * Render only visible actors (culling)
   */
  render(actors: Actor[], viewport: Viewport): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Determine visible actors based on viewport
    this.updateVisibleActors(actors, viewport);

    // Render in batches by tier (for opacity optimization)
    const tier1 = actors.filter(a => a.tier === 1 && this.visibleActors.has(a.id));
    const tier2 = actors.filter(a => a.tier === 2 && this.visibleActors.has(a.id));
    const tier3 = actors.filter(a => a.tier === 3 && this.visibleActors.has(a.id));

    // Render back to front (tier 3 → 1) for proper layering
    this.renderActorBatch(tier3, 0.7);
    this.renderActorBatch(tier2, 0.85);
    this.renderActorBatch(tier1, 1.0);
  }

  private updateVisibleActors(actors: Actor[], viewport: Viewport): void {
    this.visibleActors.clear();

    // Get actors in viewport using spatial index
    const visible = this.spatialIndex.getNearby(
      viewport.center,
      viewport.radius
    );

    visible.forEach(actor => {
      // Additional LOD check based on zoom
      if (this.shouldRender(actor, viewport.zoom)) {
        this.visibleActors.add(actor.id);
      }
    });
  }

  private shouldRender(actor: Actor, zoom: number): boolean {
    if (actor.tier === 1) return true;
    if (actor.tier === 2) return zoom > 0.8;
    if (actor.tier === 3) return zoom > 1.2;
    return false;
  }

  private renderActorBatch(actors: Actor[], opacity: number): void {
    this.ctx.globalAlpha = opacity;

    actors.forEach(actor => {
      this.renderActor(actor);
    });

    this.ctx.globalAlpha = 1.0;
  }

  private renderActor(actor: Actor): void {
    // Optimized actor rendering
    // Use cached paths, avoid creating new objects in render loop
    // ...
  }
}

interface Viewport {
  center: Position;
  radius: number;
  zoom: number;
}
```

### 5.2 Balance Configuration

**File:** `data/game/balance-config.json` (NEW)

```json
{
  "version": "2.0",
  "actorCount": 58,
  "victoryConditions": {
    "primary": {
      "type": "trust_collapse",
      "threshold": 0.65,
      "trustLevel": 0.40,
      "description": "65% of actors below 40% trust"
    },
    "alternatives": [
      {
        "type": "media_capture",
        "threshold": 0.80,
        "category": "media",
        "trustLevel": 0.30,
        "description": "Control 80% of media (below 30% trust)"
      },
      {
        "type": "expert_corruption",
        "threshold": 1.0,
        "category": "expert",
        "trustLevel": 0.35,
        "description": "All experts corrupted (below 35% trust)"
      },
      {
        "type": "infrastructure_dominance",
        "requiresInfrastructure": 100,
        "requiresLowTrust": 0.50,
        "description": "100 infrastructure + 50% actors compromised"
      }
    ]
  },
  "defeatConditions": {
    "exposure": {
      "threshold": 0.85,
      "warningAt": 0.70
    },
    "timeout": {
      "maxRounds": 40
    },
    "defensiveVictory": {
      "averageTrust": 0.70,
      "minDefensiveActors": 3
    }
  },
  "resourceEconomy": {
    "startingMoney": 150,
    "moneyPerRound": 25,
    "attentionDecay": 0.12,
    "infrastructureBonus": 0.08
  },
  "difficultyScaling": {
    "defensiveSpawnRounds": [8, 14, 20, 26],
    "maxDefensiveActors": 5,
    "eventProbabilityIncrease": 0.05
  }
}
```

### 5.3 Tutorial Updates

**File:** `src/game-logic/types/tutorial.ts` (UPDATE)

Add new tutorial steps for new features:

```typescript
const NEW_TUTORIAL_STEPS = [
  // ... existing steps

  {
    id: 'learn_combos',
    title: 'Ability Combos',
    content: 'Chain abilities together for powerful combo effects! Watch for combo notifications.',
    trigger: 'round_5',
    highlight: 'combo_tracker',
  },
  {
    id: 'understand_bottlenecks',
    title: 'Network Bottlenecks',
    content: 'Some actors bridge different communities. Attacking them affects many others!',
    trigger: 'bottleneck_detected',
    highlight: 'bottleneck_actor',
  },
  {
    id: 'actor_reactions',
    title: 'Actor AI',
    content: 'Actors now react to your actions! They can increase resilience or counter your tactics.',
    trigger: 'first_reaction',
    highlight: 'actor_panel',
  },
  {
    id: 'filter_search',
    title: 'Filter & Search',
    content: 'Use filters to focus on specific actor types or trust levels. Search by name to find actors quickly.',
    trigger: 'round_3',
    highlight: 'filter_panel',
  },
];
```

---

## Implementation Order & Dependencies

```
1. Foundation (No dependencies)
   └─> Type System
   └─> Auto-Connection Algorithm
   └─> Spatial Indexing
   └─> Visual Hierarchy

2. UX Layer (Depends on: Foundation)
   └─> Filter UI
   └─> Search Component
   └─> Cluster Visualization

3. Actor Expansion (Depends on: Foundation, UX)
   └─> Actor Definitions (JSON)
   └─> Force Layout
   └─> Balance Adjustments

4. Enhanced Mechanics (Depends on: Expansion)
   └─> Combo System
   └─> Network Topology
   └─> Actor AI
   └─> Advanced Events

5. Polish (Depends on: Everything)
   └─> Performance Optimization
   └─> Tutorial Updates
   └─> Balance Testing
```

---

## Testing Strategy

### Unit Tests
- Connection algorithm correctness
- Spatial index performance
- Combo detection logic
- Event condition evaluation

### Integration Tests
- 60 actors loading and rendering
- Filter + Search functionality
- Combo system with real abilities
- AI reactions triggering correctly

### Performance Tests
- Render 60 actors at 60fps
- Connection calculation < 100ms
- Spatial queries < 1ms
- Memory usage < 200MB

### Balance Tests
- Victory achievable in 20-35 rounds
- All victory conditions viable
- Defensive actors provide challenge
- No dominant strategy

---

## Success Metrics

### Technical
- ✅ 60+ actors supported
- ✅ 60fps rendering maintained
- ✅ < 2s initial load time
- ✅ Smooth zoom/pan interactions

### Gameplay
- ✅ 5+ viable strategies to victory
- ✅ Combos used in 70%+ of games
- ✅ Network topology affects gameplay
- ✅ Actor AI creates dynamic challenge

### UX
- ✅ Players can find any actor in < 10s
- ✅ No overwhelming feeling despite complexity
- ✅ Tutorial covers all new features
- ✅ Filters used actively by players

---

## Risk Mitigation

### Performance Risk
- **Risk:** 60 actors causes lag
- **Mitigation:** Spatial indexing, LOD, culling, profiling
- **Fallback:** Reduce to 45 actors if needed

### Complexity Risk
- **Risk:** Too complex for players
- **Mitigation:** Tiered visibility, filters, search, tutorial
- **Fallback:** Optional "simple mode" with aggregated actors

### Balance Risk
- **Risk:** Hard to balance 60 actors
- **Mitigation:** Data-driven balance config, extensive playtesting
- **Fallback:** Community-driven balance patches

### Development Risk
- **Risk:** Scope too large
- **Mitigation:** Phased approach, each phase independently testable
- **Fallback:** Ship Phase 1-3, delay Phase 4-5

---

## Post-Launch Roadmap

### v2.1 - Community Features
- Seed sharing (play same network as others)
- Leaderboards per victory type
- Replay system

### v2.2 - Content Expansion
- More actors (international media)
- More combos
- Scenario mode (historical events)

### v2.3 - Advanced AI
- Machine learning opponent
- Adaptive difficulty
- Personality-based AI

---

## Conclusion

This roadmap transforms the game from 16 actors to 58+ with sophisticated mechanics while maintaining excellent UX. The key is the foundation layer (Phase 1-2) which enables scalability, followed by content expansion (Phase 3) and enhanced mechanics (Phase 4).

**Estimated total effort:** All phases can be completed in sequence with proper tooling and testing.

**Expected outcome:** A deep, replayable, educational game about disinformation that scales to realistic network sizes while remaining playable and performant.
