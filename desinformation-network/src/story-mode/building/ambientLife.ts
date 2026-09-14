/**
 * ambientLife — LB „Lebendiges Gebäude" (Plan §3b c).
 *
 * Statisten laufen ECHTE, teils etagenübergreifende Routen (Ziele = Türen),
 * erscheinen aus sich öffnenden Türen und benutzen bei einem Etagenwechsel den
 * sichtbaren Fahrstuhl — KEIN Ein-/Ausfaden, keine CSS-Pendel-Keyframes. Die
 * Geometrie kommt aus dem vorhandenen BuildingNavigator; das Tempo bleibt mit
 * ~58 px/s ± 22 % deutlich ruhiger als beim Spieler (300 px/s).
 *
 * Pure TS + deterministischer Zufall (mulberry32): testbar ohne React/DOM.
 * Der React-Teil (AmbientLifeLayer in BuildingStage) ist nur ein Abspielkopf,
 * der `sampleAmbient(state, nowMs)` pro Frame abliest.
 */
import { planRoute, NAV_SPEED } from './BuildingNavigator';
import { getBuildingLayout, STAGE, type BuildingLayout, type RoomLayout } from './buildingLayout';

/** Rhythmus-Konstanten (Memo §3: Tür-Beat 0,5–1 s, Kontext-Idle 2–4 s, Ruhe > Unruhe). */
export const AMBIENT_TIMING = {
  /** Ruhiges Grundtempo in Stage-px/s (Spieler: 300). */
  baseSpeedPxS: 58,
  /** ± Tempo-Streuung je Figur (Memo §3: 15–25 %). */
  speedJitter: 0.22,
  /** Kontext-Idle unterwegs (steht kurz, schaut). */
  idleMinMs: 900,
  idleMaxMs: 1800,
  /** Verborgen zwischen zwei Auftritten (Frequenz ruhig, SOUL §3.4). */
  pauseMinMs: 4500,
  pauseMaxMs: 9000,
  /** Tür-Beat = Navigator-Türzeit (650 ms, im 0,5–1-s-Fenster). */
  doorBeatMs: NAV_SPEED.doorMs,
  /** Tür bleibt nach dem Heraustreten kurz offen (schließt hinter der Figur). */
  doorTailMs: 300,
  /** Tür öffnet, BEVOR die Figur sie erreicht (kein Warten vor verschlossener Tür). */
  doorLeadMs: 250,
  /** Ab hier tritt die Figur sichtbar aus dem bereits geöffneten Türrahmen. */
  emergeFrac: 0.42,
  /** Ein-/Aussteigen der Statisten; bewusst etwas ruhiger als die Spielfigur. */
  elevatorTransferMs: 820,
  /** Fahrzeit pro Etage (die Kabine wird im Renderer kontinuierlich bewegt). */
  elevatorMsPerFloor: 980,
} as const;

/** Mehr als zwei komplexe Routen zugleich machen den Querschnitt unruhig und
 * erschweren die Zielführung des Spielers. Lokale Mitarbeiter-Patrouillen sind
 * davon getrennt und verbringen den Großteil ihrer Zeit im Idle. */
export const MAX_ACTIVE_AMBIENT = 2;

/**
 * Verpasster-Termin-Schwelle: Liegt ein geplanter Auftritt weiter als dies in
 * der Vergangenheit (rAF pausierte im Hintergrund-Tab o. Ä.), wird NEU
 * gestaffelt statt geplant — sonst träten alle gleichzeitig fälligen Agenten
 * im selben Frame auf (Massen-Spawn, Code-Review Etappe 3 [hoch]).
 */
export const STALE_APPOINTMENT_MS = 3000;

export interface AmbientAgentDef {
  id: string;
  /** 8-Frame-Lauf-Sheet (Seitenansicht, läuft nach rechts). */
  walkSheet: string;
  /** 2-Frame-Steh-Sheet (frontal) für Tür-Beat und Kontext-Idle. */
  idleSheet: string;
  /** Etagen-Level, die die Figur reihum abgeht (Reinigung: mehrere → „wandert Etagen ab"). */
  floorLevels: number[];
  /** Erster Auftritt (ms nach Start) — staffelt die Figuren gegeneinander. */
  firstAppearanceMs: number;
  /** Wahrscheinlichkeit, dass die nächste Route eine andere Etage ansteuert. */
  crossFloorChance?: number;
}

