/**
 * LagebildView — die „auf einen Blick"-Übersicht als diegetisches Objekt
 * (Strang 2 / 2e). Löst die parallele Dashboard-Ansicht ab: der Wand-Monitor im
 * Büro öffnet diese Lage-Übersicht (Ressourcen · Ziele · Nachrichten · Team).
 *
 * Bewusst READ-ONLY (Überblick, kein zweiter Bedienweg): Details liegen an den
 * jeweiligen Büro-Objekten — Terminal (Aktionen), Pinnwand (Tafel/Ziele), Akten
 * (Nachrichten), Telefon (Kontakte). So fällt keine Funktion weg (A1), ohne die
 * Bedienung zu duplizieren.
 */
import type { ReactNode } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { PixelModal } from './PixelModal';
import type { StoryResources, StoryPhase, NewsEvent, Objective, NPCState } from '../../game-logic/StoryEngineAdapter';

interface LagebildViewProps {
  resources: StoryResources;
  phase: StoryPhase;
  objectives: Objective[];
  newsEvents: NewsEvent[];
  npcs: NPCState[];
  unreadNewsCount: number;
  worldEventCount: number;
  /** N2: das Wettrennen — dieselben Größen wie das HUD (Zielbild §6). */
  sonntagsfrage: { pollPct: number; thresholdPct: number };
  abwehr: number;
  abwehrStages: { stages: readonly number[]; fired: number[] };
  /** Laufender strategischer Auftrag (Titel). */
  auftrag: { titel_de: string };
  onClose: () => void;
}

/**
 * N2 (PLAN 2026-07-07): DAS RENNEN statt Gesellschafts-Meter. Das Lagebild sprach
 * das Alt-Vokabular (Risiko/Aufmerksamkeit als Karten, Informationslast-Meter,
 * „Auftrags-Fortschritt %") — jetzt zeigt es dieselben zwei Läufer wie das HUD:
 * Sonntagsfrage mit Zielstrich, Abwehr mit Stufen-Marken (§6/§12.4).
 */
