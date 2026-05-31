# NPC Advisor System - Comprehensive Design Document

**Version:** 1.0
**Date:** 2025-01-12
**Status:** Implementation Ready
**Sprint:** Sprint 1 - Core Advisor System (Week 1-2)

---

## 📋 Executive Summary

This document captures the complete design for the NPC Advisor System, addressing critical UX issues identified in the Story Mode review:

**Problems Solved:**
1. ❌ NPCs are passive data stores → ✅ NPCs become active advisors
2. ❌ Actions give abstract results → ✅ Actions show concrete, specific outputs
3. ❌ Terminal closes immediately → ✅ Queue system allows planning multiple actions
4. ❌ World Events isolated → ✅ Events trigger NPC recommendations
5. ❌ No guidance system → ✅ Context-aware recommendations guide player

**Core Principle:** Make the existing complexity VISIBLE and ENGAGING through NPC personalities.

---

## 🎯 Design Goals

### Primary Goal
**"NPCs sollen den Spielverlauf spannender machen, damit die Komplexität des Spiels besser zur Geltung kommt."**

### Success Metrics
- [ ] NPCs provide contextually relevant recommendations every phase
- [ ] Player understands WHY recommendations are made (transparency)
- [ ] Different NPCs give different perspectives (personality-driven)
- [ ] Player feels guided but not railroaded
- [ ] Complex game systems become understandable through NPC explanations

---

## 🧠 Expert Panel Insights

### Dr. Sarah Chen (Narrative Design)
**Key Insight:** "NPCs must have **narrative agency** - they should be active participants, not passive info booths."

**Implementation:**
- NPCs proactively analyze game state
- NPCs comment on player decisions (praise, concern, warnings)
- NPCs remember past interactions (relationship affects advice tone)
- Each NPC has distinct voice and priorities

**Example:**
```
Marina [Relationship: Trusted, Recent: Player used her recommended action]
"Ihre Botfarm läuft perfekt! Sehen Sie das? Trust bei Tagesschau -5%.
Genau wie ich es vorhergesagt habe. Jetzt sollten wir nachlegen -
ich habe drei Follow-up-Kampagnen vorbereitet..."
```

### Marcus Weber (Systems Designer)
**Key Insight:** "Every system must SPEAK to every other system. NPCs are the translators."

**Implementation:**
- World Events → NPC Analysis → Action Recommendations
- Player Action → Effects → NPC Reactions → New Opportunities
- Resource Changes → NPC Warnings/Encouragements
- Game State Thresholds → NPC Strategic Advice

**Feedback Loop:**
```
World Event (Blackout)
  → Marina analyzes: "Crisis opportunity!"
    → Recommends 3 specific actions
      → Player executes one
        → Marina reacts: "Gut gemacht! Trust sank um 8%"
          → New follow-up actions unlocked
            → Cycle continues...
```

### Prof. Anna Kovalenko (Educational Design)
**Key Insight:** "Serious games need **immediate, specific feedback**. Abstract numbers teach nothing."

**Implementation:**
- Every action shows WHAT happened (concrete results)
- NPCs explain WHY it happened (educational context)
- Players see HOW to improve (suggested next steps)

**Example: "Zielgruppenanalyse" Result**
```
WHAT: 3 target groups identified with specific demographics
WHY: Marina explains vulnerabilities and platform habits
HOW: Marina suggests which group to target first and why
```

### Thomas Becker (UX Designer)
**Key Insight:** "Information hierarchy is everything. Player must know: What's important NOW?"

**Implementation:**
- Priority system: Critical (🔴) > High (🟡) > Medium (🟢) > Low (⚪)
- Visual hierarchy: Important NPCs pulse/glow
- Persistent visibility: Advisor panel always accessible
- Clear call-to-action: "Marina empfiehlt: [Action XYZ]"

### Elena Rodriguez (Player Psychology)
**Key Insight:** "No perceived impact = no engagement. Players need dopamine hits."

**Implementation:**
- Immediate visual feedback on action execution
- NPC reactions as social reward
- Progress visualization (trust charts, reach growth)
- Achievement unlocks (new actions, NPC trust levels)

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STORY GAME STATE                         │
│  (Phase, Resources, NPCs, Actions, Events, Objectives)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NPC ADVISOR ENGINE                           │
│  • Analyzes game state every phase                             │
│  • Each NPC generates recommendations based on expertise       │
│  • Recommendations prioritized and sorted                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ADVISOR PANEL UI                            │
│  • Displays NPCs with priority indicators                      │
│  • Shows preview of top recommendation                         │
│  • Opens detail modal on click                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION PANEL UI                              │
│  • Highlights recommended actions                              │
│  • Shows NPC endorsement badges                                │
│  • Enables action queueing                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```typescript
// Phase Start
GameState → NPCAdvisorEngine.generateRecommendations()
  → AdvisorRecommendation[]
    → AdvisorPanel renders with priority indicators
      → Player clicks NPC
        → AdvisorDetailModal shows all recommendations
          → Player clicks suggested action
            → ActionPanel opens with action highlighted
              → Player queues actions
                → Player executes queue
                  → ActionResultScreen shows detailed results
                    → NPCs react to results
                      → New recommendations generated
                        → Cycle repeats
```

---

## 👥 NPC Analysis Specifications

Each NPC analyzes the game state from their expertise perspective.

### 1. MARINA PETROVA (Media Specialist)

**Expertise Areas:** Media, Content Creation, Social Engineering, Amplification

**Analysis Patterns:**

#### A) Opportunity Detection: Active World Events
```typescript
if (activeWorldEvents.some(e => e.type === 'crisis' || e.type === 'political')) {
  recommendation = {
    priority: 'high',
    category: 'opportunity',
    message: `Der ${event.name} ist perfekt für eine Kampagne. Wir müssen JETZT zuschlagen!`,
    reasoning: `Crisis events create emotional vulnerability. Strike while public is confused.`,
    suggestedActions: findRelevantActions(event.tags, ['media', 'content', 'amplification']),
    expiresPhase: currentPhase + 3 // Time-sensitive!
  }
}
```

**Example Events Marina Cares About:**
- Political scandals
- Economic crises
- Natural disasters
- Social unrest
- Infrastructure failures

