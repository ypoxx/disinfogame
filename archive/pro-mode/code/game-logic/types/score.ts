/**
 * Score and Achievement System
 */

export interface GameScore {
  roundsToVictory: number;
  efficiency: number; // Resources used / optimal
  techniquesUsed: number; // Variety of abilities used
  defensiveActorsAvoided: number; // Stealth bonus
  totalScore: number;
  rank: 'Novice' | 'Strategist' | 'Expert' | 'Master' | 'Grandmaster';
  letter: 'D' | 'C' | 'B' | 'A' | 'S';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: number; // timestamp
  progress?: number; // 0-1 for progressive achievements
}

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_victory',
    name: 'First Campaign',
    description: 'Win your first game',
    icon: '🎭',
    rarity: 'common'
  },
  {
    id: 'perfect_propaganda',
    name: 'Perfect Propaganda',
    description: 'Win without triggering defensive actors',
    icon: '👻',
    rarity: 'legendary'
  },
  {
    id: 'speed_runner',
    name: 'Blitzkrieg',
    description: 'Victory in under 12 rounds',
    icon: '⚡',
    rarity: 'epic'
  },
  {
    id: 'efficient_operator',
    name: 'Resource Master',
    description: 'Win with 90%+ resource efficiency',
    icon: '💎',
    rarity: 'epic'
  },
  {
    id: 'bot_master',
    name: 'Bot Whisperer',
    description: 'Use bot farm abilities 10+ times',
    icon: '🤖',
    rarity: 'rare'
  },
  {
    id: 'authority_launderer',
    name: 'Authority Launderer',
    description: 'Successfully manipulate 5 expert actors',
    icon: '🎓',
    rarity: 'rare'
  },
  {
    id: 'information_launderer',
    name: 'Master Launderer',
    description: 'Complete information laundering chain 3 times',
    icon: '🔄',
    rarity: 'epic'
  },
  {
    id: 'network_destroyer',
    name: 'Network Destroyer',
    description: 'Reduce average trust below 30%',
    icon: '💥',
    rarity: 'rare'
  },
  {
    id: 'media_mogul',
    name: 'Media Mogul',
    description: 'Compromise all media actors',
    icon: '📰',
    rarity: 'rare'
  },
  {
    id: 'expert_manipulator',
    name: 'Expert Manipulator',
    description: 'Compromise all scientist actors',
    icon: '🔬',
    rarity: 'rare'
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Use every ability type at least once',
    icon: '✨',
    rarity: 'epic'
  },
  {
    id: 'grandmaster',
    name: 'Information Warfare Grandmaster',
    description: 'Achieve S-rank score',
    icon: '👑',
    rarity: 'legendary'
  }
];

export function calculateScore(
  roundsToVictory: number,
  resourcesUsed: number,
  optimalResources: number,
  uniqueAbilities: number,
  defensiveActorsSpawned: number,
  abilityUsage: Record<string, number>
): GameScore {
  const baseScore = 10000;

  // Round penalty (optimal: 15 rounds)
  const optimalRounds = 15;
  const roundPenalty = Math.max(0, (roundsToVictory - optimalRounds) * 100);

  // Efficiency bonus
  const efficiency = 1 - (resourcesUsed / Math.max(optimalResources, 1));
  const efficiencyBonus = Math.max(0, efficiency * 2000);

  // Variety bonus
  const varietyBonus = uniqueAbilities * 200;

  // Stealth bonus (no defensive actors)
  const stealthBonus = defensiveActorsSpawned === 0 ? 1000 : 0;

  // Speed bonus (faster than optimal)
  const speedBonus = roundsToVictory < optimalRounds
    ? (optimalRounds - roundsToVictory) * 150
    : 0;

  const totalScore = Math.round(
    baseScore - roundPenalty + efficiencyBonus + varietyBonus + stealthBonus + speedBonus
  );

  const rank = getRank(totalScore);
  const letter = getLetterGrade(totalScore);

  return {
    roundsToVictory,
    efficiency,
    techniquesUsed: uniqueAbilities,
    defensiveActorsAvoided: defensiveActorsSpawned === 0 ? 1 : 0,
    totalScore: Math.max(0, totalScore),
    rank,
    letter
  };
}

function getRank(score: number): GameScore['rank'] {
  if (score >= 12000) return 'Grandmaster';
  if (score >= 10000) return 'Master';
  if (score >= 8000) return 'Expert';
  if (score >= 6000) return 'Strategist';
  return 'Novice';
}

function getLetterGrade(score: number): GameScore['letter'] {
  if (score >= 12000) return 'S';
  if (score >= 10000) return 'A';
  if (score >= 8000) return 'B';
  if (score >= 6000) return 'C';
  return 'D';
}

export function checkAchievements(
  gameState: any, // Would be actual GameState type
  score: GameScore
): Achievement[] {
  const unlocked: Achievement[] = [];

  // First victory
  if (gameState.phase === 'victory') {
    unlocked.push({ ...ACHIEVEMENTS[0], unlocked: true, unlockedAt: Date.now() });
  }

  // Perfect propaganda
  if (gameState.defensiveActorsSpawned === 0 && gameState.phase === 'victory') {
    unlocked.push({ ...ACHIEVEMENTS[1], unlocked: true, unlockedAt: Date.now() });
  }

  // Speed runner
  if (score.roundsToVictory < 12) {
    unlocked.push({ ...ACHIEVEMENTS[2], unlocked: true, unlockedAt: Date.now() });
  }

  // Efficient operator
  if (score.efficiency >= 0.9) {
    unlocked.push({ ...ACHIEVEMENTS[3], unlocked: true, unlockedAt: Date.now() });
  }

  // Grandmaster
  if (score.letter === 'S') {
    unlocked.push({ ...ACHIEVEMENTS[11], unlocked: true, unlockedAt: Date.now() });
  }

  return unlocked;
}
