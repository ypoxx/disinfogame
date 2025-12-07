import { useEffect, useState } from 'react';
import type { NetworkMetrics } from '@/game-logic/types';

// ============================================
// MILESTONE TOAST - Sprint 1.4
// Celebrates progress at 25%, 50%, 75%
// ============================================

type MilestoneToastProps = {
  metrics: NetworkMetrics;
  totalActors: number;
  victoryThreshold: number; // 0.75
};

type Milestone = {
  id: string;
  percentage: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
};

const MILESTONES: Milestone[] = [
  {
    id: '25',
    percentage: 0.25,
    title: 'Seeds of Doubt',
    subtitle: '25% of actors compromised',
    emoji: '🌱',
    color: 'from-yellow-600 to-orange-600',
  },
  {
    id: '50',
    percentage: 0.5,
    title: 'Halfway There',
    subtitle: '50% of actors compromised',
    emoji: '⚡',
    color: 'from-orange-600 to-red-600',
  },
  {
    id: '75',
    percentage: 0.75,
    title: 'Critical Mass',
    subtitle: '75% of actors compromised',
    emoji: '🔥',
    color: 'from-red-600 to-purple-600',
  },
];

export function MilestoneToast({ metrics, totalActors, victoryThreshold }: MilestoneToastProps) {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [achievedMilestones, setAchievedMilestones] = useState<Set<string>>(new Set());

  // Calculate current progress
  const currentProgress = metrics.lowTrustCount / totalActors;

  useEffect(() => {
    // Check for newly achieved milestones
    for (const milestone of MILESTONES) {
      if (currentProgress >= milestone.percentage && !achievedMilestones.has(milestone.id)) {
        // New milestone achieved!
        setActiveMilestone(milestone);
        setAchievedMilestones((prev) => new Set([...prev, milestone.id]));

        // Auto-hide after animation
        setTimeout(() => {
          setActiveMilestone(null);
        }, 4000);

        break; // Only show one milestone at a time
      }
    }
  }, [currentProgress, achievedMilestones]);

  if (!activeMilestone) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Background flash */}
      <div className="absolute inset-0 bg-black/30 animate-pulse" />

      {/* Toast */}
      <div
        className={`
          relative bg-gradient-to-r ${activeMilestone.color}
          rounded-2xl p-8 shadow-2xl
          animate-bounce-in
          max-w-md mx-4
        `}
      >
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center text-white">
          <div className="text-6xl mb-4 animate-pulse">{activeMilestone.emoji}</div>
          <h2 className="text-3xl font-bold mb-2">{activeMilestone.title}</h2>
          <p className="text-white/80 text-lg">{activeMilestone.subtitle}</p>

          {/* Progress indicator */}
          <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${(currentProgress / victoryThreshold) * 100}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">
            {metrics.lowTrustCount} / {Math.ceil(totalActors * victoryThreshold)} actors needed for victory
          </p>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MilestoneToast;
