/**
 * Scenario System Types
 *
 * Defines game scenarios with objectives, victory conditions, and starting resources.
 */

export interface ScenarioObjectives {
  primary: string;
  secondary: string[];
}

export interface VictoryConditions {
  trustThreshold: number;      // Trust level threshold (e.g., 0.4 = 40%)
  actorPercentage: number;      // Percentage of actors that must meet threshold (e.g., 0.75 = 75%)
  maxRounds: number;            // Maximum rounds to achieve victory
}

export interface DefeatConditions {
  detectionThreshold: number;   // Detection risk threshold that causes defeat
  roundLimit: number;           // Round limit - defeat if not won by this round
}

export interface StartingResources {
  actionPoints: number;
  budget: number;
}

export type ScenarioDifficulty = 'easy' | 'medium' | 'hard';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  objectives: ScenarioObjectives;
  victoryConditions: VictoryConditions;
  defeatConditions: DefeatConditions;
  difficulty: ScenarioDifficulty;
  startingResources: StartingResources;
  howToPlay: string[];
}
