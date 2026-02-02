'use client';

// ===========================================
// PROMPT ASSISTANT COMPONENT
// Claude-gestützte Prompt-Verbesserung
// ===========================================

import { useEffect, useState } from 'react';
import type { AssetType, ImprovePromptResponse } from '@/types';

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
  const [autoImprove, setAutoImprove] = useState(true);
  const [improvedPromptText, setImprovedPromptText] = useState('');
  const [lastImprovedPrompt, setLastImprovedPrompt] = useState('');

  useEffect(() => {
    if (userPrompt.trim() !== lastImprovedPrompt) {
      setResult(null);
      setImprovedPromptText('');
      setUseImproved(true);
    }
  }, [lastImprovedPrompt, userPrompt]);

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

  async function improvePromptRequest() {
    const trimmedPrompt = userPrompt.trim();
    if (!trimmedPrompt) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: trimmedPrompt,
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
      setImprovedPromptText(data.improvedPrompt);
      setLastImprovedPrompt(trimmedPrompt);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImprove() {
    await improvePromptRequest();
  }

  function handleApplySuggestion(suggestion: string) {
    setUserPrompt((prev) => prev + ' ' + suggestion);
  }

  async function handleGenerate() {
    if (!userPrompt.trim()) return;

    let promptToUse = userPrompt.trim();
    let latestResult = result;

    if (autoImprove) {
      if (!result || lastImprovedPrompt !== userPrompt.trim()) {
        latestResult = await improvePromptRequest();
      }
      if (latestResult?.improvedPrompt) {
        promptToUse = latestResult.improvedPrompt;
        setImprovedPromptText(latestResult.improvedPrompt);
      }
    } else if (useImproved && result?.improvedPrompt) {
      promptToUse = improvedPromptText || result.improvedPrompt;
    }

    onPromptReady(promptToUse);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 text-sm text-gray-400">
        <span className="px-2 py-1 bg-gray-800 rounded">
          {assetTypeLabels[assetType]}
        </span>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoImprove}
            onChange={(e) => setAutoImprove(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          Auto-Improve mit Claude
        </label>
      </div>

      {/* User Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Dein Prompt
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={placeholders[assetType]}
          className="w-full h-24 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                     text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1
                     focus:ring-blue-500 outline-none resize-none"
        />
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
            Claude denkt...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Mit Claude verbessern
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
            <textarea
              value={improvedPromptText || result.improvedPrompt}
              onChange={(e) => setImprovedPromptText(e.target.value)}
              className={`w-full min-h-[120px] p-3 rounded border text-sm font-mono ${
                useImproved
                  ? 'bg-gray-900 border-green-700 text-gray-200'
                  : 'bg-gray-900/50 border-gray-700 text-gray-500'
              }`}
            />
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
        disabled={!userPrompt.trim() || isLoading}
        className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                   disabled:cursor-not-allowed text-white font-bold rounded-lg
                   transition-colors text-lg"
      >
        {autoImprove ? 'Verbessern & generieren' : 'Bilder generieren'}
      </button>
    </div>
  );
}
