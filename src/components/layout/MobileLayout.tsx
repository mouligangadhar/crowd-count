import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
type MobileLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightAction?: ReactNode;
  headerTransparent?: boolean;
  noPadding?: boolean;
  className?: string;
};
export function MobileLayout({
  children,
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  rightAction,
  headerTransparent = false,
  noPadding = false,
  className = ''
}: MobileLayoutProps) {
  const navigate = useNavigate();
  return <div className={`min-h-screen bg-dark-900 cyber-grid ${className}`}>
      {/* Header */}
      {(title || showBack || rightAction) && <header className={`
            sticky top-0 z-40 px-4 py-4
            ${headerTransparent ? 'bg-transparent' : 'bg-dark-900/80 backdrop-blur-xl border-b border-dark-700'}
          `}>
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              {showBack && <motion.button whileTap={{
            scale: 0.95
          }} onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700 transition-colors" aria-label="Go back">
                  <ArrowLeftIcon className="w-5 h-5" />
                </motion.button>}
              <div>
                {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {rightAction}
              {showMenu && <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700 transition-colors">
                  <MoreVerticalIcon className="w-5 h-5" />
                </button>}
            </div>
          </div>
        </header>}

      {/* Content */}
      <motion.main initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className={`max-w-md mx-auto ${noPadding ? '' : 'px-4 pb-24'}`}>
        {children}
      </motion.main>
    </div>;
}