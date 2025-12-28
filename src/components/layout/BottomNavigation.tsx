import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, CameraIcon, BarChart3Icon, BellIcon, UserIcon } from 'lucide-react';
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};
const navItems: NavItem[] = [{
  id: 'home',
  label: 'Home',
  icon: <HomeIcon className="w-5 h-5" />,
  path: '/home'
}, {
  id: 'cameras',
  label: 'Cameras',
  icon: <CameraIcon className="w-5 h-5" />,
  path: '/cameras'
}, {
  id: 'analytics',
  label: 'Analytics',
  icon: <BarChart3Icon className="w-5 h-5" />,
  path: '/analytics'
}, {
  id: 'alerts',
  label: 'Alerts',
  icon: <BellIcon className="w-5 h-5" />,
  path: '/alerts'
}, {
  id: 'profile',
  label: 'Profile',
  icon: <UserIcon className="w-5 h-5" />,
  path: '/profile'
}];
export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur-xl border-t border-dark-700">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
          const active = isActive(item.path);
          return <motion.button key={item.id} whileTap={{
            scale: 0.95
          }} onClick={() => navigate(item.path)} className={`
                  relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                  transition-colors min-w-[64px]
                  ${active ? 'text-neon-cyan' : 'text-slate-500 hover:text-slate-300'}
                `}>
                {active && <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-neon-cyan/10 rounded-xl" transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30
            }} />}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10 text-[10px] font-medium">
                  {item.label}
                </span>
              </motion.button>;
        })}
        </div>
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-dark-800" />
    </nav>;
}