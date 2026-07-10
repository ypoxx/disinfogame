/**
 * ActionCard — das M1-„Vorgangsblatt": Wirkung + Preis + FRISCH/BEKANNT/
 * VERBRANNT-Stempel VOR dem Klick (E7), nie eine Matrix-Zahl (E6).
 *
 * L2-Erbe: Der frühere ActionPanel-Container (Sidebar-/Modal-Varianten) ist
 * mit dem Vorgangs-Terminal entfallen und liegt im Archiv
 * (archive/story-mode-drafts/ActionPanel-sidebar-modal.tsx). Konsumenten der
 * Karte: TerminalView (L2) + Tests.
 */
import { useMemo } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { societyDeltaFromAction } from '../engine/SocietyDynamics';
import { SOCIETY_VALUE_META, type SocietyValueKey } from '../../game-logic/StoryEngineAdapter';
import type { MaschenStempel } from '../engine/MaschenGedaechtnis';

// ============================================
// MASCHEN-STEMPEL (Etappe 4 Paket D, Zielbild §6/E7): FRISCH/BEKANNT/VERBRANNT
// je Ziel-Milieu VOR dem Ausgeben — Vertrag s. StoryEngineAdapter.getMaschenVorschau.
// Lokal definiert (Adapter/Engine bleiben unangetastet), damit ActionPanel wie
// bisher rein props-getrieben bleibt.
// ============================================

/** Rückgabe von `engine.getMaschenVorschau(actionId)` — null, wenn keine Masche. */
export interface MaschenVorschau {
  familieId: string;
  familieLabel: string;
  stempel: Array<{ milieuId: string; milieuLabel: string; stempel: MaschenStempel }>;
  multiplikator: number;
}

/** Kastenstempel-Optik: unauffällig → warnend → verbrannt. NIE den Multiplikator zeigen (E6). */
const STEMPEL_COLOR: Record<MaschenStempel, string> = {
  frisch: StoryModeColors.textSecondary,
  bekannt: StoryModeColors.warning,
  verbrannt: StoryModeColors.danger,
};

const STEMPEL_LABEL: Record<MaschenStempel, string> = {
  frisch: 'FRISCH',
  bekannt: 'BEKANNT',
  verbrannt: 'VERBRANNT',
};

// ============================================
// WIRKUNGS-VORSCHAU (M1 — Lesbarkeit am Entscheidungspunkt)
// ============================================

/** Label eines Gesellschaftswerts (reuse der kanonischen Meta). */
function societyLabel(k: string): string {
  return SOCIETY_VALUE_META[k as SocietyValueKey]?.label_de ?? k;
}

/**
 * Schätzt die Gesellschaftswert-Wirkung EINER Aktion fürs Planen (rein, mult=1).
 * Liefert die stärksten Verschiebungen (Betrag absteigend, max 3) — bewusst „≈",
 * weil der echte Lauf den NPC-Assist-Multiplikator + Klemmung anwendet.
 */
export function previewSocietyDeltas(
  effects: Record<string, unknown> | undefined,
  legality: string,
): { key: string; value: number }[] {
  if (!effects) return [];
  const delta = societyDeltaFromAction(effects, 1, {
    legality,
  });
  return (Object.entries(delta) as [string, number][])
    .map(([key, value]) => ({ key, value: Math.round(value) }))
    .filter(d => d.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);
}

// ============================================
// TYPES
// ============================================

export interface StoryAction {
  id: string;
  phase: string;
  label_de: string;
  label_en?: string;
  narrative_de?: string;
  costs: {
    budget?: number;
    capacity?: number;
    risk?: number;
    attention?: number;
    moral_weight?: number;
  };
  npc_affinity: string[];
  legality: 'legal' | 'grey' | 'illegal';
  tags: string[];
  prerequisites?: string[];
  unlocks?: string[];
  disarm_ref?: string;
  /** Roh-Effekte für die Wirkungs-Vorschau (M1). Nur Anzeige, keine Mechanik. */
  effects?: Record<string, unknown>;
  isUnlocked: boolean;
  isUsed: boolean;
  /** Sperr-Grund als Tooltip am GESPERRT-Badge (zog von der Narrativ-Tafel um, T1). */
  unavailableReason?: string;
}

// ============================================
// ACTION CARD COMPONENT
// ============================================

