/**
 * Tutorial System Types
 * Interactive onboarding for first-time players
 */

export type TutorialStep = {
  id: string;
  round: number;
  phase: 'start' | 'actor_selection' | 'ability_hover' | 'ability_select' | 'target_select' | 'round_end' | 'complete';
  title: string;
  message: string;
  highlight?: {
    type: 'actor' | 'ability' | 'button' | 'metric';
    targetId?: string;
  };
  action?: 'click_actor' | 'hover_ability' | 'select_ability' | 'select_target' | 'end_round';
  completed: boolean;
  // PHASE 2: Enhanced Tutorial Animations
  overlayType?: 'modal' | 'arrow' | 'hand' | 'highlight';
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
};

export type TutorialState = {
  active: boolean;
  currentStep: number;
  steps: TutorialStep[];
  round: number;
  completed: boolean;
  skipped: boolean;
};

export type TutorialConfig = {
  enabled: boolean;
  showHints: boolean;
  highlightElements: boolean;
  pauseGameplay: boolean;
};

// Tutorial messages
export const TUTORIAL_MESSAGES = {
  welcome: {
    title: 'Welcome, Information Operations Strategist',
    message: `You'll learn how disinformation spreads by performing it yourself.

Your goal: Demonstrate vulnerabilities in this information ecosystem.

**TARGET**: Reduce trust in 75% of actors below 40%

Click on any actor to begin...`
  },

  firstActorSelection: {
    title: 'Good choice! Let\'s analyze this actor',
    message: (actorName: string, reach: number, trust: number) => `**${actorName}**

📊 **High Reach**: Stories spread fast (${Math.round(reach * 10)}/10)
🎯 **Trust Level**: ${Math.round(trust * 100)}%
🔗 **Many Connections**: Reaches all types of actors

Try selecting an ability →`
  },

  firstAbilityHover: {
    title: 'Understanding Abilities',
    message: (abilityName: string, effect: string, cost: number) => `**${abilityName}**

Effect: ${effect}
Cost: ${cost} resources
Propagates: Yes (spreads to connected actors)

Real tactic: Emotional framing, out-of-context quotes

Click to select this ability →`
  },

  firstAbilitySelect: {
    title: 'Now Select a Target',
    message: `**TIP**: Actors with high trust are valuable targets.
When compromised, the network impact is larger!

Hover over actors to see connections...

Click on an actor to target them.`
  },

  firstActionComplete: {
    title: 'Watch the Impact!',
    message: `Notice how:
- Trust bar decreased immediately
- Connections pulsed showing propagation
- Network metrics updated

This is how disinformation spreads in reality - through trusted connections.

Click "End Round" to see the full effects →`
  },

  roundSummaryExplanation: {
    title: 'Round Summary',
    message: `After each round, you'll see:
- What happened (narrative)
- Which actors were affected
- Network-wide consequences
- Your progress toward victory

This helps you understand the real-world impact of manipulation tactics.

Click "Continue" to proceed →`
  },

  round2Start: {
    title: 'Round 2: Building Your Strategy',
    message: `Now you understand the basics. Let's explore strategic depth:

**Strategic Tips**:
- Media actors have more connections → bigger impact
- Experts have higher trust → more credibility damage
- Resources regenerate each round
- Some abilities have cooldowns

Try different combinations!`
  },

  round3Complete: {
    title: 'Tutorial Complete!',
    message: `You now understand:
✅ How to select actors and use abilities
✅ How trust propagates through networks
✅ How disinformation compounds over rounds
✅ Real-world manipulation tactics

**The game is now fully unlocked.**

Remember: This is educational. Understanding these tactics helps you recognize them in real life.

Good luck!`
  }
};

// Pre-defined tutorial sequence
export const TUTORIAL_SEQUENCE: Omit<TutorialStep, 'completed'>[] = [
  {
    id: 'welcome',
    round: 1,
    phase: 'start',
    title: TUTORIAL_MESSAGES.welcome.title,
    message: TUTORIAL_MESSAGES.welcome.message
  },
  {
    id: 'first_actor_selection',
    round: 1,
    phase: 'actor_selection',
    title: 'Select Your First Actor',
    message: 'Click on any actor in the network to see their details and available abilities.',
    highlight: {
      type: 'actor'
    },
    action: 'click_actor',
    overlayType: 'hand',
    arrowPosition: 'top'
  },
  {
    id: 'ability_explanation',
    round: 1,
    phase: 'ability_hover',
    title: 'Abilities Explained',
    message: 'Each actor has unique abilities based on real disinformation tactics. Hover over an ability to see details.',
    action: 'hover_ability',
    overlayType: 'arrow',
    arrowPosition: 'right'
  },
  {
    id: 'select_ability',
    round: 1,
    phase: 'ability_select',
    title: 'Use an Ability',
    message: 'Click on an ability to activate targeting mode.',
    action: 'select_ability',
    overlayType: 'hand',
    arrowPosition: 'right'
  },
  {
    id: 'select_target',
    round: 1,
    phase: 'target_select',
    title: 'Choose Your Target',
    message: 'Now select which actor to target. Actors with high trust create bigger network impact when compromised.',
    highlight: {
      type: 'actor'
    },
    action: 'select_target',
    overlayType: 'arrow',
    arrowPosition: 'top'
  },
  {
    id: 'observe_effects',
    round: 1,
    phase: 'round_end',
    title: 'Observe the Effects',
    message: 'Watch how trust changed and effects propagated through connections. Click "End Round" to proceed.',
    action: 'end_round'
  },
  {
    id: 'round_2_start',
    round: 2,
    phase: 'start',
    title: 'Round 2: Strategic Depth',
    message: TUTORIAL_MESSAGES.round2Start.message
  },
  {
    id: 'round_3_complete',
    round: 3,
    phase: 'complete',
    title: 'Tutorial Complete',
    message: TUTORIAL_MESSAGES.round3Complete.message
  }
];

export const createInitialTutorialState = (): TutorialState => ({
  active: true,
  currentStep: 0,
  steps: TUTORIAL_SEQUENCE.map(step => ({ ...step, completed: false })),
  round: 1,
  completed: false,
  skipped: false
});
