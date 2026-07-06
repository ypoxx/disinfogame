/**
 * ambientLife (LB „Lebendiges Gebäude"): Statisten erscheinen/verschwinden NUR
 * durch offene Türen (kein Fade, kein Teleport), laufen stetig mit ruhigem
 * Tempo, und der Ablauf ist deterministisch (gleiche Saat ⇒ gleicher Tag).
 */
import { describe, it, expect } from 'vitest';
import {
  createAmbientLife,
  tickAmbientLife,
  sampleAmbient,
  nudgeAmbient,
  ambientDoorsForLevel,
  ambientWalkFrameTimeMs,
  AMBIENT_AGENTS,
  AMBIENT_TIMING,
  type AmbientFigureSnapshot,
} from '../building/ambientLife';
import { getBuildingLayout, STAGE } from '../building/buildingLayout';

const layout = getBuildingLayout();
const STEP_MS = 50;

interface Sample {
  t: number;
  figures: Map<string, AmbientFigureSnapshot>;
  openDoors: Set<string>;
}

function simulate(seed: number, untilMs: number, stepMs = STEP_MS): Sample[] {
  const state = createAmbientLife(seed);
  const samples: Sample[] = [];
  for (let t = 0; t <= untilMs; t += stepMs) {
    tickAmbientLife(state, t);
    const snap = sampleAmbient(state, t);
    samples.push({
      t,
      figures: new Map(snap.figures.map((f) => [f.id, f])),
      openDoors: new Set(snap.openDoorRoomIds),
    });
  }
  return samples;
}

const doorXsForLevel = (level: number) => layout.rooms.filter((r) => r.floorLevel === level).map((r) => r.doorX);

