import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  GameState,
  UIState,
  GamePhase,
  Actor,
  Ability,
  Notification
} from '@/game-logic/types';

// Counter for deterministic notification IDs
let notificationCounter = 0;

// ============================================
// STORE TYPES
// ============================================

type GameStore = {
  // Settings
  settings: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    autoEndRound: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
  };
  
  // Persistent stats
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalRoundsPlayed: number;
    favoriteAbility: string | null;
    bestScore: number | null;
    lastSeed: string | null;
  };
  
  // Actions
  updateSettings: (settings: Partial<GameStore['settings']>) => void;
  incrementGamesPlayed: () => void;
  recordWin: (rounds: number, seed: string) => void;
  recordAbilityUse: (abilityId: string) => void;
  resetStats: () => void;
};

// ============================================
// DEFAULT VALUES
// ============================================

const defaultSettings: GameStore['settings'] = {
  soundEnabled: true,
  animationsEnabled: true,
  autoEndRound: false,
  difficulty: 'normal',
};

const defaultStats: GameStore['stats'] = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalRoundsPlayed: 0,
  favoriteAbility: null,
  bestScore: null,
  lastSeed: null,
};

// Ability usage tracking (not persisted)
const abilityUsageCount: Map<string, number> = new Map();

// ============================================
// STORE
// ============================================

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        settings: defaultSettings,
        stats: defaultStats,
        
        updateSettings: (newSettings) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          }));
        },
        
        incrementGamesPlayed: () => {
          set((state) => ({
            stats: {
              ...state.stats,
              gamesPlayed: state.stats.gamesPlayed + 1,
            },
          }));
        },
        
        recordWin: (rounds, seed) => {
          const currentScore = rounds * 100; // Lower is better
          set((state) => {
            const bestScore = state.stats.bestScore === null 
              ? currentScore 
              : Math.min(state.stats.bestScore, currentScore);
              
            return {
              stats: {
                ...state.stats,
                gamesWon: state.stats.gamesWon + 1,
                totalRoundsPlayed: state.stats.totalRoundsPlayed + rounds,
                bestScore,
                lastSeed: seed,
              },
            };
          });
        },
        
        recordAbilityUse: (abilityId) => {
          // Track ability usage locally
          const currentCount = abilityUsageCount.get(abilityId) || 0;
          abilityUsageCount.set(abilityId, currentCount + 1);
          
          // Find most used ability
          let maxCount = 0;
          let favoriteAbility: string | null = null;
          abilityUsageCount.forEach((count, id) => {
            if (count > maxCount) {
              maxCount = count;
              favoriteAbility = id;
            }
          });
          
          set((state) => ({
            stats: {
              ...state.stats,
              favoriteAbility,
            },
          }));
        },
        
        resetStats: () => {
          abilityUsageCount.clear();
          set({ stats: defaultStats });
        },
      }),
      {
        name: 'desinformation-network-store',
        partialize: (state) => ({
          settings: state.settings,
          stats: state.stats,
        }),
      }
    )
  )
);

// ============================================
// UI STORE (not persisted)
// ============================================

type UIStore = {
  // Modal states
  showEncyclopedia: boolean;
  showTutorial: boolean;
  showSettings: boolean;
  showLeaderboard: boolean;
  showShareModal: boolean;
  
  // Selection states
  selectedActorId: string | null;
  selectedAbilityId: string | null;
  hoveredActorId: string | null;
  targetingMode: boolean;
  validTargets: string[];
  
  // Notifications
  notifications: Notification[];
  
  // Encyclopedia
  encyclopediaSearchTerm: string;
  encyclopediaSelectedTechnique: string | null;
  
  // Actions
  toggleModal: (modal: 'encyclopedia' | 'tutorial' | 'settings' | 'leaderboard' | 'share') => void;
  closeAllModals: () => void;
  
  selectActor: (actorId: string | null) => void;
  selectAbility: (abilityId: string | null) => void;
  hoverActor: (actorId: string | null) => void;
  
  enterTargetingMode: (validTargets: string[]) => void;
  exitTargetingMode: () => void;
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  
  setEncyclopediaSearch: (term: string) => void;
  setEncyclopediaSelectedTechnique: (id: string | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  // Initial states
  showEncyclopedia: false,
  showTutorial: false,
  showSettings: false,
  showLeaderboard: false,
  showShareModal: false,
  
  selectedActorId: null,
  selectedAbilityId: null,
  hoveredActorId: null,
  targetingMode: false,
  validTargets: [],
  
  notifications: [],
  
  encyclopediaSearchTerm: '',
  encyclopediaSelectedTechnique: null,
  
  // Actions
  toggleModal: (modal) => {
    set((state) => {
      const key = `show${modal.charAt(0).toUpperCase() + modal.slice(1)}` as keyof UIStore;
      return { [key]: !state[key] };
    });
  },
  
  closeAllModals: () => {
    set({
      showEncyclopedia: false,
      showTutorial: false,
      showSettings: false,
      showLeaderboard: false,
      showShareModal: false,
    });
  },
  
  selectActor: (actorId) => {
    set({
      selectedActorId: actorId,
      selectedAbilityId: null,
      targetingMode: false,
      validTargets: [],
    });
  },
  
  selectAbility: (abilityId) => {
    set({ selectedAbilityId: abilityId });
  },
  
  hoverActor: (actorId) => {
    set({ hoveredActorId: actorId });
  },
  
  enterTargetingMode: (validTargets) => {
    set({ targetingMode: true, validTargets });
  },
  
  exitTargetingMode: () => {
    set({
      targetingMode: false,
      validTargets: [],
      selectedAbilityId: null,
    });
  },
  
  addNotification: (notification) => {
    const id = `notification_${Date.now()}_${++notificationCounter}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-remove after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      }, notification.duration);
    }
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  setEncyclopediaSearch: (term) => {
    set({ encyclopediaSearchTerm: term });
  },
  
  setEncyclopediaSelectedTechnique: (id) => {
    set({ encyclopediaSelectedTechnique: id });
  },
}));
