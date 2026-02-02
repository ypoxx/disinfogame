// ===========================================
// SHARED CONSTANTS
// ===========================================

export const ASPECT_RATIOS = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1344, height: 768 },
  '9:16': { width: 768, height: 1344 },
  '4:3': { width: 1152, height: 896 },
  '3:4': { width: 896, height: 1152 },
} as const;

export type AspectRatio = keyof typeof ASPECT_RATIOS;
