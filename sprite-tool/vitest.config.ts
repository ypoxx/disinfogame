import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Schlanke Test-Umgebung fürs Studio: reine Logik + IndexedDB (fake-indexeddb).
// Node-Umgebung reicht (keine React-Render-Tests); '@'-Alias wie in tsconfig.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
