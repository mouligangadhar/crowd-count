import React from 'react';
type AvatarProps = {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
};
const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};
const statusColors = {
  online: 'bg-neon-green',
  offline: 'bg-slate-500',
  busy: 'bg-neon-red'
};
const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4'
};
export function Avatar({
  src,
  name,
  size = 'md',
  status
}: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return <div className="relative inline-block">
      {src ? <img src={src} alt={name} className={`${sizeStyles[size]} rounded-full object-cover ring-2 ring-dark-600`} /> : <div className={`${sizeStyles[size]} rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-semibold text-white ring-2 ring-dark-600`}>
          {initials}
        </div>}
      {status && <span className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-dark-800`} />}
    </div>;
}