#### B) Efficiency Analysis: Reach Stagnation
```typescript
const reachHistory = metrics.reachHistory.slice(-3);
const growthRate = calculateGrowth(reachHistory);

if (growthRate < 10) { // Less than 10% growth in 3 phases
  recommendation = {
    priority: 'medium',
    category: 'efficiency',
    message: `Unsere Reichweite stagniert bei ${currentReach}M. Ich schlage vor: Botfarm ausbauen oder neue Plattformen erschließen.`,
    reasoning: `Reach growth: ${growthRate}% (Target: >10%). Amplification infrastructure needed.`,
    suggestedActions: ['ta04_social_bots', 'ta05_influencer_network', 'ta04_platform_expansion']
  }
}
```

#### C) Strategy Warning: Unused Analysis
```typescript
if (completedActions.includes('ta01_target_analysis') &&
    !completedActions.some(a => a.startsWith('ta03_campaign_'))) {

  const analysisPhase = findActionPhase('ta01_target_analysis');
  const phasesSince = currentPhase - analysisPhase;

  recommendation = {
    priority: phasesSince > 5 ? 'critical' : 'high',
    category: 'strategy',
    message: `Sie haben Zielgruppen analysiert, aber noch keine Kampagne gestartet. Die Daten veralten! (${phasesSince} Phasen her)`,
    reasoning: `Analysis without execution is wasted resources. Target groups identified but not exploited.`,
    suggestedActions: getTargetGroupCampaigns(gameState)
  }
}
```

#### D) Content Strategy: Media Landscape Analysis
```typescript
// Marina tracks which media actors have low trust
const vulnerableMedia = actors.filter(a =>
  a.category === 'media' && a.trust < 0.5
);

if (vulnerableMedia.length > 3) {
  recommendation = {
    priority: 'medium',
    category: 'opportunity',
    message: `${vulnerableMedia.length} Medienakteure sind geschwächt. Zeit für eine koordinierte Desinformationskampagne.`,
    reasoning: `When mainstream media trust is low, alternative narratives gain traction easier.`,
    suggestedActions: ['ta03_media_manipulation', 'ta05_amplify_alternative_media']
  }
}
```

**Marina's Personality in Recommendations:**
- Ambitious: Always wants to go bigger, reach further
- Creative: Suggests unexpected angles and narratives
- Confident: Sometimes overconfident, may underestimate risks
- Competitive: Wants to outperform other NPCs' suggestions

---

### 2. ALEXEI PETROV (Technical Lead)

**Expertise Areas:** Technical Infrastructure, Security, Bot Networks, Risk Management

**Analysis Patterns:**

#### A) Critical Alert: High Risk
```typescript
if (resources.risk > 70) {
  recommendation = {
    priority: 'critical',
    category: 'threat',
    message: `⚠️ WARNUNG: Risiko bei ${resources.risk}%. Empfehle SOFORTIGE Sicherheitsmaßnahmen!`,
    reasoning: `Risk threshold critical (>70%). Detection likely in ${estimatePhasesUntilDetection(resources.risk)} phases. Operation compromise imminent.`,
    suggestedActions: ['ta08_cover_tracks', 'ta08_false_flag', 'ta02_security_upgrade'],
    tone: 'urgent'
  }
}
```

#### B) Infrastructure Warning: Insufficient Capacity
```typescript
const infrastructureLevel = calculateInfrastructureLevel(gameState);
const nextPhaseComplexity = estimateNextPhaseComplexity(gameState.storyPhase);

if (infrastructureLevel < nextPhaseComplexity) {
  recommendation = {
    priority: 'high',
    category: 'efficiency',
    message: `Ihre Infrastruktur ist unzureichend (Level ${infrastructureLevel}/${nextPhaseComplexity}). Aktionen werden teurer und risikoreicher.`,
    reasoning: `Inadequate infrastructure increases costs by ~30% and risk by ~20%. Investment now saves resources later.`,
    suggestedActions: ['ta02_server_network', 'ta02_encryption', 'ta02_proxy_infrastructure']
  }
}
```

#### C) Threat Detection: Recent Countermeasures
```typescript
const recentCountermeasures = newsEvents.filter(e =>
  e.type === 'countermeasure' &&
  e.phase >= currentPhase - 2
);

if (recentCountermeasures.length > 0) {
  recommendation = {
    priority: 'high',
    category: 'threat',
    message: `Gegner hat ${recentCountermeasures.length} Countermeasures aktiviert: ${recentCountermeasures.map(c => c.headline_de).join(', ')}. Wir müssen unsere Taktik anpassen.`,
    reasoning: `Defensive actors are reacting. Current attack vectors may be compromised. Pivot required.`,
    suggestedActions: ['ta08_change_infrastructure', 'ta08_false_flag', 'ta02_encryption_upgrade']
  }
}
```

#### D) Proactive Security: Risk Trending
```typescript
const riskHistory = metrics.riskHistory.slice(-5);
const riskTrend = calculateTrend(riskHistory);

if (riskTrend > 5) { // Risk increasing by >5% per phase
  recommendation = {
    priority: 'medium',
    category: 'threat',
    message: `Risiko steigt kontinuierlich (+${riskTrend.toFixed(1)}% pro Phase). Präventive Maßnahmen empfohlen, bevor es kritisch wird.`,
    reasoning: `Rising risk trend detected. Early intervention cheaper than emergency response.`,
    suggestedActions: ['ta02_security_review', 'ta08_operational_security']
  }
}
```

**Alexei's Personality in Recommendations:**
- Paranoid: Always assumes worst-case scenarios
- Perfectionist: Wants redundant systems and backups
- Technical: Explains in technical terms, may be too detailed
- Cautious: Often advises slowing down for security

---

### 3. IGOR SMIRNOV (Financial Analyst)

**Expertise Areas:** Finance, Money Laundering, Economic Warfare, ROI Analysis

**Analysis Patterns:**

