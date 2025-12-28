import React from 'react';
import { motion } from 'framer-motion';
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'online' | 'offline';
type BadgeSize = 'sm' | 'md';
type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
};
const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  warning: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
  danger: 'bg-neon-red/20 text-neon-red border-neon-red/30',
  info: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
  neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  online: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  offline: 'bg-slate-500/20 text-slate-500 border-slate-500/30'
};
const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-neon-green',
  warning: 'bg-neon-yellow',
  danger: 'bg-neon-red',
  info: 'bg-neon-blue',
  neutral: 'bg-slate-500',
  online: 'bg-neon-green',
  offline: 'bg-slate-500'
};
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm'
};
export function Badge({
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  dot = false,
  children,
  className = ''
}: BadgeProps) {
  return <span className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}>
      {dot && <motion.span animate={pulse ? {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1]
    } : {}} transition={{
      duration: 1.5,
      repeat: Infinity
    }} className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>;
}