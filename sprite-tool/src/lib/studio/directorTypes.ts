// ===========================================
// REGIE-ASSISTENT — geteilte Typen (Client UND Server)
// ===========================================
// Reine Typen, keine Laufzeit-Abhängigkeiten → von Browser- und Server-Code
// gleichermaßen importierbar.

export type DirectorTask = 'style-directions' | 'shot-prompt' | 'critique' | 'chat';

export interface StyleDirectionDraft {
  name: string;
  mood: string;
  palette: { name: string; hex: string }[];
  dos: string[];
  donts: string[];
  rationale: string;
  /** Fertiger Prompt für EIN Testmotiv, damit man die Richtung sofort sehen kann. */
  samplePrompt: string;
}

export interface ShotPromptResult {
  prompt: string;
  rationale: string;
  suggestedId: string;
}

export interface VariantCritique {
  index: number;
  score: number; // 0..100, Passung zur Bibel
  note: string;
}

export interface CritiqueResult {
  perVariant: VariantCritique[];
  bestIndex: number;
  questions: string[];
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  reply: string;
}
