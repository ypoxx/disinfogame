/**
 * Zahlen in deutscher Schreibweise.
 *
 * Das Spiel ist durchgehend deutsch, seine Zahlen waren es nicht: Der
 * Tagesbericht schrieb „12,6", der Wahlabend daneben „12.6". Beide Stellen
 * hatten dieselbe Absicht und zwei Implementierungen — eine davon gar keine.
 */

/** Eine Nachkommastelle, Komma statt Punkt („21,6"). */
export function zahlDe(n: number, stellen = 1): string {
  return n.toFixed(stellen).replace('.', ',');
}

/** Mit Vorzeichen und echtem Minuszeichen („+12,6" / „−3,4"). */
export function deltaDe(n: number, stellen = 1): string {
  return `${n >= 0 ? '+' : '−'}${zahlDe(Math.abs(n), stellen)}`;
}
