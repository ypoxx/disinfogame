/**
 * ambientLife — LB „Lebendiges Gebäude" (Plan §3b c).
 *
 * Statisten laufen ECHTE Routen über ihre Etage (Ziele = Türen), erscheinen aus
 * sich öffnenden Türen und verschwinden wieder in ihnen — KEIN Ein-/Ausfaden,
 * keine CSS-Pendel-Keyframes mehr. Die Routen kommen aus dem vorhandenen
 * BuildingNavigator (planRoute): Ambient-Figuren sind Navigator-Instanzen mit
 * ruhigem Tempo (Memo §3: ~44 px/s ± 22 % je Figur statt 300 px/s Spieler).
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
  baseSpeedPxS: 44,
  /** ± Tempo-Streuung je Figur (Memo §3: 15–25 %). */
  speedJitter: 0.22,
  /** Kontext-Idle unterwegs (steht kurz, schaut). */
  idleMinMs: 2000,
  idleMaxMs: 4000,
  /** Verborgen zwischen zwei Auftritten (Frequenz ruhig, SOUL §3.4). */
  pauseMinMs: 9000,
  pauseMaxMs: 20000,
  /** Tür-Beat = Navigator-Türzeit (650 ms, im 0,5–1-s-Fenster). */
  doorBeatMs: NAV_SPEED.doorMs,
  /** Tür bleibt nach dem Heraustreten kurz offen (schließt hinter der Figur). */
  doorTailMs: 300,
  /** Tür öffnet, BEVOR die Figur sie erreicht (kein Warten vor verschlossener Tür). */
  doorLeadMs: 250,
  /** Anteil des Tür-Beats, ab dem die heraustretende Figur sichtbar ist (Blende offen). */
  emergeFrac: 0.45,
  /** Anteil des Tür-Beats, ab dem die eintretende Figur drinnen (unsichtbar) ist. */
  vanishFrac: 0.75,
} as const;

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
}

/**
 * Besetzung: Reinigung wandert alle Flur-Etagen ab (Fahrstuhl-Nutzung ist lt.
 * Plan optionale Ausbaustufe — zwischen den Etagen nimmt sie unsichtbar die
 * Diensttreppe, d. h. sie verschwindet durch eine Tür und taucht später auf der
 * nächsten Etage aus einer Tür auf). Die Akten-Boten ersetzen die alten
 * Tür-Dummies auf Etage 4/3 durch echte Tür-zu-Tür-Routen.
 */
export const AMBIENT_AGENTS: AmbientAgentDef[] = [
  { id: 'reinigung', walkSheet: 'figure_cleaner_walk', idleSheet: 'figure_cleaner', floorLevels: [3, 1, 4, -1, 2], firstAppearanceMs: 4000 },
  { id: 'bote_e4', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [4], firstAppearanceMs: 10000 },
  { id: 'bote_e3', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [3], firstAppearanceMs: 17000 },
  { id: 'bote_e2', walkSheet: 'figure_clerk_walk', idleSheet: 'figure_clerk', floorLevels: [2], firstAppearanceMs: 26000 },
];

/** Türen, die Statisten NIE benutzen: die Lobby hat keine Tür, und aus dem
 *  Büro des SPIELERS darf niemand Fremdes treten (falsche Erzählung). */
const FORBIDDEN_ROOMS = new Set(['lobby', 'spieler_buero']);

export type AmbientSegmentKind = 'doorOut' | 'walk' | 'idle' | 'doorIn';

export interface AmbientSegment {
  kind: AmbientSegmentKind;
  t0: number;
  t1: number;
  floorLevel: number;
  fromX: number;
  toX: number;
  /** Nur doorOut/doorIn: Raum, dessen Tür benutzt wird. */
  doorRoomId?: string;
}

export interface AmbientAgentState {
  def: AmbientAgentDef;
  /** Individuelles Tempo (px/s) — einmal pro Figur gewürfelt. */
  speedPxS: number;
  rng: () => number;
  /** Index in floorLevels für den NÄCHSTEN Auftritt. */
  floorIdx: number;
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
}

export interface AmbientFigureSnapshot {
  id: string;
  floorLevel: number;
  x: number;
  facing: 1 | -1;
  anim: 'walk' | 'idle';
  sheet: string;
  speedPxS: number;
}

