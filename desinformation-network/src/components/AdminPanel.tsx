import { useState, useEffect, useRef } from 'react';

// SHA-256 hash of the PIN "1337"
// To change: run in browser console:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PIN')).then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('')))
const PIN_HASH = '5db1fee4b5703808c48078a76768b155b421b210c0761cd6a5d223f4d99f1eaa';

async function hashPin(pin: string): Promise<string> {
  const encoded = new TextEncoder().encode(pin);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

type AdminPanelProps = {
  onExit: () => void;
};

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check sessionStorage for existing auth
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (!authenticated) {
      inputRef.current?.focus();
    }
  }, [authenticated]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setChecking(true);
    setError(false);

    const hashed = await hashPin(pin);
    if (hashed === PIN_HASH) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
    setChecking(false);
  };

  // PIN Entry Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <form onSubmit={handleSubmit} className="bg-gray-800/70 border border-gray-700 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-white mb-2">Admin-Zugang</h2>
            <p className="text-gray-400 text-sm mb-6">PIN eingeben um fortzufahren</p>

            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={e => { setPin(e.target.value); setError(false); }}
              placeholder="PIN"
              className={`w-full text-center text-2xl tracking-[0.5em] bg-gray-900 border ${
                error ? 'border-red-500' : 'border-gray-600'
              } rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors`}
              autoComplete="off"
            />

            {error && (
              <p className="text-red-400 text-sm mt-2">Falscher PIN</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                Zurück
              </button>
              <button
                type="submit"
                disabled={pin.length === 0 || checking}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                {checking ? '...' : 'Öffnen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Entwickler-Tools & Übersicht</p>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            Zurück zum Spiel
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sprite Tool */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Sprite Tool</h3>
            <p className="text-gray-400 text-sm mb-4">
              Pixel-Art Assets generieren mit KI. Läuft lokal als Next.js App.
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300 font-mono space-y-1">
              <p>cd sprite-tool</p>
              <p>npm install</p>
              <p>npm run dev</p>
              <p className="text-blue-400">→ http://localhost:3000</p>
            </div>
          </div>

          {/* Dev Server */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Dev Server</h3>
            <p className="text-gray-400 text-sm mb-4">
              Lokaler Vite-Dev-Server mit Hot Reload.
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300 font-mono space-y-1">
              <p>cd desinformation-network</p>
              <p>npm run dev</p>
              <p className="text-blue-400">→ http://localhost:5173</p>
            </div>
          </div>

          {/* Build Info */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Build & Deploy</h3>
            <p className="text-gray-400 text-sm mb-4">
              Netlify Auto-Deploy bei Push auf main.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Platform</span>
                <span className="text-white">Netlify</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Build</span>
                <span className="text-white font-mono">npm run build</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Node</span>
                <span className="text-white">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Output</span>
                <span className="text-white font-mono">dist/</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            <p className="text-gray-400 text-sm mb-4">
              Nützliche Aktionen für die Entwicklung.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  sessionStorage.clear();
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full text-left px-4 py-2 bg-gray-900/50 hover:bg-gray-900 text-gray-300 rounded-lg transition-colors text-sm"
              >
                Cache leeren & Neuladen
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_auth');
                  setAuthenticated(false);
                  setPin('');
                }}
                className="w-full text-left px-4 py-2 bg-gray-900/50 hover:bg-gray-900 text-gray-300 rounded-lg transition-colors text-sm"
              >
                Admin-Session beenden
              </button>
            </div>
          </div>

        </div>

        {/* Footer hint */}
        <p className="text-gray-600 text-xs text-center mt-8">
          PIN ändern: SHA-256-Hash in AdminPanel.tsx ersetzen (Anleitung im Code)
        </p>
      </div>
    </div>
  );
}
