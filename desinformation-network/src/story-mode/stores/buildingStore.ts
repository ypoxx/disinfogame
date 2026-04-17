import { create } from 'zustand';
import { getRoomById, BUILDING_FLOORS } from '../config/building';
import type { Room } from '../config/building';

// ============================================
// BUILDING NAVIGATION STORE
// Tracks player's current location in the building
// ============================================

interface BuildingState {
  currentFloor: number;
  currentRoomId: string;

  // Navigation
  navigateTo: (roomId: string) => void;
  setFloor: (floor: number) => void;

  // Access checks
  canAccessRoom: (roomId: string, currentPhase: number) => boolean;
  canAccessFloor: (floorId: number) => boolean;

  // Get current room config
  getCurrentRoom: () => Room | undefined;

  // Reset
  resetBuilding: () => void;
}

export const useBuildingStore = create<BuildingState>((set, get) => ({
  currentFloor: 1,
  currentRoomId: 'player_office',

  navigateTo: (roomId: string) => {
    const room = getRoomById(roomId);
    if (room) {
      set({ currentRoomId: roomId, currentFloor: room.floor });
    }
  },

  setFloor: (floor: number) => set({ currentFloor: floor }),

  canAccessRoom: (roomId: string, currentPhase: number) => {
    const room = getRoomById(roomId);
    if (!room) return false;
    if (room.unlockPhase && currentPhase < room.unlockPhase) return false;
    const floor = BUILDING_FLOORS.find((f) => f.id === room.floor);
    if (floor && !floor.accessible) return false;
    return true;
  },

  canAccessFloor: (floorId: number) => {
    const floor = BUILDING_FLOORS.find((f) => f.id === floorId);
    return floor?.accessible ?? false;
  },

  getCurrentRoom: () => {
    return getRoomById(get().currentRoomId);
  },

  resetBuilding: () =>
    set({
      currentFloor: 1,
      currentRoomId: 'player_office',
    }),
}));
