// Brutalist / Soviet / Intelligence Agency Color Scheme
// Inspired by: USSR aesthetics, Brutalist architecture, CIA/KGB/MI6 imagery, Imperial flags

export const StoryModeColors = {
  // Soviet Red (Communist flags, propaganda posters)
  sovietRed: '#C41E3A',
  darkRed: '#8B0000',

  // Brutalist Concrete (raw, industrial)
  concrete: '#5A5A5A',
  darkConcrete: '#3D3D3D',
  lightConcrete: '#7A7A7A',

  // Intelligence Agency Blue (CIA, FBI, official seals)
  agencyBlue: '#003366',
  darkBlue: '#1C3A70',

  // Military Olive/Green (uniforms, equipment)
  militaryOlive: '#4A5D23',
  darkOlive: '#3A4A1A',

  // Document/Paper colors (folders, files, stamps)
  document: '#C4A676',
  oldPaper: '#B8956A',

  // Accent colors
  warning: '#D4A017', // Gold/brass (medals, insignia)
  danger: '#FF4444',
  success: '#4A7023',

  // UI Base
  background: '#2A2A2A',
  surface: '#3D3D3D',
  surfaceLight: '#4A4A4A',
  border: '#1A1A1A',
  borderLight: '#555555',

  // Text
  textPrimary: '#D4D4D4',
  textSecondary: '#888888',
  textMuted: '#666666',
};

export const createBrutalistButton = (baseColor: string) => ({
  base: `bg-[${baseColor}] border-2 border-black hover:brightness-110 transition-all active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`,
});
