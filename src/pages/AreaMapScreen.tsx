import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, LayersIcon, NavigationIcon, ZoomInIcon, ZoomOutIcon, LocateIcon, BuildingIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
type Zone = {
  id: string;
  name: string;
  density: number;
  count: number;
  maxCapacity: number;
  cameras: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
const mockZones: Zone[] = [{
  id: 'A',
  name: 'Main Entrance',
  density: 85,
  count: 212,
  maxCapacity: 250,
  cameras: 3,
  x: 10,
  y: 10,
  width: 35,
  height: 25
}, {
  id: 'B',
  name: 'Food Court',
  density: 65,
  count: 162,
  maxCapacity: 250,
  cameras: 4,
  x: 55,
  y: 10,
  width: 35,
  height: 25
}, {
  id: 'C',
  name: 'Retail Area',
  density: 45,
  count: 112,
  maxCapacity: 250,
  cameras: 6,
  x: 10,
  y: 45,
  width: 50,
  height: 30
}, {
  id: 'D',
  name: 'Parking',
  density: 30,
  count: 75,
  maxCapacity: 250,
  cameras: 2,
  x: 65,
  y: 45,
  width: 25,
  height: 30
}, {
  id: 'E',
  name: 'Event Hall',
  density: 92,
  count: 230,
  maxCapacity: 250,
  cameras: 4,
  x: 10,
  y: 80,
  width: 80,
  height: 15
}];
const getDensityColor = (density: number) => {
  if (density < 40) return {
    fill: 'rgba(16, 185, 129, 0.3)',
    stroke: '#10B981',
    text: 'text-neon-green'
  };
  if (density < 60) return {
    fill: 'rgba(245, 158, 11, 0.3)',
    stroke: '#F59E0B',
    text: 'text-neon-yellow'
  };
  if (density < 80) return {
    fill: 'rgba(249, 115, 22, 0.3)',
    stroke: '#F97316',
    text: 'text-neon-orange'
  };
  return {
    fill: 'rgba(239, 68, 68, 0.3)',
    stroke: '#EF4444',
    text: 'text-neon-red'
  };
};
export function AreaMapScreen() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [mapLayer, setMapLayer] = useState<'density' | 'cameras'>('density');
  return <>
      <MobileLayout title="Area Map" subtitle="GPS-based zone monitoring" showBack rightAction={<button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700">
            <LayersIcon className="w-5 h-5" />
          </button>}>
        {/* Map container */}
        <Card padding="none" className="mb-4 overflow-hidden">
          <div className="relative aspect-square bg-dark-700">
            {/* Grid background */}
            <div className="absolute inset-0 cyber-grid opacity-30" />

            {/* SVG Map */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Zones */}
              {mockZones.map(zone => {
              const colors = getDensityColor(zone.density);
              const isSelected = selectedZone?.id === zone.id;
              return <g key={zone.id}>
                    <motion.rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} fill={colors.fill} stroke={colors.stroke} strokeWidth={isSelected ? 1 : 0.5} rx={2} initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1,
                  strokeWidth: isSelected ? 1.5 : 0.5
                }} whileHover={{
                  strokeWidth: 1
                }} onClick={() => setSelectedZone(zone)} style={{
                  cursor: 'pointer'
                }} />
                    <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 2} textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">
                      {zone.id}
                    </text>
                    <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 4} textAnchor="middle" fill={colors.stroke} fontSize="3">
                      {zone.density}%
                    </text>
                  </g>;
            })}

              {/* Camera markers */}
              {mapLayer === 'cameras' && mockZones.map(zone => <circle key={`cam-${zone.id}`} cx={zone.x + zone.width / 2} cy={zone.y + 5} r={2} fill="#06B6D4" />)}
            </svg>

            {/* Map controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button className="p-2 rounded-lg bg-dark-800/80 text-white">
                <ZoomInIcon className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-dark-800/80 text-white">
                <ZoomOutIcon className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-dark-800/80 text-white">
                <LocateIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-dark-800/90 rounded-lg p-2">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-neon-green/30 border border-neon-green" />
                  <span className="text-slate-400">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-neon-yellow/30 border border-neon-yellow" />
                  <span className="text-slate-400">Med</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-neon-red/30 border border-neon-red" />
                  <span className="text-slate-400">High</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Selected zone details */}
        {selectedZone && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }}>
            <Card variant="neon" glowColor="cyan" className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-white">
                      Zone {selectedZone.id}
                    </span>
                    <Badge variant={selectedZone.density >= 80 ? 'danger' : selectedZone.density >= 60 ? 'warning' : 'success'}>
                      {selectedZone.density}%
                    </Badge>
                  </div>
                  <p className="text-slate-400">{selectedZone.name}</p>
                </div>
                <Button size="sm" onClick={() => navigate(`/zone/${selectedZone.id}`)}>
                  Details
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {selectedZone.count}
                  </p>
                  <p className="text-xs text-slate-400">Current</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {selectedZone.maxCapacity}
                  </p>
                  <p className="text-xs text-slate-400">Capacity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {selectedZone.cameras}
                  </p>
                  <p className="text-xs text-slate-400">Cameras</p>
                </div>
              </div>
            </Card>
          </motion.div>}

        {/* Zone list */}
        <h3 className="font-semibold text-white mb-3">All Zones</h3>
        <div className="space-y-2">
          {mockZones.map(zone => {
          const colors = getDensityColor(zone.density);
          return <motion.button key={zone.id} whileTap={{
            scale: 0.98
          }} onClick={() => setSelectedZone(zone)} className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedZone?.id === zone.id ? 'bg-dark-700 border-neon-cyan' : 'bg-dark-800 border-dark-600 hover:border-dark-500'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${colors.text}`} style={{
                  backgroundColor: colors.fill
                }}>
                      {zone.id}
                    </div>
                    <div>
                      <p className="font-medium text-white">{zone.name}</p>
                      <p className="text-sm text-slate-400">
                        {zone.count} / {zone.maxCapacity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {zone.density}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {zone.cameras} cams
                    </p>
                  </div>
                </div>
              </motion.button>;
        })}
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>;
}