/**
 * Besetzung: Reinigung und Akten-Boten dürfen mehrere Etagen besuchen. Der
 * Scheduler lässt höchstens zwei gleichzeitig sichtbar reisen und reserviert
 * den Fahrstuhl exklusiv für eine Ambient-Figur; der Spieler selbst behält im
 * Renderer immer Vorrang.
 */
export const AMBIENT_AGENTS: AmbientAgentDef[] = [
  { id: 'reinigung', walkSheet: 'figure_cleaner_walk', idleSheet: 'figure_cleaner', floorLevels: [3, 1, 4, -1, 2], firstAppearanceMs: 1200, crossFloorChance: 0.52 },
  { id: 'bote_e4', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [4, 3, 2, 1], firstAppearanceMs: 3200, crossFloorChance: 0.42 },
  { id: 'bote_e3', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [3, 2, 4, 1], firstAppearanceMs: 5200, crossFloorChance: 0.38 },
  { id: 'bote_e2', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [2, 1, 3, -1], firstAppearanceMs: 7000, crossFloorChance: 0.4 },
  { id: 'bote_e1', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [1, 2, 3, 4], firstAppearanceMs: 9000, crossFloorChance: 0.36 },
];

/** Türen, die Statisten NIE benutzen: die Lobby hat keine Tür, und aus dem
 *  Büro des SPIELERS darf niemand Fremdes treten (falsche Erzählung). */
const FORBIDDEN_ROOMS = new Set(['lobby', 'spieler_buero']);

export type AmbientSegmentKind =
  | 'doorOut'
  | 'walk'
  | 'idle'
  | 'elevatorIn'
  | 'elevatorRide'
  | 'elevatorOut'
  | 'doorIn';

export interface AmbientSegment {
  kind: AmbientSegmentKind;
  t0: number;
  t1: number;
  floorLevel: number;
  fromX: number;
  toX: number;
  /** Nur doorOut/doorIn: Raum, dessen Tür benutzt wird. */
  doorRoomId?: string;
  /** Nur Fahrstuhlsegmente: Ziel-Etage. */
  toFloorLevel?: number;
}

export interface AmbientAgentState {
  def: AmbientAgentDef;
  /** Individuelles Tempo (px/s) — einmal pro Figur gewürfelt. */
  speedPxS: number;
  rng: () => number;
  /** Index in floorLevels für den NÄCHSTEN Auftritt. */
  floorIdx: number;
  /** Ziel-Etage der aktuell geplanten Reise. */
  destinationFloorIdx?: number;
  /** Aktuelle Reise (leer = verborgen). */
  journey: AmbientSegment[];
  /** Wann die nächste Reise geplant wird (verborgen bis dahin). */
  nextJourneyAt: number;
  /** Ernte-Anstoß (nudgeAmbient): Termin ist stale-immun, bis er geplant wurde. */
  nudged?: boolean;
}

export interface AmbientLifeState {
  agents: AmbientAgentState[];
  layout: BuildingLayout;
  /** Bis wann eine geplante Ambient-Fahrt den Fahrstuhl reserviert. */
  elevatorReservedUntil: number;
}

export interface AmbientFigureSnapshot {
  id: string;
  floorLevel: number;
  x: number;
  facing: 1 | -1;
  anim: 'walk' | 'idle';
  sheet: string;
  speedPxS: number;
  /** 0 = im dunklen Raum, 1 = vollständig auf dem Flur. */
  thresholdProgress?: number;
}

export interface AmbientSnapshot {
  figures: AmbientFigureSnapshot[];
  /** Räume, deren Tür gerade von einer Ambient-Figur offen gehalten wird (sortiert). */
  openDoorRoomIds: string[];
  elevator: AmbientElevatorSnapshot | null;
}

