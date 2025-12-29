import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { NPCState } from '../../game-logic/StoryEngineAdapter';

interface NpcPanelProps {
  isVisible: boolean;
  npcs: NPCState[];
  onSelectNpc: (npcId: string) => void;
  onClose: () => void;
}

export function NpcPanel({
  isVisible,
  npcs,
  onSelectNpc,
  onClose,
}: NpcPanelProps) {
  const [selectedNpc, setSelectedNpc] = useState<NPCState | null>(null);

  if (!isVisible) return null;

  const getRelationshipIcon = (level: number) => {
    switch (level) {
      case 0: return '😐';
      case 1: return '🤝';
      case 2: return '🙂';
      case 3: return '😊';
      default: return '❓';
    }
  };

  const getRelationshipLabel = (level: number) => {
    switch (level) {
      case 0: return 'Neutral';
      case 1: return 'Bekannt';
      case 2: return 'Vertraut';
      case 3: return 'Loyal';
      default: return 'Unbekannt';
    }
  };

  const getRelationshipColor = (level: number) => {
    switch (level) {
      case 0: return StoryModeColors.textSecondary;
      case 1: return StoryModeColors.agencyBlue;
      case 2: return StoryModeColors.warning;
      case 3: return StoryModeColors.success;
      default: return StoryModeColors.textMuted;
    }
  };

  const getMoodColor = (mood: NPCState['currentMood']) => {
    switch (mood) {
      case 'positive': return StoryModeColors.success;
      case 'neutral': return StoryModeColors.textSecondary;
      case 'concerned': return StoryModeColors.warning;
      case 'upset': return StoryModeColors.danger;
      default: return StoryModeColors.textMuted;
    }
  };

  const getMoodLabel = (mood: NPCState['currentMood']) => {
    switch (mood) {
      case 'positive': return 'Positiv';
      case 'neutral': return 'Neutral';
      case 'concerned': return 'Besorgt';
      case 'upset': return 'Aufgebracht';
      default: return 'Unbekannt';
    }
  };

  const handleNpcClick = (npc: NPCState) => {
    if (selectedNpc?.id === npc.id) {
      onSelectNpc(npc.id);
    } else {
      setSelectedNpc(npc);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] mx-4 border-4 flex flex-col"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.warning,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.warning,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <h2 className="font-bold text-xl" style={{ color: StoryModeColors.background }}>
              KONTAKTE & NETZWERK
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1 font-bold border-2 transition-all hover:brightness-110"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textPrimary,
            }}
          >
            SCHLIESSEN [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* NPC List */}
          <div
            className="w-1/2 border-r-4 overflow-y-auto"
            style={{ borderColor: StoryModeColors.border }}
          >
            {npcs.length === 0 ? (
              <div
                className="text-center py-8"
                style={{ color: StoryModeColors.textMuted }}
              >
                Keine Kontakte verfugbar.
              </div>
            ) : (
              npcs.map(npc => (
                <div
                  key={npc.id}
                  className={`p-4 border-b-2 cursor-pointer transition-all hover:brightness-110 ${
                    selectedNpc?.id === npc.id ? 'border-l-4' : ''
                  }`}
                  style={{
                    backgroundColor: selectedNpc?.id === npc.id
                      ? StoryModeColors.darkConcrete
                      : StoryModeColors.surface,
                    borderColor: StoryModeColors.border,
                    borderLeftColor: selectedNpc?.id === npc.id
                      ? StoryModeColors.warning
                      : undefined,
                  }}
                  onClick={() => handleNpcClick(npc)}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 flex items-center justify-center border-2 text-xl font-bold"
                      style={{
                        backgroundColor: StoryModeColors.background,
                        borderColor: getRelationshipColor(npc.relationshipLevel),
                        color: StoryModeColors.textPrimary,
                      }}
                    >
                      {npc.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold"
                          style={{ color: StoryModeColors.textPrimary }}
                        >
                          {npc.name}
                        </span>
                        <span>{getRelationshipIcon(npc.relationshipLevel)}</span>
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: StoryModeColors.textSecondary }}
                      >
                        {npc.role_de}
                      </div>
                      {!npc.available && (
                        <span
                          className="text-xs px-2 py-0.5 mt-1 inline-block"
                          style={{
                            backgroundColor: StoryModeColors.danger,
                            color: '#fff',
                          }}
                        >
                          NICHT VERFUGBAR
                        </span>
                      )}
                      {npc.inCrisis && (
                        <span
                          className="text-xs px-2 py-0.5 mt-1 inline-block ml-1"
                          style={{
                            backgroundColor: StoryModeColors.sovietRed,
                            color: '#fff',
                          }}
                        >
                          IN KRISE
                        </span>
                      )}
                    </div>

                    {/* Relationship Bar */}
                    <div className="w-16">
                      <div
                        className="h-2 w-full"
                        style={{ backgroundColor: StoryModeColors.background }}
                      >
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${(npc.relationshipLevel / 3) * 100}%`,
                            backgroundColor: getRelationshipColor(npc.relationshipLevel),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* NPC Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {selectedNpc ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center mb-6">
                  <div
                    className="w-20 h-20 mx-auto flex items-center justify-center border-4 text-3xl font-bold mb-3"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: getRelationshipColor(selectedNpc.relationshipLevel),
                      color: StoryModeColors.textPrimary,
                    }}
                  >
                    {selectedNpc.name.charAt(0)}
                  </div>
                  <h3
                    className="font-bold text-xl"
                    style={{ color: StoryModeColors.textPrimary }}
                  >
                    {selectedNpc.name}
                  </h3>
                  <p style={{ color: StoryModeColors.textSecondary }}>
                    {selectedNpc.role_de}
                  </p>
                </div>

                {/* Status */}
                <div
                  className="border-2 p-4"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    borderColor: StoryModeColors.border,
                  }}
                >
                  <h4
                    className="font-bold mb-3"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    STATUS
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span style={{ color: StoryModeColors.textMuted }}>Beziehung:</span>
                      <span
                        className="ml-2 font-bold"
                        style={{ color: getRelationshipColor(selectedNpc.relationshipLevel) }}
                      >
                        {getRelationshipLabel(selectedNpc.relationshipLevel)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: StoryModeColors.textMuted }}>Stimmung:</span>
                      <span
                        className="ml-2 font-bold"
                        style={{ color: getMoodColor(selectedNpc.currentMood) }}
                      >
                        {getMoodLabel(selectedNpc.currentMood)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: StoryModeColors.textMuted }}>Verfugbar:</span>
                      <span
                        className="ml-2 font-bold"
                        style={{
                          color: selectedNpc.available
                            ? StoryModeColors.success
                            : StoryModeColors.danger,
                        }}
                      >
                        {selectedNpc.available ? 'Ja' : 'Nein'}
                      </span>
                    </div>
                    {selectedNpc.inCrisis && (
                      <div className="col-span-2">
                        <span
                          className="px-2 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: StoryModeColors.sovietRed,
                            color: '#fff',
                          }}
                        >
                          ⚠️ IN KRISE - GESPRACH NOTIG!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Morale Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span
                        className="text-xs"
                        style={{ color: StoryModeColors.textMuted }}
                      >
                        Morale
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: selectedNpc.morale >= 70
                            ? StoryModeColors.success
                            : selectedNpc.morale >= 50
                            ? StoryModeColors.agencyBlue
                            : selectedNpc.morale >= 30
                            ? StoryModeColors.warning
                            : StoryModeColors.danger
                        }}
                      >
                        {selectedNpc.morale}/100 {
                          selectedNpc.morale >= 70 ? '💚 Stabil' :
                          selectedNpc.morale >= 50 ? '🟡 Neutral' :
                          selectedNpc.morale >= 30 ? '🟠 Besorgt' :
                          '🔴 KRISE'
                        }
                      </span>
                    </div>
                    <div
                      className="h-2 w-full"
                      style={{ backgroundColor: StoryModeColors.darkConcrete }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${selectedNpc.morale}%`,
                          backgroundColor: selectedNpc.morale >= 70
                            ? StoryModeColors.success
                            : selectedNpc.morale >= 50
                            ? StoryModeColors.agencyBlue
                            : selectedNpc.morale >= 30
                            ? StoryModeColors.warning
                            : StoryModeColors.danger
                        }}
                      />
                    </div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: StoryModeColors.textMuted }}
                    >
                      {selectedNpc.morale < 70 && (
                        <>Dunkle Aktionen senken Morale. Niedrige Morale reduziert Boni.</>
                      )}
                      {selectedNpc.morale >= 70 && (
                        <>Hohe Morale = volle Effizienz bei Kosten-Rabatten!</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Relationship Progress */}
                <div
                  className="border-2 p-4"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    borderColor: StoryModeColors.border,
                  }}
                >
                  <h4
                    className="font-bold mb-3"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    BEZIEHUNGS-FORTSCHRITT
                  </h4>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: StoryModeColors.textMuted }}>
                      {getRelationshipLabel(selectedNpc.relationshipLevel)} → {getRelationshipLabel(Math.min(selectedNpc.relationshipLevel + 1, 3) as 0 | 1 | 2 | 3)}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: getRelationshipColor(selectedNpc.relationshipLevel) }}
                    >
                      {selectedNpc.relationshipProgress}/100 Punkte
                    </span>
                  </div>
                  <div
                    className="h-3 w-full mb-2"
                    style={{ backgroundColor: StoryModeColors.darkConcrete }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${selectedNpc.relationshipProgress}%`,
                        backgroundColor: getRelationshipColor(selectedNpc.relationshipLevel),
                      }}
                    />
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: StoryModeColors.textMuted }}
                  >
                    {selectedNpc.relationshipLevel < 3 ? (
                      <>Aktionen mit {selectedNpc.name}'s Spezialisierung: +10 Punkte</>
                    ) : (
                      <>Maximales Level erreicht!</>
                    )}
                  </div>
                </div>

                {/* Specialty Areas */}
                {selectedNpc.specialtyAreas && selectedNpc.specialtyAreas.length > 0 && (
                  <div
                    className="border-2 p-4"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.agencyBlue,
                    }}
                  >
                    <h4
                      className="font-bold mb-3"
                      style={{ color: StoryModeColors.agencyBlue }}
                    >
                      SPEZIALGEBIETE
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNpc.specialtyAreas.map((area: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs"
                          style={{
                            backgroundColor: StoryModeColors.darkConcrete,
                            color: StoryModeColors.agencyBlue,
                            border: `1px solid ${StoryModeColors.agencyBlue}`,
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <button
                  onClick={() => onSelectNpc(selectedNpc.id)}
                  disabled={!selectedNpc.available}
                  className="w-full py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: selectedNpc.available
                      ? StoryModeColors.sovietRed
                      : StoryModeColors.concrete,
                    borderColor: selectedNpc.available
                      ? StoryModeColors.darkRed
                      : StoryModeColors.border,
                    color: selectedNpc.available ? '#fff' : StoryModeColors.textMuted,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                  }}
                >
                  {selectedNpc.available ? 'INTERAGIEREN' : 'NICHT VERFUGBAR'}
                </button>
              </div>
            ) : (
              <div
                className="h-full flex items-center justify-center text-center"
                style={{ color: StoryModeColors.textMuted }}
              >
                <div>
                  <div className="text-4xl mb-4">👤</div>
                  <p>Wahlen Sie einen Kontakt aus der Liste</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 text-xs flex justify-between"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          <span>{npcs.length} Kontakte verfugbar</span>
          <span>{npcs.filter(n => n.relationshipLevel >= 2).length} vertraut</span>
        </div>
      </div>
    </div>
  );
}

export default NpcPanel;
