import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execSync } from 'child_process';

// Build-Stempel (§14.6): kurzer Commit-Hash + Datum, in die App injiziert (__BUILD_STAMP__).
// Zeigt am Titelbildschirm den ausgelieferten Stand → Cache-Diagnose. Schlägt Git fehl
// (z. B. Tarball ohne .git), bleibt es bei 'dev'.
function buildStamp(): string {
  try {
    const sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    const date = new Date().toISOString().slice(0, 10);
    return `${sha} · ${date}`;
  } catch {
    return 'dev';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_STAMP__: JSON.stringify(buildStamp()),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
