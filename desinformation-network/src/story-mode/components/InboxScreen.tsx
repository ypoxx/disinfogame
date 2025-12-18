/**
 * InboxScreen Component
 *
 * Displays list of available emails for the current day.
 * Player can click on emails to read and make decisions.
 */

import { StoryModeColors } from '../theme';
import type { Email } from '../types';

interface InboxScreenProps {
  emails: Email[];
  onSelectEmail: (emailId: string) => void;
  onClose: () => void;
}

export function InboxScreen({ emails, onSelectEmail, onClose }: InboxScreenProps) {
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

  const getPriorityIcon = (priority: Email['priority']): string => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'urgent':
        return '⚠️';
      case 'normal':
        return '📧';
      case 'low':
        return '📄';
    }
  };

  return (
    <div
      className="fixed inset-0 font-mono flex flex-col"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      {/* Header */}
      <div
        className="border-b-4 p-4 flex justify-between items-center"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">📧</span>
          <div>
            <h1 className="text-xl font-bold">SECURE INBOX</h1>
            <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              {emails.length} unread message{emails.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 font-bold border-2 transition-all hover:translate-x-1"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textPrimary,
            boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
          }}
        >
          ← BACK TO OFFICE
        </button>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto p-4">
        {emails.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: StoryModeColors.textSecondary }}
          >
            <p className="text-xl mb-2">📭</p>
            <p>No unread emails</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            {emails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                priorityColor={getPriorityColor(email.priority)}
                priorityIcon={getPriorityIcon(email.priority)}
                onClick={() => onSelectEmail(email.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// EMAIL LIST ITEM
// ============================================

interface EmailListItemProps {
  email: Email;
  priorityColor: string;
  priorityIcon: string;
  onClick: () => void;
}

function EmailListItem({ email, priorityColor, priorityIcon, onClick }: EmailListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border-4 p-4 transition-all hover:translate-x-2 cursor-pointer"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{priorityIcon}</span>
          <div className="flex-1 min-w-0">
            <div
              className="text-xs mb-1"
              style={{ color: StoryModeColors.textSecondary }}
            >
              FROM: {email.from.toUpperCase()}
            </div>
            <div className="font-bold text-sm truncate" style={{ color: priorityColor }}>
              {email.subject}
            </div>
          </div>
        </div>

        <div
          className="text-xs whitespace-nowrap"
          style={{ color: StoryModeColors.textSecondary }}
        >
          {email.time}
        </div>
      </div>

      {/* Preview */}
      <div
        className="text-xs line-clamp-2 mt-2"
        style={{ color: StoryModeColors.textSecondary }}
      >
        {email.body.substring(0, 120)}...
      </div>

      {/* Tags */}
      {email.tags && email.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {email.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 border"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textSecondary,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action indicator */}
      <div className="mt-3 text-xs font-bold" style={{ color: priorityColor }}>
        {email.choices.length} DECISION{email.choices.length !== 1 ? 'S' : ''} REQUIRED →
      </div>
    </button>
  );
}