#### A) Critical Alert: Low Budget
```typescript
const budgetPercentage = (resources.budget / resources.maxBudget) * 100;

if (budgetPercentage < 30) {
  recommendation = {
    priority: 'high',
    category: 'threat',
    message: `Budget kritisch niedrig: ${resources.budget}k von ${resources.maxBudget}k (${budgetPercentage.toFixed(0)}%). Priorisieren Sie kostengünstige Aktionen oder warten Sie auf nächste Phase.`,
    reasoning: `Insufficient funds for high-impact operations. Risk of operational paralysis.`,
    suggestedActions: getCheapActions(gameState.availableActions)
  }
}
```

#### B) Efficiency Analysis: Low ROI Actions
```typescript
// Igor tracks cost-effectiveness of each action
const recentActions = actionHistory.slice(-5);
const lowROIActions = recentActions.filter(a => {
  const cost = a.costs.budget || 0;
  const impact = a.effects.trustImpact || 0;
  const roi = Math.abs(impact) / cost;
  return roi < 0.1; // Less than 0.1 trust impact per 10k budget
});

if (lowROIActions.length > 2) {
  recommendation = {
    priority: 'medium',
    category: 'efficiency',
    message: `Diese Aktionen waren ineffizient: ${lowROIActions.map(a => a.label_de).join(', ')}. ROI zu niedrig. Ich empfehle alternative Ansätze.`,
    reasoning: `ROI analysis: Average impact ${avgROI.toFixed(2)} per 10k budget. Target: >0.15. Recommend higher-leverage actions.`,
    suggestedActions: getHighROIAlternatives(gameState, lowROIActions)
  }
}
```

#### C) Strategic Opportunity: Front Companies
```typescript
if (!completedActions.includes('ta05_establish_front') && currentPhase > 20) {

  const potentialSavings = calculateFrontCompanySavings(gameState);

  recommendation = {
    priority: 'medium',
    category: 'strategy',
    message: `Sie sollten Tarnfirmen etablieren. Das reduziert langfristig Kosten um ~15% und Risiko um ~10%.`,
    reasoning: `Front companies not established after phase 20. Estimated savings: ${potentialSavings}k over next 20 phases.`,
    suggestedActions: ['ta05_establish_front', 'ta05_shell_companies']
  }
}
```

#### D) Budget Planning: Upcoming Expensive Phase
```typescript
const nextPhaseActions = getActionsForPhase(storyPhase.next);
const avgCost = calculateAverageCost(nextPhaseActions);

if (resources.budget < avgCost * 3) {
  recommendation = {
    priority: 'medium',
    category: 'strategy',
    message: `Nächste Phase wird teuer (Ø ${avgCost}k pro Aktion). Aktuelles Budget: ${resources.budget}k. Sparen Sie jetzt oder fokussieren Sie auf Budget-Generierung.`,
    reasoning: `Phase ${storyPhase.next} operations require higher capital. Recommend conservative spending now.`,
    suggestedActions: ['ta05_fundraising', 'ta09_economic_leverage']
  }
}
```

**Igor's Personality in Recommendations:**
- Conservative: Always wants to save money
- Analytical: Backs everything with numbers and calculations
- Cautious: Warns against expensive risks
- Pragmatic: Focuses on cost-benefit, not creativity

---

### 4. KATJA ORLOVA (Field Operative)

**Expertise Areas:** Field Operations, Recruitment, Human Intelligence, Infiltration

**Analysis Patterns:**

#### A) Opportunity Detection: Recruitable Actors
```typescript
// Katja identifies vulnerable actors for recruitment
const recruitableActors = actors.filter(a =>
  a.trust < 0.4 && // Low trust = vulnerable
  a.influence > 0.6 && // High influence = valuable
  !a.isRecruited &&
  ['expert', 'media', 'lobby'].includes(a.category)
);

if (recruitableActors.length > 0) {
  recommendation = {
    priority: 'medium',
    category: 'opportunity',
    message: `Ich habe ${recruitableActors.length} potenzielle Kontakte identifiziert: ${recruitableActors.slice(0, 3).map(a => a.name).join(', ')}. Soll ich sie rekrutieren?`,
    reasoning: `Low trust + high influence = perfect targets. These actors can become our amplifiers.`,
    suggestedActions: ['ta01_recruit_local', 'ta06_infiltrate_media', 'ta06_infiltrate_expert']
  }
}
```

#### B) Strategy Warning: Neglected Field Operations
```typescript
const fieldActionsCount = completedActions.filter(a =>
  a.startsWith('ta01_recruit') ||
  a.startsWith('ta06_infiltrate')
).length;

if (fieldActionsCount < 2 && currentPhase > 30) {
  recommendation = {
    priority: 'medium',
    category: 'strategy',
    message: `Sie fokussieren zu stark auf digitale Operationen (nur ${fieldActionsCount} Feldaktionen). Reale Kontakte sind wichtig für Glaubwürdigkeit und Reichweite.`,
    reasoning: `Digital-only operations lack credibility. Human assets provide ground truth and legitimacy.`,
    suggestedActions: ['ta01_recruit_local', 'ta06_infiltrate_media', 'ta06_establish_agents']
  }
}
```

#### C) Threat Detection: Source Compromise
```typescript
// Katja tracks recruited agents' safety
const recruitedAgents = actors.filter(a => a.isRecruited);
const compromisedAgents = recruitedAgents.filter(a => a.suspicionLevel > 0.7);

if (compromisedAgents.length > 0) {
  recommendation = {
    priority: 'high',
    category: 'threat',
    message: `⚠️ ${compromisedAgents.length} unserer Kontakte stehen unter Verdacht: ${compromisedAgents.map(a => a.name).join(', ')}. Empfehle Kontaktabbruch oder Exfiltration.`,
    reasoning: `Agent compromise can expose entire network. Cut losses now or risk cascade failure.`,
    suggestedActions: ['ta08_burn_assets', 'ta08_exfiltrate_agent', 'ta08_false_flag']
  }
}
```

#### D) Tactical Opportunity: Event-Based Recruitment
```typescript
// Katja sees recruitment opportunities in crises
if (activeWorldEvents.some(e => e.type === 'political' || e.type === 'scandal')) {
  const event = activeWorldEvents.find(e => e.type === 'political' || e.type === 'scandal');

  recommendation = {
    priority: 'medium',
    category: 'opportunity',
    message: `Der ${event.name} schafft Unzufriedenheit. Perfekter Zeitpunkt für Rekrutierung - Menschen sind empfänglicher in Krisenzeiten.`,
    reasoning: `Crisis creates ideological vulnerability. Recruitment success rate +40% during instability.`,
    suggestedActions: ['ta01_recruit_disaffected', 'ta06_exploit_crisis'],
    expiresPhase: currentPhase + 2
  }
}
```

