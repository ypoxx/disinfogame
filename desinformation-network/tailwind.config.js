/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trust scale
        trust: {
          low: '#EF4444',      // Red
          medium: '#EAB308',   // Yellow
          high: '#22C55E',     // Green
        },
        // Actor categories
        actor: {
          media: '#3B82F6',    // Blue
          expert: '#8B5CF6',   // Purple
          lobby: '#EC4899',    // Pink
          organization: '#14B8A6', // Teal
          defensive: '#22C55E', // Green
        },
        // UI colors
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'ripple': 'ripple 1s ease-out',
        'progress': 'progress 5s linear forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(384px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
};
