import React from 'react';
import { motion } from 'framer-motion';
type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'cyan' | 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
};
const colorStyles = {
  cyan: 'bg-neon-cyan',
  purple: 'bg-neon-purple',
  blue: 'bg-neon-blue',
  green: 'bg-neon-green',
  red: 'bg-neon-red',
  yellow: 'bg-neon-yellow',
  gradient: 'bg-gradient-to-r from-neon-cyan to-neon-purple'
};
const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3'
};
export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'cyan',
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min(value / max * 100, 100);
  return <div className="w-full">
      {(label || showValue) && <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-slate-400">{label}</span>}
          {showValue && <span className="text-sm font-mono text-slate-300">
              {value}/{max}
            </span>}
        </div>}
      <div className={`w-full bg-dark-600 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div initial={{
        width: 0
      }} animate={{
        width: `${percentage}%`
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }} className={`h-full rounded-full ${colorStyles[color]}`} />
      </div>
    </div>;
}