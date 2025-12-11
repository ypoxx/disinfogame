/**
 * Audio System (Phase 1.2: Enhanced Microinteractions)
 *
 * Simple Web Audio API-based sound system.
 * Generates synthetic sounds without needing audio files.
 *
 * Features:
 * - Volume control
 * - Mute toggle
 * - Multiple sound types
 * - No external assets needed
 */

// Audio context (lazy initialization)
let audioContext: AudioContext | null = null;

// User preference for sound
let soundEnabled = true;
let masterVolume = 0.3; // 30% default volume

/**
 * Initialize audio context (must be called after user interaction)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Toggle sound on/off
 */
export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled ? 'true' : 'false');
  return soundEnabled;
}

/**
 * Check if sound is enabled
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Set master volume (0.0 to 1.0)
 */
export function setVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
  localStorage.setItem('masterVolume', masterVolume.toString());
}

/**
 * Get master volume
 */
export function getVolume(): number {
  return masterVolume;
}

/**
 * Load saved preferences
 */
export function loadAudioPreferences(): void {
  const savedSound = localStorage.getItem('soundEnabled');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
  }

  const savedVolume = localStorage.getItem('masterVolume');
  if (savedVolume !== null) {
    masterVolume = parseFloat(savedVolume);
  }
}

// ============================================
// SOUND EFFECTS
// ============================================

/**
 * Play a simple beep/blip sound
 */
function playBeep(frequency: number, duration: number, volume: number = 0.3): void {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

/**
 * Play a chord (multiple frequencies)
 */
function playChord(frequencies: number[], duration: number, volume: number = 0.2): void {
  if (!soundEnabled) return;

  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      playBeep(freq, duration, volume);
    }, index * 20); // Slight delay for each note
  });
}

/**
 * Play a sweep (frequency change over time)
 */
function playSweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  volume: number = 0.3
): void {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume * masterVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

// ============================================
// GAME-SPECIFIC SOUNDS
// ============================================

/**
 * Sound: Ability activated successfully
 */
export function playAbilitySuccess(): void {
  playChord([440, 554.37, 659.25], 0.15, 0.25); // A major chord
}

/**
 * Sound: Ability failed (cannot use)
 */
export function playAbilityFailed(): void {
  playBeep(200, 0.2, 0.3); // Low beep
}

/**
 * Sound: Actor selected/clicked
 */
export function playActorSelect(): void {
  playBeep(800, 0.05, 0.2); // Short high beep
}

/**
 * Sound: Trust decreased
 */
export function playTrustDecrease(): void {
  playSweep(600, 300, 0.3, 0.25); // Descending sweep
}

/**
 * Sound: Trust increased
 */
export function playTrustIncrease(): void {
  playSweep(300, 600, 0.3, 0.25); // Ascending sweep
}

/**
 * Sound: Round completed
 */
export function playRoundComplete(): void {
  playChord([523.25, 659.25, 783.99], 0.2, 0.3); // C major chord
}

/**
 * Sound: Event triggered
 */
export function playEventTriggered(): void {
  playChord([392, 494, 587.33], 0.25, 0.3); // G major chord
}

/**
 * Sound: Victory
 */
export function playVictory(): void {
  playChord([523.25, 659.25, 783.99, 1046.5], 0.4, 0.35); // C major + octave
  setTimeout(() => {
    playChord([659.25, 783.99, 1046.5], 0.5, 0.3);
  }, 200);
}

/**
 * Sound: Defeat
 */
export function playDefeat(): void {
  playChord([440, 415.3, 392], 0.5, 0.3); // Descending minor chord
}

/**
 * Sound: Actor reaction (defensive)
 */
export function playActorReaction(): void {
  playBeep(1200, 0.1, 0.2); // High alert beep
  setTimeout(() => {
    playBeep(1000, 0.1, 0.2);
  }, 100);
}

/**
 * Sound: UI interaction (button click, panel open)
 */
export function playUIClick(): void {
  playBeep(600, 0.03, 0.15); // Very short click
}

/**
 * Sound: Feature unlocked
 */
export function playFeatureUnlock(): void {
  playChord([523.25, 659.25, 783.99, 1046.5], 0.3, 0.3);
  setTimeout(() => {
    playBeep(1318.51, 0.2, 0.25); // High E
  }, 150);
}

// ============================================
// INITIALIZATION
// ============================================

// Load preferences on module load
loadAudioPreferences();

// Initialize audio context on first user interaction
let audioInitialized = false;
export function initializeAudio(): void {
  if (audioInitialized) return;

  try {
    getAudioContext();
    audioInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize audio:', error);
  }
}