**Katja's Personality in Recommendations:**
- Pragmatic: Focuses on practical, actionable intelligence
- Protective: Cares about agent safety and operational security
- Risk-aware: Understands field work dangers, not reckless
- People-focused: Sees assets as people, not just tools

---

### 5. DIREKTOR VOLKOV (Strategic Oversight)

**Expertise Areas:** High-level Strategy, Political Leverage, Command, Pressure

**Analysis Patterns:**

#### A) Critical Alert: Objective Progress Too Slow
```typescript
const trustProgress = calculateObjectiveProgress(gameState, 'trust_reduction');
const phaseProgress = currentPhase / 120;

if (trustProgress < phaseProgress * 0.7) { // Behind schedule
  recommendation = {
    priority: 'critical',
    category: 'strategy',
    message: `Moskau ist unzufrieden. Wir sind bei ${(trustProgress * 100).toFixed(0)}% Zielerreichung, aber bereits ${(phaseProgress * 100).toFixed(0)}% der Zeit verbraucht. Radikalere Maßnahmen erforderlich.`,
    reasoning: `Trust reduction: ${(trustProgress * 100).toFixed(0)}% of goal. Time elapsed: ${(phaseProgress * 100).toFixed(0)}%. Efficiency ratio: ${(trustProgress/phaseProgress).toFixed(2)} (Target: >0.8). Escalation required.`,
    suggestedActions: getAggressiveActions(gameState)
  }
}
```

#### B) Strategy Warning: Inefficient Risk/Reward
```typescript
if (resources.risk > 60 && trustProgress < 0.2) {
  recommendation = {
    priority: 'high',
    category: 'strategy',
    message: `Sie gehen zu aggressiv vor (Risk: ${resources.risk}%) mit zu wenig Ergebnis (Progress: ${(trustProgress * 100).toFixed(0)}%). Balance ist wichtig - hohes Risiko muss sich lohnen.`,
    reasoning: `High risk (${resources.risk}%) but low progress (${(trustProgress * 100).toFixed(0)}%). Inefficient. Either reduce risk or increase impact.`,
    suggestedActions: getBalancedActions(gameState)
  }
}
```

#### C) Threat Detection: NPC Morale Crisis
```typescript
const lowMoraleNPCs = npcs.filter(n => n.morale < 40);

if (lowMoraleNPCs.length > 0) {
  recommendation = {
    priority: 'high',
    category: 'threat',
    message: `${lowMoraleNPCs.map(n => n.name).join(' und ')} haben niedrige Moral. Das gefährdet die Operation. Sprechen Sie mit ihnen oder reduzieren Sie die moralische Belastung.`,
    reasoning: `Low morale NPCs: ${lowMoraleNPCs.length}. Potential defection risk. Operation security compromised if NPCs break.`,
    suggestedActions: ['interact_with_npc', 'ta01_reduce_moral_weight']
  }
}
```

#### D) Strategic Review: Phase Milestones
```typescript
// Director reviews progress at key phases (20, 40, 60, 80, 100)
if ([20, 40, 60, 80, 100].includes(currentPhase)) {

  const assessment = assessOverallStrategy(gameState);

  recommendation = {
    priority: 'high',
    category: 'strategy',
    message: assessment.summary,
    reasoning: assessment.detailed,
    suggestedActions: assessment.recommendations
  }
}

// Example for Phase 40:
{
  summary: "Halbzeit. Trust-Reduktion bei 35%, Risiko bei 45%. Moskau ist... zufrieden. Aber die zweite Hälfte wird härter - Verteidiger werden aktiver.",
  detailed: "Progress adequate but defensive countermeasures increasing. Recommend diversifying tactics and strengthening infrastructure before escalation phase.",
  recommendations: ['ta02_infrastructure_upgrade', 'ta06_political_leverage', 'ta08_operational_security']
}
```

#### E) Meta-Strategic: NPC Conflicts
```typescript
// Director notices when NPCs give conflicting advice
const conflictingRecommendations = detectNPCConflicts(recommendations);

if (conflictingRecommendations.length > 0) {
  recommendation = {
    priority: 'medium',
    category: 'strategy',
    message: `Ihre Berater sind sich uneinig. ${conflictingRecommendations[0].npc1} schlägt ${conflictingRecommendations[0].action1} vor, ${conflictingRecommendations[0].npc2} sagt ${conflictingRecommendations[0].action2}. Meine Meinung: ${directorOpinion}`,
    reasoning: `Conflicting priorities detected. As Director, I prioritize: ${directorPriority}`,
    suggestedActions: [directorChoice]
  }
}
```

**Direktor's Personality in Recommendations:**
- Authoritative: Commands, doesn't suggest
- Strategic: Sees big picture, long-term consequences
- Demanding: High expectations, impatient with failure
- Political: Reminds player of Moscow's expectations

---

## 🎨 UI/UX Specifications

### Advisor Panel Component

**Location:** Fixed right side of screen, always visible (collapsible)

**Visual Hierarchy:**
```
┌────────────────────────────────────────┐
│  ADVISORS                          [−] │ ← Header (collapsible)
├────────────────────────────────────────┤
│                                        │
│  🔴 MARINA [2]                         │ ← Critical priority (red pulse)
│  "Der Nordmark-Blackout ist unsere    │ ← Preview of top recommendation
│   Chance. Schlage JETZT zu!"          │
│   → 3 Empfehlungen ansehen            │ ← Click to open modal
│   [████████░░] Morale: 85%            │ ← Morale bar
│                                        │
│  🟡 IGOR [1]                           │ ← High priority (yellow)
│  "Budget wird knapp. Plane voraus."   │
│   → 1 Empfehlung ansehen              │
│   [██████░░░░] Morale: 60%            │
│                                        │
│  🟢 DIREKTOR                           │ ← Medium priority (green)
│  "Fortschritt akzeptabel."            │
│   → Lagebesprechung                   │
│   [███████░░░] Morale: 75%            │
│                                        │
│  ⚪ ALEXEI                             │ ← No recommendations (gray)
│  "Keine dringenden Themen."           │
│   [████████░░] Morale: 80%            │
│                                        │
│  ⚪ KATJA                              │
│  "Operationen laufen planmäßig."      │
│   [█████████░] Morale: 90%            │
│                                        │
└────────────────────────────────────────┘
```

