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
  /** P0-3: Herzstück sichtbar machen — Institutionen-Vertrauen (aus obj_destabilize). */
  vertrauen: number;
  /** P0-3: laufender strategischer Auftrag (Titel + Fortschritt 0..1). */
  auftrag: { titel_de: string; progress: number };
  onClose: () => void;
}

/**
 * P0-3: GESELLSCHAFT + AUFTRAG im Lagebild. Bisher lebte das Herzstück (Werte + Auftrag)
 * nur in der default-versteckten HUD-Leiste; das diegetische Übersichts-Objekt zeigte es
 * gar nicht. Werte kommen aus `resources` (sichtbares Set) + Vertrauen aus dem Ziel.
 */
function SocietyAuftragBlock({ resources, vertrauen, auftrag }: {
  resources: StoryResources; vertrauen: number; auftrag: { titel_de: string; progress: number };
}) {
  const meters = [
    { label: 'Vertrauen', value: vertrauen, color: StoryModeColors.agencyBlue },
    { label: 'Polarisierung', value: resources.polarisierung, color: StoryModeColors.ministryRed },
    { label: 'Informationslast', value: resources.informationslast, color: StoryModeColors.warning },
    { label: 'Zynismus', value: resources.zynismus, color: StoryModeColors.danger },
  ];
  const pct = Math.round(Math.min(100, Math.max(0, auftrag.progress * 100)));
  return (
    <div className="p-3 border-2 mb-4" style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>GESELLSCHAFT</span>
        <span className="text-xs truncate max-w-[55%]" style={{ color: StoryModeColors.textMuted }} title={`Auftrag: ${auftrag.titel_de}`}>
          Auftrag: <span style={{ color: StoryModeColors.textPrimary }}>{auftrag.titel_de}</span>
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {meters.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span style={{ color: StoryModeColors.textSecondary }}>{m.label}</span>
              <span style={{ color: StoryModeColors.textMuted }}>{Math.round(m.value)}%</span>
            </div>
            <div className="h-1.5 bg-black/30 overflow-hidden">
              <div className="h-full" style={{ width: `${Math.min(100, Math.max(0, m.value))}%`, backgroundColor: m.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span style={{ color: StoryModeColors.textSecondary }}>Auftrags-Fortschritt</span>
        <span style={{ color: StoryModeColors.textMuted }}>{pct}%</span>
      </div>
      <div className="h-2 bg-black/30 overflow-hidden">
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: StoryModeColors.militaryOlive }} />
      </div>
    </div>
  );
}

function ResourceCard({ icon, label, value, format, color, danger }: {
  icon: ReactNode; label: string; value: number; format: 'currency' | 'percent' | 'number'; color: string; danger?: boolean;
}) {
  const formatted = format === 'currency' ? `$${value}K` : format === 'percent' ? `${Math.round(value)}%` : `${value}`;
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
          const progress = obj.targetValue > 0 ? Math.min(100, (obj.currentValue / obj.targetValue) * 100) : 0;
          return (
            <div key={obj.id}>
              <div className="flex justify-between text-xs mb-0.5">
                <span style={{ color: obj.completed ? StoryModeColors.success : StoryModeColors.textPrimary }}>{obj.completed ? '✓ ' : ''}{obj.label_de}</span>
                <span style={{ color: StoryModeColors.textMuted }}>{obj.currentValue}/{obj.targetValue}</span>
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

export function LagebildView({ resources, phase, objectives, newsEvents, npcs, unreadNewsCount, worldEventCount, vertrauen, auftrag, onClose }: LagebildViewProps): React.JSX.Element {
  return (
    <PixelModal
      open
      onClose={onClose}
      variant="standard"
      maxWidthClass="max-w-4xl"
      title={<span><Icon name="dashboard" size={14} title="Lagebild" /> LAGEBILD — JAHR {phase.year} · MONAT {phase.month} · PHASE {phase.number}</span>}
    >
      <div className="p-4 font-mono">
        {/* Ressourcen */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <ResourceCard icon={<Icon name="budget" size={16} title="Budget" />} label="BUDGET" value={resources.budget} format="currency" color={StoryModeColors.warning} danger={resources.budget < 20} />
          <ResourceCard icon={<Icon name="capacity" size={16} title="Kapazität" />} label="KAPAZITÄT" value={resources.capacity} format="number" color={StoryModeColors.agencyBlue} />
          <ResourceCard icon={<Icon name="risk" size={16} title="Risiko" />} label="RISIKO" value={resources.risk} format="percent" color={StoryModeColors.ministryRed} danger={resources.risk > 60} />
          <ResourceCard icon={<Icon name="attention" size={16} title="Aufmerksamkeit" />} label="AUFMERKSAMKEIT" value={resources.attention} format="percent" color={StoryModeColors.danger} danger={resources.attention > 70} />
          <ResourceCard icon={<Icon name="moral" size={16} title="Moral" />} label="MORAL. LAST" value={resources.moralWeight} format="number" color={StoryModeColors.ministryRed} danger={resources.moralWeight > 60} />
        </div>

        {/* P0-3: Herzstück — Gesellschaftswerte + Auftrags-Fortschritt */}
        <SocietyAuftragBlock resources={resources} vertrauen={vertrauen} auftrag={auftrag} />

        {/* Drei Spalten: Ziele · Nachrichten · Team */}
        <div className="grid grid-cols-3 gap-3">
          <ObjectivesBlock objectives={objectives} />
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
