import React, { forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
};
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className = '',
  ...props
}, ref) => {
  return <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>}
        <div className="relative">
          <select ref={ref} className={`
              w-full bg-dark-800 border rounded-xl px-4 py-3 pr-10
              text-white appearance-none cursor-pointer
              transition-all duration-200
              focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30
              ${error ? 'border-neon-red' : 'border-dark-600'}
              ${className}
            `} {...props}>
            {options.map(option => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-sm text-neon-red">{error}</p>}
      </div>;
});
Select.displayName = 'Select';