export interface AmbientElevatorSnapshot {
  agentId: string;
  phase: 'entering' | 'ride' | 'exiting';
  cabinLevel: number;
  fromLevel: number;
  toLevel: number;
  doorsOpen: boolean;
  idleSheet: string;
}

export interface AmbientTickOptions {
  /** Während der Spieler navigiert, beginnen keine neuen Statisten-Routen. */
  allowStarts?: boolean;
  /** Dichte-Limit; Reduced Motion nutzt 1, normal MAX_ACTIVE_AMBIENT. */
  maxActive?: number;
}

/** Deterministischer PRNG (mulberry32) — gleiche Saat ⇒ gleicher Tagesablauf. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rng: () => number, lo: number, hi: number) => lo + rng() * (hi - lo);
const pick = <T>(rng: () => number, arr: T[]): T => arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];

/** Von Statisten benutzbare Türen einer Etage. */
export function ambientDoorsForLevel(layout: BuildingLayout, level: number): RoomLayout[] {
  return layout.rooms.filter((r) => r.floorLevel === level && !FORBIDDEN_ROOMS.has(r.id));
}

export function createAmbientLife(
  seed: number,
  defs: AmbientAgentDef[] = AMBIENT_AGENTS,
  layout: BuildingLayout = getBuildingLayout(),
): AmbientLifeState {
  const agents = defs.map((def, i) => {
    const rng = mulberry32((seed ^ (i * 0x9e3779b9)) >>> 0);
    const jitter = 1 + (rng() * 2 - 1) * AMBIENT_TIMING.speedJitter;
    return {
      def,
      speedPxS: AMBIENT_TIMING.baseSpeedPxS * jitter,
      rng,
      floorIdx: 0,
      journey: [] as AmbientSegment[],
      nextJourneyAt: def.firstAppearanceMs + rng() * 2000,
    };
  });
  return { agents, layout, elevatorReservedUntil: 0 };
}

/** Zwischenhalt-Position im Flur: frei zwischen den Pfeilern, mit Abstand zu den Türen. */
function waypointX(layout: BuildingLayout, level: number, rng: () => number, avoid: number[]): number {
  const lo = STAGE.pillarWidth + 70;
  const hi = layout.shaft.x - 70;
  for (let tries = 0; tries < 6; tries++) {
    const x = between(rng, lo, hi);
    if (avoid.every((a) => Math.abs(x - a) > 60)) return x;
  }
  return (lo + hi) / 2;
}

function walkSegment(level: number, fromX: number, toX: number, speedPxS: number, t0: number): AmbientSegment {
  const durationMs = Math.max(400, (Math.abs(toX - fromX) / speedPxS) * 1000);
  return { kind: 'walk', t0, t1: t0 + durationMs, floorLevel: level, fromX, toX };
}

/**
 * Eine Reise planen: Tür auf → heraustreten → (Zwischenhalt mit Kontext-Idle) →
 * Navigator-Route zur Ziel-Tür (ruhiges Tempo) → eintreten → Tür zu.
 * Die Geometrie (fromX/toX/doorX) kommt aus planRoute; nur die Lauf-DAUER wird
 * vom Spieler-Tempo aufs Figuren-Tempo umgerechnet.
 */
