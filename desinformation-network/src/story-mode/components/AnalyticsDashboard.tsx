/**
 * Analytics Dashboard Component
 *
 * Shows campaign performance, network metrics, and strategic overview.
 * Accessed via TV screen in office.
 */

import { StoryModeColors } from '../theme';
import type { StoryModeState } from '../types';
import type { NetworkMetrics } from '@/game-logic/types';

interface AnalyticsDashboardProps {
  storyState: StoryModeState;
  networkMetrics: NetworkMetrics;
  onClose: () => void;
}

export function AnalyticsDashboard({ storyState, networkMetrics, onClose }: AnalyticsDashboardProps) {
  // Calculate campaign effectiveness
  const campaignEffectiveness = Math.min(100, storyState.resources.infrastructure * 5);

  // Calculate public sentiment based on moral alignment and trust
  // NetworkMetrics.averageTrust is 0-1, convert to 0-100
  const trustPercentage = networkMetrics.averageTrust * 100;
  const publicSentiment = Math.max(0, Math.min(100, 50 + (storyState.moralAlignment / 2) + (trustPercentage - 50)));

  // Calculate election projection
  const electionProjection = Math.max(0, Math.min(100,
    32 + // Base
    (campaignEffectiveness * 0.3) +
    (publicSentiment * 0.2) -
    (storyState.resources.attention * 0.3)
  ));

  const getThreatLevel = (): { level: string; color: string } => {
    const heat = storyState.resources.attention;
    if (heat > 60) return { level: 'KRITISCH', color: StoryModeColors.danger };
    if (heat > 30) return { level: 'ERHÖHT', color: StoryModeColors.warning };
    return { level: 'NIEDRIG', color: StoryModeColors.agencyBlue };
  };

  const threat = getThreatLevel();

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
        <div className="flex items-center gap-3">
          <span className="text-3xl">📺</span>
          <div>
            <h1 className="text-xl font-bold">CAMPAIGN ANALYTICS</h1>
            <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Real-time Strategic Dashboard
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
          ← ZURÜCK
        </button>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              label="WAHLPROGNOSE"
              value={`${Math.round(electionProjection)}%`}
              subtitle="Aktuelle Umfragen"
              color={electionProjection > 50 ? StoryModeColors.militaryOlive : StoryModeColors.danger}
            />
            <MetricCard
              label="KAMPAGNEN-EFFEKT"
              value={`${Math.round(campaignEffectiveness)}%`}
              subtitle="Bot-Netzwerk + Infrastruktur"
              color={StoryModeColors.agencyBlue}
            />
            <MetricCard
              label="ÖFFENTLICHE STIMMUNG"
              value={`${Math.round(publicSentiment)}%`}
              subtitle="Vertrauen + Moral"
              color={publicSentiment > 50 ? StoryModeColors.agencyBlue : StoryModeColors.warning}
            />
            <MetricCard
              label="DETEKTIONS-RISIKO"
              value={threat.level}
              subtitle={`Heat: ${storyState.resources.attention}%`}
              color={threat.color}
            />
          </div>

          {/* Campaign Performance Bars */}
          <DashboardSection title="KAMPAGNEN-PERFORMANCE" icon="📊">
            <div className="space-y-4">
              <ProgressBar
                label="Social Media Reach"
                value={Math.min(100, storyState.resources.infrastructure * 10)}
                max={100}
                color={StoryModeColors.agencyBlue}
              />
              <ProgressBar
                label="Netzwerk Trust Degradation"
                value={Math.max(0, 100 - (networkMetrics.averageTrust * 100))}
                max={100}
                color={StoryModeColors.danger}
              />
              <ProgressBar
                label="Media Influence"
                value={Math.min(100, (storyState.relationships.weber + 100) / 2)}
                max={100}
                color={StoryModeColors.warning}
              />
              <ProgressBar
                label="Opposition Weakness"
                value={Math.max(0, 100 - publicSentiment)}
                max={100}
                color={StoryModeColors.militaryOlive}
              />
            </div>
          </DashboardSection>

          {/* Relationship Status */}
          <DashboardSection title="TEAM-STATUS" icon="👥">
            <div className="grid grid-cols-2 gap-4">
              <RelationshipCard
                name="PRIME MINISTER"
                relationship={storyState.relationships.pm}
                role="Auftraggeber"
              />
              <RelationshipCard
                name="ALEXEI VOLKOV"
                relationship={storyState.relationships.volkov}
                role="Bot-Farm Chief"
              />
              <RelationshipCard
                name="DR. WEBER"
                relationship={storyState.relationships.weber}
                role="Media Director"
              />
              <RelationshipCard
                name="M. FISCHER"
                relationship={storyState.relationships.fischer}
                role="Strategy Chief"
              />
            </div>
          </DashboardSection>

          {/* Active Campaigns */}
          <DashboardSection title="AKTIVE KAMPAGNEN" icon="⚡">
            <div className="space-y-2">
              {storyState.flags.bot_network_activated && (
                <CampaignItem
                  name="Bot-Netzwerk Operation"
                  status="AKTIV"
                  reach={storyState.resources.infrastructure * 5000}
                  color={StoryModeColors.sovietRed}
                />
              )}
              {storyState.flags.volkov_tax_campaign && (
                <CampaignItem
                  name="Steuerskandal-Kampagne"
                  status="LAUFEND"
                  reach={30000}
                  color={StoryModeColors.warning}
                />
              )}
              {storyState.flags.volkov_sex_scandal && (
                <CampaignItem
                  name="Sex-Skandal Operation"
                  status="VIRAL"
                  reach={100000}
                  color={StoryModeColors.danger}
                />
              )}
              {storyState.flags.clean_campaign && (
                <CampaignItem
                  name="Positive Kampagne"
                  status="AKTIV"
                  reach={15000}
                  color={StoryModeColors.agencyBlue}
                />
              )}
              {!storyState.flags.bot_network_activated &&
               !storyState.flags.clean_campaign && (
                <div
                  className="text-center py-8"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  Keine aktiven Kampagnen
                </div>
              )}
            </div>
          </DashboardSection>

          {/* Threats & Opportunities */}
          <div className="grid grid-cols-2 gap-4">
            <DashboardSection title="⚠️ BEDROHUNGEN" icon="">
              <div className="space-y-2 text-sm">
                {storyState.resources.attention > 50 && (
                  <ThreatItem text="Investigativ-Journalisten aktiv" level="high" />
                )}
                {storyState.flags.pandemic_minimized && (
                  <ThreatItem text="Pandemie-Lüge könnte auffliegen" level="medium" />
                )}
                {storyState.flags.journalist_discredited && (
                  <ThreatItem text="Diskreditierte Journalistin könnte zurückschlagen" level="medium" />
                )}
                {storyState.resources.money < 30 && (
                  <ThreatItem text="Budget kritisch niedrig" level="high" />
                )}
                {storyState.relationships.volkov < -50 && (
                  <ThreatItem text="Volkov könnte überläufer werden" level="critical" />
                )}
                {Object.values(storyState.flags).filter(Boolean).length === 0 && (
                  <div style={{ color: StoryModeColors.textSecondary }}>
                    Keine aktuellen Bedrohungen erkannt
                  </div>
                )}
              </div>
            </DashboardSection>

            <DashboardSection title="💡 CHANCEN" icon="">
              <div className="space-y-2 text-sm">
                {storyState.resources.infrastructure > 5 && (
                  <OpportunityItem text="Starkes Bot-Netzwerk für neue Kampagnen" />
                )}
                {storyState.relationships.pm > 20 && (
                  <OpportunityItem text="PM-Unterstützung für aggressive Taktiken" />
                )}
                {storyState.flags.tv_debate_accepted && (
                  <OpportunityItem text="TV-Debatte als Wendepunkt" />
                )}
                {storyState.resources.money > 80 && (
                  <OpportunityItem text="Starkes Budget für Groß-Kampagnen" />
                )}
                {storyState.flags.opposition_ignored && (
                  <OpportunityItem text="Opposition hat sich noch nicht organisiert" />
                )}
              </div>
            </DashboardSection>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function MetricCard({ label, value, subtitle, color }: {
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="border-4 p-4"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-xs mb-2" style={{ color: StoryModeColors.textSecondary }}>
        {label}
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
        {subtitle}
      </div>
    </div>
  );
}

function DashboardSection({ title, icon, children }: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border-4"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div
        className="p-3 border-b-4 flex items-center gap-2 font-bold"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: StoryModeColors.textPrimary }}>{label}</span>
        <span style={{ color }}>{Math.round(percentage)}%</span>
      </div>
      <div
        className="h-6 border-2 relative overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div
          className="h-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function RelationshipCard({ name, relationship, role }: {
  name: string;
  relationship: number;
  role: string;
}) {
  const getColor = (rel: number): string => {
    if (rel > 50) return StoryModeColors.agencyBlue;
    if (rel > 0) return StoryModeColors.warning;
    if (rel > -50) return StoryModeColors.danger;
    return StoryModeColors.sovietRed;
  };

  const getStatus = (rel: number): string => {
    if (rel > 50) return 'LOYAL';
    if (rel > 0) return 'FRIENDLY';
    if (rel > -50) return 'SKEPTICAL';
    return 'HOSTILE';
  };

  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-sm font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
        {name}
      </div>
      <div className="text-xs mb-2" style={{ color: StoryModeColors.textSecondary }}>
        {role}
      </div>
      <div className="flex items-center justify-between">
        <div
          className="text-xs px-2 py-1 border font-bold"
          style={{
            backgroundColor: getColor(relationship),
            borderColor: StoryModeColors.border,
            color: '#FFFFFF',
          }}
        >
          {getStatus(relationship)}
        </div>
        <div className="text-sm" style={{ color: getColor(relationship) }}>
          {relationship > 0 ? '+' : ''}{relationship}
        </div>
      </div>
    </div>
  );
}

