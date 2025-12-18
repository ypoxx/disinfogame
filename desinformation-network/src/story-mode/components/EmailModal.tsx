/**
 * EmailModal Component
 *
 * Shows full email content with decision points.
 * Displays feedback after choice is made.
 */

import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { Email, EmailChoice } from '../types';

interface EmailModalProps {
  email: Email;
  onChoose: (choiceId: string) => void;
  onClose: () => void;
  canAfford: (costs: { money?: number; attention?: number; infrastructure?: number }) => boolean;
}

export function EmailModal({ email, onChoose, onClose, canAfford }: EmailModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<EmailChoice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoice = (choice: EmailChoice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
  };

  const handleConfirm = () => {
    if (selectedChoice) {
      onChoose(selectedChoice.id);
    }
  };

  const getPriorityColor = (priority: Email['priority']): string => {
    switch (priority) {
      case 'critical':
        return StoryModeColors.danger;
      case 'urgent':
        return StoryModeColors.sovietRed;
      case 'normal':
        return StoryModeColors.warning;
      case 'low':
        return StoryModeColors.textSecondary;
    }
  };

  const getChoiceTypeColor = (type: EmailChoice['type']): string => {
    switch (type) {
      case 'truth':
        return StoryModeColors.agencyBlue;
      case 'soft-lie':
        return StoryModeColors.warning;
      case 'hard-lie':
        return StoryModeColors.danger;
      case 'postpone':
        return StoryModeColors.textSecondary;
      case 'delegate':
        return StoryModeColors.militaryOlive;
      default:
        return StoryModeColors.concrete;
    }
  };

  const getChoiceTypeLabel = (type: EmailChoice['type']): string => {
    switch (type) {
      case 'truth':
        return '✓ EHRLICH';
      case 'soft-lie':
        return '⚠ BESCHÖNIGUNG';
      case 'hard-lie':
        return '✗ LÜGE';
      case 'postpone':
        return '⏰ VERSCHIEBEN';
      case 'delegate':
        return '👥 DELEGIEREN';
      default:
        return '';
    }
  };

  // Show feedback screen after choice
  if (showFeedback && selectedChoice) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 100,
        }}
      >
        <div
          className="max-w-3xl w-full border-8 flex flex-col"
          style={{
            maxHeight: '90vh',
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: getChoiceTypeColor(selectedChoice.type),
          }}
        >
          {/* Feedback Header */}
          <div
            className="p-4 border-b-4"
            style={{
              backgroundColor: getChoiceTypeColor(selectedChoice.type),
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {getChoiceTypeLabel(selectedChoice.type)}
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>
              {selectedChoice.feedbackTitle}
            </h2>
          </div>

          {/* Feedback Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              className="text-sm whitespace-pre-wrap mb-6"
              style={{ color: StoryModeColors.textPrimary, lineHeight: '1.6' }}
            >
              {selectedChoice.feedbackBody}
            </div>

            {/* Cynicism Quote */}
            {selectedChoice.feedbackCynicism && (
              <div
                className="border-l-4 pl-4 py-3 mb-4"
                style={{
                  borderColor: StoryModeColors.danger,
                  backgroundColor: 'rgba(196, 30, 58, 0.1)',
                }}
              >
                <div
                  className="text-xs mb-2 font-bold"
                  style={{ color: StoryModeColors.danger }}
                >
                  💀 ZYNISMUS
                </div>
                <div
                  className="text-xs italic"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  {selectedChoice.feedbackCynicism}
                </div>
              </div>
            )}

            {/* Poetry Quote */}
            {selectedChoice.feedbackPoetry && (
              <div
                className="border-l-4 pl-4 py-3"
                style={{
                  borderColor: StoryModeColors.agencyBlue,
                  backgroundColor: 'rgba(0, 51, 102, 0.1)',
                }}
              >
                <div
                  className="text-xs mb-2 font-bold"
                  style={{ color: StoryModeColors.agencyBlue }}
                >
                  📖 REFLEXION
                </div>
                <div
                  className="text-xs italic"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  {selectedChoice.feedbackPoetry}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div
            className="p-4 border-t-4"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <button
              onClick={handleConfirm}
              className="w-full py-3 px-6 font-bold border-4 transition-all hover:translate-y-1"
              style={{
                backgroundColor: getChoiceTypeColor(selectedChoice.type),
                borderColor: StoryModeColors.border,
                color: '#FFFFFF',
                boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              VERSTANDEN → ZURÜCK ZUM BÜRO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main email view
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
          borderColor: getPriorityColor(email.priority),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Header */}
        <div
          className="p-4 border-b-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div
                className="text-xs mb-1"
                style={{ color: StoryModeColors.textSecondary }}
              >
                VON: {email.from.toUpperCase()}
              </div>
              <h2
                className="text-lg font-bold"
                style={{ color: getPriorityColor(email.priority) }}
              >
                {email.subject}
              </h2>
            </div>
            <div className="text-right">
              <div
                className="text-xs mb-1"
                style={{ color: StoryModeColors.textSecondary }}
              >
                ZEIT: {email.time}
              </div>
              <div
                className="text-xs px-2 py-1 border inline-block"
                style={{
                  backgroundColor: getPriorityColor(email.priority),
                  borderColor: StoryModeColors.border,
                  color: '#FFFFFF',
                }}
              >
                {email.priority.toUpperCase()}
              </div>
            </div>
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
            ✕ SCHLIESSEN [ESC]
          </button>
        </div>

        {/* Email Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="text-sm whitespace-pre-wrap mb-6"
            style={{ color: StoryModeColors.textPrimary, lineHeight: '1.6' }}
          >
            {email.body}
          </div>
        </div>

        {/* Choices */}
        <div
          className="p-4 border-t-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-xs mb-3 font-bold" style={{ color: StoryModeColors.warning }}>
            ⚠️ ENTSCHEIDUNG ERFORDERLICH
          </div>

          <div className="space-y-2">
            {email.choices.map((choice) => {
              const canAffordChoice = choice.costs ? canAfford(choice.costs) : true;

              return (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  canAfford={canAffordChoice}
                  typeColor={getChoiceTypeColor(choice.type)}
                  typeLabel={getChoiceTypeLabel(choice.type)}
                  onSelect={() => handleChoice(choice)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CHOICE BUTTON
// ============================================

interface ChoiceButtonProps {
  choice: EmailChoice;
  canAfford: boolean;
  typeColor: string;
  typeLabel: string;
  onSelect: () => void;
}

function ChoiceButton({ choice, canAfford, typeColor, typeLabel, onSelect }: ChoiceButtonProps) {
  return (
    <button
      onClick={onSelect}
      disabled={!canAfford}
      className="w-full text-left border-4 p-3 transition-all hover:translate-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: canAfford ? typeColor : StoryModeColors.textSecondary,
        boxShadow: canAfford ? '3px 3px 0px 0px rgba(0,0,0,0.8)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Choice type label */}
          <div className="text-xs mb-1" style={{ color: typeColor }}>
            {typeLabel}
          </div>

          {/* Choice text */}
          <div className="text-sm font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
            {choice.text}
          </div>

          {/* Description */}
          {choice.description && (
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              {choice.description}
            </div>
          )}

          {/* Costs */}
          {choice.costs && (
            <div className="flex gap-3 mt-2 text-xs">
              {choice.costs.money !== undefined && (
                <span style={{ color: canAfford ? StoryModeColors.warning : StoryModeColors.danger }}>
                  💰 -{choice.costs.money}
                </span>
              )}
              {choice.costs.attention !== undefined && (
                <span style={{ color: StoryModeColors.danger }}>
                  👁️ +{choice.costs.attention}
                </span>
              )}
              {choice.costs.infrastructure !== undefined && (
                <span style={{ color: StoryModeColors.militaryOlive }}>
                  🏭 +{choice.costs.infrastructure}
                </span>
              )}
            </div>
          )}

          {/* Cannot afford warning */}
          {!canAfford && (
            <div className="text-xs mt-2" style={{ color: StoryModeColors.danger }}>
              ⚠️ NICHT GENUG RESSOURCEN
            </div>
          )}
        </div>

        {/* Arrow */}
        {canAfford && (
          <div className="text-xl" style={{ color: typeColor }}>
            →
          </div>
        )}
      </div>
    </button>
  );
}
