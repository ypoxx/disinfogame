// ===========================================
// KOSTEN-WÄCHTER
// ===========================================
// OpenRouter liefert Preise als USD-pro-Token-Strings im Modell-Katalog.
// Wir schätzen VOR dem Aufruf den Höchstpreis (Prompt + maximal erlaubte
// Antwort) und brechen ab, bevor Kosten entstehen. Nach dem Aufruf wird mit
// der echten Nutzung nachgerechnet.

export class BudgetUeberschritten extends Error {}

/** Preis-Strings ("0.0000025") in Zahlen wandeln; unbekannt → null. */
export function preise(model) {
  const p = model?.pricing || {};
  const zahl = (v) => {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };
  return { prompt: zahl(p.prompt), completion: zahl(p.completion) };
}

/**
 * Höchstpreis eines Laufs in USD. Unbekannte Preise → null (= „nicht schätzbar"),
 * damit der Aufrufer das ehrlich anzeigen kann, statt 0 zu behaupten.
 */
export function schaetzeKosten({ promptTokens, completionTokens, pricing }) {
  const { prompt, completion } = pricing || {};
  if (prompt == null || completion == null) return null;
  return promptTokens * prompt + completionTokens * completion;
}

/** Kosten hübsch formatieren (Cent-Beträge bleiben lesbar). */
export function usd(betrag) {
  if (betrag == null) return 'unbekannt';
  if (betrag === 0) return '$0.00 (gratis)';
  if (betrag < 0.01) return `$${betrag.toFixed(5)}`;
  return `$${betrag.toFixed(4)}`;
}

/**
 * Harte Bremse: wirft, wenn die Schätzung über dem Limit liegt.
 * Unbekannte Preise gelten als „nicht freigegeben" — außer der Nutzer erlaubt
 * es ausdrücklich (erlaubeUnbekannt), sonst könnte ein Modell ohne Preisangabe
 * das Limit umgehen.
 */
export function pruefeBudget({ geschaetzt, maxCostUsd, modelId, erlaubeUnbekannt = false }) {
  if (geschaetzt == null) {
    if (erlaubeUnbekannt) return;
    throw new BudgetUeberschritten(
      `Für ${modelId} liefert OpenRouter keine Preisangabe — Kosten nicht schätzbar. ` +
        'Mit --preis-unbekannt-ok trotzdem starten (auf eigene Rechnung).'
    );
  }
  if (geschaetzt > maxCostUsd) {
    throw new BudgetUeberschritten(
      `Kostenbremse: geschätzt ${usd(geschaetzt)} für ${modelId} > Limit ${usd(maxCostUsd)}. ` +
        'Limit anheben mit --max-cost <USD> (oder MODEL_REVIEW_MAX_COST_USD), ' +
        'Kontext verkleinern mit --max-chars, Antwort kürzen mit --max-tokens.'
    );
  }
}

/** Summe mehrerer Läufe (mehrere Modelle in einem Aufruf). */
export function summe(werte) {
  const bekannt = werte.filter((w) => w != null);
  if (bekannt.length === 0) return null;
  return bekannt.reduce((s, w) => s + w, 0);
}
