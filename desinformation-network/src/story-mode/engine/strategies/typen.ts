/**
 * Schmale Formen für die Berater-Strategien.
 *
 * Die vier Strategien rechneten auf `any`: `actionHistory: any[]`,
 * `action: any`, `actor: any`, `event: any`. Damit sah `tsc` nicht, welche
 * Felder gemeint sind — ein Tippfehler im Feldnamen wäre still durchgegangen
 * und hätte eine Empfehlung dauerhaft auf 0 gerechnet.
 *
 * Bewusst NUR die Felder, die hier tatsächlich gelesen werden: Diese Module
 * sollen nicht an jedem Umbau der großen Engine-Typen hängen.
 */

/** Ein Eintrag der Aktions-Historie, so wie die Strategien ihn lesen. */
export interface GespielteAktion {
  actionId: string;
  costs?: { budget?: number };
  effects?: { trustImpact?: number; trust_impact?: number };
}

/** Eine wählbare Maßnahme, so wie die Strategien sie lesen. */
export interface WaehlbareAktion {
  id: string;
  label_de?: string;
  tags?: string[];
  costs: { budget?: number };
  effects?: { trustImpact?: number; trust_impact?: number };
}

/** Ein Akteur im Netz, so wie Katja ihn bewertet. */
export interface BewerteterAkteur {
  category: string;
  trust: number;
  influence: number;
  isRecruited?: boolean;
  resilience?: number;
}

/** Ein Weltereignis, so wie Marina es auf Maßnahmen abbildet. */
export interface RelevantesEreignis {
  id?: string;
  name?: string;
  headline_de?: string;
  headline_en?: string;
  tags?: string[];
  type?: string;
  phase?: number;
}
