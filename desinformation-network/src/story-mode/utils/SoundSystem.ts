/**
 * Minimal Sound System using Web Audio API
 * TD-017: Sound feedback implementation
 *
 * Uses synthesized tones instead of audio files for simplicity and small bundle size.
 *
 * Asset-Erweiterung (Track A-5): Liegt im Asset-Manifest eine echte Audiodatei
 * (`sfx_<type>`), wird sie statt des Synth-Tons gespielt. Zusätzlich gibt es
 * Musik-Loops (`music_<name>`) und NPC-Sprachzeilen (`voice_<npc>_<lineKey>`).
 * Ohne Manifest bleibt alles exakt beim bisherigen Synth-Verhalten.
 */

import { getAssetRegistry } from '../assets/AssetRegistry';

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
  | 'worldEvent'      // Major world event
  // Gebäude- und Diegese-Sounds (Asset-first; Synth-Fallback bewusst dezent)
  | 'doorOpen'
  | 'doorClose'
  | 'elevator'
  | 'footsteps'
  | 'tvOn'
  | 'paper'
  | 'phoneRing'
  | 'typewriter'
  | 'applause'
  // F39: dezenter Einzelton nach fertig getipptem Dialog-Text (kein Typing-Sound!)
  | 'dialogEnd';

/** Mixer-Kanäle (F37): getrennte Lautstärken über dem Master-Volume. */
export type SoundChannel = 'music' | 'sfx' | 'voice';

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
  // Gebäude/Diegese — im Normalfall spielen die Asset-Dateien (sfx_door_open, …)
  doorOpen: { frequency: 160, duration: 0.18, type: 'triangle', volume: 0.12, decay: true },
  doorClose: { frequency: 110, duration: 0.22, type: 'triangle', volume: 0.15, decay: true },
  elevator: { frequency: 90, duration: 0.5, type: 'sine', volume: 0.1, secondFreq: 880 },
  footsteps: { frequency: 130, duration: 0.08, type: 'triangle', volume: 0.08, decay: true },
  tvOn: { frequency: 1200, duration: 0.12, type: 'sawtooth', volume: 0.08, decay: true },
  paper: { frequency: 600, duration: 0.07, type: 'triangle', volume: 0.07, decay: true },
  phoneRing: { frequency: 740, duration: 0.25, type: 'sine', volume: 0.12, secondFreq: 880 },
  typewriter: { frequency: 950, duration: 0.05, type: 'square', volume: 0.08 },
  applause: { frequency: 300, duration: 0.3, type: 'triangle', volume: 0.08, decay: true },
  // F39: kurzer, weicher Sinus — bewusst unauffällig (Endmarke, kein Tippgeräusch)
  dialogEnd: { frequency: 520, duration: 0.06, type: 'sine', volume: 0.05 },
};

