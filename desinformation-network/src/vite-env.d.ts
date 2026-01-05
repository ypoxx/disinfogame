/// <reference types="vite/client" />

declare module '*.json' {
  const value: any;
  export default value;
}

// Safari WebAudio API compatibility
interface Window {
  webkitAudioContext: typeof AudioContext;
}
