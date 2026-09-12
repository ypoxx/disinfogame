/// <reference types="vite/client" />

// Hier stand ein `declare module '*.json' { const value: any }`. Das warf die
// Typen JEDER importierten Spieldatei weg — `resolveJsonModule` ist in der
// tsconfig an, TypeScript leitet die Form also selbst her. Genau diese Blende
// ließ die Schema-Abweichung durch, die das Spiel beim Öffnen einer Konsequenz
// abstürzen ließ (B1). Ohne sie bricht nichts: tsc meldet null Fehler.
// Nicht wieder einführen.

// Safari WebAudio API compatibility
interface Window {
  webkitAudioContext: typeof AudioContext;
}
