'use client';

// ===========================================
// PROMPT ASSISTANT COMPONENT
// OpenAI-gestützte Prompt-Verbesserung mit Preset-Auswahl
// ===========================================

import { useState, useMemo } from 'react';
import type { AssetType, ImprovePromptResponse } from '@/types';
import {
  PRESET_CATEGORIES,
  getPresetsByAssetType,
  type Preset,
  type PresetCategory,
} from '@/lib/presets';

interface PromptAssistantProps {
  assetType: AssetType;
  onPromptReady: (prompt: string) => void;
}

export function PromptAssistant({ assetType, onPromptReady }: PromptAssistantProps) {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImprovePromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useImproved, setUseImproved] = useState(true);
  const [showPresets, setShowPresets] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter presets by current asset type
  const availablePresets = useMemo(() => {
    return getPresetsByAssetType(assetType);
  }, [assetType]);

  // Get categories that have presets for this asset type
  const availableCategories = useMemo(() => {
    return PRESET_CATEGORIES.filter(cat =>
      cat.presets.some(p => p.assetType === assetType)
    );
  }, [assetType]);

  // Get presets for selected category or all
  const displayedPresets = useMemo(() => {
    if (!selectedCategory) return availablePresets;
    const category = PRESET_CATEGORIES.find(c => c.id === selectedCategory);
    return category?.presets.filter(p => p.assetType === assetType) || [];
  }, [selectedCategory, availablePresets, assetType]);

  const assetTypeLabels: Record<AssetType, string> = {
    sprite: 'Sprite-Sheet',
    scene: 'Szene / Hintergrund',
    element: 'Element / Prop',
  };

  const placeholders: Record<AssetType, string> = {
    sprite: 'z.B. "Ein Büroangestellter der läuft"',
    scene: 'z.B. "Ein Technik-Büro mit Servern"',
    element: 'z.B. "Ein alter sowjetischer Fernseher"',
  };

  function handlePresetSelect(preset: Preset) {
    setUserPrompt(preset.prompt);
    setShowPresets(false);
    setResult(null);
  }

  async function handleImprove() {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userPrompt.trim(),
          assetType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler bei der Prompt-Verbesserung');
      }

      const data: ImprovePromptResponse = await response.json();
      setResult(data);
      setUseImproved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  }

  function handleApplySuggestion(suggestion: string) {
    setUserPrompt((prev) => prev + ' ' + suggestion);
  }

  function handleGenerate() {
    const promptToUse = useImproved && result?.improvedPrompt
      ? result.improvedPrompt
      : userPrompt;
    onPromptReady(promptToUse);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="px-2 py-1 bg-gray-800 rounded">
            {assetTypeLabels[assetType]}
          </span>
        </div>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showPresets ? 'Eigener Prompt' : 'Vorlagen anzeigen'}
        </button>
      </div>

      {/* Preset Selection */}
      {showPresets && availablePresets.length > 0 && (
        <div className="space-y-3">
          {/* Category Tabs */}
          {availableCategories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Alle
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat.nameDE}
                </button>
              ))}
            </div>
          )}

          {/* Preset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {displayedPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left
                           transition-colors border border-gray-700 hover:border-gray-600"
              >
                <div className="font-medium text-white text-sm">
                  {preset.nameDE}
                </div>
                <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {preset.description}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {preset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-xs bg-gray-900 text-gray-500 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-800">
            Klicke auf eine Vorlage oder schreibe deinen eigenen Prompt
          </div>
        </div>
      )}

      {/* User Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {showPresets && availablePresets.length > 0 ? 'Oder eigener Prompt:' : 'Dein Prompt'}
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={placeholders[assetType]}
          className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                     text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1
                     focus:ring-blue-500 outline-none resize-none font-mono text-sm"
        />
        {userPrompt && (
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{userPrompt.length} Zeichen</span>
            <button
              onClick={() => {
                setUserPrompt('');
                setResult(null);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Löschen
            </button>
          </div>
        )}
      </div>

      {/* Improve Button */}
      <button
        onClick={handleImprove}
        disabled={!userPrompt.trim() || isLoading}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700
                   disabled:cursor-not-allowed text-white font-medium rounded-lg
                   transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            GPT denkt...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Mit GPT verbessern
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          {/* Improved Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-green-400">
                Verbesserter Prompt
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={useImproved}
                  onChange={(e) => setUseImproved(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                Verwenden
              </label>
            </div>
            <div className={`p-3 rounded border text-sm font-mono ${
              useImproved
                ? 'bg-gray-900 border-green-700 text-gray-200'
                : 'bg-gray-900/50 border-gray-700 text-gray-500'
            }`}>
              {result.improvedPrompt}
            </div>
          </div>

          {/* Technical Notes */}
          {result.technicalNotes && (
            <div className="text-sm text-gray-400">
              <span className="text-gray-500">Hinweise:</span> {result.technicalNotes}
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Vorschläge zum Hinzufügen
              </label>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplySuggestion(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600
                               text-gray-300 rounded-full transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!userPrompt.trim()}
        className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                   disabled:cursor-not-allowed text-white font-bold rounded-lg
                   transition-colors text-lg"
      >
        Bilder generieren
      </button>
    </div>
  );
}
