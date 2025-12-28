import React, { useState, forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? showPassword ? 'text' : 'password' : type;
  return <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>}
        <div className="relative">
          {icon && iconPosition === 'left' && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>}
          <input ref={ref} type={inputType} className={`
              w-full bg-dark-800 border rounded-xl px-4 py-3
              text-white placeholder-slate-500
              transition-all duration-200
              focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30
              ${error ? 'border-neon-red focus:border-neon-red focus:ring-neon-red/30' : 'border-dark-600'}
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' || isPassword ? 'pr-10' : ''}
              ${className}
            `} {...props} />
          {isPassword && <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>}
          {icon && iconPosition === 'right' && !isPassword && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>}
        </div>
        {error && <p className="mt-1.5 text-sm text-neon-red">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-slate-500">{hint}</p>}
      </div>;
});
Input.displayName = 'Input';