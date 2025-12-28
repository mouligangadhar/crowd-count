import React, { forwardRef, Component } from 'react';
import { motion } from 'framer-motion';
type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'neon' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'green' | 'red';
};
const variantStyles = {
  default: 'bg-dark-800 border border-dark-600',
  neon: 'bg-dark-800/80 border-neon',
  glass: 'bg-dark-800/40 backdrop-blur-xl border border-white/10'
};
const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};
const glowStyles = {
  cyan: 'shadow-neon-cyan',
  purple: 'shadow-neon-purple',
  blue: 'shadow-neon-blue',
  green: 'shadow-neon-green',
  red: 'shadow-neon-red'
};
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  animate = true,
  glowColor,
  children,
  className = '',
  ...props
}, ref) => {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  } : {};
  return <Component ref={ref} className={`
          rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${glowColor ? glowStyles[glowColor] : ''}
          ${className}
        `} {...animationProps} {...props}>
        {children}
      </Component>;
});
Card.displayName = 'Card';