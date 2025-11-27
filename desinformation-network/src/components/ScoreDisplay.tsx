import type { GameScore, Achievement } from '@/game-logic/types/score';

interface ScoreDisplayProps {
  score: GameScore;
  achievements: Achievement[];
  onContinue: () => void;
}

export function ScoreDisplay({ score, achievements, onContinue }: ScoreDisplayProps) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Grandmaster': return 'text-purple-600';
      case 'Master': return 'text-yellow-600';
      case 'Expert': return 'text-blue-600';
      case 'Strategist': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getLetterColor = (letter: string) => {
    switch (letter) {
      case 'S': return 'from-purple-600 to-pink-600';
      case 'A': return 'from-yellow-500 to-orange-500';
      case 'B': return 'from-blue-500 to-cyan-500';
      case 'C': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden max-w-2xl">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getLetterColor(score.letter)} px-8 py-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Campaign Complete</h2>
            <p className={`text-xl font-semibold ${getRankColor(score.rank)}`}>
              {score.rank}
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-6xl font-bold text-white">{score.letter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Total Score</h3>
            <span className="text-4xl font-bold text-gray-900">
              {score.totalScore.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getLetterColor(score.letter)} transition-all duration-1000`}
              style={{ width: `${Math.min((score.totalScore / 12000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Rounds to Victory</p>
            <p className="text-2xl font-bold text-gray-900">{score.roundsToVictory}</p>
            <p className="text-xs text-gray-500">Optimal: 15 rounds</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Resource Efficiency</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(score.efficiency * 100)}%
            </p>
            <p className="text-xs text-gray-500">Resources used optimally</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Techniques Used</p>
            <p className="text-2xl font-bold text-purple-600">{score.techniquesUsed}</p>
            <p className="text-xs text-gray-500">Variety bonus</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Stealth</p>
            <p className="text-2xl font-bold text-green-600">
              {score.defensiveActorsAvoided ? '✓' : '✗'}
            </p>
            <p className="text-xs text-gray-500">
              {score.defensiveActorsAvoided ? 'No alarms triggered' : 'Detected'}
            </p>
          </div>
        </div>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>🏆</span>
              <span>Achievements Unlocked</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 ${
                    achievement.rarity === 'legendary' ? 'bg-purple-50 border-purple-300' :
                    achievement.rarity === 'epic' ? 'bg-blue-50 border-blue-300' :
                    achievement.rarity === 'rare' ? 'bg-green-50 border-green-300' :
                    'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{achievement.icon}</span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {achievement.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Mini score display for in-game
export function ScorePreview({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <span className="text-sm text-gray-600">Score:</span>
      <span className="text-lg font-bold text-purple-600">
        {score.toLocaleString()}
      </span>
    </div>
  );
}
