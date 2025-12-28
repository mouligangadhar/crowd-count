import React from 'react';
import { motion } from 'framer-motion';
type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false
}: ToggleProps) {
  return <label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange(!checked)} className={`
          relative w-12 h-7 rounded-full transition-colors duration-200
          ${checked ? 'bg-neon-cyan' : 'bg-dark-600'}
          focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-dark-900
        `}>
        <motion.span animate={{
        x: checked ? 22 : 2
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
      </button>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>;
}