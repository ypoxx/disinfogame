/**
 * DaySummary Component
 *
 * Shows end-of-day summary with decisions, resource changes,
 * and narrative feedback (news headlines, night sequence).
 */

import { StoryModeColors } from '../theme';
import type { DaySummary as DaySummaryType } from '../types';

interface DaySummaryProps {
  summary: DaySummaryType;
  onContinue: () => void;
}

export function DaySummary({ summary, onContinue }: DaySummaryProps) {
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
        className="border-b-4 p-4"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold">TAG {summary.day} - ZUSAMMENFASSUNG</h1>
            <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Feierabend Report
            </p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Decisions Made */}
          <Section title="DEINE ENTSCHEIDUNGEN" icon="✓">
            <div className="space-y-2">
              {summary.decisions.map((decision, i) => (
                <DecisionItem
                  key={i}
                  subject={decision.emailSubject}
                  choice={decision.choiceText}
                  type={decision.choiceType}
                />
              ))}
            </div>
          </Section>

          {/* Resource Changes */}
          <Section title="AUSGABEN HEUTE" icon="💰">
            <div className="grid grid-cols-3 gap-4">
              <ResourceChange
                label="Geld"
                icon="💰"
                start={summary.resourceChanges.money.start}
                end={summary.resourceChanges.money.end}
                change={summary.resourceChanges.money.change}
              />
              <ResourceChange
                label="Aufmerksamkeit"
                icon="👁️"
                start={summary.resourceChanges.attention.start}
                end={summary.resourceChanges.attention.end}
                change={summary.resourceChanges.attention.change}
              />
              <ResourceChange
                label="Infrastruktur"
                icon="🏭"
                start={summary.resourceChanges.infrastructure.start}
                end={summary.resourceChanges.infrastructure.end}
                change={summary.resourceChanges.infrastructure.change}
              />
            </div>
          </Section>

          {/* Impacts */}
          {summary.impacts.length > 0 && (
            <Section title="AUSWIRKUNGEN" icon="📈">
              <div className="space-y-4">
                {summary.impacts.map((impact, i) => (
                  <ImpactCategory key={i} category={impact.category} effects={impact.effects} />
                ))}
              </div>
            </Section>
          )}

          {/* News Headlines */}
          {summary.newsHeadlines.length > 0 && (
            <Section title="TONIGHT'S NEWS" icon="📺">
              <div className="space-y-2">
                {summary.newsHeadlines.map((headline, i) => (
                  <NewsHeadline key={i} text={headline} />
                ))}
              </div>
            </Section>
          )}

          {/* Game State */}
          <Section title="STATUS" icon="⚡">
            <div className="grid grid-cols-3 gap-4">
              <StatusMetric
                label="Öffentliches Vertrauen"
                value={`${Math.round(summary.gameState.trustPublic)}%`}
                color={summary.gameState.trustPublic > 50 ? StoryModeColors.agencyBlue : StoryModeColors.danger}
              />
              <StatusMetric
                label="Wahlchancen"
                value={`${Math.round(summary.gameState.electionChance)}%`}
                color={summary.gameState.electionChance > 50 ? StoryModeColors.militaryOlive : StoryModeColors.danger}
              />
              <StatusMetric
                label="Krisen-Level"
                value={`${Math.round(summary.gameState.crisisLevel)}%`}
                color={summary.gameState.crisisLevel < 50 ? StoryModeColors.agencyBlue : StoryModeColors.danger}
              />
            </div>
          </Section>

          {/* Night Narrative */}
          {summary.nightNarrative && (
            <div
              className="border-4 p-6"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
              }}
            >
              <div className="text-sm italic leading-relaxed whitespace-pre-wrap">
                {summary.nightNarrative.text}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div
        className="p-4 border-t-4"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 font-bold border-4 text-lg transition-all hover:translate-y-1"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.border,
            color: '#FFFFFF',
            boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.8)',
          }}
        >
          WEITER ZU TAG {summary.day + 1} →
        </button>
      </div>
    </div>
  );
}

// ============================================
// SECTION
// ============================================

interface SectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div
      className="border-4"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div
        className="p-3 border-b-4 flex items-center gap-2"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <span>{icon}</span>
        <span className="font-bold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ============================================
// DECISION ITEM
// ============================================

interface DecisionItemProps {
  subject: string;
  choice: string;
  type: string;
}

function DecisionItem({ subject, choice, type }: DecisionItemProps) {
  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-xs mb-1" style={{ color: StoryModeColors.textSecondary }}>
        {subject}
      </div>
      <div className="text-sm" style={{ color: StoryModeColors.textPrimary }}>
        ✓ {choice}
      </div>
    </div>
  );
}

// ============================================
// RESOURCE CHANGE
// ============================================

interface ResourceChangeProps {
  label: string;
  icon: string;
  start: number;
  end: number;
  change: number;
}

function ResourceChange({ label, icon, start, end, change }: ResourceChangeProps) {
  const changeColor = change > 0 ? StoryModeColors.militaryOlive : change < 0 ? StoryModeColors.danger : StoryModeColors.textSecondary;

  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-xs mb-2" style={{ color: StoryModeColors.textSecondary }}>
        {icon} {label}
      </div>
      <div className="text-lg font-bold" style={{ color: StoryModeColors.textPrimary }}>
        {end}
      </div>
      <div className="text-xs" style={{ color: changeColor }}>
        {change >= 0 ? '+' : ''}{change}
      </div>
    </div>
  );
}

// ============================================
// IMPACT CATEGORY
// ============================================

interface ImpactCategoryProps {
  category: string;
  effects: string[];
}

function ImpactCategory({ category, effects }: ImpactCategoryProps) {
  return (
    <div>
      <div className="text-sm font-bold mb-2" style={{ color: StoryModeColors.warning }}>
        {category}:
      </div>
      <ul className="space-y-1">
        {effects.map((effect, i) => (
          <li key={i} className="text-xs flex items-start gap-2">
            <span style={{ color: StoryModeColors.textSecondary }}>•</span>
            <span style={{ color: StoryModeColors.textPrimary }}>{effect}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// NEWS HEADLINE
// ============================================

interface NewsHeadlineProps {
  text: string;
}

function NewsHeadline({ text }: NewsHeadlineProps) {
  return (
    <div
      className="border-2 p-3 border-l-4"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
        borderLeftColor: StoryModeColors.sovietRed,
      }}
    >
      <div className="text-xs" style={{ color: StoryModeColors.textPrimary }}>
        {text}
      </div>
    </div>
  );
}

// ============================================
// STATUS METRIC
// ============================================

interface StatusMetricProps {
  label: string;
  value: string;
  color: string;
}

function StatusMetric({ label, value, color }: StatusMetricProps) {
  return (
    <div
      className="border-2 p-3 text-center"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-xs mb-2" style={{ color: StoryModeColors.textSecondary }}>
        {label}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