interface ActionCardProps {
  action: StoryAction;
  canAfford: boolean;
  onSelect: () => void;
  onAddToQueue?: () => void;
  isRecommended?: boolean;
  isEpisodeRelevant?: boolean;
  isHighlighted?: boolean;
  actionRef?: React.RefObject<HTMLDivElement>;
  getMaschenVorschau?: (actionId: string) => MaschenVorschau | null;
}

/** Vorgangs-Karte (M1) — auch das L2-Terminal ruft sie als „Vorgangsblatt" auf. */
export function ActionCard({ action, canAfford, onSelect, onAddToQueue, isRecommended, isEpisodeRelevant, isHighlighted, actionRef, getMaschenVorschau }: ActionCardProps) {
  // M1: Gesellschaftswert-Wirkung schon beim Planen (statt nur „1 NPC-Bonus").
  const societyPreview = useMemo(
    () => previewSocietyDeltas(action.effects, action.legality),
    [action.effects, action.legality],
  );
  // E7: Maschen-Stempel VOR dem Ausgeben — null, wenn die Aktion keine Masche ist.
  const maschenVorschau = useMemo(
    () => getMaschenVorschau?.(action.id) ?? null,
    [getMaschenVorschau, action.id],
  );
  const legalityColors = {
    legal: StoryModeColors.success,
    grey: StoryModeColors.warning,
    illegal: StoryModeColors.danger,
  };

  const legalityLabels = {
    legal: '✓ LEGAL',
    grey: '! GRAUZONE',
    illegal: '✕ ILLEGAL',
  };

  // Gesperrt/verbraucht dimmt die Karte; knappe Kasse NICHT — Anheften (Planen)
  // bleibt möglich, nur AUSFÜHREN braucht Deckung. Die alte Tafel erlaubte genau
  // das (A1), und der Kredit-Fall wird erst in Queue-Reihenfolge leistbar
  // (prefix-genau, s. utils/queueAffordability).
  const gesperrt = action.isUsed || !action.isUnlocked;

  // Determine border styling
  const getBorderColor = () => {
    if (action.isUsed) return StoryModeColors.border;
    if (isRecommended) return '#FFD700'; // Gold for recommended
    if (isEpisodeRelevant) return StoryModeColors.agencyBlue; // Aktueller Strang
    return legalityColors[action.legality];
  };

  const getBorderWidth = () => {
    if (isRecommended || isEpisodeRelevant) return '3px';
    return '2px';
  };

  return (
    <div
      ref={actionRef as React.RefObject<HTMLDivElement>}
      className={`
        w-full text-left p-4 transition-all
        ${gesperrt ? 'opacity-50' : ''}
        
      `}
      style={{
        // v3 §4.7: verbrauchte Karten = vergilbtes Papier (statt dunkler Kante als Fläche).
        // Empfehlung = OPAKES warm getöntes Papier — die frühere rgba-Lasur wurde
        // auf dem dunklen Terminal-Schirm durchsichtig (Karte las als Loch, L2).
        backgroundColor: action.isUsed
          ? StoryModeColors.lightConcrete
          : isRecommended
          ? '#EFE3BC'
          : StoryModeColors.surfaceLight,
        border: `${getBorderWidth()} solid ${getBorderColor()}`,
        outline: isHighlighted ? `3px solid ${StoryModeColors.warning}` : undefined,
        outlineOffset: isHighlighted ? 2 : undefined,
        boxShadow: 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="font-bold text-sm"
              style={{ color: StoryModeColors.textPrimary }}
            >
              {action.label_de}
            </div>
            {isRecommended && (
              <span
                className="text-base"
                style={{ color: '#FFD700' }}
                title="Von NPCs empfohlen"
              >
                ★
              </span>
            )}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: legalityColors[action.legality] }}
          >
            {legalityLabels[action.legality]}
          </div>
        </div>
        {isEpisodeRelevant && (
          <div
            className="text-xs px-2 py-0.5 border font-bold whitespace-nowrap"
            style={{
              // §4.7 Stempel-Optik: Rahmen + Tinte auf Papier statt dunkler Füllung.
              backgroundColor: 'transparent',
              borderColor: StoryModeColors.agencyBlue,
              color: StoryModeColors.agencyBlue,
            }}
            title="Gehört zum aktuellen Episoden-Strang"
          >
            ● STRANG
          </div>
        )}
      </div>

      {/* Narrative */}
      {action.narrative_de && (
        <div
          className="text-xs mb-3 line-clamp-2"
          style={{ color: StoryModeColors.textSecondary }}
        >
          {action.narrative_de}
        </div>
      )}

      {/* Costs */}
      <div className="flex flex-wrap gap-2 mb-2">
        {action.costs.budget && action.costs.budget > 0 && (
          <span
            className="text-xs px-2 py-0.5 border whitespace-nowrap"
            style={{
              backgroundColor: 'transparent',
              borderColor: StoryModeColors.warning,
              color: StoryModeColors.warning,
            }}
          >
            {/* B23: Preis symbolfrei („40K"). */}
            <Icon name="budget" size={14} title="Budget" /> {action.costs.budget}K
          </span>
        )}
        {action.costs.capacity && action.costs.capacity > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: 'transparent',
              borderColor: StoryModeColors.agencyBlue,
              color: StoryModeColors.agencyBlue,
            }}
          >
            <Icon name="capacity" size={14} title="Kapazität" /> {action.costs.capacity}
          </span>
        )}
        {action.costs.risk && action.costs.risk > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: 'transparent',
              borderColor: StoryModeColors.danger,
              color: StoryModeColors.danger,
            }}
          >
            <Icon name="risk" size={14} title="Risiko" /> +{action.costs.risk}%
          </span>
        )}
        {action.costs.moral_weight && action.costs.moral_weight > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: 'transparent',
              borderColor: StoryModeColors.ministryRed,
              color: StoryModeColors.ministryRed,
            }}
          >
            <Icon name="moral" size={14} title="Moralische Last" /> +{action.costs.moral_weight}
          </span>
        )}
      </div>

      {/* Tags (internes Engine-Vokabular, 113 englische Keys) werden bewusst NICHT
          mehr gerendert (B20/M4-Präzedenz „interne IDs raus von der Karte");
          das L2-Terminal zeigt stattdessen kuratierte deutsche Kategorien. */}

      {/* NPC Affinity */}
      {action.npc_affinity.length > 0 && (
        <div
          className="mt-2 pt-2 border-t text-xs"
          style={{ borderColor: StoryModeColors.borderLight }}
        >
          <div
            className="font-bold mb-1"
            style={{ color: StoryModeColors.textSecondary }}
          >
            <Icon name="npcs" size={14} title="NPCs" /> NPC-Vorteile:
          </div>
          <div className="space-y-1">
            {/* B24: umbruchfähig statt hart gekappt — in der schmalen Seitenleiste
                wurde „Kosten-Rabatt" sonst mitten im Wort abgeschnitten. */}
            {action.npc_affinity.map(npcId => (
              <div
                key={npcId}
                className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 px-2 py-1"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${StoryModeColors.borderLight}`,
                }}
              >
                <span
                  className="capitalize font-bold"
                  style={{ color: StoryModeColors.agencyBlue }}
                >
                  {npcId}
                </span>
                <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-xs">
                  <span className="whitespace-nowrap" style={{ color: StoryModeColors.success }}>
                    +10 Beziehung
                  </span>
                  {/* Note: Actual discount calculation would need NPC state here */}
                  <span className="whitespace-nowrap" style={{ color: StoryModeColors.warning }}>
                    Kosten-Rabatt
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="text-xs mt-1 italic"
            style={{ color: StoryModeColors.textMuted }}
          >
            Höhere Beziehung = größerer Rabatt (max. 30%)
          </div>
        </div>
      )}

      {/* Impact Preview (Phase 3.3) */}
      {!gesperrt && (
        <div
          className="mt-2 p-2 border text-xs space-y-1"
          style={{
            // §4.7: Vorschau-Kasten = leicht abgesetztes Papier, Tinten-Text bleibt lesbar.
            backgroundColor: StoryModeColors.surface,
            borderColor: StoryModeColors.borderLight,
          }}
        >
          {/* mb-1 entfernt: der Kasten hat schon space-y-1 — sonst klaffte bei
              Karten OHNE Gesellschafts-Vorschau eine Leerzeile vor „MASCHE:"
              (Vision-Review, mehrfach als „leere Zeile" gemeldet). */}
          <div className="font-bold" style={{ color: StoryModeColors.textSecondary }}>
            AUSWIRKUNG:
          </div>
          {/* M1: Gesellschaftswert-Verschiebung schon hier sichtbar (≈ ohne NPC-Assist). */}
          {societyPreview.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {societyPreview.map(({ key, value }) => (
                <span
                  key={key}
                  style={{ color: value > 0 ? StoryModeColors.warning : StoryModeColors.agencyBlue }}
                  title="Geschätzte Wirkung auf die Gesellschaft"
                >
                  {societyLabel(key)} {value > 0 ? `▲ ≈+${value}` : `▼ ≈${value}`}
                </span>
              ))}
            </div>
          )}
          {/* E7: Frische-Stempel je Ziel-Milieu — warnt VOR dem Ausgeben, nie eine
              Matrix-Zahl (E6). Grauer Kastenstempel: Border statt Schatten/Glow. */}
          {maschenVorschau && (
            <div className="mb-1">
              <span style={{ color: StoryModeColors.textMuted }}>
                MASCHE: {maschenVorschau.familieLabel}
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {maschenVorschau.stempel.slice(0, 3).map((s) => (
                  <span
                    key={s.milieuId}
                    className="px-1.5 py-0.5 border font-bold uppercase"
                    style={{
                      borderColor: STEMPEL_COLOR[s.stempel],
                      color: STEMPEL_COLOR[s.stempel],
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    }}
                    title={`${s.milieuLabel}: Masche ${STEMPEL_LABEL[s.stempel]}`}
                  >
                    {s.milieuLabel}: {STEMPEL_LABEL[s.stempel]}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {(action.costs.risk ?? 0) > 0 && (
              <span style={{ color: (action.costs.risk ?? 0) > 10 ? StoryModeColors.danger : StoryModeColors.warning }}>
                Risiko +{action.costs.risk}%
              </span>
            )}
            {(action.costs.moral_weight ?? 0) > 0 && (
              <span style={{ color: StoryModeColors.ministryRed }}>
                Moral +{action.costs.moral_weight}
              </span>
            )}
            {(action.costs.attention ?? 0) > 0 && (
              <span style={{ color: StoryModeColors.danger }}>
                Aufmerksamkeit +{action.costs.attention}%
              </span>
            )}
            {action.legality === 'illegal' && (
              <span style={{ color: StoryModeColors.danger }}>
                Konsequenz wahrscheinlich
              </span>
            )}
            {action.npc_affinity.length > 0 && (
              <span style={{ color: StoryModeColors.success }}>
                {action.npc_affinity.length} NPC-Bonus
              </span>
            )}
          </div>
        </div>
      )}

      {/* Status Badges */}
      {action.isUsed && (
        <div
          className="mt-2 text-xs font-bold text-center py-1"
          style={{
            // §4.7 Stempel-Slip: vergilbtes Papier + Tinte statt dunkler Fläche mit Tinten-Text.
            backgroundColor: StoryModeColors.oldPaper,
            color: StoryModeColors.textSecondary,
          }}
        >
          ✓ BEREITS VERWENDET
        </div>
      )}
      {!action.isUnlocked && !action.isUsed && (
        <div
          className="mt-2 text-xs font-bold text-center py-1"
          style={{
            backgroundColor: StoryModeColors.oldPaper,
            color: StoryModeColors.textSecondary,
          }}
          title={action.unavailableReason || undefined}
        >
          GESPERRT
        </div>
      )}

      {/* Action Buttons */}
      {!gesperrt && (
        <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: StoryModeColors.borderLight }}>
          <button
            onClick={() => { if (canAfford) onSelect(); }}
            disabled={!canAfford}
            className="flex-1 px-3 py-1.5 border-2 text-xs font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: canAfford ? StoryModeColors.success : StoryModeColors.border,
              borderColor: canAfford ? '#15803d' : StoryModeColors.borderLight,
              color: '#fff',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              opacity: canAfford ? 1 : 0.6,
            }}
            title={canAfford ? 'Sofort ausführen' : 'Jetzt nicht leistbar — Anheften geht trotzdem (gezahlt wird beim Ausspielen)'}
          >
            AUSFÜHREN
          </button>
          {onAddToQueue && (
            <button
              onClick={onAddToQueue}
              className="flex-1 px-3 py-1.5 border-2 text-xs font-bold transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                // v3: warning ist jetzt Tinte — auf dunkler Oliv-Fläche heller Papier-Text.
                backgroundColor: StoryModeColors.militaryOlive,
                borderColor: StoryModeColors.darkOlive,
                color: StoryModeColors.surfaceLight,
              }}
              title="Aufs Korkbrett anheften (Sendeplan)"
            >
              + ANHEFTEN
            </button>
          )}
        </div>
      )}
    </div>
  );
}


export default ActionCard;