**Priority Color System:**
- 🔴 Critical: Red, animated pulse, requires immediate attention
- 🟡 High: Yellow/Orange, steady glow
- 🟢 Medium: Green, subtle highlight
- ⚪ Low/None: Gray, no special styling

**Interaction:**
1. Hover over NPC → Tooltip shows relationship level
2. Click NPC → Opens `AdvisorDetailModal`
3. Badge `[2]` shows number of recommendations
4. Morale bar shows NPC happiness (affects advice tone)

**Responsive Behavior:**
- Desktop: Always visible, ~300px wide
- Tablet: Collapsible, overlays when open
- Mobile: Bottom sheet, swipe up to open

---

### Advisor Detail Modal

**Triggered:** Click NPC in Advisor Panel

**Layout:**
```
╔══════════════════════════════════════════════════════════════╗
║  [Portrait] MARINA PETROVA                                   ║
║             Medien-Spezialistin                              ║
║             Beziehung: Vertraut (Level 2) 🙂                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 🔴 OPPORTUNITY                    ⏰ Läuft ab: Phase 18│   ║
║  │                                                        │   ║
║  │ Der Nordmark-Blackout ist perfekt für eine Kampagne.  │   ║
║  │ Wir müssen JETZT zuschlagen, bevor die Regierung die │   ║
║  │ Krise löst!                                           │   ║
║  │                                                        │   ║
║  │ [Begründung anzeigen ▼]                               │   ║
║  │   → 2M Menschen ohne Strom, Regierung verspricht     │   ║
║  │      Hilfe in 48h. Window: 3 Phasen.                 │   ║
║  │                                                        │   ║
║  │ EMPFOHLENE AKTIONEN:                                  │   ║
║  │ ┌────────────────────────────────────────────────┐   │   ║
║  │ │ ⭐ Regierungs-Versagen-Narrative                │   ║
║  │ │ Kosten: 30k Budget, 15 Capacity                │   ║
║  │ │ Effekt: Trust -8%, Reach +500k                 │   ║
║  │ │                        [ZUM TERMINAL →]        │   ║
║  │ └────────────────────────────────────────────────┘   │   ║
║  │ ┌────────────────────────────────────────────────┐   │   ║
║  │ │ Botfarm: Anti-EU-Stimmung                      │   ║
║  │ │ Kosten: 50k Budget, 20 Capacity, +5 Risk       │   ║
║  │ │ Effekt: Trust -6%, Reach +800k                 │   ║
║  │ │                        [ZUM TERMINAL →]        │   ║
║  │ └────────────────────────────────────────────────┘   │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │ 🟡 EFFICIENCY                                         │   ║
║  │                                                        │   ║
║  │ Unsere Reichweite stagniert bei 2.5M. Ich schlage    │   ║
║  │ vor: Botfarm ausbauen oder neue Plattformen...       │   ║
║  │                                           [Mehr ▼]    │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║                                      [Schließen]             ║
╚══════════════════════════════════════════════════════════════╝
```

**Features:**
- Portrait shows NPC (placeholder: colored avatar with initials)
- Relationship level visible (affects dialogue tone)
- Each recommendation expandable with reasoning
- "ZUM TERMINAL" button opens ActionPanel with action pre-selected
- Time-sensitive recommendations show expiration countdown
- Collapsible reasoning for transparency

---

### Action Panel Integration

**Enhancement:** Highlight recommended actions

**Visual Changes:**
```
┌──────────────────────────────────────────────────────────┐
│  AKTIONEN                                                │
│  [All] [Legal] [Grey] [Illegal] [New]                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ⭐ EMPFOHLEN VON MARINA                            │ │ ← Golden header
│  │                                                    │ │
│  │ Regierungs-Versagen-Narrative                     │ │
│  │ ⚠ GREY ZONE                                       │ │
│  │                                                    │ │
│  │ "Nutze den Blackout um Regierung als inkompetent │ │
│  │  darzustellen..."                                 │ │
│  │                                                    │ │
│  │ 💰 30k  ⚡ 15  ⚠️ +5                              │ │
│  │                                                    │ │
│  │ [AUSWÄHLEN]                                       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Zielgruppenanalyse                                 │ │ ← Normal action
│  │ ✓ LEGAL                                           │ │
│  │ ...                                                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Highlighting Rules:**
- Recommended actions get ⭐ badge + NPC portrait
- Golden border or glow effect
- Sorted to top of list (but not auto-filtered)
- Tooltip shows which NPC recommended and why (brief)

---

### Terminal Queue System

**Problem:** Terminal closes immediately after selecting action

**Solution:** Queue multiple actions, execute as batch

**UI Changes in ActionPanel:**
```
┌──────────────────────────────────────────────────────────┐
│  AKTIONEN                                                │
│                                                          │
│  [Action List...]                                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  AKTIONS-WARTESCHLANGE                        [Leeren]  │ ← New section
├──────────────────────────────────────────────────────────┤
│  1. Regierungs-Versagen-Narrative                       │
│     💰 -30k  ⚡ -15  ⚠️ +5                    [✕]       │
│                                                          │
│  2. Botfarm ausbauen                                     │
│     💰 -50k  ⚡ -20  ⚠️ +8                    [✕]       │
│                                                          │
│  Gesamt: 💰 -80k  ⚡ -35  ⚠️ +13                        │
│  Verfügbar: 💰 120k  ⚡ 50                               │
│                                                          │
│  [+ WEITERE AKTION] [AUSFÜHREN (Enter)] [Abbrechen]     │
└──────────────────────────────────────────────────────────┘
```

**Workflow:**
1. Player clicks action → Added to queue (terminal stays open)
2. Player can add more actions
3. Total costs calculated and displayed
4. Player clicks "AUSFÜHREN" → All actions execute in sequence
5. Single ActionResultScreen showing all results

**Benefits:**
- Strategic planning (combo effects visible before execution)
- Fewer clicks (no re-opening terminal)
- Better cost management (see total before committing)

---

## 🔧 Technical Implementation

### File Structure

```
src/story-mode/
├── engine/
│   ├── NPCAdvisorEngine.ts          ← NEW: Core analysis logic
│   ├── AdvisorRecommendation.ts     ← NEW: Type definitions
│   └── ActionResultGenerator.ts     ← NEW: Detailed result generation
├── components/
│   ├── AdvisorPanel.tsx             ← NEW: Persistent advisor UI
│   ├── AdvisorDetailModal.tsx       ← NEW: Full recommendation view
│   ├── ActionPanel.tsx              ← MODIFIED: Add queue + highlights
│   ├── ActionResultScreen.tsx       ← NEW: Multi-step results
│   └── ActionQueueWidget.tsx        ← NEW: Queue management
└── hooks/
    └── useStoryGameState.ts          ← MODIFIED: Integrate advisor system
