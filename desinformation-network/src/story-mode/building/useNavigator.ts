/**
 * useNavigator — spielt geplante Routen (BuildingNavigator) als Animation ab.
 *
 * Hält Avatar-Position, Blickrichtung, Fahrstuhl-Kabine und Tür-Zustand;
 * spielt die Gebäude-Sounds (Schritte, Fahrstuhl, Tür). `skip()` springt
 * sofort ans Ziel (für die überspringbare Ankunfts-Sequenz).
 * Die Position überlebt View-Wechsel (modulweiter Speicher).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { planRoute, defaultPosition, type AvatarPosition, type NavStep, NAV_SPEED } from './BuildingNavigator';
import { roomById } from './buildingLayout';
import { playSound } from '../utils/SoundSystem';

export type NavigatorMode = 'idle' | 'walk' | 'ride' | 'door';

export interface NavigatorState {
  pos: AvatarPosition;
  facing: 1 | -1;
  mode: NavigatorMode;
  /** Etage der Kabine; während der Fahrt mit Nachkommaanteil. */
  cabinLevel: number;
  cabinDoorsOpen: boolean;
  avatarInCabin: boolean;
  openDoorRoomId: string | null;
  targetRoomId: string | null;
}

/** Letzte Avatar-Position — überlebt Unmounts (View-Wechsel, Raum-Besuche). */
let lastPosition: AvatarPosition | null = null;

export function peekAvatarPosition(): AvatarPosition {
  return lastPosition ?? defaultPosition();
}

/** Nur für Tests/Sequenzen: Position hart setzen (z. B. Lobby-Spawn). */
export function resetAvatarPosition(pos: AvatarPosition | null): void {
  lastPosition = pos;
}

interface RunHandle {
  cancelled: boolean;
  timeouts: number[];
  raf: number | null;
  intervals: number[];
}

export interface UseNavigatorResult extends NavigatorState {
  /** Läuft gerade eine Route? */
  busy: boolean;
  /** Avatar zur Tür von `roomId` schicken; `onArrive` feuert bei offener Tür. */
  goTo: (roomId: string, onArrive?: (roomId: string) => void) => void;
  /** Aktuelle Route sofort beenden (Ziel + Callback werden ausgeführt). */
  skip: () => void;
}

