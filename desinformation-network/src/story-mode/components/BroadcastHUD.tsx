/**
 * BroadcastHUD — die untere „MadTV/MadNews"-Leiste (Track: Sendung & Publikum).
 *
 *   ┌── F1 SENDUNG ──┬── Q QUOTE ──┬─────── P PUBLIKUM ───────┐
 *   │ TV/Zeitung/Soc │  Einschalt- │ Segment-Figuren + Stimmung │
 *   │ + Themenwahl   │   quote %   │ (wer springt an?)          │
 *   └────────────────┴─────────────┴────────────────────────────┘
 *
 * v1 = lebende, LESBARE Vorschau: man wählt Medium + Thema einer „Probe-Sendung",
 * und das Publikum (Nordmark) reagiert sofort über `audienceModel.reactToEffect`.
 * Stats (Budget/Risiko/…) bleiben bewusst oben im StoryHUD — hier kein Doppel.
 * „Besser" (später): F1 spiegelt automatisch die zuletzt gespielte Aktion.
 *
 * Koordinaten: F1 = Sendung, Q = Quote, P = Publikum (Badges in den Ecken).
 * Konzept: docs/story-mode/BROADCAST_AND_AUDIENCE_CONCEPT.md
 */
import { useMemo, useState } from 'react';
import { StoryModeColors } from '../theme';
import {
  getCountry,
  reactToEffect,
  type Channel,
  type Mood,
  type SegmentReaction,
} from '../audience/audienceModel';

const MOOD: Record<Mood, { emoji: string; color: string; label: string }> = {
  ruhig: { emoji: '🙂', color: StoryModeColors.success, label: 'ruhig' },
  verunsichert: { emoji: '😟', color: StoryModeColors.warning, label: 'verunsichert' },
  wuetend: { emoji: '😠', color: StoryModeColors.danger, label: 'wütend' },
  misstrauisch: { emoji: '🤨', color: StoryModeColors.agencyBlue, label: 'misstrauisch' },
};

const CHANNELS: { id: Channel; icon: string; label: string }[] = [
  { id: 'tv', icon: '📺', label: 'TV' },
  { id: 'print', icon: '📰', label: 'Zeitung' },
  { id: 'social', icon: '📱', label: 'Social' },
];

const THEME_LABEL: Record<string, string> = {
  energie_angst: 'Energie-Angst',
  wirtschafts_sorge: 'Wirtschafts-Sorge',
  abstiegs_angst: 'Abstiegs-Angst',
  sicherheits_beduerfnis: 'Sicherheits-Bedürfnis',
  nostalgie: 'Nostalgie',
  gesundheits_angst: 'Gesundheits-Angst',
  klima_sorge: 'Klima-Sorge',
  soziale_gerechtigkeit: 'Soziale Gerechtigkeit',
  anti_establishment: 'Anti-Establishment',
  misstrauen_medien: 'Medien-Misstrauen',
  maennlichkeit: 'Männlichkeit',
};

const THEME_HEADLINE: Record<string, string> = {
  energie_angst: 'ENERGIE-SCHOCK: Preise explodieren — wer profitiert?',
  wirtschafts_sorge: 'WOHLSTAND IN GEFAHR: Experten warnen vor Abstieg',
  abstiegs_angst: '„WIR VERLIEREN ALLES" — Reportage aus dem Niedergang',
  sicherheits_beduerfnis: 'UNSICHERHEIT WÄCHST: Bürger fordern harte Hand',
  nostalgie: 'FRÜHER WAR ALLES BESSER — was wirklich schieflief',
  gesundheits_angst: 'NEUE GESUNDHEITSSORGEN: Was verschweigt man uns?',
  klima_sorge: 'KLIMA-DEBATTE: Hysterie oder echter Notstand?',
  soziale_gerechtigkeit: 'GERECHTIGKEITSLÜCKE: Wer zahlt die Zeche?',
  anti_establishment: 'DIE DA OBEN: Eliten gegen das Volk?',
  misstrauen_medien: 'VERTRAUEN BRÖCKELT: Kann man den Medien noch glauben?',
  maennlichkeit: 'IDENTITÄT IM KAMPF: Was heißt heute „stark"?',
};

function CornerBadge({ text }: { text: string }) {
  return (
    <span
      className="absolute top-0.5 left-0.5 text-[9px] font-bold px-1 rounded-sm z-10"
      style={{ backgroundColor: StoryModeColors.warning, color: '#0d0d0d' }}
    >
      {text}
    </span>
  );
}

function BroadcastScreen({ channel, headline, quotePct }: { channel: Channel; headline: string; quotePct: number }) {
  if (channel === 'print') {
    return (
      <div className="flex-1 overflow-hidden p-1" style={{ backgroundColor: StoryModeColors.oldPaper, color: '#1a1a1a' }}>
        <div className="text-[8px] font-bold border-b border-black/40 text-center tracking-widest">NORDMARK KURIER</div>
        <div className="text-[10px] font-bold leading-tight mt-0.5 line-clamp-2">{headline}</div>
      </div>
    );
  }
  if (channel === 'social') {
    return (
      <div className="flex-1 overflow-hidden p-1 flex flex-col" style={{ backgroundColor: '#15202b', color: '#e7e9ea' }}>
        <div className="text-[8px]" style={{ color: '#8b98a5' }}>@nordmark_wahrheit · jetzt</div>
        <div className="text-[10px] font-semibold leading-tight line-clamp-2">{headline}</div>
        <div className="text-[8px] mt-auto" style={{ color: '#8b98a5' }}>❤ {quotePct * 12} · 🔁 {quotePct * 3}</div>
      </div>
    );
  }
  // tv
  return (
    <div
      className="relative flex-1 overflow-hidden p-1 flex items-center"
      style={{ backgroundColor: '#06121a', color: '#d6f5ff', border: '2px solid #000' }}
    >
      <span className="absolute top-1 right-1 text-[8px] font-bold" style={{ color: StoryModeColors.danger }}>
        ● LIVE
      </span>
      <div className="text-[10px] font-bold leading-tight line-clamp-2">{headline}</div>
    </div>
  );
}