function planJourney(agent: AmbientAgentState, state: AmbientLifeState, now: number): AmbientSegment[] {
  const { layout } = state;
  const level = agent.def.floorLevels[agent.floorIdx];
  const doors = ambientDoorsForLevel(layout, level);
  if (doors.length === 0) return [];
  const { rng, speedPxS } = agent;
  const exit = pick(rng, doors);
  const otherFloorIndices = agent.def.floorLevels
    .map((_, index) => index)
    .filter((index) => index !== agent.floorIdx && ambientDoorsForLevel(layout, agent.def.floorLevels[index]).length > 0);
  const canUseElevator = otherFloorIndices.length > 0 && now >= state.elevatorReservedUntil;
  const useElevator = canUseElevator && rng() < (agent.def.crossFloorChance ?? 0);
  const destinationFloorIdx = useElevator ? pick(rng, otherFloorIndices) : agent.floorIdx;
  const destinationLevel = agent.def.floorLevels[destinationFloorIdx];
  const targetDoors = ambientDoorsForLevel(layout, destinationLevel);
  const localOthers = targetDoors.filter((d) => d.id !== exit.id);
  const target = localOthers.length > 0 ? pick(rng, localOthers) : targetDoors[0] ?? exit;
  agent.destinationFloorIdx = destinationFloorIdx;

  const T = AMBIENT_TIMING;
  const segs: AmbientSegment[] = [];
  let t = now;
  let x = exit.doorX;

  segs.push({ kind: 'doorOut', t0: t, t1: t + T.doorBeatMs, floorLevel: level, fromX: x, toX: x, doorRoomId: exit.id });
  t += T.doorBeatMs;

  // Zwischenhalt: lokale Wege fast immer, vor dem Fahrstuhl gelegentlich.
  if ((!useElevator && target.id === exit.id) || rng() < (useElevator ? 0.45 : 0.75)) {
    const wp = waypointX(layout, level, rng, [exit.doorX, useElevator ? layout.shaftEntryX : target.doorX]);
    const w = walkSegment(level, x, wp, speedPxS, t);
    segs.push(w);
    t = w.t1;
    x = wp;
    const idleMs = between(rng, T.idleMinMs, T.idleMaxMs);
    segs.push({ kind: 'idle', t0: t, t1: t + idleMs, floorLevel: level, fromX: x, toX: x });
    t += idleMs;
  }

  if (useElevator) {
    const toLift = walkSegment(level, x, layout.shaftEntryX, speedPxS, t);
    segs.push(toLift);
    t = toLift.t1;
    x = layout.shaftEntryX;

    segs.push({
      kind: 'elevatorIn', t0: t, t1: t + T.elevatorTransferMs,
      floorLevel: level, toFloorLevel: destinationLevel, fromX: x, toX: x,
    });
    t += T.elevatorTransferMs;
    const rideMs = Math.max(T.elevatorMsPerFloor, Math.abs(destinationLevel - level) * T.elevatorMsPerFloor);
    segs.push({
      kind: 'elevatorRide', t0: t, t1: t + rideMs,
      floorLevel: level, toFloorLevel: destinationLevel, fromX: x, toX: x,
    });
    t += rideMs;
    segs.push({
      kind: 'elevatorOut', t0: t, t1: t + T.elevatorTransferMs,
      floorLevel: destinationLevel, toFloorLevel: destinationLevel, fromX: x, toX: x,
    });
    t += T.elevatorTransferMs;
    state.elevatorReservedUntil = t;

    const fromLift = walkSegment(destinationLevel, x, target.doorX, speedPxS, t);
    segs.push(fromLift);
    t = fromLift.t1;
    x = target.doorX;
    segs.push({
      kind: 'doorIn', t0: t, t1: t + T.doorBeatMs,
      floorLevel: destinationLevel, fromX: x, toX: x, doorRoomId: target.id,
    });
    return segs;
  }

  // Rest-Route über den BuildingNavigator (gleiches Stockwerk ⇒ walk? + door).
  for (const step of planRoute({ floorLevel: level, x }, target.id, layout)) {
    if (step.kind === 'walk') {
      const w = walkSegment(level, step.fromX, step.toX, speedPxS, t);
      segs.push(w);
      t = w.t1;
      x = step.toX;
    } else if (step.kind === 'door') {
      segs.push({ kind: 'doorIn', t0: t, t1: t + T.doorBeatMs, floorLevel: level, fromX: x, toX: x, doorRoomId: step.roomId });
      t += T.doorBeatMs;
    }
    // 'elevator' kommt nie vor (Start und Ziel liegen auf derselben Etage).
  }
  return segs;
}

/**
 * Zustand fortschreiben: beendete Reisen abräumen (Pause + nächste Etage
 * würfeln), fällige neue Reisen planen. Idempotent bei gleichem `now`.
 */
