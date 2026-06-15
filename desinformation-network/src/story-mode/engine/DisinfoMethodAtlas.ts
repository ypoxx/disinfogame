/**
 * DisinfoMethodAtlas — der Bildungs-Kern (SOUL §5, G22).
 *
 * Übersetzt das, WAS der Spieler getan hat (Aktions-Tags, genutzte Verbreiter/
 * Plattformen, Operationen, Kompromat), in die REALEN Desinformations-Methoden
 * dahinter. So wird der End-Report zum Lernmoment: nicht „du hast Tag X benutzt",
 * sondern „das ist Methode Y, hier ein echter Fall".
 *
 * BEWUSST BREIT: Das Kommunikations-Schlachtfeld (Kompromat) ist nur EINE Familie
 * unter vielen (Owner-Hinweis: das Beispiel ist Anker, keine Grenze). Pure +
 * deterministisch → vitest-first testbar, kein React.
 *
 * Datenquelle: data/disinfo_methods.json (editierbarer Atlas).
 */
import methodsData from '../data/disinfo_methods.json';

// ─── Typen ──────────────────────────────────────────────────────────────────

export type MethodSeverity = 'niedrig' | 'mittel' | 'hoch';

/** Ein Methoden-Eintrag aus dem Atlas (Daten). */
export interface DisinfoMethod {
  id: string;
  label_de: string;
  real_method_de: string;
  what_de: string;
  real_case_de: string;
  /** P7/B4 — „So wäre es erkannt/gekontert worden" (Resilienz-Geländer, optional). */
  counter_de?: string;
  severity: MethodSeverity;
  matchTags: string[];
  matchCarriers: string[];
  matchPlatforms: string[];
  /** Sonder-Auslöser: 'operation' (eine Operation gespielt), 'kompromat' (beschafft). */
  matchKinds: Array<'operation' | 'kompromat'>;
}

/** Eine erkannte Methode mit Beleg-Gewicht — für den End-Report. */
export interface MethodInsight {
  id: string;
  label_de: string;
  real_method_de: string;
  what_de: string;
  real_case_de: string;
  /** P7/B4 — „So wäre es erkannt/gekontert worden" (Resilienz-Geländer). */
  counter_de?: string;
  severity: MethodSeverity;
  /** Beleg-Gewicht (Summe getroffener Tags/Verbreiter/Plattformen/Operationen). */
  count: number;
  /** Kurzbeleg „woran erkannt" (z. B. „14 Maßnahmen · Verbreiter: Bot-Netz"). */
  evidence_de: string;
}

/** Minimaler Aktions-Eintrag (id → tags) für die Klassifikation. */
export interface MethodActionEntry {
  id: string;
  tags?: string[];
}

/** Was der Spieler tat — Eingabe für die Klassifikation (alles optional/additiv). */
export interface MethodUsage {
  /** Alle ausgeführten Aktions-ids (können mehrfach vorkommen). */
  completedActionIds: string[];
  /** Katalog id → tags (z. B. die verfügbaren/bekannten Aktionen). */
  catalog: MethodActionEntry[];
  /** Verbreiter-ids, die aufgebaut/genutzt wurden (P2). */
  carriersUsed?: string[];
  /** Plattform-ids, die in Operationen bespielt wurden (P2). */
  platformsUsed?: string[];
  /** Anzahl ausgespielter Operationen (P2 Schlachtfeld). */
  operationsPlayed?: number;
  /** Anzahl beschaffter Kompromat-Posten (P2). */
  kompromatAcquired?: number;
}

// ─── Loader ─────────────────────────────────────────────────────────────────

export function loadDisinfoMethods(): DisinfoMethod[] {
  return (methodsData as { methods: DisinfoMethod[] }).methods;
}

// ─── Klassifikation (pure) ────────────────────────────────────────────────────

/**
 * Klassifiziert die Spielweise in reale Methoden-Familien.
 * Gibt nur Familien mit Beleg (count > 0) zurück, absteigend nach Gewicht.
 */
export function classifyMethods(
  usage: MethodUsage,
  methods: DisinfoMethod[] = loadDisinfoMethods(),
): MethodInsight[] {
  // 1) Tag-Häufigkeit über die tatsächlich ausgeführten Aktionen aufbauen.
  const tagsById = new Map<string, string[]>();
  for (const a of usage.catalog) tagsById.set(a.id, a.tags ?? []);

  const tagCounts = new Map<string, number>();
  for (const id of usage.completedActionIds) {
    for (const tag of tagsById.get(id) ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const carriers = new Set(usage.carriersUsed ?? []);
  const platforms = new Set(usage.platformsUsed ?? []);
  const ops = usage.operationsPlayed ?? 0;
  const kompromat = usage.kompromatAcquired ?? 0;

  const insights: MethodInsight[] = [];

  for (const m of methods) {
    let count = 0;
    const evidence: string[] = [];

    // Tag-Belege (gewichtet nach Häufigkeit).
    let tagHits = 0;
    for (const tag of m.matchTags) tagHits += tagCounts.get(tag) ?? 0;
    if (tagHits > 0) {
      count += tagHits;
      evidence.push(`${tagHits} Maßnahme${tagHits === 1 ? '' : 'n'}`);
    }

    // Verbreiter-Belege.
    const carrierHits = m.matchCarriers.filter((c) => carriers.has(c));
    if (carrierHits.length > 0) {
      count += carrierHits.length * 3; // Verbreiter wiegen schwerer als ein Einzel-Tag
      evidence.push(`Verbreiter genutzt`);
    }

    // Plattform-Belege.
    const platformHits = m.matchPlatforms.filter((p) => platforms.has(p));
    if (platformHits.length > 0) {
      count += platformHits.length;
      evidence.push(`Plattform bespielt`);
    }

    // Sonder-Auslöser (Operation/Kompromat).
    if (m.matchKinds.includes('operation') && ops > 0) {
      count += ops * 2;
      evidence.push(`${ops} Operation${ops === 1 ? '' : 'en'}`);
    }
    if (m.matchKinds.includes('kompromat') && kompromat > 0) {
      count += kompromat * 2;
      evidence.push(`${kompromat}× Kompromat`);
    }

    if (count > 0) {
      insights.push({
        id: m.id,
        label_de: m.label_de,
        real_method_de: m.real_method_de,
        what_de: m.what_de,
        real_case_de: m.real_case_de,
        counter_de: m.counter_de,
        severity: m.severity,
        count,
        evidence_de: evidence.join(' · '),
      });
    }
  }

  // Stabil sortieren: nach Gewicht, dann alphabetisch (Determinismus für Tests).
  return insights.sort((a, b) => b.count - a.count || a.label_de.localeCompare(b.label_de));
}
