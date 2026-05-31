/**
 * Aktion → Sendung („Effekt"). Leitet aus einer Story-Aktion ab, was als Sendung läuft.
 * Bewusst datenarm & robust: scannt Label/Narrativ/Tags nach Themen-Schlüsselwörtern und
 * wählt einen Kanal. Gibt `null` zurück, wenn die Aktion NICHT öffentlich ausgespielt wird
 * (z. B. reine Planung/Infrastruktur) — dann ändert sich die Sendung nicht.
 */
import type { Channel, Effect } from './audienceModel';

export interface ActionLike {
  phase?: string;
  tags?: string[];
  label_de?: string;
  narrative_de?: string;
}

const THEME_KEYWORDS: { theme: string; rx: RegExp }[] = [
  { theme: 'energie_angst', rx: /energie|strom|gas|heiz|blackout/i },
  { theme: 'wirtschafts_sorge', rx: /wirtschaft|wohlstand|inflation|preise|arbeitslos|abstieg|geld|euro/i },
  { theme: 'sicherheits_beduerfnis', rx: /sicher|ordnung|kriminal|migration|grenz|terror|gewalt/i },
  { theme: 'anti_establishment', rx: /elite|establishment|\boben\b|system|korrupt|regierung|politiker/i },
  { theme: 'misstrauen_medien', rx: /medien|presse|lügen|zensur|journalist|fake/i },
  { theme: 'gesundheits_angst', rx: /gesundheit|impf|pandemie|krank|pharma|virus/i },
  { theme: 'klima_sorge', rx: /klima|umwelt|co2|energiewende/i },
  { theme: 'soziale_gerechtigkeit', rx: /gerecht|gleich|sozial|verteil/i },
  { theme: 'nationale_identitaet', rx: /nation|identität|souverän|patriot|heimat|tradition/i },
];

/** DISARM-Phasen, deren Aktionen öffentlich „on air" gehen. */
const BROADCAST_PHASES = new Set(['ta03', 'ta04', 'ta05', 'ta07', 'targeting']);

function pickChannel(a: ActionLike): Channel {
  const t = `${(a.tags ?? []).join(' ')} ${a.label_de ?? ''}`.toLowerCase();
  if (/social|bot|platform|meme|viral|online|influencer/.test(t)) return 'social';
  if (/print|presse|zeitung|artikel|blatt/.test(t)) return 'print';
  return 'tv';
}

export function actionToEffect(a: ActionLike): Effect | null {
  const isContent =
    (a.phase != null && BROADCAST_PHASES.has(a.phase)) ||
    (a.tags ?? []).some((x) => /content|media|social|propaganda|narrative|meme|amplif/i.test(x));
  if (!isContent) return null;

  const hay = `${a.label_de ?? ''} ${a.narrative_de ?? ''} ${(a.tags ?? []).join(' ')}`;
  const themes = THEME_KEYWORDS.filter((k) => k.rx.test(hay)).map((k) => k.theme);

  return {
    themes: themes.length > 0 ? themes : ['wirtschafts_sorge'],
    channel: pickChannel(a),
    intensity: 0.75,
  };
}
