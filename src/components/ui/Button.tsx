import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
};
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white shadow-neon-cyan hover:shadow-neon-blue',
  secondary: 'bg-transparent border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan',
  danger: 'bg-gradient-to-r from-neon-red to-neon-orange text-white shadow-neon-red',
  ghost: 'bg-transparent text-slate-300 hover:bg-dark-700 hover:text-white'
};
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5'
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  return <motion.button ref={ref} whileTap={{
    scale: 0.98
  }} whileHover={{
    scale: 1.02
  }} disabled={isDisabled} className={`
          inline-flex items-center justify-center font-medium rounded-xl
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-2 focus:ring-offset-dark-900
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `} {...props}>
        {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>}
      </motion.button>;
});
Button.displayName = 'Button';