```

### Core Type Definitions

```typescript
// src/story-mode/engine/AdvisorRecommendation.ts

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationCategory = 'opportunity' | 'threat' | 'efficiency' | 'strategy';

export interface AdvisorRecommendation {
  // Identity
  id: string; // Unique ID for tracking
  npcId: string; // Which NPC generated this

  // Priority & Category
  priority: RecommendationPriority;
  category: RecommendationCategory;

  // Content
  message: string; // Player-facing message (German)
  reasoning: string; // Why this recommendation (educational)

  // Actions
  suggestedActions: string[]; // Action IDs

  // Context
  phase: number; // When generated
  expiresPhase?: number; // Time-sensitive recommendations

  // Metadata
  confidence?: number; // 0-1, how confident NPC is
  conflictsWith?: string[]; // Other recommendation IDs
}

export interface NPCAnalysisContext {
  // Current State
  gameState: StoryGameState;
  npc: NPCState;

  // Historical Data
  actionHistory: ActionRecord[];
  metricsHistory: MetricsHistory;

  // Relationships
  otherNPCs: NPCState[];
  playerRelationship: number; // Affects tone
}

export interface ActionRecord {
  actionId: string;
  phase: number;
  costs: ActionCosts;
  effects: ActionEffects;
  success: boolean;
}
```

### NPCAdvisorEngine Implementation Skeleton

```typescript
// src/story-mode/engine/NPCAdvisorEngine.ts

export class NPCAdvisorEngine {
  private analysisStrategies: Map<string, NPCAnalysisStrategy>;

  constructor() {
    this.analysisStrategies = new Map([
      ['marina', new MarinaAnalysisStrategy()],
      ['alexei', new AlexeiAnalysisStrategy()],
      ['igor', new IgorAnalysisStrategy()],
      ['katja', new KatjaAnalysisStrategy()],
      ['direktor', new DirektorAnalysisStrategy()],
    ]);
  }

  /**
   * Generate recommendations from all NPCs
   * Called every phase start or on-demand
   */
  public generateRecommendations(
    context: NPCAnalysisContext
  ): AdvisorRecommendation[] {
    const allRecommendations: AdvisorRecommendation[] = [];

    // Each NPC analyzes independently
    for (const [npcId, strategy] of this.analysisStrategies) {
      const npc = context.gameState.npcs.find(n => n.id === npcId);
      if (!npc || !npc.available) continue;

      const npcContext = { ...context, npc };
      const recommendations = strategy.analyze(npcContext);

      allRecommendations.push(...recommendations);
    }

    // Sort by priority
    return this.sortByPriority(allRecommendations);
  }

  /**
   * Filter recommendations by category
   */
  public filterByCategory(
    recommendations: AdvisorRecommendation[],
    category: RecommendationCategory
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.category === category);
  }

  /**
   * Get top recommendation for each NPC
   */
  public getTopRecommendationPerNPC(
    recommendations: AdvisorRecommendation[]
  ): Map<string, AdvisorRecommendation> {
    const topRecs = new Map<string, AdvisorRecommendation>();

    for (const rec of recommendations) {
      if (!topRecs.has(rec.npcId)) {
        topRecs.set(rec.npcId, rec);
      }
    }

    return topRecs;
  }

  /**
   * Check if recommendation is still valid
   */
  public isRecommendationValid(
    rec: AdvisorRecommendation,
    currentPhase: number
  ): boolean {
    // Check expiration
    if (rec.expiresPhase && currentPhase > rec.expiresPhase) {
      return false;
    }

    // Could add more validation logic here

    return true;
  }

  private sortByPriority(
    recommendations: AdvisorRecommendation[]
  ): AdvisorRecommendation[] {
    const priorityWeight = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return recommendations.sort((a, b) =>
      priorityWeight[b.priority] - priorityWeight[a.priority]
    );
  }
}

// Base strategy interface
export interface NPCAnalysisStrategy {
  analyze(context: NPCAnalysisContext): AdvisorRecommendation[];
}
```

### Integration into useStoryGameState

```typescript
// src/story-mode/hooks/useStoryGameState.ts

