import React, { useEffect, useState, createContext, useContext } from 'react';
type ThemeMode = 'dark' | 'light' | 'neon' | 'minimal';
type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSecondary: string;
  };
};
const themeColors: Record<ThemeMode, ThemeContextType['colors']> = {
  dark: {
    background: 'bg-dark-900',
    surface: 'bg-dark-800',
    surfaceHover: 'bg-dark-700',
    border: 'border-dark-600',
    text: 'text-white',
    textMuted: 'text-slate-400',
    accent: 'text-neon-cyan',
    accentSecondary: 'text-neon-purple'
  },
  light: {
    background: 'bg-slate-100',
    surface: 'bg-white',
    surfaceHover: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textMuted: 'text-slate-500',
    accent: 'text-blue-600',
    accentSecondary: 'text-purple-600'
  },
  neon: {
    background: 'bg-black',
    surface: 'bg-dark-900',
    surfaceHover: 'bg-dark-800',
    border: 'border-neon-cyan/30',
    text: 'text-neon-cyan',
    textMuted: 'text-neon-cyan/60',
    accent: 'text-neon-pink',
    accentSecondary: 'text-neon-purple'
  },
  minimal: {
    background: 'bg-dark-900',
    surface: 'bg-dark-800/50',
    surfaceHover: 'bg-dark-700/50',
    border: 'border-dark-700',
    text: 'text-slate-200',
    textMuted: 'text-slate-500',
    accent: 'text-slate-100',
    accentSecondary: 'text-slate-300'
  }
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({
  children
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  useEffect(() => {
    const saved = localStorage.getItem('crowd-app-theme') as ThemeMode;
    if (saved && themeColors[saved]) {
      setTheme(saved);
    }
  }, []);
  const handleSetTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('crowd-app-theme', newTheme);
  };
  return <ThemeContext.Provider value={{
    theme,
    setTheme: handleSetTheme,
    colors: themeColors[theme]
  }}>
      {children}
    </ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}