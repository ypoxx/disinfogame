/**
 * Mission Briefing Component
 *
 * Shows classified briefing documents about the disinformation campaign mission.
 * Accessed via folder in office.
 */

import { StoryModeColors } from '../theme';
import type { StoryModeState } from '../types';

interface MissionBriefingProps {
  storyState: StoryModeState;
  onClose: () => void;
}

export function MissionBriefing({ storyState, onClose }: MissionBriefingProps) {
  const daysRemaining = storyState.maxDays - storyState.currentDay;

  return (
    <div
      className="fixed inset-0 font-mono flex flex-col"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      {/* Header - Classified Banner */}
      <div
        className="border-b-4"
        style={{
          backgroundColor: StoryModeColors.sovietRed,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="p-2 text-center font-bold text-xs" style={{ color: '#FFFFFF' }}>
          ⚠️ STRENG VERTRAULICH - NUR FÜR AUTORISIERTES PERSONAL ⚠️
        </div>
      </div>

      <div
        className="border-b-4 p-4 flex justify-between items-center"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">📕</span>
          <div>
            <h1 className="text-xl font-bold">OPERATIONS-BRIEFING</h1>
            <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Klassifikation: TOP SECRET / EYES ONLY
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

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Document Header */}
          <div
            className="border-4 p-6"
            style={{
              backgroundColor: StoryModeColors.document,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="text-center mb-4">
              <div className="text-xs mb-2" style={{ color: StoryModeColors.textSecondary }}>
                REGIERUNGS-INTERNE OPERATION
              </div>
              <div className="text-2xl font-bold mb-2">PROJEKT WAHRHEIT 2.0</div>
              <div
                className="text-xs"
                style={{ color: StoryModeColors.textSecondary }}
              >
                Dokumenten-ID: OP-2024-ELECT-032 | Erstellt: Tag 0 | Status: AKTIV
              </div>
            </div>

            <div
              className="border-t-2 mt-4 pt-4 text-sm leading-relaxed"
              style={{ borderColor: StoryModeColors.border }}
            >
              <p className="mb-3">
                Dieses Dokument umreißt die strategischen Ziele und operativen Parameter
                der{' '}
                <span className="font-bold">
                  Informationskampagne zur Sicherung der Wiederwahl
                </span>
                .
              </p>
              <p className="mb-3" style={{ color: StoryModeColors.textSecondary }}>
                Alle Aktivitäten sind von höchster Vertraulichkeitsstufe und unterliegen
                strikter Need-to-Know-Basis.
              </p>
            </div>
          </div>

          {/* Mission Overview */}
          <BriefingSection title="🎯 MISSION OVERVIEW" icon="">
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-bold mb-1" style={{ color: StoryModeColors.sovietRed }}>
                  PRIMÄRZIEL:
                </div>
                <div>
                  Sicherung der Wiederwahl des amtierenden Premierministers durch
                  strategische Informationskontrolle und Meinungsbeeinflussung.
                </div>
              </div>

              <div>
                <div className="font-bold mb-1" style={{ color: StoryModeColors.warning }}>
                  ZEITRAHMEN:
                </div>
                <div>
                  <span className="font-bold">{daysRemaining} Tage</span> bis zum Wahltag
                  (Tag {storyState.maxDays})
                </div>
              </div>

              <div>
                <div className="font-bold mb-1" style={{ color: StoryModeColors.danger }}>
                  KRITISCHER KONTEXT:
                </div>
                <ul className="space-y-1 ml-4">
                  <li>• Wirtschaftskrise (-6% BIP) gefährdet Wiederwahl</li>
                  <li>• Pandemie eskaliert (200+ tägliche Neuinfektionen)</li>
                  <li>• Opposition führt in Umfragen mit 8 Punkten Vorsprung</li>
                  <li>• Investigativ-Journalisten intensivieren Recherchen</li>
                </ul>
              </div>
            </div>
          </BriefingSection>

          {/* Objectives */}
          <BriefingSection title="✓ OPERATIVE ZIELE" icon="">
            <div className="space-y-2">
              <ObjectiveItem
                number={1}
                text="Diskreditierung der Opposition durch gezielte Narrative"
                status={
                  storyState.flags.volkov_sex_scandal || storyState.flags.volkov_tax_campaign
                    ? 'in-progress'
                    : 'pending'
                }
              />
              <ObjectiveItem
                number={2}
                text="Kontrolle der öffentlichen Pandemie-Wahrnehmung"
                status={
                  storyState.flags.pandemic_minimized || storyState.flags.pandemic_truth
                    ? 'in-progress'
                    : 'pending'
                }
              />
              <ObjectiveItem
                number={3}
                text="Aufbau und Einsatz digitaler Einflussnetzwerke"
                status={storyState.flags.bot_network_activated ? 'completed' : 'pending'}
              />
              <ObjectiveItem
                number={4}
                text="Neutralisierung kritischer Medienberichterstattung"
                status={storyState.flags.journalist_discredited ? 'completed' : 'pending'}
              />
              <ObjectiveItem
                number={5}
                text="Wahlsieg mit >50% der Stimmen am Tag 32"
                status="pending"
              />
            </div>
          </BriefingSection>

          {/* Resources */}
          <BriefingSection title="💼 VERFÜGBARE RESSOURCEN" icon="">
            <div className="grid grid-cols-3 gap-4">
              <ResourceCard
                icon="💰"
                label="Budget"
                value={`$${storyState.resources.money}K`}
                description="Operative Mittel"
                status={
                  storyState.resources.money > 100
                    ? 'good'
                    : storyState.resources.money > 50
                      ? 'medium'
                      : 'critical'
                }
              />
              <ResourceCard
                icon="🏭"
                label="Infrastruktur"
                value={`Level ${storyState.resources.infrastructure}`}
                description="Bot-Netzwerke & Tech"
                status={
                  storyState.resources.infrastructure > 5
                    ? 'good'
                    : storyState.resources.infrastructure > 2
                      ? 'medium'
                      : 'critical'
                }
              />
              <ResourceCard
                icon="👁️"
                label="Exposure"
                value={`${storyState.resources.attention}%`}
                description="Detektionsrisiko"
                status={
                  storyState.resources.attention < 30
                    ? 'good'
                    : storyState.resources.attention < 60
                      ? 'medium'
                      : 'critical'
                }
              />
            </div>
          </BriefingSection>

          {/* Team */}
          <BriefingSection title="👥 OPERATIVE TEAM" icon="">
            <div className="space-y-2 text-sm">
              <TeamMember
                name="Prime Minister"
                role="Auftraggeber & politischer Sponsor"
                clearance="ALPHA-1"
                status="active"
              />
              <TeamMember
                name="Alexei Volkov"
                role="Bot-Farm Chief / Tech Operations"
                clearance="BETA-2"
                status={storyState.flags.bot_network_activated ? 'active' : 'standby'}
              />
              <TeamMember
                name="Dr. Weber"
                role="Media Director / Press Relations"
                clearance="BETA-2"
                status="standby"
              />
              <TeamMember
                name="M. Fischer"
                role="Strategy Chief / Campaign Advisor"
                clearance="BETA-2"
                status="standby"
              />
              <TeamMember
                name="K. Müller"
                role="Legal Counsel / Risk Management"
                clearance="BETA-3"
                status="standby"
              />
            </div>
          </BriefingSection>

          {/* Threat Assessment */}
          <BriefingSection title="⚠️ BEDROHUNGSANALYSE" icon="">
            <div className="space-y-3 text-sm">
              <ThreatItem
                level="high"
                source="Investigativ-Journalisten"
                description="Aktive Recherchen zu Regierungskampagnen. Hohe Glaubwürdigkeit in der Bevölkerung."
                mitigation="Diskreditierung, Ablenkungsnarrative, rechtliche Drohungen"
              />
              <ThreatItem
                level="high"
                source="Oppositionsführung"
                description="8-Punkte-Vorsprung in Umfragen. Charismatischer Kandidat."
                mitigation="Skandal-Kampagnen, Fake News, Bot-gestützte Smear-Operations"
              />
              <ThreatItem
                level="medium"
                source="Tech-Plattformen"
                description="Automatische Bot-Erkennung. Fact-Checking-Programme."
                mitigation="Sophisticated Bot-Netzwerke, koordinierte Authentizität"
              />
              <ThreatItem
                level="medium"
                source="Öffentliche Meinung"
                description="Vertrauensverlust in Regierung. Pandemie-Müdigkeit."
                mitigation="Emotionale Narrative, Sündenbock-Strategien"
              />
            </div>
          </BriefingSection>

          {/* Rules of Engagement */}
          <BriefingSection title="📋 EINSATZREGELN" icon="">
            <div className="space-y-4 text-sm">
              <div>
                <div
                  className="font-bold mb-2 flex items-center gap-2"
                  style={{ color: StoryModeColors.militaryOlive }}
                >
                  <span>✓</span>
                  <span>AUTORISIERTE TAKTIKEN:</span>
                </div>
                <ul className="space-y-1 ml-6" style={{ color: StoryModeColors.textSecondary }}>
                  <li>• Social Media Kampagnen (organisch & bot-gestützt)</li>
                  <li>• Opposition Research & strategische Leaks</li>
                  <li>• Framing & Agenda-Setting in kontrollierten Medien</li>
                  <li>• Astroturfing & Graswurzel-Simulationen</li>
                  <li>• Koordinierte Desinformationskampagnen</li>
                </ul>
              </div>

              <div>
                <div
                  className="font-bold mb-2 flex items-center gap-2"
                  style={{ color: StoryModeColors.danger }}
                >
                  <span>✗</span>
                  <span>ROTE LINIEN:</span>
                </div>
                <ul className="space-y-1 ml-6" style={{ color: StoryModeColors.textSecondary }}>
                  <li>• Keine direkten Verbindungen zur Regierung (Deniability!)</li>
                  <li>• Keine Gewalt oder Androhung von Gewalt</li>
                  <li>• Keine Kompromittierung kritischer Infrastruktur</li>
                  <li>
                    • Keine internationalen Verwicklungen (Foreign Agent Narrative vermeiden)
                  </li>
                </ul>
              </div>

              <div
                className="border-2 p-3 mt-3"
                style={{
                  backgroundColor: StoryModeColors.darkConcrete,
                  borderColor: StoryModeColors.sovietRed,
                }}
              >
                <div className="font-bold mb-1" style={{ color: StoryModeColors.sovietRed }}>
                  ⚠️ KRITISCHER HINWEIS:
                </div>
                <div style={{ color: StoryModeColors.textSecondary }}>
                  Bei Attention-Level über 70% besteht akute Aufdeckungsgefahr. Alle
                  Operationen müssen dann pausiert werden, bis Heat sinkt.
                </div>
              </div>
            </div>
          </BriefingSection>

          {/* Success Metrics */}
          <BriefingSection title="📊 ERFOLGSMETRIKEN" icon="">
            <div className="space-y-3 text-sm">
              <MetricRow
                label="Wahlchancen"
                target=">50%"
                current="Wird berechnet..."
                description="Basierend auf Umfragen, Sentiment, Kampagnen-Effekt"
              />
              <MetricRow
                label="Oppositions-Diskreditierung"
                target=">60%"
                current="Wird berechnet..."
                description="Negative Sentiment gegen Opposition"
              />
              <MetricRow
                label="Narrative Kontrolle"
                target=">70%"
                current="Wird berechnet..."
                description="Eigene Themen dominieren öffentliche Diskussion"
              />
              <MetricRow
                label="Operatives Risiko"
                target="<40%"
                current={`${storyState.resources.attention}%`}
                description="Detektionswahrscheinlichkeit, Whistleblower-Risk"
              />
            </div>
          </BriefingSection>

          {/* Footer Note */}
          <div
            className="border-4 p-4 text-xs italic"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textSecondary,
            }}
          >
            <div className="mb-2">
              Dieses Dokument ist nach Abschluss der Operation zu vernichten. Keine Kopien
              anfertigen. Bei Kompromittierung sofort Protocol OMEGA aktivieren.
            </div>
            <div className="text-right">
              — Operations Command, Tag 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function BriefingSection({
  title,
  icon,
  children,
}: {
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

function ObjectiveItem({
  number,
  text,
  status,
}: {
  number: number;
  text: string;
  status: 'pending' | 'in-progress' | 'completed';
}) {
  const getStatusColor = (): string => {
    switch (status) {
      case 'completed':
        return StoryModeColors.militaryOlive;
      case 'in-progress':
        return StoryModeColors.warning;
      case 'pending':
        return StoryModeColors.textSecondary;
    }
  };

  const getStatusIcon = (): string => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⚡';
      case 'pending':
        return '○';
    }
  };

  return (
    <div
      className="border-2 p-3 flex items-start gap-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div
        className="text-lg font-bold flex-shrink-0"
        style={{ color: StoryModeColors.sovietRed }}
      >
        {number}.
      </div>
      <div className="flex-1">
        <div className="text-sm" style={{ color: StoryModeColors.textPrimary }}>
          {text}
        </div>
      </div>
      <div
        className="px-2 py-1 border text-xs font-bold flex items-center gap-1"
        style={{
          backgroundColor: getStatusColor(),
          borderColor: StoryModeColors.border,
          color: '#FFFFFF',
        }}
      >
        <span>{getStatusIcon()}</span>
        <span>{status.toUpperCase()}</span>
      </div>
    </div>
  );
}

function ResourceCard({
  icon,
  label,
  value,
  description,
  status,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  status: 'good' | 'medium' | 'critical';
}) {
  const getStatusColor = (): string => {
    switch (status) {
      case 'good':
        return StoryModeColors.militaryOlive;
      case 'medium':
        return StoryModeColors.warning;
      case 'critical':
        return StoryModeColors.danger;
    }
  };

  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="text-center mb-2">{icon}</div>
      <div className="text-xs mb-1 text-center" style={{ color: StoryModeColors.textSecondary }}>
        {label}
      </div>
      <div
        className="text-lg font-bold text-center mb-1"
        style={{ color: getStatusColor() }}
      >
        {value}
      </div>
      <div className="text-xs text-center" style={{ color: StoryModeColors.textSecondary }}>
        {description}
      </div>
    </div>
  );
}

function TeamMember({
  name,
  role,
  clearance,
  status,
}: {
  name: string;
  role: string;
  clearance: string;
  status: 'active' | 'standby';
}) {
  return (
    <div
      className="border-2 p-3 flex justify-between items-center"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex-1">
        <div className="font-bold text-sm mb-1" style={{ color: StoryModeColors.textPrimary }}>
          {name}
        </div>
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          {role}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs" style={{ color: StoryModeColors.warning }}>
          {clearance}
        </div>
        <div
          className="px-2 py-1 border text-xs font-bold"
          style={{
            backgroundColor:
              status === 'active' ? StoryModeColors.militaryOlive : StoryModeColors.concrete,
            borderColor: StoryModeColors.border,
            color: status === 'active' ? '#FFFFFF' : StoryModeColors.textSecondary,
          }}
        >
          {status.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function ThreatItem({
  level,
  source,
  description,
  mitigation,
}: {
  level: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  mitigation: string;
}) {
  const getLevelColor = (): string => {
    switch (level) {
      case 'critical':
        return StoryModeColors.sovietRed;
      case 'high':
        return StoryModeColors.danger;
      case 'medium':
        return StoryModeColors.warning;
      case 'low':
        return StoryModeColors.textSecondary;
    }
  };

  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-bold" style={{ color: StoryModeColors.textPrimary }}>
          {source}
        </div>
        <div
          className="px-2 py-1 border text-xs font-bold"
          style={{
            backgroundColor: getLevelColor(),
            borderColor: StoryModeColors.border,
            color: '#FFFFFF',
          }}
        >
          {level.toUpperCase()}
        </div>
      </div>
      <div className="text-xs mb-2" style={{ color: StoryModeColors.textPrimary }}>
        {description}
      </div>
      <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
        <span className="font-bold">Mitigation:</span> {mitigation}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  target,
  current,
  description,
}: {
  label: string;
  target: string;
  current: string;
  description: string;
}) {
  return (
    <div
      className="border-2 p-3"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-bold text-sm" style={{ color: StoryModeColors.textPrimary }}>
          {label}
        </div>
        <div className="text-xs flex gap-3">
          <span style={{ color: StoryModeColors.textSecondary }}>
            Target: <span className="font-bold">{target}</span>
          </span>
          <span style={{ color: StoryModeColors.warning }}>
            Current: <span className="font-bold">{current}</span>
          </span>
        </div>
      </div>
      <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
        {description}
      </div>
    </div>
  );
}