export function useStoryGameState(seed?: number) {
  const [engine] = useState(() => createStoryEngine(seed));
  const [advisorEngine] = useState(() => new NPCAdvisorEngine());

  // Existing state...
  const [recommendations, setRecommendations] = useState<AdvisorRecommendation[]>([]);
  const [actionQueue, setActionQueue] = useState<string[]>([]);

  /**
   * Update recommendations when game state changes
   */
  const updateRecommendations = useCallback(() => {
    const context: NPCAnalysisContext = {
      gameState: {
        storyPhase,
        resources,
        npcs,
        availableActions,
        newsEvents,
        objectives,
        worldEvents: engine.getWorldEvents(),
        completedActions: engine.getCompletedActions(),
      },
      actionHistory: engine.getActionHistory(),
      metricsHistory: engine.getMetricsHistory(),
      npc: null, // Will be set by each strategy
      otherNPCs: npcs,
      playerRelationship: 0, // Will be set by each strategy
    };

    const newRecommendations = advisorEngine.generateRecommendations(context);

    // Filter out expired recommendations
    const validRecommendations = newRecommendations.filter(r =>
      advisorEngine.isRecommendationValid(r, storyPhase.phaseNumber)
    );

    setRecommendations(validRecommendations);

    storyLogger.info('Recommendations updated', {
      count: validRecommendations.length,
      byNPC: countByNPC(validRecommendations),
    });
  }, [engine, advisorEngine, storyPhase, resources, npcs, ...]);

  /**
   * Execute queued actions
   */
  const executeActionQueue = useCallback(async () => {
    if (actionQueue.length === 0) return;

    const results: ActionResult[] = [];

    for (const actionId of actionQueue) {
      const result = engine.executeAction(actionId);
      results.push(result);

      // Update state after each action
      setResources(engine.getResources());
      setNpcs(engine.getAllNPCs());
      setNewsEvents(engine.getNewsEvents());
    }

    // Clear queue
    setActionQueue([]);

    // Show combined results
    setLastActionResults(results);

    // Update recommendations based on new state
    updateRecommendations();
  }, [engine, actionQueue, updateRecommendations]);

  /**
   * Add action to queue
   */
  const queueAction = useCallback((actionId: string) => {
    setActionQueue(queue => [...queue, actionId]);
  }, []);

  /**
   * Remove action from queue
   */
  const removeFromQueue = useCallback((index: number) => {
    setActionQueue(queue => queue.filter((_, i) => i !== index));
  }, []);

  /**
   * Clear entire queue
   */
  const clearQueue = useCallback(() => {
    setActionQueue([]);
  }, []);

  // Update recommendations on phase end
  useEffect(() => {
    if (gamePhase === 'playing') {
      updateRecommendations();
    }
  }, [gamePhase, storyPhase.phaseNumber, updateRecommendations]);

  return {
    // Existing returns...

    // New: Advisor System
    recommendations,
    updateRecommendations,

    // New: Action Queue
    actionQueue,
    queueAction,
    removeFromQueue,
    clearQueue,
    executeActionQueue,
  };
}
```

---

## 📚 Implementation Guide

### Sprint 1 Task Breakdown

#### Week 1: Core Engine

**Day 1-2: Type Definitions & Infrastructure**
- [ ] Create `AdvisorRecommendation.ts` with all types
- [ ] Create `NPCAnalysisContext.ts` with context types
- [ ] Create `NPCAdvisorEngine.ts` skeleton
- [ ] Create base `NPCAnalysisStrategy` interface

**Day 3-5: NPC Analysis Strategies**
- [ ] Implement `MarinaAnalysisStrategy` (all patterns A-D)
- [ ] Implement `AlexeiAnalysisStrategy` (all patterns A-D)
- [ ] Implement `IgorAnalysisStrategy` (all patterns A-D)
- [ ] Implement `KatjaAnalysisStrategy` (all patterns A-D)
- [ ] Implement `DirektorAnalysisStrategy` (all patterns A-E)

**Day 6-7: Integration & Testing**
- [ ] Integrate `NPCAdvisorEngine` into `useStoryGameState`
- [ ] Add recommendation update triggers
- [ ] Unit tests for each analysis strategy
- [ ] Integration test: Play 10 phases, verify recommendations appear

#### Week 2: UI Components

**Day 1-2: Advisor Panel**
- [ ] Create `AdvisorPanel.tsx` component
- [ ] Implement priority indicators (🔴🟡🟢⚪)
- [ ] Implement collapsible functionality
- [ ] Add to Story Mode main layout

**Day 3-4: Advisor Detail Modal**
- [ ] Create `AdvisorDetailModal.tsx` component
- [ ] Implement recommendation list with expandable reasoning
- [ ] Add "ZUM TERMINAL" button navigation
- [ ] Handle time-sensitive recommendation countdown

**Day 5: Action Panel Integration**
- [ ] Modify `ActionPanel.tsx` to accept recommendations prop
- [ ] Implement action highlighting (⭐ badge, golden border)
- [ ] Sort recommended actions to top
- [ ] Add NPC endorsement tooltips

**Day 6-7: Queue System**
- [ ] Create `ActionQueueWidget.tsx` component
- [ ] Integrate queue into `ActionPanel.tsx`
- [ ] Implement cost calculation for queue
- [ ] Add queue execution logic in `useStoryGameState`
- [ ] Test: Queue 3 actions, execute, verify results

---

## 🧪 Testing Strategy

### Unit Tests

**NPCAnalysisStrategy Tests:**
```typescript
describe('MarinaAnalysisStrategy', () => {
  it('should detect active crisis events', () => {
    const context = createMockContext({
      worldEvents: [{ type: 'crisis', name: 'Blackout', active: true }]
    });

    const strategy = new MarinaAnalysisStrategy();
    const recommendations = strategy.analyze(context);

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].category).toBe('opportunity');
    expect(recommendations[0].message).toContain('Blackout');
  });

  it('should warn about stagnating reach', () => {
    const context = createMockContext({
      metricsHistory: {
        reachHistory: [2500000, 2520000, 2530000] // <10% growth
      }
    });

    const strategy = new MarinaAnalysisStrategy();
    const recommendations = strategy.analyze(context);

    const stagnationWarning = recommendations.find(r =>
      r.message.includes('stagniert')
    );

    expect(stagnationWarning).toBeDefined();
    expect(stagnationWarning.priority).toBe('medium');
  });
});
```

### Integration Tests

**Advisor System Integration:**
```typescript
describe('Advisor System Integration', () => {
  it('should generate recommendations on phase end', async () => {
    const { result } = renderHook(() => useStoryGameState());

    // Advance to phase 5
    for (let i = 0; i < 5; i++) {
      act(() => result.current.endPhase());
      await waitFor(() => expect(result.current.gamePhase).toBe('playing'));
    }

    // Should have recommendations from at least 2 NPCs
    expect(result.current.recommendations.length).toBeGreaterThanOrEqual(2);

    // Should have diverse priorities
    const priorities = new Set(result.current.recommendations.map(r => r.priority));
    expect(priorities.size).toBeGreaterThan(1);
  });

  it('should highlight recommended actions in ActionPanel', () => {
    const recommendations = [
      createMockRecommendation({
        npcId: 'marina',
        suggestedActions: ['ta03_media_campaign']
      })
    ];

    const { getByText } = render(
      <ActionPanel
        actions={mockActions}
        recommendations={recommendations}
        {...otherProps}
      />
    );

    const action = getByText('Media-Kampagne');
    expect(action.closest('[data-recommended="true"]')).toBeInTheDocument();
    expect(action).toHaveClass('recommended');
  });
});
```

### Manual Testing Scenarios

**Scenario 1: Crisis Opportunity**
1. Start new game
2. Advance to phase where crisis event triggers
3. Verify Marina generates high-priority opportunity recommendation
4. Open Advisor Panel → Marina should be 🟡 or 🔴
5. Click Marina → Modal shows event-specific recommendation
6. Click "ZUM TERMINAL" → ActionPanel opens with action highlighted
7. Execute action → Verify Marina reacts positively in results

**Scenario 2: High Risk Warning**
1. Execute several high-risk actions to push risk >70%
2. Advance phase
3. Verify Alexei generates critical warning
4. Advisor Panel → Alexei should be 🔴 with pulse animation
5. Click Alexei → Modal shows security recommendations
6. Ignore warning, continue high-risk actions → Risk hits 85%
7. Verify Alexei escalates warnings (even more urgent)

**Scenario 3: Low Budget**
1. Execute expensive actions until budget <30%
2. Advance phase
3. Verify Igor generates high-priority budget warning
4. Modal shows cheap action alternatives
5. Execute one of Igor's suggestions
6. Verify Igor reacts positively ("Wise choice")

**Scenario 4: Action Queue**
1. Open Terminal (ActionPanel)
2. Add 3 actions to queue
3. Verify total costs displayed
4. Remove middle action from queue
5. Execute queue → Verify all results shown in sequence
6. Verify NPCs react to each action appropriately

---

## 📊 Success Metrics & KPIs

### Quantitative Metrics

**Engagement:**
- [ ] >80% of players open Advisor Panel at least once per session
- [ ] >50% of players click on NPC recommendations
- [ ] >30% of executed actions are NPC-recommended

**Understanding:**
- [ ] >70% of players report understanding why NPCs made recommendations (survey)
- [ ] >60% of players can explain one NPC's specialty area after 30 minutes play

**Satisfaction:**
- [ ] Player satisfaction with NPC system: >4.0/5.0 (survey)
- [ ] "NPCs are helpful" agreement: >70% (survey)

### Qualitative Metrics

**Playtest Observations:**
- [ ] Players verbally refer to NPCs by name (not "the media person")
- [ ] Players discuss trade-offs between NPC recommendations
- [ ] Players show "aha moments" when seeing action results
- [ ] Players check Advisor Panel proactively (not just when prompted)

### Technical Metrics

**Performance:**
- [ ] Recommendation generation <50ms per phase
- [ ] Advisor Panel render <100ms
- [ ] No frame drops when opening modals
- [ ] Memory usage <+10MB from advisor system

---

## 🚀 Future Enhancements (Post-Sprint 1)

### Phase 2 Enhancements

**Dynamic NPC Personality:**
- NPCs remember player's past choices
- Recommendations adapt to player's preferred strategy
- NPCs get frustrated if consistently ignored
- NPCs praise effective tactics

**Conflicting Advice System:**
- Director mediates when NPCs disagree
- Player can ask NPCs to debate (dialog scene)
- Choosing one NPC's advice affects relationship with others

**Visual NPC Presence:**
- Static NPC avatars in office
- NPCs pulse/glow when they have recommendations
- Speech bubbles for urgent messages

### Phase 3 Enhancements

**Advanced Analytics:**
- NPCs provide post-action analysis (what went right/wrong)
- "Lessons Learned" screen at game end references NPC advice
- Performance dashboard shows ROI of following NPC advice

**NPC Side Missions:**
- NPCs can propose optional objectives
- Completing NPC missions unlocks special abilities
- NPC-specific endings based on relationships

### Phase 4 Enhancements

**AI-Enhanced Recommendations:**
- ML model learns from player behavior
- Recommendations become more personalized
- Predictive analysis: "If you do X, Marina will suggest Y"

---

## 📝 Documentation Checklist

- [x] Design document with expert insights
- [x] Technical specifications
- [x] Type definitions
- [x] Implementation guide
- [x] Testing strategy
- [ ] API documentation (auto-generated from code)
- [ ] User-facing help text for Advisor Panel
- [ ] Tutorial integration plan
- [ ] Localization strings (DE/EN)

---

## 🎓 Educational Value

**What Players Learn:**

1. **Strategic Thinking:** NPCs model different analytical perspectives
2. **Risk Management:** Alexei teaches security-first thinking
3. **Resource Optimization:** Igor teaches cost-benefit analysis
4. **Operational Planning:** Katja teaches field tradecraft
5. **Media Literacy:** Marina teaches content manipulation techniques
6. **Systems Thinking:** Director teaches interconnected consequences

**How It's Taught:**

- **Implicit:** Players absorb lessons by following advice and seeing results
- **Explicit:** NPC reasoning explains "why" behind recommendations
- **Reinforcement:** Successful strategies praised, poor choices explained
- **Discovery:** Players can experiment and learn from NPC reactions

---

## 🔗 References

### Game Design Research
- [Tackling Misinformation with Games](https://www.tandfonline.com/doi/full/10.1080/10494820.2023.2299999)
- [Role of Narrative in Misinformation Games](https://misinforeview.hks.harvard.edu/article/the-role-of-narrative-in-misinformation-games/)
- [Feedback Loops in Game Design](https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences)

### NPC Design Research
- [Intelligent Play: NPC Design and AI](https://scenegraph.academy/article/intelligent-play-intro-to-npc-design-and-ai-in-modern-video-games/)
- [AI Agent Design Lessons from NPCs](https://medium.com/data-science-collective/ai-agent-design-lessons-from-video-game-npc-development-f5414ba00e8d)

### Serious Games
- [Design of Disinformation Awareness Digital Game](https://www.researchgate.net/publication/380818606_Design_of_a_Disinformation_Awareness_Digital_Game)
- [FLIGBY Simulation Feedback System](https://www.fligby.com/simulation-feedback/)

---

**END OF DESIGN DOCUMENT**

*Last Updated: 2025-01-12*
*Version: 1.0*
*Status: Ready for Implementation*
