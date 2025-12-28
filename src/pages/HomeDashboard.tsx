import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UsersIcon, AlertTriangleIcon, CameraIcon, ActivityIcon, MapPinIcon, BellIcon, ChevronRightIcon, WifiIcon, TrendingUpIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
// Mock data
const mockCrowdData = [{
  name: '6AM',
  value: 120
}, {
  name: '8AM',
  value: 450
}, {
  name: '10AM',
  value: 780
}, {
  name: '12PM',
  value: 1250
}, {
  name: '2PM',
  value: 980
}, {
  name: '4PM',
  value: 1100
}, {
  name: 'Now',
  value: 847
}];
const mockCameras = [{
  id: 1,
  name: 'Main Entrance',
  status: 'online',
  count: 234,
  thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&h=150&fit=crop'
}, {
  id: 2,
  name: 'Food Court',
  status: 'online',
  count: 156,
  thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop'
}, {
  id: 3,
  name: 'Parking A',
  status: 'online',
  count: 89,
  thumbnail: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200&h=150&fit=crop'
}, {
  id: 4,
  name: 'Exit Gate',
  status: 'offline',
  count: 0,
  thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=150&fit=crop'
}];
const mockAlerts = [{
  id: 1,
  type: 'critical',
  message: 'High density at Main Entrance',
  time: '2 min ago',
  zone: 'Zone A'
}, {
  id: 2,
  type: 'warning',
  message: 'Approaching threshold at Food Court',
  time: '15 min ago',
  zone: 'Zone B'
}, {
  id: 3,
  type: 'info',
  message: 'Camera 3 reconnected',
  time: '1 hour ago',
  zone: 'System'
}];
export function HomeDashboard() {
  const navigate = useNavigate();
  const [currentCount, setCurrentCount] = useState(847);
  const [time, setTime] = useState(new Date());
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCount(prev => prev + Math.floor(Math.random() * 10) - 5);
      setTime(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <>
      <MobileLayout noPadding>
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">CrowdVision</h1>
              <p className="text-sm text-slate-400">
                {time.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" dot pulse>
                5G Connected
              </Badge>
              <motion.button whileTap={{
              scale: 0.95
            }} onClick={() => navigate('/alerts')} className="relative p-2 rounded-xl bg-dark-700 text-slate-400 hover:text-white">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />
              </motion.button>
            </div>
          </div>

          {/* Main stat */}
          <Card variant="neon" glowColor="cyan" className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">
                  Current Crowd Count
                </p>
                <motion.div key={currentCount} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gradient">
                    {currentCount.toLocaleString()}
                  </span>
                  <span className="text-slate-400">people</span>
                </motion.div>
                <div className="flex items-center gap-1 mt-2 text-neon-green text-sm">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span>12% from yesterday</span>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-neon-cyan/30">
                <UsersIcon className="w-10 h-10 text-neon-cyan" />
              </div>
            </div>
          </Card>
        </div>

        {/* Stats row */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          <StatCard label="Active Cameras" value={12} icon={<CameraIcon className="w-5 h-5" />} iconColor="blue" compact />
          <StatCard label="Active Alerts" value={3} icon={<AlertTriangleIcon className="w-5 h-5" />} iconColor="red" compact />
        </div>

        {/* Crowd trend chart */}
        <div className="px-4 mb-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Today's Trend</h2>
              <button onClick={() => navigate('/analytics')} className="text-sm text-neon-cyan flex items-center gap-1">
                View All <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            <LineChart data={mockCrowdData} height={150} />
          </Card>
        </div>

        {/* Camera grid */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Live Cameras</h2>
            <button onClick={() => navigate('/cameras')} className="text-sm text-neon-cyan flex items-center gap-1">
              View All <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockCameras.map((camera, index) => <motion.button key={camera.id} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: index * 0.1
          }} onClick={() => navigate(`/camera/${camera.id}`)} className="relative rounded-xl overflow-hidden aspect-video bg-dark-700">
                <img src={camera.thumbnail} alt={camera.name} className={`w-full h-full object-cover ${camera.status === 'offline' ? 'opacity-50 grayscale' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white font-medium truncate">
                      {camera.name}
                    </span>
                    <Badge variant={camera.status === 'online' ? 'online' : 'offline'} size="sm" dot>
                      {camera.status === 'online' ? camera.count : 'Off'}
                    </Badge>
                  </div>
                </div>
                {camera.status === 'online' && <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 text-[10px] bg-neon-red/80 text-white px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </div>}
              </motion.button>)}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">Recent Alerts</h2>
            <button onClick={() => navigate('/alerts')} className="text-sm text-neon-cyan flex items-center gap-1">
              View All <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {mockAlerts.map((alert, index) => <motion.div key={alert.id} initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.1
          }}>
                <Card padding="sm" className={alert.type === 'critical' ? 'pulse-critical' : ''}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${alert.type === 'critical' ? 'bg-neon-red/20 text-neon-red' : alert.type === 'warning' ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-neon-blue/20 text-neon-blue'}`}>
                      <AlertTriangleIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {alert.time}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {alert.zone}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>;
}