/**
 * Minimal Sound System using Web Audio API
 * TD-017: Sound feedback implementation
 *
 * Uses synthesized tones instead of audio files for simplicity and small bundle size.
 */

type SoundType =
  | 'click'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification'
  | 'phaseEnd'
  | 'consequence'
  // New platinum-level sounds
  | 'combo'           // Combo activated
  | 'crisis'          // Crisis moment triggered
  | 'betrayal'        // NPC betrayal
  | 'moralShift'      // Significant moral weight change
  | 'opportunityOpen' // Opportunity window opens
  | 'countermeasure'  // Enemy countermeasure activated
  | 'worldEvent';     // Major world event

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  decay?: boolean;
  secondFreq?: number; // For two-tone sounds
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 0.05,
    type: 'square',
    volume: 0.1,
  },
  success: {
    frequency: 523.25, // C5
    duration: 0.15,
    type: 'sine',
    volume: 0.2,
    secondFreq: 659.25, // E5
  },
  warning: {
    frequency: 440,
    duration: 0.2,
    type: 'sawtooth',
    volume: 0.15,
    decay: true,
  },
  error: {
    frequency: 200,
    duration: 0.3,
    type: 'square',
    volume: 0.2,
    decay: true,
  },
  notification: {
    frequency: 880,
    duration: 0.1,
    type: 'sine',
    volume: 0.15,
  },
  phaseEnd: {
    frequency: 392, // G4
    duration: 0.2,
    type: 'sine',
    volume: 0.15,
    secondFreq: 523.25, // C5
  },
  consequence: {
    frequency: 293.66, // D4
    duration: 0.4,
    type: 'sawtooth',
    volume: 0.2,
    decay: true,
  },
  // Platinum-level sounds
  combo: {
    frequency: 659.25, // E5
    duration: 0.2,
    type: 'sine',
    volume: 0.25,
    secondFreq: 830.61, // G#5 - triumphant major third
  },
  crisis: {
    frequency: 220, // A3 - low, ominous
    duration: 0.5,
    type: 'sawtooth',
    volume: 0.3,
    decay: true,
  },
  betrayal: {
    frequency: 146.83, // D3 - very low, shocking
    duration: 0.6,
    type: 'square',
    volume: 0.35,
    secondFreq: 155.56, // Eb3 - dissonant minor second
  },
  moralShift: {
    frequency: 185, // F#3 - dark
    duration: 0.35,
    type: 'triangle',
    volume: 0.2,
    decay: true,
  },
  opportunityOpen: {
    frequency: 523.25, // C5
    duration: 0.15,
    type: 'sine',
    volume: 0.2,
    secondFreq: 783.99, // G5 - bright, hopeful fifth
  },
  countermeasure: {
    frequency: 329.63, // E4
    duration: 0.25,
    type: 'sawtooth',
    volume: 0.2,
    secondFreq: 261.63, // C4 - descending, threatening
  },
  worldEvent: {
    frequency: 349.23, // F4
    duration: 0.3,
    type: 'sine',
    volume: 0.2,
    decay: true,
  },
};

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.5;

  constructor() {
    // Load settings from localStorage
    this.loadSettings();
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;

    // Create context lazily (required for browser autoplay policies)
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }

    // Resume if suspended (happens after page load)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const config = SOUND_CONFIGS[type];
    if (!config) return;

    const now = ctx.currentTime;

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;

    // Create gain node for volume control
    const gainNode = ctx.createGain();
    const volume = config.volume * this.masterVolume;
    gainNode.gain.value = volume;

    // Apply decay if specified
    if (config.decay) {
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
    } else {
      gainNode.gain.setValueAtTime(volume, now + config.duration - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + config.duration);
    }

    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration);

    // Play second tone if specified (for two-tone sounds)
    if (config.secondFreq) {
      const osc2 = ctx.createOscillator();
      osc2.type = config.type;
      osc2.frequency.value = config.secondFreq;

      const gain2 = ctx.createGain();
      gain2.gain.value = volume;
      gain2.gain.setValueAtTime(volume, now + config.duration);
      gain2.gain.linearRampToValueAtTime(0, now + config.duration * 2);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + config.duration * 0.5);
      osc2.stop(now + config.duration * 2);
    }
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  getVolume(): number {
    return this.masterVolume;
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('storyMode_sound', JSON.stringify({
        enabled: this.enabled,
        volume: this.masterVolume,
      }));
    } catch (e) {
      // Ignore storage errors
    }
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('storyMode_sound');
      if (saved) {
        const settings = JSON.parse(saved);
        this.enabled = settings.enabled ?? true;
        this.masterVolume = settings.volume ?? 0.5;
      }
    } catch (e) {
      // Use defaults
    }
  }
}

// Singleton instance
let soundSystemInstance: SoundSystem | null = null;

export function getSoundSystem(): SoundSystem {
  if (!soundSystemInstance) {
    soundSystemInstance = new SoundSystem();
  }
  return soundSystemInstance;
}

// Convenience functions
export function playSound(type: SoundType): void {
  getSoundSystem().play(type);
}

export function setSoundEnabled(enabled: boolean): void {
  getSoundSystem().setEnabled(enabled);
}

export function isSoundEnabled(): boolean {
  return getSoundSystem().isEnabled();
}

export function setSoundVolume(volume: number): void {
  getSoundSystem().setVolume(volume);
}

export function getSoundVolume(): number {
  return getSoundSystem().getVolume();
}
