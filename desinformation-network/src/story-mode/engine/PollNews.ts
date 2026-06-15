/**
 * Umfragen/Barometer als Nachrichten (P6/F3, Konzept §14.2).
 *
 * Macht den abstrakten Gesellschafts-Zustand zum erzählerischen Gesicht: wiederkehrende
 * fiktive Mess-Instrumente erscheinen periodisch als News (mit Frage + Wert + Tendenz +
 * erfundenem Institut). „Schöne Komplexität hinten, niedrigschwellig vorn." Effekte sind
 * verzögert/nicht-linear, weil die Werte selbst den Aktionen nachlaufen (SocietyDynamics).
 *
 * Pure Funktionen, kein Math.random/React → testbar.
 */

import type { SocietyValueKey } from '../../game-logic/StoryEngineAdapter';

export interface PollInstrument {
  id: string;
  name_de: string;
  frage_de: string;
  institut_de: string;
  wert: SocietyValueKey | 'vertrauen';
  /** Höherer Wert ist für die Gesellschaft … gut oder schlecht? (nur fürs Wording). */
  hochIstSchlecht: boolean;
}

/** Die fiktiven Mess-Instrumente (jedes auf einen Auftrag gemappt, §14.2). */
export const POLL_INSTRUMENTS: PollInstrument[] = [
  { id: 'stimmungsbarometer', name_de: 'Westunion-Stimmungsbarometer', frage_de: 'Wie tief ist das Land gespalten?', institut_de: 'Institut für Gesellschaftsforschung Nordmark', wert: 'polarisierung', hochIstSchlecht: true },
  { id: 'vertrauensindex', name_de: 'Westunion-Vertrauensindex', frage_de: 'Vertrauen in Verwaltung, Medien und Wahlen', institut_de: 'Demoskopie-Zentrum Gallia', wert: 'vertrauen', hochIstSchlecht: false },
  { id: 'medienmonitor', name_de: 'Westunion-Medienmonitor', frage_de: 'Wie überflutet fühlen sich die Bürger von Nachrichten?', institut_de: 'Balticum-Institut für Medienforschung', wert: 'informationslast', hochIstSchlecht: true },
  { id: 'wahltrend', name_de: 'Westunion-Wahltrend', frage_de: 'Stärke der politischen Ränder', institut_de: 'Politbarometer Westunion', wert: 'fraktionsstaerke', hochIstSchlecht: true },
  { id: 'buergerbarometer', name_de: 'Westunion-Bürgerbarometer', frage_de: '„Bringt es überhaupt etwas, sich einzumischen?"', institut_de: 'Sozialforschung Hauptstadt', wert: 'zynismus', hochIstSchlecht: true },
];

export function getPollInstrument(id: string): PollInstrument | undefined {
  return POLL_INSTRUMENTS.find(p => p.id === id);
}

function tendenz(value: number, prev: number | undefined): string {
  if (prev === undefined) return 'erste Erhebung';
  const d = value - prev;
  if (d >= 1) return 'Tendenz steigend';
  if (d <= -1) return 'Tendenz fallend';
  return 'Tendenz stabil';
}

export interface PollNewsContent {
  headline_de: string;
  headline_en: string;
  description_de: string;
  description_en: string;
}

/** Baut den News-Text einer Umfrage aus Instrument + aktuellem (und vorigem) Wert. */
export function buildPollNews(
  instrument: PollInstrument,
  value: number,
  prev: number | undefined,
): PollNewsContent {
  const v = Math.round(value);
  const trend = tendenz(value, prev);
  return {
    headline_de: `Umfrage: ${instrument.name_de} bei ${v}%`,
    headline_en: `Poll: ${instrument.name_de} at ${v}%`,
    description_de: `${instrument.institut_de}: „${instrument.frage_de}" — aktueller Wert ${v}% (${trend}).`,
    description_en: `${instrument.institut_de}: "${instrument.frage_de}" — current value ${v}% (${trend}).`,
  };
}

/**
 * Wählt das Instrument für die nächste Umfrage: das zum Auftrag passende Leit-Instrument
 * kommt am häufigsten, der Rest rotiert — so liest man den Auftrags-Fortschritt am Barometer ab.
 */
export function pickPollInstrument(auftragLeitwert: SocietyValueKey | 'vertrauen', pollIndex: number): PollInstrument {
  const leit = POLL_INSTRUMENTS.find(p => p.wert === auftragLeitwert) ?? POLL_INSTRUMENTS[0];
  // Jede zweite Umfrage = Leit-Instrument; sonst rotiert der Rest.
  if (pollIndex % 2 === 0) return leit;
  const others = POLL_INSTRUMENTS.filter(p => p.id !== leit.id);
  return others[(Math.floor(pollIndex / 2)) % others.length];
}
