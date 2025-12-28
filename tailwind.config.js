
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        dark: {
          900: '#020617',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        // Neon accents
        neon: {
          cyan: '#06B6D4',
          purple: '#A855F7',
          blue: '#3B82F6',
          pink: '#EC4899',
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
          orange: '#F97316',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow': '0 0 40px rgba(6, 182, 212, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
