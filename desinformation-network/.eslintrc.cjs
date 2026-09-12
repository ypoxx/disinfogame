/**
 * ESLint-Konfiguration.
 *
 * `npm run lint` rief seit jeher `eslint . --ext ts,tsx` auf — ohne dass eine
 * Konfigurationsdatei existierte. Der Befehl brach also immer ab, und niemand
 * merkte es, weil kein CI ihn ausführte. Alle vier Plugins lagen bereits in den
 * devDependencies; es fehlte nur diese Datei.
 *
 * Bewusst zurückhaltend eingestellt: Das Projekt ist gewachsen, eine Konfiguration
 * mit voller Strenge würde Hunderte Altbefunde melden und deshalb wieder
 * abgeschaltet. Gemeldet wird, was echte Fehler anzeigt; Stilfragen bleiben
 * Warnung oder aus. Wer die Latte höherlegt, sollte es Regel für Regel tun.
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'dist',
    // Eingefrorene Entwürfe — Projektregel 4: nicht löschen, nicht anfassen.
    'archive',
    'coverage',
    'public',
    'scripts',
    '.eslintrc.cjs',
    'vite.config.ts',
    'vitest.config.ts',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-hooks', 'react-refresh'],
  rules: {
    // Echte Fehlerquellen — die sollen rot sein.
    'react-hooks/rules-of-hooks': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],

    // Hook-Abhängigkeiten: seit 2026-09-12 sauber (Owner-Entscheidung 5c).
    // Von den sechs Meldungen waren fünf echte Fehler — die schwerste ließ den
    // Berater dauerhaft auf dem Anfangszustand rechnen. Die sechste ist ein
    // bewusst abhängigkeitsloser Effekt und trägt jetzt eine begründete
    // Ausnahme im Code. Ab hier blockierend, sonst wächst es nach.
    'react-hooks/exhaustive-deps': 'error',
    'react-refresh/only-export-components': 'off',

    // Seit 2026-09-12 ist der Bestand frei von `any` (42 Stellen typisiert,
    // Owner-Entscheidung 5c) — deshalb blockiert die Regel jetzt. Eine Regel
    // ohne Durchsetzung wächst in diesem Projekt zuverlässig nach: Der Absturz
    // B1 saß an einem `as any`, das eine echte Schema-Abweichung verdeckte.
    // Tests sind unten ausgenommen, die dürfen weiter tricksen.
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrors: 'none',
    }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
  },
  overrides: [
    {
      // Tests dürfen tricksen (Casts für Fehlerfälle, absichtlich kaputte Daten).
      files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**', '**/tests/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
