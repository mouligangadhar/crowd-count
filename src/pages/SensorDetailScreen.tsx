import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ThermometerIcon, BatteryIcon, WifiIcon, MapPinIcon, ClockIcon, SettingsIcon, BellIcon, RefreshCwIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LineChart } from '../components/charts/LineChart';
import { Tabs } from '../components/ui/Tabs';
import { Toggle } from '../components/ui/Toggle';
const mockSensorData = {
  id: 'TEMP-001',
  name: 'Main Hall Temperature',
  type: 'temperature',
  zone: 'Zone A - Main Entrance',
  status: 'online',
  value: 23.5,
  unit: '°C',
  battery: 85,
  signal: 92,
  lastUpdate: '1 min ago',
  firmware: 'v2.1.4',
  installDate: 'Jan 15, 2024',
  history: [{
    name: '6AM',
    value: 21.2
  }, {
    name: '9AM',
    value: 22.5
  }, {
    name: '12PM',
    value: 24.1
  }, {
    name: '3PM',
    value: 25.3
  }, {
    name: '6PM',
    value: 24.8
  }, {
    name: '9PM',
    value: 23.5
  }],
  alerts: {
    highTemp: true,
    lowTemp: true,
    batteryLow: true,
    offline: true,
    highThreshold: 30,
    lowThreshold: 15
  },
  logs: [{
    time: '10:30 AM',
    event: 'Temperature reading: 23.5°C',
    type: 'info'
  }, {
    time: '10:00 AM',
    event: 'Temperature reading: 23.2°C',
    type: 'info'
  }, {
    time: '9:30 AM',
    event: 'Temperature reading: 22.8°C',
    type: 'info'
  }, {
    time: '9:00 AM',
    event: 'High temperature alert cleared',
    type: 'success'
  }, {
    time: '8:30 AM',
    event: 'High temperature alert: 26.5°C',
    type: 'warning'
  }]
};
export function SensorDetailScreen() {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [{
    id: 'overview',
    label: 'Overview'
  }, {
    id: 'history',
    label: 'History'
  }, {
    id: 'settings',
    label: 'Settings'
  }];
  return <MobileLayout title={mockSensorData.name} subtitle={mockSensorData.id} showBack rightAction={<button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
          <RefreshCwIcon className="w-5 h-5" />
        </button>}>
      {/* Current value card */}
      <Card variant="neon" glowColor="cyan" className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Current Reading</p>
            <div className="flex items-baseline gap-2">
              <motion.span key={mockSensorData.value} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="text-5xl font-bold text-white">
                {mockSensorData.value}
              </motion.span>
              <span className="text-2xl text-slate-400">
                {mockSensorData.unit}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Updated {mockSensorData.lastUpdate}
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-orange/20 to-neon-red/20 flex items-center justify-center border border-neon-orange/30">
            <ThermometerIcon className="w-10 h-10 text-neon-orange" />
          </div>
        </div>
      </Card>

      {/* Status badges */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Badge variant="success" dot>
          Online
        </Badge>
        <Badge variant="info">
          <BatteryIcon className="w-3 h-3 mr-1" />
          {mockSensorData.battery}%
        </Badge>
        <Badge variant="info">
          <WifiIcon className="w-3 h-3 mr-1" />
          {mockSensorData.signal}%
        </Badge>
        <Badge variant="neutral">
          <MapPinIcon className="w-3 h-3 mr-1" />
          {mockSensorData.zone.split(' - ')[0]}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />
      </div>

      {activeTab === 'overview' && <div className="space-y-4">
          {/* Mini chart */}
          <Card>
            <h3 className="font-semibold text-white mb-4">Today's Trend</h3>
            <LineChart data={mockSensorData.history} height={150} color="#F97316" />
          </Card>

          {/* Device info */}
          <Card>
            <h3 className="font-semibold text-white mb-4">
              Device Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location</span>
                <span className="text-white">{mockSensorData.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Firmware</span>
                <span className="text-white">{mockSensorData.firmware}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Installed</span>
                <span className="text-white">{mockSensorData.installDate}</span>
              </div>
            </div>
          </Card>
        </div>}

      {activeTab === 'history' && <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-white mb-4">
              Temperature History (24h)
            </h3>
            <LineChart data={mockSensorData.history} height={200} color="#F97316" />
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Event Log</h3>
            <div className="space-y-4">
              {mockSensorData.logs.map((log, i) => <div key={i} className="flex items-start gap-3 pb-3 border-b border-dark-600 last:border-0 last:pb-0">
                  <div className={`mt-1 w-2 h-2 rounded-full ${log.type === 'warning' ? 'bg-neon-yellow' : log.type === 'success' ? 'bg-neon-green' : 'bg-neon-blue'}`} />
                  <div>
                    <p className="text-sm text-white">{log.event}</p>
                    <p className="text-xs text-slate-500">{log.time}</p>
                  </div>
                </div>)}
            </div>
          </Card>
        </div>}

      {activeTab === 'settings' && <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-white mb-4">
              Alert Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">High Temperature</p>
                  <p className="text-sm text-slate-400">
                    Alert above {mockSensorData.alerts.highThreshold}°C
                  </p>
                </div>
                <Toggle checked={mockSensorData.alerts.highTemp} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Low Temperature</p>
                  <p className="text-sm text-slate-400">
                    Alert below {mockSensorData.alerts.lowThreshold}°C
                  </p>
                </div>
                <Toggle checked={mockSensorData.alerts.lowTemp} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Low Battery</p>
                  <p className="text-sm text-slate-400">Alert below 15%</p>
                </div>
                <Toggle checked={mockSensorData.alerts.batteryLow} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Offline Status</p>
                  <p className="text-sm text-slate-400">
                    Alert when disconnected
                  </p>
                </div>
                <Toggle checked={mockSensorData.alerts.offline} onChange={() => {}} />
              </div>
            </div>
          </Card>

          <Button variant="danger" fullWidth>
            Remove Sensor
          </Button>
        </div>}
    </MobileLayout>;
}