function RennenBlock({ sonntagsfrage, abwehr, abwehrStages, auftrag }: {
  sonntagsfrage: { pollPct: number; thresholdPct: number };
  abwehr: number;
  abwehrStages: { stages: readonly number[]; fired: number[] };
  auftrag: { titel_de: string };
}) {
  const scaleMax = Math.max(sonntagsfrage.pollPct, sonntagsfrage.thresholdPct) + 6;
  const barPct = Math.min(100, (sonntagsfrage.pollPct / scaleMax) * 100);
  const linePct = Math.min(100, (sonntagsfrage.thresholdPct / scaleMax) * 100);
  const reached = sonntagsfrage.pollPct >= sonntagsfrage.thresholdPct;
  const abwehrPct = Math.max(0, Math.min(100, abwehr));
  return (
    <div className="p-3 border-2 mb-4" style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }} data-testid="lagebild-rennen">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>DAS RENNEN</span>
        <span className="text-xs truncate max-w-[55%]" style={{ color: StoryModeColors.textMuted }} title={`Auftrag: ${auftrag.titel_de}`}>
          Auftrag: <span style={{ color: StoryModeColors.textPrimary }}>{auftrag.titel_de}</span>
        </span>
      </div>
      {/* Läufer 1 — Sonntagsfrage mit Zielstrich */}
      <div className="flex justify-between text-[10px] mb-0.5">
        <span style={{ color: StoryModeColors.textSecondary }}>SONNTAGSFRAGE</span>
        <span style={{ color: StoryModeColors.warning, fontWeight: 700 }}>
          {sonntagsfrage.pollPct.toFixed(1)} % · Schwelle {sonntagsfrage.thresholdPct.toFixed(0)} %
        </span>
      </div>
      <div className="relative mb-3" style={{ height: 8 }}>
        <div className="h-full bg-black/30 overflow-hidden">
          <div className="h-full" style={{ width: `${barPct}%`, backgroundColor: reached ? StoryModeColors.success : StoryModeColors.ministryRed }} />
        </div>
        <div className="absolute" style={{ left: `${linePct}%`, top: -2, bottom: -2, width: 2, backgroundColor: StoryModeColors.warning }} title="Machtwechsel-Schwelle" />
      </div>
      {/* Läufer 2 — Abwehr mit Stufen-Marken */}
      <div className="flex justify-between text-[10px] mb-0.5">
        <span style={{ color: StoryModeColors.textSecondary }}>ABWEHR</span>
        <span style={{ color: StoryModeColors.danger, fontWeight: 700 }}>{Math.round(abwehrPct)}/100</span>
      </div>
      <div className="relative" style={{ height: 8 }}>
        <div className="h-full bg-black/30 overflow-hidden">
          <div className="h-full" style={{ width: `${abwehrPct}%`, backgroundColor: StoryModeColors.danger }} />
        </div>
        {abwehrStages.stages.map((stage) => (
          <div
            key={stage}
            className="absolute"
            title={`Stufe ${stage}${abwehrStages.fired.includes(stage) ? ' — gezündet' : ''}`}
            style={{
              left: `${stage}%`, top: -2, bottom: -2, width: 2,
              backgroundColor: abwehrStages.fired.includes(stage) ? StoryModeColors.document : 'rgba(0,0,0,0.55)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ResourceCard({ icon, label, value, format, color, danger }: {
  icon: ReactNode; label: string; value: number; format: 'currency' | 'percent' | 'number'; color: string; danger?: boolean;
}) {
  const formatted = format === 'currency' ? `${value}K` : format === 'percent' ? `${Math.round(value)}%` : `${value}`;
  return (
    <div className="p-2 border-2" style={{ backgroundColor: StoryModeColors.surface, borderColor: danger ? StoryModeColors.danger : StoryModeColors.border }}>
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-[10px] font-bold" style={{ color: StoryModeColors.textSecondary }}>{label}</span>
      </div>
      <div className="text-lg font-bold" style={{ color: danger ? StoryModeColors.danger : color }}>{formatted}</div>
    </div>
  );
}

function ObjectivesBlock({ objectives }: { objectives: Objective[] }) {
  const primary = objectives.filter((o) => o.type === 'primary');
  const completed = objectives.filter((o) => o.completed).length;
  return (
    <div className="p-3 border-2" style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>MISSIONSZIELE</span>
        <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>{completed}/{objectives.length} erledigt</span>
      </div>
      <div className="space-y-2">
        {primary.slice(0, 4).map((obj) => {
          // B22: richtungs-bewusster Fortschritt aus der Engine — der alte Quotient
          // currentValue/targetValue zeigte beim Senk-Ziel (Vertrauen 100 → unter 40)
          // von Anfang an einen vollen Balken.
          const progress = Math.max(0, Math.min(100, obj.progress));
          return (
            <div key={obj.id}>
              <div className="flex justify-between text-xs mb-0.5">
                <span style={{ color: obj.completed ? StoryModeColors.success : StoryModeColors.textPrimary }}>{obj.completed ? '✓ ' : ''}{obj.label_de}</span>
                {/* B22: „100/40" las sich als „100 von 40" — Ziel ist, UNTER die Marke zu
                    kommen. Halte-Ziele (survival) führen kein lebendes currentValue —
                    dort nur die Marke. Kein „→": U+2192 fehlt den Pixel-Fonts. */}
                <span style={{ color: StoryModeColors.textMuted }}>
                  {obj.category === 'survival'
                    ? `unter ${obj.targetValue} halten`
                    : `Stand ${Math.round(obj.currentValue)} · Ziel unter ${obj.targetValue}`}
                </span>
              </div>
              <div className="h-1.5 bg-black/30 overflow-hidden">
                <div className="h-full" style={{ width: `${progress}%`, backgroundColor: obj.completed ? StoryModeColors.success : StoryModeColors.militaryOlive }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewsBlock({ newsEvents, unreadCount }: { newsEvents: NewsEvent[]; unreadCount: number }) {
  const recent = [...newsEvents].sort((a, b) => b.phase - a.phase).slice(0, 5);
  return (
    <div className="p-3 border-2" style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>NACHRICHTEN</span>
        {unreadCount > 0 && <span className="px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: StoryModeColors.danger, color: '#fff' }}>{unreadCount} NEU</span>}
      </div>
      <div className="space-y-1">
        {recent.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <Icon name="news" size={12} title="Nachricht" />
            <span className="truncate" style={{ color: item.read ? StoryModeColors.textMuted : StoryModeColors.textPrimary, fontWeight: item.read ? 'normal' : 'bold' }}>{item.headline_de}</span>
          </div>
        ))}
        {recent.length === 0 && <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>Keine Nachrichten</div>}
      </div>
    </div>
  );
}

function TeamBlock({ npcs }: { npcs: NPCState[] }) {
  const moraleColor = (m: number) => (m >= 80 ? StoryModeColors.success : m >= 50 ? StoryModeColors.warning : StoryModeColors.danger);
  return (
    <div className="p-3 border-2" style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>TEAM</span>
        <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>{npcs.filter((n) => n.available).length}/{npcs.length} aktiv</span>
      </div>
      <div className="space-y-1.5">
        {npcs.slice(0, 5).map((npc) => (
          <div key={npc.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: npc.available ? moraleColor(npc.morale) : StoryModeColors.textMuted }} />
            <span className="text-xs flex-1 truncate" style={{ color: npc.available ? StoryModeColors.textPrimary : StoryModeColors.textMuted }}>{npc.name}</span>
            <span className="text-xs font-bold" style={{ color: moraleColor(npc.morale) }}>{npc.morale}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LagebildView({ resources, phase, objectives, newsEvents, npcs, unreadNewsCount, worldEventCount, sonntagsfrage, abwehr, abwehrStages, auftrag, onClose }: LagebildViewProps): React.JSX.Element {
  return (
    <PixelModal
      open
      onClose={onClose}
      variant="standard"
      maxWidthClass="max-w-4xl"
      title={<span><Icon name="dashboard" size={14} title="Lagebild" /> LAGEBILD — TAG {phase.number} · WAHL IN {Math.max(0, (phase.electionDay ?? 40) - phase.number)} TAGEN</span>}
    >
      <div className="p-4 font-mono">
        {/* N2: Das Rennen zuerst — dieselben zwei Läufer wie das HUD (§6). */}
        <RennenBlock sonntagsfrage={sonntagsfrage} abwehr={abwehr} abwehrStages={abwehrStages} auftrag={auftrag} />

        {/* Mittel des Hauses. Risiko/Aufmerksamkeit sind KEINE Anzeigen mehr (§12.4) —
            sie fließen in die ABWEHR; die moralische Last bleibt (nicht gestrichen). */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <ResourceCard icon={<Icon name="budget" size={16} title="Budget" />} label="KASSE" value={resources.budget} format="currency" color={StoryModeColors.warning} danger={resources.budget < 20} />
          <ResourceCard icon={<Icon name="capacity" size={16} title="Kapazität" />} label="KAPAZITÄT" value={resources.capacity} format="number" color={StoryModeColors.agencyBlue} />
          <ResourceCard icon={<Icon name="moral" size={16} title="Moral" />} label="MORAL. LAST" value={resources.moralWeight} format="number" color={StoryModeColors.ministryRed} danger={resources.moralWeight > 60} />
        </div>

        {/* Drei Spalten: Ziele · Nachrichten · Team. N2: das Primärziel spricht
            jetzt oben das Rennen — hier bleiben nur die Halte-Ziele (survival). */}
        <div className="grid grid-cols-3 gap-3">
          <ObjectivesBlock objectives={objectives.filter((o) => o.category === 'survival')} />
          <NewsBlock newsEvents={newsEvents} unreadCount={unreadNewsCount} />
          <TeamBlock npcs={npcs} />
        </div>

        <div className="mt-3 text-center text-[11px]" style={{ color: StoryModeColors.textMuted }}>
          {worldEventCount > 0 ? `${worldEventCount} Welt-Ereignis(se) offen — am Fenster prüfen.` : 'Überblick. Details an den Büro-Objekten — Terminal · Pinnwand · Akten · Telefon.'}
        </div>
      </div>
    </PixelModal>
  );
}

export default LagebildView;
