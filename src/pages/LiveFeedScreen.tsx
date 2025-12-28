import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MaximizeIcon, SettingsIcon, Volume2Icon, VolumeXIcon, CameraIcon, UsersIcon, AlertTriangleIcon, ActivityIcon, ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
export function LiveFeedScreen() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const [muted, setMuted] = useState(true);
  const [count, setCount] = useState(234);
  const [density, setDensity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [showControls, setShowControls] = useState(true);
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = count + Math.floor(Math.random() * 6) - 3;
      setCount(Math.max(0, newCount));
      if (newCount < 100) setDensity('low');else if (newCount < 200) setDensity('medium');else if (newCount < 300) setDensity('high');else setDensity('critical');
    }, 2000);
    return () => clearInterval(interval);
  }, [count]);
  const densityColors = {
    low: {
      bg: 'bg-neon-green',
      text: 'text-neon-green',
      label: 'Low Density'
    },
    medium: {
      bg: 'bg-neon-yellow',
      text: 'text-neon-yellow',
      label: 'Medium Density'
    },
    high: {
      bg: 'bg-neon-orange',
      text: 'text-neon-orange',
      label: 'High Density'
    },
    critical: {
      bg: 'bg-neon-red',
      text: 'text-neon-red',
      label: 'Critical!'
    }
  };
  return <div className="min-h-screen bg-black flex flex-col">
      {/* Video container */}
      <div className="relative flex-1 bg-dark-900" onClick={() => setShowControls(!showControls)}>
        {/* Simulated video feed with AI detection overlay */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop" alt="Camera feed" className="w-full h-full object-cover" />

          {/* AI Detection boxes overlay */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Simulated bounding boxes */}
            {[{
            x: 15,
            y: 30,
            w: 8,
            h: 20
          }, {
            x: 28,
            y: 35,
            w: 7,
            h: 18
          }, {
            x: 42,
            y: 32,
            w: 8,
            h: 22
          }, {
            x: 55,
            y: 38,
            w: 6,
            h: 16
          }, {
            x: 68,
            y: 28,
            w: 9,
            h: 24
          }, {
            x: 78,
            y: 40,
            w: 7,
            h: 18
          }, {
            x: 35,
            y: 55,
            w: 8,
            h: 20
          }, {
            x: 50,
            y: 58,
            w: 7,
            h: 18
          }, {
            x: 62,
            y: 52,
            w: 8,
            h: 22
          }].map((box, i) => <motion.rect key={i} x={`${box.x}%`} y={`${box.y}%`} width={`${box.w}%`} height={`${box.h}%`} fill="none" stroke="#06B6D4" strokeWidth="0.3" initial={{
            opacity: 0
          }} animate={{
            opacity: [0.5, 1, 0.5]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }} />)}
          </svg>

          {/* Scan line effect */}
          <motion.div animate={{
          y: ['0%', '100%']
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }} className="absolute inset-x-0 h-1 bg-gradient-to-b from-neon-cyan/30 to-transparent pointer-events-none" />
        </div>

        {/* Top controls */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: showControls ? 1 : 0,
        y: showControls ? 0 : -20
      }} className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <button onClick={e => {
            e.stopPropagation();
            navigate(-1);
          }} className="p-2 rounded-xl bg-black/50 text-white">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="danger" dot pulse>
                LIVE
              </Badge>
              <span className="text-white font-medium">Main Entrance</span>
            </div>
            <button onClick={e => {
            e.stopPropagation();
            navigate('/camera/settings');
          }} className="p-2 rounded-xl bg-black/50 text-white">
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Real-time counter overlay */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="absolute top-20 right-4">
          <Card variant="glass" padding="sm" className="min-w-[100px]">
            <div className="text-center">
              <motion.span key={count} initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="text-3xl font-bold text-white block">
                {count}
              </motion.span>
              <span className="text-xs text-slate-400">People Detected</span>
            </div>
          </Card>
        </motion.div>

        {/* Density indicator */}
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="absolute top-20 left-4">
          <Card variant="glass" padding="sm" className={density === 'critical' ? 'pulse-critical' : ''}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${densityColors[density].bg}`} />
              <span className={`text-sm font-medium ${densityColors[density].text}`}>
                {densityColors[density].label}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Bottom controls */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: showControls ? 1 : 0,
        y: showControls ? 0 : 20
      }} className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={e => e.stopPropagation()} className="p-3 rounded-xl bg-dark-800/80 text-white hover:bg-dark-700">
              <ZoomOutIcon className="w-5 h-5" />
            </button>
            <button onClick={e => e.stopPropagation()} className="p-3 rounded-xl bg-dark-800/80 text-white hover:bg-dark-700">
              <ZoomInIcon className="w-5 h-5" />
            </button>
            <button onClick={e => {
            e.stopPropagation();
            setMuted(!muted);
          }} className="p-3 rounded-xl bg-dark-800/80 text-white hover:bg-dark-700">
              {muted ? <VolumeXIcon className="w-5 h-5" /> : <Volume2Icon className="w-5 h-5" />}
            </button>
            <button onClick={e => e.stopPropagation()} className="p-3 rounded-xl bg-dark-800/80 text-white hover:bg-dark-700">
              <RotateCcwIcon className="w-5 h-5" />
            </button>
            <button onClick={e => e.stopPropagation()} className="p-3 rounded-xl bg-dark-800/80 text-white hover:bg-dark-700">
              <MaximizeIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card variant="glass" padding="sm">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-neon-cyan" />
                <div>
                  <p className="text-xs text-slate-400">FPS</p>
                  <p className="text-sm font-semibold text-white">30</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" padding="sm">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-4 h-4 text-neon-purple" />
                <div>
                  <p className="text-xs text-slate-400">Quality</p>
                  <p className="text-sm font-semibold text-white">1080p</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" padding="sm">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-4 h-4 text-neon-yellow" />
                <div>
                  <p className="text-xs text-slate-400">Alerts</p>
                  <p className="text-sm font-semibold text-white">2</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>;
}