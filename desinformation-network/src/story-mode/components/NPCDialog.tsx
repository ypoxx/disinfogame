/**
 * NPCDialog Component
 *
 * Displays NPC conversations with dialog trees.
 * Handles multi-stage dialogs and relationship changes.
 */

import { StoryModeColors } from '../theme';
import type { NPC, NPCDialog as NPCDialogType, NPCDialogOption } from '../types';

interface NPCDialogProps {
  npc: NPC;
  dialog: NPCDialogType | null;
  relationship: number;
  onChooseOption: (optionId: string) => void;
  onClose: () => void;
}

export function NPCDialog({ npc, dialog, relationship, onChooseOption, onClose }: NPCDialogProps) {
  if (!dialog) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 100,
        }}
      >
        <div
          className="max-w-2xl w-full border-8 p-8 text-center"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <p style={{ color: StoryModeColors.textSecondary }}>
            {npc.name} hat momentan nichts zu sagen.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 border-4 font-bold"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textPrimary,
            }}
          >
            ZURÜCK
          </button>
        </div>
      </div>
    );
  }

  const getDialogTypeColor = (type?: NPCDialogType['type']): string => {
    switch (type) {
      case 'intro':
        return StoryModeColors.agencyBlue;
      case 'mission':
        return StoryModeColors.warning;
      case 'question':
        return StoryModeColors.concrete;
      case 'warning':
        return StoryModeColors.danger;
      case 'result':
        return StoryModeColors.militaryOlive;
      default:
        return StoryModeColors.concrete;
    }
  };

  const getDialogTypeIcon = (type?: NPCDialogType['type']): string => {
    switch (type) {
      case 'intro':
        return '👋';
      case 'mission':
        return '🎯';
      case 'question':
        return '❓';
      case 'warning':
        return '⚠️';
      case 'result':
        return '✓';
      default:
        return '💬';
    }
  };

  const getRelationshipColor = (rel: number): string => {
    if (rel > 50) return StoryModeColors.agencyBlue;
    if (rel > 0) return StoryModeColors.warning;
    if (rel > -50) return StoryModeColors.danger;
    return StoryModeColors.sovietRed;
  };

  const getRelationshipLabel = (rel: number): string => {
    if (rel > 50) return 'LOYAL';
    if (rel > 0) return 'FRIENDLY';
    if (rel > -50) return 'SKEPTICAL';
    return 'HOSTILE';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-w-4xl w-full border-8 flex flex-col"
        style={{
          maxHeight: '90vh',
          backgroundColor: StoryModeColors.concrete,
          borderColor: getDialogTypeColor(dialog.type),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* NPC Header */}
        <div
          className="p-4 border-b-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-4">
              {/* NPC Portrait */}
              <div
                className="text-5xl flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: StoryModeColors.background,
                  border: `4px solid ${StoryModeColors.border}`,
                }}
              >
                {npc.portrait}
              </div>

              {/* NPC Info */}
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
                  {npc.name}
                </h2>
                <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                  {npc.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>

                {/* Relationship Indicator */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="text-xs px-2 py-1 border font-bold"
                    style={{
                      backgroundColor: getRelationshipColor(relationship),
                      borderColor: StoryModeColors.border,
                      color: '#FFFFFF',
                    }}
                  >
                    {getRelationshipLabel(relationship)}
                  </div>
                  <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                    ({relationship > 0 ? '+' : ''}{relationship})
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Type */}
            {dialog.type && (
              <div className="text-right">
                <div className="text-3xl mb-1">{getDialogTypeIcon(dialog.type)}</div>
                <div
                  className="text-xs"
                  style={{ color: getDialogTypeColor(dialog.type) }}
                >
                  {dialog.type.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs px-3 py-1 border-2 transition-all hover:translate-x-1"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.borderLight,
              color: StoryModeColors.textSecondary,
            }}
          >
            ✕ GESPRÄCH BEENDEN
          </button>
        </div>

        {/* Dialog Text - Scrollable */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            backgroundColor: StoryModeColors.background,
          }}
        >
          <div
            className="text-sm whitespace-pre-wrap leading-relaxed"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {dialog.text}
          </div>

          {/* NPC Personality Hint */}
          <div
            className="mt-4 pt-4 border-t-2 text-xs italic"
            style={{
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textSecondary,
            }}
          >
            {npc.personality.description}
          </div>
        </div>

        {/* Dialog Options */}
        <div
          className="p-4 border-t-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-xs mb-3 font-bold" style={{ color: StoryModeColors.warning }}>
            💬 ANTWORTEN
          </div>

          <div className="space-y-2">
            {dialog.options.map((option) => (
              <DialogOptionButton
                key={option.id}
                option={option}
                onSelect={() => onChooseOption(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DIALOG OPTION BUTTON
// ============================================

interface DialogOptionButtonProps {
  option: NPCDialogOption;
  onSelect: () => void;
}

function DialogOptionButton({ option, onSelect }: DialogOptionButtonProps) {
  const getOptionTypeColor = (type: NPCDialogOption['type']): string => {
    switch (type) {
      case 'question':
        return StoryModeColors.agencyBlue;
      case 'command':
        return StoryModeColors.sovietRed;
      case 'challenge':
        return StoryModeColors.danger;
      case 'accept':
        return StoryModeColors.militaryOlive;
      case 'decline':
        return StoryModeColors.textSecondary;
    }
  };

  const getOptionTypeIcon = (type: NPCDialogOption['type']): string => {
    switch (type) {
      case 'question':
        return '❓';
      case 'command':
        return '⚡';
      case 'challenge':
        return '⚔️';
      case 'accept':
        return '✓';
      case 'decline':
        return '✗';
    }
  };

  return (
    <button
      onClick={onSelect}
      className="w-full text-left border-4 p-3 transition-all hover:translate-x-2"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: getOptionTypeColor(option.type),
        boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-lg">{getOptionTypeIcon(option.type)}</div>

          <div className="flex-1">
            <div className="text-sm font-bold" style={{ color: StoryModeColors.textPrimary }}>
              "{option.text}"
            </div>

            {/* Relationship change indicator */}
            {option.relationshipChange !== undefined && option.relationshipChange !== 0 && (
              <div className="text-xs mt-1" style={{
                color: option.relationshipChange > 0
                  ? StoryModeColors.agencyBlue
                  : StoryModeColors.danger
              }}>
                {option.relationshipChange > 0 ? '↑' : '↓'} Beziehung: {option.relationshipChange > 0 ? '+' : ''}{option.relationshipChange}
              </div>
            )}
          </div>
        </div>

        <div className="text-xl" style={{ color: getOptionTypeColor(option.type) }}>
          →
        </div>
      </div>
    </button>
  );
}
