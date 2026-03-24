'use client';

// ===========================================
// SETUP WIZARD - API Key Einrichtung
// Anfänger-freundlicher Wizard für API Keys
// ===========================================

import { useState, useEffect, useCallback } from 'react';

type KeyStatus = {
  configured: boolean;
  masked: string;
};

type SetupStatus = {
  hasEnvFile: boolean;
  openai: KeyStatus;
  google: KeyStatus;
};

type TestResult = {
  valid: boolean;
  error?: string;
};

type Step = 'loading' | 'welcome' | 'openai' | 'google' | 'done';

export function SetupWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('loading');
  const [status, setStatus] = useState<SetupStatus | null>(null);

  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');

  const [openaiTest, setOpenaiTest] = useState<TestResult | null>(null);
  const [googleTest, setGoogleTest] = useState<TestResult | null>(null);

  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  // Status beim Laden prüfen
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/setup');
      if (res.ok) {
        const data: SetupStatus = await res.json();
        setStatus(data);

        // Wenn beide Keys konfiguriert → direkt fertig
        if (data.openai.configured && data.google.configured) {
          onComplete();
          return;
        }

        setStep('welcome');
      } else {
        // Nicht auf localhost → Setup überspringen
        onComplete();
      }
    } catch {
      // Netzwerkfehler → Setup überspringen
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Key testen
  async function testKey(provider: 'openai' | 'google') {
    setIsTesting(true);
    setError('');

    const key = provider === 'openai' ? openaiKey : googleKey;
    if (!key.trim()) {
      setError('Bitte gib einen Key ein.');
      setIsTesting(false);
      return;
    }

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          ...(provider === 'openai' ? { openaiKey: key } : { googleKey: key }),
        }),
      });

      const data = await res.json();

      if (provider === 'openai') {
        setOpenaiTest(data.results?.openai || { valid: false, error: 'Keine Antwort' });
      } else {
        setGoogleTest(data.results?.google || { valid: false, error: 'Keine Antwort' });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Verbindungsfehler';
      if (provider === 'openai') {
        setOpenaiTest({ valid: false, error: msg });
      } else {
        setGoogleTest({ valid: false, error: msg });
      }
    }
    setIsTesting(false);
  }

  // Keys speichern
  async function saveKeys() {
    setIsSaving(true);
    setError('');
    setSaveMessage('');

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          ...(openaiKey ? { openaiKey } : {}),
          ...(googleKey ? { googleKey } : {}),
        }),
      });

      const data = await res.json();

      if (data.saved) {
        setSaveMessage(data.message);
        setStep('done');
      } else {
        setError(data.error || 'Speichern fehlgeschlagen');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verbindungsfehler');
    }
    setIsSaving(false);
  }

  // Loading
  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 animate-pulse">Prüfe Konfiguration...</div>
      </div>
    );
  }

  // Gemeinsame Styles
  const cardStyle = 'bg-gray-900 border border-gray-800 rounded-xl p-6';
  const inputStyle =
    'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
  const btnPrimary =
    'px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const btnSecondary =
    'px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">API Keys einrichten</h1>
        <p className="text-gray-400">
          Bevor du loslegst, brauchen wir zwei API Keys.
          <br />
          <span className="text-gray-500 text-sm">
            Die Keys werden nur lokal in <code className="px-1 bg-gray-800 rounded">.env.local</code> gespeichert und nie öffentlich geteilt.
          </span>
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {['OpenAI', 'Google AI', 'Fertig'].map((label, i) => {
          const stepIndex = step === 'welcome' ? -1 : step === 'openai' ? 0 : step === 'google' ? 1 : 2;
          const isActive = i === stepIndex;
          const isDone = i < stepIndex || step === 'done';

          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-0.5 ${isDone ? 'bg-green-500' : 'bg-gray-700'}`} />}
              <div className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome */}
      {step === 'welcome' && (
        <div className={cardStyle}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Was du brauchst:</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl">1️⃣</div>
                <div>
                  <h3 className="font-bold text-blue-400">OpenAI API Key</h3>
                  <p className="text-sm text-gray-400">
                    Für die Prompt-Verbesserung (GPT-4o-mini). Kostet ca. $0.001 pro Aufruf.
                  </p>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Key erstellen auf platform.openai.com →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="text-2xl">2️⃣</div>
                <div>
                  <h3 className="font-bold text-green-400">Google AI API Key</h3>
                  <p className="text-sm text-gray-400">
                    Für die Bildgenerierung (Gemini). Kostenlos im Free-Tier!
                  </p>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:text-green-300 underline"
                  >
                    Key erstellen auf aistudio.google.com →
                  </a>
                </div>
              </div>
            </div>

            {/* Zeige bestehende Keys */}
            {status && (status.openai.configured || status.google.configured) && (
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">Bereits konfiguriert:</h4>
                {status.openai.configured && (
                  <div className="text-sm text-gray-400">
                    OpenAI: <code className="text-green-400">{status.openai.masked}</code>
                  </div>
                )}
                {status.google.configured && (
                  <div className="text-sm text-gray-400">
                    Google AI: <code className="text-green-400">{status.google.masked}</code>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('openai')} className={btnPrimary}>
                Keys einrichten →
              </button>
              {status?.openai.configured && status?.google.configured && (
                <button onClick={onComplete} className={btnSecondary}>
                  Überspringen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OpenAI Key */}
      {step === 'openai' && (
        <div className={cardStyle}>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                <span className="text-blue-400">1.</span> OpenAI API Key
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Wird für die Prompt-Verbesserung benutzt. Beginnt mit <code className="px-1 bg-gray-800 rounded">sk-</code>
              </p>
            </div>

            {status?.openai.configured && (
              <div className="p-2 bg-green-900/30 border border-green-800 rounded text-sm text-green-400">
                Bereits konfiguriert: <code>{status.openai.masked}</code> — du kannst den Key aktualisieren oder überspringen.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setOpenaiTest(null);
                }}
                placeholder="sk-..."
                className={inputStyle}
                autoComplete="off"
              />
            </div>

            {/* Test Result */}
            {openaiTest && (
              <div
                className={`p-3 rounded-lg border text-sm ${
                  openaiTest.valid
                    ? 'bg-green-900/30 border-green-800 text-green-400'
                    : 'bg-red-900/30 border-red-800 text-red-400'
                }`}
              >
                {openaiTest.valid ? '✓ Key ist gültig!' : `✗ Ungültig: ${openaiTest.error}`}
              </div>
            )}

            {error && <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-sm text-red-400">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep('welcome')} className={btnSecondary}>
                ← Zurück
              </button>
              <button
                onClick={() => testKey('openai')}
                disabled={!openaiKey.trim() || isTesting}
                className={btnSecondary}
              >
                {isTesting ? 'Teste...' : 'Key testen'}
              </button>
              <button
                onClick={() => setStep('google')}
                className={btnPrimary}
              >
                Weiter →
              </button>
            </div>

            <div className="text-xs text-gray-600">
              Tipp: Du kannst Keys auch direkt in <code>.env.local</code> eintragen, wenn du das Terminal bevorzugst.
            </div>
          </div>
        </div>
      )}

      {/* Google AI Key */}
      {step === 'google' && (
        <div className={cardStyle}>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                <span className="text-green-400">2.</span> Google AI API Key
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Wird für die Bildgenerierung benutzt. Beginnt mit <code className="px-1 bg-gray-800 rounded">AIza</code>
              </p>
            </div>

            {status?.google.configured && (
              <div className="p-2 bg-green-900/30 border border-green-800 rounded text-sm text-green-400">
                Bereits konfiguriert: <code>{status.google.masked}</code> — du kannst den Key aktualisieren oder überspringen.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Google AI API Key
              </label>
              <input
                type="password"
                value={googleKey}
                onChange={(e) => {
                  setGoogleKey(e.target.value);
                  setGoogleTest(null);
                }}
                placeholder="AIzaSy..."
                className={inputStyle}
                autoComplete="off"
              />
            </div>

            {/* Test Result */}
            {googleTest && (
              <div
                className={`p-3 rounded-lg border text-sm ${
                  googleTest.valid
                    ? 'bg-green-900/30 border-green-800 text-green-400'
                    : 'bg-red-900/30 border-red-800 text-red-400'
                }`}
              >
                {googleTest.valid ? '✓ Key ist gültig!' : `✗ Ungültig: ${googleTest.error}`}
              </div>
            )}

            {error && <div className="p-3 rounded-lg bg-red-900/30 border border-red-800 text-sm text-red-400">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep('openai')} className={btnSecondary}>
                ← Zurück
              </button>
              <button
                onClick={() => testKey('google')}
                disabled={!googleKey.trim() || isTesting}
                className={btnSecondary}
              >
                {isTesting ? 'Teste...' : 'Key testen'}
              </button>
              <button
                onClick={saveKeys}
                disabled={isSaving}
                className={btnPrimary}
              >
                {isSaving ? 'Speichere...' : 'Keys speichern & fertig'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Done */}
      {step === 'done' && (
        <div className={cardStyle}>
          <div className="space-y-4 text-center">
            <div className="text-5xl">✓</div>
            <h2 className="text-xl font-bold text-green-400">Keys gespeichert!</h2>

            {saveMessage && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg text-sm text-yellow-400">
                {saveMessage}
              </div>
            )}

            <p className="text-gray-400 text-sm">
              Starte den Dev-Server neu (<code className="px-1 bg-gray-800 rounded">npm run dev</code>), damit die neuen Keys geladen werden.
            </p>

            <button onClick={onComplete} className={btnPrimary}>
              Weiter zum Sprite Studio →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
