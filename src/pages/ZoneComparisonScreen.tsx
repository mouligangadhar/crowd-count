import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { Tabs } from '../components/ui/Tabs';
import { CheckIcon, PlusIcon } from 'lucide-react';
type Zone = {
  id: string;
  name: string;
  currentCount: number;
  maxCapacity: number;
  density: number;
  trend: number[];
  color: string;
};
const mockZones: Zone[] = [{
  id: 'A',
  name: 'Main Entrance',
  currentCount: 212,
  maxCapacity: 250,
  density: 85,
  trend: [120, 180, 210, 190, 212],
  color: '#06B6D4'
}, {
  id: 'B',
  name: 'Food Court',
  currentCount: 162,
  maxCapacity: 250,
  density: 65,
  trend: [80, 120, 150, 170, 162],
  color: '#A855F7'
}, {
  id: 'C',
  name: 'Retail Area',
  currentCount: 112,
  maxCapacity: 250,
  density: 45,
  trend: [60, 90, 100, 120, 112],
  color: '#3B82F6'
}, {
  id: 'D',
  name: 'Parking',
  currentCount: 75,
  maxCapacity: 250,
  density: 30,
  trend: [40, 60, 80, 70, 75],
  color: '#10B981'
}, {
  id: 'E',
  name: 'Event Hall',
  currentCount: 230,
  maxCapacity: 250,
  density: 92,
  trend: [150, 200, 220, 240, 230],
  color: '#EF4444'
}];
export function ZoneComparisonScreen() {
  const [selectedZones, setSelectedZones] = useState<string[]>(['A', 'B', 'E']);
  const [viewMode, setViewMode] = useState('bar');
  const viewTabs = [{
    id: 'bar',
    label: 'Bar Chart'
  }, {
    id: 'trend',
    label: 'Trend'
  }];
  const toggleZone = (id: string) => {
    setSelectedZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : prev.length < 4 ? [...prev, id] : prev);
  };
  const selectedZoneData = mockZones.filter(z => selectedZones.includes(z.id));
  const barChartData = selectedZoneData.map(zone => ({
    name: zone.id,
    value: zone.density,
    color: zone.color
  }));
  const trendChartData = ['1h', '2h', '3h', '4h', 'Now'].map((time, i) => ({
    name: time,
    value: selectedZoneData[0]?.trend[i] || 0,
    value2: selectedZoneData[1]?.trend[i]
  }));
  return <>
      <MobileLayout title="Zone Comparison" subtitle="Compare density across zones" showBack>
        {/* Zone selector */}
        <Card className="mb-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Select zones to compare (max 4)
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockZones.map(zone => {
            const isSelected = selectedZones.includes(zone.id);
            return <motion.button key={zone.id} whileTap={{
              scale: 0.95
            }} onClick={() => toggleZone(zone.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${isSelected ? 'border-neon-cyan bg-neon-cyan/10' : 'border-dark-600 bg-dark-700 hover:border-dark-500'}`}>
                  <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: zone.color
              }} />
                  <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                    {zone.name}
                  </span>
                  {isSelected && <CheckIcon className="w-4 h-4 text-neon-cyan" />}
                </motion.button>;
          })}
          </div>
        </Card>

        {/* View mode tabs */}
        <div className="mb-4">
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={setViewMode} variant="pills" />
        </div>

        {/* Chart */}
        <Card className="mb-4">
          <h3 className="font-semibold text-white mb-4">
            {viewMode === 'bar' ? 'Current Density' : 'Density Trend'}
          </h3>
          {viewMode === 'bar' ? <BarChart data={barChartData} height={200} /> : <LineChart data={trendChartData} height={200} color={selectedZoneData[0]?.color} secondaryColor={selectedZoneData[1]?.color} />}
        </Card>

        {/* Detailed comparison */}
        <h3 className="font-semibold text-white mb-3">Detailed Comparison</h3>
        <div className="space-y-3">
          {selectedZoneData.map((zone, index) => <motion.div key={zone.id} initial={{
          opacity: 0,
          x: -10
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }}>
              <Card>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{
                backgroundColor: zone.color
              }} />
                  <span className="font-semibold text-white">{zone.name}</span>
                  <Badge variant={zone.density >= 80 ? 'danger' : zone.density >= 60 ? 'warning' : 'success'}>
                    {zone.density}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-white">
                      {zone.currentCount}
                    </p>
                    <p className="text-xs text-slate-400">Current</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {zone.maxCapacity}
                    </p>
                    <p className="text-xs text-slate-400">Capacity</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      {zone.maxCapacity - zone.currentCount}
                    </p>
                    <p className="text-xs text-slate-400">Available</p>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className="mt-3 h-2 bg-dark-600 rounded-full overflow-hidden">
                  <motion.div initial={{
                width: 0
              }} animate={{
                width: `${zone.density}%`
              }} transition={{
                duration: 0.8,
                delay: index * 0.2
              }} className="h-full rounded-full" style={{
                backgroundColor: zone.color
              }} />
                </div>
              </Card>
            </motion.div>)}
        </div>

        {selectedZones.length === 0 && <div className="text-center py-12">
            <p className="text-slate-400">Select zones to compare</p>
          </div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}