/**
 * BattlefieldChain — „Kommunikations-Schlachtfeld" (P2), reine Zustandsmaschine.
 *
 * Bildet die zwei Achsen aus docs/STRANG34_P2_VERBREITER_PLATTFORM_KONZEPT.md ab:
 *   Verbreiter (WER) × Plattform-Mix (WO) → Wirkung / Reichweite / Enttarnungs-Risiko.
 * Bewusst PURE + deterministisch (kein React, kein Math.random) — Bildungszweck verlangt
 * nachvollziehbare Formeln, und so ist die Logik vitest-first testbar (Feinplan P2c).
 *
 * Kette: Ziel → Dossier → Kompromat → Verbreiter → Plattform-Mix → Ausspielen.
 */
import targetsData from '../data/targets.json';
import carriersData from '../data/carriers.json';
import platformsData from '../data/platforms.json';

// ─── Typen ──────────────────────────────────────────────────────────────────

export interface Vulnerability {
  id: string;
  label_de: string;
  heikelheit: number;        // 0..1 — wie brisant/riskant der Einsatz ist
  glaubwuerdigkeit: number;  // 0..1 — wie überzeugend das Material wirkt
  beschafft?: boolean;       // im Dossier-Schritt aufgedeckt?
}

export interface Target {
  id: string;
  name: string;
  role_de: string;
  milieu: string;
  fiktiv: boolean;
  standing: number;          // 0..1 — Ansehen des Ziels
  vulnerabilities: Vulnerability[];
}

export interface Carrier {
  id: string;
  label_de: string;
  reach: number;             // 0..1
  credibility: number;       // 0..1
  exposure: number;          // 0..1 — Grund-Enttarnungs-Risiko
  milieus: string[];
  buildCost: { budget: number; capacity: number; phases: number };
}

export interface Platform {
  id: string;
  label_de: string;
  reach: number;             // 0..1
  decay: number;             // 0..1 — wie schnell die Wirkung verfällt
  moderation: number;        // 0..1 — Faktencheck/Löschdruck
  milieus: string[];
}

export interface OperationInput {
  target: Target;
  vulnerability: Vulnerability;
  carrier: Carrier;
  platforms: Platform[];
  /** 0..1 — aktueller Faktencheck-/Gegendruck (z. B. attention/100). */
  factcheckPressure?: number;
  /** 0..1 — wie gesättigt der Informationsraum schon ist. */
  saturation?: number;
}

export interface OperationResult {
  reach: number;          // 0..1 — effektive Reichweite
  milieuFit: number;      // 0..1 — Passung zum Ziel-Milieu
  impact: number;         // 0..1 — Wirkung gegen das Ziel
  exposureRisk: number;   // 0..1 — Enttarnungs-Risiko/Schärfe
  headline_de: string;
}

// ─── Hilfen ─────────────────────────────────────────────────────────────────

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Probabilistische Vereinigung: mehr Plattformen = mehr Reichweite, aber abnehmend. */
export function combinedPlatformReach(platforms: Platform[]): number {
  if (platforms.length === 0) return 0;
  return clamp01(1 - platforms.reduce((p, pf) => p * (1 - clamp01(pf.reach)), 1));
}

/** Wie gut Verbreiter + Plattformen das Ziel-Milieu treffen (0..1). */
export function milieuFit(carrier: Carrier, platforms: Platform[], target: Target): number {
  const carrierMatch = carrier.milieus.length === 0
    ? 0.2 // milieu-loses Rauschen (z. B. Bot-Netz)
    : carrier.milieus.includes(target.milieu) ? 1 : 0.3;
  const platformMatch = platforms.length === 0
    ? 0
    : avg(platforms.map((p) => (p.milieus.includes(target.milieu) ? 1 : 0.3)));
  return clamp01(Math.max(0.15, 0.5 * carrierMatch + 0.5 * platformMatch));
}

// ─── Kern: eine Operation bewerten ───────────────────────────────────────────

export function evaluateOperation(input: OperationInput): OperationResult {
  const { target, vulnerability, carrier, platforms } = input;
  const factcheckPressure = clamp01(input.factcheckPressure ?? 0);
  const saturation = clamp01(input.saturation ?? 0);

  const platReach = combinedPlatformReach(platforms);
  const reach = clamp01(carrier.reach * platReach);
  const fit = milieuFit(carrier, platforms, target);
  const avgModeration = avg(platforms.map((p) => p.moderation));

  // Faktencheck dämpft v. a. unglaubwürdige Verbreiter auf gut moderierten Plattformen.
  const factcheckDampen = clamp01(factcheckPressure * avgModeration * (1 - carrier.credibility));

  const impact = clamp01(
    reach * fit * vulnerability.glaubwuerdigkeit * (1 - factcheckDampen) * (1 - saturation * 0.5),
  );

  const exposureRisk = clamp01(
    0.4 * carrier.exposure +
    0.25 * avgModeration +
    0.25 * vulnerability.heikelheit +
    0.1 * saturation,
  );

  return {
    reach,
    milieuFit: fit,
    impact,
    exposureRisk,
    headline_de: `„${target.name}: ${vulnerability.label_de}" — gestreut über ${carrier.label_de}`,
  };
}

// ─── Daten-Loader ─────────────────────────────────────────────────────────────

export function loadTargets(): Target[] {
  return (targetsData as { targets: Target[] }).targets;
}
export function loadCarriers(): Carrier[] {
  return (carriersData as { carriers: Carrier[] }).carriers;
}
export function loadPlatforms(): Platform[] {
  return (platformsData as { platforms: Platform[] }).platforms;
}
