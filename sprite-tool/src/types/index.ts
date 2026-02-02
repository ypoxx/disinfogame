// ===========================================
// SPRITE TOOL - TYPE DEFINITIONS
// ===========================================

export type AssetType = 'sprite' | 'scene' | 'element';

export type ProjectMode = 'select' | 'prompt' | 'generate' | 'edit' | 'export';

export interface Project {
  id: string;
  name: string;
  type: AssetType;
  createdAt: Date;
  updatedAt: Date;
  prompt: string;
  improvedPrompt?: string;
  referenceImages: string[];
  generatedImages: GeneratedImage[];
  selectedImageIndex?: number;
  spriteSheet?: SpriteSheet;
}

export interface GeneratedImage {
  id: string;
  base64: string;
  seed?: number;
  timestamp: Date;
}

export interface SpriteSheet {
  frames: SpriteFrame[];
  animations: SpriteAnimation[];
  frameWidth: number;
  frameHeight: number;
}

export interface SpriteFrame {
  id: string;
  imageData: string; // base64
  order: number;
}

export interface SpriteAnimation {
  name: string;
  frameIds: string[];
  frameTime: number; // ms per frame
  loop: boolean;
}

// API Request/Response Types

export interface ImprovePromptRequest {
  userPrompt: string;
  assetType: AssetType;
  additionalContext?: string;
}

export interface ImprovePromptResponse {
  improvedPrompt: string;
  suggestions: string[];
  technicalNotes: string;
}

export interface GenerateImageRequest {
  prompt: string;
  referenceImages?: string[];
  aspectRatio?: string;
  thinkingMode?: boolean;
  seed?: number;
  numImages?: number;
}

export interface GenerateImageResponse {
  images: {
    base64: string;
    seed?: number;
  }[];
}

export interface InpaintRequest {
  image: string; // base64
  mask?: string; // base64 (optional for mask-free)
  prompt: string;
}

export interface InpaintResponse {
  image: string; // base64
}

// UI State

export interface PromptAssistantState {
  userPrompt: string;
  isLoading: boolean;
  improvedPrompt: string;
  suggestions: string[];
  error?: string;
}

export interface GeneratorState {
  isGenerating: boolean;
  progress: number;
  images: GeneratedImage[];
  error?: string;
}

export interface EditorState {
  selectedImage: string | null;
  maskData: string | null;
  isInpainting: boolean;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

// Settings

export interface SpriteSettings {
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  style: 'pixel-art' | 'cartoon' | 'realistic';
  backgroundColor: 'transparent' | string;
}

export interface SceneSettings {
  width: number;
  height: number;
  style: 'pixel-art' | 'cartoon' | 'realistic';
}

export const DEFAULT_SPRITE_SETTINGS: SpriteSettings = {
  frameWidth: 32,
  frameHeight: 32,
  frameCount: 8,
  style: 'pixel-art',
  backgroundColor: 'transparent',
};

export const DEFAULT_SCENE_SETTINGS: SceneSettings = {
  width: 800,
  height: 600,
  style: 'pixel-art',
};
