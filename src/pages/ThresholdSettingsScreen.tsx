import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { BellIcon, AlertTriangleIcon, SaveIcon, RotateCcwIcon, MapPinIcon } from 'lucide-react';
type ZoneThreshold = {
  id: string;
  name: string;
  warningThreshold: number;
  criticalThreshold: number;
  maxCapacity: number;
  alertsEnabled: boolean;
  autoEvacuation: boolean;
};
const initialThresholds: ZoneThreshold[] = [{
  id: 'A',
  name: 'Main Entrance',
  warningThreshold: 70,
  criticalThreshold: 90,
  maxCapacity: 250,
  alertsEnabled: true,
  autoEvacuation: false
}, {
  id: 'B',
  name: 'Food Court',
  warningThreshold: 75,
  criticalThreshold: 95,
  maxCapacity: 250,
  alertsEnabled: true,
  autoEvacuation: false
}, {
  id: 'C',
  name: 'Retail Area',
  warningThreshold: 80,
  criticalThreshold: 95,
  maxCapacity: 250,
  alertsEnabled: true,
  autoEvacuation: false
}, {
  id: 'D',
  name: 'Parking',
  warningThreshold: 85,
  criticalThreshold: 95,
  maxCapacity: 250,
  alertsEnabled: false,
  autoEvacuation: false
}, {
  id: 'E',
  name: 'Event Hall',
  warningThreshold: 65,
  criticalThreshold: 85,
  maxCapacity: 250,
  alertsEnabled: true,
  autoEvacuation: true
}];
export function ThresholdSettingsScreen() {
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const updateThreshold = (id: string, field: keyof ZoneThreshold, value: number | boolean) => {
    setThresholds(prev => prev.map(t => t.id === id ? {
      ...t,
      [field]: value
    } : t));
    setHasChanges(true);
  };
  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
  };
  const handleReset = () => {
    setThresholds(initialThresholds);
    setHasChanges(false);
  };
  return <>
      <MobileLayout title="Threshold Settings" subtitle="Configure alert thresholds" showBack rightAction={hasChanges && <Button size="sm" variant="secondary" onClick={handleReset}>
              <RotateCcwIcon className="w-4 h-4" />
            </Button>}>
        {/* Global settings */}
        <Card className="mb-4">
          <h3 className="font-semibold text-white mb-4">Global Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-yellow/20">
                  <AlertTriangleIcon className="w-5 h-5 text-neon-yellow" />
                </div>
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-400">
                    Receive alerts on your device
                  </p>
                </div>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-red/20">
                  <BellIcon className="w-5 h-5 text-neon-red" />
                </div>
                <div>
                  <p className="text-white font-medium">Sound Alerts</p>
                  <p className="text-sm text-slate-400">
                    Play sound for critical alerts
                  </p>
                </div>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        </Card>

        {/* Zone thresholds */}
        <h3 className="font-semibold text-white mb-3">Zone Thresholds</h3>
        <div className="space-y-3">
          {thresholds.map((zone, index) => <motion.div key={zone.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.05
        }}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-neon-cyan" />
                    <span className="font-semibold text-white">
                      {zone.name}
                    </span>
                  </div>
                  <Toggle checked={zone.alertsEnabled} onChange={checked => updateThreshold(zone.id, 'alertsEnabled', checked)} />
                </div>

                {zone.alertsEnabled && <div className="space-y-4">
                    {/* Warning threshold */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Warning Threshold
                        </span>
                        <Badge variant="warning">
                          {zone.warningThreshold}%
                        </Badge>
                      </div>
                      <Slider value={zone.warningThreshold} onChange={value => updateThreshold(zone.id, 'warningThreshold', value)} min={50} max={zone.criticalThreshold - 5} showValue={false} />
                      <p className="text-xs text-slate-500 mt-1">
                        Alert at{' '}
                        {Math.round(zone.maxCapacity * zone.warningThreshold / 100)}{' '}
                        people
                      </p>
                    </div>

                    {/* Critical threshold */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Critical Threshold
                        </span>
                        <Badge variant="danger">
                          {zone.criticalThreshold}%
                        </Badge>
                      </div>
                      <Slider value={zone.criticalThreshold} onChange={value => updateThreshold(zone.id, 'criticalThreshold', value)} min={zone.warningThreshold + 5} max={100} showValue={false} />
                      <p className="text-xs text-slate-500 mt-1">
                        Critical at{' '}
                        {Math.round(zone.maxCapacity * zone.criticalThreshold / 100)}{' '}
                        people
                      </p>
                    </div>

                    {/* Auto evacuation */}
                    <div className="flex items-center justify-between pt-3 border-t border-dark-600">
                      <div>
                        <p className="text-sm text-white">
                          Auto Evacuation Alert
                        </p>
                        <p className="text-xs text-slate-500">
                          Trigger evacuation protocol
                        </p>
                      </div>
                      <Toggle checked={zone.autoEvacuation} onChange={checked => updateThreshold(zone.id, 'autoEvacuation', checked)} />
                    </div>
                  </div>}
              </Card>
            </motion.div>)}
        </div>

        {/* Save button */}
        {hasChanges && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
            <Button fullWidth loading={saving} onClick={handleSave} icon={<SaveIcon className="w-4 h-4" />}>
              Save Changes
            </Button>
          </motion.div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}