/** Lautstärke-Faktor für Hintergrundmusik relativ zum Master-Volume. */
const MUSIC_VOLUME_FACTOR = 0.4;
/** Dateibasierte SFX dürfen lauter sein als die (bewusst leisen) Synth-Töne. */
const SFX_FILE_VOLUME_FACTOR = 2;

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.5;
  // F37: Kanal-Lautstärken (0..1) über dem Master-Volume; Default 1 = keine Änderung.
  private channelVolume: Record<SoundChannel, number> = { music: 1, sfx: 1, voice: 1 };
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private musicElement: HTMLAudioElement | null = null;
  private musicAssetId: string | null = null;
  private voiceElement: HTMLAudioElement | null = null;

  constructor() {
    // Load settings from localStorage
    this.loadSettings();
  }

  /** Erzeugt ein Audio-Element; null außerhalb des Browsers / ohne Audio-Support. */
  private createAudio(url: string): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    try {
      return new Audio(url);
    } catch {
      return null;
    }
  }

  /** Spielt eine Asset-Datei ab (überlappend via cloneNode). true = übernommen. */
  private playFile(url: string, volume: number): boolean {
    let base = this.sfxCache.get(url);
    if (!base) {
      const created = this.createAudio(url);
      if (!created) return false;
      base = created;
      this.sfxCache.set(url, base);
    }
    try {
      const instance = base.cloneNode(true) as HTMLAudioElement;
      instance.volume = Math.max(0, Math.min(1, volume));
      void instance.play().catch(() => {
        /* Autoplay-Policy o. Ä. — Synth-Pfad ist bereits gelaufen bzw. egal */
      });
      return true;
    } catch {
      return false;
    }
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
    if (!this.enabled) return;

    // Asset-Datei (sfx_<type>) hat Vorrang vor dem Synth-Ton. Manifest-ids
    // erlauben nur [a-z0-9_], daher camelCase → snake_case (phaseEnd → phase_end).
    const assetId = `sfx_${type.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)}`;
    const fileUrl = getAssetRegistry().soundUrl(assetId);
    if (fileUrl) {
      const config = SOUND_CONFIGS[type];
      const volume = (config?.volume ?? 0.2) * SFX_FILE_VOLUME_FACTOR * this.masterVolume * this.channelVolume.sfx;
      if (this.playFile(fileUrl, volume)) return;
    }

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
    const volume = config.volume * this.masterVolume * this.channelVolume.sfx;
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
   * Hintergrundmusik (Loop) aus dem Asset-Manifest starten.
   * Ohne passendes Asset: stiller No-op. Gleiche id erneut => läuft weiter.
   */
  playMusic(assetId: string = 'music_theme_main'): boolean {
    if (!this.enabled) return false;
    if (this.musicAssetId === assetId && this.musicElement && !this.musicElement.paused) {
      return true;
    }
    const url = getAssetRegistry().soundUrl(assetId);
    if (!url) return false;
    this.stopMusic();
    const element = this.createAudio(url);
    if (!element) return false;
    element.loop = true;
    element.volume = Math.max(0, Math.min(1, this.masterVolume * MUSIC_VOLUME_FACTOR * this.channelVolume.music));
    this.musicElement = element;
    this.musicAssetId = assetId;
    void element.play().catch(() => {
      // Autoplay-Policy: bis zur nächsten Nutzer-Interaktion still bleiben.
    });
    return true;
  }

  stopMusic(): void {
    if (this.musicElement) {
      try {
        this.musicElement.pause();
      } catch {
        // ignore
      }
    }
    this.musicElement = null;
    this.musicAssetId = null;
  }

  getCurrentMusicId(): string | null {
    return this.musicAssetId;
  }

  /**
   * NPC-Sprachzeile abspielen (voice_<npc>_<lineKey>); stoppt eine laufende.
   * true = Asset vorhanden und Wiedergabe gestartet.
   */
  playVoiceLine(assetId: string): boolean {
    if (!this.enabled) return false;
    const url = getAssetRegistry().soundUrl(assetId);
    if (!url) return false;
    this.stopVoice();
    const element = this.createAudio(url);
    if (!element) return false;
    element.volume = Math.max(0, Math.min(1, this.masterVolume * this.channelVolume.voice));
    this.voiceElement = element;
    void element.play().catch(() => {
      /* Autoplay-Policy */
    });
    return true;
  }

  stopVoice(): void {
    if (this.voiceElement) {
      try {
        this.voiceElement.pause();
      } catch {
        // ignore
      }
    }
    this.voiceElement = null;
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
      this.stopVoice();
    }
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
    if (this.musicElement) {
      this.musicElement.volume = Math.max(0, Math.min(1, this.masterVolume * MUSIC_VOLUME_FACTOR));
    }
    this.saveSettings();
  }

  getVolume(): number {
    return this.masterVolume;
  }

  /** F37: Kanal-Lautstärke setzen (0..1, geklemmt); wirkt sofort auf laufende Musik. */
  setChannelVolume(channel: SoundChannel, v: number): void {
    this.channelVolume[channel] = Math.max(0, Math.min(1, v));
    if (channel === 'music' && this.musicElement) {
      this.musicElement.volume = Math.max(0, Math.min(1, this.masterVolume * MUSIC_VOLUME_FACTOR * this.channelVolume.music));
    }
    if (channel === 'voice' && this.voiceElement) {
      this.voiceElement.volume = Math.max(0, Math.min(1, this.masterVolume * this.channelVolume.voice));
    }
    this.saveSettings();
  }

  getChannelVolume(channel: SoundChannel): number {
    return this.channelVolume[channel];
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('storyMode_sound', JSON.stringify({
        enabled: this.enabled,
        volume: this.masterVolume,
        musicVolume: this.channelVolume.music,
        sfxVolume: this.channelVolume.sfx,
        voiceVolume: this.channelVolume.voice,
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
        // Migration: alte Saves ohne Kanal-Felder → Default 1.
        this.channelVolume = {
          music: settings.musicVolume ?? 1,
          sfx: settings.sfxVolume ?? 1,
          voice: settings.voiceVolume ?? 1,
        };
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

export function setChannelVolume(channel: SoundChannel, v: number): void {
  getSoundSystem().setChannelVolume(channel, v);
}

export function getChannelVolume(channel: SoundChannel): number {
  return getSoundSystem().getChannelVolume(channel);
}

export function playMusic(assetId?: string): boolean {
  return getSoundSystem().playMusic(assetId);
}

export function stopMusic(): void {
  getSoundSystem().stopMusic();
}

export function playVoiceLine(assetId: string): boolean {
  return getSoundSystem().playVoiceLine(assetId);
}

export function stopVoiceLine(): void {
  getSoundSystem().stopVoice();
}