describe('ambientLife (LB)', () => {
  it('ist deterministisch: gleiche Saat ⇒ identischer Ablauf', () => {
    const a = simulate(1234, 90_000);
    const b = simulate(1234, 90_000);
    const ser = (s: Sample[]) =>
      JSON.stringify(s.map((x) => [[...x.figures.values()], [...x.openDoors].sort()]));
    expect(ser(a)).toBe(ser(b));
  });

  it('unterschiedliche Saat ⇒ unterschiedlicher Ablauf', () => {
    const a = simulate(1, 60_000);
    const b = simulate(2, 60_000);
    const ser = (s: Sample[]) => JSON.stringify(s.map((x) => [...x.figures.values()]));
    expect(ser(a)).not.toBe(ser(b));
  });

  it('keine Teleports: sichtbare Figuren bewegen sich höchstens mit Figuren-Tempo', () => {
    const samples = simulate(77, 240_000);
    for (let i = 1; i < samples.length; i++) {
      for (const [id, f] of samples[i].figures) {
        const prev = samples[i - 1].figures.get(id);
        if (!prev) continue; // gerade aus einer Tür getreten — kein Bewegungs-Check
        expect(prev.floorLevel, `${id} wechselt sichtbar die Etage`).toBe(f.floorLevel);
        // Enges Epsilon statt +0,5 px Slack: 18 % Übergeschwindigkeit (echtes
        // Foot-Sliding) überlebte die lockere Grenze (Review-Mutationstest).
        const maxDx = (f.speedPxS * STEP_MS) / 1000 + 0.01;
        expect(Math.abs(f.x - prev.x), `${id} springt bei t=${samples[i].t}`).toBeLessThanOrEqual(maxDx);
      }
    }
  });

  it('Erscheinen/Verschwinden passiert NUR an einer Tür — und die Tür ist dabei offen', () => {
    const samples = simulate(99, 240_000);
    let transitions = 0;
    for (let i = 1; i < samples.length; i++) {
      const prev = samples[i - 1];
      const cur = samples[i];
      const ids = new Set([...prev.figures.keys(), ...cur.figures.keys()]);
      for (const id of ids) {
        const was = prev.figures.get(id);
        const is = cur.figures.get(id);
        if (!!was === !!is) continue; // keine Sichtbarkeits-Änderung
        transitions++;
        const f = (is ?? was)!;
        const sample = is ? cur : prev; // Tür muss im sichtbaren Moment offen sein
        const doors = layout.rooms.filter(
          (r) => r.floorLevel === f.floorLevel && Math.abs(r.doorX - f.x) < 1,
        );
        expect(doors.length, `${id} bei t=${cur.t}: (ent)steht abseits jeder Tür (x=${f.x})`).toBeGreaterThan(0);
        expect(
          doors.some((d) => sample.openDoors.has(d.id)),
          `${id} bei t=${cur.t}: Tür ${doors[0]?.id} ist beim Übergang nicht offen`,
        ).toBe(true);
      }
    }
    // Der Ablauf enthält tatsächlich Auftritte (sonst prüft der Test nichts).
    expect(transitions).toBeGreaterThan(4);
  });

  it('benutzt NIE die Lobby oder das Spieler-Büro als Tür', () => {
    const samples = simulate(5, 300_000);
    for (const s of samples) {
      expect(s.openDoors.has('lobby')).toBe(false);
      expect(s.openDoors.has('spieler_buero')).toBe(false);
    }
  });

  it('die Reinigung wandert über mehrere Etagen (Plan §3b c)', () => {
    const samples = simulate(42, 420_000);
    const floors = new Set<number>();
    for (const s of samples) {
      const f = s.figures.get('reinigung');
      if (f) floors.add(f.floorLevel);
    }
    expect(floors.size).toBeGreaterThanOrEqual(3);
  });

  it('Gehen nutzt das Walk-Sheet, Stehen das Idle-Sheet (kein Foot-Sliding)', () => {
    const samples = simulate(7, 240_000);
    for (let i = 1; i < samples.length; i++) {
      for (const [id, f] of samples[i].figures) {
        const def = AMBIENT_AGENTS.find((a) => a.id === id)!;
        expect(f.sheet, `${id}: Sheet passt nicht zur Animation`).toBe(f.anim === 'walk' ? def.walkSheet : def.idleSheet);
        const prev = samples[i - 1].figures.get(id);
        if (!prev) continue;
        const dx = Math.abs(f.x - prev.x);
        // Segmentgrenzen können in ein Sample-Fenster fallen — geprüft werden
        // nur Paare, die VOLL im selben Zustand liegen (walk/walk bzw. idle/idle).
        if (prev.anim === 'walk' && f.anim === 'walk') {
          expect(dx, `${id} gleitet nicht: Walk-Animation ohne Bewegung bei t=${samples[i].t}`).toBeGreaterThan(0);
        } else if (prev.anim === 'idle' && f.anim === 'idle') {
          expect(dx, `${id} rutscht im Stehen bei t=${samples[i].t}`).toBeLessThanOrEqual(0.01);
        }
      }
    }
  });

  it('Figuren bleiben im Flur (zwischen Pfeiler und Fahrstuhl-Schacht)', () => {
    const samples = simulate(13, 240_000);
    for (const s of samples) {
      for (const f of s.figures.values()) {
        expect(f.x).toBeGreaterThanOrEqual(STAGE.pillarWidth);
        expect(f.x).toBeLessThanOrEqual(layout.shaft.x);
      }
    }
  });

  it('Tür-Beat bleibt im ruhigen Fenster (keine Dauer-offen-Tür)', () => {
    const samples = simulate(21, 240_000);
    const openSince = new Map<string, number>();
    for (const s of samples) {
      for (const d of s.openDoors) if (!openSince.has(d)) openSince.set(d, s.t);
      for (const [d, since] of [...openSince]) {
        if (!s.openDoors.has(d)) {
          openSince.delete(d);
          continue;
        }
        // Fenster je Nutzung: Beat (650) + Vorlauf/Nachlauf — mit Luft für
        // seltene Überlappung zweier Figuren an derselben Tür.
        expect(s.t - since, `Tür ${d} steht zu lange offen`).toBeLessThanOrEqual(
          2 * (AMBIENT_TIMING.doorBeatMs + AMBIENT_TIMING.doorTailMs + AMBIENT_TIMING.doorLeadMs),
        );
      }
    }
  });

  it('Reise-Segmente sind lückenlos und liegen auf existierenden Türen', () => {
    const state = createAmbientLife(3);
    // Alle Agenten zwingen, sofort zu planen.
    for (const a of state.agents) a.nextJourneyAt = 0;
    tickAmbientLife(state, 0);
    for (const a of state.agents) {
      expect(a.journey.length).toBeGreaterThanOrEqual(3); // doorOut … doorIn
      expect(a.journey[0].kind).toBe('doorOut');
      expect(a.journey[a.journey.length - 1].kind).toBe('doorIn');
      for (let i = 1; i < a.journey.length; i++) {
        expect(a.journey[i].t0).toBeCloseTo(a.journey[i - 1].t1, 5);
      }
      for (const seg of a.journey) {
        if (seg.kind === 'doorOut' || seg.kind === 'doorIn') {
          const room = layout.rooms.find((r) => r.id === seg.doorRoomId);
          expect(room, `${seg.doorRoomId} unbekannt`).toBeTruthy();
          expect(Math.abs(room!.doorX - seg.fromX)).toBeLessThan(1);
        }
      }
    }
  });

  it('nudgeAmbient (Ernte-Hilfe) stellt einen Auftritt auf der Ziel-Etage sofort fällig', () => {
    const state = createAmbientLife(11);
    const ok = nudgeAmbient(state, 2, 1000);
    expect(ok).toBe(true);
    tickAmbientLife(state, 1000);
    const active = state.agents.find((a) => a.journey.length > 0 && a.journey[0].floorLevel === 2);
    expect(active).toBeTruthy();
  });

  it('ambientDoorsForLevel schließt Lobby/Spieler-Büro aus', () => {
    for (const floor of layout.floors) {
      const doors = ambientDoorsForLevel(layout, floor.level);
      for (const d of doors) {
        expect(d.floorLevel).toBe(floor.level);
        expect(['lobby', 'spieler_buero']).not.toContain(d.id);
      }
    }
    // Erdgeschoss (nur Lobby) bietet keine Statisten-Türen.
    expect(ambientDoorsForLevel(layout, 0)).toHaveLength(0);
  });

  it('alle Agenten-Etagen existieren und haben mindestens eine benutzbare Tür', () => {
    for (const def of AMBIENT_AGENTS) {
      for (const level of def.floorLevels) {
        expect(layout.floors.some((f) => f.level === level), `${def.id}: Etage ${level}`).toBe(true);
        expect(ambientDoorsForLevel(layout, level).length, `${def.id}: Etage ${level} ohne Tür`).toBeGreaterThan(0);
      }
    }
  });

  it('Blenden-Timing-Invarianten: Tür ist sichtbar offen, wenn Figuren sie nutzen', () => {
    const T = AMBIENT_TIMING;
    // Tür-Beat im ruhigen Memo-§3-Fenster (0,5–1 s).
    expect(T.doorBeatMs).toBeGreaterThanOrEqual(500);
    expect(T.doorBeatMs).toBeLessThanOrEqual(1000);
    // RoomDoor blendet in 240 ms — die Figur darf erst NACH offener Blende
    // erscheinen, die Tür muss VOR Ankunft offen sein und nach dem
    // Heraustreten kurz offen bleiben (sonst wirkt es wie Teleport/Fade).
    expect(T.emergeFrac * T.doorBeatMs).toBeGreaterThanOrEqual(240);
    expect(T.doorLeadMs).toBeGreaterThanOrEqual(240);
    expect(T.doorTailMs).toBeGreaterThan(0);
    // Die Figur verschwindet, BEVOR die Tür wieder schließt.
    expect(T.vanishFrac).toBeGreaterThan(0.5);
    expect(T.vanishFrac).toBeLessThan(1);
  });

  it('verpasste Termine werden neu gestaffelt (kein Massen-Auftritt nach Uhr-Sprung)', () => {
    const state = createAmbientLife(9);
    // Uhr springt weit hinter ALLE Erst-Termine (Remount/Hintergrund-Tab-Fall).
    tickAmbientLife(state, 120_000);
    // Niemand tritt sofort auf …
    expect(sampleAmbient(state, 120_000).figures).toHaveLength(0);
    for (const a of state.agents) {
      expect(a.journey).toHaveLength(0);
      // … alle Termine liegen frisch gestaffelt in der Zukunft.
      expect(a.nextJourneyAt).toBeGreaterThan(120_000);
    }
    const times = state.agents.map((a) => Math.round(a.nextJourneyAt));
    expect(new Set(times).size).toBe(times.length); // gestaffelt, nicht synchron
    // Ein Ernte-Nudge bleibt trotz Uhr-Sprungs sofort wirksam (stale-immun).
    expect(nudgeAmbient(state, 3, 121_000)).toBe(true);
    tickAmbientLife(state, 125_000);
    expect(state.agents.some((a) => a.journey.length > 0 && a.journey[0].floorLevel === 3)).toBe(true);
  });

  it('Lauf-Takt koppelt an das Tempo (schneller ⇒ kürzere Frames) und ist geklemmt', () => {
    const slow = ambientWalkFrameTimeMs(30, 112);
    const fast = ambientWalkFrameTimeMs(60, 112);
    expect(fast).toBeLessThan(slow);
    expect(ambientWalkFrameTimeMs(1, 112)).toBeLessThanOrEqual(340);
    expect(ambientWalkFrameTimeMs(1000, 112)).toBeGreaterThanOrEqual(110);
  });
});