export interface AmbientSnapshot {
  figures: AmbientFigureSnapshot[];
  /** Räume, deren Tür gerade von einer Ambient-Figur offen gehalten wird (sortiert). */
  openDoorRoomIds: string[];
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
  return { agents, layout };
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
function planJourney(agent: AmbientAgentState, layout: BuildingLayout, now: number): AmbientSegment[] {
  const level = agent.def.floorLevels[agent.floorIdx];
  const doors = ambientDoorsForLevel(layout, level);
  if (doors.length === 0) return [];
  const { rng, speedPxS } = agent;
  const exit = pick(rng, doors);
  const others = doors.filter((d) => d.id !== exit.id);
  const target = others.length > 0 ? pick(rng, others) : exit;

  const T = AMBIENT_TIMING;
  const segs: AmbientSegment[] = [];
  let t = now;
  let x = exit.doorX;

  segs.push({ kind: 'doorOut', t0: t, t1: t + T.doorBeatMs, floorLevel: level, fromX: x, toX: x, doorRoomId: exit.id });
  t += T.doorBeatMs;

  // Zwischenhalt: bei Selbe-Tür-Routen immer (sonst gäbe es keinen Weg),
  // ansonsten meistens — die Figur „arbeitet" kurz im Flur (Kontext-Idle).
  if (target.id === exit.id || rng() < 0.75) {
    const wp = waypointX(layout, level, rng, [exit.doorX, target.doorX]);
    const w = walkSegment(level, x, wp, speedPxS, t);
    segs.push(w);
    t = w.t1;
    x = wp;
    const idleMs = between(rng, T.idleMinMs, T.idleMaxMs);
    segs.push({ kind: 'idle', t0: t, t1: t + idleMs, floorLevel: level, fromX: x, toX: x });
    t += idleMs;
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
export function tickAmbientLife(state: AmbientLifeState, now: number): void {
  for (const agent of state.agents) {
    if (agent.journey.length > 0) {
      const end = agent.journey[agent.journey.length - 1].t1;
      if (now >= end) {
        agent.journey = [];
        agent.floorIdx = (agent.floorIdx + 1) % agent.def.floorLevels.length;
        agent.nextJourneyAt = end + between(agent.rng, AMBIENT_TIMING.pauseMinMs, AMBIENT_TIMING.pauseMaxMs);
      }
    }
    if (agent.journey.length === 0 && now >= agent.nextJourneyAt) {
      if (!agent.nudged && now - agent.nextJourneyAt > STALE_APPOINTMENT_MS) {
        // Termin weit verpasst (Uhr sprang, z. B. Hintergrund-Tab): frisch
        // staffeln statt alle fälligen Agenten im selben Frame auftreten zu lassen.
        agent.nextJourneyAt = now + between(agent.rng, 800, AMBIENT_TIMING.pauseMaxMs);
        continue;
      }
      agent.nudged = false;
      agent.journey = planJourney(agent, state.layout, now);
      if (agent.journey.length === 0) {
        // Etage ohne benutzbare Tür (sollte es nicht geben): Etage überspringen.
        agent.floorIdx = (agent.floorIdx + 1) % agent.def.floorLevels.length;
        agent.nextJourneyAt = now + AMBIENT_TIMING.pauseMinMs;
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
      // Sichtbar erst, wenn die Tür-Blende offen ist — die Figur tritt HERAUS.
      if (now < seg.t0 + T.doorBeatMs * T.emergeFrac) continue;
      const next = journey.find((s) => s.kind === 'walk' && s.t0 >= seg.t1);
      const facing: 1 | -1 = next && next.toX < next.fromX ? -1 : 1;
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing, anim: 'idle', sheet: agent.def.idleSheet, speedPxS: agent.speedPxS });
    } else if (seg.kind === 'walk') {
      const t = (now - seg.t0) / (seg.t1 - seg.t0);
      const x = seg.fromX + (seg.toX - seg.fromX) * t;
      const facing: 1 | -1 = seg.toX >= seg.fromX ? 1 : -1;
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x, facing, anim: 'walk', sheet: agent.def.walkSheet, speedPxS: agent.speedPxS });
    } else if (seg.kind === 'idle') {
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing: 1, anim: 'idle', sheet: agent.def.idleSheet, speedPxS: agent.speedPxS });
    } else if (seg.kind === 'doorIn') {
      // Sichtbar bis die Figur „drinnen" ist — sie verschwindet IN der Tür.
      if (now >= seg.t0 + T.doorBeatMs * T.vanishFrac) continue;
      figures.push({ id: agent.def.id, floorLevel: seg.floorLevel, x: seg.fromX, facing: 1, anim: 'idle', sheet: agent.def.idleSheet, speedPxS: agent.speedPxS });
    }
  }

  return { figures, openDoorRoomIds: [...openDoors].sort() };
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
