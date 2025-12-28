import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Heatmap } from '../components/charts/Heatmap';
import { RefreshCwIcon, ExpandIcon, ClockIcon } from 'lucide-react';
// Mock heatmap data representing zones
const generateHeatmapData = () => {
  const zones = [['A1', 'A2', 'A3', 'A4'], ['B1', 'B2', 'B3', 'B4'], ['C1', 'C2', 'C3', 'C4'], ['D1', 'D2', 'D3', 'D4']];
  return zones.map(row => row.map(zone => ({
    id: zone,
    label: zone,
    value: Math.floor(Math.random() * 100),
    maxValue: 100
  })));
};
const floorOptions = [{
  id: 'floor1',
  label: 'Floor 1'
}, {
  id: 'floor2',
  label: 'Floor 2'
}, {
  id: 'floor3',
  label: 'Floor 3'
}];
export function HeatmapScreen() {
  const [activeFloor, setActiveFloor] = useState('floor1');
  const [heatmapData, setHeatmapData] = useState(generateHeatmapData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const handleRefresh = () => {
    setHeatmapData(generateHeatmapData());
    setLastUpdate(new Date());
  };
  const handleZoneClick = (cell: {
    id: string;
    value: number;
  }) => {
    setSelectedZone(cell.id);
  };
  // Calculate stats
  const allValues = heatmapData.flat().map(cell => cell.value);
  const avgDensity = Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length);
  const maxDensity = Math.max(...allValues);
  const criticalZones = allValues.filter(v => v >= 75).length;
  return <>
      <MobileLayout title="Density Heatmap" subtitle="Real-time zone monitoring" showBack rightAction={<button onClick={handleRefresh} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <RefreshCwIcon className="w-5 h-5" />
          </button>}>
        {/* Floor selector */}
        <div className="mb-4">
          <Tabs tabs={floorOptions} activeTab={activeFloor} onChange={setActiveFloor} variant="pills" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card padding="sm">
            <p className="text-xs text-slate-400 mb-1">Avg Density</p>
            <p className="text-xl font-bold text-white">{avgDensity}%</p>
          </Card>
          <Card padding="sm">
            <p className="text-xs text-slate-400 mb-1">Peak Zone</p>
            <p className="text-xl font-bold text-neon-red">{maxDensity}%</p>
          </Card>
          <Card padding="sm">
            <p className="text-xs text-slate-400 mb-1">Critical</p>
            <p className="text-xl font-bold text-neon-orange">
              {criticalZones}
            </p>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Zone Grid</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ClockIcon className="w-3 h-3" />
              <span>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
          <Heatmap data={heatmapData} cellSize="lg" onCellClick={handleZoneClick} />
        </Card>

        {/* Selected zone details */}
        {selectedZone && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }}>
            <Card variant="neon" glowColor="cyan">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">
                  Zone {selectedZone}
                </h3>
                <Badge variant={heatmapData.flat().find(c => c.id === selectedZone)!.value >= 75 ? 'danger' : heatmapData.flat().find(c => c.id === selectedZone)!.value >= 50 ? 'warning' : 'success'}>
                  {heatmapData.flat().find(c => c.id === selectedZone)!.value}
                  % Capacity
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Current Count</p>
                  <p className="text-white font-semibold">
                    {Math.round(heatmapData.flat().find(c => c.id === selectedZone)!.value * 2.5)}{' '}
                    people
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Max Capacity</p>
                  <p className="text-white font-semibold">250 people</p>
                </div>
                <div>
                  <p className="text-slate-400">Cameras</p>
                  <p className="text-white font-semibold">2 active</p>
                </div>
                <div>
                  <p className="text-slate-400">Threshold</p>
                  <p className="text-white font-semibold">200 (80%)</p>
                </div>
              </div>
            </Card>
          </motion.div>}

        {/* Floor map placeholder */}
        <Card className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Floor Plan View</h3>
            <button className="text-neon-cyan text-sm flex items-center gap-1">
              <ExpandIcon className="w-4 h-4" />
              Expand
            </button>
          </div>
          <div className="aspect-video bg-dark-700 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-500">
              <p className="text-sm">Interactive floor plan</p>
              <p className="text-xs">Tap zones for details</p>
            </div>
          </div>
        </Card>
      </MobileLayout>
      <BottomNavigation />
    </>;
}