import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WifiIcon, SignalIcon, CpuIcon, ScanLineIcon } from 'lucide-react';
export function SplashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [setTimeout(() => setStage(1), 500), setTimeout(() => setStage(2), 1200), setTimeout(() => setStage(3), 2000), setTimeout(() => navigate('/login'), 3500)];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);
  return <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-cyan/10 via-transparent to-transparent" />

      {/* Scanning line effect */}
      <motion.div initial={{
      y: '-100%'
    }} animate={{
      y: '200%'
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }} className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container */}
        <motion.div initial={{
        scale: 0,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        duration: 0.5,
        ease: 'easeOut'
      }} className="relative mb-8">
          {/* Outer ring */}
          <motion.div animate={{
          rotate: 360
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }} className="absolute inset-0 w-32 h-32 rounded-full border-2 border-neon-cyan/30" style={{
          borderStyle: 'dashed'
        }} />

          {/* Inner ring */}
          <motion.div animate={{
          rotate: -360
        }} transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }} className="absolute inset-2 w-28 h-28 rounded-full border border-neon-purple/40" />

          {/* Center icon */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-neon-cyan/50 shadow-neon-cyan">
            <motion.div animate={{
            scale: [1, 1.1, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }}>
              <ScanLineIcon className="w-12 h-12 text-neon-cyan" />
            </motion.div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map(i => <motion.div key={i} animate={{
          rotate: 360
        }} transition={{
          duration: 3 + i,
          repeat: Infinity,
          ease: 'linear'
        }} className="absolute inset-0" style={{
          transformOrigin: 'center'
        }}>
              <div className="absolute w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan" style={{
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)'
          }} />
            </motion.div>)}
        </motion.div>

        {/* App name */}
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: stage >= 1 ? 1 : 0,
        y: stage >= 1 ? 0 : 20
      }} transition={{
        duration: 0.5
      }} className="text-2xl font-bold text-white mb-2 text-center">
          <span className="text-gradient">CrowdVision</span>
        </motion.h1>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: stage >= 1 ? 1 : 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="text-slate-400 text-sm mb-8 text-center">
          5G Real-Time Crowd Intelligence
        </motion.p>

        {/* Status indicators */}
        <AnimatePresence>
          {stage >= 2 && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0
        }} className="flex items-center gap-6">
              <StatusIndicator icon={<SignalIcon className="w-4 h-4" />} label="5G" active={stage >= 2} delay={0} />
              <StatusIndicator icon={<CpuIcon className="w-4 h-4" />} label="AI" active={stage >= 2} delay={0.2} />
              <StatusIndicator icon={<WifiIcon className="w-4 h-4" />} label="IoT" active={stage >= 3} delay={0.4} />
            </motion.div>}
        </AnimatePresence>

        {/* Loading bar */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: stage >= 2 ? 1 : 0
      }} className="mt-8 w-48 h-1 bg-dark-700 rounded-full overflow-hidden">
          <motion.div initial={{
          width: '0%'
        }} animate={{
          width: stage >= 3 ? '100%' : '60%'
        }} transition={{
          duration: 1.5,
          ease: 'easeInOut'
        }} className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full" />
        </motion.div>
      </div>

      {/* Bottom text */}
      <motion.p initial={{
      opacity: 0
    }} animate={{
      opacity: stage >= 3 ? 0.5 : 0
    }} className="absolute bottom-8 text-xs text-slate-500">
        Powered by AI & 5G Technology
      </motion.p>
    </div>;
}
function StatusIndicator({
  icon,
  label,
  active,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  delay: number;
}) {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.8
  }} animate={{
    opacity: active ? 1 : 0.3,
    scale: 1
  }} transition={{
    delay,
    duration: 0.3
  }} className="flex flex-col items-center gap-1">
      <div className={`p-2 rounded-lg ${active ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-dark-700 text-slate-500'}`}>
        {icon}
      </div>
      <span className={`text-xs ${active ? 'text-neon-cyan' : 'text-slate-500'}`}>
        {label}
      </span>
    </motion.div>;
}