export function BroadcastHUD({ countryId = 'nordmark' }: { countryId?: string }) {
  const country = getCountry(countryId);
  const [channel, setChannel] = useState<Channel>('tv');
  const [theme, setTheme] = useState<string>('energie_angst');

  // Verfügbare Themen = Vereinigung der Vulnerabilitäten des Landes.
  const themes = useMemo(() => {
    if (!country) return [];
    const set = new Set<string>();
    country.segments.forEach((s) => s.vulnerabilities.forEach((v) => set.add(v)));
    return Array.from(set);
  }, [country]);

  const reaction = useMemo(
    () => (country ? reactToEffect(country, { themes: [theme], channel, intensity: 0.8 }) : null),
    [country, theme, channel],
  );

  if (!country || !reaction) return null;

  const reactionById = new Map<string, SegmentReaction>(reaction.reactions.map((r) => [r.segmentId, r]));
  const quotePct = Math.round(reaction.quote * 100);
  const headline = THEME_HEADLINE[theme] ?? theme;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 h-32 flex items-stretch gap-px border-t-4"
      style={{ backgroundColor: StoryModeColors.border, borderColor: StoryModeColors.sovietRed }}
    >
      {/* F1 — SENDUNG */}
      <div className="relative shrink-0 w-80 flex flex-col p-2" style={{ backgroundColor: StoryModeColors.darkConcrete }}>
        <CornerBadge text="F1" />
        <div className="flex items-center justify-between mb-1 pl-6">
          <span className="text-[10px] font-bold tracking-wider" style={{ color: StoryModeColors.textSecondary }}>
            SENDUNG
          </span>
          <div className="flex gap-0.5">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                title={c.label}
                aria-pressed={channel === c.id}
                className="px-1 text-sm rounded-sm transition-all"
                style={{
                  backgroundColor: channel === c.id ? StoryModeColors.sovietRed : 'transparent',
                  opacity: channel === c.id ? 1 : 0.5,
                }}
              >
                {c.icon}
              </button>
            ))}
          </div>
        </div>

        <BroadcastScreen channel={channel} headline={headline} quotePct={quotePct} />

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="mt-1 text-[11px] py-0.5 px-1 border rounded-sm"
          style={{ backgroundColor: StoryModeColors.surface, color: StoryModeColors.textPrimary, borderColor: StoryModeColors.borderLight }}
          title="Thema der Sendung"
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {THEME_LABEL[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      {/* Q — QUOTE */}
      <div className="relative shrink-0 w-28 flex flex-col items-center justify-center" style={{ backgroundColor: StoryModeColors.darkConcrete }}>
        <CornerBadge text="Q" />
        <div className="text-[10px] font-bold tracking-wider" style={{ color: StoryModeColors.textSecondary }}>
          EINSCHALTQUOTE
        </div>
        <div className="text-3xl font-bold leading-none" style={{ color: StoryModeColors.warning }}>
          {quotePct}
          <span className="text-lg">%</span>
        </div>
        <div className="text-[9px] mt-1" style={{ color: StoryModeColors.textMuted }}>
          {country.label_de} · {channel.toUpperCase()}
        </div>
      </div>

      {/* P — PUBLIKUM */}
      <div className="relative flex-1 flex items-center gap-2 px-3 overflow-x-auto" style={{ backgroundColor: StoryModeColors.darkConcrete }}>
        <CornerBadge text="P" />
        <div className="flex items-end gap-2 pl-6">
          {country.segments.map((seg) => {
            const r = reactionById.get(seg.id)!;
            const mood = MOOD[r.newMood];
            const active = r.reached && r.resonance > 0;
            const dim = 30 + Math.round(seg.size * 40);
            return (
              <div
                key={seg.id}
                title={`${seg.label_de}\nStimmung: ${mood.label}${r.reached ? '' : ' · nicht erreicht'}\nGlaube: ${Math.round(r.newBelief * 100)}%`}
                className="flex flex-col items-center shrink-0"
                style={{ opacity: r.reached ? 1 : 0.35 }}
              >
                <div
                  className="flex items-center justify-center rounded-full border-2"
                  style={{
                    width: dim,
                    height: dim,
                    borderColor: active ? StoryModeColors.warning : 'transparent',
                    backgroundColor: '#1a1a1a',
                    fontSize: 18,
                    boxShadow: active ? `0 0 8px ${mood.color}` : 'none',
                  }}
                >
                  {mood.emoji}
                </div>
                <div className="h-1 w-8 mt-1" style={{ backgroundColor: '#333' }}>
                  <div className="h-full" style={{ width: `${Math.round(r.newBelief * 100)}%`, backgroundColor: mood.color }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="ml-auto pr-1 text-[9px] max-w-[140px] leading-tight" style={{ color: StoryModeColors.textMuted }}>
          Wer springt an? Hervorgehobene Figuren resonieren mit „{THEME_LABEL[theme] ?? theme}".
        </div>
      </div>
    </div>
  );
}

export default BroadcastHUD;
