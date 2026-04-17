import { useState, useRef, useCallback } from 'react';
import { StoryModeColors } from '../theme';

// ============================================
// SOUND WORKBENCH - ElevenLabs Testing GUI
// For experimenting with voices, generating
// sound assets, and building the audio palette
// ============================================

// Pre-defined voice options (ElevenLabs standard voices)
const VOICE_PRESETS = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', lang: 'EN', desc: 'Nachrichtensprecherin' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', lang: 'EN', desc: 'Warm, freundlich' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', lang: 'EN', desc: 'Seriös, männlich' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', lang: 'EN', desc: 'Tief, markant' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', lang: 'EN', desc: 'Neutral, männlich' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', lang: 'EN', desc: 'Dynamisch' },
] as const;

// Sound categories for organizing generated audio
const SOUND_CATEGORIES = [
  { id: 'news_anchor', label: 'Nachrichtensprecher', icon: '📺' },
  { id: 'npc_voice', label: 'NPC-Stimme', icon: '👤' },
  { id: 'breaking_news', label: 'Breaking News', icon: '🔴' },
  { id: 'ambient', label: 'Atmosphäre', icon: '🎵' },
  { id: 'stinger', label: 'Stinger/Jingle', icon: '⚡' },
  { id: 'other', label: 'Sonstiges', icon: '📁' },
] as const;

// Pre-written text templates
const TEXT_TEMPLATES = [
  { label: 'Breaking News Intro', text: 'Eilmeldung! Wir unterbrechen unser Programm für eine Sondermeldung.' },
  { label: 'Nachrichtenjingle', text: 'Guten Abend, meine Damen und Herren. Hier sind die Nachrichten.' },
  { label: 'Krise', text: 'Die Lage spitzt sich zu. Unsere Quellen berichten von dramatischen Entwicklungen.' },
  { label: 'Erfolg', text: 'Operation erfolgreich abgeschlossen. Die Kampagne zeigt Wirkung.' },
  { label: 'Verrat', text: 'Achtung. Wir haben einen Verräter in unseren Reihen identifiziert.' },
  { label: 'Direktor', text: 'Genosse, die Partei erwartet Ergebnisse. Enttäuschen Sie uns nicht.' },
  { label: 'Marina', text: 'Die Social-Media-Kampagne läuft. Die Bots sind aktiv und die Hashtags trendig.' },
  { label: 'Alexei', text: 'Infrastruktur steht. Server sind online. Wir können jederzeit skalieren.' },
] as const;

type GeneratedSound = {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  category: string;
  label: string;
  audioBase64: string;
  contentType: string;
  timestamp: number;
  cacheKey: string;
};

type SoundWorkbenchProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function SoundWorkbench({ isVisible, onClose }: SoundWorkbenchProps) {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_PRESETS[0].id);
  const [category, setCategory] = useState('news_anchor');
  const [label, setLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSounds, setGeneratedSounds] = useState<GeneratedSound[]>(() => {
    try {
      const saved = localStorage.getItem('soundWorkbench_sounds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save sounds to localStorage
  const saveSounds = useCallback((sounds: GeneratedSound[]) => {
    setGeneratedSounds(sounds);
    try {
      localStorage.setItem('soundWorkbench_sounds', JSON.stringify(sounds));
    } catch {
      // Storage full - remove oldest sounds
      const trimmed = sounds.slice(-10);
      localStorage.setItem('soundWorkbench_sounds', JSON.stringify(trimmed));
    }
  }, []);

  // Generate TTS via Netlify function
  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/tts-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: selectedVoice,
          model_id: 'eleven_multilingual_v2',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const voicePreset = VOICE_PRESETS.find(v => v.id === selectedVoice);
      const newSound: GeneratedSound = {
        id: `snd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: text.trim(),
        voiceId: selectedVoice,
        voiceName: voicePreset?.name || 'Unknown',
        category,
        label: label.trim() || text.trim().slice(0, 30),
        audioBase64: data.audio_base64,
        contentType: data.content_type,
        timestamp: Date.now(),
        cacheKey: data.cache_key,
      };

      const updated = [newSound, ...generatedSounds];
      saveSounds(updated);

      // Auto-play the generated sound
      playAudio(newSound);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generierung fehlgeschlagen');
    } finally {
      setIsGenerating(false);
    }
  };

  // Play a sound
  const playAudio = useCallback((sound: GeneratedSound) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`data:${sound.contentType};base64,${sound.audioBase64}`);
    audioRef.current = audio;
    setCurrentlyPlaying(sound.id);

    audio.onended = () => setCurrentlyPlaying(null);
    audio.onerror = () => setCurrentlyPlaying(null);
    audio.play().catch(() => setCurrentlyPlaying(null));
  }, []);

  // Stop playback
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentlyPlaying(null);
  };

  // Delete a sound
  const deleteSound = (id: string) => {
    const updated = generatedSounds.filter(s => s.id !== id);
    saveSounds(updated);
    if (currentlyPlaying === id) stopPlayback();
  };

  // Download as audio file
  const downloadSound = (sound: GeneratedSound) => {
    const link = document.createElement('a');
    link.href = `data:${sound.contentType};base64,${sound.audioBase64}`;
    link.download = `${sound.label.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    link.click();
  };

  if (!isVisible) return null;

  const selectedVoicePreset = VOICE_PRESETS.find(v => v.id === selectedVoice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className="w-[900px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.agencyBlue,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-3 flex items-center justify-between border-b-4 shrink-0"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🎙️</span>
            <h2 className="font-bold text-lg" style={{ color: StoryModeColors.warning }}>
              SOUND-WERKBANK
            </h2>
            <span className="text-xs opacity-60" style={{ color: '#fff' }}>
              ElevenLabs TTS
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 font-bold text-sm border-2 hover:brightness-110 transition-all"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.borderLight,
              color: StoryModeColors.textPrimary,
            }}
          >
            ✕ SCHLIEẞEN
          </button>
        </div>

        {/* Content - two columns */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Generator */}
          <div
            className="w-1/2 p-4 flex flex-col gap-3 overflow-y-auto border-r-2"
            style={{ borderColor: StoryModeColors.border }}
          >
            {/* Text Input */}
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: StoryModeColors.textSecondary }}>
                TEXT
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Text eingeben oder Vorlage wählen..."
                className="w-full h-24 p-2 text-sm font-mono resize-none"
                style={{
                  backgroundColor: StoryModeColors.background,
                  border: `2px solid ${StoryModeColors.borderLight}`,
                  color: StoryModeColors.textPrimary,
                }}
                maxLength={500}
              />
              <div className="text-xs text-right mt-0.5" style={{ color: StoryModeColors.textMuted }}>
                {text.length}/500
              </div>
            </div>

            {/* Templates */}
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: StoryModeColors.textSecondary }}>
                VORLAGEN
              </label>
              <div className="flex flex-wrap gap-1">
                {TEXT_TEMPLATES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setText(t.text);
                      if (!label) setLabel(t.label);
                    }}
                    className="px-2 py-1 text-[10px] font-bold border hover:brightness-110 transition-all"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.borderLight,
                      color: StoryModeColors.textSecondary,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: StoryModeColors.textSecondary }}>
                STIMME
              </label>
              <div className="grid grid-cols-2 gap-1">
                {VOICE_PRESETS.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className="px-2 py-1.5 text-xs text-left border-2 transition-all"
                    style={{
                      backgroundColor: selectedVoice === v.id ? StoryModeColors.agencyBlue : StoryModeColors.background,
                      borderColor: selectedVoice === v.id ? StoryModeColors.warning : StoryModeColors.borderLight,
                      color: selectedVoice === v.id ? '#fff' : StoryModeColors.textSecondary,
                    }}
                  >
                    <div className="font-bold">{v.name}</div>
                    <div className="text-[9px] opacity-70">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Label */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold block mb-1" style={{ color: StoryModeColors.textSecondary }}>
                  KATEGORIE
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    border: `2px solid ${StoryModeColors.borderLight}`,
                    color: StoryModeColors.textPrimary,
                  }}
                >
                  {SOUND_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold block mb-1" style={{ color: StoryModeColors.textSecondary }}>
                  LABEL
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="Bezeichnung..."
                  className="w-full px-2 py-1.5 text-xs"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    border: `2px solid ${StoryModeColors.borderLight}`,
                    color: StoryModeColors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim()}
              className="w-full py-3 border-4 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              {isGenerating ? '⏳ GENERIERE...' : '🎙️ GENERIEREN'}
            </button>

            {/* Error display */}
            {error && (
              <div
                className="p-2 text-xs border-2"
                style={{
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderColor: StoryModeColors.danger,
                  color: StoryModeColors.danger,
                }}
              >
                {error}
              </div>
            )}

            {/* Info */}
            <div className="text-[10px] p-2" style={{ color: StoryModeColors.textMuted }}>
              Stimme: {selectedVoicePreset?.name} ({selectedVoicePreset?.desc})<br/>
              Modell: eleven_multilingual_v2 (Deutsch + Englisch)<br/>
              Sounds werden lokal im Browser gespeichert.
            </div>
          </div>

          {/* Right: Sound Library */}
          <div className="w-1/2 flex flex-col min-h-0">
            <div
              className="px-4 py-2 border-b-2 shrink-0 flex items-center justify-between"
              style={{
                backgroundColor: StoryModeColors.background,
                borderColor: StoryModeColors.border,
              }}
            >
              <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
                SOUND-BIBLIOTHEK ({generatedSounds.length})
              </span>
              {currentlyPlaying && (
                <button
                  onClick={stopPlayback}
                  className="px-2 py-0.5 text-[10px] font-bold border animate-pulse"
                  style={{
                    backgroundColor: StoryModeColors.sovietRed,
                    borderColor: StoryModeColors.darkRed,
                    color: '#fff',
                  }}
                >
                  ⏹ STOP
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {generatedSounds.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: StoryModeColors.textMuted }}>
                  Noch keine Sounds generiert.<br/>
                  Gib einen Text ein und klicke auf GENERIEREN.
                </div>
              ) : (
                generatedSounds.map(sound => {
                  const catInfo = SOUND_CATEGORIES.find(c => c.id === sound.category);
                  const isPlaying = currentlyPlaying === sound.id;

                  return (
                    <div
                      key={sound.id}
                      className="p-2 border-2 transition-all"
                      style={{
                        backgroundColor: isPlaying ? 'rgba(74, 157, 255, 0.1)' : StoryModeColors.background,
                        borderColor: isPlaying ? StoryModeColors.agencyBlue : StoryModeColors.borderLight,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-xs">{catInfo?.icon}</span>
                            <span className="text-[10px] font-bold" style={{ color: StoryModeColors.textPrimary }}>
                              {sound.label}
                            </span>
                            <span className="text-[9px]" style={{ color: StoryModeColors.textMuted }}>
                              ({sound.voiceName})
                            </span>
                          </div>
                          <div
                            className="text-[9px] truncate"
                            style={{ color: StoryModeColors.textMuted }}
                            title={sound.text}
                          >
                            "{sound.text}"
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => isPlaying ? stopPlayback() : playAudio(sound)}
                            className="w-7 h-7 flex items-center justify-center border text-xs font-bold hover:brightness-110"
                            style={{
                              backgroundColor: isPlaying ? StoryModeColors.sovietRed : StoryModeColors.militaryOlive,
                              borderColor: isPlaying ? StoryModeColors.darkRed : StoryModeColors.darkOlive,
                              color: '#fff',
                            }}
                          >
                            {isPlaying ? '⏹' : '▶'}
                          </button>
                          <button
                            onClick={() => downloadSound(sound)}
                            className="w-7 h-7 flex items-center justify-center border text-xs hover:brightness-110"
                            style={{
                              backgroundColor: StoryModeColors.concrete,
                              borderColor: StoryModeColors.borderLight,
                              color: StoryModeColors.textPrimary,
                            }}
                            title="Download"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => deleteSound(sound.id)}
                            className="w-7 h-7 flex items-center justify-center border text-xs hover:brightness-110"
                            style={{
                              backgroundColor: StoryModeColors.darkConcrete,
                              borderColor: StoryModeColors.borderLight,
                              color: StoryModeColors.danger,
                            }}
                            title="Löschen"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
