import { useState, useMemo } from 'react';
import type { PersuasionTechnique } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';

// Import taxonomy data
import taxonomyData from '@/data/persuasion/taxonomy.json';

// ============================================
// TYPES
// ============================================

type EncyclopediaProps = {
  isOpen: boolean;
  onClose: () => void;
  highlightedTechniqueId?: string;
};

// ============================================
// CATEGORY DATA
// ============================================

const CATEGORIES = [
  { id: 'all', name: 'All Techniques' },
  { id: 'cognitive', name: 'Cognitive' },
  { id: 'social', name: 'Social' },
  { id: 'emotional', name: 'Emotional' },
  { id: 'rhetorical', name: 'Rhetorical' },
  { id: 'digital', name: 'Digital' },
  { id: 'neurological', name: 'Neurological' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

function TechniqueCard({
  technique,
  isSelected,
  onClick,
}: {
  technique: PersuasionTechnique;
  isSelected: boolean;
  onClick: () => void;
}) {
  const manipulationColor = 
    technique.manipulationPotential > 0.7 ? '#EF4444' :
    technique.manipulationPotential > 0.4 ? '#F59E0B' :
    '#22C55E';

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-lg border text-left transition-all",
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={cn(
          "font-semibold",
          isSelected ? "text-blue-900" : "text-gray-900"
        )}>
          {technique.name}
        </h3>
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
          style={{ backgroundColor: manipulationColor }}
          title={`Manipulation Potential: ${formatPercent(technique.manipulationPotential)}`}
        />
      </div>
      
      <p className="text-sm text-gray-500 line-clamp-2">
        {technique.description}
      </p>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {technique.taxonomyGroups.slice(0, 2).map(group => (
          <span 
            key={group}
            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
          >
            {group}
          </span>
        ))}
      </div>
    </button>
  );
}

function TechniqueDetail({ technique }: { technique: PersuasionTechnique }) {
  const manipulationColor = 
    technique.manipulationPotential > 0.7 ? '#EF4444' :
    technique.manipulationPotential > 0.4 ? '#F59E0B' :
    '#22C55E';

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {technique.name}
        </h2>
        <p className="text-gray-600">{technique.description}</p>
      </div>

      {/* Manipulation Potential */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Manipulation Potential</span>
          <span 
            className="text-sm font-bold"
            style={{ color: manipulationColor }}
          >
            {formatPercent(technique.manipulationPotential)}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-2 rounded-full"
            style={{ 
              width: `${technique.manipulationPotential * 100}%`,
              backgroundColor: manipulationColor,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Confidence: {technique.uncertainty.confidenceLevel} ({technique.uncertainty.basis})
        </p>
      </div>

      {/* Long Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Explanation</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {technique.longDescription}
        </p>
      </div>

      {/* Example */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Example</h3>
        <p className="text-blue-800">{technique.example}</p>
        {technique.extendedExample && (
          <p className="text-blue-700 text-sm mt-2">{technique.extendedExample}</p>
        )}
      </div>

      {/* Counter Strategies */}
      {technique.counterStrategies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Counter Strategies</h3>
          <ul className="space-y-2">
            {technique.counterStrategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-600">{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Applications */}
      {technique.applications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications</h3>
          <div className="flex flex-wrap gap-2">
            {technique.applications.map(app => (
              <span 
                key={app}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empirical Evidence */}
      {technique.empiricalEvidence.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Evidence</h3>
          <ul className="space-y-1">
            {technique.empiricalEvidence.map((evidence, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                • {evidence}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learn More */}
      {technique.wikipediaQuery && (
        <div className="pt-4 border-t border-gray-200">
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(technique.wikipediaQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Learn more on Wikipedia →
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function Encyclopedia({
  isOpen,
  onClose,
  highlightedTechniqueId,
}: EncyclopediaProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<PersuasionTechnique | null>(null);

  // Get techniques from taxonomy
  const techniques = useMemo(() => {
    return (taxonomyData.nodes || []) as PersuasionTechnique[];
  }, []);

  // Filter techniques
  const filteredTechniques = useMemo(() => {
    return techniques.filter(t => {
      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.taxonomyGroups.some(g => g.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [techniques, selectedCategory, searchQuery]);

  // Auto-select highlighted technique
  useMemo(() => {
    if (highlightedTechniqueId) {
      const technique = techniques.find(t => t.id === highlightedTechniqueId);
      if (technique) {
        setSelectedTechnique(technique);
      }
    }
  }, [highlightedTechniqueId, techniques]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left Panel - List */}
        <div className="w-96 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Encyclopedia</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="p-2 border-b border-gray-200 flex gap-1 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                  selectedCategory === cat.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Technique List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredTechniques.map(technique => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                isSelected={selectedTechnique?.id === technique.id}
                onClick={() => setSelectedTechnique(technique)}
              />
            ))}
            
            {filteredTechniques.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No techniques found
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredTechniques.length} of {techniques.length} techniques
            </p>
          </div>
        </div>

        {/* Right Panel - Detail */}
        <div className="flex-1 p-6 overflow-hidden">
          {selectedTechnique ? (
            <TechniqueDetail technique={selectedTechnique} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-lg font-medium">Select a technique</p>
                <p className="text-sm">to learn about manipulation methods</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Encyclopedia;
