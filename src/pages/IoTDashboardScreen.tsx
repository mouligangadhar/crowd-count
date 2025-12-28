import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThermometerIcon, ActivityIcon, WindIcon, AlertTriangleIcon, WifiIcon, BatteryIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
type SensorType = 'temperature' | 'motion' | 'smoke' | 'vibration';
type Sensor = {
  id: string;
  name: string;
  type: SensorType;
  zone: string;
  status: 'online' | 'offline' | 'warning';
  value: number | string;
  unit: string;
  battery: number;
  lastUpdate: string;
};
const mockSensors: Sensor[] = [{
  id: 'TEMP-001',
  name: 'Main Hall Temp',
  type: 'temperature',
  zone: 'Zone A',
  status: 'online',
  value: 23.5,
  unit: '°C',
  battery: 85,
  lastUpdate: '1 min ago'
}, {
  id: 'TEMP-002',
  name: 'Food Court Temp',
  type: 'temperature',
  zone: 'Zone B',
  status: 'online',
  value: 24.2,
  unit: '°C',
  battery: 72,
  lastUpdate: '2 min ago'
}, {
  id: 'MOT-001',
  name: 'Entrance Motion',
  type: 'motion',
  zone: 'Zone A',
  status: 'online',
  value: 'Active',
  unit: '',
  battery: 90,
  lastUpdate: '30 sec ago'
}, {
  id: 'MOT-002',
  name: 'Parking Motion',
  type: 'motion',
  zone: 'Zone D',
  status: 'warning',
  value: 'Triggered',
  unit: '',
  battery: 45,
  lastUpdate: '5 min ago'
}, {
  id: 'SMK-001',
  name: 'Kitchen Smoke',
  type: 'smoke',
  zone: 'Zone B',
  status: 'online',
  value: 'Normal',
  unit: '',
  battery: 95,
  lastUpdate: '1 min ago'
}, {
  id: 'SMK-002',
  name: 'Storage Smoke',
  type: 'smoke',
  zone: 'Zone C',
  status: 'offline',
  value: 'N/A',
  unit: '',
  battery: 0,
  lastUpdate: '2 hours ago'
}, {
  id: 'VIB-001',
  name: 'Floor Vibration',
  type: 'vibration',
  zone: 'Zone E',
  status: 'online',
  value: 0.2,
  unit: 'g',
  battery: 78,
  lastUpdate: '1 min ago'
}];
const sensorIcons: Record<SensorType, React.ReactNode> = {
  temperature: <ThermometerIcon className="w-5 h-5" />,
  motion: <ActivityIcon className="w-5 h-5" />,
  smoke: <WindIcon className="w-5 h-5" />,
  vibration: <AlertTriangleIcon className="w-5 h-5" />
};
const sensorColors: Record<SensorType, string> = {
  temperature: 'text-neon-orange bg-neon-orange/20',
  motion: 'text-neon-cyan bg-neon-cyan/20',
  smoke: 'text-neon-purple bg-neon-purple/20',
  vibration: 'text-neon-yellow bg-neon-yellow/20'
};
export function IoTDashboardScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const filterTabs = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'temperature',
    label: 'Temp'
  }, {
    id: 'motion',
    label: 'Motion'
  }, {
    id: 'smoke',
    label: 'Smoke'
  }];
  const filteredSensors = mockSensors.filter(sensor => {
    if (filter === 'all') return true;
    return sensor.type === filter;
  });
  const onlineCount = mockSensors.filter(s => s.status === 'online').length;
  const warningCount = mockSensors.filter(s => s.status === 'warning').length;
  const offlineCount = mockSensors.filter(s => s.status === 'offline').length;
  return <>
      <MobileLayout title="IoT Sensors" subtitle={`${onlineCount} online • ${warningCount} warnings`} rightAction={<div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
              <RefreshCwIcon className="w-5 h-5" />
            </button>
            <Button size="sm" icon={<PlusIcon className="w-4 h-4" />}>
              Add
            </Button>
          </div>}>
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-green">
                {onlineCount}
              </p>
              <p className="text-xs text-slate-400">Online</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-neon-yellow">
                {warningCount}
              </p>
              <p className="text-xs text-slate-400">Warning</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-500">
                {offlineCount}
              </p>
              <p className="text-xs text-slate-400">Offline</p>
            </div>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="mb-4">
          <Tabs tabs={filterTabs} activeTab={filter} onChange={setFilter} variant="pills" />
        </div>

        {/* Sensor grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredSensors.map((sensor, index) => <motion.button key={sensor.id} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.05
        }} onClick={() => navigate(`/sensor/${sensor.id}`)} className="text-left">
              <Card padding="sm" className={`h-full ${sensor.status === 'warning' ? 'border-neon-yellow/50' : sensor.status === 'offline' ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${sensorColors[sensor.type]}`}>
                    {sensorIcons[sensor.type]}
                  </div>
                  <Badge variant={sensor.status === 'online' ? 'success' : sensor.status === 'warning' ? 'warning' : 'offline'} size="sm" dot>
                    {sensor.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-white text-sm mb-1 truncate">
                  {sensor.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{sensor.zone}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">
                    {sensor.value}
                  </span>
                  <span className="text-sm text-slate-400">{sensor.unit}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-600">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <BatteryIcon className="w-3 h-3" />
                    <span>{sensor.battery}%</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {sensor.lastUpdate}
                  </span>
                </div>
              </Card>
            </motion.button>)}
        </div>

        {filteredSensors.length === 0 && <div className="text-center py-12">
            <p className="text-slate-400">No sensors found</p>
          </div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}