import { useState } from 'react';
import { PRESET_CATEGORIES, searchPresets } from './presets';
import type { Preset } from './presets';
import type { AssetType } from './types';
import type { AspectRatio } from './constants';
import { ASPECT_RATIOS } from './constants';
import { improvePrompt } from './api';

type PromptBuilderProps = {
  onGenerate: (prompt: string, assetType: AssetType, aspectRatio: AspectRatio, numImages: number) => void;
  isGenerating: boolean;
};

export function PromptBuilder({ onGenerate, isGenerating }: PromptBuilderProps) {
  const [userPrompt, setUserPrompt] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('scene');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [numImages, setNumImages] = useState(2);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const activePrompt = improvedPrompt || userPrompt;

  const handlePresetSelect = (preset: Preset) => {
    setUserPrompt(preset.prompt);
    setAssetType(preset.assetType);
    setImprovedPrompt('');
    setSuggestions([]);
    setTechnicalNotes('');
    setError('');
  };

  const handleImprove = async () => {
    if (!userPrompt.trim()) return;
    setIsImproving(true);
    setError('');
    try {
      const result = await improvePrompt({
        userPrompt,
        assetType,
      });
      setImprovedPrompt(result.improvedPrompt);
      setSuggestions(result.suggestions);
      setTechnicalNotes(result.technicalNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei Prompt-Verbesserung');
    }
    setIsImproving(false);
  };

  const handleGenerate = () => {
    if (!activePrompt.trim()) return;
    onGenerate(activePrompt, assetType, aspectRatio, numImages);
  };

  const filteredPresets = searchQuery
    ? searchPresets(searchQuery)
    : selectedCategory
      ? PRESET_CATEGORIES.find(c => c.id === selectedCategory)?.presets || []
      : [];

  return (
    <div className="space-y-4">
      {/* Preset-Auswahl */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Preset wählen</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          {PRESET_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {cat.nameDE} ({cat.presets.length})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Preset suchen..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSelectedCategory(''); }}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-2"
        />

        {filteredPresets.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
              >
                <span className="text-white">{preset.nameDE}</span>
                <span className="text-gray-500 ml-2">({preset.assetType})</span>
                <p className="text-gray-500 text-xs truncate">{preset.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prompt-Eingabe */}
      <div>
        <label className="text-sm text-gray-400 block mb-1">Prompt</label>
        <textarea
          value={userPrompt}
          onChange={e => { setUserPrompt(e.target.value); setImprovedPrompt(''); }}
          placeholder="Beschreibe was du generieren willst..."
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>

      {/* Controls Row */}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Asset-Typ</label>
          <select
            value={assetType}
            onChange={e => setAssetType(e.target.value as AssetType)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="scene">Szene</option>
            <option value="sprite">Sprite</option>
            <option value="element">Element</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Format</label>
          <select
            value={aspectRatio}
            onChange={e => setAspectRatio(e.target.value as AspectRatio)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            {Object.entries(ASPECT_RATIOS).map(([key, val]) => (
              <option key={key} value={key}>{key} ({val.width}x{val.height})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Anzahl</label>
          <select
            value={numImages}
            onChange={e => setNumImages(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value={1}>1 Bild</option>
            <option value={2}>2 Bilder</option>
            <option value={3}>3 Bilder</option>
            <option value={4}>4 Bilder</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleImprove}
          disabled={!userPrompt.trim() || isImproving}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isImproving ? 'Verbessere...' : 'Prompt verbessern (KI)'}
        </button>
        <button
          onClick={handleGenerate}
          disabled={!activePrompt.trim() || isGenerating}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isGenerating ? 'Generiere...' : `${numImages} Bild${numImages > 1 ? 'er' : ''} generieren`}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Improved Prompt */}
      {improvedPrompt && (
        <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-purple-400 mb-1">Verbesserter Prompt</h4>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{improvedPrompt}</p>
          </div>
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-1">Vorschläge</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {suggestions.map((s, i) => <li key={i}>- {s}</li>)}
              </ul>
            </div>
          )}
          {technicalNotes && (
            <p className="text-xs text-gray-600 italic">{technicalNotes}</p>
          )}
        </div>
      )}
    </div>
  );
}
