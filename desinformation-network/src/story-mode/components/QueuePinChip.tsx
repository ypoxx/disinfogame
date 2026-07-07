/**
 * QueuePinChip — Mini-Chip „N angeheftet" (Owner-Entscheidung F-D, KONZEPT
 * 2026-07-07 §3.6): Die Queue wird am EINEN Planungsort verwaltet, der
 * Narrativ-Tafel. Der Chip ist nur die Sprungmarke dorthin — er ersetzt das
 * frühere Warteschlangen-Widget (archive/story-mode-drafts/ActionQueueWidget.tsx).
 * `warnung` übernimmt dessen Rot-Signal: der Plan ist nicht mehr leistbar.
 */
import { StoryModeColors } from '../theme';
import { playSound } from '../utils/SoundSystem';
import { PIN_NEEDLE_STYLE } from './NarrativeBoard';

interface QueuePinChipProps {
  count: number;
  /** True, wenn der angeheftete Plan die Ressourcen überzieht (istPlanLeistbar). */
  warnung: boolean;
  onOpenBoard: () => void;
}

export function QueuePinChip({ count, warnung, onOpenBoard }: QueuePinChipProps): React.JSX.Element {
  return (
    <button
      onClick={() => { playSound('paper'); onOpenBoard(); }}
      className="fixed bottom-4 right-4 px-3 py-1.5 border-2 flex items-center gap-2 hover:brightness-110 transition-all"
      style={{
        // §4.7: Papier + Tinte; die Pin-Nadel trägt das Ministeriums-Rot.
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: warnung ? StoryModeColors.danger : StoryModeColors.border,
        color: warnung ? StoryModeColors.danger : StoryModeColors.textPrimary,
        zIndex: 45,
      }}
      title={warnung
        ? 'Plan überzieht die Ressourcen — an der Tafel trimmen (Taste T)'
        : 'Zur Narrativ-Tafel — planen und ausspielen (Taste T)'}
      data-testid="queue-pin-chip"
    >
      <span aria-hidden style={PIN_NEEDLE_STYLE} />
      <span className="text-[11px] font-bold tracking-wider">
        {count} ANGEHEFTET{warnung ? ' — ZU TEUER' : ''} — TAFEL (T)
      </span>
    </button>
  );
}

export default QueuePinChip;