function CampaignItem({ name, status, reach, color }: {
  name: string;
  status: string;
  reach: number;
  color: string;
}) {
  return (
    <div
      className="border-2 p-3 flex justify-between items-center"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div>
        <div className="text-sm font-bold" style={{ color: StoryModeColors.textPrimary }}>
          {name}
        </div>
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          Reichweite: {reach.toLocaleString()} Accounts
        </div>
      </div>
      <div
        className="text-xs px-3 py-1 border-2 font-bold"
        style={{
          backgroundColor: color,
          borderColor: StoryModeColors.border,
          color: '#FFFFFF',
        }}
      >
        {status}
      </div>
    </div>
  );
}

function ThreatItem({ text, level }: {
  text: string;
  level: 'low' | 'medium' | 'high' | 'critical';
}) {
  const getColor = (): string => {
    switch (level) {
      case 'critical': return StoryModeColors.sovietRed;
      case 'high': return StoryModeColors.danger;
      case 'medium': return StoryModeColors.warning;
      default: return StoryModeColors.textSecondary;
    }
  };

  const getIcon = (): string => {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return '•';
    }
  };

  return (
    <div className="flex items-start gap-2">
      <span>{getIcon()}</span>
      <span style={{ color: getColor() }}>{text}</span>
    </div>
  );
}

function OpportunityItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span>✓</span>
      <span style={{ color: StoryModeColors.agencyBlue }}>{text}</span>
    </div>
  );
}