export function tickAmbientLife(state: AmbientLifeState, now: number, options: AmbientTickOptions = {}): void {
  const allowStarts = options.allowStarts ?? true;
  const maxActive = options.maxActive ?? MAX_ACTIVE_AMBIENT;
  let activeCount = state.agents.filter((agent) => agent.journey.length > 0).length;
  for (const agent of state.agents) {
    if (agent.journey.length > 0) {
      const end = agent.journey[agent.journey.length - 1].t1;
      if (now >= end) {
        agent.journey = [];
        activeCount = Math.max(0, activeCount - 1);
        agent.floorIdx = agent.destinationFloorIdx ?? agent.floorIdx;
        agent.destinationFloorIdx = undefined;
        agent.nextJourneyAt = end + between(agent.rng, AMBIENT_TIMING.pauseMinMs, AMBIENT_TIMING.pauseMaxMs);
      }
    }
    if (agent.journey.length === 0 && now >= agent.nextJourneyAt) {
      if (!allowStarts || activeCount >= maxActive) {
        // Kurzer deterministischer Retry statt stetig wachsender Überfälligkeit.
        agent.nextJourneyAt = now + between(agent.rng, 700, 1700);
        continue;
      }
      if (!agent.nudged && now - agent.nextJourneyAt > STALE_APPOINTMENT_MS) {
        // Termin weit verpasst (Uhr sprang, z. B. Hintergrund-Tab): frisch
        // staffeln statt alle fälligen Agenten im selben Frame auftreten zu lassen.
        agent.nextJourneyAt = now + between(agent.rng, 800, AMBIENT_TIMING.pauseMaxMs);
        continue;
      }
      agent.nudged = false;
      agent.journey = planJourney(agent, state, now);
      if (agent.journey.length === 0) {
        // Etage ohne benutzbare Tür (sollte es nicht geben): Etage überspringen.
        agent.floorIdx = (agent.floorIdx + 1) % agent.def.floorLevels.length;
        agent.nextJourneyAt = now + AMBIENT_TIMING.pauseMinMs;
      } else {
        activeCount++;
      }
    }
  }
}

/** Nur für die Ernte (?vqa=1): nächsten Auftritt einer Figur auf `level` sofort fällig stellen. */
export function nudgeAmbient(state: AmbientLifeState, level: number, now: number): boolean {
  const candidate =
    state.agents.find((a) => a.journey.length === 0 && a.def.floorLevels[a.floorIdx] === level) ??
    state.agents.find((a) => a.journey.length === 0 && a.def.floorLevels.includes(level));
  if (!candidate) return false;
  candidate.floorIdx = candidate.def.floorLevels.indexOf(level);
  candidate.nextJourneyAt = now;
  candidate.nudged = true; // stale-immun (der Abspielkopf kann noch im Preload stehen)
  return true;
}

