import React, { useState } from 'react';
import { motion } from 'framer-motion';
type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};
type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills';
};
export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default'
}: TabsProps) {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  if (variant === 'pills') {
    return <div className="flex gap-2 p-1 bg-dark-800 rounded-xl">
        {tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={`
              relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium transition-colors
              ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
            `}>
            {activeTab === tab.id && <motion.div layoutId="pill-bg" className="absolute inset-0 bg-dark-600 rounded-lg" transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }} />}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>)}
      </div>;
  }
  return <div className="relative">
      <div className="flex border-b border-dark-600">
        {tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === tab.id ? 'text-neon-cyan' : 'text-slate-400 hover:text-slate-200'}
            `}>
            {tab.icon}
            {tab.label}
          </button>)}
      </div>
      <motion.div className="absolute bottom-0 h-0.5 bg-neon-cyan" initial={false} animate={{
      left: `${activeIndex / tabs.length * 100}%`,
      width: `${100 / tabs.length}%`
    }} transition={{
      type: 'spring',
      stiffness: 500,
      damping: 30
    }} />
    </div>;
}