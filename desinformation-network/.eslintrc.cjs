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

    // Hook-Abhängigkeiten: im Bestand vielfach bewusst unvollständig
    // (Engine ist eine mutable Klasse im State). Sichtbar, aber nicht blockierend.
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': 'off',

    // `any` ist im Bestand verbreitet (Spieldaten-Grenzen). Der Typfehler, der
    // das Spiel zum Absturz brachte, saß nicht an einem `any`, sondern an einem
    // `as any`, das eine echte Schema-Abweichung verdeckte — dagegen hilft der
    // Datentest, nicht diese Regel.
    '@typescript-eslint/no-explicit-any': 'warn',
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
