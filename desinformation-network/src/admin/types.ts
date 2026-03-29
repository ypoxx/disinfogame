// ===========================================
// ADMIN / SPRITE STUDIO - TYPE DEFINITIONS
// Portiert aus sprite-tool/src/types/index.ts
// ===========================================

export type AssetType = 'sprite' | 'scene' | 'element';

// API Request/Response Types

export type ImprovePromptRequest = {
  userPrompt: string;
  assetType: AssetType;
  additionalContext?: string;
};

export type ImprovePromptResponse = {
  improvedPrompt: string;
  suggestions: string[];
  technicalNotes: string;
};

export type GenerateImageRequest = {
  prompt: string;
  referenceImages?: string[];
  aspectRatio?: string;
  seed?: number;
  numImages?: number;
};

export type GenerateImageResponse = {
  images: {
    base64: string;
    seed?: number;
  }[];
  errors?: string[];
};

export type InpaintRequest = {
  image: string; // base64
  mask?: string; // base64 (optional for mask-free)
  prompt: string;
};

export type InpaintResponse = {
  image: string; // base64
};

// UI State

export type GeneratedImage = {
  id: string;
  base64: string;
  seed?: number;
  timestamp: number;
};

export type SpriteStudioPhase = 'prompt' | 'generating' | 'gallery' | 'editing';