/** Momentaufnahme für den Renderer: sichtbare Figuren + offene Ambient-Türen. */
export function sampleAmbient(state: AmbientLifeState, now: number): AmbientSnapshot {
  const T = AMBIENT_TIMING;
  const figures: AmbientFigureSnapshot[] = [];
  const openDoors = new Set<string>();
  let elevator: AmbientElevatorSnapshot | null = null;

  for (const agent of state.agents) {
    const journey = agent.journey;
    if (journey.length === 0) continue;

    // Tür-Fenster: doorOut hält die Tür bis kurz NACH dem Heraustreten offen,
    // doorIn öffnet sie kurz BEVOR die Figur ankommt (Blende 240 ms in RoomDoor).
    for (const seg of journey) {
      if (seg.kind === 'doorOut' && seg.doorRoomId && now >= seg.t0 && now < seg.t1 + T.doorTailMs) {
        openDoors.add(seg.doorRoomId);
      } else if (seg.kind === 'doorIn' && seg.doorRoomId && now >= seg.t0 - T.doorLeadMs && now < seg.t1) {
        openDoors.add(seg.doorRoomId);
      }
    }

    const seg = journey.find((s) => now >= s.t0 && now < s.t1);
    if (!seg) continue;

    if (seg.kind === 'doorOut') {
      // Sichtbar erst, wenn das Türblatt weit genug geöffnet ist. Danach läuft
      // sie als Tiefenschritt vom dunklen Raum auf die Flur-Bodenlinie.
      if (now < seg.t0 + T.doorBeatMs * T.emergeFrac) continue;
      const next = journey.find((s) => s.kind === 'walk' && s.t0 >= seg.t1);
      const facing: 1 | -1 = next && next.toX < next.fromX ? -1 : 1;
      const local = (now - seg.t0) / T.doorBeatMs;
      const thresholdProgress = Math.min(1, Math.max(0, (local - T.emergeFrac) / (1 - T.emergeFrac)));
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing, anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS, thresholdProgress });
    } else if (seg.kind === 'walk') {
      const t = (now - seg.t0) / (seg.t1 - seg.t0);
      const x = seg.fromX + (seg.toX - seg.fromX) * t;
      const facing: 1 | -1 = seg.toX >= seg.fromX ? 1 : -1;
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x, facing, anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS });
    } else if (seg.kind === 'idle') {
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing: 1, anim: 'idle', sheet: agent.def.idleSheet, speedPxS: agent.speedPxS });
    } else if (seg.kind === 'elevatorIn') {
      const progress = Math.min(1, Math.max(0, (now - seg.t0) / (seg.t1 - seg.t0)));
      figures.push({
        id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing: 1,
        anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS,
        thresholdProgress: 1 - progress,
      });
      elevator = {
        agentId: agent.def.id, phase: 'entering', cabinLevel: seg.floorLevel,
        fromLevel: seg.floorLevel, toLevel: seg.toFloorLevel ?? seg.floorLevel,
        doorsOpen: true, idleSheet: agent.def.idleSheet,
      };
    } else if (seg.kind === 'elevatorRide') {
      const progress = Math.min(1, Math.max(0, (now - seg.t0) / (seg.t1 - seg.t0)));
      const toLevel = seg.toFloorLevel ?? seg.floorLevel;
      elevator = {
        agentId: agent.def.id, phase: 'ride',
        cabinLevel: seg.floorLevel + (toLevel - seg.floorLevel) * progress,
        fromLevel: seg.floorLevel, toLevel, doorsOpen: false,
        idleSheet: agent.def.idleSheet,
      };
    } else if (seg.kind === 'elevatorOut') {
      const progress = Math.min(1, Math.max(0, (now - seg.t0) / (seg.t1 - seg.t0)));
      const next = journey.find((s) => s.kind === 'walk' && s.t0 >= seg.t1);
      const facing: 1 | -1 = next && next.toX < next.fromX ? -1 : 1;
      figures.push({
        id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing,
        anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS,
        thresholdProgress: progress,
      });
      elevator = {
        agentId: agent.def.id, phase: 'exiting', cabinLevel: seg.floorLevel,
        fromLevel: seg.floorLevel, toLevel: seg.floorLevel,
        doorsOpen: true, idleSheet: agent.def.idleSheet,
      };
    } else if (seg.kind === 'doorIn') {
      // Umgekehrter Tiefenschritt: auf der Schwelle kleiner/dunkler werden und
      // erst am Segmentende hinter dem Türblatt verschwinden.
      const thresholdProgress = 1 - Math.min(1, Math.max(0, (now - seg.t0) / T.doorBeatMs));
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing: 1, anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS, thresholdProgress });
    }
  }

  return { figures, openDoorRoomIds: [...openDoors].sort(), elevator };
}

/**
 * Lauf-Takt ans eigene Tempo koppeln (kein Foot-Sliding, wie beim Avatar):
 * ein voller 8-Frame-Zyklus = 2 Schritte ≈ 1,5 Körperbreiten der Figur.
 */
export function ambientWalkFrameTimeMs(speedPxS: number, displayHeightPx: number): number {
  const bodyWidth = 48 * (displayHeightPx / 96);
  const cycleStridePx = 1.5 * bodyWidth;
  const ms = ((cycleStridePx / speedPxS) * 1000) / 8;
  return Math.max(110, Math.min(340, Math.round(ms)));
}
