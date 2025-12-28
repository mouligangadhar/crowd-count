import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LineChart } from '../components/charts/LineChart';
import { Tabs } from '../components/ui/Tabs';
import { CameraIcon, WifiIcon, SignalIcon, ActivityIcon, ThermometerIcon, HardDriveIcon, ClockIcon, RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';
const mockCameraHealth = {
  id: 'CAM-001',
  name: 'Main Entrance',
  status: 'healthy',
  uptime: '99.8%',
  uptimeHours: 720,
  lastRestart: '30 days ago',
  metrics: {
    fps: 30,
    fpsTarget: 30,
    resolution: '1920x1080',
    bitrate: 4.2,
    bitrateMax: 8,
    latency: 12,
    packetLoss: 0.02,
    temperature: 42,
    tempMax: 80,
    storage: 65,
    storageMax: 100,
    signalStrength: 92,
    bandwidth: 15.4,
    bandwidthMax: 25
  },
  history: {
    fps: [28, 30, 29, 30, 30, 28, 30],
    latency: [15, 12, 14, 11, 12, 13, 12],
    bandwidth: [14, 15, 16, 15, 14, 15, 15.4]
  }
};
export function CameraHealthScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [{
    id: 'overview',
    label: 'Overview'
  }, {
    id: 'network',
    label: 'Network'
  }, {
    id: 'history',
    label: 'History'
  }];
  const {
    metrics,
    history
  } = mockCameraHealth;
  const getHealthColor = (value: number, max: number, inverse = false) => {
    const percentage = value / max * 100;
    if (inverse) {
      if (percentage < 50) return 'green';
      if (percentage < 80) return 'yellow';
      return 'red';
    }
    if (percentage > 80) return 'green';
    if (percentage > 50) return 'yellow';
    return 'red';
  };
  return <>
      <MobileLayout title="Camera Health" subtitle={mockCameraHealth.name} showBack rightAction={<button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <RefreshCwIcon className="w-5 h-5" />
          </button>}>
        {/* Status card */}
        <Card variant="neon" glowColor="green" className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neon-green/20">
                <CameraIcon className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {mockCameraHealth.id}
                </h3>
                <p className="text-sm text-slate-400">
                  Last restart: {mockCameraHealth.lastRestart}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success" dot pulse>
                Healthy
              </Badge>
              <p className="text-2xl font-bold text-white mt-1">
                {mockCameraHealth.uptime}
              </p>
              <p className="text-xs text-slate-400">Uptime</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
        </div>

        {activeTab === 'overview' && <div className="space-y-4">
            {/* Performance metrics */}
            <Card>
              <h3 className="font-semibold text-white mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4 text-neon-cyan" />
                    <span className="text-slate-300">Frame Rate</span>
                  </div>
                  <span className="font-mono text-white">
                    {metrics.fps} / {metrics.fpsTarget} FPS
                  </span>
                </div>
                <ProgressBar value={metrics.fps} max={metrics.fpsTarget} color={getHealthColor(metrics.fps, metrics.fpsTarget)} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDriveIcon className="w-4 h-4 text-neon-purple" />
                    <span className="text-slate-300">Bitrate</span>
                  </div>
                  <span className="font-mono text-white">
                    {metrics.bitrate} / {metrics.bitrateMax} Mbps
                  </span>
                </div>
                <ProgressBar value={metrics.bitrate} max={metrics.bitrateMax} color="purple" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-neon-blue" />
                    <span className="text-slate-300">Latency</span>
                  </div>
                  <span className="font-mono text-white">
                    {metrics.latency}ms
                  </span>
                </div>
                <ProgressBar value={metrics.latency} max={100} color={getHealthColor(metrics.latency, 100, true)} />
              </div>
            </Card>

            {/* Hardware metrics */}
            <Card>
              <h3 className="font-semibold text-white mb-4">Hardware</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ThermometerIcon className="w-4 h-4 text-neon-orange" />
                    <span className="text-sm text-slate-400">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {metrics.temperature}°C
                  </p>
                  <ProgressBar value={metrics.temperature} max={metrics.tempMax} color={getHealthColor(metrics.temperature, metrics.tempMax, true)} size="sm" />
                </div>
                <div className="p-3 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDriveIcon className="w-4 h-4 text-neon-blue" />
                    <span className="text-sm text-slate-400">Storage</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {metrics.storage}%
                  </p>
                  <ProgressBar value={metrics.storage} max={metrics.storageMax} color={getHealthColor(metrics.storage, metrics.storageMax, true)} size="sm" />
                </div>
              </div>
            </Card>
          </div>}

        {activeTab === 'network' && <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-white mb-4">5G Connection</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <SignalIcon className="w-5 h-5 text-neon-cyan" />
                    <div>
                      <p className="text-white font-medium">Signal Strength</p>
                      <p className="text-sm text-slate-400">5G NR Band n78</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neon-green">
                      {metrics.signalStrength}%
                    </p>
                    <Badge variant="success" size="sm">
                      Excellent
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <WifiIcon className="w-5 h-5 text-neon-purple" />
                    <div>
                      <p className="text-white font-medium">Bandwidth</p>
                      <p className="text-sm text-slate-400">Current usage</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {metrics.bandwidth}
                    </p>
                    <p className="text-sm text-slate-400">
                      / {metrics.bandwidthMax} Mbps
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangleIcon className="w-5 h-5 text-neon-yellow" />
                    <div>
                      <p className="text-white font-medium">Packet Loss</p>
                      <p className="text-sm text-slate-400">Last 24 hours</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neon-green">
                      {metrics.packetLoss}%
                    </p>
                    <Badge variant="success" size="sm">
                      Normal
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4">Bandwidth Usage</h3>
              <LineChart data={history.bandwidth.map((v, i) => ({
            name: `${i}h`,
            value: v
          }))} height={150} color="#A855F7" />
            </Card>
          </div>}

        {activeTab === 'history' && <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-white mb-4">
                FPS History (24h)
              </h3>
              <LineChart data={history.fps.map((v, i) => ({
            name: `${i * 4}h`,
            value: v
          }))} height={150} color="#06B6D4" />
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4">
                Latency History (24h)
              </h3>
              <LineChart data={history.latency.map((v, i) => ({
            name: `${i * 4}h`,
            value: v
          }))} height={150} color="#F59E0B" />
            </Card>

            <Card>
              <h3 className="font-semibold text-white mb-4">Recent Events</h3>
              <div className="space-y-2">
                {[{
              time: '2 hours ago',
              event: 'Frame rate stabilized',
              type: 'success'
            }, {
              time: '6 hours ago',
              event: 'Brief signal fluctuation',
              type: 'warning'
            }, {
              time: '1 day ago',
              event: 'Firmware updated',
              type: 'info'
            }, {
              time: '3 days ago',
              event: 'Camera restarted',
              type: 'info'
            }].map((event, i) => <div key={i} className="flex items-center gap-3 p-2 bg-dark-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${event.type === 'success' ? 'bg-neon-green' : event.type === 'warning' ? 'bg-neon-yellow' : 'bg-neon-blue'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{event.event}</p>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  </div>)}
              </div>
            </Card>
          </div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}