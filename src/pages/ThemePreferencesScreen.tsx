import React from 'react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { useTheme } from '../hooks/useTheme';
import { CheckIcon } from 'lucide-react';
export function ThemePreferencesScreen() {
  const {
    theme,
    setTheme
  } = useTheme();
  const themes = [{
    id: 'dark',
    name: 'Cyber Dark',
    color: '#0F172A'
  }, {
    id: 'neon',
    name: 'Neon Night',
    color: '#000000'
  }, {
    id: 'minimal',
    name: 'Minimal Slate',
    color: '#1E293B'
  }, {
    id: 'light',
    name: 'Clean Light',
    color: '#F1F5F9'
  }];
  return <MobileLayout title="Appearance" subtitle="Customize app theme" showBack>
      <div className="grid grid-cols-2 gap-4">
        {themes.map(t => <button key={t.id} onClick={() => setTheme(t.id as any)} className={`relative p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-neon-cyan bg-dark-800' : 'border-dark-600 bg-dark-800 hover:border-dark-500'}`}>
            <div className="w-full aspect-video rounded-lg mb-3 shadow-lg" style={{
          backgroundColor: t.color
        }}>
              {/* Preview elements */}
              <div className="p-2 space-y-2">
                <div className="w-1/2 h-2 bg-white/20 rounded" />
                <div className="w-3/4 h-2 bg-white/10 rounded" />
                <div className="flex gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/50" />
                  <div className="flex-1 h-8 rounded-lg bg-white/5" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{t.name}</span>
              {theme === t.id && <div className="w-5 h-5 rounded-full bg-neon-cyan flex items-center justify-center">
                  <CheckIcon className="w-3 h-3 text-black" />
                </div>}
            </div>
          </button>)}
      </div>
    </MobileLayout>;
}