export function useNavigator(initial?: AvatarPosition): UseNavigatorResult {
  const [state, setState] = useState<NavigatorState>(() => {
    const pos = initial ?? peekAvatarPosition();
    return {
      pos,
      facing: 1,
      mode: 'idle',
      cabinLevel: pos.floorLevel,
      cabinDoorsOpen: false,
      avatarInCabin: false,
      openDoorRoomId: null,
      targetRoomId: null,
    };
  });
  const runRef = useRef<RunHandle | null>(null);
  const arriveRef = useRef<{ roomId: string; cb?: (roomId: string) => void } | null>(null);

  const cancelRun = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    run.cancelled = true;
    run.timeouts.forEach((t) => window.clearTimeout(t));
    run.intervals.forEach((t) => window.clearInterval(t));
    if (run.raf !== null) window.cancelAnimationFrame(run.raf);
    runRef.current = null;
  }, []);

  useEffect(() => () => cancelRun(), [cancelRun]);

  useEffect(() => {
    lastPosition = state.pos;
  }, [state.pos]);

  const finishAt = useCallback((roomId: string) => {
    const room = roomById(roomId);
    const pos: AvatarPosition = room ? { floorLevel: room.floorLevel, x: room.doorX } : peekAvatarPosition();
    lastPosition = pos;
    setState((s) => ({
      ...s,
      pos,
      mode: 'idle',
      cabinLevel: pos.floorLevel,
      cabinDoorsOpen: false,
      avatarInCabin: false,
      openDoorRoomId: null,
      targetRoomId: null,
    }));
  }, []);

  const goTo = useCallback(
    (roomId: string, onArrive?: (roomId: string) => void) => {
      cancelRun();
      const from = lastPosition ?? state.pos;
      let steps: NavStep[];
      try {
        steps = planRoute(from, roomId);
      } catch {
        return;
      }
      const run: RunHandle = { cancelled: false, timeouts: [], raf: null, intervals: [] };
      runRef.current = run;
      arriveRef.current = { roomId, cb: onArrive };
      setState((s) => ({ ...s, targetRoomId: roomId }));

      const later = (ms: number, fn: () => void) => {
        run.timeouts.push(window.setTimeout(() => !run.cancelled && fn(), ms));
      };

      const runStep = (index: number) => {
        if (run.cancelled) return;
        const step = steps[index];
        if (!step) {
          const arrive = arriveRef.current;
          arriveRef.current = null;
          finishAt(roomId);
          if (arrive?.cb) arrive.cb(arrive.roomId);
          return;
        }

        if (step.kind === 'walk') {
          const facing: 1 | -1 = step.toX >= step.fromX ? 1 : -1;
          setState((s) => ({ ...s, mode: 'walk', facing }));
          // Schritt-Sounds kommen frame-synchron aus der Stage (Kontakt-Frames),
          // nicht mehr aus einem Intervall — s. BuildingStage.handleWalkFrame.
          const t0 = performance.now();
          const tick = (now: number) => {
            if (run.cancelled) return;
            const t = Math.min(1, (now - t0) / step.durationMs);
            const x = step.fromX + (step.toX - step.fromX) * t;
            setState((s) => ({ ...s, pos: { floorLevel: step.floorLevel, x } }));
            if (t < 1) {
              run.raf = window.requestAnimationFrame(tick);
            } else {
              run.intervals.forEach((i) => window.clearInterval(i));
              run.intervals = [];
              runStep(index + 1);
            }
          };
          run.raf = window.requestAnimationFrame(tick);
          return;
        }

        if (step.kind === 'elevator') {
          const travelMs = step.durationMs - 2 * NAV_SPEED.elevatorDoorMs;
          playSound('elevator');
          // Phase 1: Türen öffnen, Avatar steigt ein.
          setState((s) => ({ ...s, mode: 'ride', cabinLevel: step.fromLevel, cabinDoorsOpen: true }));
          later(NAV_SPEED.elevatorDoorMs, () => {
            // Phase 2: Türen zu, Kabine fährt.
            setState((s) => ({ ...s, cabinDoorsOpen: false, avatarInCabin: true }));
            const t0 = performance.now();
            const tick = (now: number) => {
              if (run.cancelled) return;
              const t = Math.min(1, (now - t0) / travelMs);
              const level = step.fromLevel + (step.toLevel - step.fromLevel) * t;
              setState((s) => ({ ...s, cabinLevel: level, pos: { ...s.pos, floorLevel: Math.round(level) } }));
              if (t < 1) {
                run.raf = window.requestAnimationFrame(tick);
              } else {
                // Phase 3: Türen auf, Avatar steigt aus.
                setState((s) => ({
                  ...s,
                  cabinLevel: step.toLevel,
                  cabinDoorsOpen: true,
                  avatarInCabin: false,
                  pos: { floorLevel: step.toLevel, x: step.x },
                }));
                later(NAV_SPEED.elevatorDoorMs, () => {
                  setState((s) => ({ ...s, cabinDoorsOpen: false }));
                  runStep(index + 1);
                });
              }
            };
            run.raf = window.requestAnimationFrame(tick);
          });
          return;
        }

        // step.kind === 'door'
        playSound('doorOpen');
        setState((s) => ({ ...s, mode: 'door', openDoorRoomId: step.roomId }));
        later(step.durationMs, () => {
          const arrive = arriveRef.current;
          arriveRef.current = null;
          if (arrive?.cb) arrive.cb(arrive.roomId);
          later(350, () => {
            playSound('doorClose');
            finishAt(roomId);
          });
        });
      };

      runStep(0);
    },
    [cancelRun, finishAt, state.pos]
  );

  const skip = useCallback(() => {
    const arrive = arriveRef.current;
    const target = arrive?.roomId ?? state.targetRoomId;
    cancelRun();
    arriveRef.current = null;
    if (target) {
      finishAt(target);
      if (arrive?.cb) arrive.cb(arrive.roomId);
    }
  }, [cancelRun, finishAt, state.targetRoomId]);

  return {
    ...state,
    busy: state.mode !== 'idle',
    goTo,
    skip,
  };
}
